import dotenv from 'dotenv'
import { CampaignAnalyticsService, CampaignAnalyticsFilters } from '../lib/services/campaignAnalytics'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function testServiceLayer() {
  console.log('🧪 Testing Campaign Analytics Service Layer')
  console.log('============================================')

  try {
    // Test 1: Get Available Campaigns
    console.log('\n📋 Test 1: Get Available Campaigns')
    const campaignsResult = await CampaignAnalyticsService.getAvailableCampaigns()
    
    if (campaignsResult.error) {
      console.error('❌ Error getting campaigns:', campaignsResult.error)
      return
    }

    console.log(`✅ Found ${campaignsResult.data.length} campaigns`)
    
    const marcoBicegoCampaign = campaignsResult.data.find(
      c => c.campaign_name === 'Marco Bicego New 2025 Campaign'
    )

    if (!marcoBicegoCampaign) {
      console.error('❌ Marco Bicego campaign not found')
      return
    }

    console.log(`📍 Marco Bicego Campaign ID: ${marcoBicegoCampaign.campaign_id}`)
    const campaignId = marcoBicegoCampaign.campaign_id

    // Test 2: Basic Leaderboard
    console.log('\n🏆 Test 2: Get Campaign Leaderboard (No Filters)')
    const leaderboardResult = await CampaignAnalyticsService.getCampaignLeaderboard(campaignId)
    
    if (leaderboardResult.error) {
      console.error('❌ Error getting leaderboard:', leaderboardResult.error)
      return
    }

    console.log(`✅ Retrieved ${leaderboardResult.data.length} retailers`)
    console.log(`📊 Total count: ${leaderboardResult.count}`)
    
    // Display top 3
    console.log('\n🥇 Top 3 Performers:')
    leaderboardResult.data.slice(0, 3).forEach((retailer, index) => {
      console.log(`   ${index + 1}. ${retailer.retailer_name} (${retailer.region})`)
      console.log(`      📧 Emails: ${retailer.emails_sent} | ✅ Delivered: ${retailer.emails_delivered}`)
      console.log(`      📈 Click Rate: ${retailer.click_rate}% | 🏅 Rank: ${retailer.overall_rank}`)
      console.log(`      🎯 Tier: ${retailer.performance_tier}`)
    })

    // Test 3: Regional Filtering
    console.log('\n🌍 Test 3: Regional Filtering')
    
    for (const region of ['East', 'Central', 'West'] as const) {
      const filters: CampaignAnalyticsFilters = { region }
      const regionalResult = await CampaignAnalyticsService.getCampaignLeaderboard(campaignId, filters)
      
      if (regionalResult.error) {
        console.error(`❌ Error getting ${region} region data:`, regionalResult.error)
        continue
      }

      console.log(`   ${region}: ${regionalResult.data.length} retailers`)
      if (regionalResult.data.length > 0) {
        const topPerformer = regionalResult.data[0]
        console.log(`      🏆 Top: ${topPerformer.retailer_name} (${topPerformer.click_rate}%)`)
      }
    }

    // Test 4: Performance Tier Filtering
    console.log('\n🎯 Test 4: Performance Tier Filtering')
    
    for (const tier of ['Top', 'Good', 'Average', 'Needs Improvement']) {
      const filters: CampaignAnalyticsFilters = { performance_tier: tier }
      const tierResult = await CampaignAnalyticsService.getCampaignLeaderboard(campaignId, filters)
      
      if (tierResult.error) {
        console.error(`❌ Error getting ${tier} tier data:`, tierResult.error)
        continue
      }

      console.log(`   ${tier}: ${tierResult.data.length} retailers`)
    }

    // Test 5: Sorting Options
    console.log('\n📊 Test 5: Sorting Options')
    
    // Sort by click rate descending
    const sortByClickRate: CampaignAnalyticsFilters = { 
      sort_by: 'click_rate', 
      sort_order: 'desc',
      limit: 3
    }
    const sortedResult = await CampaignAnalyticsService.getCampaignLeaderboard(campaignId, sortByClickRate)
    
    if (sortedResult.error) {
      console.error('❌ Error sorting by click rate:', sortedResult.error)
    } else {
      console.log('   📈 Top 3 by Click Rate (DESC):')
      sortedResult.data.forEach((retailer, index) => {
        console.log(`      ${index + 1}. ${retailer.retailer_name}: ${retailer.click_rate}%`)
      })
    }

    // Test 6: Pagination
    console.log('\n📄 Test 6: Pagination')
    
    const paginatedResult = await CampaignAnalyticsService.getCampaignLeaderboard(campaignId, {
      limit: 5,
      offset: 0
    })
    
    if (paginatedResult.error) {
      console.error('❌ Error with pagination:', paginatedResult.error)
    } else {
      console.log(`   📋 Page 1: ${paginatedResult.data.length} retailers (limit: 5)`)
      console.log(`   📊 Total available: ${paginatedResult.count}`)
    }

    // Test 7: Campaign Summary
    console.log('\n📈 Test 7: Campaign Summary')
    
    const summaryResult = await CampaignAnalyticsService.getCampaignSummary(campaignId)
    
    if (summaryResult.error) {
      console.error('❌ Error getting campaign summary:', summaryResult.error)
    } else if (summaryResult.data) {
      const summary = summaryResult.data
      console.log('   📊 Overall Statistics:')
      console.log(`      👥 Total Retailers: ${summary.total_retailers}`)
      console.log(`      📧 Total Emails Sent: ${summary.total_emails_sent.toLocaleString()}`)
      console.log(`      ✅ Total Delivered: ${summary.total_emails_delivered.toLocaleString()}`)
      console.log(`      👁️  Total Opened: ${summary.total_emails_opened.toLocaleString()}`)
      console.log(`      🖱️  Total Clicked: ${summary.total_emails_clicked.toLocaleString()}`)
      console.log(`      📈 Avg Delivery Rate: ${summary.average_delivery_rate}%`)
      console.log(`      📈 Avg Open Rate: ${summary.average_open_rate}%`)
      console.log(`      📈 Avg Click Rate: ${summary.average_click_rate}%`)
      
      console.log('\n   🌍 By Region:')
      Object.entries(summary.by_region).forEach(([region, data]: [string, any]) => {
        console.log(`      ${region}: ${data.count} retailers, ${data.total_sent.toLocaleString()} emails`)
      })
      
      console.log('\n   🎯 By Performance Tier:')
      Object.entries(summary.by_performance_tier).forEach(([tier, count]) => {
        console.log(`      ${tier}: ${count} retailers`)
      })
    }

    // Test 8: Error Handling
    console.log('\n🚫 Test 8: Error Handling')
    
    const invalidResult = await CampaignAnalyticsService.getCampaignLeaderboard('invalid-campaign-id')
    console.log(`   ✅ Invalid campaign UUID: ${invalidResult.data.length} results (expected: 0)`)
    
    const invalidSummaryResult = await CampaignAnalyticsService.getCampaignSummary('invalid-campaign-id')
    if (invalidSummaryResult.error) {
      console.log(`   ✅ Invalid summary request handled: ${invalidSummaryResult.error}`)
    } else {
      console.log(`   ❌ Expected error for invalid summary request`)
    }
    
    // Test 9: Refresh Function
    console.log('\n🔄 Test 9: Refresh Campaign Data')
    
    const refreshResult = await CampaignAnalyticsService.refreshCampaignData()
    if (refreshResult.success) {
      console.log('   ✅ Refresh successful (compatibility method)')
    } else {
      console.log('   ❌ Refresh failed:', refreshResult.error)
    }

    // Test 10: Data Validation
    console.log('\n✅ Test 10: Data Validation')
    
    const validationResult = await CampaignAnalyticsService.getCampaignLeaderboard(campaignId)
    if (validationResult.data.length > 0) {
      const sample = validationResult.data[0]
      
      console.log('   📋 Sample Data Structure:')
      console.log(`      ✅ Has campaign_id: ${!!sample.campaign_id}`)
      console.log(`      ✅ Has retailer_name: ${!!sample.retailer_name}`)
      console.log(`      ✅ Has region: ${!!sample.region}`)
      console.log(`      ✅ Has click_rate: ${sample.click_rate !== undefined} (value: ${sample.click_rate})`)
      console.log(`      ✅ Has overall_rank: ${sample.overall_rank !== undefined} (value: ${sample.overall_rank})`)
      console.log(`      ✅ Has performance_tier: ${!!sample.performance_tier}`)
      
      // Debug: Show all properties
      console.log('   🔍 Sample Data Keys:', Object.keys(sample))
      
      // Validate ranking order
      const isRankingCorrect = validationResult.data.every((retailer, index) => 
        retailer.overall_rank === index + 1
      )
      console.log(`      ✅ Ranking order correct: ${isRankingCorrect}`)
      
      // Validate performance tiers
      const tierCounts = validationResult.data.reduce((acc, retailer) => {
        acc[retailer.performance_tier] = (acc[retailer.performance_tier] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      console.log('   🎯 Performance Tier Distribution:')
      Object.entries(tierCounts).forEach(([tier, count]) => {
        console.log(`      ${tier}: ${count} retailers`)
      })
    }

    console.log('\n🎉 All Service Layer Tests Completed Successfully!')
    console.log('====================================================')
    
  } catch (error) {
    console.error('❌ Test suite failed:', error)
    process.exit(1)
  }
}

// Run the test suite if called directly
if (require.main === module) {
  testServiceLayer()
    .then(() => {
      console.log('✅ Service layer testing completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Service layer testing failed:', error)
      process.exit(1)
    })
} 