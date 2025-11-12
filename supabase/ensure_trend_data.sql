-- Ensure Platform Trends Data Exists
-- Simple script to populate trend data if missing

-- Check if platform_trends table exists and has data
DO $$
DECLARE
    trend_count INTEGER;
BEGIN
    -- Count existing trend records
    SELECT COUNT(*) INTO trend_count FROM platform_trends;
    
    -- If no data exists, create some
    IF trend_count = 0 THEN
        RAISE NOTICE 'No trend data found. Creating dummy trend data...';
        
        -- Insert guaranteed trend data for each platform and last 30 days
        INSERT INTO platform_trends (
            platform, campaign_id, retailer_id, trend_date,
            total_reach, avg_engagement_rate, total_link_clicks, new_followers,
            total_impressions, total_engagement, total_posts
        )
        SELECT 
            platforms.platform,
            uuid_generate_v4() as campaign_id,
            uuid_generate_v4() as retailer_id,
            CURRENT_DATE - (series.day_offset || ' days')::interval as trend_date,
            
            -- Generate realistic trending data with some variation
            (1000 + (random() * 3000)::integer + 
             CASE platforms.platform 
                 WHEN 'facebook' THEN 2000  
                 WHEN 'instagram' THEN 1500 
                 WHEN 'linkedin' THEN 800   
                 WHEN 'twitter' THEN 1200   
                 ELSE 1000 
             END + 
             -- Add some trend variation based on day
             (sin(series.day_offset * 0.2) * 500)::integer
            ) as total_reach,
            
            -- Engagement rates with realistic variation
            (3.0 + (random() * 5.0)::numeric(5,2) + 
             CASE platforms.platform 
                 WHEN 'instagram' THEN 2.0  
                 WHEN 'facebook' THEN 1.0   
                 WHEN 'linkedin' THEN 0.5   
                 WHEN 'twitter' THEN 0.3    
                 ELSE 1.0 
             END +
             -- Add trend variation
             (sin(series.day_offset * 0.15) * 1.5)::numeric(5,2)
            ) as avg_engagement_rate,
            
            -- Link clicks with platform characteristics
            (20 + (random() * 150)::integer + 
             CASE platforms.platform 
                 WHEN 'linkedin' THEN 100   
                 WHEN 'facebook' THEN 60    
                 WHEN 'twitter' THEN 40     
                 WHEN 'instagram' THEN 20   
                 ELSE 30 
             END +
             -- Add weekly pattern (higher on weekdays)
             CASE WHEN extract(dow from CURRENT_DATE - series.day_offset) IN (1,2,3,4,5) THEN 20 ELSE 0 END
            ) as total_link_clicks,
            
            -- New followers with growth patterns
            (5 + (random() * 30)::integer + 
             CASE platforms.platform 
                 WHEN 'instagram' THEN 25   
                 WHEN 'facebook' THEN 15    
                 WHEN 'twitter' THEN 10     
                 WHEN 'linkedin' THEN 8     
                 ELSE 10 
             END +
             -- Add some growth trend (more followers in recent days)
             CASE WHEN series.day_offset < 7 THEN 10 ELSE 0 END
            ) as new_followers,
            
            -- Supporting metrics
            (1500 + (random() * 4000)::integer) as total_impressions,
            (80 + (random() * 300)::integer) as total_engagement,
            (1 + (random() * 3)::integer) as total_posts

        FROM (
            SELECT unnest(ARRAY['facebook', 'instagram', 'twitter', 'linkedin']) as platform
        ) platforms
        CROSS JOIN (
            SELECT generate_series(0, 29) as day_offset
        ) series;
        
        RAISE NOTICE 'Created % trend records', (SELECT COUNT(*) FROM platform_trends);
    ELSE
        RAISE NOTICE 'Found % existing trend records', trend_count;
    END IF;
END $$;

-- Verify the data
SELECT 
    platform,
    COUNT(*) as records,
    MIN(trend_date) as earliest_date,
    MAX(trend_date) as latest_date,
    ROUND(AVG(avg_engagement_rate), 2) as avg_engagement,
    SUM(total_reach) as total_reach
FROM platform_trends 
GROUP BY platform 
ORDER BY platform;

-- Show sample data for verification
SELECT 
    platform,
    trend_date,
    total_reach,
    avg_engagement_rate,
    total_link_clicks,
    new_followers
FROM platform_trends 
WHERE trend_date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY platform, trend_date DESC
LIMIT 20;