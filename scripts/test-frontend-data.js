#!/usr/bin/env node

/**
 * Test Frontend Data Flow
 * Simulates what the frontend should receive
 */

async function testFrontendFlow() {
  console.log('🧪 Testing Frontend Data Flow...\n')

  try {
    // Test the API endpoint that the frontend calls
    const response = await fetch('http://localhost:3000/api/social-analytics')
    
    if (!response.ok) {
      console.log(`❌ API failed: ${response.status}`)
      return
    }

    const result = await response.json()
    
    console.log('✅ API Response received')
    console.log('📊 Data structure:')
    console.log(`   Success: ${result.success}`)
    console.log(`   Has data: ${!!result.data}`)
    
    if (result.data) {
      console.log('\n📈 Metrics that should appear in dashboard:')
      console.log(`   Total Reach: ${result.data.totalReach?.toLocaleString() || 0}`)
      console.log(`   Total Engagement: ${result.data.totalEngagement?.toLocaleString() || 0}`)
      console.log(`   Avg Engagement Rate: ${result.data.avgEngagementRate || 0}%`)
      console.log(`   Total Clicks: ${result.data.totalClicks?.toLocaleString() || 0}`)
      console.log(`   New Followers: ${result.data.newFollowers?.toLocaleString() || 0}`)
      
      console.log('\n🎯 Platform Breakdown:')
      result.data.platformBreakdown?.forEach(platform => {
        console.log(`   ${platform.platform}: ${platform.reach?.toLocaleString()} reach, ${platform.engagement?.toLocaleString()} engagement`)
      })
      
      console.log(`\n📋 Raw Data Records: ${result.rawData?.length || 0}`)
      
      if (result.data.totalReach > 0) {
        console.log('\n✅ Data looks good! The dashboard should show these numbers.')
        console.log('\n🔧 If dashboard still shows zeros, check:')
        console.log('   1. Browser cache - try hard refresh (Ctrl+F5)')
        console.log('   2. Development server restart - stop and run "npm run dev" again')
        console.log('   3. Browser console for JavaScript errors')
        console.log('   4. Network tab to see if API calls are being made')
      } else {
        console.log('\n❌ All metrics are zero - there might be a data issue')
      }
    } else {
      console.log('\n❌ No data in response')
    }

  } catch (err) {
    console.log(`❌ Error: ${err.message}`)
    console.log('\n💡 Make sure:')
    console.log('   1. Development server is running: npm run dev')
    console.log('   2. Server is accessible at http://localhost:3000')
  }
}

testFrontendFlow()