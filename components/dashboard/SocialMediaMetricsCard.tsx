'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Share2, TrendingUp, Users, Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import { fetchSocialMetricsOverview, formatSocialNumber, type SocialMetricsOverview } from '@/lib/services/socialMetricsService';

export function SocialMediaMetricsCard() {
  const [metrics, setMetrics] = useState<SocialMetricsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSocialMetrics();
  }, []);

  const loadSocialMetrics = async () => {
    try {
      setLoading(true);
      const data = await fetchSocialMetricsOverview();
      setMetrics(data);
    } catch (error) {
      console.error('Error loading social metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Social Media Performance</CardTitle>
          <Share2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
          <div className="grid grid-cols-2 gap-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Social Media Performance</CardTitle>
          <Share2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">No data available</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href="/dashboard/brand-performance/social-analytics">
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Social Media Performance</CardTitle>
          <Share2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-2xl font-bold">{formatSocialNumber(metrics.totalReach)}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {metrics.growthRate} reach growth
            </span>
          </p>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-pink-500" />
              <span>{formatSocialNumber(metrics.totalEngagement)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3 text-blue-500" />
              <span>{formatSocialNumber(metrics.totalFollowers)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {metrics.activePlatforms} platforms
            </Badge>
            <span className="text-xs text-muted-foreground">
              Top: {metrics.topPerformingPlatform}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}