import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the Inbox page component which contains the ReplyEditor
import InboxPage from '@/app/(dashboard)/dashboard/inbox/page'

// Mock fetch for API calls
global.fetch = jest.fn()

describe('Reply Editor Functionality', () => {
  const mockInboxData = {
    threads: [
      {
        id: 'thread_1',
        customerId: 'cust_1',
        subject: 'Test Email Subject',
        participants: [
          { email: 'customer@example.com', name: 'John Doe' },
          { email: 'support@crownsync.com', name: 'CrowSync Support' }
        ],
        emailCount: 2,
        hasUnread: false,
        isStarred: false,
        isImportant: false,
        lastEmail: {
          id: 'email_1',
          from: { email: 'customer@example.com', name: 'John Doe' },
          textContent: 'Hello, I need help with my order.',
          sentAt: new Date().toISOString()
        },
        firstEmail: {
          id: 'email_1',
          from: { email: 'customer@example.com', name: 'John Doe' },
          textContent: 'Hello, I need help with my order.',
          sentAt: new Date().toISOString()
        },
        emails: [
          {
            id: 'email_1',
            threadId: 'thread_1',
            customerId: 'cust_1',
            from: { email: 'customer@example.com', name: 'John Doe' },
            to: [{ email: 'support@crownsync.com', name: 'CrowSync Support' }],
            subject: 'Test Email Subject',
            textContent: 'Hello, I need help with my order.',
            attachments: [],
            status: 'delivered',
            isRead: true,
            isStarred: false,
            isImportant: false,
            priority: 'normal',
            references: [],
            labels: [],
            tags: [],
            folder: 'inbox',
            sentAt: new Date().toISOString(),
            receivedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        labels: [],
        tags: [],
        lastActivityAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ],
    emails: [],
    customers: [
      {
        id: 'cust_1',
        email: 'customer@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+1234567890',
        addresses: [],
        status: 'active',
        emailMarketingConsent: true,
        smsMarketingConsent: false,
        tags: [],
        totalOrders: 5,
        totalSpent: 1500,
        averageOrderValue: 300,
        firstOrderDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        segment: 'returning',
        lifetimeValue: 2000
      }
    ]
  }

  beforeEach(() => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockInboxData
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should show Reply button when email thread is displayed', async () => {
    render(<InboxPage />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Email Subject')).toBeInTheDocument()
    })

    // Check if Reply button is present
    expect(screen.getByText('Reply')).toBeInTheDocument()
  })

  it('should open reply editor when Reply button is clicked', async () => {
    render(<InboxPage />)

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Test Email Subject')).toBeInTheDocument()
    })

    // Click Reply button
    const replyButton = screen.getByText('Reply')
    fireEvent.click(replyButton)

    // Check if reply editor is shown
    await waitFor(() => {
      expect(screen.getByText('Reply to:')).toBeInTheDocument()
      expect(screen.getByText('John Doe (customer@example.com)')).toBeInTheDocument()
    })
  })

  it('should show Help me write button in reply editor', async () => {
    render(<InboxPage />)

    // Wait for data to load and click Reply
    await waitFor(() => {
      expect(screen.getByText('Test Email Subject')).toBeInTheDocument()
    })

    const replyButton = screen.getByText('Reply')
    fireEvent.click(replyButton)

    // Check if Help me write button is present
    await waitFor(() => {
      expect(screen.getByText('Help me write')).toBeInTheDocument()
    })
  })

  it('should show formatting toolbar in reply editor', async () => {
    render(<InboxPage />)

    // Wait for data to load and click Reply
    await waitFor(() => {
      expect(screen.getByText('Test Email Subject')).toBeInTheDocument()
    })

    const replyButton = screen.getByText('Reply')
    fireEvent.click(replyButton)

    // Check if formatting toolbar is present
    await waitFor(() => {
      const toolbar = screen.getByRole('toolbar', { hidden: true }) || 
                    document.querySelector('.bg-muted\\/50')
      expect(toolbar).toBeInTheDocument()
    })
  })

  it('should enable Send button when content is entered', async () => {
    render(<InboxPage />)

    // Wait for data to load and click Reply
    await waitFor(() => {
      expect(screen.getByText('Test Email Subject')).toBeInTheDocument()
    })

    const replyButton = screen.getByText('Reply')
    fireEvent.click(replyButton)

    // Initially Send button should be disabled
    await waitFor(() => {
      const sendButton = screen.getByText('Send')
      expect(sendButton).toBeDisabled()
    })

    // Enter some text
    const textarea = screen.getByPlaceholderText('Type your message...')
    fireEvent.change(textarea, { target: { value: 'This is my reply' } })

    // Send button should now be enabled
    await waitFor(() => {
      const sendButton = screen.getByText('Send')
      expect(sendButton).not.toBeDisabled()
    })
  })

  it('should close reply editor when Cancel is clicked', async () => {
    render(<InboxPage />)

    // Wait for data to load and click Reply
    await waitFor(() => {
      expect(screen.getByText('Test Email Subject')).toBeInTheDocument()
    })

    const replyButton = screen.getByText('Reply')
    fireEvent.click(replyButton)

    // Verify reply editor is open
    await waitFor(() => {
      expect(screen.getByText('Reply to:')).toBeInTheDocument()
    })

    // Click Cancel
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    // Reply editor should be closed, Reply button should be visible again
    await waitFor(() => {
      expect(screen.queryByText('Reply to:')).not.toBeInTheDocument()
      expect(screen.getByText('Reply')).toBeInTheDocument()
    })
  })

  it('should add suggested text when Help me write is clicked', async () => {
    render(<InboxPage />)

    // Wait for data to load and click Reply
    await waitFor(() => {
      expect(screen.getByText('Test Email Subject')).toBeInTheDocument()
    })

    const replyButton = screen.getByText('Reply')
    fireEvent.click(replyButton)

    await waitFor(() => {
      expect(screen.getByText('Help me write')).toBeInTheDocument()
    })

    // Click Help me write
    const helpButton = screen.getByText('Help me write')
    fireEvent.click(helpButton)

    // Check if text was added to textarea
    await waitFor(() => {
      const textarea = screen.getByPlaceholderText('Type your message...') as HTMLTextAreaElement
      expect(textarea.value).not.toBe('')
      expect(textarea.value.length).toBeGreaterThan(10)
    })
  })
}) 