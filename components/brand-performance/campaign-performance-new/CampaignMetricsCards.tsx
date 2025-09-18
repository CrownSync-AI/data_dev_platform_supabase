'use client';

import { Card, CardContent } from '@/components/ui/card';

import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Eye, MousePointer, Users, Link } from 'lucide-react';

interface OverviewData {
  totalReach: number;
  totalEngagement: number;
  avgEngagementRate: number;
  totalLinkClicks: number;
  newFollowers: number;
  totalImpressions: number;
  reachTrend: string;
  engagementTrend: string;
  clicksTrend: string;
  followersTrend: string;
}

interface CampaignMetricsCardsProps {
  data: OverviewData;
  role: 'brand' | 'retailer';
  loading: boolean;
  selectedPlatforms: string[];
}

export function CampaignMetricsCards({ data, role, loading, selectedPlatforms }: CampaignMetricsCardsProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getTrendIcon = (trend: string) => {
    const isPositive = trend.startsWith('+');
    return isPositive ? (
      <TrendingUp className="h-3 w-3 text-green-500" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-500" />
    );
  };

  const getTrendColor = (trend: string) => {
    const isPositive = trend.startsWith('+');
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  const platformContext = selectedPlatforms.includes('all') 
    ? 'all platforms' 
    : selectedPlatforms[0];

  const metrics = [
    {
      title: role === 'brand' ? 'Total Reach' : 'My Reach',
      value: formatNumber(data.totalReach),
      change: data.reachTrend,
      icon: <Eye className="h-4 w-4" />,
      description: selectedPlatforms.includes('all') 
        ? (role === 'brand' ? 'Across all retailers' : 'My account reach')
        : `${selectedPlatforms[0].charAt(0).toUpperCase() + selectedPlatforms[0].slice(1)} platform`,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      title: role === 'brand' ? 'Avg Engagement Rate' : 'My Engagement Rate',
      value: `${data.avgEngagementRate.toFixed(2)}%`,
      change: data.engagementTrend,
      icon: <MousePointer className="h-4 w-4" />,
      description: selectedPlatforms.includes('all')
        ? (role === 'brand' ? 'Average across platforms' : 'My performance rate')
        : `${selectedPlatforms[0].charAt(0).toUpperCase() + selectedPlatforms[0].slice(1)} engagement`,
      color: 'bg-green-50 border-green-200'
    },
    {
      title: role === 'brand' ? 'Total Link Clicks' : 'My Link Clicks',
      value: formatNumber(data.totalLinkClicks),
      change: data.clicksTrend,
      icon: <Link className="h-4 w-4" />,
      description: selectedPlatforms.includes('all') 
        ? 'Traffic generation' 
        : `${selectedPlatforms[0].charAt(0).toUpperCase() + selectedPlatforms[0].slice(1)} clicks`,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      title: role === 'brand' ? 'New Followers' : 'My New Followers',
      value: formatNumber(data.newFollowers),
      change: data.followersTrend,
      icon: <Users className="h-4 w-4" />,
      description: selectedPlatforms.includes('all')
        ? 'Audience growth'
        : `${selectedPlatforms[0].charAt(0).toUpperCase() + selectedPlatforms[0].slice(1)} growth`,
      color: 'bg-orange-50 border-orange-200'
    }
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index} className={`border-2 ${metric.color}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metric.change)}
                    <span className={`text-xs font-medium ${getTrendColor(metric.change)}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
              </div>
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                {metric.icon}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}