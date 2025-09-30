'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Search, Plus, TrendingUp, TrendingDown, Minus, Calendar, Users, Mail, Eye, MousePointer, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CampaignDetailView from '@/components/brand-performance/campaign-dashboard/CampaignDetailView';
import RetailerCampaignView from '@/components/brand-performance/campaign-performance-new/RetailerCampaignView';

interface Campaign {
  campaign_id: string
  campaign_name: string
  campaign_status: 'active' | 'paused' | 'completed' | 'draft'
  campaign_type: 'email' | 'social'
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

export default function CampaignPerformancePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [activeTab, setActiveTab] = useState('brand')

  useEffect(() => {
    fetchCampaigns()
  }, [searchTerm, statusFilter])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        role: 'brand', // Fixed to brand role only
        limit: '20',
        offset: '0'
      })
      
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      
      const response = await fetch(`/api/brand-campaigns?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns')
      }
      
      const data = await response.json()
      
      if (data.campaigns) {
        setCampaigns(data.campaigns)
        setLastUpdated(new Date())
      } else {
        throw new Error(data.error || 'Failed to fetch campaigns')
      }
      
    } catch (err) {
      console.error('Error fetching campaigns:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
      // Use mock data as fallback
      setCampaigns(getMockCampaigns())
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  const getBaseCampaigns = () => [
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
      total_emails_sent: 0,
      performance_tier: 'standard',
      trend_direction: 'stable',
      last_updated: '2024-12-17T09:20:00Z'
    },
    {
      campaign_id: '4',
      campaign_name: 'Winter Wonderland Exclusive',
      campaign_status: 'active',
      campaign_type: 'mixed',
      start_date: '2024-12-15',
      end_date: '2025-02-15',
      duration_days: 5,
      avg_click_rate: 3.8,
      total_reach: 312000,
      total_engagement: 28900,
      participating_retailers_count: 8,
      total_emails_sent: 2200,
      performance_tier: 'high',
      trend_direction: 'up',
      last_updated: '2024-12-19T14:15:00Z'
    },
    {
      campaign_id: '5',
      campaign_name: 'Artisan Heritage Collection',
      campaign_status: 'completed',
      campaign_type: 'social',
      start_date: '2024-10-01',
      end_date: '2024-12-01',
      duration_days: 61,
      avg_click_rate: 2.1,
      total_reach: 156000,
      total_engagement: 12400,
      participating_retailers_count: 4,
      total_emails_sent: 0,
      performance_tier: 'good',
      trend_direction: 'down',
      last_updated: '2024-12-01T18:30:00Z'
    }
  ]

  const getMockCampaigns = (): Campaign[] => {
    const baseCampaigns = getBaseCampaigns()
    const processedCampaigns: Campaign[] = []

    baseCampaigns.forEach(campaign => {
      if (campaign.campaign_type === 'mixed') {
        // Split mixed campaigns into separate social and email campaigns
        
        // Social campaign card
        const socialCampaign: Campaign = {
          ...campaign,
          campaign_id: `${campaign.campaign_id}-social`,
          campaign_name: `${campaign.campaign_name} (Social)`,
          campaign_type: 'social',
          // Social-focused metrics (70% of total reach/engagement)
          total_reach: Math.round(campaign.total_reach * 0.7),
          total_engagement: Math.round(campaign.total_engagement * 0.7),
          avg_click_rate: campaign.avg_click_rate * 1.2, // Social typically has higher engagement
          total_emails_sent: 0 // No emails for social campaign
        }

        // Email campaign card
        const emailCampaign: Campaign = {
          ...campaign,
          campaign_id: `${campaign.campaign_id}-email`,
          campaign_name: `${campaign.campaign_name} (Email)`,
          campaign_type: 'email',
          // Email-focused metrics (30% of total reach/engagement)
          total_reach: Math.round(campaign.total_reach * 0.3),
          total_engagement: Math.round(campaign.total_engagement * 0.3),
          avg_click_rate: campaign.avg_click_rate * 0.8, // Email typically has lower engagement rate
          total_emails_sent: campaign.total_emails_sent // Keep email count
        }

        processedCampaigns.push(socialCampaign, emailCampaign)
      } else {
        // Keep single-type campaigns as they are
        processedCampaigns.push(campaign)
      }
    })

    return processedCampaigns
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

  const handleBackToDashboard = () => {
    setSelectedCampaignId(null)
  }

  const handleRefresh = () => {
    fetchCampaigns()
  }

  // Show detailed view if campaign is selected
  if (selectedCampaignId) {
    return (
      <CampaignDetailView 
        campaignId={selectedCampaignId} 
        onBack={handleBackToDashboard}
      />
    )
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

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaign Performance</h1>
            <p className="text-muted-foreground">Brand-focused campaign analytics dashboard</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading campaign performance data</p>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaign Performance</h1>
            <p className="text-muted-foreground">Brand-focused campaign analytics dashboard</p>
          </div>
        </div>
        
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Performance</h1>
          <p className="text-muted-foreground">Brand and retailer campaign analytics dashboard</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary">{activeTab === 'brand' ? 'Brand View' : 'Retailer View'}</Badge>
            <Badge variant="outline">Comprehensive Analytics</Badge>
            {lastUpdated && (
              <Badge variant="outline">
                Updated: {lastUpdated.toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Campaign
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="brand">Brand View</TabsTrigger>
          <TabsTrigger value="retailer">Retailer View</TabsTrigger>
        </TabsList>

        {/* Brand Tab Content */}
        <TabsContent value="brand" className="space-y-6">
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
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                        <DropdownMenuItem>Export Data</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Key Metrics - Campaign Type Specific */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        {campaign.campaign_type === 'email' ? 'Click Rate' : 'Engagement Rate'}
                      </p>
                      <p className="text-xl font-bold">{campaign.avg_click_rate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Performance</p>
                      <Badge className={getPerformanceTierColor(campaign.performance_tier)}>
                        {campaign.performance_tier}
                      </Badge>
                    </div>
                  </div>

                  {/* Performance Metrics - Campaign Type Specific */}
                  <div className="space-y-3 mb-4">
                    {campaign.campaign_type === 'social' && (
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
                            <Users className="h-4 w-4 text-orange-600" />
                            <span className="text-sm">Platforms</span>
                          </div>
                          <span className="font-medium">4 platforms</span>
                        </div>
                      </>
                    )}

                    {campaign.campaign_type === 'email' && (
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
                          <span className="font-medium">{formatNumber(Math.round(campaign.total_emails_sent * 0.03))}</span>
                        </div>
                      </>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-orange-600" />
                        <span className="text-sm">Retailers</span>
                      </div>
                      <span className="font-medium">{campaign.participating_retailers_count}</span>
                    </div>
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
                    : 'Create your first campaign to get started'
                  }
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Campaign
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Retailer Tab Content */}
        <TabsContent value="retailer" className="space-y-6">
          <RetailerCampaignView />
        </TabsContent>
      </Tabs>
    </div>
  )
}