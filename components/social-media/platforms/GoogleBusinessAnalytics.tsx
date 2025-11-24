'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { MapPin, Eye, Navigation, Phone, Star } from 'lucide-react';
import type { SocialAnalyticsFilters } from '@/lib/types/social-media';

interface GoogleBusinessAnalyticsProps {
  filters: SocialAnalyticsFilters;
}

interface GoogleBusinessData {
  overview: {
    profile_views: number;
    search_views: number;
    map_views: number;
    direction_requests: number;
    phone_calls: number;
    website_clicks: number;
    booking_requests: number;
    photo_views: number;
    average_rating: number;
    total_reviews: number;
  };
  search_queries: {
    query: string;
    impressions: number;
    clicks: number;
    ctr: number;
  }[];
  customer_actions: {
    action_type: string;
    count: number;
    percentage: number;
  }[];
  review_analysis: {
    rating: number;
    count: number;
    percentage: number;
  }[];
  photo_performance: {
    photo_type: string;
    views: number;
    customer_photos: number;
    business_photos: number;
  }[];
  weekly_trends: {
    week: string;
    profile_views: number;
    search_queries: number;
    actions: number;
  }[];
}

export function GoogleBusinessAnalytics({ filters }: GoogleBusinessAnalyticsProps) {
  const [data, setData] = useState<GoogleBusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGoogleBusinessData();
  }, [filters]);

  const fetchGoogleBusinessData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('platform', 'google_business');
      
      if (filters.region && filters.region !== 'all') {
        params.append('region', filters.region);
      }
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      const response = await fetch(`/api/social-analytics/performance?${params}`);
      if (!response.ok) throw new Error('Failed to fetch Google Business data');
      
      const result = await response.json();
      setData(result.googleBusinessData || generateMockData());
    } catch (error) {
      console.error('Error fetching Google Business data:', error);
      setData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): GoogleBusinessData => ({
    overview: {
      profile_views: 12450,
      search_views: 8900,
      map_views: 3550,
      direction_requests: 456,
      phone_calls: 234,
      website_clicks: 678,
      booking_requests: 89,
      photo_views: 5600,
      average_rating: 4.6,
      total_reviews: 127
    },
    search_queries: [
      { query: 'luxury jewelry store', impressions: 2340, clicks: 234, ctr: 10.0 },
      { query: 'custom engagement rings', impressions: 1890, clicks: 189, ctr: 10.0 },
      { query: 'fine jewelry repair', impressions: 1560, clicks: 124, ctr: 7.9 },
      { query: 'diamond necklaces', impressions: 1230, clicks: 98, ctr: 8.0 },
      { query: 'wedding bands', impressions: 1100, clicks: 88, ctr: 8.0 }
    ],
    customer_actions: [
      { action_type: 'Website Visits', count: 678, percentage: 35 },
      { action_type: 'Direction Requests', count: 456, percentage: 24 },
      { action_type: 'Phone Calls', count: 234, percentage: 12 },
      { action_type: 'Booking Requests', count: 89, percentage: 5 },
      { action_type: 'Photo Views', count: 467, percentage: 24 }
    ],
    review_analysis: [
      { rating: 5, count: 78, percentage: 61.4 },
      { rating: 4, count: 32, percentage: 25.2 },
      { rating: 3, count: 12, percentage: 9.4 },
      { rating: 2, count: 3, percentage: 2.4 },
      { rating: 1, count: 2, percentage: 1.6 }
    ],
    photo_performance: [
      { photo_type: 'Interior', views: 1890, customer_photos: 45, business_photos: 23 },
      { photo_type: 'Products', views: 2340, customer_photos: 67, business_photos: 89 },
      { photo_type: 'Exterior', views: 890, customer_photos: 12, business_photos: 8 },
      { photo_type: 'Team', views: 480, customer_photos: 5, business_photos: 15 }
    ],
    weekly_trends: [
      { week: 'Week 1', profile_views: 2890, search_queries: 1234, actions: 456 },
      { week: 'Week 2', profile_views: 3120, search_queries: 1456, actions: 523 },
      { week: 'Week 3', profile_views: 2980, search_queries: 1389, actions: 489 },
      { week: 'Week 4', profile_views: 3460, search_queries: 1567, actions: 578 }
    ]
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const COLORS = ['#4285F4', '#34A853', '#FBBC04', '#EA4335'];

  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Google Business Profile Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading Google Business data...</p>
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
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">{formatNumber(data.overview.profile_views)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatNumber(data.overview.search_views)} from search
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Direction Requests</p>
                <p className="text-2xl font-bold">{data.overview.direction_requests}</p>
                <p className="text-xs text-muted-foreground mt-1">Navigation clicks</p>
              </div>
              <Navigation className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Phone Calls</p>
                <p className="text-2xl font-bold">{data.overview.phone_calls}</p>
                <p className="text-xs text-muted-foreground mt-1">Direct calls</p>
              </div>
              <Phone className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{data.overview.average_rating}</p>
                  <div className="flex">{renderStars(data.overview.average_rating)}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.overview.total_reviews} reviews
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="search" className="space-y-4">
        <TabsList>
          <TabsTrigger value="search">Search Performance</TabsTrigger>
          <TabsTrigger value="actions">Customer Actions</TabsTrigger>
          <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger>
          <TabsTrigger value="photos">Photo Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Search Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.search_queries.map((query, _index) => (
                    <div key={query.query} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{query.query}</span>
                        <Badge variant="outline">{query.ctr.toFixed(1)}% CTR</Badge>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatNumber(query.impressions)} impressions</span>
                        <span>{query.clicks} clicks</span>
                      </div>
                      <Progress value={(query.clicks / query.impressions) * 100 * 10} className="h-1" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.weekly_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="profile_views" 
                        stroke="#4285F4" 
                        strokeWidth={2}
                        name="Profile Views"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="search_queries" 
                        stroke="#34A853" 
                        strokeWidth={2}
                        name="Search Queries"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actions" 
                        stroke="#FBBC04" 
                        strokeWidth={2}
                        name="Actions"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Actions Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.customer_actions}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ action_type, percentage }) => `${action_type}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {data.customer_actions.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Action Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.customer_actions.map((action, _index) => (
                    <div key={action.action_type} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{action.action_type}</span>
                        <span className="text-sm text-muted-foreground">{action.count}</span>
                      </div>
                      <Progress value={action.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rating Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.review_analysis.map((rating) => (
                    <div key={rating.rating} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{rating.rating}</span>
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{rating.count}</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            ({rating.percentage}%)
                          </span>
                        </div>
                      </div>
                      <Progress value={rating.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-4xl font-bold">{data.overview.average_rating}</span>
                      <div className="flex">{renderStars(data.overview.average_rating)}</div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on {data.overview.total_reviews} reviews
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">
                        {data.review_analysis.filter(r => r.rating >= 4).reduce((sum, r) => sum + r.count, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Positive Reviews</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">
                        {data.review_analysis.filter(r => r.rating <= 2).reduce((sum, r) => sum + r.count, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Negative Reviews</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Photo Performance by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.photo_performance.map((photo, _index) => (
                  <div key={photo.photo_type} className="p-4 border rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{photo.photo_type}</h4>
                      <Badge variant="secondary">{formatNumber(photo.views)} views</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Customer Photos</p>
                        <p className="font-medium">{photo.customer_photos}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Business Photos</p>
                        <p className="font-medium">{photo.business_photos}</p>
                      </div>
                    </div>
                    
                    <Progress 
                      value={(photo.views / Math.max(...data.photo_performance.map(p => p.views))) * 100} 
                      className="h-2" 
                    />
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