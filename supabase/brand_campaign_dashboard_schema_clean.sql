-- Brand Campaign Dashboard Schema - Clean Version
-- Redesigned for card-based campaign dashboard with Ayrshare compatibility

-- =====================================================
-- 0. CLEANUP EXISTING OBJECTS
-- =====================================================

-- Drop existing views, materialized views, and functions if they exist
DROP MATERIALIZED VIEW IF EXISTS campaign_performance_summary CASCADE;
DROP VIEW IF EXISTS campaign_performance_summary CASCADE;
DROP MATERIALIZED VIEW IF EXISTS brand_campaign_dashboard CASCADE;
DROP VIEW IF EXISTS brand_campaign_dashboard CASCADE;
DROP FUNCTION IF EXISTS get_brand_campaign_cards(UUID) CASCADE;
DROP FUNCTION IF EXISTS get_campaign_detailed_metrics(UUID) CASCADE;
DROP FUNCTION IF EXISTS update_campaign_duration() CASCADE;
DROP FUNCTION IF EXISTS update_conversion_rates() CASCADE;

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS campaign_insights CASCADE;
DROP TABLE IF EXISTS campaign_daily_metrics CASCADE;
DROP TABLE IF EXISTS campaign_retailer_summary CASCADE;
DROP TABLE IF EXISTS campaign_platform_performance CASCADE;
DROP TABLE IF EXISTS campaign_detailed_metrics CASCADE;
DROP TABLE IF EXISTS brand_campaign_cards CASCADE;

-- =====================================================
-- 1. CAMPAIGN CARDS TABLE
-- =====================================================

CREATE TABLE brand_campaign_cards (
    campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES users(id),
    
    -- Basic Campaign Info
    campaign_name VARCHAR(255) NOT NULL,
    campaign_status VARCHAR(20) DEFAULT 'active' CHECK (campaign_status IN ('active', 'paused', 'completed', 'draft')),
    campaign_type VARCHAR(20) DEFAULT 'mixed' CHECK (campaign_type IN ('email', 'social', 'mixed')),
    
    -- Date Range
    start_date DATE NOT NULL,
    end_date DATE,
    duration_days INTEGER DEFAULT 0,
    
    -- Key Performance Metrics (Card Display) - Ayrshare Available Data Only
    avg_click_rate NUMERIC(5,2) DEFAULT 0,
    total_reach BIGINT DEFAULT 0,
    total_engagement BIGINT DEFAULT 0,
    
    -- Retailer Participation (Privacy-Restricted)
    participating_retailers_count INTEGER DEFAULT 0,
    total_emails_sent BIGINT DEFAULT 0,
    
    -- Status Indicators
    performance_tier VARCHAR(20) DEFAULT 'standard' CHECK (performance_tier IN ('high', 'good', 'standard')),
    trend_direction VARCHAR(10) DEFAULT 'stable' CHECK (trend_direction IN ('up', 'down', 'stable')),
    
    -- Quick Actions
    can_edit BOOLEAN DEFAULT true,
    can_export BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. DETAILED CAMPAIGN METRICS TABLE
-- =====================================================

CREATE TABLE campaign_detailed_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES brand_campaign_cards(campaign_id) ON DELETE CASCADE,
    
    -- Conversion Funnel (Email Campaigns)
    emails_sent BIGINT DEFAULT 0,
    emails_delivered BIGINT DEFAULT 0,
    emails_opened BIGINT DEFAULT 0,
    emails_clicked BIGINT DEFAULT 0,
    conversions BIGINT DEFAULT 0,
    
    -- Calculated Conversion Rates
    delivery_rate NUMERIC(5,2) DEFAULT 0,
    open_rate NUMERIC(5,2) DEFAULT 0,
    click_rate NUMERIC(5,2) DEFAULT 0,
    conversion_rate NUMERIC(5,2) DEFAULT 0,
    
    -- Trend Indicators
    delivery_trend VARCHAR(10) DEFAULT '+0%',
    open_trend VARCHAR(10) DEFAULT '+0%',
    click_trend VARCHAR(10) DEFAULT '+0%',
    conversion_trend VARCHAR(10) DEFAULT '+0%',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. PLATFORM PERFORMANCE TABLE (Ayrshare Compatible)
-- =====================================================

CREATE TABLE campaign_platform_performance (
    performance_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES brand_campaign_cards(campaign_id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    
    -- Core Metrics
    impressions BIGINT DEFAULT 0,
    reach BIGINT DEFAULT 0,
    engagement BIGINT DEFAULT 0,
    clicks BIGINT DEFAULT 0,
    engagement_rate NUMERIC(5,2) DEFAULT 0,
    
    -- Ayrshare-Specific Platform Metrics (JSONB for flexibility)
    platform_specific_metrics JSONB DEFAULT '{}',
    
    -- Raw Ayrshare Data (for future API integration)
    ayrshare_raw_data JSONB DEFAULT '{}',
    
    -- Timestamps
    analytics_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. RETAILER SUMMARY TABLE (Privacy-Restricted)
-- =====================================================

CREATE TABLE campaign_retailer_summary (
    summary_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES brand_campaign_cards(campaign_id) ON DELETE CASCADE,
    
    -- Aggregated Retailer Data (No Individual Details)
    total_participating_retailers INTEGER DEFAULT 0,
    avg_retailer_performance NUMERIC(5,2) DEFAULT 0,
    top_performing_region VARCHAR(100),
    
    -- Performance Distribution
    high_performers INTEGER DEFAULT 0,    -- >6% engagement
    good_performers INTEGER DEFAULT 0,    -- 3-6% engagement  
    standard_performers INTEGER DEFAULT 0, -- <3% engagement
    
    -- Regional Performance (Aggregated Only)
    regional_performance JSONB DEFAULT '{}', -- {"East": 5.2, "West": 4.8, ...}
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. DAILY CAMPAIGN METRICS TABLE
-- =====================================================

CREATE TABLE campaign_daily_metrics (
    daily_metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES brand_campaign_cards(campaign_id) ON DELETE CASCADE,
    
    -- Date
    metric_date DATE NOT NULL,
    
    -- Daily Performance
    daily_impressions BIGINT DEFAULT 0,
    daily_reach BIGINT DEFAULT 0,
    daily_engagement BIGINT DEFAULT 0,
    daily_clicks BIGINT DEFAULT 0,
    daily_conversions BIGINT DEFAULT 0,
    
    -- Calculated Daily Rates
    daily_engagement_rate NUMERIC(5,2) DEFAULT 0,
    daily_click_rate NUMERIC(5,2) DEFAULT 0,
    daily_conversion_rate NUMERIC(5,2) DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint
    UNIQUE(campaign_id, metric_date)
);

-- =====================================================
-- 6. CAMPAIGN NOTES TABLE (Simple notes, no AI)
-- =====================================================

CREATE TABLE campaign_notes (
    note_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES brand_campaign_cards(campaign_id) ON DELETE CASCADE,
    
    -- Simple Performance Notes
    performance_notes TEXT,
    best_performing_platform VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. TRIGGER FUNCTIONS FOR CALCULATED FIELDS
-- =====================================================

-- Function to update duration_days
CREATE OR REPLACE FUNCTION update_campaign_duration()
RETURNS TRIGGER AS $$
BEGIN
    NEW.duration_days = CASE 
        WHEN NEW.end_date IS NOT NULL THEN NEW.end_date - NEW.start_date
        ELSE CURRENT_DATE - NEW.start_date
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update conversion rates
CREATE OR REPLACE FUNCTION update_conversion_rates()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate delivery rate
    NEW.delivery_rate = CASE 
        WHEN NEW.emails_sent > 0 THEN ROUND((NEW.emails_delivered::numeric / NEW.emails_sent * 100), 2)
        ELSE 0 
    END;
    
    -- Calculate open rate
    NEW.open_rate = CASE 
        WHEN NEW.emails_delivered > 0 THEN ROUND((NEW.emails_opened::numeric / NEW.emails_delivered * 100), 2)
        ELSE 0 
    END;
    
    -- Calculate click rate
    NEW.click_rate = CASE 
        WHEN NEW.emails_opened > 0 THEN ROUND((NEW.emails_clicked::numeric / NEW.emails_opened * 100), 2)
        ELSE 0 
    END;
    
    -- Calculate conversion rate
    NEW.conversion_rate = CASE 
        WHEN NEW.emails_clicked > 0 THEN ROUND((NEW.conversions::numeric / NEW.emails_clicked * 100), 2)
        ELSE 0 
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 8. CREATE TRIGGERS
-- =====================================================

CREATE TRIGGER trigger_update_campaign_duration
    BEFORE INSERT OR UPDATE ON brand_campaign_cards
    FOR EACH ROW
    EXECUTE FUNCTION update_campaign_duration();

CREATE TRIGGER trigger_update_conversion_rates
    BEFORE INSERT OR UPDATE ON campaign_detailed_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_conversion_rates();

-- =====================================================
-- 9. INDEXES FOR PERFORMANCE
-- =====================================================

-- Campaign Cards Indexes
CREATE INDEX idx_brand_campaign_cards_brand_id ON brand_campaign_cards(brand_id);
CREATE INDEX idx_brand_campaign_cards_status ON brand_campaign_cards(campaign_status);
CREATE INDEX idx_brand_campaign_cards_type ON brand_campaign_cards(campaign_type);
CREATE INDEX idx_brand_campaign_cards_dates ON brand_campaign_cards(start_date, end_date);
CREATE INDEX idx_brand_campaign_cards_performance ON brand_campaign_cards(performance_tier, roi_percentage);

-- Platform Performance Indexes
CREATE INDEX idx_campaign_platform_performance_campaign ON campaign_platform_performance(campaign_id);
CREATE INDEX idx_campaign_platform_performance_platform ON campaign_platform_performance(platform);
CREATE INDEX idx_campaign_platform_performance_date ON campaign_platform_performance(analytics_date);

-- Daily Metrics Indexes
CREATE INDEX idx_campaign_daily_metrics_campaign ON campaign_daily_metrics(campaign_id);
CREATE INDEX idx_campaign_daily_metrics_date ON campaign_daily_metrics(metric_date);

-- =====================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE brand_campaign_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_detailed_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_platform_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_retailer_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_notes ENABLE ROW LEVEL SECURITY;

-- Brand Access Policies (Brands can only see their own campaigns)
CREATE POLICY "Brands can view their own campaigns" ON brand_campaign_cards
    FOR SELECT USING (
        brand_id = auth.uid() OR 
        auth.uid() IN (SELECT id FROM users WHERE user_type = 'admin')
    );

CREATE POLICY "Brands can view their campaign metrics" ON campaign_detailed_metrics
    FOR SELECT USING (
        campaign_id IN (
            SELECT campaign_id FROM brand_campaign_cards 
            WHERE brand_id = auth.uid()
        ) OR 
        auth.uid() IN (SELECT id FROM users WHERE user_type = 'admin')
    );

CREATE POLICY "Brands can view their platform performance" ON campaign_platform_performance
    FOR SELECT USING (
        campaign_id IN (
            SELECT campaign_id FROM brand_campaign_cards 
            WHERE brand_id = auth.uid()
        ) OR 
        auth.uid() IN (SELECT id FROM users WHERE user_type = 'admin')
    );

CREATE POLICY "Brands can view aggregated retailer summary" ON campaign_retailer_summary
    FOR SELECT USING (
        campaign_id IN (
            SELECT campaign_id FROM brand_campaign_cards 
            WHERE brand_id = auth.uid()
        ) OR 
        auth.uid() IN (SELECT id FROM users WHERE user_type = 'admin')
    );

CREATE POLICY "Brands can view their daily metrics" ON campaign_daily_metrics
    FOR SELECT USING (
        campaign_id IN (
            SELECT campaign_id FROM brand_campaign_cards 
            WHERE brand_id = auth.uid()
        ) OR 
        auth.uid() IN (SELECT id FROM users WHERE user_type = 'admin')
    );

CREATE POLICY "Brands can view their campaign notes" ON campaign_notes
    FOR SELECT USING (
        campaign_id IN (
            SELECT campaign_id FROM brand_campaign_cards 
            WHERE brand_id = auth.uid()
        ) OR 
        auth.uid() IN (SELECT id FROM users WHERE user_type = 'admin')
    );

-- =====================================================
-- 11. HELPER VIEWS
-- =====================================================

-- Campaign Dashboard View (for card display)
CREATE VIEW brand_campaign_dashboard AS
SELECT 
    bcc.*,
    cdm.emails_sent,
    cdm.delivery_rate,
    cdm.open_rate,
    cdm.click_rate,
    cdm.conversion_rate,
    crs.total_participating_retailers,
    crs.avg_retailer_performance,
    crs.top_performing_region
FROM brand_campaign_cards bcc
LEFT JOIN campaign_detailed_metrics cdm ON bcc.campaign_id = cdm.campaign_id
LEFT JOIN campaign_retailer_summary crs ON bcc.campaign_id = crs.campaign_id
ORDER BY bcc.updated_at DESC;

-- Campaign Performance Summary View
CREATE VIEW campaign_performance_summary AS
SELECT 
    bcc.campaign_id,
    bcc.campaign_name,
    bcc.campaign_status,
    bcc.roi_percentage,
    bcc.total_reach,
    bcc.total_engagement,
    
    -- Platform Performance Aggregation
    COUNT(DISTINCT cpp.platform) as active_platforms,
    SUM(cpp.impressions) as total_impressions,
    SUM(cpp.clicks) as total_clicks,
    ROUND(AVG(cpp.engagement_rate), 2) as avg_engagement_rate,
    
    -- Email Performance
    cdm.emails_sent,
    cdm.delivery_rate,
    cdm.open_rate,
    cdm.click_rate,
    cdm.conversion_rate
    
FROM brand_campaign_cards bcc
LEFT JOIN campaign_platform_performance cpp ON bcc.campaign_id = cpp.campaign_id
LEFT JOIN campaign_detailed_metrics cdm ON bcc.campaign_id = cdm.campaign_id
GROUP BY bcc.campaign_id, bcc.campaign_name, bcc.campaign_status, bcc.roi_percentage, 
         bcc.total_reach, bcc.total_engagement, cdm.emails_sent, cdm.delivery_rate, 
         cdm.open_rate, cdm.click_rate, cdm.conversion_rate;

-- =====================================================
-- 12. HELPER FUNCTIONS
-- =====================================================

-- Function to get campaign card data for dashboard
CREATE OR REPLACE FUNCTION get_brand_campaign_cards(p_brand_id UUID DEFAULT NULL)
RETURNS TABLE (
    campaign_id UUID,
    campaign_name VARCHAR(255),
    campaign_status VARCHAR(20),
    campaign_type VARCHAR(20),
    start_date DATE,
    end_date DATE,
    duration_days INTEGER,
    roi_percentage NUMERIC(5,2),
    avg_click_rate NUMERIC(5,2),
    total_reach BIGINT,
    total_engagement BIGINT,
    participating_retailers_count INTEGER,
    total_emails_sent BIGINT,
    performance_tier VARCHAR(20),
    trend_direction VARCHAR(10),
    last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bcc.campaign_id,
        bcc.campaign_name,
        bcc.campaign_status,
        bcc.campaign_type,
        bcc.start_date,
        bcc.end_date,
        bcc.duration_days,
        bcc.roi_percentage,
        bcc.avg_click_rate,
        bcc.total_reach,
        bcc.total_engagement,
        bcc.participating_retailers_count,
        bcc.total_emails_sent,
        bcc.performance_tier,
        bcc.trend_direction,
        bcc.last_updated
    FROM brand_campaign_cards bcc
    WHERE (p_brand_id IS NULL OR bcc.brand_id = p_brand_id)
    ORDER BY bcc.last_updated DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get detailed campaign metrics
CREATE OR REPLACE FUNCTION get_campaign_detailed_metrics(p_campaign_id UUID)
RETURNS TABLE (
    campaign_info JSONB,
    conversion_funnel JSONB,
    platform_performance JSONB,
    retailer_summary JSONB,
    daily_metrics JSONB,
    notes JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        -- Campaign Info
        to_jsonb(bcc.*) as campaign_info,
        
        -- Conversion Funnel
        to_jsonb(cdm.*) as conversion_funnel,
        
        -- Platform Performance
        COALESCE(
            (SELECT jsonb_agg(to_jsonb(cpp.*)) 
             FROM campaign_platform_performance cpp 
             WHERE cpp.campaign_id = p_campaign_id), 
            '[]'::jsonb
        ) as platform_performance,
        
        -- Retailer Summary
        to_jsonb(crs.*) as retailer_summary,
        
        -- Daily Metrics
        COALESCE(
            (SELECT jsonb_agg(to_jsonb(cdaily.*)) 
             FROM campaign_daily_metrics cdaily 
             WHERE cdaily.campaign_id = p_campaign_id 
             ORDER BY cdaily.metric_date DESC LIMIT 30), 
            '[]'::jsonb
        ) as daily_metrics,
        
        -- Notes
        COALESCE(
            (SELECT jsonb_agg(to_jsonb(cn.*)) 
             FROM campaign_notes cn 
             WHERE cn.campaign_id = p_campaign_id), 
            '[]'::jsonb
        ) as notes
        
    FROM brand_campaign_cards bcc
    LEFT JOIN campaign_detailed_metrics cdm ON bcc.campaign_id = cdm.campaign_id
    LEFT JOIN campaign_retailer_summary crs ON bcc.campaign_id = crs.campaign_id
    WHERE bcc.campaign_id = p_campaign_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SCHEMA CREATION COMPLETE
-- =====================================================

-- Success message
SELECT 'Brand Campaign Dashboard Schema created successfully!' as status;