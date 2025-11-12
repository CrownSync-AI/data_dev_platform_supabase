-- Campaign Performance Breakdown - Simplified Implementation
-- This script adds breakdown dimensions without complex JOINs to avoid SQL errors

-- =====================================================
-- 1. ADD BREAKDOWN COLUMNS TO EXISTING TABLES
-- =====================================================

-- Add breakdown fields to campaign_posts_new
ALTER TABLE campaign_posts_new 
ADD COLUMN IF NOT EXISTS campaign_type VARCHAR(50) DEFAULT 'organic',
ADD COLUMN IF NOT EXISTS is_promoted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS promotion_budget DECIMAL(10,2);

-- Add breakdown fields to campaign_analytics_new
ALTER TABLE campaign_analytics_new 
ADD COLUMN IF NOT EXISTS post_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS campaign_type VARCHAR(50) DEFAULT 'organic',
ADD COLUMN IF NOT EXISTS is_promoted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS promotion_spend DECIMAL(10,2) DEFAULT 0;

-- =====================================================
-- 2. UPDATE EXISTING DATA WITH BREAKDOWN VALUES
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

-- Update with campaign type (organic vs paid)
UPDATE campaign_posts_new 
SET 
    campaign_type = CASE 
        WHEN RANDOM() < 0.75 THEN 'organic'  -- 75% organic content
        ELSE 'paid'
    END,
    is_promoted = CASE 
        WHEN RANDOM() < 0.25 THEN true  -- 25% of posts are promoted
        ELSE false
    END
WHERE campaign_type = 'organic';  -- Only update if not already set

-- Update promoted posts with budget
UPDATE campaign_posts_new 
SET promotion_budget = CASE 
    WHEN is_promoted = true THEN 
        CASE 
            WHEN post_type = 'video' THEN ROUND((RANDOM() * 800 + 100)::NUMERIC, 2)
            WHEN post_type = 'carousel' THEN ROUND((RANDOM() * 600 + 75)::NUMERIC, 2)
            WHEN post_type = 'image' THEN ROUND((RANDOM() * 400 + 50)::NUMERIC, 2)
            ELSE ROUND((RANDOM() * 300 + 25)::NUMERIC, 2)
        END
    ELSE NULL
END
WHERE is_promoted = true AND promotion_budget IS NULL;

-- =====================================================
-- 3. UPDATE ANALYTICS WITH POST DATA (SIMPLE APPROACH)
-- =====================================================

-- First, update analytics with post type and campaign type
UPDATE campaign_analytics_new 
SET 
    post_type = (
        SELECT cp.post_type 
        FROM campaign_posts_new cp 
        WHERE cp.post_id = campaign_analytics_new.post_id
    ),
    campaign_type = (
        SELECT cp.campaign_type 
        FROM campaign_posts_new cp 
        WHERE cp.post_id = campaign_analytics_new.post_id
    ),
    is_promoted = (
        SELECT cp.is_promoted 
        FROM campaign_posts_new cp 
        WHERE cp.post_id = campaign_analytics_new.post_id
    )
WHERE EXISTS (
    SELECT 1 FROM campaign_posts_new cp 
    WHERE cp.post_id = campaign_analytics_new.post_id
);

-- Update promotion spend for promoted posts
UPDATE campaign_analytics_new 
SET promotion_spend = CASE 
    WHEN is_promoted = true THEN 
        COALESCE((
            SELECT ROUND((cp.promotion_budget / 7)::NUMERIC, 2)
            FROM campaign_posts_new cp 
            WHERE cp.post_id = campaign_analytics_new.post_id
        ), 0)
    ELSE 0
END
WHERE is_promoted = true;

-- =====================================================
-- 4. ENHANCE METRICS BASED ON POST TYPE
-- =====================================================

-- Adjust engagement rates based on post type
UPDATE campaign_analytics_new 
SET engagement_rate = CASE 
    WHEN post_type = 'video' THEN 
        LEAST(engagement_rate * (1.2 + RANDOM() * 0.3), 15.0)
    WHEN post_type = 'carousel' THEN 
        engagement_rate * (1.1 + RANDOM() * 0.2)
    WHEN post_type = 'story' THEN 
        engagement_rate * (0.8 + RANDOM() * 0.3)
    WHEN post_type = 'text' THEN 
        engagement_rate * (0.7 + RANDOM() * 0.2)
    ELSE engagement_rate
END
WHERE post_type IS NOT NULL;

-- Add video metrics for video posts
UPDATE campaign_analytics_new 
SET 
    video_views = CASE 
        WHEN post_type = 'video' THEN 
            ROUND(reach * (0.6 + RANDOM() * 0.3))
        ELSE 0
    END,
    video_completion_rate = CASE 
        WHEN post_type = 'video' THEN 
            ROUND((25 + RANDOM() * 50)::NUMERIC, 2)
        ELSE 0
    END
WHERE post_type = 'video';

-- =====================================================
-- 5. CREATE SIMPLE BREAKDOWN VIEWS
-- =====================================================

-- Platform breakdown view (simplified)
CREATE OR REPLACE VIEW campaign_platform_breakdown_simple AS
SELECT 
    c.campaign_id,
    c.campaign_name,
    sa.platform,
    COUNT(DISTINCT cp.post_id) as total_posts,
    COUNT(DISTINCT CASE WHEN cp.campaign_type = 'organic' THEN cp.post_id END) as organic_posts,
    COUNT(DISTINCT CASE WHEN cp.campaign_type = 'paid' THEN cp.post_id END) as paid_posts,
    
    -- Aggregate metrics
    COALESCE(SUM(ca.impressions), 0) as total_impressions,
    COALESCE(SUM(ca.reach), 0) as total_reach,
    COALESCE(SUM(ca.total_engagement), 0) as total_engagement,
    COALESCE(SUM(ca.link_clicks), 0) as total_link_clicks,
    
    -- Average metrics
    ROUND(COALESCE(AVG(ca.engagement_rate), 0), 2) as avg_engagement_rate,
    COALESCE(SUM(ca.promotion_spend), 0) as total_promotion_spend,
    
    -- Performance tier
    CASE 
        WHEN AVG(ca.engagement_rate) >= 6.0 THEN 'High Performance'
        WHEN AVG(ca.engagement_rate) >= 3.0 THEN 'Good Performance'
        ELSE 'Standard Performance'
    END as performance_tier

FROM campaigns_new c
LEFT JOIN campaign_posts_new cp ON c.campaign_id = cp.campaign_id
LEFT JOIN social_accounts_new sa ON cp.account_id = sa.account_id
LEFT JOIN campaign_analytics_new ca ON cp.post_id = ca.post_id
GROUP BY c.campaign_id, c.campaign_name, sa.platform
HAVING COUNT(DISTINCT cp.post_id) > 0
ORDER BY avg_engagement_rate DESC;

-- Post type breakdown view (simplified)
CREATE OR REPLACE VIEW campaign_post_type_breakdown_simple AS
SELECT 
    c.campaign_id,
    c.campaign_name,
    cp.post_type,
    cp.campaign_type,
    COUNT(DISTINCT cp.post_id) as total_posts,
    
    -- Aggregate metrics
    COALESCE(SUM(ca.impressions), 0) as total_impressions,
    COALESCE(SUM(ca.reach), 0) as total_reach,
    COALESCE(SUM(ca.total_engagement), 0) as total_engagement,
    COALESCE(SUM(ca.link_clicks), 0) as total_link_clicks,
    
    -- Performance metrics
    ROUND(COALESCE(AVG(ca.engagement_rate), 0), 2) as avg_engagement_rate,
    COALESCE(SUM(ca.promotion_spend), 0) as total_promotion_spend,
    
    -- Performance tier
    CASE 
        WHEN AVG(ca.engagement_rate) >= 6.0 THEN 'High Performance'
        WHEN AVG(ca.engagement_rate) >= 3.0 THEN 'Good Performance'
        ELSE 'Standard Performance'
    END as performance_tier

FROM campaigns_new c
LEFT JOIN campaign_posts_new cp ON c.campaign_id = cp.campaign_id
LEFT JOIN campaign_analytics_new ca ON cp.post_id = ca.post_id
WHERE cp.post_type IS NOT NULL
GROUP BY c.campaign_id, c.campaign_name, cp.post_type, cp.campaign_type
HAVING COUNT(DISTINCT cp.post_id) > 0
ORDER BY avg_engagement_rate DESC;

-- Campaign type breakdown view (organic vs paid)
CREATE OR REPLACE VIEW campaign_type_breakdown_simple AS
SELECT 
    c.campaign_id,
    c.campaign_name,
    cp.campaign_type,
    COUNT(DISTINCT cp.post_id) as total_posts,
    
    -- Aggregate metrics
    COALESCE(SUM(ca.impressions), 0) as total_impressions,
    COALESCE(SUM(ca.reach), 0) as total_reach,
    COALESCE(SUM(ca.total_engagement), 0) as total_engagement,
    COALESCE(SUM(ca.link_clicks), 0) as total_link_clicks,
    
    -- Performance metrics
    ROUND(COALESCE(AVG(ca.engagement_rate), 0), 2) as avg_engagement_rate,
    COALESCE(SUM(ca.promotion_spend), 0) as total_promotion_spend,
    
    -- ROI calculation for paid content
    CASE 
        WHEN cp.campaign_type = 'paid' AND SUM(ca.promotion_spend) > 0 THEN
            ROUND(((SUM(ca.total_engagement) * 0.05) - SUM(ca.promotion_spend)) / SUM(ca.promotion_spend) * 100, 2)
        ELSE NULL
    END as estimated_roi_percentage

FROM campaigns_new c
LEFT JOIN campaign_posts_new cp ON c.campaign_id = cp.campaign_id
LEFT JOIN campaign_analytics_new ca ON cp.post_id = ca.post_id
WHERE cp.campaign_type IS NOT NULL
GROUP BY c.campaign_id, c.campaign_name, cp.campaign_type
HAVING COUNT(DISTINCT cp.post_id) > 0
ORDER BY avg_engagement_rate DESC;

-- =====================================================
-- 6. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_campaign_posts_breakdown 
ON campaign_posts_new(campaign_id, post_type, campaign_type, is_promoted);

CREATE INDEX IF NOT EXISTS idx_campaign_analytics_breakdown 
ON campaign_analytics_new(campaign_id, platform, post_type, campaign_type);

-- =====================================================
-- 7. VERIFY DATA
-- =====================================================

-- Check post type distribution
SELECT 
    post_type,
    campaign_type,
    COUNT(*) as count,
    ROUND(COUNT(*)::DECIMAL / (SELECT COUNT(*) FROM campaign_posts_new WHERE post_type IS NOT NULL) * 100, 1) as percentage
FROM campaign_posts_new 
WHERE post_type IS NOT NULL AND campaign_type IS NOT NULL
GROUP BY post_type, campaign_type
ORDER BY post_type, campaign_type;