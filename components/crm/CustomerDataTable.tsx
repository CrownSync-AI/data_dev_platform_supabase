'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Eye, Mail, FileText, User } from 'lucide-react'
import { Customer } from '@/lib/types/crm'
import { SortConfig } from '@/lib/services/crmService'
import { formatDistanceToNow } from 'date-fns'

interface CustomerDataTableProps {
  customers: Customer[]
  loading: boolean
  sortConfig: SortConfig
  onSort: (field: keyof Customer) => void
  onCustomerClick: (customerId: string) => void
  onSendEmail: (customer: Customer) => void
  onAddNote: (customerId: string) => void
}

export default function CustomerDataTable({
  customers,
  loading,
  sortConfig,
  onSort,
  onCustomerClick,
  onSendEmail,
  onAddNote
}: CustomerDataTableProps) {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'Never'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return formatDistanceToNow(dateObj, { addSuffix: true })
  }

  const getSortIcon = (field: keyof Customer) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="h-4 w-4" />
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="h-4 w-4" /> : 
      <ArrowDown className="h-4 w-4" />
  }

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-gray-100 text-gray-800 border-gray-300'
  }

  const getSegmentBadgeColor = (segment: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 border-blue-300',
      returning: 'bg-green-100 text-green-800 border-green-300',
      vip: 'bg-purple-100 text-purple-800 border-purple-300',
      at_risk: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      churned: 'bg-red-100 text-red-800 border-red-300'
    }
    return colors[segment as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Loading customer data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            {[...Array(10)].map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (customers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>No customers found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No customers match your filters</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or clear the filters</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer List</CardTitle>
        <CardDescription>
          Manage and view all customer information - {customers.length} customers shown
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-48">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onSort('firstName')} 
                    className="h-8 p-0 font-semibold hover:bg-transparent"
                  >
                    Name {getSortIcon('firstName')}
                  </Button>
                </TableHead>
                <TableHead className="min-w-64">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onSort('email')} 
                    className="h-8 p-0 font-semibold hover:bg-transparent"
                  >
                    Email {getSortIcon('email')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onSort('totalOrders')} 
                    className="h-8 p-0 font-semibold hover:bg-transparent"
                  >
                    Total Orders {getSortIcon('totalOrders')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onSort('totalSpent')} 
                    className="h-8 p-0 font-semibold hover:bg-transparent"
                  >
                    Total Spent {getSortIcon('totalSpent')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onSort('lastOrderDate')} 
                    className="h-8 p-0 font-semibold hover:bg-transparent"
                  >
                    Last Order {getSortIcon('lastOrderDate')}
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Segment</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow 
                  key={customer.id} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onMouseEnter={() => setHoveredRow(customer.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  onClick={() => onCustomerClick(customer.id)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {customer.firstName} {customer.lastName}
                      </div>
                      {customer.phone && (
                        <div className="text-xs text-muted-foreground">
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{customer.email}</div>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {customer.totalOrders}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(customer.lastOrderDate)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getStatusBadgeColor(customer.status)}`}>
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getSegmentBadgeColor(customer.segment)}`}>
                      {customer.segment}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          onCustomerClick(customer.id)
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          onSendEmail(customer)
                        }}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation()
                          onAddNote(customer.id)
                        }}>
                          <FileText className="h-4 w-4 mr-2" />
                          Add Note
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}