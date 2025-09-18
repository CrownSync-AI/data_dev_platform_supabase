import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  try {
    const { campaignId } = params

    // Mock campaign details (database tables not created yet)
    const mockCampaignDetails = {
      campaign: {
        campaign_id: campaignId,
        campaign_name: getCampaignName(campaignId),
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
        trend_direction: 'up'
      },
      conversionFunnel: {
        emails_sent: 1500,
        emails_delivered: 1425,
        emails_opened: 997,
        emails_clicked: 43,
        conversions: 12,
        delivery_rate: 95.0,
        open_rate: 70.0,
        click_rate: 4.3,
        conversion_rate: 27.9,
        delivery_trend: '+2.3%',
        open_trend: '+1.2%',
        click_trend: '+0.8%',
        conversion_trend: '+1.5%'
      },
      platformPerformance: [
        {
          platform: 'facebook',
          impressions: 342000,
          reach: 228000,
          engagement: 6125,
          clicks: 490,
          engagement_rate: 2.7
        },
        {
          platform: 'instagram',
          impressions: 285000,
          reach: 256500,
          engagement: 8925,
          clicks: 142,
          engagement_rate: 3.5
        },
        {
          platform: 'linkedin',
          impressions: 171000,
          reach: 159600,
          engagement: 2565,
          clicks: 205,
          engagement_rate: 1.6
        }
      ],
      retailerSummary: {
        total_participating_retailers: 5,
        avg_retailer_performance: 4.2,
        top_performing_region: 'West Coast',
        high_performers: 2,
        good_performers: 2,
        standard_performers: 1
      },
      dailyMetrics: [
        {
          metric_date: '2024-12-15',
          daily_engagement: 1200,
          daily_clicks: 45,
          daily_conversions: 3
        },
        {
          metric_date: '2024-12-16',
          daily_engagement: 1350,
          daily_clicks: 52,
          daily_conversions: 4
        },
        {
          metric_date: '2024-12-17',
          daily_engagement: 1180,
          daily_clicks: 38,
          daily_conversions: 2
        },
        {
          metric_date: '2024-12-18',
          daily_engagement: 1420,
          daily_clicks: 61,
          daily_conversions: 5
        }
      ],
      notes: [
        {
          performance_notes: 'Strong engagement across all platforms. Email campaigns showing excellent open rates.',
          best_performing_platform: 'instagram'
        }
      ]
    }

    return NextResponse.json(mockCampaignDetails)

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function getCampaignName(campaignId: string): string {
  const campaignNames: { [key: string]: string } = {
    '1': 'Spring Collection Preview',
    '2': 'Holiday Luxury Campaign',
    '3': 'Summer Elegance 2025',
    '4': 'Winter Wonderland Exclusive',
    '5': 'Artisan Heritage Collection',
    '6': 'Timeless Elegance Launch'
  }
  
  return campaignNames[campaignId] || 'Campaign Details'
}