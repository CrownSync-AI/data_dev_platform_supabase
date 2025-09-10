import { NextRequest, NextResponse } from 'next/server'
import { CRMService } from '@/lib/services/crmService'

export async function GET(_request: NextRequest) {
  try {
    const analytics = await CRMService.getCustomerAnalytics()
    
    return NextResponse.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    console.error('CRM analytics API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}