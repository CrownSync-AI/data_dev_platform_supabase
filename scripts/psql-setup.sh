#!/bin/bash

# =============================================
# PSQL Setup Script for Supabase
# Connects directly to Supabase and runs SQL
# =============================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up Campaign Performance Database via psql${NC}"

# Load environment variables
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
else
    echo -e "${RED}❌ .env.local file not found${NC}"
    exit 1
fi

# Extract Supabase connection details
SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
SUPABASE_KEY=$SUPABASE_SERVICE_ROLE_KEY

if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_KEY" ]; then
    echo -e "${RED}❌ Missing Supabase credentials in .env.local${NC}"
    echo "Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    exit 1
fi

# Extract connection details from Supabase URL
# Format: https://PROJECT_ID.supabase.co
PROJECT_ID=$(echo $SUPABASE_URL | sed 's/https:\/\/\([^.]*\).*/\1/')
HOST="db.${PROJECT_ID}.supabase.co"
PORT="5432"
DATABASE="postgres"
USERNAME="postgres"

echo -e "${YELLOW}📡 Connection Details:${NC}"
echo "Host: $HOST"
echo "Port: $PORT"
echo "Database: $DATABASE"
echo "Username: $USERNAME"
echo "Project ID: $PROJECT_ID"

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ psql is not installed${NC}"
    echo "Install PostgreSQL client:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql-client"
    echo "  Windows: Download from https://www.postgresql.org/download/"
    exit 1
fi

echo -e "${GREEN}✅ psql found${NC}"

# Create connection string
PGPASSWORD="$SUPABASE_KEY"
export PGPASSWORD

echo -e "${BLUE}🔗 Testing connection...${NC}"

# Test connection with SSL certificate
psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DATABASE" --set=sslmode=require --set=sslrootcert=prod-ca-2021.crt -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Connection successful!${NC}"
else
    echo -e "${RED}❌ Connection failed${NC}"
    echo "Please check:"
    echo "1. Your Supabase project is active"
    echo "2. Database password is correct"
    echo "3. Your IP is allowed (check Supabase dashboard > Settings > Database)"
    exit 1
fi

echo -e "${BLUE}📊 Running database setup...${NC}"

# Run the setup SQL file with SSL certificate
psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DATABASE" --set=sslmode=require --set=sslrootcert=prod-ca-2021.crt -f "supabase/simple_setup.sql"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database setup completed successfully!${NC}"
    
    # Verify data
    echo -e "${BLUE}🔍 Verifying data...${NC}"
    
    psql -h "$HOST" -p "$PORT" -U "$USERNAME" -d "$DATABASE" --set=sslmode=require --set=sslrootcert=prod-ca-2021.crt -c "
    SELECT 'Table Counts:' as info;
    SELECT 'users' as table_name, COUNT(*) as count FROM users
    UNION ALL SELECT 'campaigns', COUNT(*) FROM campaigns
    UNION ALL SELECT 'email_campaigns', COUNT(*) FROM email_campaigns
    UNION ALL SELECT 'email_sends', COUNT(*) FROM email_sends
    UNION ALL SELECT 'crm_conversions', COUNT(*) FROM crm_conversions
    UNION ALL SELECT 'ecommerce_orders', COUNT(*) FROM ecommerce_orders;
    
    SELECT 'Marco Bicego Campaign:' as info;
    SELECT 
        campaign_name,
        total_retailers,
        total_emails_sent,
        click_rate,
        roi_percentage,
        performance_tier
    FROM campaign_performance_summary 
    WHERE campaign_name = 'Marco Bicego New 2025 Campaign';
    "
    
    echo -e "${GREEN}🎉 Setup complete! Your database now contains:${NC}"
    echo "  • 15 luxury retailers + 1 brand user"
    echo "  • Marco Bicego campaign with 27,037 emails"
    echo "  • ROI: 124%, Click Rate: 3.2%"
    echo "  • CRM conversions and e-commerce orders"
    echo ""
    echo -e "${BLUE}🚀 Next steps:${NC}"
    echo "  1. Start your dev server: npm run dev"
    echo "  2. Visit: http://localhost:3000/dashboard/brand-performance/campaigns"
    
else
    echo -e "${RED}❌ Database setup failed${NC}"
    echo "Check the error messages above for details"
    exit 1
fi