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

interface RetailerCampaign {
  campaign_id: string
  campaign_name: string
  campaign_status: 'active' | 'paused' | 'completed' | 'draft'
  campaign_type: 'email' | 'social' | 'mixed'
  start_date: string
  end_date?: string
  retailer_id: string
  retailer_name: string
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
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')

  useEffect(() => {
    fetchRetailers()
  }, [])

  useEffect(() => {
    if (selectedRetailerId) {
      fetchRetailerCampaigns()
    }
  }, [selectedRetailerId, searchTerm, statusFilter])

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
      
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      
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

  const handleCampaignClick = (campaignId: string) => {
    setSelectedCampaignId(campaignId)
  }

  const handleBackToCampaigns = () => {
    setSelectedCampaignId(null)
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

        {/* Platform Tabs */}
        <Tabs value={selectedPlatform} onValueChange={setSelectedPlatform} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Platforms</TabsTrigger>
            {Object.keys(campaign.platform_performance).map(platform => (
              <TabsTrigger key={platform} value={platform} className="capitalize">
                {platform}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All Platforms Overview */}
          <TabsContent value="all" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(campaign.platform_performance).map(([platform, data]) => (
                <Card key={platform}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg capitalize">{platform}</CardTitle>
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
          </TabsContent>

          {/* Platform-Specific Views */}
          {Object.entries(campaign.platform_performance).map(([platform, data]) => (
            <TabsContent key={platform} value={platform} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Core Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Core Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
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
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Engagement Rate</span>
                        <span className="font-medium">{((data.engagement / data.reach) * 100).toFixed(2)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Platform-Specific Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="capitalize">{platform} Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {platform === 'facebook' && 'sharesCount' in data && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Shares</span>
                            <span className="font-medium">{data.sharesCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Comments</span>
                            <span className="font-medium">{data.commentsCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Likes</span>
                            <span className="font-medium">{data.likeCount}</span>
                          </div>
                        </>
                      )}
                      {platform === 'instagram' && 'savedCount' in data && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Likes</span>
                            <span className="font-medium">{data.likeCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Comments</span>
                            <span className="font-medium">{data.commentsCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Saves</span>
                            <span className="font-medium">{data.savedCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Shares</span>
                            <span className="font-medium">{data.sharesCount}</span>
                          </div>
                        </>
                      )}
                      {platform === 'linkedin' && 'shareCount' in data && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Likes</span>
                            <span className="font-medium">{data.likeCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Comments</span>
                            <span className="font-medium">{data.commentsCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Shares</span>
                            <span className="font-medium">{data.shareCount}</span>
                          </div>
                        </>
                      )}
                      {platform === 'twitter' && 'retweetCount' in data && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Likes</span>
                            <span className="font-medium">{data.likeCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Retweets</span>
                            <span className="font-medium">{data.retweetCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Replies</span>
                            <span className="font-medium">{data.replyCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Bookmarks</span>
                            <span className="font-medium">{data.bookmarkCount}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Reactions/Interactions */}
                {((platform === 'facebook' && 'reactions' in data) || 
                  (platform === 'linkedin' && 'reactions' in data)) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Reactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {Object.entries(data.reactions).map(([reaction, count]) => (
                          <div key={reaction} className="flex justify-between">
                            <span className="text-sm text-gray-600 capitalize">{reaction}</span>
                            <span className="font-medium">{count}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Platform-Specific Charts */}
              <PlatformSpecificCharts
                platform={platform}
                data={data}
                campaignName={campaign.campaign_name}
              />
            </TabsContent>
          ))}
        </Tabs>
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
              <Card 
                key={campaign.campaign_id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCampaignClick(campaign.campaign_id)}
              >
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
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Platform Performance Summary */}
                  <div className="space-y-3 mb-4">
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
                  </div>

                  {/* Performance Tier and Trend */}
                  <div className="flex items-center justify-between pt-3 border-t">
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