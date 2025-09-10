'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Instagram, Users, Eye, Heart, Share, ShoppingBag, Play, Camera } from 'lucide-react';
import type { SocialAnalyticsFilters, InstagramMetrics } from '@/lib/types/social-media';

interface InstagramAnalyticsProps {
  filters: SocialAnalyticsFilters;
}

interface InstagramData {
  overview: {
    followers: number;
    following: number;
    posts_count: number;
    story_views: number;
    story_completion_rate: number;
    reel_views: number;
    reel_shares: number;
    shopping_product_taps: number;
    profile_visits: number;
    reach: number;
    impressions: number;
    engagement_rate: number;
  };
  content_breakdown: {
    type: string;
    count: number;
    avg_engagement: number;
    avg_reach: number;
  }[];
  story_metrics: {
    date: string;
    views: number;
    completion_rate: number;
    exits: number;
  }[];
  hashtag_performance: {
    hashtag: string;
    usage_count: number;
    avg_engagement: number;
    reach: number;
  }[];
  audience_activity: {
    hour: number;
    activity_level: number;
  }[];
}

export function InstagramAnalytics({ filters }: InstagramAnalyticsProps) {
  const [data, setData] = useState<InstagramData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstagramData();
  }, [filters]);

  const fetchInstagramData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('platform', 'instagram');
      
      if (filters.region && filters.region !== 'all') {
        params.append('region', filters.region);
      }
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      const response = await fetch(`/api/social-analytics/performance?${params}`);
      if (!response.ok) throw new Error('Failed to fetch Instagram data');
      
      const result = await response.json();
      setData(result.instagramData || generateMockData());
    } catch (error) {
      console.error('Error fetching Instagram data:', error);
      setData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): InstagramData => ({
    overview: {
      followers: 28500,
      following: 1250,
      posts_count: 156,
      story_views: 12400,
      story_completion_rate: 68.5,
      reel_views: 45600,
      reel_shares: 890,
      shopping_product_taps: 234,
      profile_visits: 3200,
      reach: 89500,
      impressions: 156000,
      engagement_rate: 5.8
    },
    content_breakdown: [
      { type: 'Photo', count: 89, avg_engagement: 456, avg_reach: 5200 },
      { type: 'Carousel', count: 34, avg_engagement: 678, avg_reach: 6800 },
      { type: 'Reel', count: 23, avg_engagement: 1234, avg_reach: 12400 },
      { type: 'Story', count: 145, avg_engagement: 234, avg_reach: 3400 }
    ],
    story_metrics: [
      { date: '2025-01-01', views: 1200, completion_rate: 65, exits: 420 },
      { date: '2025-01-02', views: 1350, completion_rate: 72, exits: 378 },
      { date: '2025-01-03', views: 1180, completion_rate: 68, exits: 378 },
      { date: '2025-01-04', views: 1420, completion_rate: 75, exits: 355 },
      { date: '2025-01-05', views: 1290, completion_rate: 70, exits: 387 }
    ],
    hashtag_performance: [
      { hashtag: 'luxuryjewelry', usage_count: 45, avg_engagement: 567, reach: 12400 },
      { hashtag: 'handcrafted', usage_count: 38, avg_engagement: 423, reach: 9800 },
      { hashtag: 'elegance', usage_count: 42, avg_engagement: 389, reach: 8900 },
      { hashtag: 'timeless', usage_count: 29, avg_engagement: 445, reach: 7600 },
      { hashtag: 'artisan', usage_count: 31, avg_engagement: 398, reach: 6800 }
    ],
    audience_activity: [
      { hour: 6, activity_level: 15 },
      { hour: 7, activity_level: 25 },
      { hour: 8, activity_level: 45 },
      { hour: 9, activity_level: 65 },
      { hour: 10, activity_level: 70 },
      { hour: 11, activity_level: 75 },
      { hour: 12, activity_level: 85 },
      { hour: 13, activity_level: 80 },
      { hour: 14, activity_level: 75 },
      { hour: 15, activity_level: 70 },
      { hour: 16, activity_level: 65 },
      { hour: 17, activity_level: 60 },
      { hour: 18, activity_level: 85 },
      { hour: 19, activity_level: 95 },
      { hour: 20, activity_level: 90 },
      { hour: 21, activity_level: 75 },
      { hour: 22, activity_level: 55 },
      { hour: 23, activity_level: 35 }
    ]
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const COLORS = ['#E4405F', '#FF6B9D', '#C73650', '#8B2635'];

  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-pink-600" />
            Instagram Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading Instagram data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Followers</p>
                <p className="text-2xl font-bold">{formatNumber(data.overview.followers)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatNumber(data.overview.following)} following
                </p>
              </div>
              <Users className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reel Views</p>
                <p className="text-2xl font-bold">{formatNumber(data.overview.reel_views)}</p>
                <Badge className="mt-1 bg-pink-100 text-pink-800">
                  <Share className="h-3 w-3 mr-1" />
                  {data.overview.reel_shares} shares
                </Badge>
              </div>
              <Play className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Story Views</p>
                <p className="text-2xl font-bold">{formatNumber(data.overview.story_views)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.overview.story_completion_rate}% completion
                </p>
              </div>
              <Camera className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Shopping Taps</p>
                <p className="text-2xl font-bold">{data.overview.shopping_product_taps}</p>
                <p className="text-xs text-muted-foreground mt-1">Product interactions</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="stories">Stories & Reels</TabsTrigger>
          <TabsTrigger value="hashtags">Hashtag Analysis</TabsTrigger>
          <TabsTrigger value="audience">Audience Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Type Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.content_breakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="avg_engagement" fill="#E4405F" name="Avg Engagement" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.content_breakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, count }) => `${type}: ${count}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {data.content_breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Story Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.story_metrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#E4405F" 
                      strokeWidth={2}
                      name="Views"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completion_rate" 
                      stroke="#FF6B9D" 
                      strokeWidth={2}
                      name="Completion Rate (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hashtags" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Performing Hashtags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.hashtag_performance.map((hashtag, index) => (
                  <div key={hashtag.hashtag} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">#{hashtag.hashtag}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Used {hashtag.usage_count} times
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatNumber(hashtag.avg_engagement)} avg engagement</p>
                        <p className="text-xs text-muted-foreground">{formatNumber(hashtag.reach)} reach</p>
                      </div>
                    </div>
                    <Progress value={(hashtag.avg_engagement / 600) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audience Activity by Hour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.audience_activity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      tickFormatter={(value) => `${value}:00`}
                      fontSize={12}
                    />
                    <YAxis fontSize={12} />
                    <Tooltip 
                      labelFormatter={(value) => `${value}:00`}
                      formatter={(value: number) => [`${value}%`, 'Activity Level']}
                    />
                    <Bar dataKey="activity_level" fill="#E4405F" name="Activity Level %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}