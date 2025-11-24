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

import { Campaign } from './CampaignCardView'

interface CampaignListViewProps {
  campaigns: Campaign[]
  onCampaignClick: (campaign: Campaign) => void
}

export default function CampaignListView({ campaigns, onCampaignClick }: CampaignListViewProps) {
  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <div className="flex items-center gap-1 text-sm">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-green-700 font-medium">Active</span>
          </div>
        )
      case 'completed':
        return (
          <div className="flex items-center gap-1 text-sm">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-blue-700 font-medium">Complete</span>
          </div>
        )
      case 'paused':
        return (
          <div className="flex items-center gap-1 text-sm">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span className="text-yellow-700 font-medium">Paused</span>
          </div>
        )

      default:
        return (
          <div className="flex items-center gap-1 text-sm">
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            <span className="text-gray-700 font-medium">Unknown</span>
          </div>
        )
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
          <div className="flex items-start justify-between gap-4">
            {/* Left Section - Campaign Info */}
            <div className="flex items-start space-x-4 flex-1">
              {/* Campaign Image with Status Below */}
              <div className="flex-shrink-0">
                {campaign.campaign_image && (
                  <div className="w-20 h-14 rounded-md overflow-hidden mb-2">
                    <img
                      src={campaign.campaign_image}
                      alt={campaign.campaign_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {/* Status Indicator Below Image */}
                {getStatusIndicator(campaign.campaign_status)}
              </div>

              {/* Campaign Details */}
              <div className="flex-1 min-w-0">
                {/* Campaign Title */}
                <h3 className="font-semibold text-gray-900 truncate mb-2">
                  {campaign.campaign_name}
                </h3>

                {/* Campaign Type Between Title and Trend */}
                <div className="flex items-center space-x-3 mb-2">
                  <Badge className={getTypeColor(campaign.campaign_type)}>
                    {campaign.campaign_type}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(campaign.trend_direction)}
                    <span className="text-sm text-gray-600">Trending {campaign.trend_direction}</span>
                  </div>
                </div>

                {/* Campaign Meta Info */}
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

            {/* Right Section - Key Metrics */}
            <div className="hidden md:flex items-start px-4 py-2">
              {campaign.campaign_type === 'email' || campaign.email_metrics ? (
                <>
                  <div className="text-center w-20">
                    <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-2">
                      <Mail className="h-4 w-4" />
                      <span>Emails</span>
                    </div>
                    <div className="font-bold text-lg text-gray-900">
                      {formatNumber(campaign.total_emails_sent || campaign.email_metrics?.emails_sent || 0)}
                    </div>
                  </div>
                  <div className="text-center w-20 ml-8">
                    <div className="text-sm text-gray-500 mb-2">Open Rate</div>
                    <div className="font-bold text-lg text-gray-900">
                      {campaign.email_metrics?.open_rate?.toFixed(1) || campaign.avg_click_rate?.toFixed(1) || '0.0'}%
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center w-20">
                    <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-2">
                      <Eye className="h-4 w-4" />
                      <span>Reach</span>
                    </div>
                    <div className="font-bold text-lg text-gray-900">
                      {formatNumber(campaign.total_reach || 0)}
                    </div>
                  </div>
                  <div className="text-center w-20 ml-8">
                    <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-2">
                      <Share2 className="h-4 w-4" />
                      <span>Engagement</span>
                    </div>
                    <div className="font-bold text-lg text-gray-900">
                      {formatNumber(campaign.total_engagement || 0)}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-start space-x-2 pt-2">
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