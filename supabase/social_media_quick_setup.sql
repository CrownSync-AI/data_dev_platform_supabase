-- =====================================================
-- Social Media Analytics Quick Setup
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Social Accounts Table
CREATE TABLE IF NOT EXISTS social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'google_business')),
    account_handle VARCHAR(255),
    account_name VARCHAR(255),
    account_id VARCHAR(255),
    profile_url TEXT,
    ayrshare_profile_key VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    account_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Posts Table
CREATE TABLE IF NOT EXISTS social_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
    campaign_id UUID,
    ayrshare_post_id VARCHAR(255),
    platform_post_id VARCHAR(255),
    post_type VARCHAR(50) CHECK (post_type IN ('image', 'video', 'carousel', 'story', 'reel', 'text')),
    content TEXT,
    media_urls TEXT[],
    hashtags TEXT[],
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    post_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Analytics Table
CREATE TABLE IF NOT EXISTS social_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
    account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'google_business')),
    analytics_date DATE NOT NULL,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    reactions INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    organic_reach INTEGER DEFAULT 0,
    paid_reach INTEGER DEFAULT 0,
    link_clicks INTEGER DEFAULT 0,
    profile_clicks INTEGER DEFAULT 0,
    website_clicks INTEGER DEFAULT 0,
    video_views INTEGER DEFAULT 0,
    video_completion_rate DECIMAL(5,2) DEFAULT 0,
    average_watch_time INTEGER DEFAULT 0,
    platform_metrics JSONB DEFAULT '{}',
    engagement_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN reach > 0 THEN ((likes + comments + shares + reactions)::DECIMAL / reach) * 100
            ELSE 0 
        END
    ) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, analytics_date)
);

-- Account Analytics Table
CREATE TABLE IF NOT EXISTS account_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'google_business')),
    analytics_date DATE NOT NULL,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    new_followers INTEGER DEFAULT 0,
    unfollowers INTEGER DEFAULT 0,
    net_follower_growth INTEGER GENERATED ALWAYS AS (new_followers - unfollowers) STORED,
    follower_growth_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN followers_count > 0 THEN (net_follower_growth::DECIMAL / followers_count) * 100
            ELSE 0 
        END
    ) STORED,
    profile_visits INTEGER DEFAULT 0,
    profile_actions INTEGER DEFAULT 0,
    website_clicks_from_profile INTEGER DEFAULT 0,
    total_posts INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    total_reach INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    platform_account_metrics JSONB DEFAULT '{}',
    average_engagement_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(account_id, analytics_date)
);

-- Audience Demographics Table
CREATE TABLE IF NOT EXISTS audience_demographics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'google_business')),
    analytics_date DATE NOT NULL,
    age_13_17 DECIMAL(5,2) DEFAULT 0,
    age_18_24 DECIMAL(5,2) DEFAULT 0,
    age_25_34 DECIMAL(5,2) DEFAULT 0,
    age_35_44 DECIMAL(5,2) DEFAULT 0,
    age_45_54 DECIMAL(5,2) DEFAULT 0,
    age_55_64 DECIMAL(5,2) DEFAULT 0,
    age_65_plus DECIMAL(5,2) DEFAULT 0,
    gender_male DECIMAL(5,2) DEFAULT 0,
    gender_female DECIMAL(5,2) DEFAULT 0,
    gender_other DECIMAL(5,2) DEFAULT 0,
    top_countries JSONB DEFAULT '{}',
    top_cities JSONB DEFAULT '{}',
    interests JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(account_id, platform, analytics_date)
);

-- Hashtag Performance Table
CREATE TABLE IF NOT EXISTS hashtag_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
    hashtag VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'google_business')),
    analytics_date DATE NOT NULL,
    posts_count INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    total_reach INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    average_engagement_rate DECIMAL(5,2) DEFAULT 0,
    click_through_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(account_id, hashtag, platform, analytics_date)
);

-- =====================================================
-- 2. CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_active ON social_accounts(is_active);
CREATE INDEX IF NOT EXISTS idx_social_analytics_date ON social_analytics(analytics_date);
CREATE INDEX IF NOT EXISTS idx_social_analytics_platform ON social_analytics(platform);
CREATE INDEX IF NOT EXISTS idx_social_analytics_account ON social_analytics(account_id);
CREATE INDEX IF NOT EXISTS idx_social_analytics_engagement ON social_analytics(engagement_rate);
CREATE INDEX IF NOT EXISTS idx_account_analytics_date ON account_analytics(analytics_date);
CREATE INDEX IF NOT EXISTS idx_account_analytics_account ON account_analytics(account_id);

-- =====================================================
-- 3. CREATE VIEWS
-- =====================================================

-- Social Performance Summary View
CREATE OR REPLACE VIEW social_performance_summary AS
SELECT 
    sa.id as account_id,
    sa.platform,
    sa.account_name,
    sa.user_id,
    u.name as retailer_name,
    u.region,
    COALESCE(SUM(san.impressions), 0) as total_impressions,
    COALESCE(SUM(san.reach), 0) as total_reach,
    COALESCE(SUM(san.likes + san.comments + san.shares + san.reactions), 0) as total_engagement,
    COALESCE(AVG(san.engagement_rate), 0) as avg_engagement_rate,
    COALESCE(SUM(san.link_clicks), 0) as total_clicks,
    COALESCE(COUNT(DISTINCT sp.id), 0) as posts_count,
    COALESCE(AVG(aa.net_follower_growth), 0) as avg_daily_follower_growth,
    COALESCE(MAX(aa.followers_count), 0) as current_followers,
    CASE 
        WHEN AVG(san.engagement_rate) >= 5.0 THEN 'High Engagement'
        WHEN AVG(san.engagement_rate) >= 2.0 THEN 'Good Engagement'
        ELSE 'Standard'
    END as performance_tier,
    COALESCE(MAX(san.updated_at), NOW()) as last_updated
FROM social_accounts sa
LEFT JOIN users u ON sa.user_id = u.id
LEFT JOIN social_posts sp ON sa.id = sp.account_id
LEFT JOIN social_analytics san ON sp.id = san.post_id 
    AND san.analytics_date >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN account_analytics aa ON sa.id = aa.account_id 
    AND aa.analytics_date >= CURRENT_DATE - INTERVAL '30 days'
WHERE sa.is_active = true
GROUP BY sa.id, sa.platform, sa.account_name, sa.user_id, u.name, u.region;

-- Top Performing Content View
CREATE OR REPLACE VIEW top_performing_content AS
SELECT 
    sp.id as post_id,
    sp.content,
    sp.post_type,
    sa.platform,
    sa.account_name,
    u.name as retailer_name,
    COALESCE(san.impressions, 0) as impressions,
    COALESCE(san.reach, 0) as reach,
    COALESCE(san.engagement_rate, 0) as engagement_rate,
    COALESCE((san.likes + san.comments + san.shares + san.reactions), 0) as total_engagement,
    COALESCE(san.link_clicks, 0) as link_clicks,
    sp.published_at,
    sp.hashtags,
    ROW_NUMBER() OVER (PARTITION BY sa.platform ORDER BY san.engagement_rate DESC) as platform_rank
FROM social_posts sp
JOIN social_accounts sa ON sp.account_id = sa.id
LEFT JOIN users u ON sa.user_id = u.id
LEFT JOIN social_analytics san ON sp.id = san.post_id
WHERE sp.status = 'published' 
    AND (san.analytics_date IS NULL OR san.analytics_date >= CURRENT_DATE - INTERVAL '90 days')
ORDER BY san.engagement_rate DESC NULLS LAST;