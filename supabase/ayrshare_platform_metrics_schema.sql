-- Ayrshare Platform-Specific Metrics Schema
-- Enhanced schema to support platform-specific analytics based on Ayrshare API structure
-- This extends the existing campaign_performance_new schema

-- =====================================================
-- 1. PLATFORM_SPECIFIC_METRICS - Core platform metrics
-- =====================================================
CREATE TABLE platform_specific_metrics (
    metric_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES campaign_posts_new(post_id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns_new(campaign_id) ON DELETE CASCADE,
    account_id UUID REFERENCES social_accounts_new(account_id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    analytics_date DATE NOT NULL,
    
    -- Universal Metrics (available across all platforms)
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    
    -- Facebook-Specific Metrics
    fb_reactions_love INTEGER DEFAULT 0,
    fb_reactions_anger INTEGER DEFAULT 0,
    fb_reactions_haha INTEGER DEFAULT 0,
    fb_reactions_wow INTEGER DEFAULT 0,
    fb_reactions_sorry INTEGER DEFAULT 0,
    fb_video_views INTEGER DEFAULT 0,
    fb_video_completion_rate DECIMAL(5,2) DEFAULT 0,
    fb_video_avg_watch_time INTEGER DEFAULT 0, -- milliseconds
    fb_page_likes INTEGER DEFAULT 0,
    fb_post_clicks INTEGER DEFAULT 0,
    
    -- Instagram-Specific Metrics
    ig_saves INTEGER DEFAULT 0,
    ig_profile_visits INTEGER DEFAULT 0,
    ig_follows_from_post INTEGER DEFAULT 0,
    ig_story_exits INTEGER DEFAULT 0,
    ig_story_taps_forward INTEGER DEFAULT 0,
    ig_story_taps_back INTEGER DEFAULT 0,
    ig_reels_plays INTEGER DEFAULT 0,
    ig_reels_avg_watch_time INTEGER DEFAULT 0, -- milliseconds
    
    -- Twitter/X-Specific Metrics
    tw_retweets INTEGER DEFAULT 0,
    tw_quote_tweets INTEGER DEFAULT 0,
    tw_bookmarks INTEGER DEFAULT 0,
    tw_profile_clicks INTEGER DEFAULT 0,
    tw_url_clicks INTEGER DEFAULT 0,
    tw_hashtag_clicks INTEGER DEFAULT 0,
    tw_video_views INTEGER DEFAULT 0,
    tw_video_completion_25 INTEGER DEFAULT 0,
    tw_video_completion_50 INTEGER DEFAULT 0,
    tw_video_completion_75 INTEGER DEFAULT 0,
    tw_video_completion_100 INTEGER DEFAULT 0,
    
    -- LinkedIn-Specific Metrics
    li_reactions_praise INTEGER DEFAULT 0,
    li_reactions_empathy INTEGER DEFAULT 0,
    li_reactions_interest INTEGER DEFAULT 0,
    li_reactions_appreciation INTEGER DEFAULT 0,
    li_reactions_maybe INTEGER DEFAULT 0,
    li_unique_impressions INTEGER DEFAULT 0,
    li_click_count INTEGER DEFAULT 0,
    li_video_views INTEGER DEFAULT 0,
    
    -- TikTok-Specific Metrics
    tt_video_views INTEGER DEFAULT 0,
    tt_video_completion_rate DECIMAL(5,2) DEFAULT 0,
    tt_avg_watch_time DECIMAL(8,2) DEFAULT 0, -- seconds
    tt_profile_views INTEGER DEFAULT 0,
    tt_follows INTEGER DEFAULT 0,
    
    -- YouTube-Specific Metrics
    yt_views INTEGER DEFAULT 0,
    yt_watch_time_minutes INTEGER DEFAULT 0,
    yt_avg_view_duration INTEGER DEFAULT 0, -- seconds
    yt_subscribers_gained INTEGER DEFAULT 0,
    yt_subscribers_lost INTEGER DEFAULT 0,
    yt_dislikes INTEGER DEFAULT 0,
    
    -- Pinterest-Specific Metrics
    pt_saves INTEGER DEFAULT 0,
    pt_pin_clicks INTEGER DEFAULT 0,
    pt_outbound_clicks INTEGER DEFAULT 0,
    pt_profile_visits INTEGER DEFAULT 0,
    
    -- Calculated Universal Metrics
    total_engagement INTEGER GENERATED ALWAYS AS (
        likes + comments + shares + 
        COALESCE(ig_saves, 0) + COALESCE(tw_retweets, 0) + COALESCE(tw_quote_tweets, 0)
    ) STORED,
    
    engagement_rate DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN impressions > 0 
        THEN ROUND(((likes + comments + shares + 
                    COALESCE(ig_saves, 0) + COALESCE(tw_retweets, 0) + COALESCE(tw_quote_tweets, 0))::DECIMAL / impressions) * 100, 2)
        ELSE 0 END
    ) STORED,
    
    -- Raw Ayrshare Data
    ayrshare_raw_data JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique metrics per post per date
    UNIQUE(post_id, analytics_date)
);

-- Add indexes for performance
CREATE INDEX idx_platform_metrics_post ON platform_specific_metrics(post_id);
CREATE INDEX idx_platform_metrics_campaign ON platform_specific_metrics(campaign_id);
CREATE INDEX idx_platform_metrics_account ON platform_specific_metrics(account_id);
CREATE INDEX idx_platform_metrics_platform ON platform_specific_metrics(platform);
CREATE INDEX idx_platform_metrics_date ON platform_specific_metrics(analytics_date);
CREATE INDEX idx_platform_metrics_engagement ON platform_specific_metrics(engagement_rate);

-- =====================================================
-- 2. PLATFORM_PERFORMANCE_SUMMARY - Aggregated platform metrics
-- =====================================================
CREATE TABLE platform_performance_summary (
    summary_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns_new(campaign_id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    summary_date DATE NOT NULL,
    
    -- Aggregated Core Metrics
    total_posts INTEGER DEFAULT 0,
    total_impressions BIGINT DEFAULT 0,
    total_reach BIGINT DEFAULT 0,
    total_engagement BIGINT DEFAULT 0,
    total_likes BIGINT DEFAULT 0,
    total_comments BIGINT DEFAULT 0,
    total_shares BIGINT DEFAULT 0,
    
    -- Platform-Specific Aggregations
    -- Facebook
    total_fb_video_views BIGINT DEFAULT 0,
    avg_fb_video_completion DECIMAL(5,2) DEFAULT 0,
    total_fb_reactions BIGINT DEFAULT 0,
    
    -- Instagram
    total_ig_saves BIGINT DEFAULT 0,
    total_ig_profile_visits BIGINT DEFAULT 0,
    total_ig_story_interactions BIGINT DEFAULT 0,
    
    -- Twitter/X
    total_tw_retweets BIGINT DEFAULT 0,
    total_tw_bookmarks BIGINT DEFAULT 0,
    total_tw_profile_clicks BIGINT DEFAULT 0,
    
    -- LinkedIn
    total_li_unique_impressions BIGINT DEFAULT 0,
    total_li_clicks BIGINT DEFAULT 0,
    total_li_reactions BIGINT DEFAULT 0,
    
    -- Performance Metrics
    avg_engagement_rate DECIMAL(5,2) DEFAULT 0,
    best_performing_post_id UUID,
    worst_performing_post_id UUID,
    
    -- Organic vs Paid Breakdown
    organic_impressions BIGINT DEFAULT 0,
    paid_impressions BIGINT DEFAULT 0,
    organic_engagement BIGINT DEFAULT 0,
    paid_engagement BIGINT DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(campaign_id, platform, summary_date)
);

-- Add indexes
CREATE INDEX idx_platform_summary_campaign ON platform_performance_summary(campaign_id);
CREATE INDEX idx_platform_summary_platform ON platform_performance_summary(platform);
CREATE INDEX idx_platform_summary_date ON platform_performance_summary(summary_date);

-- =====================================================
-- 3. ENHANCED VIEWS FOR PLATFORM-SPECIFIC ANALYTICS
-- =====================================================

-- Platform-Specific Campaign Overview
CREATE OR REPLACE VIEW campaign_platform_overview AS
SELECT 
    c.campaign_id,
    c.campaign_name,
    c.campaign_type,
    psm.platform,
    
    -- Core Metrics
    COUNT(DISTINCT psm.post_id) as total_posts,
    SUM(psm.impressions) as total_impressions,
    SUM(psm.reach) as total_reach,
    SUM(psm.total_engagement) as total_engagement,
    ROUND(AVG(psm.engagement_rate), 2) as avg_engagement_rate,
    
    -- Platform-Specific Metrics
    CASE 
        WHEN psm.platform = 'facebook' THEN 
            JSON_BUILD_OBJECT(
                'video_views', SUM(psm.fb_video_views),
                'reactions_breakdown', JSON_BUILD_OBJECT(
                    'love', SUM(psm.fb_reactions_love),
                    'anger', SUM(psm.fb_reactions_anger),
                    'haha', SUM(psm.fb_reactions_haha),
                    'wow', SUM(psm.fb_reactions_wow)
                ),
                'avg_video_completion', ROUND(AVG(psm.fb_video_completion_rate), 2)
            )
        WHEN psm.platform = 'instagram' THEN 
            JSON_BUILD_OBJECT(
                'saves', SUM(psm.ig_saves),
                'profile_visits', SUM(psm.ig_profile_visits),
                'story_interactions', SUM(psm.ig_story_taps_forward + psm.ig_story_taps_back),
                'reels_plays', SUM(psm.ig_reels_plays)
            )
        WHEN psm.platform = 'twitter' THEN 
            JSON_BUILD_OBJECT(
                'retweets', SUM(psm.tw_retweets),
                'bookmarks', SUM(psm.tw_bookmarks),
                'profile_clicks', SUM(psm.tw_profile_clicks),
                'video_completion_rate', ROUND(AVG(
                    CASE WHEN psm.tw_video_views > 0 
                    THEN (psm.tw_video_completion_100::DECIMAL / psm.tw_video_views) * 100 
                    ELSE 0 END
                ), 2)
            )
        WHEN psm.platform = 'linkedin' THEN 
            JSON_BUILD_OBJECT(
                'unique_impressions', SUM(psm.li_unique_impressions),
                'clicks', SUM(psm.li_click_count),
                'reactions_breakdown', JSON_BUILD_OBJECT(
                    'praise', SUM(psm.li_reactions_praise),
                    'empathy', SUM(psm.li_reactions_empathy),
                    'interest', SUM(psm.li_reactions_interest)
                )
            )
        ELSE '{}'::JSON
    END as platform_specific_metrics,
    
    -- Performance Classification
    CASE 
        WHEN AVG(psm.engagement_rate) >= 6.0 THEN 'High Performance'
        WHEN AVG(psm.engagement_rate) >= 3.0 THEN 'Good Performance'
        ELSE 'Standard Performance'
    END as performance_tier,
    
    MAX(psm.updated_at) as last_updated

FROM campaigns_new c
JOIN platform_specific_metrics psm ON c.campaign_id = psm.campaign_id
GROUP BY c.campaign_id, c.campaign_name, c.campaign_type, psm.platform;

-- Cross-Platform Comparison View
CREATE OR REPLACE VIEW cross_platform_comparison AS
SELECT 
    campaign_id,
    
    -- Platform Performance Comparison
    SUM(CASE WHEN platform = 'facebook' THEN total_engagement ELSE 0 END) as facebook_engagement,
    SUM(CASE WHEN platform = 'instagram' THEN total_engagement ELSE 0 END) as instagram_engagement,
    SUM(CASE WHEN platform = 'twitter' THEN total_engagement ELSE 0 END) as twitter_engagement,
    SUM(CASE WHEN platform = 'linkedin' THEN total_engagement ELSE 0 END) as linkedin_engagement,
    
    -- Engagement Rate Comparison
    ROUND(AVG(CASE WHEN platform = 'facebook' THEN engagement_rate END), 2) as facebook_engagement_rate,
    ROUND(AVG(CASE WHEN platform = 'instagram' THEN engagement_rate END), 2) as instagram_engagement_rate,
    ROUND(AVG(CASE WHEN platform = 'twitter' THEN engagement_rate END), 2) as twitter_engagement_rate,
    ROUND(AVG(CASE WHEN platform = 'linkedin' THEN engagement_rate END), 2) as linkedin_engagement_rate,
    
    -- Best Performing Platform
    (SELECT platform 
     FROM platform_specific_metrics psm2 
     WHERE psm2.campaign_id = psm.campaign_id 
     GROUP BY platform 
     ORDER BY AVG(engagement_rate) DESC 
     LIMIT 1) as best_platform,
    
    -- Total Cross-Platform Metrics
    SUM(total_engagement) as total_cross_platform_engagement,
    SUM(impressions) as total_cross_platform_impressions,
    ROUND(AVG(engagement_rate), 2) as overall_engagement_rate

FROM platform_specific_metrics psm
GROUP BY campaign_id;

-- =====================================================
-- 4. FUNCTIONS FOR PLATFORM-SPECIFIC CALCULATIONS
-- =====================================================

-- Function to calculate platform-specific engagement rate
CREATE OR REPLACE FUNCTION calculate_platform_engagement_rate(
    p_platform VARCHAR(50),
    p_likes INTEGER,
    p_comments INTEGER,
    p_shares INTEGER,
    p_saves INTEGER DEFAULT 0,
    p_retweets INTEGER DEFAULT 0,
    p_impressions INTEGER DEFAULT 0
)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    total_engagement INTEGER;
BEGIN
    -- Calculate engagement based on platform
    CASE p_platform
        WHEN 'facebook' THEN
            total_engagement := p_likes + p_comments + p_shares;
        WHEN 'instagram' THEN
            total_engagement := p_likes + p_comments + p_shares + p_saves;
        WHEN 'twitter' THEN
            total_engagement := p_likes + p_comments + p_retweets;
        WHEN 'linkedin' THEN
            total_engagement := p_likes + p_comments + p_shares;
        ELSE
            total_engagement := p_likes + p_comments + p_shares;
    END CASE;
    
    -- Calculate rate
    IF p_impressions > 0 THEN
        RETURN ROUND((total_engagement::DECIMAL / p_impressions) * 100, 2);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get top performing posts by platform
CREATE OR REPLACE FUNCTION get_top_posts_by_platform(
    p_campaign_id UUID,
    p_platform VARCHAR(50),
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    post_id UUID,
    engagement_rate DECIMAL(5,2),
    total_engagement INTEGER,
    impressions INTEGER,
    platform_specific_data JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        psm.post_id,
        psm.engagement_rate,
        psm.total_engagement,
        psm.impressions,
        psm.ayrshare_raw_data
    FROM platform_specific_metrics psm
    WHERE psm.campaign_id = p_campaign_id 
    AND psm.platform = p_platform
    ORDER BY psm.engagement_rate DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get platform performance summary
CREATE OR REPLACE FUNCTION get_platform_summary(
    p_campaign_id UUID,
    p_platform VARCHAR(50) DEFAULT NULL
)
RETURNS TABLE (
    platform VARCHAR(50),
    total_posts BIGINT,
    total_impressions BIGINT,
    total_engagement BIGINT,
    avg_engagement_rate DECIMAL(5,2),
    performance_tier TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cpo.platform,
        cpo.total_posts,
        cpo.total_impressions,
        cpo.total_engagement,
        cpo.avg_engagement_rate,
        cpo.performance_tier
    FROM campaign_platform_overview cpo
    WHERE cpo.campaign_id = p_campaign_id
    AND (p_platform IS NULL OR cpo.platform = p_platform)
    ORDER BY cpo.avg_engagement_rate DESC;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 5. ROW LEVEL SECURITY FOR NEW TABLES
-- =====================================================

-- Enable RLS
ALTER TABLE platform_specific_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_performance_summary ENABLE ROW LEVEL SECURITY;

-- Platform Specific Metrics Access
CREATE POLICY "platform_metrics_access" ON platform_specific_metrics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM social_accounts_new sa
            WHERE sa.account_id = platform_specific_metrics.account_id
            AND (
                sa.retailer_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM users 
                    WHERE id = auth.uid() AND user_type IN ('brand', 'admin')
                )
            )
        )
    );

-- Platform Performance Summary Access
CREATE POLICY "platform_summary_access" ON platform_performance_summary
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM campaigns_new c
            WHERE c.campaign_id = platform_performance_summary.campaign_id
            AND (
                c.brand_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM users 
                    WHERE id = auth.uid() AND user_type = 'admin'
                ) OR
                EXISTS (
                    SELECT 1 FROM social_accounts_new sa
                    JOIN campaign_posts_new cp ON sa.account_id = cp.account_id
                    WHERE cp.campaign_id = c.campaign_id
                    AND sa.retailer_id = auth.uid()
                )
            )
        )
    );

-- Grant permissions
GRANT SELECT ON platform_specific_metrics TO authenticated;
GRANT SELECT ON platform_performance_summary TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Add comments
COMMENT ON TABLE platform_specific_metrics IS 'Platform-specific analytics metrics based on Ayrshare API structure';
COMMENT ON TABLE platform_performance_summary IS 'Aggregated platform performance metrics for dashboard consumption';
COMMENT ON VIEW campaign_platform_overview IS 'Campaign performance broken down by platform with platform-specific metrics';
COMMENT ON VIEW cross_platform_comparison IS 'Cross-platform performance comparison for campaigns';