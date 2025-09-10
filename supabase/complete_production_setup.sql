-- =============================================
-- COMPLETE PRODUCTION SUPABASE SETUP
-- Run this entire script in your Supabase SQL Editor
-- =============================================

-- Step 1: Initial Schema (from 001_initial_schema.sql)
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    file_path TEXT,
    file_size BIGINT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Retailers table
CREATE TABLE IF NOT EXISTS retailers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Downloads table
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id),
    user_id UUID REFERENCES users(id),
    retailer_id UUID REFERENCES retailers(id),
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    content TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Template usage table
CREATE TABLE IF NOT EXISTS template_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES templates(id),
    user_id UUID REFERENCES users(id),
    retailer_id UUID REFERENCES retailers(id),
    used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    retailer_id UUID REFERENCES retailers(id),
    template_id UUID REFERENCES templates(id),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wish list items table
CREATE TABLE IF NOT EXISTS wish_list_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255),
    collection VARCHAR(255),
    size VARCHAR(50),
    gender VARCHAR(20),
    material VARCHAR(255),
    mpn VARCHAR(255),
    retailer_id UUID REFERENCES retailers(id),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regional data table
CREATE TABLE IF NOT EXISTS regional_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    region VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    retailer_id UUID REFERENCES retailers(id),
    metric_type VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Analytics Views (from 002_analytics_views.sql)
-- Daily downloads view
CREATE OR REPLACE VIEW daily_downloads AS
SELECT 
    DATE(downloaded_at) as date,
    COUNT(*) as downloads
FROM downloads
GROUP BY DATE(downloaded_at)
ORDER BY date;

-- Asset download stats view
CREATE OR REPLACE VIEW asset_download_stats AS
SELECT 
    a.id,
    a.name,
    a.type,
    COUNT(d.id) as download_count,
    MAX(d.downloaded_at) as last_downloaded
FROM assets a
LEFT JOIN downloads d ON a.id = d.asset_id
GROUP BY a.id, a.name, a.type;

-- Retailer performance view
CREATE OR REPLACE VIEW retailer_performance AS
SELECT 
    r.id,
    r.name,
    COUNT(DISTINCT d.id) as total_downloads,
    COUNT(DISTINCT d.asset_id) as unique_files_downloaded,
    COUNT(DISTINCT c.id) as campaigns_count,
    MAX(d.downloaded_at) as last_activity
FROM retailers r
LEFT JOIN downloads d ON r.id = d.retailer_id
LEFT JOIN campaigns c ON r.id = c.retailer_id
GROUP BY r.id, r.name;

-- Template usage stats view
CREATE OR REPLACE VIEW template_usage_stats AS
SELECT 
    t.id,
    t.name,
    t.type,
    COUNT(tu.id) as usage_count,
    COUNT(DISTINCT tu.retailer_id) as unique_retailers,
    MAX(tu.used_at) as last_used
FROM templates t
LEFT JOIN template_usage tu ON t.id = tu.template_id
GROUP BY t.id, t.name, t.type;

-- Step 3: Insert Sample Data
-- Insert sample users
INSERT INTO users (id, email, name, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@example.com', 'Admin User', 'admin'),
('550e8400-e29b-41d4-a716-446655440002', 'user1@example.com', 'John Doe', 'user'),
('550e8400-e29b-41d4-a716-446655440003', 'user2@example.com', 'Jane Smith', 'user'),
('550e8400-e29b-41d4-a716-446655440004', 'manager@example.com', 'Mike Manager', 'manager')
ON CONFLICT (id) DO NOTHING;

-- Insert sample retailers
INSERT INTO retailers (id, name, email, phone, address) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Fashion Forward', 'contact@fashionforward.com', '+1-555-0101', '123 Fashion Ave, NY'),
('660e8400-e29b-41d4-a716-446655440002', 'Style Central', 'info@stylecentral.com', '+1-555-0102', '456 Style St, CA'),
('660e8400-e29b-41d4-a716-446655440003', 'Trend Setters', 'hello@trendsetters.com', '+1-555-0103', '789 Trend Blvd, TX'),
('660e8400-e29b-41d4-a716-446655440004', 'Urban Chic', 'support@urbanchic.com', '+1-555-0104', '321 Urban Way, FL'),
('660e8400-e29b-41d4-a716-446655440005', 'Classic Wear', 'sales@classicwear.com', '+1-555-0105', '654 Classic Rd, WA')
ON CONFLICT (id) DO NOTHING;

-- Insert sample assets
INSERT INTO assets (id, name, type, file_path, file_size, created_by) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Summer Collection Catalog', 'PDF', '/assets/summer-catalog.pdf', 2048576, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440002', 'Product Images Pack', 'ZIP', '/assets/product-images.zip', 15728640, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440003', 'Brand Guidelines', 'PDF', '/assets/brand-guidelines.pdf', 1048576, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440004', 'Marketing Materials', 'ZIP', '/assets/marketing-pack.zip', 8388608, '550e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440005', 'Size Chart Template', 'PDF', '/assets/size-chart.pdf', 524288, '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

-- Insert sample templates
INSERT INTO templates (id, name, type, content, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Email Newsletter Template', 'Email', 'Newsletter content here', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440002', 'Product Launch Template', 'Email', 'Product launch content', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440003', 'Social Media Template', 'Social', 'Social media content', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440004', 'Campaign Template', 'Campaign', 'Campaign content', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;

-- Insert sample downloads (last 30 days)
INSERT INTO downloads (asset_id, user_id, retailer_id, downloaded_at)
SELECT 
    (ARRAY['770e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440005'])[floor(random() * 5 + 1)]::UUID,
    (ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'])[floor(random() * 2 + 1)]::UUID,
    (ARRAY['660e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005'])[floor(random() * 5 + 1)]::UUID,
    NOW() - (random() * INTERVAL '30 days')
FROM generate_series(1, 150);

-- Insert sample template usage
INSERT INTO template_usage (template_id, user_id, retailer_id, used_at)
SELECT 
    (ARRAY['880e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004'])[floor(random() * 4 + 1)]::UUID,
    (ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'])[floor(random() * 2 + 1)]::UUID,
    (ARRAY['660e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005'])[floor(random() * 5 + 1)]::UUID,
    NOW() - (random() * INTERVAL '30 days')
FROM generate_series(1, 80);

-- Insert sample campaigns
INSERT INTO campaigns (id, name, description, retailer_id, template_id, status) VALUES
('990e8400-e29b-41d4-a716-446655440001', 'Summer Sale Campaign', 'Promote summer collection', '660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'active'),
('990e8400-e29b-41d4-a716-446655440002', 'New Arrivals Campaign', 'Showcase new products', '660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'active'),
('990e8400-e29b-41d4-a716-446655440003', 'Holiday Special', 'Holiday promotions', '660e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440003', 'completed'),
('990e8400-e29b-41d4-a716-446655440004', 'Brand Awareness', 'Increase brand visibility', '660e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440004', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert sample wish list items
INSERT INTO wish_list_items (name, model, collection, size, gender, material, mpn, retailer_id, user_id)
SELECT 
    (ARRAY['Designer Dress', 'Casual Shirt', 'Premium Jeans', 'Summer Blouse', 'Winter Coat', 'Sports Shoes', 'Elegant Handbag', 'Classic Watch'])[floor(random() * 8 + 1)],
    'Model-' || floor(random() * 1000 + 1),
    (ARRAY['Spring 2024', 'Summer 2024', 'Fall 2024', 'Winter 2024'])[floor(random() * 4 + 1)],
    (ARRAY['XS', 'S', 'M', 'L', 'XL', 'XXL'])[floor(random() * 6 + 1)],
    (ARRAY['Unisex', 'Men', 'Women'])[floor(random() * 3 + 1)],
    (ARRAY['Cotton', 'Polyester', 'Silk', 'Wool', 'Leather', 'Denim'])[floor(random() * 6 + 1)],
    'MPN-' || floor(random() * 10000 + 1),
    (ARRAY['660e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005'])[floor(random() * 5 + 1)]::UUID,
    (ARRAY['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'])[floor(random() * 2 + 1)]::UUID
FROM generate_series(1, 50);

-- Insert sample regional data
INSERT INTO regional_data (region, country, retailer_id, metric_type, metric_value)
SELECT 
    (ARRAY['North America', 'Europe', 'Asia Pacific', 'South America', 'Africa'])[floor(random() * 5 + 1)],
    (ARRAY['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'Brazil', 'Mexico'])[floor(random() * 9 + 1)],
    (ARRAY['660e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440005'])[floor(random() * 5 + 1)]::UUID,
    (ARRAY['downloads', 'revenue', 'engagement', 'conversion'])[floor(random() * 4 + 1)],
    random() * 1000 + 100
FROM generate_series(1, 100);

-- Step 4: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_downloads_asset_id ON downloads(asset_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_retailer_id ON downloads(retailer_id);
CREATE INDEX IF NOT EXISTS idx_downloads_downloaded_at ON downloads(downloaded_at);
CREATE INDEX IF NOT EXISTS idx_template_usage_template_id ON template_usage(template_id);
CREATE INDEX IF NOT EXISTS idx_template_usage_retailer_id ON template_usage(retailer_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_retailer_id ON campaigns(retailer_id);
CREATE INDEX IF NOT EXISTS idx_wish_list_items_retailer_id ON wish_list_items(retailer_id);
CREATE INDEX IF NOT EXISTS idx_regional_data_region ON regional_data(region);

-- Step 5: Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE wish_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_data ENABLE ROW LEVEL SECURITY;

-- Create policies (basic read access for authenticated users)
CREATE POLICY "Allow read access for authenticated users" ON users FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON assets FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON retailers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON downloads FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON templates FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON template_usage FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON campaigns FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON wish_list_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access for authenticated users" ON regional_data FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role full access
CREATE POLICY "Service role has full access" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON assets FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON retailers FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON downloads FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON templates FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON template_usage FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON campaigns FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON wish_list_items FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role has full access" ON regional_data FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- SETUP COMPLETE!
-- Your database is now ready with:
-- - Complete schema
-- - Sample data for testing
-- - Analytics views
-- - Performance indexes
-- - Security policies
-- =============================================