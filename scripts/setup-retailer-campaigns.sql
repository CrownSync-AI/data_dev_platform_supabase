-- Setup Retailer Campaigns Database
-- This script sets up the complete retailer campaigns system
-- Run this in your Supabase SQL editor

-- Step 1: Create the schema
\i supabase/retailer_campaigns_schema.sql

-- Step 2: Insert dummy data
\i supabase/retailer_campaigns_dummy_data.sql

-- Step 3: Verify the setup
SELECT 'Setup Complete!' as status;

-- Verify retailer data
SELECT 
    retailer_name,
    region,
    total_campaigns,
    status
FROM retailers
ORDER BY retailer_name;

-- Verify campaign counts per retailer
SELECT 
    r.retailer_name,
    r.total_campaigns as expected_campaigns,
    COUNT(rc.campaign_id) as actual_campaigns
FROM retailers r
LEFT JOIN retailer_campaigns rc ON r.retailer_id = rc.retailer_id
GROUP BY r.retailer_id, r.retailer_name, r.total_campaigns
ORDER BY r.retailer_name;

-- Sample campaign data for verification
SELECT 
    retailer_name,
    campaign_name,
    campaign_status,
    campaign_type,
    performance_tier,
    trend_direction
FROM retailer_campaign_dashboard
WHERE retailer_id = 'retailer-1'
ORDER BY last_updated DESC
LIMIT 5;