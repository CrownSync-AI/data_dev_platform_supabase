import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

// Campaign-specific performance data endpoint
// Provides detailed campaign analytics with role-based filtering

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const supabase = createSupabaseAdmin()
    
    // Extract query parameters
    const role = searchParams.get('role') || 'brand'
    const retailerId = searchParams.get('retailerId')
    const platform = searchParams.get('platform') || 'all'
    const status = searchParams.get('status') || 'all'

    // Validate role-based access
    if (role === 'retailer' && !retailerId) {
      return NextResponse.json(
        { error: 'Retailer ID required for retailer role' },
        { status: 400 }
      )
    }

    // Get campaigns list with performance data
    const campaigns = await getCampaignsWithPerformance(supabase, {
      role,
      retailerId,
      platform,
      status
    })

    return NextResponse.json({
      success: true,
      data: {
        campaigns,
        total: campaigns.length,
        filters: {
          role,
          retailerId,
          platform,
          status
        }
      }
    })

  } catch (error) {
    console.error('Campaigns API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns data' },
      { status: 500 }
    )
  }
}

async function getCampaignsWithPerformance(supabase: any, filters: any) {
  try {
    // Base query for campaign performance summary
    let query = supabase
      .from('campaign_performance_summary_new')
      .select(`
        campaign_id,
        campaign_name,
        campaign_type,
        status,
        start_date,
        end_date,
        total_accounts,
        total_posts,
        total_impressions,
        total_reach,
        total_engagement,
        total_link_clicks,
        avg_engagement_rate,
        avg_follower_growth_rate,
        total_email_campaigns,
        total_email_recipients,
        avg_email_open_rate,
        avg_email_click_rate,
        performance_tier,
        last_updated
      `)

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    // For retailer role, only show campaigns they participate in
    if (filters.role === 'retailer' && filters.retailerId) {
      const { data: retailerCampaigns } = await supabase
        .from('retailer_campaign_performance_new')
        .select('campaign_id')
        .eq('retailer_id', filters.retailerId)

      if (retailerCampaigns && retailerCampaigns.length > 0) {
        const campaignIds = [...new Set(retailerCampaigns.map((rc: any) => rc.campaign_id))]
        query = query.in('campaign_id', campaignIds)
      } else {
        return [] // No campaigns for this retailer
      }
    }

    const { data: campaignsData, error } = await query.order('total_reach', { ascending: false })

    if (error) {
      console.error('Error fetching campaigns:', error)
      return []
    }

    if (!campaignsData || campaignsData.length === 0) {
      return []
    }

    // Enhance campaigns with platform-specific data if needed
    const enhancedCampaigns = await Promise.all(
      campaignsData.map(async (campaign: any) => {
        // Get platform breakdown for this campaign
        const platformBreakdown = await getCampaignPlatformBreakdown(
          supabase, 
          campaign.campaign_id, 
          filters
        )

        // Get top performing retailers for this campaign
        const topRetailers = await getCampaignTopRetailers(
          supabase, 
          campaign.campaign_id, 
          filters
        )

        // Calculate additional metrics
        const clickThroughRate = campaign.total_impressions > 0 
          ? Math.round((campaign.total_link_clicks / campaign.total_impressions) * 100 * 100) / 100
          : 0

        const reachRate = campaign.total_impressions > 0
          ? Math.round((campaign.total_reach / campaign.total_impressions) * 100 * 100) / 100
          : 0

        return {
          ...campaign,
          platformBreakdown,
          topRetailers,
          clickThroughRate,
          reachRate,
          // Format dates
          start_date: new Date(campaign.start_date).toLocaleDateString(),
          end_date: campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : null,
          // Add performance indicators
          performanceIndicators: {
            engagement: campaign.avg_engagement_rate >= 6 ? 'high' : campaign.avg_engagement_rate >= 3 ? 'good' : 'standard',
            reach: campaign.total_reach >= 100000 ? 'high' : campaign.total_reach >= 50000 ? 'good' : 'standard',
            growth: campaign.avg_follower_growth_rate >= 2 ? 'high' : campaign.avg_follower_growth_rate >= 1 ? 'good' : 'standard'
          }
        }
      })
    )

    return enhancedCampaigns

  } catch (error) {
    console.error('Error in getCampaignsWithPerformance:', error)
    return []
  }
}

async function getCampaignPlatformBreakdown(supabase: any, campaignId: string, filters: any) {
  try {
    let query = supabase
      .from('campaign_analytics_new')
      .select(`
        platform,
        impressions,
        reach,
        total_engagement,
        link_clicks,
        engagement_rate
      `)
      .eq('campaign_id', campaignId)

    // For retailer role, filter by their accounts
    if (filters.role === 'retailer' && filters.retailerId) {
      const { data: retailerAccounts } = await supabase
        .from('social_accounts_new')
        .select('account_id')
        .eq('retailer_id', filters.retailerId)

      if (retailerAccounts && retailerAccounts.length > 0) {
        const accountIds = retailerAccounts.map((ra: any) => ra.account_id)
        query = query.in('account_id', accountIds)
      }
    }

    const { data, error } = await query

    if (error || !data) {
      return []
    }

    // Aggregate by platform
    const platformMap = new Map()

    data.forEach((record: any) => {
      const platform = record.platform
      
      if (!platformMap.has(platform)) {
        platformMap.set(platform, {
          platform,
          impressions: 0,
          reach: 0,
          total_engagement: 0,
          link_clicks: 0,
          posts_count: 0
        })
      }

      const platformData = platformMap.get(platform)
      platformData.impressions += record.impressions || 0
      platformData.reach += record.reach || 0
      platformData.total_engagement += record.total_engagement || 0
      platformData.link_clicks += record.link_clicks || 0
      platformData.posts_count += 1
    })

    return Array.from(platformMap.values()).map(platform => ({
      ...platform,
      avg_engagement_rate: platform.impressions > 0 
        ? Math.round((platform.total_engagement / platform.impressions) * 100 * 100) / 100
        : 0
    })).sort((a, b) => b.avg_engagement_rate - a.avg_engagement_rate)

  } catch (error) {
    console.error('Error getting platform breakdown:', error)
    return []
  }
}

async function getCampaignTopRetailers(supabase: any, campaignId: string, filters: any) {
  try {
    let query = supabase
      .from('retailer_campaign_performance_new')
      .select(`
        retailer_id,
        retailer_name,
        region,
        platform,
        total_impressions,
        total_reach,
        total_engagement,
        avg_engagement_rate,
        engagement_rank
      `)
      .eq('campaign_id', campaignId)

    // For retailer role, only show their own data
    if (filters.role === 'retailer' && filters.retailerId) {
      query = query.eq('retailer_id', filters.retailerId)
    }

    const { data, error } = await query
      .order('avg_engagement_rate', { ascending: false })
      .limit(5) // Top 5 retailers

    if (error || !data) {
      return []
    }

    // Aggregate by retailer across platforms
    const retailerMap = new Map()

    data.forEach((record: any) => {
      const key = record.retailer_id
      
      if (!retailerMap.has(key)) {
        retailerMap.set(key, {
          retailer_id: record.retailer_id,
          retailer_name: record.retailer_name,
          region: record.region,
          total_impressions: 0,
          total_reach: 0,
          total_engagement: 0,
          platforms: [],
          best_engagement_rank: record.engagement_rank
        })
      }

      const retailer = retailerMap.get(key)
      retailer.total_impressions += record.total_impressions || 0
      retailer.total_reach += record.total_reach || 0
      retailer.total_engagement += record.total_engagement || 0
      retailer.platforms.push(record.platform)
      retailer.best_engagement_rank = Math.min(retailer.best_engagement_rank, record.engagement_rank || 999)
    })

    return Array.from(retailerMap.values()).map(retailer => ({
      ...retailer,
      avg_engagement_rate: retailer.total_impressions > 0 
        ? Math.round((retailer.total_engagement / retailer.total_impressions) * 100 * 100) / 100
        : 0,
      platforms: [...new Set(retailer.platforms)]
    })).sort((a, b) => b.avg_engagement_rate - a.avg_engagement_rate)

  } catch (error) {
    console.error('Error getting top retailers:', error)
    return []
  }
}