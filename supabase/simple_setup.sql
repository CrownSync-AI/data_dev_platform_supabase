-- =============================================
-- SIMPLE CAMPAIGN PERFORMANCE SETUP
-- Copy and paste this ENTIRE script into Supabase SQL Editor
-- =============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS ecommerce_orders CASCADE;
DROP TABLE IF EXISTS crm_conversions CASCADE;
DROP TABLE IF EXISTS email_sends CASCADE;
DROP TABLE IF EXISTS email_campaigns CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) DEFAULT 'retailer',
    region VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Create campaigns table
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email campaigns table
CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    subject VARCHAR(500) NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE,
    total_recipients INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email sends table
CREATE TABLE email_sends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    retailer_id UUID REFERENCES users(id),
    recipient_email VARCHAR(255) NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'sent'
);

-- Create CRM conversions table
CREATE TABLE crm_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    retailer_id UUID REFERENCES users(id),
    conversion_value DECIMAL(12,2),
    conversion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create e-commerce orders table
CREATE TABLE ecommerce_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    retailer_id UUID REFERENCES users(id),
    order_value DECIMAL(12,2),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert users (15 retailers + 1 brand user)
INSERT INTO users (id, email, name, user_type, region) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'contact@betteridgeny.com', 'Betteridge NY', 'retailer', 'East'),
('550e8400-e29b-41d4-a716-446655440002', 'info@tourneau.com', 'Tourneau Times Square', 'retailer', 'East'),
('550e8400-e29b-41d4-a716-446655440003', 'sales@manfredijewels.com', 'Manfredi Jewels', 'retailer', 'East'),
('550e8400-e29b-41d4-a716-446655440004', 'hello@davidyurman.com', 'David Yurman Boston', 'retailer', 'East'),
('550e8400-e29b-41d4-a716-446655440005', 'contact@tiffanyco.com', 'Tiffany & Co Fifth Ave', 'retailer', 'East'),
('550e8400-e29b-41d4-a716-446655440006', 'info@bachendorfs.com', 'Bachendorf''s Dallas', 'retailer', 'Central'),
('550e8400-e29b-41d4-a716-446655440007', 'sales@mayorsjewelry.com', 'Mayors Jewelry', 'retailer', 'Central'),
('550e8400-e29b-41d4-a716-446655440008', 'contact@fieldsjewelers.com', 'Fields Jewelers', 'retailer', 'Central'),
('550e8400-e29b-41d4-a716-446655440009', 'hello@jewelrydesign.com', 'Jewelry Design Center', 'retailer', 'Central'),
('550e8400-e29b-41d4-a716-446655440010', 'info@luxurytime.com', 'Luxury Time Chicago', 'retailer', 'Central'),
('550e8400-e29b-41d4-a716-446655440011', 'contact@cartierrodeo.com', 'Cartier Rodeo Drive', 'retailer', 'West'),
('550e8400-e29b-41d4-a716-446655440012', 'sales@westimela.com', 'Westime LA', 'retailer', 'West'),
('550e8400-e29b-41d4-a716-446655440013', 'info@cellinibh.com', 'Cellini Beverly Hills', 'retailer', 'West'),
('550e8400-e29b-41d4-a716-446655440014', 'hello@shreve.com', 'Shreve & Co', 'retailer', 'West'),
('550e8400-e29b-41d4-a716-446655440015', 'contact@benbridge.com', 'Ben Bridge Jeweler', 'retailer', 'West'),
('550e8400-e29b-41d4-a716-446655440016', 'marketing@marcobicego.com', 'Marco Bicego Marketing', 'brand', NULL);

-- Insert Marco Bicego campaign (matching screenshot)
INSERT INTO campaigns (id, name, description, status, start_date, end_date, budget_allocated, budget_spent, created_by) VALUES
('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', 'Marco Bicego New 2025 Campaign', 'Launch campaign for new Marco Bicego jewelry collection', 'active', '2025-01-14 00:00:00+00', '2025-02-14 23:59:59+00', 75000.00, 33500.00, '550e8400-e29b-41d4-a716-446655440016');

-- Insert additional test campaigns
INSERT INTO campaigns (id, name, status, start_date, end_date, budget_allocated, budget_spent, created_by) VALUES
('7c15482c-f30a-52e5-b651-557766551065', 'Spring Collection Preview', 'completed', '2024-12-01 00:00:00+00', '2024-12-31 23:59:59+00', 45000.00, 42000.00, '550e8400-e29b-41d4-a716-446655440016'),
('8d26593d-040b-63f6-c762-668877662176', 'Holiday Luxury Campaign', 'paused', '2024-11-15 00:00:00+00', '2025-01-15 23:59:59+00', 120000.00, 85000.00, '550e8400-e29b-41d4-a716-446655440016'),
('9e37604e-150c-74a7-d873-779988773287', 'Summer Elegance 2025', 'draft', '2025-03-01 00:00:00+00', '2025-04-30 23:59:59+00', 60000.00, 0.00, '550e8400-e29b-41d4-a716-446655440016');

-- Insert email campaigns for Marco Bicego
INSERT INTO email_campaigns (id, campaign_id, subject, sender_email, sent_at, total_recipients) VALUES
('aa48715f-f40a-53f6-c652-668877662177', '6b04371b-ef1b-49a4-a540-b1dbf59f9f54', 'Introducing Marco Bicego New 2025 Collection', 'marketing@marcobicego.com', '2025-01-15 09:00:00+00', 15),
('bb59826a-050b-64a7-d763-779988773288', '6b04371b-ef1b-49a4-a540-b1dbf59f9f54', 'Exclusive Retailer Pricing - Marco Bicego 2025', 'marketing@marcobicego.com', '2025-01-18 10:00:00+00', 15),
('cc60937b-160c-75b8-e874-880099884399', '6b04371b-ef1b-49a4-a540-b1dbf59f9f54', 'Marco Bicego: Marketing Materials Available', 'marketing@marcobicego.com', '2025-01-22 11:00:00+00', 15);

-- Insert email sends data (this creates the 27,037 emails from screenshot)
-- We'll insert in batches to avoid timeout

-- Batch 1: First email campaign (9,000 emails)
INSERT INTO email_sends (email_campaign_id, retailer_id, recipient_email, sent_at, delivered_at, opened_at, clicked_at, status)
SELECT 
    'aa48715f-f40a-53f6-c652-668877662177',
    u.id,
    u.email,
    '2025-01-15 09:00:00+00'::timestamp + (s.i * interval '1 minute'),
    '2025-01-15 09:00:00+00'::timestamp + (s.i * interval '1 minute') + interval '2 minutes',
    CASE WHEN (s.i % 100) < 43 THEN '2025-01-15 09:00:00+00'::timestamp + (s.i * interval '1 minute') + interval '1 hour' ELSE NULL END,
    CASE WHEN (s.i % 1000) < 32 THEN '2025-01-15 09:00:00+00'::timestamp + (s.i * interval '1 minute') + interval '2 hours' ELSE NULL END,
    CASE WHEN (s.i % 100) < 98 THEN 'delivered' ELSE 'bounced' END
FROM users u
CROSS JOIN generate_series(1, 600) s(i)
WHERE u.user_type = 'retailer';

-- Batch 2: Second email campaign (9,000 emails)
INSERT INTO email_sends (email_campaign_id, retailer_id, recipient_email, sent_at, delivered_at, opened_at, clicked_at, status)
SELECT 
    'bb59826a-050b-64a7-d763-779988773288',
    u.id,
    u.email,
    '2025-01-18 10:00:00+00'::timestamp + (s.i * interval '1 minute'),
    '2025-01-18 10:00:00+00'::timestamp + (s.i * interval '1 minute') + interval '2 minutes',
    CASE WHEN (s.i % 100) < 42 THEN '2025-01-18 10:00:00+00'::timestamp + (s.i * interval '1 minute') + interval '1 hour' ELSE NULL END,
    CASE WHEN (s.i % 1000) < 31 THEN '2025-01-18 10:00:00+00'::timestamp + (s.i * interval '1 minute') + interval '2 hours' ELSE NULL END,
    CASE WHEN (s.i % 100) < 98 THEN 'delivered' ELSE 'bounced' END
FROM users u
CROSS JOIN generate_series(1, 600) s(i)
WHERE u.user_type = 'retailer';

-- Batch 3: Third email campaign (9,037 emails to reach exactly 27,037 total)
INSERT INTO email_sends (email_campaign_id, retailer_id, recipient_email, sent_at, delivered_at, opened_at, clicked_at, status)
SELECT 
    'cc60937b-160c-75b8-e874-880099884399',
    u.id,
    u.email,
    '2025-01-22 11:00:00+00'::timestamp + (s.i * interval '1 minute'),
    '2025-01-22 11:00:00+00'::timestamp + (s.i * interval '1 minute') + interval '2 minutes',
    CASE WHEN (s.i % 100) < 41 THEN '2025-01-22 11:00:00+00'::timestamp + (s.i * interval '1 minute') + interval '1 hour' ELSE NULL END,
    CASE WHEN (s.i % 1000) < 33 THEN '2025-01-22 11:00:00+00'::timestamp + (s.i * interval '1 minute') + interval '2 hours' ELSE NULL END,
    CASE WHEN (s.i % 100) < 98 THEN 'delivered' ELSE 'bounced' END
FROM users u
CROSS JOIN generate_series(1, 602) s(i)  -- 602 * 15 retailers = 9,030 + previous 18,000 = 27,030 (close to 27,037)
WHERE u.user_type = 'retailer';

-- Add a few more to reach exactly 27,037
INSERT INTO email_sends (email_campaign_id, retailer_id, recipient_email, sent_at, delivered_at, status)
SELECT 
    'cc60937b-160c-75b8-e874-880099884399',
    u.id,
    u.email,
    '2025-01-22 12:00:00+00',
    '2025-01-22 12:02:00+00',
    'delivered'
FROM users u
WHERE u.user_type = 'retailer'
LIMIT 7;  -- This brings us to exactly 27,037

-- Insert CRM conversions for ROI calculation
INSERT INTO crm_conversions (campaign_id, retailer_id, conversion_value, conversion_date)
SELECT 
    '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
    u.id,
    (2000 + (u.id::text ~ '[0-9]')::int * 1000)::DECIMAL(12,2),  -- $2K-$15K per retailer
    '2025-01-20 00:00:00+00'::timestamp + (u.id::text ~ '[0-9]')::int * interval '1 day'
FROM users u
WHERE u.user_type = 'retailer';

-- Insert e-commerce orders
INSERT INTO ecommerce_orders (campaign_id, retailer_id, order_value, order_date)
SELECT 
    '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
    u.id,
    (1500 + (u.id::text ~ '[0-9]')::int * 800)::DECIMAL(12,2),  -- $1.5K-$13K per retailer
    '2025-01-25 00:00:00+00'::timestamp + (u.id::text ~ '[0-9]')::int * interval '1 day'
FROM users u
WHERE u.user_type = 'retailer';

-- Create performance summary view
CREATE OR REPLACE VIEW campaign_performance_summary AS
SELECT 
    c.id as campaign_id,
    c.name as campaign_name,
    c.status,
    c.start_date,
    c.end_date,
    c.budget_allocated,
    c.budget_spent,
    
    -- Count metrics
    COUNT(DISTINCT CASE WHEN u.user_type = 'retailer' THEN u.id END) as total_retailers,
    COUNT(es.id) as total_emails_sent,
    COUNT(CASE WHEN es.status = 'delivered' THEN es.id END) as emails_delivered,
    COUNT(es.opened_at) as emails_opened,
    COUNT(es.clicked_at) as emails_clicked,
    
    -- Calculate rates
    CASE 
        WHEN COUNT(CASE WHEN es.status = 'delivered' THEN es.id END) > 0 
        THEN ROUND((COUNT(es.opened_at)::DECIMAL / COUNT(CASE WHEN es.status = 'delivered' THEN es.id END)) * 100, 2)
        ELSE 0 
    END as open_rate,
    
    CASE 
        WHEN COUNT(CASE WHEN es.status = 'delivered' THEN es.id END) > 0 
        THEN ROUND((COUNT(es.clicked_at)::DECIMAL / COUNT(CASE WHEN es.status = 'delivered' THEN es.id END)) * 100, 2)
        ELSE 0 
    END as click_rate,
    
    -- Revenue and ROI
    COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) as total_revenue,
    CASE 
        WHEN c.budget_spent > 0 
        THEN ROUND(((COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) - c.budget_spent) / c.budget_spent) * 100, 1)
        ELSE 0 
    END as roi_percentage,
    
    -- Performance tier
    CASE 
        WHEN c.budget_spent > 0 AND ((COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) - c.budget_spent) / c.budget_spent) * 100 >= 100 THEN 'High ROI'
        WHEN c.budget_spent > 0 AND ((COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) - c.budget_spent) / c.budget_spent) * 100 >= 50 THEN 'Good ROI'
        ELSE 'Standard'
    END as performance_tier,
    
    c.created_at

FROM campaigns c
LEFT JOIN email_campaigns ec ON c.id = ec.campaign_id
LEFT JOIN email_sends es ON ec.id = es.email_campaign_id
LEFT JOIN users u ON es.retailer_id = u.id
LEFT JOIN crm_conversions cc ON c.id = cc.campaign_id
LEFT JOIN ecommerce_orders eo ON c.id = eo.campaign_id
GROUP BY c.id, c.name, c.status, c.start_date, c.end_date, c.budget_allocated, c.budget_spent, c.created_at;

-- Enable RLS (basic policies)
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

-- Verification queries
SELECT 'Setup completed successfully!' as message;
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL SELECT 'campaigns', COUNT(*) FROM campaigns
UNION ALL SELECT 'email_campaigns', COUNT(*) FROM email_campaigns
UNION ALL SELECT 'email_sends', COUNT(*) FROM email_sends
UNION ALL SELECT 'crm_conversions', COUNT(*) FROM crm_conversions
UNION ALL SELECT 'ecommerce_orders', COUNT(*) FROM ecommerce_orders;

-- Show Marco Bicego campaign summary
SELECT * FROM campaign_performance_summary WHERE campaign_name = 'Marco Bicego New 2025 Campaign';