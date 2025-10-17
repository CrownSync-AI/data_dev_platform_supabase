import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// Retailer performance data endpoint
// Provides detailed retailer analytics with role-based filtering and rankings

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const supabase = createSupabaseAdmin()
    
    // Extract query parameters
    const role = searchParams.get('role') || 'brand'
    const retailerId = searchParams.get('retailerId')
    const platform = searchParams.get('platform') || 'all'
    const region = searchParams.get('region') || 'all'
    const campaignId = searchParams.get('campaignId')
    const sortBy = searchParams.get('sortBy') || 'avg_engagement_rate'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Validate role-based access
    if (role === 'retailer' && !retailerId) {
      return NextResponse.json(
        { error: 'Retailer ID required for retailer role' },
        { status: 400 }
      )
    }

    // Get retailer performance data
    const retailers = await getRetailerPerformanceData(supabase, {
      role,
      retailerId,
      platform,
      region,
      campaignId,
      sortBy,
      sortOrder,
      limit,
      offset
    })

    // Get summary statistics
    const summary = await getRetailerSummaryStats(supabase, {
      role,
      retailerId,
      platform,
      region,
      campaignId
    })

    return NextResponse.json({
      success: true,
      data: {
        retailers,
        summary,
        pagination: {
          limit,
          offset,
          total: retailers.length
        },
        filters: {
          role,
          retailerId,
          platform,
          region,
          campaignId,
          sortBy,
          sortOrder
        }
      }
    })

  } catch (error) {
    console.error('Retailers API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch retailer performance data' },
      { status: 500 }
    )
  }
}

async function getRetailerPerformanceData(supabase: any, filters: any) {
  try {
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

    // Apply filters
    if (filters.platform && filters.platform !== 'all') {
      query = query.eq('platform', filters.platform)
    }

    if (filters.region && filters.region !== 'all') {
      query = query.eq('region', filters.region)
    }

    if (filters.campaignId) {
      query = query.eq('campaign_id', filters.campaignId)
    }

    // For retailer role, only show their own data
    if (filters.role === 'retailer' && filters.retailerId) {
      query = query.eq('retailer_id', filters.retailerId)
    }

    // Apply sorting
    const ascending = filters.sortOrder === 'asc'
    query = query.order(filters.sortBy, { ascending })

    // Apply pagination
    if (filters.limit > 0) {
      query = query.range(filters.offset, filters.offset + filters.limit - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching retailer performance:', error)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Process and enhance the data
    const processedData = filters.platform === 'all' 
      ? aggregateRetailerDataAcrossPlatforms(data)
      : enhanceRetailerData(data)

    return processedData

  } catch (error) {
    console.error('Error in getRetailerPerformanceData:', error)
    return []
  }
}

async function getRetailerSummaryStats(supabase: any, filters: any) {
  try {
    let query = supabase
      .from('retailer_campaign_performance_new')
      .select(`
        retailer_id,
        avg_engagement_rate,
        total_reach,
        new_followers,
        region
      `)

    // Apply same filters as main query
    if (filters.platform && filters.platform !== 'all') {
      query = query.eq('platform', filters.platform)
    }

    if (filters.region && filters.region !== 'all') {
      query = query.eq('region', filters.region)
    }

    if (filters.campaignId) {
      query = query.eq('campaign_id', filters.campaignId)
    }

    if (filters.role === 'retailer' && filters.retailerId) {
      query = query.eq('retailer_id', filters.retailerId)
    }

    const { data, error } = await query

    if (error || !data) {
      return getDefaultSummaryStats()
    }

    // Calculate summary statistics
    const uniqueRetailers = new Set(data.map((r: any) => r.retailer_id)).size
    const totalReach = data.reduce((sum: number, r: any) => sum + (r.total_reach || 0), 0)
    const totalNewFollowers = data.reduce((sum: number, r: any) => sum + (r.new_followers || 0), 0)
    const avgEngagementRate = data.length > 0 
      ? data.reduce((sum: number, r: any) => sum + (r.avg_engagement_rate || 0), 0) / data.length
      : 0

    // Performance distribution
    const highPerformers = data.filter((r: any) => r.avg_engagement_rate >= 6).length
    const goodPerformers = data.filter((r: any) => r.avg_engagement_rate >= 3 && r.avg_engagement_rate < 6).length
    const standardPerformers = data.filter((r: any) => r.avg_engagement_rate < 3).length

    // Regional breakdown
    const regionBreakdown = data.reduce((acc: any, r: any) => {
      acc[r.region] = (acc[r.region] || 0) + 1
      return acc
    }, {})

    return {
      totalRetailers: uniqueRetailers,
      totalReach,
      totalNewFollowers,
      avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
      performanceDistribution: {
        high: highPerformers,
        good: goodPerformers,
        standard: standardPerformers
      },
      regionBreakdown,
      // Trends (simplified for dummy data)
      trends: {
        engagement: '+8.3%',
        reach: '+12.5%',
        followers: '+6.2%'
      }
    }

  } catch (error) {
    console.error('Error calculating summary stats:', error)
    return getDefaultSummaryStats()
  }
}

function aggregateRetailerDataAcrossPlatforms(data: any[]) {
  const retailerMap = new Map()

  data.forEach(record => {
    const key = `${record.retailer_id}_${record.campaign_id}`
    
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
        current_followers: 0,
        new_followers: 0,
        email_open_rate: record.email_open_rate,
        email_click_rate: record.email_click_rate,
        platforms: [],
        best_engagement_rank: record.engagement_rank || 999,
        best_reach_rank: record.reach_rank || 999,
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
    retailer.best_engagement_rank = Math.min(retailer.best_engagement_rank, record.engagement_rank || 999)
    retailer.best_reach_rank = Math.min(retailer.best_reach_rank, record.reach_rank || 999)
  })

  return Array.from(retailerMap.values()).map(retailer => ({
    ...retailer,
    avg_engagement_rate: retailer.total_impressions > 0 
      ? Math.round((retailer.total_engagement / retailer.total_impressions) * 100 * 100) / 100
      : 0,
    click_through_rate: retailer.total_impressions > 0
      ? Math.round((retailer.total_link_clicks / retailer.total_impressions) * 100 * 100) / 100
      : 0,
    reach_rate: retailer.total_impressions > 0
      ? Math.round((retailer.total_reach / retailer.total_impressions) * 100 * 100) / 100
      : 0,
    platforms: [...new Set(retailer.platforms)],
    platform_count: new Set(retailer.platforms).size,
    engagement_rank: retailer.best_engagement_rank,
    reach_rank: retailer.best_reach_rank,
    // Performance indicators
    performance_tier: retailer.avg_engagement_rate >= 6 ? 'High Performance' : 
                     retailer.avg_engagement_rate >= 3 ? 'Good Performance' : 'Standard Performance',
    // Format last updated
    last_updated: retailer.last_updated ? new Date(retailer.last_updated).toLocaleDateString() : null
  }))
}

function enhanceRetailerData(data: any[]) {
  return data.map(retailer => ({
    ...retailer,
    click_through_rate: retailer.total_impressions > 0
      ? Math.round((retailer.total_link_clicks / retailer.total_impressions) * 100 * 100) / 100
      : 0,
    reach_rate: retailer.total_impressions > 0
      ? Math.round((retailer.total_reach / retailer.total_impressions) * 100 * 100) / 100
      : 0,
    performance_tier: retailer.avg_engagement_rate >= 6 ? 'High Performance' : 
                     retailer.avg_engagement_rate >= 3 ? 'Good Performance' : 'Standard Performance',
    follower_growth_rate: retailer.current_followers > 0
      ? Math.round((retailer.new_followers / retailer.current_followers) * 100 * 100) / 100
      : 0,
    last_updated: retailer.last_updated ? new Date(retailer.last_updated).toLocaleDateString() : null
  }))
}

function getDefaultSummaryStats() {
  return {
    totalRetailers: 0,
    totalReach: 0,
    totalNewFollowers: 0,
    avgEngagementRate: 0,
    performanceDistribution: {
      high: 0,
      good: 0,
      standard: 0
    },
    regionBreakdown: {},
    trends: {
      engagement: '0%',
      reach: '0%',
      followers: '0%'
    }
  }
}