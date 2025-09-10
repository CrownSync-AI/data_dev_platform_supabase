// Email & Unify Inbox Types

export interface Email {
  id: string
  threadId: string
  customerId?: string // Link to CRM customer
  
  // Email Headers
  from: EmailContact
  to: EmailContact[]
  cc?: EmailContact[]
  bcc?: EmailContact[]
  subject: string
  
  // Content
  textContent: string
  htmlContent?: string
  attachments: EmailAttachment[]
  
  // Status & Metadata
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'replied' | 'forwarded' | 'deleted'
  isRead: boolean
  isStarred: boolean
  isImportant: boolean
  priority: 'low' | 'normal' | 'high'
  
  // Threading
  inReplyToId?: string
  references: string[] // Email IDs this email references
  
  // Labels & Organization
  labels: string[]
  tags: string[]
  folder: 'inbox' | 'sent' | 'drafts' | 'archive' | 'trash' | 'spam'
  
  // Timestamps
  sentAt: Date
  receivedAt: Date
  readAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface EmailContact {
  email: string
  name?: string
  avatar?: string
}

export interface EmailAttachment {
  id: string
  filename: string
  size: number // in bytes
  mimeType: string
  url: string
  isInline: boolean
}

export interface EmailThread {
  id: string
  customerId?: string
  
  // Thread Metadata
  subject: string
  participants: EmailContact[]
  emailCount: number
  
  // Status
  hasUnread: boolean
  isStarred: boolean
  isImportant: boolean
  
  // AI-Generated Summary
  summary?: EmailThreadSummary
  
  // Content Summary
  lastEmail: Email
  firstEmail: Email
  emails: Email[] // All emails in thread, sorted by date
  
  // Labels & Organization
  labels: string[]
  tags: string[]
  
  // Timestamps
  lastActivityAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface EmailThreadSummary {
  // Main conversation summary
  overview: string
  
  // Key points in bullet format
  keyPoints: string[]
  
  // Customer needs/requests
  customerNeeds: string[]
  
  // Action items or next steps
  actionItems: string[]
  
  // Sentiment analysis
  sentiment: 'positive' | 'neutral' | 'negative' | 'urgent'
  
  // Generated timestamp
  generatedAt: Date
}

// Email Compose & Draft
export interface EmailDraft {
  id: string
  threadId?: string // If replying to a thread
  inReplyToId?: string // If replying to specific email
  
  // Recipients
  to: EmailContact[]
  cc: EmailContact[]
  bcc: EmailContact[]
  
  // Content
  subject: string
  textContent: string
  htmlContent?: string
  attachments: EmailAttachment[]
  
  // Draft Status
  isDraft: boolean
  autoSavedAt?: Date
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

// Email Templates
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  isHtml: boolean
  
  // Template Variables
  variables: string[] // e.g., ['customerName', 'orderNumber']
  
  // Usage
  category: 'customer_service' | 'marketing' | 'order_confirmation' | 'follow_up' | 'other'
  usageCount: number
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

// Email Filters & Rules
export interface EmailFilter {
  id: string
  name: string
  isActive: boolean
  
  // Conditions
  conditions: EmailFilterCondition[]
  
  // Actions
  actions: EmailFilterAction[]
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
}

export interface EmailFilterCondition {
  field: 'from' | 'to' | 'subject' | 'content' | 'attachment'
  operator: 'contains' | 'equals' | 'starts_with' | 'ends_with' | 'regex'
  value: string
}

export interface EmailFilterAction {
  type: 'move_to_folder' | 'add_label' | 'mark_read' | 'mark_important' | 'delete' | 'forward'
  value: string
}

// Email Statistics & Analytics
export interface EmailAnalytics {
  totalEmails: number
  unreadEmails: number
  
  // By Time Period
  emailsToday: number
  emailsThisWeek: number
  emailsThisMonth: number
  
  // By Status
  emailsByStatus: {
    sent: number
    received: number
    draft: number
    archived: number
  }
  
  // Response Metrics
  averageResponseTime: number // in minutes
  responseRate: number // percentage
  
  // Top Contacts
  topContacts: {
    contact: EmailContact
    emailCount: number
  }[]
  
  // Calculated at
  calculatedAt: Date
}

// Search & Filtering
export interface EmailSearchParams {
  query?: string
  folder?: string
  labels?: string[]
  isUnread?: boolean
  isStarred?: boolean
  hasAttachments?: boolean
  
  // Date Range
  dateFrom?: Date
  dateTo?: Date
  
  // Participants
  from?: string
  to?: string
  
  // Pagination
  page?: number
  limit?: number
  sortBy?: 'date' | 'subject' | 'from'
  sortOrder?: 'asc' | 'desc'
}

export interface EmailSearchResult {
  emails: Email[]
  threads: EmailThread[]
  totalCount: number
  hasMore: boolean
} 