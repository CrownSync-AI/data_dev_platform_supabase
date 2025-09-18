'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, Users, Eye, MousePointer } from 'lucide-react';

type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'email' | 'all';

interface CampaignPerformanceChartsProps {
  campaigns: any[];
  role: 'brand' | 'retailer';
  selectedPlatforms: Platform[];
}

export function CampaignPerformanceCharts({ 
  campaigns, 
  role, 
  selectedPlatforms 
}: CampaignPerformanceChartsProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getPerformanceTier = (engagementRate: number) => {
    if (engagementRate >= 6) return { label: 'High Performance', color: 'bg-green-100 text-green-800', variant: 'default' as const };
    if (engagementRate >= 3) return { label: 'Good Performance', color: 'bg-yellow-100 text-yellow-800', variant: 'secondary' as const };
    return { label: 'Standard Performance', color: 'bg-gray-100 text-gray-800', variant: 'outline' as const };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!campaigns || campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No campaign data available</p>
            <p className="text-sm text-muted-foreground mt-2">
              {role === 'retailer' 
                ? 'You are not participating in any campaigns yet'
                : 'No campaigns have been created yet'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Campaign Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Summary</CardTitle>
          <p className="text-sm text-muted-foreground">
            {role === 'brand' 
              ? `Overview of all campaigns across ${selectedPlatforms.includes('all') ? 'all platforms' : selectedPlatforms.join(', ')}`
              : 'Your participation in active campaigns'
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Total Campaigns</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{campaigns.length}</p>
              <p className="text-sm text-blue-700">
                {role === 'brand' ? 'Active campaigns' : 'My campaigns'}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Total Reach</span>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {formatNumber(campaigns.reduce((sum, c) => sum + (c.total_reach || 0), 0))}
              </p>
              <p className="text-sm text-green-700">Combined reach</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <MousePointer className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">Avg Engagement</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {campaigns.length > 0 
                  ? (campaigns.reduce((sum, c) => sum + (c.avg_engagement_rate || 0), 0) / campaigns.length).toFixed(2)
                  : '0'
                }%
              </p>
              <p className="text-sm text-purple-700">Average rate</p>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Total Posts</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">
                {campaigns.reduce((sum, c) => sum + (c.total_posts || 0), 0)}
              </p>
              <p className="text-sm text-orange-700">Content pieces</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
          <p className="text-sm text-muted-foreground">
            Detailed performance metrics for each campaign
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Reach</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Engagement</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Rate</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Posts</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Performance</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => {
                  const tier = getPerformanceTier(campaign.avg_engagement_rate || 0);
                  const statusColor = getStatusColor(campaign.status);
                  
                  return (
                    <tr key={campaign.campaign_id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium">{campaign.campaign_name}</div>
                          <div className="text-sm text-gray-500">
                            {campaign.start_date} - {campaign.end_date || 'Ongoing'}
                          </div>
                          <div className="text-xs text-gray-400 capitalize">
                            {campaign.campaign_type}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={statusColor} variant="secondary">
                          {campaign.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {formatNumber(campaign.total_reach || 0)}
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {formatNumber(campaign.total_engagement || 0)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`font-medium ${
                            (campaign.avg_engagement_rate || 0) >= 6 ? 'text-green-600' : 
                            (campaign.avg_engagement_rate || 0) >= 3 ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
                            {(campaign.avg_engagement_rate || 0).toFixed(2)}%
                          </span>
                          {(campaign.avg_engagement_rate || 0) >= 6 && (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {campaign.total_posts || 0}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Badge variant={tier.variant}>
                          {tier.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
            <p className="text-sm text-muted-foreground">Ranked by engagement rate</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns
                .sort((a, b) => (b.avg_engagement_rate || 0) - (a.avg_engagement_rate || 0))
                .slice(0, 5)
                .map((campaign, index) => {
                  const tier = getPerformanceTier(campaign.avg_engagement_rate || 0);
                  
                  return (
                    <div key={campaign.campaign_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <span className="font-medium">{campaign.campaign_name}</span>
                          <div className="text-xs text-gray-500 capitalize">
                            {campaign.campaign_type} • {campaign.status}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{(campaign.avg_engagement_rate || 0).toFixed(2)}%</div>
                        <div className="text-xs text-gray-500">
                          {formatNumber(campaign.total_reach || 0)} reach
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
            <CardTitle>Campaign Insights</CardTitle>
            <p className="text-sm text-muted-foreground">Performance analysis</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                const highPerformers = campaigns.filter(c => (c.avg_engagement_rate || 0) >= 6);
                const totalReach = campaigns.reduce((sum, c) => sum + (c.total_reach || 0), 0);
                const avgEngagement = campaigns.length > 0 
                  ? campaigns.reduce((sum, c) => sum + (c.avg_engagement_rate || 0), 0) / campaigns.length 
                  : 0;

                return (
                  <>
                    {highPerformers.length > 0 && (
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">High Performers</span>
                        </div>
                        <p className="text-sm text-green-700">
                          {highPerformers.length} campaign{highPerformers.length !== 1 ? 's' : ''} with 6%+ engagement rate
                        </p>
                      </div>
                    )}
                    
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Total Reach</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Combined reach of {formatNumber(totalReach)} across all campaigns
                      </p>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <MousePointer className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-purple-800">Average Performance</span>
                      </div>
                      <p className="text-sm text-purple-700">
                        {avgEngagement.toFixed(2)}% average engagement rate across campaigns
                      </p>
                    </div>

                    {role === 'brand' && (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-4 w-4 text-gray-600" />
                          <span className="font-medium text-gray-800">Recommendation</span>
                        </div>
                        <p className="text-sm text-gray-700">
                          Focus on replicating strategies from top-performing campaigns
                        </p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}