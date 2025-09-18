import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Mock data for now (database tables not created yet)
    const mockCampaigns = [
      {
        campaign_id: '1',
        campaign_name: 'Spring Collection Preview',
        campaign_status: 'active',
        campaign_type: 'mixed',
        start_date: '2024-12-01',
        end_date: '2025-01-01',
        duration_days: 32,
        avg_click_rate: 2.9,
        total_reach: 285000,
        total_engagement: 24500,
        participating_retailers_count: 5,
        total_emails_sent: 1500,
        performance_tier: 'high',
        trend_direction: 'up',
        last_updated: '2024-12-19T10:30:00Z'
      },
      {
        campaign_id: '2',
        campaign_name: 'Holiday Luxury Campaign',
        campaign_status: 'paused',
        campaign_type: 'email',
        start_date: '2024-11-15',
        end_date: '2025-01-16',
        duration_days: 62,
        avg_click_rate: 2.9,
        total_reach: 198000,
        total_engagement: 18200,
        participating_retailers_count: 5,
        total_emails_sent: 1500,
        performance_tier: 'good',
        trend_direction: 'stable',
        last_updated: '2024-12-18T15:45:00Z'
      },
      {
        campaign_id: '3',
        campaign_name: 'Summer Elegance 2025',
        campaign_status: 'draft',
        campaign_type: 'social',
        start_date: '2025-03-01',
        end_date: '2025-05-01',
        duration_days: 0,
        avg_click_rate: 2.9,
        total_reach: 0,
        total_engagement: 0,
        participating_retailers_count: 5,
        total_emails_sent: 1500,
        performance_tier: 'standard',
        trend_direction: 'stable',
        last_updated: '2024-12-17T09:20:00Z'
      },
      {
        campaign_id: '4',
        campaign_name: 'Winter Wonderland Exclusive',
        campaign_status: 'active',
        campaign_type: 'mixed',
        start_date: '2024-12-15',
        end_date: '2025-02-15',
        duration_days: 5,
        avg_click_rate: 3.8,
        total_reach: 312000,
        total_engagement: 28900,
        participating_retailers_count: 8,
        total_emails_sent: 2200,
        performance_tier: 'high',
        trend_direction: 'up',
        last_updated: '2024-12-19T14:15:00Z'
      },
      {
        campaign_id: '5',
        campaign_name: 'Artisan Heritage Collection',
        campaign_status: 'completed',
        campaign_type: 'social',
        start_date: '2024-10-01',
        end_date: '2024-12-01',
        duration_days: 61,
        avg_click_rate: 2.1,
        total_reach: 156000,
        total_engagement: 12400,
        participating_retailers_count: 4,
        total_emails_sent: 0,
        performance_tier: 'good',
        trend_direction: 'down',
        last_updated: '2024-12-01T18:30:00Z'
      },
      {
        campaign_id: '6',
        campaign_name: 'Timeless Elegance Launch',
        campaign_status: 'active',
        campaign_type: 'email',
        start_date: '2025-01-01',
        end_date: '2025-03-01',
        duration_days: -13,
        avg_click_rate: 3.2,
        total_reach: 245000,
        total_engagement: 21800,
        participating_retailers_count: 6,
        total_emails_sent: 1800,
        performance_tier: 'high',
        trend_direction: 'up',
        last_updated: '2024-12-19T11:45:00Z'
      }
    ]

    // Apply filters to mock data
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