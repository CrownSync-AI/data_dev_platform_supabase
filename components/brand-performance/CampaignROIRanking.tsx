'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Trophy, Medal, Award } from 'lucide-react'

interface CampaignROI {
  id: string
  name: string
  period: string
  roi: number
  spent: number
  revenue: number
  trend: number
  status: 'completed' | 'active' | 'planned'
}

interface ROIRankingProps {
  currentCampaignId?: string
  startDate?: Date
  endDate?: Date
}

export default function CampaignROIRanking({ currentCampaignId, startDate, endDate }: ROIRankingProps) {
  const [campaigns, setCampaigns] = useState<CampaignROI[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCampaignROIData(startDate, endDate)
  }, [startDate, endDate])

  const fetchCampaignROIData = async (startDate?: Date, endDate?: Date) => {
    try {
      setLoading(true)
      // Using mock data, should fetch from API in real implementation
      // Time filtering would be applied here when using real API
      const mockData: CampaignROI[] = [
        {
          id: currentCampaignId || '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
          name: 'Marco Bicego New 2025',
          period: '2025 Q1',
          roi: 124,
          spent: 150000,
          revenue: 336000,
          trend: 8.5,
          status: 'active'
        },
        {
          id: 'rolex-event-2024',
          name: 'Rolex Event 2024',
          period: '2024 Q4', 
          roi: 87,
          spent: 200000,
          revenue: 374000,
          trend: -2.3,
          status: 'completed'
        },
        {
          id: 'cartier-launch-2024',
          name: 'Cartier Launch 2024',
          period: '2024 Q3',
          roi: 67,
          spent: 180000,
          revenue: 300600,
          trend: 12.1,
          status: 'completed'
        },
        {
          id: 'tiffany-spring-2024',
          name: 'Tiffany Spring 2024',
          period: '2024 Q2',
          roi: 52,
          spent: 120000,
          revenue: 182400,
          trend: -5.7,
          status: 'completed'
        },
        {
          id: 'bulgari-summer-2024',
          name: 'Bulgari Summer 2024',
          period: '2024 Q2',
          roi: 43,
          spent: 160000,
          revenue: 228800,
          trend: 3.2,
          status: 'completed'
        }
      ]
      
      // 按ROI排序
      const sortedData = mockData.sort((a, b) => b.roi - a.roi)
      setCampaigns(sortedData)
    } catch (error) {
      console.error('Error fetching ROI data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case 1:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 2:
        return <Award className="h-4 w-4 text-amber-600" />
      default:
        return <span className="text-xs font-bold text-gray-600">{index + 1}</span>
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'default',
      'completed': 'secondary',
      'planned': 'outline'
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'} className="text-xs">
        {status === 'active' ? 'Active' : status === 'completed' ? 'Completed' : 'Planned'}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Campaign ROI Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
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
        <CardTitle>Campaign ROI Leaderboard</CardTitle>
        <CardDescription>Past 6 months campaign return on investment comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {campaigns.map((campaign, index) => (
            <div 
              key={campaign.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all hover:shadow-md ${
                campaign.id === currentCampaignId ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-yellow-100' :
                  index === 1 ? 'bg-gray-100' :
                  index === 2 ? 'bg-amber-100' :
                  'bg-gray-50'
                }`}>
                  {getRankIcon(index)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{campaign.name}</span>
                    {getStatusBadge(campaign.status)}
                  </div>
                  <div className="text-xs text-muted-foreground">{campaign.period}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`font-bold text-lg ${
                    campaign.roi >= 100 ? 'text-green-600' : 
                    campaign.roi >= 70 ? 'text-blue-600' :
                    'text-red-600'
                  }`}>
                    {campaign.roi}%
                  </div>
                  <div className={`flex items-center text-xs ${
                    campaign.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {campaign.trend > 0 ? 
                      <TrendingUp className="h-3 w-3 mr-0.5" /> : 
                      <TrendingDown className="h-3 w-3 mr-0.5" />
                    }
                    {Math.abs(campaign.trend)}%
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Spent: ${campaign.spent.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  Revenue: ${campaign.revenue.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-4" size="sm">
          View Full ROI Report
        </Button>
      </CardContent>
    </Card>
  )
} 