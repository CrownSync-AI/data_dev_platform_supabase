# 🚀 Social Media Analytics Setup Guide

This guide will help you set up the complete social media analytics system with dummy data based on Ayrshare's data structure.

## 📋 Prerequisites

Before starting, ensure you have:

1. ✅ **Supabase Project**: Active Supabase project with database access
2. ✅ **Environment Variables**: Properly configured `.env.local` file
3. ✅ **User Data**: Existing retailer users in your `users` table
4. ✅ **Database Access**: Admin access to run SQL scripts

## 🗄️ Database Setup

### Step 1: Create Tables and Views

1. **Open Supabase SQL Editor**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Create a new query

2. **Run Table Creation Script**
   ```sql
   -- Copy and paste the contents of supabase/social_media_quick_setup.sql
   ```
   
   Or run the file directly:
   ```bash
   # If you have Supabase CLI installed
   supabase db reset --db-url "your-database-url"
   ```

### Step 2: Insert Dummy Data

1. **Run Data Insertion Script**
   ```sql
   -- Copy and paste the contents of supabase/social_media_dummy_data.sql
   ```

2. **Verify Data Creation**
   The script will show a summary of created records:
   ```
   Social Accounts: 40+ records (10 retailers × 4 platforms)
   Social Posts: 300+ records
   Social Analytics: 9000+ records (30 days of data)
   Account Analytics: 1200+ records
   Audience Demographics: 160+ records
   Hashtag Performance: 400+ records
   ```

## 🔧 Alternative Setup Methods

### Method 1: Manual SQL Execution (Recommended)

1. **Copy SQL Files**
   - Copy `supabase/social_media_quick_setup.sql` to Supabase SQL Editor
   - Execute the script
   - Copy `supabase/social_media_dummy_data.sql` to Supabase SQL Editor  
   - Execute the script

### Method 2: Node.js Script (If Available)

```bash
# Make the script executable
chmod +x scripts/setup-social-media-analytics.js

# Run the setup script
node scripts/setup-social-media-analytics.js
```

## 📊 Data Structure Overview

The setup creates the following data structure based on Ayrshare API formats:

### **Social Accounts** (40+ records)
- 4 platforms per retailer: LinkedIn, Instagram, Facebook, Google Business
- Realistic follower counts and engagement metrics
- Platform-specific metadata and profile information

### **Social Posts** (300+ records)
- Luxury jewelry-focused content
- Realistic hashtags and engagement patterns
- Multiple post types: images, videos, carousels
- Published over the last 30 days

### **Social Analytics** (9000+ records)
- Daily analytics for each post over 30 days
- Platform-appropriate engagement metrics:
  - **Instagram**: 1000-6000 impressions, high saves
  - **LinkedIn**: 500-2500 impressions, professional engagement
  - **Facebook**: 800-3800 impressions, shares and reactions
  - **Google Business**: 300-1800 impressions, local actions

### **Account Analytics** (1200+ records)
- Daily account-level metrics for 30 days
- Follower growth patterns
- Profile visits and website clicks
- Platform-specific account metrics

### **Audience Demographics** (160+ records)
- Weekly demographic snapshots
- Age distribution (luxury jewelry audience)
- Gender breakdown (65% female, 30% male)
- Geographic data (US, UK, CA focus)
- Interest categories (luxury, jewelry, fashion)

### **Hashtag Performance** (400+ records)
- Performance data for luxury jewelry hashtags
- Engagement rates and click-through rates
- Cross-platform hashtag analysis

## 🎯 Frontend Integration

After database setup, the frontend components will display:

### **Overview Cards**
- **Total Reach**: Aggregated across all platforms
- **Engagement Rate**: Weighted average engagement
- **Link Clicks**: Total clicks to websites
- **New Followers**: Daily follower growth

### **Platform Tabs**
- **LinkedIn**: Company page metrics, professional engagement
- **Instagram**: Story views, reel performance, shopping clicks
- **Facebook**: Page insights, audience demographics
- **Google Business**: Profile views, direction requests, reviews

### **Data Visualization**
- **Engagement Trends**: 30-day engagement rate trends
- **Platform Comparison**: Radar chart comparing platform performance
- **Retailer Rankings**: Sortable table with performance metrics
- **Top Content**: Best performing posts with engagement data

## 🧪 Testing and Verification

### Step 1: Test API Endpoints

```bash
# Test all social media analytics API endpoints
node scripts/test-social-analytics-api.js
```

Expected output:
```
✅ Main Analytics Endpoint: Working
✅ Performance Rankings: Working  
✅ Top Content: Working
✅ Engagement Trends: Working
✅ Social Accounts: Working
```

### Step 2: Test Frontend Components

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Navigate to Social Analytics**
   ```
   http://localhost:3000/dashboard/brand-performance/social-analytics
   ```

3. **Verify Components Display Data**
   - Overview cards show non-zero metrics
   - Platform tabs contain data
   - Charts render with data points
   - Tables populate with retailer information

### Step 3: Test Filtering and Sorting

- **Platform Filter**: Filter by Instagram, LinkedIn, etc.
- **Region Filter**: Filter by East, Central, West regions
- **Date Range**: Change time periods
- **Performance Tier**: Filter by High/Good/Standard engagement
- **Sorting**: Sort retailer rankings by different metrics

## 🔍 Troubleshooting

### Common Issues

#### 1. No Data in Frontend
**Symptoms**: Empty charts and tables
**Solutions**:
- Verify database tables were created successfully
- Check that dummy data was inserted
- Ensure API endpoints return data
- Verify environment variables are correct

#### 2. API Endpoints Return Errors
**Symptoms**: 500 errors or empty responses
**Solutions**:
- Check Supabase connection in `.env.local`
- Verify database views were created
- Check for missing foreign key relationships
- Ensure RLS policies allow data access

#### 3. Missing Retailer Data
**Symptoms**: No social accounts created
**Solutions**:
- Verify `users` table has records with `user_type = 'retailer'`
- Check that users have proper `region` values
- Ensure foreign key constraints are satisfied

### Verification Queries

Run these in Supabase SQL Editor to verify setup:

```sql
-- Check social accounts by platform
SELECT platform, COUNT(*) as count 
FROM social_accounts 
GROUP BY platform;

-- Check recent analytics data
SELECT 
    platform, 
    COUNT(*) as records,
    AVG(engagement_rate) as avg_engagement,
    MAX(analytics_date) as latest_date
FROM social_analytics 
GROUP BY platform;

-- Test the views
SELECT COUNT(*) FROM social_performance_summary;
SELECT COUNT(*) FROM top_performing_content;
```

## 📈 Expected Results

After successful setup, you should see:

### **Dashboard Metrics**
- Total Reach: 500K - 2M impressions
- Engagement Rate: 2-8% average
- Link Clicks: 5K - 20K clicks
- New Followers: 100 - 500 daily growth

### **Platform Performance**
- **Instagram**: Highest engagement rates (4-8%)
- **LinkedIn**: Professional metrics, lower volume
- **Facebook**: Broad reach, moderate engagement
- **Google Business**: Local actions and reviews

### **Retailer Rankings**
- 10+ retailers with social media presence
- Performance grades: A (5%+ engagement), B (2-5%), C (<2%)
- Regional distribution across East, Central, West
- Multiple platforms per retailer

## 🎉 Success Indicators

✅ **Database Setup Complete**
- All 6 tables created with proper relationships
- 10,000+ total records across all tables
- Views return aggregated data

✅ **API Endpoints Working**
- All 5 main endpoints return data
- Filtering and sorting work correctly
- No 500 errors or empty responses

✅ **Frontend Components Populated**
- Overview cards display metrics
- Charts render with data points
- Tables show retailer information
- Platform tabs contain relevant data

✅ **Real-time Features Working**
- Data updates reflect in UI
- Export functionality works
- Filtering updates charts and tables

## 🚀 Next Steps

After successful setup:

1. **Customize Data**: Modify dummy data to match your specific retailers
2. **Add Real Integration**: Connect to actual Ayrshare API when ready
3. **Extend Analytics**: Add custom metrics and KPIs
4. **Performance Optimization**: Add caching and query optimization
5. **User Testing**: Gather feedback on dashboard usability

The social media analytics system is now ready for development and testing with comprehensive dummy data that mirrors real-world social media performance patterns!