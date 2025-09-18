import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const retailerId = searchParams.get('retailerId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!retailerId) {
      return NextResponse.json(
        { error: 'Retailer ID is required' },
        { status: 400 }
      )
    }

    // Mock retailer campaigns with platform-specific data (8 campaigns per retailer)
    const campaignTemplates = [
      { name: 'Spring Collection Preview', status: 'active', type: 'mixed', tier: 'high', trend: 'up' },
      { name: 'Holiday Luxury Campaign', status: 'completed', type: 'social', tier: 'good', trend: 'stable' },
      { name: 'Summer Elegance 2025', status: 'draft', type: 'email', tier: 'standard', trend: 'stable' },
      { name: 'Winter Wonderland Exclusive', status: 'active', type: 'mixed', tier: 'high', trend: 'up' },
      { name: 'Artisan Heritage Collection', status: 'paused', type: 'social', tier: 'good', trend: 'down' },
      { name: 'Timeless Elegance Launch', status: 'active', type: 'email', tier: 'high', trend: 'up' },
      { name: 'Modern Minimalist Series', status: 'completed', type: 'mixed', tier: 'standard', trend: 'stable' },
      { name: 'Luxury Lifestyle Showcase', status: 'active', type: 'social', tier: 'high', trend: 'up' }
    ]

    const mockCampaigns = campaignTemplates.map((template, index) => {
      const baseMetrics = {
        impressions: 30000 + Math.floor(Math.random() * 40000),
        reach: 25000 + Math.floor(Math.random() * 30000),
        engagement: 800 + Math.floor(Math.random() * 1200)
      }

      return {
        campaign_id: `${retailerId}-campaign-${index + 1}`,
        campaign_name: template.name,
        campaign_status: template.status,
        campaign_type: template.type,
        start_date: new Date(2024, 10 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
        end_date: template.status === 'completed' ? new Date(2024, 11, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0] : undefined,
        retailer_id: retailerId,
        platform_performance: {
          facebook: {
            impressions: baseMetrics.impressions,
            reach: Math.floor(baseMetrics.reach * 0.8),
            engagement: Math.floor(baseMetrics.engagement * 0.3),
            sharesCount: Math.floor(Math.random() * 50) + 10,
            commentsCount: Math.floor(Math.random() * 100) + 20,
            likeCount: Math.floor(Math.random() * 800) + 200,
            reactions: { 
              like: Math.floor(Math.random() * 600) + 100, 
              love: Math.floor(Math.random() * 200) + 50, 
              haha: Math.floor(Math.random() * 50) + 10, 
              wow: Math.floor(Math.random() * 30) + 5 
            }
          },
          instagram: {
            impressions: Math.floor(baseMetrics.impressions * 1.2),
            reach: Math.floor(baseMetrics.reach * 1.1),
            engagement: Math.floor(baseMetrics.engagement * 0.4),
            likeCount: Math.floor(Math.random() * 1000) + 300,
            commentsCount: Math.floor(Math.random() * 150) + 50,
            savedCount: Math.floor(Math.random() * 300) + 100,
            sharesCount: Math.floor(Math.random() * 80) + 20
          },
          linkedin: {
            impressions: Math.floor(baseMetrics.impressions * 0.7),
            reach: Math.floor(baseMetrics.reach * 0.6),
            engagement: Math.floor(baseMetrics.engagement * 0.2),
            likeCount: Math.floor(Math.random() * 300) + 100,
            commentsCount: Math.floor(Math.random() * 80) + 20,
            shareCount: Math.floor(Math.random() * 40) + 10,
            reactions: { 
              like: Math.floor(Math.random() * 200) + 50, 
              praise: Math.floor(Math.random() * 60) + 15, 
              empathy: Math.floor(Math.random() * 20) + 5, 
              interest: Math.floor(Math.random() * 15) + 3 
            }
          },
          twitter: {
            impressions: Math.floor(baseMetrics.impressions * 0.9),
            reach: Math.floor(baseMetrics.reach * 0.7),
            engagement: Math.floor(baseMetrics.engagement * 0.25),
            likeCount: Math.floor(Math.random() * 500) + 150,
            retweetCount: Math.floor(Math.random() * 100) + 30,
            replyCount: Math.floor(Math.random() * 60) + 15,
            bookmarkCount: Math.floor(Math.random() * 120) + 40
          }
        },
        performance_tier: template.tier,
        trend_direction: template.trend,
        last_updated: new Date(2024, 11, Math.floor(Math.random() * 19) + 1, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60)).toISOString()
      }
    })

    // Apply filters
    let filteredCampaigns = mockCampaigns

    if (status && status !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(c => c.campaign_status === status)
    }

    if (search) {
      filteredCampaigns = filteredCampaigns.filter(c => 
        c.campaign_name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Apply pagination
    const paginatedCampaigns = filteredCampaigns.slice(offset, offset + limit)

    return NextResponse.json({
      campaigns: paginatedCampaigns,
      total: filteredCampaigns.length,
      limit,
      offset,
      hasMore: filteredCampaigns.length > offset + limit
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}