'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, TrendingUp, TrendingDown, Minus, Calendar, Users, Mail, Eye, MousePointer, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

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
}

interface CampaignCardViewProps {
  role: 'brand' | 'retailer'
  retailerId?: string
}

export default function CampaignCardView({ role, retailerId }: CampaignCardViewProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)

  useEffect(() => {
    fetchCampaigns()
  }, [role, retailerId, searchTerm, statusFilter])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams({
        role,
        limit: '20',
        offset: '0'
      })
      
      if (retailerId) params.append('retailerId', retailerId)
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      
      const response = await fetch(`/api/campaign-performance-new/campaigns?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns')
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Transform data to match our interface, removing ROI
        const transformedCampaigns = data.data.map((campaign: any) => ({
          ...campaign,
          // Remove ROI-related fields
          roi_percentage: undefined
        }))
        setCampaigns(transformedCampaigns)
      }
      
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      // Use mock data without ROI
      setCampaigns(getMockCampaigns())
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
      last_updated: '2024-12-19T10:30:00Z'
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
      last_updated: '2024-12-18T15:45:00Z'
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
      last_updated: '2024-12-17T09:20:00Z'
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

  const filteredCampaigns = campaigns
    .filter(campaign => {
      const matchesSearch = campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || campaign.campaign_status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
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

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.campaign_id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{campaign.campaign_name}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getStatusColor(campaign.campaign_status)}>
                      {campaign.campaign_status}
                    </Badge>
                    <Badge variant="outline">{campaign.campaign_type}</Badge>
                  </div>
                </div>
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
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
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
        ))}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
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