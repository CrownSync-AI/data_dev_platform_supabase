'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Mail,
  Users, 
  Eye, 
  MousePointer,
  MapPin,
  Trophy,
  Target,
  Share2
} from 'lucide-react';

type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'email' | 'all';
type CampaignType = 'email' | 'social';

interface RetailerPerformanceTableProps {
  retailers?: any[];
  role: 'brand' | 'retailer';
  selectedPlatforms?: Platform[];
}

export function RetailerPerformanceTable({ 
  retailers = [], 
  role, 
  selectedPlatforms = [] 
}: RetailerPerformanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('engagement');
  const [filterRegion, setFilterRegion] = useState('all');
  const [activeTab, setActiveTab] = useState<CampaignType>('social');

  // Hardcoded retailer performance data separated by campaign type
  const getHardcodedRetailerData = () => {
    const socialRetailers = [
      {
        retailer_id: '1',
        retailer_name: 'Luxury Boutique NYC',
        region: 'East Coast',
        campaign_type: 'social',
        total_reach: 285000,
        total_engagement: 24500,
        avg_engagement_rate: 8.6,
        current_followers: 45000,
        new_followers: 2800,
        posts_count: 24,
        performance_tier: 'high',
        engagement_rank: 1
      },
      {
        retailer_id: '2',
        retailer_name: 'Elite Fashion LA',
        region: 'West Coast',
        campaign_type: 'social',
        total_reach: 312000,
        total_engagement: 28900,
        avg_engagement_rate: 9.3,
        current_followers: 52000,
        new_followers: 3200,
        posts_count: 28,
        performance_tier: 'high',
        engagement_rank: 2
      },
      {
        retailer_id: '3',
        retailer_name: 'Premium Store Chicago',
        region: 'Central',
        campaign_type: 'social',
        total_reach: 198000,
        total_engagement: 18200,
        avg_engagement_rate: 9.2,
        current_followers: 38000,
        new_followers: 2100,
        posts_count: 22,
        performance_tier: 'high',
        engagement_rank: 3
      },
      {
        retailer_id: '4',
        retailer_name: 'Exclusive Miami',
        region: 'Southeast',
        campaign_type: 'social',
        total_reach: 156000,
        total_engagement: 12400,
        avg_engagement_rate: 7.9,
        current_followers: 29000,
        new_followers: 1800,
        posts_count: 18,
        performance_tier: 'high',
        engagement_rank: 4
      },
      {
        retailer_id: '5',
        retailer_name: 'Designer Seattle',
        region: 'Northwest',
        campaign_type: 'social',
        total_reach: 142000,
        total_engagement: 9800,
        avg_engagement_rate: 6.9,
        current_followers: 25000,
        new_followers: 1500,
        posts_count: 16,
        performance_tier: 'good',
        engagement_rank: 5
      },
      {
        retailer_id: '6',
        retailer_name: 'Artisan Boston',
        region: 'East Coast',
        campaign_type: 'social',
        total_reach: 128000,
        total_engagement: 8200,
        avg_engagement_rate: 6.4,
        current_followers: 22000,
        new_followers: 1200,
        posts_count: 14,
        performance_tier: 'good',
        engagement_rank: 6
      },
      {
        retailer_id: '7',
        retailer_name: 'Modern Dallas',
        region: 'Central',
        campaign_type: 'social',
        total_reach: 115000,
        total_engagement: 6900,
        avg_engagement_rate: 6.0,
        current_followers: 19000,
        new_followers: 980,
        posts_count: 12,
        performance_tier: 'good',
        engagement_rank: 7
      },
      {
        retailer_id: '8',
        retailer_name: 'Chic Phoenix',
        region: 'Southwest',
        campaign_type: 'social',
        total_reach: 98000,
        total_engagement: 4900,
        avg_engagement_rate: 5.0,
        current_followers: 16000,
        new_followers: 750,
        posts_count: 10,
        performance_tier: 'good',
        engagement_rank: 8
      },
      {
        retailer_id: '9',
        retailer_name: 'Urban Portland',
        region: 'Northwest',
        campaign_type: 'social',
        total_reach: 85000,
        total_engagement: 3400,
        avg_engagement_rate: 4.0,
        current_followers: 14000,
        new_followers: 620,
        posts_count: 8,
        performance_tier: 'standard',
        engagement_rank: 9
      },
      {
        retailer_id: '10',
        retailer_name: 'Classic Atlanta',
        region: 'Southeast',
        campaign_type: 'social',
        total_reach: 72000,
        total_engagement: 2160,
        avg_engagement_rate: 3.0,
        current_followers: 12000,
        new_followers: 480,
        posts_count: 6,
        performance_tier: 'standard',
        engagement_rank: 10
      }
    ];

    const emailRetailers = [
      {
        retailer_id: '1',
        retailer_name: 'Luxury Boutique NYC',
        region: 'East Coast',
        campaign_type: 'email',
        emails_sent: 2200,
        emails_opened: 660,
        emails_clicked: 88,
        open_rate: 30.0,
        click_rate: 4.0,
        avg_engagement_rate: 4.0,
        performance_tier: 'high',
        engagement_rank: 1
      },
      {
        retailer_id: '2',
        retailer_name: 'Elite Fashion LA',
        region: 'West Coast',
        campaign_type: 'email',
        emails_sent: 1800,
        emails_opened: 612,
        emails_clicked: 72,
        open_rate: 34.0,
        click_rate: 4.0,
        avg_engagement_rate: 4.0,
        performance_tier: 'high',
        engagement_rank: 2
      },
      {
        retailer_id: '3',
        retailer_name: 'Premium Store Chicago',
        region: 'Central',
        campaign_type: 'email',
        emails_sent: 1500,
        emails_opened: 465,
        emails_clicked: 54,
        open_rate: 31.0,
        click_rate: 3.6,
        avg_engagement_rate: 3.6,
        performance_tier: 'high',
        engagement_rank: 3
      },
      {
        retailer_id: '4',
        retailer_name: 'Exclusive Miami',
        region: 'Southeast',
        campaign_type: 'email',
        emails_sent: 1200,
        emails_opened: 348,
        emails_clicked: 42,
        open_rate: 29.0,
        click_rate: 3.5,
        avg_engagement_rate: 3.5,
        performance_tier: 'good',
        engagement_rank: 4
      },
      {
        retailer_id: '5',
        retailer_name: 'Designer Seattle',
        region: 'Northwest',
        campaign_type: 'email',
        emails_sent: 1000,
        emails_opened: 280,
        emails_clicked: 32,
        open_rate: 28.0,
        click_rate: 3.2,
        avg_engagement_rate: 3.2,
        performance_tier: 'good',
        engagement_rank: 5
      },
      {
        retailer_id: '6',
        retailer_name: 'Artisan Boston',
        region: 'East Coast',
        campaign_type: 'email',
        emails_sent: 900,
        emails_opened: 243,
        emails_clicked: 27,
        open_rate: 27.0,
        click_rate: 3.0,
        avg_engagement_rate: 3.0,
        performance_tier: 'good',
        engagement_rank: 6
      },
      {
        retailer_id: '7',
        retailer_name: 'Modern Dallas',
        region: 'Central',
        campaign_type: 'email',
        emails_sent: 800,
        emails_opened: 200,
        emails_clicked: 20,
        open_rate: 25.0,
        click_rate: 2.5,
        avg_engagement_rate: 2.5,
        performance_tier: 'standard',
        engagement_rank: 7
      },
      {
        retailer_id: '8',
        retailer_name: 'Chic Phoenix',
        region: 'Southwest',
        campaign_type: 'email',
        emails_sent: 700,
        emails_opened: 161,
        emails_clicked: 16,
        open_rate: 23.0,
        click_rate: 2.3,
        avg_engagement_rate: 2.3,
        performance_tier: 'standard',
        engagement_rank: 8
      },
      {
        retailer_id: '9',
        retailer_name: 'Urban Portland',
        region: 'Northwest',
        campaign_type: 'email',
        emails_sent: 600,
        emails_opened: 126,
        emails_clicked: 12,
        open_rate: 21.0,
        click_rate: 2.0,
        avg_engagement_rate: 2.0,
        performance_tier: 'standard',
        engagement_rank: 9
      },
      {
        retailer_id: '10',
        retailer_name: 'Classic Atlanta',
        region: 'Southeast',
        campaign_type: 'email',
        emails_sent: 500,
        emails_opened: 95,
        emails_clicked: 8,
        open_rate: 19.0,
        click_rate: 1.6,
        avg_engagement_rate: 1.6,
        performance_tier: 'standard',
        engagement_rank: 10
      }
    ];

    return { socialRetailers, emailRetailers };
  };

  const { socialRetailers, emailRetailers } = getHardcodedRetailerData();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getPerformanceTier = (engagementRate: number, campaignType: CampaignType) => {
    if (campaignType === 'social') {
      if (engagementRate >= 6) return { label: 'High', color: 'bg-green-100 text-green-800', icon: '🔥' };
      if (engagementRate >= 3) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800', icon: '👍' };
      return { label: 'Standard', color: 'bg-gray-100 text-gray-800', icon: '📊' };
    } else {
      // Email campaign thresholds
      if (engagementRate >= 3.5) return { label: 'High', color: 'bg-green-100 text-green-800', icon: '🔥' };
      if (engagementRate >= 2.5) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800', icon: '👍' };
      return { label: 'Standard', color: 'bg-gray-100 text-gray-800', icon: '📊' };
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { color: 'bg-yellow-500 text-white', icon: '🥇' };
    if (rank === 2) return { color: 'bg-gray-400 text-white', icon: '🥈' };
    if (rank === 3) return { color: 'bg-orange-500 text-white', icon: '🥉' };
    return { color: 'bg-gray-300 text-gray-600', icon: rank.toString() };
  };

  // Get current retailer data based on active tab
  const getCurrentRetailers = () => {
    return activeTab === 'social' ? socialRetailers : emailRetailers;
  };

  // Filter and sort retailers
  const filteredRetailers = getCurrentRetailers()
    .filter(retailer => {
      const matchesSearch = retailer.retailer_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = filterRegion === 'all' || retailer.region === filterRegion;
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'engagement':
          return (b.avg_engagement_rate || 0) - (a.avg_engagement_rate || 0);
        case 'reach':
          return (b.total_reach || 0) - (a.total_reach || 0);
        case 'followers':
          return (b.current_followers || 0) - (a.current_followers || 0);
        case 'emails':
          return (b.emails_sent || 0) - (a.emails_sent || 0);
        case 'name':
          return (a.retailer_name || '').localeCompare(b.retailer_name || '');
        default:
          return 0;
      }
    });

  // Get unique regions for filter
  const regions = [...new Set(getCurrentRetailers().map(r => r.region).filter(Boolean))];

  return (
    <div className="space-y-6">
      {/* Campaign Type Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CampaignType)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Social Campaigns
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email Campaigns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="social" className="space-y-6">
          {renderRetailerPerformanceContent('social')}
        </TabsContent>

        <TabsContent value="email" className="space-y-6">
          {renderRetailerPerformanceContent('email')}
        </TabsContent>
      </Tabs>
    </div>
  );

  function renderRetailerPerformanceContent(campaignType: CampaignType) {
    return (
      <>
        {/* Performance Summary for Retailer View */}
        {role === 'retailer' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                My {campaignType === 'social' ? 'Social' : 'Email'} Performance Summary
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Your {campaignType} campaign performance metrics
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {filteredRetailers.slice(0, 1).map((retailer) => {
                  const tier = getPerformanceTier(retailer.avg_engagement_rate || 0, campaignType);
                  return (
                    <div key="my-performance" className="col-span-full">
                      <div className="grid gap-4 md:grid-cols-4">
                        {campaignType === 'social' ? (
                          <>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Eye className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-blue-800">My Reach</span>
                              </div>
                              <p className="text-2xl font-bold text-blue-900">
                                {formatNumber(retailer.total_reach || 0)}
                              </p>
                              <p className="text-sm text-blue-700">Total audience reached</p>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <MousePointer className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-green-800">My Engagement</span>
                              </div>
                              <p className="text-2xl font-bold text-green-900">
                                {(retailer.avg_engagement_rate || 0).toFixed(2)}%
                              </p>
                              <Badge className={tier.color} variant="secondary">
                                {tier.label} Performance
                              </Badge>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-purple-600" />
                                <span className="font-medium text-purple-800">My Followers</span>
                              </div>
                              <p className="text-2xl font-bold text-purple-900">
                                {formatNumber(retailer.current_followers || 0)}
                              </p>
                              <p className="text-sm text-purple-700">
                                +{formatNumber(retailer.new_followers || 0)} new
                              </p>
                            </div>

                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Trophy className="h-4 w-4 text-orange-600" />
                                <span className="font-medium text-orange-800">My Ranking</span>
                              </div>
                              <p className="text-2xl font-bold text-orange-900">
                                #{retailer.engagement_rank || 'N/A'}
                              </p>
                              <p className="text-sm text-orange-700">Social engagement ranking</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Mail className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-blue-800">Emails Sent</span>
                              </div>
                              <p className="text-2xl font-bold text-blue-900">
                                {formatNumber(retailer.emails_sent || 0)}
                              </p>
                              <p className="text-sm text-blue-700">Total emails delivered</p>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Eye className="h-4 w-4 text-green-600" />
                                <span className="font-medium text-green-800">Open Rate</span>
                              </div>
                              <p className="text-2xl font-bold text-green-900">
                                {(retailer.open_rate || 0).toFixed(1)}%
                              </p>
                              <Badge className={tier.color} variant="secondary">
                                {tier.label} Performance
                              </Badge>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                              <div className="flex items-center gap-2 mb-2">
                                <MousePointer className="h-4 w-4 text-purple-600" />
                                <span className="font-medium text-purple-800">Click Rate</span>
                              </div>
                              <p className="text-2xl font-bold text-purple-900">
                                {(retailer.click_rate || 0).toFixed(1)}%
                              </p>
                              <p className="text-sm text-purple-700">
                                {formatNumber(retailer.emails_clicked || 0)} clicks
                              </p>
                            </div>

                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Trophy className="h-4 w-4 text-orange-600" />
                                <span className="font-medium text-orange-800">My Ranking</span>
                              </div>
                              <p className="text-2xl font-bold text-orange-900">
                                #{retailer.engagement_rank || 'N/A'}
                              </p>
                              <p className="text-sm text-orange-700">Email performance ranking</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        {role === 'brand' && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search retailers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engagement">
                      {campaignType === 'social' ? 'Engagement Rate' : 'Click Rate'}
                    </SelectItem>
                    {campaignType === 'social' ? (
                      <>
                        <SelectItem value="reach">Total Reach</SelectItem>
                        <SelectItem value="followers">Followers</SelectItem>
                      </>
                    ) : (
                      <SelectItem value="emails">Emails Sent</SelectItem>
                    )}
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterRegion} onValueChange={setFilterRegion}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Badge variant="outline" className="text-xs">
                  {filteredRetailers.length} retailer{filteredRetailers.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Retailer Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              {role === 'brand' 
                ? `${campaignType === 'social' ? 'Social' : 'Email'} Campaign Performance Rankings` 
                : `${campaignType === 'social' ? 'Social' : 'Email'} Performance Breakdown`
              }
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {role === 'brand' 
                ? `${campaignType === 'social' ? 'Social media' : 'Email marketing'} performance metrics across all retailers`
                : `Your ${campaignType} campaign performance breakdown`
              }
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {role === 'brand' && (
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Rank</th>
                    )}
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      {role === 'brand' ? 'Retailer' : 'Platform'}
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Region</th>
                    {campaignType === 'social' ? (
                      <>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Reach</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Engagement</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Rate</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Followers</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Posts</th>
                      </>
                    ) : (
                      <>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Emails Sent</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Opens</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Open Rate</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Clicks</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-600">Click Rate</th>
                      </>
                    )}
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRetailers.map((retailer, index) => {
                    const tier = getPerformanceTier(retailer.avg_engagement_rate || 0, campaignType);
                    const rank = getRankBadge(index + 1);
                    
                    return (
                      <tr key={retailer.retailer_id} className="border-b hover:bg-gray-50">
                        {role === 'brand' && (
                          <td className="py-4 px-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${rank.color}`}>
                              {index < 3 ? rank.icon : index + 1}
                            </div>
                          </td>
                        )}
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium">{retailer.retailer_name}</div>
                            <div className="text-xs text-gray-400 capitalize">
                              {campaignType} campaign
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{retailer.region}</span>
                          </div>
                        </td>
                        {campaignType === 'social' ? (
                          <>
                            <td className="py-4 px-4 text-right font-medium">
                              {formatNumber(retailer.total_reach || 0)}
                            </td>
                            <td className="py-4 px-4 text-right font-medium">
                              {formatNumber(retailer.total_engagement || 0)}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className={`font-medium ${
                                  (retailer.avg_engagement_rate || 0) >= 6 ? 'text-green-600' : 
                                  (retailer.avg_engagement_rate || 0) >= 3 ? 'text-yellow-600' : 'text-gray-600'
                                }`}>
                                  {(retailer.avg_engagement_rate || 0).toFixed(2)}%
                                </span>
                                {(retailer.avg_engagement_rate || 0) >= 6 ? (
                                  <TrendingUp className="h-3 w-3 text-green-500" />
                                ) : (retailer.avg_engagement_rate || 0) < 3 ? (
                                  <TrendingDown className="h-3 w-3 text-red-500" />
                                ) : null}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div>
                                <div className="font-medium">
                                  {formatNumber(retailer.current_followers || 0)}
                                </div>
                                {retailer.new_followers > 0 && (
                                  <div className="text-xs text-green-600">
                                    +{formatNumber(retailer.new_followers)}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right font-medium">
                              {retailer.posts_count || 0}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-4 px-4 text-right font-medium">
                              {formatNumber(retailer.emails_sent || 0)}
                            </td>
                            <td className="py-4 px-4 text-right font-medium">
                              {formatNumber(retailer.emails_opened || 0)}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className={`font-medium ${
                                  (retailer.open_rate || 0) >= 30 ? 'text-green-600' : 
                                  (retailer.open_rate || 0) >= 25 ? 'text-yellow-600' : 'text-gray-600'
                                }`}>
                                  {(retailer.open_rate || 0).toFixed(1)}%
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-right font-medium">
                              {formatNumber(retailer.emails_clicked || 0)}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className={`font-medium ${
                                  (retailer.click_rate || 0) >= 3.5 ? 'text-green-600' : 
                                  (retailer.click_rate || 0) >= 2.5 ? 'text-yellow-600' : 'text-gray-600'
                                }`}>
                                  {(retailer.click_rate || 0).toFixed(1)}%
                                </span>
                                {(retailer.click_rate || 0) >= 3.5 ? (
                                  <TrendingUp className="h-3 w-3 text-green-500" />
                                ) : (retailer.click_rate || 0) < 2.5 ? (
                                  <TrendingDown className="h-3 w-3 text-red-500" />
                                ) : null}
                              </div>
                            </td>
                          </>
                        )}
                        <td className="py-4 px-4 text-right">
                          <Badge className={tier.color} variant="secondary">
                            {tier.icon} {tier.label}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredRetailers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No retailers match your current filters</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterRegion('all');
                  }}
                  className="mt-2"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Insights */}
        {role === 'brand' && filteredRetailers.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {campaignType === 'social' ? 'Social engagement' : 'Email performance'} by region
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {regions.map(region => {
                    const regionRetailers = filteredRetailers.filter(r => r.region === region);
                    const avgEngagement = regionRetailers.length > 0 
                      ? regionRetailers.reduce((sum, r) => sum + (r.avg_engagement_rate || 0), 0) / regionRetailers.length
                      : 0;
                    
                    return (
                      <div key={region} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{region}</span>
                          <Badge variant="outline" className="text-xs">
                            {regionRetailers.length} retailers
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{avgEngagement.toFixed(2)}%</div>
                          <div className="text-xs text-gray-500">
                            avg {campaignType === 'social' ? 'engagement' : 'click rate'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {campaignType === 'social' ? 'Social' : 'Email'} performance tiers
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(campaignType === 'social' ? [
                    { label: 'High Performers', min: 6, color: 'bg-green-100 text-green-800', icon: '🔥' },
                    { label: 'Good Performers', min: 3, max: 6, color: 'bg-yellow-100 text-yellow-800', icon: '👍' },
                    { label: 'Standard Performers', max: 3, color: 'bg-gray-100 text-gray-800', icon: '📊' }
                  ] : [
                    { label: 'High Performers', min: 3.5, color: 'bg-green-100 text-green-800', icon: '🔥' },
                    { label: 'Good Performers', min: 2.5, max: 3.5, color: 'bg-yellow-100 text-yellow-800', icon: '👍' },
                    { label: 'Standard Performers', max: 2.5, color: 'bg-gray-100 text-gray-800', icon: '📊' }
                  ]).map(tier => {
                    const count = filteredRetailers.filter(r => {
                      const rate = r.avg_engagement_rate || 0;
                      if (tier.min && tier.max) return rate >= tier.min && rate < tier.max;
                      if (tier.min) return rate >= tier.min;
                      if (tier.max) return rate < tier.max;
                      return false;
                    }).length;
                    
                    const percentage = filteredRetailers.length > 0 
                      ? (count / filteredRetailers.length) * 100 
                      : 0;
                    
                    return (
                      <div key={tier.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{tier.icon}</span>
                          <span className="font-medium">{tier.label}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{count} retailers</div>
                          <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </>
    );
  }
}