'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface PlatformData {
  facebook?: {
    impressions: number
    reach: number
    engagement: number
    [key: string]: any
  }
  instagram?: {
    impressions: number
    reach: number
    engagement: number
    [key: string]: any
  }
  linkedin?: {
    impressions: number
    reach: number
    engagement: number
    [key: string]: any
  }
  twitter?: {
    impressions: number
    reach: number
    engagement: number
    [key: string]: any
  }
}

interface PlatformComparisonChartsProps {
  platformData: PlatformData
  campaignName: string
}

const PLATFORM_COLORS = {
  facebook: '#87CEEB',
  instagram: '#E4405F',
  linkedin: '#0A66C2',
  twitter: '#000000',
  x: '#000000'
}

const getPlatformName = (platform: string) => {
  return platform.toLowerCase() === 'twitter' ? 'X' : platform.charAt(0).toUpperCase() + platform.slice(1)
}

type ComparisonMetric = 'engagement' | 'impressions' | 'reach' | 'engagement_rate'

export default function PlatformComparisonCharts({ platformData }: PlatformComparisonChartsProps) {
  const [selectedComparison, setSelectedComparison] = useState<ComparisonMetric>('engagement')

  // Transform data for charts
  const chartData = Object.entries(platformData).map(([platform, data]) => ({
    platform: getPlatformName(platform),
    originalPlatform: platform,
    impressions: data.impressions,
    reach: data.reach,
    engagement: data.engagement,
    engagement_rate: Number(((data.engagement / data.impressions) * 100).toFixed(2))
  }))

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getChartTitle = () => {
    switch (selectedComparison) {
      case 'engagement': return 'Engagement Comparison'
      case 'impressions': return 'Impressions Comparison'
      case 'reach': return 'Reach Comparison'
      case 'engagement_rate': return 'Engagement Rate Comparison'
    }
  }

  const getChartColor = () => {
    switch (selectedComparison) {
      case 'engagement': return '#7FB3D3'
      case 'impressions': return '#8B9DC3'
      case 'reach': return '#DDB7AB'
      case 'engagement_rate': return '#82ca9d'
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p style={{ color: payload[0].color }}>
            {getChartTitle().replace(' Comparison', '')}: {
              selectedComparison === 'engagement_rate' 
                ? `${value}%` 
                : formatNumber(value)
            }
          </p>
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const total = chartData.reduce((sum, item) => sum + item[selectedComparison], 0)
      const percentage = ((data.value / total) * 100).toFixed(1)
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.payload.color }}>
            {selectedComparison === 'engagement_rate' ? `${data.value}%` : formatNumber(data.value)} ({percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  // Prepare data for pie chart
  const pieData = chartData.map(item => ({
    name: item.platform,
    value: item[selectedComparison],
    color: PLATFORM_COLORS[item.originalPlatform as keyof typeof PLATFORM_COLORS] || '#6B7280'
  }))

  // Choose visualization type based on metric
  const renderChart = () => {
    // Use pie chart for distribution metrics, bar chart for comparisons
    if (selectedComparison === 'engagement_rate') {
      // Bar chart is better for engagement rate comparison
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="platform" 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={selectedComparison}
              name={getChartTitle().replace(' Comparison', '')}
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.originalPlatform as keyof typeof PLATFORM_COLORS] || '#6B7280'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )
    } else {
      // Use combined view: bar chart on left, pie chart on right
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Platform Comparison</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="platform" 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={{ stroke: '#e0e0e0' }}
                  tickFormatter={formatNumber}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey={selectedComparison}
                  name={getChartTitle().replace(' Comparison', '')}
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PLATFORM_COLORS[entry.originalPlatform as keyof typeof PLATFORM_COLORS] || '#6B7280'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Platform Performance Comparison</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View:</span>
            <Select value={selectedComparison} onValueChange={(value) => setSelectedComparison(value as ComparisonMetric)}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engagement">Engagement Comparison</SelectItem>
                <SelectItem value="impressions">Impressions Comparison</SelectItem>
                <SelectItem value="reach">Reach Comparison</SelectItem>
                <SelectItem value="engagement_rate">Engagement Rate Comparison</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Cross-platform {selectedComparison.replace('_', ' ')} analysis
        </p>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  )
}