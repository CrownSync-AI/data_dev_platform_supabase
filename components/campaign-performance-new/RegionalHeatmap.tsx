'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Users, TrendingUp } from 'lucide-react'

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Regional Performance Overview
        </CardTitle>
        <p className="text-sm text-gray-600">
          Campaign performance breakdown by geographical region
        </p>
      </CardHeader>
      <CardContent>
        {/* Heat Map Visualization */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4">Regional Performance Heat Map</h3>
          <div className="grid grid-cols-5 gap-2 max-w-2xl">
            {regionalData.map((region) => {
              const intensity = region.performance / 100
              return (
                <div
                  key={region.region}
                  className="relative aspect-square rounded-lg flex items-center justify-center text-white font-medium text-sm cursor-pointer transition-all hover:scale-105"
                  style={{
                    backgroundColor: `rgba(16, 185, 129, ${intensity})`,
                    border: intensity < 0.8 ? '2px solid #E5E7EB' : 'none'
                  }}
                  title={`${region.region}: ${region.performance}% performance score`}
                >
                  <div className="text-center">
                    <div className="font-bold">{region.region}</div>
                    <div className="text-xs">{region.performance}%</div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs">
            <span className="text-gray-600">Performance Score:</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Excellent (90%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-300 rounded"></div>
              <span>Good (85-89%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-300 rounded"></div>
              <span>Fair (80-84%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-300 rounded"></div>
              <span>Needs Attention (&lt;80%)</span>
            </div>
          </div>
        </div>

        {/* Regional Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

        {/* Regional Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {regionalData.reduce((sum, region) => sum + region.retailers, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Retailers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {regionalData.reduce((sum, region) => sum + region.posts, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {(regionalData.reduce((sum, region) => sum + region.reach, 0) / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-600">Total Reach</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {(regionalData.reduce((sum, region) => sum + region.engagement * region.engagementRate, 0) / 
                regionalData.reduce((sum, region) => sum + region.engagement, 0)).toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Avg ER</p>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Regional Insights</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-blue-800">
                <strong>East region</strong> leads with highest total engagement (15.2K) and strong retailer density
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-blue-800">
                <strong>Central region</strong> shows highest engagement rate (4.76%) despite fewer posts
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-blue-800">
                <strong>North region</strong> needs attention with lowest engagement rate (2.05%) and growth
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}