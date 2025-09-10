import { supabase } from '@/lib/supabase'

export interface CampaignSummary {
  campaign_id: string
  campaign_name: string
  status: string
  start_date: string
  end_date: string
  budget_allocated: number
  budget_spent: number
  total_retailers: number
  total_emails_sent: number
  emails_delivered: number
  emails_opened: number
  emails_clicked: number
  open_rate: number
  click_rate: number
  total_revenue: number
  roi_percentage: number
  performance_tier: string
  created_at: string
  updated_at: string
}

export interface RetailerPerformance {
  retailer_id: string
  retailer_name: string
  region: string
  emails_sent: number
  emails_delivered: number
  emails_opened: number
  emails_clicked: number
  delivery_rate: number
  open_rate: number
  click_rate: number
  total_conversions: number
  total_revenue: number
  roi: number
  performance_tier: string
}

export class SimplifiedCampaignAnalyticsService {
  
  /**
   * Get all campaigns with performance summary
   */
  static async getAllCampaigns(): Promise<{ data: CampaignSummary[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('campaign_performance_summary')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching campaigns:', error)
        return { data: [], error: error.message }
      }
      
      return { data: data || [] }
    } catch (error) {
      console.error('Error in getAllCampaigns:', error)
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get campaign by ID with performance summary
   */
  static async getCampaignById(campaignId: string): Promise<{ data: CampaignSummary | null; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('campaign_performance_summary')
        .select('*')
        .eq('campaign_id', campaignId)
        .single()
      
      if (error) {
        console.error('Error fetching campaign:', error)
        return { data: null, error: error.message }
      }
      
      return { data }
    } catch (error) {
      console.error('Error in getCampaignById:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get retailer performance for a specific campaign
   */
  static async getRetailerPerformance(
    campaignId: string, 
    filters: {
      region?: string
      limit?: number
      offset?: number
      sort_by?: string
      sort_order?: 'asc' | 'desc'
    } = {}
  ): Promise<{ data: RetailerPerformance[]; count: number; error?: string }> {
    try {
      let query = supabase
        .from('email_sends')
        .select(`
          retailer_id,
          users!inner(name, region),
          email_campaigns!inner(campaign_id),
          status,
          opened_at,
          clicked_at
        `)
        .eq('email_campaigns.campaign_id', campaignId)

      // Apply region filter
      if (filters.region) {
        query = query.eq('users.region', filters.region)
      }

      const { data: emailData, error } = await query

      if (error) {
        console.error('Error fetching retailer performance:', error)
        return { data: [], count: 0, error: error.message }
      }

      // Process the data to calculate performance metrics
      const retailerStats = new Map<string, {
        retailer_id: string
        retailer_name: string
        region: string
        emails_sent: number
        emails_delivered: number
        emails_opened: number
        emails_clicked: number
      }>()

      emailData?.forEach(send => {
        const retailerId = send.retailer_id
        const user = Array.isArray(send.users) ? send.users[0] : send.users
        
        if (!retailerStats.has(retailerId)) {
          retailerStats.set(retailerId, {
            retailer_id: retailerId,
            retailer_name: user?.name || 'Unknown',
            region: user?.region || 'Unknown',
            emails_sent: 0,
            emails_delivered: 0,
            emails_opened: 0,
            emails_clicked: 0
          })
        }

        const stats = retailerStats.get(retailerId)!
        stats.emails_sent++
        
        if (send.status === 'delivered') {
          stats.emails_delivered++
        }
        if (send.opened_at) {
          stats.emails_opened++
        }
        if (send.clicked_at) {
          stats.emails_clicked++
        }
      })

      // Get conversion data for ROI calculation
      const { data: conversionData } = await supabase
        .from('crm_conversions')
        .select('retailer_id, conversion_value')
        .eq('campaign_id', campaignId)

      const { data: orderData } = await supabase
        .from('ecommerce_orders')
        .select('retailer_id, order_value')
        .eq('campaign_id', campaignId)

      // Calculate revenue by retailer
      const retailerRevenue = new Map<string, number>()
      
      conversionData?.forEach(conv => {
        const current = retailerRevenue.get(conv.retailer_id) || 0
        retailerRevenue.set(conv.retailer_id, current + (conv.conversion_value || 0))
      })

      orderData?.forEach(order => {
        const current = retailerRevenue.get(order.retailer_id) || 0
        retailerRevenue.set(order.retailer_id, current + (order.order_value || 0))
      })

      // Convert to final format with calculated metrics
      const performanceData: RetailerPerformance[] = Array.from(retailerStats.values()).map(stats => {
        const deliveryRate = stats.emails_sent > 0 ? (stats.emails_delivered / stats.emails_sent) * 100 : 0
        const openRate = stats.emails_delivered > 0 ? (stats.emails_opened / stats.emails_delivered) * 100 : 0
        const clickRate = stats.emails_delivered > 0 ? (stats.emails_clicked / stats.emails_delivered) * 100 : 0
        const totalRevenue = retailerRevenue.get(stats.retailer_id) || 0
        const estimatedCost = stats.emails_sent * 0.1 // Assume $0.10 per email
        const roi = estimatedCost > 0 ? ((totalRevenue - estimatedCost) / estimatedCost) * 100 : 0

        return {
          retailer_id: stats.retailer_id,
          retailer_name: stats.retailer_name,
          region: stats.region,
          emails_sent: stats.emails_sent,
          emails_delivered: stats.emails_delivered,
          emails_opened: stats.emails_opened,
          emails_clicked: stats.emails_clicked,
          delivery_rate: Math.round(deliveryRate * 100) / 100,
          open_rate: Math.round(openRate * 100) / 100,
          click_rate: Math.round(clickRate * 100) / 100,
          total_conversions: stats.emails_clicked, // Simplified
          total_revenue: Math.round(totalRevenue),
          roi: Math.round(roi * 10) / 10,
          performance_tier: clickRate >= 3.5 ? 'Top' : clickRate >= 2.5 ? 'Good' : clickRate >= 1.5 ? 'Average' : 'Needs Improvement'
        }
      })

      // Apply sorting
      const sortBy = filters.sort_by || 'click_rate'
      const sortOrder = filters.sort_order || 'desc'
      
      performanceData.sort((a, b) => {
        const aValue = a[sortBy as keyof RetailerPerformance] as number
        const bValue = b[sortBy as keyof RetailerPerformance] as number
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      })

      // Apply pagination
      const offset = filters.offset || 0
      const limit = filters.limit || performanceData.length
      const paginatedData = performanceData.slice(offset, offset + limit)

      return { 
        data: paginatedData, 
        count: performanceData.length 
      }
    } catch (error) {
      console.error('Error in getRetailerPerformance:', error)
      return { 
        data: [], 
        count: 0, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  /**
   * Get campaign summary statistics
   */
  static async getCampaignSummary(campaignId: string): Promise<{ data: any; error?: string }> {
    try {
      const { data: campaign, error: campaignError } = await supabase
        .from('campaign_performance_summary')
        .select('*')
        .eq('campaign_id', campaignId)
        .single()

      if (campaignError) {
        return { data: null, error: campaignError.message }
      }

      // Get regional breakdown
      const { data: regionalData, error: regionalError } = await supabase
        .from('email_sends')
        .select(`
          users!inner(region),
          status,
          clicked_at
        `)
        .eq('email_campaigns.campaign_id', campaignId)

      const regionStats = {
        East: { count: 0, total_sent: 0, total_clicked: 0 },
        Central: { count: 0, total_sent: 0, total_clicked: 0 },
        West: { count: 0, total_sent: 0, total_clicked: 0 }
      }

      regionalData?.forEach(send => {
        const user = Array.isArray(send.users) ? send.users[0] : send.users
        const region = user?.region as keyof typeof regionStats
        if (region && regionStats[region]) {
          regionStats[region].total_sent++
          if (send.clicked_at) {
            regionStats[region].total_clicked++
          }
        }
      })

      // Count unique retailers per region
      const { data: retailerCounts } = await supabase
        .from('users')
        .select('region')
        .eq('user_type', 'retailer')

      retailerCounts?.forEach(retailer => {
        const region = retailer.region as keyof typeof regionStats
        if (region && regionStats[region]) {
          regionStats[region].count++
        }
      })

      const summary = {
        total_retailers: campaign.total_retailers,
        total_emails_sent: campaign.total_emails_sent,
        total_emails_delivered: campaign.emails_delivered,
        total_emails_opened: campaign.emails_opened,
        total_emails_clicked: campaign.emails_clicked,
        average_delivery_rate: campaign.emails_delivered > 0 ? (campaign.emails_delivered / campaign.total_emails_sent) * 100 : 0,
        average_open_rate: campaign.open_rate,
        average_click_rate: campaign.click_rate,
        total_revenue: campaign.total_revenue,
        roi_percentage: campaign.roi_percentage,
        by_region: regionStats,
        by_performance_tier: {
          'High ROI': campaign.performance_tier === 'High ROI' ? 1 : 0,
          'Good ROI': campaign.performance_tier === 'Good ROI' ? 1 : 0,
          'Standard': campaign.performance_tier === 'Standard' ? 1 : 0
        }
      }

      return { data: summary }
    } catch (error) {
      console.error('Error in getCampaignSummary:', error)
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
}