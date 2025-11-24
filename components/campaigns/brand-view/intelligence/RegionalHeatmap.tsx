'use client'

import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp } from 'lucide-react'
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
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left Column: Map Visualization */}
      <div className="xl:col-span-2 space-y-4">
        <USMapVisualization regionalData={regionalData} />
      </div>

      {/* Right Column: Regional Details List */}
      <div className="space-y-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex items-center justify-between mb-2 sticky top-0 bg-white z-10 py-2 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            Regional Details
          </h3>
          <Badge variant="outline" className="text-xs font-normal">
            {regionalData.length} Regions
          </Badge>
        </div>

        {regionalData.map((region) => {
          const badge = getPerformanceBadge(region.performance)
          return (
            <div
              key={region.region}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-200 hover:shadow-md transition-all duration-200"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${getPerformanceColor(region.performance)}`} />

              <div className="flex items-center justify-between mb-3 pl-2">
                <h4 className="font-semibold text-gray-900">{region.region}</h4>
                <Badge variant={badge.variant} className="text-[10px] px-2 h-5">{badge.label}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 pl-2">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Engagement</p>
                  <p className="font-semibold text-gray-900">{region.engagementRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Reach</p>
                  <p className="font-medium text-gray-900">{(region.reach / 1000).toFixed(0)}K</p>
                </div>
              </div>

              <div className="pl-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-xs text-gray-600">{region.retailers} retailers</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-xs font-medium text-green-600">+{region.growth}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}