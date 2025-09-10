-- =============================================
-- DATABASE RESTORATION SCRIPT
-- Restore database from backup created by backup_before_dummy_data.sql
-- =============================================

-- Start transaction for consistency
BEGIN;

-- =============================================
-- RESTORATION VERIFICATION
-- =============================================

-- Check if backup exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'backup_metadata') THEN
        RAISE EXCEPTION 'Backup not found. Please run backup_before_dummy_data.sql first.';
    END IF;
    
    RAISE NOTICE 'Backup found. Proceeding with restoration...';
END $$;

-- Display backup information
SELECT 
    'Restoring from backup created at: ' || backup_created_at as info,
    backup_description,
    total_tables_backed_up || ' tables will be restored' as restoration_scope
FROM backup_metadata 
ORDER BY backup_created_at DESC 
LIMIT 1;

-- =============================================
-- DATA RESTORATION
-- =============================================

-- Disable triggers temporarily to avoid issues during restoration
SET session_replication_role = replica;

-- 1. Restore Users table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users_backup') THEN
        TRUNCATE TABLE users CASCADE;
        INSERT INTO users (user_id, user_email, user_name, user_type, created_at, updated_at, last_login_at, is_active, profile_data)
        SELECT user_id, user_email, user_name, user_type, created_at, updated_at, last_login_at, is_active, profile_data 
        FROM users_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Users table restored: % rows', (SELECT COUNT(*) FROM users);
    END IF;
END $$;

-- 2. Restore Files table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'files_backup') THEN
        TRUNCATE TABLE files CASCADE;
        INSERT INTO files 
        SELECT file_id, file_name, file_type, file_size, file_path, file_url, created_at, updated_at, created_by_user_id, deleted_at, metadata
        FROM files_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Files table restored: % rows', (SELECT COUNT(*) FROM files);
    END IF;
END $$;

-- 3. Restore File Actions table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'file_actions_backup') THEN
        TRUNCATE TABLE file_actions CASCADE;
        INSERT INTO file_actions 
        SELECT action_id, file_id, user_id, action_type, action_timestamp, session_id, ip_address, user_agent, metadata
        FROM file_actions_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'File Actions table restored: % rows', (SELECT COUNT(*) FROM file_actions);
    END IF;
END $$;

-- 4. Restore Campaigns table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'campaigns_backup') THEN
        TRUNCATE TABLE campaigns CASCADE;
        INSERT INTO campaigns 
        SELECT campaign_id, campaign_name, campaign_description, campaign_status, created_at, updated_at, created_by_user_id, start_date, end_date, budget_allocated, budget_spent, target_audience, campaign_settings
        FROM campaigns_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Campaigns table restored: % rows', (SELECT COUNT(*) FROM campaigns);
    END IF;
END $$;

-- 5. Restore Templates table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'templates_backup') THEN
        TRUNCATE TABLE templates CASCADE;
        INSERT INTO templates 
        SELECT template_id, template_name, template_type, template_content, created_at, updated_at, created_by_user_id, is_active, version, parent_template_id
        FROM templates_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Templates table restored: % rows', (SELECT COUNT(*) FROM templates);
    END IF;
END $$;

-- 6. Restore Sessions table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sessions_backup') THEN
        TRUNCATE TABLE sessions CASCADE;
        INSERT INTO sessions 
        SELECT session_id, user_id, started_at, ended_at, ip_address, user_agent, device_info, location_data
        FROM sessions_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Sessions table restored: % rows', (SELECT COUNT(*) FROM sessions);
    END IF;
END $$;

-- 7. Restore Collections table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'collections_backup') THEN
        TRUNCATE TABLE collections CASCADE;
        INSERT INTO collections 
        SELECT collection_id, collection_name, collection_description, created_at, updated_at, created_by_user_id, is_public, metadata
        FROM collections_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Collections table restored: % rows', (SELECT COUNT(*) FROM collections);
    END IF;
END $$;

-- 8. Restore Collection Files table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'collection_files_backup') THEN
        TRUNCATE TABLE collection_files CASCADE;
        INSERT INTO collection_files 
        SELECT collection_id, file_id, added_at, added_by_user_id, sort_order
        FROM collection_files_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Collection Files table restored: % rows', (SELECT COUNT(*) FROM collection_files);
    END IF;
END $$;

-- 9. Restore Geography table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'geography_backup') THEN
        TRUNCATE TABLE geography CASCADE;
        INSERT INTO geography 
        SELECT geography_id, country_code, country_name, region, city, latitude, longitude, timezone, created_at
        FROM geography_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Geography table restored: % rows', (SELECT COUNT(*) FROM geography);
    END IF;
END $$;

-- 10. Restore Devices table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'devices_backup') THEN
        TRUNCATE TABLE devices CASCADE;
        INSERT INTO devices 
        SELECT device_id, device_type, device_brand, device_model, operating_system, browser, screen_resolution, user_agent, created_at
        FROM devices_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Devices table restored: % rows', (SELECT COUNT(*) FROM devices);
    END IF;
END $$;

-- 11. Restore Email Campaigns table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_campaigns_backup') THEN
        TRUNCATE TABLE email_campaigns CASCADE;
        INSERT INTO email_campaigns 
        SELECT email_campaign_id, campaign_id, email_subject, email_content, sender_email, sender_name, created_at, sent_at, total_recipients, metadata
        FROM email_campaigns_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Email Campaigns table restored: % rows', (SELECT COUNT(*) FROM email_campaigns);
    END IF;
END $$;

-- 12. Restore Email Sends table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'email_sends_backup') THEN
        TRUNCATE TABLE email_sends CASCADE;
        INSERT INTO email_sends 
        SELECT email_send_id, email_campaign_id, recipient_email, recipient_name, sent_at, delivered_at, opened_at, clicked_at, bounced_at, status, bounce_reason, metadata
        FROM email_sends_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Email Sends table restored: % rows', (SELECT COUNT(*) FROM email_sends);
    END IF;
END $$;

-- 13. Restore SMS Campaigns table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sms_campaigns_backup') THEN
        TRUNCATE TABLE sms_campaigns CASCADE;
        INSERT INTO sms_campaigns 
        SELECT sms_campaign_id, campaign_id, sms_content, sender_number, created_at, sent_at, total_recipients, metadata
        FROM sms_campaigns_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'SMS Campaigns table restored: % rows', (SELECT COUNT(*) FROM sms_campaigns);
    END IF;
END $$;

-- 14. Restore SMS Sends table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sms_sends_backup') THEN
        TRUNCATE TABLE sms_sends CASCADE;
        INSERT INTO sms_sends 
        SELECT sms_send_id, sms_campaign_id, recipient_phone, recipient_name, sent_at, delivered_at, status, failure_reason, metadata
        FROM sms_sends_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'SMS Sends table restored: % rows', (SELECT COUNT(*) FROM sms_sends);
    END IF;
END $$;

-- 15. Restore Social Accounts table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'social_accounts_backup') THEN
        TRUNCATE TABLE social_accounts CASCADE;
        INSERT INTO social_accounts 
        SELECT account_id, user_id, platform, account_handle, account_name, access_token_encrypted, is_active, created_at, updated_at, metadata
        FROM social_accounts_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Social Accounts table restored: % rows', (SELECT COUNT(*) FROM social_accounts);
    END IF;
END $$;

-- 16. Restore Social Posts table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'social_posts_backup') THEN
        TRUNCATE TABLE social_posts CASCADE;
        INSERT INTO social_posts 
        SELECT post_id, account_id, campaign_id, post_content, post_type, external_post_id, scheduled_at, published_at, created_at, metadata
        FROM social_posts_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Social Posts table restored: % rows', (SELECT COUNT(*) FROM social_posts);
    END IF;
END $$;

-- 17. Restore Social Engagement table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'social_engagement_backup') THEN
        TRUNCATE TABLE social_engagement CASCADE;
        INSERT INTO social_engagement 
        SELECT engagement_id, post_id, engagement_type, engagement_count, recorded_at, metadata
        FROM social_engagement_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Social Engagement table restored: % rows', (SELECT COUNT(*) FROM social_engagement);
    END IF;
END $$;

-- 18. Restore Products table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'products_backup') THEN
        TRUNCATE TABLE products CASCADE;
        INSERT INTO products 
        SELECT product_id, external_product_id, product_title, product_description, product_type, vendor, created_at, updated_at, published_at, status, tags, metadata
        FROM products_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Products table restored: % rows', (SELECT COUNT(*) FROM products);
    END IF;
END $$;

-- 19. Restore Product Variants table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'product_variants_backup') THEN
        TRUNCATE TABLE product_variants CASCADE;
        INSERT INTO product_variants 
        SELECT variant_id, product_id, external_variant_id, variant_title, sku, price, compare_at_price, inventory_quantity, weight, created_at, updated_at, metadata
        FROM product_variants_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Product Variants table restored: % rows', (SELECT COUNT(*) FROM product_variants);
    END IF;
END $$;

-- 20. Restore Daily Analytics table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'daily_analytics_backup') THEN
        TRUNCATE TABLE daily_analytics CASCADE;
        INSERT INTO daily_analytics 
        SELECT analytics_id, date_recorded, entity_type, entity_id, metric_name, metric_value, created_at, metadata
        FROM daily_analytics_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Daily Analytics table restored: % rows', (SELECT COUNT(*) FROM daily_analytics);
    END IF;
END $$;

-- 21. Restore Audit Logs table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs_backup') THEN
        TRUNCATE TABLE audit_logs CASCADE;
        INSERT INTO audit_logs 
        SELECT log_id, table_name, record_id, action, old_values, new_values, changed_by, changed_at, ip_address, user_agent
        FROM audit_logs_backup 
        WHERE backup_created_at IS NOT NULL;
        RAISE NOTICE 'Audit Logs table restored: % rows', (SELECT COUNT(*) FROM audit_logs);
    END IF;
END $$;

-- =============================================
-- RESTORE ANALYTICS EXTENDED TABLES
-- =============================================

-- 22. Restore Brand Assets table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'brand_assets_backup') THEN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'brand_assets') THEN
            TRUNCATE TABLE brand_assets CASCADE;
            INSERT INTO brand_assets 
            SELECT asset_id, asset_name, asset_type, file_id, download_count, created_at, updated_at, is_featured, metadata
            FROM brand_assets_backup 
            WHERE backup_created_at IS NOT NULL;
            RAISE NOTICE 'Brand Assets table restored: % rows', (SELECT COUNT(*) FROM brand_assets);
        END IF;
    END IF;
END $$;

-- 23. Restore Daily Asset Downloads table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'daily_asset_downloads_backup') THEN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'daily_asset_downloads') THEN
            TRUNCATE TABLE daily_asset_downloads CASCADE;
            INSERT INTO daily_asset_downloads 
            SELECT download_id, asset_id, download_date, download_count, unique_downloaders, created_at
            FROM daily_asset_downloads_backup 
            WHERE backup_created_at IS NOT NULL;
            RAISE NOTICE 'Daily Asset Downloads table restored: % rows', (SELECT COUNT(*) FROM daily_asset_downloads);
        END IF;
    END IF;
END $$;

-- 24. Restore Retailer Asset Activity table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'retailer_asset_activity_backup') THEN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'retailer_asset_activity') THEN
            TRUNCATE TABLE retailer_asset_activity CASCADE;
            INSERT INTO retailer_asset_activity 
            SELECT activity_id, retailer_id, asset_id, activity_type, activity_date, unique_files_count, created_at
            FROM retailer_asset_activity_backup 
            WHERE backup_created_at IS NOT NULL;
            RAISE NOTICE 'Retailer Asset Activity table restored: % rows', (SELECT COUNT(*) FROM retailer_asset_activity);
        END IF;
    END IF;
END $$;

-- 25. Restore Campaign Templates table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'campaign_templates_backup') THEN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'campaign_templates') THEN
            TRUNCATE TABLE campaign_templates CASCADE;
            INSERT INTO campaign_templates 
            SELECT template_id, template_name, template_type, template_content, created_by_user_id, created_at, updated_at, is_active, unique_retailers_count, unique_recipients_count, conversion_rate, metadata
            FROM campaign_templates_backup 
            WHERE backup_created_at IS NOT NULL;
            RAISE NOTICE 'Campaign Templates table restored: % rows', (SELECT COUNT(*) FROM campaign_templates);
        END IF;
    END IF;
END $$;

-- 26. Restore Template Retailer Usage table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'template_retailer_usage_backup') THEN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'template_retailer_usage') THEN
            TRUNCATE TABLE template_retailer_usage CASCADE;
            INSERT INTO template_retailer_usage 
            SELECT usage_id, template_id, retailer_id, retailer_name, email_response_time_hours, social_response_time_hours, social_post_frequency_per_week, last_active_date, created_at, updated_at
            FROM template_retailer_usage_backup 
            WHERE backup_created_at IS NOT NULL;
            RAISE NOTICE 'Template Retailer Usage table restored: % rows', (SELECT COUNT(*) FROM template_retailer_usage);
        END IF;
    END IF;
END $$;

-- 27. Restore Watch Models table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'watch_models_backup') THEN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'watch_models') THEN
            TRUNCATE TABLE watch_models CASCADE;
            INSERT INTO watch_models 
            SELECT model_id, model_name, collection_name, size, gender, material, mpn, created_at, updated_at, is_active, metadata
            FROM watch_models_backup 
            WHERE backup_created_at IS NOT NULL;
            RAISE NOTICE 'Watch Models table restored: % rows', (SELECT COUNT(*) FROM watch_models);
        END IF;
    END IF;
END $$;

-- 28. Restore Wish List Items table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wish_list_items_backup') THEN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'wish_list_items') THEN
            TRUNCATE TABLE wish_list_items CASCADE;
            INSERT INTO wish_list_items 
            SELECT wish_id, model_id, retailer_id, created_at, updated_at
            FROM wish_list_items_backup 
            WHERE backup_created_at IS NOT NULL;
            RAISE NOTICE 'Wish List Items table restored: % rows', (SELECT COUNT(*) FROM wish_list_items);
        END IF;
    END IF;
END $$;

-- 29. Restore Regional Wish Lists table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'regional_wish_lists_backup') THEN
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'regional_wish_lists') THEN
            TRUNCATE TABLE regional_wish_lists CASCADE;
            INSERT INTO regional_wish_lists 
            SELECT regional_wish_id, model_id, region, wish_count, rank_in_region, created_at, updated_at
            FROM regional_wish_lists_backup 
            WHERE backup_created_at IS NOT NULL;
            RAISE NOTICE 'Regional Wish Lists table restored: % rows', (SELECT COUNT(*) FROM regional_wish_lists);
        END IF;
    END IF;
END $$;

-- Re-enable triggers
SET session_replication_role = DEFAULT;

-- =============================================
-- POST-RESTORATION VERIFICATION
-- =============================================

-- Create restoration summary
DROP TABLE IF EXISTS restoration_summary CASCADE;
CREATE TABLE restoration_summary (
    table_name TEXT,
    restored_rows BIGINT,
    restoration_status TEXT,
    restored_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert restoration summary for core tables
INSERT INTO restoration_summary (table_name, restored_rows, restoration_status)
VALUES 
    ('users', (SELECT COUNT(*) FROM users), 'COMPLETED'),
    ('files', (SELECT COUNT(*) FROM files), 'COMPLETED'),
    ('file_actions', (SELECT COUNT(*) FROM file_actions), 'COMPLETED'),
    ('campaigns', (SELECT COUNT(*) FROM campaigns), 'COMPLETED'),
    ('templates', (SELECT COUNT(*) FROM templates), 'COMPLETED'),
    ('sessions', (SELECT COUNT(*) FROM sessions), 'COMPLETED'),
    ('collections', (SELECT COUNT(*) FROM collections), 'COMPLETED'),
    ('geography', (SELECT COUNT(*) FROM geography), 'COMPLETED'),
    ('devices', (SELECT COUNT(*) FROM devices), 'COMPLETED');

-- Update backup metadata to indicate restoration
UPDATE backup_metadata 
SET backup_description = backup_description || ' [RESTORED ON ' || NOW() || ']'
WHERE backup_id = (SELECT backup_id FROM backup_metadata ORDER BY backup_created_at DESC LIMIT 1);

-- Commit the transaction
COMMIT;

-- =============================================
-- RESTORATION COMPLETION
-- =============================================

-- Display restoration summary
SELECT 
    'Database restoration completed successfully at ' || NOW() as status,
    SUM(restored_rows) || ' total rows restored' as total_restored
FROM restoration_summary;

-- Display detailed restoration results
SELECT 
    table_name,
    restored_rows,
    restoration_status,
    restored_at
FROM restoration_summary
ORDER BY table_name;

-- Display backup information
SELECT 
    'Restored from backup:' as info,
    backup_description,
    'Created at: ' || backup_created_at as backup_time
FROM backup_metadata 
ORDER BY backup_created_at DESC 
LIMIT 1;

RAISE NOTICE 'Database has been successfully restored to the state before dummy data insertion.';
RAISE NOTICE 'All original data and settings have been recovered.'; 