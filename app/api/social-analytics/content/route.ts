import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    
    const platform = searchParams.get('platform')
    const contentType = searchParams.get('contentType')
    const minEngagement = parseFloat(searchParams.get('minEngagement') || '0')
    const limit = parseInt(searchParams.get('limit') || '20')
    const days = parseInt(searchParams.get('days') || '90')

    // Build the query for top performing content
    let query = supabase
      .from('top_performing_content')
      .select('*')

    // Apply filters
    if (platform && platform !== 'all') {
      query = query.eq('platform', platform)
    }
    
    if (contentType && contentType !== 'all') {
      query = query.eq('post_type', contentType)
    }
    
    if (minEngagement > 0) {
      query = query.gte('engagement_rate', minEngagement)
    }

    // Filter by date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    query = query.gte('published_at', startDate.toISOString())

    // Apply sorting and limit
    query = query.order('engagement_rate', { ascending: false })
    
    if (limit > 0) {
      query = query.limit(limit)
    }

    const { data: contentData, error } = await query

    if (error) {
      console.error('Error fetching top content:', error)
      return NextResponse.json(
        { error: 'Failed to fetch top performing content' },
        { status: 500 }
      )
    }

    // Format content data for display
    const formattedContent = contentData?.map(item => ({
      ...item,
      content_preview: item.content ? 
        (item.content.length > 100 ? item.content.substring(0, 100) + '...' : item.content) : 
        'No content available',
      published_date: item.published_at ? 
        new Date(item.published_at).toLocaleDateString() : 
        'Unknown',
      performance_tier: item.engagement_rate >= 5 ? 'High' : 
                       item.engagement_rate >= 2 ? 'Good' : 'Standard',
      hashtag_count: item.hashtags ? item.hashtags.length : 0
    })) || []

    // Get content performance statistics
    const stats = {
      total_posts: formattedContent.length,
      avg_engagement_rate: formattedContent.length > 0 ? 
        formattedContent.reduce((sum, item) => sum + item.engagement_rate, 0) / formattedContent.length : 0,
      total_reach: formattedContent.reduce((sum, item) => sum + (item.reach || 0), 0),
      total_impressions: formattedContent.reduce((sum, item) => sum + (item.impressions || 0), 0),
      platform_breakdown: formattedContent.reduce((acc, item) => {
        acc[item.platform] = (acc[item.platform] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }

    return NextResponse.json({
      success: true,
      data: formattedContent,
      stats,
      meta: {
        total: formattedContent.length,
        filters: {
          platform,
          contentType,
          minEngagement,
          days
        }
      }
    })

  } catch (error) {
    console.error('Content API error:', error)
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
    
    const {
      account_id,
      campaign_id,
      post_type,
      content,
      media_urls,
      hashtags,
      scheduled_at,
      post_metadata = {}
    } = body

    // Validate required fields
    if (!account_id || !content) {
      return NextResponse.json(
        { error: 'account_id and content are required' },
        { status: 400 }
      )
    }

    // Insert new social post
    const { data: newPost, error } = await supabase
      .from('social_posts')
      .insert({
        account_id,
        campaign_id,
        post_type,
        content,
        media_urls,
        hashtags,
        scheduled_at,
        post_metadata,
        status: scheduled_at ? 'scheduled' : 'draft'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating social post:', error)
      return NextResponse.json(
        { error: 'Failed to create social post' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: newPost
    })

  } catch (error) {
    console.error('Content POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}