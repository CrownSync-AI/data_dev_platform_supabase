-- =============================================
-- SAMPLE DATA FOR CAMPAIGN PERFORMANCE
-- Based on screenshot and realistic luxury brand scenarios
-- =============================================

BEGIN;

-- =============================================
-- USERS DATA (Retailers across regions)
-- =============================================

INSERT INTO users (id, email, name, user_type, region, created_at) VALUES
-- East Region Retailers
('550e8400-e29b-41d4-a716-446655440001', 'contact@betteridgeny.com', 'Betteridge NY', 'retailer', 'East', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440002', 'info@tourneau.com', 'Tourneau Times Square', 'retailer', 'East', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440003', 'sales@manfredijewels.com', 'Manfredi Jewels', 'retailer', 'East', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440004', 'hello@davidyurman.com', 'David Yurman Boston', 'retailer', 'East', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440005', 'contact@tiffanyco.com', 'Tiffany & Co Fifth Ave', 'retailer', 'East', '2024-12-01 10:00:00+00'),

-- Central Region Retailers  
('550e8400-e29b-41d4-a716-446655440006', 'info@bachendorfs.com', 'Bachendorf''s Dallas', 'retailer', 'Central', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440007', 'sales@mayorsjewelry.com', 'Mayors Jewelry', 'retailer', 'Central', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440008', 'contact@fieldsjewelers.com', 'Fields Jewelers', 'retailer', 'Central', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440009', 'hello@jewelrydesign.com', 'Jewelry Design Center', 'retailer', 'Central', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440010', 'info@luxurytime.com', 'Luxury Time Chicago', 'retailer', 'Central', '2024-12-01 10:00:00+00'),

-- West Region Retailers
('550e8400-e29b-41d4-a716-446655440011', 'contact@cartierrodeo.com', 'Cartier Rodeo Drive', 'retailer', 'West', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440012', 'sales@westimela.com', 'Westime LA', 'retailer', 'West', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440013', 'info@cellinibh.com', 'Cellini Beverly Hills', 'retailer', 'West', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440014', 'hello@shreve.com', 'Shreve & Co', 'retailer', 'West', '2024-12-01 10:00:00+00'),
('550e8400-e29b-41d4-a716-446655440015', 'contact@benbridge.com', 'Ben Bridge Jeweler', 'retailer', 'West', '2024-12-01 10:00:00+00'),

-- Brand user
('550e8400-e29b-41d4-a716-446655440016', 'marketing@marcobicego.com', 'Marco Bicego Marketing', 'brand', NULL, '2024-12-01 09:00:00+00');

-- =============================================
-- CAMPAIGNS DATA
-- =============================================

-- Main Marco Bicego campaign from screenshot
INSERT INTO campaigns (id, name, description, status, start_date, end_date, budget_allocated, budget_spent, created_by, created_at) VALUES
('6b04371b-ef1b-49a4-a540-b1dbf59f9f54', 'Marco Bicego New 2025 Campaign', 'Launch campaign for new Marco Bicego jewelry collection targeting luxury retailers', 'active', '2025-01-14 00:00:00+00', '2025-02-14 23:59:59+00', 75000.00, 33500.00, '550e8400-e29b-41d4-a716-446655440016', '2025-01-10 10:00:00+00');

-- Additional campaigns for testing edge cases
INSERT INTO campaigns (id, name, description, status, start_date, end_date, budget_allocated, budget_spent, created_by, created_at) VALUES
('7c15482c-f3a-52e5-b651-557766551065', 'Spring Collection Preview', 'Early preview campaign for spring jewelry collection', 'completed', '2024-12-01 00:00:00+00', '2024-12-31 23:59:59+00', 45000.00, 42000.00, '550e8400-e29b-41d4-a716-446655440016', '2024-11-25 10:00:00+00'),
('8d26593d-04b-63f6-c762-668877662176', 'Holiday Luxury Campaign', 'Premium holiday campaign for high-end pieces', 'paused', '2024-11-15 00:00:00+00', '2025-01-15 23:59:59+00', 120000.00, 85000.00, '550e8400-e29b-41d4-a716-446655440016', '2024-11-10 10:00:00+00'),
('9e37604e-15c-74g7-d873-779988773287', 'Summer Elegance 2025', 'Upcoming summer campaign preparation', 'draft', '2025-03-01 00:00:00+00', '2025-04-30 23:59:59+00', 60000.00, 0.00, '550e8400-e29b-41d4-a716-446655440016', '2025-01-05 10:00:00+00');

-- =============================================
-- EMAIL CAMPAIGNS DATA
-- =============================================

-- Email campaigns for Marco Bicego New 2025 Campaign
INSERT INTO email_campaigns (id, campaign_id, subject, content, sender_email, sender_name, sent_at, total_recipients, created_at) VALUES
('aa48715f-f4a-53f6-c652-668877662177', '6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '✨ Introducing Marco Bicego New 2025 Collection', 'Discover the latest luxury pieces from Marco Bicego...', 'marketing@marcobicego.com', 'Marco Bicego', '2025-01-15 09:00:00+00', 15, '2025-01-14 16:00:00+00'),
('bb59826g-05b-64g7-d763-779988773288', '6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '🎯 Exclusive Retailer Pricing - Marco Bicego 2025', 'Special wholesale pricing for our retail partners...', 'marketing@marcobicego.com', 'Marco Bicego', '2025-01-18 10:00:00+00', 15, '2025-01-17 14:00:00+00'),
('cc60937h-16c-75h8-e874-880099884399', '6b04371b-ef1b-49a4-a540-b1dbf59f9f54', '💎 Marco Bicego: Marketing Materials Available', 'Download high-resolution images and marketing assets...', 'marketing@marcobicego.com', 'Marco Bicego', '2025-01-22 11:00:00+00', 15, '2025-01-21 15:00:00+00');

-- Email campaigns for other campaigns
INSERT INTO email_campaigns (id, campaign_id, subject, content, sender_email, sender_name, sent_at, total_recipients, created_at) VALUES
('dd71048i-27d-86i9-f985-991100995500', '7c15482c-f3a-52e5-b651-557766551065', 'Spring Collection Early Access', 'Get first access to our spring collection...', 'marketing@marcobicego.com', 'Marco Bicego', '2024-12-02 09:00:00+00', 15, '2024-12-01 16:00:00+00'),
('ee82159j-38e-97j0-0a96-002211006611', '8d26593d-04b-63f6-c762-668877662176', 'Holiday Luxury Collection Launch', 'Premium pieces for the holiday season...', 'marketing@marcobicego.com', 'Marco Bicego', '2024-11-16 09:00:00+00', 15, '2024-11-15 16:00:00+00');

-- =============================================
-- EMAIL SENDS DATA (Detailed tracking)
-- =============================================

-- Generate realistic email sends for Marco Bicego New 2025 Campaign
-- This will create the 27,037 total emails shown in screenshot

-- First email campaign sends (9,012 emails)
INSERT INTO email_sends (id, email_campaign_id, retailer_id, recipient_email, recipient_name, sent_at, delivered_at, opened_at, clicked_at, status)
SELECT 
    uuid_generate_v4(),
    'aa48715f-f4a-53f6-c652-668877662177',
    u.id,
    u.email,
    u.name,
    '2025-01-15 09:00:00+00'::timestamp + (random() * interval '2 hours'),
    '2025-01-15 09:00:00+00'::timestamp + (random() * interval '4 hours'),
    CASE WHEN random() < 0.45 THEN '2025-01-15 09:00:00+00'::timestamp + (random() * interval '24 hours') ELSE NULL END,
    CASE WHEN random() < 0.032 THEN '2025-01-15 09:00:00+00'::timestamp + (random() * interval '48 hours') ELSE NULL END,
    CASE WHEN random() < 0.98 THEN 'delivered' ELSE 'bounced' END
FROM users u 
WHERE u.user_type = 'retailer'
CROSS JOIN generate_series(1, 601); -- 15 retailers * 601 = 9,015 emails

-- Second email campaign sends (9,011 emails)  
INSERT INTO email_sends (id, email_campaign_id, retailer_id, recipient_email, recipient_name, sent_at, delivered_at, opened_at, clicked_at, status)
SELECT 
    uuid_generate_v4(),
    'bb59826g-05b-64g7-d763-779988773288',
    u.id,
    u.email,
    u.name,
    '2025-01-18 10:00:00+00'::timestamp + (random() * interval '2 hours'),
    '2025-01-18 10:00:00+00'::timestamp + (random() * interval '4 hours'),
    CASE WHEN random() < 0.42 THEN '2025-01-18 10:00:00+00'::timestamp + (random() * interval '24 hours') ELSE NULL END,
    CASE WHEN random() < 0.031 THEN '2025-01-18 10:00:00+00'::timestamp + (random() * interval '48 hours') ELSE NULL END,
    CASE WHEN random() < 0.98 THEN 'delivered' ELSE 'bounced' END
FROM users u 
WHERE u.user_type = 'retailer'
CROSS JOIN generate_series(1, 600); -- 15 retailers * 600 = 9,000 emails

-- Third email campaign sends (9,014 emails)
INSERT INTO email_sends (id, email_campaign_id, retailer_id, recipient_email, recipient_name, sent_at, delivered_at, opened_at, clicked_at, status)
SELECT 
    uuid_generate_v4(),
    'cc60937h-16c-75h8-e874-880099884399',
    u.id,
    u.email,
    u.name,
    '2025-01-22 11:00:00+00'::timestamp + (random() * interval '2 hours'),
    '2025-01-22 11:00:00+00'::timestamp + (random() * interval '4 hours'),
    CASE WHEN random() < 0.41 THEN '2025-01-22 11:00:00+00'::timestamp + (random() * interval '24 hours') ELSE NULL END,
    CASE WHEN random() < 0.033 THEN '2025-01-22 11:00:00+00'::timestamp + (random() * interval '48 hours') ELSE NULL END,
    CASE WHEN random() < 0.98 THEN 'delivered' ELSE 'bounced' END
FROM users u 
WHERE u.user_type = 'retailer'
CROSS JOIN generate_series(1, 601); -- 15 retailers * 601 = 9,015 emails

-- =============================================
-- CRM CONVERSIONS DATA (Simulated future integration)
-- =============================================

-- Generate realistic conversion data for ROI calculation
INSERT INTO crm_conversions (id, campaign_id, retailer_id, email_send_id, conversion_type, conversion_value, conversion_date, product_category, created_at)
SELECT 
    uuid_generate_v4(),
    '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
    u.id,
    es.id,
    CASE 
        WHEN random() < 0.7 THEN 'sale'
        WHEN random() < 0.9 THEN 'lead'
        ELSE 'signup'
    END,
    CASE 
        WHEN random() < 0.7 THEN (random() * 8000 + 2000)::DECIMAL(12,2) -- Sales: $2K-$10K
        WHEN random() < 0.9 THEN (random() * 1500 + 500)::DECIMAL(12,2)  -- Leads: $500-$2K
        ELSE (random() * 300 + 100)::DECIMAL(12,2)                       -- Signups: $100-$400
    END,
    es.clicked_at + (random() * interval '7 days'),
    CASE 
        WHEN random() < 0.4 THEN 'Necklaces'
        WHEN random() < 0.7 THEN 'Bracelets'
        WHEN random() < 0.9 THEN 'Earrings'
        ELSE 'Rings'
    END,
    NOW()
FROM users u
JOIN email_sends es ON u.id = es.retailer_id
JOIN email_campaigns ec ON es.email_campaign_id = ec.id
WHERE u.user_type = 'retailer' 
    AND ec.campaign_id = '6b04371b-ef1b-49a4-a540-b1dbf59f9f54'
    AND es.clicked_at IS NOT NULL
    AND random() < 0.25; -- 25% of clicks convert

-- =============================================
-- E-COMMERCE ORDERS DATA (Simulated future integration)
-- =============================================

-- Generate e-commerce order data for additional ROI
INSERT INTO ecommerce_orders (id, campaign_id, retailer_id, order_value, order_date, product_count, order_status, attributed_to_email, created_at)
SELECT 
    uuid_generate_v4(),
    '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
    u.id,
    (random() * 5000 + 1000)::DECIMAL(12,2), -- Orders: $1K-$6K
    '2025-01-15 00:00:00+00'::timestamp + (random() * interval '20 days'),
    (random() * 3 + 1)::INTEGER, -- 1-4 products per order
    CASE WHEN random() < 0.95 THEN 'completed' ELSE 'pending' END,
    random() < 0.6, -- 60% attributed to email
    NOW()
FROM users u
WHERE u.user_type = 'retailer'
    AND random() < 0.8 -- 80% of retailers have orders
CROSS JOIN generate_series(1, (random() * 5 + 1)::INTEGER); -- 1-6 orders per retailer

-- =============================================
-- ADDITIONAL TEST DATA FOR EDGE CASES
-- =============================================

-- Add data for completed campaign
INSERT INTO email_sends (id, email_campaign_id, retailer_id, recipient_email, recipient_name, sent_at, delivered_at, opened_at, clicked_at, status)
SELECT 
    uuid_generate_v4(),
    'dd71048i-27d-86i9-f985-991100995500',
    u.id,
    u.email,
    u.name,
    '2024-12-02 09:00:00+00'::timestamp + (random() * interval '2 hours'),
    '2024-12-02 09:00:00+00'::timestamp + (random() * interval '4 hours'),
    CASE WHEN random() < 0.38 THEN '2024-12-02 09:00:00+00'::timestamp + (random() * interval '24 hours') ELSE NULL END,
    CASE WHEN random() < 0.028 THEN '2024-12-02 09:00:00+00'::timestamp + (random() * interval '48 hours') ELSE NULL END,
    CASE WHEN random() < 0.97 THEN 'delivered' ELSE 'bounced' END
FROM users u 
WHERE u.user_type = 'retailer'
CROSS JOIN generate_series(1, 200); -- Smaller campaign

-- Add conversions for completed campaign
INSERT INTO crm_conversions (id, campaign_id, retailer_id, conversion_type, conversion_value, conversion_date, product_category, created_at)
SELECT 
    uuid_generate_v4(),
    '7c15482c-f3a-52e5-b651-557766551065',
    u.id,
    'sale',
    (random() * 6000 + 1500)::DECIMAL(12,2),
    '2024-12-02 00:00:00+00'::timestamp + (random() * interval '25 days'),
    'Spring Collection',
    NOW()
FROM users u
WHERE u.user_type = 'retailer'
    AND random() < 0.6; -- 60% conversion rate for completed campaign

COMMIT;