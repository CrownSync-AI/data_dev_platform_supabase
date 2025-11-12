# 📊 Campaign Performance New Tab - Requirements & Design

## 🎯 Project Overview

**Objective**: Create a new "Campaign Performance New" tab that provides Ayrshare-modeled social media analytics with role-based access control and platform switching capabilities.

**Key Requirements**:
- Use dummy data modeled after Ayrshare API structure (no actual API integration)
- Support Facebook Pages, Instagram, X/Twitter, LinkedIn, and Email
- Implement Brand vs Retailer role-based views
- Create new database tables with `_new` suffix
- Generate comprehensive dummy data for testing and development

**Important Note**: 
- **No Third-Party API Integration**: This development phase uses only dummy data
- **Ayrshare-Modeled Structure**: Data structure follows Ayrshare API format for future integration
- **Development Focus**: Frontend functionality and database structure without external dependencies

## 📊 Ayrshare-Modeled Data Structure

### Dummy Data Modeled After Ayrshare Analytics API

**Note**: All data is dummy/simulated data structured to match Ayrshare API format for future integration compatibility.

Based on the Ayrshare API documentation (https://www.ayrshare.com/docs/apis/analytics/post) structure:

#### **Post-Level Analytics**
```json
{
  "post_id": "string",
  "platform": "facebook|instagram|twitter|linkedin",
  "metrics": {
    "impressions": number,
    "reach": number,
    "likes": number,
    "comments": number,
    "shares": number,
    "engagement_rate": number,
    "link_clicks": number,
    "video_views": number,
    "video_completion_rate": number
  }
}
```

#### **Account-Level Analytics**
```json
{
  "platform": "facebook|instagram|twitter|linkedin",
  "profileKey": "string",
  "metrics": {
    "followers": number,
    "following": number,
    "posts": number,
    "engagement_rate": number,
    "reach": number,
    "impressions": number
  }
}
```

### **Selected Actionable Metrics**

#### **Primary Metrics** (Most Important)
1. **Engagement Rate** - Core performance indicator
2. **Total Reach** - Audience size reached
3. **Total Impressions** - Content visibility
4. **Link Clicks** - Traffic generation
5. **Follower Growth** - Audience building

#### **Secondary Metrics** (Supporting)
6. **Total Engagement** (likes + comments + shares)
7. **Content Frequency** (posts per period)
8. **Video Performance** (views, completion rate)
9. **Platform Distribution** (performance by platform)
10. **Growth Trends** (period-over-period changes)

## 🎨 UI/UX Design Plan

### **Tab Structure**
```
Brand Performance Dashboard
├── Campaigns (existing)
├── Retailer Performance (existing)
├── Social Analytics (existing)
└── Campaign Performance New (NEW)
    ├── Platform Selector
    ├── Role View Toggle
    ├── Metrics Overview Cards
    ├── Performance Charts
    └── Detailed Analytics Table
```

### **Navigation Components**

#### **1. Platform Selector**
```typescript
interface PlatformSelectorProps {
  selectedPlatforms: Platform[]
  onPlatformChange: (platforms: Platform[]) => void
}

type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'email'
```

**Design**: Horizontal tab navigation with platform icons
- Facebook Pages (blue icon)
- Instagram (gradient icon)
- X/Twitter (black icon)
- LinkedIn (blue icon)
- Email (envelope icon)
- All Platforms (combined view)

#### **2. Role View Toggle**
```typescript
interface RoleViewToggleProps {
  currentRole: 'brand' | 'retailer'
  onRoleChange: (role: 'brand' | 'retailer') => void
}
```

**Design**: Toggle switch in top-right corner
- Brand View: "All Retailers" 
- Retailer View: "My Performance"

### **Brand View Layout**

#### **Overview Cards Row**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Reach │ Avg Engage │ Link Clicks │ New Follow  │
│ 2.4M        │ 4.2%        │ 15.2K       │ +1,247      │
│ +12.5%      │ +0.8%       │ +23.1%      │ +8.9%       │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

#### **Performance Charts Section**
```
┌─────────────────────────────┬─────────────────────────────┐
│ Engagement Trends Chart     │ Platform Comparison Chart   │
│ (Line chart over time)      │ (Radar chart by platform)  │
└─────────────────────────────┴─────────────────────────────┘
```

#### **Retailer Performance Table**
```
┌──────────────────────────────────────────────────────────┐
│ Retailer Rankings                                        │
├──────────────┬──────────┬──────────┬──────────┬─────────┤
│ Retailer     │ Platform │ Engage % │ Reach    │ Clicks  │
├──────────────┼──────────┼──────────┼──────────┼─────────┤
│ Cartier LA   │ All      │ 6.8%     │ 245K     │ 2.1K    │
│ Betteridge   │ All      │ 5.9%     │ 189K     │ 1.8K    │
└──────────────┴──────────┴──────────┴──────────┴─────────┘
```

### **Retailer View Layout**

#### **My Performance Cards**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ My Reach    │ My Engage   │ My Clicks   │ My Growth   │
│ 189K        │ 5.9%        │ 1.8K        │ +127        │
│ vs avg 4.2% │ vs avg 4.2% │ vs avg 1.2K │ vs avg +89  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

#### **Platform Performance Breakdown**
```
┌─────────────────────────────────────────────────────────┐
│ My Platform Performance                                 │
├──────────────┬──────────┬──────────┬──────────┬────────┤
│ Platform     │ Engage % │ Reach    │ Clicks   │ Posts  │
├──────────────┼──────────┼──────────┼──────────┼────────┤
│ Instagram    │ 7.2%     │ 89K      │ 890      │ 12     │
│ Facebook     │ 5.1%     │ 67K      │ 567      │ 8      │
│ LinkedIn     │ 4.8%     │ 23K      │ 234      │ 5      │
│ Twitter      │ 3.9%     │ 10K      │ 109      │ 15     │
└──────────────┴──────────┴──────────┴──────────┴────────┘
```

## 🗄️ Database Schema Design

### **New Tables with `_new` Suffix**

#### **1. `campaigns_new`**
```sql
CREATE TABLE campaigns_new (
    campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_name VARCHAR(255) NOT NULL,
    campaign_description TEXT,
    campaign_type VARCHAR(50) DEFAULT 'social_media', -- 'social_media', 'email', 'mixed'
    brand_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'completed'
    start_date DATE NOT NULL,
    end_date DATE,
    target_platforms TEXT[] DEFAULT '{}', -- ['facebook', 'instagram', 'twitter', 'linkedin']
    campaign_goals JSONB, -- engagement_target, reach_target, etc.
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **2. `social_accounts_new`**
```sql
CREATE TABLE social_accounts_new (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID REFERENCES users(id),
    platform VARCHAR(50) NOT NULL, -- 'facebook', 'instagram', 'twitter', 'linkedin'
    account_handle VARCHAR(255),
    account_name VARCHAR(255),
    ayrshare_profile_key VARCHAR(255),
    follower_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    connected_at TIMESTAMP DEFAULT NOW(),
    last_sync_at TIMESTAMP,
    account_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **3. `campaign_posts_new`**
```sql
CREATE TABLE campaign_posts_new (
    post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns_new(campaign_id),
    account_id UUID REFERENCES social_accounts_new(account_id),
    ayrshare_post_id VARCHAR(255),
    platform_post_id VARCHAR(255),
    post_content TEXT,
    post_type VARCHAR(50), -- 'image', 'video', 'carousel', 'story', 'text'
    media_urls TEXT[],
    hashtags TEXT[],
    published_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'published', -- 'draft', 'scheduled', 'published', 'failed'
    post_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### **4. `campaign_analytics_new`**
```sql
CREATE TABLE campaign_analytics_new (
    analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns_new(campaign_id),
    post_id UUID REFERENCES campaign_posts_new(post_id),
    account_id UUID REFERENCES social_accounts_new(account_id),
    platform VARCHAR(50) NOT NULL,
    analytics_date DATE NOT NULL,
    
    -- Core Ayrshare Metrics
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    link_clicks INTEGER DEFAULT 0,
    
    -- Video Metrics (when applicable)
    video_views INTEGER DEFAULT 0,
    video_completion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Calculated Metrics
    total_engagement INTEGER GENERATED ALWAYS AS (likes + comments + shares) STORED,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Ayrshare Raw Data
    ayrshare_data JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **5. `account_performance_new`**
```sql
CREATE TABLE account_performance_new (
    performance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES social_accounts_new(account_id),
    campaign_id UUID REFERENCES campaigns_new(campaign_id),
    platform VARCHAR(50) NOT NULL,
    analytics_date DATE NOT NULL,
    
    -- Account-Level Metrics from Ayrshare
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    new_followers INTEGER DEFAULT 0,
    profile_visits INTEGER DEFAULT 0,
    
    -- Aggregated Post Performance
    total_posts INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    total_reach INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    total_link_clicks INTEGER DEFAULT 0,
    
    -- Calculated Performance Indicators
    average_engagement_rate DECIMAL(5,2) DEFAULT 0,
    follower_growth_rate DECIMAL(5,2) DEFAULT 0,
    content_frequency DECIMAL(5,2) DEFAULT 0, -- posts per day
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **6. `email_campaigns_new`**
```sql
CREATE TABLE email_campaigns_new (
    email_campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns_new(campaign_id),
    retailer_id UUID REFERENCES users(id),
    email_subject VARCHAR(500),
    email_content TEXT,
    sent_at TIMESTAMP,
    recipients_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    
    -- Calculated Email Metrics (No ROI)
    delivery_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN recipients_count > 0 
        THEN ROUND((delivered_count::DECIMAL / recipients_count) * 100, 2)
        ELSE 0 END
    ) STORED,
    open_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN delivered_count > 0 
        THEN ROUND((opened_count::DECIMAL / delivered_count) * 100, 2)
        ELSE 0 END
    ) STORED,
    click_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN delivered_count > 0 
        THEN ROUND((clicked_count::DECIMAL / delivered_count) * 100, 2)
        ELSE 0 END
    ) STORED,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **Performance Views**

#### **1. `campaign_performance_summary_new`**
```sql
CREATE OR REPLACE VIEW campaign_performance_summary_new AS
SELECT 
    c.campaign_id,
    c.campaign_name,
    c.campaign_type,
    c.status,
    c.start_date,
    c.end_date,
    
    -- Aggregated Social Media Metrics
    COUNT(DISTINCT sa.account_id) as total_accounts,
    COUNT(DISTINCT cp.post_id) as total_posts,
    SUM(ca.impressions) as total_impressions,
    SUM(ca.reach) as total_reach,
    SUM(ca.total_engagement) as total_engagement,
    SUM(ca.link_clicks) as total_link_clicks,
    
    -- Average Performance Metrics
    ROUND(AVG(ca.engagement_rate), 2) as avg_engagement_rate,
    ROUND(AVG(ap.follower_growth_rate), 2) as avg_follower_growth_rate,
    
    -- Email Metrics (when applicable)
    COUNT(DISTINCT ec.email_campaign_id) as total_email_campaigns,
    SUM(ec.recipients_count) as total_email_recipients,
    ROUND(AVG(ec.open_rate), 2) as avg_email_open_rate,
    ROUND(AVG(ec.click_rate), 2) as avg_email_click_rate,
    
    -- Performance Classification
    CASE 
        WHEN AVG(ca.engagement_rate) >= 6.0 THEN 'High Performance'
        WHEN AVG(ca.engagement_rate) >= 3.0 THEN 'Good Performance'
        ELSE 'Standard Performance'
    END as performance_tier,
    
    MAX(ca.updated_at) as last_updated

FROM campaigns_new c
LEFT JOIN campaign_posts_new cp ON c.campaign_id = cp.campaign_id
LEFT JOIN social_accounts_new sa ON cp.account_id = sa.account_id
LEFT JOIN campaign_analytics_new ca ON cp.post_id = ca.post_id
LEFT JOIN account_performance_new ap ON sa.account_id = ap.account_id AND c.campaign_id = ap.campaign_id
LEFT JOIN email_campaigns_new ec ON c.campaign_id = ec.campaign_id
GROUP BY c.campaign_id, c.campaign_name, c.campaign_type, c.status, c.start_date, c.end_date;
```

#### **2. `retailer_campaign_performance_new`**
```sql
CREATE OR REPLACE VIEW retailer_campaign_performance_new AS
SELECT 
    u.id as retailer_id,
    u.name as retailer_name,
    u.region,
    c.campaign_id,
    c.campaign_name,
    
    -- Platform Performance
    sa.platform,
    sa.account_name,
    
    -- Aggregated Metrics
    COUNT(cp.post_id) as posts_count,
    SUM(ca.impressions) as total_impressions,
    SUM(ca.reach) as total_reach,
    SUM(ca.total_engagement) as total_engagement,
    SUM(ca.link_clicks) as total_link_clicks,
    
    -- Performance Indicators
    ROUND(AVG(ca.engagement_rate), 2) as avg_engagement_rate,
    MAX(ap.followers_count) as current_followers,
    SUM(ap.new_followers) as new_followers,
    
    -- Email Performance (if applicable)
    MAX(ec.open_rate) as email_open_rate,
    MAX(ec.click_rate) as email_click_rate,
    
    -- Rankings and Comparisons
    RANK() OVER (PARTITION BY c.campaign_id ORDER BY AVG(ca.engagement_rate) DESC) as engagement_rank,
    RANK() OVER (PARTITION BY c.campaign_id ORDER BY SUM(ca.reach) DESC) as reach_rank,
    
    MAX(ca.updated_at) as last_updated

FROM users u
JOIN social_accounts_new sa ON u.id = sa.retailer_id
JOIN campaign_posts_new cp ON sa.account_id = cp.account_id
JOIN campaigns_new c ON cp.campaign_id = c.campaign_id
LEFT JOIN campaign_analytics_new ca ON cp.post_id = ca.post_id
LEFT JOIN account_performance_new ap ON sa.account_id = ap.account_id AND c.campaign_id = ap.campaign_id
LEFT JOIN email_campaigns_new ec ON c.campaign_id = ec.campaign_id AND u.id = ec.retailer_id
WHERE u.user_type = 'retailer'
GROUP BY u.id, u.name, u.region, c.campaign_id, c.campaign_name, sa.platform, sa.account_name;
```

## 📊 Dummy Data Generation Plan

**Important**: All data is simulated/dummy data modeled after Ayrshare API structure. No actual third-party API calls are made.

### **Data Volume Requirements**
- **3 Active Campaigns** (different types and performance levels)
- **25 Retailers** (existing users from current system)
- **4 Platforms per Retailer** (Facebook, Instagram, Twitter, LinkedIn)
- **100 Social Accounts** (25 retailers × 4 platforms)
- **30 Days of Analytics Data** (realistic performance tracking)
- **1,500+ Posts** (5 posts per account over 30 days)
- **45,000+ Analytics Records** (1,500 posts × 30 days)
- **75 Email Campaigns** (25 retailers × 3 campaigns)

### **Realistic Performance Distribution**
- **High Performers (20%)**: 6-8% engagement rate, 50K+ reach
- **Good Performers (60%)**: 3-6% engagement rate, 20-50K reach  
- **Standard Performers (20%)**: 1-3% engagement rate, 5-20K reach

### **Platform-Specific Characteristics**
- **Instagram**: Highest engagement rates (4-8%), strong visual content
- **Facebook**: Broad reach, moderate engagement (2-5%)
- **LinkedIn**: Professional content, lower volume but quality engagement (3-6%)
- **Twitter**: High frequency, lower engagement (1-4%), news/updates focus

## 🔄 Implementation Phases

### **Phase 1: Database Setup** (Priority: High)
1. Create all new tables with proper relationships
2. Set up indexes for performance optimization
3. Create database views for dashboard consumption
4. Generate comprehensive dummy data

### **Phase 2: Backend API Development** (Priority: High)
1. Create API endpoints for campaign analytics
2. Implement role-based data filtering
3. Add platform-specific data aggregation
4. Set up real-time data refresh capabilities

### **Phase 3: Frontend Component Development** (Priority: Medium)
1. Create "Campaign Performance New" tab component
2. Build platform selector and role toggle components
3. Implement metric cards and visualization charts
4. Create responsive retailer performance table

### **Phase 4: Integration & Testing** (Priority: Medium)
1. Connect frontend to backend APIs
2. Test role-based access controls
3. Validate cross-platform comparisons
4. Optimize performance and user experience

## 🎯 Success Criteria

### **Functional Requirements**
- [x] Platform switching works for all 5 platforms (Facebook, Instagram, Twitter, LinkedIn, Email)
- [x] Role-based views show appropriate data (Brand sees all, Retailer sees own)
- [x] All metrics are sourced from Ayrshare API data structure
- [x] No ROI or custom metrics are included
- [x] Responsive design works on all device sizes

### **Performance Requirements**
- [x] Page loads in under 2 seconds
- [x] Platform switching is instant (< 500ms)
- [x] Data refresh completes in under 5 seconds
- [x] Table sorting and filtering is responsive

### **Data Requirements**
- [x] 30 days of realistic analytics data
- [x] All 25 retailers have social media presence
- [x] Performance distribution matches luxury brand patterns
- [x] Email campaign data integrated seamlessly

This comprehensive requirements document provides the foundation for implementing the "Campaign Performance New" tab with Ayrshare-based analytics and role-based access control.