'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    CheckCircle2,
    XCircle,
    Eye,
    MessageCircle,
    Share2,
    ExternalLink,
    Instagram,
    Facebook,
    Linkedin,
    Twitter,
    Grid3x3,
    Minus
} from 'lucide-react'

// Platform configuration
const platforms = [
    {
        id: 'instagram',
        name: 'Instagram',
        icon: Instagram,
        color: '#E4405F',
        bgColor: 'bg-pink-50',
        iconColor: 'text-pink-600'
    },
    {
        id: 'facebook',
        name: 'Facebook',
        icon: Facebook,
        color: '#1877F2',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600'
    },
    {
        id: 'x',
        name: 'X',
        icon: Twitter,
        color: '#000000',
        bgColor: 'bg-gray-50',
        iconColor: 'text-gray-900'
    },
    {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: Linkedin,
        color: '#0A66C2',
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-700'
    }
]

// Status configuration with Material Design icons
const statusConfig = {
    posted: {
        icon: CheckCircle2,
        label: 'Posted',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        dotColor: 'bg-green-500'
    },
    not_posted: {
        icon: XCircle,
        label: 'Not Posted',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        dotColor: 'bg-red-500'
    },
    not_planned: {
        icon: Minus,
        label: 'Not Planned',
        color: 'text-gray-400',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        dotColor: 'bg-gray-300'
    }
}

// TypeScript interfaces
type PlatformStatus = 'posted' | 'not_posted' | 'not_planned'

interface PlatformData {
    status: PlatformStatus
    postTime?: string
    postUrl?: string
    engagement?: number
    reach?: number
    likes?: number
    comments?: number
    shares?: number
    scheduledTime?: string
    reason?: string
}

interface RetailerData {
    id: string
    name: string
    region: string
    platforms: {
        [key: string]: PlatformData
    }
}

// Mock data for Spring Collection 2025
const retailerPostingData: RetailerData[] = [
    {
        id: 'retailer-001',
        name: 'Luxury Boutique NYC',
        region: 'East',
        platforms: {
            instagram: {
                status: 'posted',
                postTime: '2025-03-15 14:30',
                postUrl: 'https://instagram.com/p/example1',
                engagement: 1245,
                reach: 18200,
                likes: 1089,
                comments: 87,
                shares: 69
            },
            facebook: {
                status: 'posted',
                postTime: '2025-03-15 15:00',
                postUrl: 'https://facebook.com/post/example1',
                engagement: 892,
                reach: 12400,
                likes: 734,
                comments: 94,
                shares: 64
            },
            x: {
                status: 'not_planned',
                reason: 'Not part of campaign strategy'
            },
            linkedin: {
                status: 'posted',
                postTime: '2025-03-16 09:00',
                postUrl: 'https://linkedin.com/post/example1',
                engagement: 456,
                reach: 8900,
                likes: 378,
                comments: 45,
                shares: 33
            }
        }
    },
    {
        id: 'retailer-002',
        name: 'Fashion Forward LA',
        region: 'West',
        platforms: {
            instagram: {
                status: 'posted',
                postTime: '2025-03-14 18:20',
                postUrl: 'https://instagram.com/p/example2',
                engagement: 2134,
                reach: 24800,
                likes: 1876,
                comments: 156,
                shares: 102
            },
            facebook: {
                status: 'posted',
                postTime: '2025-03-14 19:00',
                postUrl: 'https://facebook.com/post/example2',
                engagement: 1245,
                reach: 16700,
                likes: 1034,
                comments: 123,
                shares: 88
            },
            x: {
                status: 'posted',
                postTime: '2025-03-15 12:30',
                postUrl: 'https://x.com/post/example2',
                engagement: 678,
                reach: 11200,
                likes: 534,
                comments: 89,
                shares: 55
            },
            linkedin: {
                status: 'not_posted',
                reason: 'Pending content approval'
            }
        }
    },
    {
        id: 'retailer-003',
        name: 'Style Central Chicago',
        region: 'Central',
        platforms: {
            instagram: {
                status: 'posted',
                postTime: '2025-03-16 12:15',
                postUrl: 'https://instagram.com/p/example3',
                engagement: 987,
                reach: 15600,
                likes: 823,
                comments: 98,
                shares: 66
            },
            facebook: {
                status: 'not_posted',
                reason: 'Awaiting final creative approval'
            },
            x: {
                status: 'not_planned',
                reason: 'Not active on this platform'
            },
            linkedin: {
                status: 'posted',
                postTime: '2025-03-17 10:00',
                postUrl: 'https://linkedin.com/post/example3',
                engagement: 345,
                reach: 6800,
                likes: 267,
                comments: 43,
                shares: 35
            }
        }
    },
    {
        id: 'retailer-004',
        name: 'Trend Setters Miami',
        region: 'South',
        platforms: {
            instagram: {
                status: 'posted',
                postTime: '2025-03-13 11:45',
                postUrl: 'https://instagram.com/p/example4',
                engagement: 1567,
                reach: 21300,
                likes: 1323,
                comments: 145,
                shares: 99
            },
            facebook: {
                status: 'posted',
                postTime: '2025-03-13 12:30',
                postUrl: 'https://facebook.com/post/example4',
                engagement: 1089,
                reach: 14200,
                likes: 876,
                comments: 134,
                shares: 79
            },
            x: {
                status: 'posted',
                postTime: '2025-03-14 09:15',
                postUrl: 'https://x.com/post/example4',
                engagement: 534,
                reach: 9100,
                likes: 423,
                comments: 67,
                shares: 44
            },
            linkedin: {
                status: 'posted',
                postTime: '2025-03-15 08:00',
                postUrl: 'https://linkedin.com/post/example4',
                engagement: 423,
                reach: 7600,
                likes: 334,
                comments: 56,
                shares: 33
            }
        }
    },
    {
        id: 'retailer-005',
        name: 'Urban Style Dallas',
        region: 'South',
        platforms: {
            instagram: {
                status: 'not_posted',
                reason: 'Missed posting window'
            },
            facebook: {
                status: 'posted',
                postTime: '2025-03-12 16:20',
                postUrl: 'https://facebook.com/post/example5',
                engagement: 756,
                reach: 11800,
                likes: 612,
                comments: 89,
                shares: 55
            },
            x: {
                status: 'not_planned',
                reason: 'Platform not active for this retailer'
            },
            linkedin: {
                status: 'not_posted',
                reason: 'Content under legal review'
            }
        }
    },
    {
        id: 'retailer-006',
        name: 'Chic Boutique Seattle',
        region: 'West',
        platforms: {
            instagram: {
                status: 'posted',
                postTime: '2025-03-17 13:00',
                postUrl: 'https://instagram.com/p/example6',
                engagement: 1123,
                reach: 17400,
                likes: 945,
                comments: 112,
                shares: 66
            },
            facebook: {
                status: 'not_posted',
                reason: 'Technical issue with API'
            },
            x: {
                status: 'posted',
                postTime: '2025-03-17 14:30',
                postUrl: 'https://x.com/post/example6',
                engagement: 445,
                reach: 8200,
                likes: 356,
                comments: 54,
                shares: 35
            },
            linkedin: {
                status: 'posted',
                postTime: '2025-03-18 09:30',
                postUrl: 'https://linkedin.com/post/example6',
                engagement: 389,
                reach: 7100,
                likes: 312,
                comments: 48,
                shares: 29
            }
        }
    }
]

interface StatusCellProps {
    retailer: RetailerData
    platformId: string
    onCellClick: (retailer: RetailerData, platformId: string) => void
}

function StatusCell({ retailer, platformId, onCellClick }: StatusCellProps) {
    const platformData = retailer.platforms[platformId]
    const status = platformData?.status || 'not_planned'
    const statusStyle = statusConfig[status as keyof typeof statusConfig]
    const StatusIcon = statusStyle.icon
    const platform = platforms.find(p => p.id === platformId)

    return (
        <div
            className={`
        relative min-h-[80px] flex items-center justify-center cursor-pointer
        transition-all duration-200
        ${statusStyle.bgColor} ${statusStyle.borderColor}
        border-r border-gray-200 last:border-r-0
        hover:opacity-80 hover:shadow-inner
        group
      `}
            onClick={() => onCellClick(retailer, platformId)}
            title={`${retailer.name} - ${platform?.name}: ${statusStyle.label}`}
        >
            <StatusIcon className={`w-5 h-5 ${statusStyle.color}`} />
        </div>
    )
}

interface DetailModalProps {
    retailer: RetailerData
    platformId: string
    onClose: () => void
}

function DetailModal({ retailer, platformId, onClose }: DetailModalProps) {
    const platformData = retailer.platforms[platformId]
    const platform = platforms.find(p => p.id === platformId)
    const PlatformIcon = platform?.icon || Grid3x3
    const status = platformData?.status || 'not_planned'
    const statusStyle = statusConfig[status as keyof typeof statusConfig]
    const StatusIcon = statusStyle.icon

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Header */}
                <div className={`${platform?.bgColor} p-6 border-b`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 bg-white rounded-lg shadow-sm`}>
                                <PlatformIcon className={`w-6 h-6 ${platform?.iconColor}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{retailer.name}</h3>
                                <p className="text-sm text-gray-600">{platform?.name}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                            ×
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${statusStyle.color}`} />
                        <span className={`font-semibold ${statusStyle.color}`}>{statusStyle.label}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {status === 'posted' && platformData ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Posted Time</p>
                                    <p className="font-medium text-gray-900">{platformData.postTime}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Total Engagement</p>
                                    <p className="font-bold text-blue-600">{platformData.engagement?.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Eye className="w-3.5 h-3.5 text-purple-500" />
                                        <span className="text-xs text-gray-600">Reach</span>
                                    </div>
                                    <p className="font-bold text-gray-900">{platformData.reach?.toLocaleString()}</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                                        <span className="text-xs text-gray-600">Comments</span>
                                    </div>
                                    <p className="font-bold text-gray-900">{platformData.comments}</p>
                                </div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-1 mb-1">
                                        <Share2 className="w-3.5 h-3.5 text-green-500" />
                                        <span className="text-xs text-gray-600">Shares</span>
                                    </div>
                                    <p className="font-bold text-gray-900">{platformData.shares}</p>
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
                        </>
                    ) : status === 'not_posted' && platformData ? (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex items-center gap-2 mb-2">
                                <XCircle className="w-4 h-4 text-red-600" />
                                <span className="font-medium text-red-900">Not Posted</span>
                            </div>
                            {platformData.reason && (
                                <div>
                                    <p className="text-xs text-red-600/80 mb-1">Reason</p>
                                    <p className="text-sm text-red-700">{platformData.reason}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <Minus className="w-4 h-4 text-gray-400" />
                                <span className="font-medium text-gray-700">Not Planned</span>
                            </div>
                            {platformData?.reason && (
                                <p className="text-sm text-gray-600">{platformData.reason}</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function PlatformPostingMatrix() {
    const [selectedCell, setSelectedCell] = useState<{ retailer: RetailerData; platformId: string } | null>(null)

    const handleCellClick = (retailer: RetailerData, platformId: string) => {
        setSelectedCell({ retailer, platformId })
    }

    const handleCloseModal = () => {
        setSelectedCell(null)
    }

    // Calculate summary statistics
    const totalCells = retailerPostingData.length * platforms.length
    const statusCounts = {
        posted: 0,
        not_posted: 0,
        not_planned: 0
    }

    retailerPostingData.forEach(retailer => {
        platforms.forEach(platform => {
            const status = retailer.platforms[platform.id]?.status || 'not_planned'
            statusCounts[status as keyof typeof statusCounts]++
        })
    })

    const completionRate = ((statusCounts.posted / (totalCells - statusCounts.not_planned)) * 100).toFixed(1)

    return (
        <>
            <Card className="overflow-hidden border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200 bg-white pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <Grid3x3 className="h-5 w-5 text-indigo-600" />
                                </div>
                                Content Posting Status Matrix
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-2">
                                Platform posting status for <span className="font-semibold">Spring Collection 2025</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-green-600">{completionRate}%</div>
                            <p className="text-xs text-gray-500 mt-1">Completion Rate</p>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {/* Matrix Grid */}
                    <div className="overflow-x-auto">
                        <div className="inline-block min-w-full">
                            {/* Header Row */}
                            <div className="grid grid-cols-[200px_repeat(4,1fr)] border-b border-gray-200 bg-white">
                                <div className="p-4 font-semibold text-gray-700">
                                    Retailer
                                </div>
                                {platforms.map(platform => {
                                    const PlatformIcon = platform.icon
                                    return (
                                        <div
                                            key={platform.id}
                                            className="p-4 text-center"
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <PlatformIcon className={`w-4 h-4 ${platform.iconColor}`} />
                                                <span className="font-semibold text-sm text-gray-700">{platform.name}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Data Rows */}
                            {retailerPostingData.map((retailer) => (
                                <div
                                    key={retailer.id}
                                    className="grid grid-cols-[200px_repeat(4,1fr)] border-b border-gray-200 last:border-b-0"
                                >
                                    <div className="p-4 border-r border-gray-200 flex items-center bg-white">
                                        <div>
                                            <p className="font-medium text-gray-900">{retailer.name}</p>
                                            <Badge variant="outline" className="text-xs mt-1 text-gray-600 border-gray-300">
                                                {retailer.region}
                                            </Badge>
                                        </div>
                                    </div>
                                    {platforms.map(platform => (
                                        <StatusCell
                                            key={platform.id}
                                            retailer={retailer}
                                            platformId={platform.id}
                                            onCellClick={handleCellClick}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border-t border-gray-200">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${statusConfig.posted.dotColor}`} />
                                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Posted</p>
                            </div>
                            <p className="text-2xl font-bold text-green-600">{statusCounts.posted}</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${statusConfig.not_posted.dotColor}`} />
                                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Not Posted</p>
                            </div>
                            <p className="text-2xl font-bold text-red-600">{statusCounts.not_posted}</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <div className={`w-2 h-2 rounded-full ${statusConfig.not_planned.dotColor}`} />
                                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Not Planned</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-400">{statusCounts.not_planned}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">Total</p>
                            <p className="text-2xl font-bold text-blue-600">{totalCells}</p>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center mb-3 font-medium">
                            Click any cell for detailed information
                        </p>
                        <div className="flex items-center justify-center gap-6 flex-wrap">
                            {Object.entries(statusConfig).map(([key, config]) => {
                                const Icon = config.icon
                                return (
                                    <div key={key} className="flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded flex items-center justify-center ${config.bgColor} border ${config.borderColor}`}>
                                            <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                                        </div>
                                        <span className="text-xs text-gray-700 font-medium">{config.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detail Modal */}
            {selectedCell && (
                <DetailModal
                    retailer={selectedCell.retailer}
                    platformId={selectedCell.platformId}
                    onClose={handleCloseModal}
                />
            )}
        </>
    )
}
