-- =====================================================
-- Social Media Analytics Complete Database Setup
-- Based on Ayrshare API data structure
-- =====================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CORE SOCIAL MEDIA TABLES
-- =====================================================

-- Social Accounts Table
CREATE TABLE IF NOT EXISTS social_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'google_business')),
    account_handle VARCHAR(255),
    account_name VARCHAR(255),
    account_id VARCHAR(255), -- Platform-specific account ID
    profile_url TEXT,
    ayrshare_profile_key VARCHAR(255), -- Ayrshare profile identifier
    is_active BOOLEAN DEFAULT true,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    account_metadata JSONB DEFAULT '{}', -- Platform-specific data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Posts Table
CREATE TABLE IF NOT EXISTS social_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    ayrshare_post_id VARCHAR(255), -- Ayrshare post identifier
    platform_post_id VARCHAR(255), -- Native platform post ID
    post_type VARCHAR(50) CHECK (post_type IN ('image', 'video', 'carousel', 'story', 'reel', 'text')),
    content TEXT,
    media_urls TEXT[], -- Array of media URLs
    hashtags TEXT[], -- Array of hashtags used
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    post_metadata JSONB DEFAULT '{}', -- Platform-specific post data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Social Analytics Table (Daily post-level analytics)
CREATE TABLE IF NOT EXISTS social_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
    account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'google_business')),
    analytics_date DATE NOT NULL,
    
    -- Engagement Metrics
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    reactions INTEGER DEFAULT 0, -- Platform-specific reactions
    saves INTEGER DEFAULT 0, -- Instagram saves, LinkedIn saves
    
    -- Reach & Impressions
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    organic_reach INTEGER DEFAULT 0,
    paid_reach INTEGER DEFAULT 0,
    
    -- Click Metrics
    link_clicks INTEGER DEFAULT 0,
    profile_clicks INTEGER DEFAULT 0,
    website_clicks INTEGER DEFAULT 0,
    
    -- Video Metrics (if applicable)
    video_views INTEGER DEFAULT 0,
    video_completion_rate DECIMAL(5,2) DEFAULT 0,
    average_watch_time INTEGER DEFAULT 0, -- in seconds
    
    -- Platform-Specific Metrics
    platform_metrics JSONB DEFAULT '{}', -- Store platform-specific data
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(post_id, analytics_date)
);

-- Add computed engagement rate column
ALTER TABLE social_analytics 
ADD COLUMN IF NOT EXISTS engagement_rate DECIMAL(5,2) 
GENERATED ALWAYS AS (
    CASE 
        WHEN reach > 0 THEN ((likes + comments + shares + reactions)::DECIMAL / reach) * 100
        ELSE 0 
    END
) STORED;

-- Account Analytics Table (Daily account-level metrics)
CREATE TABLE IF NOT EXISTS account_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'google_business')),
    analytics_date DATE NOT NULL,
    
    -- Follower Metrics
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    new_followers INTEGER DEFAULT 0,
    unfollowers INTEGER DEFAULT 0,
    
    -- Profile Metrics
    profile_visits INTEGER DEFAULT 0,
    profile_actions INTEGER DEFAULT 0,
    website_clicks_from_profile INTEGER DEFAULT 0,
    
    -- Content Performance
    total_posts INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    total_reach INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    
    -- Platform-Specific Account Metrics
    platform_account_metrics JSONB DEFAULT '{}',
    
    -- Calculated Metrics
    average_engagement_rate DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(account_id, analytics_date)
);

-- Add computed net follower growth column
ALTER TABLE account_analytics 
ADD COLUMN IF NOT EXISTS net_follower_growth INTEGER 
GENERATED ALWAYS AS (new_followers - unfollowers) STORED;

-- Add computed follower growth rate column
ALTER TABLE account_analytics 
ADD COLUMN IF NOT EXISTS follower_growth_rate DECIMAL(5,2) 
GENERATED ALWAYS AS (
    CASE 
        WHEN followers_count > 0 THEN (net_follower_growth::DECIMAL / followers_count) * 100
        ELSE 0 
    END
) STORED;

-- Audience Demographics Table
CREATE TABLE IF NOT EXISTS audience_demographics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'google_business')),
    analytics_date DATE NOT NULL,
    
    -- Age Demographics
    age_13_17 DECIMAL(5,2) DEFAULT 0,
    age_18_24 DECIMAL(5,2) DEFAULT 0,
    age_25_34 DECIMAL(5,2) DEFAULT 0,
    age_35_44 DECIMAL(5,2) DEFAULT 0,
    age_45_54 DECIMAL(5,2) DEFAULT 0,
    age_55_64 DECIMAL(5,2) DEFAULT 0,
    age_65_plus DECIMAL(5,2) DEFAULT 0,
    
    -- Gender Demographics
    gender_male DECIMAL(5,2) DEFAULT 0,
    gender_female DECIMAL(5,2) DEFAULT 0,
    gender_other DECIMAL(5,2) DEFAULT 0,
    
    -- Geographic Data
    top_countries JSONB DEFAULT '{}', -- {"US": 45.2, "UK": 12.8, "CA": 8.5}
    top_cities JSONB DEFAULT '{}', -- {"New York": 15.2, "London": 8.9}
    
    -- Interest Categories (platform-specific)
    interests JSONB DEFAULT '{}', -- {"luxury": 25.5, "jewelry": 18.2, "fashion": 22.1}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(account_id, platform, analytics_date)
);

-- Hashtag Performance Table
CREATE TABLE IF NOT EXISTS hashtag_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,
    hashtag VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('linkedin', 'facebook', 'instagram', 'google_business')),
    analytics_date DATE NOT NULL,
    
    -- Usage Metrics
    posts_count INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    total_reach INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    
    -- Performance Metrics
    average_engagement_rate DECIMAL(5,2) DEFAULT 0,
    click_through_rate DECIMAL(5,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(account_id, hashtag, platform, analytics_date)
);

-- =====================================================
-- 2. INDEXES FOR PERFORMANCE
-- =====================================================

-- Social accounts performance
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_active ON social_accounts(is_active);

-- Social analytics performance
CREATE INDEX IF NOT EXISTS idx_social_analytics_date ON social_analytics(analytics_date);
CREATE INDEX IF NOT EXISTS idx_social_analytics_platform ON social_analytics(platform);
CREATE INDEX IF NOT EXISTS idx_social_analytics_account ON social_analytics(account_id);
CREATE INDEX IF NOT EXISTS idx_social_analytics_engagement ON social_analytics(engagement_rate);

-- Account analytics performance
CREATE INDEX IF NOT EXISTS idx_account_analytics_date ON account_analytics(analytics_date);
CREATE INDEX IF NOT EXISTS idx_account_analytics_account ON account_analytics(account_id);

-- Hashtag performance
CREATE INDEX IF NOT EXISTS idx_hashtag_performance_hashtag ON hashtag_performance(hashtag);
CREATE INDEX IF NOT EXISTS idx_hashtag_performance_platform ON hashtag_performance(platform);

-- =====================================================
-- 3. DATABASE VIEWS FOR ANALYTICS
-- =====================================================

-- Social Performance Summary View
CREATE OR REPLACE VIEW social_performance_summary AS
SELECT 
    sa.id as account_id,
    sa.platform,
    sa.account_name,
    sa.user_id,
    u.name as retailer_name,
    u.region,
    
    -- Current Period Metrics (Last 30 days)
    COALESCE(SUM(san.impressions), 0) as total_impressions,
    COALESCE(SUM(san.reach), 0) as total_reach,
    COALESCE(SUM(san.likes + san.comments + san.shares + san.reactions), 0) as total_engagement,
    COALESCE(AVG(san.engagement_rate), 0) as avg_engagement_rate,
    COALESCE(SUM(san.link_clicks), 0) as total_clicks,
    COALESCE(COUNT(DISTINCT sp.id), 0) as posts_count,
    
    -- Growth Metrics
    COALESCE(AVG(aa.net_follower_growth), 0) as avg_daily_follower_growth,
    COALESCE(MAX(aa.followers_count), 0) as current_followers,
    
    -- Performance Tier
    CASE 
        WHEN AVG(san.engagement_rate) >= 5.0 THEN 'High Engagement'
        WHEN AVG(san.engagement_rate) >= 2.0 THEN 'Good Engagement'
        ELSE 'Standard'
    END as performance_tier,
    
    COALESCE(MAX(san.updated_at), NOW()) as last_updated

FROM social_accounts sa
LEFT JOIN users u ON sa.user_id = u.id
LEFT JOIN social_posts sp ON sa.id = sp.account_id
LEFT JOIN social_analytics san ON sp.id = san.post_id 
    AND san.analytics_date >= CURRENT_DATE - INTERVAL '30 days'
LEFT JOIN account_analytics aa ON sa.id = aa.account_id 
    AND aa.analytics_date >= CURRENT_DATE - INTERVAL '30 days'
WHERE sa.is_active = true
GROUP BY sa.id, sa.platform, sa.account_name, sa.user_id, u.name, u.region;

-- Top Performing Content View
CREATE OR REPLACE VIEW top_performing_content AS
SELECT 
    sp.id as post_id,
    sp.content,
    sp.post_type,
    sa.platform,
    sa.account_name,
    u.name as retailer_name,
    
    COALESCE(san.impressions, 0) as impressions,
    COALESCE(san.reach, 0) as reach,
    COALESCE(san.engagement_rate, 0) as engagement_rate,
    COALESCE((san.likes + san.comments + san.shares + san.reactions), 0) as total_engagement,
    COALESCE(san.link_clicks, 0) as link_clicks,
    
    sp.published_at,
    sp.hashtags,
    
    ROW_NUMBER() OVER (PARTITION BY sa.platform ORDER BY san.engagement_rate DESC) as platform_rank

FROM social_posts sp
JOIN social_accounts sa ON sp.account_id = sa.id
LEFT JOIN users u ON sa.user_id = u.id
LEFT JOIN social_analytics san ON sp.id = san.post_id
WHERE sp.status = 'published' 
    AND (san.analytics_date IS NULL OR san.analytics_date >= CURRENT_DATE - INTERVAL '90 days')
ORDER BY san.engagement_rate DESC NULLS LAST;

-- =====================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience_demographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtag_performance ENABLE ROW LEVEL SECURITY;

-- Social accounts policies
CREATE POLICY "Users can view their own social accounts" ON social_accounts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own social accounts" ON social_accounts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own social accounts" ON social_accounts
    FOR UPDATE USING (auth.uid() = user_id);

-- Social posts policies
CREATE POLICY "Users can view posts from their accounts" ON social_posts
    FOR SELECT USING (
        account_id IN (
            SELECT id FROM social_accounts WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert posts to their accounts" ON social_posts
    FOR INSERT WITH CHECK (
        account_id IN (
            SELECT id FROM social_accounts WHERE user_id = auth.uid()
        )
    );

-- Social analytics policies (read-only for account owners)
CREATE POLICY "Users can view analytics for their accounts" ON social_analytics
    FOR SELECT USING (
        account_id IN (
            SELECT id FROM social_accounts WHERE user_id = auth.uid()
        )
    );

-- Account analytics policies
CREATE POLICY "Users can view account analytics for their accounts" ON account_analytics
    FOR SELECT USING (
        account_id IN (
            SELECT id FROM social_accounts WHERE user_id = auth.uid()
        )
    );

-- Audience demographics policies
CREATE POLICY "Users can view demographics for their accounts" ON audience_demographics
    FOR SELECT USING (
        account_id IN (
            SELECT id FROM social_accounts WHERE user_id = auth.uid()
        )
    );

-- Hashtag performance policies
CREATE POLICY "Users can view hashtag performance for their accounts" ON hashtag_performance
    FOR SELECT USING (
        account_id IN (
            SELECT id FROM social_accounts WHERE user_id = auth.uid()
        )
    );

-- =====================================================
-- 5. DUMMY DATA POPULATION
-- =====================================================

-- First, let's create some sample social accounts for existing retailers
INSERT INTO social_accounts (user_id, platform, account_handle, account_name, profile_url, ayrshare_profile_key, is_active, connected_at, last_sync_at, account_metadata)
SELECT 
    u.id,
    platform.name,
    LOWER(REPLACE(u.name, ' ', '_')) || '_' || LOWER(platform.name),
    u.name || ' ' || INITCAP(platform.name),
    CASE platform.name
        WHEN 'linkedin' THEN 'https://linkedin.com/company/' || LOWER(REPLACE(u.name, ' ', '-'))
        WHEN 'instagram' THEN 'https://instagram.com/' || LOWER(REPLACE(u.name, ' ', '_'))
        WHEN 'facebook' THEN 'https://facebook.com/' || LOWER(REPLACE(u.name, ' ', ''))
        WHEN 'google_business' THEN 'https://business.google.com/dashboard/l/' || LOWER(REPLACE(u.name, ' ', '-'))
    END,
    'ayr_' || LOWER(platform.name) || '_' || SUBSTRING(u.id::text, 1, 8),
    true,
    NOW() - (RANDOM() * INTERVAL '90 days'),
    NOW() - (RANDOM() * INTERVAL '1 day'),
    CASE platform.name
        WHEN 'linkedin' THEN '{"company_size": "51-200", "industry": "Luxury Goods"}'::jsonb
        WHEN 'instagram' THEN '{"business_type": "Retail", "category": "Jewelry Store"}'::jsonb
        WHEN 'facebook' THEN '{"page_type": "Business", "category": "Jewelry & Watches Store"}'::jsonb
        WHEN 'google_business' THEN '{"business_type": "Jewelry store", "verified": true}'::jsonb
    END
FROM users u
CROSS JOIN (
    VALUES ('linkedin'), ('instagram'), ('facebook'), ('google_business')
) AS platform(name)
WHERE u.user_type = 'retailer'
ON CONFLICT DO NOTHING;

-- Create sample social posts for each account
INSERT INTO social_posts (account_id, post_type, content, hashtags, published_at, status, post_metadata)
SELECT 
    sa.id,
    post_types.type,
    post_content.content,
    post_content.hashtags,
    NOW() - (FLOOR(RANDOM() * 30) || ' days')::INTERVAL + 
    (FLOOR(RANDOM() * 24) || ' hours')::INTERVAL,
    'published',
    CASE sa.platform
        WHEN 'linkedin' THEN '{"post_format": "single_image", "target_audience": "professionals"}'::jsonb
        WHEN 'instagram' THEN '{"aspect_ratio": "1:1", "filter": "none", "location": "New York, NY"}'::jsonb
        WHEN 'facebook' THEN '{"audience": "public", "boost_eligible": true}'::jsonb
        WHEN 'google_business' THEN '{"post_type": "offer", "cta_button": "Learn More"}'::jsonb
    END
FROM social_accounts sa
CROSS JOIN (
    VALUES 
        ('image'), ('video'), ('carousel')
) AS post_types(type)
CROSS JOIN (
    VALUES 
        ('✨ Discover the elegance of our new luxury collection. Each piece crafted with precision and passion. #LuxuryJewelry #Craftsmanship #Elegance', ARRAY['#LuxuryJewelry', '#Craftsmanship', '#Elegance']),
        ('🎯 Behind the scenes: The artistry that goes into every handcrafted piece. #BehindTheScenes #Artistry #Handcrafted', ARRAY['#BehindTheScenes', '#Artistry', '#Handcrafted']),
        ('💎 Introducing our exclusive Marco Bicego collection - where Italian heritage meets modern sophistication. #MarcoBicego #Italian #Sophistication', ARRAY['#MarcoBicego', '#Italian', '#Sophistication']),
        ('🌟 Client spotlight: See how our pieces become part of life''s most precious moments. #ClientSpotlight #PreciousMoments #Luxury', ARRAY['#ClientSpotlight', '#PreciousMoments', '#Luxury']),
        ('🏆 Award-winning designs that capture the essence of timeless beauty. #AwardWinning #TimelessBeauty #Design', ARRAY['#AwardWinning', '#TimelessBeauty', '#Design']),
        ('💍 Engagement season is here! Find the perfect ring to symbolize your love story. #EngagementRing #LoveStory #Perfect', ARRAY['#EngagementRing', '#LoveStory', '#Perfect'])
) AS post_content(content, hashtags)
WHERE sa.is_active = true
LIMIT 300; -- Reasonable number of posts across all accounts

-- Generate social analytics data for the past 30 days
INSERT INTO social_analytics (
    post_id, account_id, platform, analytics_date,
    impressions, reach, organic_reach, paid_reach,
    likes, comments, shares, reactions, saves,
    link_clicks, profile_clicks, website_clicks,
    video_views, video_completion_rate, average_watch_time,
    platform_metrics
)
SELECT 
    sp.id,
    sp.account_id,
    sa.platform,
    date_series.date,
    -- Platform-appropriate impression ranges
    CASE sa.platform
        WHEN 'instagram' THEN FLOOR(RANDOM() * 5000 + 1000)::INTEGER
        WHEN 'linkedin' THEN FLOOR(RANDOM() * 2000 + 500)::INTEGER
        WHEN 'facebook' THEN FLOOR(RANDOM() * 3000 + 800)::INTEGER
        WHEN 'google_business' THEN FLOOR(RANDOM() * 1500 + 300)::INTEGER
    END as impressions,
    -- Reach (typically 60-80% of impressions)
    FLOOR((CASE sa.platform
        WHEN 'instagram' THEN FLOOR(RANDOM() * 5000 + 1000)
        WHEN 'linkedin' THEN FLOOR(RANDOM() * 2000 + 500)
        WHEN 'facebook' THEN FLOOR(RANDOM() * 3000 + 800)
        WHEN 'google_business' THEN FLOOR(RANDOM() * 1500 + 300)
    END) * (0.6 + RANDOM() * 0.2))::INTEGER as reach,
    -- Organic reach (70-90% of total reach)
    FLOOR((CASE sa.platform
        WHEN 'instagram' THEN FLOOR(RANDOM() * 5000 + 1000)
        WHEN 'linkedin' THEN FLOOR(RANDOM() * 2000 + 500)
        WHEN 'facebook' THEN FLOOR(RANDOM() * 3000 + 800)
        WHEN 'google_business' THEN FLOOR(RANDOM() * 1500 + 300)
    END) * (0.6 + RANDOM() * 0.2) * (0.7 + RANDOM() * 0.2))::INTEGER as organic_reach,
    -- Paid reach (10-30% of total reach)
    FLOOR((CASE sa.platform
        WHEN 'instagram' THEN FLOOR(RANDOM() * 5000 + 1000)
        WHEN 'linkedin' THEN FLOOR(RANDOM() * 2000 + 500)
        WHEN 'facebook' THEN FLOOR(RANDOM() * 3000 + 800)
        WHEN 'google_business' THEN FLOOR(RANDOM() * 1500 + 300)
    END) * (0.6 + RANDOM() * 0.2) * (0.1 + RANDOM() * 0.2))::INTEGER as paid_reach,
    -- Engagement metrics with platform-appropriate ranges
    FLOOR(RANDOM() * 100 + 10)::INTEGER as likes,
    FLOOR(RANDOM() * 20 + 2)::INTEGER as comments,
    FLOOR(RANDOM() * 15 + 1)::INTEGER as shares,
    FLOOR(RANDOM() * 25 + 3)::INTEGER as reactions,
    CASE sa.platform WHEN 'instagram' THEN FLOOR(RANDOM() * 30 + 5)::INTEGER ELSE 0 END as saves,
    FLOOR(RANDOM() * 30 + 5)::INTEGER as link_clicks,
    FLOOR(RANDOM() * 20 + 2)::INTEGER as profile_clicks,
    FLOOR(RANDOM() * 25 + 3)::INTEGER as website_clicks,
    -- Video metrics (only for video posts)
    CASE sp.post_type 
        WHEN 'video' THEN FLOOR(RANDOM() * 2000 + 200)::INTEGER 
        ELSE 0 
    END as video_views,
    CASE sp.post_type 
        WHEN 'video' THEN (RANDOM() * 80 + 20)::DECIMAL(5,2)
        ELSE 0 
    END as video_completion_rate,
    CASE sp.post_type 
        WHEN 'video' THEN FLOOR(RANDOM() * 120 + 30)::INTEGER 
        ELSE 0 
    END as average_watch_time,
    -- Platform-specific metrics
    CASE sa.platform
        WHEN 'linkedin' THEN '{"company_page_clicks": ' || FLOOR(RANDOM() * 50 + 5) || ', "career_page_clicks": ' || FLOOR(RANDOM() * 10 + 1) || '}'
        WHEN 'instagram' THEN '{"story_exits": ' || FLOOR(RANDOM() * 20 + 2) || ', "story_replies": ' || FLOOR(RANDOM() * 5 + 1) || '}'
        WHEN 'facebook' THEN '{"post_clicks": ' || FLOOR(RANDOM() * 40 + 5) || ', "other_clicks": ' || FLOOR(RANDOM() * 15 + 2) || '}'
        WHEN 'google_business' THEN '{"direction_requests": ' || FLOOR(RANDOM() * 25 + 3) || ', "phone_calls": ' || FLOOR(RANDOM() * 10 + 1) || '}'
    END::jsonb as platform_metrics
FROM social_posts sp
JOIN social_accounts sa ON sp.account_id = sa.id
CROSS JOIN (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '30 days',
        CURRENT_DATE - INTERVAL '1 day',
        INTERVAL '1 day'
    )::date as date
) date_series
WHERE sp.status = 'published'
    AND sp.published_at::date <= date_series.date
ON CONFLICT (post_id, analytics_date) DO NOTHING;

-- Generate account analytics data for the past 30 days
INSERT INTO account_analytics (
    account_id, platform, analytics_date,
    followers_count, following_count, new_followers, unfollowers,
    profile_visits, profile_actions, website_clicks_from_profile,
    total_posts, total_impressions, total_reach, total_engagement,
    platform_account_metrics, average_engagement_rate
)
SELECT 
    sa.id,
    sa.platform,
    date_series.date,
    -- Follower counts with gradual growth
    CASE sa.platform
        WHEN 'instagram' THEN 5000 + FLOOR(RANDOM() * 10000) + (date_series.date - CURRENT_DATE + 30) * (5 + FLOOR(RANDOM() * 15))
        WHEN 'linkedin' THEN 1000 + FLOOR(RANDOM() * 5000) + (date_series.date - CURRENT_DATE + 30) * (2 + FLOOR(RANDOM() * 8))
        WHEN 'facebook' THEN 3000 + FLOOR(RANDOM() * 8000) + (date_series.date - CURRENT_DATE + 30) * (3 + FLOOR(RANDOM() * 12))
        WHEN 'google_business' THEN 500 + FLOOR(RANDOM() * 2000) + (date_series.date - CURRENT_DATE + 30) * (1 + FLOOR(RANDOM() * 5))
    END::INTEGER as followers_count,
    -- Following count (lower for business accounts)
    FLOOR(RANDOM() * 500 + 100)::INTEGER as following_count,
    -- Daily new followers
    FLOOR(RANDOM() * 20 + 5)::INTEGER as new_followers,
    -- Daily unfollowers (typically lower)
    FLOOR(RANDOM() * 8 + 1)::INTEGER as unfollowers,
    -- Profile visits
    FLOOR(RANDOM() * 200 + 50)::INTEGER as profile_visits,
    FLOOR(RANDOM() * 50 + 10)::INTEGER as profile_actions,
    FLOOR(RANDOM() * 30 + 5)::INTEGER as website_clicks_from_profile,
    -- Daily content metrics
    CASE WHEN RANDOM() > 0.7 THEN FLOOR(RANDOM() * 3 + 1)::INTEGER ELSE 0 END as total_posts,
    FLOOR(RANDOM() * 5000 + 1000)::INTEGER as total_impressions,
    FLOOR(RANDOM() * 3000 + 600)::INTEGER as total_reach,
    FLOOR(RANDOM() * 200 + 50)::INTEGER as total_engagement,
    -- Platform-specific account metrics
    CASE sa.platform
        WHEN 'linkedin' THEN '{"company_page_views": ' || FLOOR(RANDOM() * 100 + 20) || ', "career_page_views": ' || FLOOR(RANDOM() * 30 + 5) || '}'
        WHEN 'instagram' THEN '{"story_views": ' || FLOOR(RANDOM() * 500 + 100) || ', "reel_plays": ' || FLOOR(RANDOM() * 1000 + 200) || '}'
        WHEN 'facebook' THEN '{"page_views": ' || FLOOR(RANDOM() * 150 + 30) || ', "page_previews": ' || FLOOR(RANDOM() * 80 + 15) || '}'
        WHEN 'google_business' THEN '{"search_views": ' || FLOOR(RANDOM() * 200 + 40) || ', "map_views": ' || FLOOR(RANDOM() * 100 + 20) || '}'
    END::jsonb as platform_account_metrics,
    -- Average engagement rate
    (RANDOM() * 8 + 1)::DECIMAL(5,2) as average_engagement_rate
FROM social_accounts sa
CROSS JOIN (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '30 days',
        CURRENT_DATE - INTERVAL '1 day',
        INTERVAL '1 day'
    )::date as date
) date_series
WHERE sa.is_active = true
ON CONFLICT (account_id, analytics_date) DO NOTHING;

-- Generate audience demographics data (weekly snapshots)
INSERT INTO audience_demographics (
    account_id, platform, analytics_date,
    age_13_17, age_18_24, age_25_34, age_35_44, age_45_54, age_55_64, age_65_plus,
    gender_male, gender_female, gender_other,
    top_countries, top_cities, interests
)
SELECT 
    sa.id,
    sa.platform,
    date_series.date,
    -- Age demographics (luxury jewelry skews older)
    (RANDOM() * 5 + 2)::DECIMAL(5,2) as age_13_17,
    (RANDOM() * 15 + 10)::DECIMAL(5,2) as age_18_24,
    (RANDOM() * 25 + 20)::DECIMAL(5,2) as age_25_34,
    (RANDOM() * 20 + 25)::DECIMAL(5,2) as age_35_44,
    (RANDOM() * 15 + 20)::DECIMAL(5,2) as age_45_54,
    (RANDOM() * 10 + 15)::DECIMAL(5,2) as age_55_64,
    (RANDOM() * 8 + 5)::DECIMAL(5,2) as age_65_plus,
    -- Gender demographics (luxury jewelry skews female)
    (RANDOM() * 15 + 25)::DECIMAL(5,2) as gender_male,
    (RANDOM() * 15 + 65)::DECIMAL(5,2) as gender_female,
    (RANDOM() * 3 + 1)::DECIMAL(5,2) as gender_other,
    -- Geographic data
    '{"US": 45.2, "UK": 12.8, "CA": 8.5, "AU": 6.2, "DE": 4.8, "FR": 4.1, "IT": 3.9, "JP": 3.2, "CH": 2.8, "NL": 2.5}'::jsonb as top_countries,
    '{"New York": 15.2, "London": 8.9, "Los Angeles": 7.3, "Toronto": 5.1, "Sydney": 4.2, "Paris": 3.8, "Milan": 3.1, "Tokyo": 2.9, "Zurich": 2.4, "Amsterdam": 2.1}'::jsonb as top_cities,
    -- Interest categories
    '{"luxury": 45.5, "jewelry": 38.2, "fashion": 32.1, "lifestyle": 28.9, "beauty": 22.3, "travel": 18.7, "art": 15.2, "design": 12.8, "watches": 11.4, "accessories": 9.7}'::jsonb as interests
FROM social_accounts sa
CROSS JOIN (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '28 days',
        CURRENT_DATE - INTERVAL '1 day',
        INTERVAL '7 days'
    )::date as date
) date_series
WHERE sa.is_active = true
ON CONFLICT (account_id, platform, analytics_date) DO NOTHING;

-- Generate hashtag performance data
INSERT INTO hashtag_performance (
    account_id, hashtag, platform, analytics_date,
    posts_count, total_impressions, total_reach, total_engagement,
    average_engagement_rate, click_through_rate
)
SELECT 
    sa.id,
    hashtag,
    sa.platform,
    CURRENT_DATE - INTERVAL '7 days',
    FLOOR(RANDOM() * 5 + 1)::INTEGER as posts_count,
    FLOOR(RANDOM() * 2000 + 500)::INTEGER as total_impressions,
    FLOOR(RANDOM() * 1500 + 300)::INTEGER as total_reach,
    FLOOR(RANDOM() * 150 + 30)::INTEGER as total_engagement,
    (RANDOM() * 8 + 2)::DECIMAL(5,2) as average_engagement_rate,
    (RANDOM() * 3 + 0.5)::DECIMAL(5,2) as click_through_rate
FROM social_accounts sa
CROSS JOIN (
    VALUES 
        ('#LuxuryJewelry'), ('#Craftsmanship'), ('#Elegance'), ('#MarcoBicego'),
        ('#Italian'), ('#Sophistication'), ('#BehindTheScenes'), ('#Artistry'),
        ('#Handcrafted'), ('#ClientSpotlight'), ('#PreciousMoments'), ('#Luxury'),
        ('#AwardWinning'), ('#TimelessBeauty'), ('#Design'), ('#EngagementRing'),
        ('#LoveStory'), ('#Perfect'), ('#Jewelry'), ('#Fashion'), ('#Style'),
        ('#Diamonds'), ('#Gold'), ('#Silver'), ('#Watches'), ('#Accessories')
) AS hashtags(hashtag)
WHERE sa.is_active = true
    AND RANDOM() > 0.7 -- Only some accounts use each hashtag
ON CONFLICT (account_id, hashtag, platform, analytics_date) DO NOTHING;

-- =====================================================
-- 6. REFRESH MATERIALIZED VIEWS (if any)
-- =====================================================

-- Note: The views we created are regular views, not materialized views
-- They will automatically reflect the latest data

-- =====================================================
-- 7. VERIFICATION QUERIES
-- =====================================================

-- Verify data was inserted correctly
DO $$
DECLARE
    account_count INTEGER;
    post_count INTEGER;
    analytics_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO account_count FROM social_accounts;
    SELECT COUNT(*) INTO post_count FROM social_posts;
    SELECT COUNT(*) INTO analytics_count FROM social_analytics;
    
    RAISE NOTICE 'Social Media Analytics Setup Complete:';
    RAISE NOTICE '- Social Accounts: %', account_count;
    RAISE NOTICE '- Social Posts: %', post_count;
    RAISE NOTICE '- Analytics Records: %', analytics_count;
    
    IF account_count = 0 THEN
        RAISE WARNING 'No social accounts created. Make sure users table has retailer records.';
    END IF;
END $$;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================