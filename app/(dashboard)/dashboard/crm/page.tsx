'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CRMAnalytics } from '@/lib/types/crm'
import { Users, TrendingUp, DollarSign, ShoppingCart, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CRMDashboardPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<CRMAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/crm/analytics')
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics')
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch analytics')
      }
      
      setAnalytics(result.data)
      
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to load CRM analytics')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (value: number): string => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  const getGrowthColor = (value: number): string => {
    return value >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
          <p className="text-muted-foreground">
            Customer analytics and insights overview
          </p>
        </div>
        <Button onClick={() => router.push('/dashboard/crm/customers')}>
          View All Customers
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          [...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))
        ) : analytics ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalCustomers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Active customer base
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.newCustomersThisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={`flex items-center ${getGrowthColor(analytics.customerGrowthRate)}`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {formatPercentage(analytics.customerGrowthRate)} from last month
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics.averageOrderValue)}</div>
                <p className="text-xs text-muted-foreground">
                  Per order average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    All-time revenue
                  </span>
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          [...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  Failed to load metrics
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Customer Segments */}
      {analytics && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
              <CardDescription>Distribution of customers by segment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.customerSegments).map(([segment, count]) => (
                  <div key={segment} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        segment === 'new' ? 'bg-blue-500' :
                        segment === 'returning' ? 'bg-green-500' :
                        segment === 'vip' ? 'bg-purple-500' :
                        segment === 'at_risk' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium capitalize">{segment.replace('_', ' ')}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{count} customers</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common CRM tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/dashboard/crm/customers')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  View All Customers
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info('Add customer functionality coming soon')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Add New Customer
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => router.push('/dashboard/inbox')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Send Email Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}