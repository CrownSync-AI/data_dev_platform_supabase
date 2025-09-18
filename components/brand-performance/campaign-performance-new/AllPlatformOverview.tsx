'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer, 
  Trophy,
  Target,
  BarChart3,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface AllPlatformOverviewProps {
  role: 'brand' | 'retailer';
  retailerId?: string;
}

interface PlatformMetric {
  platform: string;
  total_reach: number;
  avg_engagement_rate: number;
  total_link_clicks: number;
  new_followers: number;
  total_posts: number;
}

interface TrendData {
  [key: string]: Array<{
    platform: string;
    data: Array<{
      date: string;
      value: number;
      platform: string;
    }>;
  }>;
}

interface TopPerformingItem {
  item_id: string;
  item_name: string;
  total_reach: number;
  avg_engagement_rate: number;
  total_link_clicks: number;
  platform_breakdown: {
    [platform: string]: {
      reach: number;
      engagement_rate: number;
      link_clicks: number;
    };
  };
}

export default function AllPlatformOverview({ role, retailerId }: AllPlatformOverviewProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTrendMetric, setSelectedTrendMetric] = useState<string>('total_reach');

  useEffect(() => {
    fetchAllPlatformData();
  }, [role, retailerId]);

  const fetchAllPlatformData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        role,
        ...(retailerId && { retailerId })
      });

      const response = await fetch(`/api/campaign-performance-new/all-platform?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch all platform data');
      }
    } catch (err) {
      console.error('Error fetching all platform data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getPlatformColor = (platform: string) => {
    // Morandi-style muted, sophisticated colors
    const colors: { [key: string]: string } = {
      facebook: '#8B9DC3',    // Muted blue-gray
      instagram: '#DDB892',   // Warm beige
      twitter: '#A8DADC',     // Soft teal
      linkedin: '#457B9D'     // Deep muted blue
    };
    return colors[platform] || '#B8B8B8';
  };

  const getPlatformIcon = (platform: string) => {
    // Morandi-style muted colors for icons
    switch (platform) {
      case 'facebook': return <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8B9DC3' }}></div>;
      case 'instagram': return <div className="w-4 h-4 rounded" style={{ backgroundColor: '#DDB892' }}></div>;
      case 'twitter': return <div className="w-4 h-4 rounded" style={{ backgroundColor: '#A8DADC' }}></div>;
      case 'linkedin': return <div className="w-4 h-4 rounded" style={{ backgroundColor: '#457B9D' }}></div>;
      default: return <BarChart3 className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendMetricLabel = (metric: string) => {
    const labels: { [key: string]: string } = {
      total_reach: 'Total Reach',
      avg_engagement_rate: 'Average Engagement Rate',
      total_link_clicks: 'Total Link Clicks',
      new_followers: 'New Followers'
    };
    return labels[metric] || metric;
  };

  const renderTrendsChart = () => {
    if (!data?.trendsData || !data.trendsData[selectedTrendMetric]) {
      return (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No trend data available
        </div>
      );
    }

    const chartData = data.trendsData[selectedTrendMetric];
    
    // Prepare data for recharts
    const dates = [...new Set(
      chartData.flatMap((platform: any) => platform.data.map((d: any) => d.date))
    )].sort();

    const formattedData = dates.map(date => {
      const dataPoint: any = { date };
      chartData.forEach((platform: any) => {
        const platformData = platform.data.find((d: any) => d.date === date);
        dataPoint[platform.platform] = platformData ? platformData.value : 0;
      });
      return dataPoint;
    });

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="2 2" stroke="#E5E7EB" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 11, fill: '#6B7280' }}
            tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            axisLine={{ stroke: '#D1D5DB', strokeWidth: 1 }}
            tickLine={{ stroke: '#D1D5DB' }}
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#6B7280' }}
            axisLine={{ stroke: '#D1D5DB', strokeWidth: 1 }}
            tickLine={{ stroke: '#D1D5DB' }}
          />
          <Tooltip 
            labelFormatter={(value) => new Date(value).toLocaleDateString()}
            formatter={(value: any, name: any) => [
              selectedTrendMetric === 'avg_engagement_rate' ? `${value}%` : formatNumber(value),
              name.charAt(0).toUpperCase() + name.slice(1)
            ]}
            contentStyle={{
              backgroundColor: '#FEFEFE',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          {chartData.map((platform: any) => (
            <Line
              key={platform.platform}
              type="monotone"
              dataKey={platform.platform}
              stroke={getPlatformColor(platform.platform)}
              strokeWidth={2.5}
              dot={{ r: 3, fill: getPlatformColor(platform.platform), strokeWidth: 0 }}
              activeDot={{ r: 5, fill: getPlatformColor(platform.platform), strokeWidth: 2, stroke: '#FFFFFF' }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Error Loading All Platform Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchAllPlatformData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Overall Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            All Platform Analytics Overview
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Horizontal analysis across all social media platforms
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(data.overallSummary?.totalReach || 0)}
              </div>
              <div className="text-sm text-blue-700">Total Reach</div>
              <div className="text-xs text-blue-600 flex items-center justify-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" />
                {data.overallSummary?.reachTrend || '+0%'}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {(data.overallSummary?.avgEngagementRate || 0).toFixed(1)}%
              </div>
              <div className="text-sm text-green-700">Avg Engagement Rate</div>
              <div className="text-xs text-green-600 flex items-center justify-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" />
                {data.overallSummary?.engagementTrend || '+0%'}
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(data.overallSummary?.totalLinkClicks || 0)}
              </div>
              <div className="text-sm text-purple-700">Total Link Clicks</div>
              <div className="text-xs text-purple-600 flex items-center justify-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" />
                {data.overallSummary?.clicksTrend || '+0%'}
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {formatNumber(data.overallSummary?.newFollowers || 0)}
              </div>
              <div className="text-sm text-orange-700">New Followers</div>
              <div className="text-xs text-orange-600 flex items-center justify-center gap-1 mt-1">
                <ArrowUpRight className="h-3 w-3" />
                {data.overallSummary?.followersTrend || '+0%'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="platform-analysis" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="platform-analysis">Platform Analysis</TabsTrigger>
          <TabsTrigger value="campaign-analysis">Campaign Analysis</TabsTrigger>
          <TabsTrigger value="retailer-analysis">
            {role === 'brand' ? 'Retailer Analysis' : 'My Performance'}
          </TabsTrigger>
        </TabsList>

        {/* Platform Analysis Tab */}
        <TabsContent value="platform-analysis" className="space-y-6">
          {/* Platform Metrics Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Metrics Breakdown</CardTitle>
              <p className="text-sm text-muted-foreground">
                Performance comparison across all platforms
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {(data.platformMetrics || []).map((platform: PlatformMetric) => (
                  <Card key={platform.platform} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(platform.platform)}
                          <h4 className="font-medium capitalize">{platform.platform}</h4>
                        </div>
                        <Badge variant="outline">
                          {platform.avg_engagement_rate.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reach:</span>
                          <span className="font-medium">{formatNumber(platform.total_reach)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Link Clicks:</span>
                          <span className="font-medium">{formatNumber(platform.total_link_clicks)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">New Followers:</span>
                          <span className="font-medium">{formatNumber(platform.new_followers)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Posts:</span>
                          <span className="font-medium">{platform.total_posts}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trends View */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance Trends</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track performance trends across platforms over time
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex gap-2 flex-wrap">
                  {['total_reach', 'avg_engagement_rate', 'total_link_clicks', 'new_followers'].map((metric) => (
                    <Button
                      key={metric}
                      variant={selectedTrendMetric === metric ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedTrendMetric(metric)}
                    >
                      {getTrendMetricLabel(metric)}
                    </Button>
                  ))}
                </div>
              </div>
              {renderTrendsChart()}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaign Analysis Tab */}
        <TabsContent value="campaign-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Top Performing Campaigns
                <Badge variant="secondary">{(data.topCampaigns || []).length}</Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Campaign performance with platform-level breakdowns
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(data.topCampaigns || []).map((campaign: TopPerformingItem, index: number) => (
                  <Card key={campaign.item_id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            'bg-orange-500 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-medium">{campaign.item_name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatNumber(campaign.total_reach)} total reach • {campaign.avg_engagement_rate.toFixed(1)}% engagement
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {formatNumber(campaign.total_link_clicks)} clicks
                        </Badge>
                      </div>
                      
                      {/* Platform Breakdown */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                        {Object.entries(campaign.platform_breakdown || {}).map(([platform, metrics]: [string, any]) => (
                          <div key={platform} className="text-center p-2 bg-gray-50 rounded">
                            <div className="flex items-center justify-center gap-1 mb-1">
                              {getPlatformIcon(platform)}
                              <span className="text-xs font-medium capitalize">{platform}</span>
                            </div>
                            <div className="text-sm font-semibold">{formatNumber(metrics.reach)}</div>
                            <div className="text-xs text-muted-foreground">{metrics.engagement_rate.toFixed(1)}%</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Retailer Analysis Tab */}
        <TabsContent value="retailer-analysis" className="space-y-6">
          {role === 'brand' ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Top Performing Retailers
                  <Badge variant="secondary">{(data.topRetailers || []).length}</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Retailer performance with platform-level breakdowns
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(data.topRetailers || []).map((retailer: TopPerformingItem, index: number) => (
                    <Card key={retailer.item_id} className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-500 text-white' :
                              index === 1 ? 'bg-gray-400 text-white' :
                              'bg-orange-500 text-white'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <h4 className="font-medium">{retailer.item_name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {formatNumber(retailer.total_reach)} total reach • {retailer.avg_engagement_rate.toFixed(1)}% engagement
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {formatNumber(retailer.total_link_clicks)} clicks
                          </Badge>
                        </div>
                        
                        {/* Platform Breakdown */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                          {Object.entries(retailer.platform_breakdown || {}).map(([platform, metrics]: [string, any]) => (
                            <div key={platform} className="text-center p-2 bg-gray-50 rounded">
                              <div className="flex items-center justify-center gap-1 mb-1">
                                {getPlatformIcon(platform)}
                                <span className="text-xs font-medium capitalize">{platform}</span>
                              </div>
                              <div className="text-sm font-semibold">{formatNumber(metrics.reach)}</div>
                              <div className="text-xs text-muted-foreground">{metrics.engagement_rate.toFixed(1)}%</div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  My Performance Analysis
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Your performance breakdown across all platforms
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium">Platform Performance</h4>
                    {(data.platformMetrics || []).map((platform: PlatformMetric) => (
                      <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {getPlatformIcon(platform.platform)}
                          <span className="font-medium capitalize">{platform.platform}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{platform.avg_engagement_rate.toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">
                            {formatNumber(platform.total_reach)} reach
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Key Insights</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          📊 You're active on {data.overallSummary?.activePlatforms || 0} platforms
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">
                          🎯 Average engagement rate: {(data.overallSummary?.avgEngagementRate || 0).toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-800">
                          🔗 Total link clicks: {formatNumber(data.overallSummary?.totalLinkClicks || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}