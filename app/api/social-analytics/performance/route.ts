import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    
    const platform = searchParams.get('platform')
    const region = searchParams.get('region')
    const performanceTier = searchParams.get('performanceTier')
    const sortBy = searchParams.get('sortBy') || 'avg_engagement_rate'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build the query for retailer social performance ranking
    let query = supabase
      .from('social_performance_summary')
      .select('*')

    // Apply filters
    if (platform && platform !== 'all') {
      query = (query as any).eq('platform', platform)
    }
    
    if (region && region !== 'all') {
      query = (query as any).eq('region', region)
    }
    
    if (performanceTier && performanceTier !== 'all') {
      query = (query as any).eq('performance_tier', performanceTier)
    }

    // Apply sorting
    query = (query as any).order(sortBy, { ascending: sortOrder === 'asc' })
    
    if (limit > 0) {
      query = (query as any).limit(limit)
    }

    const { data: performanceData, error } = await query

    if (error) {
      console.error('Error fetching performance data:', error)
      return NextResponse.json(
        { error: 'Failed to fetch performance data' },
        { status: 500 }
      )
    }

    // Add ranking and format data for table display
    const rankedData = performanceData?.map((item, index) => ({
      ...(item as any),
      rank: index + 1,
      platforms: [(item as any).platform], // Convert single platform to array for consistency
      total_followers: (item as any).current_followers,
      content_frequency: Math.round(((item as any).posts_count / 30) * 7), // Posts per week
      performance_grade: (item as any).avg_engagement_rate >= 5 ? 'A' : 
                        (item as any).avg_engagement_rate >= 2 ? 'B' : 'C',
      growth_trend: (item as any).avg_daily_follower_growth,
      last_activity: (item as any).last_updated
    })) || []

    // Get aggregated metrics by retailer (combining all platforms)
    const retailerAggregates = rankedData.reduce((acc: any[], item: any) => {
      const existing = acc.find(r => r.retailer_name === item.retailer_name)
      if (existing) {
        existing.platforms.push(item.platform)
        existing.total_followers += item.current_followers
        existing.total_engagement += item.total_engagement
        existing.total_reach += item.total_reach
        existing.posts_count += item.posts_count
      } else {
        acc.push({
          retailer_id: item.user_id,
          retailer_name: item.retailer_name,
          region: item.region,
          platforms: [item.platform],
          total_followers: item.current_followers,
          total_engagement: item.total_engagement,
          total_reach: item.total_reach,
          posts_count: item.posts_count,
          avg_engagement_rate: item.avg_engagement_rate,
          growth_trend: item.avg_daily_follower_growth,
          last_activity: item.last_updated
        })
      }
      return acc
    }, [] as any[])

    // Calculate final metrics and rankings for aggregated data
    const finalRankings = retailerAggregates.map((retailer, index) => ({
      ...retailer,
      rank: index + 1,
      avg_engagement_rate: retailer.total_reach > 0 
        ? (retailer.total_engagement / retailer.total_reach) * 100 
        : 0,
      content_frequency: Math.round((retailer.posts_count / 30) * 7), // Posts per week
      performance_grade: retailer.avg_engagement_rate >= 5 ? 'A' : 
                        retailer.avg_engagement_rate >= 2 ? 'B' : 'C',
      platforms: [...new Set(retailer.platforms)] // Remove duplicates
    }))

    // Sort by the requested field
    finalRankings.sort((a, b) => {
      const aVal = a[sortBy as keyof typeof a] || 0
      const bVal = b[sortBy as keyof typeof b] || 0
      return sortOrder === 'asc' ? 
        (aVal > bVal ? 1 : -1) : 
        (aVal < bVal ? 1 : -1)
    })

    return NextResponse.json({
      success: true,
      data: finalRankings,
      rawData: rankedData,
      meta: {
        total: finalRankings.length,
        sortBy,
        sortOrder,
        filters: {
          platform,
          region,
          performanceTier
        }
      }
    })

  } catch (error) {
    console.error('Performance API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}