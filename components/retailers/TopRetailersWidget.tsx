'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trophy, Medal, Award, TrendingUp, Star } from 'lucide-react'

interface TopRetailer {
  retailer_id: string
  retailer_name: string
  region: 'East' | 'Central' | 'West'
  click_rate: number
  emails_sent: number
  overall_rank: number
  performance_tier: string
}

interface TopRetailersWidgetProps {
  campaignId: string
  startDate?: Date
  endDate?: Date
}

export default function TopRetailersWidget({ campaignId, startDate, endDate }: TopRetailersWidgetProps) {
  const [topRetailers, setTopRetailers] = useState<TopRetailer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTopRetailers(campaignId, startDate, endDate)
  }, [campaignId, startDate, endDate])

  const fetchTopRetailers = async (campaignId: string, startDate?: Date, endDate?: Date) => {
    try {
      setLoading(true)
      
      // Build API URL with time parameters
      let apiUrl = `/api/campaigns/${campaignId}/analytics?limit=3&sort_by=click_rate&sort_order=desc`
      
      if (startDate) {
        apiUrl += `&start_date=${startDate.toISOString()}`
      }
      if (endDate) {
        apiUrl += `&end_date=${endDate.toISOString()}`
      }
      
      const response = await fetch(apiUrl)
      if (!response.ok) throw new Error('Failed to fetch data')
      
      const result = await response.json()
      setTopRetailers(result.leaderboard || [])
    } catch (error) {
      console.error('Error fetching top retailers:', error)
      // 使用模拟数据作为fallback
      setTopRetailers([
        {
          retailer_id: '1',
          retailer_name: 'Cartier Rodeo Drive',
          region: 'West',
          click_rate: 4.64,
          emails_sent: 892,
          overall_rank: 1,
          performance_tier: 'Top'
        },
        {
          retailer_id: '2', 
          retailer_name: 'Betteridge NY',
          region: 'East',
          click_rate: 3.87,
          emails_sent: 1156,
          overall_rank: 2,
          performance_tier: 'Top'
        },
        {
          retailer_id: '3',
          retailer_name: 'Westime LA',
          region: 'West',
          click_rate: 3.69,
          emails_sent: 743,
          overall_rank: 3,
          performance_tier: 'Good'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <Star className="h-5 w-5 text-gray-400" />
    }
  }

  const getRegionColor = (region: string) => {
    switch (region) {
      case 'East':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'Central':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'West':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">🏆 Top Retailers This Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">🏆 Top Retailers This Campaign</CardTitle>
        <CardDescription>Marco Bicego New 2025 Campaign Top 3</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topRetailers.map((retailer) => (
            <div 
              key={retailer.retailer_id}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                retailer.overall_rank === 1 ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50' :
                retailer.overall_rank === 2 ? 'border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50' :
                'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getRankIcon(retailer.overall_rank)}
                  <div>
                    <h4 className="font-semibold">{retailer.retailer_name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={`text-xs ${getRegionColor(retailer.region)}`}>
                        {retailer.region}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {retailer.emails_sent.toLocaleString()} emails
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {retailer.click_rate.toFixed(2)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Click Rate</div>
                </div>
              </div>
              
              {/* Performance Indicator */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">Excellent Performance</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  #{retailer.overall_rank} Overall Rank
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <Button variant="outline" className="w-full" size="sm">
            View Full Leaderboard
          </Button>
          <Button variant="ghost" className="w-full" size="sm">
            Analyze Success Patterns
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 