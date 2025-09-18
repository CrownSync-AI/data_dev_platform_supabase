import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// Platform performance data endpoint
// Provides platform-specific analytics and comparisons

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

    // Validate role-based access
    if (role === 'retailer' && !retailerId) {
      return NextResponse.json(
        { error: 'Retailer ID required for retailer role' },
        { status: 400 }
      )
    }

    // Get platform performance data
    const platformPerformance = await getPlatformPerformanceData(supabase, {
      role,
      retailerId,
      campaignId,
      startDate,
      endDate
    })

    // Get platform comparison data
    const platformComparison = await getPlatformComparisonData(supabase, {
      role,
      retailerId,
      campaignId,
      startDate,
      endDate
    })

    // Get engagement trends by platform
    const engagementTrends = await getEngagementTrendsByPlatform(supabase, {
      role,
      retailerId,
      campaignId,
      startDate,
      endDate
    })

    return NextResponse.json({
      success: true,
      data: {
        platforms: platformPerformance,
        comparison: platformComparison,
        trends: engagementTrends,
        filters: {
          role,
          retailerId,
          campaignId,
          startDate,
          endDate
        }
      }
    })

  } catch (error) {
    console.error('Platforms API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform performance data' },
      { status: 500 }
    )
  }
}

async function getPlatformPerformanceData(supabase: any, filters: any) {
  try {
    let query = supabase
      .from('campaign_analytics_new')
      .select(`
        platform,
        impressions,
        reach,
        likes,
        comments,
        shares,
        total_engagement,
        link_clicks,
        engagement_rate,
        analytics_date,
        campaign_id,
        account_id
      `)

    // Apply date filters
    if (filters.startDate) {
      query = query.gte('analytics_date', filters.startDate)
    }
    if (filters.endDate) {
      query = query.lte('analytics_date', filters.endDate)
    }

    // Apply campaign filter
    if (filters.campaignId) {
      query = query.eq('campaign_id', filters.campaignId)
    }

    // For retailer role, filter by their accounts
    if (filters.role === 'retailer' && filters.retailerId) {
      const { data: retailerAccounts } = await supabase
        .from('social_accounts_new')
        .select('account_id')
        .eq('retailer_id', filters.retailerId)

      if (retailerAccounts && retailerAccounts.length > 0) {
        const accountIds = retailerAccounts.map((ra: any) => ra.account_id)
        query = query.in('account_id', accountIds)
      } else {
        return []
      }
    }

    const { data, error } = await query

    if (error || !data) {
      console.error('Error fetching platform analytics:', error)
      return []
    }

    // Aggregate by platform
    const platformMap = new Map()

    data.forEach((record: any) => {
      const platform = record.platform
      
      if (!platformMap.has(platform)) {
        platformMap.set(platform, {
          platform,
          total_impressions: 0,
          total_reach: 0,
          total_likes: 0,
          total_comments: 0,
          total_shares: 0,
          total_engagement: 0,
          total_link_clicks: 0,
          posts_count: 0,
          accounts_count: new Set(),
          campaigns_count: new Set(),
          engagement_rates: []
        })
      }

      const platformData = platformMap.get(platform)
      platformData.total_impressions += record.impressions || 0
      platformData.total_reach += record.reach || 0
      platformData.total_likes += record.likes || 0
      platformData.total_comments += record.comments || 0
      platformData.total_shares += record.shares || 0
      platformData.total_engagement += record.total_engagement || 0
      platformData.total_link_clicks += record.link_clicks || 0
      platformData.posts_count += 1
      platformData.accounts_count.add(record.account_id)
      platformData.campaigns_count.add(record.campaign_id)
      if (record.engagement_rate > 0) {
        platformData.engagement_rates.push(record.engagement_rate)
      }
    })

    // Calculate final metrics for each platform
    return Array.from(platformMap.values()).map(platform => {
      const avgEngagementRate = platform.engagement_rates.length > 0
        ? platform.engagement_rates.reduce((sum: number, rate: number) => sum + rate, 0) / platform.engagement_rates.length
        : 0

      const clickThroughRate = platform.total_impressions > 0
        ? (platform.total_link_clicks / platform.total_impressions) * 100
        : 0

      const reachRate = platform.total_impressions > 0
        ? (platform.total_reach / platform.total_impressions) * 100
        : 0

      return {
        platform: platform.platform,
        total_impressions: platform.total_impressions,
        total_reach: platform.total_reach,
        total_engagement: platform.total_engagement,
        total_link_clicks: platform.total_link_clicks,
        posts_count: platform.posts_count,
        accounts_count: platform.accounts_count.size,
        campaigns_count: platform.campaigns_count.size,
        avg_engagement_rate: Math.round(avgEngagementRate * 100) / 100,
        click_through_rate: Math.round(clickThroughRate * 100) / 100,
        reach_rate: Math.round(reachRate * 100) / 100,
        // Engagement breakdown
        engagement_breakdown: {
          likes: platform.total_likes,
          comments: platform.total_comments,
          shares: platform.total_shares,
          likes_percentage: platform.total_engagement > 0 ? Math.round((platform.total_likes / platform.total_engagement) * 100) : 0,
          comments_percentage: platform.total_engagement > 0 ? Math.round((platform.total_comments / platform.total_engagement) * 100) : 0,
          shares_percentage: platform.total_engagement > 0 ? Math.round((platform.total_shares / platform.total_engagement) * 100) : 0
        },
        // Performance indicators
        performance_tier: avgEngagementRate >= 6 ? 'High Performance' : 
                         avgEngagementRate >= 3 ? 'Good Performance' : 'Standard Performance'
      }
    }).sort((a, b) => b.avg_engagement_rate - a.avg_engagement_rate)

  } catch (error) {
    console.error('Error in getPlatformPerformanceData:', error)
    return []
  }
}

async function getPlatformComparisonData(supabase: any, filters: any) {
  try {
    // Get platform performance summary from the view
    let query = supabase
      .from('platform_performance_summary_new')
      .select('*')

    const { data, error } = await query

    if (error || !data) {
      console.error('Error fetching platform comparison:', error)
      return []
    }

    // Enhance with additional calculated metrics
    return data.map((platform: any) => ({
      ...platform,
      click_through_rate: platform.total_impressions > 0
        ? Math.round((platform.total_link_clicks / platform.total_impressions) * 100 * 100) / 100
        : 0,
      reach_efficiency: platform.total_impressions > 0
        ? Math.round((platform.total_reach / platform.total_impressions) * 100 * 100) / 100
        : 0,
      engagement_per_post: platform.total_posts > 0
        ? Math.round(platform.total_engagement / platform.total_posts)
        : 0,
      // Performance distribution percentages
      high_performers_percentage: platform.total_accounts > 0
        ? Math.round((platform.high_performers / platform.total_accounts) * 100)
        : 0,
      good_performers_percentage: platform.total_accounts > 0
        ? Math.round((platform.good_performers / platform.total_accounts) * 100)
        : 0,
      standard_performers_percentage: platform.total_accounts > 0
        ? Math.round((platform.standard_performers / platform.total_accounts) * 100)
        : 0
    }))

  } catch (error) {
    console.error('Error in getPlatformComparisonData:', error)
    return []
  }
}

async function getEngagementTrendsByPlatform(supabase: any, filters: any) {
  try {
    let query = supabase
      .from('campaign_analytics_new')
      .select(`
        platform,
        analytics_date,
        engagement_rate,
        total_engagement,
        impressions,
        reach
      `)

    // Apply date filters (default to last 30 days if not specified)
    const endDate = filters.endDate || new Date().toISOString().split('T')[0]
    const startDate = filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    query = query.gte('analytics_date', startDate).lte('analytics_date', endDate)

    // Apply campaign filter
    if (filters.campaignId) {
      query = query.eq('campaign_id', filters.campaignId)
    }

    // For retailer role, filter by their accounts
    if (filters.role === 'retailer' && filters.retailerId) {
      const { data: retailerAccounts } = await supabase
        .from('social_accounts_new')
        .select('account_id')
        .eq('retailer_id', filters.retailerId)

      if (retailerAccounts && retailerAccounts.length > 0) {
        const accountIds = retailerAccounts.map((ra: any) => ra.account_id)
        query = query.in('account_id', accountIds)
      } else {
        return []
      }
    }

    const { data, error } = await query.order('analytics_date')

    if (error || !data) {
      console.error('Error fetching engagement trends:', error)
      return []
    }

    // Group by date and platform, then calculate daily averages
    const trendsMap = new Map()

    data.forEach((record: any) => {
      const key = `${record.analytics_date}_${record.platform}`
      
      if (!trendsMap.has(key)) {
        trendsMap.set(key, {
          date: record.analytics_date,
          platform: record.platform,
          engagement_rates: [],
          total_engagement: 0,
          total_impressions: 0,
          total_reach: 0,
          posts_count: 0
        })
      }

      const trend = trendsMap.get(key)
      if (record.engagement_rate > 0) {
        trend.engagement_rates.push(record.engagement_rate)
      }
      trend.total_engagement += record.total_engagement || 0
      trend.total_impressions += record.impressions || 0
      trend.total_reach += record.reach || 0
      trend.posts_count += 1
    })

    // Calculate daily averages and format for charting
    const trends = Array.from(trendsMap.values()).map(trend => ({
      date: trend.date,
      platform: trend.platform,
      avg_engagement_rate: trend.engagement_rates.length > 0
        ? Math.round((trend.engagement_rates.reduce((sum: number, rate: number) => sum + rate, 0) / trend.engagement_rates.length) * 100) / 100
        : 0,
      total_engagement: trend.total_engagement,
      total_impressions: trend.total_impressions,
      total_reach: trend.total_reach,
      posts_count: trend.posts_count,
      reach_rate: trend.total_impressions > 0
        ? Math.round((trend.total_reach / trend.total_impressions) * 100 * 100) / 100
        : 0
    }))

    // Group by platform for easier frontend consumption
    const platformTrends = trends.reduce((acc: any, trend: any) => {
      if (!acc[trend.platform]) {
        acc[trend.platform] = []
      }
      acc[trend.platform].push({
        date: trend.date,
        engagement_rate: trend.avg_engagement_rate,
        total_engagement: trend.total_engagement,
        reach_rate: trend.reach_rate,
        posts_count: trend.posts_count
      })
      return acc
    }, {})

    // Sort each platform's trends by date
    Object.keys(platformTrends).forEach(platform => {
      platformTrends[platform].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    })

    return platformTrends

  } catch (error) {
    console.error('Error in getEngagementTrendsByPlatform:', error)
    return {}
  }
}