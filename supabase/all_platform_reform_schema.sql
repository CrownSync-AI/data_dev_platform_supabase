-- All Platform Reform Schema
-- Enhanced schema for reformed "All Platform" view with trends and timestamps

-- =====================================================
-- 1. PLATFORM TRENDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS platform_trends (
    trend_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,
    campaign_id UUID REFERENCES campaigns_new(campaign_id),
    retailer_id UUID REFERENCES users(id),
    trend_date DATE NOT NULL,
    
    -- Core metrics for trends
    total_reach INTEGER DEFAULT 0,
    avg_engagement_rate NUMERIC(5,2) DEFAULT 0,
    total_link_clicks INTEGER DEFAULT 0,
    new_followers INTEGER DEFAULT 0,
    
    -- Additional metrics
    total_impressions INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    total_posts INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(platform, campaign_id, retailer_id, trend_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_platform_trends_platform ON platform_trends(platform);
CREATE INDEX IF NOT EXISTS idx_platform_trends_date ON platform_trends(trend_date);
CREATE INDEX IF NOT EXISTS idx_platform_trends_campaign ON platform_trends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_platform_trends_retailer ON platform_trends(retailer_id);

-- =====================================================
-- 2. ALL PLATFORM SUMMARY VIEW
-- =====================================================

CREATE OR REPLACE VIEW all_platform_summary AS
WITH platform_aggregates AS (
    SELECT 
        psm.platform,
        SUM(psm.reach) as platform_reach,
        ROUND(AVG(psm.engagement_rate), 2) as platform_avg_engagement_rate,
        SUM(COALESCE(psm.fb_post_clicks, 0) + COALESCE(psm.tw_url_clicks, 0) + COALESCE(psm.li_click_count, 0)) as platform_link_clicks,
        SUM(COALESCE(psm.ig_follows_from_post, 0)) as platform_new_followers,
        COUNT(DISTINCT psm.post_id) as platform_posts_count
    FROM platform_specific_metrics psm
    GROUP BY psm.platform
)
SELECT 
    'all_platforms' as view_type,
    COUNT(DISTINCT psm.platform) as total_platforms,
    COUNT(DISTINCT psm.campaign_id) as total_campaigns,
    COUNT(DISTINCT psm.account_id) as total_accounts,
    
    -- Aggregated metrics
    SUM(psm.impressions) as total_impressions,
    SUM(psm.reach) as total_reach,
    SUM(psm.total_engagement) as total_engagement,
    SUM(COALESCE(psm.fb_post_clicks, 0) + COALESCE(psm.tw_url_clicks, 0) + COALESCE(psm.li_click_count, 0)) as total_link_clicks,
    SUM(COALESCE(psm.ig_follows_from_post, 0)) as new_followers,
    
    -- Average engagement rate across all platforms
    ROUND(AVG(psm.engagement_rate), 2) as avg_engagement_rate,
    
    -- Platform breakdown using subquery
    (
        SELECT jsonb_object_agg(
            pa.platform,
            jsonb_build_object(
                'total_reach', pa.platform_reach,
                'avg_engagement_rate', pa.platform_avg_engagement_rate,
                'total_link_clicks', pa.platform_link_clicks,
                'new_followers', pa.platform_new_followers,
                'total_posts', pa.platform_posts_count
            )
        )
        FROM platform_aggregates pa
    ) as platform_breakdown,
    
    -- Last updated
    MAX(psm.analytics_date) as last_updated
    
FROM platform_specific_metrics psm;

-- =====================================================
-- 3. TOP PERFORMING CAMPAIGNS CROSS-PLATFORM VIEW
-- =====================================================

CREATE OR REPLACE VIEW top_performing_campaigns_cross_platform AS
WITH campaign_platform_metrics AS (
    SELECT 
        psm.campaign_id,
        psm.platform,
        SUM(psm.reach) as platform_reach,
        ROUND(AVG(psm.engagement_rate), 2) as platform_avg_engagement_rate,
        SUM(COALESCE(psm.fb_post_clicks, 0) + COALESCE(psm.tw_url_clicks, 0) + COALESCE(psm.li_click_count, 0)) as platform_link_clicks,
        COUNT(DISTINCT psm.post_id) as platform_posts_count
    FROM platform_specific_metrics psm
    GROUP BY psm.campaign_id, psm.platform
)
SELECT 
    c.campaign_id,
    c.campaign_name,
    c.campaign_type,
    
    -- Cross-platform aggregated metrics
    COUNT(DISTINCT psm.platform) as platforms_count,
    COUNT(DISTINCT psm.account_id) as accounts_count,
    SUM(psm.reach) as total_reach,
    SUM(psm.total_engagement) as total_engagement,
    ROUND(AVG(psm.engagement_rate), 2) as avg_engagement_rate,
    SUM(COALESCE(psm.fb_post_clicks, 0) + COALESCE(psm.tw_url_clicks, 0) + COALESCE(psm.li_click_count, 0)) as total_link_clicks,
    
    -- Platform-specific breakdown using subquery
    (
        SELECT jsonb_object_agg(
            cpm.platform,
            jsonb_build_object(
                'reach', cpm.platform_reach,
                'engagement_rate', cpm.platform_avg_engagement_rate,
                'link_clicks', cpm.platform_link_clicks,
                'posts_count', cpm.platform_posts_count
            )
        )
        FROM campaign_platform_metrics cpm
        WHERE cpm.campaign_id = c.campaign_id
    ) as platform_breakdown,
    
    -- Performance tier
    CASE 
        WHEN AVG(psm.engagement_rate) >= 6 THEN 'High Performance'
        WHEN AVG(psm.engagement_rate) >= 3 THEN 'Good Performance'
        ELSE 'Standard Performance'
    END as performance_tier
    
FROM campaigns_new c
JOIN platform_specific_metrics psm ON c.campaign_id = psm.campaign_id
GROUP BY c.campaign_id, c.campaign_name, c.campaign_type
ORDER BY avg_engagement_rate DESC;

-- =====================================================
-- 4. TOP PERFORMING RETAILERS CROSS-PLATFORM VIEW
-- =====================================================

CREATE OR REPLACE VIEW top_performing_retailers_cross_platform AS
WITH retailer_platform_metrics AS (
    SELECT 
        sa.retailer_id,
        psm.platform,
        SUM(psm.reach) as platform_reach,
        ROUND(AVG(psm.engagement_rate), 2) as platform_avg_engagement_rate,
        SUM(COALESCE(psm.fb_post_clicks, 0) + COALESCE(psm.tw_url_clicks, 0) + COALESCE(psm.li_click_count, 0)) as platform_link_clicks,
        COUNT(DISTINCT psm.post_id) as platform_posts_count
    FROM social_accounts_new sa
    JOIN platform_specific_metrics psm ON sa.account_id = psm.account_id
    GROUP BY sa.retailer_id, psm.platform
)
SELECT 
    u.id as retailer_id,
    'Retailer ' || u.id::text as retailer_name,
    'Unknown Region' as region,
    
    -- Cross-platform aggregated metrics
    COUNT(DISTINCT psm.platform) as platforms_count,
    COUNT(DISTINCT psm.campaign_id) as campaigns_count,
    SUM(psm.reach) as total_reach,
    SUM(psm.total_engagement) as total_engagement,
    ROUND(AVG(psm.engagement_rate), 2) as avg_engagement_rate,
    SUM(COALESCE(psm.fb_post_clicks, 0) + COALESCE(psm.tw_url_clicks, 0) + COALESCE(psm.li_click_count, 0)) as total_link_clicks,
    
    -- Platform-specific breakdown using subquery
    (
        SELECT jsonb_object_agg(
            rpm.platform,
            jsonb_build_object(
                'reach', rpm.platform_reach,
                'engagement_rate', rpm.platform_avg_engagement_rate,
                'link_clicks', rpm.platform_link_clicks,
                'posts_count', rpm.platform_posts_count
            )
        )
        FROM retailer_platform_metrics rpm
        WHERE rpm.retailer_id = u.id
    ) as platform_breakdown,
    
    -- Performance ranking
    ROW_NUMBER() OVER (ORDER BY AVG(psm.engagement_rate) DESC) as performance_rank
    
FROM users u
JOIN social_accounts_new sa ON u.id = sa.retailer_id
JOIN platform_specific_metrics psm ON sa.account_id = psm.account_id
WHERE u.user_type = 'retailer'
GROUP BY u.id
ORDER BY avg_engagement_rate DESC;

-- =====================================================
-- 5. PLATFORM TRENDS AGGREGATION FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION generate_platform_trends()
RETURNS void AS $$
BEGIN
    -- Clear existing trends data
    TRUNCATE TABLE platform_trends;
    
    -- Generate daily trends for the last 30 days
    INSERT INTO platform_trends (
        platform, campaign_id, retailer_id, trend_date,
        total_reach, avg_engagement_rate, total_link_clicks, new_followers,
        total_impressions, total_engagement, total_posts
    )
    SELECT 
        psm.platform,
        psm.campaign_id,
        sa.retailer_id,
        psm.analytics_date as trend_date,
        
        SUM(psm.reach) as total_reach,
        ROUND(AVG(psm.engagement_rate), 2) as avg_engagement_rate,
        SUM(COALESCE(psm.fb_post_clicks, 0) + COALESCE(psm.tw_url_clicks, 0) + COALESCE(psm.li_click_count, 0)) as total_link_clicks,
        SUM(COALESCE(psm.ig_follows_from_post, 0)) as new_followers,
        
        SUM(psm.impressions) as total_impressions,
        SUM(psm.total_engagement) as total_engagement,
        COUNT(DISTINCT psm.post_id) as total_posts
        
    FROM platform_specific_metrics psm
    JOIN social_accounts_new sa ON psm.account_id = sa.account_id
    WHERE psm.analytics_date >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY psm.platform, psm.campaign_id, sa.retailer_id, psm.analytics_date;
    
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. RLS POLICIES
-- =====================================================

-- Enable RLS on platform_trends
ALTER TABLE platform_trends ENABLE ROW LEVEL SECURITY;

-- Policy for platform_trends
CREATE POLICY "Users can view platform trends" ON platform_trends
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM users WHERE user_type IN ('brand', 'admin')
        ) OR 
        retailer_id = auth.uid()
    );

-- =====================================================
-- 7. HELPER FUNCTIONS
-- =====================================================

-- Function to get platform metrics breakdown
CREATE OR REPLACE FUNCTION get_platform_metrics_breakdown(
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE,
    p_retailer_id UUID DEFAULT NULL
)
RETURNS TABLE (
    platform VARCHAR(50),
    total_reach BIGINT,
    avg_engagement_rate NUMERIC(5,2),
    total_link_clicks BIGINT,
    new_followers BIGINT,
    total_posts BIGINT,
    trend_data JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pt.platform,
        SUM(pt.total_reach)::BIGINT as total_reach,
        ROUND(AVG(pt.avg_engagement_rate), 2) as avg_engagement_rate,
        SUM(pt.total_link_clicks)::BIGINT as total_link_clicks,
        SUM(pt.new_followers)::BIGINT as new_followers,
        SUM(pt.total_posts)::BIGINT as total_posts,
        
        -- Trend data for charts
        jsonb_agg(
            jsonb_build_object(
                'date', pt.trend_date,
                'reach', pt.total_reach,
                'engagement_rate', pt.avg_engagement_rate,
                'link_clicks', pt.total_link_clicks,
                'new_followers', pt.new_followers
            ) ORDER BY pt.trend_date
        ) as trend_data
        
    FROM platform_trends pt
    WHERE pt.trend_date BETWEEN p_start_date AND p_end_date
    AND (p_retailer_id IS NULL OR pt.retailer_id = p_retailer_id)
    GROUP BY pt.platform
    ORDER BY avg_engagement_rate DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get top performing items with platform breakdown
CREATE OR REPLACE FUNCTION get_top_performing_with_platform_breakdown(
    p_type VARCHAR(20), -- 'campaigns' or 'retailers'
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    item_id UUID,
    item_name TEXT,
    total_reach BIGINT,
    avg_engagement_rate NUMERIC(5,2),
    total_link_clicks BIGINT,
    platform_breakdown JSONB
) AS $$
BEGIN
    IF p_type = 'campaigns' THEN
        RETURN QUERY
        SELECT 
            tpc.campaign_id as item_id,
            tpc.campaign_name as item_name,
            tpc.total_reach::BIGINT,
            tpc.avg_engagement_rate,
            tpc.total_link_clicks::BIGINT,
            tpc.platform_breakdown
        FROM top_performing_campaigns_cross_platform tpc
        ORDER BY tpc.avg_engagement_rate DESC
        LIMIT p_limit;
    ELSIF p_type = 'retailers' THEN
        RETURN QUERY
        SELECT 
            tpr.retailer_id as item_id,
            tpr.retailer_name as item_name,
            tpr.total_reach::BIGINT,
            tpr.avg_engagement_rate,
            tpr.total_link_clicks::BIGINT,
            tpr.platform_breakdown
        FROM top_performing_retailers_cross_platform tpr
        ORDER BY tpr.avg_engagement_rate DESC
        LIMIT p_limit;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. INDEXES FOR PERFORMANCE
-- =====================================================

-- Additional indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_platform_specific_metrics_analytics_date ON platform_specific_metrics(analytics_date);
CREATE INDEX IF NOT EXISTS idx_platform_specific_metrics_platform_date ON platform_specific_metrics(platform, analytics_date);
CREATE INDEX IF NOT EXISTS idx_social_accounts_retailer_platform ON social_accounts_new(retailer_id, platform);