import { DummyDataService } from '@/lib/services/dummyDataService'

describe('DummyDataService', () => {
  
  describe('generateCustomers', () => {
    it('should generate the specified number of customers', () => {
      const customers = DummyDataService.generateCustomers(10)
      expect(customers).toHaveLength(10)
    })

    it('should generate customers with valid properties', () => {
      const customers = DummyDataService.generateCustomers(5)
      
      customers.forEach(customer => {
        expect(customer.id).toBeDefined()
        expect(customer.email).toContain('@')
        expect(customer.firstName).toBeDefined()
        expect(customer.lastName).toBeDefined()
        expect(customer.addresses).toHaveLength(1)
        expect(customer.totalOrders).toBeGreaterThan(0)
        expect(customer.totalSpent).toBeGreaterThan(0)
        expect(['new', 'returning', 'vip', 'at_risk', 'churned']).toContain(customer.segment)
      })
    })
  })

  describe('generateOrders', () => {
    it('should generate orders for customers', () => {
      const customers = DummyDataService.generateCustomers(5)
      const orders = DummyDataService.generateOrders(customers, 20)
      
      expect(orders).toHaveLength(20)
      
      orders.forEach(order => {
        expect(order.id).toBeDefined()
        expect(order.customerId).toBeDefined()
        expect(order.orderNumber).toMatch(/^#\d+$/)
        expect(order.lineItems.length).toBeGreaterThan(0)
        expect(order.totalPrice).toBeGreaterThan(0)
        expect(order.currency).toBe('USD')
      })
    })
  })

  describe('generateEmails', () => {
    it('should generate emails and threads', () => {
      const customers = DummyDataService.generateCustomers(10)
      const { emails, threads } = DummyDataService.generateEmails(customers, 100)
      
      expect(emails.length).toBeGreaterThan(0)
      expect(threads.length).toBe(30) // 30 threads as specified in the service
      
      emails.forEach(email => {
        expect(email.id).toBeDefined()
        expect(email.threadId).toBeDefined()
        expect(email.from.email).toContain('@')
        expect(email.to).toHaveLength(1)
        expect(email.subject).toBeDefined()
        expect(email.textContent).toBeDefined()
      })
    })
  })

  describe('generateCRMAnalytics', () => {
    it('should generate valid CRM analytics', () => {
      const customers = DummyDataService.generateCustomers(50)
      const orders = DummyDataService.generateOrders(customers, 200)
      const analytics = DummyDataService.generateCRMAnalytics(customers, orders)
      
      expect(analytics.totalCustomers).toBe(50)
      expect(analytics.averageOrderValue).toBeGreaterThan(0)
      expect(analytics.totalRevenue).toBeGreaterThan(0)
      expect(analytics.customerSegments).toBeDefined()
      expect(analytics.topCustomers).toHaveLength(10)
      expect(analytics.recentOrders).toHaveLength(10)
      expect(analytics.calculatedAt).toBeDefined()
    })
  })
}) 