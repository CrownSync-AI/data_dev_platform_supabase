'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  TrendingUp, TrendingDown, Target, Lightbulb, AlertTriangle, Trophy, ArrowRight,
  BarChart3, Zap, Calendar as CalendarIcon, Clock, Milestone, Activity,
  TrendingUp as PerformanceUp, Award, Users, DollarSign, Eye, MousePointer
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, Cell,
  ComposedChart, Area, AreaChart, ReferenceLine, RadialBarChart, RadialBar, PieChart,
  Pie, ScatterChart, Scatter, CartesianGrid
} from 'recharts'
import { format, addDays, subDays, differenceInDays, parseISO } from 'date-fns'

// Enhanced campaign data with lifecycle context
const campaignData = {
  current: {
    id: 'spring-2024',
    name: 'Spring Collection 2024',
    startDate: '2024-10-01',
    endDate: '2024-11-04',
    currentDate: '2024-10-20',
    status: 'active',
    performanceScore: 8.7,
    metrics: {
      engagementRate: 2.9,
      reach: 285000,
      spend: 15000,
      conversions: 1247,
      costPerEngagement: 0.61,
      roi: 3.8,
      brandMentions: 1840,
      clickThroughRate: 3.2
    },
    milestones: [
      { date: '2024-10-01', event: 'Campaign Launch', status: 'completed' },
      { date: '2024-10-03', event: 'Day 3 Check', status: 'completed', performance: 'warning' },
      { date: '2024-10-08', event: 'Day 7 Check', status: 'completed', performance: 'success' },
      { date: '2024-10-15', event: 'Day 14 Check', status: 'completed', performance: 'success' },
      { date: '2024-10-22', event: 'Mid-Campaign Review', status: 'pending' },
      { date: '2024-11-01', event: 'Final Optimization', status: 'pending' }
    ]
  },
  comparison: {
    id: 'holiday-2023',
    name: 'Holiday Luxury 2023',
    startDate: '2023-09-24',
    endDate: '2023-10-24',
    performanceScore: 6.4,
    metrics: {
      engagementRate: 1.9,
      reach: 200100,
      spend: 18000,
      conversions: 892,
      costPerEngagement: 1.09,
      roi: 2.1,
      brandMentions: 1200,
      clickThroughRate: 2.1
    }
  },
  benchmark: {
    industryAverage: {
      engagementRate: 2.1,
      costPerEngagement: 0.85,
      roi: 2.8,
      clickThroughRate: 2.5
    }
  }
}

// Time range presets based on campaign lifecycle
const getTimeRangePresets = (campaign: any) => {
  const startDate = parseISO(campaign.startDate)
  const endDate = parseISO(campaign.endDate)
  const currentDate = parseISO(campaign.currentDate)
  const campaignDuration = differenceInDays(endDate, startDate)
  const daysElapsed = differenceInDays(currentDate, startDate)

  const presets = [
    {
      id: 'first-2-weeks',
      label: 'First 2 Weeks',
      description: 'Launch and optimization phase',
      startDate: startDate,
      endDate: addDays(startDate, 13),
      isDefault: campaign.status === 'active' || (campaign.status === 'completed' && campaignDuration > 30)
    },
    {
      id: 'full-campaign',
      label: 'Full Campaign',
      description: 'Complete campaign lifecycle',
      startDate: startDate,
      endDate: endDate,
      isDefault: campaign.status === 'completed' && campaignDuration <= 30
    },
    {
      id: 'last-7-days',
      label: 'Last 7 Days',
      description: 'Recent performance',
      startDate: subDays(currentDate, 6),
      endDate: currentDate,
      isDefault: false
    },
    {
      id: 'last-14-days',
      label: 'Last 14 Days',
      description: 'Two-week view',
      startDate: subDays(currentDate, 13),
      endDate: currentDate,
      isDefault: false
    }
  ]

  return presets
}

// Campaign lifecycle phases
const getCampaignPhase = (campaign: any) => {
  const daysElapsed = differenceInDays(parseISO(campaign.currentDate), parseISO(campaign.startDate))

  if (daysElapsed <= 3) return { phase: 'launch', label: 'Launch Phase', color: 'blue' }
  if (daysElapsed <= 14) return { phase: 'optimization', label: 'Optimization Phase', color: 'orange' }
  if (campaign.status === 'active') return { phase: 'scale', label: 'Scale Phase', color: 'green' }
  return { phase: 'analysis', label: 'Analysis Phase', color: 'purple' }
}

// Enhanced platform performance data for scatter plot
const platformScatterData = [
  { platform: 'Instagram Reels', engagement: 4.2, roi: 3.8, spend: 6000, color: '#E4405F', size: 60 },
  { platform: 'Facebook Video', engagement: 2.3, roi: 2.1, spend: 4500, color: '#1877F2', size: 45 },
  { platform: 'LinkedIn Posts', engagement: 2.1, roi: 4.2, spend: 2000, color: '#0A66C2', size: 25 },
  { platform: 'X Threads', engagement: 1.3, roi: 1.2, spend: 1500, color: '#000000', size: 20 },
  { platform: 'TikTok Videos', engagement: 3.8, roi: 2.9, spend: 1000, color: '#000000', size: 15 }
]

// Campaign performance trend data for line charts
const campaignTrendData = [
  { day: 1, date: 'Oct 1', engagementRate: 1.2, reach: 18500, conversions: 45, spend: 850 },
  { day: 2, date: 'Oct 2', engagementRate: 1.4, reach: 22000, conversions: 58, spend: 950 },
  { day: 3, date: 'Oct 3', engagementRate: 1.5, reach: 25500, conversions: 67, spend: 1100 },
  { day: 4, date: 'Oct 4', engagementRate: 1.8, reach: 28000, conversions: 82, spend: 1250 },
  { day: 5, date: 'Oct 5', engagementRate: 2.1, reach: 32000, conversions: 105, spend: 1400 },
  { day: 6, date: 'Oct 6', engagementRate: 2.3, reach: 35500, conversions: 128, spend: 1550 },
  { day: 7, date: 'Oct 7', engagementRate: 2.3, reach: 38000, conversions: 142, spend: 1700 },
  { day: 8, date: 'Oct 8', engagementRate: 2.5, reach: 42000, conversions: 165, spend: 1850 },
  { day: 9, date: 'Oct 9', engagementRate: 2.7, reach: 45500, conversions: 188, spend: 2000 },
  { day: 10, date: 'Oct 10', engagementRate: 2.8, reach: 48000, conversions: 205, spend: 2150 },
  { day: 11, date: 'Oct 11', engagementRate: 2.9, reach: 52000, conversions: 225, spend: 2300 },
  { day: 12, date: 'Oct 12', engagementRate: 2.9, reach: 54500, conversions: 238, spend: 2450 },
  { day: 13, date: 'Oct 13', engagementRate: 3.1, reach: 58000, conversions: 265, spend: 2600 },
  { day: 14, date: 'Oct 14', engagementRate: 3.1, reach: 61000, conversions: 285, spend: 2750 },
  { day: 15, date: 'Oct 15', engagementRate: 3.2, reach: 64500, conversions: 305, spend: 2900 },
  { day: 16, date: 'Oct 16', engagementRate: 3.0, reach: 67000, conversions: 315, spend: 3050 },
  { day: 17, date: 'Oct 17', engagementRate: 2.9, reach: 69500, conversions: 325, spend: 3200 },
  { day: 18, date: 'Oct 18', engagementRate: 2.9, reach: 72000, conversions: 338, spend: 3350 },
  { day: 19, date: 'Oct 19', engagementRate: 2.9, reach: 74500, conversions: 348, spend: 3500 },
  { day: 20, date: 'Oct 20', engagementRate: 2.9, reach: 77000, conversions: 358, spend: 3650 }
]

// Platform-specific performance trends
const platformTrendData = [
  { day: 1, instagram: 1.8, facebook: 1.2, linkedin: 1.5, x: 1.0 },
  { day: 3, instagram: 2.2, facebook: 1.4, linkedin: 1.8, x: 1.1 },
  { day: 5, instagram: 2.8, facebook: 1.6, linkedin: 2.0, x: 1.2 },
  { day: 7, instagram: 3.2, facebook: 1.8, linkedin: 2.2, x: 1.3 },
  { day: 10, instagram: 3.8, facebook: 2.0, linkedin: 2.1, x: 1.3 },
  { day: 14, instagram: 4.2, facebook: 2.3, linkedin: 2.1, x: 1.3 },
  { day: 17, instagram: 4.0, facebook: 2.2, linkedin: 2.0, x: 1.2 },
  { day: 20, instagram: 4.2, facebook: 2.3, linkedin: 2.1, x: 1.3 }
]

// ROI trend comparison data
const roiTrendData = [
  { week: 'Week 1', currentCampaign: 1.2, previousCampaign: 0.8, industry: 1.0 },
  { week: 'Week 2', currentCampaign: 2.1, previousCampaign: 1.4, industry: 1.2 },
  { week: 'Week 3', currentCampaign: 3.2, previousCampaign: 1.8, industry: 1.5 },
  { week: 'Current', currentCampaign: 3.8, previousCampaign: 2.1, industry: 1.8 }
]

// Performance checkpoints data
const performanceCheckpoints = [
  {
    day: 3,
    date: '2024-10-04',
    expected: 1.8,
    actual: 1.5,
    status: 'warning',
    insight: 'Below expected - Review content strategy',
    recommendation: 'Increase video content ratio'
  },
  {
    day: 7,
    date: '2024-10-08',
    expected: 2.1,
    actual: 2.3,
    status: 'success',
    insight: 'On track - Continue current approach',
    recommendation: 'Scale successful content types'
  },
  {
    day: 14,
    date: '2024-10-15',
    expected: 2.8,
    actual: 3.1,
    status: 'success',
    insight: 'Exceeding expectations - Scale successful tactics',
    recommendation: 'Expand influencer partnerships'
  }
]

// Time-aware attribution data
const timeAwareAttributionData = [
  { period: 'Days 1-7', contentStrategy: 0.3, timing: 0.2, targeting: 0.1, total: 0.6 },
  { period: 'Days 8-14', contentStrategy: 0.3, influencerPartnership: 0.5, audienceExpansion: 0.15, total: 0.95 },
  { period: 'Days 15-21', contentStrategy: 0.2, influencerPartnership: 0.3, viralContent: 0.4, total: 0.9 }
]

// Enhanced recommendations with decision support
const strategicRecommendations = [
  {
    id: 'budget-reallocation',
    priority: 'immediate',
    category: 'Budget Optimization',
    title: 'Reallocate $2K from X to Instagram Reels',
    rationale: 'Instagram Reels showing 4.2% ER vs X at 1.3% ER',
    impact: '+25% overall engagement',
    confidence: 0.92,
    timeframe: 'This week',
    effort: 'Low',
    roi: 3.2,
    riskLevel: 'Low'
  },
  {
    id: 'content-optimization',
    priority: 'medium',
    category: 'Content Strategy',
    title: 'Increase Video Content to 65%',
    rationale: 'Video content driving 62% higher engagement than static posts',
    impact: '+15% engagement rate',
    confidence: 0.87,
    timeframe: 'Next 2 weeks',
    effort: 'Medium',
    roi: 2.8,
    riskLevel: 'Low'
  },
  {
    id: 'platform-expansion',
    priority: 'strategic',
    category: 'Channel Expansion',
    title: 'Develop LinkedIn B2B Strategy',
    rationale: 'Highest ROI platform (4.2) but underutilized',
    impact: '+40% LinkedIn performance',
    confidence: 0.75,
    timeframe: 'Next month',
    effort: 'High',
    roi: 4.5,
    riskLevel: 'Medium'
  }
]

// Success pattern analysis
const successPatterns = {
  currentMatch: 4,
  totalPatterns: 5,
  patterns: [
    { pattern: '60-70% video content', current: '65%', match: true },
    { pattern: '4-5 posts per week', current: '3x/week', match: false },
    { pattern: '2-3 influencer partnerships', current: '3 partnerships', match: true },
    { pattern: 'Tuesday/Wednesday launches', current: 'Tuesday launch', match: true },
    { pattern: '25-45 age demographic', current: '28-42 primary', match: true }
  ]
}

interface TimeRangeSelectorProps {
  campaign: any
  selectedRange: any
  onRangeChange: (range: any) => void
}

const TimeRangeSelector = ({ campaign, selectedRange, onRangeChange }: TimeRangeSelectorProps) => {
  const presets = getTimeRangePresets(campaign)
  const defaultPreset = presets.find(p => p.isDefault) || presets[0]

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Time Range Selection</h3>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.id}
                  variant={selectedRange?.id === preset.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => onRangeChange(preset)}
                  className="text-xs"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {selectedRange ? format(selectedRange.startDate, 'MMM d') : format(defaultPreset.startDate, 'MMM d')} - {' '}
              {selectedRange ? format(selectedRange.endDate, 'MMM d, yyyy') : format(defaultPreset.endDate, 'MMM d, yyyy')}
            </div>
            <div className="text-xs text-gray-600">
              {selectedRange?.description || defaultPreset.description}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface CampaignComparisonSelectorProps {
  comparisonType: string
  onComparisonChange: (type: string) => void
}

const CampaignComparisonSelector = ({ comparisonType, onComparisonChange }: CampaignComparisonSelectorProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Compare Current Campaign</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="previous-campaign"
                name="comparison"
                value="previous-campaign"
                checked={comparisonType === 'previous-campaign'}
                onChange={(e) => onComparisonChange(e.target.value)}
                className="h-4 w-4"
              />
              <label htmlFor="previous-campaign" className="text-sm">
                Previous Campaign <span className="text-gray-500">(Holiday Luxury 2023)</span>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="previous-period"
                name="comparison"
                value="previous-period"
                checked={comparisonType === 'previous-period'}
                onChange={(e) => onComparisonChange(e.target.value)}
                className="h-4 w-4"
              />
              <label htmlFor="previous-period" className="text-sm">
                Previous Time Period <span className="text-gray-500">(Oct 2023)</span>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="industry-benchmark"
                name="comparison"
                value="industry-benchmark"
                checked={comparisonType === 'industry-benchmark'}
                onChange={(e) => onComparisonChange(e.target.value)}
                className="h-4 w-4"
              />
              <label htmlFor="industry-benchmark" className="text-sm">
                Industry Benchmark <span className="text-gray-500">(Luxury Fashion Avg)</span>
              </label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const PlatformPerformanceMatrix = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Platform Performance Matrix
        </CardTitle>
        <p className="text-sm text-gray-600">ROI vs Engagement Rate</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="engagement"
                name="Engagement Rate"
                unit="%"
                domain={[0, 5]}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="roi"
                name="ROI"
                unit="x"
                domain={[0, 5]}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{data.platform}</p>
                        <p className="text-sm">Engagement Rate: {data.engagement}%</p>
                        <p className="text-sm">ROI: {data.roi}x</p>
                        <p className="text-sm">Spend: ${data.spend}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter data={platformScatterData} fill="#8884d8">
                {platformScatterData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Scatter>
              <ReferenceLine x={2.1} stroke="#F59E0B" strokeDasharray="3 3" label="Industry Avg ER" />
              <ReferenceLine y={2.8} stroke="#F59E0B" strokeDasharray="3 3" label="Industry Avg ROI" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="text-sm font-medium text-green-800">High Performance Zone</div>
            <div className="text-xs text-green-600">ER > 3%, ROI > 3x → Scale Budget</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-sm font-medium text-blue-800">Optimization Zone</div>
            <div className="text-xs text-blue-600">High ROI, Lower ER → Expand Reach</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const PerformanceCheckpoints = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Milestone className="h-5 w-5" />
          Campaign Health Checkpoints
        </CardTitle>
        <p className="text-sm text-gray-600">Key performance validation points</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {performanceCheckpoints.map((checkpoint) => (
            <div key={checkpoint.day} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  checkpoint.status === 'success' ? 'bg-green-100 text-green-700' :
                  checkpoint.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  <span className="text-sm font-bold">D{checkpoint.day}</span>
                </div>
                <div>
                  <div className="font-medium">Day {checkpoint.day} Check</div>
                  <div className="text-sm text-gray-600">{checkpoint.insight}</div>
                  <div className="text-xs text-gray-500 mt-1">{checkpoint.recommendation}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{checkpoint.actual}%</div>
                <div className="text-sm text-gray-600">vs {checkpoint.expected}% expected</div>
                <Badge variant={checkpoint.status === 'success' ? 'default' : 'secondary'}>
                  {checkpoint.status === 'success' ? 'On Track' : 'Needs Attention'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// New Line Chart Components
const CampaignPerformanceTrend = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Campaign Performance Trend
        </CardTitle>
        <p className="text-sm text-gray-600">Daily engagement rate progression (20 days)</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={campaignTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                axisLine={{ stroke: '#D1D5DB' }}
                label={{ value: 'Engagement Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{label} (Day {data.day})</p>
                        <p className="text-sm text-green-600">Engagement Rate: {data.engagementRate}%</p>
                        <p className="text-sm text-blue-600">Reach: {data.reach.toLocaleString()}</p>
                        <p className="text-sm text-purple-600">Conversions: {data.conversions}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="engagementRate"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2 }}
              />
              <ReferenceLine y={2.1} stroke="#F59E0B" strokeDasharray="5 5" label="Industry Avg" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-sm text-gray-600">Peak Performance</div>
            <div className="font-bold text-green-600">3.2% ER</div>
            <div className="text-xs text-gray-500">Day 15</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Growth Rate</div>
            <div className="font-bold text-blue-600">+142%</div>
            <div className="text-xs text-gray-500">vs Day 1</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Consistency</div>
            <div className="font-bold text-purple-600">Above Avg</div>
            <div className="text-xs text-gray-500">15+ days</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const PlatformPerformanceTrends = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Platform Performance Trends
        </CardTitle>
        <p className="text-sm text-gray-600">Engagement rate by platform over campaign lifecycle</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={platformTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                label={{ value: 'Campaign Day', position: 'insideBottom', offset: -5 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                label={{ value: 'Engagement Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">Day {label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}%
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
                dataKey="instagram"
                stroke="#E4405F"
                strokeWidth={3}
                name="Instagram"
                dot={{ fill: '#E4405F', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="facebook"
                stroke="#1877F2"
                strokeWidth={3}
                name="Facebook"
                dot={{ fill: '#1877F2', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="linkedin"
                stroke="#0A66C2"
                strokeWidth={3}
                name="LinkedIn"
                dot={{ fill: '#0A66C2', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="x"
                stroke="#000000"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="X Platform"
                dot={{ fill: '#000000', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-6 mt-4 pt-4 border-t text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#E4405F]"></div>
            <span>Instagram (Leader)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#1877F2]"></div>
            <span>Facebook (Steady)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#0A66C2]"></div>
            <span>LinkedIn (Opportunity)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-black"></div>
            <span>X Platform (Declining)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const ROIComparisonChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          ROI Performance Comparison
        </CardTitle>
        <p className="text-sm text-gray-600">Weekly ROI progression vs benchmarks</p>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={roiTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="#6B7280"
                label={{ value: 'ROI (x)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{label}</p>
                        {payload.map((entry, index) => (
                          <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: {entry.value}x ROI
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
                dataKey="currentCampaign"
                stroke="#10B981"
                strokeWidth={4}
                name="Current Campaign"
                dot={{ fill: '#10B981', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="previousCampaign"
                stroke="#6B7280"
                strokeWidth={3}
                strokeDasharray="8 4"
                name="Previous Campaign"
                dot={{ fill: '#6B7280', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="industry"
                stroke="#F59E0B"
                strokeWidth={2}
                strokeDasharray="4 4"
                name="Industry Average"
                dot={{ fill: '#F59E0B', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-sm text-gray-600">Current ROI</div>
            <div className="font-bold text-green-600">3.8x</div>
            <div className="text-xs text-green-500">+81% vs previous</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">vs Industry</div>
            <div className="font-bold text-blue-600">+111%</div>
            <div className="text-xs text-blue-500">Above benchmark</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Growth Trend</div>
            <div className="font-bold text-purple-600">↗ Accelerating</div>
            <div className="text-xs text-purple-500">Week over week</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function EnhancedCampaignIntelligenceDashboard() {
  const [comparisonType, setComparisonType] = useState('previous-campaign')
  const [selectedTimeRange, setSelectedTimeRange] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const currentPhase = getCampaignPhase(campaignData.current)
  const timePresets = getTimeRangePresets(campaignData.current)
  const defaultTimeRange = timePresets.find(p => p.isDefault) || timePresets[0]

  const effectiveTimeRange = selectedTimeRange || defaultTimeRange

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Header with Campaign Context */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{campaignData.current.name}</h1>
              <Badge
                variant="outline"
                className={`${
                  currentPhase.color === 'blue' ? 'border-blue-500 text-blue-700' :
                  currentPhase.color === 'orange' ? 'border-orange-500 text-orange-700' :
                  currentPhase.color === 'green' ? 'border-green-500 text-green-700' :
                  'border-purple-500 text-purple-700'
                }`}
              >
                {currentPhase.label}
              </Badge>
            </div>
            <p className="text-gray-600">
              {format(parseISO(campaignData.current.startDate), 'MMM d')} - {format(parseISO(campaignData.current.endDate), 'MMM d, yyyy')}
              {campaignData.current.status === 'active' && (
                <span className="ml-2 text-green-600">• Day {differenceInDays(parseISO(campaignData.current.currentDate), parseISO(campaignData.current.startDate)) + 1} of {differenceInDays(parseISO(campaignData.current.endDate), parseISO(campaignData.current.startDate)) + 1}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{campaignData.current.performanceScore}/10</div>
              <div className="text-sm text-gray-600">Performance Score</div>
            </div>
          </div>
        </div>

        {/* Time Range Management */}
        <TimeRangeSelector
          campaign={campaignData.current}
          selectedRange={selectedTimeRange}
          onRangeChange={setSelectedTimeRange}
        />
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Executive Summary</TabsTrigger>
          <TabsTrigger value="performance">Performance Drivers</TabsTrigger>
          <TabsTrigger value="comparison">Detailed Comparison</TabsTrigger>
          <TabsTrigger value="recommendations">Strategic Actions</TabsTrigger>
        </TabsList>

        {/* Level 1: Executive Summary (10-second scan) */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-lg font-medium text-green-800">Campaign Performance Score</div>
                    <div className="text-4xl font-bold text-green-700 mb-2">{campaignData.current.performanceScore}/10</div>
                  </div>
                  <div className="w-24 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%"
                                    data={[{ value: campaignData.current.performanceScore * 10, fill: '#10B981' }]}>
                        <RadialBar dataKey="value" cornerRadius={10} fill="#10B981" />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">vs Previous Campaign:</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-bold">+{((campaignData.current.performanceScore - campaignData.comparison.performanceScore) / campaignData.comparison.performanceScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">vs Industry Benchmark:</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-bold">+12%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">vs Budget Target:</span>
                    <div className="flex items-center gap-1 text-green-600">
                      <span className="font-bold">15% under budget ✅</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <CampaignComparisonSelector
              comparisonType={comparisonType}
              onComparisonChange={setComparisonType}
            />
          </div>

          {/* Level 2: Performance Drivers (30-second analysis) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-green-500 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-medium uppercase tracking-wide text-green-700">Top Performer</span>
                </div>
                <div className="font-bold text-lg">Instagram Reels</div>
                <div className="text-2xl font-bold text-green-700">4.2% ER</div>
                <div className="text-sm text-green-600">(+62%)</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-yellow-500 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-xs font-medium uppercase tracking-wide text-yellow-700">Needs Focus</span>
                </div>
                <div className="font-bold text-lg">X Platform</div>
                <div className="text-2xl font-bold text-yellow-700">1.3% ER</div>
                <div className="text-sm text-yellow-600">(-15%)</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-blue-500 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium uppercase tracking-wide text-blue-700">Opportunity</span>
                </div>
                <div className="font-bold text-lg">LinkedIn B2B</div>
                <div className="text-2xl font-bold text-blue-700">2.1% → 3.5%</div>
                <div className="text-sm text-blue-600">Potential</div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Line Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CampaignPerformanceTrend />
            <PlatformPerformanceTrends />
          </div>

          {/* ROI Comparison Chart */}
          <ROIComparisonChart />
        </TabsContent>

        {/* Level 2: Performance Drivers */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlatformPerformanceMatrix />
            <PerformanceCheckpoints />
          </div>
        </TabsContent>

        {/* Level 3: Detailed Comparison */}
        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Comparison</CardTitle>
                <p className="text-sm text-gray-600">
                  {effectiveTimeRange.label} • {format(effectiveTimeRange.startDate, 'MMM d')} - {format(effectiveTimeRange.endDate, 'MMM d, yyyy')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700 mb-1">{campaignData.current.name}</div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-lg font-bold">{campaignData.current.metrics.engagementRate}%</div>
                          <div className="text-xs text-gray-600">Engagement</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{(campaignData.current.metrics.reach / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-600">Reach</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">${(campaignData.current.metrics.spend / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-600">Spend</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-700 mb-1">{campaignData.comparison.name}</div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-lg font-bold">{campaignData.comparison.metrics.engagementRate}%</div>
                          <div className="text-xs text-gray-600">Engagement</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{(campaignData.comparison.metrics.reach / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-600">Reach</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">${(campaignData.comparison.metrics.spend / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-gray-600">Spend</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    <div className="text-sm font-medium">Key Differences:</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span>+40% Instagram Engagement (Video content)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">✅</span>
                        <span>+25% Influencer partnerships</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-600">⚠️</span>
                        <span>-15% Facebook reach (Algorithm change)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">📊</span>
                        <span>25% Higher spend efficiency</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Success Pattern Recognition</CardTitle>
                <p className="text-sm text-gray-600">Your winning formula analysis</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Pattern Match Score</span>
                      <span className="text-2xl font-bold text-green-600">{successPatterns.currentMatch}/{successPatterns.totalPatterns}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(successPatterns.currentMatch / successPatterns.totalPatterns) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {successPatterns.patterns.map((pattern, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                        <div className="flex items-center gap-2">
                          <span className={pattern.match ? 'text-green-600' : 'text-red-600'}>
                            {pattern.match ? '✅' : '❌'}
                          </span>
                          <span className="text-sm">{pattern.pattern}</span>
                        </div>
                        <span className="text-xs text-gray-600">{pattern.current}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Level 4: Strategic Recommendations */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Strategic Recommendations
              </CardTitle>
              <p className="text-sm text-gray-600">Data-driven actions with confidence scores and ROI projections</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {strategicRecommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={
                            rec.priority === 'immediate' ? 'destructive' :
                            rec.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {rec.priority === 'immediate' ? 'URGENT' :
                             rec.priority === 'medium' ? 'THIS WEEK' : 'STRATEGIC'}
                          </Badge>
                          <Badge variant="outline">{rec.category}</Badge>
                          <span className="text-sm text-gray-500">
                            {Math.round(rec.confidence * 100)}% confidence
                          </span>
                        </div>
                        <h4 className="font-bold text-lg mb-2">{rec.title}</h4>
                        <p className="text-gray-600 mb-3">{rec.rationale}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-green-600">{rec.roi}x ROI</div>
                        <div className="text-xs text-gray-500">Projected</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-700">{rec.impact}</div>
                        <div className="text-xs text-blue-600">Expected Impact</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-lg font-bold">{rec.timeframe}</div>
                        <div className="text-xs text-gray-600">Timeline</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded">
                        <div className="text-lg font-bold text-yellow-700">{rec.effort}</div>
                        <div className="text-xs text-yellow-600">Effort Level</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-700">{rec.riskLevel}</div>
                        <div className="text-xs text-green-600">Risk Level</div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>
                        Implement Recommendation
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}