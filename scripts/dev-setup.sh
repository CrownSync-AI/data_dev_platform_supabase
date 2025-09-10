#!/bin/bash

echo "🚀 Setting up CrownSync Campaign Analytics Development Environment"
echo "============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if PostgreSQL is running
print_step "Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed. Please install PostgreSQL first."
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    echo "  Windows: Download from https://www.postgresql.org/download/windows/"
    exit 1
fi

if ! pg_isready > /dev/null 2>&1; then
    print_error "PostgreSQL is not running. Please start PostgreSQL first."
    echo "  macOS: brew services start postgresql"
    echo "  Ubuntu: sudo systemctl start postgresql"
    exit 1
fi

print_status "PostgreSQL is running ✅"

# Create database if it doesn't exist
print_step "Setting up database..."
if ! psql -lqt | cut -d \| -f 1 | grep -qw crownsync_dev; then
    print_status "Creating database 'crownsync_dev'..."
    createdb crownsync_dev
    if [ $? -eq 0 ]; then
        print_status "Database created successfully ✅"
    else
        print_error "Failed to create database"
        exit 1
    fi
else
    print_status "Database 'crownsync_dev' already exists ✅"
fi

# Create user if it doesn't exist
print_status "Setting up database user..."
psql crownsync_dev -c "CREATE USER crownsync_user WITH PASSWORD 'local_dev_password';" 2>/dev/null || print_warning "User may already exist"
psql crownsync_dev -c "GRANT ALL PRIVILEGES ON DATABASE crownsync_dev TO crownsync_user;"
psql crownsync_dev -c "GRANT ALL PRIVILEGES ON SCHEMA public TO crownsync_user;"
psql crownsync_dev -c "GRANT CREATE ON SCHEMA public TO crownsync_user;"

# Create environment file
print_step "Creating environment configuration..."
if [ ! -f .env.local ]; then
    cat > .env.local << EOF
# Local PostgreSQL Database Configuration
DATABASE_URL=postgresql://crownsync_user:local_dev_password@localhost:5432/crownsync_dev

# Development Environment
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database connection settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crownsync_dev
DB_USER=crownsync_user
DB_PASSWORD=local_dev_password

# Application settings
NEXT_PUBLIC_SITE_NAME=CrownSync
NEXT_PUBLIC_SITE_DESCRIPTION=Campaign Analytics Platform for Luxury Brands
EOF
    print_status "Environment file created ✅"
else
    print_warning "Environment file already exists, skipping creation"
fi

# Install Node.js dependencies
print_step "Installing Node.js dependencies..."
if ! npm list pg > /dev/null 2>&1; then
    print_status "Installing PostgreSQL dependencies..."
    npm install pg @types/pg
    if [ $? -eq 0 ]; then
        print_status "Dependencies installed successfully ✅"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_status "PostgreSQL dependencies already installed ✅"
fi

# Install development dependencies
if ! npm list tsx > /dev/null 2>&1; then
    print_status "Installing development dependencies..."
    npm install --save-dev tsx
fi

if ! npm list dotenv > /dev/null 2>&1; then
    print_status "Installing dotenv..."
    npm install dotenv
fi

# Create schema
print_step "Creating database schema..."
if [ -f schema/init.sql ]; then
    psql crownsync_dev -f schema/init.sql
    if [ $? -eq 0 ]; then
        print_status "Database schema created successfully ✅"
    else
        print_error "Failed to create database schema"
        exit 1
    fi
else
    print_error "Schema file not found: schema/init.sql"
    exit 1
fi

# Generate test data
print_step "Generating Marco Bicego test data..."
if [ -f scripts/generate-marco-bicego-data.ts ]; then
    npx tsx scripts/generate-marco-bicego-data.ts
    if [ $? -eq 0 ]; then
        print_status "Test data generated successfully ✅"
    else
        print_error "Failed to generate test data"
        exit 1
    fi
else
    print_error "Data generation script not found: scripts/generate-marco-bicego-data.ts"
    exit 1
fi

echo ""
echo "🎉 Development environment setup complete!"
echo "============================================================="
echo -e "${GREEN}✅ Database:${NC} postgresql://crownsync_user:***@localhost:5432/crownsync_dev"
echo -e "${GREEN}✅ Environment:${NC} .env.local created"
echo -e "${GREEN}✅ Schema:${NC} Tables and indexes created"
echo -e "${GREEN}✅ Test Data:${NC} Marco Bicego campaign with realistic performance data"
echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo "  1. Run 'npm run dev' to start the development server"
echo "  2. Visit http://localhost:3000"
echo "  3. Navigate to /dashboard/analytics/campaigns/{campaign-id}"
echo ""
echo -e "${YELLOW}💡 Useful Commands:${NC}"
echo "  • npm run dev:seed    - Regenerate test data"
echo "  • npm run dev:reset   - Reset database and regenerate data"
echo "  • npm run test:db     - Run database tests"
echo "" 