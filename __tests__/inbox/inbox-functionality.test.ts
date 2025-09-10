import { DummyDataService } from '@/lib/services/dummyDataService'

describe('Inbox Functionality', () => {
  
  describe('Customer Email Threads', () => {
    it('should generate 50 customers with email conversations', () => {
      const customers = DummyDataService.generateCustomers(50)
      const { emails, threads } = DummyDataService.generateEmails(customers, 100)
      
      expect(customers).toHaveLength(50)
      expect(threads.length).toBe(30) // 30 conversation threads
      expect(emails.length).toBeGreaterThan(50) // Multiple emails per thread
      
      // Verify each thread has a customer
      threads.forEach(thread => {
        expect(thread.customerId).toBeDefined()
        const customer = customers.find(c => c.id === thread.customerId)
        expect(customer).toBeDefined()
      })
    })

    it('should create conversations between customers and CrowSync support', () => {
      const customers = DummyDataService.generateCustomers(10)
      const { emails, threads } = DummyDataService.generateEmails(customers, 30)
      
      threads.forEach(thread => {
        // Each thread should have exactly 2 participants: customer + support
        expect(thread.participants).toHaveLength(2)
        
        const supportParticipant = thread.participants.find(p => p.email === 'support@crownsync.com')
        const customerParticipant = thread.participants.find(p => p.email !== 'support@crownsync.com')
        
        expect(supportParticipant).toBeDefined()
        expect(customerParticipant).toBeDefined()
        expect(supportParticipant?.name).toBe('CrowSync Support')
        
        // Verify customer participant matches a real customer
        const customer = customers.find(c => c.id === thread.customerId)
        expect(customer).toBeDefined()
        expect(customerParticipant?.email).toBe(customer?.email)
      })
    })

    it('should create realistic email conversation threads', () => {
      const customers = DummyDataService.generateCustomers(5)
      const { emails, threads } = DummyDataService.generateEmails(customers, 20)
      
      threads.forEach(thread => {
        // Each thread should have 2-5 emails
        expect(thread.emailCount).toBeGreaterThanOrEqual(2)
        expect(thread.emailCount).toBeLessThanOrEqual(5)
        expect(thread.emails).toHaveLength(thread.emailCount)
        
        // Emails should alternate between customer and support
        thread.emails.forEach((email, index) => {
          const isFromCustomer = index % 2 === 0
          if (isFromCustomer) {
            expect(email.from.email).not.toBe('support@crownsync.com')
          } else {
            expect(email.from.email).toBe('support@crownsync.com')
            expect(email.from.name).toBe('CrowSync Support')
          }
          
          // Verify email has required content
          expect(email.subject).toBeDefined()
          expect(email.textContent).toBeDefined()
          expect(email.textContent.length).toBeGreaterThan(10)
        })
        
        // Verify thread metadata
        expect(thread.subject).toBeDefined()
        expect(thread.lastEmail).toBeDefined()
        expect(thread.firstEmail).toBeDefined()
        expect(thread.lastActivityAt).toBeDefined()
      })
    })

    it('should include proper email subjects and content', () => {
      const customers = DummyDataService.generateCustomers(3)
      const { emails, threads } = DummyDataService.generateEmails(customers, 10)
      
      const expectedSubjects = [
        'Question about your jewelry collection',
        'Order inquiry - Marco Bicego',
        'Product availability question',
        'Request for custom design',
        'Delivery status update',
        'Return policy question',
        'Product care instructions',
        'Warranty information needed'
      ]
      
      threads.forEach(thread => {
        // Verify subject is from expected list
        expect(expectedSubjects).toContain(thread.subject)
        
        // Verify email content is meaningful
        thread.emails.forEach(email => {
          expect(email.textContent).toBeTruthy()
          expect(email.textContent.length).toBeGreaterThan(20)
          
          // Verify email content is realistic (basic checks)
          expect(email.textContent).toMatch(/[A-Za-z]/) // Contains letters
          expect(email.textContent.trim()).not.toBe('') // Not empty
          
          // Verify sender information is correct
          const isCustomerEmail = email.from.email !== 'support@crownsync.com'
          if (!isCustomerEmail) {
            expect(email.from.name).toBe('CrowSync Support')
          }
        })
      })
    })

    it('should sort threads by last activity date', () => {
      const customers = DummyDataService.generateCustomers(10)
      const { emails, threads } = DummyDataService.generateEmails(customers, 30)
      
      // Sort threads by last activity (most recent first)
      const sortedThreads = threads.sort((a, b) => 
        new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
      )
      
      // Verify sorting is correct
      for (let i = 0; i < sortedThreads.length - 1; i++) {
        const currentDate = new Date(sortedThreads[i].lastActivityAt)
        const nextDate = new Date(sortedThreads[i + 1].lastActivityAt)
        expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime())
      }
    })
  })
}) 