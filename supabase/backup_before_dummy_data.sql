-- =============================================
-- COMPLETE DATABASE BACKUP SCRIPT
-- Backup created before adding dummy data to SupaBase
-- Generated on: $(date)
-- =============================================

-- Start transaction for consistency
BEGIN;

-- =============================================
-- 1. BACKUP ALL EXISTING DATA
-- =============================================

-- Users table backup
DROP TABLE IF EXISTS users_backup CASCADE;
CREATE TABLE users_backup AS 
SELECT * FROM users;

-- Add metadata to backup
ALTER TABLE users_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
INSERT INTO users_backup SELECT *, NOW() FROM users WHERE NOT EXISTS (SELECT 1 FROM users_backup);

-- Files table backup
DROP TABLE IF EXISTS files_backup CASCADE;
CREATE TABLE files_backup AS 
SELECT * FROM files;
ALTER TABLE files_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- File actions backup
DROP TABLE IF EXISTS file_actions_backup CASCADE;
CREATE TABLE file_actions_backup AS 
SELECT * FROM file_actions;
ALTER TABLE file_actions_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Campaigns table backup
DROP TABLE IF EXISTS campaigns_backup CASCADE;
CREATE TABLE campaigns_backup AS 
SELECT * FROM campaigns;
ALTER TABLE campaigns_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Templates table backup
DROP TABLE IF EXISTS templates_backup CASCADE;
CREATE TABLE templates_backup AS 
SELECT * FROM templates;
ALTER TABLE templates_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Sessions table backup
DROP TABLE IF EXISTS sessions_backup CASCADE;
CREATE TABLE sessions_backup AS 
SELECT * FROM sessions;
ALTER TABLE sessions_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Collections table backup
DROP TABLE IF EXISTS collections_backup CASCADE;
CREATE TABLE collections_backup AS 
SELECT * FROM collections;
ALTER TABLE collections_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Collection files junction table backup
DROP TABLE IF EXISTS collection_files_backup CASCADE;
CREATE TABLE collection_files_backup AS 
SELECT * FROM collection_files;
ALTER TABLE collection_files_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Geography table backup
DROP TABLE IF EXISTS geography_backup CASCADE;
CREATE TABLE geography_backup AS 
SELECT * FROM geography;
ALTER TABLE geography_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Devices table backup
DROP TABLE IF EXISTS devices_backup CASCADE;
CREATE TABLE devices_backup AS 
SELECT * FROM devices;
ALTER TABLE devices_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Email campaigns backup
DROP TABLE IF EXISTS email_campaigns_backup CASCADE;
CREATE TABLE email_campaigns_backup AS 
SELECT * FROM email_campaigns;
ALTER TABLE email_campaigns_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Email sends backup
DROP TABLE IF EXISTS email_sends_backup CASCADE;
CREATE TABLE email_sends_backup AS 
SELECT * FROM email_sends;
ALTER TABLE email_sends_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- SMS campaigns backup
DROP TABLE IF EXISTS sms_campaigns_backup CASCADE;
CREATE TABLE sms_campaigns_backup AS 
SELECT * FROM sms_campaigns;
ALTER TABLE sms_campaigns_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- SMS sends backup
DROP TABLE IF EXISTS sms_sends_backup CASCADE;
CREATE TABLE sms_sends_backup AS 
SELECT * FROM sms_sends;
ALTER TABLE sms_sends_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Social accounts backup
DROP TABLE IF EXISTS social_accounts_backup CASCADE;
CREATE TABLE social_accounts_backup AS 
SELECT * FROM social_accounts;
ALTER TABLE social_accounts_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Social posts backup
DROP TABLE IF EXISTS social_posts_backup CASCADE;
CREATE TABLE social_posts_backup AS 
SELECT * FROM social_posts;
ALTER TABLE social_posts_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Social engagement backup
DROP TABLE IF EXISTS social_engagement_backup CASCADE;
CREATE TABLE social_engagement_backup AS 
SELECT * FROM social_engagement;
ALTER TABLE social_engagement_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Products backup
DROP TABLE IF EXISTS products_backup CASCADE;
CREATE TABLE products_backup AS 
SELECT * FROM products;
ALTER TABLE products_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Product variants backup
DROP TABLE IF EXISTS product_variants_backup CASCADE;
CREATE TABLE product_variants_backup AS 
SELECT * FROM product_variants;
ALTER TABLE product_variants_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Daily analytics backup
DROP TABLE IF EXISTS daily_analytics_backup CASCADE;
CREATE TABLE daily_analytics_backup AS 
SELECT * FROM daily_analytics;
ALTER TABLE daily_analytics_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Audit logs backup
DROP TABLE IF EXISTS audit_logs_backup CASCADE;
CREATE TABLE audit_logs_backup AS 
SELECT * FROM audit_logs;
ALTER TABLE audit_logs_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Analytics extended tables backup (if they exist)
DROP TABLE IF EXISTS brand_assets_backup CASCADE;
CREATE TABLE brand_assets_backup AS 
SELECT * FROM brand_assets;
ALTER TABLE brand_assets_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

DROP TABLE IF EXISTS daily_asset_downloads_backup CASCADE;
CREATE TABLE daily_asset_downloads_backup AS 
SELECT * FROM daily_asset_downloads;
ALTER TABLE daily_asset_downloads_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

DROP TABLE IF EXISTS retailer_asset_activity_backup CASCADE;
CREATE TABLE retailer_asset_activity_backup AS 
SELECT * FROM retailer_asset_activity;
ALTER TABLE retailer_asset_activity_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

DROP TABLE IF EXISTS campaign_templates_backup CASCADE;
CREATE TABLE campaign_templates_backup AS 
SELECT * FROM campaign_templates;
ALTER TABLE campaign_templates_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

DROP TABLE IF EXISTS template_retailer_usage_backup CASCADE;
CREATE TABLE template_retailer_usage_backup AS 
SELECT * FROM template_retailer_usage;
ALTER TABLE template_retailer_usage_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

DROP TABLE IF EXISTS watch_models_backup CASCADE;
CREATE TABLE watch_models_backup AS 
SELECT * FROM watch_models;
ALTER TABLE watch_models_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

DROP TABLE IF EXISTS wish_list_items_backup CASCADE;
CREATE TABLE wish_list_items_backup AS 
SELECT * FROM wish_list_items;
ALTER TABLE wish_list_items_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

DROP TABLE IF EXISTS regional_wish_lists_backup CASCADE;
CREATE TABLE regional_wish_lists_backup AS 
SELECT * FROM regional_wish_lists;
ALTER TABLE regional_wish_lists_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- =============================================
-- 2. BACKUP DATABASE SCHEMA INFORMATION
-- =============================================

-- Create backup info table
DROP TABLE IF EXISTS backup_metadata CASCADE;
CREATE TABLE backup_metadata (
    backup_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    backup_description TEXT,
    database_version TEXT,
    total_tables_backed_up INTEGER,
    total_rows_backed_up BIGINT,
    backup_size_estimate TEXT,
    backed_up_by TEXT DEFAULT CURRENT_USER
);

-- Insert backup metadata
INSERT INTO backup_metadata (
    backup_description, 
    database_version, 
    total_tables_backed_up,
    backup_size_estimate,
    backed_up_by
) VALUES (
    'Complete database backup before adding dummy data',
    (SELECT version()),
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name LIKE '%_backup'),
    'Estimated based on current data volume',
    CURRENT_USER
);

-- =============================================
-- 3. BACKUP CUSTOM TYPES
-- =============================================

-- Store enum types definitions
DROP TABLE IF EXISTS enum_types_backup CASCADE;
CREATE TABLE enum_types_backup AS
SELECT 
    t.typname as enum_name,
    string_agg(e.enumlabel, ',' ORDER BY e.enumsortorder) as enum_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE t.typname IN (
    'user_type_enum', 'file_type_enum', 'action_type_enum', 
    'campaign_status_enum', 'template_type_enum', 'social_platform_enum',
    'email_status_enum', 'sms_status_enum'
)
GROUP BY t.typname;

ALTER TABLE enum_types_backup ADD COLUMN backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- =============================================
-- 4. BACKUP VIEWS DEFINITIONS
-- =============================================

-- Store view definitions
DROP TABLE IF EXISTS views_backup CASCADE;
CREATE TABLE views_backup (
    view_name TEXT,
    view_definition TEXT,
    backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO views_backup (view_name, view_definition)
SELECT 
    table_name,
    view_definition
FROM information_schema.views 
WHERE table_schema = 'public';

-- =============================================
-- 5. BACKUP FUNCTION DEFINITIONS
-- =============================================

-- Store function definitions
DROP TABLE IF EXISTS functions_backup CASCADE;
CREATE TABLE functions_backup (
    function_name TEXT,
    function_definition TEXT,
    function_language TEXT,
    backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO functions_backup (function_name, function_definition, function_language)
SELECT 
    p.proname,
    pg_get_functiondef(p.oid),
    l.lanname
FROM pg_proc p
JOIN pg_language l ON p.prolang = l.oid
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname NOT LIKE 'pg_%';

-- =============================================
-- 6. BACKUP TRIGGERS INFORMATION
-- =============================================

-- Store trigger definitions
DROP TABLE IF EXISTS triggers_backup CASCADE;
CREATE TABLE triggers_backup (
    trigger_name TEXT,
    table_name TEXT,
    trigger_definition TEXT,
    backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO triggers_backup (trigger_name, table_name, trigger_definition)
SELECT 
    t.tgname,
    c.relname,
    pg_get_triggerdef(t.oid)
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
AND t.tgname NOT LIKE 'pg_%';

-- =============================================
-- 7. BACKUP INDEXES INFORMATION
-- =============================================

-- Store index definitions
DROP TABLE IF EXISTS indexes_backup CASCADE;
CREATE TABLE indexes_backup (
    index_name TEXT,
    table_name TEXT,
    index_definition TEXT,
    backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO indexes_backup (index_name, table_name, index_definition)
SELECT 
    i.indexname,
    i.tablename,
    i.indexdef
FROM pg_indexes i
WHERE i.schemaname = 'public';

-- =============================================
-- 8. BACKUP RLS POLICIES
-- =============================================

-- Store RLS policies
DROP TABLE IF EXISTS rls_policies_backup CASCADE;
CREATE TABLE rls_policies_backup (
    table_name TEXT,
    policy_name TEXT,
    policy_definition TEXT,
    backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO rls_policies_backup (table_name, policy_name, policy_definition)
SELECT 
    schemaname||'.'||tablename as table_name,
    policyname,
    'POLICY: ' || policyname || ' ON ' || schemaname||'.'||tablename || 
    CASE WHEN cmd IS NOT NULL THEN ' FOR ' || cmd ELSE '' END ||
    CASE WHEN permissive IS NOT NULL THEN ' ' || CASE WHEN permissive THEN 'PERMISSIVE' ELSE 'RESTRICTIVE' END ELSE '' END ||
    CASE WHEN roles IS NOT NULL THEN ' TO ' || array_to_string(roles, ', ') ELSE '' END ||
    CASE WHEN qual IS NOT NULL THEN ' USING (' || qual || ')' ELSE '' END ||
    CASE WHEN with_check IS NOT NULL THEN ' WITH CHECK (' || with_check || ')' ELSE '' END as policy_definition
FROM pg_policies
WHERE schemaname = 'public';

-- =============================================
-- 9. BACKUP TABLE CONSTRAINTS
-- =============================================

-- Store table constraints
DROP TABLE IF EXISTS constraints_backup CASCADE;
CREATE TABLE constraints_backup (
    table_name TEXT,
    constraint_name TEXT,
    constraint_type TEXT,
    constraint_definition TEXT,
    backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO constraints_backup (table_name, constraint_name, constraint_type, constraint_definition)
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    CASE 
        WHEN tc.constraint_type = 'FOREIGN KEY' THEN
            'FOREIGN KEY (' || kcu.column_name || ') REFERENCES ' || 
            ccu.table_name || '(' || ccu.column_name || ')'
        WHEN tc.constraint_type = 'PRIMARY KEY' THEN
            'PRIMARY KEY (' || kcu.column_name || ')'
        WHEN tc.constraint_type = 'UNIQUE' THEN
            'UNIQUE (' || kcu.column_name || ')'
        ELSE tc.constraint_type
    END
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name 
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name 
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public';

-- =============================================
-- 10. BACKUP EXTENSIONS
-- =============================================

-- Store installed extensions
DROP TABLE IF EXISTS extensions_backup CASCADE;
CREATE TABLE extensions_backup (
    extension_name TEXT,
    extension_version TEXT,
    backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO extensions_backup (extension_name, extension_version)
SELECT 
    extname,
    extversion
FROM pg_extension;

-- =============================================
-- 11. CREATE BACKUP SUMMARY
-- =============================================

-- Create summary of backup
DROP TABLE IF EXISTS backup_summary CASCADE;
CREATE TABLE backup_summary (
    table_name TEXT,
    row_count BIGINT,
    backup_created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert row counts for all backup tables
INSERT INTO backup_summary (table_name, row_count)
SELECT 
    tablename,
    COALESCE(n_tup_ins - n_tup_del, 0) as estimated_rows
FROM pg_stat_user_tables 
WHERE schemaname = 'public' 
AND tablename LIKE '%_backup';

-- Update backup metadata with total rows
UPDATE backup_metadata 
SET total_rows_backed_up = (SELECT SUM(row_count) FROM backup_summary)
WHERE backup_id = (SELECT backup_id FROM backup_metadata ORDER BY backup_created_at DESC LIMIT 1);

-- =============================================
-- 12. BACKUP VERIFICATION
-- =============================================

-- Create verification table
DROP TABLE IF EXISTS backup_verification CASCADE;
CREATE TABLE backup_verification (
    verification_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    original_table TEXT,
    backup_table TEXT,
    original_count BIGINT,
    backup_count BIGINT,
    verification_status TEXT,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add verification checks (example for key tables)
INSERT INTO backup_verification (original_table, backup_table, original_count, backup_count, verification_status)
SELECT 
    'users' as original_table,
    'users_backup' as backup_table,
    (SELECT COUNT(*) FROM users) as original_count,
    (SELECT COUNT(*) FROM users_backup WHERE backup_created_at IS NOT NULL) as backup_count,
    CASE 
        WHEN (SELECT COUNT(*) FROM users) = (SELECT COUNT(*) FROM users_backup WHERE backup_created_at IS NOT NULL) 
        THEN 'VERIFIED' 
        ELSE 'MISMATCH' 
    END as verification_status
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users')
AND EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users_backup');

-- Complete the transaction
COMMIT;

-- =============================================
-- BACKUP COMPLETION MESSAGE
-- =============================================

-- Display backup summary
SELECT 
    'Backup completed successfully at ' || NOW() as status,
    total_tables_backed_up || ' tables backed up' as tables_info,
    COALESCE(total_rows_backed_up, 0) || ' total rows backed up' as rows_info
FROM backup_metadata 
ORDER BY backup_created_at DESC 
LIMIT 1;

-- Display verification results
SELECT 
    'Verification Results:' as status,
    COUNT(*) FILTER (WHERE verification_status = 'VERIFIED') || ' tables verified successfully' as verified,
    COUNT(*) FILTER (WHERE verification_status = 'MISMATCH') || ' tables with mismatches' as mismatches
FROM backup_verification;

-- =============================================
-- RESTORATION INSTRUCTIONS
-- =============================================

/*
TO RESTORE FROM THIS BACKUP:

1. Restore table data:
   INSERT INTO users SELECT * FROM users_backup WHERE backup_created_at = (SELECT MAX(backup_created_at) FROM users_backup);

2. Restore specific table:
   TRUNCATE TABLE users;
   INSERT INTO users SELECT user_id, user_email, user_name, user_type, created_at, updated_at, last_login_at, is_active, profile_data FROM users_backup;

3. Restore all tables at once:
   Run the restoration script that will be generated separately.

4. Verify restoration:
   SELECT * FROM backup_verification;

Note: This backup preserves all data, schema structure, views, functions, and constraints.
The backup was created before adding dummy data, so restoring will return the database 
to its state before the dummy data insertion.
*/ 