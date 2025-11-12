-- =============================================
-- COMPLETE CAMPAIGN PERFORMANCE SETUP
-- Run this entire script in Supabase SQL Editor
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- DROP EXISTING TABLES (if any)
-- =============================================
DROP TABLE IF EXISTS ecommerce_orders CASCADE;
DROP TABLE IF EXISTS crm_conversions CASCADE;
DROP TABLE IF EXISTS email_sends CASCADE;
DROP TABLE IF EXISTS email_campaigns CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP VIEW IF EXISTS campaign_performance_summary CASCADE;

-- =============================================
-- CREATE TABLES
-- =============================================

-- Users table (simplified for retailers and brand users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) DEFAULT 'retailer',
    region VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget_allocated DECIMAL(12,2),
    budget_spent DECIMAL(12,2) DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email campaigns linked to main campaigns
CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    subject VARCHAR(500) NOT NULL,
    content TEXT,
    sender_email VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE,
    total_recipients INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual email sends for tracking
CREATE TABLE email_sends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    retailer_id UUID REFERENCES users(id),
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'sent',
    bounce_reason TEXT
);

-- CRM data for ROI calculations
CREATE TABLE crm_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    retailer_id UUID REFERENCES users(id),
    email_send_id UUID REFERENCES email_sends(id),
    conversion_type VARCHAR(50),
    conversion_value DECIMAL(12,2),
    conversion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    product_category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-commerce integration data
CREATE TABLE ecommerce_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    retailer_id UUID REFERENCES users(id),
    order_value DECIMAL(12,2),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    product_count INTEGER DEFAULT 1,
    order_status VARCHAR(50) DEFAULT 'completed',
    attributed_to_email BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CREATE INDEXES
-- =============================================
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_region ON users(region);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_email_sends_campaign ON email_sends(email_campaign_id);
CREATE INDEX idx_email_sends_retailer ON email_sends(retailer_id);
CREATE INDEX idx_email_sends_status ON email_sends(status);
CREATE INDEX idx_email_sends_dates ON email_sends(sent_at, clicked_at);
CREATE INDEX idx_crm_conversions_campaign ON crm_conversions(campaign_id);
CREATE INDEX idx_ecommerce_orders_campaign ON ecommerce_orders(campaign_id);

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

-- Users (15 retailers + 1 brand user)
INSERT INTO users (id, email, name, user_type, region, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'contact@betteridgeny.com', 'Betteridge NY', 'retailer', 'East', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'info@tourneau.com', 'Tourneau Times Square', 'retailer', 'East', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'sales@manfredijewels.com', 'Manfredi Jewels', 'retailer', 'East', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440004', 'hello@davidyurman.com', 'David Yurman Boston', 'retailer', 'East', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440005', 'contact@tiffanyco.com', 'Tiffany & Co Fifth Ave', 'retailer', 'East', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440006', 'info@bachendorfs.com', 'Bachendorf''s Dallas', 'retailer', 'Central', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440007', 'sales@mayorsjewelry.com', 'Mayors Jewelry', 'retailer', 'Central', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440008', 'contact@fieldsjewelers.com', 'Fields Jewelers', 'retailer', 'Central', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440009', 'hello@jewelrydesign.com', 'Jewelry Design Center', 'retailer', 'Central', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440010', 'info@luxurytime.com', 'Luxury Time Chicago', 'retailer', 'Central', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440011', 'contact@cartierrodeo.com', 'Cartier Rodeo Drive', 'retailer', 'West', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440012', 'sales@westimela.com', 'Westime LA', 'retailer', 'West', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440013', 'info@cellinibh.com', 'Cellini Beverly Hills', 'retailer', 'West', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440014', 'hello@shreve.com', 'Shreve & Co', 'retailer', 'West', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440015', 'contact@benbridge.com', 'Ben Bridge Jeweler', 'retailer', 'West', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440016', 'marketing@marcobicego.com', 'Marco Bicego Marketing', 'brand', NULL, '2024-12-01 09:00:00+00');

-- Campaigns
INSERT INTO campaigns (id, name, description, status, start_date, end_date, budget_allocated, budget_spent, created_by, created_at) VALUES
('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', 'Marco Bicego New 2025 Campaign', 'Launch campaign for new Marco Bicego jewelry collection targeting luxury retailers', 'active', '2025-01-14 00:00:00+00', '2025-02-14 23:59:59+00', 75000.00, 33500.00, '550e8400-e29b-41d4-a716-446655440016', '2025-01-10 10:00:00+00'),
('7c15482c-f3a-52e5-b651-557766551065', 'Spring Collection Preview', 'Early preview campaign for spring jewelry collection', 'completed', '2024-12-01 00:00:00+00', '2024-12-31 23:59:59+00', 45000.00, 42000.00, '550e8400-e29b-41d4-a716-446655440016', '2024-11-25 10:00:00+00'),
('8d26593d-04b-63f6-c762-668877662176', 'Holiday Luxury Campaign', 'Premium holiday campaign for high-end pieces', 'paused', '2024-11-15 00:00:00+00', '2025-01-15 23:59:59+00', 120000.00, 85000.00, '550e8400-e29b-41d4-a716-446655440016', '2024-11-10 10:00:00+00'),
('9e37604e-15c-74g7-d873-779988773287', 'Summer Elegance 2025', 'Upcoming summer campaign preparation', 'draft', '2025-03-01 00:00:00+00', '2025-04-30 23:59:59+00', 60000.00, 0.00, '550e8400-e29b-41d4-a716-446655440016', '2025-01-05 10:00:00+00');

-- Email campaigns
INSERT INTO email_campaigns (id, campaign_id, subject, content, sender_email, sender_name, sent_at, total_recipients, created_at) VALUES
('aa48715f-f4a-53f6-c652-668877662177', '6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '✨ Introducing Marco Bicego New 2025 Collection', 'Discover the latest luxury pieces from Marco Bicego...', 'marketing@marcobicego.com', 'Marco Bicego', '2025-01-15 09:00:00+00', 15, '2025-01-14 16:00:00+00'),
('bb59826g-05b-64g7-d763-779988773288', '6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '🎯 Exclusive Retailer Pricing - Marco Bicego 2025', 'Special wholesale pricing for our retail partners...', 'marketing@marcobicego.com', 'Marco Bicego', '2025-01-18 10:00:00+00', 15, '2025-01-17 14:00:00+00'),
('cc60937h-16c-75h8-e874-880099884399', '6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '💎 Marco Bicego: Marketing Materials Available', 'Download high-resolution images and marketing assets...', 'marketing@marcobicego.com', 'Marco Bicego', '2025-01-22 11:00:00+00', 15, '2025-01-21 15:00:00+00');

-- Create a function to generate email sends data
CREATE OR REPLACE FUNCTION generate_email_sends() RETURNS void AS $$
DECLARE
    retailer_record RECORD;
    campaign_record RECORD;
    send_count INTEGER;
    i INTEGER;
BEGIN
    -- Generate email sends for Marco Bicego campaign
    FOR campaign_record IN SELECT id FROM email_campaigns WHERE campaign_id = '6b04371b-ef1b-49a4-a540-b1dbf59f9f54' LOOP
        FOR retailer_record IN SELECT id, email, name FROM users WHERE user_type = 'retailer' LOOP
            -- Each retailer gets 600-602 emails per campaign (total ~27,000)
            send_count := 600 + (random() * 3)::INTEGER;
            
            FOR i IN 1..send_count LOOP
                INSERT INTO email_sends (
                    email_campaign_id, 
                    retailer_id, 
                    recipient_email, 
                    recipient_name, 
                    sent_at, 
                    delivered_at, 
                    opened_at, 
                    clicked_at, 
                    status
                ) VALUES (
                    campaign_record.id,
                    retailer_record.id,
                    retailer_record.email,
                    retailer_record.name,
                    '2025-01-15 09:00:00+00'::timestamp + (random() * interval '10 days'),
                    '2025-01-15 09:00:00+00'::timestamp + (random() * interval '10 days') + interval '1 hour',
                    CASE WHEN random() < 0.43 THEN '2025-01-15 09:00:00+00'::timestamp + (random() * interval '11 days') ELSE NULL END,
                    CASE WHEN random() < 0.032 THEN '2025-01-15 09:00:00+00'::timestamp + (random() * interval '12 days') ELSE NULL END,
                    CASE WHEN random() < 0.98 THEN 'delivered' ELSE 'bounced' END
                );
            END LOOP;
        END LOOP;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to generate email sends
SELECT generate_email_sends();

-- Drop the function after use
DROP FUNCTION generate_email_sends();

-- Generate CRM conversions (for ROI calculation)
INSERT INTO crm_conversions (campaign_id, retailer_id, conversion_type, conversion_value, conversion_date, product_category)
SELECT 
    '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
    u.id,
    CASE 
        WHEN random() < 0.7 THEN 'sale'
        WHEN random() < 0.9 THEN 'lead'
        ELSE 'signup'
    END,
    CASE 
        WHEN random() < 0.7 THEN (random() * 8000 + 2000)::DECIMAL(12,2)
        WHEN random() < 0.9 THEN (random() * 1500 + 500)::DECIMAL(12,2)
        ELSE (random() * 300 + 100)::DECIMAL(12,2)
    END,
    '2025-01-15 00:00:00+00'::timestamp + (random() * interval '20 days'),
    CASE 
        WHEN random() < 0.4 THEN 'Necklaces'
        WHEN random() < 0.7 THEN 'Bracelets'
        WHEN random() < 0.9 THEN 'Earrings'
        ELSE 'Rings'
    END
FROM users u
WHERE u.user_type = 'retailer'
    AND random() < 0.8; -- 80% of retailers have conversions

-- Generate e-commerce orders
INSERT INTO ecommerce_orders (campaign_id, retailer_id, order_value, order_date, product_count, attributed_to_email)
SELECT 
    '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
    u.id,
    (random() * 5000 + 1000)::DECIMAL(12,2),
    '2025-01-15 00:00:00+00'::timestamp + (random() * interval '20 days'),
    (random() * 3 + 1)::INTEGER,
    random() < 0.6
FROM users u
WHERE u.user_type = 'retailer'
    AND random() < 0.9
CROSS JOIN generate_series(1, (random() * 4 + 1)::INTEGER);

-- =============================================
-- CREATE PERFORMANCE VIEW
-- =============================================

CREATE OR REPLACE VIEW campaign_performance_summary AS
SELECT 
    c.id as campaign_id,
    c.name as campaign_name,
    c.status,
    c.start_date,
    c.end_date,
    c.budget_allocated,
    c.budget_spent,
    
    -- Email metrics
    COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'retailer') as total_retailers,
    COUNT(es.id) as total_emails_sent,
    COUNT(es.id) FILTER (WHERE es.status = 'delivered') as emails_delivered,
    COUNT(es.id) FILTER (WHERE es.opened_at IS NOT NULL) as emails_opened,
    COUNT(es.id) FILTER (WHERE es.clicked_at IS NOT NULL) as emails_clicked,
    
    -- Calculated rates
    CASE 
        WHEN COUNT(es.id) FILTER (WHERE es.status = 'delivered') > 0 
        THEN ROUND((COUNT(es.id) FILTER (WHERE es.opened_at IS NOT NULL)::DECIMAL / COUNT(es.id) FILTER (WHERE es.status = 'delivered')) * 100, 2)
        ELSE 0 
    END as open_rate,
    
    CASE 
        WHEN COUNT(es.id) FILTER (WHERE es.status = 'delivered') > 0 
        THEN ROUND((COUNT(es.id) FILTER (WHERE es.clicked_at IS NOT NULL)::DECIMAL / COUNT(es.id) FILTER (WHERE es.status = 'delivered')) * 100, 2)
        ELSE 0 
    END as click_rate,
    
    -- Revenue and ROI calculations
    COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) as total_revenue,
    CASE 
        WHEN c.budget_spent > 0 
        THEN ROUND(((COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) - c.budget_spent) / c.budget_spent) * 100, 1)
        ELSE 0 
    END as roi_percentage,
    
    -- Performance tier based on ROI
    CASE 
        WHEN c.budget_spent > 0 AND ((COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) - c.budget_spent) / c.budget_spent) * 100 >= 100 THEN 'High ROI'
        WHEN c.budget_spent > 0 AND ((COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) - c.budget_spent) / c.budget_spent) * 100 >= 50 THEN 'Good ROI'
        ELSE 'Standard'
    END as performance_tier,
    
    c.created_at,
    c.updated_at

FROM campaigns c
LEFT JOIN email_campaigns ec ON c.id = ec.campaign_id
LEFT JOIN email_sends es ON ec.id = es.email_campaign_id
LEFT JOIN users u ON es.retailer_id = u.id
LEFT JOIN crm_conversions cc ON c.id = cc.campaign_id
LEFT JOIN ecommerce_orders eo ON c.id = eo.campaign_id
GROUP BY c.id, c.name, c.status, c.start_date, c.end_date, c.budget_allocated, c.budget_spent, c.created_at, c.updated_at;

-- =============================================
-- ENABLE ROW LEVEL SECURITY
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for read access
CREATE POLICY "Allow read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON email_campaigns FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON email_sends FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON crm_conversions FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON ecommerce_orders FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Service role full access" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access" ON campaigns FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access" ON email_campaigns FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access" ON email_sends FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access" ON crm_conversions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access" ON ecommerce_orders FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check data counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'campaigns', COUNT(*) FROM campaigns
UNION ALL SELECT 'email_campaigns', COUNT(*) FROM email_campaigns
UNION ALL SELECT 'email_sends', COUNT(*) FROM email_sends
UNION ALL SELECT 'crm_conversions', COUNT(*) FROM crm_conversions
UNION ALL SELECT 'ecommerce_orders', COUNT(*) FROM ecommerce_orders;

-- Check campaign performance summary
SELECT * FROM campaign_performance_summary WHERE campaign_name = 'Marco Bicego New 2025 Campaign';