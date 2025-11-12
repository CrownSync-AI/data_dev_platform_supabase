-- All Platform Reform Dummy Data
-- Populate data for the reformed "All Platform" view with trends and timestamps

-- =====================================================
-- 1. GENERATE PLATFORM TRENDS DATA
-- =====================================================

-- First, call the function to generate trends from existing data
SELECT generate_platform_trends();

-- Add additional trend data points for better visualization
INSERT INTO platform_trends (
    platform, campaign_id, retailer_id, trend_date,
    total_reach, avg_engagement_rate, total_link_clicks, new_followers,
    total_impressions, total_engagement, total_posts
)
SELECT 
    platforms.platform,
    c.campaign_id,
    u.id as retailer_id,
    CURRENT_DATE - (series.day_offset || ' days')::interval as trend_date,
    
    -- Generate realistic trending data
    (1000 + random() * 5000 + 
     CASE platforms.platform 
         WHEN 'facebook' THEN 2000 
         WHEN 'instagram' THEN 1500 
         WHEN 'linkedin' THEN 800 
         WHEN 'twitter' THEN 1200 
         ELSE 1000 
     END)::integer as total_reach,
    
    (2.0 + random() * 8.0 + 
     CASE platforms.platform 
         WHEN 'instagram' THEN 2.0 
         WHEN 'facebook' THEN 1.5 
         WHEN 'linkedin' THEN 1.0 
         WHEN 'twitter' THEN 0.5 
         ELSE 1.0 
     END)::numeric(5,2) as avg_engagement_rate,
    
    (10 + random() * 200 + 
     CASE platforms.platform 
         WHEN 'linkedin' THEN 100 
         WHEN 'facebook' THEN 80 
         WHEN 'twitter' THEN 60 
         WHEN 'instagram' THEN 40 
         ELSE 50 
     END)::integer as total_link_clicks,
    
    (random() * 50 + 
     CASE platforms.platform 
         WHEN 'instagram' THEN 30 
         WHEN 'facebook' THEN 20 
         WHEN 'twitter' THEN 15 
         WHEN 'linkedin' THEN 10 
         ELSE 15 
     END)::integer as new_followers,
    
    -- Additional metrics
    (1200 + random() * 6000)::integer as total_impressions,
    (50 + random() * 500)::integer as total_engagement,
    (1 + random() * 5)::integer as total_posts

FROM (
    SELECT unnest(ARRAY['facebook', 'instagram', 'twitter', 'linkedin']) as platform
) platforms
CROSS JOIN (
    SELECT generate_series(0, 29) as day_offset
) series
CROSS JOIN campaigns_new c
CROSS JOIN (
    SELECT id FROM users WHERE user_type = 'retailer' ORDER BY random() LIMIT 10
) u
WHERE random() > 0.3 -- Only populate ~70% of possible combinations for realism
ON CONFLICT (platform, campaign_id, retailer_id, trend_date) DO NOTHING;

-- =====================================================
-- 2. UPDATE EXISTING PLATFORM_SPECIFIC_METRICS WITH BETTER TIMESTAMPS
-- =====================================================

-- Update analytics_date to have better distribution over the last 30 days
UPDATE platform_specific_metrics 
SET analytics_date = CURRENT_DATE - (
    CASE 
        WHEN random() < 0.4 THEN (random() * 7)::integer  -- 40% in last week
        WHEN random() < 0.7 THEN (7 + random() * 14)::integer  -- 30% in 2nd-3rd week
        ELSE (21 + random() * 9)::integer  -- 30% in 4th week
    END
)
WHERE analytics_date IS NULL OR analytics_date = CURRENT_DATE;

-- =====================================================
-- 3. CREATE SAMPLE ALL PLATFORM METRICS SUMMARY
-- =====================================================

-- Create a materialized view for better performance (optional)
CREATE MATERIALIZED VIEW IF NOT EXISTS all_platform_metrics_cache AS
SELECT 
    -- Overall totals
    SUM(CASE WHEN platform = 'facebook' THEN total_reach ELSE 0 END) as facebook_reach,
    SUM(CASE WHEN platform = 'instagram' THEN total_reach ELSE 0 END) as instagram_reach,
    SUM(CASE WHEN platform = 'twitter' THEN total_reach ELSE 0 END) as twitter_reach,
    SUM(CASE WHEN platform = 'linkedin' THEN total_reach ELSE 0 END) as linkedin_reach,
    
    ROUND(AVG(CASE WHEN platform = 'facebook' THEN avg_engagement_rate END), 2) as facebook_engagement_rate,
    ROUND(AVG(CASE WHEN platform = 'instagram' THEN avg_engagement_rate END), 2) as instagram_engagement_rate,
    ROUND(AVG(CASE WHEN platform = 'twitter' THEN avg_engagement_rate END), 2) as twitter_engagement_rate,
    ROUND(AVG(CASE WHEN platform = 'linkedin' THEN avg_engagement_rate END), 2) as linkedin_engagement_rate,
    
    SUM(CASE WHEN platform = 'facebook' THEN total_link_clicks ELSE 0 END) as facebook_link_clicks,
    SUM(CASE WHEN platform = 'instagram' THEN total_link_clicks ELSE 0 END) as instagram_link_clicks,
    SUM(CASE WHEN platform = 'twitter' THEN total_link_clicks ELSE 0 END) as twitter_link_clicks,
    SUM(CASE WHEN platform = 'linkedin' THEN total_link_clicks ELSE 0 END) as linkedin_link_clicks,
    
    SUM(CASE WHEN platform = 'facebook' THEN new_followers ELSE 0 END) as facebook_new_followers,
    SUM(CASE WHEN platform = 'instagram' THEN new_followers ELSE 0 END) as instagram_new_followers,
    SUM(CASE WHEN platform = 'twitter' THEN new_followers ELSE 0 END) as twitter_new_followers,
    SUM(CASE WHEN platform = 'linkedin' THEN new_followers ELSE 0 END) as linkedin_new_followers,
    
    -- Cross-platform totals
    SUM(total_reach) as total_reach_all_platforms,
    ROUND(AVG(avg_engagement_rate), 2) as avg_engagement_rate_all_platforms,
    SUM(total_link_clicks) as total_link_clicks_all_platforms,
    SUM(new_followers) as total_new_followers_all_platforms,
    
    -- Metadata
    COUNT(DISTINCT platform) as active_platforms,
    COUNT(DISTINCT campaign_id) as active_campaigns,
    COUNT(DISTINCT retailer_id) as active_retailers,
    MAX(trend_date) as last_updated
    
FROM platform_trends
WHERE trend_date >= CURRENT_DATE - INTERVAL '30 days';

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW all_platform_metrics_cache;

-- =====================================================
-- 4. CREATE SAMPLE TREND DATA FOR CHARTS
-- =====================================================

-- Create a view for trend chart data
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
    ), 2) as engagement_rate_7day_avg,
    
    ROUND(AVG(SUM(total_link_clicks)) OVER (
        PARTITION BY platform 
        ORDER BY trend_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 0) as link_clicks_7day_avg,
    
    ROUND(AVG(SUM(new_followers)) OVER (
        PARTITION BY platform 
        ORDER BY trend_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 0) as new_followers_7day_avg

FROM platform_trends
WHERE trend_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY trend_date, platform
ORDER BY trend_date DESC, platform;

-- =====================================================
-- 5. SAMPLE QUERIES FOR TESTING
-- =====================================================

-- Test query: Get platform metrics breakdown
SELECT * FROM get_platform_metrics_breakdown();

-- Test query: Get top performing campaigns with platform breakdown
SELECT * FROM get_top_performing_with_platform_breakdown('campaigns', 5);

-- Test query: Get top performing retailers with platform breakdown
SELECT * FROM get_top_performing_with_platform_breakdown('retailers', 5);

-- Test query: Get all platform summary
SELECT * FROM all_platform_summary;

-- Test query: Get trend chart data
SELECT * FROM platform_trends_chart_data 
WHERE trend_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY trend_date DESC, platform;

-- =====================================================
-- 6. DATA VERIFICATION
-- =====================================================

-- Verify data population
SELECT 
    'Platform Trends' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT platform) as unique_platforms,
    COUNT(DISTINCT trend_date) as unique_dates,
    MIN(trend_date) as earliest_date,
    MAX(trend_date) as latest_date
FROM platform_trends

UNION ALL

SELECT 
    'Platform Specific Metrics' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT platform) as unique_platforms,
    COUNT(DISTINCT analytics_date) as unique_dates,
    MIN(analytics_date) as earliest_date,
    MAX(analytics_date) as latest_date
FROM platform_specific_metrics;

-- Platform performance summary
SELECT 
    platform,
    COUNT(*) as trend_records,
    ROUND(AVG(avg_engagement_rate), 2) as avg_engagement_rate,
    SUM(total_reach) as total_reach,
    SUM(total_link_clicks) as total_link_clicks,
    SUM(new_followers) as total_new_followers
FROM platform_trends
GROUP BY platform
ORDER BY avg_engagement_rate DESC;

-- Campaign performance with platform breakdown
SELECT 
    c.campaign_name,
    COUNT(DISTINCT pt.platform) as platforms_active,
    ROUND(AVG(pt.avg_engagement_rate), 2) as avg_engagement_rate,
    SUM(pt.total_reach) as total_reach
FROM campaigns_new c
JOIN platform_trends pt ON c.campaign_id = pt.campaign_id
GROUP BY c.campaign_id, c.campaign_name
ORDER BY avg_engagement_rate DESC
LIMIT 10;