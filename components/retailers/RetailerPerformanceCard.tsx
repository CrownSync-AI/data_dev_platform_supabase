'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Star, Clock, Mail, Target } from 'lucide-react'

interface RetailerPerformanceCardProps {
  rank: number
  name: string
  region: 'East' | 'Central' | 'West'
  clickRate: number
  emailsSent: number
  emailsDelivered: number
  emailsOpened: number
  emailsClicked: number
  trend: number
  responseTime: string
  grade: 'A+' | 'A' | 'B' | 'C' | 'D'
  lastCampaignDate: string
  overallRank: number
  performanceTier: string
}

export default function RetailerPerformanceCard({
  rank,
  name,
  region,
  clickRate,
  emailsSent,
  emailsDelivered,
  emailsOpened,
  emailsClicked: _emailsClicked,
  trend,
  responseTime,
  grade,
  lastCampaignDate,
  overallRank,
  performanceTier
}: RetailerPerformanceCardProps) {
  const isTopTier = rank <= 3
  
  const gradeColors = {
    'A+': 'bg-green-100 text-green-800 border-green-300',
    'A': 'bg-blue-100 text-blue-800 border-blue-300', 
    'B': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'C': 'bg-orange-100 text-orange-800 border-orange-300',
    'D': 'bg-red-100 text-red-800 border-red-300'
  }

  const regionColors = {
    'East': 'bg-blue-100 text-blue-800 border-blue-300',
    'Central': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'West': 'bg-green-100 text-green-800 border-green-300'
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
            {rank}
          </div>
        )
    }
  }

  const deliveryRate = emailsSent > 0 ? (emailsDelivered / emailsSent) * 100 : 0
  const openRate = emailsDelivered > 0 ? (emailsOpened / emailsDelivered) * 100 : 0
  const targetClickRate = clickRate * 1.2 // 20% improvement target

  return (
    <Card className={`${
      isTopTier ? 'border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 ring-1 ring-amber-200' : ''
    } hover:shadow-lg transition-all duration-200`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Left: Rank and Basic Info */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {getRankIcon(rank)}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-lg truncate">{name}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`text-xs ${regionColors[region]}`}>
                  {region}
                </Badge>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {responseTime}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Mail className="h-3 w-3 mr-1" />
                  {lastCampaignDate}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right: Grade and Main Metric */}
          <div className="text-right flex-shrink-0">
            <div className="flex items-center justify-end space-x-3 mb-2">
              <div>
                <div className="text-3xl font-bold text-primary">{clickRate.toFixed(2)}%</div>
                <div className="text-sm text-muted-foreground">Click Rate</div>
              </div>
              <div className={`px-3 py-1 rounded-full border-2 font-bold text-sm ${gradeColors[grade]}`}>
                {grade}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 mb-2">
              <span className="text-sm text-muted-foreground">
                {emailsSent.toLocaleString()} emails sent
              </span>
              <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="ml-1">{trend > 0 ? '+' : ''}{trend.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-4 mb-4">
          {/* Click Rate Progress */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Click Rate Performance</span>
              <span className="text-sm text-muted-foreground">
                Target: {targetClickRate.toFixed(1)}%
              </span>
            </div>
            <Progress value={Math.min((clickRate / targetClickRate) * 100, 100)} className="h-3" />
          </div>

          {/* Funnel Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{deliveryRate.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Delivery Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{openRate.toFixed(1)}%</div>
              <div className="text-xs text-muted-foreground">Open Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">#{overallRank}</div>
              <div className="text-xs text-muted-foreground">Overall Rank</div>
            </div>
          </div>
        </div>

        {/* Performance Tier Badge */}
        <div className="mb-4">
          <Badge 
            variant={
              performanceTier === 'Top' ? 'default' :
              performanceTier === 'Good' ? 'secondary' :
              performanceTier === 'Average' ? 'outline' : 'destructive'
            }
            className="text-xs"
          >
            <Star className="h-3 w-3 mr-1" />
            {performanceTier} Performer
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            <Target className="h-3 w-3 mr-1" />
            View Details
          </Button>
          {grade === 'A+' || grade === 'A' ? (
            <Button variant="secondary" size="sm" className="flex-1 text-xs">
              Share Best Practices
            </Button>
          ) : (
            <Button variant="default" size="sm" className="flex-1 text-xs">
              Improvement Plan
            </Button>
          )}
        </div>

        {/* Quick Insight */}
        {isTopTier && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <span className="font-medium">Top Performer:</span> {
                  clickRate > 4.0 ? 'Exceptional click rates drive superior ROI' :
                  clickRate > 3.0 ? 'Strong engagement with room for optimization' :
                  'Consistent performance with growth potential'
                }
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 