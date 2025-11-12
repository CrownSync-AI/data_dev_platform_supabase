'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Check, 
  X, 
  Clock, 
  Minus,
  ExternalLink, 
  Eye,
  MessageCircle,
  Share2,
  Users,
  Instagram,
  Facebook,
  Linkedin,
  Twitter
} from 'lucide-react'

// Platform configuration with modern icons and colors
const platformConfig = {
  instagram: {
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200'
  },
  facebook: {
    name: 'Facebook', 
    icon: Facebook,
    color: '#1877F2',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  linkedin: {
    name: 'LinkedIn',
    icon: Linkedin,
    color: '#0A66C2',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300'
  },
  x: {
    name: 'X (Twitter)',
    icon: Twitter,
    color: '#000000',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  }
}

// Status configuration with modern icons and colors
const statusConfig = {
  posted: {
    icon: Check,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    label: 'Posted'
  },
  notPosted: {
    icon: X,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'Not Posted'
  },
  scheduled: {
    icon: Clock,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    label: 'Scheduled'
  },
  unplanned: {
    icon: Minus,
    color: 'text-gray-400',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    label: 'Unplanned'
  }
}

// Campaign configuration
const campaigns = [
  { id: 'spring-2024', name: 'Spring Collection 2024', startDate: '2024-03-01', color: '#10B981' },
  { id: 'summer-2024', name: 'Summer Collection 2024', startDate: '2024-06-01', color: '#F59E0B' },
  { id: 'fall-2024', name: 'Fall Collection 2024', startDate: '2024-09-01', color: '#EF4444' },
  { id: 'holiday-2024', name: 'Holiday Collection 2024', startDate: '2024-11-01', color: '#8B5CF6' }
] as const

// Mock data for retailer posting status by campaign
const retailerPostingData = [
  {
    id: 'retailer-001',
    name: 'Luxury Boutique NYC',
    region: 'East',
    campaigns: {
      'spring-2024': {
        posted: true,
        postTime: '2024-03-15 14:30',
        postUrl: 'https://instagram.com/p/example1',
        engagement: 245,
        reach: 3200,
        likes: 189,
        comments: 12,
        shares: 44,
        platform: 'Instagram'
      },
      'summer-2024': {
        posted: true,
        postTime: '2024-06-10 15:15',
        postUrl: 'https://facebook.com/post/example1',
        engagement: 312,
        reach: 4100,
        likes: 267,
        comments: 23,
        shares: 22,
        platform: 'Facebook'
      },
      'fall-2024': {
        posted: false,
        scheduled: '2024-09-15 09:00',
        reason: 'Scheduled for launch week',
        platform: 'Instagram'
      },
      'holiday-2024': {
        posted: false,
        status: 'scheduled',
        scheduled: '2024-11-05 10:00',
        reason: 'Awaiting final creative approval',
        platform: 'LinkedIn'
      }
    }
  },
  {
    id: 'retailer-002',
    name: 'Fashion Forward LA',
    region: 'West',
    campaigns: {
      'spring-2024': {
        posted: true,
        postTime: '2024-03-12 18:20',
        postUrl: 'https://instagram.com/p/example2',
        engagement: 389,
        reach: 4800,
        likes: 312,
        comments: 34,
        shares: 43,
        platform: 'Instagram'
      },
      'summer-2024': {
        posted: true,
        postTime: '2024-06-08 14:00',
        postUrl: 'https://linkedin.com/post/example2',
        engagement: 178,
        reach: 2200,
        likes: 134,
        comments: 15,
        shares: 29,
        platform: 'LinkedIn'
      },
      'fall-2024': {
        posted: true,
        postTime: '2024-09-10 12:30',
        postUrl: 'https://facebook.com/post/example2',
        engagement: 234,
        reach: 3100,
        likes: 189,
        comments: 21,
        shares: 24,
        platform: 'Facebook'
      },
      'holiday-2024': {
        posted: false,
        status: 'scheduled',
        scheduled: '2024-11-08 14:00',
        reason: 'Content under review',
        platform: 'Instagram'
      }
    }
  },
  {
    id: 'retailer-003',
    name: 'Style Central Chicago',
    region: 'Central',
    campaigns: {
      'spring-2024': {
        posted: true,
        postTime: '2024-03-18 12:15',
        postUrl: 'https://instagram.com/p/example3',
        engagement: 198,
        reach: 2900,
        likes: 156,
        comments: 18,
        shares: 24,
        platform: 'Instagram'
      },
      'summer-2024': {
        posted: true,
        postTime: '2024-06-15 13:00',
        postUrl: 'https://facebook.com/post/example3',
        engagement: 134,
        reach: 2100,
        likes: 89,
        comments: 22,
        shares: 23,
        platform: 'Facebook'
      },
      'fall-2024': {
        posted: false,
        status: 'scheduled',
        scheduled: '2024-09-20 11:00',
        reason: 'Waiting for brand approval',
        platform: 'LinkedIn'
      },
      'holiday-2024': {
        posted: false,
        status: 'notPosted',
        reason: 'Awaiting creative assets',
        platform: 'Instagram'
      }
    }
  },
  {
    id: 'retailer-004',
    name: 'Trend Setters Miami',
    region: 'South',
    campaigns: {
      'spring-2024': {
        posted: true,
        postTime: '2024-03-14 11:45',
        postUrl: 'https://instagram.com/p/example4',
        engagement: 289,
        reach: 3800,
        likes: 234,
        comments: 28,
        shares: 27,
        platform: 'Instagram'
      },
      'summer-2024': {
        posted: true,
        postTime: '2024-06-12 12:30',
        postUrl: 'https://facebook.com/post/example4',
        engagement: 167,
        reach: 2500,
        likes: 112,
        comments: 19,
        shares: 36,
        platform: 'Facebook'
      },
      'fall-2024': {
        posted: true,
        postTime: '2024-09-16 09:15',
        postUrl: 'https://linkedin.com/post/example4',
        engagement: 145,
        reach: 1900,
        likes: 98,
        comments: 12,
        shares: 35,
        platform: 'LinkedIn'
      },
      'holiday-2024': {
        posted: false,
        status: 'scheduled',
        scheduled: '2024-11-10 10:00',
        reason: 'Scheduled for launch day',
        platform: 'Instagram'
      }
    }
  },
  {
    id: 'retailer-005',
    name: 'Urban Style Dallas',
    region: 'South',
    campaigns: {
      'spring-2024': {
        posted: false,
        status: 'notPosted',
        reason: 'Content needs modification',
        platform: 'Instagram'
      },
      'summer-2024': {
        posted: true,
        postTime: '2024-06-18 16:20',
        postUrl: 'https://facebook.com/post/example5',
        engagement: 98,
        reach: 1800,
        likes: 67,
        comments: 12,
        shares: 19,
        platform: 'Facebook'
      },
      'fall-2024': {
        posted: false,
        status: 'scheduled',
        scheduled: '2024-09-25 14:00',
        reason: 'Scheduled for next week',
        platform: 'LinkedIn'
      },
      'holiday-2024': {
        posted: false,
        status: 'notPosted',
        reason: 'Awaiting retailer response',
        platform: 'Instagram'
      }
    }
  }
]

interface PostingStatusCellProps {
  retailer: any
  campaignId: string
  onCellClick: (retailer: any, campaignId: string) => void
}

function PostingStatusCell({ retailer, campaignId, onCellClick }: PostingStatusCellProps) {
  const campaignData = retailer.campaigns[campaignId]
  const isPosted = campaignData?.posted || false
  
  // Determine status
  let status = 'notPosted'
  if (isPosted) {
    status = 'posted'
  } else if (campaignData?.status === 'scheduled' || campaignData?.scheduled) {
    status = 'scheduled'
  } else if (campaignData?.status === 'unplanned') {
    status = 'unplanned'
  }

  const statusStyle = statusConfig[status as keyof typeof statusConfig]
  const StatusIcon = statusStyle.icon
  const campaign = campaigns.find(c => c.id === campaignId)

  // Create tooltip text
  let tooltipText = `${retailer.name} - ${campaign?.name}: `
  if (isPosted) {
    tooltipText += `Posted on ${campaignData.postTime}`
  } else if (status === 'scheduled') {
    tooltipText += `Scheduled for ${campaignData.scheduled}`
  } else if (status === 'unplanned') {
    tooltipText += 'No post planned'
  } else {
    tooltipText += campaignData?.reason || 'Not posted'
  }

  return (
    <div
      className={`
        relative w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer
        transition-all duration-200 hover:scale-105 hover:shadow-md border
        ${statusStyle.bgColor} ${statusStyle.borderColor}
        hover:border-opacity-60
      `}
      onClick={() => onCellClick(retailer, campaignId)}
      title={tooltipText}
    >
      <StatusIcon className={`w-4 h-4 ${statusStyle.color}`} />
    </div>
  )
}

interface PostingDetailModalProps {
  retailer: any
  campaignId: string
  onClose: () => void
}

function PostingDetailModal({ retailer, campaignId, onClose }: PostingDetailModalProps) {
  const campaignData = retailer.campaigns[campaignId]
  const isPosted = campaignData?.posted || false
  const campaign = campaigns.find(c => c.id === campaignId)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: campaign?.color }}
            />
            <div>
              <h3 className="font-semibold">{retailer.name}</h3>
              <p className="text-sm text-gray-600">{campaign?.name}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>

        {isPosted ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-5 h-5" />
              <span className="font-medium">Posted Successfully</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Posted Time</p>
                <p className="font-medium">{campaignData.postTime}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Platform</p>
                <p className="font-medium">{campaignData.platform}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="font-semibold text-blue-600">{campaignData.engagement}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reach</p>
                  <p className="font-semibold text-purple-600">{campaignData.reach?.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MessageCircle className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Likes</span>
                  </div>
                  <p className="font-medium">{campaignData.likes}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MessageCircle className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Comments</span>
                  </div>
                  <p className="font-medium">{campaignData.comments}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Share2 className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Shares</span>
                  </div>
                  <p className="font-medium">{campaignData.shares}</p>
                </div>
              </div>

              {campaignData.postUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(campaignData.postUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Post
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {campaignData?.status === 'scheduled' || campaignData?.scheduled ? (
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Scheduled</span>
              </div>
            ) : campaignData?.status === 'unplanned' ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Minus className="w-5 h-5" />
                <span className="font-medium">Unplanned</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <X className="w-5 h-5" />
                <span className="font-medium">Not Posted</span>
              </div>
            )}
            
            <div className="space-y-3">
              {campaignData?.platform && (
                <div>
                  <p className="text-sm text-gray-600">Platform</p>
                  <p className="font-medium">{campaignData.platform}</p>
                </div>
              )}
              
              {campaignData?.reason && (
                <div>
                  <p className="text-sm text-gray-600">Reason</p>
                  <p className="font-medium">{campaignData.reason}</p>
                </div>
              )}
              
              {campaignData?.scheduled && (
                <div>
                  <p className="text-sm text-gray-600">Scheduled For</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <p className="font-medium">{campaignData.scheduled}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ContentPostingMatrix() {
  const [selectedCell, setSelectedCell] = useState<{retailer: any, campaignId: string} | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'posted' | 'not-posted'>('all')

  const handleCellClick = (retailer: any, campaignId: string) => {
    setSelectedCell({ retailer, campaignId })
  }

  const handleCloseModal = () => {
    setSelectedCell(null)
  }

  // Calculate summary statistics
  const totalCells = retailerPostingData.length * campaigns.length
  const postedCells = retailerPostingData.reduce((sum, retailer) => {
    return sum + campaigns.filter(campaign => retailer.campaigns[campaign.id]?.posted).length
  }, 0)
  const scheduledCells = retailerPostingData.reduce((sum, retailer) => {
    return sum + campaigns.filter(campaign => 
      !retailer.campaigns[campaign.id]?.posted && 
      (retailer.campaigns[campaign.id]?.status === 'scheduled' || retailer.campaigns[campaign.id]?.scheduled)
    ).length
  }, 0)
  const unplannedCells = retailerPostingData.reduce((sum, retailer) => {
    return sum + campaigns.filter(campaign => 
      retailer.campaigns[campaign.id]?.status === 'unplanned'
    ).length
  }, 0)
  const notPostedCells = totalCells - postedCells - scheduledCells - unplannedCells
  const completionRate = (postedCells / (totalCells - unplannedCells) * 100).toFixed(1)

  // Filter retailers based on status
  const filteredRetailers = retailerPostingData.filter(retailer => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'posted') {
      return campaigns.some(campaign => retailer.campaigns[campaign.id]?.posted)
    }
    if (filterStatus === 'not-posted') {
      return campaigns.some(campaign => !retailer.campaigns[campaign.id]?.posted)
    }
    return true
  })

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Content Posting Status Matrix
              </CardTitle>
              <p className="text-sm text-gray-600">
                Track campaign content posting across retailers and platforms
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{completionRate}%</p>
                <p className="text-xs text-gray-600">Completion Rate</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === 'posted' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('posted')}
                >
                  Posted
                </Button>
                <Button
                  variant={filterStatus === 'not-posted' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus('not-posted')}
                >
                  Pending
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Campaign Headers */}
          <div className="mb-6">
            <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-4 items-center py-3 border-b border-gray-200">
              <div className="font-semibold text-gray-800">Retailer</div>
              {campaigns.map(campaign => {
                return (
                  <div key={campaign.id} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: campaign.color }}
                      />
                      <span className="font-medium text-sm text-gray-700">{campaign.name}</span>
                    </div>
                    <div 
                      className="w-6 h-0.5 rounded mx-auto"
                      style={{ backgroundColor: campaign.color }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Retailer Matrix */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {filteredRetailers.map((retailer, index) => (
              <div 
                key={retailer.id} 
                className={`
                  grid grid-cols-[200px_repeat(4,1fr)] gap-4 items-center p-4 
                  transition-colors hover:bg-blue-50 border-b border-gray-100 last:border-b-0
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-gray-900">{retailer.name}</p>
                    <Badge variant="outline" className="text-xs mt-1 text-gray-600">
                      {retailer.region}
                    </Badge>
                  </div>
                </div>
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="flex justify-center">
                    <PostingStatusCell
                      retailer={retailer}
                      campaignId={campaign.id}
                      onCellClick={handleCellClick}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Summary Statistics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{postedCells}</p>
              <p className="text-sm text-green-700">Posted</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{scheduledCells}</p>
              <p className="text-sm text-orange-700">Scheduled</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{notPostedCells}</p>
              <p className="text-sm text-red-700">Not Posted</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-500">{unplannedCells}</p>
              <p className="text-sm text-gray-600">Unplanned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{completionRate}%</p>
              <p className="text-sm text-blue-700">Completion Rate</p>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3 text-center">Status Legend</h4>
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded flex items-center justify-center ${statusConfig.posted.bgColor} border ${statusConfig.posted.borderColor}`}>
                  <Check className={`w-3 h-3 ${statusConfig.posted.color}`} />
                </div>
                <span className="text-gray-700">Posted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded flex items-center justify-center ${statusConfig.scheduled.bgColor} border ${statusConfig.scheduled.borderColor}`}>
                  <Clock className={`w-3 h-3 ${statusConfig.scheduled.color}`} />
                </div>
                <span className="text-gray-700">Scheduled</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded flex items-center justify-center ${statusConfig.notPosted.bgColor} border ${statusConfig.notPosted.borderColor}`}>
                  <X className={`w-3 h-3 ${statusConfig.notPosted.color}`} />
                </div>
                <span className="text-gray-700">Not Posted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded flex items-center justify-center ${statusConfig.unplanned.bgColor} border ${statusConfig.unplanned.borderColor}`}>
                  <Minus className={`w-3 h-3 ${statusConfig.unplanned.color}`} />
                </div>
                <span className="text-gray-700">Unplanned</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">Click any cell for detailed information</p>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedCell && (
        <PostingDetailModal
          retailer={selectedCell.retailer}
          campaignId={selectedCell.campaignId}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}