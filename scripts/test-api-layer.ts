import dotenv from 'dotenv'
import { CampaignAnalyticsService } from '../lib/services/campaignAnalytics'

// Load environment variables
dotenv.config({ path: '.env.local' })

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testAPILayer() {
  console.log('🧪 Testing Campaign Analytics API Layer')
  console.log('=========================================')
  console.log(`🌐 Base URL: ${BASE_URL}`)

  try {
    // First, get a valid campaign ID from our service
    console.log('\n🔍 Getting valid campaign ID for testing...')
    const campaignsResult = await CampaignAnalyticsService.getAvailableCampaigns()
    
    if (campaignsResult.error || campaignsResult.data.length === 0) {
      console.error('❌ No campaigns available for testing')
      return
    }

    const testCampaignId = campaignsResult.data[0].campaign_id
    console.log(`✅ Using campaign ID: ${testCampaignId}`)

    // Test 1: GET /api/campaigns
    console.log('\n📋 Test 1: GET /api/campaigns')
    try {
      const response = await fetch(`${BASE_URL}/api/campaigns`)
      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ Status: ${response.status}`)
        console.log(`✅ Found ${data.total_count} campaigns`)
        console.log(`✅ Response structure: ${Object.keys(data).join(', ')}`)
        
        if (data.campaigns && data.campaigns.length > 0) {
          const campaign = data.campaigns[0]
          console.log(`✅ Sample campaign: ${campaign.campaign_name}`)
        }
      } else {
        console.log(`❌ Status: ${response.status}`)
        console.log(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error}`)
    }

    // Test 2: GET /api/campaigns/[id]/analytics (Basic)
    console.log('\n🏆 Test 2: GET /api/campaigns/[id]/analytics (Basic)')
    try {
      const response = await fetch(`${BASE_URL}/api/campaigns/${testCampaignId}/analytics`)
      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ Status: ${response.status}`)
        console.log(`✅ Found ${data.total_count} retailers`)
        console.log(`✅ Response structure: ${Object.keys(data).join(', ')}`)
        
        if (data.leaderboard && data.leaderboard.length > 0) {
          const topRetailer = data.leaderboard[0]
          console.log(`✅ Top performer: ${topRetailer.retailer_name} (${topRetailer.click_rate}%)`)
        }
      } else {
        console.log(`❌ Status: ${response.status}`)
        console.log(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error}`)
    }

    // Test 3: GET /api/campaigns/[id]/analytics with filters
    console.log('\n🌍 Test 3: GET /api/campaigns/[id]/analytics (Regional Filter)')
    try {
      const response = await fetch(`${BASE_URL}/api/campaigns/${testCampaignId}/analytics?region=East&limit=5`)
      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ Status: ${response.status}`)
        console.log(`✅ Found ${data.total_count} East region retailers`)
        console.log(`✅ Filters applied: ${JSON.stringify(data.filters_applied)}`)
        
        if (data.leaderboard && data.leaderboard.length > 0) {
          console.log(`✅ All retailers are from East: ${data.leaderboard.every((r: any) => r.region === 'East')}`)
          console.log(`✅ Limited to 5 results: ${data.leaderboard.length <= 5}`)
        }
      } else {
        console.log(`❌ Status: ${response.status}`)
        console.log(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error}`)
    }

    // Test 4: GET /api/campaigns/[id]/analytics with sorting
    console.log('\n📊 Test 4: GET /api/campaigns/[id]/analytics (Sorting)')
    try {
      const response = await fetch(`${BASE_URL}/api/campaigns/${testCampaignId}/analytics?sort_by=click_rate&sort_order=desc&limit=3`)
      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ Status: ${response.status}`)
        console.log(`✅ Top 3 by click rate (DESC):`)
        
        if (data.leaderboard && data.leaderboard.length > 0) {
          data.leaderboard.forEach((retailer: any, index: number) => {
            console.log(`   ${index + 1}. ${retailer.retailer_name}: ${retailer.click_rate}%`)
          })
          
          // Verify descending order
          const clickRates = data.leaderboard.map((r: any) => r.click_rate)
          const isDescending = clickRates.every((rate: number, i: number) => 
            i === 0 || clickRates[i - 1] >= rate
          )
          console.log(`✅ Sorting correct: ${isDescending}`)
        }
      } else {
        console.log(`❌ Status: ${response.status}`)
        console.log(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error}`)
    }

    // Test 5: GET /api/campaigns/[id]/analytics with pagination
    console.log('\n📄 Test 5: GET /api/campaigns/[id]/analytics (Pagination)')
    try {
      const response = await fetch(`${BASE_URL}/api/campaigns/${testCampaignId}/analytics?limit=5&offset=5`)
      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ Status: ${response.status}`)
        console.log(`✅ Page 2 (offset 5): ${data.leaderboard.length} retailers`)
        console.log(`✅ Total available: ${data.total_count}`)
        
        if (data.leaderboard && data.leaderboard.length > 0) {
          console.log(`✅ First retailer on page 2: ${data.leaderboard[0].retailer_name}`)
        }
      } else {
        console.log(`❌ Status: ${response.status}`)
        console.log(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error}`)
    }

    // Test 6: GET /api/campaigns/[id]/summary
    console.log('\n📈 Test 6: GET /api/campaigns/[id]/summary')
    try {
      const response = await fetch(`${BASE_URL}/api/campaigns/${testCampaignId}/summary`)
      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ Status: ${response.status}`)
        console.log(`✅ Response structure: ${Object.keys(data).join(', ')}`)
        
        if (data.summary) {
          const summary = data.summary
          console.log(`✅ Summary Statistics:`)
          console.log(`   👥 Total Retailers: ${summary.total_retailers}`)
          console.log(`   📧 Total Emails: ${summary.total_emails_sent?.toLocaleString()}`)
          console.log(`   📈 Avg Click Rate: ${summary.average_click_rate}%`)
          console.log(`   🌍 Regions: ${Object.keys(summary.by_region || {}).join(', ')}`)
          console.log(`   🎯 Tiers: ${Object.keys(summary.by_performance_tier || {}).join(', ')}`)
        }
      } else {
        console.log(`❌ Status: ${response.status}`)
        console.log(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error}`)
    }

    // Test 7: Error Handling - Invalid Campaign ID
    console.log('\n🚫 Test 7: Error Handling (Invalid Campaign ID)')
    try {
      const response = await fetch(`${BASE_URL}/api/campaigns/invalid-id/analytics`)
      const data = await response.json()
      
      if (!response.ok || data.leaderboard?.length === 0) {
        console.log(`✅ Status: ${response.status}`)
        console.log(`✅ Properly handled invalid campaign ID`)
        
        if (data.leaderboard?.length === 0) {
          console.log(`✅ Returned empty results as expected`)
        }
      } else {
        console.log(`❌ Should have failed with invalid campaign ID`)
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error}`)
    }

    // Test 8: Error Handling - Invalid Query Parameters
    console.log('\n🚫 Test 8: Error Handling (Invalid Query Parameters)')
    try {
      const response = await fetch(`${BASE_URL}/api/campaigns/${testCampaignId}/analytics?region=Invalid&sort_by=invalid&limit=abc`)
      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ Status: ${response.status}`)
        console.log(`✅ Gracefully handled invalid parameters`)
        console.log(`✅ Filters applied: ${JSON.stringify(data.filters_applied)}`)
        
        // Should ignore invalid parameters
        if (!data.filters_applied.region || data.filters_applied.region !== 'Invalid') {
          console.log(`✅ Invalid region parameter ignored`)
        }
        if (!data.filters_applied.sort_by || data.filters_applied.sort_by !== 'invalid') {
          console.log(`✅ Invalid sort_by parameter ignored`)
        }
      } else {
        console.log(`❌ Status: ${response.status}`)
        console.log(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error}`)
    }

    // Test 9: Performance Test
    console.log('\n⚡ Test 9: Performance Test')
    try {
      const startTime = Date.now()
      const response = await fetch(`${BASE_URL}/api/campaigns/${testCampaignId}/analytics`)
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      if (response.ok) {
        console.log(`✅ Status: ${response.status}`)
        console.log(`✅ Response time: ${responseTime}ms`)
        
        if (responseTime < 2000) {
          console.log(`✅ Performance acceptable (< 2 seconds)`)
        } else {
          console.log(`⚠️  Response time slower than expected (${responseTime}ms)`)
        }
      } else {
        console.log(`❌ Status: ${response.status}`)
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error}`)
    }

    // Test 10: Comprehensive Data Validation
    console.log('\n✅ Test 10: Comprehensive Data Validation')
    try {
      const response = await fetch(`${BASE_URL}/api/campaigns/${testCampaignId}/analytics`)
      const data = await response.json()
      
      if (response.ok && data.leaderboard?.length > 0) {
        const sample = data.leaderboard[0]
        
        console.log(`✅ Status: ${response.status}`)
        console.log(`✅ Required fields validation:`)
        console.log(`   📋 Has retailer_name: ${!!sample.retailer_name}`)
        console.log(`   🌍 Has region: ${!!sample.region}`)
        console.log(`   📧 Has emails_sent: ${typeof sample.emails_sent === 'number'}`)
        console.log(`   📈 Has click_rate: ${typeof sample.click_rate === 'number'}`)
        console.log(`   🏅 Has overall_rank: ${typeof sample.overall_rank === 'number'}`)
        console.log(`   🎯 Has performance_tier: ${!!sample.performance_tier}`)
        
        // Validate data consistency
        const allHaveValidRanks = data.leaderboard.every((retailer: any, index: number) => 
          retailer.overall_rank === index + 1
        )
        console.log(`   🔢 Ranking consistency: ${allHaveValidRanks}`)
        
        const allHaveValidRegions = data.leaderboard.every((retailer: any) => 
          ['East', 'Central', 'West'].includes(retailer.region)
        )
        console.log(`   🌍 Valid regions: ${allHaveValidRegions}`)
        
        const allHaveValidTiers = data.leaderboard.every((retailer: any) => 
          ['Top', 'Good', 'Average', 'Needs Improvement'].includes(retailer.performance_tier)
        )
        console.log(`   🎯 Valid performance tiers: ${allHaveValidTiers}`)
      } else {
        console.log(`❌ No data available for validation`)
      }
    } catch (error) {
      console.log(`❌ Request failed: ${error}`)
    }

    console.log('\n🎉 All API Layer Tests Completed!')
    console.log('======================================')
    
  } catch (error) {
    console.error('❌ API test suite failed:', error)
    process.exit(1)
  }
}

// Run the test suite if called directly
if (require.main === module) {
  testAPILayer()
    .then(() => {
      console.log('✅ API layer testing completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ API layer testing failed:', error)
      process.exit(1)
    })
} 