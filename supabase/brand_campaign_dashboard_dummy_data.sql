-- Brand Campaign Dashboard Dummy Data
-- Ayrshare-compatible data for card-based campaign dashboard

-- =====================================================
-- 1. BRAND CAMPAIGN CARDS DATA
-- =====================================================

-- Clear existing data
TRUNCATE TABLE brand_campaign_cards CASCADE;

-- Insert campaign cards with realistic luxury brand campaigns
INSERT INTO brand_campaign_cards (
    campaign_id, brand_id, campaign_name, campaign_status, campaign_type,
    start_date, end_date, avg_click_rate, total_reach, total_engagement,
    participating_retailers_count, total_emails_sent, performance_tier, trend_direction
) VALUES
-- High Performing Campaigns
(
    uuid_generate_v4(), 
    (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
    'Spring Collection Preview',
    'completed',
    'mixed',
    '2024-12-01',
    '2025-01-01',
    2.9,
    285000,
    24500,
    5,
    1500,
    'high',
    'up'
),
(
    uuid_generate_v4(),
    (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
    'Holiday Luxury Campaign',
    'paused',
    'email',
    '2024-11-15',
    '2025-01-16',
    2.9,
    198000,
    18200,
    5,
    1500,
    'good',
    'stable'
),
(
    uuid_generate_v4(),
    (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
    'Summer Elegance 2025',
    'draft',
    'social',
    '2025-03-01',
    '2025-05-01',
    2.9,
    0,
    0,
    5,
    1500,
    'standard',
    'stable'
),

-- Additional Campaigns for Better Showcase
(
    uuid_generate_v4(),
    (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
    'Winter Wonderland Exclusive',
    'active',
    'mixed',
    '2024-12-15',
    '2025-02-15',
    3.8,
    312000,
    28900,
    8,
    2200,
    'high',
    'up'
),
(
    uuid_generate_v4(),
    (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
    'Artisan Heritage Collection',
    'completed',
    'social',
    '2024-10-01',
    '2024-12-01',
    2.1,
    156000,
    12400,
    4,
    0,
    'good',
    'down'
),
(
    uuid_generate_v4(),
    (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
    'Timeless Elegance Launch',
    'active',
    'email',
    '2025-01-01',
    '2025-03-01',
    3.2,
    245000,
    21800,
    6,
    1800,
    'high',
    'up'
),
(
    uuid_generate_v4(),
    (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
    'Modern Minimalist Series',
    'paused',
    'mixed',
    '2024-09-15',
    '2024-11-15',
    1.8,
    134000,
    9200,
    3,
    1200,
    'standard',
    'down'
),
(
    uuid_generate_v4(),
    (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
    'Luxury Lifestyle Showcase',
    'active',
    'social',
    '2024-12-20',
    '2025-02-20',
    4.1,
    278000,
    26500,
    7,
    0,
    'high',
    'up'
);

-- =====================================================
-- 2. DETAILED CAMPAIGN METRICS DATA
-- =====================================================

-- Insert detailed metrics for each campaign
INSERT INTO campaign_detailed_metrics (
    campaign_id, emails_sent, emails_delivered, emails_opened, emails_clicked, conversions,
    delivery_trend, open_trend, click_trend, conversion_trend
)
SELECT 
    bcc.campaign_id,
    -- Email Campaign Metrics (based on Ayrshare email structure)
    CASE 
        WHEN bcc.campaign_type IN ('email', 'mixed') THEN bcc.total_emails_sent
        ELSE 0
    END as emails_sent,
    CASE 
        WHEN bcc.campaign_type IN ('email', 'mixed') THEN ROUND(bcc.total_emails_sent * (0.95 + random() * 0.08))
        ELSE 0
    END as emails_delivered,
    CASE 
        WHEN bcc.campaign_type IN ('email', 'mixed') THEN ROUND(bcc.total_emails_sent * (0.65 + random() * 0.15))
        ELSE 0
    END as emails_opened,
    CASE 
        WHEN bcc.campaign_type IN ('email', 'mixed') THEN ROUND(bcc.total_emails_sent * (0.025 + random() * 0.02))
        ELSE 0
    END as emails_clicked,
    CASE 
        WHEN bcc.campaign_type IN ('email', 'mixed') THEN ROUND(bcc.total_emails_sent * (0.008 + random() * 0.007))
        ELSE 0
    END as conversions,
    
    -- Trend indicators
    CASE 
        WHEN bcc.trend_direction = 'up' THEN '+' || (random() * 3 + 0.5)::numeric(3,1) || '%'
        WHEN bcc.trend_direction = 'down' THEN '-' || (random() * 2 + 0.2)::numeric(3,1) || '%'
        ELSE '±0.1%'
    END as delivery_trend,
    CASE 
        WHEN bcc.trend_direction = 'up' THEN '+' || (random() * 2 + 0.3)::numeric(3,1) || '%'
        WHEN bcc.trend_direction = 'down' THEN '-' || (random() * 1.5 + 0.1)::numeric(3,1) || '%'
        ELSE '±0.2%'
    END as open_trend,
    CASE 
        WHEN bcc.trend_direction = 'up' THEN '+' || (random() * 1.5 + 0.2)::numeric(3,1) || '%'
        WHEN bcc.trend_direction = 'down' THEN '-' || (random() * 1 + 0.1)::numeric(3,1) || '%'
        ELSE '±0.1%'
    END as click_trend,
    CASE 
        WHEN bcc.trend_direction = 'up' THEN '+' || (random() * 2 + 0.5)::numeric(3,1) || '%'
        WHEN bcc.trend_direction = 'down' THEN '-' || (random() * 1.2 + 0.2)::numeric(3,1) || '%'
        ELSE '±0.3%'
    END as conversion_trend

FROM brand_campaign_cards bcc;

-- =====================================================
-- 3. PLATFORM PERFORMANCE DATA (Ayrshare Compatible)
-- =====================================================

-- Insert platform performance data for Facebook
INSERT INTO campaign_platform_performance (
    campaign_id, platform, impressions, reach, engagement, clicks, engagement_rate,
    platform_specific_metrics, ayrshare_raw_data
)
SELECT 
    bcc.campaign_id,
    'facebook' as platform,
    ROUND(bcc.total_reach * 1.2 * (0.8 + random() * 0.4)) as impressions,
    ROUND(bcc.total_reach * 0.8 * (0.9 + random() * 0.2)) as reach,
    ROUND(bcc.total_engagement * 0.25 * (0.8 + random() * 0.4)) as engagement,
    ROUND(bcc.total_engagement * 0.08 * (0.1 + random() * 0.1)) as clicks,
    (4.5 + random() * 3)::numeric(5,2) as engagement_rate,
    
    jsonb_build_object(
        'reactions', jsonb_build_object(
            'like', ROUND(bcc.total_engagement * 0.6 * (0.8 + random() * 0.4)),
            'love', ROUND(bcc.total_engagement * 0.15 * (0.8 + random() * 0.4)),
            'haha', ROUND(bcc.total_engagement * 0.08 * (0.8 + random() * 0.4)),
            'wow', ROUND(bcc.total_engagement * 0.05 * (0.8 + random() * 0.4))
        ),
        'video_views', ROUND(bcc.total_reach * 0.3 * (0.8 + random() * 0.4)),
        'page_likes', ROUND(bcc.total_engagement * 0.02 * (0.8 + random() * 0.4))
    ) as platform_specific_metrics,
    
    jsonb_build_object(
        'id', '1397547544885713_' || (random() * 1000000000)::bigint,
        'postUrl', 'https://www.facebook.com/1397547544885713_' || (random() * 1000000000)::bigint,
        'analytics', jsonb_build_object(
            'impressions', ROUND(bcc.total_reach * 1.2 * (0.8 + random() * 0.4)),
            'impressionsUnique', ROUND(bcc.total_reach * 0.8 * (0.9 + random() * 0.2)),
            'likeCount', ROUND(bcc.total_engagement * 0.6 * (0.8 + random() * 0.4)),
            'commentsCount', ROUND(bcc.total_engagement * 0.15 * (0.8 + random() * 0.4)),
            'sharesCount', ROUND(bcc.total_engagement * 0.1 * (0.8 + random() * 0.4))
        ),
        'lastUpdated', NOW()::text
    ) as ayrshare_raw_data
FROM brand_campaign_cards bcc
WHERE bcc.campaign_type IN ('social', 'mixed');

-- Insert platform performance data for Instagram
INSERT INTO campaign_platform_performance (
    campaign_id, platform, impressions, reach, engagement, clicks, engagement_rate,
    platform_specific_metrics, ayrshare_raw_data
)
SELECT 
    bcc.campaign_id,
    'instagram' as platform,
    ROUND(bcc.total_reach * 1.0 * (0.8 + random() * 0.4)) as impressions,
    ROUND(bcc.total_reach * 0.9 * (0.9 + random() * 0.2)) as reach,
    ROUND(bcc.total_engagement * 0.35 * (0.8 + random() * 0.4)) as engagement,
    ROUND(bcc.total_engagement * 0.05 * (0.1 + random() * 0.1)) as clicks,
    (6.2 + random() * 3)::numeric(5,2) as engagement_rate,
    
    jsonb_build_object(
        'saves', ROUND(bcc.total_engagement * 0.12 * (0.8 + random() * 0.4)),
        'profile_visits', ROUND(bcc.total_engagement * 0.25 * (0.8 + random() * 0.4)),
        'story_interactions', ROUND(bcc.total_engagement * 0.18 * (0.8 + random() * 0.4)),
        'reels_plays', ROUND(bcc.total_reach * 0.4 * (0.8 + random() * 0.4))
    ) as platform_specific_metrics,
    
    jsonb_build_object(
        'id', '17856916804' || (random() * 1000000)::bigint,
        'postUrl', 'https://www.instagram.com/p/' || substr(md5(random()::text), 1, 11) || '/',
        'analytics', jsonb_build_object(
            'impressions', ROUND(bcc.total_reach * 1.0 * (0.8 + random() * 0.4)),
            'reachCount', ROUND(bcc.total_reach * 0.9 * (0.9 + random() * 0.2)),
            'likeCount', ROUND(bcc.total_engagement * 0.7 * (0.8 + random() * 0.4)),
            'commentsCount', ROUND(bcc.total_engagement * 0.12 * (0.8 + random() * 0.4)),
            'savedCount', ROUND(bcc.total_engagement * 0.12 * (0.8 + random() * 0.4)),
            'mediaProductType', CASE WHEN random() > 0.6 THEN 'REELS' WHEN random() > 0.3 THEN 'STORY' ELSE 'FEED' END
        ),
        'lastUpdated', NOW()::text
    ) as ayrshare_raw_data
FROM brand_campaign_cards bcc
WHERE bcc.campaign_type IN ('social', 'mixed');

-- Insert platform performance data for LinkedIn
INSERT INTO campaign_platform_performance (
    campaign_id, platform, impressions, reach, engagement, clicks, engagement_rate,
    platform_specific_metrics, ayrshare_raw_data
)
SELECT 
    bcc.campaign_id,
    'linkedin' as platform,
    ROUND(bcc.total_reach * 0.6 * (0.8 + random() * 0.4)) as impressions,
    ROUND(bcc.total_reach * 0.7 * (0.9 + random() * 0.2)) as reach,
    ROUND(bcc.total_engagement * 0.15 * (0.8 + random() * 0.4)) as engagement,
    ROUND(bcc.total_engagement * 0.12 * (0.1 + random() * 0.1)) as clicks,
    (3.8 + random() * 3)::numeric(5,2) as engagement_rate,
    
    jsonb_build_object(
        'unique_impressions', ROUND(bcc.total_reach * 0.85 * (0.8 + random() * 0.4)),
        'professional_clicks', ROUND(bcc.total_engagement * 0.15 * (0.8 + random() * 0.4)),
        'reactions', jsonb_build_object(
            'praise', ROUND(bcc.total_engagement * 0.3 * (0.8 + random() * 0.4)),
            'empathy', ROUND(bcc.total_engagement * 0.1 * (0.8 + random() * 0.4)),
            'interest', ROUND(bcc.total_engagement * 0.25 * (0.8 + random() * 0.4))
        )
    ) as platform_specific_metrics,
    
    jsonb_build_object(
        'id', (random() * 1000000000000000)::bigint::text,
        'analytics', jsonb_build_object(
            'impressions', ROUND(bcc.total_reach * 0.6 * (0.8 + random() * 0.4)),
            'engagement', ROUND(bcc.total_engagement * 0.15 * (0.8 + random() * 0.4))
        ),
        'lastUpdated', NOW()::text
    ) as ayrshare_raw_data
FROM brand_campaign_cards bcc
WHERE bcc.campaign_type IN ('social', 'mixed');

-- Insert platform performance data for Twitter
INSERT INTO campaign_platform_performance (
    campaign_id, platform, impressions, reach, engagement, clicks, engagement_rate,
    platform_specific_metrics, ayrshare_raw_data
)
SELECT 
    bcc.campaign_id,
    'twitter' as platform,
    ROUND(bcc.total_reach * 0.8 * (0.8 + random() * 0.4)) as impressions,
    ROUND(bcc.total_reach * 0.75 * (0.9 + random() * 0.2)) as reach,
    ROUND(bcc.total_engagement * 0.2 * (0.8 + random() * 0.4)) as engagement,
    ROUND(bcc.total_engagement * 0.06 * (0.1 + random() * 0.1)) as clicks,
    (2.9 + random() * 3)::numeric(5,2) as engagement_rate,
    
    jsonb_build_object(
        'retweets', ROUND(bcc.total_engagement * 0.2 * (0.8 + random() * 0.4)),
        'bookmarks', ROUND(bcc.total_engagement * 0.08 * (0.8 + random() * 0.4)),
        'profile_clicks', ROUND(bcc.total_engagement * 0.12 * (0.8 + random() * 0.4))
    ) as platform_specific_metrics,
    
    jsonb_build_object(
        'id', (random() * 1000000000000000)::bigint::text,
        'analytics', jsonb_build_object(
            'impressions', ROUND(bcc.total_reach * 0.8 * (0.8 + random() * 0.4)),
            'engagement', ROUND(bcc.total_engagement * 0.2 * (0.8 + random() * 0.4))
        ),
        'lastUpdated', NOW()::text
    ) as ayrshare_raw_data
FROM brand_campaign_cards bcc
WHERE bcc.campaign_type IN ('social', 'mixed');

-- =====================================================
-- 4. RETAILER SUMMARY DATA (Privacy-Restricted)
-- =====================================================

-- Insert aggregated retailer summary data
INSERT INTO campaign_retailer_summary (
    campaign_id, total_participating_retailers, avg_retailer_performance, top_performing_region,
    high_performers, good_performers, standard_performers, regional_performance
)
SELECT 
    bcc.campaign_id,
    bcc.participating_retailers_count,
    (4.5 + random() * 3.5)::numeric(5,2) as avg_retailer_performance,
    CASE (random() * 5)::integer
        WHEN 0 THEN 'East Coast'
        WHEN 1 THEN 'West Coast'
        WHEN 2 THEN 'Central'
        WHEN 3 THEN 'Southeast'
        ELSE 'Northwest'
    END as top_performing_region,
    
    -- Performance distribution
    ROUND(bcc.participating_retailers_count * (0.2 + random() * 0.3)) as high_performers,
    ROUND(bcc.participating_retailers_count * (0.4 + random() * 0.2)) as good_performers,
    ROUND(bcc.participating_retailers_count * (0.2 + random() * 0.3)) as standard_performers,
    
    -- Regional performance (aggregated)
    jsonb_build_object(
        'East Coast', (4.0 + random() * 4.0)::numeric(3,1),
        'West Coast', (4.5 + random() * 3.5)::numeric(3,1),
        'Central', (3.8 + random() * 3.2)::numeric(3,1),
        'Southeast', (4.2 + random() * 3.8)::numeric(3,1),
        'Northwest', (3.9 + random() * 3.6)::numeric(3,1)
    ) as regional_performance

FROM brand_campaign_cards bcc;

-- =====================================================
-- 5. DAILY METRICS DATA (Last 30 Days)
-- =====================================================

-- Insert daily metrics for active and recently completed campaigns
INSERT INTO campaign_daily_metrics (
    campaign_id, metric_date, daily_impressions, daily_reach, daily_engagement, 
    daily_clicks, daily_conversions, daily_engagement_rate, daily_click_rate, daily_conversion_rate
)
SELECT 
    bcc.campaign_id,
    date_series.metric_date,
    
    -- Daily metrics with realistic variation
    ROUND((bcc.total_reach / GREATEST(bcc.duration_days, 1)) * (0.7 + random() * 0.6)) as daily_impressions,
    ROUND((bcc.total_reach / GREATEST(bcc.duration_days, 1)) * (0.6 + random() * 0.5)) as daily_reach,
    ROUND((bcc.total_engagement / GREATEST(bcc.duration_days, 1)) * (0.7 + random() * 0.6)) as daily_engagement,
    ROUND((bcc.total_engagement * 0.1 / GREATEST(bcc.duration_days, 1)) * (0.7 + random() * 0.6)) as daily_clicks,
    ROUND((bcc.total_engagement * 0.02 / GREATEST(bcc.duration_days, 1)) * (0.7 + random() * 0.6)) as daily_conversions,
    
    -- Daily rates
    (bcc.avg_click_rate + (random() - 0.5) * 2)::numeric(5,2) as daily_engagement_rate,
    (bcc.avg_click_rate * 0.3 + (random() - 0.5) * 0.5)::numeric(5,2) as daily_click_rate,
    (bcc.avg_click_rate * 0.1 + (random() - 0.5) * 0.2)::numeric(5,2) as daily_conversion_rate

FROM brand_campaign_cards bcc
CROSS JOIN (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '29 days',
        CURRENT_DATE,
        INTERVAL '1 day'
    )::date as metric_date
) date_series
WHERE bcc.campaign_status IN ('active', 'completed')
AND date_series.metric_date >= bcc.start_date
AND (bcc.end_date IS NULL OR date_series.metric_date <= bcc.end_date);

-- =====================================================
-- 6. CAMPAIGN NOTES DATA (Simple notes, no AI)
-- =====================================================

-- Insert simple performance notes for campaigns
INSERT INTO campaign_notes (
    campaign_id, performance_notes, best_performing_platform
)
SELECT 
    bcc.campaign_id,
    
    -- Simple performance notes
    CASE bcc.performance_tier
        WHEN 'high' THEN 'Strong engagement across all platforms. Email campaigns showing excellent open rates.'
        WHEN 'good' THEN 'Solid performance with room for optimization. Social media engagement is steady.'
        ELSE 'Performance below expectations. Consider reviewing content strategy.'
    END as performance_notes,
    
    -- Best performing platform
    CASE (random() * 4)::integer
        WHEN 0 THEN 'facebook'
        WHEN 1 THEN 'instagram'
        WHEN 2 THEN 'linkedin'
        ELSE 'email'
    END as best_performing_platform

FROM brand_campaign_cards bcc;

-- =====================================================
-- 7. DATA VERIFICATION
-- =====================================================

-- Verify data population
SELECT 
    'Brand Campaign Cards' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN campaign_status = 'active' THEN 1 END) as active_campaigns,
    COUNT(CASE WHEN campaign_status = 'completed' THEN 1 END) as completed_campaigns,
    COUNT(CASE WHEN performance_tier = 'high' THEN 1 END) as high_performers
FROM brand_campaign_cards

UNION ALL

SELECT 
    'Platform Performance Records' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT campaign_id) as unique_campaigns,
    COUNT(DISTINCT platform) as unique_platforms,
    0 as high_performers
FROM campaign_platform_performance

UNION ALL

SELECT 
    'Daily Metrics Records' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT campaign_id) as unique_campaigns,
    COUNT(DISTINCT metric_date) as unique_dates,
    0 as high_performers
FROM campaign_daily_metrics;

-- Sample campaign dashboard view
SELECT 
    campaign_name,
    campaign_status,
    roi_percentage,
    avg_click_rate,
    total_reach,
    participating_retailers_count,
    performance_tier,
    trend_direction
FROM brand_campaign_cards
ORDER BY roi_percentage DESC
LIMIT 5;