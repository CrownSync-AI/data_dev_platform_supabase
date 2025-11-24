'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Linkedin, Users, Eye, TrendingUp, Building, UserCheck } from 'lucide-react';
import type { SocialAnalyticsFilters } from '@/lib/types/social-media';

interface LinkedInAnalyticsProps {
  filters: SocialAnalyticsFilters;
}

interface LinkedInData {
  overview: {
    company_followers: number;
    page_views: number;
    unique_visitors: number;
    career_page_clicks: number;
    employee_advocacy_reach: number;
    lead_form_submissions: number;
    follower_growth_rate: number;
    engagement_rate: number;
  };
  demographics: {
    seniority: { level: string; percentage: number }[];
    industry: { name: string; percentage: number }[];
    company_size: { size: string; percentage: number }[];
    function: { area: string; percentage: number }[];
  };
  content_performance: {
    post_type: string;
    avg_engagement: number;
    avg_reach: number;
    post_count: number;
  }[];
}

export function LinkedInAnalytics({ filters }: LinkedInAnalyticsProps) {
  const [data, setData] = useState<LinkedInData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinkedInData();
  }, [filters]);

  const fetchLinkedInData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('platform', 'linkedin');
      
      if (filters.region && filters.region !== 'all') {
        params.append('region', filters.region);
      }
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      const response = await fetch(`/api/social-analytics/performance?${params}`);
      if (!response.ok) throw new Error('Failed to fetch LinkedIn data');
      
      const result = await response.json();
      setData(result.linkedinData || generateMockData());
    } catch (error) {
      console.error('Error fetching LinkedIn data:', error);
      setData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): LinkedInData => ({
    overview: {
      company_followers: 15420,
      page_views: 8750,
      unique_visitors: 6230,
      career_page_clicks: 340,
      employee_advocacy_reach: 25600,
      lead_form_submissions: 89,
      follower_growth_rate: 12.5,
      engagement_rate: 4.2
    },
    demographics: {
      seniority: [
        { level: 'Senior', percentage: 35 },
        { level: 'Mid-level', percentage: 40 },
        { level: 'Entry-level', percentage: 15 },
        { level: 'Executive', percentage: 10 }
      ],
      industry: [
        { name: 'Luxury Goods', percentage: 45 },
        { name: 'Retail', percentage: 25 },
        { name: 'Fashion', percentage: 20 },
        { name: 'Other', percentage: 10 }
      ],
      company_size: [
        { size: '1-10', percentage: 20 },
        { size: '11-50', percentage: 35 },
        { size: '51-200', percentage: 25 },
        { size: '200+', percentage: 20 }
      ],
      function: [
        { area: 'Sales', percentage: 30 },
        { area: 'Marketing', percentage: 25 },
        { area: 'Operations', percentage: 20 },
        { area: 'Other', percentage: 25 }
      ]
    },
    content_performance: [
      { post_type: 'Company Updates', avg_engagement: 156, avg_reach: 3200, post_count: 12 },
      { post_type: 'Industry Insights', avg_engagement: 203, avg_reach: 4100, post_count: 8 },
      { post_type: 'Product Showcase', avg_engagement: 289, avg_reach: 5600, post_count: 15 },
      { post_type: 'Employee Stories', avg_engagement: 178, avg_reach: 3800, post_count: 6 }
    ]
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const COLORS = ['#0077B5', '#00A0DC', '#005885', '#003D5C'];

  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-blue-600" />
            LinkedIn Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading LinkedIn data...</p>
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
                <p className="text-sm text-muted-foreground">Company Followers</p>
                <p className="text-2xl font-bold">{formatNumber(data.overview.company_followers)}</p>
                <Badge className="mt-1 bg-green-100 text-green-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{data.overview.follower_growth_rate}%
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
                <p className="text-sm text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold">{formatNumber(data.overview.page_views)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatNumber(data.overview.unique_visitors)} unique
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
                <p className="text-sm text-muted-foreground">Career Page Clicks</p>
                <p className="text-2xl font-bold">{data.overview.career_page_clicks}</p>
                <p className="text-xs text-muted-foreground mt-1">Talent acquisition</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lead Form Submissions</p>
                <p className="text-2xl font-bold">{data.overview.lead_form_submissions}</p>
                <p className="text-xs text-muted-foreground mt-1">This period</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="demographics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="demographics">Audience Demographics</TabsTrigger>
          <TabsTrigger value="content">Content Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seniority Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.demographics.seniority}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ level, percentage }) => `${level}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {data.demographics.seniority.map((_entry, index) => (
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
                <CardTitle className="text-lg">Industry Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.demographics.industry.map((item, _index) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Performance by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.content_performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="post_type" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="avg_engagement" fill="#0077B5" name="Avg Engagement" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Employee Advocacy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {formatNumber(data.overview.employee_advocacy_reach)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Reach</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Engagement Rate</span>
                      <span>{data.overview.engagement_rate}%</span>
                    </div>
                    <Progress value={data.overview.engagement_rate * 10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Company Size Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.demographics.company_size.map((item, _index) => (
                    <div key={item.size} className="flex items-center justify-between">
                      <span className="text-sm">{item.size} employees</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}