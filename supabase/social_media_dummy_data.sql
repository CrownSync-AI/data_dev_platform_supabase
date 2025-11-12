-- =====================================================
-- Social Media Analytics Dummy Data
-- Run this AFTER the quick setup script
-- =====================================================

-- =====================================================
-- 1. INSERT SOCIAL ACCOUNTS
-- =====================================================

INSERT INTO social_accounts (user_id, platform, account_handle, account_name, profile_url, ayrshare_profile_key, is_active, connected_at, last_sync_at, account_metadata)
SELECT 
    u.id,
    platform.name,
    LOWER(REPLACE(u.name, ' ', '_')) || '_' || LOWER(platform.name),
    u.name || ' ' || INITCAP(platform.name),
    CASE platform.name
        WHEN 'linkedin' THEN 'https://linkedin.com/company/' || LOWER(REPLACE(u.name, ' ', '-'))
        WHEN 'instagram' THEN 'https://instagram.com/' || LOWER(REPLACE(u.name, ' ', '_'))
        WHEN 'facebook' THEN 'https://facebook.com/' || LOWER(REPLACE(u.name, ' ', ''))
        WHEN 'google_business' THEN 'https://business.google.com/dashboard/l/' || LOWER(REPLACE(u.name, ' ', '-'))
    END,
    'ayr_' || LOWER(platform.name) || '_' || SUBSTRING(u.id::text, 1, 8),
    true,
    NOW() - (RANDOM() * INTERVAL '90 days'),
    NOW() - (RANDOM() * INTERVAL '1 day'),
    CASE platform.name
        WHEN 'linkedin' THEN '{"company_size": "51-200", "industry": "Luxury Goods"}'::jsonb
        WHEN 'instagram' THEN '{"business_type": "Retail", "category": "Jewelry Store"}'::jsonb
        WHEN 'facebook' THEN '{"page_type": "Business", "category": "Jewelry & Watches Store"}'::jsonb
        WHEN 'google_business' THEN '{"business_type": "Jewelry store", "verified": true}'::jsonb
    END
FROM users u
CROSS JOIN (
    VALUES ('linkedin'), ('instagram'), ('facebook'), ('google_business')
) AS platform(name)
WHERE u.user_type = 'retailer'
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. INSERT SOCIAL POSTS
-- =====================================================

INSERT INTO social_posts (account_id, post_type, content, hashtags, published_at, status, post_metadata)
SELECT 
    sa.id,
    post_types.type,
    post_content.content,
    post_content.hashtags,
    NOW() - (FLOOR(RANDOM() * 30) || ' days')::INTERVAL + 
    (FLOOR(RANDOM() * 24) || ' hours')::INTERVAL,
    'published',
    CASE sa.platform
        WHEN 'linkedin' THEN '{"post_format": "single_image", "target_audience": "professionals"}'::jsonb
        WHEN 'instagram' THEN '{"aspect_ratio": "1:1", "filter": "none", "location": "New York, NY"}'::jsonb
        WHEN 'facebook' THEN '{"audience": "public", "boost_eligible": true}'::jsonb
        WHEN 'google_business' THEN '{"post_type": "offer", "cta_button": "Learn More"}'::jsonb
    END
FROM social_accounts sa
CROSS JOIN (
    VALUES 
        ('image'), ('video'), ('carousel')
) AS post_types(type)
CROSS JOIN (
    VALUES 
        ('✨ Discover the elegance of our new luxury collection. Each piece crafted with precision and passion. #LuxuryJewelry #Craftsmanship #Elegance', ARRAY['#LuxuryJewelry', '#Craftsmanship', '#Elegance']),
        ('🎯 Behind the scenes: The artistry that goes into every handcrafted piece. #BehindTheScenes #Artistry #Handcrafted', ARRAY['#BehindTheScenes', '#Artistry', '#Handcrafted']),
        ('💎 Introducing our exclusive Marco Bicego collection - where Italian heritage meets modern sophistication. #MarcoBicego #Italian #Sophistication', ARRAY['#MarcoBicego', '#Italian', '#Sophistication']),
        ('🌟 Client spotlight: See how our pieces become part of life''s most precious moments. #ClientSpotlight #PreciousMoments #Luxury', ARRAY['#ClientSpotlight', '#PreciousMoments', '#Luxury']),
        ('🏆 Award-winning designs that capture the essence of timeless beauty. #AwardWinning #TimelessBeauty #Design', ARRAY['#AwardWinning', '#TimelessBeauty', '#Design']),
        ('💍 Engagement season is here! Find the perfect ring to symbolize your love story. #EngagementRing #LoveStory #Perfect', ARRAY['#EngagementRing', '#LoveStory', '#Perfect'])
) AS post_content(content, hashtags)
WHERE sa.is_active = true
LIMIT 300;

-- =====================================================
-- 3. INSERT SOCIAL ANALYTICS DATA
-- =====================================================

INSERT INTO social_analytics (
    post_id, account_id, platform, analytics_date,
    impressions, reach, organic_reach, paid_reach,
    likes, comments, shares, reactions, saves,
    link_clicks, profile_clicks, website_clicks,
    video_views, video_completion_rate, average_watch_time,
    platform_metrics
)
SELECT 
    sp.id,
    sp.account_id,
    sa.platform,
    date_series.date,
    -- Platform-appropriate impression ranges
    CASE sa.platform
        WHEN 'instagram' THEN FLOOR(RANDOM() * 5000 + 1000)::INTEGER
        WHEN 'linkedin' THEN FLOOR(RANDOM() * 2000 + 500)::INTEGER
        WHEN 'facebook' THEN FLOOR(RANDOM() * 3000 + 800)::INTEGER
        WHEN 'google_business' THEN FLOOR(RANDOM() * 1500 + 300)::INTEGER
    END as impressions,
    -- Reach (typically 60-80% of impressions)
    FLOOR((CASE sa.platform
        WHEN 'instagram' THEN FLOOR(RANDOM() * 5000 + 1000)
        WHEN 'linkedin' THEN FLOOR(RANDOM() * 2000 + 500)
        WHEN 'facebook' THEN FLOOR(RANDOM() * 3000 + 800)
        WHEN 'google_business' THEN FLOOR(RANDOM() * 1500 + 300)
    END) * (0.6 + RANDOM() * 0.2))::INTEGER as reach,
    -- Organic reach (70-90% of total reach)
    FLOOR((CASE sa.platform
        WHEN 'instagram' THEN FLOOR(RANDOM() * 5000 + 1000)
        WHEN 'linkedin' THEN FLOOR(RANDOM() * 2000 + 500)
        WHEN 'facebook' THEN FLOOR(RANDOM() * 3000 + 800)
        WHEN 'google_business' THEN FLOOR(RANDOM() * 1500 + 300)
    END) * (0.6 + RANDOM() * 0.2) * (0.7 + RANDOM() * 0.2))::INTEGER as organic_reach,
    -- Paid reach (10-30% of total reach)
    FLOOR((CASE sa.platform
        WHEN 'instagram' THEN FLOOR(RANDOM() * 5000 + 1000)
        WHEN 'linkedin' THEN FLOOR(RANDOM() * 2000 + 500)
        WHEN 'facebook' THEN FLOOR(RANDOM() * 3000 + 800)
        WHEN 'google_business' THEN FLOOR(RANDOM() * 1500 + 300)
    END) * (0.6 + RANDOM() * 0.2) * (0.1 + RANDOM() * 0.2))::INTEGER as paid_reach,
    -- Engagement metrics with platform-appropriate ranges
    FLOOR(RANDOM() * 100 + 10)::INTEGER as likes,
    FLOOR(RANDOM() * 20 + 2)::INTEGER as comments,
    FLOOR(RANDOM() * 15 + 1)::INTEGER as shares,
    FLOOR(RANDOM() * 25 + 3)::INTEGER as reactions,
    CASE sa.platform WHEN 'instagram' THEN FLOOR(RANDOM() * 30 + 5)::INTEGER ELSE 0 END as saves,
    FLOOR(RANDOM() * 30 + 5)::INTEGER as link_clicks,
    FLOOR(RANDOM() * 20 + 2)::INTEGER as profile_clicks,
    FLOOR(RANDOM() * 25 + 3)::INTEGER as website_clicks,
    -- Video metrics (only for video posts)
    CASE sp.post_type 
        WHEN 'video' THEN FLOOR(RANDOM() * 2000 + 200)::INTEGER 
        ELSE 0 
    END as video_views,
    CASE sp.post_type 
        WHEN 'video' THEN (RANDOM() * 80 + 20)::DECIMAL(5,2)
        ELSE 0 
    END as video_completion_rate,
    CASE sp.post_type 
        WHEN 'video' THEN FLOOR(RANDOM() * 120 + 30)::INTEGER 
        ELSE 0 
    END as average_watch_time,
    -- Platform-specific metrics
    CASE sa.platform
        WHEN 'linkedin' THEN ('{"company_page_clicks": ' || FLOOR(RANDOM() * 50 + 5) || ', "career_page_clicks": ' || FLOOR(RANDOM() * 10 + 1) || '}')::jsonb
        WHEN 'instagram' THEN ('{"story_exits": ' || FLOOR(RANDOM() * 20 + 2) || ', "story_replies": ' || FLOOR(RANDOM() * 5 + 1) || '}')::jsonb
        WHEN 'facebook' THEN ('{"post_clicks": ' || FLOOR(RANDOM() * 40 + 5) || ', "other_clicks": ' || FLOOR(RANDOM() * 15 + 2) || '}')::jsonb
        WHEN 'google_business' THEN ('{"direction_requests": ' || FLOOR(RANDOM() * 25 + 3) || ', "phone_calls": ' || FLOOR(RANDOM() * 10 + 1) || '}')::jsonb
    END as platform_metrics
FROM social_posts sp
JOIN social_accounts sa ON sp.account_id = sa.id
CROSS JOIN (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '30 days',
        CURRENT_DATE - INTERVAL '1 day',
        INTERVAL '1 day'
    )::date as date
) date_series
WHERE sp.status = 'published'
    AND sp.published_at::date <= date_series.date
ON CONFLICT (post_id, analytics_date) DO NOTHING;

-- =====================================================
-- 4. INSERT ACCOUNT ANALYTICS DATA
-- =====================================================

INSERT INTO account_analytics (
    account_id, platform, analytics_date,
    followers_count, following_count, new_followers, unfollowers,
    profile_visits, profile_actions, website_clicks_from_profile,
    total_posts, total_impressions, total_reach, total_engagement,
    platform_account_metrics, average_engagement_rate
)
SELECT 
    sa.id,
    sa.platform,
    date_series.date,
    -- Follower counts with gradual growth
    CASE sa.platform
        WHEN 'instagram' THEN 5000 + FLOOR(RANDOM() * 10000) + (date_series.date - CURRENT_DATE + 30) * (5 + FLOOR(RANDOM() * 15))
        WHEN 'linkedin' THEN 1000 + FLOOR(RANDOM() * 5000) + (date_series.date - CURRENT_DATE + 30) * (2 + FLOOR(RANDOM() * 8))
        WHEN 'facebook' THEN 3000 + FLOOR(RANDOM() * 8000) + (date_series.date - CURRENT_DATE + 30) * (3 + FLOOR(RANDOM() * 12))
        WHEN 'google_business' THEN 500 + FLOOR(RANDOM() * 2000) + (date_series.date - CURRENT_DATE + 30) * (1 + FLOOR(RANDOM() * 5))
    END::INTEGER as followers_count,
    FLOOR(RANDOM() * 500 + 100)::INTEGER as following_count,
    FLOOR(RANDOM() * 20 + 5)::INTEGER as new_followers,
    FLOOR(RANDOM() * 8 + 1)::INTEGER as unfollowers,
    FLOOR(RANDOM() * 200 + 50)::INTEGER as profile_visits,
    FLOOR(RANDOM() * 50 + 10)::INTEGER as profile_actions,
    FLOOR(RANDOM() * 30 + 5)::INTEGER as website_clicks_from_profile,
    CASE WHEN RANDOM() > 0.7 THEN FLOOR(RANDOM() * 3 + 1)::INTEGER ELSE 0 END as total_posts,
    FLOOR(RANDOM() * 5000 + 1000)::INTEGER as total_impressions,
    FLOOR(RANDOM() * 3000 + 600)::INTEGER as total_reach,
    FLOOR(RANDOM() * 200 + 50)::INTEGER as total_engagement,
    CASE sa.platform
        WHEN 'linkedin' THEN ('{"company_page_views": ' || FLOOR(RANDOM() * 100 + 20) || ', "career_page_views": ' || FLOOR(RANDOM() * 30 + 5) || '}')::jsonb
        WHEN 'instagram' THEN ('{"story_views": ' || FLOOR(RANDOM() * 500 + 100) || ', "reel_plays": ' || FLOOR(RANDOM() * 1000 + 200) || '}')::jsonb
        WHEN 'facebook' THEN ('{"page_views": ' || FLOOR(RANDOM() * 150 + 30) || ', "page_previews": ' || FLOOR(RANDOM() * 80 + 15) || '}')::jsonb
        WHEN 'google_business' THEN ('{"search_views": ' || FLOOR(RANDOM() * 200 + 40) || ', "map_views": ' || FLOOR(RANDOM() * 100 + 20) || '}')::jsonb
    END as platform_account_metrics,
    (RANDOM() * 8 + 1)::DECIMAL(5,2) as average_engagement_rate
FROM social_accounts sa
CROSS JOIN (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '30 days',
        CURRENT_DATE - INTERVAL '1 day',
        INTERVAL '1 day'
    )::date as date
) date_series
WHERE sa.is_active = true
ON CONFLICT (account_id, analytics_date) DO NOTHING;

-- =====================================================
-- 5. INSERT AUDIENCE DEMOGRAPHICS DATA
-- =====================================================

INSERT INTO audience_demographics (
    account_id, platform, analytics_date,
    age_13_17, age_18_24, age_25_34, age_35_44, age_45_54, age_55_64, age_65_plus,
    gender_male, gender_female, gender_other,
    top_countries, top_cities, interests
)
SELECT 
    sa.id,
    sa.platform,
    date_series.date,
    (RANDOM() * 5 + 2)::DECIMAL(5,2) as age_13_17,
    (RANDOM() * 15 + 10)::DECIMAL(5,2) as age_18_24,
    (RANDOM() * 25 + 20)::DECIMAL(5,2) as age_25_34,
    (RANDOM() * 20 + 25)::DECIMAL(5,2) as age_35_44,
    (RANDOM() * 15 + 20)::DECIMAL(5,2) as age_45_54,
    (RANDOM() * 10 + 15)::DECIMAL(5,2) as age_55_64,
    (RANDOM() * 8 + 5)::DECIMAL(5,2) as age_65_plus,
    (RANDOM() * 15 + 25)::DECIMAL(5,2) as gender_male,
    (RANDOM() * 15 + 65)::DECIMAL(5,2) as gender_female,
    (RANDOM() * 3 + 1)::DECIMAL(5,2) as gender_other,
    '{"US": 45.2, "UK": 12.8, "CA": 8.5, "AU": 6.2, "DE": 4.8, "FR": 4.1, "IT": 3.9, "JP": 3.2, "CH": 2.8, "NL": 2.5}'::jsonb as top_countries,
    '{"New York": 15.2, "London": 8.9, "Los Angeles": 7.3, "Toronto": 5.1, "Sydney": 4.2, "Paris": 3.8, "Milan": 3.1, "Tokyo": 2.9, "Zurich": 2.4, "Amsterdam": 2.1}'::jsonb as top_cities,
    '{"luxury": 45.5, "jewelry": 38.2, "fashion": 32.1, "lifestyle": 28.9, "beauty": 22.3, "travel": 18.7, "art": 15.2, "design": 12.8, "watches": 11.4, "accessories": 9.7}'::jsonb as interests
FROM social_accounts sa
CROSS JOIN (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '28 days',
        CURRENT_DATE - INTERVAL '1 day',
        INTERVAL '7 days'
    )::date as date
) date_series
WHERE sa.is_active = true
ON CONFLICT (account_id, platform, analytics_date) DO NOTHING;

-- =====================================================
-- 6. INSERT HASHTAG PERFORMANCE DATA
-- =====================================================

INSERT INTO hashtag_performance (
    account_id, hashtag, platform, analytics_date,
    posts_count, total_impressions, total_reach, total_engagement,
    average_engagement_rate, click_through_rate
)
SELECT 
    sa.id,
    hashtag,
    sa.platform,
    CURRENT_DATE - INTERVAL '7 days',
    FLOOR(RANDOM() * 5 + 1)::INTEGER as posts_count,
    FLOOR(RANDOM() * 2000 + 500)::INTEGER as total_impressions,
    FLOOR(RANDOM() * 1500 + 300)::INTEGER as total_reach,
    FLOOR(RANDOM() * 150 + 30)::INTEGER as total_engagement,
    (RANDOM() * 8 + 2)::DECIMAL(5,2) as average_engagement_rate,
    (RANDOM() * 3 + 0.5)::DECIMAL(5,2) as click_through_rate
FROM social_accounts sa
CROSS JOIN (
    VALUES 
        ('#LuxuryJewelry'), ('#Craftsmanship'), ('#Elegance'), ('#MarcoBicego'),
        ('#Italian'), ('#Sophistication'), ('#BehindTheScenes'), ('#Artistry'),
        ('#Handcrafted'), ('#ClientSpotlight'), ('#PreciousMoments'), ('#Luxury'),
        ('#AwardWinning'), ('#TimelessBeauty'), ('#Design'), ('#EngagementRing'),
        ('#LoveStory'), ('#Perfect'), ('#Jewelry'), ('#Fashion'), ('#Style'),
        ('#Diamonds'), ('#Gold'), ('#Silver'), ('#Watches'), ('#Accessories')
) AS hashtags(hashtag)
WHERE sa.is_active = true
    AND RANDOM() > 0.7
ON CONFLICT (account_id, hashtag, platform, analytics_date) DO NOTHING;

-- =====================================================
-- 7. VERIFICATION
-- =====================================================

-- Show counts of inserted data
SELECT 
    'Social Accounts' as table_name, 
    COUNT(*) as record_count 
FROM social_accounts
UNION ALL
SELECT 
    'Social Posts' as table_name, 
    COUNT(*) as record_count 
FROM social_posts
UNION ALL
SELECT 
    'Social Analytics' as table_name, 
    COUNT(*) as record_count 
FROM social_analytics
UNION ALL
SELECT 
    'Account Analytics' as table_name, 
    COUNT(*) as record_count 
FROM account_analytics
UNION ALL
SELECT 
    'Audience Demographics' as table_name, 
    COUNT(*) as record_count 
FROM audience_demographics
UNION ALL
SELECT 
    'Hashtag Performance' as table_name, 
    COUNT(*) as record_count 
FROM hashtag_performance;

-- Test the views
SELECT 'Social Performance Summary' as view_name, COUNT(*) as record_count FROM social_performance_summary
UNION ALL
SELECT 'Top Performing Content' as view_name, COUNT(*) as record_count FROM top_performing_content;