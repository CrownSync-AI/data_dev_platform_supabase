-- Drop Existing Objects
-- Run this first to clean up any existing objects

-- Drop functions with specific signatures
DROP FUNCTION IF EXISTS get_top_performing_with_platform_breakdown(character varying, integer) CASCADE;
DROP FUNCTION IF EXISTS get_platform_metrics_breakdown(date, date, uuid) CASCADE;
DROP FUNCTION IF EXISTS generate_platform_trends() CASCADE;

-- Drop policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view platform trends" ON platform_trends;
EXCEPTION
    WHEN undefined_table THEN
        -- Table doesn't exist yet, that's fine
        NULL;
    WHEN undefined_object THEN
        -- Policy doesn't exist, that's fine
        NULL;
END $$;

-- Drop views
DROP VIEW IF EXISTS platform_trends_chart_data CASCADE;
DROP MATERIALIZED VIEW IF EXISTS all_platform_metrics_cache CASCADE;
DROP VIEW IF EXISTS top_performing_retailers_cross_platform CASCADE;
DROP VIEW IF EXISTS top_performing_campaigns_cross_platform CASCADE;
DROP VIEW IF EXISTS all_platform_summary CASCADE;

SELECT 'Cleanup completed' as status;