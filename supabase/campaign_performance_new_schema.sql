-- Campaign Performance New - Database Schema
-- This script creates new campaign-related tables with _new suffix
-- Based on Ayrshare API data structure for social media analytics

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CAMPAIGNS_NEW - Master campaign records
-- =====================================================
CREATE TABLE campaigns_new (
    campaign_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_name VARCHAR(255) NOT NULL,
    campaign_description TEXT,
    campaign_type VARCHAR(50) DEFAULT 'social_media', -- 'social_media', 'email', 'mixed'
    brand_id UUID REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'completed'
    start_date DATE NOT NULL,
    end_date DATE,
    target_platforms TEXT[] DEFAULT '{}', -- ['facebook', 'instagram', 'twitter', 'linkedin']
    campaign_goals JSONB DEFAULT '{}', -- engagement_target, reach_target, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_campaigns_new_brand_id ON campaigns_new(brand_id);
CREATE INDEX idx_campaigns_new_status ON campaigns_new(status);
CREATE INDEX idx_campaigns_new_dates ON campaigns_new(start_date, end_date);
CREATE INDEX idx_campaigns_new_type ON campaigns_new(campaign_type);

-- =====================================================
-- 2. SOCIAL_ACCOUNTS_NEW - Social media accounts
-- =====================================================
CREATE TABLE social_accounts_new (
    account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID REFERENCES users(id),
    platform VARCHAR(50) NOT NULL, -- 'facebook', 'instagram', 'twitter', 'linkedin'
    account_handle VARCHAR(255),
    account_name VARCHAR(255),
    ayrshare_profile_key VARCHAR(255),
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    account_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique platform per retailer
    UNIQUE(retailer_id, platform)
);

-- Add indexes for performance
CREATE INDEX idx_social_accounts_new_retailer ON social_accounts_new(retailer_id);
CREATE INDEX idx_social_accounts_new_platform ON social_accounts_new(platform);
CREATE INDEX idx_social_accounts_new_active ON social_accounts_new(is_active);
CREATE INDEX idx_social_accounts_new_ayrshare ON social_accounts_new(ayrshare_profile_key);

-- =====================================================
-- 3. CAMPAIGN_POSTS_NEW - Posts within campaigns
-- =====================================================
CREATE TABLE campaign_posts_new (
    post_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns_new(campaign_id) ON DELETE CASCADE,
    account_id UUID REFERENCES social_accounts_new(account_id) ON DELETE CASCADE,
    ayrshare_post_id VARCHAR(255),
    platform_post_id VARCHAR(255),
    post_content TEXT,
    post_type VARCHAR(50), -- 'image', 'video', 'carousel', 'story', 'text'
    media_urls TEXT[],
    hashtags TEXT[],
    published_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'published', -- 'draft', 'scheduled', 'published', 'failed'
    post_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_campaign_posts_new_campaign ON campaign_posts_new(campaign_id);
CREATE INDEX idx_campaign_posts_new_account ON campaign_posts_new(account_id);
CREATE INDEX idx_campaign_posts_new_published ON campaign_posts_new(published_at);
CREATE INDEX idx_campaign_posts_new_status ON campaign_posts_new(status);
CREATE INDEX idx_campaign_posts_new_ayrshare ON campaign_posts_new(ayrshare_post_id);

-- =====================================================
-- 4. CAMPAIGN_ANALYTICS_NEW - Post-level analytics
-- =====================================================
CREATE TABLE campaign_analytics_new (
    analytics_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns_new(campaign_id) ON DELETE CASCADE,
    post_id UUID REFERENCES campaign_posts_new(post_id) ON DELETE CASCADE,
    account_id UUID REFERENCES social_accounts_new(account_id) ON DELETE CASCADE,
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
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique analytics per post per date
    UNIQUE(post_id, analytics_date)
);

-- Add indexes for performance
CREATE INDEX idx_campaign_analytics_new_campaign ON campaign_analytics_new(campaign_id);
CREATE INDEX idx_campaign_analytics_new_post ON campaign_analytics_new(post_id);
CREATE INDEX idx_campaign_analytics_new_account ON campaign_analytics_new(account_id);
CREATE INDEX idx_campaign_analytics_new_date ON campaign_analytics_new(analytics_date);
CREATE INDEX idx_campaign_analytics_new_platform ON campaign_analytics_new(platform);
CREATE INDEX idx_campaign_analytics_new_engagement ON campaign_analytics_new(engagement_rate);

-- =====================================================
-- 5. ACCOUNT_PERFORMANCE_NEW - Account-level metrics
-- =====================================================
CREATE TABLE account_performance_new (
    performance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES social_accounts_new(account_id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns_new(campaign_id) ON DELETE CASCADE,
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
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique performance per account per campaign per date
    UNIQUE(account_id, campaign_id, analytics_date)
);

-- Add indexes for performance
CREATE INDEX idx_account_performance_new_account ON account_performance_new(account_id);
CREATE INDEX idx_account_performance_new_campaign ON account_performance_new(campaign_id);
CREATE INDEX idx_account_performance_new_date ON account_performance_new(analytics_date);
CREATE INDEX idx_account_performance_new_platform ON account_performance_new(platform);

-- =====================================================
-- 6. EMAIL_CAMPAIGNS_NEW - Email campaign metrics
-- =====================================================
CREATE TABLE email_campaigns_new (
    email_campaign_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns_new(campaign_id) ON DELETE CASCADE,
    retailer_id UUID REFERENCES users(id),
    email_subject VARCHAR(500),
    email_content TEXT,
    sent_at TIMESTAMP WITH TIME ZONE,
    recipients_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    
    -- Calculated Email Metrics (No ROI as per requirements)
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
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_email_campaigns_new_campaign ON email_campaigns_new(campaign_id);
CREATE INDEX idx_email_campaigns_new_retailer ON email_campaigns_new(retailer_id);
CREATE INDEX idx_email_campaigns_new_sent ON email_campaigns_new(sent_at);

-- =====================================================
-- PERFORMANCE VIEWS
-- =====================================================

-- Campaign Performance Summary View
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
    COALESCE(SUM(ca.impressions), 0) as total_impressions,
    COALESCE(SUM(ca.reach), 0) as total_reach,
    COALESCE(SUM(ca.total_engagement), 0) as total_engagement,
    COALESCE(SUM(ca.link_clicks), 0) as total_link_clicks,
    
    -- Average Performance Metrics
    ROUND(AVG(ca.engagement_rate), 2) as avg_engagement_rate,
    ROUND(AVG(ap.follower_growth_rate), 2) as avg_follower_growth_rate,
    
    -- Email Metrics (when applicable)
    COUNT(DISTINCT ec.email_campaign_id) as total_email_campaigns,
    COALESCE(SUM(ec.recipients_count), 0) as total_email_recipients,
    ROUND(AVG(ec.open_rate), 2) as avg_email_open_rate,
    ROUND(AVG(ec.click_rate), 2) as avg_email_click_rate,
    
    -- Performance Classification
    CASE 
        WHEN AVG(ca.engagement_rate) >= 6.0 THEN 'High Performance'
        WHEN AVG(ca.engagement_rate) >= 3.0 THEN 'Good Performance'
        ELSE 'Standard Performance'
    END as performance_tier,
    
    MAX(GREATEST(ca.updated_at, ap.updated_at)) as last_updated

FROM campaigns_new c
LEFT JOIN campaign_posts_new cp ON c.campaign_id = cp.campaign_id
LEFT JOIN social_accounts_new sa ON cp.account_id = sa.account_id
LEFT JOIN campaign_analytics_new ca ON cp.post_id = ca.post_id
LEFT JOIN account_performance_new ap ON sa.account_id = ap.account_id AND c.campaign_id = ap.campaign_id
LEFT JOIN email_campaigns_new ec ON c.campaign_id = ec.campaign_id
GROUP BY c.campaign_id, c.campaign_name, c.campaign_type, c.status, c.start_date, c.end_date;

-- Retailer Campaign Performance View
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
    COALESCE(SUM(ca.impressions), 0) as total_impressions,
    COALESCE(SUM(ca.reach), 0) as total_reach,
    COALESCE(SUM(ca.total_engagement), 0) as total_engagement,
    COALESCE(SUM(ca.link_clicks), 0) as total_link_clicks,
    
    -- Performance Indicators
    ROUND(AVG(ca.engagement_rate), 2) as avg_engagement_rate,
    MAX(ap.followers_count) as current_followers,
    COALESCE(SUM(ap.new_followers), 0) as new_followers,
    
    -- Email Performance (if applicable)
    MAX(ec.open_rate) as email_open_rate,
    MAX(ec.click_rate) as email_click_rate,
    
    -- Rankings and Comparisons
    RANK() OVER (PARTITION BY c.campaign_id ORDER BY AVG(ca.engagement_rate) DESC) as engagement_rank,
    RANK() OVER (PARTITION BY c.campaign_id ORDER BY SUM(ca.reach) DESC) as reach_rank,
    
    MAX(GREATEST(ca.updated_at, ap.updated_at)) as last_updated

FROM users u
JOIN social_accounts_new sa ON u.id = sa.retailer_id
JOIN campaign_posts_new cp ON sa.account_id = cp.account_id
JOIN campaigns_new c ON cp.campaign_id = c.campaign_id
LEFT JOIN campaign_analytics_new ca ON cp.post_id = ca.post_id
LEFT JOIN account_performance_new ap ON sa.account_id = ap.account_id AND c.campaign_id = ap.campaign_id
LEFT JOIN email_campaigns_new ec ON c.campaign_id = ec.campaign_id AND u.id = ec.retailer_id
WHERE u.user_type = 'retailer'
GROUP BY u.id, u.name, u.region, c.campaign_id, c.campaign_name, sa.platform, sa.account_name;

-- Platform Performance Summary View
CREATE OR REPLACE VIEW platform_performance_summary_new AS
SELECT 
    sa.platform,
    COUNT(DISTINCT sa.account_id) as total_accounts,
    COUNT(DISTINCT cp.post_id) as total_posts,
    SUM(ca.impressions) as total_impressions,
    SUM(ca.reach) as total_reach,
    SUM(ca.total_engagement) as total_engagement,
    SUM(ca.link_clicks) as total_link_clicks,
    ROUND(AVG(ca.engagement_rate), 2) as avg_engagement_rate,
    
    -- Performance Distribution
    COUNT(CASE WHEN ca.engagement_rate >= 6.0 THEN 1 END) as high_performers,
    COUNT(CASE WHEN ca.engagement_rate BETWEEN 3.0 AND 5.9 THEN 1 END) as good_performers,
    COUNT(CASE WHEN ca.engagement_rate < 3.0 THEN 1 END) as standard_performers,
    
    MAX(ca.updated_at) as last_updated

FROM social_accounts_new sa
JOIN campaign_posts_new cp ON sa.account_id = cp.account_id
JOIN campaign_analytics_new ca ON cp.post_id = ca.post_id
WHERE sa.is_active = true
GROUP BY sa.platform;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE campaigns_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_posts_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_analytics_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_performance_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns_new ENABLE ROW LEVEL SECURITY;

-- Campaigns: Brand users can see their campaigns, retailers can see campaigns they participate in
CREATE POLICY "campaigns_new_access" ON campaigns_new
    FOR ALL USING (
        -- Brand users can see their own campaigns
        (brand_id = auth.uid()) OR
        -- Retailers can see campaigns they participate in
        (EXISTS (
            SELECT 1 FROM social_accounts_new sa
            JOIN campaign_posts_new cp ON sa.account_id = cp.account_id
            WHERE cp.campaign_id = campaigns_new.campaign_id
            AND sa.retailer_id = auth.uid()
        )) OR
        -- Admin users can see all
        (EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type = 'admin'
        ))
    );

-- Social Accounts: Users can only see their own accounts or brand users can see all
CREATE POLICY "social_accounts_new_access" ON social_accounts_new
    FOR ALL USING (
        retailer_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type IN ('brand', 'admin')
        )
    );

-- Campaign Posts: Access based on account ownership and campaign participation
CREATE POLICY "campaign_posts_new_access" ON campaign_posts_new
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM social_accounts_new sa
            WHERE sa.account_id = campaign_posts_new.account_id
            AND (
                sa.retailer_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM users 
                    WHERE id = auth.uid() AND user_type IN ('brand', 'admin')
                )
            )
        )
    );

-- Campaign Analytics: Same access pattern as posts
CREATE POLICY "campaign_analytics_new_access" ON campaign_analytics_new
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM social_accounts_new sa
            WHERE sa.account_id = campaign_analytics_new.account_id
            AND (
                sa.retailer_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM users 
                    WHERE id = auth.uid() AND user_type IN ('brand', 'admin')
                )
            )
        )
    );

-- Account Performance: Same access pattern as accounts
CREATE POLICY "account_performance_new_access" ON account_performance_new
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM social_accounts_new sa
            WHERE sa.account_id = account_performance_new.account_id
            AND (
                sa.retailer_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM users 
                    WHERE id = auth.uid() AND user_type IN ('brand', 'admin')
                )
            )
        )
    );

-- Email Campaigns: Retailers see their own, brands see all
CREATE POLICY "email_campaigns_new_access" ON email_campaigns_new
    FOR ALL USING (
        retailer_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND user_type IN ('brand', 'admin')
        )
    );

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to refresh materialized views (if we add any later)
CREATE OR REPLACE FUNCTION refresh_campaign_performance_views_new()
RETURNS void AS $$
BEGIN
    -- Currently using regular views, but this function is ready for materialized views
    -- REFRESH MATERIALIZED VIEW campaign_performance_summary_new;
    -- REFRESH MATERIALIZED VIEW retailer_campaign_performance_new;
    RAISE NOTICE 'Campaign performance views refreshed successfully';
END;
$$ LANGUAGE plpgsql;

-- Function to calculate engagement rate
CREATE OR REPLACE FUNCTION calculate_engagement_rate_new(
    p_likes INTEGER,
    p_comments INTEGER,
    p_shares INTEGER,
    p_impressions INTEGER
)
RETURNS DECIMAL(5,2) AS $$
BEGIN
    IF p_impressions > 0 THEN
        RETURN ROUND(((p_likes + p_comments + p_shares)::DECIMAL / p_impressions) * 100, 2);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get campaign performance summary
CREATE OR REPLACE FUNCTION get_campaign_summary_new(p_campaign_id UUID)
RETURNS TABLE (
    campaign_name VARCHAR(255),
    total_reach BIGINT,
    total_engagement BIGINT,
    avg_engagement_rate DECIMAL(5,2),
    total_posts BIGINT,
    performance_tier TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cps.campaign_name,
        cps.total_reach,
        cps.total_engagement,
        cps.avg_engagement_rate,
        cps.total_posts,
        cps.performance_tier
    FROM campaign_performance_summary_new cps
    WHERE cps.campaign_id = p_campaign_id;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE campaigns_new IS 'Master campaign records with Ayrshare-based social media analytics';
COMMENT ON TABLE social_accounts_new IS 'Social media accounts connected to Ayrshare for analytics';
COMMENT ON TABLE campaign_posts_new IS 'Posts published as part of campaigns';
COMMENT ON TABLE campaign_analytics_new IS 'Post-level analytics data from Ayrshare API';
COMMENT ON TABLE account_performance_new IS 'Account-level performance metrics and aggregations';
COMMENT ON TABLE email_campaigns_new IS 'Email campaign metrics without ROI calculations';

COMMENT ON VIEW campaign_performance_summary_new IS 'Aggregated campaign performance metrics for dashboard consumption';
COMMENT ON VIEW retailer_campaign_performance_new IS 'Retailer-specific campaign performance with rankings';
COMMENT ON VIEW platform_performance_summary_new IS 'Platform-level performance comparison and distribution';

-- Grant appropriate permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;