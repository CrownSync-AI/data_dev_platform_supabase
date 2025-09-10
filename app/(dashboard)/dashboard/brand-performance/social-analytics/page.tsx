'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download, TrendingUp, Users, Eye, MousePointer, Trophy } from 'lucide-react';
import { SocialMetricCard } from '@/components/brand-performance/SocialMetricCard';
import { TimeRangeSelector } from '@/components/brand-performance/TimeRangeSelector';
import { PlatformFilter } from '@/components/brand-performance/PlatformFilter';
import { RegionFilter } from '@/components/brand-performance/RegionFilter';
import { EngagementTrendsChart } from '@/components/brand-performance/EngagementTrendsChart';
import { RetailerSocialRankingTable } from '@/components/brand-performance/RetailerSocialRankingTable';
import { TopContentTable } from '@/components/brand-performance/TopContentTable';
import { LinkedInAnalytics } from '@/components/brand-performance/LinkedInAnalytics';
import { InstagramAnalytics } from '@/components/brand-performance/InstagramAnalytics';
import { FacebookAnalytics } from '@/components/brand-performance/FacebookAnalytics';
import { GoogleBusinessAnalytics } from '@/components/brand-performance/GoogleBusinessAnalytics';
import { SocialAnalyticsExport } from '@/components/brand-performance/SocialAnalyticsExport';
import { useSocialAnalyticsRealtime } from '@/lib/hooks/useSocialAnalyticsRealtime';

import type { SocialMetricsResponse, SocialAnalyticsFilters } from '@/lib/types/social-media';

export default function SocialAnalyticsPage() {
  const [filters, setFilters] = useState<SocialAnalyticsFilters>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    platform: [],
    region: 'all'
  });

  // Use real-time hook for data fetching
  const { data: metrics, loading, error, lastUpdated, refresh } = useSocialAnalyticsRealtime({
    filters,
    refreshInterval: 30000 // 30 seconds
  });

  const handleTimeRangeChange = (range: string) => {
    const now = new Date();
    let startDate: Date;

    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    setFilters(prev => ({
      ...prev,
      dateRange: {
        start: startDate.toISOString().split('T')[0],
        end: now.toISOString().split('T')[0]
      }
    }));
  };

  const handlePlatformChange = (platforms: string[]) => {
    setFilters(prev => ({ ...prev, platform: platforms }));
  };

  const handleRegionChange = (region: string) => {
    setFilters(prev => ({ ...prev, region }));
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const calculateChange = (current: number, previous: number): string => {
    if (previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Media Analytics</h1>
          <p className="text-muted-foreground">
            Track social media performance across LinkedIn, Instagram, Facebook, and Google Business
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <SocialAnalyticsExport filters={filters} />
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <TimeRangeSelector
              defaultValue="30d"
              options={[
                { label: 'Last 7 days', value: '7d' },
                { label: 'Last 30 days', value: '30d' },
                { label: 'Last 90 days', value: '90d' }
              ]}
              onRangeChange={handleTimeRangeChange}
            />
            <PlatformFilter
              selectedPlatforms={filters.platform || []}
              onFilterChange={handlePlatformChange}
            />
            <RegionFilter
              selectedRegion={filters.region || 'all'}
              onFilterChange={handleRegionChange}
            />
          </div>
        </CardContent>
      </Card>



      {/* Overview Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SocialMetricCard
          title="Total Reach"
          value={metrics ? formatNumber(metrics.totalReach) : '0'}
          change={metrics ? calculateChange(metrics.totalReach, metrics.totalReach * 0.85) : '+0%'}
          platform="all"
          icon={<Eye className="h-4 w-4" />}
          trend="up"
        />
        <SocialMetricCard
          title="Total Engagement"
          value={metrics ? formatNumber(metrics.totalEngagement) : '0'}
          change={metrics ? calculateChange(metrics.totalEngagement, metrics.totalEngagement * 0.9) : '+0%'}
          platform="all"
          icon={<TrendingUp className="h-4 w-4" />}
          trend="up"
        />
        <SocialMetricCard
          title="Avg Engagement Rate"
          value={metrics ? `${metrics.avgEngagementRate.toFixed(2)}%` : '0%'}
          change={metrics ? calculateChange(metrics.avgEngagementRate, metrics.avgEngagementRate * 0.95) : '+0%'}
          platform="all"
          icon={<MousePointer className="h-4 w-4" />}
          trend="up"
        />
        <SocialMetricCard
          title="New Followers"
          value={metrics ? formatNumber(metrics.newFollowers) : '0'}
          change={metrics ? calculateChange(metrics.newFollowers, metrics.newFollowers * 0.8) : '+0%'}
          platform="all"
          icon={<Users className="h-4 w-4" />}
          trend="up"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platform Analysis</TabsTrigger>
          <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
          <TabsTrigger value="instagram">Instagram</TabsTrigger>
          <TabsTrigger value="facebook">Facebook</TabsTrigger>
          <TabsTrigger value="google">Google Business</TabsTrigger>
          <TabsTrigger value="retailers">Retailer Rankings</TabsTrigger>
          <TabsTrigger value="content">Top Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <EngagementTrendsChart filters={filters} />
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          {/* Key Performance Metrics Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Platforms</p>
                    <p className="text-2xl font-bold">{metrics?.platformBreakdown?.length || 0}</p>
                  </div>
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Active social channels</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Best Engagement</p>
                    <p className="text-2xl font-bold">
                      {metrics?.platformBreakdown && metrics.platformBreakdown.length > 0 ? 
                        (() => {
                          const bestPlatform = metrics.platformBreakdown.reduce((prev, current) => 
                            (current.engagement > prev.engagement) ? current : prev
                          );
                          return ((bestPlatform.engagement / bestPlatform.reach) * 100).toFixed(1);
                        })() : '0'
                      }%
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Highest performing platform</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Audience</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(metrics?.platformBreakdown?.reduce((sum, p) => sum + p.followers, 0) || 0)}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Combined followers</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
                    <p className="text-2xl font-bold">
                      {metrics?.avgEngagementRate?.toFixed(1) || '0'}%
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Eye className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Cross-platform average</p>
              </CardContent>
            </Card>
          </div>

          {/* Platform Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Performance Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Detailed breakdown of performance metrics across all social media platforms
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Platform</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Reach</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Engagement</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Rate</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Followers</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-600">Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics?.platformBreakdown?.map((platform) => {
                      const platformNames = {
                        linkedin: 'LinkedIn',
                        instagram: 'Instagram',
                        facebook: 'Facebook',
                        google_business: 'Google Business'
                      };
                      
                      const totalReach = metrics.platformBreakdown?.reduce((sum, p) => sum + p.reach, 0) || 1;
                      const reachShare = (platform.reach / totalReach) * 100;
                      const engagementRate = platform.reach > 0 ? (platform.engagement / platform.reach) * 100 : 0;
                      
                      return (
                        <tr key={platform.platform} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-medium">
                              {platformNames[platform.platform as keyof typeof platformNames]}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-medium">
                            {formatNumber(platform.reach)}
                          </td>
                          <td className="py-4 px-4 text-right font-medium">
                            {formatNumber(platform.engagement)}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className={`font-medium ${
                                engagementRate >= 5 ? 'text-green-600' : 
                                engagementRate >= 2 ? 'text-yellow-600' : 'text-gray-600'
                              }`}>
                                {engagementRate.toFixed(2)}%
                              </span>
                              {engagementRate >= 5 && <TrendingUp className="h-3 w-3 text-green-500" />}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-medium">
                            {formatNumber(platform.followers)}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-12 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${reachShare}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600 w-10 text-right">
                                {reachShare.toFixed(0)}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Platform Rankings</CardTitle>
                <p className="text-sm text-muted-foreground">Ranked by total engagement</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics?.platformBreakdown
                    ?.sort((a, b) => b.engagement - a.engagement)
                    ?.map((platform, index) => {
                      const platformNames = {
                        linkedin: 'LinkedIn',
                        instagram: 'Instagram',
                        facebook: 'Facebook',
                        google_business: 'Google Business'
                      };
                      
                      const engagementRate = platform.reach > 0 ? (platform.engagement / platform.reach) * 100 : 0;
                      
                      return (
                        <div key={platform.platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-500 text-white' :
                              index === 1 ? 'bg-gray-400 text-white' :
                              index === 2 ? 'bg-orange-500 text-white' :
                              'bg-gray-300 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium">
                              {platformNames[platform.platform as keyof typeof platformNames]}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{formatNumber(platform.engagement)}</div>
                            <div className="text-xs text-gray-500">{engagementRate.toFixed(1)}% rate</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <p className="text-sm text-muted-foreground">Performance analysis summary</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics?.platformBreakdown && metrics.platformBreakdown.length > 0 && (
                    <>
                      {(() => {
                        const topPlatform = metrics.platformBreakdown.reduce((prev, current) => 
                          (current.engagement > prev.engagement) ? current : prev
                        );
                        const topEngagementRate = (topPlatform.engagement / topPlatform.reach) * 100;
                        const platformNames = {
                          linkedin: 'LinkedIn',
                          instagram: 'Instagram',
                          facebook: 'Facebook',
                          google_business: 'Google Business'
                        };
                        
                        return (
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-2 mb-1">
                              <Trophy className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-green-800">Top Performer</span>
                            </div>
                            <p className="text-sm text-green-700">
                              {platformNames[topPlatform.platform as keyof typeof platformNames]} leads with {topEngagementRate.toFixed(1)}% engagement rate
                            </p>
                          </div>
                        );
                      })()}
                      
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Total Reach</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          Combined reach of {formatNumber(metrics.totalReach)} across all platforms
                        </p>
                      </div>
                      
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-purple-800">Audience Growth</span>
                        </div>
                        <p className="text-sm text-purple-700">
                          {formatNumber(metrics.newFollowers)} new followers gained recently
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="linkedin" className="space-y-4">
          <LinkedInAnalytics filters={filters} />
        </TabsContent>

        <TabsContent value="instagram" className="space-y-4">
          <InstagramAnalytics filters={filters} />
        </TabsContent>

        <TabsContent value="facebook" className="space-y-4">
          <FacebookAnalytics filters={filters} />
        </TabsContent>

        <TabsContent value="google" className="space-y-4">
          <GoogleBusinessAnalytics filters={filters} />
        </TabsContent>

        <TabsContent value="retailers" className="space-y-4">
          <RetailerSocialRankingTable filters={filters} />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <TopContentTable filters={filters} />
        </TabsContent>
      </Tabs>
    </div>
  );
}