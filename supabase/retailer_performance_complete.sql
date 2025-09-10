-- Retailer Performance Complete Database Setup
-- This script creates all necessary tables and data for the retailer performance view

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS retailer_performance_metrics CASCADE;
DROP TABLE IF EXISTS retailer_engagement_history CASCADE;
DROP TABLE IF EXISTS retailer_targets CASCADE;
DROP TABLE IF EXISTS retailer_regions CASCADE;
DROP TABLE IF EXISTS retailer_performance_summary CASCADE;
DROP MATERIALIZED VIEW IF EXISTS retailer_performance_dashboard CASCADE;

-- Create retailer regions lookup table
CREATE TABLE retailer_regions (
    region_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_name VARCHAR(50) NOT NULL,
    region_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create retailer targets table
CREATE TABLE retailer_targets (
    target_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID NOT NULL,
    metric_name VARCHAR(50) NOT NULL,
    target_value DECIMAL(5,2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create main retailer performance metrics table
CREATE TABLE retailer_performance_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID NOT NULL,
    retailer_name VARCHAR(255) NOT NULL,
    region_id UUID REFERENCES retailer_regions(region_id),
    measurement_date DATE NOT NULL,
    measurement_period VARCHAR(20) DEFAULT 'daily', -- daily, weekly, monthly
    
    -- Email metrics
    emails_sent INTEGER DEFAULT 0,
    emails_delivered INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    emails_bounced INTEGER DEFAULT 0,
    
    -- Performance rates (stored as percentages)
    delivery_rate DECIMAL(5,2) DEFAULT 0,
    open_rate DECIMAL(5,2) DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Conversion and ROI metrics
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    revenue_generated DECIMAL(12,2) DEFAULT 0,
    roi_percentage DECIMAL(6,2) DEFAULT 0,
    
    -- Engagement metrics
    campaign_participation_count INTEGER DEFAULT 0,
    last_active_date TIMESTAMP,
    response_time_hours DECIMAL(6,2) DEFAULT 0,
    
    -- Performance indicators
    performance_grade VARCHAR(1) DEFAULT 'C', -- A, B, C, D, F
    needs_attention BOOLEAN DEFAULT FALSE,
    is_top_performer BOOLEAN DEFAULT FALSE,
    overall_rank INTEGER,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create retailer engagement history for trend analysis
CREATE TABLE retailer_engagement_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID NOT NULL,
    date_recorded DATE NOT NULL,
    
    -- Daily engagement metrics
    emails_sent_today INTEGER DEFAULT 0,
    opens_today INTEGER DEFAULT 0,
    clicks_today INTEGER DEFAULT 0,
    conversions_today INTEGER DEFAULT 0,
    revenue_today DECIMAL(10,2) DEFAULT 0,
    
    -- Cumulative metrics
    total_emails_sent INTEGER DEFAULT 0,
    total_opens INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    
    -- Performance indicators
    daily_roi DECIMAL(6,2) DEFAULT 0,
    cumulative_roi DECIMAL(6,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_retailer_performance_retailer_date ON retailer_performance_metrics(retailer_id, measurement_date);
CREATE INDEX idx_retailer_performance_date ON retailer_performance_metrics(measurement_date);
CREATE INDEX idx_retailer_performance_rank ON retailer_performance_metrics(overall_rank);
CREATE INDEX idx_retailer_performance_roi ON retailer_performance_metrics(roi_percentage);
CREATE INDEX idx_retailer_engagement_retailer_date ON retailer_engagement_history(retailer_id, date_recorded);

-- Insert region data
INSERT INTO retailer_regions (region_name, region_code) VALUES
('West', 'W'),
('East', 'E'),
('Central', 'C'),
('North', 'N'),
('South', 'S');

-- Insert retailer performance data matching the screenshot
INSERT INTO retailer_performance_metrics (
    retailer_id, retailer_name, region_id, measurement_date, 
    emails_sent, delivery_rate, open_rate, click_rate, conversion_rate,
    roi_percentage, performance_grade, is_top_performer, overall_rank,
    needs_attention, last_active_date
) VALUES
-- Top performers from screenshot
(gen_random_uuid(), 'Cartier Rodeo Drive', (SELECT region_id FROM retailer_regions WHERE region_code = 'W'), CURRENT_DATE,
 3848, 98.2, 45.7, 4.64, 1.15, 124.5, 'A', TRUE, 1, FALSE, '2025-01-15 14:30:00'),

(gen_random_uuid(), 'Betteridge NY', (SELECT region_id FROM retailer_regions WHERE region_code = 'E'), CURRENT_DATE,
 2685, 98.0, 42.9, 3.87, 0.95, 118.2, 'A', TRUE, 2, FALSE, '2025-01-14 16:45:00'),

(gen_random_uuid(), 'Westime LA', (SELECT region_id FROM retailer_regions WHERE region_code = 'W'), CURRENT_DATE,
 356, 98.1, 42.8, 3.69, 0.89, 115.7, 'A', TRUE, 3, FALSE, '2025-01-13 12:20:00'),

(gen_random_uuid(), 'Tourneau Times Square', (SELECT region_id FROM retailer_regions WHERE region_code = 'E'), CURRENT_DATE,
 1842, 98.0, 38.9, 3.27, 0.76, 108.4, 'B', FALSE, 4, FALSE, '2025-01-12 09:15:00'),

(gen_random_uuid(), 'Mayors Jewelry', (SELECT region_id FROM retailer_regions WHERE region_code = 'C'), CURRENT_DATE,
 1287, 98.0, 35.9, 2.78, 0.62, 95.3, 'B', FALSE, 5, FALSE, '2025-01-11 11:30:00'),

-- Additional retailers for comprehensive data
(gen_random_uuid(), 'Tiffany & Co Beverly Hills', (SELECT region_id FROM retailer_regions WHERE region_code = 'W'), CURRENT_DATE,
 4200, 97.8, 48.2, 5.12, 1.28, 132.7, 'A', TRUE, 6, FALSE, '2025-01-15 10:00:00'),

(gen_random_uuid(), 'Harry Winston NYC', (SELECT region_id FROM retailer_regions WHERE region_code = 'E'), CURRENT_DATE,
 2950, 97.5, 44.1, 4.85, 1.18, 128.9, 'A', TRUE, 7, FALSE, '2025-01-14 15:20:00'),

(gen_random_uuid(), 'Van Cleef & Arpels Chicago', (SELECT region_id FROM retailer_regions WHERE region_code = 'C'), CURRENT_DATE,
 1875, 96.9, 41.3, 4.22, 1.05, 121.6, 'A', TRUE, 8, FALSE, '2025-01-13 13:45:00'),

(gen_random_uuid(), 'Bulgari Miami', (SELECT region_id FROM retailer_regions WHERE region_code = 'S'), CURRENT_DATE,
 1650, 97.2, 39.8, 3.95, 0.98, 119.3, 'A', TRUE, 9, FALSE, '2025-01-12 14:10:00'),

(gen_random_uuid(), 'Chopard Dallas', (SELECT region_id FROM retailer_regions WHERE region_code = 'S'), CURRENT_DATE,
 1420, 96.8, 38.5, 3.78, 0.92, 116.8, 'A', TRUE, 10, FALSE, '2025-01-11 16:30:00'),

(gen_random_uuid(), 'Piaget Houston', (SELECT region_id FROM retailer_regions WHERE region_code = 'S'), CURRENT_DATE,
 1280, 96.5, 37.2, 3.61, 0.87, 114.2, 'A', TRUE, 11, FALSE, '2025-01-10 12:15:00'),

(gen_random_uuid(), 'Jaeger-LeCoultre Seattle', (SELECT region_id FROM retailer_regions WHERE region_code = 'W'), CURRENT_DATE,
 1150, 96.2, 36.8, 3.44, 0.83, 112.5, 'A', TRUE, 12, FALSE, '2025-01-09 11:45:00'),

-- Mid-tier performers
(gen_random_uuid(), 'Omega Boston', (SELECT region_id FROM retailer_regions WHERE region_code = 'E'), CURRENT_DATE,
 2100, 95.8, 34.5, 3.12, 0.75, 98.7, 'B', FALSE, 13, FALSE, '2025-01-08 10:20:00'),

(gen_random_uuid(), 'TAG Heuer Denver', (SELECT region_id FROM retailer_regions WHERE region_code = 'C'), CURRENT_DATE,
 1890, 95.5, 33.2, 2.98, 0.71, 94.3, 'B', FALSE, 14, FALSE, '2025-01-07 14:50:00'),

(gen_random_uuid(), 'Breitling Phoenix', (SELECT region_id FROM retailer_regions WHERE region_code = 'W'), CURRENT_DATE,
 1750, 95.1, 32.1, 2.85, 0.68, 91.8, 'B', FALSE, 15, FALSE, '2025-01-06 13:25:00'),

(gen_random_uuid(), 'IWC Portland', (SELECT region_id FROM retailer_regions WHERE region_code = 'W'), CURRENT_DATE,
 1620, 94.8, 31.5, 2.72, 0.64, 89.2, 'B', FALSE, 16, FALSE, '2025-01-05 15:40:00'),

(gen_random_uuid(), 'Panerai Atlanta', (SELECT region_id FROM retailer_regions WHERE region_code = 'S'), CURRENT_DATE,
 1480, 94.5, 30.8, 2.59, 0.61, 86.7, 'B', FALSE, 17, FALSE, '2025-01-04 12:30:00'),

(gen_random_uuid(), 'Tudor Minneapolis', (SELECT region_id FROM retailer_regions WHERE region_code = 'C'), CURRENT_DATE,
 1350, 94.2, 29.9, 2.46, 0.58, 84.1, 'B', FALSE, 18, FALSE, '2025-01-03 11:15:00'),

-- Lower performers (needs attention)
(gen_random_uuid(), 'Montblanc Nashville', (SELECT region_id FROM retailer_regions WHERE region_code = 'S'), CURRENT_DATE,
 1200, 93.8, 28.5, 2.31, 0.54, 78.9, 'C', FALSE, 19, TRUE, '2024-12-28 16:20:00'),

(gen_random_uuid(), 'Frederique Constant Salt Lake', (SELECT region_id FROM retailer_regions WHERE region_code = 'W'), CURRENT_DATE,
 1080, 93.5, 27.2, 2.18, 0.51, 75.6, 'C', FALSE, 20, TRUE, '2024-12-25 14:45:00'),

(gen_random_uuid(), 'Longines Kansas City', (SELECT region_id FROM retailer_regions WHERE region_code = 'C'), CURRENT_DATE,
 950, 93.1, 26.1, 2.05, 0.48, 72.3, 'C', FALSE, 21, TRUE, '2024-12-22 13:10:00'),

(gen_random_uuid(), 'Tissot Richmond', (SELECT region_id FROM retailer_regions WHERE region_code = 'E'), CURRENT_DATE,
 820, 92.8, 24.8, 1.92, 0.44, 68.7, 'C', FALSE, 22, TRUE, '2024-12-20 10:30:00'),

(gen_random_uuid(), 'Hamilton Buffalo', (SELECT region_id FROM retailer_regions WHERE region_code = 'E'), CURRENT_DATE,
 690, 92.4, 23.5, 1.79, 0.41, 65.2, 'C', FALSE, 23, TRUE, '2024-12-18 09:45:00'),

-- Inactive retailers
(gen_random_uuid(), 'Swatch Detroit', (SELECT region_id FROM retailer_regions WHERE region_code = 'C'), CURRENT_DATE,
 0, 0, 0, 0, 0, 0, 'F', FALSE, 24, TRUE, '2024-12-01 08:00:00'),

(gen_random_uuid(), 'Fossil Tampa', (SELECT region_id FROM retailer_regions WHERE region_code = 'S'), CURRENT_DATE,
 0, 0, 0, 0, 0, 0, 'F', FALSE, 25, TRUE, '2024-11-28 07:30:00');

-- Insert target data for retailers
INSERT INTO retailer_targets (retailer_id, metric_name, target_value, period_start, period_end)
SELECT 
    retailer_id,
    'click_rate',
    CASE 
        WHEN retailer_name LIKE '%Cartier%' THEN 5.8
        WHEN retailer_name LIKE '%Betteridge%' THEN 4.6
        ELSE 3.5
    END,
    '2025-01-01',
    '2025-12-31'
FROM retailer_performance_metrics;

-- Insert historical engagement data for trend analysis
INSERT INTO retailer_engagement_history (retailer_id, date_recorded, emails_sent_today, opens_today, clicks_today, conversions_today, revenue_today, daily_roi)
SELECT 
    retailer_id,
    CURRENT_DATE - INTERVAL '1 day' * generate_series(1, 30),
    FLOOR(emails_sent / 30 + RANDOM() * 20 - 10)::INTEGER,
    FLOOR(emails_sent * open_rate / 100 / 30 + RANDOM() * 5 - 2)::INTEGER,
    FLOOR(emails_sent * click_rate / 100 / 30 + RANDOM() * 2 - 1)::INTEGER,
    FLOOR(emails_sent * conversion_rate / 100 / 30 + RANDOM() * 1)::INTEGER,
    ROUND((emails_sent * conversion_rate / 100 / 30 * 150 + RANDOM() * 50 - 25)::NUMERIC, 2),
    ROUND((roi_percentage + RANDOM() * 20 - 10)::NUMERIC, 2)
FROM retailer_performance_metrics
WHERE emails_sent > 0;

-- Create materialized view for dashboard performance
CREATE MATERIALIZED VIEW retailer_performance_dashboard AS
SELECT 
    rpm.retailer_id,
    rpm.retailer_name,
    rr.region_name as region,
    rpm.emails_sent,
    rpm.delivery_rate,
    rpm.open_rate,
    rpm.click_rate,
    rpm.conversion_rate,
    rpm.roi_percentage,
    rpm.performance_grade,
    rpm.is_top_performer,
    rpm.needs_attention,
    rpm.overall_rank,
    rpm.last_active_date,
    rt.target_value as click_rate_target,
    
    -- Performance indicators
    CASE 
        WHEN rpm.click_rate >= rt.target_value THEN 'Above Target'
        WHEN rpm.click_rate >= rt.target_value * 0.9 THEN 'Near Target'
        ELSE 'Below Target'
    END as click_rate_status,
    
    -- Engagement level
    CASE 
        WHEN rpm.roi_percentage >= 120 THEN 'Excellent Performance'
        WHEN rpm.roi_percentage >= 100 THEN 'Good Performance'
        WHEN rpm.roi_percentage >= 80 THEN 'Average Performance'
        ELSE 'Improvement Required'
    END as performance_level,
    
    -- Activity status
    CASE 
        WHEN rpm.last_active_date >= CURRENT_DATE - INTERVAL '7 days' THEN 'Active'
        WHEN rpm.last_active_date >= CURRENT_DATE - INTERVAL '30 days' THEN 'Recently Active'
        ELSE 'Inactive'
    END as activity_status,
    
    rpm.measurement_date,
    rpm.created_at,
    rpm.updated_at
FROM retailer_performance_metrics rpm
LEFT JOIN retailer_regions rr ON rpm.region_id = rr.region_id
LEFT JOIN retailer_targets rt ON rpm.retailer_id = rt.retailer_id AND rt.metric_name = 'click_rate'
WHERE rpm.measurement_date = CURRENT_DATE
ORDER BY rpm.overall_rank;

-- Create summary statistics view
CREATE OR REPLACE VIEW retailer_performance_summary AS
SELECT 
    COUNT(*) FILTER (WHERE roi_percentage > 120) as top_retailers_count,
    COUNT(*) FILTER (WHERE roi_percentage < 80) as needs_attention_count,
    ROUND(AVG(roi_percentage), 1) as average_roi,
    COUNT(*) FILTER (WHERE last_active_date >= CURRENT_DATE - INTERVAL '30 days') as active_retailers,
    COUNT(*) as total_retailers,
    ROUND((COUNT(*) FILTER (WHERE last_active_date >= CURRENT_DATE - INTERVAL '30 days')::DECIMAL / COUNT(*) * 100), 1) as participation_rate,
    
    -- Performance distribution
    COUNT(*) FILTER (WHERE performance_grade = 'A') as grade_a_count,
    COUNT(*) FILTER (WHERE performance_grade = 'B') as grade_b_count,
    COUNT(*) FILTER (WHERE performance_grade = 'C') as grade_c_count,
    COUNT(*) FILTER (WHERE performance_grade IN ('D', 'F')) as grade_df_count,
    
    -- Engagement metrics
    ROUND(AVG(click_rate), 2) as average_click_rate,
    ROUND(AVG(open_rate), 2) as average_open_rate,
    ROUND(AVG(delivery_rate), 2) as average_delivery_rate,
    ROUND(AVG(conversion_rate), 2) as average_conversion_rate,
    
    CURRENT_DATE as summary_date
FROM retailer_performance_metrics
WHERE measurement_date = CURRENT_DATE;

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_retailer_performance_dashboard()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW retailer_performance_dashboard;
END;
$$ LANGUAGE plpgsql;

-- Create indexes on materialized view
CREATE INDEX idx_retailer_dashboard_rank ON retailer_performance_dashboard(overall_rank);
CREATE INDEX idx_retailer_dashboard_roi ON retailer_performance_dashboard(roi_percentage);
CREATE INDEX idx_retailer_dashboard_region ON retailer_performance_dashboard(region);
CREATE INDEX idx_retailer_dashboard_performance ON retailer_performance_dashboard(performance_level);

COMMIT;