'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts'
import { TrendingUp } from 'lucide-react'

interface AllPlatformsTrendChartProps {
  platformData: Record<string, any>
  campaignName: string
}

type MetricType = 'impressions' | 'reach' | 'engagement'

export default function AllPlatformsTrendChart({ 
  platformData, 
  campaignName 
}: AllPlatformsTrendChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('engagement')

  // Generate trend data for the last 21 days (3 weeks)
  const generateTrendData = () => {
    const days = 21
    const trendData = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const dayData: any = {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toLocaleDateString()
      }
      
      // Generate data for each platform
      Object.entries(platformData).forEach(([platform, data]) => {
        const variation = 0.7 + Math.random() * 0.6 // 70% to 130% variation
        const baseValue = data[selectedMetric] || 0
        dayData[platform] = Math.round(baseValue * variation)
      })
      
      trendData.push(dayData)
    }
    
    return trendData
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getMetricLabel = (metric: MetricType): string => {
    switch (metric) {
      case 'impressions': return 'Impressions'
      case 'reach': return 'Reach'
      case 'engagement': return 'Engagement'
      default: return 'Engagement'
    }
  }

  const getYAxisLabel = (metric: MetricType): string => {
    switch (metric) {
      case 'impressions': return 'Impressions'
      case 'reach': return 'Reach'
      case 'engagement': return 'Engagement Rate (%)'
      default: return 'Engagement Rate (%)'
    }
  }

  // Morandi color palette - muted, sophisticated tones
  const platformColors = {
    facebook: '#B8A082',    // Muted warm beige
    instagram: '#A8B5A0',   // Sage green
    twitter: '#9BB5C4',     // Dusty blue
    linkedin: '#C4A484',    // Warm taupe
    google: '#D4B896',      // Light camel (if needed)
    default: '#A8A8A8'      // Neutral gray
  }

  const trendData = generateTrendData()

  // Calculate engagement rate for display
  const processedData = selectedMetric === 'engagement' 
    ? trendData.map(day => {
        const processed = { ...day }
        Object.keys(platformData).forEach(platform => {
          const impressions = platformData[platform]?.impressions || 1
          const engagement = day[platform] || 0
          processed[platform] = Number(((engagement / impressions) * 100).toFixed(1))
        })
        return processed
      })
    : trendData

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <CardTitle>{getMetricLabel(selectedMetric)} Trends</CardTitle>
          </div>
          
          {/* Metric Selector - Segmented Control Style */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['impressions', 'reach', 'engagement'] as MetricType[]).map((metric) => (
              <Button
                key={metric}
                variant={selectedMetric === metric ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedMetric(metric)}
                className={`
                  px-3 py-1 text-xs font-medium rounded-md transition-all
                  ${selectedMetric === metric 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                {getMetricLabel(metric)}
              </Button>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          21-day trend analysis across all platforms for {campaignName}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                tickFormatter={selectedMetric === 'engagement' ? (value) => `${value}%` : formatNumber}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value: any, name: string) => [
                  selectedMetric === 'engagement' ? `${value}%` : formatNumber(value),
                  name.charAt(0).toUpperCase() + name.slice(1)
                ]}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              
              {/* Render lines for each platform */}
              {Object.keys(platformData).map((platform) => (
                <Line
                  key={platform}
                  type="monotone"
                  dataKey={platform}
                  stroke={platformColors[platform as keyof typeof platformColors] || '#6366F1'}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2 }}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                  name={platform.charAt(0).toUpperCase() + platform.slice(1)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Insights Panel */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">📈 Trend Insights</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>Metric: {getMetricLabel(selectedMetric)}</div>
              <div>Time Period: 21 days</div>
              <div>Platforms: {Object.keys(platformData).length} active</div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">🎯 Best Performer</h4>
            <div className="text-sm text-green-700 space-y-1">
              {(() => {
                const bestPlatform = Object.entries(platformData).reduce((best, [platform, data]) => {
                  const currentValue = data[selectedMetric] || 0
                  const bestValue = platformData[best]?.[selectedMetric] || 0
                  return currentValue > bestValue ? platform : best
                }, Object.keys(platformData)[0])
                
                return (
                  <>
                    <div>Platform: {bestPlatform.charAt(0).toUpperCase() + bestPlatform.slice(1)}</div>
                    <div>
                      {getMetricLabel(selectedMetric)}: {
                        selectedMetric === 'engagement' 
                          ? `${((platformData[bestPlatform][selectedMetric] / platformData[bestPlatform].impressions) * 100).toFixed(1)}%`
                          : formatNumber(platformData[bestPlatform][selectedMetric])
                      }
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">📊 Total Performance</h4>
            <div className="text-sm text-purple-700 space-y-1">
              {(() => {
                const total = Object.values(platformData).reduce((sum: number, data: any) => {
                  return sum + (data[selectedMetric] || 0)
                }, 0)
                
                const average = total / Object.keys(platformData).length
                
                return (
                  <>
                    <div>
                      Total: {
                        selectedMetric === 'engagement'
                          ? `${(average / Object.values(platformData).reduce((sum: number, data: any) => sum + (data.impressions || 0), 0) * Object.keys(platformData).length * 100).toFixed(1)}%`
                          : formatNumber(total)
                      }
                    </div>
                    <div>
                      Average: {
                        selectedMetric === 'engagement'
                          ? `${(average / (Object.values(platformData).reduce((sum: number, data: any) => sum + (data.impressions || 0), 0) / Object.keys(platformData).length) * 100).toFixed(1)}%`
                          : formatNumber(average)
                      }
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}