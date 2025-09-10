'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Users, AlertTriangle, Award, Target } from 'lucide-react'

interface MetricsData {
  topRetailers: number
  needsAttention: number
  averageROI: number
  roiTrend: number
  totalRetailers: number
  activeRetailers: number
  averageClickRate: number
  clickRateTrend: number
}

interface RetailerMetricsCardsProps {
  campaignId?: string
  startDate?: Date
  endDate?: Date
}

export default function RetailerMetricsCards({ campaignId, startDate, endDate }: RetailerMetricsCardsProps) {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [campaignId, startDate, endDate])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      
      // For now, use mock data - in real implementation, fetch from campaign analytics API
      const mockMetrics: MetricsData = {
        topRetailers: 12,
        needsAttention: 5,
        averageROI: 108.4,
        roiTrend: 5.2,
        totalRetailers: 25,
        activeRetailers: 23,
        averageClickRate: 3.1,
        clickRateTrend: -0.8
      }
      
      setMetrics(mockMetrics)
    } catch (error) {
      console.error('Error fetching retailer metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Top Retailers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Retailers</CardTitle>
          <Award className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{metrics.topRetailers}</div>
          <p className="text-xs text-muted-foreground">
            ROI &gt; 120%
          </p>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-green-600 font-medium">Excellent Performance</span>
          </div>
        </CardContent>
      </Card>

      {/* Needs Attention */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-orange-600">{metrics.needsAttention}</div>
          <p className="text-xs text-muted-foreground">
            ROI &lt; 80%
          </p>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-orange-600 font-medium">Improvement Required</span>
          </div>
        </CardContent>
      </Card>

      {/* Average ROI */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average ROI</CardTitle>
          <Target className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">{metrics.averageROI}%</div>
          <div className="flex items-center text-xs">
            {metrics.roiTrend > 0 ? (
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
            )}
            <span className={metrics.roiTrend > 0 ? 'text-green-600' : 'text-red-600'}>
              {metrics.roiTrend > 0 ? '+' : ''}{metrics.roiTrend}%
            </span>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Active Retailers */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Retailers</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-600">
            {metrics.activeRetailers}/{metrics.totalRetailers}
          </div>
          <p className="text-xs text-muted-foreground">
            {((metrics.activeRetailers / metrics.totalRetailers) * 100).toFixed(1)}% participation rate
          </p>
          <div className="mt-2 flex items-center text-xs">
            <span className="text-purple-600 font-medium">High Engagement</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 