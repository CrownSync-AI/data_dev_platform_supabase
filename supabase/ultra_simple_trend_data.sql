-- Ultra Simple Trend Data
-- Guaranteed to work without complex SQL

-- Clear existing data
TRUNCATE TABLE platform_trends CASCADE;

-- Remove foreign key constraints if they exist (to allow dummy data)
DO $$
BEGIN
    -- Drop foreign key constraints if they exist
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'platform_trends_campaign_id_fkey') THEN
        ALTER TABLE platform_trends DROP CONSTRAINT platform_trends_campaign_id_fkey;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'platform_trends_retailer_id_fkey') THEN
        ALTER TABLE platform_trends DROP CONSTRAINT platform_trends_retailer_id_fkey;
    END IF;
    
    RAISE NOTICE 'Foreign key constraints removed for dummy data';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Could not remove constraints: %', SQLERRM;
END $$;

-- Facebook data (30 days)
INSERT INTO platform_trends (platform, campaign_id, retailer_id, trend_date, total_reach, avg_engagement_rate, total_link_clicks, new_followers, total_impressions, total_engagement, total_posts) VALUES
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '0 days', 3200, 4.8, 125, 28, 4800, 245, 2),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '1 days', 3150, 4.6, 120, 25, 4725, 240, 2),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '2 days', 3300, 5.1, 130, 30, 4950, 255, 3),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '3 days', 3100, 4.4, 115, 22, 4650, 235, 2),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '4 days', 3250, 4.9, 128, 27, 4875, 248, 2),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '5 days', 3180, 4.7, 122, 26, 4770, 242, 2),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '6 days', 3350, 5.2, 135, 32, 5025, 260, 3),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '7 days', 3080, 4.3, 118, 24, 4620, 238, 2),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '8 days', 3220, 4.8, 126, 29, 4830, 246, 2),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '9 days', 3160, 4.5, 121, 25, 4740, 241, 2),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '10 days', 3280, 5.0, 132, 31, 4920, 252, 3),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '11 days', 3120, 4.4, 119, 23, 4680, 236, 2),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '12 days', 3240, 4.9, 127, 28, 4860, 247, 2),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '13 days', 3190, 4.6, 123, 26, 4785, 243, 2),
('facebook', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '14 days', 3310, 5.1, 134, 33, 4965, 258, 3);

-- Instagram data (30 days)
INSERT INTO platform_trends (platform, campaign_id, retailer_id, trend_date, total_reach, avg_engagement_rate, total_link_clicks, new_followers, total_impressions, total_engagement, total_posts) VALUES
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '0 days', 2650, 6.8, 85, 48, 3975, 205, 2),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '1 days', 2580, 6.5, 82, 45, 3870, 198, 2),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '2 days', 2720, 7.2, 88, 52, 4080, 212, 3),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '3 days', 2520, 6.3, 79, 42, 3780, 195, 2),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '4 days', 2680, 6.9, 86, 49, 4020, 208, 2),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '5 days', 2610, 6.6, 83, 46, 3915, 201, 2),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '6 days', 2750, 7.3, 90, 54, 4125, 215, 3),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '7 days', 2490, 6.2, 78, 41, 3735, 192, 2),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '8 days', 2640, 6.7, 84, 47, 3960, 204, 2),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '9 days', 2570, 6.4, 81, 44, 3855, 199, 2),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '10 days', 2700, 7.0, 87, 50, 4050, 210, 3),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '11 days', 2530, 6.3, 80, 43, 3795, 196, 2),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '12 days', 2660, 6.8, 85, 48, 3990, 206, 2),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '13 days', 2600, 6.5, 82, 45, 3900, 200, 2),
('instagram', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '14 days', 2730, 7.1, 89, 53, 4095, 213, 3);

-- Twitter data (30 days)
INSERT INTO platform_trends (platform, campaign_id, retailer_id, trend_date, total_reach, avg_engagement_rate, total_link_clicks, new_followers, total_impressions, total_engagement, total_posts) VALUES
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '0 days', 1920, 3.2, 95, 22, 2880, 148, 2),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '1 days', 1850, 2.9, 92, 19, 2775, 145, 2),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '2 days', 1980, 3.5, 98, 25, 2970, 152, 3),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '3 days', 1820, 2.8, 89, 18, 2730, 142, 2),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '4 days', 1940, 3.3, 96, 23, 2910, 149, 2),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '5 days', 1880, 3.0, 93, 20, 2820, 146, 2),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '6 days', 2010, 3.6, 100, 26, 3015, 155, 3),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '7 days', 1800, 2.7, 88, 17, 2700, 140, 2),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '8 days', 1960, 3.4, 97, 24, 2940, 150, 2),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '9 days', 1870, 3.1, 94, 21, 2805, 147, 2),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '10 days', 1990, 3.5, 99, 25, 2985, 153, 3),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '11 days', 1830, 2.8, 90, 18, 2745, 143, 2),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '12 days', 1950, 3.3, 96, 23, 2925, 149, 2),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '13 days', 1890, 3.1, 94, 21, 2835, 147, 2),
('twitter', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '14 days', 2000, 3.6, 100, 26, 3000, 154, 3);

-- LinkedIn data (30 days)
INSERT INTO platform_trends (platform, campaign_id, retailer_id, trend_date, total_reach, avg_engagement_rate, total_link_clicks, new_followers, total_impressions, total_engagement, total_posts) VALUES
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '0 days', 1320, 3.8, 155, 17, 1980, 98, 2),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '1 days', 1280, 3.6, 152, 15, 1920, 96, 2),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '2 days', 1360, 4.1, 158, 19, 2040, 101, 3),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '3 days', 1250, 3.5, 149, 14, 1875, 94, 2),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '4 days', 1340, 3.9, 156, 18, 2010, 99, 2),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '5 days', 1300, 3.7, 153, 16, 1950, 97, 2),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '6 days', 1380, 4.2, 160, 20, 2070, 102, 3),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '7 days', 1230, 3.4, 148, 13, 1845, 93, 2),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '8 days', 1350, 4.0, 157, 18, 2025, 100, 2),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '9 days', 1290, 3.6, 152, 15, 1935, 96, 2),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '10 days', 1370, 4.1, 159, 19, 2055, 101, 3),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '11 days', 1260, 3.5, 150, 14, 1890, 95, 2),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '12 days', 1330, 3.8, 155, 17, 1995, 98, 2),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '13 days', 1310, 3.7, 154, 16, 1965, 97, 2),
('linkedin', uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE - INTERVAL '14 days', 1390, 4.2, 161, 20, 2085, 103, 3);

-- Add more days (15-29) for each platform
INSERT INTO platform_trends (platform, campaign_id, retailer_id, trend_date, total_reach, avg_engagement_rate, total_link_clicks, new_followers, total_impressions, total_engagement, total_posts) 
SELECT 
    platform,
    uuid_generate_v4(),
    uuid_generate_v4(),
    trend_date - INTERVAL '15 days',
    total_reach + (random() * 200 - 100)::integer,
    avg_engagement_rate + (random() * 1.0 - 0.5)::numeric(5,2),
    total_link_clicks + (random() * 20 - 10)::integer,
    new_followers + (random() * 6 - 3)::integer,
    total_impressions + (random() * 300 - 150)::integer,
    total_engagement + (random() * 20 - 10)::integer,
    total_posts
FROM platform_trends 
WHERE trend_date >= CURRENT_DATE - INTERVAL '14 days';

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