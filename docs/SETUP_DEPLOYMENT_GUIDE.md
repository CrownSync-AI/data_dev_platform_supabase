# 🚀 CrownSync Setup & Deployment Guide

## 📋 Overview

This guide provides complete setup and deployment instructions for the CrownSync Data Development Platform, covering development environment setup, database configuration, and production deployment.

## 🎯 Quick Start

### **Prerequisites**
- **Node.js 18+** (recommended: 20.x)
- **npm 9+** or **yarn**
- **Git** for version control
- **Supabase account** for database and backend services

### **5-Minute Setup**
```bash
# 1. Clone and install
git clone <repository-url>
cd crownsync
npm install

# 2. Environment setup
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Database setup
npm run db:setup

# 4. Start development
npm run dev
```

## 🔧 Detailed Setup Instructions

### **Step 1: Environment Setup**

#### **Node.js Installation**
```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Verify installation
node --version  # Should be 20.x
npm --version   # Should be 9.x+
```

#### **Project Installation**
```bash
# Clone repository
git clone <repository-url>
cd crownsync

# Install dependencies
npm install

# Verify installation
npm run type-check
```

### **Step 2: Supabase Setup**

#### **Create Supabase Project**
1. **Sign up/Login**: Go to [supabase.com](https://supabase.com)
2. **Create Project**: 
   - Click "New Project"
   - Choose organization
   - Project name: `crownsync-dev` (or your preference)
   - Create strong database password ⚠️ **SAVE THIS PASSWORD**
   - Select closest region
   - Wait 2-3 minutes for provisioning

#### **Get API Credentials**
1. **Navigate to Settings > API** in Supabase dashboard
2. **Copy the following**:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key (⚠️ Keep this secure)

#### **Environment Configuration**
Create `.env.local` file in project root:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional: Social Media Integration
AYRSHARE_API_KEY=your_ayrshare_api_key_here
AYRSHARE_BASE_URL=https://app.ayrshare.com/api

# Optional: AI Chat Integration
OPENAI_API_KEY=your_openai_api_key_here
```

### **Step 3: Database Setup**

#### **Option A: Automated Setup (Recommended)**
```bash
# Run complete database setup
npm run db:setup

# This will:
# - Create all tables and relationships
# - Set up Row Level Security (RLS) policies
# - Create database views and functions
# - Insert sample data for development
# - Verify the setup
```

#### **Option B: Manual Setup**
1. **Open Supabase SQL Editor**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Create a new query

2. **Run Database Scripts** (in order):
   ```sql
   -- 1. Core schema setup
   -- Copy and paste from: supabase/01_core_schema.sql
   
   -- 2. Campaign management
   -- Copy and paste from: supabase/02_campaign_schema.sql
   
   -- 3. Social media analytics
   -- Copy and paste from: supabase/03_social_media_schema.sql
   
   -- 4. Sample data
   -- Copy and paste from: supabase/04_sample_data.sql
   
   -- 5. Views and functions
   -- Copy and paste from: supabase/05_views_functions.sql
   ```

3. **Verify Setup**
   ```sql
   -- Check tables exist
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   ORDER BY table_name;
   
   -- Check sample data
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM campaigns;
   SELECT COUNT(*) FROM social_accounts;
   ```

### **Step 4: Development Server**

#### **Start Development**
```bash
# Start the development server
npm run dev

# Server will start at http://localhost:3000
```

#### **Verify Installation**
1. **Open Browser**: Navigate to `http://localhost:3000`
2. **Check Dashboard**: Go to `/dashboard/analytics`
3. **Verify Data**: Ensure charts and tables display data
4. **Test Features**:
   - AI Chat: `/dashboard/chat`
   - Brand Performance: `/dashboard/brand-performance`
   - Social Analytics: `/dashboard/brand-performance/social-analytics`
   - CRM: `/dashboard/crm`

## 🗄️ Database Configuration Details

### **Database Architecture**
The CrownSync database consists of several interconnected systems:

#### **Core Tables**
- **User Management**: `users`, `sessions`
- **Campaign System**: `campaigns`, `email_campaigns`, `email_sends`
- **Social Media**: `social_accounts`, `social_posts`, `social_analytics`
- **Performance Tracking**: `retailer_performance_metrics`, `account_analytics`
- **Asset Management**: `brand_assets`, `retailer_asset_activity`
- **CRM System**: `customers`, `crm_conversions`

#### **Analytics Views**
- `campaign_performance_summary` - Campaign ROI and metrics
- `social_performance_summary` - Social media analytics
- `retailer_performance_dashboard` - Retailer rankings
- `top_performing_content` - Best content analysis

#### **Security Features**
- **Row Level Security (RLS)**: User-based data access
- **Audit Logging**: Complete change tracking
- **Data Encryption**: Sensitive data protection

### **Sample Data Overview**
The setup includes realistic sample data:

#### **Users & Retailers**
- **25 luxury brand retailers** across 5 regions
- **Realistic names**: Cartier Rodeo Drive, Betteridge NY, etc.
- **Regional distribution**: East, West, Central, North, South

#### **Campaign Data**
- **4 marketing campaigns** with different performance levels
- **27,000+ email sends** with realistic engagement rates
- **ROI tracking** with conversions and revenue data

#### **Social Media Data**
- **40+ social accounts** across 4 platforms (LinkedIn, Instagram, Facebook, Google Business)
- **300+ social posts** with luxury jewelry content
- **9,000+ analytics records** covering 30 days of performance data

#### **Performance Metrics**
- **Retailer rankings** with performance grades (A-F)
- **Engagement rates** ranging from 1-8% (realistic for luxury brands)
- **Revenue attribution** with campaign ROI calculations

## 🔌 External API Setup

### **Ayrshare Integration (Social Media)**

#### **Setup Steps**
1. **Create Account**: Sign up at [ayrshare.com](https://ayrshare.com)
2. **Get API Key**: Navigate to Settings > API Keys
3. **Connect Platforms**: Link LinkedIn, Instagram, Facebook, Google Business accounts
4. **Configure Environment**:
   ```bash
   AYRSHARE_API_KEY=ayr_your_actual_api_key_here
   AYRSHARE_BASE_URL=https://app.ayrshare.com/api
   ```

#### **Testing Integration**
```bash
# Test Ayrshare connection
npm run test:ayrshare

# Manual sync test
curl -X POST http://localhost:3000/api/social-analytics/sync
```

### **OpenAI Integration (AI Chat)**

#### **Setup Steps**
1. **Create Account**: Sign up at [platform.openai.com](https://platform.openai.com)
2. **Get API Key**: Navigate to API Keys section
3. **Configure Environment**:
   ```bash
   OPENAI_API_KEY=sk-your_openai_api_key_here
   ```

#### **Testing Integration**
```bash
# Test AI chat functionality
# Navigate to http://localhost:3000/dashboard/chat
# Try asking: "Show me campaign performance data"
```

## 🧪 Testing & Validation

### **Automated Testing**
```bash
# Run all tests
npm run test

# Run specific test suites
npm run test:components    # React component tests
npm run test:api          # API endpoint tests
npm run test:database     # Database function tests
npm run test:integration  # End-to-end tests

# Run with coverage
npm run test:coverage
```

### **Manual Verification Checklist**

#### **✅ Database Setup**
- [ ] All tables created successfully
- [ ] Sample data populated (check counts)
- [ ] Views return data
- [ ] RLS policies active

#### **✅ Frontend Features**
- [ ] Dashboard loads with data
- [ ] Charts render correctly
- [ ] Tables display retailer data
- [ ] Filtering and sorting work
- [ ] Mobile responsive design

#### **✅ API Endpoints**
- [ ] `/api/campaigns/[id]/analytics` returns data
- [ ] `/api/social-analytics` returns social data
- [ ] `/api/crm/customers` returns customer data
- [ ] `/api/chat` processes AI requests

#### **✅ Real-time Features**
- [ ] Data updates reflect in UI
- [ ] Supabase subscriptions work
- [ ] Live metrics update

### **Performance Validation**
```bash
# Check page load performance
npm run lighthouse

# Database query performance
npm run db:analyze

# Bundle size analysis
npm run analyze
```

## 🚀 Production Deployment

### **Pre-Deployment Checklist**

#### **Environment Preparation**
- [ ] Production Supabase project created
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] SSL certificates ready
- [ ] Domain configured

#### **Security Review**
- [ ] API keys secured
- [ ] RLS policies tested
- [ ] Audit logging enabled
- [ ] CORS configured
- [ ] Rate limiting implemented

### **Deployment Options**

#### **Option 1: Vercel (Recommended)**

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Navigate to Settings > Environment Variables
   - Add all production environment variables

3. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Configure DNS records

#### **Option 2: Docker Deployment**

1. **Build Docker Image**
   ```bash
   # Build production image
   docker build -t crownsync:latest .
   
   # Run container
   docker run -p 3000:3000 --env-file .env.production crownsync:latest
   ```

2. **Docker Compose** (with database)
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
       env_file:
         - .env.production
   ```

#### **Option 3: Traditional Server**

1. **Build Application**
   ```bash
   # Build for production
   npm run build
   
   # Start production server
   npm start
   ```

2. **Process Manager** (PM2)
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start application
   pm2 start npm --name "crownsync" -- start
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

### **Database Migration to Production**

#### **Supabase Production Setup**
1. **Create Production Project**
   - New Supabase project for production
   - Different from development project
   - Secure database password

2. **Run Production Migrations**
   ```bash
   # Set production database URL
   export SUPABASE_DB_URL="postgresql://..."
   
   # Run migrations
   supabase db push --db-url $SUPABASE_DB_URL
   
   # Verify migration
   npm run verify:production
   ```

3. **Data Migration** (if needed)
   ```bash
   # Export development data
   pg_dump $DEV_DB_URL > dev_data.sql
   
   # Import to production (careful!)
   psql $PROD_DB_URL < dev_data.sql
   ```

### **Post-Deployment Verification**

#### **Health Checks**
```bash
# API health check
curl https://your-domain.com/api/health

# Database connectivity
curl https://your-domain.com/api/db/health

# Feature functionality
curl https://your-domain.com/api/campaigns/health
```

#### **Performance Monitoring**
- **Core Web Vitals**: Monitor LCP, FID, CLS
- **API Response Times**: Track endpoint performance
- **Database Performance**: Monitor query execution times
- **Error Rates**: Track and alert on errors

#### **Security Monitoring**
- **SSL Certificate**: Verify HTTPS configuration
- **API Rate Limiting**: Test rate limit enforcement
- **Authentication**: Verify user access controls
- **Data Privacy**: Ensure RLS policies active

## 🔧 Development Workflow

### **Git Workflow**
```bash
# Feature development
git checkout -b feature/new-analytics-chart
git add .
git commit -m "feat: add new analytics chart component"
git push origin feature/new-analytics-chart

# Create pull request for review
```

### **Code Quality**
```bash
# Before committing
npm run lint:fix      # Fix linting issues
npm run format        # Format code
npm run type-check    # TypeScript validation
npm run test          # Run tests
```

### **Database Changes**
```bash
# Create migration
supabase migration new add_new_table

# Edit migration file
# supabase/migrations/[timestamp]_add_new_table.sql

# Apply migration
supabase db push

# Generate types
supabase gen types typescript --local > lib/types/supabase.ts
```

## 🚨 Troubleshooting

### **Common Setup Issues**

#### **Database Connection Errors**
```bash
# Check environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test connection
npm run test:db-connection

# Reset database (development only)
npm run db:reset
```

#### **Build Errors**
```bash
# Clear cache
npm run clean
rm -rf node_modules package-lock.json
npm install

# Check TypeScript
npm run type-check

# Check for missing dependencies
npm audit
```

#### **Performance Issues**
```bash
# Analyze bundle size
npm run analyze

# Check database queries
npm run db:explain

# Profile React components
npm run dev -- --profile
```

### **Getting Help**

#### **Documentation Resources**
- **Frontend Issues**: [Frontend Comprehensive Guide](./FRONTEND_COMPREHENSIVE_GUIDE.md)
- **Backend Issues**: [Backend & Database Guide](./BACKEND_DATABASE_COMPREHENSIVE_GUIDE.md)
- **Feature-Specific**: Check specialized documentation

#### **Debug Tools**
```bash
# Enable debug logging
DEBUG=* npm run dev

# Database query logging
SUPABASE_DEBUG=true npm run dev

# Verbose error reporting
NODE_ENV=development npm run dev
```

## 📚 Next Steps

### **After Successful Setup**
1. **Explore Features**: Navigate through all dashboard sections
2. **Customize Data**: Replace sample data with your actual data
3. **Configure Integrations**: Set up Ayrshare and OpenAI APIs
4. **Performance Optimization**: Implement caching and monitoring
5. **User Training**: Familiarize team with platform features

### **Development Roadmap**
1. **Week 1**: Basic setup and familiarization
2. **Week 2**: Customize for your specific needs
3. **Week 3**: Integrate with your existing systems
4. **Week 4**: Production deployment and monitoring

This setup guide provides everything needed to get CrownSync running in both development and production environments. The platform is designed to be developer-friendly with comprehensive tooling and clear documentation throughout.