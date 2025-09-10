-- =============================================
-- ADD ANALYTICS TABLES TO EXISTING DATABASE
-- This script adds only the missing analytics tables
-- without affecting existing data
-- =============================================

-- =============================================
-- BRAND ASSETS ANALYTICS
-- =============================================

-- Brand assets table for tracking downloadable assets
CREATE TABLE IF NOT EXISTS brand_assets (
    asset_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_name VARCHAR(500) NOT NULL,
    asset_type VARCHAR(50) NOT NULL, -- 'Image', 'Video', 'PDF', 'Design File', 'Presentation'
    file_id UUID, -- Made optional since files table may not exist
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_brand_assets_type ON brand_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_brand_assets_downloads ON brand_assets(download_count DESC);
CREATE INDEX IF NOT EXISTS idx_brand_assets_featured ON brand_assets(is_featured);

-- Daily asset downloads aggregation
CREATE TABLE IF NOT EXISTS daily_asset_downloads (
    date_id DATE PRIMARY KEY,
    total_downloads INTEGER DEFAULT 0,
    image_downloads INTEGER DEFAULT 0,
    video_downloads INTEGER DEFAULT 0,
    pdf_downloads INTEGER DEFAULT 0,
    design_downloads INTEGER DEFAULT 0,
    presentation_downloads INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_downloads_date ON daily_asset_downloads(date_id DESC);

-- =============================================
-- RETAILER ASSET ACTIVITY
-- =============================================

-- Retailer asset activity tracking
CREATE TABLE IF NOT EXISTS retailer_asset_activity (
    activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID NOT NULL, -- References users table
    asset_id UUID REFERENCES brand_assets(asset_id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- 'download', 'view', 'share', 'favorite'
    activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_retailer_activity_retailer ON retailer_asset_activity(retailer_id);
CREATE INDEX IF NOT EXISTS idx_retailer_activity_asset ON retailer_asset_activity(asset_id);
CREATE INDEX IF NOT EXISTS idx_retailer_activity_type_date ON retailer_asset_activity(activity_type, activity_date DESC);

-- =============================================
-- CAMPAIGN TEMPLATES
-- =============================================

-- Campaign templates with analytics
CREATE TABLE IF NOT EXISTS campaign_templates (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(100) NOT NULL, -- 'Email', 'Social Media', 'Print', 'Digital Ad'
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    unique_retailers_count INTEGER DEFAULT 0,
    unique_recipients_count INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_campaign_templates_usage ON campaign_templates(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_campaign_templates_type ON campaign_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_campaign_templates_active ON campaign_templates(is_active);

-- Template usage by retailers
CREATE TABLE IF NOT EXISTS template_retailer_usage (
    usage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES campaign_templates(template_id) ON DELETE CASCADE,
    retailer_id UUID NOT NULL, -- References users table
    usage_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recipients_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    last_active_date TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_template_usage_template ON template_retailer_usage(template_id);
CREATE INDEX IF NOT EXISTS idx_template_usage_retailer ON template_retailer_usage(retailer_id);
CREATE INDEX IF NOT EXISTS idx_template_usage_active_date ON template_retailer_usage(last_active_date DESC) WHERE last_active_date IS NOT NULL;

-- =============================================
-- WATCH MODELS & WISH LISTS
-- =============================================

-- Watch models catalog
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

CREATE INDEX IF NOT EXISTS idx_watch_models_collection ON watch_models(collection_name);
CREATE INDEX IF NOT EXISTS idx_watch_models_mpn ON watch_models(mpn);
CREATE INDEX IF NOT EXISTS idx_watch_models_active ON watch_models(is_active);

-- Wish list items
CREATE TABLE IF NOT EXISTS wish_list_items (
    wish_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES watch_models(model_id) ON DELETE CASCADE,
    retailer_id UUID NOT NULL, -- References users table
    wish_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(model_id, retailer_id)
);

CREATE INDEX IF NOT EXISTS idx_wish_list_model ON wish_list_items(model_id);
CREATE INDEX IF NOT EXISTS idx_wish_list_retailer ON wish_list_items(retailer_id);
CREATE INDEX IF NOT EXISTS idx_wish_list_count ON wish_list_items(wish_count DESC);

-- Regional wish lists aggregation
CREATE TABLE IF NOT EXISTS regional_wish_lists (
    regional_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID REFERENCES watch_models(model_id) ON DELETE CASCADE,
    region VARCHAR(100) NOT NULL, -- 'northeast', 'southeast', 'midwest', 'west', 'southwest'
    wish_count INTEGER DEFAULT 0,
    rank_in_region INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(model_id, region)
);

CREATE INDEX IF NOT EXISTS idx_regional_wishes_region ON regional_wish_lists(region);
CREATE INDEX IF NOT EXISTS idx_regional_wishes_rank ON regional_wish_lists(rank_in_region);
CREATE INDEX IF NOT EXISTS idx_regional_wishes_model ON regional_wish_lists(model_id);

-- =============================================
-- ANALYTICS VIEWS
-- =============================================

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

-- View for top active retailers by asset engagement
CREATE OR REPLACE VIEW top_active_retailers_assets AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY activity_stats.total_activities DESC) as rank,
    activity_stats.retailer_id,
    activity_stats.total_activities,
    activity_stats.unique_assets,
    activity_stats.last_activity
FROM (
    SELECT 
        raa.retailer_id,
        COUNT(*) as total_activities,
        COUNT(DISTINCT raa.asset_id) as unique_assets,
        MAX(raa.activity_date) as last_activity
    FROM retailer_asset_activity raa
    GROUP BY raa.retailer_id
) activity_stats
ORDER BY activity_stats.total_activities DESC
LIMIT 10;

-- View for top wish list items
CREATE OR REPLACE VIEW top_wish_list_items AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY wish_stats.total_wishes DESC) as rank,
    wm.model_name,
    wm.collection_name,
    wish_stats.total_wishes,
    wish_stats.unique_retailers
FROM (
    SELECT 
        wli.model_id,
        SUM(wli.wish_count) as total_wishes,
        COUNT(DISTINCT wli.retailer_id) as unique_retailers
    FROM wish_list_items wli
    GROUP BY wli.model_id
) wish_stats
JOIN watch_models wm ON wm.model_id = wish_stats.model_id
ORDER BY wish_stats.total_wishes DESC
LIMIT 10;

-- View for top campaign templates
CREATE OR REPLACE VIEW top_campaign_templates AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY ct.usage_count DESC) as rank,
    ct.template_name,
    ct.template_type,
    ct.usage_count,
    ct.unique_retailers_count,
    ct.conversion_rate
FROM campaign_templates ct
WHERE ct.is_active = true
ORDER BY ct.usage_count DESC
LIMIT 10;

-- =============================================
-- SAMPLE DATA FOR TESTING
-- =============================================

-- Insert sample brand assets
INSERT INTO brand_assets (asset_name, asset_type, download_count, is_featured, metadata) VALUES
('Rolex Submariner Product Video', 'Video', 245, true, '{"duration": "2:30", "resolution": "4K"}'),
('GMT-Master II Brochure', 'PDF', 189, true, '{"pages": 12, "language": "EN"}'),
('Daytona Collection Images', 'Image', 156, false, '{"count": 8, "format": "JPG"}'),
('Datejust Marketing Presentation', 'Presentation', 134, false, '{"slides": 24, "template": "PowerPoint"}'),
('Day-Date Lifestyle Photos', 'Image', 98, true, '{"count": 15, "style": "lifestyle"}'),
('Oyster Perpetual Tech Specs', 'PDF', 87, false, '{"pages": 6, "technical": true}'),
('Explorer Campaign Video', 'Video', 76, false, '{"duration": "1:45", "style": "adventure"}'),
('Milgauss Design Files', 'Design File', 65, false, '{"format": "AI", "layers": true}'),
('Sea-Dweller Product Sheet', 'PDF', 54, false, '{"pages": 4, "specifications": true}'),
('Yacht-Master Catalog', 'PDF', 43, false, '{"pages": 16, "collection": "marine"}')
ON CONFLICT DO NOTHING;

-- Insert sample watch models
INSERT INTO watch_models (model_name, collection_name, size, gender, material, mpn, metadata) VALUES
('Submariner Date', 'Professional', '41mm', 'Unisex', 'Oystersteel', '126610LN', '{"water_resistance": "300m", "movement": "3235"}'),
('GMT-Master II', 'Professional', '40mm', 'Unisex', 'Oystersteel', '126710BLRO', '{"timezone": "dual", "bezel": "bidirectional"}'),
('Daytona', 'Professional', '40mm', 'Unisex', 'Oystersteel', '116500LN', '{"chronograph": true, "movement": "4130"}'),
('Datejust 36', 'Classic', '36mm', 'Unisex', 'Oystersteel', '126234', '{"date_display": true, "bracelet": "jubilee"}'),
('Day-Date 40', 'Prestige', '40mm', 'Unisex', 'Yellow Gold', '228238', '{"day_date": true, "president_bracelet": true}'),
('Explorer', 'Professional', '36mm', 'Unisex', 'Oystersteel', '124270', '{"luminescence": "chromalight", "simple_dial": true}'),
('Milgauss', 'Professional', '40mm', 'Unisex', 'Oystersteel', '116400GV', '{"antimagnetic": true, "green_crystal": true}'),
('Sea-Dweller', 'Professional', '43mm', 'Unisex', 'Oystersteel', '126600', '{"water_resistance": "1220m", "helium_valve": true}'),
('Yacht-Master', 'Professional', '40mm', 'Unisex', 'Oystersteel', '126622', '{"regatta": true, "platinum_bezel": true}'),
('Oyster Perpetual', 'Classic', '41mm', 'Unisex', 'Oystersteel', '124300', '{"simple_time", "colorful_dials": true}')
ON CONFLICT (mpn) DO NOTHING;

-- Insert sample campaign templates
INSERT INTO campaign_templates (template_name, template_type, description, usage_count, unique_retailers_count, conversion_rate, metadata) VALUES
('New Collection Launch Email', 'Email', 'Professional email template for new product launches', 45, 23, 12.5, '{"subject_variants": 3, "responsive": true}'),
('Social Media Product Showcase', 'Social Media', 'Instagram and Facebook post template for product highlights', 38, 19, 8.7, '{"platforms": ["instagram", "facebook"], "hashtags": true}'),
('Luxury Watch Print Ad', 'Print', 'High-end magazine advertisement template', 29, 15, 15.2, '{"sizes": ["full_page", "half_page"], "premium": true}'),
('Digital Banner Campaign', 'Digital Ad', 'Web banner template for online advertising', 34, 18, 6.3, '{"sizes": ["728x90", "300x250"], "animated": true}'),
('Holiday Season Promotion', 'Email', 'Seasonal email template for holiday campaigns', 52, 28, 18.9, '{"seasonal": "winter", "gift_focus": true}')
ON CONFLICT DO NOTHING;

-- Insert sample wish list data (using existing watch models)
INSERT INTO wish_list_items (model_id, retailer_id, wish_count)
SELECT 
    wm.model_id,
    gen_random_uuid(), -- Random retailer IDs for demo
    (RANDOM() * 20 + 1)::INTEGER as wish_count
FROM watch_models wm
CROSS JOIN generate_series(1, 3) -- 3 retailers per model
ON CONFLICT DO NOTHING;

-- Insert sample regional wish list data
INSERT INTO regional_wish_lists (model_id, region, wish_count, rank_in_region)
SELECT 
    wm.model_id,
    region_data.region,
    region_data.wish_count,
    region_data.rank_in_region
FROM watch_models wm
CROSS JOIN (
    VALUES 
        ('northeast', (RANDOM() * 50 + 10)::INTEGER, (RANDOM() * 5 + 1)::INTEGER),
        ('southeast', (RANDOM() * 40 + 8)::INTEGER, (RANDOM() * 5 + 1)::INTEGER),
        ('midwest', (RANDOM() * 35 + 5)::INTEGER, (RANDOM() * 5 + 1)::INTEGER),
        ('west', (RANDOM() * 60 + 15)::INTEGER, (RANDOM() * 5 + 1)::INTEGER),
        ('southwest', (RANDOM() * 30 + 5)::INTEGER, (RANDOM() * 5 + 1)::INTEGER)
) AS region_data(region, wish_count, rank_in_region)
LIMIT 25 -- Limit to avoid too much data
ON CONFLICT (model_id, region) DO NOTHING;

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_asset_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_asset_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_retailer_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE wish_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_wish_lists ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allow all for now - customize as needed)
CREATE POLICY "Allow all access to brand_assets" ON brand_assets FOR ALL USING (true);
CREATE POLICY "Allow all access to daily_asset_downloads" ON daily_asset_downloads FOR ALL USING (true);
CREATE POLICY "Allow all access to retailer_asset_activity" ON retailer_asset_activity FOR ALL USING (true);
CREATE POLICY "Allow all access to campaign_templates" ON campaign_templates FOR ALL USING (true);
CREATE POLICY "Allow all access to template_retailer_usage" ON template_retailer_usage FOR ALL USING (true);
CREATE POLICY "Allow all access to watch_models" ON watch_models FOR ALL USING (true);
CREATE POLICY "Allow all access to wish_list_items" ON wish_list_items FOR ALL USING (true);
CREATE POLICY "Allow all access to regional_wish_lists" ON regional_wish_lists FOR ALL USING (true);

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

-- Add comments for documentation
COMMENT ON TABLE brand_assets IS 'Analytics table: Stores brand assets available for download by retailers';
COMMENT ON TABLE watch_models IS 'Analytics table: Product catalog with specifications and metadata';
COMMENT ON TABLE retailer_asset_activity IS 'Analytics table: Tracks retailer interactions with brand assets';
COMMENT ON TABLE campaign_templates IS 'Analytics table: Campaign templates with usage analytics';
COMMENT ON TABLE wish_list_items IS 'Analytics table: Customer wishlist data by retailer';
COMMENT ON TABLE regional_wish_lists IS 'Analytics table: Geographic preference aggregation';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Analytics tables successfully added to your database!';
    RAISE NOTICE '📊 Tables created: brand_assets, watch_models, retailer_asset_activity, campaign_templates, wish_list_items, regional_wish_lists';
    RAISE NOTICE '📈 Views created: top_downloaded_assets, top_active_retailers_assets, top_wish_list_items, top_campaign_templates';
    RAISE NOTICE '🔒 RLS policies enabled with basic access controls';
    RAISE NOTICE '🎯 Sample data inserted for immediate testing';
    RAISE NOTICE '🚀 Your analytics dashboard is now ready!';
END $$;