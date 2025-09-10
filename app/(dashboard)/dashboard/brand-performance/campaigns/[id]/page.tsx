'use client'

import { Suspense, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Download, Share, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import ConversionFunnel from '@/components/brand-performance/ConversionFunnel'
import CampaignROIRanking from '@/components/brand-performance/CampaignROIRanking'
import TopRetailersWidget from '@/components/brand-performance/TopRetailersWidget'
import TimeRangeSelector from '@/components/brand-performance/TimeRangeSelector'

interface TimeRange {
  label: string
  value: string
  startDate: Date
  endDate: Date
}

interface BrandCampaignPerformancePageProps {
  params: { id: string }
}

export default function BrandCampaignPerformancePage({ params }: BrandCampaignPerformancePageProps) {
  // Add time state
  const [timeRange, setTimeRange] = useState<TimeRange>({
    label: 'Past 1 year',
    value: '1y',
    startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  })

  return (
    <div className="space-y-6">
      {/* Page Header with Time Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Performance</h1>
          <p className="text-muted-foreground">Brand-focused campaign analytics dashboard</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:space-x-2">
          <TimeRangeSelector onTimeRangeChange={setTimeRange} />
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              Marco Bicego New 2025 Campaign
            </Badge>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="default" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share Insights
            </Button>
          </div>
        </div>
      </div>
      
      {/* First Row: Conversion Funnel (Full Width) */}
      <Suspense fallback={<FunnelSkeleton />}>
        <ConversionFunnel 
          campaignId={params.id} 
          startDate={timeRange.startDate}
          endDate={timeRange.endDate}
        />
      </Suspense>
      
      {/* Second Row: ROI Ranking + Top Retailers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Suspense fallback={<ROISkeleton />}>
            <CampaignROIRanking 
              currentCampaignId={params.id}
              startDate={timeRange.startDate}
              endDate={timeRange.endDate}
            />
          </Suspense>
        </div>
        <div>
          <Suspense fallback={<TopRetailersSkeleton />}>
            <TopRetailersWidget 
              campaignId={params.id}
              startDate={timeRange.startDate}
              endDate={timeRange.endDate}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// Loading skeletons
function FunnelSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ROISkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function TopRetailersSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 