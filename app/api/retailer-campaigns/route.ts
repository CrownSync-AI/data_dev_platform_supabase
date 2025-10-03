import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Get query parameters
    const retailerId = searchParams.get('retailerId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
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
      { 
        name: 'Spring Collection Preview', 
        status: 'active', 
        type: 'mixed', 
        tier: 'high', 
        trend: 'up',
        image: 'https://cdn.shopify.com/s/files/1/0457/5133/7113/collections/523.jpg?v=1598118573'
      },
      { 
        name: 'Holiday Luxury Campaign', 
        status: 'completed', 
        type: 'social', 
        tier: 'good', 
        trend: 'stable',
        image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=250&fit=crop&auto=format'
      },
      { 
        name: 'Summer Elegance 2025', 
        status: 'draft', 
        type: 'email', 
        tier: 'standard', 
        trend: 'stable',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=250&fit=crop&auto=format'
      },
      { 
        name: 'Winter Wonderland Exclusive', 
        status: 'active', 
        type: 'mixed', 
        tier: 'high', 
        trend: 'up',
        image: 'https://media.rolex.com/image/upload/v1725888690/rolexcom/collection/configurator/config-launcher/2024/config-launcher-watches-day-date-m228235-0055_2403jva_002.jpg'
      },
      { 
        name: 'Artisan Heritage Collection', 
        status: 'paused', 
        type: 'social', 
        tier: 'good', 
        trend: 'down',
        image: 'http://cdn.shopify.com/s/files/1/0397/2638/3257/files/Rolex-watches-for-man-Australia_480x480.jpg?v=1678314745'
      },
      { 
        name: 'Timeless Elegance Launch', 
        status: 'active', 
        type: 'email', 
        tier: 'high', 
        trend: 'up',
        image: 'https://lapatiala.com/wp-content/uploads/2024/12/Why-Is-Rolex-So-Expensive.jpg'
      },
      { 
        name: 'Modern Minimalist Series', 
        status: 'completed', 
        type: 'mixed', 
        tier: 'standard', 
        trend: 'stable',
        image: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=250&fit=crop&auto=format'
      },
      { 
        name: 'Luxury Lifestyle Showcase', 
        status: 'active', 
        type: 'social', 
        tier: 'high', 
        trend: 'up',
        image: 'https://cdn.wristler.eu/blog-image-2x/cef28a378ab4b189be513b6e0d0e8cc7-'
      }
    ]

    // Generate base campaigns first
    const baseCampaigns = campaignTemplates.map((template, index) => {
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
        campaign_image: template.image,
        start_date: (() => {
          // Generate dates within last 90 days
          const today = new Date()
          const daysAgo = Math.floor(Math.random() * 90) // 0-90 days ago
          const startDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000)
          return startDate.toISOString().split('T')[0]
        })(),
        end_date: template.status === 'completed' ? (() => {
          // For completed campaigns, end date is between start date and today
          const today = new Date()
          const daysAgo = Math.floor(Math.random() * 30) // 0-30 days ago
          const endDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000)
          return endDate.toISOString().split('T')[0]
        })() : undefined,
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

    // Process campaigns: split mixed campaigns into separate social and email campaigns
    const processedCampaigns: any[] = []
    
    baseCampaigns.forEach(campaign => {
      if (campaign.campaign_type === 'mixed') {
        // Split mixed campaigns into separate social and email campaigns
        
        // Social campaign card
        const socialCampaign = {
          ...campaign,
          campaign_id: `${campaign.campaign_id}-social`,
          campaign_name: campaign.campaign_name, // Remove (Social) suffix
          campaign_type: 'social',
          // Keep platform performance data for social
          platform_performance: campaign.platform_performance
        }

        // Email campaign card
        const emailCampaign = {
          ...campaign,
          campaign_id: `${campaign.campaign_id}-email`,
          campaign_name: campaign.campaign_name, // Remove (Email) suffix
          campaign_type: 'email',
          // Remove platform performance for email campaigns
          platform_performance: {},
          // Add email-specific metrics
          email_metrics: {
            emails_sent: 1200 + Math.floor(Math.random() * 800),
            emails_opened: Math.floor((1200 + Math.random() * 800) * 0.25),
            emails_clicked: Math.floor((1200 + Math.random() * 800) * 0.03),
            open_rate: 22 + Math.random() * 8, // 22-30%
            click_rate: 2.5 + Math.random() * 2 // 2.5-4.5%
          }
        }

        processedCampaigns.push(socialCampaign, emailCampaign)
      } else if (campaign.campaign_type === 'email') {
        // Add email metrics to email campaigns
        const emailCampaign = {
          ...campaign,
          platform_performance: {}, // No platform data for email
          email_metrics: {
            emails_sent: 1200 + Math.floor(Math.random() * 800),
            emails_opened: Math.floor((1200 + Math.random() * 800) * 0.25),
            emails_clicked: Math.floor((1200 + Math.random() * 800) * 0.03),
            open_rate: 22 + Math.random() * 8,
            click_rate: 2.5 + Math.random() * 2
          }
        }
        processedCampaigns.push(emailCampaign)
      } else {
        // Keep social campaigns as they are
        processedCampaigns.push(campaign)
      }
    })

    // Apply filters to processed campaigns
    let filteredCampaigns = processedCampaigns

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