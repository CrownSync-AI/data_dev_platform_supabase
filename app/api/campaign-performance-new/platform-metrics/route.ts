import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

// Platform-Specific Metrics API endpoint
// Provides detailed platform-specific analytics based on Ayrshare data structure

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const supabase = createSupabaseAdmin()
    
    // Extract query parameters
    const platform = searchParams.get('platform') || 'all'
    const role = searchParams.get('role') || 'brand'
    const retailerId = searchParams.get('retailerId')
    const campaignId = searchParams.get('campaignId')

    // Validate role-based access
    if (role === 'retailer' && !retailerId) {
      return NextResponse.json(
        { error: 'Retailer ID required for retailer role' },
        { status: 400 }
      )
    }

    // Get platform-specific overview
    const platformOverview = await getPlatformOverview(supabase, {
      platform,
      role,
      retailerId,
      campaignId
    })

    // Get platform-specific metrics
    const platformMetrics = await getPlatformSpecificMetrics(supabase, {
      platform,
      role,
      retailerId,
      campaignId
    })

    // Get cross-platform comparison
    const crossPlatformComparison = await getCrossPlatformComparison(supabase, {
      role,
      retailerId,
      campaignId
    })

    // Get top performing posts
    const topPosts = await getTopPerformingPosts(supabase, {
      platform,
      role,
      retailerId,
      campaignId
    })

    // Get engagement breakdown
    const engagementBreakdown = await getEngagementBreakdown(supabase, {
      platform,
      role,
      retailerId,
      campaignId
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: platformOverview,
        metrics: platformMetrics,
        crossPlatform: crossPlatformComparison,
        topPosts,
        engagement: engagementBreakdown,
        filters: {
          platform,
          role,
          retailerId,
          campaignId
        }
      }
    })

  } catch (error) {
    console.error('Platform Metrics API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platform metrics' },
      { status: 500 }
    )
  }
}

// Get platform overview metrics
async function getPlatformOverview(supabase: any, filters: any) {
  try {
    let query = supabase
      .from('campaign_platform_overview')
      .select('*')

    // Apply filters
    if (filters.campaignId) {
      query = query.eq('campaign_id', filters.campaignId)
    }

    if (filters.platform && filters.platform !== 'all') {
      query = query.eq('platform', filters.platform)
    }

    // For retailer role, filter by their campaigns
    if (filters.role === 'retailer' && filters.retailerId) {
      const { data: retailerCampaigns } = await supabase
        .from('social_accounts_new')
        .select(`
          account_id,
          campaign_posts_new!inner(campaign_id)
        `)
        .eq('retailer_id', filters.retailerId)

      if (retailerCampaigns && retailerCampaigns.length > 0) {
        const campaignIds = [...new Set(retailerCampaigns.flatMap((rc: any) => 
          rc.campaign_posts_new.map((cp: any) => cp.campaign_id)
        ))]
        query = query.in('campaign_id', campaignIds)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Platform overview query error:', error)
      return []
    }

    return data || []

  } catch (error) {
    console.error('Error in getPlatformOverview:', error)
    return []
  }
}

// Get platform-specific metrics with Ayrshare structure
async function getPlatformSpecificMetrics(supabase: any, filters: any) {
  try {
    let query = supabase
      .from('platform_specific_metrics')
      .select(`
        *,
        campaign_posts_new!inner(
          post_content,
          post_type,
          published_at
        )
      `)

    // Apply filters
    if (filters.platform && filters.platform !== 'all') {
      query = query.eq('platform', filters.platform)
    }

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
      }
    }

    const { data, error } = await query.limit(100)

    if (error) {
      console.error('Platform metrics query error:', error)
      return []
    }

    // Process and format platform-specific data
    return formatPlatformMetrics(data || [], filters.platform)

  } catch (error) {
    console.error('Error in getPlatformSpecificMetrics:', error)
    return []
  }
}

// Get cross-platform comparison
async function getCrossPlatformComparison(supabase: any, filters: any) {
  try {
    let query = supabase
      .from('cross_platform_comparison')
      .select('*')

    if (filters.campaignId) {
      query = query.eq('campaign_id', filters.campaignId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Cross-platform comparison error:', error)
      return []
    }

    return data || []

  } catch (error) {
    console.error('Error in getCrossPlatformComparison:', error)
    return []
  }
}

// Get top performing posts by platform
async function getTopPerformingPosts(supabase: any, filters: any) {
  try {
    if (!filters.campaignId || !filters.platform || filters.platform === 'all') {
      return []
    }

    const { data, error } = await supabase
      .rpc('get_top_posts_by_platform', {
        p_campaign_id: filters.campaignId,
        p_platform: filters.platform,
        p_limit: 5
      })

    if (error) {
      console.error('Top posts query error:', error)
      return []
    }

    return data || []

  } catch (error) {
    console.error('Error in getTopPerformingPosts:', error)
    return []
  }
}

// Get engagement breakdown by platform
async function getEngagementBreakdown(supabase: any, filters: any) {
  try {
    let query = supabase
      .from('platform_specific_metrics')
      .select(`
        platform,
        likes,
        comments,
        shares,
        total_engagement,
        engagement_rate,
        impressions,
        reach,
        fb_reactions_love,
        fb_reactions_anger,
        fb_reactions_haha,
        fb_reactions_wow,
        ig_saves,
        ig_profile_visits,
        tw_retweets,
        tw_bookmarks,
        li_reactions_praise,
        li_reactions_empathy,
        li_reactions_interest
      `)

    // Apply filters
    if (filters.platform && filters.platform !== 'all') {
      query = query.eq('platform', filters.platform)
    }

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
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Engagement breakdown query error:', error)
      return getDefaultEngagementBreakdown()
    }

    return processEngagementBreakdown(data || [], filters.platform)

  } catch (error) {
    console.error('Error in getEngagementBreakdown:', error)
    return getDefaultEngagementBreakdown()
  }
}

// Format platform-specific metrics based on Ayrshare structure
function formatPlatformMetrics(data: any[], platform: string) {
  if (!data || data.length === 0) return []

  return data.map(metric => {
    const baseMetrics = {
      post_id: metric.post_id,
      platform: metric.platform,
      impressions: metric.impressions,
      reach: metric.reach,
      likes: metric.likes,
      comments: metric.comments,
      shares: metric.shares,
      total_engagement: metric.total_engagement,
      engagement_rate: metric.engagement_rate,
      analytics_date: metric.analytics_date,
      post_content: metric.campaign_posts_new?.post_content,
      post_type: metric.campaign_posts_new?.post_type,
      published_at: metric.campaign_posts_new?.published_at
    }

    // Add platform-specific metrics
    switch (platform) {
      case 'facebook':
        return {
          ...baseMetrics,
          platform_metrics: {
            video_views: metric.fb_video_views,
            video_completion_rate: metric.fb_video_completion_rate,
            avg_watch_time: metric.fb_video_avg_watch_time,
            reactions: {
              love: metric.fb_reactions_love,
              anger: metric.fb_reactions_anger,
              haha: metric.fb_reactions_haha,
              wow: metric.fb_reactions_wow,
              sorry: metric.fb_reactions_sorry
            },
            page_likes: metric.fb_page_likes,
            post_clicks: metric.fb_post_clicks
          }
        }

      case 'instagram':
        return {
          ...baseMetrics,
          platform_metrics: {
            saves: metric.ig_saves,
            profile_visits: metric.ig_profile_visits,
            follows_from_post: metric.ig_follows_from_post,
            story_interactions: {
              exits: metric.ig_story_exits,
              taps_forward: metric.ig_story_taps_forward,
              taps_back: metric.ig_story_taps_back
            },
            reels: {
              plays: metric.ig_reels_plays,
              avg_watch_time: metric.ig_reels_avg_watch_time
            }
          }
        }

      case 'twitter':
        return {
          ...baseMetrics,
          platform_metrics: {
            retweets: metric.tw_retweets,
            quote_tweets: metric.tw_quote_tweets,
            bookmarks: metric.tw_bookmarks,
            profile_clicks: metric.tw_profile_clicks,
            url_clicks: metric.tw_url_clicks,
            hashtag_clicks: metric.tw_hashtag_clicks,
            video_metrics: {
              views: metric.tw_video_views,
              completion_25: metric.tw_video_completion_25,
              completion_50: metric.tw_video_completion_50,
              completion_75: metric.tw_video_completion_75,
              completion_100: metric.tw_video_completion_100
            }
          }
        }

      case 'linkedin':
        return {
          ...baseMetrics,
          platform_metrics: {
            unique_impressions: metric.li_unique_impressions,
            clicks: metric.li_click_count,
            video_views: metric.li_video_views,
            reactions: {
              praise: metric.li_reactions_praise,
              empathy: metric.li_reactions_empathy,
              interest: metric.li_reactions_interest,
              appreciation: metric.li_reactions_appreciation,
              maybe: metric.li_reactions_maybe
            }
          }
        }

      default:
        return baseMetrics
    }
  })
}

// Process engagement breakdown by platform
function processEngagementBreakdown(data: any[], platform: string) {
  if (!data || data.length === 0) return getDefaultEngagementBreakdown()

  const platformData = platform === 'all' ? data : data.filter(d => d.platform === platform)

  // Group by platform for analysis
  const platformGroups = platformData.reduce((acc: any, item: any) => {
    if (!acc[item.platform]) {
      acc[item.platform] = []
    }
    acc[item.platform].push(item)
    return acc
  }, {})

  const breakdown: any = {}

  Object.keys(platformGroups).forEach(platformKey => {
    const platformMetrics = platformGroups[platformKey]
    
    breakdown[platformKey] = {
      total_posts: platformMetrics.length,
      total_impressions: platformMetrics.reduce((sum: number, m: any) => sum + (m.impressions || 0), 0),
      total_reach: platformMetrics.reduce((sum: number, m: any) => sum + (m.reach || 0), 0),
      total_engagement: platformMetrics.reduce((sum: number, m: any) => sum + (m.total_engagement || 0), 0),
      avg_engagement_rate: platformMetrics.reduce((sum: number, m: any) => sum + (m.engagement_rate || 0), 0) / platformMetrics.length,
      
      // Platform-specific breakdowns
      engagement_types: getEngagementTypes(platformMetrics, platformKey),
      performance_distribution: getPerformanceDistribution(platformMetrics)
    }
  })

  return breakdown
}

// Get engagement types breakdown by platform
function getEngagementTypes(metrics: any[], platform: string) {
  const totalLikes = metrics.reduce((sum: number, m: any) => sum + (m.likes || 0), 0)
  const totalComments = metrics.reduce((sum: number, m: any) => sum + (m.comments || 0), 0)
  const totalShares = metrics.reduce((sum: number, m: any) => sum + (m.shares || 0), 0)

  const base = {
    likes: totalLikes,
    comments: totalComments,
    shares: totalShares
  }

  switch (platform) {
    case 'facebook':
      return {
        ...base,
        reactions: {
          love: metrics.reduce((sum: number, m: any) => sum + (m.fb_reactions_love || 0), 0),
          anger: metrics.reduce((sum: number, m: any) => sum + (m.fb_reactions_anger || 0), 0),
          haha: metrics.reduce((sum: number, m: any) => sum + (m.fb_reactions_haha || 0), 0),
          wow: metrics.reduce((sum: number, m: any) => sum + (m.fb_reactions_wow || 0), 0)
        }
      }

    case 'instagram':
      return {
        ...base,
        saves: metrics.reduce((sum: number, m: any) => sum + (m.ig_saves || 0), 0),
        profile_visits: metrics.reduce((sum: number, m: any) => sum + (m.ig_profile_visits || 0), 0)
      }

    case 'twitter':
      return {
        ...base,
        retweets: metrics.reduce((sum: number, m: any) => sum + (m.tw_retweets || 0), 0),
        bookmarks: metrics.reduce((sum: number, m: any) => sum + (m.tw_bookmarks || 0), 0)
      }

    case 'linkedin':
      return {
        ...base,
        reactions: {
          praise: metrics.reduce((sum: number, m: any) => sum + (m.li_reactions_praise || 0), 0),
          empathy: metrics.reduce((sum: number, m: any) => sum + (m.li_reactions_empathy || 0), 0),
          interest: metrics.reduce((sum: number, m: any) => sum + (m.li_reactions_interest || 0), 0)
        }
      }

    default:
      return base
  }
}

// Get performance distribution
function getPerformanceDistribution(metrics: any[]) {
  const highPerformers = metrics.filter(m => (m.engagement_rate || 0) >= 6.0).length
  const goodPerformers = metrics.filter(m => (m.engagement_rate || 0) >= 3.0 && (m.engagement_rate || 0) < 6.0).length
  const standardPerformers = metrics.filter(m => (m.engagement_rate || 0) < 3.0).length

  return {
    high: highPerformers,
    good: goodPerformers,
    standard: standardPerformers,
    total: metrics.length
  }
}

// Default engagement breakdown for error cases
function getDefaultEngagementBreakdown() {
  return {
    facebook: { total_posts: 0, total_engagement: 0, avg_engagement_rate: 0 },
    instagram: { total_posts: 0, total_engagement: 0, avg_engagement_rate: 0 },
    twitter: { total_posts: 0, total_engagement: 0, avg_engagement_rate: 0 },
    linkedin: { total_posts: 0, total_engagement: 0, avg_engagement_rate: 0 }
  }
}