import {
  Customer,
  Order,
  OrderLineItem,
  CustomerBehavior,
  CustomerJourney,
  CRMAnalytics,
  CustomerNote
} from '@/lib/types/crm'
import {
  Email,
  EmailThread,
  EmailContact,
  EmailAnalytics,
  EmailThreadSummary
} from '@/lib/types/email'

// Helper function to generate random dates
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Helper function to generate random ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// Fixed customer data for consistent email-customer matching
const FIXED_CUSTOMERS = [
  { firstName: 'Grace', lastName: 'Taylor', email: 'grace.taylor@company.com' },
  { firstName: 'Henry', lastName: 'Davis', email: 'henry.davis@gmail.com' },
  { firstName: 'Matthew', lastName: 'Robinson', email: 'matthew.robinson@company.com' },
  { firstName: 'David', lastName: 'Lopez', email: 'david.lopez@gmail.com' },
  { firstName: 'Liam', lastName: 'Martin', email: 'liam.martin@company.com' },
  { firstName: 'Isabella', lastName: 'Moore', email: 'isabella.moore@gmail.com' },
  { firstName: 'Charlotte', lastName: 'Martinez', email: 'charlotte.martinez@company.com' },
  { firstName: 'Grace', lastName: 'Perez', email: 'grace.perez@gmail.com' },
  { firstName: 'Emma', lastName: 'Wilson', email: 'emma.wilson@company.com' },
  { firstName: 'Oliver', lastName: 'Anderson', email: 'oliver.anderson@gmail.com' },
  { firstName: 'Sophia', lastName: 'Thomas', email: 'sophia.thomas@company.com' },
  { firstName: 'James', lastName: 'Jackson', email: 'james.jackson@gmail.com' },
  { firstName: 'Amelia', lastName: 'White', email: 'amelia.white@company.com' },
  { firstName: 'Benjamin', lastName: 'Harris', email: 'benjamin.harris@gmail.com' },
  { firstName: 'Mia', lastName: 'Clark', email: 'mia.clark@company.com' },
  { firstName: 'Lucas', lastName: 'Lewis', email: 'lucas.lewis@gmail.com' },
  { firstName: 'Harper', lastName: 'Walker', email: 'harper.walker@company.com' },
  { firstName: 'Evelyn', lastName: 'Hall', email: 'evelyn.hall@gmail.com' },
  { firstName: 'Alexander', lastName: 'Allen', email: 'alexander.allen@company.com' },
  { firstName: 'Emily', lastName: 'Young', email: 'emily.young@gmail.com' },
  { firstName: 'Daniel', lastName: 'King', email: 'daniel.king@company.com' },
  { firstName: 'Sarah', lastName: 'Wright', email: 'sarah.wright@gmail.com' },
  { firstName: 'Michael', lastName: 'Scott', email: 'michael.scott@company.com' },
  { firstName: 'Alice', lastName: 'Green', email: 'alice.green@gmail.com' },
  { firstName: 'William', lastName: 'Adams', email: 'william.adams@company.com' },
  { firstName: 'Chloe', lastName: 'Baker', email: 'chloe.baker@gmail.com' },
  { firstName: 'Joseph', lastName: 'Gonzalez', email: 'joseph.gonzalez@company.com' },
  { firstName: 'Olivia', lastName: 'Nelson', email: 'olivia.nelson@gmail.com' },
  { firstName: 'Noah', lastName: 'Carter', email: 'noah.carter@company.com' },
  { firstName: 'Ava', lastName: 'Mitchell', email: 'ava.mitchell@gmail.com' },
  { firstName: 'Elijah', lastName: 'Perez', email: 'elijah.perez@company.com' },
  { firstName: 'Isabella', lastName: 'Roberts', email: 'isabella.roberts@gmail.com' },
  { firstName: 'Mason', lastName: 'Turner', email: 'mason.turner@company.com' },
  { firstName: 'Sofia', lastName: 'Phillips', email: 'sofia.phillips@gmail.com' },
  { firstName: 'Logan', lastName: 'Campbell', email: 'logan.campbell@company.com' },
  { firstName: 'Emma', lastName: 'Parker', email: 'emma.parker@gmail.com' },
  { firstName: 'Lucas', lastName: 'Evans', email: 'lucas.evans@company.com' },
  { firstName: 'Mia', lastName: 'Edwards', email: 'mia.edwards@gmail.com' },
  { firstName: 'Ethan', lastName: 'Collins', email: 'ethan.collins@company.com' },
  { firstName: 'Charlotte', lastName: 'Stewart', email: 'charlotte.stewart@gmail.com' },
  { firstName: 'Aiden', lastName: 'Sanchez', email: 'aiden.sanchez@company.com' },
  { firstName: 'Amelia', lastName: 'Morris', email: 'amelia.morris@gmail.com' },
  { firstName: 'Jackson', lastName: 'Rogers', email: 'jackson.rogers@company.com' },
  { firstName: 'Harper', lastName: 'Reed', email: 'harper.reed@gmail.com' },
  { firstName: 'Sebastian', lastName: 'Cook', email: 'sebastian.cook@company.com' },
  { firstName: 'Evelyn', lastName: 'Morgan', email: 'evelyn.morgan@gmail.com' },
  { firstName: 'Jack', lastName: 'Bell', email: 'jack.bell@company.com' },
  { firstName: 'Abigail', lastName: 'Murphy', email: 'abigail.murphy@gmail.com' },
  { firstName: 'Owen', lastName: 'Bailey', email: 'owen.bailey@company.com' },
  { firstName: 'Emily', lastName: 'Rivera', email: 'emily.rivera@gmail.com' }
]

// Sample data pools for additional random data
const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Elijah', 'Charlotte', 'Oliver', 'Amelia', 'William',
  'Sophia', 'James', 'Isabella', 'Benjamin', 'Mia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander',
  'Alice', 'Michael', 'Sarah', 'David', 'Emily', 'Daniel', 'Grace', 'Matthew', 'Chloe', 'Joseph'
]

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
]

const companies = [
  'Luxury Boutique', 'Elite Jewelry Co', 'Premium Watches Ltd', 'Designer Collections', 'Fine Accessories',
  'Prestige Retail', 'Exclusive Brands', 'Luxury Living', 'Premier Jewelry', 'High-end Boutique',
  'Sophisticated Style', 'Elegant Finds', 'Luxury Lifestyle', 'Premium Collection', 'Elite Fashion'
]

const cities = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
  'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco',
  'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston', 'Detroit', 'Nashville', 'Portland', 'Las Vegas'
]

const states = [
  'NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'FL', 'OH', 'NC', 'WA', 'CO', 'DC', 'MA', 'MI', 'TN', 'OR', 'NV'
]

const products = [
  {
    id: 'prod_1',
    title: 'Marco Bicego Unico Ring',
    price: 2800,
    vendor: 'Marco Bicego',
    productType: 'Ring',
    imageUrl: '/api/placeholder/100/100'
  },
  {
    id: 'prod_2',
    title: 'Marco Bicego Africa Necklace',
    price: 4200,
    vendor: 'Marco Bicego',
    productType: 'Necklace',
    imageUrl: '/api/placeholder/100/100'
  },
  {
    id: 'prod_3',
    title: 'Marco Bicego Siviglia Bracelet',
    price: 3600,
    vendor: 'Marco Bicego',
    productType: 'Bracelet',
    imageUrl: '/api/placeholder/100/100'
  },
  {
    id: 'prod_4',
    title: 'Marco Bicego Paradise Earrings',
    price: 1800,
    vendor: 'Marco Bicego',
    productType: 'Earrings',
    imageUrl: '/api/placeholder/100/100'
  },
  {
    id: 'prod_5',
    title: 'Marco Bicego Lunaria Watch',
    price: 5200,
    vendor: 'Marco Bicego',
    productType: 'Watch',
    imageUrl: '/api/placeholder/100/100'
  }
]

export class DummyDataService {
  private static sharedCustomers: Customer[] | null = null
  private static sharedOrders: Order[] | null = null

  // Get shared customers (singleton pattern to ensure consistency across CRM and Inbox)
  static getSharedCustomers(): Customer[] {
    if (!this.sharedCustomers) {
      this.sharedCustomers = this.generateCustomers(50)
    }
    return this.sharedCustomers
  }

  // Get shared orders (singleton pattern)
  static getSharedOrders(): Order[] {
    if (!this.sharedOrders) {
      const customers = this.getSharedCustomers()
      this.sharedOrders = this.generateOrders(customers, 200)
    }
    return this.sharedOrders
  }

  // Reset shared data (for testing or refresh)
  static resetSharedData(): void {
    this.sharedCustomers = null
    this.sharedOrders = null
  }

  // Generate customer dummy data
  static generateCustomers(count: number = 50): Customer[] {
    const customers: Customer[] = []
    const segments: ('new' | 'returning' | 'vip' | 'at_risk' | 'churned')[] = ['new', 'returning', 'vip', 'at_risk', 'churned']

    // Use fixed customer data to ensure email-customer matching
    const actualCount = Math.min(count, FIXED_CUSTOMERS.length)

    for (let i = 0; i < actualCount; i++) {
      const fixedCustomer = FIXED_CUSTOMERS[i]
      const createdAt = randomDate(new Date(2023, 0, 1), new Date())
      const totalOrders = Math.floor(Math.random() * 20) + 1
      const totalSpent = Math.floor(Math.random() * 50000) + 500

      const customer: Customer = {
        id: `cust_${generateId()}`,
        email: fixedCustomer.email,
        firstName: fixedCustomer.firstName,
        lastName: fixedCustomer.lastName,
        phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,

        addresses: [{
          id: `addr_${generateId()}`,
          firstName: fixedCustomer.firstName,
          lastName: fixedCustomer.lastName,
          address1: `${Math.floor(Math.random() * 9999) + 1} ${['Main St', 'Oak Ave', 'Park Rd', 'First St', 'Second Ave'][Math.floor(Math.random() * 5)]}`,
          city: cities[Math.floor(Math.random() * cities.length)],
          province: states[Math.floor(Math.random() * states.length)],
          country: 'US',
          zip: `${Math.floor(Math.random() * 90000) + 10000}`,
          isDefault: true
        }],

        status: Math.random() > 0.1 ? 'active' : 'inactive',
        emailMarketingConsent: Math.random() > 0.2,
        smsMarketingConsent: Math.random() > 0.4,
        tags: Math.random() > 0.5 ? ['vip', 'jewelry-lover'] : ['regular'],

        totalOrders,
        totalSpent,
        averageOrderValue: Math.round(totalSpent / totalOrders),
        firstOrderDate: createdAt,

        createdAt,
        updatedAt: randomDate(createdAt, new Date()),

        segment: segments[Math.floor(Math.random() * segments.length)],
        lifetimeValue: totalSpent * (1 + Math.random() * 0.5)
      }

      // Add optional properties conditionally
      if (Math.random() > 0.3) {
        customer.company = companies[Math.floor(Math.random() * companies.length)]
      }

      if (totalOrders > 0) {
        customer.lastOrderDate = randomDate(new Date(2023, 6, 1), new Date())
      }

      if (Math.random() > 0.3) {
        customer.lastActiveAt = randomDate(new Date(2024, 0, 1), new Date())
      }

      customers.push(customer)
    }

    return customers
  }

  // Generate order dummy data
  static generateOrders(customers: Customer[], count: number = 200): Order[] {
    const orders: Order[] = []
    const statuses: ('pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded')[] =
      ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded']
    const financialStatuses = ['pending', 'authorized', 'paid', 'partially_paid', 'refunded', 'voided']
    const fulfillmentStatuses = ['pending', 'partial', 'fulfilled', 'shipped', 'delivered']

    for (let i = 0; i < count; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)]
      const orderDate = randomDate(customer.createdAt, new Date())
      const lineItemsCount = Math.floor(Math.random() * 3) + 1
      const lineItems: OrderLineItem[] = []

      let subtotal = 0
      for (let j = 0; j < lineItemsCount; j++) {
        const product = products[Math.floor(Math.random() * products.length)]
        const quantity = Math.floor(Math.random() * 3) + 1
        const price = product.price
        const totalPrice = price * quantity

        lineItems.push({
          id: `line_${generateId()}`,
          productId: product.id,
          title: product.title,
          sku: `SKU-${product.id}-${j}`,
          quantity,
          price,
          totalDiscount: 0,
          totalPrice,
          vendor: product.vendor,
          productType: product.productType,
          imageUrl: product.imageUrl
        })

        subtotal += totalPrice
      }

      const totalTax = subtotal * 0.08 // 8% tax
      const totalDiscounts = Math.random() > 0.7 ? subtotal * 0.1 : 0 // 10% discount sometimes
      const totalPrice = subtotal + totalTax - totalDiscounts

      const order: Order = {
        id: `order_${generateId()}`,
        customerId: customer.id,
        orderNumber: `#${1000 + i}`,

        subtotal,
        totalTax,
        totalDiscounts,
        totalPrice,
        currency: 'USD',

        status: statuses[Math.floor(Math.random() * statuses.length)],
        financialStatus: financialStatuses[Math.floor(Math.random() * financialStatuses.length)] as any,
        fulfillmentStatus: fulfillmentStatuses[Math.floor(Math.random() * fulfillmentStatuses.length)] as any,

        lineItems,

        createdAt: orderDate,
        updatedAt: randomDate(orderDate, new Date()),

        shippingAddress: customer.addresses[0],
        billingAddress: customer.addresses[0],

        tags: Math.random() > 0.6 ? ['express', 'gift'] : []
      }

      // Add optional properties conditionally
      if (Math.random() > 0.5) {
        order.shippedAt = randomDate(orderDate, new Date())
      }

      if (Math.random() > 0.7) {
        order.deliveredAt = randomDate(orderDate, new Date())
      }

      if (Math.random() > 0.8) {
        order.notes = 'Special handling required'
      }

      orders.push(order)
    }

    return orders
  }

  // Generate email dummy data
  static generateEmails(customers: Customer[], count: number = 100): { emails: Email[], threads: EmailThread[] } {
    const emails: Email[] = []
    const threads: EmailThread[] = []
    const threadIds: string[] = []

    // Create email threads first
    const threadCount = 30
    for (let i = 0; i < threadCount; i++) {
      const threadId = `thread_${generateId()}`
      threadIds.push(threadId)

      const customer = customers[Math.floor(Math.random() * customers.length)]
      const emailsInThread = Math.floor(Math.random() * 4) + 2 // 2-5 emails per thread
      const threadEmails: Email[] = []

      const subjects = [
        'Question about your jewelry collection',
        'Order inquiry - Marco Bicego',
        'Product availability question',
        'Request for custom design',
        'Delivery status update',
        'Return policy question',
        'Product care instructions',
        'Warranty information needed'
      ]

      const subject = subjects[Math.floor(Math.random() * subjects.length)]

      for (let j = 0; j < emailsInThread; j++) {
        const isFromCustomer = j % 2 === 0
        const sentAt = randomDate(new Date(2024, 0, 1), new Date())

        const email: Email = {
          id: `email_${generateId()}`,
          threadId,
          customerId: customer.id,

          from: isFromCustomer ?
            { email: customer.email, name: `${customer.firstName} ${customer.lastName}` } :
            { email: 'support@crownsync.com', name: 'CrowSync Support' },
          to: isFromCustomer ?
            [{ email: 'support@crownsync.com', name: 'CrowSync Support' }] :
            [{ email: customer.email, name: `${customer.firstName} ${customer.lastName}` }],
          subject: j === 0 ? subject : `Re: ${subject}`,

          textContent: this.generateEmailContent(isFromCustomer, j),
          attachments: [],

          status: 'delivered',
          isRead: Math.random() > 0.3,
          isStarred: Math.random() > 0.8,
          isImportant: Math.random() > 0.9,
          priority: 'normal',

          references: threadEmails.map(e => e.id),

          labels: Math.random() > 0.7 ? ['customer-service'] : [],
          tags: Math.random() > 0.8 ? ['urgent'] : [],
          folder: 'inbox',

          sentAt,
          receivedAt: sentAt,
          createdAt: sentAt,
          updatedAt: sentAt
        }

        // Add optional properties conditionally
        if (j > 0) {
          email.inReplyToId = threadEmails[j - 1].id
        }

        if (Math.random() > 0.3) {
          email.readAt = randomDate(sentAt, new Date())
        }

        threadEmails.push(email)
        emails.push(email)
      }

      // Generate AI summary for the thread
      const summary = this.generateEmailThreadSummary(subject, threadEmails, customer)

      // Create thread summary
      const thread: EmailThread = {
        id: threadId,
        customerId: customer.id,
        subject,
        participants: [
          { email: customer.email, name: `${customer.firstName} ${customer.lastName}` },
          { email: 'support@crownsync.com', name: 'CrowSync Support' }
        ],
        emailCount: threadEmails.length,
        hasUnread: threadEmails.some(e => !e.isRead),
        isStarred: threadEmails.some(e => e.isStarred),
        isImportant: threadEmails.some(e => e.isImportant),
        summary,
        lastEmail: threadEmails[threadEmails.length - 1],
        firstEmail: threadEmails[0],
        emails: threadEmails,
        labels: [],
        tags: [],
        lastActivityAt: threadEmails[threadEmails.length - 1].sentAt,
        createdAt: threadEmails[0].sentAt,
        updatedAt: threadEmails[threadEmails.length - 1].sentAt
      }

      threads.push(thread)
    }

    return { emails, threads }
  }

  private static generateEmailContent(isFromCustomer: boolean, emailIndex: number): string {
    const customerMessages = [
      "Hi, I'm interested in learning more about your Marco Bicego collection. Could you send me information about your latest pieces?",
      "Thank you for getting back to me so quickly! I'd love to see the Africa collection in person. Do you have an appointment available this week?",
      "Perfect, I'll be there on Thursday at 2 PM. Looking forward to seeing the pieces in person.",
      "Thank you for the wonderful service yesterday. I absolutely love the necklace! Could you also send me care instructions?"
    ]

    const supportMessages = [
      "Thank you for your interest in Marco Bicego! I'd be happy to help you with information about our collection. Our Africa and Unico collections are particularly popular right now.",
      "Absolutely! I can schedule an appointment for you this Thursday at 2 PM. Our showroom is located at 123 Fifth Avenue. Please bring a valid ID.",
      "Perfect! We have your appointment confirmed for Thursday at 2 PM. I'll have several pieces from the Africa collection ready for you to view.",
      "I'm so glad you love your new necklace! I've attached the care instructions. For any questions about maintenance, feel free to reach out anytime."
    ]

    if (isFromCustomer) {
      return customerMessages[Math.min(emailIndex, customerMessages.length - 1)]
    } else {
      return supportMessages[Math.min(emailIndex, supportMessages.length - 1)]
    }
  }

  // Generate AI-powered email thread summary
  private static generateEmailThreadSummary(subject: string, emails: Email[], customer: Customer): EmailThreadSummary {
    // Create contextual summaries based on email subject and content
    const summaryTemplates = {
      'Question about your jewelry collection': {
        overview: `Customer ${customer.firstName} ${customer.lastName} inquired about Marco Bicego jewelry collection and scheduled an in-person appointment`,
        keyPoints: [
          'Customer expressed interest in Marco Bicego collection',
          'Requested information about latest pieces',
          'Scheduled showroom appointment for Thursday 2 PM',
          'Specifically interested in Africa collection'
        ],
        customerNeeds: [
          'Product information for Marco Bicego jewelry',
          'In-person viewing of Africa collection pieces',
          'Appointment scheduling for showroom visit'
        ],
        actionItems: [
          'Prepare Africa collection pieces for Thursday appointment',
          'Confirm appointment details and location',
          'Ensure customer ID requirement is communicated'
        ],
        sentiment: 'positive' as const
      },
      'Order inquiry - Marco Bicego': {
        overview: `Customer ${customer.firstName} ${customer.lastName} made an order inquiry and completed purchase with follow-up care instructions`,
        keyPoints: [
          'Customer inquired about Marco Bicego order status',
          'Successfully completed purchase of necklace',
          'Requested product care instructions',
          'Expressed satisfaction with service quality'
        ],
        customerNeeds: [
          'Order status information',
          'Product care and maintenance guidance',
          'Post-purchase support'
        ],
        actionItems: [
          'Provide comprehensive care instructions',
          'Follow up on customer satisfaction',
          'Offer additional product recommendations'
        ],
        sentiment: 'positive' as const
      },
      'Product availability question': {
        overview: `Customer ${customer.firstName} ${customer.lastName} inquired about product availability and received detailed product information`,
        keyPoints: [
          'Customer asked about specific product availability',
          'Provided current stock information',
          'Discussed alternative product options',
          'Offered to notify when items become available'
        ],
        customerNeeds: [
          'Real-time product availability information',
          'Alternative product suggestions',
          'Stock notification preferences'
        ],
        actionItems: [
          'Monitor inventory for requested items',
          'Set up stock alerts for customer',
          'Provide regular availability updates'
        ],
        sentiment: 'neutral' as const
      },
      'Request for custom design': {
        overview: `Customer ${customer.firstName} ${customer.lastName} requested custom jewelry design consultation and pricing information`,
        keyPoints: [
          'Customer interested in custom jewelry design',
          'Discussed design requirements and preferences',
          'Provided custom design process overview',
          'Scheduled design consultation appointment'
        ],
        customerNeeds: [
          'Custom jewelry design services',
          'Design consultation and guidance',
          'Pricing information for custom work'
        ],
        actionItems: [
          'Schedule design consultation meeting',
          'Prepare custom design portfolio examples',
          'Provide detailed pricing structure'
        ],
        sentiment: 'positive' as const
      },
      'Delivery status update': {
        overview: `Customer ${customer.firstName} ${customer.lastName} requested delivery status update and received tracking information`,
        keyPoints: [
          'Customer inquired about order delivery status',
          'Provided tracking number and delivery timeline',
          'Confirmed delivery address details',
          'Offered expedited shipping options'
        ],
        customerNeeds: [
          'Real-time delivery tracking information',
          'Accurate delivery timeline estimates',
          'Flexible delivery options'
        ],
        actionItems: [
          'Monitor package delivery progress',
          'Provide proactive delivery updates',
          'Ensure secure delivery confirmation'
        ],
        sentiment: 'neutral' as const
      },
      'Return policy question': {
        overview: `Customer ${customer.firstName} ${customer.lastName} inquired about return policy and received detailed return process information`,
        keyPoints: [
          'Customer asked about return policy details',
          'Explained return timeframe and conditions',
          'Provided return process instructions',
          'Offered exchange alternatives'
        ],
        customerNeeds: [
          'Clear return policy information',
          'Step-by-step return process guidance',
          'Exchange and refund options'
        ],
        actionItems: [
          'Process return request if needed',
          'Provide return shipping label',
          'Follow up on return satisfaction'
        ],
        sentiment: 'neutral' as const
      },
      'Product care instructions': {
        overview: `Customer ${customer.firstName} ${customer.lastName} requested jewelry care instructions and maintenance tips`,
        keyPoints: [
          'Customer requested care instructions for jewelry',
          'Provided detailed maintenance guidelines',
          'Shared cleaning and storage recommendations',
          'Offered professional cleaning services'
        ],
        customerNeeds: [
          'Comprehensive jewelry care instructions',
          'Maintenance and cleaning guidance',
          'Professional service recommendations'
        ],
        actionItems: [
          'Send detailed care instruction document',
          'Schedule follow-up for care questions',
          'Offer professional cleaning appointment'
        ],
        sentiment: 'positive' as const
      },
      'Warranty information needed': {
        overview: `Customer ${customer.firstName} ${customer.lastName} requested warranty information and coverage details`,
        keyPoints: [
          'Customer inquired about warranty coverage',
          'Explained warranty terms and duration',
          'Provided warranty claim process',
          'Discussed extended warranty options'
        ],
        customerNeeds: [
          'Warranty coverage information',
          'Claim process guidance',
          'Extended warranty options'
        ],
        actionItems: [
          'Provide warranty documentation',
          'Register product for warranty coverage',
          'Explain warranty claim procedures'
        ],
        sentiment: 'neutral' as const
      }
    }

    // Get the appropriate template or create a default one
    const template = summaryTemplates[subject as keyof typeof summaryTemplates] || {
      overview: `Customer ${customer.firstName} ${customer.lastName} contacted support regarding ${subject.toLowerCase()}`,
      keyPoints: [
        'Customer initiated contact with support team',
        'Received prompt and professional assistance',
        'Issue was addressed and resolved satisfactorily'
      ],
      customerNeeds: [
        'Professional customer support',
        'Timely response to inquiries',
        'Satisfactory issue resolution'
      ],
      actionItems: [
        'Follow up on customer satisfaction',
        'Monitor for additional support needs',
        'Document interaction for future reference'
      ],
      sentiment: 'neutral' as const
    }

    return {
      ...template,
      generatedAt: new Date()
    }
  }

  // Generate CRM analytics
  static generateCRMAnalytics(customers: Customer[], orders: Order[]): CRMAnalytics {
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const newCustomersThisMonth = customers.filter(c => c.createdAt >= thisMonth).length
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)
    const averageOrderValue = totalRevenue / orders.length

    const segmentCounts = customers.reduce((acc, customer) => {
      acc[customer.segment]++
      return acc
    }, { new: 0, returning: 0, vip: 0, at_risk: 0, churned: 0 })

    const topCustomers = customers
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10)

    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    return {
      totalCustomers: customers.length,
      newCustomersThisMonth,
      customerGrowthRate: (newCustomersThisMonth / customers.length) * 100,

      averageOrderValue: Math.round(averageOrderValue),
      totalRevenue: Math.round(totalRevenue),

      customerSegments: segmentCounts,
      topCustomers,
      recentOrders,

      calculatedAt: now
    }
  }
} 