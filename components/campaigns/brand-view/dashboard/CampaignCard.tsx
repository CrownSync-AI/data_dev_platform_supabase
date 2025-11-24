'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, TrendingUp, TrendingDown, Minus, Calendar, Users, Mail, Eye, MousePointer, MoreHorizontal, Share2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import CampaignFilters from './CampaignFilters'
import CampaignList from './CampaignList'

export interface Campaign {
  campaign_id: string
  campaign_name: string
  campaign_status: 'active' | 'paused' | 'completed'
  campaign_type: 'email' | 'social' | 'mixed'
  start_date: string
  end_date?: string
  duration_days: number
  avg_click_rate: number
  total_reach: number
  total_engagement: number
  participating_retailers_count: number
  total_emails_sent: number
  performance_tier: 'high' | 'good' | 'standard'
  trend_direction: 'up' | 'down' | 'stable'
  last_updated: string
  campaign_image?: string
  platform_performance?: any
  email_metrics?: any
}

interface CampaignCardViewProps {
  role: 'brand' | 'retailer'
  retailerId?: string
  onCampaignClick?: (campaignId: string, campaign: Campaign) => void
}

export default function CampaignCardView({ role, retailerId, onCampaignClick }: CampaignCardViewProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: { from: undefined, to: undefined },
    search: ''
  })


  useEffect(() => {
    fetchCampaigns()
  }, [role, retailerId, filters])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)

      // TEMPORARY: Use mock data directly to ensure recent dates
      console.log('🔍 Using mock campaigns with recent dates for demo')
      const mockCampaigns = getMockCampaigns()
      console.log('🔍 Mock campaigns:', mockCampaigns.map(c => ({
        id: c.campaign_id,
        name: c.campaign_name,
        start_date: c.start_date,
        end_date: c.end_date
      })))
      setCampaigns(mockCampaigns)

      // Commented out API call to force mock data usage
      /*
      const params = new URLSearchParams({
        role,
        limit: '20',
        offset: '0'
      })
      
      if (retailerId) params.append('retailerId', retailerId)
      if (filters.search) params.append('search', filters.search)
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.type !== 'all') params.append('type', filters.type)
      
      const response = await fetch(`/api/brand-campaigns?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns')
      }
      
      const data = await response.json()
      
      if (data.campaigns) {
        console.log('🔍 API campaigns received:', data.campaigns.map((c: any) => ({
          id: c.campaign_id,
          name: c.campaign_name,
          image: c.campaign_image
        })))
        setCampaigns(data.campaigns)
      } else {
        throw new Error('No campaigns data received')
      }
      */

    } catch (error) {
      console.error('Error fetching campaigns:', error)
      // Use mock data as fallback
      const mockCampaigns = getMockCampaigns()
      console.log('🔍 Using fallback mock campaigns:', mockCampaigns.map(c => ({
        id: c.campaign_id,
        name: c.campaign_name,
        image: c.campaign_image
      })))
      setCampaigns(mockCampaigns)
    } finally {
      setLoading(false)
    }
  }

  const getMockCampaigns = (): Campaign[] => [
    {
      campaign_id: '1',
      campaign_name: 'Spring Collection Preview',
      campaign_status: 'active',
      campaign_type: 'social',
      start_date: '2025-09-15',
      end_date: '2025-10-15',
      duration_days: 30,
      avg_click_rate: 2.9,
      total_reach: 285000,
      total_engagement: 24500,
      participating_retailers_count: 5,
      total_emails_sent: 1500,
      performance_tier: 'high',
      trend_direction: 'up',
      last_updated: '2025-10-02T10:30:00Z',
      campaign_image: 'https://dwj.dickson.com.tw/wp-content/uploads/2025/04/rolex-new-watches-2025-new-dials_m126518ln-0014_2501stojan_001-portrait.jpg'
    },
    {
      campaign_id: '2',
      campaign_name: 'Holiday Luxury Campaign',
      campaign_status: 'paused',
      campaign_type: 'email',
      start_date: '2025-08-20',
      end_date: '2025-09-20',
      duration_days: 30,
      avg_click_rate: 2.9,
      total_reach: 198000,
      total_engagement: 18200,
      participating_retailers_count: 5,
      total_emails_sent: 1500,
      performance_tier: 'good',
      trend_direction: 'stable',
      last_updated: '2025-10-01T15:45:00Z',
      campaign_image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=250&fit=crop&auto=format'
    },
    {
      campaign_id: '3',
      campaign_name: 'Winter Elegance Collection',
      campaign_status: 'active',
      campaign_type: 'social',
      start_date: '2025-09-25',
      end_date: '2025-10-25',
      duration_days: 31,
      avg_click_rate: 2.9,
      total_reach: 0,
      total_engagement: 0,
      participating_retailers_count: 5,
      total_emails_sent: 1500,
      performance_tier: 'standard',
      trend_direction: 'stable',
      last_updated: '2025-09-30T09:20:00Z',
      campaign_image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=250&fit=crop&auto=format'
    },
    {
      campaign_id: '4',
      campaign_name: 'Winter Wonderland Exclusive',
      campaign_status: 'active',
      campaign_type: 'social',
      start_date: '2025-09-10',
      end_date: '2025-10-10',
      duration_days: 31,
      avg_click_rate: 3.8,
      total_reach: 312000,
      total_engagement: 28900,
      participating_retailers_count: 8,
      total_emails_sent: 2200,
      performance_tier: 'high',
      trend_direction: 'up',
      last_updated: '2025-10-02T14:15:00Z',
      campaign_image: 'https://media.rolex.com/image/upload/v1725888690/rolexcom/collection/configurator/config-launcher/2024/config-launcher-watches-day-date-m228235-0055_2403jva_002.jpg'
    },
    {
      campaign_id: '5',
      campaign_name: 'Artisan Heritage Collection',
      campaign_status: 'completed',
      campaign_type: 'social',
      start_date: '2025-08-15',
      end_date: '2025-09-15',
      duration_days: 31,
      avg_click_rate: 2.1,
      total_reach: 156000,
      total_engagement: 12400,
      participating_retailers_count: 4,
      total_emails_sent: 0,
      performance_tier: 'good',
      trend_direction: 'down',
      last_updated: '2025-09-15T18:30:00Z',
      campaign_image: 'https://blog.luxehouze.com/wp-content/uploads/2024/02/crop-16-fotor-20230714172425-1024x576.jpg'
    },
    {
      campaign_id: '6',
      campaign_name: 'Timeless Elegance Launch',
      campaign_status: 'active',
      campaign_type: 'email',
      start_date: '2025-09-05',
      end_date: '2025-10-05',
      duration_days: 30,
      avg_click_rate: 3.2,
      total_reach: 245000,
      total_engagement: 21800,
      participating_retailers_count: 6,
      total_emails_sent: 1800,
      performance_tier: 'high',
      trend_direction: 'up',
      last_updated: '2025-10-02T11:45:00Z',
      campaign_image: 'https://lapatiala.com/wp-content/uploads/2024/12/Why-Is-Rolex-So-Expensive.jpg'
    },
    {
      campaign_id: '7',
      campaign_name: 'Modern Minimalist Series',
      campaign_status: 'completed',
      campaign_type: 'social',
      start_date: '2025-08-10',
      end_date: '2025-09-10',
      duration_days: 31,
      avg_click_rate: 2.5,
      total_reach: 189000,
      total_engagement: 15200,
      participating_retailers_count: 7,
      total_emails_sent: 1200,
      performance_tier: 'standard',
      trend_direction: 'stable',
      last_updated: '2025-09-10T16:20:00Z',
      campaign_image: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=250&fit=crop&auto=format'
    },
    {
      campaign_id: '8',
      campaign_name: 'Luxury Lifestyle Showcase',
      campaign_status: 'active',
      campaign_type: 'social',
      start_date: '2025-09-01',
      end_date: '2025-10-01',
      duration_days: 30,
      avg_click_rate: 3.1,
      total_reach: 267000,
      total_engagement: 22300,
      participating_retailers_count: 9,
      total_emails_sent: 0,
      performance_tier: 'high',
      trend_direction: 'up',
      last_updated: '2025-10-01T13:10:00Z',
      campaign_image: 'https://blog.luxehouze.com/wp-content/uploads/2024/02/crop-16-fotor-20230714172425-1024x576.jpg'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPerformanceTierColor = (tier: string) => {
    switch (tier) {
      case 'high': return 'bg-green-100 text-green-800 border-green-200'
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'standard': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredAndSortedCampaigns = campaigns
    .filter(campaign => {
      const matchesSearch = !filters.search || campaign.campaign_name.toLowerCase().includes(filters.search.toLowerCase())
      const matchesStatus = filters.status === 'all' || campaign.campaign_status === filters.status
      const matchesType = filters.type === 'all' || campaign.campaign_type === filters.type

      let matchesDateRange = true
      if (filters.dateRange.from || filters.dateRange.to) {
        const campaignDate = new Date(campaign.start_date)
        console.log('📅 Filtering campaign:', campaign.campaign_name, 'Date:', campaignDate, 'Range:', filters.dateRange)
        if (filters.dateRange.from && campaignDate < filters.dateRange.from) {
          console.log('📅 Campaign before start date')
          matchesDateRange = false
        }
        if (filters.dateRange.to && campaignDate > filters.dateRange.to) {
          console.log('📅 Campaign after end date')
          matchesDateRange = false
        }
        console.log('📅 Campaign matches date range:', matchesDateRange)
      }

      return matchesSearch && matchesStatus && matchesType && matchesDateRange
    })
    .sort((a, b) => {
      // Default sort by last updated (newest first)
      return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
    })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const handleCampaignClick = (campaign: Campaign) => {
    if (onCampaignClick) {
      onCampaignClick(campaign.campaign_id, campaign)
    }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Filters and Views */}
      <CampaignFilters
        filters={filters}
        onFiltersChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={filteredAndSortedCampaigns.length}
      />

      {/* Campaign Display - Card or List View */}
      {viewMode === 'list' ? (
        <CampaignList
          campaigns={filteredAndSortedCampaigns}
          onCampaignClick={handleCampaignClick}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCampaigns.map((campaign) => {
            console.log('🔍 RENDERING CAMPAIGN:', campaign.campaign_name, 'HAS IMAGE:', !!campaign.campaign_image, 'IMAGE URL:', campaign.campaign_image)
            return (
              <Card
                key={campaign.campaign_id}
                className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden p-0 flex flex-col h-[520px]"
                onClick={() => handleCampaignClick(campaign)}
              >
                {/* Campaign Image */}
                <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
                  <img
                    src={campaign.campaign_image || 'https://cdn.shopify.com/s/files/1/0457/5133/7113/collections/523.jpg?v=1598118573'}
                    alt={campaign.campaign_name}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="bg-white/80 backdrop-blur-sm hover:bg-white/90">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                        <DropdownMenuItem>Export Data</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <Badge className={getStatusColor(campaign.campaign_status)}>
                      {campaign.campaign_status}
                    </Badge>
                    <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                      {campaign.campaign_type}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-0 px-4 pt-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Reserved space for campaign title - ensures consistent height */}
                      <div className="h-6 mb-0">
                        <CardTitle className="text-base leading-tight">{campaign.campaign_name}</CardTitle>
                      </div>
                      {!campaign.campaign_image && (
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(campaign.campaign_status)}>
                            {campaign.campaign_status}
                          </Badge>
                          <Badge variant="outline">{campaign.campaign_type}</Badge>
                        </div>
                      )}
                    </div>
                    {!campaign.campaign_image && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                          <DropdownMenuItem>Export Data</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pt-0 px-4 pb-2 flex flex-col flex-1">
                  {/* Key Metrics - Campaign Type Specific */}
                  <div className="grid grid-cols-2 gap-2 mb-1">
                    <div>
                      <p className="text-sm text-gray-600">
                        {campaign.campaign_type === 'email' ? 'Click Rate' : 'Engagement Rate'}
                      </p>
                      <p className="text-base font-bold">{campaign.avg_click_rate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {campaign.campaign_type === 'email' ? 'Email Performance:' : 'Platform Performance:'}
                      </p>
                      <Badge className={getPerformanceTierColor(campaign.performance_tier)}>
                        {campaign.performance_tier}
                      </Badge>
                    </div>
                  </div>

                  {/* Performance Metrics - Campaign Type Specific */}
                  <div className="space-y-1 flex-grow">
                    {campaign.campaign_type === 'email' ? (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Emails Sent</span>
                          </div>
                          <span className="font-medium">{formatNumber(campaign.total_emails_sent)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Email Opens</span>
                          </div>
                          <span className="font-medium">{formatNumber(Math.round(campaign.total_emails_sent * 0.25))}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MousePointer className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">Email Clicks</span>
                          </div>
                          <span className="font-medium">{formatNumber(Math.round(campaign.total_emails_sent * 0.029))}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">Retailers</span>
                          </div>
                          <span className="font-medium">{campaign.participating_retailers_count}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Social Reach</span>
                          </div>
                          <span className="font-medium">{formatNumber(campaign.total_reach)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MousePointer className="h-4 w-4 text-purple-600" />
                            <span className="text-sm">Social Engagement</span>
                          </div>
                          <span className="font-medium">{formatNumber(campaign.total_engagement)}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Share2 className="h-4 w-4 text-indigo-600" />
                            <span className="text-sm">Platforms</span>
                          </div>
                          <span className="font-medium">4</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">Retailers</span>
                          </div>
                          <span className="font-medium">{campaign.participating_retailers_count}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Performance Grading - Aligned at bottom */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between border-t mt-2 pt-2">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(campaign.trend_direction)}
                        <span className="text-sm text-gray-600">Trending {campaign.trend_direction}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        {formatDate(campaign.start_date)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedCampaigns.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-4">
              {filters.search || filters.status !== 'all' || filters.type !== 'all' || filters.dateRange.from || filters.dateRange.to
                ? 'Try adjusting your search or filters'
                : 'No campaigns available for this view'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}