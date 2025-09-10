-- =============================================
-- ANALYTICS VIEWS FOR LEVEL 2 & LEVEL 3 DATA
-- Based on System data point list - Raw Data.csv
-- =============================================

-- =============================================
-- FILE ANALYTICS VIEWS (Brand Side)
-- =============================================

-- File analytics view with Level 2 calculations
CREATE OR REPLACE VIEW file_analytics AS
SELECT 
    f.file_id,
    f.file_name,
    f.file_type,
    f.file_size,
    f.created_at,
    f.created_by_user_id,
    
    -- Level 2 calculations from CSV
    COALESCE(stats.view_count, 0) as view_count,
    COALESCE(stats.download_count, 0) as download_count,
    COALESCE(stats.share_count, 0) as share_count,
    COALESCE(stats.unique_viewers, 0) as unique_viewers,
    COALESCE(stats.unique_downloaders, 0) as unique_downloaders,
    stats.last_accessed_at
FROM files f
LEFT JOIN (
    SELECT 
        file_id,
        COUNT(*) FILTER (WHERE action_type = 'VIEW') as view_count,
        COUNT(*) FILTER (WHERE action_type = 'DOWNLOAD') as download_count,
        COUNT(*) FILTER (WHERE action_type = 'SHARE') as share_count,
        COUNT(DISTINCT user_id) FILTER (WHERE action_type = 'VIEW') as unique_viewers,
        COUNT(DISTINCT user_id) FILTER (WHERE action_type = 'DOWNLOAD') as unique_downloaders,
        MAX(action_timestamp) as last_accessed_at
    FROM file_actions 
    GROUP BY file_id
) stats ON f.file_id = stats.file_id
WHERE f.deleted_at IS NULL;

-- =============================================
-- USER ANALYTICS VIEWS (Brand Side)
-- =============================================

-- User analytics view with session and activity data
CREATE OR REPLACE VIEW user_analytics AS
SELECT 
    u.user_id,
    u.user_email,
    u.user_name,
    u.user_type,
    u.created_at,
    u.last_login_at,
    
    -- Session analytics
    COALESCE(session_stats.total_sessions, 0) as total_sessions,
    COALESCE(session_stats.avg_session_duration_minutes, 0) as avg_session_duration_minutes,
    COALESCE(session_stats.total_session_time_minutes, 0) as total_session_time_minutes,
    
    -- Activity analytics
    COALESCE(activity_stats.total_file_views, 0) as total_file_views,
    COALESCE(activity_stats.total_file_downloads, 0) as total_file_downloads,
    COALESCE(activity_stats.total_file_shares, 0) as total_file_shares,
    COALESCE(activity_stats.unique_files_accessed, 0) as unique_files_accessed
FROM users u
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) as total_sessions,
        AVG(EXTRACT(EPOCH FROM (COALESCE(ended_at, NOW()) - started_at))/60) as avg_session_duration_minutes,
        SUM(EXTRACT(EPOCH FROM (COALESCE(ended_at, NOW()) - started_at))/60) as total_session_time_minutes
    FROM sessions 
    GROUP BY user_id
) session_stats ON u.user_id = session_stats.user_id
LEFT JOIN (
    SELECT 
        user_id,
        COUNT(*) FILTER (WHERE action_type = 'VIEW') as total_file_views,
        COUNT(*) FILTER (WHERE action_type = 'DOWNLOAD') as total_file_downloads,
        COUNT(*) FILTER (WHERE action_type = 'SHARE') as total_file_shares,
        COUNT(DISTINCT file_id) as unique_files_accessed
    FROM file_actions 
    GROUP BY user_id
) activity_stats ON u.user_id = activity_stats.user_id;

-- =============================================
-- CAMPAIGN ANALYTICS VIEWS (Brand Side & Retailer Side)
-- =============================================

-- Campaign analytics view with performance metrics
CREATE OR REPLACE VIEW campaign_analytics AS
SELECT 
    c.campaign_id,
    c.campaign_name,
    c.campaign_status,
    c.created_at,
    c.start_date,
    c.end_date,
    c.budget_allocated,
    c.budget_spent,
    
    -- Email campaign metrics
    COALESCE(email_stats.total_emails_sent, 0) as total_emails_sent,
    COALESCE(email_stats.total_emails_delivered, 0) as total_emails_delivered,
    COALESCE(email_stats.total_emails_opened, 0) as total_emails_opened,
    COALESCE(email_stats.total_emails_clicked, 0) as total_emails_clicked,
    COALESCE(email_stats.email_open_rate, 0) as email_open_rate,
    COALESCE(email_stats.email_click_rate, 0) as email_click_rate,
    
    -- SMS campaign metrics
    COALESCE(sms_stats.total_sms_sent, 0) as total_sms_sent,
    COALESCE(sms_stats.total_sms_delivered, 0) as total_sms_delivered,
    COALESCE(sms_stats.sms_delivery_rate, 0) as sms_delivery_rate,
    
    -- Social media metrics
    COALESCE(social_stats.total_posts, 0) as total_social_posts,
    COALESCE(social_stats.total_engagement, 0) as total_social_engagement
FROM campaigns c
LEFT JOIN (
    SELECT 
        ec.campaign_id,
        COUNT(es.email_send_id) as total_emails_sent,
        COUNT(es.email_send_id) FILTER (WHERE es.status = 'delivered') as total_emails_delivered,
        COUNT(es.email_send_id) FILTER (WHERE es.opened_at IS NOT NULL) as total_emails_opened,
        COUNT(es.email_send_id) FILTER (WHERE es.clicked_at IS NOT NULL) as total_emails_clicked,
        CASE 
            WHEN COUNT(es.email_send_id) FILTER (WHERE es.status = 'delivered') > 0 
            THEN (COUNT(es.email_send_id) FILTER (WHERE es.opened_at IS NOT NULL)::DECIMAL / COUNT(es.email_send_id) FILTER (WHERE es.status = 'delivered')) * 100
            ELSE 0 
        END as email_open_rate,
        CASE 
            WHEN COUNT(es.email_send_id) FILTER (WHERE es.opened_at IS NOT NULL) > 0 
            THEN (COUNT(es.email_send_id) FILTER (WHERE es.clicked_at IS NOT NULL)::DECIMAL / COUNT(es.email_send_id) FILTER (WHERE es.opened_at IS NOT NULL)) * 100
            ELSE 0 
        END as email_click_rate
    FROM email_campaigns ec
    LEFT JOIN email_sends es ON ec.email_campaign_id = es.email_campaign_id
    WHERE ec.campaign_id IS NOT NULL
    GROUP BY ec.campaign_id
) email_stats ON c.campaign_id = email_stats.campaign_id
LEFT JOIN (
    SELECT 
        sc.campaign_id,
        COUNT(ss.sms_send_id) as total_sms_sent,
        COUNT(ss.sms_send_id) FILTER (WHERE ss.status = 'delivered') as total_sms_delivered,
        CASE 
            WHEN COUNT(ss.sms_send_id) > 0 
            THEN (COUNT(ss.sms_send_id) FILTER (WHERE ss.status = 'delivered')::DECIMAL / COUNT(ss.sms_send_id)) * 100
            ELSE 0 
        END as sms_delivery_rate
    FROM sms_campaigns sc
    LEFT JOIN sms_sends ss ON sc.sms_campaign_id = ss.sms_campaign_id
    WHERE sc.campaign_id IS NOT NULL
    GROUP BY sc.campaign_id
) sms_stats ON c.campaign_id = sms_stats.campaign_id
LEFT JOIN (
    SELECT 
        sp.campaign_id,
        COUNT(sp.post_id) as total_posts,
        COALESCE(SUM(se.engagement_count), 0) as total_engagement
    FROM social_posts sp
    LEFT JOIN social_engagement se ON sp.post_id = se.post_id
    WHERE sp.campaign_id IS NOT NULL
    GROUP BY sp.campaign_id
) social_stats ON c.campaign_id = social_stats.campaign_id;

-- =============================================
-- SESSION ANALYTICS VIEWS (Brand Side)
-- =============================================

-- Session analytics view with duration and action counts
CREATE OR REPLACE VIEW session_analytics AS
SELECT 
    s.session_id,
    s.user_id,
    s.started_at,
    s.ended_at,
    s.ip_address,
    s.user_agent,
    
    -- Level 2 calculations from CSV
    CASE 
        WHEN s.ended_at IS NOT NULL 
        THEN EXTRACT(EPOCH FROM (s.ended_at - s.started_at))/60
        ELSE EXTRACT(EPOCH FROM (NOW() - s.started_at))/60
    END as duration_minutes,
    
    COALESCE(action_stats.actions_count, 0) as actions_count
FROM sessions s
LEFT JOIN (
    SELECT 
        session_id,
        COUNT(*) as actions_count
    FROM file_actions 
    WHERE session_id IS NOT NULL
    GROUP BY session_id
) action_stats ON s.session_id = action_stats.session_id;

-- =============================================
-- COLLECTION ANALYTICS VIEWS (Brand Side)
-- =============================================

-- Collection analytics view with file counts and engagement
CREATE OR REPLACE VIEW collection_analytics AS
SELECT 
    c.collection_id,
    c.collection_name,
    c.created_at,
    c.created_by_user_id,
    
    -- Level 2 calculations from CSV
    COALESCE(file_stats.file_count, 0) as file_count,
    COALESCE(file_stats.total_views, 0) as total_views,
    COALESCE(file_stats.total_downloads, 0) as total_downloads,
    COALESCE(file_stats.total_shares, 0) as total_shares
FROM collections c
LEFT JOIN (
    SELECT 
        cf.collection_id,
        COUNT(cf.file_id) as file_count,
        COALESCE(SUM(fa_stats.view_count), 0) as total_views,
        COALESCE(SUM(fa_stats.download_count), 0) as total_downloads,
        COALESCE(SUM(fa_stats.share_count), 0) as total_shares
    FROM collection_files cf
    LEFT JOIN (
        SELECT 
            file_id,
            COUNT(*) FILTER (WHERE action_type = 'VIEW') as view_count,
            COUNT(*) FILTER (WHERE action_type = 'DOWNLOAD') as download_count,
            COUNT(*) FILTER (WHERE action_type = 'SHARE') as share_count
        FROM file_actions 
        GROUP BY file_id
    ) fa_stats ON cf.file_id = fa_stats.file_id
    GROUP BY cf.collection_id
) file_stats ON c.collection_id = file_stats.collection_id;

-- =============================================
-- EMAIL ANALYTICS VIEWS (Retailer Side)
-- =============================================

-- Email campaign performance view
CREATE OR REPLACE VIEW email_campaign_analytics AS
SELECT 
    ec.email_campaign_id,
    ec.campaign_id,
    ec.email_subject,
    ec.sender_email,
    ec.created_at,
    ec.sent_at,
    ec.total_recipients,
    
    -- Performance metrics from CSV
    COALESCE(stats.emails_sent, 0) as emails_sent,
    COALESCE(stats.emails_delivered, 0) as emails_delivered,
    COALESCE(stats.emails_opened, 0) as emails_opened,
    COALESCE(stats.emails_clicked, 0) as emails_clicked,
    COALESCE(stats.emails_bounced, 0) as emails_bounced,
    
    -- Calculated rates
    CASE 
        WHEN COALESCE(stats.emails_sent, 0) > 0 
        THEN (COALESCE(stats.emails_delivered, 0)::DECIMAL / stats.emails_sent) * 100
        ELSE 0 
    END as delivery_rate,
    
    CASE 
        WHEN COALESCE(stats.emails_delivered, 0) > 0 
        THEN (COALESCE(stats.emails_opened, 0)::DECIMAL / stats.emails_delivered) * 100
        ELSE 0 
    END as open_rate,
    
    CASE 
        WHEN COALESCE(stats.emails_opened, 0) > 0 
        THEN (COALESCE(stats.emails_clicked, 0)::DECIMAL / stats.emails_opened) * 100
        ELSE 0 
    END as click_through_rate,
    
    CASE 
        WHEN COALESCE(stats.emails_sent, 0) > 0 
        THEN (COALESCE(stats.emails_bounced, 0)::DECIMAL / stats.emails_sent) * 100
        ELSE 0 
    END as bounce_rate
FROM email_campaigns ec
LEFT JOIN (
    SELECT 
        email_campaign_id,
        COUNT(*) as emails_sent,
        COUNT(*) FILTER (WHERE status = 'delivered') as emails_delivered,
        COUNT(*) FILTER (WHERE opened_at IS NOT NULL) as emails_opened,
        COUNT(*) FILTER (WHERE clicked_at IS NOT NULL) as emails_clicked,
        COUNT(*) FILTER (WHERE status = 'bounced') as emails_bounced
    FROM email_sends 
    GROUP BY email_campaign_id
) stats ON ec.email_campaign_id = stats.email_campaign_id;

-- =============================================
-- SMS ANALYTICS VIEWS (Retailer Side)
-- =============================================

-- SMS campaign performance view
CREATE OR REPLACE VIEW sms_campaign_analytics AS
SELECT 
    sc.sms_campaign_id,
    sc.campaign_id,
    sc.sms_content,
    sc.sender_number,
    sc.created_at,
    sc.sent_at,
    sc.total_recipients,
    
    -- Performance metrics from CSV
    COALESCE(stats.sms_sent, 0) as sms_sent,
    COALESCE(stats.sms_delivered, 0) as sms_delivered,
    COALESCE(stats.sms_failed, 0) as sms_failed,
    
    -- Calculated rates
    CASE 
        WHEN COALESCE(stats.sms_sent, 0) > 0 
        THEN (COALESCE(stats.sms_delivered, 0)::DECIMAL / stats.sms_sent) * 100
        ELSE 0 
    END as delivery_rate,
    
    CASE 
        WHEN COALESCE(stats.sms_sent, 0) > 0 
        THEN (COALESCE(stats.sms_failed, 0)::DECIMAL / stats.sms_sent) * 100
        ELSE 0 
    END as failure_rate
FROM sms_campaigns sc
LEFT JOIN (
    SELECT 
        sms_campaign_id,
        COUNT(*) as sms_sent,
        COUNT(*) FILTER (WHERE status = 'delivered') as sms_delivered,
        COUNT(*) FILTER (WHERE status = 'failed') as sms_failed
    FROM sms_sends 
    GROUP BY sms_campaign_id
) stats ON sc.sms_campaign_id = stats.sms_campaign_id;

-- =============================================
-- SOCIAL MEDIA ANALYTICS VIEWS (Retailer Side)
-- =============================================

-- Social media post performance view
CREATE OR REPLACE VIEW social_post_analytics AS
SELECT 
    sp.post_id,
    sp.account_id,
    sp.campaign_id,
    sp.post_content,
    sp.post_type,
    sp.published_at,
    sa.platform,
    sa.account_handle,
    
    -- Engagement metrics from CSV
    COALESCE(engagement_stats.total_likes, 0) as total_likes,
    COALESCE(engagement_stats.total_comments, 0) as total_comments,
    COALESCE(engagement_stats.total_shares, 0) as total_shares,
    COALESCE(engagement_stats.total_reactions, 0) as total_reactions,
    COALESCE(engagement_stats.total_engagement, 0) as total_engagement,
    
    -- Engagement rate (total engagement per post)
    CASE 
        WHEN sp.published_at IS NOT NULL 
        THEN COALESCE(engagement_stats.total_engagement, 0)
        ELSE 0 
    END as engagement_score
FROM social_posts sp
JOIN social_accounts sa ON sp.account_id = sa.account_id
LEFT JOIN (
    SELECT 
        post_id,
        SUM(engagement_count) FILTER (WHERE engagement_type = 'like') as total_likes,
        SUM(engagement_count) FILTER (WHERE engagement_type = 'comment') as total_comments,
        SUM(engagement_count) FILTER (WHERE engagement_type = 'share') as total_shares,
        SUM(engagement_count) FILTER (WHERE engagement_type = 'reaction') as total_reactions,
        SUM(engagement_count) as total_engagement
    FROM social_engagement 
    GROUP BY post_id
) engagement_stats ON sp.post_id = engagement_stats.post_id;

-- =============================================
-- PRODUCT ANALYTICS VIEWS (Retailer Side)
-- =============================================

-- Product performance view
CREATE OR REPLACE VIEW product_analytics AS
SELECT 
    p.product_id,
    p.external_product_id,
    p.product_title,
    p.product_type,
    p.vendor,
    p.created_at,
    p.published_at,
    p.status,
    
    -- Variant metrics
    COALESCE(variant_stats.variant_count, 0) as variant_count,
    COALESCE(variant_stats.total_inventory, 0) as total_inventory,
    COALESCE(variant_stats.avg_price, 0) as avg_price,
    COALESCE(variant_stats.min_price, 0) as min_price,
    COALESCE(variant_stats.max_price, 0) as max_price
FROM products p
LEFT JOIN (
    SELECT 
        product_id,
        COUNT(*) as variant_count,
        SUM(inventory_quantity) as total_inventory,
        AVG(price) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price
    FROM product_variants 
    GROUP BY product_id
) variant_stats ON p.product_id = variant_stats.product_id;

-- =============================================
-- DAILY METRICS MATERIALIZED VIEW
-- =============================================

-- Daily metrics summary for dashboard
CREATE MATERIALIZED VIEW daily_metrics_summary AS
SELECT 
    DATE(created_at) as metric_date,
    
    -- User metrics
    COUNT(*) FILTER (WHERE table_name = 'users') as new_users,
    
    -- File metrics
    COUNT(*) FILTER (WHERE table_name = 'files') as new_files,
    
    -- Campaign metrics
    COUNT(*) FILTER (WHERE table_name = 'campaigns') as new_campaigns,
    
    -- Email metrics
    COUNT(*) FILTER (WHERE table_name = 'email_sends') as emails_sent,
    
    -- SMS metrics
    COUNT(*) FILTER (WHERE table_name = 'sms_sends') as sms_sent,
    
    -- Social metrics
    COUNT(*) FILTER (WHERE table_name = 'social_posts') as social_posts,
    
    -- Product metrics
    COUNT(*) FILTER (WHERE table_name = 'products') as new_products
FROM (
    SELECT 'users' as table_name, created_at FROM users
    UNION ALL
    SELECT 'files' as table_name, created_at FROM files
    UNION ALL
    SELECT 'campaigns' as table_name, created_at FROM campaigns
    UNION ALL
    SELECT 'email_sends' as table_name, sent_at as created_at FROM email_sends
    UNION ALL
    SELECT 'sms_sends' as table_name, sent_at as created_at FROM sms_sends
    UNION ALL
    SELECT 'social_posts' as table_name, published_at as created_at FROM social_posts WHERE published_at IS NOT NULL
    UNION ALL
    SELECT 'products' as table_name, created_at FROM products
) combined_data
WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE(created_at)
ORDER BY metric_date DESC;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_daily_metrics_summary_date ON daily_metrics_summary(metric_date);

-- =============================================
-- REFRESH FUNCTION FOR MATERIALIZED VIEW
-- =============================================

-- Function to refresh daily metrics
CREATE OR REPLACE FUNCTION refresh_daily_metrics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_metrics_summary;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- PERFORMANCE OPTIMIZATION INDEXES
-- =============================================

-- Additional indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_file_actions_composite ON file_actions(file_id, action_type, action_timestamp);
CREATE INDEX IF NOT EXISTS idx_email_sends_composite ON email_sends(email_campaign_id, status, sent_at);
CREATE INDEX IF NOT EXISTS idx_sms_sends_composite ON sms_sends(sms_campaign_id, status, sent_at);
CREATE INDEX IF NOT EXISTS idx_social_engagement_composite ON social_engagement(post_id, engagement_type, recorded_at);
CREATE INDEX IF NOT EXISTS idx_sessions_duration ON sessions(user_id, started_at, ended_at);

COMMIT;