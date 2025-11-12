-- =============================================
-- RETAILER PERFORMANCE DATABASE SETUP
-- Create tables and data for retailer performance view
-- =============================================

-- Create retailer performance metrics table
CREATE TABLE IF NOT EXISTS retailer_performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    retailer_id UUID REFERENCES users(id),
    
    -- Email Performance Metrics
    emails_sent INTEGER DEFAULT 0,
    emails_delivered INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    emails_bounced INTEGER DEFAULT 0,
    
    -- Calculated Rates (stored for performance)
    delivery_rate DECIMAL(5,2) DEFAULT 0,
    open_rate DECIMAL(5,2) DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    
    -- CRM/E-commerce Metrics
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    average_order_value DECIMAL(10,2) DEFAULT 0,
    
    -- Performance Scoring
    overall_rank INTEGER,
    region_rank INTEGER,
    performance_tier VARCHAR(50), -- 'Top', 'Good', 'Average', 'Needs Improvement'
    performance_score DECIMAL(5,2) DEFAULT 0,
    
    -- Time tracking
    last_activity_date TIMESTAMP WITH TIME ZONE,
    first_send_date TIMESTAMP WITH TIME ZONE,
    last_send_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create retailer engagement tracking table
CREATE TABLE IF NOT EXISTS retailer_engagement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID REFERENCES users(id),
    campaign_id UUID REFERENCES campaigns(id),
    
    -- Engagement Metrics
    website_visits INTEGER DEFAULT 0,
    product_views INTEGER DEFAULT 0,
    catalog_downloads INTEGER DEFAULT 0,
    social_shares INTEGER DEFAULT 0,
    
    -- Time-based Engagement
    avg_session_duration_minutes DECIMAL(8,2) DEFAULT 0,
    pages_per_session DECIMAL(5,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Behavioral Metrics
    repeat_visits INTEGER DEFAULT 0,
    referral_traffic INTEGER DEFAULT 0,
    direct_traffic INTEGER DEFAULT 0,
    
    -- Timestamps
    recorded_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create retailer targets table (for performance comparison)
CREATE TABLE IF NOT EXISTS retailer_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    retailer_id UUID REFERENCES users(id),
    campaign_id UUID REFERENCES campaigns(id),
    
    -- Target Metrics
    target_click_rate DECIMAL(5,2) DEFAULT 5.0,
    target_conversion_rate DECIMAL(5,2) DEFAULT 1.0,
    target_roi DECIMAL(5,2) DEFAULT 120.0,
    target_emails_per_month INTEGER DEFAULT 2000,
    
    -- Performance Thresholds
    excellent_threshold DECIMAL(5,2) DEFAULT 4.0,  -- Click rate for "Top Performer"
    good_threshold DECIMAL(5,2) DEFAULT 3.0,       -- Click rate for "Good"
    needs_attention_threshold DECIMAL(5,2) DEFAULT 2.0, -- Below this needs attention
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_retailer_performance_campaign ON retailer_performance_metrics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_retailer_performance_retailer ON retailer_performance_metrics(retailer_id);
CREATE INDEX IF NOT EXISTS idx_retailer_performance_rank ON retailer_performance_metrics(overall_rank);
CREATE INDEX IF NOT EXISTS idx_retailer_engagement_retailer ON retailer_engagement(retailer_id);
CREATE INDEX IF NOT EXISTS idx_retailer_engagement_date ON retailer_engagement(recorded_date);

-- =============================================
-- INSERT RETAILER PERFORMANCE DATA
-- Based on screenshot values
-- =============================================

-- Insert performance metrics for Marco Bicego campaign retailers
-- Top 5 retailers from screenshot with exact values
INSERT INTO retailer_performance_metrics (
    campaign_id, retailer_id, emails_sent, emails_delivered, emails_opened, emails_clicked,
    delivery_rate, open_rate, click_rate, conversions, conversion_rate, total_revenue,
    overall_rank, region_rank, performance_tier, performance_score, last_activity_date
) VALUES
-- #1 Cartier Rodeo Drive (West) - Top performer
('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440011', 
 3848, 3777, 1760, 178, 98.2, 46.6, 4.64, 44, 1.15, 52800.00, 1, 1, 'Top', 95.2, '2025-01-28 15:30:00+00'),

-- #2 Betteridge NY (East) - Second best
('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440001', 
 2685, 2631, 1129, 104, 98.0, 42.9, 3.87, 26, 0.95, 31200.00, 2, 1, 'Top', 88.5, '2025-01-27 14:20:00+00'),

-- #3 Westime LA (West) - Third place
('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440012', 
 366, 359, 154, 13, 98.1, 42.9, 3.69, 3, 0.89, 3600.00, 3, 2, 'Top', 85.1, '2025-01-26 16:45:00+00'),

-- #4 Tourneau Times Square (East) - Good performer
('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440002', 
 1842, 1805, 703, 59, 98.0, 38.9, 3.27, 18, 0.76, 21600.00, 4, 2, 'Good', 78.3, '2025-01-25 11:15:00+00'),

-- #5 Mayors Jewelry (Central) - Good performer
('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440007', 
 1287, 1261, 453, 35, 98.0, 35.9, 2.78, 11, 0.62, 13200.00, 5, 1, 'Good', 72.8, '2025-01-24 09:30:00+00'),

-- Additional retailers (6-15) with varied performance
('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440003', 
 1156, 1133, 408, 29, 98.0, 36.0, 2.56, 9, 0.58, 10800.00, 6, 3, 'Good', 69.2, '2025-01-23 13:45:00+00'),

('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440004', 
 1089, 1067, 373, 24, 98.0, 35.0, 2.25, 7, 0.52, 8400.00, 7, 4, 'Average', 65.8, '2025-01-22 10:20:00+00'),

('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440005', 
 987, 967, 329, 19, 98.0, 34.0, 1.96, 5, 0.45, 6000.00, 8, 5, 'Average', 62.1, '2025-01-21 16:10:00+00'),

('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440006', 
 892, 874, 297, 16, 98.0, 34.0, 1.83, 4, 0.42, 4800.00, 9, 2, 'Average', 58.9, '2025-01-20 12:55:00+00'),

('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440008', 
 756, 741, 237, 12, 98.0, 32.0, 1.62, 3, 0.38, 3600.00, 10, 3, 'Average', 55.4, '2025-01-19 14:30:00+00'),

('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440009', 
 689, 675, 216, 10, 98.0, 32.0, 1.48, 2, 0.35, 2400.00, 11, 4, 'Needs Improvement', 52.1, '2025-01-18 08:45:00+00'),

('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440010', 
 623, 610, 195, 8, 98.0, 32.0, 1.31, 2, 0.32, 1920.00, 12, 5, 'Needs Improvement', 48.7, '2025-01-17 17:20:00+00'),

('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440013', 
 567, 555, 178, 7, 98.0, 32.0, 1.26, 1, 0.28, 1400.00, 13, 3, 'Needs Improvement', 45.3, '2025-01-16 11:40:00+00'),

('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440014', 
 498, 488, 156, 5, 98.0, 32.0, 1.02, 1, 0.25, 1200.00, 14, 4, 'Needs Improvement', 42.8, '2025-01-15 19:15:00+00'),

('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '550e8400-e29b-41d4-a716-446655440015', 
 445, 436, 140, 4, 98.0, 32.0, 0.92, 1, 0.22, 960.00, 15, 5, 'Needs Improvement', 39.5, '2025-01-15 10:25:00+00');

-- Insert retailer engagement data for the past year (to support time filtering)
INSERT INTO retailer_engagement (retailer_id, campaign_id, website_visits, product_views, catalog_downloads, social_shares, avg_session_duration_minutes, recorded_date)
SELECT 
    u.id as retailer_id,
    '6b04371b-ef1b-49a4-a540-b1dbf59f9f54' as campaign_id,
    (50 + (RANDOM() * 200))::INTEGER as website_visits,
    (100 + (RANDOM() * 500))::INTEGER as product_views,
    (5 + (RANDOM() * 25))::INTEGER as catalog_downloads,
    (2 + (RANDOM() * 15))::INTEGER as social_shares,
    (3.5 + (RANDOM() * 8))::DECIMAL(8,2) as avg_session_duration_minutes,
    CURRENT_DATE - (RANDOM() * 365)::INTEGER as recorded_date
FROM users u
WHERE u.user_type = 'retailer'
CROSS JOIN generate_series(1, 30); -- 30 days of data per retailer

-- Insert retailer targets
INSERT INTO retailer_targets (retailer_id, campaign_id, target_click_rate, target_conversion_rate, target_roi)
SELECT 
    u.id as retailer_id,
    '6b04371b-ef1b-49a4-a540-b1dbf59f9f54' as campaign_id,
    CASE 
        WHEN u.region = 'West' THEN 5.0   -- Higher targets for West region
        WHEN u.region = 'East' THEN 4.5   -- Medium targets for East
        ELSE 4.0                          -- Standard targets for Central
    END as target_click_rate,
    1.0 as target_conversion_rate,
    120.0 as target_roi
FROM users u
WHERE u.user_type = 'retailer';

-- =============================================
-- CREATE RETAILER PERFORMANCE SUMMARY VIEW
-- =============================================

CREATE OR REPLACE VIEW retailer_performance_summary AS
SELECT 
    rpm.campaign_id,
    c.name as campaign_name,
    rpm.retailer_id,
    u.name as retailer_name,
    u.email as retailer_email,
    u.region,
    
    -- Email Performance
    rpm.emails_sent,
    rpm.emails_delivered,
    rpm.emails_opened,
    rpm.emails_clicked,
    rpm.delivery_rate,
    rpm.open_rate,
    rpm.click_rate,
    
    -- Conversion Performance
    rpm.conversions,
    rpm.conversion_rate,
    rpm.total_revenue,
    rpm.average_order_value,
    
    -- Rankings and Performance
    rpm.overall_rank,
    rpm.region_rank,
    rpm.performance_tier,
    rpm.performance_score,
    
    -- Targets and Comparison
    rt.target_click_rate,
    rt.target_conversion_rate,
    rt.target_roi,
    
    -- Performance vs Target
    CASE 
        WHEN rt.target_click_rate > 0 THEN ROUND((rpm.click_rate / rt.target_click_rate) * 100, 1)
        ELSE 0 
    END as click_rate_vs_target,
    
    -- Time Information
    rpm.last_activity_date,
    rpm.first_send_date,
    rpm.last_send_date,
    rpm.created_at,
    rpm.updated_at

FROM retailer_performance_metrics rpm
JOIN campaigns c ON rpm.campaign_id = c.id
JOIN users u ON rpm.retailer_id = u.id
LEFT JOIN retailer_targets rt ON rpm.retailer_id = rt.retailer_id AND rpm.campaign_id = rt.campaign_id
ORDER BY rpm.overall_rank;

-- =============================================
-- CREATE RETAILER METRICS SUMMARY VIEW
-- For the top metrics cards
-- =============================================

CREATE OR REPLACE VIEW retailer_metrics_summary AS
SELECT 
    campaign_id,
    
    -- Top Retailers (ROI > 120%)
    COUNT(*) FILTER (WHERE performance_score >= 80 AND click_rate >= 3.5) as top_retailers,
    
    -- Needs Attention (ROI < 80%)
    COUNT(*) FILTER (WHERE performance_score < 60 OR click_rate < 2.0) as needs_attention,
    
    -- Average ROI
    ROUND(AVG(
        CASE 
            WHEN total_revenue > 0 AND emails_sent > 0 
            THEN ((total_revenue - (emails_sent * 0.10)) / (emails_sent * 0.10)) * 100
            ELSE 0 
        END
    ), 1) as average_roi,
    
    -- Active Retailers (sent emails in last 30 days)
    COUNT(*) FILTER (WHERE last_activity_date >= CURRENT_DATE - INTERVAL '30 days') as active_retailers,
    
    -- Total Retailers
    COUNT(*) as total_retailers,
    
    -- Average Click Rate
    ROUND(AVG(click_rate), 2) as average_click_rate,
    
    -- Participation Rate
    ROUND((COUNT(*) FILTER (WHERE last_activity_date >= CURRENT_DATE - INTERVAL '30 days')::DECIMAL / COUNT(*)) * 100, 1) as participation_rate

FROM retailer_performance_metrics
GROUP BY campaign_id;

-- =============================================
-- ADD EXTRA TEST DATA FOR EDGE CASES
-- =============================================

-- Add 10 more retailers for testing edge cases
INSERT INTO users (id, email, name, user_type, region, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440017', 'contact@luxurywatches.com', 'Luxury Watches NYC', 'retailer', 'East', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440018', 'info@premiumjewels.com', 'Premium Jewels Miami', 'retailer', 'East', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440019', 'sales@elitetime.com', 'Elite Time Denver', 'retailer', 'Central', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440020', 'hello@finewatches.com', 'Fine Watches Austin', 'retailer', 'Central', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440021', 'contact@coastaljewelry.com', 'Coastal Jewelry San Diego', 'retailer', 'West', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440022', 'info@metropolitanjewels.com', 'Metropolitan Jewels', 'retailer', 'East', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440023', 'sales@midwestluxury.com', 'Midwest Luxury', 'retailer', 'Central', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440024', 'hello@pacificjewelers.com', 'Pacific Jewelers', 'retailer', 'West', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440025', 'contact@heritagewatches.com', 'Heritage Watches', 'retailer', 'East', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440026', 'info@modernluxury.com', 'Modern Luxury', 'retailer', 'West', '2024-12-01 10:00:00+00');

-- Add performance metrics for the additional retailers (ranks 16-25)
INSERT INTO retailer_performance_metrics (
    campaign_id, retailer_id, emails_sent, emails_delivered, emails_opened, emails_clicked,
    delivery_rate, open_rate, click_rate, conversions, conversion_rate, total_revenue,
    overall_rank, region_rank, performance_tier, performance_score, last_activity_date
)
SELECT 
    '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
    u.id,
    (200 + (RANDOM() * 400))::INTEGER as emails_sent,
    (190 + (RANDOM() * 380))::INTEGER as emails_delivered,
    (60 + (RANDOM() * 120))::INTEGER as emails_opened,
    (2 + (RANDOM() * 8))::INTEGER as emails_clicked,
    (96.0 + (RANDOM() * 3))::DECIMAL(5,2) as delivery_rate,
    (28.0 + (RANDOM() * 10))::DECIMAL(5,2) as open_rate,
    (0.8 + (RANDOM() * 1.5))::DECIMAL(5,2) as click_rate,
    (1 + (RANDOM() * 3))::INTEGER as conversions,
    (0.15 + (RANDOM() * 0.25))::DECIMAL(5,2) as conversion_rate,
    (600 + (RANDOM() * 2400))::DECIMAL(12,2) as total_revenue,
    (16 + ROW_NUMBER() OVER (ORDER BY u.created_at))::INTEGER as overall_rank,
    (ROW_NUMBER() OVER (PARTITION BY u.region ORDER BY u.created_at))::INTEGER as region_rank,
    CASE 
        WHEN RANDOM() < 0.2 THEN 'Good'
        WHEN RANDOM() < 0.6 THEN 'Average'
        ELSE 'Needs Improvement'
    END as performance_tier,
    (35.0 + (RANDOM() * 25))::DECIMAL(5,2) as performance_score,
    (CURRENT_DATE - (RANDOM() * 15)::INTEGER)::TIMESTAMP as last_activity_date
FROM users u
WHERE u.id IN (
    '550e8400-e29b-41d4-a716-446655440017', '550e8400-e29b-41d4-a716-446655440018',
    '550e8400-e29b-41d4-a716-446655440019', '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440024',
    '550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440026'
);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check retailer performance metrics
SELECT 'RETAILER PERFORMANCE METRICS' as section;
SELECT 
    COUNT(*) as total_retailers,
    COUNT(*) FILTER (WHERE performance_tier = 'Top') as top_performers,
    COUNT(*) FILTER (WHERE performance_tier = 'Needs Improvement') as needs_attention,
    ROUND(AVG(click_rate), 2) as avg_click_rate,
    COUNT(*) FILTER (WHERE last_activity_date >= CURRENT_DATE - INTERVAL '30 days') as active_retailers
FROM retailer_performance_metrics
WHERE campaign_id = '6b04371b-ef1b-49a4-a540-b1dbf59f9f54';

-- Show top 5 retailers
SELECT 'TOP 5 RETAILERS' as section;
SELECT 
    overall_rank,
    retailer_name,
    region,
    emails_sent,
    ROUND(delivery_rate, 1) as delivery_rate,
    ROUND(open_rate, 1) as open_rate,
    ROUND(click_rate, 2) as click_rate,
    ROUND(conversion_rate, 2) as conversion_rate
FROM retailer_performance_summary
WHERE campaign_id = '6b04371b-ef1b-49a4-a540-b1dbf59f9f54'
ORDER BY overall_rank
LIMIT 5;

-- Show metrics summary
SELECT 'METRICS SUMMARY' as section;
SELECT * FROM retailer_metrics_summary 
WHERE campaign_id = '6b04371b-ef1b-49a4-a540-b1dbf59f9f54';

SELECT 'Retailer performance data setup completed!' as status;