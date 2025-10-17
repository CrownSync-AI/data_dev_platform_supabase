import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// Main Campaign Performance New API endpoint
// Provides aggregated campaign performance data with role-based filtering

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const supabase = createSupabaseAdmin()
    
    // Extract query parameters
    const platform = searchParams.get('platform') || 'all'
    const role = searchParams.get('role') || 'brand' // 'brand' or 'retailer'
    const retailerId = searchParams.get('retailerId') // Required for retailer role
    const campaignId = searchParams.get('campaignId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Validate role-based access
    if (role === 'retailer' && !retailerId) {
      return NextResponse.json(
        { error: 'Retailer ID required for retailer role' },
        { status: 400 }
      )
    }

    // Get campaign performance summary
    const campaignSummary = await getCampaignSummary(supabase, {
      platform,
      role,
      retailerId,
      campaignId,
      startDate,
      endDate
    })

    // Get retailer performance data
    const retailerPerformance = await getRetailerPerformance(supabase, {
      platform,
      role,
      retailerId,
      campaignId,
      startDate,
      endDate
    })

    // Get platform performance breakdown
    const platformBreakdown = await getPlatformBreakdown(supabase, {
      platform,
      role,
      retailerId,
      campaignId,
      startDate,
      endDate
    })

    // Get breakdown analytics
    const breakdownAnalytics = await getBreakdownAnalytics(supabase, {
      platform,
      role,
      retailerId,
      campaignId,
      startDate,
      endDate
    })

    // Get overview metrics
    const overviewMetrics = await getOverviewMetrics(supabase, {
      platform,
      role,
      retailerId,
      campaignId,
      startDate,
      endDate
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: overviewMetrics,
        campaigns: campaignSummary,
        retailers: retailerPerformance,
        platforms: platformBreakdown,
        breakdowns: breakdownAnalytics,
        filters: {
          platform,
          role,
          retailerId,
          campaignId,
          startDate,
          endDate
        }
      }
    })

  } catch (error) {
    console.error('Campaign Performance New API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign performance data' },
      { status: 500 }
    )
  }
}

// Get campaign performance summary
async function getCampaignSummary(supabase: any, filters: any) {
  try {
    // Get retailer performance data which already has campaign information
    const retailerData = await getRetailerPerformance(supabase, filters)
    
    if (!retailerData || retailerData.length === 0) {
      return []
    }

    // Extract unique campaigns from retailer data and aggregate their performance
    const campaignMap = new Map()

    retailerData.forEach((retailer: any) => {
      const campaignId = retailer.campaign_id
      
      if (!campaignMap.has(campaignId)) {
        campaignMap.set(campaignId, {
          campaign_id: campaignId,
          campaign_name: retailer.campaign_name,
          campaign_type: 'social_media', // Default type
          status: 'active', // Default status
          start_date: '2024-11-01', // Default start date
          end_date: null,
          total_accounts: 0,
          total_posts: 0,
          total_impressions: 0,
          total_reach: 0,
          total_engagement: 0,
          total_link_clicks: 0,
          engagement_rates: [],
          retailers_count: 0,
          participating_retailers: []
        })
      }

      const campaign = campaignMap.get(campaignId)
      campaign.total_posts += retailer.posts_count || 0
      campaign.total_impressions += retailer.total_impressions || 0
      campaign.total_reach += retailer.total_reach || 0
      campaign.total_engagement += retailer.total_engagement || 0
      campaign.total_link_clicks += retailer.total_link_clicks || 0
      campaign.retailers_count += 1
      campaign.participating_retailers.push(retailer.retailer_name)
      
      if (retailer.avg_engagement_rate > 0) {
        campaign.engagement_rates.push(retailer.avg_engagement_rate)
      }
    })

    // Calculate final metrics for each campaign
    const campaigns = Array.from(campaignMap.values()).map(campaign => {
      const avgEngagementRate = campaign.engagement_rates.length > 0
        ? campaign.engagement_rates.reduce((sum: number, rate: number) => sum + rate, 0) / campaign.engagement_rates.length
        : 0

      return {
        ...campaign,
        total_accounts: campaign.retailers_count,
        avg_engagement_rate: Math.round(avgEngagementRate * 100) / 100,
        performance_tier: avgEngagementRate >= 6 ? 'High Performance' : 
                         avgEngagementRate >= 3 ? 'Good Performance' : 'Standard Performance',
        // Add additional calculated metrics
        avg_posts_per_retailer: campaign.retailers_count > 0 
          ? Math.round(campaign.total_posts / campaign.retailers_count) 
          : 0,
        avg_reach_per_retailer: campaign.retailers_count > 0 
          ? Math.round(campaign.total_reach / campaign.retailers_count) 
          : 0,
        // Format dates
        start_date: new Date(campaign.start_date).toLocaleDateString(),
        end_date: campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Ongoing'
      }
    })

    return campaigns.sort((a, b) => (b.total_reach || 0) - (a.total_reach || 0))

  } catch (error) {
    console.error('Error in getCampaignSummary:', error)
    return []
  }
}

// Get retailer performance data
async function getRetailerPerformance(supabase: any, filters: any) {
  let query = supabase
    .from('retailer_campaign_performance_new')
    .select(`
      retailer_id,
      retailer_name,
      region,
      campaign_id,
      campaign_name,
      platform,
      posts_count,
      total_impressions,
      total_reach,
      total_engagement,
      total_link_clicks,
      avg_engagement_rate,
      current_followers,
      new_followers,
      email_open_rate,
      email_click_rate,
      engagement_rank,
      reach_rank,
      last_updated
    `)

  // Apply platform filter
  if (filters.platform && filters.platform !== 'all') {
    query = query.eq('platform', filters.platform)
  }

  // Apply campaign filter
  if (filters.campaignId) {
    query = query.eq('campaign_id', filters.campaignId)
  }

  // For retailer role, only show their own data
  if (filters.role === 'retailer' && filters.retailerId) {
    query = query.eq('retailer_id', filters.retailerId)
  }

  const { data, error } = await query.order('avg_engagement_rate', { ascending: false })

  if (error) {
    console.error('Error fetching retailer performance:', error)
    return []
  }

  // Aggregate by retailer if showing all platforms
  if (filters.platform === 'all') {
    return aggregateRetailerData(data || [])
  }

  return data || []
}

// Get platform performance breakdown
async function getPlatformBreakdown(supabase: any, filters: any) {
  let query = supabase
    .from('platform_performance_summary_new')
    .select('*')

  const { data, error } = await query.order('avg_engagement_rate', { ascending: false })

  if (error) {
    console.error('Error fetching platform breakdown:', error)
    return []
  }

  return data || []
}

// Get overview metrics
async function getOverviewMetrics(supabase: any, filters: any) {
  try {
    // Base query for analytics data
    let analyticsQuery = supabase
      .from('campaign_analytics_new')
      .select(`
        impressions,
        reach,
        total_engagement,
        link_clicks,
        platform,
        campaign_id,
        account_id
      `)

    // Apply date filters
    if (filters.startDate) {
      analyticsQuery = analyticsQuery.gte('analytics_date', filters.startDate)
    }
    if (filters.endDate) {
      analyticsQuery = analyticsQuery.lte('analytics_date', filters.endDate)
    }

    // Apply platform filter
    if (filters.platform && filters.platform !== 'all') {
      analyticsQuery = analyticsQuery.eq('platform', filters.platform)
    }

    // For retailer role, filter by their accounts
    if (filters.role === 'retailer' && filters.retailerId) {
      const { data: retailerAccounts } = await supabase
        .from('social_accounts_new')
        .select('account_id')
        .eq('retailer_id', filters.retailerId)

      if (retailerAccounts && retailerAccounts.length > 0) {
        const accountIds = retailerAccounts.map((ra: any) => ra.account_id)
        analyticsQuery = analyticsQuery.in('account_id', accountIds)
      }
    }

    const { data: analyticsData, error: analyticsError } = await analyticsQuery

    if (analyticsError) {
      console.error('Error fetching analytics data:', analyticsError)
      return getDefaultOverviewMetrics()
    }

    // Calculate overview metrics
    const totalReach = analyticsData?.reduce((sum: number, record: any) => sum + (record.reach || 0), 0) || 0
    const totalEngagement = analyticsData?.reduce((sum: number, record: any) => sum + (record.total_engagement || 0), 0) || 0
    const totalImpressions = analyticsData?.reduce((sum: number, record: any) => sum + (record.impressions || 0), 0) || 0
    const totalLinkClicks = analyticsData?.reduce((sum: number, record: any) => sum + (record.link_clicks || 0), 0) || 0

    // Calculate engagement rate
    const avgEngagementRate = totalImpressions > 0 
      ? Math.round((totalEngagement / totalImpressions) * 100 * 100) / 100 
      : 0

    // Get follower growth data
    const followerGrowthQuery = supabase
      .from('account_performance_new')
      .select('new_followers')

    if (filters.role === 'retailer' && filters.retailerId) {
      const { data: retailerAccounts } = await supabase
        .from('social_accounts_new')
        .select('account_id')
        .eq('retailer_id', filters.retailerId)

      if (retailerAccounts && retailerAccounts.length > 0) {
        const accountIds = retailerAccounts.map((ra: any) => ra.account_id)
        followerGrowthQuery.in('account_id', accountIds)
      }
    }

    const { data: followerData } = await followerGrowthQuery

    const newFollowers = followerData?.reduce((sum: number, record: any) => sum + (record.new_followers || 0), 0) || 0

    return {
      totalReach,
      totalEngagement,
      avgEngagementRate,
      totalLinkClicks,
      newFollowers,
      totalImpressions,
      // Calculate trends (simplified for dummy data)
      reachTrend: '+12.5%',
      engagementTrend: '+8.3%',
      clicksTrend: '+15.7%',
      followersTrend: '+6.2%'
    }

  } catch (error) {
    console.error('Error calculating overview metrics:', error)
    return getDefaultOverviewMetrics()
  }
}

// Aggregate retailer data across platforms
function aggregateRetailerData(data: any[]) {
  const retailerMap = new Map()

  data.forEach(record => {
    const key = record.retailer_id
    
    if (!retailerMap.has(key)) {
      retailerMap.set(key, {
        retailer_id: record.retailer_id,
        retailer_name: record.retailer_name,
        region: record.region,
        campaign_id: record.campaign_id,
        campaign_name: record.campaign_name,
        platform: 'all',
        posts_count: 0,
        total_impressions: 0,
        total_reach: 0,
        total_engagement: 0,
        total_link_clicks: 0,
        avg_engagement_rate: 0,
        current_followers: 0,
        new_followers: 0,
        email_open_rate: record.email_open_rate,
        email_click_rate: record.email_click_rate,
        platforms: [],
        last_updated: record.last_updated
      })
    }

    const retailer = retailerMap.get(key)
    retailer.posts_count += record.posts_count || 0
    retailer.total_impressions += record.total_impressions || 0
    retailer.total_reach += record.total_reach || 0
    retailer.total_engagement += record.total_engagement || 0
    retailer.total_link_clicks += record.total_link_clicks || 0
    retailer.current_followers += record.current_followers || 0
    retailer.new_followers += record.new_followers || 0
    retailer.platforms.push(record.platform)
  })

  // Calculate average engagement rates
  return Array.from(retailerMap.values()).map(retailer => ({
    ...retailer,
    avg_engagement_rate: retailer.total_impressions > 0 
      ? Math.round((retailer.total_engagement / retailer.total_impressions) * 100 * 100) / 100
      : 0,
    platforms: [...new Set(retailer.platforms)].join(', ')
  })).sort((a, b) => b.avg_engagement_rate - a.avg_engagement_rate)
}

// Get breakdown analytics (post type, campaign type, platform)
async function getBreakdownAnalytics(supabase: any, filters: any) {
  try {
    // Get post type breakdown
    const postTypeQuery = supabase
      .from('campaign_post_type_breakdown_simple')
      .select('*')

    // Get campaign type breakdown (organic vs paid)
    const campaignTypeQuery = supabase
      .from('campaign_type_breakdown_simple')
      .select('*')

    // Get platform breakdown
    const platformBreakdownQuery = supabase
      .from('campaign_platform_breakdown_simple')
      .select('*')

    // Apply filters if specified
    if (filters.campaignId) {
      postTypeQuery.eq('campaign_id', filters.campaignId)
      campaignTypeQuery.eq('campaign_id', filters.campaignId)
      platformBreakdownQuery.eq('campaign_id', filters.campaignId)
    }

    // Execute queries
    const [
      { data: postTypeData, error: postTypeError },
      { data: campaignTypeData, error: campaignTypeError },
      { data: platformData, error: platformError }
    ] = await Promise.all([
      postTypeQuery,
      campaignTypeQuery,
      platformBreakdownQuery
    ])

    if (postTypeError || campaignTypeError || platformError) {
      console.error('Breakdown query errors:', { postTypeError, campaignTypeError, platformError })
    }

    // For retailer role, filter data
    let filteredPostTypeData = postTypeData || []
    let filteredCampaignTypeData = campaignTypeData || []
    let filteredPlatformData = platformData || []

    if (filters.role === 'retailer' && filters.retailerId) {
      // Get retailer's campaigns
      const { data: retailerCampaigns } = await supabase
        .from('retailer_campaign_performance_new')
        .select('campaign_id')
        .eq('retailer_id', filters.retailerId)

      if (retailerCampaigns && retailerCampaigns.length > 0) {
        const campaignIds = [...new Set(retailerCampaigns.map(rc => rc.campaign_id))]
        
        filteredPostTypeData = filteredPostTypeData.filter(item => 
          campaignIds.includes(item.campaign_id)
        )
        filteredCampaignTypeData = filteredCampaignTypeData.filter(item => 
          campaignIds.includes(item.campaign_id)
        )
        filteredPlatformData = filteredPlatformData.filter(item => 
          campaignIds.includes(item.campaign_id)
        )
      } else {
        filteredPostTypeData = []
        filteredCampaignTypeData = []
        filteredPlatformData = []
      }
    }

    // Apply platform filter
    if (filters.platform && filters.platform !== 'all') {
      filteredPlatformData = filteredPlatformData.filter(item => 
        item.platform === filters.platform
      )
    }

    return {
      postType: filteredPostTypeData,
      campaignType: filteredCampaignTypeData,
      platform: filteredPlatformData,
      summary: {
        totalPostTypes: [...new Set(filteredPostTypeData.map(item => item.post_type))].length,
        totalCampaignTypes: [...new Set(filteredCampaignTypeData.map(item => item.campaign_type))].length,
        totalPlatforms: [...new Set(filteredPlatformData.map(item => item.platform))].length,
        organicVsPaidRatio: calculateOrganicVsPaidRatio(filteredCampaignTypeData),
        topPerformingPostType: getTopPerformingPostType(filteredPostTypeData),
        topPerformingPlatform: getTopPerformingPlatform(filteredPlatformData)
      }
    }

  } catch (error) {
    console.error('Error in getBreakdownAnalytics:', error)
    return {
      postType: [],
      campaignType: [],
      platform: [],
      summary: {
        totalPostTypes: 0,
        totalCampaignTypes: 0,
        totalPlatforms: 0,
        organicVsPaidRatio: { organic: 0, paid: 0 },
        topPerformingPostType: null,
        topPerformingPlatform: null
      }
    }
  }
}

// Helper function to calculate organic vs paid ratio
function calculateOrganicVsPaidRatio(campaignTypeData: any[]) {
  const organic = campaignTypeData.filter(item => item.campaign_type === 'organic')
  const paid = campaignTypeData.filter(item => item.campaign_type === 'paid')
  
  const organicPosts = organic.reduce((sum, item) => sum + (item.total_posts || 0), 0)
  const paidPosts = paid.reduce((sum, item) => sum + (item.total_posts || 0), 0)
  
  const total = organicPosts + paidPosts
  
  return {
    organic: total > 0 ? Math.round((organicPosts / total) * 100) : 0,
    paid: total > 0 ? Math.round((paidPosts / total) * 100) : 0,
    organicEngagement: organic.length > 0 ? 
      organic.reduce((sum, item) => sum + (item.avg_engagement_rate || 0), 0) / organic.length : 0,
    paidEngagement: paid.length > 0 ? 
      paid.reduce((sum, item) => sum + (item.avg_engagement_rate || 0), 0) / paid.length : 0
  }
}

// Helper function to get top performing post type
function getTopPerformingPostType(postTypeData: any[]) {
  if (!postTypeData || postTypeData.length === 0) return null
  
  return postTypeData.reduce((top, current) => 
    (current.avg_engagement_rate || 0) > (top.avg_engagement_rate || 0) ? current : top
  )
}

// Helper function to get top performing platform
function getTopPerformingPlatform(platformData: any[]) {
  if (!platformData || platformData.length === 0) return null
  
  return platformData.reduce((top, current) => 
    (current.avg_engagement_rate || 0) > (top.avg_engagement_rate || 0) ? current : top
  )
}

// Default overview metrics for error cases
function getDefaultOverviewMetrics() {
  return {
    totalReach: 0,
    totalEngagement: 0,
    avgEngagementRate: 0,
    totalLinkClicks: 0,
    newFollowers: 0,
    totalImpressions: 0,
    reachTrend: '0%',
    engagementTrend: '0%',
    clicksTrend: '0%',
    followersTrend: '0%'
  }
}