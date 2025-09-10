import { NextResponse } from 'next/server'
import { CRMService } from '@/lib/services/crmService'

export async function GET() {
  try {
    const analytics = await CRMService.getCustomerAnalytics()

    return NextResponse.json({
      success: true,
      data: analytics
    })
  } catch (error) {
    console.error('Error fetching customer analytics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer analytics' },
      { status: 500 }
    )
  }
}