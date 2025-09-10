import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    
    const platform = searchParams.get('platform')
    const days = parseInt(searchParams.get('days') || '30')
    const retailerId = searchParams.get('retailerId')
    const metric = searchParams.get('metric') || 'engagement_rate'

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Build query for engagement trends
    let analyticsQuery = supabase
      .from('social_analytics')
      .select(`
        analytics_date,
        platform,
        engagement_rate,
        reach,
        impressions,
        likes,
        comments,
        shares,
        reactions,
        social_accounts!inner(
          user_id,
          account_name,
          users!inner(name, region)
        )
      `)
      .gte('analytics_date', startDate.toISOString().split('T')[0])
      .lte('analytics_date', endDate.toISOString().split('T')[0])

    // Apply filters
    if (platform && platform !== 'all') {
      analyticsQuery = (analyticsQuery as any).eq('platform', platform)
    }
    
    if (retailerId) {
      analyticsQuery = (analyticsQuery as any).eq('social_accounts.user_id', retailerId)
    }

    const { data: analyticsData, error: analyticsError } = await analyticsQuery

    if (analyticsError) {
      console.error('Error fetching analytics trends:', analyticsError)
      return NextResponse.json(
        { error: 'Failed to fetch analytics trends' },
        { status: 500 }
      )
    }

    // Build query for follower growth trends
    let accountQuery = supabase
      .from('account_analytics')
      .select(`
        analytics_date,
        platform,
        net_follower_growth,
        followers_count,
        follower_growth_rate,
        social_accounts!inner(
          user_id,
          account_name,
          users!inner(name, region)
        )
      `)
      .gte('analytics_date', startDate.toISOString().split('T')[0])
      .lte('analytics_date', endDate.toISOString().split('T')[0])

    if (platform && platform !== 'all') {
      accountQuery = (accountQuery as any).eq('platform', platform)
    }
    
    if (retailerId) {
      accountQuery = (accountQuery as any).eq('social_accounts.user_id', retailerId)
    }

    const { data: accountData, error: accountError } = await accountQuery

    if (accountError) {
      console.error('Error fetching account trends:', accountError)
      return NextResponse.json(
        { error: 'Failed to fetch account trends' },
        { status: 500 }
      )
    }

    // Process engagement trends data
    const engagementTrends = (analyticsData as any)?.reduce((acc: any[], item: any) => {
      const date = item.analytics_date
      const existing = acc.find(d => d.date === date && d.platform === item.platform)
      
      if (existing) {
        existing.engagement_rate = (existing.engagement_rate + item.engagement_rate) / 2
        existing.reach += item.reach
        existing.impressions += item.impressions
        existing.total_engagement += (item.likes + item.comments + item.shares + item.reactions)
      } else {
        acc.push({
          date,
          platform: item.platform,
          engagement_rate: item.engagement_rate,
          reach: item.reach,
          impressions: item.impressions,
          total_engagement: item.likes + item.comments + item.shares + item.reactions,
          retailer_name: item.social_accounts?.users?.name || 'Unknown'
        })
      }
      
      return acc
    }, [] as any[]) || []

    // Process follower growth trends
    const followerTrends = (accountData as any)?.reduce((acc: any[], item: any) => {
      const date = item.analytics_date
      const existing = acc.find(d => d.date === date && d.platform === item.platform)
      
      if (existing) {
        existing.follower_growth += item.net_follower_growth
        existing.followers_count = Math.max(existing.followers_count, item.followers_count)
      } else {
        acc.push({
          date,
          platform: item.platform,
          follower_growth: item.net_follower_growth,
          followers_count: item.followers_count,
          growth_rate: item.follower_growth_rate,
          retailer_name: item.social_accounts?.users?.name || 'Unknown'
        })
      }
      
      return acc
    }, [] as any[]) || []

    // Combine trends data
    const combinedTrends = engagementTrends.map((engagement: any) => {
      const followerData = followerTrends.find((f: any) => 
        f.date === engagement.date && f.platform === engagement.platform
      )
      
      return {
        ...engagement,
        follower_growth: followerData?.follower_growth || 0,
        followers_count: followerData?.followers_count || 0,
        growth_rate: followerData?.growth_rate || 0
      }
    })

    // Sort by date
    combinedTrends.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Calculate platform comparison data
    const platformComparison = combinedTrends.reduce((acc: any[], item: any) => {
      const existing = acc.find(p => p.platform === item.platform)
      
      if (existing) {
        existing.avg_engagement_rate = (existing.avg_engagement_rate + item.engagement_rate) / 2
        existing.total_reach += item.reach
        existing.total_followers = Math.max(existing.total_followers, item.followers_count)
        existing.avg_growth_rate = (existing.avg_growth_rate + item.growth_rate) / 2
        existing.data_points += 1
      } else {
        acc.push({
          platform: item.platform,
          avg_engagement_rate: item.engagement_rate,
          total_reach: item.reach,
          total_followers: item.followers_count,
          avg_growth_rate: item.growth_rate,
          data_points: 1
        })
      }
      
      return acc
    }, [] as any[])

    // Calculate final averages
    platformComparison.forEach((platform: any) => {
      platform.avg_engagement_rate = platform.avg_engagement_rate
      platform.avg_growth_rate = platform.avg_growth_rate
      platform.reach_efficiency = platform.total_followers > 0 ? 
        (platform.total_reach / platform.total_followers) * 100 : 0
    })

    return NextResponse.json({
      success: true,
      data: {
        trends: combinedTrends,
        platformComparison,
        dateRange: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0]
        }
      },
      meta: {
        totalDataPoints: combinedTrends.length,
        platforms: [...new Set(combinedTrends.map((t: any) => t.platform))],
        filters: {
          platform,
          days,
          retailerId,
          metric
        }
      }
    })

  } catch (error) {
    console.error('Trends API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}