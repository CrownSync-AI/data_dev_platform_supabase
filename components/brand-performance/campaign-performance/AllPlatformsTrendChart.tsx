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

  const getPlatformLogo = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
            alt="Facebook"
            className="w-4 h-4 object-contain"
          />
        )
      case 'instagram':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" 
            alt="Instagram"
            className="w-4 h-4 object-contain"
          />
        )
      case 'linkedin':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" 
            alt="LinkedIn"
            className="w-4 h-4 object-contain"
          />
        )
      case 'twitter':
      case 'x':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg" 
            alt="X"
            className="w-4 h-4 object-contain"
          />
        )
      default:
        return (
          <div className="w-4 h-4 rounded bg-gray-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">?</span>
          </div>
        )
    }
  }

  const getPlatformName = (platform: string) => {
    return platform.toLowerCase() === 'twitter' ? 'X' : platform.charAt(0).toUpperCase() + platform.slice(1)
  }

  // Platform colors - differentiated for Facebook and LinkedIn
  const platformColors = {
    facebook: '#87CEEB',    // Facebook sky blue (much lighter)
    instagram: '#E4405F',   // Instagram pink
    twitter: '#000000',     // X black
    x: '#000000',           // X black
    linkedin: '#0A66C2',    // LinkedIn darker blue
    google: '#4285F4',      // Google blue
    default: '#6B7280'      // Gray
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
              <Legend content={() => null} />
              
              {/* Render lines for each platform */}
              {Object.keys(platformData).map((platform) => (
                <Line
                  key={platform}
                  type="monotone"
                  dataKey={platform}
                  stroke={platformColors[platform as keyof typeof platformColors] || platformColors.default}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2 }}
                  activeDot={{ r: 5, strokeWidth: 2 }}
                  name={getPlatformName(platform)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Custom Legend with Platform Logos */}
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {Object.keys(platformData).map((platform) => (
            <div key={platform} className="flex items-center gap-2">
              {getPlatformLogo(platform)}
              <div 
                className="w-4 h-0.5 rounded"
                style={{ backgroundColor: platformColors[platform as keyof typeof platformColors] || platformColors.default }}
              ></div>
              <span className="text-sm text-gray-600">{getPlatformName(platform)}</span>
            </div>
          ))}
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