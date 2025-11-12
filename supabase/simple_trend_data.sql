-- Simple Trend Data Population
-- Direct insert without dependencies

-- Clear existing data
TRUNCATE TABLE platform_trends CASCADE;

-- Insert simple trend data for last 30 days - Facebook
INSERT INTO platform_trends (
    platform, campaign_id, retailer_id, trend_date,
    total_reach, avg_engagement_rate, total_link_clicks, new_followers,
    total_impressions, total_engagement, total_posts
)
SELECT 
    'facebook' as platform,
    uuid_generate_v4() as campaign_id,
    uuid_generate_v4() as retailer_id,
    CURRENT_DATE - (day_offset || ' days')::interval as trend_date,
    (3000 + (random() * 1500)::integer + (sin(day_offset * 0.2) * 450)::integer)::integer as total_reach,
    (4.5 + (random() * 3.0) + (sin(day_offset * 0.1) * 1.0))::numeric(5,2) as avg_engagement_rate,
    (120 + (random() * 80)::integer)::integer as total_link_clicks,
    (25 + (random() * 20)::integer)::integer as new_followers,
    (4500 + (random() * 750)::integer)::integer as total_impressions,
    (240 + (random() * 50)::integer)::integer as total_engagement,
    (1 + (random() * 3)::integer) as total_posts
FROM generate_series(0, 29) as day_offset;

-- Insert simple trend data for last 30 days - Instagram
INSERT INTO platform_trends (
    platform, campaign_id, retailer_id, trend_date,
    total_reach, avg_engagement_rate, total_link_clicks, new_followers,
    total_impressions, total_engagement, total_posts
)
SELECT 
    'instagram' as platform,
    uuid_generate_v4() as campaign_id,
    uuid_generate_v4() as retailer_id,
    CURRENT_DATE - (day_offset || ' days')::interval as trend_date,
    (2500 + (random() * 1200)::integer + (sin(day_offset * 0.2) * 360)::integer)::integer as total_reach,
    (6.2 + (random() * 3.0) + (sin(day_offset * 0.1) * 1.0))::numeric(5,2) as avg_engagement_rate,
    (80 + (random() * 50)::integer)::integer as total_link_clicks,
    (45 + (random() * 30)::integer)::integer as new_followers,
    (3750 + (random() * 600)::integer)::integer as total_impressions,
    (200 + (random() * 50)::integer)::integer as total_engagement,
    (1 + (random() * 3)::integer) as total_posts
FROM generate_series(0, 29) as day_offset;

-- Insert simple trend data for last 30 days - Twitter
INSERT INTO platform_trends (
    platform, campaign_id, retailer_id, trend_date,
    total_reach, avg_engagement_rate, total_link_clicks, new_followers,
    total_impressions, total_engagement, total_posts
)
SELECT 
    'twitter' as platform,
    uuid_generate_v4() as campaign_id,
    uuid_generate_v4() as retailer_id,
    CURRENT_DATE - (day_offset || ' days')::interval as trend_date,
    (1800 + (random() * 800)::integer + (sin(day_offset * 0.2) * 240)::integer)::integer as total_reach,
    (2.8 + (random() * 3.0) + (sin(day_offset * 0.1) * 1.0))::numeric(5,2) as avg_engagement_rate,
    (90 + (random() * 60)::integer)::integer as total_link_clicks,
    (20 + (random() * 15)::integer)::integer as new_followers,
    (2700 + (random() * 400)::integer)::integer as total_impressions,
    (144 + (random() * 50)::integer)::integer as total_engagement,
    (1 + (random() * 3)::integer) as total_posts
FROM generate_series(0, 29) as day_offset;

-- Insert simple trend data for last 30 days - LinkedIn
INSERT INTO platform_trends (
    platform, campaign_id, retailer_id, trend_date,
    total_reach, avg_engagement_rate, total_link_clicks, new_followers,
    total_impressions, total_engagement, total_posts
)
SELECT 
    'linkedin' as platform,
    uuid_generate_v4() as campaign_id,
    uuid_generate_v4() as retailer_id,
    CURRENT_DATE - (day_offset || ' days')::interval as trend_date,
    (1200 + (random() * 600)::integer + (sin(day_offset * 0.2) * 180)::integer)::integer as total_reach,
    (3.5 + (random() * 3.0) + (sin(day_offset * 0.1) * 1.0))::numeric(5,2) as avg_engagement_rate,
    (150 + (random() * 100)::integer)::integer as total_link_clicks,
    (15 + (random() * 10)::integer)::integer as new_followers,
    (1800 + (random() * 300)::integer)::integer as total_impressions,
    (96 + (random() * 50)::integer)::integer as total_engagement,
    (1 + (random() * 3)::integer) as total_posts
FROM generate_series(0, 29) as day_offset;

-- Verify data was inserted
SELECT 
    platform,
    COUNT(*) as records,
    MIN(trend_date) as earliest_date,
    MAX(trend_date) as latest_date,
    ROUND(AVG(avg_engagement_rate), 2) as avg_engagement,
    SUM(total_reach) as total_reach
FROM platform_trends 
GROUP BY platform 
ORDER BY platform;

-- Show recent data sample
SELECT 
    platform,
    trend_date,
    total_reach,
    avg_engagement_rate,
    total_link_clicks,
    new_followers
FROM platform_trends 
WHERE trend_date >= CURRENT_DATE - INTERVAL '5 days'
ORDER BY platform, trend_date DESC
LIMIT 20;