import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals'
import { NextRequest } from 'next/server'
import { GET as campaignAnalyticsHandler } from '@/app/api/campaigns/[id]/analytics/route'
import { GET as campaignSummaryHandler } from '@/app/api/campaigns/[id]/summary/route'
import { GET as campaignsListHandler } from '@/app/api/campaigns/route'

// Test campaign ID from our dummy data
const TEST_CAMPAIGN_ID = '6b04371b-ef1b-49a4-a540-b1dbf59f9f54'
const INVALID_CAMPAIGN_ID = '00000000-0000-0000-0000-000000000000'

describe('Campaign Analytics API Endpoints', () => {
  
  describe('/api/campaigns/[id]/analytics', () => {
    
    it('should return campaign leaderboard with basic request', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics`)
      const response = await campaignAnalyticsHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('leaderboard')
      expect(data).toHaveProperty('total_count')
      expect(data).toHaveProperty('filters_applied')
      expect(Array.isArray(data.leaderboard)).toBe(true)
      expect(data.total_count).toBeGreaterThan(0)
      
      // Verify leaderboard data structure
      if (data.leaderboard.length > 0) {
        const firstRetailer = data.leaderboard[0]
        expect(firstRetailer).toHaveProperty('retailer_name')
        expect(firstRetailer).toHaveProperty('region')
        expect(firstRetailer).toHaveProperty('emails_sent')
        expect(firstRetailer).toHaveProperty('emails_delivered')
        expect(firstRetailer).toHaveProperty('emails_opened')
        expect(firstRetailer).toHaveProperty('emails_clicked')
        expect(firstRetailer).toHaveProperty('delivery_rate')
        expect(firstRetailer).toHaveProperty('open_rate')
        expect(firstRetailer).toHaveProperty('click_rate')
        expect(firstRetailer).toHaveProperty('overall_rank')
        expect(firstRetailer).toHaveProperty('performance_tier')
        
        // Verify data types
        expect(typeof firstRetailer.retailer_name).toBe('string')
        expect(['East', 'Central', 'West']).toContain(firstRetailer.region)
        expect(typeof firstRetailer.emails_sent).toBe('number')
        expect(typeof firstRetailer.emails_delivered).toBe('number')
        expect(typeof firstRetailer.emails_opened).toBe('number')
        expect(typeof firstRetailer.emails_clicked).toBe('number')
        expect(typeof firstRetailer.delivery_rate).toBe('number')
        expect(typeof firstRetailer.open_rate).toBe('number')
        expect(typeof firstRetailer.click_rate).toBe('number')
        expect(typeof firstRetailer.overall_rank).toBe('number')
        expect(['Top', 'Good', 'Average', 'Needs Improvement']).toContain(firstRetailer.performance_tier)
      }
    })

    it('should filter by region correctly', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics?region=East`)
      const response = await campaignAnalyticsHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.leaderboard.every((retailer: any) => retailer.region === 'East')).toBe(true)
      expect(data.filters_applied.region).toBe('East')
    })

    it('should filter by performance tier correctly', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics?performance_tier=Top`)
      const response = await campaignAnalyticsHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.leaderboard.every((retailer: any) => retailer.performance_tier === 'Top')).toBe(true)
      expect(data.filters_applied.performance_tier).toBe('Top')
    })

    it('should sort by click rate descending', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics?sort_by=click_rate&sort_order=desc`)
      const response = await campaignAnalyticsHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      const clickRates = data.leaderboard.map((retailer: any) => retailer.click_rate)
      
      // Verify descending order
      for (let i = 1; i < clickRates.length; i++) {
        expect(clickRates[i]).toBeLessThanOrEqual(clickRates[i - 1])
      }
    })

    it('should sort by emails sent ascending', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics?sort_by=emails_sent&sort_order=asc`)
      const response = await campaignAnalyticsHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      const emailCounts = data.leaderboard.map((retailer: any) => retailer.emails_sent)
      
      // Verify ascending order
      for (let i = 1; i < emailCounts.length; i++) {
        expect(emailCounts[i]).toBeGreaterThanOrEqual(emailCounts[i - 1])
      }
    })

    it('should handle pagination correctly', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics?limit=5&offset=0`)
      const response = await campaignAnalyticsHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.leaderboard.length).toBeLessThanOrEqual(5)
      expect(data.filters_applied.limit).toBe(5)
      expect(data.filters_applied.offset).toBe(0)
    })

    it('should combine multiple filters', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics?region=East&performance_tier=Top&limit=3`)
      const response = await campaignAnalyticsHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.leaderboard.length).toBeLessThanOrEqual(3)
      expect(data.leaderboard.every((retailer: any) => 
        retailer.region === 'East' && retailer.performance_tier === 'Top'
      )).toBe(true)
    })

    it('should handle non-existent campaign ID', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${INVALID_CAMPAIGN_ID}/analytics`)
      const response = await campaignAnalyticsHandler(request, { params: { id: INVALID_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.leaderboard).toEqual([])
      expect(data.total_count).toBe(0)
    })

    it('should handle invalid query parameters gracefully', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics?limit=invalid&offset=abc&region=InvalidRegion`)
      const response = await campaignAnalyticsHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      // Should still return 200 with default/filtered values
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('leaderboard')
      expect(data).toHaveProperty('total_count')
    })

    it('should validate data integrity in response', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics`)
      const response = await campaignAnalyticsHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      
      data.leaderboard.forEach((retailer: any) => {
        // Verify percentage ranges
        expect(retailer.delivery_rate).toBeGreaterThanOrEqual(0)
        expect(retailer.delivery_rate).toBeLessThanOrEqual(100)
        expect(retailer.open_rate).toBeGreaterThanOrEqual(0)
        expect(retailer.open_rate).toBeLessThanOrEqual(100)
        expect(retailer.click_rate).toBeGreaterThanOrEqual(0)
        expect(retailer.click_rate).toBeLessThanOrEqual(100)
        
        // Verify logical constraints
        expect(retailer.emails_clicked).toBeLessThanOrEqual(retailer.emails_opened)
        expect(retailer.emails_opened).toBeLessThanOrEqual(retailer.emails_delivered)
        expect(retailer.emails_delivered).toBeLessThanOrEqual(retailer.emails_sent)
        
        // Verify ranking
        expect(retailer.overall_rank).toBeGreaterThan(0)
      })
    })
  })

  describe('/api/campaigns/[id]/summary', () => {
    
    it('should return campaign summary with correct structure', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/summary`)
      const response = await campaignSummaryHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('summary')
      
      const summary = data.summary
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
      
      // Verify data types
      expect(typeof summary.total_retailers).toBe('number')
      expect(typeof summary.total_emails_sent).toBe('number')
      expect(typeof summary.total_emails_delivered).toBe('number')
      expect(typeof summary.total_emails_opened).toBe('number')
      expect(typeof summary.total_emails_clicked).toBe('number')
      expect(typeof summary.average_delivery_rate).toBe('number')
      expect(typeof summary.average_open_rate).toBe('number')
      expect(typeof summary.average_click_rate).toBe('number')
      expect(typeof summary.by_region).toBe('object')
      expect(typeof summary.by_performance_tier).toBe('object')
    })

    it('should have valid regional breakdown', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/summary`)
      const response = await campaignSummaryHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      const regions = data.summary.by_region
      
      // Should have data for at least one region
      expect(Object.keys(regions).length).toBeGreaterThan(0)
      
      // Verify each region has proper structure
      Object.values(regions).forEach((regionData: any) => {
        expect(regionData).toHaveProperty('count')
        expect(regionData).toHaveProperty('total_sent')
        expect(regionData).toHaveProperty('total_clicked')
        expect(typeof regionData.count).toBe('number')
        expect(typeof regionData.total_sent).toBe('number')
        expect(typeof regionData.total_clicked).toBe('number')
      })
    })

    it('should have valid performance tier breakdown', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/summary`)
      const response = await campaignSummaryHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      const performanceTiers = data.summary.by_performance_tier
      
      // Should have data for at least one tier
      expect(Object.keys(performanceTiers).length).toBeGreaterThan(0)
      
      // Verify performance tier names
      const validTiers = ['Top', 'Good', 'Average', 'Needs Improvement']
      Object.keys(performanceTiers).forEach(tier => {
        expect(validTiers).toContain(tier)
        expect(typeof performanceTiers[tier]).toBe('number')
        expect(performanceTiers[tier]).toBeGreaterThan(0)
      })
    })

    it('should validate summary calculations', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/summary`)
      const response = await campaignSummaryHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      const summary = data.summary
      
      // Verify logical constraints
      expect(summary.total_emails_clicked).toBeLessThanOrEqual(summary.total_emails_opened)
      expect(summary.total_emails_opened).toBeLessThanOrEqual(summary.total_emails_delivered)
      expect(summary.total_emails_delivered).toBeLessThanOrEqual(summary.total_emails_sent)
      
      // Verify percentage ranges
      expect(summary.average_delivery_rate).toBeGreaterThanOrEqual(0)
      expect(summary.average_delivery_rate).toBeLessThanOrEqual(100)
      expect(summary.average_open_rate).toBeGreaterThanOrEqual(0)
      expect(summary.average_open_rate).toBeLessThanOrEqual(100)
      expect(summary.average_click_rate).toBeGreaterThanOrEqual(0)
      expect(summary.average_click_rate).toBeLessThanOrEqual(100)
      
      // Verify retailer count matches regional breakdown
      const totalRetailersFromRegions = Object.values(summary.by_region)
        .reduce((sum: number, region: any) => sum + region.count, 0)
      expect(summary.total_retailers).toBe(totalRetailersFromRegions)
    })

    it('should handle non-existent campaign ID in summary', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${INVALID_CAMPAIGN_ID}/summary`)
      const response = await campaignSummaryHandler(request, { params: { id: INVALID_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      const summary = data.summary
      
      expect(summary.total_retailers).toBe(0)
      expect(summary.total_emails_sent).toBe(0)
      expect(Object.keys(summary.by_region)).toHaveLength(0)
      expect(Object.keys(summary.by_performance_tier)).toHaveLength(0)
    })
  })

  describe('/api/campaigns', () => {
    
    it('should return list of available campaigns', async () => {
      const request = new NextRequest('http://localhost:3000/api/campaigns')
      const response = await campaignsListHandler(request)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('campaigns')
      expect(Array.isArray(data.campaigns)).toBe(true)
      expect(data.campaigns.length).toBeGreaterThan(0)
      
      // Verify campaign structure
      const campaign = data.campaigns[0]
      expect(campaign).toHaveProperty('campaign_id')
      expect(campaign).toHaveProperty('campaign_name')
      expect(campaign).toHaveProperty('campaign_status')
      expect(campaign).toHaveProperty('start_date')
      expect(campaign).toHaveProperty('end_date')
      expect(campaign).toHaveProperty('created_at')
      
      // Verify Marco Bicego campaign exists
      const marcoBicegoExists = data.campaigns.some((c: any) => 
        c.campaign_name === 'Marco Bicego New 2025 Campaign'
      )
      expect(marcoBicegoExists).toBe(true)
    })

    it('should return campaigns sorted by creation date', async () => {
      const request = new NextRequest('http://localhost:3000/api/campaigns')
      const response = await campaignsListHandler(request)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      const campaigns = data.campaigns
      
      // Verify descending order by created_at
      for (let i = 1; i < campaigns.length; i++) {
        const prev = new Date(campaigns[i - 1].created_at)
        const curr = new Date(campaigns[i].created_at)
        expect(prev.getTime()).toBeGreaterThanOrEqual(curr.getTime())
      }
    })

    it('should have valid campaign statuses', async () => {
      const request = new NextRequest('http://localhost:3000/api/campaigns')
      const response = await campaignsListHandler(request)
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      const validStatuses = ['active', 'paused', 'completed', 'draft']
      
      data.campaigns.forEach((campaign: any) => {
        expect(validStatuses).toContain(campaign.campaign_status)
      })
    })
  })

  describe('API Performance Tests', () => {
    
    it('should respond to leaderboard API within 1 second', async () => {
      const startTime = Date.now()
      
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics`)
      const response = await campaignAnalyticsHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      expect(response.status).toBe(200)
      expect(responseTime).toBeLessThan(1000) // Less than 1 second
    })

    it('should respond to summary API within 500ms', async () => {
      const startTime = Date.now()
      
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/summary`)
      const response = await campaignSummaryHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      expect(response.status).toBe(200)
      expect(responseTime).toBeLessThan(500) // Less than 500ms
    })

    it('should respond to campaigns list API within 300ms', async () => {
      const startTime = Date.now()
      
      const request = new NextRequest('http://localhost:3000/api/campaigns')
      const response = await campaignsListHandler(request)
      
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      expect(response.status).toBe(200)
      expect(responseTime).toBeLessThan(300) // Less than 300ms
    })
  })

  describe('Edge Cases and Error Handling', () => {
    
    it('should handle malformed UUID gracefully', async () => {
      const malformedId = 'not-a-valid-uuid'
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${malformedId}/analytics`)
      const response = await campaignAnalyticsHandler(request, { params: { id: malformedId } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data.leaderboard).toEqual([])
      expect(data.total_count).toBe(0)
    })

    it('should handle extremely large pagination values', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics?limit=10000&offset=1000000`)
      const response = await campaignAnalyticsHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(Array.isArray(data.leaderboard)).toBe(true)
      // Should handle gracefully even with large values
    })

    it('should handle SQL injection attempts', async () => {
      const maliciousRegion = "East'; DROP TABLE users; --"
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics?region=${encodeURIComponent(maliciousRegion)}`)
      const response = await campaignAnalyticsHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      // Should either return 200 with empty results or handle gracefully
      expect([200, 400]).toContain(response.status)
      
      if (response.status === 200) {
        const data = await response.json()
        expect(Array.isArray(data.leaderboard)).toBe(true)
      }
    })
  })

  describe('Data Consistency Validation', () => {
    
    it('should maintain consistency between leaderboard and summary', async () => {
      const [leaderboardRequest, summaryRequest] = [
        new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics`),
        new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/summary`)
      ]
      
      const [leaderboardResponse, summaryResponse] = await Promise.all([
        campaignAnalyticsHandler(leaderboardRequest, { params: { id: TEST_CAMPAIGN_ID } }),
        campaignSummaryHandler(summaryRequest, { params: { id: TEST_CAMPAIGN_ID } })
      ])
      
      expect(leaderboardResponse.status).toBe(200)
      expect(summaryResponse.status).toBe(200)
      
      const leaderboardData = await leaderboardResponse.json()
      const summaryData = await summaryResponse.json()
      
      // Total retailers should match
      expect(leaderboardData.total_count).toBe(summaryData.summary.total_retailers)
      
      // Total emails should be consistent
      const totalEmailsFromLeaderboard = leaderboardData.leaderboard
        .reduce((sum: number, retailer: any) => sum + retailer.emails_sent, 0)
      expect(totalEmailsFromLeaderboard).toBe(summaryData.summary.total_emails_sent)
    })

    it('should verify ranking consistency', async () => {
      const request = new NextRequest(`http://localhost:3000/api/campaigns/${TEST_CAMPAIGN_ID}/analytics?sort_by=overall_rank&sort_order=asc`)
      const response = await campaignAnalyticsHandler(request, { params: { id: TEST_CAMPAIGN_ID } })
      
      expect(response.status).toBe(200)
      
      const data = await response.json()
      const leaderboard = data.leaderboard
      
      // Verify ranking sequence
      for (let i = 0; i < leaderboard.length; i++) {
        expect(leaderboard[i].overall_rank).toBe(i + 1)
      }
      
      // Verify click rates are in descending order for same ranks
      for (let i = 1; i < leaderboard.length; i++) {
        if (leaderboard[i].overall_rank === leaderboard[i-1].overall_rank + 1) {
          expect(leaderboard[i].click_rate).toBeLessThanOrEqual(leaderboard[i-1].click_rate)
        }
      }
    })
  })
}) 