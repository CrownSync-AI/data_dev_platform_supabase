-- Simplified Ayrshare Platform-Specific Dummy Data
-- Essential data population without complex verification blocks

-- =====================================================
-- 1. POPULATE PLATFORM_SPECIFIC_METRICS
-- =====================================================

-- Clear existing data
TRUNCATE TABLE platform_specific_metrics CASCADE;

-- Insert Facebook metrics (based on Ayrshare Facebook structure)
INSERT INTO platform_specific_metrics (
    post_id, campaign_id, account_id, platform, analytics_date,
    impressions, reach, likes, comments, shares,
    fb_reactions_love, fb_reactions_anger, fb_reactions_haha, fb_reactions_wow, fb_reactions_sorry,
    fb_video_views, fb_video_completion_rate, fb_video_avg_watch_time, fb_page_likes, fb_post_clicks,
    ayrshare_raw_data
)
SELECT 
    cp.post_id,
    cp.campaign_id,
    cp.account_id,
    'facebook' as platform,
    CURRENT_DATE - (random() * 30)::integer as analytics_date,
    
    -- Core metrics (higher engagement for Facebook)
    (random() * 5000 + 500)::integer as impressions,
    (random() * 3000 + 300)::integer as reach,
    (random() * 200 + 20)::integer as likes,
    (random() * 50 + 5)::integer as comments,
    (random() * 30 + 3)::integer as shares,
    
    -- Facebook-specific reactions
    (random() * 15 + 1)::integer as fb_reactions_love,
    (random() * 5)::integer as fb_reactions_anger,
    (random() * 10 + 1)::integer as fb_reactions_haha,
    (random() * 8 + 1)::integer as fb_reactions_wow,
    (random() * 3)::integer as fb_reactions_sorry,
    
    -- Facebook video metrics
    (random() * 1200 + 100)::integer as fb_video_views,
    (random() * 40 + 60)::numeric(5,2) as fb_video_completion_rate,
    (random() * 15000 + 5000)::integer as fb_video_avg_watch_time,
    (random() * 50 + 10)::integer as fb_page_likes,
    (random() * 25 + 5)::integer as fb_post_clicks,
    
    -- Sample Ayrshare raw data structure
    jsonb_build_object(
        'id', '1397547544885713_' || (random() * 1000000000)::bigint,
        'postUrl', 'https://www.facebook.com/1397547544885713_' || (random() * 1000000000)::bigint,
        'analytics', jsonb_build_object(
            'impressions', (random() * 5000 + 500)::integer,
            'impressionsUnique', (random() * 3000 + 300)::integer,
            'likeCount', (random() * 200 + 20)::integer,
            'commentsCount', (random() * 50 + 5)::integer,
            'sharesCount', (random() * 30 + 3)::integer,
            'reactions', jsonb_build_object(
                'like', (random() * 200 + 20)::integer,
                'love', (random() * 15 + 1)::integer,
                'anger', (random() * 5)::integer,
                'haha', (random() * 10 + 1)::integer,
                'wow', (random() * 8 + 1)::integer,
                'sorry', (random() * 3)::integer
            ),
            'videoViews', (random() * 1200 + 100)::integer,
            'totalVideoCompleteViews', (random() * 400 + 50)::integer
        )
    ) as ayrshare_raw_data

FROM campaign_posts_new cp
JOIN social_accounts_new sa ON cp.account_id = sa.account_id
WHERE sa.platform = 'facebook'
AND cp.status = 'published';

-- Insert Instagram metrics
INSERT INTO platform_specific_metrics (
    post_id, campaign_id, account_id, platform, analytics_date,
    impressions, reach, likes, comments, shares,
    ig_saves, ig_profile_visits, ig_follows_from_post, ig_story_exits, 
    ig_story_taps_forward, ig_story_taps_back, ig_reels_plays, ig_reels_avg_watch_time,
    ayrshare_raw_data
)
SELECT 
    cp.post_id,
    cp.campaign_id,
    cp.account_id,
    'instagram' as platform,
    CURRENT_DATE - (random() * 30)::integer as analytics_date,
    
    -- Core metrics
    (random() * 3000 + 400)::integer as impressions,
    (random() * 2500 + 300)::integer as reach,
    (random() * 150 + 25)::integer as likes,
    (random() * 30 + 5)::integer as comments,
    (random() * 20 + 2)::integer as shares,
    
    -- Instagram-specific metrics
    (random() * 40 + 5)::integer as ig_saves,
    (random() * 80 + 10)::integer as ig_profile_visits,
    (random() * 15 + 2)::integer as ig_follows_from_post,
    (random() * 10 + 1)::integer as ig_story_exits,
    (random() * 25 + 5)::integer as ig_story_taps_forward,
    (random() * 8 + 1)::integer as ig_story_taps_back,
    (random() * 800 + 100)::integer as ig_reels_plays,
    (random() * 8000 + 2000)::integer as ig_reels_avg_watch_time,
    
    -- Sample Ayrshare raw data for Instagram
    jsonb_build_object(
        'id', '17856916804' || (random() * 1000000)::bigint,
        'postUrl', 'https://www.instagram.com/p/' || substr(md5(random()::text), 1, 11) || '/',
        'analytics', jsonb_build_object(
            'impressions', (random() * 3000 + 400)::integer,
            'reachCount', (random() * 2500 + 300)::integer,
            'likeCount', (random() * 150 + 25)::integer,
            'commentsCount', (random() * 30 + 5)::integer,
            'sharesCount', (random() * 20 + 2)::integer,
            'savedCount', (random() * 40 + 5)::integer,
            'profileVisitsCount', (random() * 80 + 10)::integer,
            'followsCount', (random() * 15 + 2)::integer,
            'mediaProductType', CASE WHEN random() > 0.7 THEN 'REELS' WHEN random() > 0.4 THEN 'STORY' ELSE 'FEED' END,
            'playsCount', (random() * 800 + 100)::integer,
            'igReelsAvgWatchTimeCount', (random() * 8000 + 2000)::integer
        )
    ) as ayrshare_raw_data

FROM campaign_posts_new cp
JOIN social_accounts_new sa ON cp.account_id = sa.account_id
WHERE sa.platform = 'instagram'
AND cp.status = 'published';

-- Insert Twitter/X metrics
INSERT INTO platform_specific_metrics (
    post_id, campaign_id, account_id, platform, analytics_date,
    impressions, reach, likes, comments, shares,
    tw_retweets, tw_quote_tweets, tw_bookmarks, tw_profile_clicks, tw_url_clicks,
    tw_hashtag_clicks, tw_video_views, tw_video_completion_25, tw_video_completion_50,
    tw_video_completion_75, tw_video_completion_100,
    ayrshare_raw_data
)
SELECT 
    cp.post_id,
    cp.campaign_id,
    cp.account_id,
    'twitter' as platform,
    CURRENT_DATE - (random() * 30)::integer as analytics_date,
    
    -- Core metrics
    (random() * 2000 + 200)::integer as impressions,
    (random() * 1800 + 180)::integer as reach,
    (random() * 80 + 10)::integer as likes,
    (random() * 15 + 2)::integer as comments,
    (random() * 25 + 3)::integer as shares,
    
    -- Twitter-specific metrics
    (random() * 25 + 3)::integer as tw_retweets,
    (random() * 8 + 1)::integer as tw_quote_tweets,
    (random() * 12 + 2)::integer as tw_bookmarks,
    (random() * 20 + 3)::integer as tw_profile_clicks,
    (random() * 15 + 2)::integer as tw_url_clicks,
    (random() * 5 + 1)::integer as tw_hashtag_clicks,
    (random() * 300 + 50)::integer as tw_video_views,
    (random() * 250 + 40)::integer as tw_video_completion_25,
    (random() * 180 + 30)::integer as tw_video_completion_50,
    (random() * 120 + 20)::integer as tw_video_completion_75,
    (random() * 80 + 15)::integer as tw_video_completion_100,
    
    -- Sample Ayrshare raw data for Twitter
    jsonb_build_object(
        'id', '131358944191982' || (random() * 10000)::bigint,
        'postUrl', 'https://www.twitter.com/account/' || (random() * 1000000000000000)::bigint,
        'analytics', jsonb_build_object(
            'publicMetrics', jsonb_build_object(
                'impressionCount', (random() * 2000 + 200)::integer,
                'likeCount', (random() * 80 + 10)::integer,
                'replyCount', (random() * 15 + 2)::integer,
                'retweetCount', (random() * 25 + 3)::integer,
                'quoteCount', (random() * 8 + 1)::integer,
                'bookmarkCount', (random() * 12 + 2)::integer
            )
        )
    ) as ayrshare_raw_data

FROM campaign_posts_new cp
JOIN social_accounts_new sa ON cp.account_id = sa.account_id
WHERE sa.platform = 'twitter'
AND cp.status = 'published';

-- Insert LinkedIn metrics
INSERT INTO platform_specific_metrics (
    post_id, campaign_id, account_id, platform, analytics_date,
    impressions, reach, likes, comments, shares,
    li_reactions_praise, li_reactions_empathy, li_reactions_interest, 
    li_reactions_appreciation, li_reactions_maybe, li_unique_impressions,
    li_click_count, li_video_views,
    ayrshare_raw_data
)
SELECT 
    cp.post_id,
    cp.campaign_id,
    cp.account_id,
    'linkedin' as platform,
    CURRENT_DATE - (random() * 30)::integer as analytics_date,
    
    -- Core metrics
    (random() * 1500 + 150)::integer as impressions,
    (random() * 1200 + 120)::integer as reach,
    (random() * 60 + 8)::integer as likes,
    (random() * 12 + 2)::integer as comments,
    (random() * 8 + 1)::integer as shares,
    
    -- LinkedIn-specific reactions
    (random() * 15 + 2)::integer as li_reactions_praise,
    (random() * 8 + 1)::integer as li_reactions_empathy,
    (random() * 12 + 2)::integer as li_reactions_interest,
    (random() * 10 + 1)::integer as li_reactions_appreciation,
    (random() * 5 + 1)::integer as li_reactions_maybe,
    (random() * 1200 + 120)::integer as li_unique_impressions,
    (random() * 25 + 5)::integer as li_click_count,
    (random() * 200 + 30)::integer as li_video_views,
    
    -- Sample Ayrshare raw data for LinkedIn
    jsonb_build_object(
        'id', '678358627694900' || (random() * 10000)::bigint,
        'postUrl', 'https://www.linkedin.com/feed/update/urn:li:share:' || (random() * 1000000000000000)::bigint,
        'analytics', jsonb_build_object(
            'impressionCount', (random() * 1500 + 150)::integer,
            'uniqueImpressionsCount', (random() * 1200 + 120)::integer,
            'likeCount', (random() * 60 + 8)::integer,
            'commentCount', (random() * 12 + 2)::integer,
            'shareCount', (random() * 8 + 1)::integer,
            'clickCount', (random() * 25 + 5)::integer,
            'videoViews', (random() * 200 + 30)::integer,
            'reactions', jsonb_build_object(
                'like', (random() * 60 + 8)::integer,
                'praise', (random() * 15 + 2)::integer,
                'empathy', (random() * 8 + 1)::integer,
                'interest', (random() * 12 + 2)::integer,
                'appreciation', (random() * 10 + 1)::integer,
                'maybe', (random() * 5 + 1)::integer
            )
        )
    ) as ayrshare_raw_data

FROM campaign_posts_new cp
JOIN social_accounts_new sa ON cp.account_id = sa.account_id
WHERE sa.platform = 'linkedin'
AND cp.status = 'published';

-- =====================================================
-- 2. POPULATE PLATFORM_PERFORMANCE_SUMMARY
-- =====================================================

-- Clear existing data
TRUNCATE TABLE platform_performance_summary CASCADE;

-- Generate platform performance summaries
INSERT INTO platform_performance_summary (
    campaign_id, platform, summary_date,
    total_posts, total_impressions, total_reach, total_engagement,
    total_likes, total_comments, total_shares,
    total_fb_video_views, avg_fb_video_completion, total_fb_reactions,
    total_ig_saves, total_ig_profile_visits, total_ig_story_interactions,
    total_tw_retweets, total_tw_bookmarks, total_tw_profile_clicks,
    total_li_unique_impressions, total_li_clicks, total_li_reactions,
    avg_engagement_rate, organic_impressions, paid_impressions,
    organic_engagement, paid_engagement
)
SELECT 
    psm.campaign_id,
    psm.platform,
    CURRENT_DATE as summary_date,
    
    -- Aggregated core metrics
    COUNT(DISTINCT psm.post_id) as total_posts,
    SUM(psm.impressions) as total_impressions,
    SUM(psm.reach) as total_reach,
    SUM(psm.total_engagement) as total_engagement,
    SUM(psm.likes) as total_likes,
    SUM(psm.comments) as total_comments,
    SUM(psm.shares) as total_shares,
    
    -- Platform-specific aggregations
    SUM(COALESCE(psm.fb_video_views, 0)) as total_fb_video_views,
    ROUND(AVG(COALESCE(psm.fb_video_completion_rate, 0)), 2) as avg_fb_video_completion,
    SUM(COALESCE(psm.fb_reactions_love + psm.fb_reactions_anger + psm.fb_reactions_haha + psm.fb_reactions_wow + psm.fb_reactions_sorry, 0)) as total_fb_reactions,
    
    SUM(COALESCE(psm.ig_saves, 0)) as total_ig_saves,
    SUM(COALESCE(psm.ig_profile_visits, 0)) as total_ig_profile_visits,
    SUM(COALESCE(psm.ig_story_taps_forward + psm.ig_story_taps_back + psm.ig_story_exits, 0)) as total_ig_story_interactions,
    
    SUM(COALESCE(psm.tw_retweets, 0)) as total_tw_retweets,
    SUM(COALESCE(psm.tw_bookmarks, 0)) as total_tw_bookmarks,
    SUM(COALESCE(psm.tw_profile_clicks, 0)) as total_tw_profile_clicks,
    
    SUM(COALESCE(psm.li_unique_impressions, 0)) as total_li_unique_impressions,
    SUM(COALESCE(psm.li_click_count, 0)) as total_li_clicks,
    SUM(COALESCE(psm.li_reactions_praise + psm.li_reactions_empathy + psm.li_reactions_interest + psm.li_reactions_appreciation + psm.li_reactions_maybe, 0)) as total_li_reactions,
    
    -- Performance metrics
    ROUND(AVG(psm.engagement_rate), 2) as avg_engagement_rate,
    
    -- Organic vs Paid (80/20 split simulation)
    ROUND(SUM(psm.impressions) * 0.8) as organic_impressions,
    ROUND(SUM(psm.impressions) * 0.2) as paid_impressions,
    ROUND(SUM(psm.total_engagement) * 0.85) as organic_engagement,
    ROUND(SUM(psm.total_engagement) * 0.15) as paid_engagement

FROM platform_specific_metrics psm
GROUP BY psm.campaign_id, psm.platform;

-- Update best and worst performing posts
UPDATE platform_performance_summary pps
SET 
    best_performing_post_id = (
        SELECT psm.post_id 
        FROM platform_specific_metrics psm 
        WHERE psm.campaign_id = pps.campaign_id 
        AND psm.platform = pps.platform 
        ORDER BY psm.engagement_rate DESC 
        LIMIT 1
    ),
    worst_performing_post_id = (
        SELECT psm.post_id 
        FROM platform_specific_metrics psm 
        WHERE psm.campaign_id = pps.campaign_id 
        AND psm.platform = pps.platform 
        ORDER BY psm.engagement_rate ASC 
        LIMIT 1
    );

-- =====================================================
-- 3. CREATE SAMPLE EMAIL CAMPAIGN DATA
-- =====================================================

-- Clear existing email campaign data
TRUNCATE TABLE email_campaigns_new CASCADE;

-- Insert email campaigns for each main campaign
INSERT INTO email_campaigns_new (
    campaign_id, retailer_id, email_subject, email_content,
    sent_at, recipients_count, delivered_count, opened_count, clicked_count
)
SELECT 
    c.campaign_id,
    u.id as retailer_id,
    CASE 
        WHEN c.campaign_name LIKE '%Holiday%' THEN 'Holiday Special: Exclusive Luxury Collection'
        WHEN c.campaign_name LIKE '%Spring%' THEN 'Spring Elegance: New Arrivals'
        WHEN c.campaign_name LIKE '%Summer%' THEN 'Summer Luxury: Premium Selection'
        ELSE 'Exclusive: ' || c.campaign_name || ' Collection'
    END as email_subject,
    'Discover our latest luxury collection with exclusive offers for our valued customers.' as email_content,
    c.start_date + (random() * 10)::integer as sent_at,
    (random() * 5000 + 1000)::integer as recipients_count,
    (random() * 4500 + 950)::integer as delivered_count,
    (random() * 1800 + 300)::integer as opened_count,
    (random() * 450 + 50)::integer as clicked_count

FROM campaigns_new c
CROSS JOIN users u
WHERE u.user_type = 'retailer'
AND random() > 0.3; -- Only some retailers participate in email campaigns

-- Simple verification
SELECT 
    'Data Summary' as report,
    (SELECT COUNT(*) FROM platform_specific_metrics) as platform_metrics,
    (SELECT COUNT(*) FROM platform_performance_summary) as platform_summaries,
    (SELECT COUNT(*) FROM email_campaigns_new) as email_campaigns;

-- Platform distribution
SELECT 
    platform,
    COUNT(*) as metrics_count,
    ROUND(AVG(engagement_rate), 2) as avg_engagement_rate
FROM platform_specific_metrics 
GROUP BY platform 
ORDER BY avg_engagement_rate DESC;