import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  try {
    const { campaignId } = params

    // Determine campaign type from ID (social/email split campaigns have suffixes)
    const campaignType = getCampaignType(campaignId)
    const baseCampaignId = campaignId.replace(/-social|-email$/, '')
    
    // Base campaign data
    const baseCampaign = {
      campaign_id: campaignId,
      campaign_name: getCampaignName(campaignId),
      campaign_status: 'active',
      campaign_type: campaignType,
      start_date: '2024-12-01',
      end_date: '2025-01-01',
      duration_days: 32,
      participating_retailers_count: 5,
      performance_tier: 'high',
      trend_direction: 'up'
    }

    // Type-specific campaign data
    const campaign = campaignType === 'social' 
      ? {
          ...baseCampaign,
          avg_click_rate: 3.5, // Higher for social
          total_reach: 199500, // 70% of mixed campaign
          total_engagement: 17150, // 70% of mixed campaign
          total_emails_sent: 0 // No emails for social
        }
      : {
          ...baseCampaign,
          avg_click_rate: 2.3, // Lower for email
          total_reach: 85500, // 30% of mixed campaign
          total_engagement: 7350, // 30% of mixed campaign
          total_emails_sent: 1500 // Keep email count
        }

    const mockCampaignDetails = {
      campaign,
      // Type-specific conversion funnel (only for email campaigns)
      conversionFunnel: campaignType === 'email' ? {
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
      } : null,

      // Type-specific platform performance (only for social campaigns)
      platformPerformance: campaignType === 'social' ? [
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
        },
        {
          platform: 'twitter',
          impressions: 195000,
          reach: 142000,
          engagement: 3850,
          clicks: 285,
          engagement_rate: 2.1
        }
      ] : [],
      retailerSummary: {
        total_participating_retailers: 5,
        avg_retailer_performance: 4.2,
        top_performing_region: 'West Coast',
        high_performers: 2,
        good_performers: 2,
        standard_performers: 1
      },
      // Type-specific daily metrics
      dailyMetrics: generateDailyMetrics(campaignType),
      
      // Type-specific notes
      notes: [
        {
          performance_notes: campaignType === 'social' 
            ? 'Strong engagement across all social platforms. Instagram showing highest engagement rates.'
            : 'Excellent email performance with above-average open and click rates. Strong conversion funnel.',
          best_performing_platform: campaignType === 'social' ? 'instagram' : 'email'
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

function getCampaignType(campaignId: string): 'social' | 'email' {
  if (campaignId.endsWith('-social')) return 'social'
  if (campaignId.endsWith('-email')) return 'email'
  
  // Default type for non-split campaigns based on ID
  const emailCampaigns = ['2', '6'] // Holiday Luxury Campaign, Timeless Elegance Launch
  const baseCampaignId = campaignId.replace(/-social|-email$/, '')
  return emailCampaigns.includes(baseCampaignId) ? 'email' : 'social'
}

function getCampaignName(campaignId: string): string {
  const baseCampaignId = campaignId.replace(/-social|-email$/, '')
  const campaignNames: { [key: string]: string } = {
    '1': 'Spring Collection Preview',
    '2': 'Holiday Luxury Campaign',
    '3': 'Winter Elegance Collection',
    '4': 'Winter Wonderland Exclusive',
    '5': 'Artisan Heritage Collection',
    '6': 'Timeless Elegance Launch',
    '7': 'Modern Minimalist Series',
    '8': 'Luxury Lifestyle Showcase'
  }
  
  const baseName = campaignNames[baseCampaignId] || 'Campaign Details'
  
  // Remove suffixes since UI already shows campaign type
  return baseName
}

function generateDailyMetrics(campaignType: 'social' | 'email') {
  const metrics = []
  
  // More realistic base values with better differentiation
  const baseEngagement = campaignType === 'social' ? 950 : 420
  const baseClicks = campaignType === 'social' ? 28 : 85
  const baseConversions = campaignType === 'social' ? 4 : 12
  
  for (let i = 14; i >= 1; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Create different variation patterns for each metric to avoid overlap
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isWeekStart = dayOfWeek === 1 || dayOfWeek === 2
    
    // Engagement: Higher on weekdays, varies more dramatically
    let engagementMultiplier = 1.0
    if (isWeekend) engagementMultiplier = 0.6 + Math.random() * 0.3 // 60-90% on weekends
    else if (isWeekStart) engagementMultiplier = 1.1 + Math.random() * 0.4 // 110-150% on week start
    else engagementMultiplier = 0.8 + Math.random() * 0.5 // 80-130% mid-week
    
    // Clicks: More stable pattern, different from engagement
    let clicksMultiplier = 1.0
    if (campaignType === 'social') {
      // Social clicks: Lower on weekends, steady during week
      clicksMultiplier = isWeekend ? 0.4 + Math.random() * 0.3 : 0.7 + Math.random() * 0.6
    } else {
      // Email clicks: Higher on Tuesday/Wednesday, lower on Friday
      if (dayOfWeek === 2 || dayOfWeek === 3) clicksMultiplier = 1.2 + Math.random() * 0.4
      else if (dayOfWeek === 5) clicksMultiplier = 0.5 + Math.random() * 0.3
      else clicksMultiplier = 0.8 + Math.random() * 0.4
    }
    
    // Conversions: Follow clicks but with more volatility and delay effect
    let conversionsMultiplier = clicksMultiplier * (0.6 + Math.random() * 0.8)
    
    // Add some trend over time (slight improvement over 14 days)
    const trendFactor = 1 + (14 - i) * 0.01 // 1% improvement per day
    
    metrics.push({
      metric_date: date.toISOString().split('T')[0],
      daily_engagement: Math.round(baseEngagement * engagementMultiplier * trendFactor),
      daily_clicks: Math.round(baseClicks * clicksMultiplier * trendFactor),
      daily_conversions: Math.round(baseConversions * conversionsMultiplier * trendFactor)
    })
  }
  
  return metrics
}