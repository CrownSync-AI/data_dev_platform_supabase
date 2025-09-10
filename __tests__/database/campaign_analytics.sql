-- CrownSync Campaign Analytics Database Tests
-- Phase 5: Comprehensive Testing Strategy

-- Enable timing for performance testing
\timing on

BEGIN;

-- Test Suite 1: Data Integrity Tests
DO $$
DECLARE
    test_campaign_id UUID;
    retailer_count INTEGER;
    email_count INTEGER;
    clicked_count INTEGER;
    delivered_count INTEGER;
BEGIN
    RAISE NOTICE '=== TEST SUITE 1: DATA INTEGRITY ===';
    
    -- Test 1.1: Verify Marco Bicego campaign exists
    SELECT campaign_id INTO test_campaign_id 
    FROM campaigns 
    WHERE campaign_name = 'Marco Bicego New 2025 Campaign';
    
    IF test_campaign_id IS NULL THEN
        RAISE EXCEPTION 'Marco Bicego campaign not found';
    END IF;
    
    RAISE NOTICE 'Test 1.1 PASSED: Campaign found with ID %', test_campaign_id;
    
    -- Test 1.2: Count unique retailers
    SELECT COUNT(DISTINCT u.user_id) INTO retailer_count
    FROM users u
    JOIN email_sends es ON es.recipient_email LIKE '%@' || SPLIT_PART(u.user_email, '@', 2)
    JOIN email_campaigns ec ON es.email_campaign_id = ec.email_campaign_id
    WHERE ec.campaign_id = test_campaign_id AND u.user_type = 'retailer';
    
    IF retailer_count < 10 THEN
        RAISE EXCEPTION 'Insufficient retailer count: %', retailer_count;
    END IF;
    
    RAISE NOTICE 'Test 1.2 PASSED: % retailers found', retailer_count;
    
    -- Test 1.3: Count total emails
    SELECT COUNT(*) INTO email_count
    FROM email_sends es
    JOIN email_campaigns ec ON es.email_campaign_id = ec.email_campaign_id
    WHERE ec.campaign_id = test_campaign_id;
    
    IF email_count < 1000 THEN
        RAISE EXCEPTION 'Insufficient email count: %', email_count;
    END IF;
    
    RAISE NOTICE 'Test 1.3 PASSED: % emails found', email_count;
    
    -- Test 1.4: Verify click data integrity
    SELECT 
        COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END),
        COUNT(CASE WHEN status = 'delivered' THEN 1 END)
    INTO clicked_count, delivered_count
    FROM email_sends es
    JOIN email_campaigns ec ON es.email_campaign_id = ec.email_campaign_id
    WHERE ec.campaign_id = test_campaign_id;
    
    IF clicked_count = 0 THEN
        RAISE EXCEPTION 'No click data found';
    END IF;
    
    IF delivered_count = 0 THEN
        RAISE EXCEPTION 'No delivery data found';
    END IF;
    
    RAISE NOTICE 'Test 1.4 PASSED: % clicks, % delivered', clicked_count, delivered_count;
    
    -- Test 1.5: Verify data consistency (clicks <= opens <= delivered)
    IF EXISTS (
        SELECT 1 FROM email_sends 
        WHERE clicked_at IS NOT NULL AND opened_at IS NULL
    ) THEN
        RAISE EXCEPTION 'Data inconsistency: clicks without opens';
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM email_sends 
        WHERE opened_at IS NOT NULL AND delivered_at IS NULL
    ) THEN
        RAISE EXCEPTION 'Data inconsistency: opens without delivery';
    END IF;
    
    RAISE NOTICE 'Test 1.5 PASSED: Data consistency verified';
    
END $$;

-- Test Suite 2: Performance Tests
DO $$
DECLARE
    start_time TIMESTAMP;
    end_time TIMESTAMP;
    execution_time INTERVAL;
    test_campaign_id UUID;
BEGIN
    RAISE NOTICE '=== TEST SUITE 2: PERFORMANCE TESTS ===';
    
    SELECT campaign_id INTO test_campaign_id 
    FROM campaigns 
    WHERE campaign_name = 'Marco Bicego New 2025 Campaign';
    
    -- Test 2.1: Campaign Leaderboard Performance (<500ms)
    start_time := clock_timestamp();
    
    PERFORM *
    FROM (
        WITH campaign_performance AS (
            SELECT 
                c.campaign_id,
                c.campaign_name,
                u.user_id as retailer_id,
                u.user_name as retailer_name,
                u.user_email as retailer_email,
                u.region,
                COUNT(es.email_send_id) as emails_sent,
                COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) as emails_delivered,
                COUNT(es.opened_at) as emails_opened,
                COUNT(es.clicked_at) as emails_clicked,
                ROUND(
                    CASE WHEN COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) > 0 
                    THEN (COUNT(es.clicked_at)::DECIMAL / COUNT(CASE WHEN es.status = 'delivered' THEN 1 END)) * 100 
                    ELSE 0 END, 2
                ) as click_rate
            FROM campaigns c
            JOIN email_campaigns ec ON c.campaign_id = ec.campaign_id
            JOIN email_sends es ON ec.email_campaign_id = es.email_campaign_id
            JOIN users u ON es.recipient_email LIKE '%@' || SPLIT_PART(u.user_email, '@', 2)
            WHERE u.user_type = 'retailer' AND c.campaign_id = test_campaign_id
            GROUP BY c.campaign_id, c.campaign_name, u.user_id, u.user_name, u.user_email, u.region
        ),
        ranked_performance AS (
            SELECT *,
                ROW_NUMBER() OVER (ORDER BY click_rate DESC) as overall_rank
            FROM campaign_performance
        )
        SELECT * FROM ranked_performance
        ORDER BY overall_rank
        LIMIT 20
    ) leaderboard;
    
    end_time := clock_timestamp();
    execution_time := end_time - start_time;
    
    IF EXTRACT(MILLISECONDS FROM execution_time) > 500 THEN
        RAISE EXCEPTION 'Leaderboard query too slow: % ms', EXTRACT(MILLISECONDS FROM execution_time);
    END IF;
    
    RAISE NOTICE 'Test 2.1 PASSED: Leaderboard query executed in % ms', EXTRACT(MILLISECONDS FROM execution_time);
    
    -- Test 2.2: Campaign Summary Performance (<200ms)
    start_time := clock_timestamp();
    
    PERFORM *
    FROM (
        WITH campaign_stats AS (
            SELECT 
                u.region,
                COUNT(es.email_send_id) as emails_sent,
                COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) as emails_delivered,
                COUNT(es.opened_at) as emails_opened,
                COUNT(es.clicked_at) as emails_clicked
            FROM campaigns c
            JOIN email_campaigns ec ON c.campaign_id = ec.campaign_id
            JOIN email_sends es ON ec.email_campaign_id = es.email_campaign_id
            JOIN users u ON es.recipient_email LIKE '%@' || SPLIT_PART(u.user_email, '@', 2)
            WHERE u.user_type = 'retailer' AND c.campaign_id = test_campaign_id
            GROUP BY u.user_id, u.region
        )
        SELECT 
            COUNT(*) as total_retailers,
            SUM(emails_sent) as total_emails_sent,
            SUM(emails_delivered) as total_emails_delivered,
            SUM(emails_opened) as total_emails_opened,
            SUM(emails_clicked) as total_emails_clicked
        FROM campaign_stats
    ) summary;
    
    end_time := clock_timestamp();
    execution_time := end_time - start_time;
    
    IF EXTRACT(MILLISECONDS FROM execution_time) > 200 THEN
        RAISE EXCEPTION 'Summary query too slow: % ms', EXTRACT(MILLISECONDS FROM execution_time);
    END IF;
    
    RAISE NOTICE 'Test 2.2 PASSED: Summary query executed in % ms', EXTRACT(MILLISECONDS FROM execution_time);
    
END $$;

-- Test Suite 3: Data Accuracy Tests
DO $$
DECLARE
    test_campaign_id UUID;
    calculated_rate DECIMAL;
    expected_retailer_count INTEGER;
    actual_retailer_count INTEGER;
BEGIN
    RAISE NOTICE '=== TEST SUITE 3: DATA ACCURACY TESTS ===';
    
    SELECT campaign_id INTO test_campaign_id 
    FROM campaigns 
    WHERE campaign_name = 'Marco Bicego New 2025 Campaign';
    
    -- Test 3.1: Verify ranking accuracy
    WITH campaign_performance AS (
        SELECT 
            u.user_name as retailer_name,
            ROUND(
                CASE WHEN COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) > 0 
                THEN (COUNT(es.clicked_at)::DECIMAL / COUNT(CASE WHEN es.status = 'delivered' THEN 1 END)) * 100 
                ELSE 0 END, 2
            ) as click_rate
        FROM campaigns c
        JOIN email_campaigns ec ON c.campaign_id = ec.campaign_id
        JOIN email_sends es ON ec.email_campaign_id = es.email_campaign_id
        JOIN users u ON es.recipient_email LIKE '%@' || SPLIT_PART(u.user_email, '@', 2)
        WHERE u.user_type = 'retailer' AND c.campaign_id = test_campaign_id
        GROUP BY u.user_id, u.user_name
    ),
    ranked_data AS (
        SELECT 
            retailer_name,
            click_rate,
            ROW_NUMBER() OVER (ORDER BY click_rate DESC) as calculated_rank
        FROM campaign_performance
    )
    SELECT click_rate INTO calculated_rate
    FROM ranked_data
    WHERE calculated_rank = 1;
    
    IF calculated_rate <= 0 THEN
        RAISE EXCEPTION 'Top performer has invalid click rate: %', calculated_rate;
    END IF;
    
    RAISE NOTICE 'Test 3.1 PASSED: Top performer click rate: %', calculated_rate;
    
    -- Test 3.2: Verify regional distribution
    SELECT COUNT(DISTINCT region) INTO actual_retailer_count
    FROM users u
    JOIN email_sends es ON es.recipient_email LIKE '%@' || SPLIT_PART(u.user_email, '@', 2)
    JOIN email_campaigns ec ON es.email_campaign_id = ec.email_campaign_id
    WHERE ec.campaign_id = test_campaign_id AND u.user_type = 'retailer';
    
    IF actual_retailer_count < 3 THEN
        RAISE EXCEPTION 'Insufficient regional distribution: % regions', actual_retailer_count;
    END IF;
    
    RAISE NOTICE 'Test 3.2 PASSED: % regions represented', actual_retailer_count;
    
    -- Test 3.3: Verify percentage calculations
    IF EXISTS (
        WITH campaign_performance AS (
            SELECT 
                CASE WHEN COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) > 0 
                THEN (COUNT(es.clicked_at)::DECIMAL / COUNT(CASE WHEN es.status = 'delivered' THEN 1 END)) * 100 
                ELSE 0 END as click_rate
            FROM campaigns c
            JOIN email_campaigns ec ON c.campaign_id = ec.campaign_id
            JOIN email_sends es ON ec.email_campaign_id = es.email_campaign_id
            JOIN users u ON es.recipient_email LIKE '%@' || SPLIT_PART(u.user_email, '@', 2)
            WHERE u.user_type = 'retailer' AND c.campaign_id = test_campaign_id
            GROUP BY u.user_id
        )
        SELECT 1 FROM campaign_performance
        WHERE click_rate < 0 OR click_rate > 100
    ) THEN
        RAISE EXCEPTION 'Invalid percentage calculations found';
    END IF;
    
    RAISE NOTICE 'Test 3.3 PASSED: All percentage calculations valid';
    
END $$;

-- Test Suite 4: API Data Validation
DO $$
DECLARE
    test_campaign_id UUID;
    leaderboard_count INTEGER;
    summary_data RECORD;
BEGIN
    RAISE NOTICE '=== TEST SUITE 4: API DATA VALIDATION ===';
    
    SELECT campaign_id INTO test_campaign_id 
    FROM campaigns 
    WHERE campaign_name = 'Marco Bicego New 2025 Campaign';
    
    -- Test 4.1: Validate leaderboard data structure
    WITH api_leaderboard AS (
        WITH campaign_performance AS (
            SELECT 
                c.campaign_id,
                c.campaign_name,
                u.user_id as retailer_id,
                u.user_name as retailer_name,
                u.user_email as retailer_email,
                u.region,
                COUNT(es.email_send_id) as emails_sent,
                COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) as emails_delivered,
                COUNT(es.opened_at) as emails_opened,
                COUNT(es.clicked_at) as emails_clicked,
                ROUND(
                    CASE WHEN COUNT(es.email_send_id) > 0 
                    THEN (COUNT(CASE WHEN es.status = 'delivered' THEN 1 END)::DECIMAL / COUNT(es.email_send_id)) * 100 
                    ELSE 0 END, 2
                ) as delivery_rate,
                ROUND(
                    CASE WHEN COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) > 0 
                    THEN (COUNT(es.opened_at)::DECIMAL / COUNT(CASE WHEN es.status = 'delivered' THEN 1 END)) * 100 
                    ELSE 0 END, 2
                ) as open_rate,
                ROUND(
                    CASE WHEN COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) > 0 
                    THEN (COUNT(es.clicked_at)::DECIMAL / COUNT(CASE WHEN es.status = 'delivered' THEN 1 END)) * 100 
                    ELSE 0 END, 2
                ) as click_rate,
                MIN(es.sent_at) as first_send_time,
                MAX(es.sent_at) as last_send_time,
                NOW() as last_updated
            FROM campaigns c
            JOIN email_campaigns ec ON c.campaign_id = ec.campaign_id
            JOIN email_sends es ON ec.email_campaign_id = es.email_campaign_id
            JOIN users u ON es.recipient_email LIKE '%@' || SPLIT_PART(u.user_email, '@', 2)
            WHERE u.user_type = 'retailer' AND c.campaign_id = test_campaign_id
            GROUP BY c.campaign_id, c.campaign_name, u.user_id, u.user_name, u.user_email, u.region
        ),
        ranked_performance AS (
            SELECT *,
                ROW_NUMBER() OVER (ORDER BY click_rate DESC) as overall_rank,
                ROW_NUMBER() OVER (PARTITION BY region ORDER BY click_rate DESC) as region_rank,
                CASE 
                    WHEN click_rate >= 3.5 THEN 'Top'
                    WHEN click_rate >= 2.5 THEN 'Good'
                    WHEN click_rate >= 1.5 THEN 'Average'
                    ELSE 'Needs Improvement'
                END as performance_tier
            FROM campaign_performance
        )
        SELECT * FROM ranked_performance
    )
    SELECT COUNT(*) INTO leaderboard_count FROM api_leaderboard;
    
    IF leaderboard_count = 0 THEN
        RAISE EXCEPTION 'API leaderboard returns no data';
    END IF;
    
    RAISE NOTICE 'Test 4.1 PASSED: API leaderboard returns % records', leaderboard_count;
    
    -- Test 4.2: Validate summary data structure
    WITH campaign_stats AS (
        SELECT 
            u.region,
            COUNT(es.email_send_id) as emails_sent,
            COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) as emails_delivered,
            COUNT(es.opened_at) as emails_opened,
            COUNT(es.clicked_at) as emails_clicked
        FROM campaigns c
        JOIN email_campaigns ec ON c.campaign_id = ec.campaign_id
        JOIN email_sends es ON ec.email_campaign_id = es.email_campaign_id
        JOIN users u ON es.recipient_email LIKE '%@' || SPLIT_PART(u.user_email, '@', 2)
        WHERE u.user_type = 'retailer' AND c.campaign_id = test_campaign_id
        GROUP BY u.user_id, u.region
    )
    SELECT 
        COUNT(*) as total_retailers,
        SUM(emails_sent) as total_emails_sent,
        SUM(emails_delivered) as total_emails_delivered,
        SUM(emails_opened) as total_emails_opened,
        SUM(emails_clicked) as total_emails_clicked
    INTO summary_data
    FROM campaign_stats;
    
    IF summary_data.total_retailers = 0 THEN
        RAISE EXCEPTION 'API summary returns zero retailers';
    END IF;
    
    IF summary_data.total_emails_sent = 0 THEN
        RAISE EXCEPTION 'API summary returns zero emails';
    END IF;
    
    RAISE NOTICE 'Test 4.2 PASSED: API summary data valid - % retailers, % emails', 
        summary_data.total_retailers, summary_data.total_emails_sent;
    
END $$;

-- Performance Summary Report
DO $$
DECLARE
    total_retailers INTEGER;
    total_emails INTEGER;
    avg_click_rate DECIMAL;
    top_performer TEXT;
    test_campaign_id UUID;
BEGIN
    RAISE NOTICE '=== DATABASE PERFORMANCE SUMMARY ===';
    
    SELECT campaign_id INTO test_campaign_id 
    FROM campaigns 
    WHERE campaign_name = 'Marco Bicego New 2025 Campaign';
    
    WITH campaign_stats AS (
        SELECT 
            u.user_name,
            COUNT(es.email_send_id) as emails_sent,
            ROUND(
                CASE WHEN COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) > 0 
                THEN (COUNT(es.clicked_at)::DECIMAL / COUNT(CASE WHEN es.status = 'delivered' THEN 1 END)) * 100 
                ELSE 0 END, 2
            ) as click_rate
        FROM campaigns c
        JOIN email_campaigns ec ON c.campaign_id = ec.campaign_id
        JOIN email_sends es ON ec.email_campaign_id = es.email_campaign_id
        JOIN users u ON es.recipient_email LIKE '%@' || SPLIT_PART(u.user_email, '@', 2)
        WHERE u.user_type = 'retailer' AND c.campaign_id = test_campaign_id
        GROUP BY u.user_id, u.user_name
    )
    SELECT 
        COUNT(*),
        SUM(emails_sent),
        AVG(click_rate),
        (SELECT user_name FROM campaign_stats ORDER BY click_rate DESC LIMIT 1)
    INTO total_retailers, total_emails, avg_click_rate, top_performer
    FROM campaign_stats;
    
    RAISE NOTICE 'Campaign: Marco Bicego New 2025';
    RAISE NOTICE 'Total Retailers: %', total_retailers;
    RAISE NOTICE 'Total Emails: %', total_emails;
    RAISE NOTICE 'Average Click Rate: %', avg_click_rate;
    RAISE NOTICE 'Top Performer: %', top_performer;
    RAISE NOTICE '=== ALL DATABASE TESTS PASSED! ===';
    
END $$;

COMMIT;

-- Final validation query to ensure data is ready for APIs
SELECT 
    'Marco Bicego Campaign Validation' as test_name,
    c.campaign_id,
    c.campaign_name,
    COUNT(DISTINCT u.user_id) as unique_retailers,
    COUNT(es.email_send_id) as total_emails,
    COUNT(CASE WHEN es.clicked_at IS NOT NULL THEN 1 END) as total_clicks,
    ROUND(AVG(
        CASE WHEN COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) OVER (PARTITION BY u.user_id) > 0 
        THEN (COUNT(es.clicked_at) OVER (PARTITION BY u.user_id)::DECIMAL / 
              COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) OVER (PARTITION BY u.user_id)) * 100 
        ELSE 0 END
    ), 2) as avg_click_rate
FROM campaigns c
JOIN email_campaigns ec ON c.campaign_id = ec.campaign_id
JOIN email_sends es ON ec.email_campaign_id = es.email_campaign_id
JOIN users u ON es.recipient_email LIKE '%@' || SPLIT_PART(u.user_email, '@', 2)
WHERE u.user_type = 'retailer' 
  AND c.campaign_name = 'Marco Bicego New 2025 Campaign'
GROUP BY c.campaign_id, c.campaign_name;

\timing off 