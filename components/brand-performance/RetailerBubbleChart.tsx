'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import { TrendingUp, Users, Filter } from 'lucide-react'

interface RetailerBubbleData {
  name: string
  responseTime: number // hours
  roi: number // percentage
  volume: number // email volume (for bubble size)
  grade: 'A+' | 'A' | 'B' | 'C' | 'D'
  region: 'East' | 'Central' | 'West'
  clickRate: number
  emailsSent: number
}

interface RetailerBubbleChartProps {
  campaignId?: string
}

export default function RetailerBubbleChart({ campaignId }: RetailerBubbleChartProps) {
  const [data, setData] = useState<RetailerBubbleData[]>([])
  const [loading, setLoading] = useState(true)
  const [regionFilter, setRegionFilter] = useState<string>('all')
  const [gradeFilter, setGradeFilter] = useState<string>('all')

  useEffect(() => {
    fetchBubbleData()
  }, [campaignId])

  const fetchBubbleData = async () => {
    try {
      setLoading(true)
      
      // For now, use mock data - in real implementation, fetch from API
      const mockData: RetailerBubbleData[] = [
        {
          name: 'Cartier Rodeo Drive',
          responseTime: 2.5,
          roi: 142,
          volume: 1200,
          grade: 'A+',
          region: 'West',
          clickRate: 4.64,
          emailsSent: 892
        },
        {
          name: 'Betteridge NY',
          responseTime: 4.2,
          roi: 128,
          volume: 1500,
          grade: 'A',
          region: 'East',
          clickRate: 3.87,
          emailsSent: 1156
        },
        {
          name: 'Westime LA',
          responseTime: 3.8,
          roi: 115,
          volume: 980,
          grade: 'A',
          region: 'West',
          clickRate: 3.69,
          emailsSent: 743
        },
        {
          name: 'Ben Bridge Seattle',
          responseTime: 6.1,
          roi: 98,
          volume: 750,
          grade: 'B',
          region: 'West',
          clickRate: 2.84,
          emailsSent: 654
        },
        {
          name: 'Tourneau NYC',
          responseTime: 5.3,
          roi: 105,
          volume: 890,
          grade: 'B',
          region: 'East',
          clickRate: 3.12,
          emailsSent: 823
        },
        {
          name: 'Hyde Park Jewelers',
          responseTime: 8.2,
          roi: 87,
          volume: 420,
          grade: 'C',
          region: 'Central',
          clickRate: 2.41,
          emailsSent: 398
        },
        {
          name: 'Shreve & Co',
          responseTime: 7.5,
          roi: 92,
          volume: 520,
          grade: 'B',
          region: 'Central',
          clickRate: 2.68,
          emailsSent: 456
        },
        {
          name: 'Eiseman Jewels',
          responseTime: 12.3,
          roi: 68,
          volume: 280,
          grade: 'D',
          region: 'Central',
          clickRate: 1.92,
          emailsSent: 234
        },
        {
          name: 'London Jewelers',
          responseTime: 4.8,
          roi: 112,
          volume: 680,
          grade: 'B',
          region: 'East',
          clickRate: 3.24,
          emailsSent: 567
        },
        {
          name: 'Wempe NY',
          responseTime: 9.1,
          roi: 78,
          volume: 340,
          grade: 'C',
          region: 'East',
          clickRate: 2.15,
          emailsSent: 289
        }
      ]
      
      setData(mockData)
    } catch (error) {
      console.error('Error fetching bubble chart data:', error)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade: string) => {
    const colors = {
      'A+': '#10b981', // green-500
      'A': '#3b82f6',  // blue-500
      'B': '#f59e0b',  // amber-500
      'C': '#f97316',  // orange-500
      'D': '#ef4444'   // red-500
    }
    return colors[grade as keyof typeof colors] || '#6b7280'
  }

  const filteredData = data.filter(item => {
    const regionMatch = regionFilter === 'all' || item.region === regionFilter
    const gradeMatch = gradeFilter === 'all' || item.grade === gradeFilter
    return regionMatch && gradeMatch
  })

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <div className="space-y-1 text-sm">
            <p>Response Time: {data.responseTime} hours</p>
            <p>ROI: {data.roi}%</p>
            <p>Click Rate: {data.clickRate}%</p>
            <p>Volume: {data.volume.toLocaleString()} emails</p>
            <p>Grade: {data.grade}</p>
            <p>Region: {data.region}</p>
          </div>
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Retailer Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Retailer Performance Overview</span>
            </CardTitle>
            <CardDescription>
              Bubble size = Volume | X-axis = Response Time | Y-axis = ROI | Color = Grade
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="East">East</SelectItem>
                <SelectItem value="Central">Central</SelectItem>
                <SelectItem value="West">West</SelectItem>
              </SelectContent>
            </Select>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="responseTime" 
                name="Response Time"
                unit="h"
                label={{ value: 'Response Time (hours)', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                dataKey="roi" 
                name="ROI"
                unit="%"
                label={{ value: 'ROI (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter dataKey="volume" name="Retailers">
                {filteredData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getGradeColor(entry.grade)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        {/* Chart Legend and Insights */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">🎯 Performance Quadrants</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Top Right: High ROI + Fast Response (Star Performers)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Top Left: High ROI + Slow Response (High Potential)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Bottom Right: Low ROI + Fast Response (Quick Fixers)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Bottom Left: Low ROI + Slow Response (Needs Attention)</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">📊 Grade Distribution</h4>
            <div className="grid grid-cols-5 gap-2">
              {['A+', 'A', 'B', 'C', 'D'].map((grade) => {
                const count = filteredData.filter(item => item.grade === grade).length
                return (
                  <div key={grade} className="text-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mx-auto mb-1"
                      style={{ backgroundColor: getGradeColor(grade) }}
                    >
                      {grade}
                    </div>
                    <div className="text-xs text-muted-foreground">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <Button variant="outline" size="sm">
            Export Chart
          </Button>
          <Button variant="outline" size="sm">
            Download Data
          </Button>
          <Button variant="default" size="sm">
            View Detailed Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 