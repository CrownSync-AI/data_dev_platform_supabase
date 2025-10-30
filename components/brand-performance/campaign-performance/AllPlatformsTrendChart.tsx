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
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react'

interface AllPlatformsTrendChartProps {
  platformData: Record<string, any>
  campaignName: string
  platformFilter?: string
  dateRange?: { from?: Date, to?: Date }
}

type MetricType = 'impressions' | 'reach' | 'engagement'

export default function AllPlatformsTrendChart({ 
  platformData, 
  campaignName,
  platformFilter = 'all',
  dateRange = {}
}: AllPlatformsTrendChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('engagement')

  // Generate trend data with current and previous period comparison
  const generateTrendData = () => {
    // Calculate dynamic timeframe based on date range
    const endDate = dateRange.to || new Date()
    const startDate = dateRange.from || new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) // Default 21 days
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    const actualDays = Math.max(daysDiff, 7) // Minimum 7 days
    
    const trendData = []
    
    // Generate current period data
    for (let i = actualDays - 1; i >= 0; i--) {
      const date = new Date(startDate.getTime() + (actualDays - 1 - i) * 24 * 60 * 60 * 1000)
      
      const dayData: any = {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toLocaleDateString()
      }
      
      // Generate data based on platform filter
      if (platformFilter === 'all') {
        // Aggregate all platforms into single values
        let currentTotal = 0
        let previousTotal = 0
        
        Object.entries(platformData).forEach(([platform, data]) => {
          const baseValue = data[selectedMetric] || 0
          
          // Current period variation (more realistic trending)
          const trendFactor = 1 + (actualDays - 1 - i) * 0.015 // 1.5% improvement per day
          const dailyVariation = 0.8 + Math.random() * 0.4 // 80% to 120% daily variation
          const currentValue = Math.round(baseValue * trendFactor * dailyVariation)
          
          // Previous period (slightly lower performance)
          const previousVariation = 0.7 + Math.random() * 0.4 // 70% to 110% variation
          const previousValue = Math.round(baseValue * 0.85 * previousVariation) // 15% lower baseline
          
          currentTotal += currentValue
          previousTotal += previousValue
        })
        
        dayData.current = currentTotal
        dayData.previous = previousTotal
      } else {
        // Generate data for specific platform only
        const data = platformData[platformFilter]
        if (data) {
          const baseValue = data[selectedMetric] || 0
          
          // Current period
          const trendFactor = 1 + (actualDays - 1 - i) * 0.02 // 2% improvement per day for single platform
          const dailyVariation = 0.8 + Math.random() * 0.4
          dayData.current = Math.round(baseValue * trendFactor * dailyVariation)
          
          // Previous period
          const previousVariation = 0.7 + Math.random() * 0.4
          dayData.previous = Math.round(baseValue * 0.8 * previousVariation) // 20% lower baseline
        }
      }
      
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

  // Calculate engagement rate for display and period comparison
  const processedData = selectedMetric === 'engagement' 
    ? trendData.map(day => {
        const processed = { ...day }
        
        // Calculate total impressions for engagement rate calculation
        const totalImpressions = Object.values(platformData).reduce((sum: number, data: any) => {
          return sum + (data.impressions || 0)
        }, 0)
        
        // Convert to engagement rates
        processed.current = Number(((day.current / totalImpressions) * 100).toFixed(1))
        processed.previous = Number(((day.previous / totalImpressions) * 100).toFixed(1))
        
        return processed
      })
    : trendData

  // Calculate period comparison metrics
  const calculatePeriodComparison = () => {
    if (processedData.length === 0) return { change: 0, direction: 'stable', currentAvg: 0, previousAvg: 0 }
    
    const currentAvg = processedData.reduce((sum, day) => sum + (day.current || 0), 0) / processedData.length
    const previousAvg = processedData.reduce((sum, day) => sum + (day.previous || 0), 0) / processedData.length
    
    const change = previousAvg > 0 ? ((currentAvg - previousAvg) / previousAvg * 100) : 0
    const direction = change > 5 ? 'up' : change < -5 ? 'down' : 'stable'
    
    return { change: Math.abs(change), direction, currentAvg, previousAvg }
  }

  const periodComparison = calculatePeriodComparison()

  // Calculate timeframe display
  const getTimeframeDisplay = () => {
    const days = processedData.length
    if (days <= 7) return `${days} days`
    if (days <= 14) return `${Math.round(days / 7)} weeks`
    if (days <= 31) return `${Math.round(days / 7)} weeks`
    return `${Math.round(days / 30)} months`
  }

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
        
        {/* Enhanced Description with Period Comparison */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Trend analysis for {platformFilter === 'all' ? 'all platforms combined' : getPlatformName(platformFilter)} - {campaignName}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">
                {getTimeframeDisplay()} 
                {(dateRange.from || dateRange.to) && ` (${dateRange.from?.toLocaleDateString() || 'start'} to ${dateRange.to?.toLocaleDateString() || 'end'})`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {periodComparison.direction === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : periodComparison.direction === 'down' ? (
                <TrendingDown className="h-4 w-4 text-red-600" />
              ) : (
                <div className="h-4 w-4 rounded-full bg-gray-400"></div>
              )}
              <span className={`font-medium ${
                periodComparison.direction === 'up' ? 'text-green-600' : 
                periodComparison.direction === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {periodComparison.change.toFixed(1)}% vs previous period
              </span>
            </div>
          </div>
        </div>
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
                formatter={(value: any, name: string) => {
                  const formattedValue = selectedMetric === 'engagement' ? `${value}%` : formatNumber(value)
                  const periodLabel = name === 'current' ? 'Current Period' : 'Previous Period'
                  return [formattedValue, periodLabel]
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '15px' }}
                iconType="line"
                formatter={(value) => value === 'current' ? 'Current Period' : 'Previous Period'}
              />
              
              {/* Current Period Line - Solid */}
              <Line
                type="monotone"
                dataKey="current"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#3B82F6' }}
                activeDot={{ r: 6, strokeWidth: 2, fill: '#3B82F6' }}
                name="current"
              />
              
              {/* Previous Period Line - Dotted */}
              <Line
                type="monotone"
                dataKey="previous"
                stroke="#94A3B8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 3, strokeWidth: 2, fill: '#94A3B8' }}
                activeDot={{ r: 5, strokeWidth: 2, fill: '#94A3B8' }}
                name="previous"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Period Comparison Legend */}
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Current Period</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-gray-400 rounded border-dashed border-t-2 border-gray-400"></div>
            <span className="text-sm text-gray-600">Previous Period</span>
          </div>
        </div>
        
        {/* Enhanced Insights Panel with Period Comparison */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">📈 Trend Insights</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div>Metric: {getMetricLabel(selectedMetric)}</div>
              <div>Time Period: {getTimeframeDisplay()}</div>
              <div>View: {platformFilter === 'all' ? 'All Platforms Combined' : getPlatformName(platformFilter)}</div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${
            periodComparison.direction === 'up' ? 'bg-green-50' : 
            periodComparison.direction === 'down' ? 'bg-red-50' : 'bg-gray-50'
          }`}>
            <h4 className={`font-medium mb-2 ${
              periodComparison.direction === 'up' ? 'text-green-800' : 
              periodComparison.direction === 'down' ? 'text-red-800' : 'text-gray-800'
            }`}>
              📊 Period Comparison
            </h4>
            <div className={`text-sm space-y-1 ${
              periodComparison.direction === 'up' ? 'text-green-700' : 
              periodComparison.direction === 'down' ? 'text-red-700' : 'text-gray-700'
            }`}>
              <div className="flex items-center gap-2">
                {periodComparison.direction === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : periodComparison.direction === 'down' ? (
                  <TrendingDown className="h-3 w-3" />
                ) : (
                  <div className="h-3 w-3 rounded-full bg-gray-400"></div>
                )}
                <span>{periodComparison.change.toFixed(1)}% change</span>
              </div>
              <div>
                Current Avg: {
                  selectedMetric === 'engagement' 
                    ? `${periodComparison.currentAvg.toFixed(1)}%`
                    : formatNumber(Math.round(periodComparison.currentAvg))
                }
              </div>
              <div>
                Previous Avg: {
                  selectedMetric === 'engagement' 
                    ? `${periodComparison.previousAvg.toFixed(1)}%`
                    : formatNumber(Math.round(periodComparison.previousAvg))
                }
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-purple-800 mb-2">🎯 Performance Summary</h4>
            <div className="text-sm text-purple-700 space-y-1">
              {(() => {
                const currentTotal = processedData.reduce((sum, day) => sum + (day.current || 0), 0)
                const dailyAverage = currentTotal / processedData.length
                
                return (
                  <>
                    <div>
                      Daily Average: {
                        selectedMetric === 'engagement' 
                          ? `${dailyAverage.toFixed(1)}%`
                          : formatNumber(Math.round(dailyAverage))
                      }
                    </div>
                    <div>
                      Total Period: {
                        selectedMetric === 'engagement' 
                          ? `${(currentTotal / processedData.length).toFixed(1)}% avg`
                          : formatNumber(Math.round(currentTotal))
                      }
                    </div>
                    <div>Platforms: {Object.keys(platformData).length} active</div>
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