-- Comprehensive cleanup for Brand Campaign Dashboard objects
-- Run this first if you encounter any conflicts

-- =====================================================
-- COMPREHENSIVE CLEANUP SCRIPT
-- =====================================================

-- Drop all possible views (regular and materialized)
DROP MATERIALIZED VIEW IF EXISTS campaign_performance_summary CASCADE;
DROP VIEW IF EXISTS campaign_performance_summary CASCADE;
DROP MATERIALIZED VIEW IF EXISTS brand_campaign_dashboard CASCADE;
DROP VIEW IF EXISTS brand_campaign_dashboard CASCADE;

-- Drop all functions
DROP FUNCTION IF EXISTS get_brand_campaign_cards(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_brand_campaign_cards() CASCADE;
DROP FUNCTION IF EXISTS get_campaign_detailed_metrics(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_campaign_duration() CASCADE;
DROP FUNCTION IF EXISTS update_conversion_rates() CASCADE;

-- Drop all triggers
DROP TRIGGER IF EXISTS trigger_update_campaign_duration ON brand_campaign_cards CASCADE;
DROP TRIGGER IF EXISTS trigger_update_conversion_rates ON campaign_detailed_metrics CASCADE;

-- Drop all tables (in reverse dependency order)
DROP TABLE IF EXISTS campaign_insights CASCADE;
DROP TABLE IF EXISTS campaign_daily_metrics CASCADE;
DROP TABLE IF EXISTS campaign_retailer_summary CASCADE;
DROP TABLE IF EXISTS campaign_platform_performance CASCADE;
DROP TABLE IF EXISTS campaign_detailed_metrics CASCADE;
DROP TABLE IF EXISTS brand_campaign_cards CASCADE;

-- Drop any indexes that might remain
DROP INDEX IF EXISTS idx_brand_campaign_cards_brand_id CASCADE;
DROP INDEX IF EXISTS idx_brand_campaign_cards_status CASCADE;
DROP INDEX IF EXISTS idx_brand_campaign_cards_type CASCADE;
DROP INDEX IF EXISTS idx_brand_campaign_cards_dates CASCADE;
DROP INDEX IF EXISTS idx_brand_campaign_cards_performance CASCADE;
DROP INDEX IF EXISTS idx_campaign_platform_performance_campaign CASCADE;
DROP INDEX IF EXISTS idx_campaign_platform_performance_platform CASCADE;
DROP INDEX IF EXISTS idx_campaign_platform_performance_date CASCADE;
DROP INDEX IF EXISTS idx_campaign_daily_metrics_campaign CASCADE;
DROP INDEX IF EXISTS idx_campaign_daily_metrics_date CASCADE;

-- Success message
SELECT 'All Brand Campaign Dashboard objects cleaned up successfully!' as status;