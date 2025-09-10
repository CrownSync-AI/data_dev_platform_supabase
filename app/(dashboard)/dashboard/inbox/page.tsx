'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  RefreshCw, 
  Star, 
  Archive, 
  Trash2, 
  Reply, 
  Forward,
  MoreHorizontal,
  Mail,
  Clock,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Sparkles,
  Send,
  X,
  User
} from 'lucide-react'
import { EmailThread, Email } from '@/lib/types/email'
import { Customer } from '@/lib/types/crm'
import CRMPanel from '@/components/inbox/CRMPanel'
import EmailThreadSummary from '@/components/inbox/EmailThreadSummary'

interface InboxData {
  threads: EmailThread[]
  emails: Email[]
  customers: Customer[]
}

export default function InboxPage() {
  const [inboxData, setInboxData] = useState<InboxData | null>(null)
  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showReplyEditor, setShowReplyEditor] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [showCRMPanel, setShowCRMPanel] = useState(true)
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string | null>(null)

  useEffect(() => {
    fetchInboxData()
  }, [])

  const fetchInboxData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/inbox/emails')
      if (!response.ok) throw new Error('Failed to fetch emails')
      
      const data = await response.json()
      setInboxData(data)
      
      // Auto-select first thread
      if (data.threads.length > 0) {
        const firstThread = data.threads[0]
        setSelectedThread(firstThread)
        
        // Set customer email for CRM panel
        const customerParticipant = firstThread.participants.find(p => p.email !== 'support@crownsync.com')
        setSelectedCustomerEmail(customerParticipant?.email || null)
      }
    } catch (error) {
      console.error('Error fetching inbox data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredThreads = inboxData?.threads.filter(thread =>
    thread.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.participants.some(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || []

  const getCustomerForThread = (customerId: string | undefined) => {
    if (!customerId) return null
    return inboxData?.customers.find(c => c.id === customerId)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return new Date(date).toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else if (days < 7) {
      return `${days}d ago`
    } else {
      return new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleThreadSelect = (thread: EmailThread) => {
    setSelectedThread(thread)
    
    // Update customer email for CRM panel
    const customerParticipant = thread.participants.find(p => p.email !== 'support@crownsync.com')
    setSelectedCustomerEmail(customerParticipant?.email || null)
  }

  const handleSendReply = async () => {
    if (!replyContent.trim() || !selectedThread) return

    try {
      // In a real app, this would call an API to send the email
      console.log('Sending reply:', {
        threadId: selectedThread.id,
        content: replyContent,
        to: selectedThread.participants.find(p => p.email !== 'support@crownsync.com')?.email
      })

      // Reset the reply editor
      setShowReplyEditor(false)
      setReplyContent('')
      
      // Show success message or refresh data
      // For now, just close the editor
    } catch (error) {
      console.error('Failed to send reply:', error)
    }
  }

  if (loading) {
    return <InboxSkeleton />
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Unify Inbox</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-80"
              />
            </div>
            <Button variant="outline" size="sm" onClick={fetchInboxData}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              variant={showCRMPanel ? "default" : "outline"} 
              size="sm" 
              onClick={() => setShowCRMPanel(!showCRMPanel)}
            >
              <User className="h-4 w-4 mr-2" />
              CRM
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Email List */}
        <div className="w-96 border-r bg-background overflow-y-auto">
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Inbox</span>
              <Badge variant="secondary">{filteredThreads.length}</Badge>
            </div>
          </div>
          
          <div className="divide-y">
            {filteredThreads.map((thread) => {
              const customer = getCustomerForThread(thread.customerId)
              const customerParticipant = thread.participants.find(p => p.email !== 'support@crownsync.com')
              const isSelected = selectedThread?.id === thread.id
              
              return (
                <div
                  key={thread.id}
                  className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    isSelected ? 'bg-muted border-r-2 border-primary' : ''
                  } ${thread.hasUnread ? 'bg-blue-50' : ''}`}
                  onClick={() => handleThreadSelect(thread)}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="text-sm">
                        {getInitials(customerParticipant?.name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${thread.hasUnread ? 'font-semibold' : 'font-medium'}`}>
                          {customerParticipant?.name || 'Unknown Customer'}
                        </p>
                        <div className="flex items-center space-x-1">
                          {thread.isStarred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                          <span className="text-xs text-muted-foreground">
                            {formatTime(thread.lastActivityAt)}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm truncate mt-1 ${thread.hasUnread ? 'font-medium' : 'text-muted-foreground'}`}>
                        {thread.subject}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {thread.lastEmail.textContent}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          {thread.hasUnread && (
                            <Badge variant="default" className="h-5 text-xs">
                              {thread.emails.filter(e => !e.isRead).length} new
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {thread.emailCount} messages
                          </span>
                        </div>
                        {customer && (
                          <Badge variant="outline" className="text-xs">
                            {customer.segment}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Email Detail */}
        <div className="flex-1 flex flex-col min-w-0">
          {selectedThread ? (
            <>
              {/* Email Header */}
              <div className="border-b bg-background px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{selectedThread.subject}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedThread.emailCount} messages with {selectedThread.participants.find(p => p.email !== 'support@crownsync.com')?.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Email Thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* AI Summary */}
                {selectedThread.summary && (
                  <EmailThreadSummary
                    summary={selectedThread.summary}
                    customerName={selectedThread.participants.find(p => p.email !== 'support@crownsync.com')?.name || 'Customer'}
                  />
                )}
                
                {selectedThread.emails.map((email, index) => {
                  const isFromCustomer = email.from.email !== 'support@crownsync.com'
                  
                  return (
                    <Card key={email.id} className={!email.isRead ? 'ring-2 ring-blue-200' : ''}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {getInitials(email.from.name || 'Unknown')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{email.from.name}</p>
                              <p className="text-sm text-muted-foreground">{email.from.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              {new Date(email.sentAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                            {!email.isRead && (
                              <Badge variant="default" className="mt-1">New</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="prose prose-sm max-w-none">
                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {email.textContent}
                          </p>
                        </div>

                        {index === selectedThread.emails.length - 1 && (
                          <div className="mt-4 pt-4 border-t">
                            {!showReplyEditor ? (
                              <div className="flex items-center space-x-2">
                                <Button size="sm" onClick={() => setShowReplyEditor(true)}>
                                  <Reply className="h-4 w-4 mr-2" />
                                  Reply
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Forward className="h-4 w-4 mr-2" />
                                  Forward
                                </Button>
                              </div>
                            ) : (
                              <ReplyEditor
                                thread={selectedThread}
                                content={replyContent}
                                setContent={setReplyContent}
                                onCancel={() => {
                                  setShowReplyEditor(false)
                                  setReplyContent('')
                                }}
                                onSend={handleSendReply}
                              />
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select an email to read</h3>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to view the messages
                </p>
              </div>
            </div>
          )}
        </div>

        {/* CRM Panel */}
        <CRMPanel
          customerEmail={selectedCustomerEmail}
          isVisible={showCRMPanel}
          onClose={() => setShowCRMPanel(false)}
        />
      </div>
    </div>
  )
}

// Reply Editor Component
interface ReplyEditorProps {
  thread: EmailThread
  content: string
  setContent: (content: string) => void
  onCancel: () => void
  onSend: () => void
}

function ReplyEditor({ thread, content, setContent, onCancel, onSend }: ReplyEditorProps) {
  const [showAIHelper, setShowAIHelper] = useState(false)
  
  const customerParticipant = thread.participants.find(p => p.email !== 'support@crownsync.com')
  
  const handleAIHelp = () => {
    // AI助手功能 - 为演示目的，添加一些建议文本
    const suggestions = [
      "Thank you for reaching out. I'm happy to help you with your inquiry.",
      "I appreciate your interest in our products. Let me provide you with the information you need.",
      "Thank you for contacting us. I'll be glad to assist you with your request.",
    ]
    const suggestion = suggestions[Math.floor(Math.random() * suggestions.length)]
    setContent(content + (content ? '\n\n' : '') + suggestion)
    setShowAIHelper(false)
  }

  return (
    <div className="space-y-3">
      {/* Reply Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Reply to:</span>
          <span className="text-sm text-muted-foreground">
            {customerParticipant?.name} ({customerParticipant?.email})
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* AI Helper */}
      <div className="flex items-center space-x-2">
        <Button
          onClick={handleAIHelp}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Help me write
        </Button>
      </div>

      {/* Text Formatting Toolbar */}
      <div className="flex items-center space-x-1 p-2 border rounded-t-md bg-muted/50">
        <Button variant="ghost" size="sm">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Underline className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="ghost" size="sm">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <Button variant="ghost" size="sm">
          <Link className="h-4 w-4" />
        </Button>
      </div>

      {/* Text Editor */}
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your message..."
          className="w-full min-h-[120px] p-3 border border-t-0 rounded-b-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Send Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            onClick={onSend}
            disabled={!content.trim()}
            className="bg-black hover:bg-gray-800 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
        <span className="text-xs text-muted-foreground">
          {content.length} characters
        </span>
      </div>
    </div>
  )
}

// Loading skeleton
function InboxSkeleton() {
  return (
    <div className="h-screen flex flex-col">
      <div className="border-b bg-background px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="flex space-x-2">
            <div className="h-9 w-80 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <div className="w-96 border-r p-4 space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex space-x-3 p-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex-1 p-6">
          <div className="space-y-4">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
} 