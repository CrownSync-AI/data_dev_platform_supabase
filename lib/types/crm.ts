// CRM Customer Management Types (Based on Shopify CRM)

export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  company?: string
  
  // Address Information
  addresses: CustomerAddress[]
  defaultAddress?: CustomerAddress
  
  // Customer Status & Behavior
  status: 'active' | 'inactive' | 'pending' | 'declined'
  emailMarketingConsent: boolean
  smsMarketingConsent: boolean
  tags: string[]
  
  // Purchase Summary
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate?: Date
  firstOrderDate?: Date
  
  // Customer Lifecycle
  createdAt: Date
  updatedAt: Date
  lastActiveAt?: Date
  
  // Customer Segments
  segment: 'new' | 'returning' | 'vip' | 'at_risk' | 'churned'
  lifetimeValue: number
}

export interface CustomerAddress {
  id: string
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province: string
  country: string
  zip: string
  phone?: string
  isDefault: boolean
}

export interface Order {
  id: string
  customerId: string
  orderNumber: string
  
  // Order Details
  subtotal: number
  totalTax: number
  totalDiscounts: number
  totalPrice: number
  currency: string
  
  // Order Status
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  financialStatus: 'pending' | 'authorized' | 'paid' | 'partially_paid' | 'refunded' | 'voided'
  fulfillmentStatus: 'pending' | 'partial' | 'fulfilled' | 'shipped' | 'delivered'
  
  // Order Items
  lineItems: OrderLineItem[]
  
  // Dates
  createdAt: Date
  updatedAt: Date
  shippedAt?: Date
  deliveredAt?: Date
  
  // Shipping & Billing
  shippingAddress: CustomerAddress
  billingAddress: CustomerAddress
  
  // Notes
  notes?: string
  tags: string[]
}

export interface OrderLineItem {
  id: string
  productId: string
  variantId?: string
  title: string
  variantTitle?: string
  sku?: string
  quantity: number
  price: number
  totalDiscount: number
  totalPrice: number
  
  // Product Details
  vendor?: string
  productType?: string
  weight?: number
  imageUrl?: string
}

export interface Product {
  id: string
  title: string
  description: string
  vendor: string
  productType: string
  status: 'active' | 'archived' | 'draft'
  
  // Pricing
  price: number
  compareAtPrice?: number
  costPerItem?: number
  
  // Inventory
  sku?: string
  barcode?: string
  inventoryQuantity: number
  inventoryPolicy: 'deny' | 'continue'
  
  // SEO & Organization
  handle: string
  tags: string[]
  
  // Media
  images: ProductImage[]
  
  // Dates
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  src: string
  alt?: string
  position: number
}

// Customer Behavior Tracking (Based on Shopify Analytics)
export interface CustomerBehavior {
  id: string
  customerId: string
  sessionId: string
  
  // Behavior Type
  type: 'page_view' | 'product_view' | 'add_to_cart' | 'remove_from_cart' | 
        'checkout_started' | 'checkout_completed' | 'email_opened' | 'email_clicked' |
        'search' | 'wishlist_add' | 'account_created' | 'login' | 'logout'
  
  // Behavior Data
  productId?: string
  productTitle?: string
  value?: number // For cart value, order value, etc.
  quantity?: number
  searchQuery?: string
  pageUrl?: string
  referrer?: string
  
  // Context
  deviceType: 'desktop' | 'mobile' | 'tablet'
  browser?: string
  location?: string
  
  // Timestamp
  createdAt: Date
}

// Customer Journey Analytics
export interface CustomerJourney {
  customerId: string
  totalSessions: number
  totalPageViews: number
  totalTimeOnSite: number // in seconds
  
  // Conversion Funnel
  cartAbandonmentRate: number
  checkoutAbandonmentRate: number
  conversionRate: number
  
  // Engagement
  emailEngagementRate: number
  averageSessionDuration: number
  pagesPerSession: number
  
  // Purchase Behavior
  daysSinceLastOrder: number
  purchaseFrequency: number // orders per month
  seasonalTrends: string[]
  
  // Calculated at
  calculatedAt: Date
}

export interface CustomerNote {
  id: string
  customerId: string
  authorId: string
  authorName: string
  content: string
  isPrivate: boolean
  createdAt: Date
  updatedAt: Date
}

// CRM Dashboard Analytics
export interface CRMAnalytics {
  totalCustomers: number
  newCustomersThisMonth: number
  customerGrowthRate: number
  
  averageOrderValue: number
  totalRevenue: number
  
  customerSegments: {
    new: number
    returning: number
    vip: number
    at_risk: number
    churned: number
  }
  
  topCustomers: Customer[]
  recentOrders: Order[]
  
  calculatedAt: Date
} 