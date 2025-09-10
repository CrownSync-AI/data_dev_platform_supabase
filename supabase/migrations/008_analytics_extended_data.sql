-- =============================================
-- ANALYTICS EXTENDED DATA MIGRATION
-- Adding tables for Brand Assets, Campaign Templates, 
-- Retailer Scores, and Wish List functionality
-- =============================================

-- =============================================
-- BRAND ASSETS ANALYTICS
-- =============================================

-- Brand assets table for tracking downloadable assets
CREATE TABLE brand_assets (
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

CREATE INDEX idx_brand_assets_type ON brand_assets(asset_type);
CREATE INDEX idx_brand_assets_downloads ON brand_assets(download_count DESC);
CREATE INDEX idx_brand_assets_featured ON brand_assets(is_featured);

-- Daily downloads tracking for analytics charts
CREATE TABLE daily_asset_downloads (
    download_date DATE NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (download_date, asset_type)
);

CREATE INDEX idx_daily_downloads_date ON daily_asset_downloads(download_date DESC);

-- Retailer asset activity tracking
CREATE TABLE retailer_asset_activity (
    activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES brand_assets(asset_id) ON DELETE CASCADE,
    activity_type VARCHAR(20) NOT NULL, -- 'download', 'view', 'share'
    activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unique_files_count INTEGER DEFAULT 1,
    
    CONSTRAINT retailer_activity_type_check CHECK (activity_type IN ('download', 'view', 'share'))
);

CREATE INDEX idx_retailer_activity_retailer ON retailer_asset_activity(retailer_id);
CREATE INDEX idx_retailer_activity_asset ON retailer_asset_activity(asset_id);
CREATE INDEX idx_retailer_activity_date ON retailer_asset_activity(activity_date DESC);

-- =============================================
-- CAMPAIGN TEMPLATES ANALYTICS
-- =============================================

-- Campaign templates with usage tracking
CREATE TABLE campaign_templates (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(255) NOT NULL,
    template_type template_type_enum NOT NULL,
    usage_count INTEGER DEFAULT 0,
    unique_retailers_count INTEGER DEFAULT 0,
    unique_recipients_count INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_campaign_templates_usage ON campaign_templates(usage_count DESC);
CREATE INDEX idx_campaign_templates_type ON campaign_templates(template_type);
CREATE INDEX idx_campaign_templates_active ON campaign_templates(is_active);

-- Template usage by retailers
CREATE TABLE template_retailer_usage (
    usage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES campaign_templates(template_id) ON DELETE CASCADE,
    retailer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    campaigns_joined INTEGER DEFAULT 1,
    total_sends INTEGER DEFAULT 0,
    last_active_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_template_usage_template ON template_retailer_usage(template_id);
CREATE INDEX idx_template_usage_retailer ON template_retailer_usage(retailer_id);
CREATE INDEX idx_template_usage_last_active ON template_retailer_usage(last_active_date DESC);

-- =============================================
-- RETAILER PERFORMANCE SCORES
-- =============================================

-- Retailer performance metrics
CREATE TABLE retailer_scores (
    score_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    retailer_name VARCHAR(255) NOT NULL,
    email_response_time_hours DECIMAL(4,1) DEFAULT 0.0,
    social_response_time_hours DECIMAL(4,1) DEFAULT 0.0,
    social_post_frequency_per_week DECIMAL(3,1) DEFAULT 0.0,
    response_quality_grade VARCHAR(1) DEFAULT 'C', -- A, B, C grades
    first_followup_time_hours DECIMAL(4,1) DEFAULT 0.0,
    campaign_roi_percentage DECIMAL(5,1) DEFAULT 0.0,
    overall_rank INTEGER,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT response_quality_check CHECK (response_quality_grade IN ('A', 'B', 'C')),
    UNIQUE(retailer_id)
);

CREATE INDEX idx_retailer_scores_retailer ON retailer_scores(retailer_id);
CREATE INDEX idx_retailer_scores_rank ON retailer_scores(overall_rank);
CREATE INDEX idx_retailer_scores_roi ON retailer_scores(campaign_roi_percentage DESC);
CREATE INDEX idx_retailer_scores_updated ON retailer_scores(updated_at DESC);

-- =============================================
-- WISH LIST FUNCTIONALITY
-- =============================================

-- Watch models catalog for wish lists (separate from general products)
CREATE TABLE watch_models (
    model_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(255) NOT NULL,
    collection_name VARCHAR(255) NOT NULL,
    size VARCHAR(20),
    gender VARCHAR(20),
    material VARCHAR(255),
    mpn VARCHAR(100) UNIQUE NOT NULL, -- Manufacturer Part Number
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_watch_models_collection ON watch_models(collection_name);
CREATE INDEX idx_watch_models_mpn ON watch_models(mpn);
CREATE INDEX idx_watch_models_active ON watch_models(is_active);

-- Wish list items
CREATE TABLE wish_list_items (
    wish_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES watch_models(model_id) ON DELETE CASCADE,
    retailer_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    wish_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(model_id, retailer_id)
);

CREATE INDEX idx_wish_list_model ON wish_list_items(model_id);
CREATE INDEX idx_wish_list_retailer ON wish_list_items(retailer_id);
CREATE INDEX idx_wish_list_count ON wish_list_items(wish_count DESC);

-- Regional wish list tracking
CREATE TABLE regional_wish_lists (
    regional_wish_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_id UUID NOT NULL REFERENCES watch_models(model_id) ON DELETE CASCADE,
    region VARCHAR(50) NOT NULL, -- 'northeast', 'midwest', 'south', 'west'
    wish_count INTEGER DEFAULT 0,
    rank_in_region INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(model_id, region)
);

CREATE INDEX idx_regional_wishes_region ON regional_wish_lists(region);
CREATE INDEX idx_regional_wishes_rank ON regional_wish_lists(rank_in_region);
CREATE INDEX idx_regional_wishes_model ON regional_wish_lists(model_id);

-- =============================================
-- ANALYTICS VIEWS FOR EASY QUERYING
-- =============================================

-- View for top downloaded assets
CREATE VIEW top_downloaded_assets AS
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
CREATE VIEW top_active_retailers_assets AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY COUNT(DISTINCT raa.asset_id) DESC, SUM(raa.unique_files_count) DESC) as rank,
    u.user_name as retailer_name,
    COUNT(DISTINCT raa.asset_id) as unique_files,
    SUM(raa.unique_files_count) as download_count
FROM retailer_asset_activity raa
JOIN users u ON raa.retailer_id = u.user_id
WHERE u.user_type = 'retailer'
GROUP BY u.user_id, u.user_name
ORDER BY unique_files DESC, download_count DESC
LIMIT 10;

-- View for template coverage
CREATE VIEW top_templates_coverage AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY ct.unique_retailers_count DESC, ct.unique_recipients_count DESC) as rank,
    ct.template_name,
    ct.unique_retailers_count,
    ct.unique_recipients_count
FROM campaign_templates ct
WHERE ct.is_active = true
ORDER BY ct.unique_retailers_count DESC, ct.unique_recipients_count DESC
LIMIT 10;

-- View for campaign performance
CREATE VIEW top_campaign_performance AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY ct.conversion_rate DESC) as rank,
    ct.template_name,
    ct.template_type,
    ct.conversion_rate
FROM campaign_templates ct
WHERE ct.is_active = true AND ct.conversion_rate > 0
ORDER BY ct.conversion_rate DESC
LIMIT 5;

-- View for top wish list items
CREATE VIEW top_wish_list_items AS
SELECT 
    ROW_NUMBER() OVER (ORDER BY SUM(wli.wish_count) DESC) as rank,
    wm.model_name,
    wm.collection_name,
    wm.size,
    wm.gender,
    wm.material,
    wm.mpn,
    SUM(wli.wish_count) as total_wish_count,
    COUNT(DISTINCT wli.retailer_id) as unique_retailers
FROM wish_list_items wli
JOIN watch_models wm ON wli.model_id = wm.model_id
WHERE wm.is_active = true
GROUP BY wm.model_id, wm.model_name, wm.collection_name, wm.size, wm.gender, wm.material, wm.mpn
ORDER BY total_wish_count DESC
LIMIT 10;

-- =============================================
-- FUNCTIONS FOR UPDATING ANALYTICS
-- =============================================

-- Function to update template usage counts
CREATE OR REPLACE FUNCTION update_template_usage_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update usage count and unique retailers for the template
    UPDATE campaign_templates 
    SET 
        usage_count = (
            SELECT COUNT(*) 
            FROM template_retailer_usage 
            WHERE template_id = NEW.template_id
        ),
        unique_retailers_count = (
            SELECT COUNT(DISTINCT retailer_id) 
            FROM template_retailer_usage 
            WHERE template_id = NEW.template_id
        ),
        updated_at = NOW()
    WHERE template_id = NEW.template_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for template usage updates
CREATE TRIGGER trigger_update_template_usage
    AFTER INSERT OR UPDATE ON template_retailer_usage
    FOR EACH ROW
    EXECUTE FUNCTION update_template_usage_counts();

-- Function to update asset download counts
CREATE OR REPLACE FUNCTION update_asset_download_counts()
RETURNS TRIGGER AS $$
BEGIN
    -- Update download count for the asset
    UPDATE brand_assets 
    SET 
        download_count = (
            SELECT COUNT(*) 
            FROM retailer_asset_activity 
            WHERE asset_id = NEW.asset_id AND activity_type = 'download'
        ),
        updated_at = NOW()
    WHERE asset_id = NEW.asset_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for asset download updates
CREATE TRIGGER trigger_update_asset_downloads
    AFTER INSERT ON retailer_asset_activity
    FOR EACH ROW
    WHEN (NEW.activity_type = 'download')
    EXECUTE FUNCTION update_asset_download_counts();

-- =============================================
-- INITIAL INDEXES FOR PERFORMANCE
-- =============================================

-- Additional composite indexes for common queries
CREATE INDEX idx_retailer_activity_type_date ON retailer_asset_activity(activity_type, activity_date DESC);
CREATE INDEX idx_template_usage_active_date ON template_retailer_usage(last_active_date DESC) WHERE last_active_date IS NOT NULL;
CREATE INDEX idx_wish_list_region_rank ON regional_wish_lists(region, rank_in_region);

-- =============================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================

COMMENT ON TABLE brand_assets IS 'Stores brand assets available for download by retailers';
COMMENT ON TABLE daily_asset_downloads IS 'Daily aggregated download statistics by asset type';
COMMENT ON TABLE retailer_asset_activity IS 'Tracks retailer interactions with brand assets';
COMMENT ON TABLE campaign_templates IS 'Campaign templates with usage analytics';
COMMENT ON TABLE template_retailer_usage IS 'Tracks template usage by individual retailers';
COMMENT ON TABLE retailer_scores IS 'Performance scores and metrics for retailers';
COMMENT ON TABLE products IS 'Product catalog for wish list functionality';
COMMENT ON TABLE wish_list_items IS 'Individual retailer wish list items';
COMMENT ON TABLE regional_wish_lists IS 'Regional aggregation of wish list data';