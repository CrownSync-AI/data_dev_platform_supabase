import { NextRequest, NextResponse } from 'next/server'
import { CRMService, CustomerFilters, PaginationConfig, SortConfig } from '@/lib/services/crmService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse filters
    const filters: CustomerFilters = {
      search: searchParams.get('search') || '',
      status: (searchParams.get('status') as any) || 'all',
      segment: (searchParams.get('segment') as any) || 'all',
      dateRange: {
        from: searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : null,
        to: searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : null
      }
    }

    // Parse pagination
    const pagination: PaginationConfig = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '50')
    }

    // Parse sorting
    const sort: SortConfig = {
      field: (searchParams.get('sortField') as any) || 'createdAt',
      direction: (searchParams.get('sortDirection') as any) || 'desc'
    }

    const result = await CRMService.getCustomers(filters, pagination, sort)
    
    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('CRM customers API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch customers',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const customerData = await request.json()
    const newCustomer = await CRMService.createCustomer(customerData)
    
    return NextResponse.json({
      success: true,
      data: newCustomer
    })
  } catch (error) {
    console.error('CRM create customer API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create customer',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}