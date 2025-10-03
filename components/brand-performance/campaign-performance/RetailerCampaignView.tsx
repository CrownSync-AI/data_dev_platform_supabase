'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, TrendingUp, TrendingDown, Minus, Calendar, MoreHorizontal, ArrowLeft } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import PlatformSpecificCharts from './PlatformSpecificCharts'
import AllPlatformsTrendChart from './AllPlatformsTrendChart'
import PlatformComparisonCharts from './PlatformComparisonCharts'
import CampaignFiltersAndViews from './CampaignFiltersAndViews'
import CampaignListView from './CampaignListView'

interface RetailerCampaign {
  campaign_id: string
  campaign_name: string
  campaign_status: 'active' | 'paused' | 'completed' | 'draft'
  campaign_type: 'email' | 'social'
  start_date: string
  end_date?: string
  retailer_id: string
  retailer_name: string
  campaign_image?: string
  platform_performance: {
    facebook?: {
      impressions: number
      reach: number
      engagement: number
      sharesCount: number
      commentsCount: number
      likeCount: number
      reactions: {
        like: number
        love: number
        haha: number
        wow: number
      }
    }
    instagram?: {
      impressions: number
      reach: number
      engagement: number
      likeCount: number
      commentsCount: number
      savedCount: number
      sharesCount: number
    }
    linkedin?: {
      impressions: number
      reach: number
      engagement: number
      likeCount: number
      commentsCount: number
      shareCount: number
      reactions: {
        like: number
        praise: number
        empathy: number
        interest: number
      }
    }
    twitter?: {
      impressions: number
      reach: number
      engagement: number
      likeCount: number
      retweetCount: number
      replyCount: number
      bookmarkCount: number
    }
  }
  performance_tier: 'high' | 'good' | 'standard'
  trend_direction: 'up' | 'down' | 'stable'
  last_updated: string
  email_metrics?: {
    emails_sent: number
    emails_opened: number
    emails_clicked: number
    open_rate: number
    click_rate: number
  }
}

interface Retailer {
  retailer_id: string
  retailer_name: string
  region: string
  campaign_count: number
}

export default function RetailerCampaignView() {
  const [retailers, setRetailers] = useState<Retailer[]>([])
  const [selectedRetailerId, setSelectedRetailerId] = useState<string>('')
  const [campaigns, setCampaigns] = useState<RetailerCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card')
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: { from: undefined, to: undefined },
    search: ''
  })

  useEffect(() => {
    fetchRetailers()
  }, [])

  useEffect(() => {
    if (selectedRetailerId) {
      fetchRetailerCampaigns()
    }
  }, [selectedRetailerId, filters])

  const fetchRetailers = async () => {
    try {
      // Mock retailers data
      const mockRetailers: Retailer[] = [
        { retailer_id: '11111111-1111-1111-1111-111111111111', retailer_name: 'Luxury Boutique NYC', region: 'East Coast', campaign_count: 8 },
        { retailer_id: '22222222-2222-2222-2222-222222222222', retailer_name: 'Elite Fashion LA', region: 'West Coast', campaign_count: 6 },
        { retailer_id: '33333333-3333-3333-3333-333333333333', retailer_name: 'Premium Store Chicago', region: 'Central', campaign_count: 5 },
        { retailer_id: '44444444-4444-4444-4444-444444444444', retailer_name: 'Exclusive Miami', region: 'Southeast', campaign_count: 7 },
        { retailer_id: '55555555-5555-5555-5555-555555555555', retailer_name: 'Designer Seattle', region: 'Northwest', campaign_count: 4 }
      ]
      
      setRetailers(mockRetailers)
      if (mockRetailers.length > 0) {
        setSelectedRetailerId(mockRetailers[0].retailer_id)
      }
    } catch (error) {
      console.error('Error fetching retailers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRetailerCampaigns = async () => {
    try {
      const params = new URLSearchParams({
        retailerId: selectedRetailerId,
        limit: '20',
        offset: '0'
      })
      
      if (filters.search) params.append('search', filters.search)
      if (filters.status !== 'all') params.append('status', filters.status)
      if (filters.type !== 'all') params.append('type', filters.type)
      
      const response = await fetch(`/api/retailer-campaigns?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch retailer campaigns')
      }
      
      const data = await response.json()
      setCampaigns(data.campaigns || [])
      
    } catch (error) {
      console.error('Error fetching retailer campaigns:', error)
      // Keep empty campaigns array on error
      setCampaigns([])
    }
  }

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

  const getPlatformLogo = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
            alt="Facebook"
            className="w-5 h-5 object-contain"
          />
        )
      case 'instagram':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" 
            alt="Instagram"
            className="w-5 h-5 object-contain"
          />
        )
      case 'linkedin':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" 
            alt="LinkedIn"
            className="w-5 h-5 object-contain"
          />
        )
      case 'twitter':
      case 'x':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg" 
            alt="X"
            className="w-5 h-5 object-contain"
          />
        )
      default:
        return (
          <div className="w-5 h-5 rounded bg-gray-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">?</span>
          </div>
        )
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return '#1877F2'
      case 'instagram': return '#E4405F'
      case 'linkedin': return '#0A66C2'
      case 'twitter':
      case 'x': return '#000000'
      default: return '#6B7280'
    }
  }

  const getPlatformName = (platform: string) => {
    return platform.toLowerCase() === 'twitter' ? 'X' : platform.charAt(0).toUpperCase() + platform.slice(1)
  }

  const handleCampaignClick = (campaignId: string) => {
    setSelectedCampaignId(campaignId)
  }

  const handleBackToCampaigns = () => {
    setSelectedCampaignId(null)
  }

  const filteredAndSortedCampaigns = campaigns
    .filter(campaign => {
      const matchesSearch = !filters.search || campaign.campaign_name.toLowerCase().includes(filters.search.toLowerCase())
      const matchesStatus = filters.status === 'all' || campaign.campaign_status === filters.status
      const matchesType = filters.type === 'all' || campaign.campaign_type === filters.type
      
      let matchesDateRange = true
      if (filters.dateRange.from || filters.dateRange.to) {
        const campaignDate = new Date(campaign.start_date)
        console.log('📅 Filtering retailer campaign:', campaign.campaign_name, 'Date:', campaignDate, 'Range:', filters.dateRange)
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

  // Show detailed campaign view
  if (selectedCampaignId) {
    const campaign = campaigns.find(c => c.campaign_id === selectedCampaignId)
    if (!campaign) return null

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBackToCampaigns}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Campaigns
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{campaign.campaign_name}</h2>
              <p className="text-muted-foreground">{campaign.retailer_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(campaign.campaign_status)}>
              {campaign.campaign_status}
            </Badge>
            <Badge variant="outline">{campaign.campaign_type}</Badge>
          </div>
        </div>

        {/* Type-Specific Content */}
        {campaign.campaign_type === 'social' && (
          <div className="space-y-6">
            {/* Platform Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(campaign.platform_performance).map(([platform, data]) => (
                <Card key={platform}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      {getPlatformLogo(platform)}
                      <CardTitle className="text-lg">{getPlatformName(platform)}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Impressions</span>
                        <span className="font-medium">{formatNumber(data.impressions)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Reach</span>
                        <span className="font-medium">{formatNumber(data.reach)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Engagement</span>
                        <span className="font-medium">{formatNumber(data.engagement)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* All Platforms Trend Visualization */}
            <AllPlatformsTrendChart
              platformData={campaign.platform_performance}
              campaignName={campaign.campaign_name}
            />

            {/* Platform Comparison Charts */}
            <PlatformComparisonCharts
              platformData={campaign.platform_performance}
              campaignName={campaign.campaign_name}
            />
          </div>
        )}

        {/* Email Campaign Detail View */}
        {campaign.campaign_type === 'email' && campaign.email_metrics && (
          <div className="space-y-6">
            {/* Email Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Emails Sent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatNumber(campaign.email_metrics.emails_sent)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Total emails delivered</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Emails Opened</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {formatNumber(campaign.email_metrics.emails_opened)}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Recipients who opened</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Open Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {campaign.email_metrics.open_rate.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Percentage opened</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Click Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {campaign.email_metrics.click_rate.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Percentage clicked</p>
                </CardContent>
              </Card>
            </div>

            {/* Email Performance Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Emails Sent</span>
                      </div>
                      <span className="font-medium">{formatNumber(campaign.email_metrics.emails_sent)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Emails Opened</span>
                      </div>
                      <span className="font-medium">{formatNumber(campaign.email_metrics.emails_opened)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm">Emails Clicked</span>
                      </div>
                      <span className="font-medium">{formatNumber(campaign.email_metrics.emails_clicked)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Open Rate</span>
                        <span className="font-medium">{campaign.email_metrics.open_rate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(campaign.email_metrics.open_rate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Click Rate</span>
                        <span className="font-medium">{campaign.email_metrics.click_rate.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(campaign.email_metrics.click_rate * 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Click-to-Open Rate</span>
                        <span className="font-medium">
                          {((campaign.email_metrics.click_rate / campaign.email_metrics.open_rate) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((campaign.email_metrics.click_rate / campaign.email_metrics.open_rate) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Campaign Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <div>
                      <p className="font-medium">Campaign Started</p>
                      <p className="text-sm text-gray-600">{formatDate(campaign.start_date)}</p>
                    </div>
                  </div>
                  {campaign.end_date && (
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">Campaign Completed</p>
                        <p className="text-sm text-gray-600">{formatDate(campaign.end_date)}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <div>
                      <p className="font-medium">Last Updated</p>
                      <p className="text-sm text-gray-600">{formatDate(campaign.last_updated)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Retailer Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Retailer Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedRetailerId} onValueChange={setSelectedRetailerId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose a retailer to view their campaigns" />
            </SelectTrigger>
            <SelectContent>
              {retailers.map((retailer) => (
                <SelectItem key={retailer.retailer_id} value={retailer.retailer_id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{retailer.retailer_name}</span>
                    <div className="flex items-center gap-2 ml-4">
                      <Badge variant="outline">{retailer.region}</Badge>
                      <Badge variant="secondary">{retailer.campaign_count} campaigns</Badge>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedRetailerId && (
        <>
          {/* Enhanced Filters and Views */}
          <CampaignFiltersAndViews
            filters={filters}
            onFiltersChange={setFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalResults={filteredAndSortedCampaigns.length}
          />

          {/* Campaign Display - Card or List View */}
          {viewMode === 'list' ? (
            <CampaignListView 
              campaigns={filteredAndSortedCampaigns}
              onCampaignClick={(campaign) => handleCampaignClick(campaign.campaign_id)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedCampaigns.map((campaign) => (
              <Card 
                key={campaign.campaign_id} 
                className="hover:shadow-lg transition-shadow cursor-pointer overflow-hidden p-0 flex flex-col h-full"
                onClick={() => handleCampaignClick(campaign.campaign_id)}
              >
                {/* Campaign Image */}
                {campaign.campaign_image && (
                  <div className="relative h-56 w-full overflow-hidden rounded-t-lg">
                    <img 
                      src={campaign.campaign_image} 
                      alt={campaign.campaign_name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="bg-white/80 backdrop-blur-sm hover:bg-white/90">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCampaignClick(campaign.campaign_id)}>
                            View Platform Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Export Platform Data</DropdownMenuItem>
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
                      {/* Reserved space for campaign title - ensures consistent height */}
                      <div className="h-14 mb-2">
                        <CardTitle className="text-lg leading-tight">{campaign.campaign_name}</CardTitle>
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
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleCampaignClick(campaign.campaign_id)}>
                            View Platform Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Export Platform Data</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 px-6 pb-6 flex flex-col h-full">
                  {/* Type-Specific Performance Summary */}
                  <div className="space-y-3 flex-grow">
                    {campaign.campaign_type === 'social' && (
                      <>
                        <div className="text-sm font-medium text-gray-700">Platform Performance:</div>
                        {Object.entries(campaign.platform_performance).map(([platform, data]) => (
                          <div key={platform} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                platform === 'facebook' ? 'bg-blue-500' :
                                platform === 'instagram' ? 'bg-pink-500' :
                                platform === 'linkedin' ? 'bg-blue-700' :
                                'bg-sky-500'
                              }`}></div>
                              <span className="text-sm capitalize">{platform}</span>
                            </div>
                            <span className="text-sm font-medium">{formatNumber(data.engagement)} eng.</span>
                          </div>
                        ))}
                      </>
                    )}

                    {campaign.campaign_type === 'email' && campaign.email_metrics && (
                      <>
                        <div className="text-sm font-medium text-gray-700">Email Performance:</div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-sm">Emails Sent</span>
                          </div>
                          <span className="text-sm font-medium">{formatNumber(campaign.email_metrics.emails_sent)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm">Open Rate</span>
                          </div>
                          <span className="text-sm font-medium">{campaign.email_metrics.open_rate.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="text-sm">Click Rate</span>
                          </div>
                          <span className="text-sm font-medium">{campaign.email_metrics.click_rate.toFixed(1)}%</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Performance Tier and Trend - Aligned at bottom */}
                  <div className="mt-auto">
                    <div className="flex items-center justify-between border-t mt-3 pt-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getPerformanceTierColor(campaign.performance_tier)}>
                        {campaign.performance_tier} performer
                      </Badge>
                      {getTrendIcon(campaign.trend_direction)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      {formatDate(campaign.start_date)}
                    </div>
                    </div>
                  </div>
                </CardContent>
                </Card>
              ))}
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
                    : 'This retailer has no campaigns yet'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}