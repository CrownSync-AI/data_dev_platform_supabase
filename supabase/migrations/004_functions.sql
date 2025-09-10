-- =============================================
-- DATABASE UTILITY FUNCTIONS AND PROCEDURES
-- Helper functions for data operations and analytics
-- =============================================

-- =============================================
-- USER MANAGEMENT FUNCTIONS
-- =============================================

-- Function to create a new user with proper validation
CREATE OR REPLACE FUNCTION create_user(
    p_email VARCHAR(255),
    p_name VARCHAR(255),
    p_user_type user_type_enum,
    p_profile_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Validate email format
    IF p_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
        RAISE EXCEPTION 'Invalid email format';
    END IF;
    
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM users WHERE user_email = p_email) THEN
        RAISE EXCEPTION 'Email already exists';
    END IF;
    
    -- Insert new user
    INSERT INTO users (user_email, user_name, user_type, profile_data)
    VALUES (p_email, p_name, p_user_type, p_profile_data)
    RETURNING user_id INTO new_user_id;
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update user last login
CREATE OR REPLACE FUNCTION update_user_last_login(
    p_user_id UUID
)
RETURNS void AS $$
BEGIN
    UPDATE users 
    SET last_login_at = NOW()
    WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- FILE MANAGEMENT FUNCTIONS
-- =============================================

-- Function to record file action
CREATE OR REPLACE FUNCTION record_file_action(
    p_file_id UUID,
    p_user_id UUID,
    p_action_type action_type_enum,
    p_session_id UUID DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    action_id UUID;
BEGIN
    -- Validate file exists
    IF NOT EXISTS (SELECT 1 FROM files WHERE file_id = p_file_id AND deleted_at IS NULL) THEN
        RAISE EXCEPTION 'File not found or deleted';
    END IF;
    
    -- Validate user exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Insert file action
    INSERT INTO file_actions (
        file_id, user_id, action_type, session_id, 
        ip_address, user_agent, metadata
    )
    VALUES (
        p_file_id, p_user_id, p_action_type, p_session_id,
        p_ip_address, p_user_agent, p_metadata
    )
    RETURNING action_id INTO action_id;
    
    RETURN action_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to soft delete a file
CREATE OR REPLACE FUNCTION soft_delete_file(
    p_file_id UUID,
    p_user_id UUID
)
RETURNS void AS $$
BEGIN
    -- Check if user owns the file or is admin
    IF NOT EXISTS (
        SELECT 1 FROM files f
        JOIN users u ON u.user_id = p_user_id
        WHERE f.file_id = p_file_id 
        AND (f.created_by_user_id = p_user_id OR u.user_type = 'admin')
    ) THEN
        RAISE EXCEPTION 'Unauthorized to delete this file';
    END IF;
    
    -- Soft delete the file
    UPDATE files 
    SET deleted_at = NOW()
    WHERE file_id = p_file_id;
    
    -- Record the delete action
    PERFORM record_file_action(p_file_id, p_user_id, 'DELETE');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SESSION MANAGEMENT FUNCTIONS
-- =============================================

-- Function to start a new session
CREATE OR REPLACE FUNCTION start_session(
    p_user_id UUID,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_device_info JSONB DEFAULT '{}',
    p_location_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    session_id UUID;
BEGIN
    -- Validate user exists
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Insert new session
    INSERT INTO sessions (
        user_id, ip_address, user_agent, device_info, location_data
    )
    VALUES (
        p_user_id, p_ip_address, p_user_agent, p_device_info, p_location_data
    )
    RETURNING session_id INTO session_id;
    
    -- Update user last login
    PERFORM update_user_last_login(p_user_id);
    
    RETURN session_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to end a session
CREATE OR REPLACE FUNCTION end_session(
    p_session_id UUID
)
RETURNS void AS $$
BEGIN
    UPDATE sessions 
    SET ended_at = NOW()
    WHERE session_id = p_session_id
    AND ended_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- CAMPAIGN MANAGEMENT FUNCTIONS
-- =============================================

-- Function to create a campaign with validation
CREATE OR REPLACE FUNCTION create_campaign(
    p_name VARCHAR(255),
    p_description TEXT,
    p_created_by_user_id UUID,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_budget_allocated DECIMAL(12,2) DEFAULT NULL,
    p_target_audience JSONB DEFAULT '{}',
    p_campaign_settings JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    campaign_id UUID;
BEGIN
    -- Validate dates
    IF p_end_date IS NOT NULL AND p_start_date IS NOT NULL AND p_end_date < p_start_date THEN
        RAISE EXCEPTION 'End date cannot be before start date';
    END IF;
    
    -- Validate budget
    IF p_budget_allocated IS NOT NULL AND p_budget_allocated < 0 THEN
        RAISE EXCEPTION 'Budget cannot be negative';
    END IF;
    
    -- Insert campaign
    INSERT INTO campaigns (
        campaign_name, campaign_description, created_by_user_id,
        start_date, end_date, budget_allocated, target_audience, campaign_settings
    )
    VALUES (
        p_name, p_description, p_created_by_user_id,
        p_start_date, p_end_date, p_budget_allocated, p_target_audience, p_campaign_settings
    )
    RETURNING campaign_id INTO campaign_id;
    
    RETURN campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update campaign budget spent
CREATE OR REPLACE FUNCTION update_campaign_budget_spent(
    p_campaign_id UUID,
    p_amount DECIMAL(12,2)
)
RETURNS void AS $$
BEGIN
    UPDATE campaigns 
    SET budget_spent = COALESCE(budget_spent, 0) + p_amount
    WHERE campaign_id = p_campaign_id;
    
    -- Check if budget exceeded
    IF EXISTS (
        SELECT 1 FROM campaigns 
        WHERE campaign_id = p_campaign_id 
        AND budget_allocated IS NOT NULL 
        AND budget_spent > budget_allocated
    ) THEN
        RAISE WARNING 'Campaign budget exceeded';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- EMAIL CAMPAIGN FUNCTIONS
-- =============================================

-- Function to send email campaign
CREATE OR REPLACE FUNCTION send_email_campaign(
    p_email_campaign_id UUID,
    p_recipients JSONB -- Array of {email, name} objects
)
RETURNS INTEGER AS $$
DECLARE
    recipient JSONB;
    sent_count INTEGER := 0;
BEGIN
    -- Validate email campaign exists
    IF NOT EXISTS (SELECT 1 FROM email_campaigns WHERE email_campaign_id = p_email_campaign_id) THEN
        RAISE EXCEPTION 'Email campaign not found';
    END IF;
    
    -- Loop through recipients and create email sends
    FOR recipient IN SELECT * FROM jsonb_array_elements(p_recipients)
    LOOP
        INSERT INTO email_sends (
            email_campaign_id,
            recipient_email,
            recipient_name
        )
        VALUES (
            p_email_campaign_id,
            recipient->>'email',
            recipient->>'name'
        );
        
        sent_count := sent_count + 1;
    END LOOP;
    
    -- Update email campaign sent timestamp and recipient count
    UPDATE email_campaigns 
    SET 
        sent_at = NOW(),
        total_recipients = sent_count
    WHERE email_campaign_id = p_email_campaign_id;
    
    RETURN sent_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update email delivery status
CREATE OR REPLACE FUNCTION update_email_status(
    p_email_send_id UUID,
    p_status email_status_enum,
    p_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    p_bounce_reason TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    UPDATE email_sends 
    SET 
        status = p_status,
        delivered_at = CASE WHEN p_status = 'delivered' THEN p_timestamp ELSE delivered_at END,
        opened_at = CASE WHEN p_status = 'opened' THEN p_timestamp ELSE opened_at END,
        clicked_at = CASE WHEN p_status = 'clicked' THEN p_timestamp ELSE clicked_at END,
        bounced_at = CASE WHEN p_status = 'bounced' THEN p_timestamp ELSE bounced_at END,
        bounce_reason = CASE WHEN p_status = 'bounced' THEN p_bounce_reason ELSE bounce_reason END
    WHERE email_send_id = p_email_send_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SMS CAMPAIGN FUNCTIONS
-- =============================================

-- Function to send SMS campaign
CREATE OR REPLACE FUNCTION send_sms_campaign(
    p_sms_campaign_id UUID,
    p_recipients JSONB -- Array of {phone, name} objects
)
RETURNS INTEGER AS $$
DECLARE
    recipient JSONB;
    sent_count INTEGER := 0;
BEGIN
    -- Validate SMS campaign exists
    IF NOT EXISTS (SELECT 1 FROM sms_campaigns WHERE sms_campaign_id = p_sms_campaign_id) THEN
        RAISE EXCEPTION 'SMS campaign not found';
    END IF;
    
    -- Loop through recipients and create SMS sends
    FOR recipient IN SELECT * FROM jsonb_array_elements(p_recipients)
    LOOP
        INSERT INTO sms_sends (
            sms_campaign_id,
            recipient_phone,
            recipient_name
        )
        VALUES (
            p_sms_campaign_id,
            recipient->>'phone',
            recipient->>'name'
        );
        
        sent_count := sent_count + 1;
    END LOOP;
    
    -- Update SMS campaign sent timestamp and recipient count
    UPDATE sms_campaigns 
    SET 
        sent_at = NOW(),
        total_recipients = sent_count
    WHERE sms_campaign_id = p_sms_campaign_id;
    
    RETURN sent_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update SMS delivery status
CREATE OR REPLACE FUNCTION update_sms_status(
    p_sms_send_id UUID,
    p_status sms_status_enum,
    p_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    p_failure_reason TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    UPDATE sms_sends 
    SET 
        status = p_status,
        delivered_at = CASE WHEN p_status = 'delivered' THEN p_timestamp ELSE delivered_at END,
        failure_reason = CASE WHEN p_status = 'failed' THEN p_failure_reason ELSE failure_reason END
    WHERE sms_send_id = p_sms_send_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- SOCIAL MEDIA FUNCTIONS
-- =============================================

-- Function to create social media post
CREATE OR REPLACE FUNCTION create_social_post(
    p_account_id UUID,
    p_campaign_id UUID,
    p_content TEXT,
    p_post_type VARCHAR(50),
    p_scheduled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    post_id UUID;
BEGIN
    -- Validate social account exists
    IF NOT EXISTS (SELECT 1 FROM social_accounts WHERE account_id = p_account_id AND is_active = true) THEN
        RAISE EXCEPTION 'Social account not found or inactive';
    END IF;
    
    -- Insert social post
    INSERT INTO social_posts (
        account_id, campaign_id, post_content, post_type, scheduled_at, metadata
    )
    VALUES (
        p_account_id, p_campaign_id, p_content, p_post_type, p_scheduled_at, p_metadata
    )
    RETURNING post_id INTO post_id;
    
    RETURN post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update social post engagement
CREATE OR REPLACE FUNCTION update_social_engagement(
    p_post_id UUID,
    p_engagement_type VARCHAR(50),
    p_engagement_count INTEGER,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
    -- Insert or update engagement record
    INSERT INTO social_engagement (
        post_id, engagement_type, engagement_count, metadata
    )
    VALUES (
        p_post_id, p_engagement_type, p_engagement_count, p_metadata
    )
    ON CONFLICT (post_id, engagement_type) 
    DO UPDATE SET 
        engagement_count = p_engagement_count,
        recorded_at = NOW(),
        metadata = p_metadata;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- ANALYTICS FUNCTIONS
-- =============================================

-- Function to calculate file engagement score
CREATE OR REPLACE FUNCTION calculate_file_engagement_score(
    p_file_id UUID
)
RETURNS DECIMAL(10,4) AS $$
DECLARE
    score DECIMAL(10,4) := 0;
    view_count INTEGER;
    download_count INTEGER;
    share_count INTEGER;
    unique_viewers INTEGER;
BEGIN
    -- Get file statistics
    SELECT 
        COALESCE(COUNT(*) FILTER (WHERE action_type = 'VIEW'), 0),
        COALESCE(COUNT(*) FILTER (WHERE action_type = 'DOWNLOAD'), 0),
        COALESCE(COUNT(*) FILTER (WHERE action_type = 'SHARE'), 0),
        COALESCE(COUNT(DISTINCT user_id) FILTER (WHERE action_type = 'VIEW'), 0)
    INTO view_count, download_count, share_count, unique_viewers
    FROM file_actions 
    WHERE file_id = p_file_id;
    
    -- Calculate weighted engagement score
    score := (view_count * 1.0) + (download_count * 3.0) + (share_count * 5.0) + (unique_viewers * 2.0);
    
    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Function to get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(
    p_user_id UUID,
    p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    total_sessions INTEGER,
    total_file_views INTEGER,
    total_file_downloads INTEGER,
    total_file_shares INTEGER,
    avg_session_duration_minutes DECIMAL(10,2),
    most_active_day VARCHAR(10)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(session_stats.session_count, 0)::INTEGER,
        COALESCE(activity_stats.view_count, 0)::INTEGER,
        COALESCE(activity_stats.download_count, 0)::INTEGER,
        COALESCE(activity_stats.share_count, 0)::INTEGER,
        COALESCE(session_stats.avg_duration, 0)::DECIMAL(10,2),
        COALESCE(activity_stats.most_active_day, 'N/A')::VARCHAR(10)
    FROM (
        SELECT 
            COUNT(*) as session_count,
            AVG(EXTRACT(EPOCH FROM (COALESCE(ended_at, NOW()) - started_at))/60) as avg_duration
        FROM sessions 
        WHERE user_id = p_user_id 
        AND started_at >= NOW() - INTERVAL '1 day' * p_days
    ) session_stats
    CROSS JOIN (
        SELECT 
            COUNT(*) FILTER (WHERE action_type = 'VIEW') as view_count,
            COUNT(*) FILTER (WHERE action_type = 'DOWNLOAD') as download_count,
            COUNT(*) FILTER (WHERE action_type = 'SHARE') as share_count,
            MODE() WITHIN GROUP (ORDER BY EXTRACT(DOW FROM action_timestamp)) as most_active_day_num
        FROM file_actions 
        WHERE user_id = p_user_id 
        AND action_timestamp >= NOW() - INTERVAL '1 day' * p_days
    ) activity_base
    CROSS JOIN (
        SELECT 
            CASE activity_base.most_active_day_num
                WHEN 0 THEN 'Sunday'
                WHEN 1 THEN 'Monday'
                WHEN 2 THEN 'Tuesday'
                WHEN 3 THEN 'Wednesday'
                WHEN 4 THEN 'Thursday'
                WHEN 5 THEN 'Friday'
                WHEN 6 THEN 'Saturday'
                ELSE 'N/A'
            END as most_active_day
    ) activity_stats;
END;
$$ LANGUAGE plpgsql;

-- Function to refresh all analytics
CREATE OR REPLACE FUNCTION refresh_all_analytics()
RETURNS void AS $$
BEGIN
    -- Refresh materialized view
    REFRESH MATERIALIZED VIEW CONCURRENTLY daily_metrics_summary;
    
    -- Update daily analytics for today
    INSERT INTO daily_analytics (date_recorded, entity_type, entity_id, metric_name, metric_value)
    SELECT 
        CURRENT_DATE,
        'system',
        '00000000-0000-0000-0000-000000000000'::UUID,
        'total_users',
        COUNT(*)::DECIMAL
    FROM users
    WHERE is_active = true
    ON CONFLICT (date_recorded, entity_type, entity_id, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
    
    -- Add more daily metrics as needed
    INSERT INTO daily_analytics (date_recorded, entity_type, entity_id, metric_name, metric_value)
    SELECT 
        CURRENT_DATE,
        'system',
        '00000000-0000-0000-0000-000000000000'::UUID,
        'total_files',
        COUNT(*)::DECIMAL
    FROM files
    WHERE deleted_at IS NULL
    ON CONFLICT (date_recorded, entity_type, entity_id, metric_name) 
    DO UPDATE SET metric_value = EXCLUDED.metric_value;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- CLEANUP FUNCTIONS
-- =============================================

-- Function to cleanup old sessions
CREATE OR REPLACE FUNCTION cleanup_old_sessions(
    p_days_old INTEGER DEFAULT 90
)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM sessions 
    WHERE started_at < NOW() - INTERVAL '1 day' * p_days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old file actions
CREATE OR REPLACE FUNCTION cleanup_old_file_actions(
    p_days_old INTEGER DEFAULT 365
)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM file_actions 
    WHERE action_timestamp < NOW() - INTERVAL '1 day' * p_days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(
    p_days_old INTEGER DEFAULT 730
)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit_logs 
    WHERE changed_at < NOW() - INTERVAL '1 day' * p_days_old;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;