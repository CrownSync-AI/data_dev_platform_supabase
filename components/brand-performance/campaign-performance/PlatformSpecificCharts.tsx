'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart
} from 'recharts'

interface PlatformSpecificChartsProps {
  platform: string
  data: any
  campaignName: string
}

export default function PlatformSpecificCharts({ 
  platform, 
  data, 
  campaignName 
}: PlatformSpecificChartsProps) {
  
  // Generate mock time-series data for trends
  const generateTrendData = (platform: string, baseData: any) => {
    const days = 7 // Last 7 days
    const trendData = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const variation = 0.8 + Math.random() * 0.4 // 80% to 120% variation
      
      trendData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        impressions: Math.round((baseData.impressions || 0) * variation),
        reach: Math.round((baseData.reach || 0) * variation),
        engagement: Math.round((baseData.engagement || 0) * variation),
        ...generatePlatformSpecificTrendData(platform, baseData, variation)
      })
    }
    
    return trendData
  }

  const generatePlatformSpecificTrendData = (platform: string, baseData: any, variation: number) => {
    switch (platform) {
      case 'facebook':
        return {
          likes: Math.round((baseData.likeCount || 0) * variation),
          comments: Math.round((baseData.commentsCount || 0) * variation),
          shares: Math.round((baseData.sharesCount || 0) * variation),
          videoViews: Math.round((baseData.videoViews || 0) * variation)
        }
      case 'instagram':
        return {
          likes: Math.round((baseData.likeCount || 0) * variation),
          comments: Math.round((baseData.commentsCount || 0) * variation),
          saves: Math.round((baseData.savedCount || 0) * variation),
          reelPlays: Math.round((baseData.playsCount || 0) * variation)
        }
      case 'twitter':
        return {
          likes: Math.round((baseData.likeCount || 0) * variation),
          retweets: Math.round((baseData.retweetCount || 0) * variation),
          replies: Math.round((baseData.replyCount || 0) * variation),
          bookmarks: Math.round((baseData.bookmarkCount || 0) * variation)
        }
      case 'linkedin':
        return {
          likes: Math.round((baseData.likeCount || 0) * variation),
          comments: Math.round((baseData.commentsCount || 0) * variation),
          shares: Math.round((baseData.shareCount || 0) * variation),
          clicks: Math.round((baseData.clicks || 0) * variation)
        }
      default:
        return {}
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const trendData = generateTrendData(platform, data)

  // Morandi color palette - muted, sophisticated tones
  const platformColors = {
    facebook: '#B8A082',    // Muted warm beige
    instagram: '#A8B5A0',   // Sage green
    twitter: '#9BB5C4',     // Dusty blue
    linkedin: '#C4A484'     // Warm taupe
  }

  const primaryColor = platformColors[platform as keyof typeof platformColors] || '#A8A8A8'
  const chartColors = [primaryColor, '#A8B5A0', '#C4A484', '#9BB5C4', '#B8A082', '#D4B896']

  const renderFacebookCharts = () => {
    // Engagement breakdown for Facebook
    const engagementData = [
      { name: 'Likes', value: data.likeCount || 0, color: chartColors[0] },
      { name: 'Comments', value: data.commentsCount || 0, color: chartColors[1] },
      { name: 'Shares', value: data.sharesCount || 0, color: chartColors[2] },
      { name: 'Reactions', value: Object.values(data.reactions || {}).reduce((a: number, b: any) => a + b, 0), color: chartColors[3] }
    ]

    // Video performance data
    const videoData = [
      { metric: '10s Views', value: data.totalVideo10SViews || 0 },
      { metric: '15s Views', value: data.totalVideo15SViews || 0 },
      { metric: 'Complete Views', value: data.totalVideoCompleteViews || 0 },
      { metric: 'Avg Watch Time', value: (data.totalVideoAvgTimeWatched || 0) / 1000 }
    ]

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trend */}
        <Card>
          <CardHeader>
            <CardTitle>7-Day Engagement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatNumber(value)} />
                <Area dataKey="likes" stackId="1" stroke={chartColors[0]} fill={chartColors[0]} fillOpacity={0.6} />
                <Area dataKey="comments" stackId="1" stroke={chartColors[1]} fill={chartColors[1]} fillOpacity={0.6} />
                <Area dataKey="shares" stackId="1" stroke={chartColors[2]} fill={chartColors[2]} fillOpacity={0.6} />
                <Line dataKey="videoViews" stroke={chartColors[3]} strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={engagementData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => formatNumber(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Video Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Video Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={videoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatNumber(value)} />
                <Bar dataKey="value" fill={primaryColor} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderInstagramCharts = () => {
    // Content type performance
    const contentData = [
      { type: 'Feed Posts', engagement: data.engagementCount || 0, reach: data.reachCount || 0 },
      { type: 'Reels', engagement: (data.playsCount || 0) * 0.15, reach: data.reachCount || 0 },
      { type: 'Stories', engagement: (data.viewsCount || 0) * 0.08, reach: (data.reachCount || 0) * 0.6 }
    ]

    // Saves vs Shares comparison
    const saveShareData = [
      { name: 'Saves', value: data.savedCount || 0, color: chartColors[0] },
      { name: 'Shares', value: data.sharesCount || 0, color: chartColors[1] },
      { name: 'Profile Visits', value: data.profileVisitsCount || 0, color: chartColors[2] }
    ]

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Engagement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatNumber(value)} />
                <Line dataKey="likes" stroke={chartColors[0]} strokeWidth={2} name="Likes" />
                <Line dataKey="comments" stroke={chartColors[1]} strokeWidth={2} name="Comments" />
                <Line dataKey="saves" stroke={chartColors[2]} strokeWidth={2} name="Saves" />
                <Line dataKey="reelPlays" stroke={chartColors[3]} strokeWidth={2} name="Reel Plays" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Content Type Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Content Type Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={contentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatNumber(value)} />
                <Bar dataKey="engagement" fill={chartColors[0]} name="Engagement" />
                <Bar dataKey="reach" fill={chartColors[1]} name="Reach" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Saves vs Shares */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>User Actions Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={saveShareData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${formatNumber(value)}`}
                  >
                    {saveShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">📊 Content Insights</h4>
                  <div className="text-sm text-purple-700 space-y-1">
                    <div>Save Rate: {((data.savedCount || 0) / (data.reachCount || 1) * 100).toFixed(1)}%</div>
                    <div>Profile Visit Rate: {((data.profileVisitsCount || 0) / (data.reachCount || 1) * 100).toFixed(1)}%</div>
                    <div>Engagement Rate: {((data.engagementCount || 0) / (data.reachCount || 1) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderTwitterCharts = () => {
    // Tweet performance breakdown
    const tweetData = [
      { name: 'Likes', value: data.likeCount || 0, color: chartColors[0] },
      { name: 'Retweets', value: data.retweetCount || 0, color: chartColors[1] },
      { name: 'Replies', value: data.replyCount || 0, color: chartColors[2] },
      { name: 'Bookmarks', value: data.bookmarkCount || 0, color: chartColors[3] }
    ]

    // Engagement vs Impressions trend
    const performanceData = trendData.map(day => ({
      ...day,
      engagementRate: ((day.likes + day.retweets + day.replies) / day.impressions * 100).toFixed(2)
    }))

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Tweet Engagement Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tweetData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip formatter={(value: any) => formatNumber(value)} />
                <Bar dataKey="value" fill={primaryColor} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="impressions" fill={chartColors[0]} name="Impressions" />
                <Line yAxisId="right" dataKey="engagementRate" stroke={chartColors[3]} strokeWidth={3} name="Engagement Rate %" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Distribution */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Engagement Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={tweetData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {tweetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">🐦 Twitter Insights</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>Retweet Rate: {((data.retweetCount || 0) / (data.impressions || 1) * 100).toFixed(2)}%</div>
                    <div>Reply Rate: {((data.replyCount || 0) / (data.impressions || 1) * 100).toFixed(2)}%</div>
                    <div>Bookmark Rate: {((data.bookmarkCount || 0) / (data.impressions || 1) * 100).toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderLinkedInCharts = () => {
    // Professional reactions breakdown
    const reactionsData = Object.entries(data.reactions || {}).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count as number,
      color: chartColors[Object.keys(data.reactions || {}).indexOf(type)]
    }))

    // Professional metrics
    const professionalData = [
      { metric: 'Unique Impressions', value: data.unique_impressions || 0 },
      { metric: 'Clicks', value: data.clicks || 0 },
      { metric: 'Shares', value: data.shareCount || 0 },
      { metric: 'Comments', value: data.commentsCount || 0 }
    ]

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professional Reactions */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Reactions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reactionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatNumber(value)} />
                <Bar dataKey="value" fill={primaryColor} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Engagement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any) => formatNumber(value)} />
                <Area dataKey="likes" stackId="1" stroke={chartColors[0]} fill={chartColors[0]} fillOpacity={0.6} />
                <Area dataKey="comments" stackId="1" stroke={chartColors[1]} fill={chartColors[1]} fillOpacity={0.6} />
                <Area dataKey="shares" stackId="1" stroke={chartColors[2]} fill={chartColors[2]} fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Professional Metrics Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Professional Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={professionalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => formatNumber(value)} />
                  <Bar dataKey="value" fill={primaryColor} />
                </BarChart>
              </ResponsiveContainer>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">💼 LinkedIn Insights</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>Click-through Rate: {((data.clicks || 0) / (data.unique_impressions || 1) * 100).toFixed(2)}%</div>
                    <div>Share Rate: {((data.shareCount || 0) / (data.unique_impressions || 1) * 100).toFixed(2)}%</div>
                    <div>Comment Rate: {((data.commentsCount || 0) / (data.unique_impressions || 1) * 100).toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderPlatformCharts = () => {
    switch (platform) {
      case 'facebook':
        return renderFacebookCharts()
      case 'instagram':
        return renderInstagramCharts()
      case 'twitter':
        return renderTwitterCharts()
      case 'linkedin':
        return renderLinkedInCharts()
      default:
        return (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Platform-specific visualizations not available for {platform}</p>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4 capitalize">
          {platform} Analytics Visualizations
        </h3>
        {renderPlatformCharts()}
      </div>
    </div>
  )
}