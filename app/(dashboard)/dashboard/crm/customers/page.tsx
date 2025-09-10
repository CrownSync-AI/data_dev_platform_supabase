'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Customer, CRMAnalytics } from '@/lib/types/crm'
import { CustomerFilters, PaginationConfig, SortConfig, CustomerListResponse } from '@/lib/services/crmService'
import CustomerMetricsCards from '@/components/crm/CustomerMetricsCards'
import CustomerFiltersBar from '@/components/crm/CustomerFiltersBar'
import CustomerDataTable from '@/components/crm/CustomerDataTable'
import CustomerTablePagination from '@/components/crm/CustomerTablePagination'
import { AlertCircle, Loader2 } from 'lucide-react'

export default function CRMCustomersPage() {
  const router = useRouter()
  
  // State management
  const [customers, setCustomers] = useState<Customer[]>([])
  const [analytics, setAnalytics] = useState<CRMAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filter and pagination state
  const [filters, setFilters] = useState<CustomerFilters>({
    search: '',
    status: 'all',
    segment: 'all',
    dateRange: { from: null, to: null }
  })
  
  const [pagination, setPagination] = useState<PaginationConfig>({
    page: 1,
    limit: 50
  })
  
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'createdAt',
    direction: 'desc'
  })
  
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Fetch customers data
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        search: filters.search,
        status: filters.status,
        segment: filters.segment,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        sortField: sortConfig.field,
        sortDirection: sortConfig.direction
      })
      
      if (filters.dateRange.from) {
        params.append('dateFrom', filters.dateRange.from.toISOString())
      }
      if (filters.dateRange.to) {
        params.append('dateTo', filters.dateRange.to.toISOString())
      }
      
      const response = await fetch(`/api/crm/customers?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch customers')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch customers')
      }
      
      const data: CustomerListResponse = result.data
      setCustomers(data.customers)
      setTotalCount(data.totalCount)
      setTotalPages(data.totalPages)
      
    } catch (error) {
      console.error('Error fetching customers:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      toast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }, [filters, pagination, sortConfig])

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true)
      
      const response = await fetch('/api/crm/analytics')
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch analytics')
      }
      
      setAnalytics(result.data)
      
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load analytics')
    } finally {
      setAnalyticsLoading(false)
    }
  }, [])

  // Effects
  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Event handlers
  const handleFiltersChange = (newFilters: CustomerFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page when filters change
  }

  const handleSort = (field: keyof Customer) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page when sorting changes
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handleItemsPerPageChange = (limit: number) => {
    setPagination({ page: 1, limit })
  }

  const handleCustomerClick = (customerId: string) => {
    router.push(`/dashboard/crm/customers/${customerId}`)
  }

  const handleSendEmail = (customer: Customer) => {
    router.push(`/dashboard/inbox/compose?to=${encodeURIComponent(customer.email)}&name=${encodeURIComponent(`${customer.firstName} ${customer.lastName}`)}`)
  }

  const handleAddNote = (customerId: string) => {
    // TODO: Implement add note functionality
    toast.info('Add note functionality coming soon')
  }

  const handleExportData = async () => {
    try {
      toast.info('Preparing export...')
      
      const response = await fetch('/api/crm/customers/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filters })
      })
      
      if (!response.ok) {
        throw new Error('Failed to export data')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Customer data exported successfully')
      
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Failed to export customer data')
    }
  }

  const handleAddCustomer = () => {
    // TODO: Implement add customer functionality
    toast.info('Add customer functionality coming soon')
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Customers</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => {
                setError(null)
                fetchCustomers()
                fetchAnalytics()
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">
            Manage and view all customer information
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      </div>

      {/* Customer Metrics Cards */}
      <CustomerMetricsCards 
        analytics={analytics} 
        loading={analyticsLoading} 
      />

      {/* Filters Bar */}
      <CustomerFiltersBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onExportData={handleExportData}
        onAddCustomer={handleAddCustomer}
        totalCount={totalCount}
        loading={loading}
      />

      {/* Customer Data Table */}
      <CustomerDataTable
        customers={customers}
        loading={loading}
        sortConfig={sortConfig}
        onSort={handleSort}
        onCustomerClick={handleCustomerClick}
        onSendEmail={handleSendEmail}
        onAddNote={handleAddNote}
      />

      {/* Pagination */}
      {!loading && customers.length > 0 && (
        <CustomerTablePagination
          currentPage={pagination.page}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          loading={loading}
        />
      )}
    </div>
  )
}