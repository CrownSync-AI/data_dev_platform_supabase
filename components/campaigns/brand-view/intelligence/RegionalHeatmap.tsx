'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, BarChart3, Eye, Activity } from 'lucide-react'
import USMapVisualization from './USMapVisualization'

// Type definition for regional data
interface RegionalData {
  region: string
  retailers: number
  posts: number
  engagement: number
  reach: number
  engagementRate: number
  performance: number
  growth: number
  topRetailer: string
  cities: string[]
}

interface RegionalHeatmapProps {
  regionalData: RegionalData[]
}

type MetricType = 'performance' | 'engagementRate' | 'reach' | 'growth'

const getMetricConfig = (metric: MetricType) => {
  switch (metric) {
    case 'performance':
      return { label: 'Performance Score', icon: Activity, format: (v: number) => `${v}/100` }
    case 'engagementRate':
      return { label: 'Engagement Rate', icon: TrendingUp, format: (v: number) => `${v}%` }
    case 'reach':
      return { label: 'Total Reach', icon: Eye, format: (v: number) => `${(v / 1000).toFixed(0)}K` }
    case 'growth':
      return { label: 'Growth', icon: BarChart3, format: (v: number) => `+${v}%` }
  }
}

const getMetricStatus = (value: number, metric: MetricType) => {
  let status = 'Needs Attention'
  let variant: 'default' | 'secondary' | 'outline' | 'destructive' = 'destructive'
  let colorClass = 'bg-red-500'

  if (metric === 'performance') {
    if (value >= 90) { status = 'Excellent'; variant = 'default'; colorClass = 'bg-green-500' }
    else if (value >= 85) { status = 'Good'; variant = 'secondary'; colorClass = 'bg-yellow-500' }
    else if (value >= 80) { status = 'Fair'; variant = 'outline'; colorClass = 'bg-orange-500' }
  } else if (metric === 'engagementRate') {
    if (value >= 4.5) { status = 'Excellent'; variant = 'default'; colorClass = 'bg-green-500' }
    else if (value >= 4.0) { status = 'Good'; variant = 'secondary'; colorClass = 'bg-yellow-500' }
    else if (value >= 3.5) { status = 'Fair'; variant = 'outline'; colorClass = 'bg-orange-500' }
  } else if (metric === 'growth') {
    if (value >= 15) { status = 'Excellent'; variant = 'default'; colorClass = 'bg-green-500' }
    else if (value >= 12) { status = 'Good'; variant = 'secondary'; colorClass = 'bg-yellow-500' }
    else if (value >= 10) { status = 'Fair'; variant = 'outline'; colorClass = 'bg-orange-500' }
  } else if (metric === 'reach') {
    if (value >= 300000) { status = 'Excellent'; variant = 'default'; colorClass = 'bg-green-500' }
    else if (value >= 200000) { status = 'Good'; variant = 'secondary'; colorClass = 'bg-yellow-500' }
    else if (value >= 150000) { status = 'Fair'; variant = 'outline'; colorClass = 'bg-orange-500' }
  }

  return { status, variant, colorClass }
}

export default function RegionalHeatmap({ regionalData }: RegionalHeatmapProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('performance')
  const metricConfig = getMetricConfig(selectedMetric)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left Column: Map Visualization */}
      <div className="xl:col-span-2 space-y-4">
        <USMapVisualization
          regionalData={regionalData}
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
        />
      </div>

      {/* Right Column: Regional Details List */}
      <div className="space-y-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        <div className="flex items-center justify-between mb-2 sticky top-0 bg-white z-10 py-2 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <metricConfig.icon className="h-4 w-4 text-gray-500" />
            Regional Details
          </h3>
          <Badge variant="outline" className="text-xs font-normal">
            {regionalData.length} Regions
          </Badge>
        </div>

        {regionalData.map((region) => {
          // Get value based on selected metric
          const value = region[selectedMetric] as number
          const { status, variant, colorClass } = getMetricStatus(value, selectedMetric)

          return (
            <div
              key={region.region}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 hover:border-blue-200 hover:shadow-md transition-all duration-200"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${colorClass}`} />

              <div className="flex items-center justify-between mb-3 pl-2">
                <h4 className="font-semibold text-gray-900">{region.region}</h4>
                <Badge variant={variant} className="text-[10px] px-2 h-5">{status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 pl-2">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">{metricConfig.label}</p>
                  <p className="font-semibold text-gray-900">{metricConfig.format(value)}</p>
                </div>
                {selectedMetric !== 'performance' && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Performance</p>
                    <p className="font-medium text-gray-900">{region.performance}/100</p>
                  </div>
                )}
                {selectedMetric === 'performance' && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Engagement Rate</p>
                    <p className="font-medium text-gray-900">{region.engagementRate}%</p>
                  </div>
                )}
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