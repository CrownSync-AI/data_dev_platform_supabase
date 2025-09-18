'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MousePointer, 
  Heart, 
  Video, 
  Bookmark, 
  Share2,
  MessageCircle,
  ThumbsUp,
  Play,
  BarChart3
} from 'lucide-react';

type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'email' | 'all';

interface PlatformSpecificOverviewProps {
  selectedPlatform: Platform;
  selectedRole: string;
  retailerId?: string;
}

interface PlatformMetrics {
  platform: string;
  total_posts: number;
  total_impressions: number;
  total_reach: number;
  total_engagement: number;
  avg_engagement_rate: number;
  platform_metrics?: {
    // Facebook specific
    video_views?: number;
    video_completion_rate?: number;
    avg_watch_time?: number;
    reactions?: {
      love: number;
      anger: number;
      haha: number;
      wow: number;
      sorry: number;
    };
    page_likes?: number;
    post_clicks?: number;
    
    // Instagram specific
    saves?: number;
    profile_visits?: number;
    follows_from_post?: number;
    story_interactions?: {
      exits: number;
      taps_forward: number;
      taps_back: number;
    };
    reels?: {
      plays: number;
      avg_watch_time: number;
    };
    
    // Twitter specific
    retweets?: number;
    quote_tweets?: number;
    bookmarks?: number;
    profile_clicks?: number;
    url_clicks?: number;
    hashtag_clicks?: number;
    video_metrics?: {
      views: number;
      completion_25: number;
      completion_50: number;
      completion_75: number;
      completion_100: number;
    };
    
    // LinkedIn specific
    unique_impressions?: number;
    clicks?: number;
    video_views?: number;
    reactions?: {
      praise: number;
      empathy: number;
      interest: number;
      appreciation: number;
      maybe: number;
    };
  };
}

interface TopPost {
  post_id: string;
  engagement_rate: number;
  total_engagement: number;
  impressions: number;
  post_content?: string;
  post_type?: string;
  published_at?: string;
  platform_specific_data?: any;
}

export default function PlatformSpecificOverview({ 
  selectedPlatform, 
  selectedRole, 
  retailerId 
}: PlatformSpecificOverviewProps) {
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics[]>([]);
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [engagementBreakdown, setEngagementBreakdown] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlatformData();
  }, [selectedPlatform, selectedRole, retailerId]);

  const fetchPlatformData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        platform: selectedPlatform,
        role: selectedRole,
        ...(retailerId && { retailerId })
      });

      const response = await fetch(`/api/campaign-performance-new/platform-metrics?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();

      if (result.success) {
        console.log('🔍 Platform API Response:', result.data);
        console.log('📊 Overview data:', result.data.overview);
        console.log('🏆 Top posts:', result.data.topPosts);
        console.log('💝 Engagement:', result.data.engagement);
        
        setPlatformMetrics(result.data.overview || []);
        setTopPosts(result.data.topPosts || []);
        setEngagementBreakdown(result.data.engagement || {});
      } else {
        throw new Error(result.error || 'Failed to fetch platform data');
      }
    } catch (err) {
      console.error('Error fetching platform data:', err);
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

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <div className="w-4 h-4 bg-blue-600 rounded"></div>;
      case 'instagram': return <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>;
      case 'twitter': return <div className="w-4 h-4 bg-blue-400 rounded"></div>;
      case 'linkedin': return <div className="w-4 h-4 bg-blue-700 rounded"></div>;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const renderFacebookMetrics = (metrics: any) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Video className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Video Views</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.video_views || 0)}</div>
          <div className="text-xs text-muted-foreground">
            {metrics?.video_completion_rate?.toFixed(1) || 0}% completion rate
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Reactions</span>
          </div>
          <div className="text-xl font-bold">
            {formatNumber(
              (metrics?.reactions?.love || 0) + 
              (metrics?.reactions?.anger || 0) + 
              (metrics?.reactions?.haha || 0) + 
              (metrics?.reactions?.wow || 0)
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {metrics?.reactions?.love || 0} loves, {metrics?.reactions?.haha || 0} hahas
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ThumbsUp className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Page Likes</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.page_likes || 0)}</div>
          <div className="text-xs text-muted-foreground">New page likes</div>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MousePointer className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Post Clicks</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.post_clicks || 0)}</div>
          <div className="text-xs text-muted-foreground">Link clicks</div>
        </CardContent>
      </Card>
    </div>
  );

  const renderInstagramMetrics = (metrics: any) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Saves</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.saves || 0)}</div>
          <div className="text-xs text-muted-foreground">Content saved</div>
        </CardContent>
      </Card>

      <Card className="border-pink-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-pink-600" />
            <span className="text-sm font-medium">Profile Visits</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.profile_visits || 0)}</div>
          <div className="text-xs text-muted-foreground">Profile views</div>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Play className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Reels Plays</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.reels?.plays || 0)}</div>
          <div className="text-xs text-muted-foreground">
            {(metrics?.reels?.avg_watch_time / 1000)?.toFixed(1) || 0}s avg watch time
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">New Follows</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.follows_from_post || 0)}</div>
          <div className="text-xs text-muted-foreground">From posts</div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTwitterMetrics = (metrics: any) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Share2 className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium">Retweets</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.retweets || 0)}</div>
          <div className="text-xs text-muted-foreground">
            {formatNumber(metrics?.quote_tweets || 0)} quote tweets
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bookmark className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">Bookmarks</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.bookmarks || 0)}</div>
          <div className="text-xs text-muted-foreground">Saved tweets</div>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MousePointer className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Profile Clicks</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.profile_clicks || 0)}</div>
          <div className="text-xs text-muted-foreground">Profile visits</div>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Video className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Video Views</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.video_metrics?.views || 0)}</div>
          <div className="text-xs text-muted-foreground">
            {((metrics?.video_metrics?.completion_100 / metrics?.video_metrics?.views) * 100)?.toFixed(1) || 0}% completion
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLinkedInMetrics = (metrics: any) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-blue-700" />
            <span className="text-sm font-medium">Unique Impressions</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.unique_impressions || 0)}</div>
          <div className="text-xs text-muted-foreground">Unique views</div>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MousePointer className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Clicks</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.clicks || 0)}</div>
          <div className="text-xs text-muted-foreground">Link clicks</div>
        </CardContent>
      </Card>

      <Card className="border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Reactions</span>
          </div>
          <div className="text-xl font-bold">
            {formatNumber(
              (metrics?.reactions?.praise || 0) + 
              (metrics?.reactions?.empathy || 0) + 
              (metrics?.reactions?.interest || 0)
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            {metrics?.reactions?.praise || 0} praise, {metrics?.reactions?.interest || 0} insightful
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Video className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium">Video Views</span>
          </div>
          <div className="text-xl font-bold">{formatNumber(metrics?.video_views || 0)}</div>
          <div className="text-xs text-muted-foreground">Video content</div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPlatformSpecificMetrics = (platform: string, metrics: any) => {
    console.log(`🎯 Rendering ${platform} metrics:`, metrics);
    
    switch (platform) {
      case 'facebook':
        return renderFacebookMetrics(metrics);
      case 'instagram':
        return renderInstagramMetrics(metrics);
      case 'twitter':
        return renderTwitterMetrics(metrics);
      case 'linkedin':
        return renderLinkedInMetrics(metrics);
      default:
        return null;
    }
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
          <CardTitle className="text-red-800">Error Loading Platform Data</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <button 
            onClick={fetchPlatformData}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </CardContent>
      </Card>
    );
  }

  const currentPlatformData = platformMetrics.find(p => p.platform === selectedPlatform) || platformMetrics[0];

  // Mock data for demonstration when API data is not available
  const getMockPlatformData = (platform: string) => {
    const mockData = {
      platform: platform,
      total_posts: 187,
      total_impressions: 362200,
      total_reach: 296900,
      total_engagement: 30100,
      avg_engagement_rate: 10.69,
      platform_metrics: {}
    };

    switch (platform) {
      case 'instagram':
        mockData.platform_metrics = {
          saves: 3200,
          profile_visits: 8500,
          follows_from_post: 320,
          story_interactions: {
            exits: 150,
            taps_forward: 2500,
            taps_back: 180
          },
          reels: {
            plays: 25800,
            avg_watch_time: 12500
          }
        };
        break;
      case 'facebook':
        mockData.platform_metrics = {
          video_views: 12500,
          video_completion_rate: 85.2,
          avg_watch_time: 8500,
          reactions: {
            love: 450,
            anger: 25,
            haha: 380,
            wow: 220,
            sorry: 15
          },
          page_likes: 450,
          post_clicks: 1200
        };
        break;
      case 'twitter':
        mockData.platform_metrics = {
          retweets: 1800,
          quote_tweets: 450,
          bookmarks: 950,
          profile_clicks: 2100,
          url_clicks: 850,
          hashtag_clicks: 320,
          video_metrics: {
            views: 5200,
            completion_25: 4100,
            completion_50: 3200,
            completion_75: 2100,
            completion_100: 1400
          }
        };
        break;
      case 'linkedin':
        mockData.platform_metrics = {
          unique_impressions: 45200,
          clicks: 2800,
          video_views: 3200,
          reactions: {
            praise: 450,
            empathy: 180,
            interest: 380,
            appreciation: 280,
            maybe: 120
          }
        };
        break;
    }

    return mockData;
  };

  // Use mock data if no real data is available
  const displayData = currentPlatformData || getMockPlatformData(selectedPlatform);

  // Mock top posts data when API data is not available
  const getMockTopPosts = (platform: string) => {
    return [
      {
        post_id: 'a1b2c3d4e5f6',
        engagement_rate: 8.45,
        total_engagement: 2100,
        impressions: 24800,
        post_content: 'Discover luxury redefined. Our latest collection embodies elegance and sophistication.',
        post_type: platform === 'instagram' ? 'reel' : platform === 'facebook' ? 'video' : 'image',
        published_at: '2024-01-15T10:30:00Z'
      },
      {
        post_id: 'e5f6g7h8i9j0',
        engagement_rate: 7.23,
        total_engagement: 1800,
        impressions: 24900,
        post_content: 'Crafted with precision, designed for perfection. Experience the art of luxury.',
        post_type: 'image',
        published_at: '2024-01-14T14:20:00Z'
      },
      {
        post_id: 'i9j0k1l2m3n4',
        engagement_rate: 6.87,
        total_engagement: 1500,
        impressions: 21800,
        post_content: 'Where tradition meets innovation. Explore our exclusive collection.',
        post_type: platform === 'instagram' ? 'story' : 'image',
        published_at: '2024-01-13T16:45:00Z'
      }
    ];
  };

  const displayTopPosts = topPosts.length > 0 ? topPosts : getMockTopPosts(selectedPlatform);

  // Mock engagement breakdown data
  const getMockEngagementBreakdown = (platform: string) => {
    const breakdown: any = {};
    breakdown[platform] = {
      total_posts: displayData.total_posts,
      total_engagement: displayData.total_engagement,
      total_reach: displayData.total_reach,
      avg_engagement_rate: displayData.avg_engagement_rate,
      engagement_types: {}
    };

    switch (platform) {
      case 'instagram':
        breakdown[platform].engagement_types = {
          likes: 18500,
          comments: 2800,
          shares: 1200,
          saves: 3200,
          profile_visits: 8500
        };
        break;
      case 'facebook':
        breakdown[platform].engagement_types = {
          likes: 15200,
          comments: 2100,
          shares: 1800,
          reactions: {
            love: 450,
            anger: 25,
            haha: 380,
            wow: 220
          }
        };
        break;
      case 'twitter':
        breakdown[platform].engagement_types = {
          likes: 8200,
          comments: 1100,
          shares: 1800,
          retweets: 1800,
          bookmarks: 950
        };
        break;
      case 'linkedin':
        breakdown[platform].engagement_types = {
          likes: 5800,
          comments: 850,
          shares: 420,
          reactions: {
            praise: 450,
            empathy: 180,
            interest: 380
          }
        };
        break;
    }

    return breakdown;
  };

  const displayEngagementBreakdown = Object.keys(engagementBreakdown || {}).length > 0 
    ? engagementBreakdown 
    : getMockEngagementBreakdown(selectedPlatform);

  return (
    <div className="space-y-6">
      {/* Platform Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getPlatformIcon(selectedPlatform)}
            <span className="capitalize">{selectedPlatform} Analytics</span>
            {selectedPlatform !== 'all' && (
              <Badge variant="outline">Platform-Specific Metrics</Badge>
            )}
          </CardTitle>
          <CardDescription>
            {selectedPlatform === 'all' 
              ? 'Cross-platform performance overview with engagement rate analysis'
              : `Detailed ${selectedPlatform} metrics based on Ayrshare data structure`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(displayData.total_impressions)}
              </div>
              <div className="text-sm text-muted-foreground">Impressions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(displayData.total_reach)}
              </div>
              <div className="text-sm text-muted-foreground">Reach</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(displayData.total_engagement)}
              </div>
              <div className="text-sm text-muted-foreground">Engagement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {displayData.avg_engagement_rate.toFixed(2)}%
              </div>
              <div className="text-sm text-muted-foreground">Engagement Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform-Specific Metrics */}
      {selectedPlatform !== 'all' && (
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">{selectedPlatform} Platform Metrics</CardTitle>
            <CardDescription>
              Platform-specific performance indicators and engagement metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderPlatformSpecificMetrics(selectedPlatform, displayData.platform_metrics || {})}
          </CardContent>
        </Card>
      )}

      {/* Tabs for detailed analysis */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="top-posts">Top Posts</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
              <CardDescription>
                Detailed performance breakdown and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Key Performance Indicators</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Posts:</span>
                        <span className="font-medium">{displayData.total_posts}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Engagement per Post:</span>
                        <span className="font-medium">
                          {displayData.total_posts > 0 
                            ? Math.round(displayData.total_engagement / displayData.total_posts)
                            : 0
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reach Rate:</span>
                        <span className="font-medium">
                          {displayData.total_impressions > 0 
                            ? ((displayData.total_reach / displayData.total_impressions) * 100).toFixed(1)
                            : 0
                          }%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Performance Insights</h4>
                    <div className="space-y-2">
                      {displayData.avg_engagement_rate >= 6 && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-800">
                            🎉 Excellent performance! Your engagement rate is above industry average.
                          </p>
                        </div>
                      )}
                      {displayData.avg_engagement_rate >= 3 && displayData.avg_engagement_rate < 6 && (
                        <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <p className="text-sm text-yellow-800">
                            👍 Good performance. Consider optimizing content for higher engagement.
                          </p>
                        </div>
                      )}
                      {displayData.avg_engagement_rate < 3 && (
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-sm text-orange-800">
                            💡 Room for improvement. Focus on content quality and posting frequency.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-posts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>
                Highest engagement posts for {selectedPlatform} platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayTopPosts.map((post, index) => (
                  <div key={post.post_id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          'bg-orange-500 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <span className="font-medium">Post #{post.post_id.slice(-8)}</span>
                      </div>
                      <Badge variant="outline">
                        {post.engagement_rate.toFixed(2)}% engagement
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 italic">"{post.post_content}"</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Engagement:</span>
                        <div className="font-medium">{formatNumber(post.total_engagement)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Impressions:</span>
                        <div className="font-medium">{formatNumber(post.impressions)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <div className="font-medium capitalize">{post.post_type || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of engagement metrics and patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Engagement Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatNumber(displayEngagementBreakdown[selectedPlatform]?.total_engagement || 0)}
                    </div>
                    <div className="text-sm text-blue-800">Total Engagement</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {(displayEngagementBreakdown[selectedPlatform]?.avg_engagement_rate || 0).toFixed(2)}%
                    </div>
                    <div className="text-sm text-green-800">Avg Engagement Rate</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {displayEngagementBreakdown[selectedPlatform]?.total_posts || 0}
                    </div>
                    <div className="text-sm text-purple-800">Total Posts</div>
                  </div>
                </div>

                {/* Engagement Breakdown by Type */}
                <div>
                  <h4 className="font-medium mb-4">Engagement Breakdown</h4>
                  <div className="space-y-3">
                    {Object.entries(displayEngagementBreakdown[selectedPlatform]?.engagement_types || {}).map(([type, value]) => {
                      if (typeof value === 'object') {
                        // Handle nested objects like reactions
                        return (
                          <div key={type} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="font-medium capitalize">{type}</span>
                              <span className="text-sm text-gray-600">
                                {formatNumber(Object.values(value).reduce((a: number, b: any) => a + b, 0))}
                              </span>
                            </div>
                            <div className="ml-4 space-y-1">
                              {Object.entries(value).map(([subType, subValue]) => (
                                <div key={subType} className="flex justify-between text-sm">
                                  <span className="text-gray-600 capitalize">{subType}</span>
                                  <span>{formatNumber(subValue as number)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      } else {
                        return (
                          <div key={type} className="flex justify-between items-center">
                            <span className="capitalize">{type}</span>
                            <span className="font-medium">{formatNumber(value as number)}</span>
                          </div>
                        )
                      }
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
              <CardDescription>
                Detailed engagement analysis by type and performance distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(displayEngagementBreakdown).map(([platform, data]: [string, any]) => (
                  <div key={platform} className="border rounded-lg p-4">
                    <h4 className="font-medium capitalize mb-3">{platform} Engagement Analysis</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-muted-foreground">Total Posts:</span>
                        <div className="font-medium">{data.total_posts || 0}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Engagement Rate:</span>
                        <div className="font-medium">{(data.avg_engagement_rate || 0).toFixed(2)}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Engagement:</span>
                        <div className="font-medium">{formatNumber(data.total_engagement || 0)}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reach:</span>
                        <div className="font-medium">{formatNumber(data.total_reach || 0)}</div>
                      </div>
                    </div>
                    
                    {/* Platform-specific engagement breakdown */}
                    {data.engagement_types && (
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Engagement Breakdown</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          {Object.entries(data.engagement_types).map(([type, value]: [string, any]) => (
                            <div key={type} className="bg-gray-50 p-2 rounded">
                              <span className="text-muted-foreground capitalize">{type}:</span>
                              <div className="font-medium">
                                {typeof value === 'object' ? 
                                  Object.entries(value).map(([subType, subValue]: [string, any]) => (
                                    <div key={subType} className="text-xs">
                                      {subType}: {formatNumber(subValue)}
                                    </div>
                                  )) :
                                  formatNumber(value)
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}