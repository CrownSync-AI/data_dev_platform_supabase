import { NextRequest, NextResponse } from 'next/server'
import { CampaignAnalyticsService } from '@/lib/services/campaignAnalytics'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters: any = {}
    
    const region = searchParams.get('region')
    if (region && ['East', 'Central', 'West'].includes(region)) {
      filters.region = region as 'East' | 'Central' | 'West'
    }
    
    const performance_tier = searchParams.get('performance_tier')
    if (performance_tier) {
      filters.performance_tier = performance_tier
    }
    
    const limit = searchParams.get('limit')
    if (limit) {
      filters.limit = parseInt(limit)
    }
    
    const offset = searchParams.get('offset')
    if (offset) {
      filters.offset = parseInt(offset)
    }
    
    const sort_by = searchParams.get('sort_by')
    if (sort_by && ['overall_rank', 'click_rate', 'emails_sent'].includes(sort_by)) {
      filters.sort_by = sort_by as 'overall_rank' | 'click_rate' | 'emails_sent'
    }
    
    const sort_order = searchParams.get('sort_order')
    if (sort_order && ['asc', 'desc'].includes(sort_order)) {
      filters.sort_order = sort_order as 'asc' | 'desc'
    }

    // Just add these two lines to existing filters
    const start_date = searchParams.get('start_date')
    const end_date = searchParams.get('end_date')
    
    if (start_date) {
      filters.start_date = start_date
    }
    
    if (end_date) {
      filters.end_date = end_date
    }

    const result = await CampaignAnalyticsService.getCampaignLeaderboard(params.id, filters)
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      leaderboard: result.data,
      total_count: result.count,
      filters_applied: filters,
      campaign_id: params.id
    })
  } catch (error) {
    console.error('Campaign analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 