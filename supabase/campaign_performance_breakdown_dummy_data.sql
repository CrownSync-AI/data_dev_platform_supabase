-- Campaign Performance Breakdown - Enhanced Dummy Data
-- This script adds realistic breakdown data for deeper analytics
-- Based on Ayrshare API structure with organic vs paid, post types, and platform breakdowns

-- =====================================================
-- 1. UPDATE EXISTING POSTS WITH BREAKDOWN DATA
-- =====================================================

-- Update posts with realistic post type distribution
UPDATE campaign_posts_new 
SET post_type = CASE 
    WHEN RANDOM() < 0.4 THEN 'image'      -- 40% images
    WHEN RANDOM() < 0.7 THEN 'video'      -- 30% videos  
    WHEN RANDOM() < 0.85 THEN 'carousel'  -- 15% carousels
    WHEN RANDOM() < 0.95 THEN 'story'     -- 10% stories
    ELSE 'text'                           -- 5% text posts
END
WHERE post_type IS NULL;

-- Update with campaign type (organic vs paid) - realistic distribution
UPDATE campaign_posts_new 
SET 
    campaign_type = CASE 
        WHEN RANDOM() < 0.75 THEN 'organic'  -- 75% organic content
        ELSE 'paid'
    END,
    is_promoted = CASE 
        WHEN RANDOM() < 0.25 THEN true  -- 25% of posts are promoted
        ELSE false
    END;

-- Update promoted posts with realistic budget data
UPDATE campaign_posts_new 
SET 
    promotion_budget = CASE 
        WHEN is_promoted = true THEN 
            CASE 
                WHEN post_type = 'video' THEN ROUND((RANDOM() * 800 + 100)::NUMERIC, 2)  -- $100-$900 for videos
                WHEN post_type = 'carousel' THEN ROUND((RANDOM() * 600 + 75)::NUMERIC, 2)  -- $75-$675 for carousels
                WHEN post_type = 'image' THEN ROUND((RANDOM() * 400 + 50)::NUMERIC, 2)   -- $50-$450 for images
                ELSE ROUND((RANDOM() * 300 + 25)::NUMERIC, 2)  -- $25-$325 for others
            END
        ELSE NULL
    END,
    promotion_start_date = CASE 
        WHEN is_promoted = true THEN 
            published_at + INTERVAL '2 hours'
        ELSE NULL
    END,
    promotion_end_date = CASE 
        WHEN is_promoted = true THEN 
            published_at + CASE 
                WHEN post_type = 'video' THEN INTERVAL '10 days'  -- Longer promotion for videos
                WHEN post_type = 'story' THEN INTERVAL '3 days'   -- Shorter for stories
                ELSE INTERVAL '7 days'  -- Standard 7 days
            END
        ELSE NULL
    END
WHERE campaign_type IS NOT NULL;

-- =====================================================
-- 2. UPDATE ANALYTICS WITH BREAKDOWN METRICS
-- =====================================================

-- Update analytics records with post type and campaign type from posts
UPDATE campaign_analytics_new 
SET 
    post_type = cp.post_type,
    campaign_type = cp.campaign_type,
    is_promoted = cp.is_promoted
FROM campaign_posts_new cp
WHERE campaign_analytics_new.post_id = cp.post_id;

-- Calculate realistic promotion spend and costs for paid content
UPDATE campaign_analytics_new 
SET 
    promotion_spend = CASE 
        WHEN campaign_analytics_new.is_promoted = true AND cp.promotion_budget IS NOT NULL THEN 
            ROUND((cp.promotion_budget / EXTRACT(DAY FROM (cp.promotion_end_date - cp.promotion_start_date)))::NUMERIC, 2)
        ELSE 0
    END,
    cost_per_click = CASE 
        WHEN campaign_analytics_new.is_promoted = true AND campaign_analytics_new.link_clicks > 0 AND cp.promotion_budget IS NOT NULL THEN 
            ROUND((cp.promotion_budget / EXTRACT(DAY FROM (cp.promotion_end_date - cp.promotion_start_date)) / campaign_analytics_new.link_clicks)::NUMERIC, 4)
        ELSE NULL
    END,
    cost_per_impression = CASE 
        WHEN campaign_analytics_new.is_promoted = true AND campaign_analytics_new.impressions > 0 AND cp.promotion_budget IS NOT NULL THEN 
            ROUND((cp.promotion_budget / EXTRACT(DAY FROM (cp.promotion_end_date - cp.promotion_start_date)) / campaign_analytics_new.impressions * 1000)::NUMERIC, 4)
        ELSE NULL
    END
FROM campaign_posts_new cp
WHERE campaign_analytics_new.post_id = cp.post_id AND cp.is_promoted = true;

-- =====================================================
-- 3. ENHANCE ANALYTICS WITH POST TYPE PERFORMANCE VARIATIONS
-- =====================================================

-- Adjust metrics based on post type performance characteristics
UPDATE campaign_analytics_new 
SET 
    -- Video posts typically get higher engagement but lower reach
    engagement_rate = CASE 
        WHEN post_type = 'video' THEN 
            LEAST(engagement_rate * (1.2 + RANDOM() * 0.3), 15.0)  -- 20-50% boost, cap at 15%
        WHEN post_type = 'carousel' THEN 
            engagement_rate * (1.1 + RANDOM() * 0.2)  -- 10-30% boost
        WHEN post_type = 'story' THEN 
            engagement_rate * (0.8 + RANDOM() * 0.3)  -- Stories vary widely
        WHEN post_type = 'text' THEN 
            engagement_rate * (0.7 + RANDOM() * 0.2)  -- Text posts typically lower
        ELSE engagement_rate  -- Images stay baseline
    END,
    
    -- Video views for video content
    video_views = CASE 
        WHEN post_type = 'video' THEN 
            ROUND(reach * (0.6 + RANDOM() * 0.3))  -- 60-90% of reach watches video
        ELSE 0
    END,
    
    -- Video completion rate for video content
    video_completion_rate = CASE 
        WHEN post_type = 'video' THEN 
            ROUND((25 + RANDOM() * 50)::NUMERIC, 2)  -- 25-75% completion rate
        ELSE 0
    END,
    
    -- Link clicks vary by post type
    link_clicks = CASE 
        WHEN post_type = 'carousel' THEN 
            ROUND(link_clicks * (1.3 + RANDOM() * 0.4))  -- Carousels drive more clicks
        WHEN post_type = 'video' THEN 
            ROUND(link_clicks * (0.8 + RANDOM() * 0.3))  -- Videos less click-focused
        WHEN post_type = 'story' THEN 
            ROUND(link_clicks * (1.1 + RANDOM() * 0.2))  -- Stories good for clicks
        ELSE link_clicks
    END
WHERE post_type IS NOT NULL;

-- Recalculate total engagement after adjustments
UPDATE campaign_analytics_new 
SET total_engagement = likes + comments + shares;

-- =====================================================
-- 4. ADD PLATFORM-SPECIFIC PERFORMANCE VARIATIONS
-- =====================================================

-- Adjust metrics based on platform characteristics
UPDATE campaign_analytics_new 
SET 
    engagement_rate = CASE 
        WHEN platform = 'instagram' AND post_type = 'image' THEN 
            LEAST(engagement_rate * (1.2 + RANDOM() * 0.3), 12.0)  -- Instagram images perform well
        WHEN platform = 'instagram' AND post_type = 'story' THEN 
            engagement_rate * (1.4 + RANDOM() * 0.4)  -- Instagram stories are strong
        WHEN platform = 'linkedin' AND post_type = 'text' THEN 
            engagement_rate * (1.3 + RANDOM() * 0.3)  -- LinkedIn text posts work well
        WHEN platform = 'facebook' AND post_type = 'video' THEN 
            engagement_rate * (1.1 + RANDOM() * 0.2)  -- Facebook video boost
        WHEN platform = 'twitter' AND post_type = 'text' THEN 
            engagement_rate * (1.0 + RANDOM() * 0.3)  -- Twitter text baseline
        ELSE engagement_rate
    END,
    
    -- Platform-specific reach adjustments
    reach = CASE 
        WHEN platform = 'facebook' THEN 
            ROUND(reach * (1.1 + RANDOM() * 0.2))  -- Facebook has broad reach
        WHEN platform = 'instagram' THEN 
            ROUND(reach * (0.9 + RANDOM() * 0.2))  -- Instagram more targeted
        WHEN platform = 'linkedin' THEN 
            ROUND(reach * (0.7 + RANDOM() * 0.3))  -- LinkedIn smaller but professional
        WHEN platform = 'twitter' THEN 
            ROUND(reach * (0.8 + RANDOM() * 0.4))  -- Twitter varies widely
        ELSE reach
    END;

-- =====================================================
-- 5. CREATE SAMPLE BREAKDOWN DATA FOR TESTING
-- =====================================================

-- Insert additional sample posts with specific breakdown combinations for testing
DO $$
DECLARE
    sample_campaign_id UUID;
    sample_account_id UUID;
    sample_post_id UUID;
    post_types TEXT[] := ARRAY['image', 'video', 'carousel', 'story', 'text'];
    campaign_types TEXT[] := ARRAY['organic', 'paid'];
    platforms TEXT[] := ARRAY['facebook', 'instagram', 'twitter', 'linkedin'];
    i INTEGER;
    j INTEGER;
BEGIN
    -- Get a sample campaign and account
    SELECT campaign_id INTO sample_campaign_id FROM campaigns_new LIMIT 1;
    SELECT account_id INTO sample_account_id FROM social_accounts_new LIMIT 1;
    
    -- Create sample posts for each post type and campaign type combination
    FOR i IN 1..array_length(post_types, 1) LOOP
        FOR j IN 1..array_length(campaign_types, 1) LOOP
            INSERT INTO campaign_posts_new (
                campaign_id, account_id, post_content, post_type, campaign_type, 
                is_promoted, promotion_budget, published_at, status
            ) VALUES (
                sample_campaign_id,
                sample_account_id,
                'Sample ' || post_types[i] || ' post for ' || campaign_types[j] || ' campaign testing',
                post_types[i],
                campaign_types[j],
                CASE WHEN campaign_types[j] = 'paid' THEN true ELSE false END,
                CASE WHEN campaign_types[j] = 'paid' THEN 100.00 + (i * 50) ELSE NULL END,
                NOW() - INTERVAL '5 days',
                'published'
            ) RETURNING post_id INTO sample_post_id;
            
            -- Create corresponding analytics
            INSERT INTO campaign_analytics_new (
                campaign_id, post_id, account_id, platform, analytics_date,
                impressions, reach, likes, comments, shares, link_clicks,
                engagement_rate, post_type, campaign_type, is_promoted,
                promotion_spend, video_views, video_completion_rate
            ) VALUES (
                sample_campaign_id,
                sample_post_id,
                sample_account_id,
                platforms[((i + j) % array_length(platforms, 1)) + 1],
                CURRENT_DATE - 1,
                1000 + (i * 200) + (j * 100),  -- Varied impressions
                800 + (i * 150) + (j * 80),    -- Varied reach
                50 + (i * 10) + (j * 5),       -- Varied likes
                10 + (i * 2) + j,              -- Varied comments
                5 + i + j,                     -- Varied shares
                20 + (i * 5) + (j * 3),        -- Varied link clicks
                3.5 + (i * 0.5) + (j * 0.3),   -- Varied engagement rate
                post_types[i],
                campaign_types[j],
                CASE WHEN campaign_types[j] = 'paid' THEN true ELSE false END,
                CASE WHEN campaign_types[j] = 'paid' THEN 15.00 + (i * 5) ELSE 0 END,
                CASE WHEN post_types[i] = 'video' THEN 600 + (i * 100) ELSE 0 END,
                CASE WHEN post_types[i] = 'video' THEN 45.5 + (i * 5) ELSE 0 END
            );
        END LOOP;
    END LOOP;
END $$;

-- =====================================================
-- 6. UPDATE STATISTICS FOR BETTER QUERY PERFORMANCE
-- =====================================================

-- Analyze tables for better query planning
ANALYZE campaign_posts_new;
ANALYZE campaign_analytics_new;

-- =====================================================
-- 7. VERIFY BREAKDOWN DATA
-- =====================================================

-- Verify post type distribution
SELECT 
    post_type,
    campaign_type,
    COUNT(*) as post_count,
    ROUND(COUNT(*)::DECIMAL / (SELECT COUNT(*) FROM campaign_posts_new) * 100, 1) as percentage
FROM campaign_posts_new 
WHERE post_type IS NOT NULL AND campaign_type IS NOT NULL
GROUP BY post_type, campaign_type
ORDER BY post_type, campaign_type;

-- Verify platform breakdown
SELECT 
    sa.platform,
    cp.post_type,
    cp.campaign_type,
    COUNT(*) as post_count,
    ROUND(AVG(ca.engagement_rate), 2) as avg_engagement_rate
FROM campaign_posts_new cp
JOIN social_accounts_new sa ON cp.account_id = sa.account_id
LEFT JOIN campaign_analytics_new ca ON cp.post_id = ca.post_id
GROUP BY sa.platform, cp.post_type, cp.campaign_type
ORDER BY sa.platform, cp.post_type, cp.campaign_type;

-- Verify promotion data
SELECT 
    campaign_type,
    is_promoted,
    COUNT(*) as post_count,
    ROUND(AVG(promotion_budget), 2) as avg_budget,
    ROUND(AVG(EXTRACT(DAY FROM (promotion_end_date - promotion_start_date))), 1) as avg_promotion_days
FROM campaign_posts_new 
WHERE campaign_type IS NOT NULL
GROUP BY campaign_type, is_promoted
ORDER BY campaign_type, is_promoted;