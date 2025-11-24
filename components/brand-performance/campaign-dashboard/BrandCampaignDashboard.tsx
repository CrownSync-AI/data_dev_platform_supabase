'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  Eye,
  Target,
  Calendar,
  MoreVertical,
  ArrowRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import CampaignDetailView from './CampaignDetailView';
import RedesignedCampaignIntelligence from '@/components/campaign-performance-new/RedesignedCampaignIntelligence';

interface CampaignCard {
  campaign_id: string;
  campaign_name: string;
  campaign_status: 'active' | 'paused' | 'completed' | 'draft';
  campaign_type: 'email' | 'social' | 'mixed';
  start_date: string;
  end_date?: string;
  duration_days: number;
  roi_percentage: number;
  avg_click_rate: number;
  total_reach: number;
  total_engagement: number;
  participating_retailers_count: number;
  total_emails_sent: number;
  performance_tier: 'high' | 'good' | 'standard';
  trend_direction: 'up' | 'down' | 'stable';
  can_edit: boolean;
  can_export: boolean;
  last_updated: string;
}

interface BrandCampaignDashboardProps {
  brandId?: string;
}

export default function BrandCampaignDashboard({ brandId }: BrandCampaignDashboardProps) {
  const [campaigns, setCampaigns] = useState<CampaignCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, [brandId, searchTerm, statusFilter]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (brandId) params.append('brandId', brandId);
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/brand-campaigns?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.campaigns) {
        setCampaigns(result.campaigns);
      } else {
        throw new Error(result.error || 'Failed to fetch campaigns');
      }
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Use mock data as fallback
      setCampaigns(getMockCampaigns());
    } finally {
      setLoading(false);
    }
  };

  const getMockCampaigns = (): CampaignCard[] => [
    {
      campaign_id: '1',
      campaign_name: 'Spring Collection Preview',
      campaign_status: 'completed',
      campaign_type: 'mixed',
      start_date: '2024-12-01',
      end_date: '2025-01-01',
      duration_days: 31,
      roi_percentage: 107.0,
      avg_click_rate: 2.9,
      total_reach: 285000,
      total_engagement: 24500,
      participating_retailers_count: 5,
      total_emails_sent: 1500,
      performance_tier: 'high',
      trend_direction: 'up',
      can_edit: true,
      can_export: true,
      last_updated: '2025-01-17T10:30:00Z'
    },
    {
      campaign_id: '2',
      campaign_name: 'Holiday Luxury Campaign',
      campaign_status: 'paused',
      campaign_type: 'email',
      start_date: '2024-11-15',
      end_date: '2025-01-16',
      duration_days: 62,
      roi_percentage: 90.0,
      avg_click_rate: 2.9,
      total_reach: 198000,
      total_engagement: 18200,
      participating_retailers_count: 5,
      total_emails_sent: 1500,
      performance_tier: 'good',
      trend_direction: 'stable',
      can_edit: true,
      can_export: true,
      last_updated: '2025-01-16T14:20:00Z'
    },
    {
      campaign_id: '3',
      campaign_name: 'Summer Elegance 2025',
      campaign_status: 'draft',
      campaign_type: 'social',
      start_date: '2025-03-01',
      end_date: '2025-05-01',
      duration_days: 61,
      roi_percentage: 0.0,
      avg_click_rate: 2.9,
      total_reach: 0,
      total_engagement: 0,
      participating_retailers_count: 5,
      total_emails_sent: 1500,
      performance_tier: 'standard',
      trend_direction: 'stable',
      can_edit: true,
      can_export: false,
      last_updated: '2025-01-15T09:15:00Z'
    },
    {
      campaign_id: '4',
      campaign_name: 'Winter Wonderland Exclusive',
      campaign_status: 'active',
      campaign_type: 'social',
      start_date: '2024-12-15',
      end_date: '2025-02-15',
      duration_days: 62,
      roi_percentage: 125.5,
      avg_click_rate: 3.8,
      total_reach: 312000,
      total_engagement: 28900,
      participating_retailers_count: 8,
      total_emails_sent: 2200,
      performance_tier: 'high',
      trend_direction: 'up',
      can_edit: true,
      can_export: true,
      last_updated: '2025-01-17T11:45:00Z'
    },
    {
      campaign_id: '5',
      campaign_name: 'Artisan Heritage Collection',
      campaign_status: 'completed',
      campaign_type: 'social',
      start_date: '2024-10-01',
      end_date: '2024-12-01',
      duration_days: 61,
      roi_percentage: 78.2,
      avg_click_rate: 2.1,
      total_reach: 156000,
      total_engagement: 12400,
      participating_retailers_count: 4,
      total_emails_sent: 0,
      performance_tier: 'good',
      trend_direction: 'down',
      can_edit: false,
      can_export: true,
      last_updated: '2024-12-01T16:30:00Z'
    }
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Active', className: 'bg-green-100 text-green-800' },
      paused: { label: 'Paused', className: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Completed', className: 'bg-blue-100 text-blue-800' },
      draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getPerformanceBadge = (tier: string) => {
    const tierConfig = {
      high: { label: 'High ROI', className: 'bg-green-100 text-green-800' },
      good: { label: 'Good ROI', className: 'bg-blue-100 text-blue-800' },
      standard: { label: 'Standard', className: 'bg-gray-100 text-gray-800' }
    };
    const config = tierConfig[tier as keyof typeof tierConfig] || tierConfig.standard;
    return <Badge className={config.className} variant="secondary">{config.label}</Badge>;
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.campaign_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCampaignClick = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
  };

  const handleBackToDashboard = () => {
    setSelectedCampaignId(null);
  };

  // Show detailed view if campaign is selected
  if (selectedCampaignId) {
    const selectedCampaign = campaigns.find(c => c.campaign_id === selectedCampaignId);

    // DEBUG OVERLAY
    if (selectedCampaign) {
      return (
        <>
          <div className="fixed top-0 left-0 bg-yellow-100 p-2 z-50 text-xs border-b border-yellow-300 w-full text-black">
            DEBUG: ID={selectedCampaignId}, Type={selectedCampaign.campaign_type}, Name={selectedCampaign.campaign_name}
          </div>
          {selectedCampaign.campaign_type === 'social' ? (
            <RedesignedCampaignIntelligence
              campaignId={selectedCampaignId}
              onBack={handleBackToDashboard}
            />
          ) : (
            <CampaignDetailView
              campaignId={selectedCampaignId}
              onBack={handleBackToDashboard}
            />
          )}
        </>
      );
    }

    return (
      <CampaignDetailView
        campaignId={selectedCampaignId}
        onBack={handleBackToDashboard}
      />
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaign Performance</h1>
            <p className="text-muted-foreground">Brand-focused campaign analytics and ROI comparison management</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Performance</h1>
          <p className="text-muted-foreground">Brand-focused campaign analytics and ROI comparison management</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Campaign
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaign names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
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
        </CardContent>
      </Card>

      {/* Campaign Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.campaign_id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                {getStatusBadge(campaign.campaign_status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCampaignClick(campaign.campaign_id)}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                    <DropdownMenuItem>Export Report</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <CardTitle className="text-lg">{campaign.campaign_name}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(campaign.start_date).toLocaleDateString()} - {
                    campaign.end_date
                      ? new Date(campaign.end_date).toLocaleDateString()
                      : 'Ongoing'
                  }
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Metrics - Hide for social campaigns */}
              {campaign.campaign_type !== 'social' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-2xl font-bold text-green-600">
                        {campaign.roi_percentage.toFixed(0)}%
                      </span>
                      {getTrendIcon(campaign.trend_direction)}
                    </div>
                    <div className="text-sm text-green-700">ROI</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {campaign.avg_click_rate.toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-700">Avg Click Rate</div>
                  </div>
                </div>
              )}

              {/* Campaign Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Retailers</span>
                  </div>
                  <span className="font-medium">{campaign.participating_retailers_count}</span>
                </div>
                {campaign.total_emails_sent > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Total Emails</span>
                    </div>
                    <span className="font-medium">{formatNumber(campaign.total_emails_sent)}</span>
                  </div>
                )}
                {campaign.total_reach > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Total Reach</span>
                    </div>
                    <span className="font-medium">{formatNumber(campaign.total_reach)}</span>
                  </div>
                )}
              </div>

              {/* Performance Badge */}
              <div className="flex justify-center">
                {getPerformanceBadge(campaign.performance_tier)}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  className="w-full"
                  onClick={() => handleCampaignClick(campaign.campaign_id)}
                >
                  View Detailed Analysis
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" disabled={!campaign.can_edit}>
                    Edit Campaign
                  </Button>
                  <Button variant="outline" size="sm" disabled={!campaign.can_export}>
                    Export Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCampaigns.length === 0 && !loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Create your first campaign to start tracking performance'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Campaign
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center py-4">
              <p className="text-red-600 mb-4">Error loading campaigns: {error}</p>
              <Button onClick={fetchCampaigns} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}