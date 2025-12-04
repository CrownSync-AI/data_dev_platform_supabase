'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  TrendingUp, Target, BarChart3, Calendar, Filter, Users, Eye, MessageCircle,
  ExternalLink, Download, ArrowUpDown, ArrowUp, ArrowDown,
  Instagram, Facebook, Linkedin, MapPin, Check, ChevronsUpDown,
  Bell, Trophy, AlertTriangle, Info
} from 'lucide-react'
import { toast } from "sonner"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip,
  CartesianGrid
} from 'recharts'
import RegionalHeatmap from '@/components/campaigns/brand-view/intelligence/RegionalHeatmap'
import PlatformPostingMatrix from './PlatformPostingMatrix'
import {
  retailerPerformance as importedRetailerPerformance,
  platformPerformance as importedPlatformPerformance,
  calculateRegionalData
} from '@/lib/brand-campaign-data'
// import ContentTimingHeatmap from '@/components/campaigns/brand-view/intelligence/ContentTimingHeatmap'

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
  { id: 'campaign-start', label: 'Campaign Start → Current', days: null },
  { id: 'first-7-days', label: 'First 7 Days', days: 7 },
  { id: 'first-30-days', label: 'First 30 Days', days: 30 },
  { id: 'first-90-days', label: 'First 90 Days', days: 90 }
]

// Comparison campaigns
const comparisonCampaigns = [
  { id: 'holiday-2023', name: 'Holiday Collection 2023', period: 'Oct-Dec 2023', startDate: '2023-10-01' },
  { id: 'summer-2024', name: 'Summer Collection 2024', period: 'Jun-Aug 2024', startDate: '2024-06-01' },
  { id: 'spring-2023', name: 'Spring Collection 2023', period: 'Mar-May 2023', startDate: '2023-03-01' }
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
const platformPerformance = importedPlatformPerformance

// Use centralized data source
const retailerPerformance = importedRetailerPerformance
const regionalData = calculateRegionalData()




interface RedesignedCampaignIntelligenceProps {
  campaignId?: string
  onBack?: () => void
}

export default function RedesignedCampaignIntelligence({ campaignId, onBack }: RedesignedCampaignIntelligenceProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState('campaign-start')
  const [selectedComparison, setSelectedComparison] = useState('holiday-2023')
  const [open, setOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [selectedMetric, setSelectedMetric] = useState<'engagementRate' | 'totalEngagement' | 'totalReach'>('engagementRate')
  const [sortColumn, setSortColumn] = useState<'name' | 'posts' | 'engagement' | 'reach' | 'engagementRate' | 'growth'>('engagementRate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Log campaignId for debugging/verification
  useEffect(() => {
    if (campaignId) {
      console.log('Loading analytics for campaign:', campaignId)
    }
  }, [campaignId])

  // Generate trend data based on selected time range
  const generateTrendData = (timeRange: string, metric: 'engagementRate' | 'totalEngagement' | 'totalReach') => {
    const range = timeRanges.find(r => r.id === timeRange)
    const comparison = comparisonCampaigns.find(c => c.id === selectedComparison)

    const currentStart = new Date(campaignData.current.startDate)
    const comparisonStart = comparison && comparison.startDate ? new Date(comparison.startDate) : new Date(currentStart)

    // Determine number of days to show
    let daysToShow = 30 // Default

    if (range?.days) {
      daysToShow = range.days
    } else {
      // Campaign Start -> Current
      // Calculate days from start to now (or end date if ended)
      const end = new Date() // or campaignData.current.endDate if exists and passed
      const diffTime = Math.abs(end.getTime() - currentStart.getTime())
      daysToShow = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    // Calculate data points (daily or weekly depending on duration)
    // If > 60 days, weekly. Else daily.
    const isWeekly = daysToShow > 60
    const interval = isWeekly ? 7 : 1
    const numPoints = Math.ceil(daysToShow / interval)

    const data = []

    // Base values
    let comparisonMultiplier = 1;
    if (selectedComparison === 'holiday-2023') comparisonMultiplier = 1.2;
    if (selectedComparison === 'summer-2024') comparisonMultiplier = 0.9;
    if (selectedComparison === 'spring-2023') comparisonMultiplier = 0.8;

    const baseValues = {
      engagementRate: { current: 2.8, comparison: 2.1 * comparisonMultiplier, growth: 0.15 },
      totalEngagement: { current: 3200, comparison: 2400 * comparisonMultiplier, growth: 400 },
      totalReach: { current: 85000, comparison: 62000 * comparisonMultiplier, growth: 5000 }
    }
    const base = baseValues[metric]

    for (let i = 0; i < numPoints; i++) {
      const daysOffset = i * interval

      // Current Date
      const currentDate = new Date(currentStart)
      currentDate.setDate(currentDate.getDate() + daysOffset)

      // Comparison Date
      const comparisonDate = new Date(comparisonStart)
      comparisonDate.setDate(comparisonDate.getDate() + daysOffset)

      // Format dates
      const dateLabel = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const comparisonDateLabel = comparisonDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

      // Calculate values (mock logic)
      const progress = i / numPoints
      const variance = (Math.sin(i * 0.8) * 0.1 + 1)

      data.push({
        date: dateLabel,
        comparisonDate: comparisonDateLabel,
        current: Number((base.current + (base.growth * progress * numPoints * variance)).toFixed(metric === 'engagementRate' ? 1 : 0)),
        comparison: Number((base.comparison + (base.growth * 0.6 * progress * numPoints * variance)).toFixed(metric === 'engagementRate' ? 1 : 0))
      })
    }

    return data
  }

  // Get current trend data based on selected metric and time range
  const currentTrendData = generateTrendData(selectedTimeRange, selectedMetric)

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

  // Handle column sorting
  const handleSort = (column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  // Sort retailer data
  const sortedRetailerPerformance = [...retailerPerformance].sort((a, b) => {
    let aValue: number | string = 0
    let bValue: number | string = 0

    switch (sortColumn) {
      case 'name':
        aValue = a.name
        bValue = b.name
        break
      case 'posts':
        aValue = a.posts
        bValue = b.posts
        break
      case 'engagement':
        aValue = a.engagement
        bValue = b.engagement
        break
      case 'reach':
        aValue = a.reach
        bValue = b.reach
        break
      case 'engagementRate':
        aValue = a.engagementRate
        bValue = b.engagementRate
        break
      case 'growth':
        aValue = a.growth
        bValue = b.growth
        break
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    return sortDirection === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number)
  })

  // Calculate Performance Score
  const maxValues = {
    engagement: Math.max(...retailerPerformance.map(r => r.engagement)),
    reach: Math.max(...retailerPerformance.map(r => r.reach)),
    engagementRate: Math.max(...retailerPerformance.map(r => r.engagementRate)),
    growth: Math.max(...retailerPerformance.map(r => r.growth))
  }

  const scoredRetailers = retailerPerformance.map(r => {
    const score = (
      ((r.engagementRate / maxValues.engagementRate) * 40) +
      ((r.growth / maxValues.growth) * 30) +
      ((r.engagement / maxValues.engagement) * 20) +
      ((r.reach / maxValues.reach) * 10)
    )
    return { ...r, score: Math.round(score) }
  })

  const performanceSorted = [...scoredRetailers].sort((a, b) => b.score - a.score)
  const topPerformers = performanceSorted.slice(0, 5)
  const bottomPerformers = performanceSorted.slice(-5).reverse()

  const handleSendReminder = (retailerName?: string) => {
    if (retailerName) {
      toast.success(`Reminder sent to ${retailerName}`)
    } else {
      toast.success(`Reminders sent to ${bottomPerformers.length} retailers`)
    }
  }

  // Render sort icon
  const SortIcon = ({ column }: { column: typeof sortColumn }) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="h-3 w-3 text-gray-400" />
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="h-3 w-3 text-blue-600" />
      : <ArrowDown className="h-3 w-3 text-blue-600" />
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 text-gray-500 hover:text-gray-900">
              <ArrowUp className="h-4 w-4 rotate-[-90deg] mr-1" />
              Back to Dashboard
            </Button>
          )}
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white p-1 border border-gray-200 rounded-lg shadow-sm w-fit h-auto">
          <TabsTrigger value="overview" className="px-4 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Overview</TabsTrigger>
          <TabsTrigger value="platforms" className="px-4 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Platform Intelligence</TabsTrigger>
          <TabsTrigger value="retailers" className="px-4 py-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Retailer Network</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Full Width Trend Chart with Integrated Filters */}

          {/* Full Width Trend Chart with Integrated Filters */}
          <Card className="overflow-hidden">
            {/* Integrated Filter Bar */}
            <div className="border-b bg-gray-50/40 p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {/* Time Range Filter */}
                  {/* Time Range Filter */}
                  <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                    <SelectTrigger className="w-[260px]">
                      <div className="flex items-center gap-2 truncate">
                        <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
                        <SelectValue placeholder="Select time range">
                          {timeRanges.find(r => r.id === selectedTimeRange)?.label || 'Campaign Start'}
                        </SelectValue>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {timeRanges.map(range => (
                        <SelectItem key={range.id} value={range.id}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Comparison Filter - Combobox */}
                  {/* Comparison Filter - Combobox */}
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[260px] justify-between font-normal"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <BarChart3 className="h-4 w-4 text-gray-500 shrink-0" />
                          <span className="truncate">
                            {selectedComparison
                              ? comparisonCampaigns.find((c) => c.id === selectedComparison)?.name
                              : "Select campaign..."}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0">
                      <Command>
                        <CommandInput placeholder="Search campaign..." />
                        <CommandList>
                          <CommandEmpty>No campaign found.</CommandEmpty>
                          <CommandGroup>
                            {comparisonCampaigns.map((campaign) => (
                              <CommandItem
                                key={campaign.id}
                                value={campaign.id}
                                onSelect={(currentValue) => {
                                  setSelectedComparison(currentValue === selectedComparison ? "" : currentValue)
                                  setOpen(false)
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    selectedComparison === campaign.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {campaign.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                </div>

                {/* Platform Filter */}
                <div className="flex items-center gap-2 bg-white rounded-md border px-3 py-1.5 shadow-sm hover:border-blue-300 transition-colors">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="w-[130px] border-none h-6 p-0 focus:ring-0 text-sm font-medium text-gray-700">
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
              </div>
            </div>

            <CardHeader className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-gray-700" />
                    Performance Trend Analysis
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Current vs comparison campaign performance</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">Metric:</span>
                  <Select value={selectedMetric} onValueChange={(value: any) => setSelectedMetric(value)}>
                    <SelectTrigger className="w-[180px]">
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
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border rounded-lg shadow-lg">
                              <p className="font-medium text-gray-900">{label}</p>
                              <div className="space-y-1 mt-2">
                                {payload.map((entry, index) => (
                                  <div key={index} className="flex flex-col">
                                    <div className="flex items-center justify-between gap-4">
                                      <span className="text-sm" style={{ color: entry.color }}>
                                        {entry.name}:
                                      </span>
                                      <span className="text-sm font-bold" style={{ color: entry.color }}>
                                        {formatMetricValue(entry.value as number, selectedMetric)}
                                      </span>
                                    </div>
                                    {entry.dataKey === 'comparison' && (
                                      <span className="text-xs text-gray-400">
                                        ({data.comparisonDate})
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Engagement</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{performanceOverview.totalEngagement.toLocaleString()}</h3>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-full">
                    <MessageCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">+18.5%</span>
                  <span className="text-sm text-gray-400 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Reach</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{(performanceOverview.totalReach / 1000).toFixed(0)}K</h3>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-full">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">+12.3%</span>
                  <span className="text-sm text-gray-400 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Engagement Rate</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{performanceOverview.avgEngagementRate}%</h3>
                  </div>
                  <div className="p-2 bg-green-50 rounded-full">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">+0.8pp</span>
                  <span className="text-sm text-gray-400 ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Retailers</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{performanceOverview.activeRetailers}</h3>
                  </div>
                  <div className="p-2 bg-orange-50 rounded-full">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4">
                  <span className="text-sm font-medium text-gray-600">{performanceOverview.postsPublished}</span>
                  <span className="text-sm text-gray-400">total posts published</span>
                </div>
              </CardContent>
            </Card>
          </div>

        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          {/* Platform Performance */}
          <Card className="border-none shadow-none bg-transparent">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-gray-700" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Platform Performance Overview</h3>
                <p className="text-sm text-gray-500">Engagement rate and growth metrics by platform</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {platformPerformance.map((platform) => (
                <Card key={platform.platform} className="shadow-sm hover:shadow-md transition-all duration-200 border-gray-200 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-3 h-3 rounded-full ring-4 ring-opacity-20"
                        style={{ backgroundColor: platform.color, '--tw-ring-color': platform.color } as any}
                      />
                      <div>
                        <h4 className="font-bold text-gray-900">{platform.platform}</h4>
                        <p className="text-xs text-gray-500 font-medium">{platform.posts} posts</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-sm text-gray-500">Engagement Rate</span>
                          <span className="text-xl font-bold text-gray-900">{platform.engagementRate}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${(platform.engagementRate / 8) * 100}%`, backgroundColor: platform.color }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                        <span className="text-sm text-gray-500">Growth</span>
                        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-bold text-green-700">+{platform.growth}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Top Content</span>
                        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded uppercase tracking-wide">
                          {platform.topContentType}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Card>

          {/* Platform Posting Status Matrix */}
          <PlatformPostingMatrix />

        </TabsContent>

        <TabsContent value="retailers" className="space-y-6">
          {/* Performance Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card className="border-none shadow-md bg-gradient-to-br from-green-50 to-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                    <Trophy className="h-5 w-5 text-green-600" />
                    Top Performers
                  </CardTitle>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-green-600/50 hover:text-green-600 hover:bg-green-50">
                        <Info className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-semibold">Performance Score Calculation</p>
                        <ul className="text-xs space-y-1 list-disc pl-4">
                          <li>Engagement Rate (40%)</li>
                          <li>Growth (30%)</li>
                          <li>Total Engagement (20%)</li>
                          <li>Total Reach (10%)</li>
                        </ul>
                        <p className="text-xs text-gray-400 mt-2">Scores are normalized relative to the top performer.</p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.map((retailer, index) => (
                    <div key={retailer.id} className="flex items-center justify-between bg-white/60 p-3 rounded-lg border border-green-100/50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-bold text-xs shadow-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{retailer.name}</p>
                          <p className="text-xs text-gray-500">{retailer.region}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-lg font-bold text-green-700">{retailer.score}</span>
                          <span className="text-xs text-green-600/70 mb-0.5">/100</span>
                        </div>
                        <p className="text-xs text-green-600 font-medium">{retailer.engagementRate}% ER</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bottom Performers */}
            <Card className="border-none shadow-md bg-gradient-to-br from-red-50 to-white">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg text-red-800">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Needs Attention
                  </CardTitle>
                  <Button size="sm" variant="outline" className="bg-white hover:bg-red-50 text-red-700 border-red-200 h-8" onClick={() => handleSendReminder()}>
                    <Bell className="h-3.5 w-3.5 mr-2" />
                    Remind All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bottomPerformers.map((retailer, index) => (
                    <div key={retailer.id} className="flex items-center justify-between bg-white/60 p-3 rounded-lg border border-red-100/50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 font-bold text-xs shadow-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{retailer.name}</p>
                          <p className="text-xs text-gray-500">{retailer.region}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-lg font-bold text-red-700">{retailer.score}</span>
                            <span className="text-xs text-red-600/70 mb-0.5">/100</span>
                          </div>
                          <p className="text-xs text-red-600 font-medium">Score</p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={() => handleSendReminder(retailer.name)}>
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Retailer Performance Table */}
          <Card className="overflow-hidden border-none shadow-lg ring-1 ring-black/5">
            <CardHeader className="border-b border-gray-100 bg-gray-50/30 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Users className="h-5 w-5 text-indigo-600" />
                    </div>
                    Retailer Performance Analytics
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">Detailed performance metrics by retail partner</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8 gap-2 bg-white">
                    <Download className="h-3.5 w-3.5" />
                    Export Data
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/50">
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('name')}>
                        <div className="flex items-center gap-1">Retailer <SortIcon column="name" /></div>
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Region</th>
                      <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('posts')}>
                        <div className="flex items-center justify-end gap-1">Posts <SortIcon column="posts" /></div>
                      </th>
                      <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('engagement')}>
                        <div className="flex items-center justify-end gap-1">Engagement <SortIcon column="engagement" /></div>
                      </th>
                      <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('reach')}>
                        <div className="flex items-center justify-end gap-1">Reach <SortIcon column="reach" /></div>
                      </th>
                      <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('engagementRate')}>
                        <div className="flex items-center justify-end gap-1">ER <SortIcon column="engagementRate" /></div>
                      </th>
                      <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700" onClick={() => handleSort('growth')}>
                        <div className="flex items-center justify-end gap-1">Growth <SortIcon column="growth" /></div>
                      </th>
                      <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sortedRetailerPerformance.map((retailer) => (
                      <tr key={retailer.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm border border-white shadow-sm">
                              {retailer.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{retailer.name}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                {retailer.topPlatform === 'Instagram' && <Instagram className="w-3 h-3 text-pink-500" />}
                                {retailer.topPlatform === 'Facebook' && <Facebook className="w-3 h-3 text-blue-600" />}
                                {retailer.topPlatform === 'LinkedIn' && <Linkedin className="w-3 h-3 text-blue-700" />}
                                {retailer.topPlatform}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-none font-normal">
                            {retailer.region}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-right font-medium text-gray-600">{retailer.posts}</td>
                        <td className="py-4 px-6 text-right font-medium text-gray-600">{retailer.engagement.toLocaleString()}</td>
                        <td className="py-4 px-6 text-right font-medium text-gray-600">{(retailer.reach / 1000).toFixed(0)}K</td>
                        <td className="py-4 px-6 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                            {retailer.engagementRate}%
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-1 text-green-600">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span className="text-sm font-semibold">+{retailer.growth}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${retailer.performance === 'excellent'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${retailer.performance === 'excellent' ? 'bg-green-500' : 'bg-yellow-500'
                              }`} />
                            {retailer.performance.charAt(0).toUpperCase() + retailer.performance.slice(1)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Regional Performance Analysis */}
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-t-lg" />
            <Card className="overflow-hidden border-none shadow-lg ring-1 ring-black/5">
              <CardHeader className="border-b border-gray-100 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-cyan-50/50 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-sm">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      Regional Performance Analysis
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-2">
                      Geographic insights and performance metrics across U.S. regions
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 px-3 py-1.5">
                      <MapPin className="h-3.5 w-3.5 mr-1.5" />
                      {regionalData.length} Regions
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <RegionalHeatmap regionalData={regionalData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div >
  )
}