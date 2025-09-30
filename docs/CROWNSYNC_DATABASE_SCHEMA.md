# CrownSync Database Schema Documentation

## 🎯 **Overview**

This document provides a comprehensive database schema for CrownSync, a luxury brand marketing analytics platform. The schema is designed to support campaign performance tracking, retailer management, and social media analytics aligned with Ayrshare data structure standards.

## 📊 **Schema Architecture**

### **Core Principles**
- **Multi-tenant Architecture**: Support for multiple brands and retailers
- **Campaign Type Separation**: Distinct handling of social and email campaigns
- **Ayrshare Alignment**: Data structure compatible with Ayrshare API format
- **Performance Tracking**: Comprehensive metrics for ROI and engagement analysis
- **Real-time Analytics**: Support for live dashboard updates

### **Database Technology**
- **Primary Database**: PostgreSQL (Supabase)
- **Security**: Row Level Security (RLS) policies
- **Real-time**: Supabase real-time subscriptions
- **Indexing**: Optimized for analytics queries

---

## 🏗️ **Core Tables**

### **1. Users Table**
Central user management with role-based access control.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('brand', 'retailer', 'admin')),
    region VARCHAR(100),
    company_name VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_region ON users(region);
CREATE INDEX idx_users_active ON users(is_active);
```

### **2. Brands Table**
Brand management and configuration.

```sql
CREATE TABLE brands (
    brand_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name VARCHAR(255) NOT NULL,
    brand_description TEXT,
    industry VARCHAR(100),
    headquarters_region VARCHAR(100),
    website_url TEXT,
    logo_url TEXT,
    primary_color VARCHAR(7), -- Hex color code
    secondary_color VARCHAR(7),
    created_by UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_brands_active ON brands(is_active);
CREATE INDEX idx_brands_region ON brands(headquarters_region);
```

### **3. Retailers Table**
Retailer profiles and regional classification.

```sql
CREATE TABLE retailers (
    retailer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    website_url TEXT,
    store_type VARCHAR(100), -- boutique, department, online, etc.
    tier VARCHAR(50) CHECK (tier IN ('premium', 'standard', 'basic')),
    is_active BOOLEAN DEFAULT true,
    onboarding_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_retailers_region ON retailers(region);
CREATE INDEX idx_retailers_tier ON retailers(tier);
CREATE INDEX idx_retailers_active ON retailers(is_active);
```

---

## 📧 **Campaign Management**

### **4. Campaigns Table**
Central campaign management with type separation.

```sql
CREATE TABLE campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_name VARCHAR(255) NOT NULL,
    campaign_description TEXT,
    campaign_type VARCHAR(50) NOT NULL CHECK (campaign_type IN ('social', 'email', 'mixed')),
    campaign_status VARCHAR(50) NOT NULL CHECK (campaign_status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
    brand_id UUID REFERENCES brands(brand_id),
    start_date DATE NOT NULL,
    end_date DATE,
    budget_allocated DECIMAL(12,2),
    budget_spent DECIMAL(12,2) DEFAULT 0,
    target_audience TEXT,
    campaign_objectives TEXT[],
    performance_tier VARCHAR(50) CHECK (performance_tier IN ('high', 'good', 'standard')),
    trend_direction VARCHAR(50) CHECK (trend_direction IN ('up', 'down', 'stable')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_campaigns_type ON campaigns(campaign_type);
CREATE INDEX idx_campaigns_status ON campaigns(campaign_status);
CREATE INDEX idx_campaigns_brand ON campaigns(brand_id);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
```

### **5. Campaign Retailers Table**
Many-to-many relationship between campaigns and retailers.

```sql
CREATE TABLE campaign_retailers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    retailer_id UUID REFERENCES retailers(retailer_id) ON DELETE CASCADE,
    participation_status VARCHAR(50) DEFAULT 'active' CHECK (participation_status IN ('active', 'inactive', 'pending')),
    joined_date DATE DEFAULT CURRENT_DATE,
    performance_score DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(campaign_id, retailer_id)
);

-- Indexes
CREATE INDEX idx_campaign_retailers_campaign ON campaign_retailers(campaign_id);
CREATE INDEX idx_campaign_retailers_retailer ON campaign_retailers(retailer_id);
```

---

## 📱 **Social Media Analytics**

### **6. Social Accounts Table**
Social media account management per retailer.

```sql
CREATE TABLE social_accounts (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID REFERENCES retailers(retailer_id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube', 'pinterest', 'snapchat', 'threads', 'bluesky', 'reddit')),
    account_handle VARCHAR(255) NOT NULL,
    account_name VARCHAR(255),
    account_url TEXT,
    follower_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    connected_date DATE DEFAULT CURRENT_DATE,
    last_sync TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(retailer_id, platform, account_handle)
);

-- Indexes
CREATE INDEX idx_social_accounts_retailer ON social_accounts(retailer_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX idx_social_accounts_active ON social_accounts(is_active);
```

### **7. Social Posts Table**
Individual social media posts with Ayrshare-aligned structure.

```sql
CREATE TABLE social_posts (
    post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES social_accounts(account_id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(campaign_id),
    platform VARCHAR(50) NOT NULL,
    platform_post_id VARCHAR(255) NOT NULL, -- External platform ID
    post_url TEXT,
    post_content TEXT,
    post_type VARCHAR(50) CHECK (post_type IN ('text', 'image', 'video', 'carousel', 'story', 'reel', 'live')),
    media_urls JSONB, -- Array of media URLs
    hashtags TEXT[],
    mentions TEXT[],
    scheduled_time TIMESTAMPTZ,
    published_time TIMESTAMPTZ,
    post_status VARCHAR(50) CHECK (post_status IN ('draft', 'scheduled', 'published', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(platform, platform_post_id)
);

-- Indexes
CREATE INDEX idx_social_posts_account ON social_posts(account_id);
CREATE INDEX idx_social_posts_campaign ON social_posts(campaign_id);
CREATE INDEX idx_social_posts_platform ON social_posts(platform);
CREATE INDEX idx_social_posts_published ON social_posts(published_time);
```

### **8. Social Analytics Table**
Comprehensive social media metrics aligned with Ayrshare data structure.

```sql
CREATE TABLE social_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES social_posts(post_id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    analytics_date DATE NOT NULL,
    
    -- Core Metrics (All Platforms)
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    engagement INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Interaction Metrics
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    saves_count INTEGER DEFAULT 0,
    
    -- Platform-Specific Metrics (JSONB for flexibility)
    facebook_metrics JSONB, -- Facebook-specific data
    instagram_metrics JSONB, -- Instagram-specific data
    twitter_metrics JSONB, -- Twitter-specific data
    linkedin_metrics JSONB, -- LinkedIn-specific data
    tiktok_metrics JSONB, -- TikTok-specific data
    youtube_metrics JSONB, -- YouTube-specific data
    
    -- Video Metrics (if applicable)
    video_views INTEGER DEFAULT 0,
    video_completion_rate DECIMAL(5,2) DEFAULT 0,
    average_watch_time INTEGER DEFAULT 0, -- in seconds
    
    -- Audience Metrics
    profile_visits INTEGER DEFAULT 0,
    follower_growth INTEGER DEFAULT 0,
    
    -- Calculated Fields
    cost_per_engagement DECIMAL(8,2),
    roi_percentage DECIMAL(5,2),
    
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    next_update TIMESTAMPTZ,
    
    UNIQUE(post_id, analytics_date)
);

-- Indexes
CREATE INDEX idx_social_analytics_post ON social_analytics(post_id);
CREATE INDEX idx_social_analytics_platform ON social_analytics(platform);
CREATE INDEX idx_social_analytics_date ON social_analytics(analytics_date);
CREATE INDEX idx_social_analytics_engagement ON social_analytics(engagement_rate);
```

---

## 📧 **Email Campaign Management**

### **9. Email Campaigns Table**
Email-specific campaign details.

```sql
CREATE TABLE email_campaigns (
    email_campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    email_subject VARCHAR(500) NOT NULL,
    email_content TEXT,
    sender_name VARCHAR(255),
    sender_email VARCHAR(255),
    template_id VARCHAR(255),
    segment_criteria JSONB,
    send_time TIMESTAMPTZ,
    timezone VARCHAR(50),
    is_automated BOOLEAN DEFAULT false,
    automation_trigger VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_email_campaigns_campaign ON email_campaigns(campaign_id);
CREATE INDEX idx_email_campaigns_send_time ON email_campaigns(send_time);
```

### **10. Email Sends Table**
Individual email delivery tracking.

```sql
CREATE TABLE email_sends (
    send_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_campaign_id UUID REFERENCES email_campaigns(email_campaign_id) ON DELETE CASCADE,
    retailer_id UUID REFERENCES retailers(retailer_id),
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    send_status VARCHAR(50) CHECK (send_status IN ('sent', 'delivered', 'bounced', 'failed')),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    unsubscribed_at TIMESTAMPTZ,
    bounce_reason TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_email_sends_campaign ON email_sends(email_campaign_id);
CREATE INDEX idx_email_sends_retailer ON email_sends(retailer_id);
CREATE INDEX idx_email_sends_status ON email_sends(send_status);
CREATE INDEX idx_email_sends_sent_at ON email_sends(sent_at);
```

---

## 📊 **Performance Analytics**

### **11. Campaign Performance Summary Table**
Aggregated campaign performance metrics.

```sql
CREATE TABLE campaign_performance_summary (
    summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    summary_date DATE NOT NULL,
    campaign_type VARCHAR(50) NOT NULL,
    
    -- Social Media Metrics
    total_impressions BIGINT DEFAULT 0,
    total_reach BIGINT DEFAULT 0,
    total_engagement BIGINT DEFAULT 0,
    avg_engagement_rate DECIMAL(5,2) DEFAULT 0,
    total_followers_gained INTEGER DEFAULT 0,
    
    -- Email Metrics
    emails_sent INTEGER DEFAULT 0,
    emails_delivered INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    open_rate DECIMAL(5,2) DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    unsubscribe_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Financial Metrics
    budget_spent DECIMAL(12,2) DEFAULT 0,
    cost_per_engagement DECIMAL(8,2),
    roi_percentage DECIMAL(5,2),
    
    -- Retailer Metrics
    participating_retailers_count INTEGER DEFAULT 0,
    avg_retailer_performance DECIMAL(5,2),
    top_performing_region VARCHAR(100),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(campaign_id, summary_date)
);

-- Indexes
CREATE INDEX idx_campaign_performance_campaign ON campaign_performance_summary(campaign_id);
CREATE INDEX idx_campaign_performance_date ON campaign_performance_summary(summary_date);
CREATE INDEX idx_campaign_performance_type ON campaign_performance_summary(campaign_type);
```

### **12. Retailer Performance Metrics Table**
Individual retailer performance tracking.

```sql
CREATE TABLE retailer_performance_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID REFERENCES retailers(retailer_id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(campaign_id),
    metric_date DATE NOT NULL,
    campaign_type VARCHAR(50) NOT NULL,
    
    -- Social Media Performance
    social_reach BIGINT DEFAULT 0,
    social_engagement BIGINT DEFAULT 0,
    social_engagement_rate DECIMAL(5,2) DEFAULT 0,
    current_followers INTEGER DEFAULT 0,
    new_followers INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    
    -- Email Performance
    emails_sent INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    open_rate DECIMAL(5,2) DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Performance Classification
    performance_tier VARCHAR(50) CHECK (performance_tier IN ('high', 'good', 'standard')),
    engagement_rank INTEGER,
    regional_rank INTEGER,
    
    -- Calculated Metrics
    performance_score DECIMAL(5,2),
    trend_direction VARCHAR(50) CHECK (trend_direction IN ('up', 'down', 'stable')),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(retailer_id, campaign_id, metric_date, campaign_type)
);

-- Indexes
CREATE INDEX idx_retailer_performance_retailer ON retailer_performance_metrics(retailer_id);
CREATE INDEX idx_retailer_performance_campaign ON retailer_performance_metrics(campaign_id);
CREATE INDEX idx_retailer_performance_date ON retailer_performance_metrics(metric_date);
CREATE INDEX idx_retailer_performance_type ON retailer_performance_metrics(campaign_type);
CREATE INDEX idx_retailer_performance_tier ON retailer_performance_metrics(performance_tier);
```

---

## 🔄 **Real-time Analytics**

### **13. Daily Metrics Table**
Daily aggregated metrics for trend analysis.

```sql
CREATE TABLE daily_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    retailer_id UUID REFERENCES retailers(retailer_id),
    metric_date DATE NOT NULL,
    platform VARCHAR(50),
    
    -- Daily Aggregates
    daily_impressions INTEGER DEFAULT 0,
    daily_reach INTEGER DEFAULT 0,
    daily_engagement INTEGER DEFAULT 0,
    daily_clicks INTEGER DEFAULT 0,
    daily_conversions INTEGER DEFAULT 0,
    daily_followers_gained INTEGER DEFAULT 0,
    
    -- Email Daily Metrics
    daily_emails_sent INTEGER DEFAULT 0,
    daily_emails_opened INTEGER DEFAULT 0,
    daily_emails_clicked INTEGER DEFAULT 0,
    
    -- Calculated Daily Metrics
    daily_engagement_rate DECIMAL(5,2) DEFAULT 0,
    daily_click_rate DECIMAL(5,2) DEFAULT 0,
    daily_conversion_rate DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(campaign_id, retailer_id, metric_date, platform)
);

-- Indexes
CREATE INDEX idx_daily_metrics_campaign ON daily_metrics(campaign_id);
CREATE INDEX idx_daily_metrics_retailer ON daily_metrics(retailer_id);
CREATE INDEX idx_daily_metrics_date ON daily_metrics(metric_date);
CREATE INDEX idx_daily_metrics_platform ON daily_metrics(platform);
```

---

## 🎯 **Views and Aggregations**

### **Campaign Performance Dashboard View**
```sql
CREATE VIEW campaign_performance_dashboard AS
SELECT 
    c.campaign_id,
    c.campaign_name,
    c.campaign_type,
    c.campaign_status,
    c.start_date,
    c.end_date,
    c.performance_tier,
    c.trend_direction,
    
    -- Social Metrics
    COALESCE(cps.total_reach, 0) as total_reach,
    COALESCE(cps.total_engagement, 0) as total_engagement,
    COALESCE(cps.avg_engagement_rate, 0) as avg_engagement_rate,
    
    -- Email Metrics
    COALESCE(cps.emails_sent, 0) as total_emails_sent,
    COALESCE(cps.open_rate, 0) as avg_open_rate,
    COALESCE(cps.click_rate, 0) as avg_click_rate,
    
    -- Retailer Metrics
    COALESCE(cps.participating_retailers_count, 0) as participating_retailers_count,
    COALESCE(cps.avg_retailer_performance, 0) as avg_retailer_performance,
    
    -- Financial Metrics
    COALESCE(cps.roi_percentage, 0) as roi_percentage,
    
    c.created_at,
    c.updated_at
FROM campaigns c
LEFT JOIN campaign_performance_summary cps ON c.campaign_id = cps.campaign_id
WHERE c.is_active = true;
```

### **Retailer Performance Dashboard View**
```sql
CREATE VIEW retailer_performance_dashboard AS
SELECT 
    r.retailer_id,
    r.retailer_name,
    r.region,
    r.tier,
    
    -- Social Performance
    AVG(CASE WHEN rpm.campaign_type = 'social' THEN rpm.social_engagement_rate END) as avg_social_engagement_rate,
    SUM(CASE WHEN rpm.campaign_type = 'social' THEN rpm.social_reach END) as total_social_reach,
    SUM(CASE WHEN rpm.campaign_type = 'social' THEN rpm.social_engagement END) as total_social_engagement,
    
    -- Email Performance
    AVG(CASE WHEN rpm.campaign_type = 'email' THEN rpm.click_rate END) as avg_email_click_rate,
    SUM(CASE WHEN rpm.campaign_type = 'email' THEN rpm.emails_sent END) as total_emails_sent,
    AVG(CASE WHEN rpm.campaign_type = 'email' THEN rpm.open_rate END) as avg_email_open_rate,
    
    -- Overall Performance
    AVG(rpm.performance_score) as overall_performance_score,
    MODE() WITHIN GROUP (ORDER BY rpm.performance_tier) as primary_performance_tier,
    
    COUNT(DISTINCT rpm.campaign_id) as campaigns_participated,
    MAX(rpm.updated_at) as last_activity_date
    
FROM retailers r
LEFT JOIN retailer_performance_metrics rpm ON r.retailer_id = rpm.retailer_id
WHERE r.is_active = true
GROUP BY r.retailer_id, r.retailer_name, r.region, r.tier;
```

---

## 🔐 **Security Policies**

### **Row Level Security (RLS)**
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_performance_metrics ENABLE ROW LEVEL SECURITY;

-- Brand users can only see their own data
CREATE POLICY "Brand users see own data" ON campaigns
    FOR ALL USING (
        brand_id IN (
            SELECT brand_id FROM brands 
            WHERE created_by = auth.uid()
        )
    );

-- Retailers can only see their own performance data
CREATE POLICY "Retailers see own performance" ON retailer_performance_metrics
    FOR SELECT USING (
        retailer_id IN (
            SELECT retailer_id FROM retailers 
            WHERE retailer_id = auth.uid()
        )
    );
```

---

## 📈 **Sample Data Patterns**

### **Campaign Data Example**
```sql
-- Sample campaign with realistic metrics
INSERT INTO campaigns (
    campaign_name, campaign_type, campaign_status, start_date, end_date,
    performance_tier, trend_direction
) VALUES (
    'Spring Collection Preview', 'mixed', 'active', '2024-12-01', '2025-01-01',
    'high', 'up'
);
```

### **Social Analytics Example**
```sql
-- Sample social analytics following Ayrshare structure
INSERT INTO social_analytics (
    post_id, platform, analytics_date, impressions, reach, engagement,
    facebook_metrics, instagram_metrics
) VALUES (
    'post-uuid', 'facebook', '2024-12-20', 23000, 12000, 546,
    '{"likeCount": 23, "commentsCount": 1, "sharesCount": 34, "reactions": {"like": 1, "love": 1}}',
    '{"likeCount": 21, "commentsCount": 1, "savedCount": 1, "sharesCount": 12}'
);
```

### **Retailer Performance Example**
```sql
-- Sample retailer performance metrics
INSERT INTO retailer_performance_metrics (
    retailer_id, campaign_id, metric_date, campaign_type,
    social_reach, social_engagement, social_engagement_rate,
    performance_tier, engagement_rank
) VALUES (
    'retailer-uuid', 'campaign-uuid', '2024-12-20', 'social',
    285000, 24500, 8.6, 'high', 1
);
```

---

## 🚀 **Implementation Guidelines**

### **Database Setup**
1. **Create tables in order**: Users → Brands → Retailers → Campaigns → Analytics
2. **Apply indexes**: Essential for performance with large datasets
3. **Enable RLS**: Security policies for multi-tenant access
4. **Create views**: Optimized queries for dashboard performance

### **Data Population**
1. **Use realistic data**: Industry-standard metrics and patterns
2. **Maintain relationships**: Proper foreign key constraints
3. **Performance tiers**: Distribute across high/good/standard categories
4. **Regional distribution**: Balanced across geographic regions

### **Performance Optimization**
1. **Partitioning**: Consider date-based partitioning for analytics tables
2. **Materialized views**: For complex aggregations
3. **Connection pooling**: Optimize database connections
4. **Query optimization**: Regular EXPLAIN ANALYZE for slow queries

### **Monitoring and Maintenance**
1. **Analytics refresh**: Scheduled updates for performance summaries
2. **Data retention**: Archive old analytics data
3. **Index maintenance**: Regular REINDEX for optimal performance
4. **Backup strategy**: Regular backups with point-in-time recovery

---

## 📋 **Migration Strategy**

### **Phase 1: Core Tables**
- Users, Brands, Retailers, Campaigns
- Basic campaign performance tracking

### **Phase 2: Social Media Integration**
- Social accounts, posts, analytics
- Ayrshare-aligned data structure

### **Phase 3: Email Analytics**
- Email campaigns and tracking
- Advanced performance metrics

### **Phase 4: Advanced Analytics**
- Real-time dashboards
- Predictive analytics and insights

This schema provides a comprehensive foundation for CrownSync's analytics platform while maintaining flexibility for future enhancements and integrations.