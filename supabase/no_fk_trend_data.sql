-- No Foreign Key Trend Data
-- Uses NULL values to avoid foreign key constraints

-- Clear existing data
TRUNCATE TABLE platform_trends CASCADE;

-- Facebook data (30 days) - using NULL for foreign keys
INSERT INTO platform_trends (platform, campaign_id, retailer_id, trend_date, total_reach, avg_engagement_rate, total_link_clicks, new_followers, total_impressions, total_engagement, total_posts) VALUES
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '0 days', 3200, 4.8, 125, 28, 4800, 245, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '1 days', 3150, 4.6, 120, 25, 4725, 240, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '2 days', 3300, 5.1, 130, 30, 4950, 255, 3),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '3 days', 3100, 4.4, 115, 22, 4650, 235, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '4 days', 3250, 4.9, 128, 27, 4875, 248, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '5 days', 3180, 4.7, 122, 26, 4770, 242, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '6 days', 3350, 5.2, 135, 32, 5025, 260, 3),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '7 days', 3080, 4.3, 118, 24, 4620, 238, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '8 days', 3220, 4.8, 126, 29, 4830, 246, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '9 days', 3160, 4.5, 121, 25, 4740, 241, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '10 days', 3280, 5.0, 132, 31, 4920, 252, 3),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '11 days', 3120, 4.4, 119, 23, 4680, 236, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '12 days', 3240, 4.9, 127, 28, 4860, 247, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '13 days', 3190, 4.6, 123, 26, 4785, 243, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '14 days', 3310, 5.1, 134, 33, 4965, 258, 3),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '15 days', 3050, 4.2, 116, 21, 4575, 233, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '16 days', 3270, 5.0, 131, 30, 4905, 251, 3),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '17 days', 3140, 4.5, 120, 24, 4710, 239, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '18 days', 3290, 5.1, 133, 32, 4935, 254, 3),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '19 days', 3110, 4.3, 117, 22, 4665, 237, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '20 days', 3230, 4.8, 125, 27, 4845, 245, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '21 days', 3170, 4.6, 122, 25, 4755, 241, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '22 days', 3320, 5.2, 136, 34, 4980, 259, 3),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '23 days', 3090, 4.3, 118, 23, 4635, 237, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '24 days', 3250, 4.9, 128, 28, 4875, 248, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '25 days', 3180, 4.7, 123, 26, 4770, 242, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '26 days', 3340, 5.1, 135, 33, 5010, 257, 3),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '27 days', 3070, 4.2, 117, 22, 4605, 235, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '28 days', 3210, 4.8, 126, 28, 4815, 246, 2),
('facebook', NULL, NULL, CURRENT_DATE - INTERVAL '29 days', 3150, 4.5, 121, 25, 4725, 240, 2);

-- Instagram data (30 days)
INSERT INTO platform_trends (platform, campaign_id, retailer_id, trend_date, total_reach, avg_engagement_rate, total_link_clicks, new_followers, total_impressions, total_engagement, total_posts) VALUES
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '0 days', 2650, 6.8, 85, 48, 3975, 205, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '1 days', 2580, 6.5, 82, 45, 3870, 198, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '2 days', 2720, 7.2, 88, 52, 4080, 212, 3),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '3 days', 2520, 6.3, 79, 42, 3780, 195, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '4 days', 2680, 6.9, 86, 49, 4020, 208, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '5 days', 2610, 6.6, 83, 46, 3915, 201, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '6 days', 2750, 7.3, 90, 54, 4125, 215, 3),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '7 days', 2490, 6.2, 78, 41, 3735, 192, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '8 days', 2640, 6.7, 84, 47, 3960, 204, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '9 days', 2570, 6.4, 81, 44, 3855, 199, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '10 days', 2700, 7.0, 87, 50, 4050, 210, 3),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '11 days', 2530, 6.3, 80, 43, 3795, 196, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '12 days', 2660, 6.8, 85, 48, 3990, 206, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '13 days', 2600, 6.5, 82, 45, 3900, 200, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '14 days', 2730, 7.1, 89, 53, 4095, 213, 3),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '15 days', 2470, 6.1, 77, 40, 3705, 190, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '16 days', 2690, 6.9, 86, 49, 4035, 208, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '17 days', 2590, 6.5, 82, 45, 3885, 199, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '18 days', 2740, 7.2, 89, 53, 4110, 214, 3),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '19 days', 2510, 6.2, 79, 42, 3765, 194, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '20 days', 2670, 6.8, 85, 48, 4005, 207, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '21 days', 2620, 6.6, 83, 46, 3930, 202, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '22 days', 2760, 7.3, 90, 54, 4140, 216, 3),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '23 days', 2480, 6.1, 78, 41, 3720, 191, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '24 days', 2650, 6.7, 84, 47, 3975, 205, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '25 days', 2580, 6.4, 81, 44, 3870, 198, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '26 days', 2710, 7.0, 87, 51, 4065, 211, 3),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '27 days', 2540, 6.3, 80, 43, 3810, 197, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '28 days', 2680, 6.8, 85, 48, 4020, 208, 2),
('instagram', NULL, NULL, CURRENT_DATE - INTERVAL '29 days', 2610, 6.5, 82, 45, 3915, 201, 2);

-- Twitter data (30 days)
INSERT INTO platform_trends (platform, campaign_id, retailer_id, trend_date, total_reach, avg_engagement_rate, total_link_clicks, new_followers, total_impressions, total_engagement, total_posts) VALUES
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '0 days', 1920, 3.2, 95, 22, 2880, 148, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '1 days', 1850, 2.9, 92, 19, 2775, 145, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '2 days', 1980, 3.5, 98, 25, 2970, 152, 3),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '3 days', 1820, 2.8, 89, 18, 2730, 142, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '4 days', 1940, 3.3, 96, 23, 2910, 149, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '5 days', 1880, 3.0, 93, 20, 2820, 146, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '6 days', 2010, 3.6, 100, 26, 3015, 155, 3),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '7 days', 1800, 2.7, 88, 17, 2700, 140, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '8 days', 1960, 3.4, 97, 24, 2940, 150, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '9 days', 1870, 3.1, 94, 21, 2805, 147, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '10 days', 1990, 3.5, 99, 25, 2985, 153, 3),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '11 days', 1830, 2.8, 90, 18, 2745, 143, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '12 days', 1950, 3.3, 96, 23, 2925, 149, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '13 days', 1890, 3.1, 94, 21, 2835, 147, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '14 days', 2000, 3.6, 100, 26, 3000, 154, 3),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '15 days', 1780, 2.6, 87, 16, 2670, 138, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '16 days', 1970, 3.4, 97, 24, 2955, 151, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '17 days', 1860, 3.0, 93, 20, 2790, 146, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '18 days', 2020, 3.7, 101, 27, 3030, 156, 3),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '19 days', 1810, 2.7, 89, 17, 2715, 141, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '20 days', 1930, 3.2, 95, 22, 2895, 148, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '21 days', 1870, 3.0, 93, 20, 2805, 147, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '22 days', 2000, 3.6, 100, 26, 3000, 154, 3),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '23 days', 1790, 2.7, 88, 17, 2685, 140, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '24 days', 1940, 3.3, 96, 23, 2910, 149, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '25 days', 1880, 3.1, 94, 21, 2820, 146, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '26 days', 1990, 3.5, 99, 25, 2985, 153, 3),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '27 days', 1820, 2.8, 90, 18, 2730, 142, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '28 days', 1950, 3.3, 96, 23, 2925, 149, 2),
('twitter', NULL, NULL, CURRENT_DATE - INTERVAL '29 days', 1890, 3.1, 94, 21, 2835, 147, 2);

-- LinkedIn data (30 days)
INSERT INTO platform_trends (platform, campaign_id, retailer_id, trend_date, total_reach, avg_engagement_rate, total_link_clicks, new_followers, total_impressions, total_engagement, total_posts) VALUES
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '0 days', 1320, 3.8, 155, 17, 1980, 98, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '1 days', 1280, 3.6, 152, 15, 1920, 96, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '2 days', 1360, 4.1, 158, 19, 2040, 101, 3),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '3 days', 1250, 3.5, 149, 14, 1875, 94, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '4 days', 1340, 3.9, 156, 18, 2010, 99, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '5 days', 1300, 3.7, 153, 16, 1950, 97, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '6 days', 1380, 4.2, 160, 20, 2070, 102, 3),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '7 days', 1230, 3.4, 148, 13, 1845, 93, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '8 days', 1350, 4.0, 157, 18, 2025, 100, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '9 days', 1290, 3.6, 152, 15, 1935, 96, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '10 days', 1370, 4.1, 159, 19, 2055, 101, 3),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '11 days', 1260, 3.5, 150, 14, 1890, 95, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '12 days', 1330, 3.8, 155, 17, 1995, 98, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '13 days', 1310, 3.7, 154, 16, 1965, 97, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '14 days', 1390, 4.2, 161, 20, 2085, 103, 3),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '15 days', 1220, 3.3, 147, 12, 1830, 92, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '16 days', 1360, 4.0, 158, 18, 2040, 100, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '17 days', 1290, 3.6, 152, 15, 1935, 96, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '18 days', 1380, 4.1, 160, 19, 2070, 102, 3),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '19 days', 1240, 3.4, 149, 13, 1860, 94, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '20 days', 1350, 3.9, 156, 17, 2025, 99, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '21 days', 1300, 3.7, 153, 16, 1950, 97, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '22 days', 1390, 4.2, 161, 20, 2085, 103, 3),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '23 days', 1210, 3.3, 146, 12, 1815, 91, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '24 days', 1340, 3.9, 156, 18, 2010, 99, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '25 days', 1280, 3.6, 152, 15, 1920, 96, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '26 days', 1370, 4.1, 159, 19, 2055, 101, 3),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '27 days', 1250, 3.5, 150, 14, 1875, 94, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '28 days', 1330, 3.8, 155, 17, 1995, 98, 2),
('linkedin', NULL, NULL, CURRENT_DATE - INTERVAL '29 days', 1310, 3.7, 154, 16, 1965, 97, 2);

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

SELECT 'Successfully inserted ' || COUNT(*) || ' trend records' as result FROM platform_trends;