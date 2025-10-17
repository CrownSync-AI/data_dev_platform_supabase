import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Use nextUrl.searchParams instead of new URL(request.url) for static compatibility
    const searchParams = request.nextUrl.searchParams
    
    // Get query parameters
    const role = searchParams.get('role') || 'brand'
    const retailerId = searchParams.get('retailerId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Base campaigns data (some are mixed type) - Updated dates to be within last 90 days
    const baseCampaigns = [
      {
        campaign_id: '1',
        campaign_name: 'Spring Collection Preview',
        campaign_status: 'active',
        campaign_type: 'social',
        campaign_image: 'https://dwj.dickson.com.tw/wp-content/uploads/2025/04/rolex-new-watches-2025-new-dials_m126518ln-0014_2501stojan_001-portrait.jpg',
        start_date: '2025-09-15',
        end_date: '2025-10-15',
        duration_days: 30,
        avg_click_rate: 2.9,
        total_reach: 285000,
        total_engagement: 24500,
        participating_retailers_count: 5,
        total_emails_sent: 1500,
        performance_tier: 'high',
        trend_direction: 'up',
        last_updated: '2025-10-02T10:30:00Z'
      },
      {
        campaign_id: '2',
        campaign_name: 'Holiday Luxury Campaign',
        campaign_status: 'paused',
        campaign_type: 'email',
        campaign_image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=250&fit=crop&auto=format',
        start_date: '2025-08-20',
        end_date: '2025-09-20',
        duration_days: 30,
        avg_click_rate: 2.9,
        total_reach: 198000,
        total_engagement: 18200,
        participating_retailers_count: 5,
        total_emails_sent: 1500,
        performance_tier: 'good',
        trend_direction: 'stable',
        last_updated: '2025-10-01T15:45:00Z'
      },
      {
        campaign_id: '3',
        campaign_name: 'Winter Elegance Collection',
        campaign_status: 'draft',
        campaign_type: 'social',
        campaign_image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=250&fit=crop&auto=format',
        start_date: '2025-09-25',
        end_date: '2025-10-25',
        duration_days: 31,
        avg_click_rate: 2.9,
        total_reach: 0,
        total_engagement: 0,
        participating_retailers_count: 5,
        total_emails_sent: 1500,
        performance_tier: 'standard',
        trend_direction: 'stable',
        last_updated: '2025-09-30T09:20:00Z'
      },
      {
        campaign_id: '4',
        campaign_name: 'Winter Wonderland Exclusive',
        campaign_status: 'active',
        campaign_type: 'social',
        campaign_image: 'https://media.rolex.com/image/upload/v1725888690/rolexcom/collection/configurator/config-launcher/2024/config-launcher-watches-day-date-m228235-0055_2403jva_002.jpg',
        start_date: '2025-09-10',
        end_date: '2025-10-10',
        duration_days: 31,
        avg_click_rate: 3.8,
        total_reach: 312000,
        total_engagement: 28900,
        participating_retailers_count: 8,
        total_emails_sent: 2200,
        performance_tier: 'high',
        trend_direction: 'up',
        last_updated: '2025-10-02T14:15:00Z'
      },
      {
        campaign_id: '5',
        campaign_name: 'Artisan Heritage Collection',
        campaign_status: 'completed',
        campaign_type: 'social',
        campaign_image: 'http://cdn.shopify.com/s/files/1/0397/2638/3257/files/Rolex-watches-for-man-Australia_480x480.jpg?v=1678314745',
        start_date: '2025-08-15',
        end_date: '2025-09-15',
        duration_days: 31,
        avg_click_rate: 2.1,
        total_reach: 156000,
        total_engagement: 12400,
        participating_retailers_count: 4,
        total_emails_sent: 0,
        performance_tier: 'good',
        trend_direction: 'down',
        last_updated: '2025-09-15T18:30:00Z'
      },
      {
        campaign_id: '6',
        campaign_name: 'Timeless Elegance Launch',
        campaign_status: 'active',
        campaign_type: 'email',
        campaign_image: 'https://lapatiala.com/wp-content/uploads/2024/12/Why-Is-Rolex-So-Expensive.jpg',
        start_date: '2025-09-05',
        end_date: '2025-10-05',
        duration_days: 30,
        avg_click_rate: 3.2,
        total_reach: 245000,
        total_engagement: 21800,
        participating_retailers_count: 6,
        total_emails_sent: 1800,
        performance_tier: 'high',
        trend_direction: 'up',
        last_updated: '2025-10-02T11:45:00Z'
      }
    ]

    // Use campaigns as they are (no mixed type processing needed)
    let filteredCampaigns = baseCampaigns

    if (status && status !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(c => c.campaign_status === status)
    }

    if (type && type !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(c => c.campaign_type === type)
    }

    if (search) {
      filteredCampaigns = filteredCampaigns.filter(c => 
        c.campaign_name.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Apply pagination
    const paginatedCampaigns = filteredCampaigns.slice(offset, offset + limit)

    // Debug: Log the campaigns being returned
    console.log('🔍 API DEBUG: Returning campaigns:', paginatedCampaigns.map(c => ({
      id: c.campaign_id,
      name: c.campaign_name,
      image: c.campaign_image
    })))

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