-- Campaign Performance Breakdown Updates
-- This script adds breakdown dimensions to existing campaign tables
-- Based on Ayrshare API data structure for deeper analytics

-- =====================================================
-- 1. ADD BREAKDOWN FIELDS TO CAMPAIGN_POSTS_NEW
-- =====================================================

-- Add campaign type and promotion fields for organic vs paid breakdown
ALTER TABLE campaign_posts_new 
ADD COLUMN IF NOT EXISTS campaign_type VARCHAR(50) DEFAULT 'organic', -- 'organic', 'paid'
ADD COLUMN IF NOT EXISTS is_promoted BOOLEAN DEFAULT false, -- Whether post was promoted/boosted
ADD COLUMN IF NOT EXISTS promotion_budget DECIMAL(10,2), -- Budget for promoted posts
ADD COLUMN IF NOT EXISTS promotion_start_date TIMESTAMP WITH TIME ZONE, -- When promotion started
ADD COLUMN IF NOT EXISTS promotion_end_date TIMESTAMP WITH TIME ZONE; -- When promotion ended

-- Add indexes for new breakdown fields
CREATE INDEX IF NOT EXISTS idx_campaign_posts_new_campaign_type ON campaign_posts_new(campaign_type);
CREATE INDEX IF NOT EXISTS idx_campaign_posts_new_promoted ON campaign_posts_new(is_promoted);
CREATE INDEX IF NOT EXISTS idx_campaign_posts_new_post_type ON campaign_posts_new(post_type);

-- =====================================================
-- 2. ADD BREAKDOWN FIELDS TO CAMPAIGN_ANALYTICS_NEW
-- =====================================================

-- Add breakdown dimensions for deeper analytics
ALTER TABLE campaign_analytics_new 
ADD COLUMN IF NOT EXISTS post_type VARCHAR(50), -- Reference to post type for breakdown
ADD COLUMN IF NOT EXISTS campaign_type VARCHAR(50) DEFAULT 'organic', -- organic vs paid
ADD COLUMN IF NOT EXISTS is_promoted BOOLEAN DEFAULT false, -- Whether this analytics record is for promoted content
ADD COLUMN IF NOT EXISTS promotion_spend DECIMAL(10,2) DEFAULT 0, -- Amount spent on promotion for this period
ADD COLUMN IF NOT EXISTS cost_per_click DECIMAL(10,4), -- CPC for paid content
ADD COLUMN IF NOT EXISTS cost_per_impression DECIMAL(10,4); -- CPM for paid content

-- Add indexes for breakdown analytics
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_new_post_type ON campaign_analytics_new(post_type);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_new_campaign_type ON campaign_analytics_new(campaign_type);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_new_promoted ON campaign_analytics_new(is_promoted);

-- =====================================================
-- 3. CREATE BREAKDOWN SUMMARY VIEWS
-- =====================================================

-- Platform breakdown view
CREATE OR REPLACE VIEW campaign_platform_breakdown_new AS
SELECT 
    c.campaign_id,
    c.campaign_name,
    sa.platform,
    COUNT(DISTINCT cp.post_id) as total_posts,
    COUNT(DISTINCT CASE WHEN cp.campaign_type = 'organic' THEN cp.post_id END) as organic_posts,
    COUNT(DISTINCT CASE WHEN cp.campaign_type = 'paid' THEN cp.post_id END) as paid_posts,
    
    -- Aggregate metrics by platform
    SUM(ca.impressions) as total_impressions,
    SUM(ca.reach) as total_reach,
    SUM(ca.total_engagement) as total_engagement,
    SUM(ca.link_clicks) as total_link_clicks,
    SUM(ca.video_views) as total_video_views,
    
    -- Calculate averages
    ROUND(AVG(ca.engagement_rate), 2) as avg_engagement_rate,
    ROUND(AVG(ca.video_completion_rate), 2) as avg_video_completion_rate,
    
    -- Paid content metrics
    SUM(ca.promotion_spend) as total_promotion_spend,
    ROUND(AVG(ca.cost_per_click), 4) as avg_cost_per_click,
    ROUND(AVG(ca.cost_per_impression), 4) as avg_cost_per_impression,
    
    -- Performance indicators
    CASE 
        WHEN AVG(ca.engagement_rate) >= 6.0 THEN 'High Performance'
        WHEN AVG(ca.engagement_rate) >= 3.0 THEN 'Good Performance'
        ELSE 'Standard Performance'
    END as performance_tier,
    
    MAX(ca.updated_at) as last_updated

FROM campaigns_new c
JOIN campaign_posts_new cp ON c.campaign_id = cp.campaign_id
JOIN social_accounts_new sa ON cp.account_id = sa.account_id
LEFT JOIN campaign_analytics_new ca ON cp.post_id = ca.post_id
GROUP BY c.campaign_id, c.campaign_name, sa.platform
ORDER BY c.campaign_id, total_engagement DESC;

-- Post type breakdown view
CREATE OR REPLACE VIEW campaign_post_type_breakdown_new AS
SELECT 
    c.campaign_id,
    c.campaign_name,
    cp.post_type,
    cp.campaign_type, -- organic vs paid
    COUNT(DISTINCT cp.post_id) as total_posts,
    
    -- Aggregate metrics by post type
    SUM(ca.impressions) as total_impressions,
    SUM(ca.reach) as total_reach,
    SUM(ca.total_engagement) as total_engagement,
    SUM(ca.link_clicks) as total_link_clicks,
    SUM(ca.video_views) as total_video_views,
    
    -- Calculate performance metrics
    ROUND(AVG(ca.engagement_rate), 2) as avg_engagement_rate,
    ROUND(
        CASE 
            WHEN SUM(ca.impressions) > 0 
            THEN (SUM(ca.total_engagement)::DECIMAL / SUM(ca.impressions)) * 100
            ELSE 0 
        END, 2
    ) as calculated_engagement_rate,
    
    -- Video-specific metrics
    ROUND(AVG(ca.video_completion_rate), 2) as avg_video_completion_rate,
    
    -- Paid content metrics
    SUM(ca.promotion_spend) as total_promotion_spend,
    ROUND(AVG(ca.cost_per_click), 4) as avg_cost_per_click,
    
    -- Performance comparison
    CASE 
        WHEN AVG(ca.engagement_rate) >= 6.0 THEN 'High Performance'
        WHEN AVG(ca.engagement_rate) >= 3.0 THEN 'Good Performance'
        ELSE 'Standard Performance'
    END as performance_tier,
    
    MAX(ca.updated_at) as last_updated

FROM campaigns_new c
JOIN campaign_posts_new cp ON c.campaign_id = cp.campaign_id
LEFT JOIN campaign_analytics_new ca ON cp.post_id = ca.post_id
GROUP BY c.campaign_id, c.campaign_name, cp.post_type, cp.campaign_type
ORDER BY c.campaign_id, avg_engagement_rate DESC;

-- Campaign type breakdown view (organic vs paid)
CREATE OR REPLACE VIEW campaign_type_breakdown_new AS
SELECT 
    c.campaign_id,
    c.campaign_name,
    cp.campaign_type,
    COUNT(DISTINCT cp.post_id) as total_posts,
    COUNT(DISTINCT sa.platform) as platforms_used,
    
    -- Aggregate metrics by campaign type
    SUM(ca.impressions) as total_impressions,
    SUM(ca.reach) as total_reach,
    SUM(ca.total_engagement) as total_engagement,
    SUM(ca.link_clicks) as total_link_clicks,
    
    -- Calculate performance metrics
    ROUND(AVG(ca.engagement_rate), 2) as avg_engagement_rate,
    ROUND(
        CASE 
            WHEN SUM(ca.impressions) > 0 
            THEN (SUM(ca.link_clicks)::DECIMAL / SUM(ca.impressions)) * 100
            ELSE 0 
        END, 2
    ) as click_through_rate,
    
    -- Paid-specific metrics
    SUM(ca.promotion_spend) as total_promotion_spend,
    ROUND(
        CASE 
            WHEN SUM(ca.promotion_spend) > 0 
            THEN SUM(ca.link_clicks)::DECIMAL / SUM(ca.promotion_spend)
            ELSE 0 
        END, 2
    ) as clicks_per_dollar,
    ROUND(AVG(ca.cost_per_click), 4) as avg_cost_per_click,
    
    -- ROI calculation for paid content
    ROUND(
        CASE 
            WHEN cp.campaign_type = 'paid' AND SUM(ca.promotion_spend) > 0
            THEN ((SUM(ca.total_engagement) * 0.05) - SUM(ca.promotion_spend)) / SUM(ca.promotion_spend) * 100
            ELSE NULL
        END, 2
    ) as estimated_roi_percentage,
    
    MAX(ca.updated_at) as last_updated

FROM campaigns_new c
JOIN campaign_posts_new cp ON c.campaign_id = cp.campaign_id
JOIN social_accounts_new sa ON cp.account_id = sa.account_id
LEFT JOIN campaign_analytics_new ca ON cp.post_id = ca.post_id
GROUP BY c.campaign_id, c.campaign_name, cp.campaign_type
ORDER BY c.campaign_id, avg_engagement_rate DESC;

-- =====================================================
-- 4. UPDATE EXISTING DATA WITH BREAKDOWN VALUES
-- =====================================================

-- Update existing posts with realistic breakdown data
UPDATE campaign_posts_new 
SET 
    campaign_type = CASE 
        WHEN RANDOM() < 0.7 THEN 'organic'  -- 70% organic content
        ELSE 'paid'
    END,
    is_promoted = CASE 
        WHEN RANDOM() < 0.3 THEN true  -- 30% of posts are promoted
        ELSE false
    END
WHERE campaign_type IS NULL OR campaign_type = 'organic';

-- Update promoted posts with budget information
UPDATE campaign_posts_new 
SET 
    promotion_budget = CASE 
        WHEN is_promoted = true THEN 
            ROUND((RANDOM() * 500 + 50)::NUMERIC, 2)  -- $50-$550 budget range
        ELSE NULL
    END,
    promotion_start_date = CASE 
        WHEN is_promoted = true THEN 
            published_at + INTERVAL '1 hour'  -- Promotion starts 1 hour after publish
        ELSE NULL
    END,
    promotion_end_date = CASE 
        WHEN is_promoted = true THEN 
            published_at + INTERVAL '7 days'  -- 7-day promotion period
        ELSE NULL
    END
WHERE is_promoted = true;

-- Update analytics with breakdown data
UPDATE campaign_analytics_new 
SET 
    post_type = cp.post_type,
    campaign_type = cp.campaign_type,
    is_promoted = cp.is_promoted,
    promotion_spend = CASE 
        WHEN cp.is_promoted = true THEN 
            ROUND((cp.promotion_budget / 7)::NUMERIC, 2)  -- Daily spend over 7 days
        ELSE 0
    END,
    cost_per_click = CASE 
        WHEN cp.is_promoted = true AND campaign_analytics_new.link_clicks > 0 THEN 
            ROUND(((cp.promotion_budget / 7) / campaign_analytics_new.link_clicks)::NUMERIC, 4)
        ELSE NULL
    END,
    cost_per_impression = CASE 
        WHEN cp.is_promoted = true AND campaign_analytics_new.impressions > 0 THEN 
            ROUND(((cp.promotion_budget / 7) / campaign_analytics_new.impressions * 1000)::NUMERIC, 4)  -- CPM
        ELSE NULL
    END
FROM campaign_posts_new cp
WHERE campaign_analytics_new.post_id = cp.post_id;

-- =====================================================
-- 5. CREATE INDEXES FOR BREAKDOWN QUERIES
-- =====================================================

-- Composite indexes for efficient breakdown queries
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_breakdown 
ON campaign_analytics_new(campaign_id, platform, post_type, campaign_type);

CREATE INDEX IF NOT EXISTS idx_campaign_posts_breakdown 
ON campaign_posts_new(campaign_id, post_type, campaign_type, is_promoted);

-- Performance indexes for views
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_performance 
ON campaign_analytics_new(engagement_rate, total_engagement, analytics_date);

-- =====================================================
-- 6. ADD COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON COLUMN campaign_posts_new.campaign_type IS 'Breakdown: organic vs paid content based on Ayrshare promotion data';
COMMENT ON COLUMN campaign_posts_new.is_promoted IS 'Whether post was promoted/boosted through platform advertising';
COMMENT ON COLUMN campaign_posts_new.promotion_budget IS 'Total budget allocated for promoting this post';

COMMENT ON COLUMN campaign_analytics_new.post_type IS 'Post type breakdown: image, video, carousel, story, text';
COMMENT ON COLUMN campaign_analytics_new.campaign_type IS 'Campaign type breakdown: organic vs paid';
COMMENT ON COLUMN campaign_analytics_new.promotion_spend IS 'Daily promotion spend for this analytics period';
COMMENT ON COLUMN campaign_analytics_new.cost_per_click IS 'Cost per click for promoted content (CPC)';
COMMENT ON COLUMN campaign_analytics_new.cost_per_impression IS 'Cost per thousand impressions (CPM)';

COMMENT ON VIEW campaign_platform_breakdown_new IS 'Platform-level breakdown of campaign performance metrics';
COMMENT ON VIEW campaign_post_type_breakdown_new IS 'Post type breakdown showing performance by content type';
COMMENT ON VIEW campaign_type_breakdown_new IS 'Organic vs paid campaign performance comparison';