'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  MessageSquare,
  ExternalLink,
  Plus,
  Edit,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Customer } from '@/lib/types/crm'

interface CRMPanelProps {
  customerEmail: string | null
  isVisible: boolean
  onClose: () => void
}

interface CustomerOrder {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: number
}

interface CustomerNote {
  id: string
  content: string
  createdAt: string
  createdBy: string
}

export default function CRMPanel({ customerEmail, isVisible, onClose }: CRMPanelProps) {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [notes, setNotes] = useState<CustomerNote[]>([])
  const [loading, setLoading] = useState(false)
  const [showAllOrders, setShowAllOrders] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    if (customerEmail && isVisible) {
      fetchCustomerData(customerEmail)
    }
  }, [customerEmail, isVisible])

  const fetchCustomerData = async (email: string) => {
    try {
      setLoading(true)
      
      // Fetch customer data from CRM
      const customerResponse = await fetch(`/api/crm/customers?search=${encodeURIComponent(email)}&limit=1`)
      const customerResult = await customerResponse.json()
      
      if (customerResult.success && customerResult.data.customers.length > 0) {
        const customerData = customerResult.data.customers[0]
        setCustomer(customerData)
        
        // Generate mock orders for this customer
        const mockOrders: CustomerOrder[] = Array.from({ length: customerData.totalOrders }, (_, i) => ({
          id: `order_${i + 1}`,
          orderNumber: `#${1000 + i}`,
          date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          status: ['delivered', 'shipped', 'confirmed', 'pending'][Math.floor(Math.random() * 4)] as any,
          total: Math.floor(Math.random() * 500) + 50,
          items: Math.floor(Math.random() * 5) + 1
        })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        
        setOrders(mockOrders)
        
        // Generate mock notes
        const mockNotes: CustomerNote[] = [
          {
            id: 'note_1',
            content: 'Customer inquired about jewelry care instructions',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            createdBy: 'Support Team'
          },
          {
            id: 'note_2',
            content: 'VIP customer - provide priority support',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            createdBy: 'Sales Team'
          }
        ]
        setNotes(mockNotes)
      } else {
        setCustomer(null)
        setOrders([])
        setNotes([])
      }
    } catch (error) {
      console.error('Error fetching customer data:', error)
      setCustomer(null)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getSegmentColor = (segment: string) => {
    const colors = {
      'new': 'bg-blue-100 text-blue-800',
      'returning': 'bg-green-100 text-green-800',
      'vip': 'bg-purple-100 text-purple-800',
      'at_risk': 'bg-yellow-100 text-yellow-800',
      'churned': 'bg-red-100 text-red-800'
    }
    return colors[segment as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    const note: CustomerNote = {
      id: `note_${Date.now()}`,
      content: newNote,
      createdAt: new Date().toISOString(),
      createdBy: 'Current User'
    }

    setNotes([note, ...notes])
    setNewNote('')
    setShowAddNote(false)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (!isVisible) return null

  return (
    <div className="w-80 border-l bg-background flex flex-col h-full">
      {/* Panel Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Customer Info</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-4 space-y-4">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
                <div className="h-3 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        ) : customer ? (
          <div className="p-4 space-y-6">
            {/* Customer Profile */}
            <div className="text-center">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <AvatarFallback className="text-lg">
                  {getInitials(`${customer.firstName} ${customer.lastName}`)}
                </AvatarFallback>
              </Avatar>
              <h4 className="font-semibold">{customer.firstName} {customer.lastName}</h4>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Badge className={`text-xs ${getSegmentColor(customer.segment)}`}>
                  {customer.segment}
                </Badge>
                <Badge variant={customer.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {customer.status}
                </Badge>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>

            {/* Customer Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold">{customer.totalOrders}</div>
                  <div className="text-xs text-muted-foreground">Orders</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold">{formatCurrency(customer.totalSpent)}</div>
                  <div className="text-xs text-muted-foreground">Total Spent</div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <h5 className="font-medium mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Contact Details
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
                {customer.addresses.length > 0 && (
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <div>{customer.addresses[0].address1}</div>
                      <div>{customer.addresses[0].city}, {customer.addresses[0].province} {customer.addresses[0].zip}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Customer since {formatDate(customer.createdAt.toISOString())}</span>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Recent Orders
                </h5>
                {orders.length > 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllOrders(!showAllOrders)}
                  >
                    {showAllOrders ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {(showAllOrders ? orders : orders.slice(0, 3)).map((order) => (
                  <Card key={order.id} className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{order.orderNumber}</span>
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatDate(order.date)}</span>
                      <span className="font-medium">{formatCurrency(order.total)}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {order.items} item{order.items > 1 ? 's' : ''}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Customer Notes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Notes
                </h5>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddNote(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {showAddNote && (
                <Card className="p-3 mb-3">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note about this customer..."
                    className="w-full min-h-[60px] p-2 text-sm border rounded resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAddNote(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                      Add Note
                    </Button>
                  </div>
                </Card>
              )}

              <div className="space-y-3">
                {notes.map((note) => (
                  <Card key={note.id} className="p-3">
                    <p className="text-sm mb-2">{note.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{note.createdBy}</span>
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : customerEmail ? (
          <div className="p-4 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-medium mb-2">Customer Not Found</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {customerEmail} is not in your CRM system
            </p>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add to CRM
            </Button>
          </div>
        ) : (
          <div className="p-4 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h4 className="font-medium mb-2">No Customer Selected</h4>
            <p className="text-sm text-muted-foreground">
              Select an email to view customer information
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}