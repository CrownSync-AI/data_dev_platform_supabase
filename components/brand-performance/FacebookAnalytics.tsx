'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Facebook, Users, ThumbsUp, Eye, Calendar, Video } from 'lucide-react';
import type { SocialAnalyticsFilters } from '@/lib/types/social-media';

interface FacebookAnalyticsProps {
  filters: SocialAnalyticsFilters;
}

interface FacebookData {
  overview: {
    page_likes: number;
    page_follows: number;
    post_reach: number;
    video_views: number;
    event_responses: number;
    page_views: number;
    page_engagement: number;
    fan_growth_rate: number;
  };
  audience_demographics: {
    age_gender: {
      age_range: string;
      male: number;
      female: number;
    }[];
    top_countries: {
      country: string;
      percentage: number;
    }[];
    top_cities: {
      city: string;
      percentage: number;
    }[];
  };
  post_performance: {
    post_type: string;
    avg_reach: number;
    avg_engagement: number;
    avg_clicks: number;
    post_count: number;
  }[];
  engagement_timeline: {
    date: string;
    likes: number;
    comments: number;
    shares: number;
    reactions: number;
  }[];
  video_metrics: {
    video_title: string;
    views: number;
    completion_rate: number;
    avg_watch_time: number;
    engagement: number;
  }[];
}

export function FacebookAnalytics({ filters }: FacebookAnalyticsProps) {
  const [data, setData] = useState<FacebookData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFacebookData();
  }, [filters]);

  const fetchFacebookData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('platform', 'facebook');
      
      if (filters.region && filters.region !== 'all') {
        params.append('region', filters.region);
      }
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      const response = await fetch(`/api/social-analytics/performance?${params}`);
      if (!response.ok) throw new Error('Failed to fetch Facebook data');
      
      const result = await response.json();
      setData(result.facebookData || generateMockData());
    } catch (error) {
      console.error('Error fetching Facebook data:', error);
      setData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): FacebookData => ({
    overview: {
      page_likes: 18750,
      page_follows: 19200,
      post_reach: 45600,
      video_views: 23400,
      event_responses: 156,
      page_views: 8900,
      page_engagement: 2340,
      fan_growth_rate: 8.5
    },
    audience_demographics: {
      age_gender: [
        { age_range: '18-24', male: 15, female: 25 },
        { age_range: '25-34', male: 20, female: 30 },
        { age_range: '35-44', male: 18, female: 28 },
        { age_range: '45-54', male: 12, female: 20 },
        { age_range: '55-64', male: 8, female: 15 },
        { age_range: '65+', male: 5, female: 8 }
      ],
      top_countries: [
        { country: 'United States', percentage: 45 },
        { country: 'Canada', percentage: 15 },
        { country: 'United Kingdom', percentage: 12 },
        { country: 'Australia', percentage: 8 },
        { country: 'Germany', percentage: 6 }
      ],
      top_cities: [
        { city: 'New York', percentage: 12 },
        { city: 'Los Angeles', percentage: 8 },
        { city: 'Toronto', percentage: 6 },
        { city: 'London', percentage: 5 },
        { city: 'Chicago', percentage: 4 }
      ]
    },
    post_performance: [
      { post_type: 'Photo', avg_reach: 3200, avg_engagement: 245, avg_clicks: 45, post_count: 45 },
      { post_type: 'Video', avg_reach: 5600, avg_engagement: 456, avg_clicks: 89, post_count: 23 },
      { post_type: 'Link', avg_reach: 2800, avg_engagement: 178, avg_clicks: 156, post_count: 34 },
      { post_type: 'Event', avg_reach: 4200, avg_engagement: 234, avg_clicks: 67, post_count: 12 }
    ],
    engagement_timeline: [
      { date: '2025-01-01', likes: 234, comments: 45, shares: 23, reactions: 67 },
      { date: '2025-01-02', likes: 267, comments: 52, shares: 28, reactions: 78 },
      { date: '2025-01-03', likes: 198, comments: 38, shares: 19, reactions: 56 },
      { date: '2025-01-04', likes: 289, comments: 61, shares: 34, reactions: 89 },
      { date: '2025-01-05', likes: 245, comments: 47, shares: 25, reactions: 71 }
    ],
    video_metrics: [
      { video_title: 'Luxury Collection Showcase', views: 5600, completion_rate: 68, avg_watch_time: 45, engagement: 234 },
      { video_title: 'Behind the Scenes: Craftsmanship', views: 4200, completion_rate: 72, avg_watch_time: 52, engagement: 189 },
      { video_title: 'Customer Stories', views: 3800, completion_rate: 65, avg_watch_time: 38, engagement: 156 },
      { video_title: 'New Arrivals Preview', views: 6200, completion_rate: 75, avg_watch_time: 48, engagement: 278 }
    ]
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };



  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            Facebook Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading Facebook data...</p>
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
                <p className="text-sm text-muted-foreground">Page Likes</p>
                <p className="text-2xl font-bold">{formatNumber(data.overview.page_likes)}</p>
                <Badge className="mt-1 bg-green-100 text-green-800">
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  +{data.overview.fan_growth_rate}%
                </Badge>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Post Reach</p>
                <p className="text-2xl font-bold">{formatNumber(data.overview.post_reach)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatNumber(data.overview.page_views)} page views
                </p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Video Views</p>
                <p className="text-2xl font-bold">{formatNumber(data.overview.video_views)}</p>
                <p className="text-xs text-muted-foreground mt-1">Video content</p>
              </div>
              <Video className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Event Responses</p>
                <p className="text-2xl font-bold">{data.overview.event_responses}</p>
                <p className="text-xs text-muted-foreground mt-1">This period</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="audience" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audience">Audience Demographics</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Timeline</TabsTrigger>
          <TabsTrigger value="videos">Video Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Age & Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.audience_demographics.age_gender}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age_range" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="male" stackId="a" fill="#1877F2" name="Male" />
                      <Bar dataKey="female" stackId="a" fill="#42A5F5" name="Female" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.audience_demographics.top_countries.map((country, _index) => (
                    <div key={country.country} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{country.country}</span>
                        <span>{country.percentage}%</span>
                      </div>
                      <Progress value={country.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Post Type Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.post_performance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="post_type" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="avg_engagement" fill="#1877F2" name="Avg Engagement" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Click Performance by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.post_performance.map((post, _index) => (
                    <div key={post.post_type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{post.post_type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {post.post_count} posts
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{post.avg_clicks} avg clicks</p>
                          <p className="text-xs text-muted-foreground">{formatNumber(post.avg_reach)} reach</p>
                        </div>
                      </div>
                      <Progress value={(post.avg_clicks / 200) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Engagement Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.engagement_timeline}>
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
                    <Area 
                      type="monotone" 
                      dataKey="likes" 
                      stackId="1"
                      stroke="#1877F2" 
                      fill="#1877F2"
                      name="Likes"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="comments" 
                      stackId="1"
                      stroke="#42A5F5" 
                      fill="#42A5F5"
                      name="Comments"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="shares" 
                      stackId="1"
                      stroke="#1565C0" 
                      fill="#1565C0"
                      name="Shares"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="reactions" 
                      stackId="1"
                      stroke="#0D47A1" 
                      fill="#0D47A1"
                      name="Reactions"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Video Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.video_metrics.map((video, _index) => (
                  <div key={video.video_title} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{video.video_title}</h4>
                      <Badge variant="secondary">{formatNumber(video.views)} views</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Completion Rate</p>
                        <p className="font-medium">{video.completion_rate}%</p>
                        <Progress value={video.completion_rate} className="h-1 mt-1" />
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Watch Time</p>
                        <p className="font-medium">{video.avg_watch_time}s</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Engagement</p>
                        <p className="font-medium">{video.engagement}</p>
                      </div>
                    </div>
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