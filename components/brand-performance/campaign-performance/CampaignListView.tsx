'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  MoreHorizontal, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Users,
  Mail,
  Share2,
  Eye
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatDistanceToNow } from 'date-fns'

interface Campaign {
  campaign_id: string
  campaign_name: string
  campaign_status: string
  campaign_type: string
  campaign_image?: string
  start_date: string
  end_date?: string
  avg_click_rate?: number
  total_reach?: number
  total_engagement?: number
  participating_retailers_count?: number
  total_emails_sent?: number
  performance_tier: string
  trend_direction: string
  last_updated: string
  platform_performance?: any
  email_metrics?: any
}

interface CampaignListViewProps {
  campaigns: Campaign[]
  onCampaignClick: (campaign: Campaign) => void
}

export default function CampaignListView({ campaigns, onCampaignClick }: CampaignListViewProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'social': return 'bg-purple-100 text-purple-800'
      case 'email': return 'bg-blue-100 text-blue-800'
      case 'mixed': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPerformanceColor = (tier: string) => {
    switch (tier) {
      case 'high': return 'bg-green-100 text-green-800'
      case 'good': return 'bg-yellow-100 text-yellow-800'
      case 'standard': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="space-y-3">
      {campaigns.map((campaign) => (
        <Card 
          key={campaign.campaign_id} 
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onCampaignClick(campaign)}
        >
          <div className="flex items-center justify-between">
            {/* Left Section - Campaign Info */}
            <div className="flex items-center space-x-4 flex-1">
              {/* Campaign Image */}
              {campaign.campaign_image && (
                <div className="w-16 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={campaign.campaign_image} 
                    alt={campaign.campaign_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Campaign Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {campaign.campaign_name}
                  </h3>
                  {getTrendIcon(campaign.trend_direction)}
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={getStatusColor(campaign.campaign_status)}>
                    {campaign.campaign_status}
                  </Badge>
                  <Badge className={getTypeColor(campaign.campaign_type)}>
                    {campaign.campaign_type}
                  </Badge>
                  <Badge className={getPerformanceColor(campaign.performance_tier)}>
                    {campaign.performance_tier} performer
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(campaign.start_date).toLocaleDateString()}</span>
                  </div>
                  {campaign.participating_retailers_count && (
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{campaign.participating_retailers_count} retailers</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <span>Updated {formatDistanceToNow(new Date(campaign.last_updated))} ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section - Key Metrics */}
            <div className="hidden md:flex items-center space-x-6 px-6">
              {campaign.campaign_type === 'email' || campaign.email_metrics ? (
                <>
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                      <Mail className="h-4 w-4" />
                      <span>Emails</span>
                    </div>
                    <div className="font-semibold">
                      {formatNumber(campaign.total_emails_sent || campaign.email_metrics?.emails_sent || 0)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-1">Open Rate</div>
                    <div className="font-semibold">
                      {campaign.email_metrics?.open_rate?.toFixed(1) || campaign.avg_click_rate?.toFixed(1) || '0.0'}%
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                      <Eye className="h-4 w-4" />
                      <span>Reach</span>
                    </div>
                    <div className="font-semibold">
                      {formatNumber(campaign.total_reach || 0)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
                      <Share2 className="h-4 w-4" />
                      <span>Engagement</span>
                    </div>
                    <div className="font-semibold">
                      {formatNumber(campaign.total_engagement || 0)}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onCampaignClick(campaign)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Archive
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}