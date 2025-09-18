-- Retailer Campaigns Dummy Data (Fixed UUID Format)
-- Comprehensive data for retailer campaign analytics with platform-specific metrics
-- =====================================================
-- 1. CLEAR EXISTING DATA (if tables exist)
-- =====================================================
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'retailer_platform_performance') THEN
        TRUNCATE TABLE retailer_platform_performance CASCADE;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'retailer_campaigns') THEN
        TRUNCATE TABLE retailer_campaigns CASCADE;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'retailers') THEN
        TRUNCATE TABLE retailers CASCADE;
    END IF;
END $$;

-- =====================================================
-- 2. INSERT RETAILERS DATA
-- =====================================================
INSERT INTO retailers (
    retailer_id, retailer_name, region, brand_id, contact_email, store_type, 
    total_campaigns, avg_performance_score, status
) VALUES
-- Retailer 1: Luxury Boutique NYC
(
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Luxury Boutique NYC',
    'East Coast',
    (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
    'contact@luxuryboutiquenyc.com',
    'boutique',
    8,
    4.2,
    'active'
),
-- Retailer 2: Elite Fashion LA
(
    '22222222-2222-2222-2222-222222222222'::uuid,
    'Elite Fashion LA',
    'West Coast',
    (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
    'info@elitefashionla.com',
    'boutique',
    6,
    3.8,
    'active'
),
-- Retailer 3: Premium Store Chicago
(
    '33333333-3333-3333-3333-333333333333'::uuid,
    'Premium Store Chicago',
    'Central',
    (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
    'hello@premiumchicago.com',
    'department',
    5,
    3.5,
    'active'
),
-- Retailer 4: Exclusive Miami
(
    '44444444-4444-4444-4444-444444444444'::uuid,
    'Exclusive Miami',
    'Southeast',
    (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
    'contact@exclusivemiami.com',
    'flagship',
    7,
    4.0,
    'active'
),
-- Retailer 5: Designer Seattle
(
    '55555555-5555-5555-5555-555555555555'::uuid,
    'Designer Seattle',
    'Northwest',
    (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
    'info@designerseattle.com',
    'boutique',
    4,
    3.6,
    'active'
);

-- =====================================================
-- 3. INSERT RETAILER CAMPAIGNS DATA
-- =====================================================
-- Function to generate campaigns for each retailer
DO $$
DECLARE
    retailer_record RECORD;
    campaign_templates TEXT[][] := ARRAY[
        ['Spring Collection Preview', 'active', 'mixed', 'high', 'up'],
        ['Holiday Luxury Campaign', 'completed', 'social', 'good', 'stable'],
        ['Summer Elegance 2025', 'draft', 'email', 'standard', 'stable'],
        ['Winter Wonderland Exclusive', 'active', 'mixed', 'high', 'up'],
        ['Artisan Heritage Collection', 'paused', 'social', 'good', 'down'],
        ['Timeless Elegance Launch', 'active', 'email', 'high', 'up'],
        ['Modern Minimalist Series', 'completed', 'mixed', 'standard', 'stable'],
        ['Luxury Lifestyle Showcase', 'active', 'social', 'high', 'up']
    ];
    i INTEGER;
    campaign_uuid UUID;
BEGIN
    -- Loop through each retailer
    FOR retailer_record IN SELECT retailer_id, retailer_name, total_campaigns FROM retailers LOOP
        -- Generate campaigns for this retailer
        FOR i IN 1..retailer_record.total_campaigns LOOP
            campaign_uuid := gen_random_uuid();
            INSERT INTO retailer_campaigns (
                campaign_id, retailer_id, brand_id, campaign_name, campaign_status, 
                campaign_type, start_date, end_date, duration_days, performance_tier, 
                trend_direction, last_updated
            ) VALUES (
                campaign_uuid,
                retailer_record.retailer_id,
                (SELECT id FROM users WHERE user_type = 'brand' LIMIT 1),
                campaign_templates[i][1] || ' - ' || retailer_record.retailer_name,
                campaign_templates[i][2],
                campaign_templates[i][3],
                CURRENT_DATE - (random() * 90)::integer,
                CASE 
                    WHEN campaign_templates[i][2] = 'completed' THEN CURRENT_DATE - (random() * 30)::integer
                    WHEN campaign_templates[i][2] = 'draft' THEN NULL
                    ELSE CURRENT_DATE + (random() * 60)::integer
                END,
                (random() * 60 + 30)::integer,
                campaign_templates[i][4],
                campaign_templates[i][5],
                NOW() - (random() * INTERVAL '7 days')
            );

            -- Insert platform performance data for this campaign
            -- Facebook Performance
            INSERT INTO retailer_platform_performance (
                campaign_id, retailer_id, platform, impressions, reach, engagement, engagement_rate,
                facebook_shares_count, facebook_comments_count, facebook_like_count, facebook_reactions
            ) VALUES (
                campaign_uuid,
                retailer_record.retailer_id,
                'facebook',
                (30000 + random() * 40000)::bigint,
                (25000 + random() * 30000)::bigint,
                (800 + random() * 1200)::bigint,
                (2.0 + random() * 4.0)::numeric(5,2),
                (10 + random() * 50)::integer,
                (20 + random() * 100)::integer,
                (200 + random() * 800)::integer,
                jsonb_build_object(
                    'like', (100 + random() * 600)::integer,
                    'love', (50 + random() * 200)::integer,
                    'haha', (10 + random() * 50)::integer,
                    'wow', (5 + random() * 30)::integer
                )
            );

            -- Instagram Performance
            INSERT INTO retailer_platform_performance (
                campaign_id, retailer_id, platform, impressions, reach, engagement, engagement_rate,
                instagram_like_count, instagram_comments_count, instagram_saved_count, instagram_shares_count
            ) VALUES (
                campaign_uuid,
                retailer_record.retailer_id,
                'instagram',
                (36000 + random() * 48000)::bigint,
                (27500 + random() * 33000)::bigint,
                (960 + random() * 1440)::bigint,
                (2.5 + random() * 4.5)::numeric(5,2),
                (300 + random() * 1000)::integer,
                (50 + random() * 150)::integer,
                (100 + random() * 300)::integer,
                (20 + random() * 80)::integer
            );

            -- LinkedIn Performance
            INSERT INTO retailer_platform_performance (
                campaign_id, retailer_id, platform, impressions, reach, engagement, engagement_rate,
                linkedin_like_count, linkedin_comments_count, linkedin_share_count, linkedin_reactions
            ) VALUES (
                campaign_uuid,
                retailer_record.retailer_id,
                'linkedin',
                (21000 + random() * 28000)::bigint,
                (15000 + random() * 18000)::bigint,
                (240 + random() * 480)::bigint,
                (1.5 + random() * 3.0)::numeric(5,2),
                (100 + random() * 300)::integer,
                (20 + random() * 80)::integer,
                (10 + random() * 40)::integer,
                jsonb_build_object(
                    'like', (50 + random() * 200)::integer,
                    'praise', (15 + random() * 60)::integer,
                    'empathy', (5 + random() * 20)::integer,
                    'interest', (3 + random() * 15)::integer
                )
            );

            -- Twitter Performance
            INSERT INTO retailer_platform_performance (
                campaign_id, retailer_id, platform, impressions, reach, engagement, engagement_rate,
                twitter_like_count, twitter_retweet_count, twitter_reply_count, twitter_bookmark_count
            ) VALUES (
                campaign_uuid,
                retailer_record.retailer_id,
                'twitter',
                (27000 + random() * 36000)::bigint,
                (17500 + random() * 21000)::bigint,
                (320 + random() * 680)::bigint,
                (1.8 + random() * 3.2)::numeric(5,2),
                (150 + random() * 500)::integer,
                (30 + random() * 100)::integer,
                (15 + random() * 60)::integer,
                (40 + random() * 120)::integer
            );
        END LOOP;
    END LOOP;
END $$;

-- =====================================================
-- 4. UPDATE CALCULATED FIELDS
-- =====================================================
-- Update engagement rates based on actual data
UPDATE retailer_platform_performance 
SET engagement_rate = ROUND((engagement::numeric / NULLIF(reach, 0) * 100), 2)
WHERE reach > 0;

-- Update campaign duration days
UPDATE retailer_campaigns 
SET duration_days = CASE 
    WHEN end_date IS NOT NULL THEN end_date - start_date
    ELSE CURRENT_DATE - start_date
END;

-- =====================================================
-- 5. DATA VERIFICATION
-- =====================================================
-- Verify data population
SELECT 
    'Retailers' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count
FROM retailers
UNION ALL
SELECT 
    'Retailer Campaigns' as table_name,
    COUNT(*) as record_count,
    COUNT(CASE WHEN campaign_status = 'active' THEN 1 END) as active_count
FROM retailer_campaigns
UNION ALL
SELECT 
    'Platform Performance Records' as table_name,
    COUNT(*) as record_count,
    COUNT(DISTINCT platform) as unique_platforms
FROM retailer_platform_performance;

-- Sample retailer campaign dashboard view
SELECT 
    retailer_name,
    campaign_name,
    campaign_status,
    performance_tier,
    trend_direction
FROM retailer_campaign_dashboard
WHERE retailer_id = '11111111-1111-1111-1111-111111111111'
LIMIT 5;

-- Success message
SELECT 'Retailer Campaigns Dummy Data inserted successfully!' as status,
       'Total Campaigns: ' || COUNT(*) as campaign_count
FROM retailer_campaigns;