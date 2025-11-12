-- Retailer Campaigns Schema
-- Extended schema for retailer-specific campaign data with platform metrics
-- =====================================================
-- 1. RETAILERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS retailers (
    retailer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    brand_id UUID REFERENCES users(id),
    -- Contact Information
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    -- Business Information
    store_type VARCHAR(100), -- 'boutique', 'department', 'online', 'flagship'
    established_date DATE,
    -- Performance Metrics
    total_campaigns INTEGER DEFAULT 0,
    avg_performance_score NUMERIC(3,2) DEFAULT 0,
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. RETAILER CAMPAIGNS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS retailer_campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID REFERENCES retailers(retailer_id) ON DELETE CASCADE,
    brand_id UUID REFERENCES users(id),
    -- Campaign Information
    campaign_name VARCHAR(255) NOT NULL,
    campaign_status VARCHAR(20) DEFAULT 'active' CHECK (campaign_status IN ('active', 'paused', 'completed', 'draft')),
    campaign_type VARCHAR(20) DEFAULT 'mixed' CHECK (campaign_type IN ('email', 'social', 'mixed')),
    -- Date Range
    start_date DATE NOT NULL,
    end_date DATE,
    duration_days INTEGER DEFAULT 0,
    -- Performance Metrics
    performance_tier VARCHAR(20) DEFAULT 'standard' CHECK (performance_tier IN ('high', 'good', 'standard')),
    trend_direction VARCHAR(10) DEFAULT 'stable' CHECK (trend_direction IN ('up', 'down', 'stable')),
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. RETAILER PLATFORM PERFORMANCE TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS retailer_platform_performance (
    performance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES retailer_campaigns(campaign_id) ON DELETE CASCADE,
    retailer_id UUID REFERENCES retailers(retailer_id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    -- Core Metrics (Ayrshare Compatible)
    impressions BIGINT DEFAULT 0,
    reach BIGINT DEFAULT 0,
    engagement BIGINT DEFAULT 0,
    engagement_rate NUMERIC(5,2) DEFAULT 0,
    -- Facebook Specific Metrics
    facebook_shares_count INTEGER DEFAULT 0,
    facebook_comments_count INTEGER DEFAULT 0,
    facebook_like_count INTEGER DEFAULT 0,
    facebook_reactions JSONB DEFAULT '{}', -- {"like": 100, "love": 50, "haha": 10, "wow": 5}
    -- Instagram Specific Metrics
    instagram_like_count INTEGER DEFAULT 0,
    instagram_comments_count INTEGER DEFAULT 0,
    instagram_saved_count INTEGER DEFAULT 0,
    instagram_shares_count INTEGER DEFAULT 0,
    -- LinkedIn Specific Metrics
    linkedin_like_count INTEGER DEFAULT 0,
    linkedin_comments_count INTEGER DEFAULT 0,
    linkedin_share_count INTEGER DEFAULT 0,
    linkedin_reactions JSONB DEFAULT '{}', -- {"like": 50, "praise": 15, "empathy": 5, "interest": 3}
    -- Twitter Specific Metrics
    twitter_like_count INTEGER DEFAULT 0,
    twitter_retweet_count INTEGER DEFAULT 0,
    twitter_reply_count INTEGER DEFAULT 0,
    twitter_bookmark_count INTEGER DEFAULT 0,
    -- Raw Ayrshare Data (for future API integration)
    ayrshare_raw_data JSONB DEFAULT '{}',
    -- Timestamps
    analytics_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. INDEXES FOR PERFORMANCE
-- =====================================================
-- Retailers Indexes
CREATE INDEX IF NOT EXISTS idx_retailers_brand_id ON retailers(brand_id);
CREATE INDEX IF NOT EXISTS idx_retailers_region ON retailers(region);
CREATE INDEX IF NOT EXISTS idx_retailers_status ON retailers(status);

-- Retailer Campaigns Indexes
CREATE INDEX IF NOT EXISTS idx_retailer_campaigns_retailer_id ON retailer_campaigns(retailer_id);
CREATE INDEX IF NOT EXISTS idx_retailer_campaigns_brand_id ON retailer_campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_retailer_campaigns_status ON retailer_campaigns(campaign_status);
CREATE INDEX IF NOT EXISTS idx_retailer_campaigns_dates ON retailer_campaigns(start_date, end_date);

-- Platform Performance Indexes
CREATE INDEX IF NOT EXISTS idx_retailer_platform_performance_campaign ON retailer_platform_performance(campaign_id);
CREATE INDEX IF NOT EXISTS idx_retailer_platform_performance_retailer ON retailer_platform_performance(retailer_id);
CREATE INDEX IF NOT EXISTS idx_retailer_platform_performance_platform ON retailer_platform_performance(platform);
CREATE INDEX IF NOT EXISTS idx_retailer_platform_performance_date ON retailer_platform_performance(analytics_date);

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_platform_performance ENABLE ROW LEVEL SECURITY;

-- Retailer Access Policies
CREATE POLICY "Retailers can view their own data" ON retailers
    FOR SELECT USING (
        retailer_id = auth.uid() OR 
        brand_id = auth.uid() OR
        auth.uid() IN (SELECT id FROM users WHERE user_type = 'admin')
    );

CREATE POLICY "Retailers can view their own campaigns" ON retailer_campaigns
    FOR SELECT USING (
        retailer_id IN (SELECT retailer_id FROM retailers WHERE retailer_id = auth.uid()) OR
        brand_id = auth.uid() OR
        auth.uid() IN (SELECT id FROM users WHERE user_type = 'admin')
    );

CREATE POLICY "Retailers can view their platform performance" ON retailer_platform_performance
    FOR SELECT USING (
        retailer_id IN (SELECT retailer_id FROM retailers WHERE retailer_id = auth.uid()) OR
        campaign_id IN (
            SELECT campaign_id FROM retailer_campaigns 
            WHERE brand_id = auth.uid()
        ) OR
        auth.uid() IN (SELECT id FROM users WHERE user_type = 'admin')
    );

-- =====================================================
-- 6. HELPER VIEWS
-- =====================================================
-- Retailer Campaign Dashboard View
CREATE OR REPLACE VIEW retailer_campaign_dashboard AS
SELECT 
    rc.*,
    r.retailer_name,
    r.region,
    -- Platform Performance Aggregation
    COALESCE(
        (SELECT jsonb_object_agg(
            rpp.platform,
            jsonb_build_object(
                'impressions', rpp.impressions,
                'reach', rpp.reach,
                'engagement', rpp.engagement,
                'engagement_rate', rpp.engagement_rate,
                'facebook_shares_count', rpp.facebook_shares_count,
                'facebook_comments_count', rpp.facebook_comments_count,
                'facebook_like_count', rpp.facebook_like_count,
                'facebook_reactions', rpp.facebook_reactions,
                'instagram_like_count', rpp.instagram_like_count,
                'instagram_comments_count', rpp.instagram_comments_count,
                'instagram_saved_count', rpp.instagram_saved_count,
                'instagram_shares_count', rpp.instagram_shares_count,
                'linkedin_like_count', rpp.linkedin_like_count,
                'linkedin_comments_count', rpp.linkedin_comments_count,
                'linkedin_share_count', rpp.linkedin_share_count,
                'linkedin_reactions', rpp.linkedin_reactions,
                'twitter_like_count', rpp.twitter_like_count,
                'twitter_retweet_count', rpp.twitter_retweet_count,
                'twitter_reply_count', rpp.twitter_reply_count,
                'twitter_bookmark_count', rpp.twitter_bookmark_count
            )
        )
         FROM retailer_platform_performance rpp 
         WHERE rpp.campaign_id = rc.campaign_id), 
        '{}'::jsonb
    ) as platform_performance
FROM retailer_campaigns rc
LEFT JOIN retailers r ON rc.retailer_id = r.retailer_id
ORDER BY rc.last_updated DESC;

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================
-- Function to get retailer campaigns with platform data
CREATE OR REPLACE FUNCTION get_retailer_campaigns(p_retailer_id UUID DEFAULT NULL, p_brand_id UUID DEFAULT NULL)
RETURNS TABLE (
    campaign_id UUID,
    campaign_name VARCHAR(255),
    campaign_status VARCHAR(20),
    campaign_type VARCHAR(20),
    start_date DATE,
    end_date DATE,
    duration_days INTEGER,
    performance_tier VARCHAR(20),
    trend_direction VARCHAR(10),
    retailer_name VARCHAR(255),
    region VARCHAR(100),
    platform_performance JSONB,
    last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        rcd.campaign_id,
        rcd.campaign_name,
        rcd.campaign_status,
        rcd.campaign_type,
        rcd.start_date,
        rcd.end_date,
        rcd.duration_days,
        rcd.performance_tier,
        rcd.trend_direction,
        rcd.retailer_name,
        rcd.region,
        rcd.platform_performance,
        rcd.last_updated
    FROM retailer_campaign_dashboard rcd
    WHERE (p_retailer_id IS NULL OR rcd.retailer_id = p_retailer_id)
    AND (p_brand_id IS NULL OR rcd.brand_id = p_brand_id)
    ORDER BY rcd.last_updated DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get retailers list
CREATE OR REPLACE FUNCTION get_retailers_list(p_brand_id UUID DEFAULT NULL)
RETURNS TABLE (
    retailer_id UUID,
    retailer_name VARCHAR(255),
    region VARCHAR(100),
    total_campaigns INTEGER,
    avg_performance_score NUMERIC(3,2),
    status VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.retailer_id,
        r.retailer_name,
        r.region,
        r.total_campaigns,
        r.avg_performance_score,
        r.status
    FROM retailers r
    WHERE (p_brand_id IS NULL OR r.brand_id = p_brand_id)
    AND r.status = 'active'
    ORDER BY r.retailer_name;
END;
$$ LANGUAGE plpgsql;

-- Success message
SELECT 'Retailer Campaigns Schema created successfully!' as status;