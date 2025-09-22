'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

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
  facebook: '#1877F2',
  instagram: '#E4405F', 
  linkedin: '#0A66C2',
  twitter: '#1DA1F2'
}

const MORANDI_COLORS = {
  facebook: '#8B9DC3',
  instagram: '#DDB7AB',
  linkedin: '#7FB3D3',
  twitter: '#A8C8EC'
}

export default function PlatformComparisonCharts({ platformData, campaignName }: PlatformComparisonChartsProps) {
  // Transform data for charts
  const chartData = Object.entries(platformData).map(([platform, data]) => ({
    platform: platform.charAt(0).toUpperCase() + platform.slice(1),
    impressions: data.impressions,
    reach: data.reach,
    engagement: data.engagement,
    engagementRate: ((data.engagement / data.reach) * 100).toFixed(2)
  }))

  // Pie chart data for impressions distribution
  const impressionsPieData = chartData.map(item => ({
    name: item.platform,
    value: item.impressions,
    color: MORANDI_COLORS[item.platform.toLowerCase() as keyof typeof MORANDI_COLORS]
  }))

  // Pie chart data for engagement distribution
  const engagementPieData = chartData.map(item => ({
    name: item.platform,
    value: item.engagement,
    color: MORANDI_COLORS[item.platform.toLowerCase() as keyof typeof MORANDI_COLORS]
  }))

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {formatNumber(entry.value)}
              {entry.dataKey === 'engagementRate' && '%'}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.payload.color }}>
            {formatNumber(data.value)} ({((data.value / impressionsPieData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Platform Comparison Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impressions vs Reach Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Impressions vs Reach by Platform</CardTitle>
          </CardHeader>
          <CardContent>
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
                  dataKey="impressions" 
                  fill="#8B9DC3" 
                  name="Impressions"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  dataKey="reach" 
                  fill="#DDB7AB" 
                  name="Reach"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement by Platform</CardTitle>
          </CardHeader>
          <CardContent>
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
                  dataKey="engagement" 
                  fill="#7FB3D3" 
                  name="Engagement"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Platform Distribution Pie Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impressions Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Impressions Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={impressionsPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {impressionsPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
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
                  data={engagementPieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {engagementPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Rate Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Rate Comparison</CardTitle>
        </CardHeader>
        <CardContent>
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
                label={{ value: 'Engagement Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value: any) => [`${value}%`, 'Engagement Rate']}
              />
              <Bar 
                dataKey="engagementRate" 
                fill="#A8C8EC" 
                name="Engagement Rate"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Platform Performance Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Platform</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Impressions</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Reach</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Engagement</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-700">Engagement Rate</th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: MORANDI_COLORS[item.platform.toLowerCase() as keyof typeof MORANDI_COLORS] }}
                        ></div>
                        <span className="font-medium">{item.platform}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4">{formatNumber(item.impressions)}</td>
                    <td className="text-right py-3 px-4">{formatNumber(item.reach)}</td>
                    <td className="text-right py-3 px-4">{formatNumber(item.engagement)}</td>
                    <td className="text-right py-3 px-4">{item.engagementRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}