-- Campaign Performance New - Dummy Data Generation
-- This script generates realistic dummy data for the new campaign performance system
-- Based on Ayrshare API data structure and luxury brand marketing patterns

-- =====================================================
-- 1. INSERT CAMPAIGNS
-- =====================================================

-- Get a brand user ID (assuming there's at least one brand user)
DO $$
DECLARE
    brand_user_id UUID;
BEGIN
    -- Get the first brand user, or create one if none exists
    SELECT id INTO brand_user_id FROM users WHERE user_type = 'brand' LIMIT 1;
    
    IF brand_user_id IS NULL THEN
        INSERT INTO users (email, name, user_type, region, is_active)
        VALUES ('brand@crownsync.com', 'CrownSync Brand Team', 'brand', 'Central', true)
        RETURNING id INTO brand_user_id;
    END IF;

    -- Insert 3 campaigns with different performance levels and types
    INSERT INTO campaigns_new (campaign_id, campaign_name, campaign_description, campaign_type, brand_id, status, start_date, end_date, target_platforms, campaign_goals) VALUES
    
    -- High Performance Campaign
    (
        gen_random_uuid(),
        'Luxury Holiday Collection 2024',
        'Premium holiday jewelry campaign featuring exclusive pieces and limited-time offers',
        'mixed',
        brand_user_id,
        'active',
        '2024-11-01',
        '2024-12-31',
        ARRAY['facebook', 'instagram', 'linkedin', 'twitter'],
        '{"engagement_target": 6.5, "reach_target": 500000, "email_open_target": 25}'
    ),
    
    -- Good Performance Campaign  
    (
        gen_random_uuid(),
        'Spring Elegance 2025 Preview',
        'Early preview of spring collection with focus on elegant designs and craftsmanship',
        'social_media',
        brand_user_id,
        'active',
        '2024-12-01',
        '2025-02-28',
        ARRAY['instagram', 'facebook', 'linkedin'],
        '{"engagement_target": 4.5, "reach_target": 300000, "follower_growth_target": 1000}'
    ),
    
    -- Standard Performance Campaign
    (
        gen_random_uuid(),
        'Brand Awareness Q1 2025',
        'General brand awareness campaign focusing on heritage and craftsmanship stories',
        'email',
        brand_user_id,
        'active', 
        '2024-12-15',
        '2025-03-31',
        ARRAY['email'],
        '{"email_open_target": 18, "email_click_target": 3.5, "reach_target": 150000}'
    );
END $$;

-- =====================================================
-- 2. INSERT SOCIAL ACCOUNTS FOR ALL RETAILERS
-- =====================================================

-- Create social accounts for all existing retailers across 4 platforms
INSERT INTO social_accounts_new (retailer_id, platform, account_handle, account_name, ayrshare_profile_key, follower_count, following_count, is_active, connected_at, last_sync_at)
SELECT 
    u.id as retailer_id,
    platform.name as platform,
    CASE 
        WHEN platform.name = 'facebook' THEN '@' || LOWER(REPLACE(u.name, ' ', '')) || 'jewelry'
        WHEN platform.name = 'instagram' THEN '@' || LOWER(REPLACE(u.name, ' ', '')) || 'jewels'
        WHEN platform.name = 'twitter' THEN '@' || LOWER(REPLACE(u.name, ' ', '')) || 'luxury'
        WHEN platform.name = 'linkedin' THEN LOWER(REPLACE(u.name, ' ', '-')) || '-jewelry'
    END as account_handle,
    CASE 
        WHEN platform.name = 'facebook' THEN u.name || ' Jewelry'
        WHEN platform.name = 'instagram' THEN u.name || ' Jewels'
        WHEN platform.name = 'twitter' THEN u.name || ' Luxury'
        WHEN platform.name = 'linkedin' THEN u.name || ' Fine Jewelry'
    END as account_name,
    platform.name || '_profile_' || SUBSTR(MD5(u.id::text || platform.name), 1, 8) as ayrshare_profile_key,
    -- Realistic follower counts based on platform and retailer size
    CASE 
        WHEN platform.name = 'instagram' THEN 5000 + (RANDOM() * 45000)::INTEGER
        WHEN platform.name = 'facebook' THEN 3000 + (RANDOM() * 25000)::INTEGER  
        WHEN platform.name = 'twitter' THEN 1000 + (RANDOM() * 15000)::INTEGER
        WHEN platform.name = 'linkedin' THEN 500 + (RANDOM() * 8000)::INTEGER
    END as follower_count,
    -- Following counts (typically much lower than followers for businesses)
    CASE 
        WHEN platform.name = 'instagram' THEN 200 + (RANDOM() * 800)::INTEGER
        WHEN platform.name = 'facebook' THEN 50 + (RANDOM() * 200)::INTEGER
        WHEN platform.name = 'twitter' THEN 300 + (RANDOM() * 1200)::INTEGER
        WHEN platform.name = 'linkedin' THEN 100 + (RANDOM() * 500)::INTEGER
    END as following_count,
    true as is_active,
    NOW() - INTERVAL '30 days' + (RANDOM() * INTERVAL '25 days') as connected_at,
    NOW() - INTERVAL '1 hour' + (RANDOM() * INTERVAL '50 minutes') as last_sync_at
FROM users u
CROSS JOIN (
    VALUES ('facebook'), ('instagram'), ('twitter'), ('linkedin')
) AS platform(name)
WHERE u.user_type = 'retailer' AND u.is_active = true;

-- =====================================================
-- 3. INSERT CAMPAIGN POSTS
-- =====================================================

-- Generate posts for each campaign and social account combination
INSERT INTO campaign_posts_new (campaign_id, account_id, ayrshare_post_id, platform_post_id, post_content, post_type, hashtags, published_at, status)
SELECT 
    c.campaign_id,
    sa.account_id,
    'ayr_' || SUBSTR(MD5(c.campaign_id::text || sa.account_id::text || generate_series), 1, 12) as ayrshare_post_id,
    sa.platform || '_' || (1000000 + (RANDOM() * 9000000)::INTEGER)::text as platform_post_id,
    
    -- Platform-appropriate content
    CASE sa.platform
        WHEN 'instagram' THEN 
            CASE (RANDOM() * 4)::INTEGER
                WHEN 0 THEN 'Discover the artistry behind our latest collection ✨ Each piece tells a story of elegance and craftsmanship. #LuxuryJewelry #Handcrafted #Elegance'
                WHEN 1 THEN 'Behind the scenes: Our master craftsmen at work creating tomorrow''s heirlooms 💎 #Craftsmanship #LuxuryLifestyle #JewelryMaking'
                WHEN 2 THEN 'New arrival alert! 🚨 This stunning piece just landed in our collection. What do you think? #NewCollection #LuxuryJewelry #Stunning'
                ELSE 'The perfect accessory for any occasion ✨ Shop our curated collection of timeless pieces #TimelessElegance #LuxuryJewelry #Style'
            END
        WHEN 'facebook' THEN
            CASE (RANDOM() * 4)::INTEGER
                WHEN 0 THEN 'We''re excited to share our latest collection with you! Each piece is carefully crafted with attention to detail and quality that lasts generations.'
                WHEN 1 THEN 'Visit our showroom this weekend for an exclusive preview of our holiday collection. Our experts will be available for personal consultations.'
                WHEN 2 THEN 'Thank you to all our valued customers for your continued trust in our brand. Your stories inspire us to create even more beautiful pieces.'
                ELSE 'Learn about the history and significance behind our signature designs. Each piece carries forward a tradition of excellence and artistry.'
            END
        WHEN 'twitter' THEN
            CASE (RANDOM() * 4)::INTEGER
                WHEN 0 THEN 'New collection drop! 💎 Timeless elegance meets modern design. #LuxuryJewelry #NewDrop'
                WHEN 1 THEN 'Behind the scenes: The art of jewelry making 🔨 #Craftsmanship #LuxuryLifestyle'
                WHEN 2 THEN 'Weekend showroom hours: Sat 10-6, Sun 12-5. Book your private consultation! #LuxuryShopping'
                ELSE 'Quality that lasts generations ✨ Discover our heritage collection #TimelessLuxury #Heritage'
            END
        WHEN 'linkedin' THEN
            CASE (RANDOM() * 4)::INTEGER
                WHEN 0 THEN 'Our commitment to sustainable luxury continues with our new eco-conscious collection. Learn about our responsible sourcing practices.'
                WHEN 1 THEN 'Industry insight: The future of luxury retail lies in personalized customer experiences and authentic craftsmanship.'
                WHEN 2 THEN 'We''re proud to announce our partnership with local artisans, supporting traditional jewelry-making techniques.'
                ELSE 'Building lasting relationships with our clients through exceptional service and uncompromising quality standards.'
            END
    END as post_content,
    
    -- Post type distribution
    CASE (RANDOM() * 5)::INTEGER
        WHEN 0 THEN 'image'
        WHEN 1 THEN 'video' 
        WHEN 2 THEN 'carousel'
        WHEN 3 THEN 'image'
        ELSE 'text'
    END as post_type,
    
    -- Platform-appropriate hashtags
    CASE sa.platform
        WHEN 'instagram' THEN ARRAY['#LuxuryJewelry', '#Handcrafted', '#Elegance', '#LuxuryLifestyle', '#JewelryDesign']
        WHEN 'facebook' THEN ARRAY['#LuxuryJewelry', '#QualityCraftsmanship', '#TimelessElegance']
        WHEN 'twitter' THEN ARRAY['#LuxuryJewelry', '#Craftsmanship', '#LuxuryLifestyle', '#TimelessLuxury']
        WHEN 'linkedin' THEN ARRAY['#LuxuryRetail', '#Craftsmanship', '#SustainableLuxury', '#JewelryIndustry']
    END as hashtags,
    
    -- Published dates over the last 30 days
    c.start_date + (RANDOM() * (CURRENT_DATE - c.start_date))::INTEGER * INTERVAL '1 day' + 
    (RANDOM() * INTERVAL '16 hours') + INTERVAL '8 hours' as published_at,
    
    'published' as status

FROM campaigns_new c
CROSS JOIN social_accounts_new sa
CROSS JOIN generate_series(1, 
    -- Number of posts per account per campaign (varies by platform)
    CASE sa.platform
        WHEN 'instagram' THEN 8 + (RANDOM() * 7)::INTEGER  -- 8-15 posts
        WHEN 'facebook' THEN 5 + (RANDOM() * 5)::INTEGER   -- 5-10 posts
        WHEN 'twitter' THEN 12 + (RANDOM() * 8)::INTEGER   -- 12-20 posts
        WHEN 'linkedin' THEN 3 + (RANDOM() * 4)::INTEGER   -- 3-7 posts
    END
) generate_series
WHERE c.campaign_type IN ('social_media', 'mixed')
AND sa.platform = ANY(c.target_platforms);

-- =====================================================
-- 4. INSERT CAMPAIGN ANALYTICS
-- =====================================================

-- Generate daily analytics for each post over the last 30 days
INSERT INTO campaign_analytics_new (
    campaign_id, post_id, account_id, platform, analytics_date,
    impressions, reach, likes, comments, shares, link_clicks,
    video_views, video_completion_rate, engagement_rate, ayrshare_data
)
SELECT 
    cp.campaign_id,
    cp.post_id,
    cp.account_id,
    sa.platform,
    date_series.analytics_date,
    
    -- Impressions (varies by platform and performance tier)
    CASE sa.platform
        WHEN 'instagram' THEN 
            CASE 
                WHEN u.region IN ('East', 'West') THEN 2000 + (RANDOM() * 8000)::INTEGER  -- High performers
                WHEN u.region = 'Central' THEN 1500 + (RANDOM() * 5000)::INTEGER         -- Good performers  
                ELSE 800 + (RANDOM() * 2200)::INTEGER                                    -- Standard performers
            END
        WHEN 'facebook' THEN
            CASE 
                WHEN u.region IN ('East', 'West') THEN 1500 + (RANDOM() * 6000)::INTEGER
                WHEN u.region = 'Central' THEN 1000 + (RANDOM() * 4000)::INTEGER
                ELSE 500 + (RANDOM() * 1500)::INTEGER
            END
        WHEN 'twitter' THEN
            CASE 
                WHEN u.region IN ('East', 'West') THEN 800 + (RANDOM() * 3200)::INTEGER
                WHEN u.region = 'Central' THEN 500 + (RANDOM() * 2000)::INTEGER
                ELSE 200 + (RANDOM() * 800)::INTEGER
            END
        WHEN 'linkedin' THEN
            CASE 
                WHEN u.region IN ('East', 'West') THEN 400 + (RANDOM() * 1600)::INTEGER
                WHEN u.region = 'Central' THEN 250 + (RANDOM() * 1000)::INTEGER
                ELSE 100 + (RANDOM() * 400)::INTEGER
            END
    END as impressions,
    
    -- Reach (typically 60-80% of impressions)
    ROUND(
        (CASE sa.platform
            WHEN 'instagram' THEN 
                CASE 
                    WHEN u.region IN ('East', 'West') THEN 2000 + (RANDOM() * 8000)::INTEGER
                    WHEN u.region = 'Central' THEN 1500 + (RANDOM() * 5000)::INTEGER
                    ELSE 800 + (RANDOM() * 2200)::INTEGER
                END
            WHEN 'facebook' THEN
                CASE 
                    WHEN u.region IN ('East', 'West') THEN 1500 + (RANDOM() * 6000)::INTEGER
                    WHEN u.region = 'Central' THEN 1000 + (RANDOM() * 4000)::INTEGER
                    ELSE 500 + (RANDOM() * 1500)::INTEGER
                END
            WHEN 'twitter' THEN
                CASE 
                    WHEN u.region IN ('East', 'West') THEN 800 + (RANDOM() * 3200)::INTEGER
                    WHEN u.region = 'Central' THEN 500 + (RANDOM() * 2000)::INTEGER
                    ELSE 200 + (RANDOM() * 800)::INTEGER
                END
            WHEN 'linkedin' THEN
                CASE 
                    WHEN u.region IN ('East', 'West') THEN 400 + (RANDOM() * 1600)::INTEGER
                    WHEN u.region = 'Central' THEN 250 + (RANDOM() * 1000)::INTEGER
                    ELSE 100 + (RANDOM() * 400)::INTEGER
                END
        END) * (0.6 + RANDOM() * 0.2)
    )::INTEGER as reach,
    
    -- Engagement metrics based on platform characteristics and performance tiers
    -- Likes
    ROUND(
        (CASE sa.platform
            WHEN 'instagram' THEN 
                CASE 
                    WHEN u.region IN ('East', 'West') THEN (2000 + (RANDOM() * 8000)::INTEGER) * (0.06 + RANDOM() * 0.04)  -- 6-10%
                    WHEN u.region = 'Central' THEN (1500 + (RANDOM() * 5000)::INTEGER) * (0.04 + RANDOM() * 0.03)         -- 4-7%
                    ELSE (800 + (RANDOM() * 2200)::INTEGER) * (0.02 + RANDOM() * 0.02)                                    -- 2-4%
                END
            WHEN 'facebook' THEN
                CASE 
                    WHEN u.region IN ('East', 'West') THEN (1500 + (RANDOM() * 6000)::INTEGER) * (0.04 + RANDOM() * 0.03)
                    WHEN u.region = 'Central' THEN (1000 + (RANDOM() * 4000)::INTEGER) * (0.025 + RANDOM() * 0.025)
                    ELSE (500 + (RANDOM() * 1500)::INTEGER) * (0.015 + RANDOM() * 0.015)
                END
            WHEN 'twitter' THEN
                CASE 
                    WHEN u.region IN ('East', 'West') THEN (800 + (RANDOM() * 3200)::INTEGER) * (0.03 + RANDOM() * 0.025)
                    WHEN u.region = 'Central' THEN (500 + (RANDOM() * 2000)::INTEGER) * (0.02 + RANDOM() * 0.02)
                    ELSE (200 + (RANDOM() * 800)::INTEGER) * (0.01 + RANDOM() * 0.015)
                END
            WHEN 'linkedin' THEN
                CASE 
                    WHEN u.region IN ('East', 'West') THEN (400 + (RANDOM() * 1600)::INTEGER) * (0.05 + RANDOM() * 0.03)
                    WHEN u.region = 'Central' THEN (250 + (RANDOM() * 1000)::INTEGER) * (0.03 + RANDOM() * 0.025)
                    ELSE (100 + (RANDOM() * 400)::INTEGER) * (0.02 + RANDOM() * 0.02)
                END
        END)
    )::INTEGER as likes,
    
    -- Comments (typically 5-15% of likes)
    ROUND(
        (CASE sa.platform
            WHEN 'instagram' THEN 
                CASE 
                    WHEN u.region IN ('East', 'West') THEN (2000 + (RANDOM() * 8000)::INTEGER) * (0.06 + RANDOM() * 0.04) * (0.08 + RANDOM() * 0.07)
                    WHEN u.region = 'Central' THEN (1500 + (RANDOM() * 5000)::INTEGER) * (0.04 + RANDOM() * 0.03) * (0.06 + RANDOM() * 0.06)
                    ELSE (800 + (RANDOM() * 2200)::INTEGER) * (0.02 + RANDOM() * 0.02) * (0.04 + RANDOM() * 0.04)
                END
            ELSE 
                (CASE sa.platform
                    WHEN 'facebook' THEN 
                        CASE 
                            WHEN u.region IN ('East', 'West') THEN (1500 + (RANDOM() * 6000)::INTEGER) * (0.04 + RANDOM() * 0.03)
                            WHEN u.region = 'Central' THEN (1000 + (RANDOM() * 4000)::INTEGER) * (0.025 + RANDOM() * 0.025)
                            ELSE (500 + (RANDOM() * 1500)::INTEGER) * (0.015 + RANDOM() * 0.015)
                        END
                    WHEN 'twitter' THEN 
                        CASE 
                            WHEN u.region IN ('East', 'West') THEN (800 + (RANDOM() * 3200)::INTEGER) * (0.03 + RANDOM() * 0.025)
                            WHEN u.region = 'Central' THEN (500 + (RANDOM() * 2000)::INTEGER) * (0.02 + RANDOM() * 0.02)
                            ELSE (200 + (RANDOM() * 800)::INTEGER) * (0.01 + RANDOM() * 0.015)
                        END
                    WHEN 'linkedin' THEN 
                        CASE 
                            WHEN u.region IN ('East', 'West') THEN (400 + (RANDOM() * 1600)::INTEGER) * (0.05 + RANDOM() * 0.03)
                            WHEN u.region = 'Central' THEN (250 + (RANDOM() * 1000)::INTEGER) * (0.03 + RANDOM() * 0.025)
                            ELSE (100 + (RANDOM() * 400)::INTEGER) * (0.02 + RANDOM() * 0.02)
                        END
                END) * (0.05 + RANDOM() * 0.1)
        END)
    )::INTEGER as comments,
    
    -- Shares (typically 2-8% of likes)
    ROUND(
        (CASE sa.platform
            WHEN 'instagram' THEN 
                CASE 
                    WHEN u.region IN ('East', 'West') THEN (2000 + (RANDOM() * 8000)::INTEGER) * (0.06 + RANDOM() * 0.04) * (0.03 + RANDOM() * 0.05)
                    WHEN u.region = 'Central' THEN (1500 + (RANDOM() * 5000)::INTEGER) * (0.04 + RANDOM() * 0.03) * (0.02 + RANDOM() * 0.04)
                    ELSE (800 + (RANDOM() * 2200)::INTEGER) * (0.02 + RANDOM() * 0.02) * (0.01 + RANDOM() * 0.03)
                END
            ELSE 
                (CASE sa.platform
                    WHEN 'facebook' THEN 
                        CASE 
                            WHEN u.region IN ('East', 'West') THEN (1500 + (RANDOM() * 6000)::INTEGER) * (0.04 + RANDOM() * 0.03)
                            WHEN u.region = 'Central' THEN (1000 + (RANDOM() * 4000)::INTEGER) * (0.025 + RANDOM() * 0.025)
                            ELSE (500 + (RANDOM() * 1500)::INTEGER) * (0.015 + RANDOM() * 0.015)
                        END
                    WHEN 'twitter' THEN 
                        CASE 
                            WHEN u.region IN ('East', 'West') THEN (800 + (RANDOM() * 3200)::INTEGER) * (0.03 + RANDOM() * 0.025)
                            WHEN u.region = 'Central' THEN (500 + (RANDOM() * 2000)::INTEGER) * (0.02 + RANDOM() * 0.02)
                            ELSE (200 + (RANDOM() * 800)::INTEGER) * (0.01 + RANDOM() * 0.015)
                        END
                    WHEN 'linkedin' THEN 
                        CASE 
                            WHEN u.region IN ('East', 'West') THEN (400 + (RANDOM() * 1600)::INTEGER) * (0.05 + RANDOM() * 0.03)
                            WHEN u.region = 'Central' THEN (250 + (RANDOM() * 1000)::INTEGER) * (0.03 + RANDOM() * 0.025)
                            ELSE (100 + (RANDOM() * 400)::INTEGER) * (0.02 + RANDOM() * 0.02)
                        END
                END) * (0.02 + RANDOM() * 0.06)
        END)
    )::INTEGER as shares,
    
    -- Link clicks (1-5% of impressions)
    ROUND(
        (CASE sa.platform
            WHEN 'instagram' THEN 
                CASE 
                    WHEN u.region IN ('East', 'West') THEN (2000 + (RANDOM() * 8000)::INTEGER) * (0.02 + RANDOM() * 0.03)
                    WHEN u.region = 'Central' THEN (1500 + (RANDOM() * 5000)::INTEGER) * (0.015 + RANDOM() * 0.025)
                    ELSE (800 + (RANDOM() * 2200)::INTEGER) * (0.01 + RANDOM() * 0.02)
                END
            WHEN 'facebook' THEN
                CASE 
                    WHEN u.region IN ('East', 'West') THEN (1500 + (RANDOM() * 6000)::INTEGER) * (0.025 + RANDOM() * 0.025)
                    WHEN u.region = 'Central' THEN (1000 + (RANDOM() * 4000)::INTEGER) * (0.02 + RANDOM() * 0.02)
                    ELSE (500 + (RANDOM() * 1500)::INTEGER) * (0.015 + RANDOM() * 0.015)
                END
            WHEN 'twitter' THEN
                CASE 
                    WHEN u.region IN ('East', 'West') THEN (800 + (RANDOM() * 3200)::INTEGER) * (0.03 + RANDOM() * 0.02)
                    WHEN u.region = 'Central' THEN (500 + (RANDOM() * 2000)::INTEGER) * (0.025 + RANDOM() * 0.015)
                    ELSE (200 + (RANDOM() * 800)::INTEGER) * (0.02 + RANDOM() * 0.01)
                END
            WHEN 'linkedin' THEN
                CASE 
                    WHEN u.region IN ('East', 'West') THEN (400 + (RANDOM() * 1600)::INTEGER) * (0.04 + RANDOM() * 0.02)
                    WHEN u.region = 'Central' THEN (250 + (RANDOM() * 1000)::INTEGER) * (0.03 + RANDOM() * 0.015)
                    ELSE (100 + (RANDOM() * 400)::INTEGER) * (0.025 + RANDOM() * 0.01)
                END
        END)
    )::INTEGER as link_clicks,
    
    -- Video views (for video posts, 70-90% of impressions)
    CASE cp.post_type
        WHEN 'video' THEN 
            ROUND(
                (CASE sa.platform
                    WHEN 'instagram' THEN 
                        CASE 
                            WHEN u.region IN ('East', 'West') THEN (2000 + (RANDOM() * 8000)::INTEGER) * (0.75 + RANDOM() * 0.15)
                            WHEN u.region = 'Central' THEN (1500 + (RANDOM() * 5000)::INTEGER) * (0.7 + RANDOM() * 0.15)
                            ELSE (800 + (RANDOM() * 2200)::INTEGER) * (0.65 + RANDOM() * 0.15)
                        END
                    ELSE 
                        (CASE sa.platform
                            WHEN 'facebook' THEN 
                                CASE 
                                    WHEN u.region IN ('East', 'West') THEN (1500 + (RANDOM() * 6000)::INTEGER) * (0.7 + RANDOM() * 0.15)
                                    WHEN u.region = 'Central' THEN (1000 + (RANDOM() * 4000)::INTEGER) * (0.65 + RANDOM() * 0.15)
                                    ELSE (500 + (RANDOM() * 1500)::INTEGER) * (0.6 + RANDOM() * 0.15)
                                END
                            WHEN 'twitter' THEN 
                                CASE 
                                    WHEN u.region IN ('East', 'West') THEN (800 + (RANDOM() * 3200)::INTEGER) * (0.65 + RANDOM() * 0.15)
                                    WHEN u.region = 'Central' THEN (500 + (RANDOM() * 2000)::INTEGER) * (0.6 + RANDOM() * 0.15)
                                    ELSE (200 + (RANDOM() * 800)::INTEGER) * (0.55 + RANDOM() * 0.15)
                                END
                            WHEN 'linkedin' THEN 
                                CASE 
                                    WHEN u.region IN ('East', 'West') THEN (400 + (RANDOM() * 1600)::INTEGER) * (0.7 + RANDOM() * 0.15)
                                    WHEN u.region = 'Central' THEN (250 + (RANDOM() * 1000)::INTEGER) * (0.65 + RANDOM() * 0.15)
                                    ELSE (100 + (RANDOM() * 400)::INTEGER) * (0.6 + RANDOM() * 0.15)
                                END
                        END)
                END)
            )::INTEGER
        ELSE 0
    END as video_views,
    
    -- Video completion rate (for video posts, 25-65%)
    CASE cp.post_type
        WHEN 'video' THEN ROUND((25 + RANDOM() * 40)::DECIMAL, 2)
        ELSE 0
    END as video_completion_rate,
    
    -- Calculate engagement rate based on total engagement and impressions
    0 as engagement_rate, -- Will be updated below
    
    -- Ayrshare raw data (simulated)
    jsonb_build_object(
        'platform', sa.platform,
        'post_id', cp.ayrshare_post_id,
        'retrieved_at', NOW(),
        'api_version', '2.0'
    ) as ayrshare_data

FROM campaign_posts_new cp
JOIN social_accounts_new sa ON cp.account_id = sa.account_id
JOIN users u ON sa.retailer_id = u.id
CROSS JOIN generate_series(
    GREATEST(cp.published_at::date, CURRENT_DATE - INTERVAL '30 days'),
    CURRENT_DATE,
    INTERVAL '1 day'
) AS date_series(analytics_date)
WHERE cp.published_at <= date_series.analytics_date;

-- Update engagement rates after inserting the data
UPDATE campaign_analytics_new 
SET engagement_rate = CASE 
    WHEN impressions > 0 THEN 
        ROUND(((likes + comments + shares)::DECIMAL / impressions) * 100, 2)
    ELSE 0 
END;

-- =====================================================
-- 5. INSERT ACCOUNT PERFORMANCE DATA
-- =====================================================

-- Generate daily account performance data
INSERT INTO account_performance_new (
    account_id, campaign_id, platform, analytics_date,
    followers_count, following_count, new_followers, profile_visits,
    total_posts, total_impressions, total_reach, total_engagement, total_link_clicks,
    average_engagement_rate, follower_growth_rate, content_frequency
)
SELECT 
    sa.account_id,
    c.campaign_id,
    sa.platform,
    date_series.analytics_date,
    
    -- Followers count (growing over time)
    sa.follower_count + 
    (EXTRACT(DAY FROM date_series.analytics_date - c.start_date) * 
     CASE 
         WHEN u.region IN ('East', 'West') THEN 2 + (RANDOM() * 8)::INTEGER  -- 2-10 per day
         WHEN u.region = 'Central' THEN 1 + (RANDOM() * 5)::INTEGER          -- 1-6 per day
         ELSE (RANDOM() * 3)::INTEGER                                         -- 0-3 per day
     END
    ) as followers_count,
    
    sa.following_count as following_count,
    
    -- New followers per day
    CASE 
        WHEN u.region IN ('East', 'West') THEN 2 + (RANDOM() * 8)::INTEGER
        WHEN u.region = 'Central' THEN 1 + (RANDOM() * 5)::INTEGER
        ELSE (RANDOM() * 3)::INTEGER
    END as new_followers,
    
    -- Profile visits (5-15% of followers)
    ROUND(
        (sa.follower_count + 
         (EXTRACT(DAY FROM date_series.analytics_date - c.start_date) * 
          CASE 
              WHEN u.region IN ('East', 'West') THEN 2 + (RANDOM() * 8)::INTEGER
              WHEN u.region = 'Central' THEN 1 + (RANDOM() * 5)::INTEGER
              ELSE (RANDOM() * 3)::INTEGER
          END
         )
        ) * (0.05 + RANDOM() * 0.1)
    )::INTEGER as profile_visits,
    
    -- Aggregated daily metrics from posts
    COALESCE(daily_stats.posts_count, 0) as total_posts,
    COALESCE(daily_stats.total_impressions, 0) as total_impressions,
    COALESCE(daily_stats.total_reach, 0) as total_reach,
    COALESCE(daily_stats.total_engagement, 0) as total_engagement,
    COALESCE(daily_stats.total_link_clicks, 0) as total_link_clicks,
    COALESCE(daily_stats.avg_engagement_rate, 0) as average_engagement_rate,
    
    -- Follower growth rate (calculated)
    CASE 
        WHEN sa.follower_count > 0 THEN 
            ROUND(
                ((CASE 
                    WHEN u.region IN ('East', 'West') THEN 2 + (RANDOM() * 8)::INTEGER
                    WHEN u.region = 'Central' THEN 1 + (RANDOM() * 5)::INTEGER
                    ELSE (RANDOM() * 3)::INTEGER
                END)::DECIMAL / sa.follower_count) * 100, 2
            )
        ELSE 0 
    END as follower_growth_rate,
    
    -- Content frequency (posts per day)
    COALESCE(daily_stats.posts_count, 0) as content_frequency

FROM social_accounts_new sa
JOIN users u ON sa.retailer_id = u.id
CROSS JOIN campaigns_new c
CROSS JOIN generate_series(
    c.start_date,
    LEAST(COALESCE(c.end_date, CURRENT_DATE), CURRENT_DATE),
    INTERVAL '1 day'
) AS date_series(analytics_date)
LEFT JOIN (
    -- Aggregate daily post statistics
    SELECT 
        ca.account_id,
        ca.campaign_id,
        ca.analytics_date,
        COUNT(*) as posts_count,
        SUM(ca.impressions) as total_impressions,
        SUM(ca.reach) as total_reach,
        SUM(ca.total_engagement) as total_engagement,
        SUM(ca.link_clicks) as total_link_clicks,
        ROUND(AVG(ca.engagement_rate), 2) as avg_engagement_rate
    FROM campaign_analytics_new ca
    GROUP BY ca.account_id, ca.campaign_id, ca.analytics_date
) daily_stats ON sa.account_id = daily_stats.account_id 
                AND c.campaign_id = daily_stats.campaign_id 
                AND date_series.analytics_date = daily_stats.analytics_date
WHERE sa.platform = ANY(c.target_platforms)
AND c.campaign_type IN ('social_media', 'mixed');

-- =====================================================
-- 6. INSERT EMAIL CAMPAIGNS
-- =====================================================

-- Generate email campaigns for campaigns that include email
INSERT INTO email_campaigns_new (
    campaign_id, retailer_id, email_subject, email_content, sent_at,
    recipients_count, delivered_count, opened_count, clicked_count
)
SELECT 
    c.campaign_id,
    u.id as retailer_id,
    
    -- Campaign-appropriate email subjects
    CASE c.campaign_name
        WHEN 'Luxury Holiday Collection 2024' THEN 
            CASE (RANDOM() * 3)::INTEGER
                WHEN 0 THEN '✨ Exclusive Holiday Collection - Limited Time Only'
                WHEN 1 THEN '🎁 Holiday Luxury: Your Personal Collection Preview'
                ELSE '💎 Discover Our Most Coveted Holiday Pieces'
            END
        WHEN 'Spring Elegance 2025 Preview' THEN
            CASE (RANDOM() * 3)::INTEGER
                WHEN 0 THEN '🌸 Spring Elegance Preview - Be the First to See'
                WHEN 1 THEN '✨ New Season, New Elegance - Spring 2025'
                ELSE '🌿 Fresh Designs for Spring - Exclusive Preview'
            END
        ELSE
            CASE (RANDOM() * 3)::INTEGER
                WHEN 0 THEN '📖 The Story Behind Our Craftsmanship'
                WHEN 1 THEN '🏛️ Heritage Collection - Timeless Elegance'
                ELSE '✨ Discover the Art of Fine Jewelry'
            END
    END as email_subject,
    
    -- Email content
    'Discover our latest collection featuring exquisite craftsmanship and timeless design. Each piece is carefully selected to represent the pinnacle of luxury jewelry artistry.' as email_content,
    
    -- Sent dates (spread over campaign period)
    c.start_date + (RANDOM() * (COALESCE(c.end_date, CURRENT_DATE) - c.start_date))::INTEGER * INTERVAL '1 day' + 
    (RANDOM() * INTERVAL '12 hours') + INTERVAL '9 hours' as sent_at,
    
    -- Recipients count (varies by retailer size and region)
    CASE u.region
        WHEN 'East' THEN 800 + (RANDOM() * 1200)::INTEGER   -- 800-2000 recipients
        WHEN 'West' THEN 700 + (RANDOM() * 1300)::INTEGER   -- 700-2000 recipients
        WHEN 'Central' THEN 500 + (RANDOM() * 1000)::INTEGER -- 500-1500 recipients
        WHEN 'North' THEN 300 + (RANDOM() * 700)::INTEGER    -- 300-1000 recipients
        ELSE 200 + (RANDOM() * 500)::INTEGER                 -- 200-700 recipients
    END as recipients_count,
    
    0 as delivered_count, -- Will be calculated below
    0 as opened_count,    -- Will be calculated below
    0 as clicked_count    -- Will be calculated below

FROM campaigns_new c
CROSS JOIN users u
WHERE u.user_type = 'retailer' 
AND u.is_active = true
AND (c.campaign_type = 'email' OR c.campaign_type = 'mixed');

-- Update email metrics with realistic performance
UPDATE email_campaigns_new 
SET 
    delivered_count = ROUND(recipients_count * (0.95 + RANDOM() * 0.04)), -- 95-99% delivery rate
    opened_count = ROUND(recipients_count * (0.95 + RANDOM() * 0.04) * (0.15 + RANDOM() * 0.15)), -- 15-30% open rate
    clicked_count = ROUND(recipients_count * (0.95 + RANDOM() * 0.04) * (0.15 + RANDOM() * 0.15) * (0.02 + RANDOM() * 0.06)); -- 2-8% click rate

-- =====================================================
-- 7. CREATE SUMMARY STATISTICS
-- =====================================================

-- Display summary of generated data
DO $$
DECLARE
    campaign_count INTEGER;
    account_count INTEGER;
    post_count INTEGER;
    analytics_count INTEGER;
    performance_count INTEGER;
    email_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO campaign_count FROM campaigns_new;
    SELECT COUNT(*) INTO account_count FROM social_accounts_new;
    SELECT COUNT(*) INTO post_count FROM campaign_posts_new;
    SELECT COUNT(*) INTO analytics_count FROM campaign_analytics_new;
    SELECT COUNT(*) INTO performance_count FROM account_performance_new;
    SELECT COUNT(*) INTO email_count FROM email_campaigns_new;
    
    RAISE NOTICE '=== CAMPAIGN PERFORMANCE NEW - DUMMY DATA SUMMARY ===';
    RAISE NOTICE 'Campaigns Created: %', campaign_count;
    RAISE NOTICE 'Social Accounts: %', account_count;
    RAISE NOTICE 'Campaign Posts: %', post_count;
    RAISE NOTICE 'Analytics Records: %', analytics_count;
    RAISE NOTICE 'Performance Records: %', performance_count;
    RAISE NOTICE 'Email Campaigns: %', email_count;
    RAISE NOTICE '=== DATA GENERATION COMPLETE ===';
END $$;