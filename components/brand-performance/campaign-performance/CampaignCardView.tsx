'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, TrendingUp, TrendingDown, Minus, Calendar, Users, Mail, Eye, MousePointer, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import CampaignFiltersAndViews from './CampaignFiltersAndViews'
import CampaignListView from './CampaignListView'

interface Campaign {
  campaign_id: string
  campaign_name: string
  campaign_status: 'active' | 'paused' | 'completed' | 'draft'
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
}

interface CampaignCardViewProps {
  role: 'brand' | 'retailer'
  retailerId?: string
}

export default function CampaignCardView({ role, retailerId }: CampaignCardViewProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [sortBy, setSortBy] = useState('updated')
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    performanceTier: 'all',
    dateRange: { from: undefined, to: undefined },
    search: ''
  })


  useEffect(() => {
    fetchCampaigns()
  }, [role, retailerId, filters])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        role,
        limit: '20',
        offset: '0'
      })
      
      if (retailerId) params.append('retailerId', retailerId)
      if (filters.search) params.append('search', filters.search)
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.type !== 'all') params.append('type', filters.type)
      if (filters.performanceTier !== 'all') params.append('performanceTier', filters.performanceTier)
      
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
      campaign_type: 'mixed',
      start_date: '2024-12-01',
      end_date: '2025-01-01',
      duration_days: 32,
      avg_click_rate: 2.9,
      total_reach: 285000,
      total_engagement: 24500,
      participating_retailers_count: 5,
      total_emails_sent: 1500,
      performance_tier: 'high',
      trend_direction: 'up',
      last_updated: '2024-12-19T10:30:00Z',
      campaign_image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop&auto=format'
    },
    {
      campaign_id: '2',
      campaign_name: 'Holiday Luxury Campaign',
      campaign_status: 'paused',
      campaign_type: 'email',
      start_date: '2024-11-15',
      end_date: '2025-01-16',
      duration_days: 62,
      avg_click_rate: 2.9,
      total_reach: 198000,
      total_engagement: 18200,
      participating_retailers_count: 5,
      total_emails_sent: 1500,
      performance_tier: 'good',
      trend_direction: 'stable',
      last_updated: '2024-12-18T15:45:00Z',
      campaign_image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop&auto=format'
    },
    {
      campaign_id: '3',
      campaign_name: 'Summer Elegance 2025',
      campaign_status: 'draft',
      campaign_type: 'social',
      start_date: '2025-03-01',
      end_date: '2025-05-01',
      duration_days: 0,
      avg_click_rate: 2.9,
      total_reach: 0,
      total_engagement: 0,
      participating_retailers_count: 5,
      total_emails_sent: 1500,
      performance_tier: 'standard',
      trend_direction: 'stable',
      last_updated: '2024-12-17T09:20:00Z',
      campaign_image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=250&fit=crop&auto=format'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
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
      const matchesPerformance = filters.performanceTier === 'all' || campaign.performance_tier === filters.performanceTier
      
      let matchesDateRange = true
      if (filters.dateRange.from || filters.dateRange.to) {
        const campaignDate = new Date(campaign.start_date)
        if (filters.dateRange.from && campaignDate < filters.dateRange.from) matchesDateRange = false
        if (filters.dateRange.to && campaignDate > filters.dateRange.to) matchesDateRange = false
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesPerformance && matchesDateRange
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.campaign_name.localeCompare(b.campaign_name)
        case 'name-desc':
          return b.campaign_name.localeCompare(a.campaign_name)
        case 'performance':
          const performanceOrder = { high: 3, good: 2, standard: 1 }
          return performanceOrder[b.performance_tier] - performanceOrder[a.performance_tier]
        case 'start-date':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        case 'engagement':
          return b.total_engagement - a.total_engagement
        case 'updated':
        default:
          return new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime()
      }
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
    // Handle campaign click - could navigate to detail view
    console.log('Campaign clicked:', campaign.campaign_name)
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Filters and Views */}
      <CampaignFiltersAndViews
        filters={filters}
        onFiltersChange={setFilters}
        sortBy={sortBy}
        onSortChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={filteredAndSortedCampaigns.length}
      />

      {/* Campaign Display - Card or List View */}
      {viewMode === 'list' ? (
        <CampaignListView 
          campaigns={filteredAndSortedCampaigns}
          onCampaignClick={handleCampaignClick}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCampaigns.map((campaign) => {
          console.log('🔍 RENDERING CAMPAIGN:', campaign.campaign_name, 'HAS IMAGE:', !!campaign.campaign_image, 'IMAGE URL:', campaign.campaign_image)
          return (
          <Card key={campaign.campaign_id} className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden p-0">
            {/* Campaign Image */}
            {(campaign.campaign_image || true) && (
              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                <img 
                  src={campaign.campaign_image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop&auto=format'} 
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
            )}
            
            <CardHeader className="pb-3 px-6 pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{campaign.campaign_name}</CardTitle>
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
            
            <CardContent className="pt-0 px-6 pb-6">
              {/* Key Metrics - Only Ayrshare available data */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                  <p className="text-xl font-bold">{campaign.avg_click_rate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Performance</p>
                  <Badge className={getPerformanceTierColor(campaign.performance_tier)}>
                    {campaign.performance_tier}
                  </Badge>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Reach</span>
                  </div>
                  <span className="font-medium">{formatNumber(campaign.total_reach)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MousePointer className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">Engagement</span>
                  </div>
                  <span className="font-medium">{formatNumber(campaign.total_engagement)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Retailers</span>
                  </div>
                  <span className="font-medium">{campaign.participating_retailers_count}</span>
                </div>

                {campaign.total_emails_sent > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Emails Sent</span>
                    </div>
                    <span className="font-medium">{formatNumber(campaign.total_emails_sent)}</span>
                  </div>
                )}
              </div>

              {/* Trend and Date */}
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2">
                  {getTrendIcon(campaign.trend_direction)}
                  <span className="text-sm text-gray-600">Trending {campaign.trend_direction}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar className="h-3 w-3" />
                  {formatDate(campaign.start_date)}
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
              {filters.search || filters.status !== 'all' || filters.type !== 'all' || filters.performanceTier !== 'all'
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