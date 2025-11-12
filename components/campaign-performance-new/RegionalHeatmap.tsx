'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Users, TrendingUp } from 'lucide-react'
import USMapVisualization from './USMapVisualization'

// Regional performance data
const regionalData = [
  {
    region: 'East',
    retailers: 3,
    posts: 58,
    engagement: 15240,
    reach: 342000,
    engagementRate: 4.46,
    performance: 92,
    growth: 18.5,
    topRetailer: 'Luxury Boutique NYC',
    cities: ['New York', 'Boston', 'Philadelphia']
  },
  {
    region: 'West',
    retailers: 2,
    posts: 42,
    engagement: 8960,
    reach: 198000,
    engagementRate: 4.53,
    performance: 88,
    growth: 15.2,
    topRetailer: 'Fashion Forward LA',
    cities: ['Los Angeles', 'San Francisco', 'Seattle']
  },
  {
    region: 'South',
    retailers: 3,
    posts: 52,
    engagement: 10960,
    reach: 264000,
    engagementRate: 4.15,
    performance: 89,
    growth: 16.9,
    topRetailer: 'Trend Setters Miami',
    cities: ['Miami', 'Dallas', 'Atlanta']
  },
  {
    region: 'Central',
    retailers: 2,
    posts: 32,
    engagement: 7420,
    reach: 156000,
    engagementRate: 4.76,
    performance: 85,
    growth: 12.8,
    topRetailer: 'Style Central Chicago',
    cities: ['Chicago', 'Detroit', 'Minneapolis']
  },
  {
    region: 'North',
    retailers: 2,
    posts: 18,
    engagement: 2700,
    reach: 132000,
    engagementRate: 2.05,
    performance: 78,
    growth: 8.4,
    topRetailer: 'Northern Trends',
    cities: ['Toronto', 'Montreal', 'Vancouver']
  }
]

const getPerformanceColor = (performance: number) => {
  if (performance >= 90) return 'bg-green-500'
  if (performance >= 85) return 'bg-yellow-500'
  if (performance >= 80) return 'bg-orange-500'
  return 'bg-red-500'
}

const getPerformanceBadge = (performance: number) => {
  if (performance >= 90) return { variant: 'default' as const, label: 'Excellent' }
  if (performance >= 85) return { variant: 'secondary' as const, label: 'Good' }
  if (performance >= 80) return { variant: 'outline' as const, label: 'Fair' }
  return { variant: 'destructive' as const, label: 'Needs Attention' }
}

export default function RegionalHeatmap() {
  const [selectedMetric, setSelectedMetric] = useState<'performance' | 'engagementRate' | 'reach' | 'growth'>('performance')

  return (
    <div className="space-y-6">
      {/* U.S. Map Visualization */}
      <USMapVisualization selectedMetric={selectedMetric} regionalData={regionalData} />

      {/* Detailed Regional Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Regional Performance Details
          </CardTitle>
          <p className="text-sm text-gray-600">Detailed breakdown by region</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regionalData.map((region) => {
              const badge = getPerformanceBadge(region.performance)
              return (
                <Card key={region.region} className="relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${getPerformanceColor(region.performance)}`} />
                  <CardContent className="p-4 pl-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{region.region}</h3>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Engagement Rate</span>
                        <span className="font-semibold">{region.engagementRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Total Engagement</span>
                        <span className="font-medium">{region.engagement.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Reach</span>
                        <span className="font-medium">{(region.reach / 1000).toFixed(0)}K</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{region.retailers} retailers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-sm text-green-600">+{region.growth}%</span>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <p className="text-xs text-gray-500 mb-1">Top Performer</p>
                      <p className="text-sm font-medium">{region.topRetailer}</p>
                      <p className="text-xs text-gray-500">{region.posts} posts published</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}