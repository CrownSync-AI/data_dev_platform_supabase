#!/usr/bin/env node

/**
 * Social Media Analytics API Test Script
 * 
 * This script tests all the social media analytics API endpoints
 * to ensure they return data correctly after database setup.
 */

const fetch = require('node-fetch')

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testEndpoint(name, url, expectedFields = []) {
  try {
    console.log(`\n🔍 Testing ${name}...`)
    console.log(`   URL: ${url}`)
    
    const response = await fetch(url)
    
    if (!response.ok) {
      console.log(`   ❌ HTTP ${response.status}: ${response.statusText}`)
      return false
    }
    
    const data = await response.json()
    
    if (data.success) {
      console.log(`   ✅ Success: ${data.data ? (Array.isArray(data.data) ? data.data.length : 'Object') : 'No data'} records`)
      
      // Check expected fields
      if (expectedFields.length > 0 && data.data) {
        const sampleRecord = Array.isArray(data.data) ? data.data[0] : data.data
        const missingFields = expectedFields.filter(field => !(field in sampleRecord))
        
        if (missingFields.length > 0) {
          console.log(`   ⚠️  Missing fields: ${missingFields.join(', ')}`)
        } else {
          console.log(`   ✅ All expected fields present`)
        }
      }
      
      return true
    } else {
      console.log(`   ❌ API Error: ${data.error || 'Unknown error'}`)
      return false
    }
    
  } catch (error) {
    console.log(`   ❌ Request Error: ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('🚀 Testing Social Media Analytics API Endpoints\n')
  console.log('='.repeat(50))
  
  const tests = [
    {
      name: 'Main Analytics Endpoint',
      url: `${BASE_URL}/api/social-analytics`,
      expectedFields: ['totalReach', 'totalEngagement', 'avgEngagementRate', 'totalClicks', 'newFollowers', 'platformBreakdown']
    },
    {
      name: 'Performance Rankings',
      url: `${BASE_URL}/api/social-analytics/performance`,
      expectedFields: ['retailer_name', 'region', 'platforms', 'total_followers', 'avg_engagement_rate', 'rank']
    },
    {
      name: 'Top Content',
      url: `${BASE_URL}/api/social-analytics/content`,
      expectedFields: ['post_id', 'content', 'platform', 'engagement_rate', 'reach', 'impressions']
    },
    {
      name: 'Engagement Trends',
      url: `${BASE_URL}/api/social-analytics/trends`,
      expectedFields: []
    },
    {
      name: 'Social Accounts',
      url: `${BASE_URL}/api/social-analytics/accounts`,
      expectedFields: []
    }
  ]
  
  let passedTests = 0
  
  for (const test of tests) {
    const passed = await testEndpoint(test.name, test.url, test.expectedFields)
    if (passed) passedTests++
  }
  
  console.log('\n' + '='.repeat(50))
  console.log(`📊 Test Results: ${passedTests}/${tests.length} endpoints working`)
  
  if (passedTests === tests.length) {
    console.log('✅ All API endpoints are working correctly!')
    console.log('\n🎯 Next Steps:')
    console.log('   1. Open your browser to: http://localhost:3000/dashboard/brand-performance/social-analytics')
    console.log('   2. Verify all components display data correctly')
    console.log('   3. Test filtering and sorting functionality')
  } else {
    console.log('⚠️  Some endpoints are not working. Check the following:')
    console.log('   1. Make sure your development server is running (npm run dev)')
    console.log('   2. Verify the database setup was completed successfully')
    console.log('   3. Check your .env.local file has correct Supabase credentials')
  }
  
  // Test specific filters
  console.log('\n🔍 Testing Filters...')
  
  const filterTests = [
    {
      name: 'Platform Filter (Instagram)',
      url: `${BASE_URL}/api/social-analytics?platform=instagram`
    },
    {
      name: 'Region Filter (East)',
      url: `${BASE_URL}/api/social-analytics?region=East`
    },
    {
      name: 'Performance Tier Filter',
      url: `${BASE_URL}/api/social-analytics?performanceTier=High%20Engagement`
    },
    {
      name: 'Date Range Filter',
      url: `${BASE_URL}/api/social-analytics?startDate=2025-01-01&endDate=2025-01-31`
    }
  ]
  
  for (const test of filterTests) {
    await testEndpoint(test.name, test.url)
  }
  
  console.log('\n🎉 Social Media Analytics API testing complete!')
}

// Run the tests
runTests().catch(console.error)