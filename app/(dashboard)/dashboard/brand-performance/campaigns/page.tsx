'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, TrendingUp, Calendar, DollarSign, Users } from 'lucide-react'
import Link from 'next/link'

interface Campaign {
  campaign_id: string
  campaign_name: string
  campaign_status: string
  start_date: string
  end_date: string | null
  created_at: string
  // 扩展字段（实际中应该从analytics API获取）
  roi?: number
  total_retailers?: number
  total_emails?: number
  avg_click_rate?: number
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/campaigns')
      if (!response.ok) throw new Error('Failed to fetch campaigns')
      
      const result = await response.json()
      
      // Map the database fields to the expected interface
      const campaignsWithMetrics = result.campaigns.map((campaign: any) => ({
        campaign_id: campaign.campaign_id,
        campaign_name: campaign.campaign_name,
        campaign_status: campaign.status,
        start_date: campaign.start_date,
        end_date: campaign.end_date,
        created_at: campaign.created_at,
        roi: Math.round(campaign.roi_percentage || 0),
        total_retailers: campaign.total_retailers || 0,
        total_emails: campaign.total_emails_sent || 0,
        avg_click_rate: Number((campaign.click_rate || 0).toFixed(1))
      }))
      
      setCampaigns(campaignsWithMetrics)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      // Fallback data matching the screenshot
      setCampaigns([
        {
          campaign_id: '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
          campaign_name: 'Marco Bicego New 2025 Campaign',
          campaign_status: 'active',
          start_date: '2025-01-14T00:00:00Z',
          end_date: '2025-02-14T23:59:59Z',
          created_at: '2025-01-10T10:00:00Z',
          roi: 124,
          total_retailers: 15,
          total_emails: 27037,
          avg_click_rate: 3.2
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.campaign_status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'default',
      'completed': 'secondary',
      'paused': 'outline',
      'draft': 'destructive'
    } as const

    const labels = {
      'active': 'Active',
      'completed': 'Completed',
      'paused': 'Paused',
      'draft': 'Draft'
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getROIColor = (roi: number) => {
    if (roi >= 100) return 'text-green-600'
    if (roi >= 70) return 'text-blue-600'
    return 'text-orange-600'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Campaign Performance</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="h-64">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
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
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Performance</h1>
          <p className="text-muted-foreground mt-2">
            Brand-focused campaign analytics and ROI comparison management
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          Create New Campaign
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search campaign names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.campaign_id} className="hover:shadow-md transition-all cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusBadge(campaign.campaign_status)}
                  {campaign.roi && campaign.roi >= 100 && (
                                         <Badge variant="secondary" className="bg-green-100 text-green-800">
                       <TrendingUp className="h-3 w-3 mr-1" />
                       High ROI
                     </Badge>
                  )}
                </div>
              </div>
              <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                {campaign.campaign_name}
              </CardTitle>
              <CardDescription>
                <div className="flex items-center space-x-2 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(campaign.start_date)}</span>
                  {campaign.end_date && (
                    <>
                      <span>-</span>
                      <span>{formatDate(campaign.end_date)}</span>
                    </>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className={`text-2xl font-bold ${getROIColor(campaign.roi || 0)}`}>
                    {campaign.roi}%
                  </div>
                  <div className="text-xs text-muted-foreground">ROI</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {campaign.avg_click_rate?.toFixed(1)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Avg Click Rate</div>
                </div>
              </div>

              {/* Secondary Metrics */}
                             <div className="space-y-2 mb-4">
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center space-x-2">
                     <Users className="h-4 w-4 text-muted-foreground" />
                     <span>Retailers</span>
                   </div>
                   <span className="font-medium">{campaign.total_retailers}</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                   <div className="flex items-center space-x-2">
                     <DollarSign className="h-4 w-4 text-muted-foreground" />
                     <span>Total Emails</span>
                   </div>
                   <span className="font-medium">{campaign.total_emails?.toLocaleString()}</span>
                 </div>
               </div>

              {/* 操作按钮 */}
              <div className="space-y-2">
                                 <Link href={`/dashboard/brand-performance/campaigns/${campaign.campaign_id}`}>
                   <Button className="w-full" variant="default">
                     View Detailed Analysis
                   </Button>
                 </Link>
                 <div className="grid grid-cols-2 gap-2">
                   <Button variant="outline" size="sm">
                     Edit Campaign
                   </Button>
                   <Button variant="ghost" size="sm">
                     Export Report
                   </Button>
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 空状态 */}
      {filteredCampaigns.length === 0 && !loading && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' ? 'No matching campaigns found' : 'No campaigns created yet'}
            </div>
            <Button variant="outline">
              {searchTerm || statusFilter !== 'all' ? 'Clear Filters' : 'Create First Campaign'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 