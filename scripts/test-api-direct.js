#!/usr/bin/env node

/**
 * Direct API Test
 * Tests the social analytics API endpoint directly
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testAPI() {
  console.log('🧪 Testing API Logic Directly...\n')

  try {
    // Test the social_performance_summary view directly
    console.log('1. Testing social_performance_summary view...')
    
    const { data: socialData, error } = await supabase
      .from('social_performance_summary')
      .select('*')

    if (error) {
      console.log('❌ View query failed:', error.message)
      return
    }

    console.log(`✅ Found ${socialData.length} records in social_performance_summary`)
    
    if (socialData.length > 0) {
      console.log('Sample record:', socialData[0])
      
      // Calculate metrics like the API does
      const totalReach = socialData.reduce((sum, item) => sum + (item.total_reach || 0), 0)
      const totalEngagement = socialData.reduce((sum, item) => sum + (item.total_engagement || 0), 0)
      const avgEngagementRate = socialData.length > 0 
        ? socialData.reduce((sum, item) => sum + (item.avg_engagement_rate || 0), 0) / socialData.length 
        : 0
      const totalClicks = socialData.reduce((sum, item) => sum + (item.total_clicks || 0), 0)
      const newFollowers = socialData.reduce((sum, item) => sum + (item.avg_daily_follower_growth || 0), 0)

      console.log('\n📊 Calculated Metrics:')
      console.log(`   Total Reach: ${totalReach}`)
      console.log(`   Total Engagement: ${totalEngagement}`)
      console.log(`   Avg Engagement Rate: ${avgEngagementRate}%`)
      console.log(`   Total Clicks: ${totalClicks}`)
      console.log(`   New Followers: ${Math.round(newFollowers)}`)
      
      if (totalReach === 0) {
        console.log('\n❌ All metrics are zero - checking underlying data...')
        
        // Check social_analytics table directly
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('social_analytics')
          .select('impressions, reach, likes, comments, shares, reactions, link_clicks')
          .limit(5)

        if (analyticsError) {
          console.log('❌ Analytics query failed:', analyticsError.message)
        } else {
          console.log(`✅ Found ${analyticsData.length} analytics records`)
          console.log('Sample analytics:', analyticsData[0])
        }
      }
    } else {
      console.log('❌ No records in social_performance_summary view')
      
      // Check if the underlying tables have data
      const { count: accountCount } = await supabase
        .from('social_accounts')
        .select('*', { count: 'exact', head: true })

      const { count: postCount } = await supabase
        .from('social_posts')
        .select('*', { count: 'exact', head: true })

      const { count: analyticsCount } = await supabase
        .from('social_analytics')
        .select('*', { count: 'exact', head: true })

      console.log(`   Social accounts: ${accountCount}`)
      console.log(`   Social posts: ${postCount}`)
      console.log(`   Social analytics: ${analyticsCount}`)
    }

  } catch (err) {
    console.log('❌ Test failed:', err.message)
  }
}

testAPI()