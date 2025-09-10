import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { SocialAnalyticsFilters, SocialMetricsResponse } from '@/lib/types/social-media'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const platform = searchParams.get('platform')
    const region = searchParams.get('region')
    const performanceTier = searchParams.get('performanceTier')
    const startDate = searchParams.get('startDate') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const endDate = searchParams.get('endDate') || new Date().toISOString().split('T')[0]
    const retailerId = searchParams.get('retailerId')

    // Build the query
    let query = supabase
      .from('social_performance_summary')
      .select('*')

    // Apply filters
    if (platform && platform !== 'all') {
      query = query.eq('platform', platform)
    }
    
    if (region && region !== 'all') {
      query = query.eq('region', region)
    }
    
    if (performanceTier && performanceTier !== 'all') {
      query = query.eq('performance_tier', performanceTier)
    }
    
    if (retailerId) {
      query = query.eq('user_id', retailerId)
    }

    const { data: socialData, error } = await query

    if (error) {
      console.error('Error fetching social analytics:', error)
      return NextResponse.json(
        { error: 'Failed to fetch social analytics data' },
        { status: 500 }
      )
    }

    // Calculate aggregated metrics
    const totalReach = socialData?.reduce((sum, item) => sum + (item.total_reach || 0), 0) || 0
    const totalEngagement = socialData?.reduce((sum, item) => sum + (item.total_engagement || 0), 0) || 0
    const avgEngagementRate = socialData?.length > 0 
      ? socialData.reduce((sum, item) => sum + (item.avg_engagement_rate || 0), 0) / socialData.length 
      : 0
    const totalClicks = socialData?.reduce((sum, item) => sum + (item.total_clicks || 0), 0) || 0
    const newFollowers = socialData?.reduce((sum, item) => sum + (item.avg_daily_follower_growth || 0), 0) || 0

    // Platform breakdown
    const platformBreakdown = socialData?.reduce((acc, item) => {
      const existing = acc.find(p => p.platform === item.platform)
      if (existing) {
        existing.reach += item.total_reach || 0
        existing.engagement += item.total_engagement || 0
        existing.followers += item.current_followers || 0
      } else {
        acc.push({
          platform: item.platform,
          reach: item.total_reach || 0,
          engagement: item.total_engagement || 0,
          followers: item.current_followers || 0
        })
      }
      return acc
    }, [] as any[]) || []

    const response: SocialMetricsResponse = {
      totalReach,
      totalEngagement,
      avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
      totalClicks,
      newFollowers: Math.round(newFollowers),
      platformBreakdown
    }

    return NextResponse.json({
      success: true,
      data: response,
      rawData: socialData
    })

  } catch (error) {
    console.error('Social analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin()
    const body = await request.json()
    
    // Handle data sync or manual data insertion
    const { action, data } = body
    
    if (action === 'sync') {
      // Trigger data synchronization with Ayrshare API
      // This would be implemented when we integrate with actual Ayrshare API
      return NextResponse.json({
        success: true,
        message: 'Data sync initiated'
      })
    }
    
    if (action === 'insert' && data) {
      // Manual data insertion for testing
      const { error } = await supabase
        .from('social_analytics')
        .insert(data)
      
      if (error) {
        return NextResponse.json(
          { error: 'Failed to insert data' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: 'Data inserted successfully'
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Social analytics POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}