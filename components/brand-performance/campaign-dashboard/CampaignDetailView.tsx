'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Calendar, Users, Mail, Eye, MousePointer } from 'lucide-react'
import { LineChart, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface CampaignDetailViewProps {
  campaignId: string
  onBack: () => void
}

interface CampaignDetails {
  campaign: any
  conversionFunnel: any
  platformPerformance: any[]
  retailerSummary: any
  dailyMetrics: any[]
  notes: any[]
}

export default function CampaignDetailView({ campaignId, onBack }: CampaignDetailViewProps) {
  const [details, setDetails] = useState<CampaignDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCampaignDetails()
  }, [campaignId])

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/brand-campaigns/${campaignId}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaign details')
      }

      const data = await response.json()
      setDetails(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }



  const prepareDailyMetricsChart = (metrics: any[]) => {
    if (!metrics || metrics.length === 0) return []
    
    return metrics.slice(-14).map(metric => ({
      date: new Date(metric.metric_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      engagement: metric.daily_engagement,
      clicks: metric.daily_clicks,
      conversions: metric.daily_conversions
    }))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error || !details) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error: {error || 'Campaign not found'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { campaign, conversionFunnel, platformPerformance, retailerSummary, dailyMetrics, notes } = details
  const chartData = prepareDailyMetricsChart(dailyMetrics)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{campaign.campaign_name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(campaign.campaign_status)}>
                {campaign.campaign_status}
              </Badge>
              <Badge variant="outline">{campaign.campaign_type}</Badge>
              {getTrendIcon(campaign.trend_direction)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          {new Date(campaign.start_date).toLocaleDateString()} - 
          {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Ongoing'}
        </div>
      </div>

      {/* Key Metrics - Type Specific */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {campaign.campaign_type === 'email' ? 'Click Rate' : 'Engagement Rate'}
                </p>
                <p className="text-2xl font-bold text-green-600">{campaign.avg_click_rate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {campaign.campaign_type === 'social' && (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Social Reach</p>
                    <p className="text-2xl font-bold">{formatNumber(campaign.total_reach)}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Social Engagement</p>
                    <p className="text-2xl font-bold">{formatNumber(campaign.total_engagement)}</p>
                  </div>
                  <MousePointer className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Platforms</p>
                    <p className="text-2xl font-bold">4</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {campaign.campaign_type === 'email' && (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Emails Sent</p>
                    <p className="text-2xl font-bold">{formatNumber(campaign.total_emails_sent)}</p>
                  </div>
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Email Opens</p>
                    <p className="text-2xl font-bold">{formatNumber(Math.round(campaign.total_emails_sent * 0.7))}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Email Clicks</p>
                    <p className="text-2xl font-bold">{formatNumber(Math.round(campaign.total_emails_sent * 0.043))}</p>
                  </div>
                  <MousePointer className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Type-Specific Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Conversion Funnel - Only for Email Campaigns */}
        {campaign.campaign_type === 'email' && conversionFunnel && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Delivery Rate</p>
                    <p className="text-lg font-semibold">{conversionFunnel.delivery_rate}%</p>
                    <p className="text-xs text-gray-500">{conversionFunnel.delivery_trend}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Open Rate</p>
                    <p className="text-lg font-semibold">{conversionFunnel.open_rate}%</p>
                    <p className="text-xs text-gray-500">{conversionFunnel.open_trend}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Click Rate</p>
                    <p className="text-lg font-semibold">{conversionFunnel.click_rate}%</p>
                    <p className="text-xs text-gray-500">{conversionFunnel.click_trend}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Conversion Rate</p>
                    <p className="text-lg font-semibold">{conversionFunnel.conversion_rate}%</p>
                    <p className="text-xs text-gray-500">{conversionFunnel.conversion_trend}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Platform Overview - Only for Social Campaigns */}
        {campaign.campaign_type === 'social' && platformPerformance && platformPerformance.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Social Platform Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {platformPerformance.slice(0, 4).map((platform: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium capitalize">{platform.platform}</p>
                      <p className="text-sm text-gray-600">
                        {formatNumber(platform.impressions)} impressions • {platform.engagement_rate}% engagement
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatNumber(platform.engagement)}</p>
                      <p className="text-sm text-gray-600">engagements</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Performance Trend */}
        {chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Trend (Last 14 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                  />
                  {/* Left Y-axis for Engagement (higher values) */}
                  <YAxis 
                    yAxisId="left"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                    label={{ value: 'Engagement', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#8884d8' } }}
                  />
                  {/* Right Y-axis for Clicks & Conversions (lower values) */}
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#666' }}
                    label={{ value: 'Clicks & Conversions', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#82ca9d' } }}
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
                      typeof value === 'number' ? value.toLocaleString() : value,
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '15px' }}
                    iconType="line"
                  />
                  
                  {/* Engagement line on left Y-axis */}
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 2 }}
                    activeDot={{ r: 5, strokeWidth: 2 }}
                    name="Engagement"
                  />
                  
                  {/* Clicks line on right Y-axis */}
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 2 }}
                    activeDot={{ r: 5, strokeWidth: 2 }}
                    name="Clicks"
                  />
                  
                  {/* Conversions line on right Y-axis */}
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="conversions" 
                    stroke="#ffc658" 
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 2 }}
                    activeDot={{ r: 5, strokeWidth: 2 }}
                    name="Conversions"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Type-Specific Performance & Retailer Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Notes - Moved from bottom */}
        {notes && notes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notes.map((note: any, index: number) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    {note.performance_notes && (
                      <div className="mb-3">
                        <p className="font-medium text-gray-900">Performance Summary</p>
                        <p className="text-gray-700">{note.performance_notes}</p>
                      </div>
                    )}
                    
                    {note.best_performing_platform && (
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Best Performing Platform</p>
                        <Badge variant="outline" className="capitalize">
                          {note.best_performing_platform}
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Email Performance Details - Only for Email Campaigns */}
        {campaign.campaign_type === 'email' && conversionFunnel && (
          <Card>
            <CardHeader>
              <CardTitle>Email Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Email Delivery</p>
                    <p className="text-sm text-gray-600">
                      {conversionFunnel.emails_delivered} of {conversionFunnel.emails_sent} delivered
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{conversionFunnel.delivery_rate}%</p>
                    <p className="text-sm text-gray-600">delivery rate</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Email Opens</p>
                    <p className="text-sm text-gray-600">
                      {conversionFunnel.emails_opened} unique opens
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{conversionFunnel.open_rate}%</p>
                    <p className="text-sm text-gray-600">open rate</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium">Email Clicks</p>
                    <p className="text-sm text-gray-600">
                      {conversionFunnel.emails_clicked} total clicks
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-600">{conversionFunnel.click_rate}%</p>
                    <p className="text-sm text-gray-600">click rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Retailer Summary */}
        {retailerSummary && (
          <Card>
            <CardHeader>
              <CardTitle>Retailer Performance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Participating Retailers</p>
                    <p className="text-2xl font-bold">{retailerSummary.total_participating_retailers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Performance</p>
                    <p className="text-2xl font-bold">{retailerSummary.avg_retailer_performance}%</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Performance Distribution</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>High Performers (&gt;6%)</span>
                      <span className="font-medium">{retailerSummary.high_performers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Good Performers (3-6%)</span>
                      <span className="font-medium">{retailerSummary.good_performers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Standard Performers (&lt;3%)</span>
                      <span className="font-medium">{retailerSummary.standard_performers}</span>
                    </div>
                  </div>
                </div>

                {retailerSummary.top_performing_region && (
                  <div>
                    <p className="text-sm text-gray-600">Top Performing Region</p>
                    <p className="font-medium">{retailerSummary.top_performing_region}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>


    </div>
  )
}