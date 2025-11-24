'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

// Attribution data showing performance drivers
const attributionData = [
  {
    factor: 'Baseline',
    value: 2.1,
    change: 0,
    type: 'baseline',
    description: 'Previous campaign performance'
  },
  {
    factor: 'Content Strategy',
    value: 0.8,
    change: 0.8,
    type: 'positive',
    description: 'Increased video content ratio to 68%'
  },
  {
    factor: 'Platform Mix',
    value: 0.5,
    change: 0.5,
    type: 'positive',
    description: 'TikTok expansion and Instagram Reels focus'
  },
  {
    factor: 'Retailer Performance',
    value: 0.6,
    change: 0.6,
    type: 'positive',
    description: 'Top retailers exceeded posting targets'
  },
  {
    factor: 'Timing Optimization',
    value: 0.3,
    change: 0.3,
    type: 'positive',
    description: 'Optimized posting schedule for peak hours'
  },
  {
    factor: 'Seasonal Decline',
    value: -0.2,
    change: -0.2,
    type: 'negative',
    description: 'Natural engagement decline in late campaign'
  },
  {
    factor: 'Current Performance',
    value: 4.1,
    change: 0,
    type: 'result',
    description: 'Total engagement rate achieved'
  }
]

const getBarColor = (type: string) => {
  switch (type) {
    case 'baseline': return '#6B7280'
    case 'positive': return '#10B981'
    case 'negative': return '#EF4444'
    case 'result': return '#3B82F6'
    default: return '#6B7280'
  }
}

export default function AttributionWaterfall() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Attribution Analysis
        </CardTitle>
        <p className="text-sm text-gray-600">
          Key factors driving engagement rate from 2.1% to 4.1%
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={attributionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <XAxis 
                dataKey="factor" 
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                label={{ value: 'Engagement Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg max-w-xs">
                        <p className="font-medium">{data.factor}</p>
                        <p className="text-sm text-gray-600 mb-2">{data.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Impact:</span>
                          <Badge variant={data.change > 0 ? 'default' : data.change < 0 ? 'destructive' : 'secondary'}>
                            {data.change > 0 ? '+' : ''}{data.change}pp
                          </Badge>
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {attributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.type)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attribution Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-800">Positive Drivers</span>
            </div>
            <p className="text-2xl font-bold text-green-700">+2.2pp</p>
            <p className="text-sm text-green-600">Total positive impact</p>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="font-semibold text-red-800">Negative Factors</span>
            </div>
            <p className="text-2xl font-bold text-red-700">-0.2pp</p>
            <p className="text-sm text-red-600">Total negative impact</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-800">Net Improvement</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">+2.0pp</p>
            <p className="text-sm text-blue-600">vs previous campaign</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}