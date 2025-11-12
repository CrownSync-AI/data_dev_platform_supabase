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

// Mock data for retailer posting status
const retailerPostingData = [
  {
    id: 'retailer-001',
    name: 'Luxury Boutique NYC',
    region: 'East',
    platforms: {
      instagram: {
        posted: true,
        postTime: '2024-10-20 14:30',
        postUrl: 'https://instagram.com/p/example1',
        engagement: 245,
        reach: 3200,
        likes: 189,
        comments: 12,
        shares: 44
      },
      facebook: {
        posted: true,
        postTime: '2024-10-20 15:15',
        postUrl: 'https://facebook.com/post/example1',
        engagement: 156,
        reach: 2800,
        likes: 98,
        comments: 18,
        shares: 40
      },
      linkedin: {
        posted: false,
        scheduled: '2024-10-22 09:00',
        reason: 'Scheduled for Monday morning'
      },
      x: {
        posted: false,
        status: 'unplanned',
        reason: 'No X strategy for this campaign'
      }
    }
  },
  {
    id: 'retailer-002',
    name: 'Fashion Forward LA',
    region: 'West',
    platforms: {
      instagram: {
        posted: true,
        postTime: '2024-10-19 18:20',
        postUrl: 'https://instagram.com/p/example2',
        engagement: 312,
        reach: 4100,
        likes: 267,
        comments: 23,
        shares: 22
      },
      facebook: {
        posted: false,
        status: 'scheduled',
        scheduled: '2024-10-23 14:00',
        reason: 'Content under review - scheduled after approval'
      },
      linkedin: {
        posted: true,
        postTime: '2024-10-20 10:30',
        postUrl: 'https://linkedin.com/post/example2',
        engagement: 178,
        reach: 2200,
        likes: 134,
        comments: 15,
        shares: 29
      },
      x: {
        posted: false,
        status: 'unplanned',
        reason: 'Platform not active for this retailer'
      }
    }
  },
  {
    id: 'retailer-003',
    name: 'Style Central Chicago',
    region: 'Central',
    platforms: {
      instagram: {
        posted: true,
        postTime: '2024-10-21 12:15',
        postUrl: 'https://instagram.com/p/example3',
        engagement: 198,
        reach: 2900,
        likes: 156,
        comments: 18,
        shares: 24
      },
      facebook: {
        posted: true,
        postTime: '2024-10-21 13:00',
        postUrl: 'https://facebook.com/post/example3',
        engagement: 134,
        reach: 2100,
        likes: 89,
        comments: 22,
        shares: 23
      },
      linkedin: {
        posted: false,
        status: 'scheduled',
        scheduled: '2024-10-23 11:00',
        reason: 'Waiting for brand approval'
      },
      x: {
        posted: true,
        postTime: '2024-10-21 14:30',
        postUrl: 'https://x.com/post/example3',
        engagement: 67,
        reach: 1200,
        likes: 45,
        comments: 6,
        shares: 16
      }
    }
  },
  {
    id: 'retailer-004',
    name: 'Trend Setters Miami',
    region: 'South',
    platforms: {
      instagram: {
        posted: true,
        postTime: '2024-10-20 11:45',
        postUrl: 'https://instagram.com/p/example4',
        engagement: 289,
        reach: 3800,
        likes: 234,
        comments: 28,
        shares: 27
      },
      facebook: {
        posted: true,
        postTime: '2024-10-20 12:30',
        postUrl: 'https://facebook.com/post/example4',
        engagement: 167,
        reach: 2500,
        likes: 112,
        comments: 19,
        shares: 36
      },
      linkedin: {
        posted: true,
        postTime: '2024-10-21 09:15',
        postUrl: 'https://linkedin.com/post/example4',
        engagement: 145,
        reach: 1900,
        likes: 98,
        comments: 12,
        shares: 35
      },
      x: {
        posted: false,
        status: 'notPosted',
        reason: 'Technical issues with platform'
      }
    }
  },
  {
    id: 'retailer-005',
    name: 'Urban Style Dallas',
    region: 'South',
    platforms: {
      instagram: {
        posted: false,
        status: 'notPosted',
        reason: 'Content needs modification'
      },
      facebook: {
        posted: true,
        postTime: '2024-10-19 16:20',
        postUrl: 'https://facebook.com/post/example5',
        engagement: 98,
        reach: 1800,
        likes: 67,
        comments: 12,
        shares: 19
      },
      linkedin: {
        posted: false,
        status: 'scheduled',
        scheduled: '2024-10-24 14:00',
        reason: 'Scheduled for Thursday'
      },
      x: {
        posted: false,
        status: 'notPosted',
        reason: 'Awaiting retailer response'
      }
    }
  }
]

const platforms = ['instagram', 'facebook', 'linkedin', 'x'] as const

interface PostingStatusCellProps {
  retailer: any
  platform: string
  onCellClick: (retailer: any, platform: string) => void
}

function PostingStatusCell({ retailer, platform, onCellClick }: PostingStatusCellProps) {
  const platformData = retailer.platforms[platform]
  const isPosted = platformData?.posted || false
  
  // Determine status
  let status = 'notPosted'
  if (isPosted) {
    status = 'posted'
  } else if (platformData?.status === 'scheduled' || platformData?.scheduled) {
    status = 'scheduled'
  } else if (platformData?.status === 'unplanned') {
    status = 'unplanned'
  }

  const statusStyle = statusConfig[status as keyof typeof statusConfig]
  const StatusIcon = statusStyle.icon

  // Create tooltip text
  let tooltipText = `${retailer.name} - ${platformConfig[platform as keyof typeof platformConfig].name}: `
  if (isPosted) {
    tooltipText += `Posted on ${platformData.postTime}`
  } else if (status === 'scheduled') {
    tooltipText += `Scheduled for ${platformData.scheduled}`
  } else if (status === 'unplanned') {
    tooltipText += 'No post planned'
  } else {
    tooltipText += platformData?.reason || 'Not posted'
  }

  return (
    <div
      className={`
        relative w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer
        transition-all duration-200 hover:scale-105 hover:shadow-md border
        ${statusStyle.bgColor} ${statusStyle.borderColor}
        hover:border-opacity-60
      `}
      onClick={() => onCellClick(retailer, platform)}
      title={tooltipText}
    >
      <StatusIcon className={`w-4 h-4 ${statusStyle.color}`} />
    </div>
  )
}

interface PostingDetailModalProps {
  retailer: any
  platform: string
  onClose: () => void
}

function PostingDetailModal({ retailer, platform, onClose }: PostingDetailModalProps) {
  const platformData = retailer.platforms[platform]
  const isPosted = platformData?.posted || false

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{platformIcons[platform as keyof typeof platformIcons]}</div>
            <div>
              <h3 className="font-semibold">{retailer.name}</h3>
              <p className="text-sm text-gray-600 capitalize">{platform}</p>
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
                <p className="font-medium">{platformData.postTime}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="font-semibold text-blue-600">{platformData.engagement}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reach</p>
                  <p className="font-semibold text-purple-600">{platformData.reach?.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MessageCircle className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Likes</span>
                  </div>
                  <p className="font-medium">{platformData.likes}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <MessageCircle className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Comments</span>
                  </div>
                  <p className="font-medium">{platformData.comments}</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Share2 className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-600">Shares</span>
                  </div>
                  <p className="font-medium">{platformData.shares}</p>
                </div>
              </div>

              {platformData.postUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(platformData.postUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Post
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {platformData?.status === 'scheduled' || platformData?.scheduled ? (
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-medium">Scheduled</span>
              </div>
            ) : platformData?.status === 'unplanned' ? (
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
              {platformData?.reason && (
                <div>
                  <p className="text-sm text-gray-600">Reason</p>
                  <p className="font-medium">{platformData.reason}</p>
                </div>
              )}
              
              {platformData?.scheduled && (
                <div>
                  <p className="text-sm text-gray-600">Scheduled For</p>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <p className="font-medium">{platformData.scheduled}</p>
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
  const [selectedCell, setSelectedCell] = useState<{retailer: any, platform: string} | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'posted' | 'not-posted'>('all')

  const handleCellClick = (retailer: any, platform: string) => {
    setSelectedCell({ retailer, platform })
  }

  const handleCloseModal = () => {
    setSelectedCell(null)
  }

  // Calculate summary statistics
  const totalCells = retailerPostingData.length * platforms.length
  const postedCells = retailerPostingData.reduce((sum, retailer) => {
    return sum + platforms.filter(platform => retailer.platforms[platform]?.posted).length
  }, 0)
  const scheduledCells = retailerPostingData.reduce((sum, retailer) => {
    return sum + platforms.filter(platform => 
      !retailer.platforms[platform]?.posted && 
      (retailer.platforms[platform]?.status === 'scheduled' || retailer.platforms[platform]?.scheduled)
    ).length
  }, 0)
  const unplannedCells = retailerPostingData.reduce((sum, retailer) => {
    return sum + platforms.filter(platform => 
      retailer.platforms[platform]?.status === 'unplanned'
    ).length
  }, 0)
  const notPostedCells = totalCells - postedCells - scheduledCells - unplannedCells
  const completionRate = (postedCells / (totalCells - unplannedCells) * 100).toFixed(1)

  // Filter retailers based on status
  const filteredRetailers = retailerPostingData.filter(retailer => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'posted') {
      return platforms.some(platform => retailer.platforms[platform]?.posted)
    }
    if (filterStatus === 'not-posted') {
      return platforms.some(platform => !retailer.platforms[platform]?.posted)
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
          {/* Platform Headers */}
          <div className="mb-6">
            <div className="grid grid-cols-[200px_repeat(4,1fr)] gap-4 items-center py-3 border-b border-gray-200">
              <div className="font-semibold text-gray-800">Retailer</div>
              {platforms.map(platform => {
                const config = platformConfig[platform as keyof typeof platformConfig]
                const PlatformIcon = config.icon
                return (
                  <div key={platform} className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <PlatformIcon 
                        className="w-4 h-4" 
                        style={{ color: config.color }}
                      />
                      <span className="font-medium text-sm text-gray-700">{config.name}</span>
                    </div>
                    <div 
                      className="w-6 h-0.5 rounded mx-auto"
                      style={{ backgroundColor: config.color }}
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
                {platforms.map(platform => (
                  <div key={platform} className="flex justify-center">
                    <PostingStatusCell
                      retailer={retailer}
                      platform={platform}
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
          platform={selectedCell.platform}
          onClose={handleCloseModal}
        />
      )}
    </>
  )
}