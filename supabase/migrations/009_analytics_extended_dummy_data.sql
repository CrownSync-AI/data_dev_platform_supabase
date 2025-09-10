-- =============================================
-- ANALYTICS EXTENDED DUMMY DATA
-- Populating tables with data to match frontend analytics
-- =============================================

-- =============================================
-- BRAND ASSETS DUMMY DATA
-- =============================================

-- Insert brand assets
INSERT INTO brand_assets (asset_name, asset_type, download_count, is_featured, metadata) VALUES
('Daytona_Launch_Video.mp4', 'Video', 152, true, '{"duration": "2:30", "resolution": "4K"}'),
('Explorer_Heritage_Lookbook.pdf', 'PDF', 98, true, '{"pages": 24, "size_mb": 15.2}'),
('Rolex_Oyster_Perpetual_Banner.jpg', 'Image', 94, true, '{"dimensions": "1920x1080", "format": "JPEG"}'),
('GMT_Master_II_Social_Post.png', 'Image', 87, false, '{"dimensions": "1080x1080", "format": "PNG"}'),
('YachtMaster_Summer_Promo.gif', 'Design File', 79, false, '{"animated": true, "duration": "3s"}'),
('2025_VIP_Event_Template.pptx', 'Presentation', 68, false, '{"slides": 18, "template_type": "event"}'),
('Submariner_Teaser_Poster.pdf', 'PDF', 61, false, '{"pages": 1, "print_ready": true}'),
('Rolex_Retail_Guide_2025.pdf', 'PDF', 57, true, '{"pages": 48, "category": "guide"}'),
('Daytona_Social_Boost_Clip.mp4', 'Video', 53, false, '{"duration": "0:15", "platform": "social"}'),
('Oyster_Style_Lifestyle.jpg', 'Image', 48, false, '{"style": "lifestyle", "model": "oyster"}')
ON CONFLICT DO NOTHING;

-- Insert daily downloads data for the past 30 days
INSERT INTO daily_asset_downloads (download_date, asset_type, download_count) VALUES
('2024-06-01', 'Image', 78), ('2024-06-01', 'Video', 32), ('2024-06-01', 'Others', 45),
('2024-06-02', 'Image', 85), ('2024-06-02', 'Video', 28), ('2024-06-02', 'Others', 52),
('2024-06-03', 'Image', 92), ('2024-06-03', 'Video', 35), ('2024-06-03', 'Others', 48),
('2024-06-04', 'Image', 88), ('2024-06-04', 'Video', 42), ('2024-06-04', 'Others', 61),
('2024-06-05', 'Image', 95), ('2024-06-05', 'Video', 38), ('2024-06-05', 'Others', 55),
('2024-06-06', 'Image', 102), ('2024-06-06', 'Video', 45), ('2024-06-06', 'Others', 67),
('2024-06-07', 'Image', 89), ('2024-06-07', 'Video', 41), ('2024-06-07', 'Others', 58),
('2024-06-08', 'Image', 98), ('2024-06-08', 'Video', 48), ('2024-06-08', 'Others', 72),
('2024-06-09', 'Image', 105), ('2024-06-09', 'Video', 52), ('2024-06-09', 'Others', 64),
('2024-06-10', 'Image', 93), ('2024-06-10', 'Video', 46), ('2024-06-10', 'Others', 69),
('2024-06-11', 'Image', 110), ('2024-06-11', 'Video', 55), ('2024-06-11', 'Others', 75),
('2024-06-12', 'Image', 87), ('2024-06-12', 'Video', 49), ('2024-06-12', 'Others', 68),
('2024-06-13', 'Image', 115), ('2024-06-13', 'Video', 58), ('2024-06-13', 'Others', 82),
('2024-06-14', 'Image', 99), ('2024-06-14', 'Video', 53), ('2024-06-14', 'Others', 76),
('2024-06-15', 'Image', 122), ('2024-06-15', 'Video', 61), ('2024-06-15', 'Others', 88),
('2024-06-16', 'Image', 108), ('2024-06-16', 'Video', 56), ('2024-06-16', 'Others', 79),
('2024-06-17', 'Image', 125), ('2024-06-17', 'Video', 64), ('2024-06-17', 'Others', 91),
('2024-06-18', 'Image', 112), ('2024-06-18', 'Video', 59), ('2024-06-18', 'Others', 85),
('2024-06-19', 'Image', 128), ('2024-06-19', 'Video', 67), ('2024-06-19', 'Others', 94),
('2024-06-20', 'Image', 118), ('2024-06-20', 'Video', 62), ('2024-06-20', 'Others', 87),
('2024-06-21', 'Image', 135), ('2024-06-21', 'Video', 69), ('2024-06-21', 'Others', 96),
('2024-06-22', 'Image', 121), ('2024-06-22', 'Video', 65), ('2024-06-22', 'Others', 89),
('2024-06-23', 'Image', 142), ('2024-06-23', 'Video', 72), ('2024-06-23', 'Others', 102),
('2024-06-24', 'Image', 129), ('2024-06-24', 'Video', 68), ('2024-06-24', 'Others', 95),
('2024-06-25', 'Image', 148), ('2024-06-25', 'Video', 75), ('2024-06-25', 'Others', 108),
('2024-06-26', 'Image', 136), ('2024-06-26', 'Video', 71), ('2024-06-26', 'Others', 101),
('2024-06-27', 'Image', 155), ('2024-06-27', 'Video', 78), ('2024-06-27', 'Others', 115),
('2024-06-28', 'Image', 142), ('2024-06-28', 'Video', 74), ('2024-06-28', 'Others', 109),
('2024-06-29', 'Image', 162), ('2024-06-29', 'Video', 81), ('2024-06-29', 'Others', 122),
('2024-06-30', 'Image', 149), ('2024-06-30', 'Video', 77), ('2024-06-30', 'Others', 116)
ON CONFLICT DO NOTHING;

-- =============================================
-- CAMPAIGN TEMPLATES DUMMY DATA
-- =============================================

-- Insert campaign templates
INSERT INTO campaign_templates (template_name, template_type, usage_count, unique_retailers_count, unique_recipients_count, conversion_rate, metadata) VALUES
('Land Oyster Craftsmanship Insight', 'email'::template_type_enum, 45, 118, 44200, 62.8, '{"category": "craftsmanship"}'),
('Daytona Legends in Motor Sport', 'sms'::template_type_enum, 78, 87, 33400, 63.2, '{"category": "motorsport"}'),
('Oyster Perpetual Mastery Series', 'email'::template_type_enum, 32, 47, 16840, 45.2, '{"category": "mastery"}'),
('Explorer Journeys of Endurance', 'email'::template_type_enum, 95, 102, 40800, 55.8, '{"category": "adventure"}'),
('GMT Master II Heritage Unveiling', 'sms'::template_type_enum, 68, 78, 29830, 58.9, '{"category": "heritage"}'),
('Submariner Depth-Test Chronicles', 'email'::template_type_enum, 28, 64, 23800, 48.3, '{"category": "diving"}'),
('Sky Dweller Innovation Showcase', 'email'::template_type_enum, 85, 95, 38120, 57.3, '{"category": "innovation"}'),
('Yacht Master Sailing Heritage', 'sms'::template_type_enum, 58, 69, 25380, 68.5, '{"category": "sailing"}'),
('Milgauss Science & Precision', 'email'::template_type_enum, 42, 58, 19270, 52.1, '{"category": "science"}'),
('Datejust Wimbledon Moments', 'email'::template_type_enum, 72, 41, 15230, 62.8, '{"category": "sports"}'),
('Cellini Artistry & Elegance', 'email'::template_type_enum, 55, 35, 12800, 49.7, '{"category": "elegance"}'),
('Rolex at Le Mans Endurance', 'sms'::template_type_enum, 25, 28, 9500, 44.2, '{"category": "racing"}'),
('Rolex at US Daytona Highlights', 'email'::template_type_enum, 88, 78, 29830, 56.4, '{"category": "racing"}'),
('Rolex x Atilla Championship Series', 'sms'::template_type_enum, 75, 65, 22100, 51.8, '{"category": "championship"}'),
('Marketing Moments: The Perpetual Rolex Story', 'email'::template_type_enum, 38, 42, 14200, 47.9, '{"category": "brand_story"}')
ON CONFLICT DO NOTHING;

-- =============================================
-- RETAILER SCORES DUMMY DATA
-- =============================================

-- Insert retailer performance scores
INSERT INTO retailer_scores (retailer_id, retailer_name, email_response_time_hours, social_response_time_hours, social_post_frequency_per_week, response_quality_grade, first_followup_time_hours, campaign_roi_percentage, overall_rank) 
SELECT 
    u.user_id,
    scores.retailer_name,
    scores.email_response_time_hours,
    scores.social_response_time_hours,
    scores.social_post_frequency_per_week,
    scores.response_quality_grade,
    scores.first_followup_time_hours,
    scores.campaign_roi_percentage,
    scores.overall_rank
FROM (
    VALUES 
    ('Sun Bridge Jeweler', 4.2, 3.8, 3.2, 'A', 6.0, 154.0, 1),
    ('Nancy Jewelers', 6.0, 5.2, 1.8, 'B', 8.0, 97.0, 2),
    ('Halston''s Fine Jewelers', 2.8, 3.4, 4.1, 'A', 4.0, 138.0, 3),
    ('Pocketwatch Jewelers', 5.5, 6.1, 2.0, 'B', 8.0, 102.0, 4),
    ('Tourneau Jewellery Ltd', 3.4, 3.1, 3.5, 'A', 5.0, 161.0, 5),
    ('Dazzling Armada Jewelry', 7.3, 8.0, 1.2, 'C', 20.0, 68.0, 6),
    ('Harris Jewelers', 3.1, 2.8, 4.5, 'A', 6.0, 142.0, 7),
    ('Sunrise Jewelers', 4.8, 5.5, 2.8, 'B', 9.0, 91.0, 8),
    ('KOREBAG', 6.5, 6.2, 1.9, 'C', 14.0, 73.0, 9),
    ('Midas Jewels', 2.3, 2.1, 5.8, 'A', 3.0, 168.0, 10),
    ('Watches of America', 5.1, 4.9, 3.0, 'B', 10.0, 108.0, 11),
    ('Goldmark Prestige', 4.3, 5.4, 1.8, 'B', 7.0, 124.0, 12),
    ('JewelryCult Gallery', 6.8, 7.0, 2.1, 'C', 12.0, 84.0, 13),
    ('Elite Timepieces', 3.0, 2.8, 4.7, 'A', 5.0, 147.0, 14),
    ('Legacy Watch Co.', 5.6, 6.3, 2.5, 'B', 11.0, 93.0, 15),
    ('Noble Jewels NY', 2.2, 2.4, 5.2, 'A', 4.0, 162.0, 16),
    ('Radiant Diamond Co.', 3.8, 3.7, 3.3, 'A', 6.0, 130.0, 17),
    ('Crown Jewelers', 6.1, 7.2, 1.6, 'C', 16.0, 71.0, 18),
    ('Aurora Luxury Time', 3.9, 3.8, 4.3, 'A', 5.0, 138.0, 19),
    ('Zephyr Watchworks', 5.8, 5.3, 2.3, 'B', 9.0, 91.0, 20)
) AS scores(retailer_name, email_response_time_hours, social_response_time_hours, social_post_frequency_per_week, response_quality_grade, first_followup_time_hours, campaign_roi_percentage, overall_rank)
LEFT JOIN users u ON u.user_name = scores.retailer_name AND u.user_type = 'retailer'
WHERE u.user_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Insert retailer scores for users that don't exist yet
INSERT INTO users (user_name, user_email, user_type, created_at) VALUES
('Sun Bridge Jeweler', 'contact@sunbridgejeweler.com', 'retailer', NOW() - INTERVAL '30 days'),
('Nancy Jewelers', 'info@nancyjewelers.com', 'retailer', NOW() - INTERVAL '29 days'),
('Halston''s Fine Jewelers', 'sales@halstonsfine.com', 'retailer', NOW() - INTERVAL '28 days'),
('Pocketwatch Jewelers', 'hello@pocketwatchjewelers.com', 'retailer', NOW() - INTERVAL '27 days'),
('Tourneau Jewellery Ltd', 'contact@tourneaujewellery.com', 'retailer', NOW() - INTERVAL '26 days'),
('Dazzling Armada Jewelry', 'info@dazzlingarmada.com', 'retailer', NOW() - INTERVAL '25 days'),
('Harris Jewelers', 'sales@harrisjewelers.com', 'retailer', NOW() - INTERVAL '24 days'),
('Sunrise Jewelers', 'contact@sunrisejewelers.com', 'retailer', NOW() - INTERVAL '23 days'),
('KOREBAG', 'hello@korebag.com', 'retailer', NOW() - INTERVAL '22 days'),
('Midas Jewels', 'info@midasjewels.com', 'retailer', NOW() - INTERVAL '21 days'),
('Watches of America', 'sales@watchesofamerica.com', 'retailer', NOW() - INTERVAL '20 days'),
('Goldmark Prestige', 'contact@goldmarkprestige.com', 'retailer', NOW() - INTERVAL '19 days'),
('JewelryCult Gallery', 'info@jewelrycultgallery.com', 'retailer', NOW() - INTERVAL '18 days'),
('Elite Timepieces', 'sales@elitetimepieces.com', 'retailer', NOW() - INTERVAL '17 days'),
('Legacy Watch Co.', 'contact@legacywatchco.com', 'retailer', NOW() - INTERVAL '16 days'),
('Noble Jewels NY', 'info@noblejewelsny.com', 'retailer', NOW() - INTERVAL '15 days'),
('Radiant Diamond Co.', 'sales@radiantdiamond.com', 'retailer', NOW() - INTERVAL '14 days'),
('Crown Jewelers', 'contact@crownjewelers.com', 'retailer', NOW() - INTERVAL '13 days'),
('Aurora Luxury Time', 'info@auroraluxurytime.com', 'retailer', NOW() - INTERVAL '12 days'),
('Zephyr Watchworks', 'sales@zephyrwatchworks.com', 'retailer', NOW() - INTERVAL '11 days')
ON CONFLICT (user_email) DO NOTHING;

-- Now insert retailer scores for all retailers
INSERT INTO retailer_scores (retailer_id, retailer_name, email_response_time_hours, social_response_time_hours, social_post_frequency_per_week, response_quality_grade, first_followup_time_hours, campaign_roi_percentage, overall_rank) 
SELECT 
    u.user_id,
    scores.retailer_name,
    scores.email_response_time_hours,
    scores.social_response_time_hours,
    scores.social_post_frequency_per_week,
    scores.response_quality_grade,
    scores.first_followup_time_hours,
    scores.campaign_roi_percentage,
    scores.overall_rank
FROM (
    VALUES 
    ('Sun Bridge Jeweler', 4.2, 3.8, 3.2, 'A', 6.0, 154.0, 1),
    ('Nancy Jewelers', 6.0, 5.2, 1.8, 'B', 8.0, 97.0, 2),
    ('Halston''s Fine Jewelers', 2.8, 3.4, 4.1, 'A', 4.0, 138.0, 3),
    ('Pocketwatch Jewelers', 5.5, 6.1, 2.0, 'B', 8.0, 102.0, 4),
    ('Tourneau Jewellery Ltd', 3.4, 3.1, 3.5, 'A', 5.0, 161.0, 5),
    ('Dazzling Armada Jewelry', 7.3, 8.0, 1.2, 'C', 20.0, 68.0, 6),
    ('Harris Jewelers', 3.1, 2.8, 4.5, 'A', 6.0, 142.0, 7),
    ('Sunrise Jewelers', 4.8, 5.5, 2.8, 'B', 9.0, 91.0, 8),
    ('KOREBAG', 6.5, 6.2, 1.9, 'C', 14.0, 73.0, 9),
    ('Midas Jewels', 2.3, 2.1, 5.8, 'A', 3.0, 168.0, 10),
    ('Watches of America', 5.1, 4.9, 3.0, 'B', 10.0, 108.0, 11),
    ('Goldmark Prestige', 4.3, 5.4, 1.8, 'B', 7.0, 124.0, 12),
    ('JewelryCult Gallery', 6.8, 7.0, 2.1, 'C', 12.0, 84.0, 13),
    ('Elite Timepieces', 3.0, 2.8, 4.7, 'A', 5.0, 147.0, 14),
    ('Legacy Watch Co.', 5.6, 6.3, 2.5, 'B', 11.0, 93.0, 15),
    ('Noble Jewels NY', 2.2, 2.4, 5.2, 'A', 4.0, 162.0, 16),
    ('Radiant Diamond Co.', 3.8, 3.7, 3.3, 'A', 6.0, 130.0, 17),
    ('Crown Jewelers', 6.1, 7.2, 1.6, 'C', 16.0, 71.0, 18),
    ('Aurora Luxury Time', 3.9, 3.8, 4.3, 'A', 5.0, 138.0, 19),
    ('Zephyr Watchworks', 5.8, 5.3, 2.3, 'B', 9.0, 91.0, 20)
) AS scores(retailer_name, email_response_time_hours, social_response_time_hours, social_post_frequency_per_week, response_quality_grade, first_followup_time_hours, campaign_roi_percentage, overall_rank)
JOIN users u ON u.user_name = scores.retailer_name AND u.user_type = 'retailer'
ON CONFLICT (retailer_id) DO UPDATE SET
    email_response_time_hours = EXCLUDED.email_response_time_hours,
    social_response_time_hours = EXCLUDED.social_response_time_hours,
    social_post_frequency_per_week = EXCLUDED.social_post_frequency_per_week,
    response_quality_grade = EXCLUDED.response_quality_grade,
    first_followup_time_hours = EXCLUDED.first_followup_time_hours,
    campaign_roi_percentage = EXCLUDED.campaign_roi_percentage,
    overall_rank = EXCLUDED.overall_rank,
    updated_at = NOW();

-- =============================================
-- WISH LIST DUMMY DATA
-- =============================================

-- Insert watch models for wish lists
INSERT INTO watch_models (model_name, collection_name, size, gender, material, mpn, metadata) VALUES
('GMT-Master II ''Pepsi''', 'GMT-Master II', '40 mm', 'Men', 'Oystersteel', '126710BLRO', '{"nickname": "Pepsi", "bezel": "blue_red"}'),
('Submariner Date ''Starbucks''', 'Submariner', '41 mm', 'Men', 'Oystersteel', '126610LV', '{"nickname": "Starbucks", "bezel": "green"}'),
('Oyster Perpetual 41 ''Tiffany''', 'Oyster Perpetual', '41 mm', 'Unisex', '904L Oystersteel', '124300', '{"nickname": "Tiffany", "dial": "turquoise"}'),
('Daytona Tiffany Blue', 'Daytona', '40 mm', 'Men', 'Yellow Gold', '126518TBL', '{"dial": "tiffany_blue", "material_type": "precious"}'),
('Land Dweller', 'Land Dweller', '39 mm', 'Unisex', 'Everose Rolesor', '126000', '{"water_resistance": "100m"}'),
('Explorer Heritage', 'Explorer', '36 mm', 'Men', 'Oystersteel', '124270', '{"heritage": true, "classic_design": true}'),
('Sky Dweller Blue Dial', 'Sky-Dweller', '42 mm', 'Men', 'Yellow Gold', '336935', '{"dial_color": "blue", "complications": ["GMT", "annual_calendar"]}'),
('Yacht-Master 42 Titanium', 'Yacht-Master', '42 mm', 'Men', 'Titanium', '226627', '{"material_type": "titanium", "water_resistance": "100m"}'),
('Datejust 41 Wimbledon', 'Datejust', '41 mm', 'Men', 'Oystersteel', '126334', '{"dial": "wimbledon", "sports_edition": true}'),
('Milgauss Z-Blue', 'Milgauss', '40 mm', 'Men', 'Oystersteel', '116400GV', '{"dial_color": "z_blue", "antimagnetic": true}')
ON CONFLICT (mpn) DO NOTHING;

-- Insert wish list items
INSERT INTO wish_list_items (model_id, retailer_id, wish_count)
SELECT 
    wm.model_id,
    u.user_id,
    wishes.wish_count
FROM (
    VALUES 
    ('126710BLRO', 52),
    ('126610LV', 44),
    ('124300', 42),
    ('126518TBL', 38),
    ('126000', 31),
    ('124270', 28),
    ('336935', 24),
    ('226627', 22),
    ('126334', 19),
    ('116400GV', 17)
) AS wishes(mpn, wish_count)
JOIN watch_models wm ON wm.mpn = wishes.mpn
CROSS JOIN (
    SELECT user_id FROM users WHERE user_type = 'retailer' ORDER BY RANDOM() LIMIT 1
) u
ON CONFLICT (model_id, retailer_id) DO UPDATE SET
    wish_count = EXCLUDED.wish_count,
    updated_at = NOW();

-- Insert regional wish list data
INSERT INTO regional_wish_lists (model_id, region, wish_count, rank_in_region)
SELECT 
    wm.model_id,
    regional.region,
    regional.wish_count,
    regional.rank_in_region
FROM (
    VALUES 
    ('126710BLRO', 'northeast', 18, 1),
    ('126610LV', 'northeast', 15, 2),
    ('124300', 'northeast', 12, 3),
    ('126518TBL', 'northeast', 10, 4),
    ('126000', 'northeast', 8, 5),
    ('126610LV', 'midwest', 14, 1),
    ('126710BLRO', 'midwest', 13, 2),
    ('124300', 'midwest', 11, 3),
    ('126518TBL', 'midwest', 9, 4),
    ('124270', 'midwest', 7, 5),
    ('124300', 'south', 16, 1),
    ('126710BLRO', 'south', 15, 2),
    ('126518TBL', 'south', 12, 3),
    ('126710BLRO', 'west', 17, 1),
    ('124300', 'west', 14, 2),
    ('126610LV', 'west', 13, 3)
) AS regional(mpn, region, wish_count, rank_in_region)
JOIN watch_models wm ON wm.mpn = regional.mpn
ON CONFLICT (model_id, region) DO UPDATE SET
    wish_count = EXCLUDED.wish_count,
    rank_in_region = EXCLUDED.rank_in_region,
    updated_at = NOW();

-- =============================================
-- ADDITIONAL RETAILER ACTIVITY DATA
-- =============================================

-- Insert retailer asset activity for top active retailers
INSERT INTO retailer_asset_activity (retailer_id, asset_id, activity_type, unique_files_count, activity_date)
SELECT 
    u.user_id,
    ba.asset_id,
    'download',
    CASE 
        WHEN u.user_name = 'Bucherer Hermann Jewelers Ltd.' THEN 84
        WHEN u.user_name = 'Tourneau Jewelers' THEN 74
        WHEN u.user_name = 'De Boulle Diamond & Jewelry' THEN 61
        WHEN u.user_name = 'Long''s Anthony Jewelers' THEN 58
        WHEN u.user_name = 'Brent L. Miller Jewelers & Goldsmiths' THEN 55
        ELSE FLOOR(RANDOM() * 50 + 20)
    END,
    NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 30)
FROM users u
CROSS JOIN brand_assets ba
WHERE u.user_type = 'retailer'
    AND RANDOM() < 0.3 -- Only 30% of combinations to avoid too much data
LIMIT 200
ON CONFLICT DO NOTHING;

-- =============================================
-- TEMPLATE RETAILER USAGE DATA
-- =============================================

-- Insert template usage by retailers
INSERT INTO template_retailer_usage (template_id, retailer_id, campaigns_joined, total_sends, last_active_date)
SELECT 
    ct.template_id,
    u.user_id,
    FLOOR(RANDOM() * 25 + 5)::INTEGER, -- 5-30 campaigns joined
    FLOOR(RANDOM() * 80 + 20)::INTEGER, -- 20-100 total sends
    NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 7) -- Last active within 7 days
FROM campaign_templates ct
CROSS JOIN users u
WHERE u.user_type = 'retailer'
    AND RANDOM() < 0.4 -- 40% of template-retailer combinations
LIMIT 150
ON CONFLICT DO NOTHING;

-- =============================================
-- UPDATE ANALYTICS COUNTS
-- =============================================

-- Update template usage counts based on actual data
UPDATE campaign_templates 
SET 
    usage_count = (
        SELECT COUNT(*) 
        FROM template_retailer_usage tru 
        WHERE tru.template_id = campaign_templates.template_id
    ),
    unique_retailers_count = (
        SELECT COUNT(DISTINCT retailer_id) 
        FROM template_retailer_usage tru 
        WHERE tru.template_id = campaign_templates.template_id
    ),
    updated_at = NOW();

-- Update asset download counts based on actual activity
UPDATE brand_assets 
SET 
    download_count = (
        SELECT COALESCE(SUM(unique_files_count), 0) 
        FROM retailer_asset_activity raa 
        WHERE raa.asset_id = brand_assets.asset_id 
            AND raa.activity_type = 'download'
    ),
    updated_at = NOW();

-- =============================================
-- FINAL VERIFICATION QUERIES
-- =============================================

-- Verify data counts
DO $$
BEGIN
    RAISE NOTICE 'Brand Assets: %', (SELECT COUNT(*) FROM brand_assets);
    RAISE NOTICE 'Campaign Templates: %', (SELECT COUNT(*) FROM campaign_templates);
    RAISE NOTICE 'Retailer Scores: %', (SELECT COUNT(*) FROM retailer_scores);
    RAISE NOTICE 'Watch Models: %', (SELECT COUNT(*) FROM watch_models);
    RAISE NOTICE 'Wish List Items: %', (SELECT COUNT(*) FROM wish_list_items);
    RAISE NOTICE 'Regional Wish Lists: %', (SELECT COUNT(*) FROM regional_wish_lists);
    RAISE NOTICE 'Daily Downloads: %', (SELECT COUNT(*) FROM daily_asset_downloads);
END $$;