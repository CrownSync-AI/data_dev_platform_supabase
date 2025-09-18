'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react'

interface PlatformAnalyticsChartsProps {
  platform: string
  data?: any
  timeRange?: string
}

interface TrendData {
  date: string
  impressions: number
  reach: number
  engagement: number
  engagement_rate: number
  platform_specific?: any
}

interface ComparisonData {
  metric: string
  current_period: number
  previous_period: number
  change_percent: number
}

export default function PlatformAnalyticsCharts({ 
  platform, 
  data, 
  timeRange = '30d' 
}: PlatformAnalyticsChartsProps) {
  const [selectedMetric, setSelectedMetric] = useState('engagement')
  const [chartType, setChartType] = useState('trend')
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateMockData()
  }, [platform, timeRange])

  const generateMockData = () => {
    setLoading(true)
    
    // Generate trend data for the last 30 days
    const trends: TrendData[] = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      const baseImpressions = 8000 + Math.random() * 4000
      const baseReach = baseImpressions * (0.7 + Math.random() * 0.2)
      const baseEngagement = baseReach * (0.03 + Math.random() * 0.05)
      
      const platformMultiplier = getPlatformMultiplier(platform)
      
      trends.push({
        date: date.toISOString().split('T')[0],
        impressions: Math.round(baseImpressions * platformMultiplier.impressions),
        reach: Math.round(baseReach * platformMultiplier.reach),
        engagement: Math.round(baseEngagement * platformMultiplier.engagement),
        engagement_rate: Number(((baseEngagement / baseReach) * 100).toFixed(2)),
        platform_specific: generatePlatformSpecificData(platform, baseEngagement)
      })
    }
    
    setTrendData(trends)
    
    // Generate comparison data
    const comparisons: ComparisonData[] = [
      {
        metric: 'Impressions',
        current_period: trends.reduce((sum, day) => sum + day.impressions, 0),
        previous_period: trends.reduce((sum, day) => sum + day.impressions, 0) * (0.85 + Math.random() * 0.3),
        change_percent: 0
      },
      {
        metric: 'Reach',
        current_period: trends.reduce((sum, day) => sum + day.reach, 0),
        previous_period: trends.reduce((sum, day) => sum + day.reach, 0) * (0.9 + Math.random() * 0.2),
        change_percent: 0
      },
      {
        metric: 'Engagement',
        current_period: trends.reduce((sum, day) => sum + day.engagement, 0),
        previous_period: trends.reduce((sum, day) => sum + day.engagement, 0) * (0.8 + Math.random() * 0.4),
        change_percent: 0
      },
      {
        metric: 'Engagement Rate',
        current_period: trends.reduce((sum, day) => sum + day.engagement_rate, 0) / trends.length,
        previous_period: (trends.reduce((sum, day) => sum + day.engagement_rate, 0) / trends.length) * (0.9 + Math.random() * 0.2),
        change_percent: 0
      }
    ]
    
    // Calculate change percentages
    comparisons.forEach(item => {
      item.change_percent = ((item.current_period - item.previous_period) / item.previous_period) * 100
    })
    
    setComparisonData(comparisons)
    setLoading(false)
  }

  const getPlatformMultiplier = (platform: string) => {
    const multipliers = {
      facebook: { impressions: 1.2, reach: 1.1, engagement: 0.9 },
      instagram: { impressions: 1.4, reach: 1.3, engagement: 1.2 },
      twitter: { impressions: 0.8, reach: 0.7, engagement: 0.6 },
      linkedin: { impressions: 0.6, reach: 0.5, engagement: 0.4 },
      all: { impressions: 1.0, reach: 1.0, engagement: 1.0 }
    }
    return multipliers[platform as keyof typeof multipliers] || multipliers.all
  }

  const generatePlatformSpecificData = (platform: string, baseEngagement: number) => {
    switch (platform) {
      case 'facebook':
        return {
          likes: Math.round(baseEngagement * 0.6),
          comments: Math.round(baseEngagement * 0.15),
          shares: Math.round(baseEngagement * 0.1),
          reactions: {
            love: Math.round(baseEngagement * 0.08),
            haha: Math.round(baseEngagement * 0.04),
            wow: Math.round(baseEngagement * 0.02),
            angry: Math.round(baseEngagement * 0.01)
          }
        }
      case 'instagram':
        return {
          likes: Math.round(baseEngagement * 0.7),
          comments: Math.round(baseEngagement * 0.12),
          saves: Math.round(baseEngagement * 0.08),
          shares: Math.round(baseEngagement * 0.1)
        }
      case 'twitter':
        return {
          likes: Math.round(baseEngagement * 0.5),
          retweets: Math.round(baseEngagement * 0.2),
          replies: Math.round(baseEngagement * 0.15),
          bookmarks: Math.round(baseEngagement * 0.15)
        }
      case 'linkedin':
        return {
          likes: Math.round(baseEngagement * 0.6),
          comments: Math.round(baseEngagement * 0.2),
          shares: Math.round(baseEngagement * 0.1),
          reactions: {
            praise: Math.round(baseEngagement * 0.05),
            insightful: Math.round(baseEngagement * 0.03),
            support: Math.round(baseEngagement * 0.02)
          }
        }
      default:
        return {}
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toLocaleString()
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return null
  }

  // Platform-specific colors
  const platformColors = {
    facebook: '#1877F2',
    instagram: '#E4405F',
    twitter: '#1DA1F2',
    linkedin: '#0A66C2',
    all: '#6366F1'
  }

  const primaryColor = platformColors[platform as keyof typeof platformColors] || platformColors.all

  // Chart color schemes
  const chartColors = [primaryColor, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  // Engagement breakdown data for pie chart
  const getEngagementBreakdown = () => {
    if (trendData.length === 0) return []
    
    const totalEngagement = trendData.reduce((sum, day) => sum + day.engagement, 0)
    const avgPlatformData = trendData[0]?.platform_specific || {}
    
    switch (platform) {
      case 'facebook':
        return [
          { name: 'Likes', value: avgPlatformData.likes || 0, color: chartColors[0] },
          { name: 'Comments', value: avgPlatformData.comments || 0, color: chartColors[1] },
          { name: 'Shares', value: avgPlatformData.shares || 0, color: chartColors[2] },
          { name: 'Reactions', value: Object.values(avgPlatformData.reactions || {}).reduce((a: number, b: any) => a + b, 0), color: chartColors[3] }
        ]
      case 'instagram':
        return [
          { name: 'Likes', value: avgPlatformData.likes || 0, color: chartColors[0] },
          { name: 'Comments', value: avgPlatformData.comments || 0, color: chartColors[1] },
          { name: 'Saves', value: avgPlatformData.saves || 0, color: chartColors[2] },
          { name: 'Shares', value: avgPlatformData.shares || 0, color: chartColors[3] }
        ]
      case 'twitter':
        return [
          { name: 'Likes', value: avgPlatformData.likes || 0, color: chartColors[0] },
          { name: 'Retweets', value: avgPlatformData.retweets || 0, color: chartColors[1] },
          { name: 'Replies', value: avgPlatformData.replies || 0, color: chartColors[2] },
          { name: 'Bookmarks', value: avgPlatformData.bookmarks || 0, color: chartColors[3] }
        ]
      case 'linkedin':
        return [
          { name: 'Likes', value: avgPlatformData.likes || 0, color: chartColors[0] },
          { name: 'Comments', value: avgPlatformData.comments || 0, color: chartColors[1] },
          { name: 'Shares', value: avgPlatformData.shares || 0, color: chartColors[2] },
          { name: 'Reactions', value: Object.values(avgPlatformData.reactions || {}).reduce((a: number, b: any) => a + b, 0), color: chartColors[3] }
        ]
      default:
        return [
          { name: 'Engagement', value: totalEngagement, color: chartColors[0] }
        ]
    }
  }

  // Performance radar data
  const getRadarData = () => {
    if (trendData.length === 0) return []
    
    const avgData = trendData.reduce((acc, day) => ({
      impressions: acc.impressions + day.impressions,
      reach: acc.reach + day.reach,
      engagement: acc.engagement + day.engagement,
      engagement_rate: acc.engagement_rate + day.engagement_rate
    }), { impressions: 0, reach: 0, engagement: 0, engagement_rate: 0 })
    
    const days = trendData.length
    
    return [
      {
        metric: 'Impressions',
        value: Math.round((avgData.impressions / days) / 1000), // Scale down for radar
        fullMark: 15
      },
      {
        metric: 'Reach',
        value: Math.round((avgData.reach / days) / 1000),
        fullMark: 12
      },
      {
        metric: 'Engagement',
        value: Math.round((avgData.engagement / days) / 10),
        fullMark: 50
      },
      {
        metric: 'Eng. Rate',
        value: Math.round(avgData.engagement_rate / days),
        fullMark: 10
      }
    ]
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" style={{ color: primaryColor }} />
                {platform.charAt(0).toUpperCase() + platform.slice(1)} Analytics Dashboard
              </CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engagement">Engagement</SelectItem>
                  <SelectItem value="reach">Reach</SelectItem>
                  <SelectItem value="impressions">Impressions</SelectItem>
                  <SelectItem value="engagement_rate">Engagement Rate</SelectItem>
                </SelectContent>
              </Select>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trend">Trend</SelectItem>
                  <SelectItem value="comparison">Comparison</SelectItem>
                  <SelectItem value="breakdown">Breakdown</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {comparisonData.map((item, index) => (
          <Card key={item.metric}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">{item.metric}</span>
                {getChangeIcon(item.change_percent)}
              </div>
              <div className="text-2xl font-bold mb-1">
                {item.metric === 'Engagement Rate' 
                  ? `${item.current_period.toFixed(1)}%`
                  : formatNumber(item.current_period)
                }
              </div>
              <div className={`text-sm ${getChangeColor(item.change_percent)}`}>
                {item.change_percent > 0 ? '+' : ''}{item.change_percent.toFixed(1)}% vs last period
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Charts */}
      <Tabs value={chartType} onValueChange={setChartType} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trend">Trend Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Period Comparison</TabsTrigger>
          <TabsTrigger value="breakdown">Engagement Breakdown</TabsTrigger>
          <TabsTrigger value="performance">Performance Radar</TabsTrigger>
        </TabsList>

        {/* Trend Analysis */}
        <TabsContent value="trend" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Trend Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>30-Day Trend Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: any, name: string) => [
                        name === 'engagement_rate' ? `${value}%` : formatNumber(value),
                        name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      ]}
                    />
                    <Legend />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="impressions"
                      stackId="1"
                      stroke={chartColors[0]}
                      fill={chartColors[0]}
                      fillOpacity={0.3}
                      name="Impressions"
                    />
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="reach"
                      stackId="1"
                      stroke={chartColors[1]}
                      fill={chartColors[1]}
                      fillOpacity={0.3}
                      name="Reach"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="engagement_rate"
                      stroke={chartColors[3]}
                      strokeWidth={3}
                      name="Engagement Rate (%)"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Engagement Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: any) => [formatNumber(value), 'Engagement']}
                    />
                    <Area
                      type="monotone"
                      dataKey="engagement"
                      stroke={primaryColor}
                      fill={primaryColor}
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trendData.filter((_, index) => index % 7 === 0)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => `Week ${Math.floor(new Date(value).getDate() / 7) + 1}`}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => `Week of ${new Date(value).toLocaleDateString()}`}
                      formatter={(value: any, name: string) => [
                        formatNumber(value),
                        name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      ]}
                    />
                    <Bar dataKey="engagement" fill={chartColors[0]} name="Engagement" />
                    <Bar dataKey="reach" fill={chartColors[1]} name="Reach" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Period Comparison */}
        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current vs Previous Period</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={comparisonData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="metric" type="category" width={100} />
                    <Tooltip formatter={(value: any) => formatNumber(value)} />
                    <Legend />
                    <Bar dataKey="current_period" fill={chartColors[0]} name="Current Period" />
                    <Bar dataKey="previous_period" fill={chartColors[1]} name="Previous Period" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Changes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {comparisonData.map((item, index) => (
                    <div key={item.metric} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.metric}</div>
                        <div className="text-sm text-gray-600">
                          {formatNumber(item.current_period)} → {formatNumber(item.previous_period)}
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 ${getChangeColor(item.change_percent)}`}>
                        {getChangeIcon(item.change_percent)}
                        <span className="font-bold">
                          {item.change_percent > 0 ? '+' : ''}{item.change_percent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Breakdown */}
        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={getEngagementBreakdown()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getEngagementBreakdown().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => formatNumber(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getEngagementBreakdown()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => formatNumber(value)} />
                    <Bar dataKey="value" fill={primaryColor} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Radar */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={getRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Performance"
                      dataKey="value"
                      stroke={primaryColor}
                      fill={primaryColor}
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">📊 Key Insights</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Average engagement rate: {(trendData.reduce((sum, day) => sum + day.engagement_rate, 0) / trendData.length).toFixed(2)}%</li>
                      <li>• Best performing day: {trendData.reduce((best, day) => day.engagement > best.engagement ? day : best, trendData[0])?.date}</li>
                      <li>• Total reach: {formatNumber(trendData.reduce((sum, day) => sum + day.reach, 0))}</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800 mb-2">🎯 Recommendations</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Focus on content types with highest engagement</li>
                      <li>• Optimize posting times based on peak performance</li>
                      <li>• Increase {platform}-specific features usage</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}