-- Clean All Platform Reform Schema
-- Handles existing objects properly

-- =====================================================
-- 1. DROP EXISTING OBJECTS IF THEY EXIST
-- =====================================================

-- Drop existing function
DROP FUNCTION IF EXISTS get_top_performing_with_platform_breakdown(character varying, integer);
DROP FUNCTION IF EXISTS get_platform_metrics_breakdown(date, date, uuid);
DROP FUNCTION IF EXISTS generate_platform_trends();

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view platform trends" ON platform_trends;

-- Drop existing views
DROP VIEW IF EXISTS platform_trends_chart_data;
DROP MATERIALIZED VIEW IF EXISTS all_platform_metrics_cache;
DROP VIEW IF EXISTS top_performing_retailers_cross_platform;
DROP VIEW IF EXISTS top_performing_campaigns_cross_platform;
DROP VIEW IF EXISTS all_platform_summary;

-- =====================================================
-- 2. CREATE PLATFORM_TRENDS TABLE (IF NOT EXISTS)
-- =====================================================

CREATE TABLE IF NOT EXISTS platform_trends (
    trend_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,
    campaign_id UUID,
    retailer_id UUID,
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance (IF NOT EXISTS)
CREATE INDEX IF NOT EXISTS idx_platform_trends_platform ON platform_trends(platform);
CREATE INDEX IF NOT EXISTS idx_platform_trends_date ON platform_trends(trend_date);
CREATE INDEX IF NOT EXISTS idx_platform_trends_campaign ON platform_trends(campaign_id);
CREATE INDEX IF NOT EXISTS idx_platform_trends_retailer ON platform_trends(retailer_id);
CREATE INDEX IF NOT EXISTS idx_platform_trends_platform_date ON platform_trends(platform, trend_date);

-- Add unique constraint (IF NOT EXISTS)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'platform_trends_unique_key'
    ) THEN
        ALTER TABLE platform_trends 
        ADD CONSTRAINT platform_trends_unique_key 
        UNIQUE(platform, campaign_id, retailer_id, trend_date);
    END IF;
END $$;

-- =====================================================
-- 3. CREATE SIMPLIFIED VIEWS
-- =====================================================

-- All Platform Summary (simplified)
CREATE OR REPLACE VIEW all_platform_summary AS
SELECT 
    'all_platforms' as view_type,
    COUNT(DISTINCT platform) as total_platforms,
    COUNT(DISTINCT campaign_id) as total_campaigns,
    COUNT(DISTINCT retailer_id) as total_accounts,
    
    -- Aggregated metrics
    SUM(total_impressions) as total_impressions,
    SUM(total_reach) as total_reach,
    SUM(total_engagement) as total_engagement,
    SUM(total_link_clicks) as total_link_clicks,
    SUM(new_followers) as new_followers,
    
    -- Average engagement rate
    ROUND(AVG(avg_engagement_rate), 2) as avg_engagement_rate,
    
    -- Last updated
    MAX(trend_date) as last_updated
    
FROM platform_trends;

-- Platform Trends Chart Data (simplified)
CREATE OR REPLACE VIEW platform_trends_chart_data AS
SELECT 
    trend_date,
    platform,
    
    -- Daily metrics
    SUM(total_reach) as daily_reach,
    ROUND(AVG(avg_engagement_rate), 2) as daily_engagement_rate,
    SUM(total_link_clicks) as daily_link_clicks,
    SUM(new_followers) as daily_new_followers,
    
    -- 7-day moving averages for smoother trends
    ROUND(AVG(SUM(total_reach)) OVER (
        PARTITION BY platform 
        ORDER BY trend_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 0) as reach_7day_avg,
    
    ROUND(AVG(AVG(avg_engagement_rate)) OVER (
        PARTITION BY platform 
        ORDER BY trend_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 2) as engagement_rate_7day_avg

FROM platform_trends
WHERE trend_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY trend_date, platform
ORDER BY trend_date DESC, platform;

-- =====================================================
-- 4. CREATE SIMPLIFIED FUNCTIONS
-- =====================================================

-- Simple function to get platform metrics breakdown
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
    total_posts BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pt.platform,
        SUM(pt.total_reach)::BIGINT as total_reach,
        ROUND(AVG(pt.avg_engagement_rate), 2) as avg_engagement_rate,
        SUM(pt.total_link_clicks)::BIGINT as total_link_clicks,
        SUM(pt.new_followers)::BIGINT as new_followers,
        SUM(pt.total_posts)::BIGINT as total_posts
        
    FROM platform_trends pt
    WHERE pt.trend_date BETWEEN p_start_date AND p_end_date
    AND (p_retailer_id IS NULL OR pt.retailer_id = p_retailer_id)
    GROUP BY pt.platform
    ORDER BY avg_engagement_rate DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. RLS POLICIES
-- =====================================================

-- Enable RLS on platform_trends
ALTER TABLE platform_trends ENABLE ROW LEVEL SECURITY;

-- Create policy for platform_trends
CREATE POLICY "Users can view platform trends" ON platform_trends
    FOR SELECT USING (true); -- Simplified policy - allow all reads

-- =====================================================
-- 6. HELPER FUNCTIONS FOR DATA GENERATION
-- =====================================================

-- Simple function to generate platform trends (optional)
CREATE OR REPLACE FUNCTION generate_simple_platform_trends()
RETURNS void AS $$
BEGIN
    -- This function can be called to generate basic trend data
    -- Implementation would go here if needed
    RAISE NOTICE 'Platform trends generation function created';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 7. VERIFICATION QUERIES
-- =====================================================

-- Check if table exists and has structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'platform_trends'
ORDER BY ordinal_position;

-- Check indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'platform_trends';

-- Check constraints
SELECT 
    conname,
    contype,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'platform_trends'::regclass;