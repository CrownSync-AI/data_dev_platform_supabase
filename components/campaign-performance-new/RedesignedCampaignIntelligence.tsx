'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  TrendingUp, TrendingDown, Target, Lightbulb, AlertTriangle, Trophy, ArrowRight,
  BarChart3, Calendar, Filter, MapPin, Users, Eye, MessageCircle, Share2,
  Clock, Zap, Award, ChevronRight, ExternalLink, Download
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar,
  ComposedChart, Area, AreaChart, PieChart, Pie, Cell, ScatterChart, Scatter,
  CartesianGrid, ReferenceLine
} from 'recharts'
import AttributionWaterfall from './AttributionWaterfall'
import RegionalHeatmap from './RegionalHeatmap'
import ContentPostingMatrix from './ContentPostingMatrix'
// import ContentTimingHeatmap from './ContentTimingHeatmap'

// Mock data aligned with Ayrshare structure
const campaignData = {
  current: {
    id: 'spring-collection-2024',
    name: 'Spring Collection 2024',
    startDate: '2024-10-01',
    endDate: '2024-11-30',
    status: 'active',
    totalPosts: 156,
    totalRetailers: 12,
    platforms: ['instagram', 'facebook', 'linkedin', 'tiktok'],
    regions: ['North', 'South', 'East', 'West', 'Central']
  }
}

// Time range options
const timeRanges = [
  { id: 'last-7-days', label: 'Last 7 Days', days: 7 },
  { id: 'last-30-days', label: 'Last 30 Days', days: 30 },
  { id: 'last-90-days', label: 'Last 90 Days', days: 90 },
  { id: 'campaign-to-date', label: 'Campaign to Date', days: null }
]

// Comparison campaigns
const comparisonCampaigns = [
  { id: 'holiday-2023', name: 'Holiday Collection 2023', period: 'Oct-Dec 2023' },
  { id: 'summer-2024', name: 'Summer Collection 2024', period: 'Jun-Aug 2024' },
  { id: 'spring-2023', name: 'Spring Collection 2023', period: 'Mar-May 2023' }
]

// Mock performance data based on Ayrshare structure
const performanceOverview = {
  totalEngagement: 45280,
  totalReach: 892000,
  totalImpressions: 1240000,
  avgEngagementRate: 3.65,
  totalComments: 2840,
  totalShares: 1920,
  totalLikes: 40520,
  postsPublished: 156,
  activeRetailers: 12
}

// Platform performance data
const platformPerformance = [
  {
    platform: 'Instagram',
    color: '#E4405F',
    posts: 68,
    engagement: 18420,
    reach: 425000,
    impressions: 580000,
    engagementRate: 4.33,
    avgLikes: 271,
    avgComments: 18,
    avgShares: 12,
    topContentType: 'REELS',
    growth: 12.5
  },
  {
    platform: 'Facebook',
    color: '#1877F2',
    posts: 45,
    engagement: 12680,
    reach: 285000,
    impressions: 420000,
    engagementRate: 3.02,
    avgLikes: 182,
    avgComments: 24,
    avgShares: 76,
    topContentType: 'VIDEO',
    growth: 8.3
  },
  {
    platform: 'LinkedIn',
    color: '#0A66C2',
    posts: 28,
    engagement: 8940,
    reach: 125000,
    impressions: 165000,
    engagementRate: 5.42,
    avgLikes: 89,
    avgComments: 12,
    avgShares: 218,
    topContentType: 'ARTICLE',
    growth: 15.7
  },
  {
    platform: 'TikTok',
    color: '#000000',
    posts: 15,
    engagement: 5240,
    reach: 57000,
    impressions: 75000,
    engagementRate: 6.99,
    avgLikes: 249,
    avgComments: 31,
    avgShares: 69,
    topContentType: 'VIDEO',
    growth: 22.1
  }
]

// Retailer performance data
const retailerPerformance = [
  {
    id: 'retailer-001',
    name: 'Luxury Boutique NYC',
    region: 'East',
    posts: 24,
    engagement: 8420,
    reach: 145000,
    engagementRate: 5.81,
    followers: 89000,
    postingFrequency: 4.2,
    performance: 'excellent',
    growth: 18.5,
    topPlatform: 'Instagram'
  },
  {
    id: 'retailer-002',
    name: 'Fashion Forward LA',
    region: 'West',
    posts: 18,
    engagement: 6240,
    reach: 112000,
    engagementRate: 5.57,
    followers: 67000,
    postingFrequency: 3.8,
    performance: 'excellent',
    growth: 15.2,
    topPlatform: 'TikTok'
  },
  {
    id: 'retailer-003',
    name: 'Style Central Chicago',
    region: 'Central',
    posts: 16,
    engagement: 4680,
    reach: 89000,
    engagementRate: 5.26,
    followers: 54000,
    postingFrequency: 3.2,
    performance: 'good',
    growth: 12.8,
    topPlatform: 'Instagram'
  },
  {
    id: 'retailer-004',
    name: 'Trend Setters Miami',
    region: 'South',
    posts: 22,
    engagement: 7120,
    reach: 128000,
    engagementRate: 5.56,
    followers: 72000,
    postingFrequency: 4.1,
    performance: 'excellent',
    growth: 16.9,
    topPlatform: 'Instagram'
  },
  {
    id: 'retailer-005',
    name: 'Urban Style Dallas',
    region: 'South',
    posts: 14,
    engagement: 3840,
    reach: 68000,
    engagementRate: 5.65,
    followers: 41000,
    postingFrequency: 2.8,
    performance: 'good',
    growth: 11.4,
    topPlatform: 'Facebook'
  }
]

// Trend data for charts - multiple metrics
const trendData = {
  engagementRate: [
    { date: 'Oct 1', current: 2.8, comparison: 2.1 },
    { date: 'Oct 8', current: 3.2, comparison: 2.3 },
    { date: 'Oct 15', current: 3.6, comparison: 2.4 },
    { date: 'Oct 22', current: 3.8, comparison: 2.6 },
    { date: 'Oct 29', current: 3.9, comparison: 2.5 },
    { date: 'Nov 5', current: 4.1, comparison: 2.7 },
    { date: 'Nov 12', current: 3.9, comparison: 2.8 },
    { date: 'Nov 19', current: 4.2, comparison: 2.9 }
  ],
  totalEngagement: [
    { date: 'Oct 1', current: 3200, comparison: 2400 },
    { date: 'Oct 8', current: 4100, comparison: 2800 },
    { date: 'Oct 15', current: 4800, comparison: 3100 },
    { date: 'Oct 22', current: 5200, comparison: 3400 },
    { date: 'Oct 29', current: 5600, comparison: 3600 },
    { date: 'Nov 5', current: 6100, comparison: 3900 },
    { date: 'Nov 12', current: 5900, comparison: 4200 },
    { date: 'Nov 19', current: 6400, comparison: 4500 }
  ],
  totalReach: [
    { date: 'Oct 1', current: 85000, comparison: 62000 },
    { date: 'Oct 8', current: 92000, comparison: 68000 },
    { date: 'Oct 15', current: 98000, comparison: 72000 },
    { date: 'Oct 22', current: 105000, comparison: 76000 },
    { date: 'Oct 29', current: 110000, comparison: 78000 },
    { date: 'Nov 5', current: 118000, comparison: 82000 },
    { date: 'Nov 12', current: 115000, comparison: 85000 },
    { date: 'Nov 19', current: 125000, comparison: 88000 }
  ]
}

// Regional performance data
const regionalData = [
  { region: 'East', retailers: 3, engagement: 15240, reach: 342000, performance: 92 },
  { region: 'West', retailers: 2, engagement: 8960, reach: 198000, performance: 88 },
  { region: 'Central', retailers: 2, engagement: 7420, reach: 156000, performance: 85 },
  { region: 'South', retailers: 3, engagement: 10960, reach: 264000, performance: 89 },
  { region: 'North', retailers: 2, engagement: 2700, reach: 132000, performance: 78 }
]

// AI insights and recommendations
const aiInsights = {
  summary: {
    performance: 'excellent',
    keyMetric: 'Engagement Rate',
    change: '+18.5%',
    period: 'vs last campaign',
    highlight: 'Instagram Reels driving 34% of total engagement'
  },
  drivers: [
    {
      factor: 'Content Strategy',
      impact: '+1.2pp ER',
      description: 'Video content ratio increased to 68%'
    },
    {
      factor: 'Retailer Performance',
      impact: '+0.8pp ER',
      description: 'Top 3 retailers exceeded posting targets'
    },
    {
      factor: 'Platform Mix',
      impact: '+0.5pp ER',
      description: 'TikTok expansion showing strong results'
    }
  ],
  recommendations: [
    {
      priority: 'high',
      action: 'Scale TikTok Investment',
      impact: '+0.6pp ER',
      effort: 'Medium',
      description: 'Expand TikTok content to underperforming retailers'
    },
    {
      priority: 'medium',
      action: 'Optimize Posting Schedule',
      impact: '+0.3pp ER',
      effort: 'Low',
      description: 'Shift 20% of posts to peak engagement hours'
    },
    {
      priority: 'medium',
      action: 'Support Low Performers',
      impact: '+0.4pp ER',
      effort: 'High',
      description: 'Provide content templates to bottom 2 retailers'
    }
  ]
}

interface RedesignedCampaignIntelligenceProps {
  campaignId?: string
}

export default function RedesignedCampaignIntelligence({ campaignId }: RedesignedCampaignIntelligenceProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('last-30-days')
  const [selectedComparison, setSelectedComparison] = useState('holiday-2023')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedRegion, setSelectedRegion] = useState('all')
  const [selectedMetric, setSelectedMetric] = useState<'engagementRate' | 'totalEngagement' | 'totalReach'>('engagementRate')

  // Get current trend data based on selected metric
  const currentTrendData = trendData[selectedMetric]
  
  // Format the metric value for display
  const formatMetricValue = (value: number, metric: string) => {
    switch (metric) {
      case 'engagementRate':
        return `${value}%`
      case 'totalEngagement':
        return value.toLocaleString()
      case 'totalReach':
        return `${(value / 1000).toFixed(0)}K`
      default:
        return value.toString()
    }
  }

  // Get metric label
  const getMetricLabel = (metric: string) => {
    switch (metric) {
      case 'engagementRate':
        return 'Engagement Rate'
      case 'totalEngagement':
        return 'Total Engagement'
      case 'totalReach':
        return 'Total Reach'
      default:
        return metric
    }
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Campaign Intelligence</h1>
          <p className="text-gray-600 mt-1">Advanced analytics and insights for {campaignData.current.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Share Insights
          </Button>
        </div>
      </div>

      {/* AI Smart Summary */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            AI Smart Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What Happened</h4>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {aiInsights.summary.performance.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-600">performance</span>
              </div>
              <p className="text-sm text-gray-700">
                {aiInsights.summary.keyMetric} increased by{' '}
                <span className="font-semibold text-green-600">{aiInsights.summary.change}</span>{' '}
                {aiInsights.summary.period}. {aiInsights.summary.highlight}.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Why It Happened</h4>
              <div className="space-y-2">
                {aiInsights.drivers.map((driver, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{driver.factor}</span>
                    <span className="text-sm font-medium text-blue-600">{driver.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What To Do Next</h4>
              <div className="space-y-2">
                {aiInsights.recommendations.slice(0, 2).map((rec, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{rec.action}</span>
                    <Badge variant="outline" className={
                      rec.priority === 'high' ? 'border-red-200 text-red-700' : 'border-yellow-200 text-yellow-700'
                    }>
                      {rec.priority}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select time range">
                      {timeRanges.find(r => r.id === selectedTimeRange)?.label || 'Last 30 Days'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {timeRanges.map(range => (
                      <SelectItem key={range.id} value={range.id}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <Select value={selectedComparison} onValueChange={setSelectedComparison}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Compare with...">
                      {comparisonCampaigns.find(c => c.id === selectedComparison)?.name || 'Holiday Collection 2023'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {comparisonCampaigns.map(campaign => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Platform">
                      {selectedPlatform === 'all' ? 'All Platforms' : selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Region">
                      {selectedRegion === 'all' ? 'All Regions' : selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                    <SelectItem value="central">Central</SelectItem>
                    <SelectItem value="south">South</SelectItem>
                    <SelectItem value="north">North</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Full Width Trend Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Trend Analysis
              </CardTitle>
              <p className="text-sm text-gray-600">Current vs comparison campaign performance</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select metric">
                    {getMetricLabel(selectedMetric)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engagementRate">Engagement Rate</SelectItem>
                  <SelectItem value="totalEngagement">Total Engagement</SelectItem>
                  <SelectItem value="totalReach">Total Reach</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatMetricValue(value, selectedMetric)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border rounded-lg shadow-lg">
                          <p className="font-medium">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} className="text-sm" style={{ color: entry.color }}>
                              {entry.name}: {formatMetricValue(entry.value as number, selectedMetric)}
                            </p>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#10B981"
                  strokeWidth={4}
                  name="Current Campaign"
                  dot={{ fill: '#10B981', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="comparison"
                  stroke="#6B7280"
                  strokeWidth={3}
                  strokeDasharray="8 4"
                  name={comparisonCampaigns.find(c => c.id === selectedComparison)?.name || 'Comparison'}
                  dot={{ fill: '#6B7280', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Trend Summary */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
            <div className="text-center">
              <div className="text-sm text-gray-600">Current {getMetricLabel(selectedMetric)}</div>
              <div className="text-2xl font-bold text-green-600">
                {formatMetricValue(currentTrendData[currentTrendData.length - 1]?.current || 0, selectedMetric)}
              </div>
              <div className="text-xs text-green-500">Latest period</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">vs Comparison</div>
              <div className="text-2xl font-bold text-blue-600">
                +{(((currentTrendData[currentTrendData.length - 1]?.current || 0) / (currentTrendData[currentTrendData.length - 1]?.comparison || 1) - 1) * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-blue-500">Performance lift</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Trend Direction</div>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-lg font-bold text-green-600">Positive</span>
              </div>
              <div className="text-xs text-green-500">Consistent growth</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Engagement</p>
                <p className="text-2xl font-bold">{performanceOverview.totalEngagement.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+18.5%</span>
                </div>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reach</p>
                <p className="text-2xl font-bold">{(performanceOverview.totalReach / 1000).toFixed(0)}K</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+12.3%</span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold">{performanceOverview.avgEngagementRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+0.8pp</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Retailers</p>
                <p className="text-2xl font-bold">{performanceOverview.activeRetailers}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs text-gray-600">{performanceOverview.postsPublished} posts</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Platform Performance Overview
          </CardTitle>
          <p className="text-sm text-gray-600">Engagement rate and growth by platform</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {platformPerformance.map((platform) => (
              <div key={platform.platform} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: platform.color }}
                  />
                  <div>
                    <p className="font-medium">{platform.platform}</p>
                    <p className="text-xs text-gray-600">{platform.posts} posts</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Engagement Rate</span>
                    <span className="font-semibold">{platform.engagementRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Growth</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span className="text-sm text-green-600">+{platform.growth}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Top Content</span>
                    <span className="text-xs font-medium">{platform.topContentType}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Posting Status Matrix */}
      <ContentPostingMatrix />

      {/* Retailer Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Retailer Performance Analytics
          </CardTitle>
          <p className="text-sm text-gray-600">Detailed performance metrics by retail partner</p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Retailer</th>
                  <th className="text-left p-3">Region</th>
                  <th className="text-left p-3">Posts</th>
                  <th className="text-left p-3">Engagement</th>
                  <th className="text-left p-3">Reach</th>
                  <th className="text-left p-3">ER</th>
                  <th className="text-left p-3">Growth</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {retailerPerformance.map((retailer) => (
                  <tr key={retailer.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{retailer.name}</p>
                        <p className="text-sm text-gray-600">Top: {retailer.topPlatform}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{retailer.region}</Badge>
                    </td>
                    <td className="p-3">{retailer.posts}</td>
                    <td className="p-3">{retailer.engagement.toLocaleString()}</td>
                    <td className="p-3">{(retailer.reach / 1000).toFixed(0)}K</td>
                    <td className="p-3 font-semibold">{retailer.engagementRate}%</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-sm text-green-600">+{retailer.growth}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge variant={retailer.performance === 'excellent' ? 'default' : 'secondary'}>
                        {retailer.performance}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics Tabs */}
      <Tabs defaultValue="attribution" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="content">Content Analysis</TabsTrigger>
          <TabsTrigger value="actions">Action Items</TabsTrigger>
        </TabsList>

        <TabsContent value="attribution" className="space-y-6">
          <AttributionWaterfall />
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <RegionalHeatmap />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Content Performance Analysis
                </CardTitle>
                <p className="text-sm text-gray-600">Performance breakdown by content type and format</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Content Type Performance */}
                  <div>
                    <h4 className="font-semibold mb-4">Content Type Performance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Video Content</p>
                          <p className="text-sm text-gray-600">68% of posts</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">4.8% ER</p>
                          <p className="text-xs text-green-600">+24% vs static</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Image Posts</p>
                          <p className="text-sm text-gray-600">28% of posts</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">3.9% ER</p>
                          <p className="text-xs text-gray-600">baseline</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Carousel Posts</p>
                          <p className="text-sm text-gray-600">4% of posts</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">3.2% ER</p>
                          <p className="text-xs text-red-600">-18% vs baseline</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Platform-Specific Insights */}
                  <div>
                    <h4 className="font-semibold mb-4">Platform-Specific Insights</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-pink-500 rounded-full" />
                          <span className="font-medium">Instagram</span>
                        </div>
                        <p className="text-sm text-gray-700">Reels outperform feed posts by 89%. Stories show 12% higher completion rate.</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          <span className="font-medium">Facebook</span>
                        </div>
                        <p className="text-sm text-gray-700">Video posts generate 3x more shares. Live content shows 67% higher engagement.</p>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-3 h-3 bg-cyan-600 rounded-full" />
                          <span className="font-medium">LinkedIn</span>
                        </div>
                        <p className="text-sm text-gray-700">Professional content and industry insights drive highest engagement rates.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Optimal Posting Times
                </CardTitle>
                <p className="text-sm text-gray-600">Best performing time slots for content</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Tuesday 8PM</p>
                      <p className="text-sm text-green-600">20 posts published</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700">5.4%</p>
                      <p className="text-xs text-green-600">Engagement Rate</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Wednesday 8PM</p>
                      <p className="text-sm text-green-600">17 posts published</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700">5.3%</p>
                      <p className="text-xs text-green-600">Engagement Rate</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Monday 8PM</p>
                      <p className="text-sm text-green-600">18 posts published</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-700">5.2%</p>
                      <p className="text-xs text-green-600">Engagement Rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Recommended Actions
              </CardTitle>
              <p className="text-sm text-gray-600">Data-driven recommendations with estimated impact</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiInsights.recommendations.map((rec, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                          {rec.priority} priority
                        </Badge>
                        <span className="text-sm font-semibold text-green-600">{rec.impact}</span>
                      </div>
                      <h4 className="font-semibold mb-2">{rec.action}</h4>
                      <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Effort: {rec.effort}</span>
                        <Button size="sm" variant="outline">
                          Take Action
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}