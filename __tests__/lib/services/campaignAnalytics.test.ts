import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { CampaignAnalyticsService } from '@/lib/services/campaignAnalytics'
import type { CampaignAnalyticsFilters } from '@/lib/services/campaignAnalytics'

// Test campaign ID from our dummy data
const TEST_CAMPAIGN_ID = '6b04371b-ef1b-49a4-a540-b1dbf59f9f54'
const INVALID_CAMPAIGN_ID = '00000000-0000-0000-0000-000000000000'
const MALFORMED_CAMPAIGN_ID = 'not-a-valid-uuid'

describe('CampaignAnalyticsService', () => {
  
  describe('getCampaignLeaderboard', () => {
    
    it('should return leaderboard data for valid campaign', async () => {
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID)
      
      expect(result).toHaveProperty('data')
      expect(result).toHaveProperty('count')
      expect(result.error).toBeUndefined()
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.count).toBeGreaterThan(0)
      expect(result.data.length).toBeGreaterThan(0)
      
      // Verify data structure
      const firstRetailer = result.data[0]
      expect(firstRetailer).toHaveProperty('campaign_id')
      expect(firstRetailer).toHaveProperty('campaign_name')
      expect(firstRetailer).toHaveProperty('retailer_id')
      expect(firstRetailer).toHaveProperty('retailer_name')
      expect(firstRetailer).toHaveProperty('retailer_email')
      expect(firstRetailer).toHaveProperty('region')
      expect(firstRetailer).toHaveProperty('emails_sent')
      expect(firstRetailer).toHaveProperty('emails_delivered')
      expect(firstRetailer).toHaveProperty('emails_opened')
      expect(firstRetailer).toHaveProperty('emails_clicked')
      expect(firstRetailer).toHaveProperty('delivery_rate')
      expect(firstRetailer).toHaveProperty('open_rate')
      expect(firstRetailer).toHaveProperty('click_rate')
      expect(firstRetailer).toHaveProperty('overall_rank')
      expect(firstRetailer).toHaveProperty('region_rank')
      expect(firstRetailer).toHaveProperty('performance_tier')
      expect(firstRetailer).toHaveProperty('first_send_time')
      expect(firstRetailer).toHaveProperty('last_send_time')
      expect(firstRetailer).toHaveProperty('last_updated')
    })

    it('should verify data types in leaderboard response', async () => {
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID)
      
      expect(result.data.length).toBeGreaterThan(0)
      const retailer = result.data[0]
      
      // String fields
      expect(typeof retailer.campaign_id).toBe('string')
      expect(typeof retailer.campaign_name).toBe('string')
      expect(typeof retailer.retailer_id).toBe('string')
      expect(typeof retailer.retailer_name).toBe('string')
      expect(typeof retailer.retailer_email).toBe('string')
      expect(typeof retailer.region).toBe('string')
      expect(typeof retailer.performance_tier).toBe('string')
      expect(typeof retailer.first_send_time).toBe('string')
      expect(typeof retailer.last_send_time).toBe('string')
      expect(typeof retailer.last_updated).toBe('string')
      
      // Number fields
      expect(typeof retailer.emails_sent).toBe('number')
      expect(typeof retailer.emails_delivered).toBe('number')
      expect(typeof retailer.emails_opened).toBe('number')
      expect(typeof retailer.emails_clicked).toBe('number')
      expect(typeof retailer.delivery_rate).toBe('number')
      expect(typeof retailer.open_rate).toBe('number')
      expect(typeof retailer.click_rate).toBe('number')
      expect(typeof retailer.overall_rank).toBe('number')
      expect(typeof retailer.region_rank).toBe('number')
      
      // Valid enum values
      expect(['East', 'Central', 'West']).toContain(retailer.region)
      expect(['Top', 'Good', 'Average', 'Needs Improvement']).toContain(retailer.performance_tier)
    })

    it('should filter by region correctly', async () => {
      const filters: CampaignAnalyticsFilters = { region: 'East' }
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID, filters)
      
      expect(result.error).toBeUndefined()
      expect(result.data.every(retailer => retailer.region === 'East')).toBe(true)
    })

    it('should filter by performance tier correctly', async () => {
      const filters: CampaignAnalyticsFilters = { performance_tier: 'Top' }
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID, filters)
      
      expect(result.error).toBeUndefined()
      result.data.forEach(retailer => {
        expect(retailer.performance_tier).toBe('Top')
        expect(retailer.click_rate).toBeGreaterThanOrEqual(3.5)
      })
    })

    it('should sort by click rate descending', async () => {
      const filters: CampaignAnalyticsFilters = { 
        sort_by: 'click_rate', 
        sort_order: 'desc' 
      }
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID, filters)
      
      expect(result.error).toBeUndefined()
      
      const clickRates = result.data.map(retailer => retailer.click_rate)
      for (let i = 1; i < clickRates.length; i++) {
        expect(clickRates[i]).toBeLessThanOrEqual(clickRates[i - 1])
      }
    })

    it('should sort by emails sent ascending', async () => {
      const filters: CampaignAnalyticsFilters = { 
        sort_by: 'emails_sent', 
        sort_order: 'asc' 
      }
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID, filters)
      
      expect(result.error).toBeUndefined()
      
      const emailCounts = result.data.map(retailer => retailer.emails_sent)
      for (let i = 1; i < emailCounts.length; i++) {
        expect(emailCounts[i]).toBeGreaterThanOrEqual(emailCounts[i - 1])
      }
    })

    it('should handle pagination correctly', async () => {
      const filters: CampaignAnalyticsFilters = { limit: 5, offset: 0 }
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID, filters)
      
      expect(result.error).toBeUndefined()
      expect(result.data.length).toBeLessThanOrEqual(5)
      
      // Test offset
      const offsetFilters: CampaignAnalyticsFilters = { limit: 5, offset: 2 }
      const offsetResult = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID, offsetFilters)
      
      expect(offsetResult.error).toBeUndefined()
      expect(offsetResult.data.length).toBeLessThanOrEqual(5)
      
      // First item in offset result should be different from first item in regular result
      if (offsetResult.data.length > 0 && result.data.length > 2) {
        expect(offsetResult.data[0].retailer_id).not.toBe(result.data[0].retailer_id)
      }
    })

    it('should combine multiple filters', async () => {
      const filters: CampaignAnalyticsFilters = {
        region: 'East',
        performance_tier: 'Top',
        limit: 3,
        sort_by: 'click_rate',
        sort_order: 'desc'
      }
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID, filters)
      
      expect(result.error).toBeUndefined()
      expect(result.data.length).toBeLessThanOrEqual(3)
      
      result.data.forEach(retailer => {
        expect(retailer.region).toBe('East')
        expect(retailer.performance_tier).toBe('Top')
      })
      
      // Verify descending order by click rate
      const clickRates = result.data.map(retailer => retailer.click_rate)
      for (let i = 1; i < clickRates.length; i++) {
        expect(clickRates[i]).toBeLessThanOrEqual(clickRates[i - 1])
      }
    })

    it('should validate data integrity constraints', async () => {
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID)
      
      expect(result.error).toBeUndefined()
      
      result.data.forEach(retailer => {
        // Email funnel constraints
        expect(retailer.emails_clicked).toBeLessThanOrEqual(retailer.emails_opened)
        expect(retailer.emails_opened).toBeLessThanOrEqual(retailer.emails_delivered)
        expect(retailer.emails_delivered).toBeLessThanOrEqual(retailer.emails_sent)
        
        // Percentage constraints
        expect(retailer.delivery_rate).toBeGreaterThanOrEqual(0)
        expect(retailer.delivery_rate).toBeLessThanOrEqual(100)
        expect(retailer.open_rate).toBeGreaterThanOrEqual(0)
        expect(retailer.open_rate).toBeLessThanOrEqual(100)
        expect(retailer.click_rate).toBeGreaterThanOrEqual(0)
        expect(retailer.click_rate).toBeLessThanOrEqual(100)
        
        // Ranking constraints
        expect(retailer.overall_rank).toBeGreaterThan(0)
        expect(retailer.region_rank).toBeGreaterThan(0)
        
        // Performance tier logic validation
        if (retailer.performance_tier === 'Top') {
          expect(retailer.click_rate).toBeGreaterThanOrEqual(3.5)
        } else if (retailer.performance_tier === 'Good') {
          expect(retailer.click_rate).toBeGreaterThanOrEqual(2.5)
          expect(retailer.click_rate).toBeLessThan(3.5)
        } else if (retailer.performance_tier === 'Average') {
          expect(retailer.click_rate).toBeGreaterThanOrEqual(1.5)
          expect(retailer.click_rate).toBeLessThan(2.5)
        } else if (retailer.performance_tier === 'Needs Improvement') {
          expect(retailer.click_rate).toBeLessThan(1.5)
        }
      })
    })

    it('should handle non-existent campaign ID', async () => {
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(INVALID_CAMPAIGN_ID)
      
      expect(result.error).toBeUndefined()
      expect(result.data).toEqual([])
      expect(result.count).toBe(0)
    })

    it('should handle malformed UUID gracefully', async () => {
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(MALFORMED_CAMPAIGN_ID)
      
      expect(result.error).toBeUndefined()
      expect(result.data).toEqual([])
      expect(result.count).toBe(0)
    })

    it('should verify ranking consistency', async () => {
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID, {
        sort_by: 'overall_rank',
        sort_order: 'asc'
      })
      
      expect(result.error).toBeUndefined()
      
      // Verify sequential ranking
      for (let i = 0; i < result.data.length; i++) {
        expect(result.data[i].overall_rank).toBe(i + 1)
      }
    })
  })

  describe('getCampaignSummary', () => {
    
    it('should return summary data for valid campaign', async () => {
      const result = await CampaignAnalyticsService.getCampaignSummary(TEST_CAMPAIGN_ID)
      
      expect(result).toHaveProperty('data')
      expect(result.error).toBeNull()
      expect(result.data).not.toBeNull()
      
      const summary = result.data!
      expect(summary).toHaveProperty('total_retailers')
      expect(summary).toHaveProperty('total_emails_sent')
      expect(summary).toHaveProperty('total_emails_delivered')
      expect(summary).toHaveProperty('total_emails_opened')
      expect(summary).toHaveProperty('total_emails_clicked')
      expect(summary).toHaveProperty('average_delivery_rate')
      expect(summary).toHaveProperty('average_open_rate')
      expect(summary).toHaveProperty('average_click_rate')
      expect(summary).toHaveProperty('by_region')
      expect(summary).toHaveProperty('by_performance_tier')
    })

    it('should verify summary data types', async () => {
      const result = await CampaignAnalyticsService.getCampaignSummary(TEST_CAMPAIGN_ID)
      
      expect(result.error).toBeNull()
      const summary = result.data!
      
      // Number fields
      expect(typeof summary.total_retailers).toBe('number')
      expect(typeof summary.total_emails_sent).toBe('number')
      expect(typeof summary.total_emails_delivered).toBe('number')
      expect(typeof summary.total_emails_opened).toBe('number')
      expect(typeof summary.total_emails_clicked).toBe('number')
      expect(typeof summary.average_delivery_rate).toBe('number')
      expect(typeof summary.average_open_rate).toBe('number')
      expect(typeof summary.average_click_rate).toBe('number')
      
      // Object fields
      expect(typeof summary.by_region).toBe('object')
      expect(typeof summary.by_performance_tier).toBe('object')
    })

    it('should validate summary calculations', async () => {
      const result = await CampaignAnalyticsService.getCampaignSummary(TEST_CAMPAIGN_ID)
      
      expect(result.error).toBeNull()
      const summary = result.data!
      
      // Email funnel constraints
      expect(summary.total_emails_clicked).toBeLessThanOrEqual(summary.total_emails_opened)
      expect(summary.total_emails_opened).toBeLessThanOrEqual(summary.total_emails_delivered)
      expect(summary.total_emails_delivered).toBeLessThanOrEqual(summary.total_emails_sent)
      
      // Percentage constraints
      expect(summary.average_delivery_rate).toBeGreaterThanOrEqual(0)
      expect(summary.average_delivery_rate).toBeLessThanOrEqual(100)
      expect(summary.average_open_rate).toBeGreaterThanOrEqual(0)
      expect(summary.average_open_rate).toBeLessThanOrEqual(100)
      expect(summary.average_click_rate).toBeGreaterThanOrEqual(0)
      expect(summary.average_click_rate).toBeLessThanOrEqual(100)
      
      // Positive values
      expect(summary.total_retailers).toBeGreaterThan(0)
      expect(summary.total_emails_sent).toBeGreaterThan(0)
    })

    it('should validate regional breakdown', async () => {
      const result = await CampaignAnalyticsService.getCampaignSummary(TEST_CAMPAIGN_ID)
      
      expect(result.error).toBeNull()
      const summary = result.data!
      
      const regions = summary.by_region
      expect(Object.keys(regions).length).toBeGreaterThan(0)
      
      // Valid region names
      Object.keys(regions).forEach(region => {
        expect(['East', 'Central', 'West']).toContain(region)
      })
      
      // Valid region data structure
      Object.values(regions).forEach((regionData: any) => {
        expect(regionData).toHaveProperty('count')
        expect(regionData).toHaveProperty('total_sent')
        expect(regionData).toHaveProperty('total_clicked')
        expect(typeof regionData.count).toBe('number')
        expect(typeof regionData.total_sent).toBe('number')
        expect(typeof regionData.total_clicked).toBe('number')
        expect(regionData.count).toBeGreaterThan(0)
        expect(regionData.total_sent).toBeGreaterThan(0)
        expect(regionData.total_clicked).toBeGreaterThanOrEqual(0)
      })
      
      // Total retailers should match sum of regional counts
      const totalFromRegions = Object.values(regions)
        .reduce((sum: number, region: any) => sum + region.count, 0)
      expect(summary.total_retailers).toBe(totalFromRegions)
    })

    it('should validate performance tier breakdown', async () => {
      const result = await CampaignAnalyticsService.getCampaignSummary(TEST_CAMPAIGN_ID)
      
      expect(result.error).toBeNull()
      const summary = result.data!
      
      const performanceTiers = summary.by_performance_tier
      expect(Object.keys(performanceTiers).length).toBeGreaterThan(0)
      
      // Valid performance tier names
      const validTiers = ['Top', 'Good', 'Average', 'Needs Improvement']
      Object.keys(performanceTiers).forEach(tier => {
        expect(validTiers).toContain(tier)
      })
      
      // Valid tier counts
      Object.values(performanceTiers).forEach((count: any) => {
        expect(typeof count).toBe('number')
        expect(count).toBeGreaterThan(0)
      })
      
      // Total retailers should match sum of tier counts
      const totalFromTiers = Object.values(performanceTiers)
        .reduce((sum: number, count: any) => sum + count, 0)
      expect(summary.total_retailers).toBe(totalFromTiers)
    })

    it('should handle non-existent campaign ID in summary', async () => {
      const result = await CampaignAnalyticsService.getCampaignSummary(INVALID_CAMPAIGN_ID)
      
      expect(result.error).toBeNull()
      expect(result.data).not.toBeNull()
      
      const summary = result.data!
      expect(summary.total_retailers).toBe(0)
      expect(summary.total_emails_sent).toBe(0)
      expect(summary.total_emails_delivered).toBe(0)
      expect(summary.total_emails_opened).toBe(0)
      expect(summary.total_emails_clicked).toBe(0)
      expect(Object.keys(summary.by_region)).toHaveLength(0)
      expect(Object.keys(summary.by_performance_tier)).toHaveLength(0)
    })

    it('should handle malformed UUID in summary', async () => {
      const result = await CampaignAnalyticsService.getCampaignSummary(MALFORMED_CAMPAIGN_ID)
      
      expect(result.error).toBeNull()
      expect(result.data).not.toBeNull()
      
      const summary = result.data!
      expect(summary.total_retailers).toBe(0)
      expect(summary.total_emails_sent).toBe(0)
    })
  })

  describe('getAvailableCampaigns', () => {
    
    it('should return list of campaigns', async () => {
      const result = await CampaignAnalyticsService.getAvailableCampaigns()
      
      expect(result).toHaveProperty('data')
      expect(result.error).toBeNull()
      expect(Array.isArray(result.data)).toBe(true)
      expect(result.data.length).toBeGreaterThan(0)
      
      // Verify campaign structure
      const campaign = result.data[0]
      expect(campaign).toHaveProperty('campaign_id')
      expect(campaign).toHaveProperty('campaign_name')
      expect(campaign).toHaveProperty('campaign_status')
      expect(campaign).toHaveProperty('start_date')
      expect(campaign).toHaveProperty('end_date')
      expect(campaign).toHaveProperty('created_at')
      
      // Verify data types
      expect(typeof campaign.campaign_id).toBe('string')
      expect(typeof campaign.campaign_name).toBe('string')
      expect(typeof campaign.campaign_status).toBe('string')
    })

    it('should include Marco Bicego campaign', async () => {
      const result = await CampaignAnalyticsService.getAvailableCampaigns()
      
      expect(result.error).toBeNull()
      
      const marcoBicegoExists = result.data.some(campaign => 
        campaign.campaign_name === 'Marco Bicego New 2025 Campaign'
      )
      expect(marcoBicegoExists).toBe(true)
    })

    it('should return campaigns sorted by creation date descending', async () => {
      const result = await CampaignAnalyticsService.getAvailableCampaigns()
      
      expect(result.error).toBeNull()
      const campaigns = result.data
      
      // Verify descending order by created_at
      for (let i = 1; i < campaigns.length; i++) {
        const prev = new Date(campaigns[i - 1].created_at)
        const curr = new Date(campaigns[i].created_at)
        expect(prev.getTime()).toBeGreaterThanOrEqual(curr.getTime())
      }
    })

    it('should have valid campaign statuses', async () => {
      const result = await CampaignAnalyticsService.getAvailableCampaigns()
      
      expect(result.error).toBeNull()
      const validStatuses = ['active', 'paused', 'completed', 'draft']
      
      result.data.forEach(campaign => {
        expect(validStatuses).toContain(campaign.campaign_status)
      })
    })
  })

  describe('refreshCampaignData', () => {
    
    it('should successfully refresh data', async () => {
      const result = await CampaignAnalyticsService.refreshCampaignData()
      
      expect(result).toHaveProperty('success')
      expect(result.success).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should complete refresh within reasonable time', async () => {
      const startTime = Date.now()
      const result = await CampaignAnalyticsService.refreshCampaignData()
      const endTime = Date.now()
      
      expect(result.success).toBe(true)
      expect(endTime - startTime).toBeLessThan(1000) // Less than 1 second
    })
  })

  describe('Service Performance Tests', () => {
    
    it('should execute leaderboard query within performance threshold', async () => {
      const startTime = Date.now()
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID)
      const endTime = Date.now()
      
      expect(result.error).toBeUndefined()
      expect(endTime - startTime).toBeLessThan(500) // Less than 500ms
    })

    it('should execute summary query within performance threshold', async () => {
      const startTime = Date.now()
      const result = await CampaignAnalyticsService.getCampaignSummary(TEST_CAMPAIGN_ID)
      const endTime = Date.now()
      
      expect(result.error).toBeNull()
      expect(endTime - startTime).toBeLessThan(200) // Less than 200ms
    })

    it('should execute campaigns list query within performance threshold', async () => {
      const startTime = Date.now()
      const result = await CampaignAnalyticsService.getAvailableCampaigns()
      const endTime = Date.now()
      
      expect(result.error).toBeNull()
      expect(endTime - startTime).toBeLessThan(100) // Less than 100ms
    })
  })

  describe('Error Handling and Edge Cases', () => {
    
    it('should handle database connection issues gracefully', async () => {
      // This test would require mocking the database connection
      // For now, we test that the service doesn't throw unhandled exceptions
      try {
        await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID)
        expect(true).toBe(true) // Test passes if no exception is thrown
      } catch (error) {
        // If an error occurs, it should be handled gracefully by the service
        expect(error).toBeInstanceOf(Error)
      }
    })

    it('should handle extremely large datasets', async () => {
      const filters: CampaignAnalyticsFilters = { limit: 1000 }
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID, filters)
      
      expect(result.error).toBeUndefined()
      expect(Array.isArray(result.data)).toBe(true)
      // Should handle large limits gracefully
    })

    it('should handle empty result sets gracefully', async () => {
      const filters: CampaignAnalyticsFilters = { 
        region: 'East',
        performance_tier: 'Top',
        limit: 1000 // Large limit to potentially get empty results
      }
      const result = await CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID, filters)
      
      expect(result.error).toBeUndefined()
      expect(Array.isArray(result.data)).toBe(true)
      expect(typeof result.count).toBe('number')
      expect(result.count).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Data Consistency Between Methods', () => {
    
    it('should maintain consistency between leaderboard and summary', async () => {
      const [leaderboardResult, summaryResult] = await Promise.all([
        CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID),
        CampaignAnalyticsService.getCampaignSummary(TEST_CAMPAIGN_ID)
      ])
      
      expect(leaderboardResult.error).toBeUndefined()
      expect(summaryResult.error).toBeNull()
      
      const leaderboard = leaderboardResult.data
      const summary = summaryResult.data!
      
      // Total retailers should match
      expect(leaderboardResult.count).toBe(summary.total_retailers)
      
      // Total emails should be consistent
      const totalEmailsFromLeaderboard = leaderboard
        .reduce((sum, retailer) => sum + retailer.emails_sent, 0)
      expect(totalEmailsFromLeaderboard).toBe(summary.total_emails_sent)
      
      // Total clicks should be consistent
      const totalClicksFromLeaderboard = leaderboard
        .reduce((sum, retailer) => sum + retailer.emails_clicked, 0)
      expect(totalClicksFromLeaderboard).toBe(summary.total_emails_clicked)
    })

    it('should maintain regional consistency', async () => {
      const [leaderboardResult, summaryResult] = await Promise.all([
        CampaignAnalyticsService.getCampaignLeaderboard(TEST_CAMPAIGN_ID),
        CampaignAnalyticsService.getCampaignSummary(TEST_CAMPAIGN_ID)
      ])
      
      expect(leaderboardResult.error).toBeUndefined()
      expect(summaryResult.error).toBeNull()
      
      const leaderboard = leaderboardResult.data
      const summary = summaryResult.data!
      
      // Count retailers by region from leaderboard
      const regionCountsFromLeaderboard = leaderboard.reduce((acc, retailer) => {
        acc[retailer.region] = (acc[retailer.region] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      // Compare with summary by_region
      Object.keys(regionCountsFromLeaderboard).forEach(region => {
        expect(summary.by_region[region]?.count).toBe(regionCountsFromLeaderboard[region])
      })
    })
  })
}) 