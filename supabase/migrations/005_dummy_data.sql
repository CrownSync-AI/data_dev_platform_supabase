-- =============================================
-- DUMMY DATA GENERATION SCRIPT
-- =============================================
-- This script generates realistic dummy data for all tables
-- Run this after the initial schema and functions are deployed

BEGIN;

-- =============================================
-- USERS DATA
-- =============================================

-- Brand users
INSERT INTO users (user_email, user_name, user_type, profile_data, last_login_at) VALUES
('john.smith@brandcorp.com', 'John Smith', 'brand', '{"company": "BrandCorp", "department": "Marketing", "phone": "+1-555-0101"}', NOW() - INTERVAL '2 hours'),
('sarah.johnson@creativestudio.com', 'Sarah Johnson', 'brand', '{"company": "Creative Studio", "department": "Design", "phone": "+1-555-0102"}', NOW() - INTERVAL '1 day'),
('mike.wilson@techbrand.com', 'Mike Wilson', 'brand', '{"company": "TechBrand", "department": "Product", "phone": "+1-555-0103"}', NOW() - INTERVAL '3 hours'),
('emily.davis@fashionhouse.com', 'Emily Davis', 'brand', '{"company": "Fashion House", "department": "Creative", "phone": "+1-555-0104"}', NOW() - INTERVAL '5 hours'),
('alex.brown@sportsgear.com', 'Alex Brown', 'brand', '{"company": "Sports Gear Inc", "department": "Marketing", "phone": "+1-555-0105"}', NOW() - INTERVAL '1 hour');

-- Retailer users
INSERT INTO users (user_email, user_name, user_type, profile_data, last_login_at) VALUES
('lisa.martinez@retailstore.com', 'Lisa Martinez', 'retailer', '{"store": "Retail Store", "location": "Downtown", "phone": "+1-555-0201"}', NOW() - INTERVAL '30 minutes'),
('david.garcia@onlineshop.com', 'David Garcia', 'retailer', '{"store": "Online Shop", "location": "E-commerce", "phone": "+1-555-0202"}', NOW() - INTERVAL '2 days'),
('jennifer.lee@boutique.com', 'Jennifer Lee', 'retailer', '{"store": "Fashion Boutique", "location": "Mall", "phone": "+1-555-0203"}', NOW() - INTERVAL '4 hours'),
('robert.taylor@electronics.com', 'Robert Taylor', 'retailer', '{"store": "Electronics Plus", "location": "Strip Mall", "phone": "+1-555-0204"}', NOW() - INTERVAL '6 hours'),
('maria.rodriguez@homegoods.com', 'Maria Rodriguez', 'retailer', '{"store": "Home Goods", "location": "Suburban", "phone": "+1-555-0205"}', NOW() - INTERVAL '1 day');

-- =============================================
-- GEOGRAPHY DATA (Additional)
-- =============================================

INSERT INTO geography (country_code, country_name, region, city, latitude, longitude, timezone) VALUES
('US', 'United States', 'California', 'Los Angeles', 34.0522, -118.2437, 'America/Los_Angeles'),
('US', 'United States', 'Texas', 'Austin', 30.2672, -97.7431, 'America/Chicago'),
('US', 'United States', 'Florida', 'Miami', 25.7617, -80.1918, 'America/New_York'),
('US', 'United States', 'Illinois', 'Chicago', 41.8781, -87.6298, 'America/Chicago'),
('CA', 'Canada', 'British Columbia', 'Vancouver', 49.2827, -123.1207, 'America/Vancouver'),
('GB', 'United Kingdom', 'Scotland', 'Edinburgh', 55.9533, -3.1883, 'Europe/London'),
('DE', 'Germany', 'Bavaria', 'Munich', 48.1351, 11.5820, 'Europe/Berlin'),
('FR', 'France', 'Île-de-France', 'Paris', 48.8566, 2.3522, 'Europe/Paris'),
('JP', 'Japan', 'Tokyo', 'Tokyo', 35.6762, 139.6503, 'Asia/Tokyo'),
('AU', 'Australia', 'Victoria', 'Melbourne', -37.8136, 144.9631, 'Australia/Melbourne');

-- =============================================
-- DEVICES DATA
-- =============================================

INSERT INTO devices (device_type, device_brand, device_model, operating_system, browser, screen_resolution, user_agent) VALUES
('desktop', 'Apple', 'iMac', 'macOS 14.0', 'Chrome', '2560x1440', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'),
('mobile', 'Apple', 'iPhone 15', 'iOS 17.0', 'Safari', '1179x2556', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'),
('desktop', 'Dell', 'XPS 13', 'Windows 11', 'Edge', '1920x1080', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('tablet', 'Apple', 'iPad Pro', 'iPadOS 17.0', 'Safari', '2048x2732', 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15'),
('mobile', 'Samsung', 'Galaxy S24', 'Android 14', 'Chrome', '1440x3120', 'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36'),
('desktop', 'HP', 'Pavilion', 'Windows 11', 'Firefox', '1920x1080', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101'),
('mobile', 'Google', 'Pixel 8', 'Android 14', 'Chrome', '1344x2992', 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36');

-- =============================================
-- CAMPAIGNS DATA
-- =============================================

INSERT INTO campaigns (campaign_name, campaign_description, campaign_status, created_by_user_id, start_date, end_date, budget_allocated, target_audience, campaign_settings)
SELECT 
  'Summer Sale 2024',
  'Comprehensive summer sale campaign targeting young adults',
  'active'::campaign_status_enum,
  u.user_id,
  NOW() - INTERVAL '10 days',
  NOW() + INTERVAL '20 days',
  50000.00,
  '{"age_range": "18-35", "interests": ["fashion", "lifestyle"], "locations": ["US", "CA"]}',
  '{"channels": ["email", "social", "sms"], "frequency": "daily"}'
FROM users u WHERE u.user_type = 'brand' LIMIT 1;

INSERT INTO campaigns (campaign_name, campaign_description, campaign_status, created_by_user_id, start_date, end_date, budget_allocated, target_audience, campaign_settings)
SELECT 
  'Back to School',
  'Educational products and supplies campaign',
  'active'::campaign_status_enum,
  u.user_id,
  NOW() - INTERVAL '5 days',
  NOW() + INTERVAL '30 days',
  25000.00,
  '{"age_range": "25-45", "interests": ["education", "family"], "locations": ["US"]}',
  '{"channels": ["email", "social"], "frequency": "weekly"}'
FROM users u WHERE u.user_type = 'brand' LIMIT 1;

INSERT INTO campaigns (campaign_name, campaign_description, campaign_status, created_by_user_id, start_date, end_date, budget_allocated, target_audience, campaign_settings)
SELECT 
  'Holiday Collection Preview',
  'Early preview of holiday collection',
  'draft'::campaign_status_enum,
  u.user_id,
  NOW() + INTERVAL '30 days',
  NOW() + INTERVAL '90 days',
  75000.00,
  '{"age_range": "25-55", "interests": ["luxury", "gifts"], "locations": ["US", "CA", "GB"]}',
  '{"channels": ["email", "social"], "frequency": "bi-weekly"}'
FROM users u WHERE u.user_type = 'brand' LIMIT 1;

-- =============================================
-- FILES DATA
-- =============================================

INSERT INTO files (file_name, file_type, file_size, file_path, file_url, created_by_user_id, metadata)
SELECT 
  'summer_campaign_hero.jpg',
  'image'::file_type_enum,
  2048576,
  '/uploads/images/summer_campaign_hero.jpg',
  'https://cdn.example.com/summer_campaign_hero.jpg',
  u.user_id,
  '{"width": 1920, "height": 1080, "format": "JPEG"}'
FROM users u WHERE u.user_type = 'brand' LIMIT 1;

INSERT INTO files (file_name, file_type, file_size, file_path, file_url, created_by_user_id, metadata)
SELECT 
  'product_showcase_video.mp4',
  'video'::file_type_enum,
  52428800,
  '/uploads/videos/product_showcase.mp4',
  'https://cdn.example.com/product_showcase.mp4',
  u.user_id,
  '{"duration": 120, "resolution": "1080p", "format": "MP4"}'
FROM users u WHERE u.user_type = 'brand' LIMIT 1;

INSERT INTO files (file_name, file_type, file_size, file_path, file_url, created_by_user_id, metadata)
SELECT 
  'brand_guidelines.pdf',
  'pdf'::file_type_enum,
  1048576,
  '/uploads/documents/brand_guidelines.pdf',
  'https://cdn.example.com/brand_guidelines.pdf',
  u.user_id,
  '{"pages": 24, "version": "2.1"}'
FROM users u WHERE u.user_type = 'brand' LIMIT 1;

INSERT INTO files (file_name, file_type, file_size, file_path, file_url, created_by_user_id, metadata)
SELECT 
  'logo_variations.zip',
  'other'::file_type_enum,
  5242880,
  '/uploads/assets/logo_variations.zip',
  'https://cdn.example.com/logo_variations.zip',
  u.user_id,
  '{"files_count": 12, "formats": ["PNG", "SVG", "EPS"]}'
FROM users u WHERE u.user_type = 'brand' LIMIT 1;

INSERT INTO files (file_name, file_type, file_size, file_path, file_url, created_by_user_id, metadata)
SELECT 
  'background_music.mp3',
  'audio'::file_type_enum,
  3145728,
  '/uploads/audio/background_music.mp3',
  'https://cdn.example.com/background_music.mp3',
  u.user_id,
  '{"duration": 180, "bitrate": "320kbps"}'
FROM users u WHERE u.user_type = 'brand' LIMIT 1;

-- =============================================
-- TEMPLATES DATA
-- =============================================

INSERT INTO templates (template_name, template_type, template_content, created_by_user_id, version)
SELECT 
  'Welcome Email Template',
  'email'::template_type_enum,
  '{"subject": "Welcome to {{brand_name}}!", "html": "<h1>Welcome {{customer_name}}!</h1><p>Thank you for joining us.</p>", "variables": ["brand_name", "customer_name"]}',
  u.user_id,
  1
FROM users u WHERE u.user_type = 'brand' LIMIT 1;

INSERT INTO templates (template_name, template_type, template_content, created_by_user_id, version)
SELECT 
  'Sale Announcement SMS',
  'sms'::template_type_enum,
  '{"message": "🎉 FLASH SALE: {{discount}}% off everything! Use code {{code}}. Valid until {{expiry}}. Shop now!", "variables": ["discount", "code", "expiry"]}',
  u.user_id,
  1
FROM users u WHERE u.user_type = 'brand' LIMIT 1;

INSERT INTO templates (template_name, template_type, template_content, created_by_user_id, version)
SELECT 
  'Instagram Story Template',
  'social'::template_type_enum,
  '{"dimensions": "1080x1920", "elements": [{"type": "background", "color": "#FF6B6B"}, {"type": "text", "content": "{{offer_text}}", "position": "center"}], "variables": ["offer_text"]}',
  u.user_id,
  1
FROM users u WHERE u.user_type = 'brand' LIMIT 1;

-- =============================================
-- COLLECTIONS DATA
-- =============================================

INSERT INTO collections (collection_name, collection_description, created_by_user_id, is_public, metadata)
SELECT 
  'Summer Campaign Assets',
  'All assets for the summer 2024 campaign',
  u.user_id,
  true,
  '{"tags": ["summer", "2024", "campaign"], "color_scheme": "bright"}'
FROM users u WHERE u.user_type = 'brand' LIMIT 1;

INSERT INTO collections (collection_name, collection_description, created_by_user_id, is_public, metadata)
SELECT 
  'Brand Guidelines Package',
  'Complete brand identity and guidelines',
  u.user_id,
  false,
  '{"tags": ["brand", "guidelines", "identity"], "access_level": "internal"}'
FROM users u WHERE u.user_type = 'brand' LIMIT 1;

-- =============================================
-- SESSIONS DATA
-- =============================================

INSERT INTO sessions (user_id, started_at, ended_at, ip_address, user_agent, device_info, location_data)
SELECT 
  u.user_id,
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '1 hour',
  '192.168.1.100'::inet,
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  '{"device_type": "desktop", "os": "macOS", "browser": "Chrome"}',
  '{"country": "United States", "city": "San Francisco", "timezone": "America/Los_Angeles"}'
FROM users u WHERE u.user_type = 'brand' LIMIT 3;

INSERT INTO sessions (user_id, started_at, ended_at, ip_address, user_agent, device_info, location_data)
SELECT 
  u.user_id,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '23 hours',
  '192.168.1.101'::inet,
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15',
  '{"device_type": "mobile", "os": "iOS", "browser": "Safari"}',
  '{"country": "United States", "city": "New York", "timezone": "America/New_York"}'
FROM users u WHERE u.user_type = 'retailer' LIMIT 3;

-- =============================================
-- EMAIL CAMPAIGNS DATA
-- =============================================

INSERT INTO email_campaigns (campaign_id, email_subject, email_content, sender_email, sender_name, sent_at, total_recipients, metadata)
SELECT 
  c.campaign_id,
  '🌞 Summer Sale is Here - Up to 50% Off!',
  '<html><body><h1>Summer Sale</h1><p>Don''t miss out on our biggest sale of the year!</p></body></html>',
  'noreply@brandcorp.com',
  'BrandCorp Marketing',
  c.start_date + INTERVAL '1 day',
  1250,
  '{"template_id": "summer_sale", "personalization": true}'
FROM campaigns c WHERE c.campaign_name = 'Summer Sale 2024' LIMIT 1;

-- =============================================
-- EMAIL SENDS DATA
-- =============================================

INSERT INTO email_sends (email_campaign_id, recipient_email, recipient_name, sent_at, delivered_at, opened_at, status, metadata)
SELECT 
  ec.email_campaign_id,
  'customer1@example.com',
  'Customer One',
  ec.sent_at + INTERVAL '1 minute',
  ec.sent_at + INTERVAL '3 minutes',
  ec.sent_at + INTERVAL '1 hour',
  'opened'::email_status_enum,
  '{"client": "gmail", "device": "mobile"}'
FROM email_campaigns ec LIMIT 1;

INSERT INTO email_sends (email_campaign_id, recipient_email, recipient_name, sent_at, delivered_at, status, metadata)
SELECT 
  ec.email_campaign_id,
  'customer2@example.com',
  'Customer Two',
  ec.sent_at + INTERVAL '2 minutes',
  ec.sent_at + INTERVAL '4 minutes',
  'delivered'::email_status_enum,
  '{"client": "outlook", "device": "desktop"}'
FROM email_campaigns ec LIMIT 1;

-- =============================================
-- SMS CAMPAIGNS DATA
-- =============================================

INSERT INTO sms_campaigns (campaign_id, sms_content, sender_number, sent_at, total_recipients, metadata)
SELECT 
  c.campaign_id,
  '🎉 FLASH SALE: 50% off everything! Use code SUMMER50. Valid until midnight. Shop now!',
  '+1-555-BRAND',
  c.start_date + INTERVAL '2 days',
  850,
  '{"character_count": 89, "encoding": "GSM7"}'
FROM campaigns c WHERE c.campaign_name = 'Summer Sale 2024' LIMIT 1;

-- =============================================
-- SMS SENDS DATA
-- =============================================

INSERT INTO sms_sends (sms_campaign_id, recipient_phone, recipient_name, sent_at, delivered_at, status, metadata)
SELECT 
  sc.sms_campaign_id,
  '+1-555-1001',
  'Customer One',
  sc.sent_at + INTERVAL '30 seconds',
  sc.sent_at + INTERVAL '1 minute',
  'delivered'::sms_status_enum,
  '{"carrier": "Verizon", "country": "US"}'
FROM sms_campaigns sc LIMIT 1;

INSERT INTO sms_sends (sms_campaign_id, recipient_phone, recipient_name, sent_at, delivered_at, status, metadata)
SELECT 
  sc.sms_campaign_id,
  '+1-555-1002',
  'Customer Two',
  sc.sent_at + INTERVAL '1 minute',
  sc.sent_at + INTERVAL '2 minutes',
  'delivered'::sms_status_enum,
  '{"carrier": "AT&T", "country": "US"}'
FROM sms_campaigns sc LIMIT 1;

-- =============================================
-- SOCIAL ACCOUNTS DATA
-- =============================================

INSERT INTO social_accounts (user_id, platform, account_handle, account_name, is_active, metadata)
SELECT 
  u.user_id,
  'instagram'::social_platform_enum,
  '@brandcorp_official',
  'BrandCorp Official',
  true,
  '{"followers": 125000, "verified": true}'
FROM users u WHERE u.user_type = 'retailer' LIMIT 1;

INSERT INTO social_accounts (user_id, platform, account_handle, account_name, is_active, metadata)
SELECT 
  u.user_id,
  'facebook'::social_platform_enum,
  'BrandCorpOfficial',
  'BrandCorp',
  true,
  '{"likes": 89000, "page_type": "business"}'
FROM users u WHERE u.user_type = 'retailer' LIMIT 1;

-- =============================================
-- SOCIAL POSTS DATA
-- =============================================

INSERT INTO social_posts (account_id, campaign_id, post_content, post_type, external_post_id, scheduled_at, published_at, metadata)
SELECT 
  sa.account_id,
  c.campaign_id,
  '🌞 Summer vibes are here! Check out our latest collection and get ready to shine! ✨ #SummerStyle #NewCollection',
  'image',
  'ig_post_001',
  c.start_date + INTERVAL '3 days',
  c.start_date + INTERVAL '3 days' + INTERVAL '5 minutes',
  '{"hashtags": ["SummerStyle", "NewCollection"], "mentions": []}'
FROM social_accounts sa
CROSS JOIN campaigns c
WHERE sa.platform = 'instagram' AND c.campaign_name = 'Summer Sale 2024'
LIMIT 1;

-- =============================================
-- SOCIAL ENGAGEMENT DATA
-- =============================================

INSERT INTO social_engagement (post_id, engagement_type, engagement_count, recorded_at, metadata)
SELECT 
  sp.post_id,
  'like',
  456,
  sp.published_at + INTERVAL '1 hour',
  '{"platform_specific": true}'
FROM social_posts sp LIMIT 1;

INSERT INTO social_engagement (post_id, engagement_type, engagement_count, recorded_at, metadata)
SELECT 
  sp.post_id,
  'comment',
  23,
  sp.published_at + INTERVAL '2 hours',
  '{"sentiment": "positive"}'
FROM social_posts sp LIMIT 1;

-- =============================================
-- PRODUCTS DATA
-- =============================================

INSERT INTO products (external_product_id, product_title, product_description, product_type, vendor, published_at, status, tags, metadata)
VALUES
('PROD_001', 'Summer Breeze Dress', 'Lightweight and comfortable dress perfect for summer days', 'Apparel', 'Fashion Forward', NOW() - INTERVAL '30 days', 'active', ARRAY['summer', 'dress', 'casual', 'women'], '{"color_options": ["blue", "white", "coral"], "size_range": "XS-XL"}'),
('PROD_002', 'Wireless Bluetooth Headphones', 'High-quality wireless headphones with noise cancellation', 'Electronics', 'TechSound', NOW() - INTERVAL '20 days', 'active', ARRAY['electronics', 'audio', 'wireless', 'bluetooth'], '{"battery_life": "30 hours", "noise_cancellation": true}'),
('PROD_003', 'Organic Cotton T-Shirt', 'Sustainable and comfortable organic cotton t-shirt', 'Apparel', 'EcoWear', NOW() - INTERVAL '15 days', 'active', ARRAY['organic', 'cotton', 'sustainable', 'unisex'], '{"material": "100% organic cotton", "certifications": ["GOTS", "Fair Trade"]}'),
('PROD_004', 'Smart Fitness Watch', 'Advanced fitness tracking with heart rate monitor', 'Electronics', 'FitTech', NOW() - INTERVAL '10 days', 'active', ARRAY['fitness', 'smartwatch', 'health', 'technology'], '{"features": ["heart_rate", "gps", "sleep_tracking"], "battery_life": "7 days"}'),
('PROD_005', 'Artisan Coffee Blend', 'Premium single-origin coffee beans', 'Food & Beverage', 'Mountain Roasters', NOW() - INTERVAL '5 days', 'active', ARRAY['coffee', 'organic', 'fair-trade', 'premium'], '{"origin": "Colombia", "roast_level": "medium", "notes": ["chocolate", "caramel", "citrus"]}');

-- =============================================
-- PRODUCT VARIANTS DATA
-- =============================================

INSERT INTO product_variants (product_id, external_variant_id, variant_title, sku, price, compare_at_price, inventory_quantity, weight, metadata)
SELECT 
  p.product_id,
  'VAR_001_S',
  'Summer Breeze Dress - Small',
  'SBD-S-BLUE',
  79.99,
  99.99,
  25,
  0.3,
  '{"size": "S", "color": "blue"}'
FROM products p WHERE p.external_product_id = 'PROD_001';

INSERT INTO product_variants (product_id, external_variant_id, variant_title, sku, price, compare_at_price, inventory_quantity, weight, metadata)
SELECT 
  p.product_id,
  'VAR_002_BLACK',
  'Wireless Headphones - Black',
  'WBH-BLACK',
  199.99,
  249.99,
  50,
  0.8,
  '{"color": "black"}'
FROM products p WHERE p.external_product_id = 'PROD_002';

-- =============================================
-- FILE ACTIONS DATA
-- =============================================

INSERT INTO file_actions (file_id, user_id, action_type, action_timestamp, session_id, ip_address, user_agent, metadata)
SELECT 
  f.file_id,
  u.user_id,
  'VIEW'::action_type_enum,
  NOW() - INTERVAL '1 hour',
  s.session_id,
  s.ip_address,
  s.user_agent,
  '{"duration_seconds": 45}'
FROM files f
CROSS JOIN users u
LEFT JOIN sessions s ON s.user_id = u.user_id
WHERE u.user_type = 'brand'
LIMIT 5;

INSERT INTO file_actions (file_id, user_id, action_type, action_timestamp, session_id, ip_address, user_agent, metadata)
SELECT 
  f.file_id,
  u.user_id,
  'DOWNLOAD'::action_type_enum,
  NOW() - INTERVAL '30 minutes',
  s.session_id,
  s.ip_address,
  s.user_agent,
  '{"download_size": "full"}'
FROM files f
CROSS JOIN users u
LEFT JOIN sessions s ON s.user_id = u.user_id
WHERE u.user_type = 'retailer'
LIMIT 3;

-- =============================================
-- DAILY ANALYTICS DATA
-- =============================================

INSERT INTO daily_analytics (date_recorded, entity_type, entity_id, metric_name, metric_value, metadata)
SELECT 
  (NOW() - INTERVAL '1 day')::date,
  'file',
  f.file_id,
  'views',
  FLOOR(RANDOM() * 100 + 10),
  '{"source": "file_actions"}'
FROM files f LIMIT 5;

INSERT INTO daily_analytics (date_recorded, entity_type, entity_id, metric_name, metric_value, metadata)
SELECT 
  (NOW() - INTERVAL '1 day')::date,
  'campaign',
  c.campaign_id,
  'impressions',
  FLOOR(RANDOM() * 5000 + 500),
  '{"source": "campaign_tracking"}'
FROM campaigns c LIMIT 3;

COMMIT;

-- =============================================
-- VERIFICATION QUERY
-- =============================================

-- Show record counts for verification
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL SELECT 'files', COUNT(*) FROM files
UNION ALL SELECT 'campaigns', COUNT(*) FROM campaigns
UNION ALL SELECT 'email_campaigns', COUNT(*) FROM email_campaigns
UNION ALL SELECT 'sms_campaigns', COUNT(*) FROM sms_campaigns
UNION ALL SELECT 'social_posts', COUNT(*) FROM social_posts
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'daily_analytics', COUNT(*) FROM daily_analytics
ORDER BY table_name;