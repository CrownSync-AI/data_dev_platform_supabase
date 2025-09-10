import { NextRequest, NextResponse } from 'next/server'
import { CampaignAnalyticsService } from '@/lib/services/campaignAnalytics'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Add time filtering support
    const filters: any = {}
    const start_date = searchParams.get('start_date')
    const end_date = searchParams.get('end_date')
    
    if (start_date) {
      filters.start_date = start_date
    }
    
    if (end_date) {
      filters.end_date = end_date
    }

    const result = await CampaignAnalyticsService.getCampaignSummary(params.id, filters)
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ 
      summary: result.data,
      campaign_id: params.id,
      filters_applied: filters
    })
  } catch (error) {
    console.error('Campaign summary API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 