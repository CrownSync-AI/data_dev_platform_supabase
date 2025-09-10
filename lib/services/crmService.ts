import { DummyDataService } from './dummyDataService'
import { Customer, Order, CRMAnalytics } from '@/lib/types/crm'

export interface CustomerFilters {
  search: string
  status: 'all' | 'active' | 'inactive'
  segment: 'all' | 'new' | 'returning' | 'vip' | 'at_risk' | 'churned'
  dateRange: {
    from: Date | null
    to: Date | null
  }
}

export interface PaginationConfig {
  page: number
  limit: number
}

export interface SortConfig {
  field: keyof Customer
  direction: 'asc' | 'desc'
}

export interface CustomerListResponse {
  customers: Customer[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export class CRMService {
  private static customers: Customer[] | null = null
  private static orders: Order[] | null = null

  /**
   * Initialize dummy data if not already loaded
   */
  private static initializeData() {
    if (!this.customers) {
      this.customers = DummyDataService.getSharedCustomers()
      this.orders = DummyDataService.getSharedOrders()
    }
  }

  /**
   * Get customers with filtering, sorting, and pagination
   */
  static async getCustomers(
    filters: CustomerFilters = {
      search: '',
      status: 'all',
      segment: 'all',
      dateRange: { from: null, to: null }
    },
    pagination: PaginationConfig = { page: 1, limit: 50 },
    sort: SortConfig = { field: 'createdAt', direction: 'desc' }
  ): Promise<CustomerListResponse> {
    this.initializeData()
    
    let filteredCustomers = [...this.customers!]

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.firstName.toLowerCase().includes(searchTerm) ||
        customer.lastName.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm)
      )
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.status === filters.status
      )
    }

    // Apply segment filter
    if (filters.segment !== 'all') {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.segment === filters.segment
      )
    }

    // Apply date range filter
    if (filters.dateRange.from) {
      filteredCustomers = filteredCustomers.filter(customer =>
        new Date(customer.createdAt) >= filters.dateRange.from!
      )
    }
    if (filters.dateRange.to) {
      filteredCustomers = filteredCustomers.filter(customer =>
        new Date(customer.createdAt) <= filters.dateRange.to!
      )
    }

    // Apply sorting
    filteredCustomers.sort((a, b) => {
      const aValue = a[sort.field]
      const bValue = b[sort.field]
      
      let comparison = 0
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue)
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime()
      }
      
      return sort.direction === 'asc' ? comparison : -comparison
    })

    // Apply pagination
    const totalCount = filteredCustomers.length
    const totalPages = Math.ceil(totalCount / pagination.limit)
    const startIndex = (pagination.page - 1) * pagination.limit
    const endIndex = startIndex + pagination.limit
    const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex)

    return {
      customers: paginatedCustomers,
      totalCount,
      totalPages,
      currentPage: pagination.page
    }
  }

  /**
   * Get customer analytics for metrics cards
   */
  static async getCustomerAnalytics(): Promise<CRMAnalytics> {
    this.initializeData()
    
    const customers = this.customers!
    const orders = this.orders!
    
    // Calculate basic metrics
    const totalCustomers = customers.length
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    
    const newCustomersThisMonth = customers.filter(customer =>
      new Date(customer.createdAt) >= oneMonthAgo
    ).length
    
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())
    const newCustomersLastMonth = customers.filter(customer => {
      const createdAt = new Date(customer.createdAt)
      return createdAt >= lastMonthStart && createdAt < oneMonthAgo
    }).length
    
    const customerGrowthRate = newCustomersLastMonth > 0 
      ? ((newCustomersThisMonth - newCustomersLastMonth) / newCustomersLastMonth) * 100
      : newCustomersThisMonth > 0 ? 100 : 0

    // Calculate order metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0

    // Calculate customer segments
    const customerSegments = {
      new: customers.filter(c => c.segment === 'new').length,
      returning: customers.filter(c => c.segment === 'returning').length,
      vip: customers.filter(c => c.segment === 'vip').length,
      at_risk: customers.filter(c => c.segment === 'at_risk').length,
      churned: customers.filter(c => c.segment === 'churned').length
    }

    // Get top customers by total spent
    const topCustomers = [...customers]
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)

    // Get recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    return {
      totalCustomers,
      newCustomersThisMonth,
      customerGrowthRate,
      averageOrderValue,
      totalRevenue,
      customerSegments,
      topCustomers,
      recentOrders,
      calculatedAt: new Date()
    }
  }

  /**
   * Get a single customer by ID
   */
  static async getCustomerById(id: string): Promise<Customer | null> {
    this.initializeData()
    return this.customers!.find(customer => customer.id === id) || null
  }

  /**
   * Export customer data as CSV
   */
  static async exportCustomerData(filters: CustomerFilters): Promise<string> {
    const { customers } = await this.getCustomers(filters, { page: 1, limit: 1000 })
    
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Status',
      'Segment',
      'Total Orders',
      'Total Spent',
      'Average Order Value',
      'Lifetime Value',
      'Last Order Date',
      'Created Date'
    ]

    const csvRows = [
      headers.join(','),
      ...customers.map(customer => [
        `"${customer.firstName} ${customer.lastName}"`,
        customer.email,
        customer.phone || '',
        customer.status,
        customer.segment,
        customer.totalOrders,
        customer.totalSpent.toFixed(2),
        customer.averageOrderValue.toFixed(2),
        customer.lifetimeValue.toFixed(2),
        customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : '',
        new Date(customer.createdAt).toLocaleDateString()
      ].join(','))
    ]

    return csvRows.join('\n')
  }

  /**
   * Create a new customer
   */
  static async createCustomer(customerData: Partial<Customer>): Promise<Customer> {
    this.initializeData()
    
    const newCustomer: Customer = {
      id: `cust_${Math.random().toString(36).substr(2, 9)}`,
      email: customerData.email || '',
      firstName: customerData.firstName || '',
      lastName: customerData.lastName || '',
      ...(customerData.phone && { phone: customerData.phone }),
      addresses: customerData.addresses || [],
      status: customerData.status || 'active',
      emailMarketingConsent: customerData.emailMarketingConsent || false,
      smsMarketingConsent: customerData.smsMarketingConsent || false,
      tags: customerData.tags || [],
      totalOrders: 0,
      totalSpent: 0,
      averageOrderValue: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      segment: 'new',
      lifetimeValue: 0
    }

    this.customers!.push(newCustomer)
    return newCustomer
  }

  /**
   * Update an existing customer
   */
  static async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
    this.initializeData()
    
    const customerIndex = this.customers!.findIndex(customer => customer.id === id)
    if (customerIndex === -1) return null

    this.customers![customerIndex] = {
      ...this.customers![customerIndex],
      ...updates,
      updatedAt: new Date()
    }

    return this.customers![customerIndex]
  }
}