import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// Email campaign performance data endpoint
// Provides email-specific analytics without ROI calculations

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = createSupabaseAdmin()
    
    // Extract query parameters
    const role = searchParams.get('role') || 'brand'
    const retailerId = searchParams.get('retailerId')
    const campaignId = searchParams.get('campaignId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const sortBy = searchParams.get('sortBy') || 'sent_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Validate role-based access
    if (role === 'retailer' && !retailerId) {
      return NextResponse.json(
        { error: 'Retailer ID required for retailer role' },
        { status: 400 }
      )
    }

    // Get email campaign performance data
    const emailCampaigns = await getEmailCampaignData(supabase, {
      role,
      retailerId,
      campaignId,
      startDate,
      endDate,
      sortBy,
      sortOrder
    })

    // Get email performance summary
    const emailSummary = await getEmailPerformanceSummary(supabase, {
      role,
      retailerId,
      campaignId,
      startDate,
      endDate
    })

    // Get email performance trends
    const emailTrends = await getEmailPerformanceTrends(supabase, {
      role,
      retailerId,
      campaignId,
      startDate,
      endDate
    })

    return NextResponse.json({
      success: true,
      data: {
        campaigns: emailCampaigns,
        summary: emailSummary,
        trends: emailTrends,
        filters: {
          role,
          retailerId,
          campaignId,
          startDate,
          endDate,
          sortBy,
          sortOrder
        }
      }
    })

  } catch (error) {
    console.error('Email Campaigns API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email campaign data' },
      { status: 500 }
    )
  }
}

async function getEmailCampaignData(supabase: any, filters: any) {
  try {
    let query = supabase
      .from('email_campaigns_new')
      .select(`
        email_campaign_id,
        campaign_id,
        retailer_id,
        email_subject,
        sent_at,
        recipients_count,
        delivered_count,
        opened_count,
        clicked_count,
        delivery_rate,
        open_rate,
        click_rate,
        created_at,
        campaigns_new!inner(
          campaign_name,
          campaign_type,
          status
        ),
        users!inner(
          name,
          region
        )
      `)

    // Apply date filters
    if (filters.startDate) {
      query = query.gte('sent_at', filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte('sent_at', filters.endDate)
    }

    // Apply campaign filter
    if (filters.campaignId) {
      query = query.eq('campaign_id', filters.campaignId)
    }

    // For retailer role, only show their own campaigns
    if (filters.role === 'retailer' && filters.retailerId) {
      query = query.eq('retailer_id', filters.retailerId)
    }

    // Apply sorting
    const ascending = filters.sortOrder === 'asc'
    query = query.order(filters.sortBy, { ascending })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching email campaigns:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Process and enhance the data
    return data.map((campaign: any) => ({
      email_campaign_id: campaign.email_campaign_id,
      campaign_id: campaign.campaign_id,
      campaign_name: campaign.campaigns_new?.campaign_name,
      campaign_type: campaign.campaigns_new?.campaign_type,
      campaign_status: campaign.campaigns_new?.status,
      retailer_id: campaign.retailer_id,
      retailer_name: campaign.users?.name,
      retailer_region: campaign.users?.region,
      email_subject: campaign.email_subject,
      sent_at: campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : null,
      recipients_count: campaign.recipients_count,
      delivered_count: campaign.delivered_count,
      opened_count: campaign.opened_count,
      clicked_count: campaign.clicked_count,
      delivery_rate: campaign.delivery_rate,
      open_rate: campaign.open_rate,
      click_rate: campaign.click_rate,
      // Calculate additional metrics
      bounce_count: campaign.recipients_count - campaign.delivered_count,
      bounce_rate: campaign.recipients_count > 0 
        ? Math.round(((campaign.recipients_count - campaign.delivered_count) / campaign.recipients_count) * 100 * 100) / 100
        : 0,
      click_to_open_rate: campaign.opened_count > 0
        ? Math.round((campaign.clicked_count / campaign.opened_count) * 100 * 100) / 100
        : 0,
      // Performance indicators
      performance_tier: campaign.open_rate >= 25 ? 'High Performance' : 
                       campaign.open_rate >= 18 ? 'Good Performance' : 'Standard Performance',
      engagement_score: calculateEmailEngagementScore(campaign),
      created_at: campaign.created_at
    }))

  } catch (error) {
    console.error('Error in getEmailCampaignData:', error)
    return []
  }
}

async function getEmailPerformanceSummary(supabase: any, filters: any) {
  try {
    let query = supabase
      .from('email_campaigns_new')
      .select(`
        recipients_count,
        delivered_count,
        opened_count,
        clicked_count,
        delivery_rate,
        open_rate,
        click_rate,
        retailer_id
      `)

    // Apply same filters as main query
    if (filters.startDate) {
      query = query.gte('sent_at', filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte('sent_at', filters.endDate)
    }
    if (filters.campaignId) {
      query = query.eq('campaign_id', filters.campaignId)
    }
    if (filters.role === 'retailer' && filters.retailerId) {
      query = query.eq('retailer_id', filters.retailerId)
    }

    const { data, error } = await query

    if (error || !data) {
      return getDefaultEmailSummary()
    }

    // Calculate summary statistics
    const totalCampaigns = data.length
    const totalRecipients = data.reduce((sum: number, c: any) => sum + (c.recipients_count || 0), 0)
    const totalDelivered = data.reduce((sum: number, c: any) => sum + (c.delivered_count || 0), 0)
    const totalOpened = data.reduce((sum: number, c: any) => sum + (c.opened_count || 0), 0)
    const totalClicked = data.reduce((sum: number, c: any) => sum + (c.clicked_count || 0), 0)

    // Calculate average rates
    const avgDeliveryRate = data.length > 0 
      ? data.reduce((sum: number, c: any) => sum + (c.delivery_rate || 0), 0) / data.length
      : 0
    const avgOpenRate = data.length > 0 
      ? data.reduce((sum: number, c: any) => sum + (c.open_rate || 0), 0) / data.length
      : 0
    const avgClickRate = data.length > 0 
      ? data.reduce((sum: number, c: any) => sum + (c.click_rate || 0), 0) / data.length
      : 0

    // Performance distribution
    const highPerformers = data.filter((c: any) => c.open_rate >= 25).length
    const goodPerformers = data.filter((c: any) => c.open_rate >= 18 && c.open_rate < 25).length
    const standardPerformers = data.filter((c: any) => c.open_rate < 18).length

    // Unique retailers
    const uniqueRetailers = new Set(data.map((c: any) => c.retailer_id)).size

    return {
      totalCampaigns,
      totalRecipients,
      totalDelivered,
      totalOpened,
      totalClicked,
      uniqueRetailers,
      avgDeliveryRate: Math.round(avgDeliveryRate * 100) / 100,
      avgOpenRate: Math.round(avgOpenRate * 100) / 100,
      avgClickRate: Math.round(avgClickRate * 100) / 100,
      // Overall rates
      overallDeliveryRate: totalRecipients > 0 
        ? Math.round((totalDelivered / totalRecipients) * 100 * 100) / 100
        : 0,
      overallOpenRate: totalDelivered > 0 
        ? Math.round((totalOpened / totalDelivered) * 100 * 100) / 100
        : 0,
      overallClickRate: totalDelivered > 0 
        ? Math.round((totalClicked / totalDelivered) * 100 * 100) / 100
        : 0,
      clickToOpenRate: totalOpened > 0 
        ? Math.round((totalClicked / totalOpened) * 100 * 100) / 100
        : 0,
      performanceDistribution: {
        high: highPerformers,
        good: goodPerformers,
        standard: standardPerformers
      },
      // Trends (simplified for dummy data)
      trends: {
        delivery: '+2.1%',
        open: '+5.3%',
        click: '+8.7%'
      }
    }

  } catch (error) {
    console.error('Error calculating email summary:', error)
    return getDefaultEmailSummary()
  }
}

async function getEmailPerformanceTrends(supabase: any, filters: any) {
  try {
    let query = supabase
      .from('email_campaigns_new')
      .select(`
        sent_at,
        delivery_rate,
        open_rate,
        click_rate,
        recipients_count,
        delivered_count,
        opened_count,
        clicked_count
      `)

    // Apply date filters (default to last 30 days if not specified)
    const endDate = filters.endDate || new Date().toISOString().split('T')[0]
    const startDate = filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    query = query.gte('sent_at', startDate).lte('sent_at', endDate)

    if (filters.campaignId) {
      query = query.eq('campaign_id', filters.campaignId)
    }
    if (filters.role === 'retailer' && filters.retailerId) {
      query = query.eq('retailer_id', filters.retailerId)
    }

    const { data, error } = await query.order('sent_at')

    if (error || !data) {
      console.error('Error fetching email trends:', error)
      return []
    }

    // Group by date and calculate daily averages
    const trendsMap = new Map()

    data.forEach((record: any) => {
      const date = new Date(record.sent_at).toISOString().split('T')[0]
      
      if (!trendsMap.has(date)) {
        trendsMap.set(date, {
          date,
          campaigns: [],
          total_recipients: 0,
          total_delivered: 0,
          total_opened: 0,
          total_clicked: 0
        })
      }

      const trend = trendsMap.get(date)
      trend.campaigns.push(record)
      trend.total_recipients += record.recipients_count || 0
      trend.total_delivered += record.delivered_count || 0
      trend.total_opened += record.opened_count || 0
      trend.total_clicked += record.clicked_count || 0
    })

    // Calculate daily metrics
    return Array.from(trendsMap.values()).map(trend => ({
      date: trend.date,
      campaigns_count: trend.campaigns.length,
      avg_delivery_rate: trend.campaigns.length > 0
        ? Math.round((trend.campaigns.reduce((sum: number, c: any) => sum + (c.delivery_rate || 0), 0) / trend.campaigns.length) * 100) / 100
        : 0,
      avg_open_rate: trend.campaigns.length > 0
        ? Math.round((trend.campaigns.reduce((sum: number, c: any) => sum + (c.open_rate || 0), 0) / trend.campaigns.length) * 100) / 100
        : 0,
      avg_click_rate: trend.campaigns.length > 0
        ? Math.round((trend.campaigns.reduce((sum: number, c: any) => sum + (c.click_rate || 0), 0) / trend.campaigns.length) * 100) / 100
        : 0,
      total_recipients: trend.total_recipients,
      overall_delivery_rate: trend.total_recipients > 0
        ? Math.round((trend.total_delivered / trend.total_recipients) * 100 * 100) / 100
        : 0,
      overall_open_rate: trend.total_delivered > 0
        ? Math.round((trend.total_opened / trend.total_delivered) * 100 * 100) / 100
        : 0,
      overall_click_rate: trend.total_delivered > 0
        ? Math.round((trend.total_clicked / trend.total_delivered) * 100 * 100) / 100
        : 0
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  } catch (error) {
    console.error('Error in getEmailPerformanceTrends:', error)
    return []
  }
}

function calculateEmailEngagementScore(campaign: any) {
  // Simple engagement score calculation based on open and click rates
  const openScore = (campaign.open_rate || 0) * 0.6  // 60% weight for opens
  const clickScore = (campaign.click_rate || 0) * 0.4 // 40% weight for clicks
  return Math.round((openScore + clickScore) * 100) / 100
}

function getDefaultEmailSummary() {
  return {
    totalCampaigns: 0,
    totalRecipients: 0,
    totalDelivered: 0,
    totalOpened: 0,
    totalClicked: 0,
    uniqueRetailers: 0,
    avgDeliveryRate: 0,
    avgOpenRate: 0,
    avgClickRate: 0,
    overallDeliveryRate: 0,
    overallOpenRate: 0,
    overallClickRate: 0,
    clickToOpenRate: 0,
    performanceDistribution: {
      high: 0,
      good: 0,
      standard: 0
    },
    trends: {
      delivery: '0%',
      open: '0%',
      click: '0%'
    }
  }
}