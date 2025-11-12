-- All Platform Reform Ayrshare-Compatible Dummy Data
-- Based on the official Ayrshare API data structure

-- =====================================================
-- 1. UPDATE EXISTING PLATFORM_SPECIFIC_METRICS WITH AYRSHARE DATA
-- =====================================================

-- Update Facebook metrics with Ayrshare-compatible raw data
UPDATE platform_specific_metrics 
SET ayrshare_raw_data = jsonb_build_object(
    'id', '1397547544885713_' || (random() * 1000000000)::bigint,
    'postUrl', 'https://www.facebook.com/1397547544885713_' || (random() * 1000000000)::bigint,
    'analytics', jsonb_build_object(
        'impressions', impressions,
        'impressionsUnique', reach,
        'impressionsFanUnique', GREATEST(1, (reach * 0.1)::integer),
        'impressionsOrganicUnique', GREATEST(1, (reach * 0.8)::integer),
        'impressionsPaidUnique', GREATEST(1, (reach * 0.2)::integer),
        'likeCount', likes,
        'commentsCount', comments,
        'sharesCount', shares,
        'reactions', jsonb_build_object(
            'like', likes,
            'love', COALESCE(fb_reactions_love, 0),
            'anger', COALESCE(fb_reactions_anger, 0),
            'haha', COALESCE(fb_reactions_haha, 0),
            'wow', COALESCE(fb_reactions_wow, 0),
            'sorry', COALESCE(fb_reactions_sorry, 0),
            'total', COALESCE(fb_reactions_love + fb_reactions_anger + fb_reactions_haha + fb_reactions_wow + fb_reactions_sorry, 0)
        ),
        'totalVideoViews', COALESCE(fb_video_views, 0),
        'totalVideoCompleteViews', GREATEST(0, (COALESCE(fb_video_views, 0) * fb_video_completion_rate / 100)::integer),
        'totalVideoAvgTimeWatched', COALESCE(fb_video_avg_watch_time, 0),
        'totalVideo10SViews', GREATEST(0, (COALESCE(fb_video_views, 0) * 0.8)::integer),
        'totalVideo15SViews', GREATEST(0, (COALESCE(fb_video_views, 0) * 0.7)::integer),
        'totalVideoViewTotalTime', GREATEST(0, (COALESCE(fb_video_views, 0) * COALESCE(fb_video_avg_watch_time, 0))::bigint),
        'postImpressionsUnique', reach,
        'postVideoAvgTimeWatched', COALESCE(fb_video_avg_watch_time, 0)
    ),
    'lastUpdated', NOW()::text,
    'nextUpdate', (NOW() + INTERVAL '35 minutes')::text
)
WHERE platform = 'facebook';

-- Update Instagram metrics with Ayrshare-compatible raw data
UPDATE platform_specific_metrics 
SET ayrshare_raw_data = jsonb_build_object(
    'id', '17856916804' || (random() * 1000000)::bigint,
    'postUrl', 'https://www.instagram.com/p/' || substr(md5(random()::text), 1, 11) || '/',
    'analytics', jsonb_build_object(
        'caption', 'Luxury redefined. Experience elegance and sophistication.',
        'commentsCount', comments,
        'created', (NOW() - (random() * INTERVAL '30 days'))::text,
        'engagementCount', total_engagement,
        'followsCount', COALESCE(ig_follows_from_post, 0),
        'likeCount', likes,
        'mediaProductType', CASE 
            WHEN random() > 0.7 THEN 'REELS'
            WHEN random() > 0.4 THEN 'STORY' 
            ELSE 'FEED' 
        END,
        'mediaType', CASE 
            WHEN random() > 0.6 THEN 'VIDEO'
            WHEN random() > 0.3 THEN 'CAROUSEL_ALBUM'
            ELSE 'IMAGE'
        END,
        'profileActivityCount', GREATEST(1, (total_engagement * 0.1)::integer),
        'profileVisitsCount', COALESCE(ig_profile_visits, 0),
        'reachCount', reach,
        'savedCount', COALESCE(ig_saves, 0),
        'sharesCount', shares,
        'viewsCount', impressions,
        -- Reels specific data
        'clipsReplaysCount', CASE WHEN random() > 0.7 THEN GREATEST(0, (COALESCE(ig_reels_plays, 0) * 0.2)::integer) ELSE NULL END,
        'igReelsAggregatedAllPlaysCount', COALESCE(ig_reels_plays, 0),
        'igReelsAvgWatchTimeCount', COALESCE(ig_reels_avg_watch_time, 0),
        'igReelsVideoViewTotalTimeCount', GREATEST(0, (COALESCE(ig_reels_plays, 0) * COALESCE(ig_reels_avg_watch_time, 0))::bigint),
        'playsCount', COALESCE(ig_reels_plays, 0),
        -- Story specific data
        'navigationCount', CASE WHEN random() > 0.4 THEN COALESCE(ig_story_taps_forward + ig_story_taps_back, 0) ELSE NULL END,
        'swipeForwardCount', COALESCE(ig_story_taps_forward, 0),
        'tapBackCount', COALESCE(ig_story_taps_back, 0),
        'tapExitCount', COALESCE(ig_story_exits, 0)
    ),
    'lastUpdated', NOW()::text,
    'nextUpdate', (NOW() + INTERVAL '35 minutes')::text
)
WHERE platform = 'instagram';

-- Update Twitter metrics with Ayrshare-compatible raw data
UPDATE platform_specific_metrics 
SET ayrshare_raw_data = jsonb_build_object(
    'id', '131358944191982' || (random() * 10000)::bigint,
    'postUrl', 'https://www.twitter.com/account/' || (random() * 1000000000000000)::bigint,
    'analytics', jsonb_build_object(
        'created', (NOW() - (random() * INTERVAL '30 days'))::text,
        'post', 'Discover luxury redefined. Our latest collection embodies elegance.',
        'publicMetrics', jsonb_build_object(
            'impressionCount', impressions,
            'likeCount', likes,
            'replyCount', comments,
            'retweetCount', COALESCE(tw_retweets, 0),
            'quoteCount', COALESCE(tw_quote_tweets, 0),
            'bookmarkCount', COALESCE(tw_bookmarks, 0)
        ),
        'nonPublicMetrics', jsonb_build_object(
            'userProfileClicks', COALESCE(tw_profile_clicks, 0),
            'engagements', total_engagement,
            'impressionCount', impressions,
            'video', CASE WHEN tw_video_views > 0 THEN jsonb_build_object(
                'playback0Count', COALESCE(tw_video_views, 0),
                'playback25Count', COALESCE(tw_video_completion_25, 0),
                'playback50Count', COALESCE(tw_video_completion_50, 0),
                'playback75Count', COALESCE(tw_video_completion_75, 0),
                'playback100Count', COALESCE(tw_video_completion_100, 0)
            ) ELSE NULL END
        ),
        'organicMetrics', jsonb_build_object(
            'likeCount', likes,
            'impressionCount', impressions,
            'replyCount', comments,
            'retweetCount', COALESCE(tw_retweets, 0),
            'userProfileClicks', COALESCE(tw_profile_clicks, 0)
        )
    ),
    'lastUpdated', NOW()::text,
    'nextUpdate', (NOW() + INTERVAL '35 minutes')::text
)
WHERE platform = 'twitter';

-- Update LinkedIn metrics with Ayrshare-compatible raw data
UPDATE platform_specific_metrics 
SET ayrshare_raw_data = jsonb_build_object(
    'id', '678358627694900' || (random() * 10000)::bigint,
    'postUrl', 'https://www.linkedin.com/feed/update/urn:li:share:' || (random() * 1000000000000000)::bigint,
    'type', 'corporate',
    'analytics', jsonb_build_object(
        'clickCount', COALESCE(li_click_count, 0),
        'commentCount', comments,
        'commentsState', 'OPEN',
        'engagement', CASE WHEN impressions > 0 THEN ROUND((total_engagement::numeric / impressions) * 100, 2) ELSE 0 END,
        'impressionCount', impressions,
        'likeCount', likes,
        'reactions', jsonb_build_object(
            'like', likes,
            'praise', COALESCE(li_reactions_praise, 0),
            'maybe', COALESCE(li_reactions_maybe, 0),
            'empathy', COALESCE(li_reactions_empathy, 0),
            'interest', COALESCE(li_reactions_interest, 0),
            'appreciation', COALESCE(li_reactions_appreciation, 0)
        ),
        'shareCount', shares,
        'totalFirstLevelComments', comments,
        'uniqueImpressionsCount', COALESCE(li_unique_impressions, 0),
        'videoViews', COALESCE(li_video_views, 0)
    ),
    'lastUpdated', NOW()::text,
    'nextUpdate', (NOW() + INTERVAL '35 minutes')::text
)
WHERE platform = 'linkedin';

-- =====================================================
-- 2. GENERATE PLATFORM TRENDS DATA
-- =====================================================

-- First, call the function to generate trends from existing data (if it exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'generate_platform_trends') THEN
        PERFORM generate_platform_trends();
    END IF;
END $$;

-- Generate comprehensive trend data for the last 30 days
INSERT INTO platform_trends (
    platform, campaign_id, retailer_id, trend_date,
    total_reach, avg_engagement_rate, total_link_clicks, new_followers,
    total_impressions, total_engagement, total_posts
)
SELECT 
    platforms.platform,
    COALESCE(c.campaign_id, uuid_generate_v4()) as campaign_id,
    COALESCE(u.id, uuid_generate_v4()) as retailer_id,
    CURRENT_DATE - (series.day_offset || ' days')::interval as trend_date,
    
    -- Generate realistic trending data based on Ayrshare platform characteristics
    (1000 + random() * 5000 + 
     CASE platforms.platform 
         WHEN 'facebook' THEN 2000  -- Facebook typically has higher reach
         WHEN 'instagram' THEN 1500 -- Instagram good reach with high engagement
         WHEN 'linkedin' THEN 800   -- LinkedIn lower reach but professional audience
         WHEN 'twitter' THEN 1200   -- Twitter moderate reach
         ELSE 1000 
     END)::integer as total_reach,
    
    -- Engagement rates based on Ayrshare platform benchmarks
    (2.0 + random() * 8.0 + 
     CASE platforms.platform 
         WHEN 'instagram' THEN 2.0  -- Instagram typically highest engagement
         WHEN 'facebook' THEN 1.5   -- Facebook good engagement
         WHEN 'linkedin' THEN 1.0   -- LinkedIn professional engagement
         WHEN 'twitter' THEN 0.5    -- Twitter lower engagement rates
         ELSE 1.0 
     END)::numeric(5,2) as avg_engagement_rate,
    
    -- Link clicks based on platform characteristics
    (10 + random() * 200 + 
     CASE platforms.platform 
         WHEN 'linkedin' THEN 100   -- LinkedIn best for link clicks
         WHEN 'facebook' THEN 80    -- Facebook good link performance
         WHEN 'twitter' THEN 60     -- Twitter moderate link clicks
         WHEN 'instagram' THEN 40   -- Instagram lower link clicks (bio link)
         ELSE 50 
     END)::integer as total_link_clicks,
    
    -- New followers based on platform growth patterns
    (random() * 50 + 
     CASE platforms.platform 
         WHEN 'instagram' THEN 30   -- Instagram best for follower growth
         WHEN 'facebook' THEN 20    -- Facebook moderate growth
         WHEN 'twitter' THEN 15     -- Twitter moderate growth
         WHEN 'linkedin' THEN 10    -- LinkedIn slower but quality growth
         ELSE 15 
     END)::integer as new_followers,
    
    -- Additional metrics
    (1200 + random() * 6000)::integer as total_impressions,
    (50 + random() * 500)::integer as total_engagement,
    (1 + random() * 5)::integer as total_posts

FROM (
    SELECT unnest(ARRAY['facebook', 'instagram', 'twitter', 'linkedin']) as platform
) platforms
CROSS JOIN (
    SELECT generate_series(0, 29) as day_offset
) series
LEFT JOIN campaigns_new c ON random() > 0.5 -- Randomly associate with campaigns
LEFT JOIN (
    SELECT id FROM users WHERE user_type = 'retailer' LIMIT 10
) u ON random() > 0.5 -- Randomly associate with retailers
WHERE random() > 0.2; -- Generate ~80% of possible combinations

-- Also insert some guaranteed data for each platform and date
INSERT INTO platform_trends (
    platform, campaign_id, retailer_id, trend_date,
    total_reach, avg_engagement_rate, total_link_clicks, new_followers,
    total_impressions, total_engagement, total_posts
)
SELECT 
    platforms.platform,
    uuid_generate_v4() as campaign_id,
    uuid_generate_v4() as retailer_id,
    CURRENT_DATE - (series.day_offset || ' days')::interval as trend_date,
    
    -- Generate realistic trending data based on Ayrshare platform characteristics
    (1000 + random() * 5000 + 
     CASE platforms.platform 
         WHEN 'facebook' THEN 2000  
         WHEN 'instagram' THEN 1500 
         WHEN 'linkedin' THEN 800   
         WHEN 'twitter' THEN 1200   
         ELSE 1000 
     END)::integer as total_reach,
    
    (2.0 + random() * 8.0 + 
     CASE platforms.platform 
         WHEN 'instagram' THEN 2.0  
         WHEN 'facebook' THEN 1.5   
         WHEN 'linkedin' THEN 1.0   
         WHEN 'twitter' THEN 0.5    
         ELSE 1.0 
     END)::numeric(5,2) as avg_engagement_rate,
    
    (10 + random() * 200 + 
     CASE platforms.platform 
         WHEN 'linkedin' THEN 100   
         WHEN 'facebook' THEN 80    
         WHEN 'twitter' THEN 60     
         WHEN 'instagram' THEN 40   
         ELSE 50 
     END)::integer as total_link_clicks,
    
    (random() * 50 + 
     CASE platforms.platform 
         WHEN 'instagram' THEN 30   
         WHEN 'facebook' THEN 20    
         WHEN 'twitter' THEN 15     
         WHEN 'linkedin' THEN 10    
         ELSE 15 
     END)::integer as new_followers,
    
    (1200 + random() * 6000)::integer as total_impressions,
    (50 + random() * 500)::integer as total_engagement,
    (1 + random() * 5)::integer as total_posts

FROM (
    SELECT unnest(ARRAY['facebook', 'instagram', 'twitter', 'linkedin']) as platform
) platforms
CROSS JOIN (
    SELECT generate_series(0, 29) as day_offset
) series
ON CONFLICT (platform, campaign_id, retailer_id, trend_date) DO NOTHING;

-- =====================================================
-- 3. UPDATE EXISTING PLATFORM_SPECIFIC_METRICS WITH BETTER TIMESTAMPS
-- =====================================================

-- Update analytics_date to have better distribution over the last 30 days
UPDATE platform_specific_metrics 
SET analytics_date = CURRENT_DATE - (
    CASE 
        WHEN random() < 0.4 THEN (random() * 7)::integer      -- 40% in last week
        WHEN random() < 0.7 THEN (7 + random() * 14)::integer -- 30% in 2nd-3rd week
        ELSE (21 + random() * 9)::integer                     -- 30% in 4th week
    END
)
WHERE analytics_date IS NULL OR analytics_date = CURRENT_DATE;

-- =====================================================
-- 4. CREATE SAMPLE ALL PLATFORM METRICS SUMMARY
-- =====================================================

-- Create a materialized view for better performance
DROP MATERIALIZED VIEW IF EXISTS all_platform_metrics_cache;
CREATE MATERIALIZED VIEW all_platform_metrics_cache AS
SELECT 
    -- Overall totals
    SUM(CASE WHEN platform = 'facebook' THEN total_reach ELSE 0 END) as facebook_reach,
    SUM(CASE WHEN platform = 'instagram' THEN total_reach ELSE 0 END) as instagram_reach,
    SUM(CASE WHEN platform = 'twitter' THEN total_reach ELSE 0 END) as twitter_reach,
    SUM(CASE WHEN platform = 'linkedin' THEN total_reach ELSE 0 END) as linkedin_reach,
    
    ROUND(AVG(CASE WHEN platform = 'facebook' THEN avg_engagement_rate END), 2) as facebook_engagement_rate,
    ROUND(AVG(CASE WHEN platform = 'instagram' THEN avg_engagement_rate END), 2) as instagram_engagement_rate,
    ROUND(AVG(CASE WHEN platform = 'twitter' THEN avg_engagement_rate END), 2) as twitter_engagement_rate,
    ROUND(AVG(CASE WHEN platform = 'linkedin' THEN avg_engagement_rate END), 2) as linkedin_engagement_rate,
    
    SUM(CASE WHEN platform = 'facebook' THEN total_link_clicks ELSE 0 END) as facebook_link_clicks,
    SUM(CASE WHEN platform = 'instagram' THEN total_link_clicks ELSE 0 END) as instagram_link_clicks,
    SUM(CASE WHEN platform = 'twitter' THEN total_link_clicks ELSE 0 END) as twitter_link_clicks,
    SUM(CASE WHEN platform = 'linkedin' THEN total_link_clicks ELSE 0 END) as linkedin_link_clicks,
    
    SUM(CASE WHEN platform = 'facebook' THEN new_followers ELSE 0 END) as facebook_new_followers,
    SUM(CASE WHEN platform = 'instagram' THEN new_followers ELSE 0 END) as instagram_new_followers,
    SUM(CASE WHEN platform = 'twitter' THEN new_followers ELSE 0 END) as twitter_new_followers,
    SUM(CASE WHEN platform = 'linkedin' THEN new_followers ELSE 0 END) as linkedin_new_followers,
    
    -- Cross-platform totals
    SUM(total_reach) as total_reach_all_platforms,
    ROUND(AVG(avg_engagement_rate), 2) as avg_engagement_rate_all_platforms,
    SUM(total_link_clicks) as total_link_clicks_all_platforms,
    SUM(new_followers) as total_new_followers_all_platforms,
    
    -- Metadata
    COUNT(DISTINCT platform) as active_platforms,
    COUNT(DISTINCT campaign_id) as active_campaigns,
    COUNT(DISTINCT retailer_id) as active_retailers,
    MAX(trend_date) as last_updated
    
FROM platform_trends
WHERE trend_date >= CURRENT_DATE - INTERVAL '30 days';

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW all_platform_metrics_cache;

-- =====================================================
-- 5. CREATE SAMPLE TREND DATA FOR CHARTS
-- =====================================================

-- Create a view for trend chart data with Ayrshare-compatible metrics
DROP VIEW IF EXISTS platform_trends_chart_data;
CREATE OR REPLACE VIEW platform_trends_chart_data AS
SELECT 
    trend_date,
    platform,
    
    -- Daily metrics
    SUM(total_reach) as daily_reach,
    ROUND(AVG(avg_engagement_rate), 2) as daily_engagement_rate,
    SUM(total_link_clicks) as daily_link_clicks,
    SUM(new_followers) as daily_new_followers,
    
    -- 7-day moving averages for smoother trends
    ROUND(AVG(SUM(total_reach)) OVER (
        PARTITION BY platform 
        ORDER BY trend_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 0) as reach_7day_avg,
    
    ROUND(AVG(AVG(avg_engagement_rate)) OVER (
        PARTITION BY platform 
        ORDER BY trend_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 2) as engagement_rate_7day_avg,
    
    ROUND(AVG(SUM(total_link_clicks)) OVER (
        PARTITION BY platform 
        ORDER BY trend_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 0) as link_clicks_7day_avg,
    
    ROUND(AVG(SUM(new_followers)) OVER (
        PARTITION BY platform 
        ORDER BY trend_date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ), 0) as new_followers_7day_avg

FROM platform_trends
WHERE trend_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY trend_date, platform
ORDER BY trend_date DESC, platform;

-- =====================================================
-- 6. DATA VERIFICATION WITH AYRSHARE COMPATIBILITY
-- =====================================================

-- Verify Ayrshare data structure
SELECT 
    'Ayrshare Data Verification' as report,
    platform,
    COUNT(*) as records_with_ayrshare_data,
    COUNT(CASE WHEN ayrshare_raw_data ? 'analytics' THEN 1 END) as records_with_analytics,
    COUNT(CASE WHEN ayrshare_raw_data ? 'lastUpdated' THEN 1 END) as records_with_timestamps
FROM platform_specific_metrics 
WHERE ayrshare_raw_data IS NOT NULL
GROUP BY platform
ORDER BY platform;

-- Sample Ayrshare data structure verification
SELECT 
    platform,
    jsonb_pretty(ayrshare_raw_data) as sample_ayrshare_structure
FROM platform_specific_metrics 
WHERE ayrshare_raw_data IS NOT NULL
LIMIT 1;

-- Platform performance summary with Ayrshare metrics
SELECT 
    platform,
    COUNT(*) as trend_records,
    ROUND(AVG(avg_engagement_rate), 2) as avg_engagement_rate,
    SUM(total_reach) as total_reach,
    SUM(total_link_clicks) as total_link_clicks,
    SUM(new_followers) as total_new_followers,
    -- Ayrshare-specific metrics
    CASE platform
        WHEN 'facebook' THEN 'High reach, video focus, reactions tracking'
        WHEN 'instagram' THEN 'Visual content, stories/reels, saves tracking'
        WHEN 'twitter' THEN 'Real-time engagement, retweets, bookmarks'
        WHEN 'linkedin' THEN 'Professional network, click-through focus'
        ELSE 'General social media'
    END as ayrshare_characteristics
FROM platform_trends
GROUP BY platform
ORDER BY avg_engagement_rate DESC;

-- Campaign performance with Ayrshare platform breakdown
SELECT 
    c.campaign_name,
    COUNT(DISTINCT pt.platform) as platforms_active,
    ROUND(AVG(pt.avg_engagement_rate), 2) as avg_engagement_rate,
    SUM(pt.total_reach) as total_reach,
    -- Platform-specific insights
    STRING_AGG(
        pt.platform || ': ' || pt.avg_engagement_rate::text || '%', 
        ', ' ORDER BY pt.avg_engagement_rate DESC
    ) as platform_performance_breakdown
FROM campaigns_new c
JOIN platform_trends pt ON c.campaign_id = pt.campaign_id
GROUP BY c.campaign_id, c.campaign_name
ORDER BY avg_engagement_rate DESC
LIMIT 10;