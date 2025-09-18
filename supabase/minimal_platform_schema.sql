-- Minimal Platform Schema
-- Just the essentials for the All Platform reform

-- =====================================================
-- 1. CREATE PLATFORM_TRENDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS platform_trends (
    trend_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,
    campaign_id UUID,
    retailer_id UUID,
    trend_date DATE NOT NULL,
    total_reach INTEGER DEFAULT 0,
    avg_engagement_rate NUMERIC(5,2) DEFAULT 0,
    total_link_clicks INTEGER DEFAULT 0,
    new_followers INTEGER DEFAULT 0,
    total_impressions INTEGER DEFAULT 0,
    total_engagement INTEGER DEFAULT 0,
    total_posts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create basic indexes
CREATE INDEX IF NOT EXISTS idx_platform_trends_platform ON platform_trends(platform);
CREATE INDEX IF NOT EXISTS idx_platform_trends_date ON platform_trends(trend_date);

-- =====================================================
-- 2. ENABLE RLS (SIMPLE)
-- =====================================================

ALTER TABLE platform_trends ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists, then create new one
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view platform trends" ON platform_trends;
    CREATE POLICY "Users can view platform trends" ON platform_trends FOR SELECT USING (true);
EXCEPTION
    WHEN OTHERS THEN
        CREATE POLICY "Users can view platform trends" ON platform_trends FOR SELECT USING (true);
END $$;

-- =====================================================
-- 3. VERIFICATION
-- =====================================================

-- Check table exists
SELECT 'platform_trends table created' as status 
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'platform_trends');

-- Show table structure
\d platform_trends;