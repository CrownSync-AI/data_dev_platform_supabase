-- =============================================
-- ANALYTICS DUMMY DATA
-- Populate database with data matching frontend analytics
-- =============================================

-- Insert additional retailer users to match analytics
INSERT INTO users (user_email, user_name, user_type, created_at, last_login_at, is_active) VALUES
('bucherer@hermann.com', 'Bucherer Hermann Jewelers Ltd.', 'retailer', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day', true),
('tourneau@jewelers.com', 'Tourneau Jewelers', 'retailer', NOW() - INTERVAL '25 days', NOW() - INTERVAL '2 days', true),
('deboulle@diamond.com', 'De Boulle Diamond & Jewelry', 'retailer', NOW() - INTERVAL '28 days', NOW() - INTERVAL '1 day', true),
('longs@anthony.com', 'Long''s Anthony Jewelers', 'retailer', NOW() - INTERVAL '22 days', NOW() - INTERVAL '3 days', true),
('brent@miller.com', 'Brent L. Miller Jewelers & Goldsmiths', 'retailer', NOW() - INTERVAL '26 days', NOW() - INTERVAL '2 days', true),
('alson@jewelers.com', 'Alson Jewelers', 'retailer', NOW() - INTERVAL '24 days', NOW() - INTERVAL '1 day', true),
('octurner@jewelers.com', 'O.C Turner Jewelers', 'retailer', NOW() - INTERVAL '27 days', NOW() - INTERVAL '4 days', true),
('manfredi@jewels.com', 'Manfredi Jewels', 'retailer', NOW() - INTERVAL '23 days', NOW() - INTERVAL '2 days', true),
('walters@hoggett.com', 'Walters & Hoggett Jewelers', 'retailer', NOW() - INTERVAL '29 days', NOW() - INTERVAL '3 days', true),
('fashion@watch.com', 'Fashion Watch Co.', 'retailer', NOW() - INTERVAL '21 days', NOW() - INTERVAL '1 day', true),
('sunbridge@jeweler.com', 'Sun Bridge Jeweler', 'retailer', NOW() - INTERVAL '20 days', NOW() - INTERVAL '1 day', true),
('nancy@jewelers.com', 'Nancy Jewelers', 'retailer', NOW() - INTERVAL '19 days', NOW() - INTERVAL '2 days', true),
('halston@fine.com', 'Halston''s Fine Jewelers', 'retailer', NOW() - INTERVAL '18 days', NOW() - INTERVAL '1 day', true),
('pocketwatch@jewelers.com', 'Pocketwatch Jewelers', 'retailer', NOW() - INTERVAL '17 days', NOW() - INTERVAL '3 days', true),
('tourneau@jewellery.com', 'Tourneau Jewellery Ltd', 'retailer', NOW() - INTERVAL '16 days', NOW() - INTERVAL '1 day', true),
('dazzling@armada.com', 'Dazzling Armada Jewelry', 'retailer', NOW() - INTERVAL '15 days', NOW() - INTERVAL '5 days', true),
('harris@jewelers.com', 'Harris Jewelers', 'retailer', NOW() - INTERVAL '14 days', NOW() - INTERVAL '1 day', true),
('sunrise@jewelers.com', 'Sunrise Jewelers', 'retailer', NOW() - INTERVAL '13 days', NOW() - INTERVAL '2 days', true),
('korebag@jewelry.com', 'KOREBAG', 'retailer', NOW() - INTERVAL '12 days', NOW() - INTERVAL '4 days', true),
('midas@jewels.com', 'Midas Jewels', 'retailer', NOW() - INTERVAL '11 days', NOW() - INTERVAL '1 day', true),
('watches@america.com', 'Watches of America', 'retailer', NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days', true),
('goldmark@prestige.com', 'Goldmark Prestige', 'retailer', NOW() - INTERVAL '9 days', NOW() - INTERVAL '3 days', true),
('jewelrycult@gallery.com', 'JewelryCult Gallery', 'retailer', NOW() - INTERVAL '8 days', NOW() - INTERVAL '4 days', true),
('elite@timepieces.com', 'Elite Timepieces', 'retailer', NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 day', true),
('legacy@watch.com', 'Legacy Watch Co.', 'retailer', NOW() - INTERVAL '6 days', NOW() - INTERVAL '2 days', true),
('manifold@jewels.com', 'Manifold Jewels', 'retailer', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 day', true),
('fortune@watch.com', 'Fortune Watch Co.', 'retailer', NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day', true),
('bucherer@phillips.com', 'Bucherer & Phillips Jewelers', 'retailer', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', true),
('cartwright@jewelers.com', 'Cartwright Jewelers', 'retailer', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', true);

-- Insert brand assets (files) matching analytics data
INSERT INTO files (file_name, file_type, file_size, file_path, file_url, created_by_user_id, created_at) VALUES
('Daytona_Launch_Video.mp4', 'video', 524288000, '/assets/videos/daytona_launch.mp4', '/assets/videos/daytona_launch.mp4', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '25 days'),
('Explorer_Heritage_Lookbook.pdf', 'pdf', 15728640, '/assets/pdfs/explorer_lookbook.pdf', '/assets/pdfs/explorer_lookbook.pdf', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '24 days'),
('Rolex_Oyster_Perpetual_Banner.jpg', 'image', 2097152, '/assets/images/oyster_banner.jpg', '/assets/images/oyster_banner.jpg', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '23 days'),
('GMT_Master_II_Social_Post.png', 'image', 1048576, '/assets/images/gmt_social.png', '/assets/images/gmt_social.png', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '22 days'),
('YachtMaster_Summer_Promo.gif', 'image', 3145728, '/assets/images/yacht_promo.gif', '/assets/images/yacht_promo.gif', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '21 days'),
('2025_VIP_Event_Template.pptx', 'document', 10485760, '/assets/docs/vip_template.pptx', '/assets/docs/vip_template.pptx', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '20 days'),
('Submariner_Teaser_Poster.pdf', 'pdf', 8388608, '/assets/pdfs/submariner_poster.pdf', '/assets/pdfs/submariner_poster.pdf', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '19 days'),
('Rolex_Retail_Guide_2025.pdf', 'pdf', 20971520, '/assets/pdfs/retail_guide.pdf', '/assets/pdfs/retail_guide.pdf', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '18 days'),
('Daytona_Social_Boost_Clip.mp4', 'video', 104857600, '/assets/videos/daytona_clip.mp4', '/assets/videos/daytona_clip.mp4', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '17 days'),
('Oyster_Style_Lifestyle.jpg', 'image', 4194304, '/assets/images/oyster_lifestyle.jpg', '/assets/images/oyster_lifestyle.jpg', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '16 days');

-- Insert campaigns matching analytics data
INSERT INTO campaigns (campaign_name, campaign_description, campaign_status, created_by_user_id, start_date, end_date, budget_allocated, budget_spent, created_at) VALUES
('Land Oyster Craftsmanship Insight', 'Showcase the craftsmanship behind Oyster watches', 'active', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '20 days', NOW() + INTERVAL '10 days', 50000.00, 22500.00, NOW() - INTERVAL '20 days'),
('Daytona Legends in Motor Sport', 'Celebrate Daytona''s racing heritage', 'active', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '18 days', NOW() + INTERVAL '12 days', 75000.00, 45000.00, NOW() - INTERVAL '18 days'),
('Oyster Perpetual Mastery Series', 'Technical excellence of Oyster Perpetual', 'completed', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '30 days', NOW() - INTERVAL '5 days', 40000.00, 38000.00, NOW() - INTERVAL '30 days'),
('Explorer Journeys of Endurance', 'Adventure stories with Explorer watches', 'active', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '15 days', NOW() + INTERVAL '15 days', 60000.00, 35000.00, NOW() - INTERVAL '15 days'),
('GMT Master II Heritage Unveiling', 'Heritage and innovation of GMT Master II', 'active', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '12 days', NOW() + INTERVAL '18 days', 55000.00, 28000.00, NOW() - INTERVAL '12 days'),
('Submariner Depth-Test Chronicles', 'Underwater testing and reliability', 'paused', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '25 days', NOW() + INTERVAL '5 days', 45000.00, 15000.00, NOW() - INTERVAL '25 days'),
('Sky Dweller Innovation Showcase', 'Technical innovation of Sky Dweller', 'active', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', 70000.00, 42000.00, NOW() - INTERVAL '10 days'),
('Yacht Master Sailing Heritage', 'Sailing tradition and Yacht Master', 'active', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '8 days', NOW() + INTERVAL '22 days', 65000.00, 38000.00, NOW() - INTERVAL '8 days'),
('Milgauss Science & Precision', 'Scientific precision of Milgauss', 'draft', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() + INTERVAL '5 days', NOW() + INTERVAL '25 days', 50000.00, 0.00, NOW() - INTERVAL '5 days'),
('Datejust Wimbledon Moments', 'Wimbledon partnership highlights', 'active', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '6 days', NOW() + INTERVAL '24 days', 80000.00, 48000.00, NOW() - INTERVAL '6 days'),
('Cellini Artistry & Elegance', 'Artistic elegance of Cellini collection', 'completed', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '35 days', NOW() - INTERVAL '10 days', 35000.00, 33000.00, NOW() - INTERVAL '35 days'),
('Rolex at Le Mans Endurance', 'Le Mans racing partnership', 'archived', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '40 days', NOW() - INTERVAL '15 days', 90000.00, 85000.00, NOW() - INTERVAL '40 days'),
('Rolex at US Daytona Highlights', 'US Daytona racing highlights', 'active', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '4 days', NOW() + INTERVAL '26 days', 85000.00, 51000.00, NOW() - INTERVAL '4 days'),
('Rolex x Atilla Championship Series', 'Championship series partnership', 'active', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() - INTERVAL '2 days', NOW() + INTERVAL '28 days', 75000.00, 45000.00, NOW() - INTERVAL '2 days'),
('Marketing Moments: The Perpetual Rolex Story', 'Brand storytelling campaign', 'draft', (SELECT user_id FROM users WHERE user_type = 'brand' LIMIT 1), NOW() + INTERVAL '10 days', NOW() + INTERVAL '30 days', 60000.00, 0.00, NOW() - INTERVAL '1 day');

-- Generate file actions (downloads, views, shares) for analytics
DO $$
DECLARE
    file_record RECORD;
    user_record RECORD;
    action_count INTEGER;
    i INTEGER;
BEGIN
    -- For each file, generate realistic download/view patterns
    FOR file_record IN SELECT file_id, file_name FROM files LOOP
        -- Generate downloads based on file popularity (matching analytics data)
        action_count := CASE 
            WHEN file_record.file_name LIKE '%Daytona_Launch_Video%' THEN 152
            WHEN file_record.file_name LIKE '%Explorer_Heritage_Lookbook%' THEN 98
            WHEN file_record.file_name LIKE '%Rolex_Oyster_Perpetual_Banner%' THEN 94
            WHEN file_record.file_name LIKE '%GMT_Master_II_Social_Post%' THEN 87
            WHEN file_record.file_name LIKE '%YachtMaster_Summer_Promo%' THEN 79
            WHEN file_record.file_name LIKE '%2025_VIP_Event_Template%' THEN 68
            WHEN file_record.file_name LIKE '%Submariner_Teaser_Poster%' THEN 61
            WHEN file_record.file_name LIKE '%Rolex_Retail_Guide_2025%' THEN 57
            WHEN file_record.file_name LIKE '%Daytona_Social_Boost_Clip%' THEN 53
            WHEN file_record.file_name LIKE '%Oyster_Style_Lifestyle%' THEN 48
            ELSE 25
        END;
        
        -- Generate download actions
        FOR i IN 1..action_count LOOP
            INSERT INTO file_actions (file_id, user_id, action_type, action_timestamp)
            SELECT 
                file_record.file_id,
                user_id,
                'DOWNLOAD',
                NOW() - (RANDOM() * INTERVAL '30 days')
            FROM users 
            WHERE user_type = 'retailer'
            ORDER BY RANDOM()
            LIMIT 1;
        END LOOP;
        
        -- Generate view actions (typically 2-3x more than downloads)
        FOR i IN 1..(action_count * 3) LOOP
            INSERT INTO file_actions (file_id, user_id, action_type, action_timestamp)
            SELECT 
                file_record.file_id,
                user_id,
                'VIEW',
                NOW() - (RANDOM() * INTERVAL '30 days')
            FROM users 
            WHERE user_type = 'retailer'
            ORDER BY RANDOM()
            LIMIT 1;
        END LOOP;
        
        -- Generate some share actions
        FOR i IN 1..(action_count / 10) LOOP
            INSERT INTO file_actions (file_id, user_id, action_type, action_timestamp)
            SELECT 
                file_record.file_id,
                user_id,
                'SHARE',
                NOW() - (RANDOM() * INTERVAL '30 days')
            FROM users 
            WHERE user_type = 'retailer'
            ORDER BY RANDOM()
            LIMIT 1;
        END LOOP;
    END LOOP;
END $$;

-- Insert email campaigns for campaign analytics
INSERT INTO email_campaigns (campaign_id, email_subject, email_content, sender_email, sender_name, sent_at, total_recipients)
SELECT 
    c.campaign_id,
    'Discover ' || c.campaign_name,
    'Explore our latest ' || c.campaign_name || ' collection with exclusive insights and premium content.',
    'marketing@rolex.com',
    'Rolex Marketing Team',
    c.start_date + INTERVAL '1 day',
    (RANDOM() * 1000 + 500)::INTEGER
FROM campaigns c
WHERE c.campaign_status IN ('active', 'completed');

-- Insert SMS campaigns for campaign analytics
INSERT INTO sms_campaigns (campaign_id, sms_content, sender_number, sent_at, total_recipients)
SELECT 
    c.campaign_id,
    'New ' || LEFT(c.campaign_name, 50) || ' collection available. View exclusive content now.',
    '+1234567890',
    c.start_date + INTERVAL '2 days',
    (RANDOM() * 500 + 200)::INTEGER
FROM campaigns c
WHERE c.campaign_status IN ('active', 'completed')
AND RANDOM() > 0.3; -- Only some campaigns have SMS

-- Generate email sends with realistic open/click rates
DO $$
DECLARE
    email_campaign_record RECORD;
    i INTEGER;
    recipient_count INTEGER;
BEGIN
    FOR email_campaign_record IN SELECT email_campaign_id, total_recipients FROM email_campaigns LOOP
        recipient_count := email_campaign_record.total_recipients;
        
        FOR i IN 1..recipient_count LOOP
            INSERT INTO email_sends (
                email_campaign_id, 
                recipient_email, 
                recipient_name, 
                sent_at,
                delivered_at,
                opened_at,
                clicked_at,
                status
            ) VALUES (
                email_campaign_record.email_campaign_id,
                'customer' || i || '@retailer.com',
                'Customer ' || i,
                NOW() - (RANDOM() * INTERVAL '25 days'),
                CASE WHEN RANDOM() > 0.05 THEN NOW() - (RANDOM() * INTERVAL '24 days') ELSE NULL END,
                CASE WHEN RANDOM() > 0.4 THEN NOW() - (RANDOM() * INTERVAL '23 days') ELSE NULL END,
                CASE WHEN RANDOM() > 0.7 THEN NOW() - (RANDOM() * INTERVAL '22 days') ELSE NULL END,
                CASE 
                    WHEN RANDOM() > 0.95 THEN 'bounced'::email_status_enum
                    WHEN RANDOM() > 0.05 THEN 'delivered'::email_status_enum
                    ELSE 'failed'::email_status_enum
                END
            );
        END LOOP;
    END LOOP;
END $$;

-- Generate SMS sends with realistic delivery rates
DO $$
DECLARE
    sms_campaign_record RECORD;
    i INTEGER;
    recipient_count INTEGER;
BEGIN
    FOR sms_campaign_record IN SELECT sms_campaign_id, total_recipients FROM sms_campaigns LOOP
        recipient_count := sms_campaign_record.total_recipients;
        
        FOR i IN 1..recipient_count LOOP
            INSERT INTO sms_sends (
                sms_campaign_id, 
                recipient_phone, 
                recipient_name, 
                sent_at,
                delivered_at,
                status
            ) VALUES (
                sms_campaign_record.sms_campaign_id,
                '+1555' || LPAD((RANDOM() * 9999999)::TEXT, 7, '0'),
                'Customer ' || i,
                NOW() - (RANDOM() * INTERVAL '25 days'),
                CASE WHEN RANDOM() > 0.1 THEN NOW() - (RANDOM() * INTERVAL '24 days') ELSE NULL END,
                CASE 
                    WHEN RANDOM() > 0.9 THEN 'delivered'::sms_status_enum
                    WHEN RANDOM() > 0.05 THEN 'sent'::sms_status_enum
                    ELSE 'failed'::sms_status_enum
                END
            );
        END LOOP;
    END LOOP;
END $$;

-- Insert sessions for user analytics
DO $$
DECLARE
    user_record RECORD;
    session_count INTEGER;
    i INTEGER;
BEGIN
    FOR user_record IN SELECT user_id FROM users WHERE user_type = 'retailer' LOOP
        session_count := (RANDOM() * 20 + 5)::INTEGER;
        
        FOR i IN 1..session_count LOOP
            INSERT INTO sessions (
                user_id,
                started_at,
                ended_at,
                ip_address,
                user_agent
            ) VALUES (
                user_record.user_id,
                NOW() - (RANDOM() * INTERVAL '30 days'),
                NOW() - (RANDOM() * INTERVAL '30 days') + (RANDOM() * INTERVAL '2 hours'),
                ('192.168.' || (RANDOM() * 255)::INTEGER || '.' || (RANDOM() * 255)::INTEGER)::INET,
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            );
        END LOOP;
    END LOOP;
END $$;

COMMIT;