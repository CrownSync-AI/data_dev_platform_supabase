#!/usr/bin/env node

/**
 * Debug Social Media Analytics Database
 * 
 * This script checks the database state and API responses to identify
 * why the overview dashboard is showing empty data.
 */

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function debugDatabase() {
  console.log('🔍 Debugging Social Media Analytics Database\n')
  console.log('='.repeat(60))

  // 1. Check if tables exist
  console.log('\n📋 1. Checking Table Existence...')
  
  const tables = [
    'social_accounts',
    'social_posts', 
    'social_analytics',
    'account_analytics',
    'audience_demographics',
    'hashtag_performance'
  ]

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`)
      } else {
        console.log(`   ✅ ${table}: ${count} records`)
      }
    } catch (err) {
      console.log(`   ❌ ${table}: ${err.message}`)
    }
  }

  // 2. Check views
  console.log('\n📊 2. Checking Database Views...')
  
  const views = ['social_performance_summary', 'top_performing_content']
  
  for (const view of views) {
    try {
      const { count, error } = await supabase
        .from(view)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.log(`   ❌ ${view}: ${error.message}`)
      } else {
        console.log(`   ✅ ${view}: ${count} records`)
      }
    } catch (err) {
      console.log(`   ❌ ${view}: ${err.message}`)
    }
  }

  // 3. Check users table for retailers
  console.log('\n👥 3. Checking Users Table...')
  
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, user_type, region')
      .eq('user_type', 'retailer')

    if (error) {
      console.log(`   ❌ Users query error: ${error.message}`)
    } else {
      console.log(`   ✅ Found ${users.length} retailer users`)
      if (users.length > 0) {
        console.log('   Sample retailers:')
        users.slice(0, 3).forEach(user => {
          console.log(`     - ${user.name} (${user.region || 'No region'})`)
        })
      } else {
        console.log('   ⚠️  No retailer users found - this is likely the problem!')
      }
    }
  } catch (err) {
    console.log(`   ❌ Users table error: ${err.message}`)
  }

  // 4. Check social accounts data
  console.log('\n📱 4. Checking Social Accounts Data...')
  
  try {
    const { data: accounts, error } = await supabase
      .from('social_accounts')
      .select('id, platform, account_name, user_id, is_active')
      .limit(5)

    if (error) {
      console.log(`   ❌ Social accounts error: ${error.message}`)
    } else {
      console.log(`   ✅ Found ${accounts.length} social accounts`)
      accounts.forEach(account => {
        console.log(`     - ${account.account_name} (${account.platform}) - Active: ${account.is_active}`)
      })
    }
  } catch (err) {
    console.log(`   ❌ Social accounts error: ${err.message}`)
  }

  // 5. Check social analytics data
  console.log('\n📈 5. Checking Social Analytics Data...')
  
  try {
    const { data: analytics, error } = await supabase
      .from('social_analytics')
      .select('platform, analytics_date, impressions, reach, engagement_rate')
      .order('analytics_date', { ascending: false })
      .limit(5)

    if (error) {
      console.log(`   ❌ Social analytics error: ${error.message}`)
    } else {
      console.log(`   ✅ Found ${analytics.length} analytics records`)
      analytics.forEach(record => {
        console.log(`     - ${record.platform} (${record.analytics_date}): ${record.impressions} impressions, ${record.engagement_rate}% engagement`)
      })
    }
  } catch (err) {
    console.log(`   ❌ Social analytics error: ${err.message}`)
  }

  // 6. Test the performance summary view
  console.log('\n🎯 6. Testing Performance Summary View...')
  
  try {
    const { data: summary, error } = await supabase
      .from('social_performance_summary')
      .select('*')
      .limit(3)

    if (error) {
      console.log(`   ❌ Performance summary error: ${error.message}`)
    } else {
      console.log(`   ✅ Performance summary working: ${summary.length} records`)
      summary.forEach(record => {
        console.log(`     - ${record.retailer_name} (${record.platform}): ${record.total_reach} reach, ${record.avg_engagement_rate}% engagement`)
      })
    }
  } catch (err) {
    console.log(`   ❌ Performance summary error: ${err.message}`)
  }

  // 7. Test API endpoints
  console.log('\n🌐 7. Testing API Endpoints...')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    const response = await fetch(`${baseUrl}/api/social-analytics`)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`   ✅ Main API endpoint working`)
      console.log(`     - Success: ${data.success}`)
      console.log(`     - Total Reach: ${data.data?.totalReach || 0}`)
      console.log(`     - Total Engagement: ${data.data?.totalEngagement || 0}`)
      console.log(`     - Avg Engagement Rate: ${data.data?.avgEngagementRate || 0}%`)
      console.log(`     - Raw Data Records: ${data.rawData?.length || 0}`)
    } else {
      console.log(`   ❌ API endpoint failed: ${response.status} ${response.statusText}`)
    }
  } catch (err) {
    console.log(`   ❌ API endpoint error: ${err.message}`)
    console.log('   💡 Make sure your development server is running (npm run dev)')
  }

  // 8. Recommendations
  console.log('\n💡 8. Recommendations...')
  
  // Check what might be missing
  const { count: userCount } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('user_type', 'retailer')

  const { count: accountCount } = await supabase
    .from('social_accounts')
    .select('*', { count: 'exact', head: true })

  const { count: analyticsCount } = await supabase
    .from('social_analytics')
    .select('*', { count: 'exact', head: true })

  if (userCount === 0) {
    console.log('   🔧 ISSUE: No retailer users found')
    console.log('      Solution: Create retailer users first, then run social media setup')
    console.log('      Command: INSERT INTO users (name, user_type, region) VALUES (\'Test Retailer\', \'retailer\', \'East\');')
  } else if (accountCount === 0) {
    console.log('   🔧 ISSUE: No social accounts created')
    console.log('      Solution: Run the social media setup scripts')
    console.log('      Files: supabase/social_media_quick_setup.sql, then supabase/social_media_dummy_data.sql')
  } else if (analyticsCount === 0) {
    console.log('   🔧 ISSUE: No analytics data')
    console.log('      Solution: Run the dummy data script')
    console.log('      File: supabase/social_media_dummy_data.sql')
  } else {
    console.log('   ✅ Database seems properly set up')
    console.log('   🔧 Check if development server is running and API endpoints are accessible')
  }

  console.log('\n' + '='.repeat(60))
  console.log('🎯 Debug Complete!')
}

// Run the debug
debugDatabase().catch(console.error)