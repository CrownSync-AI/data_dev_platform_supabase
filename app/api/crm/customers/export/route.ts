import { NextRequest, NextResponse } from 'next/server'
import { CRMService, CustomerFilters } from '@/lib/services/crmService'

export async function POST(request: NextRequest) {
  try {
    const { filters } = await request.json()
    
    const csvData = await CRMService.exportCustomerData(filters as CustomerFilters)
    
    return new NextResponse(csvData, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="customers.csv"'
      }
    })
  } catch (error) {
    console.error('CRM export API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to export customers',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}