-- =============================================
-- COMPLETE PRODUCTION SUPABASE SETUP WITH ANALYTICS
-- Run this entire script in your Supabase SQL Editor
-- This includes all analytics tables and views needed for the dashboard
-- =============================================

-- Step 1: Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Step 2: Create core tables from 001_initial_schema.sql

-- Users table (updated schema)
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) DEFAULT 'retailer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table
CREATE TABLE IF NOT EXISTS files (
    file_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT,
    file_path TEXT,
    created_by_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'
);

-- Step 3: Analytics Extended Tables from 008_analytics_extended_data.sql

-- Brand assets table
CREATE TABLE IF NOT EXISTS brand_assets (
    asset_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_name VARCHAR(500) NOT NULL,
    asset_type VARCHAR(50) NOT NULL, -- 'Image', 'Video', 'PDF', 'Design File', 'Presentation'
    file_id UUID REFERENCES files(file_id) ON DELETE CASCADE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'
);

-- Daily asset downloads tracking
CREATE TABLE IF NOT EXISTS daily_asset_downloads (
    download_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID NOT NULL REFERENCES brand_assets(asset_id) ON DELETE CASCADE,
    download_date DATE NOT NULL,
    download_count INTEGER DEFAULT 1,
    unique_downloaders INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(asset_id, download_date)
);

-- Retailer asset activity tracking
CREATE TABLE IF NOT EXISTS retailer_asset_activity (
    activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES brand_assets(asset_id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'download', 'view', 'share'
    activity_date DATE NOT NULL,
    unique_files_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(retailer_id, asset_id, activity_type, activity_date)
);

-- Campaign templates table
CREATE TABLE IF NOT EXISTS campaign_templates (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(100) NOT NULL, -- 'Email', 'SMS', 'Social Media', 'Print'
    template_content TEXT,
    created_by_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    unique_retailers_count INTEGER DEFAULT 0,
    unique_recipients_count INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    metadata JSONB DEFAULT '{}'
);

-- Template retailer usage tracking
CREATE TABLE IF NOT EXISTS template_retailer_usage (
    usage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES campaign_templates(template_id) ON DELETE CASCADE,
    retailer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    retailer_name VARCHAR(255) NOT NULL,
    email_response_time_hours DECIMAL(4,1) DEFAULT 0.0,
    social_response_time_hours DECIMAL(4,1) DEFAULT 0.0,
    social_post_frequency_per_week DECIMAL(3,1) DEFAULT 0.0,
    last_active_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(template_id, retailer_id)
);

-- Watch models table
CREATE TABLE IF NOT EXISTS watch_models (
    model_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(255) NOT NULL,
    collection_name VARCHAR(255) NOT NULL,
    size VARCHAR(50),
    gender VARCHAR(20),
    material VARCHAR(255),
    mpn VARCHAR(100) UNIQUE NOT NULL, -- Manufacturer Part Number
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'
);

-- Wish list items
CREATE TABLE IF NOT EXISTS wish_list_items (
    wish_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES watch_models(model_id) ON DELETE CASCADE,
    retailer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(model_id, retailer_id)
);

-- Regional wish lists
CREATE TABLE IF NOT EXISTS regional_wish_lists (
    regional_wish_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES watch_models(model_id) ON DELETE CASCADE,
    region VARCHAR(100) NOT NULL,
    wish_count INTEGER DEFAULT 0,
    rank_in_region INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(model_id, region)
);

-- Step 4: Create Analytics Views

-- View for top downloaded assets
CREATE OR REPLACE VIEW top_downloaded_assets AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY ba.download_count DESC) as rank,
    ba.asset_name,
    ba.asset_type,
    ba.download_count,
    ba.created_at
FROM brand_assets ba
WHERE ba.download_count > 0
ORDER BY ba.download_count DESC
LIMIT 10;

-- View for top active retailers (assets)
CREATE OR REPLACE VIEW top_active_retailers_assets AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY COUNT(DISTINCT raa.asset_id) DESC, SUM(raa.unique_files_count) DESC) as rank,
    u.user_name as retailer_name,
    COUNT(DISTINCT raa.asset_id) as unique_files,
    SUM(raa.unique_files_count) as total_activity,
    MAX(raa.activity_date) as last_activity_date
FROM retailer_asset_activity raa
JOIN users u ON raa.retailer_id = u.user_id
WHERE raa.activity_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY u.user_id, u.user_name
ORDER BY unique_files DESC, total_activity DESC
LIMIT 10;

-- View for top wish list items
CREATE OR REPLACE VIEW top_wish_list_items AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY COUNT(wli.wish_id) DESC) as rank,
    wm.model_name,
    wm.collection_name,
    wm.size,
    wm.gender,
    wm.material,
    wm.mpn,
    COUNT(wli.wish_id) as total_wish_count,
    COUNT(DISTINCT wli.retailer_id) as unique_retailers
FROM wish_list_items wli
JOIN watch_models wm ON wli.model_id = wm.model_id
WHERE wm.is_active = true
GROUP BY wm.model_id, wm.model_name, wm.collection_name, wm.size, wm.gender, wm.material, wm.mpn
ORDER BY total_wish_count DESC
LIMIT 10;

-- View for top campaign templates
CREATE OR REPLACE VIEW top_campaign_templates AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY ct.unique_retailers_count DESC, ct.unique_recipients_count DESC) as rank,
    ct.template_name,
    ct.unique_retailers_count,
    ct.unique_recipients_count
FROM campaign_templates ct
WHERE ct.is_active = true
ORDER BY ct.unique_retailers_count DESC, ct.unique_recipients_count DESC
LIMIT 10;

-- Step 5: Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_brand_assets_type ON brand_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_brand_assets_downloads ON brand_assets(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_daily_downloads_date ON daily_asset_downloads(download_date DESC);
CREATE INDEX IF NOT EXISTS idx_retailer_activity_type_date ON retailer_asset_activity(activity_type, activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_template_usage_active_date ON template_retailer_usage(last_active_date DESC) WHERE last_active_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_wish_list_region_rank ON regional_wish_lists(region, rank_in_region);
CREATE INDEX IF NOT EXISTS idx_watch_models_collection ON watch_models(collection_name);
CREATE INDEX IF NOT EXISTS idx_watch_models_mpn ON watch_models(mpn);
CREATE INDEX IF NOT EXISTS idx_watch_models_active ON watch_models(is_active);
CREATE INDEX IF NOT EXISTS idx_regional_wishes_region ON regional_wish_lists(region);
CREATE INDEX IF NOT EXISTS idx_regional_wishes_rank ON regional_wish_lists(rank_in_region);
CREATE INDEX IF NOT EXISTS idx_regional_wishes_model ON regional_wish_lists(model_id);

-- Step 6: Insert Sample Data (from 009_analytics_extended_dummy_data.sql)

-- Insert sample users
INSERT INTO users (user_id, user_email, user_name, user_type, created_at, last_login_at, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@rolex.com', 'Admin User', 'admin', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day', true),
('550e8400-e29b-41d4-a716-446655440002', 'retailer1@example.com', 'Fashion Forward', 'retailer', NOW() - INTERVAL '25 days', NOW() - INTERVAL '2 days', true),
('550e8400-e29b-41d4-a716-446655440003', 'retailer2@example.com', 'Style Central', 'retailer', NOW() - INTERVAL '20 days', NOW() - INTERVAL '1 day', true),
('550e8400-e29b-41d4-a716-446655440004', 'retailer3@example.com', 'Trend Setters', 'retailer', NOW() - INTERVAL '15 days', NOW() - INTERVAL '3 days', true),
('550e8400-e29b-41d4-a716-446655440005', 'retailer4@example.com', 'Urban Chic', 'retailer', NOW() - INTERVAL '10 days', NOW() - INTERVAL '1 day', true)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample files
INSERT INTO files (file_id, file_name, file_type, file_size, created_by_user_id) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Daytona_Launch_Video.mp4', 'Video', 15728640, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440002', 'Explorer_Heritage_Lookbook.pdf', 'PDF', 2048576, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440003', 'Rolex_Oyster_Perpetual_Banner.jpg', 'Image', 1048576, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440004', 'GMT_Master_II_Social_Post.png', 'Image', 524288, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440005', 'YachtMaster_Summer_Promo.gif', 'Design File', 2097152, '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (file_id) DO NOTHING;

-- Insert brand assets
INSERT INTO brand_assets (asset_id, asset_name, asset_type, file_id, download_count, is_featured) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Daytona_Launch_Video.mp4', 'Video', '770e8400-e29b-41d4-a716-446655440001', 152, true),
('880e8400-e29b-41d4-a716-446655440002', 'Explorer_Heritage_Lookbook.pdf', 'PDF', '770e8400-e29b-41d4-a716-446655440002', 98, false),
('880e8400-e29b-41d4-a716-446655440003', 'Rolex_Oyster_Perpetual_Banner.jpg', 'Image', '770e8400-e29b-41d4-a716-446655440003', 94, true),
('880e8400-e29b-41d4-a716-446655440004', 'GMT_Master_II_Social_Post.png', 'Image', '770e8400-e29b-41d4-a716-446655440004', 87, false),
('880e8400-e29b-41d4-a716-446655440005', 'YachtMaster_Summer_Promo.gif', 'Design File', '770e8400-e29b-41d4-a716-446655440005', 79, false)
ON CONFLICT (asset_id) DO NOTHING;

-- Insert watch models
INSERT INTO watch_models (model_id, model_name, collection_name, size, gender, material, mpn) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Submariner Date', 'Professional', '41mm', 'Unisex', 'Oystersteel', '126610LN'),
('990e8400-e29b-41d4-a716-446655440002', 'GMT-Master II', 'Professional', '40mm', 'Unisex', 'Oystersteel', '126710BLRO'),
('990e8400-e29b-41d4-a716-446655440003', 'Daytona', 'Professional', '40mm', 'Unisex', 'Oystersteel', '116500LN'),
('990e8400-e29b-41d4-a716-446655440004', 'Datejust 36', 'Classic', '36mm', 'Unisex', 'Oystersteel', '126234'),
('990e8400-e29b-41d4-a716-446655440005', 'Day-Date 40', 'Prestige', '40mm', 'Unisex', 'Yellow Gold', '228238')
ON CONFLICT (model_id) DO NOTHING;

-- Insert retailer asset activity
INSERT INTO retailer_asset_activity (retailer_id, asset_id, activity_type, activity_date, unique_files_count)
SELECT 
    (ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005'])[floor(random() * 4 + 1)]::UUID,
    (ARRAY['880e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440005'])[floor(random() * 5 + 1)]::UUID,
    'download',
    CURRENT_DATE - (random() * 30)::INTEGER,
    floor(random() * 5 + 1)::INTEGER
FROM generate_series(1, 100)
ON CONFLICT (retailer_id, asset_id, activity_type, activity_date) DO NOTHING;

-- Insert wish list items
INSERT INTO wish_list_items (model_id, retailer_id)
SELECT 
    (ARRAY['990e8400-e29b-41d4-a716-446655440001', '990e8400-e29b-41d4-a716-446655440002', '990e8400-e29b-41d4-a716-446655440003', '990e8400-e29b-41d4-a716-446655440004', '990e8400-e29b-41d4-a716-446655440005'])[floor(random() * 5 + 1)]::UUID,
    (ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440005'])[floor(random() * 4 + 1)]::UUID
FROM generate_series(1, 50)
ON CONFLICT (model_id, retailer_id) DO NOTHING;

-- Insert regional wish lists
INSERT INTO regional_wish_lists (model_id, region, wish_count, rank_in_region)
SELECT 
    wm.model_id,
    region_data.region,
    region_data.wish_count,
    region_data.rank_in_region
FROM (
    VALUES 
    ('126610LN', 'northeast', 23, 1),
    ('126710BLRO', 'northeast', 19, 2),
    ('116500LN', 'northeast', 18, 3),
    ('126234', 'southeast', 21, 1),
    ('228238', 'southeast', 17, 2),
    ('126610LN', 'midwest', 15, 1),
    ('126710BLRO', 'west', 25, 1)
) AS region_data(mpn, region, wish_count, rank_in_region)
JOIN watch_models wm ON wm.mpn = region_data.mpn
ON CONFLICT (model_id, region) DO NOTHING;

-- Insert campaign templates
INSERT INTO campaign_templates (template_id, template_name, template_type, unique_retailers_count, unique_recipients_count, conversion_rate) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', 'New Collection Launch', 'Email', 45, 1250, 12.5),
('aa0e8400-e29b-41d4-a716-446655440002', 'Holiday Special Offer', 'Email', 38, 980, 15.2),
('aa0e8400-e29b-41d4-a716-446655440003', 'Product Showcase', 'Social Media', 52, 2100, 8.7),
('aa0e8400-e29b-41d4-a716-446655440004', 'VIP Event Invitation', 'SMS', 25, 450, 22.1),
('aa0e8400-e29b-41d4-a716-446655440005', 'Brand Story Campaign', 'Print', 18, 320, 18.9)
ON CONFLICT (template_id) DO NOTHING;

-- Step 7: Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_asset_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_asset_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_retailer_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE wish_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_wish_lists ENABLE ROW LEVEL SECURITY;

-- Create basic policies for authenticated access
CREATE POLICY "Allow read access for authenticated users" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON files FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON brand_assets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON daily_asset_downloads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON retailer_asset_activity FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON campaign_templates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON template_retailer_usage FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON watch_models FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON wish_list_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON regional_wish_lists FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role full access
CREATE POLICY "Service role has full access" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON files FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON brand_assets FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON daily_asset_downloads FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON retailer_asset_activity FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON campaign_templates FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON template_retailer_usage FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON watch_models FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON wish_list_items FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON regional_wish_lists FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- SETUP COMPLETE!
-- Your production database now includes:
-- - Complete analytics schema
-- - All required tables and views
-- - Sample data for testing
-- - Performance indexes
-- - Security policies
-- =============================================