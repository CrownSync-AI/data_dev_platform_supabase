'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import type { SocialAnalyticsFilters, EngagementTrendData } from '@/lib/types/social-media';

interface EngagementTrendsChartProps {
  filters: SocialAnalyticsFilters;
}

export function EngagementTrendsChart({ filters }: EngagementTrendsChartProps) {
  const [data, setData] = useState<EngagementTrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendsData();
  }, [filters]);

  const fetchTrendsData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.platform && filters.platform.length > 0) {
        params.append('platforms', filters.platform.join(','));
      }
      if (filters.region && filters.region !== 'all') {
        params.append('region', filters.region);
      }
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      const response = await fetch(`/api/social-analytics/trends?${params}`);
      if (!response.ok) throw new Error('Failed to fetch trends data');
      
      const result = await response.json();
      
      // Handle the API response structure
      if (result.success && result.data && result.data.trends) {
        setData(result.data.trends);
      } else {
        console.warn('Trends API returned unexpected format:', result);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching trends data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const platformColors = {
    linkedin: '#7C9885',      // Muted sage green (Morandi-inspired)
    instagram: '#B4A7D6',     // Soft lavender (Morandi-inspired)
    facebook: '#8DB4D2',      // Dusty blue (Morandi-inspired)
    google_business: '#D4A574' // Warm beige (Morandi-inspired)
  };

  // Group data by platform for multiple lines
  const groupedData = Array.isArray(data) ? data.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = { date };
    }
    acc[date][`${item.platform}_engagement`] = item.engagement_rate;
    acc[date][`${item.platform}_reach`] = item.reach;
    return acc;
  }, {} as Record<string, any>) : {};

  const chartData = Object.values(groupedData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const platforms = Array.isArray(data) ? [...new Set(data.map(item => item.platform))] : [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Engagement Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.6} />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                fontSize={12}
                stroke="#6B7280"
                tickLine={{ stroke: '#D1D5DB' }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <YAxis 
                label={{ 
                  value: 'Engagement Rate (%)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#6B7280' }
                }}
                fontSize={12}
                stroke="#6B7280"
                tickLine={{ stroke: '#D1D5DB' }}
                axisLine={{ stroke: '#D1D5DB' }}
              />
              <Tooltip 
                labelFormatter={(value) => formatDate(value as string)}
                formatter={(value: number, name: string) => [
                  `${value.toFixed(2)}%`,
                  name
                ]}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  fontSize: '12px'
                }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Legend 
                wrapperStyle={{ 
                  fontSize: '12px',
                  color: '#6B7280'
                }}
              />
              {platforms.map((platform) => {
                const platformNames = {
                  linkedin: 'LinkedIn',
                  instagram: 'Instagram',
                  facebook: 'Facebook',
                  google_business: 'Google Business'
                };
                
                return (
                  <Line
                    key={platform}
                    type="monotone"
                    dataKey={`${platform}_engagement`}
                    stroke={platformColors[platform as keyof typeof platformColors] || '#6B7280'}
                    strokeWidth={2.5}
                    dot={{ 
                      r: 4, 
                      fill: platformColors[platform as keyof typeof platformColors] || '#6B7280',
                      strokeWidth: 2,
                      stroke: '#ffffff'
                    }}
                    activeDot={{ 
                      r: 6, 
                      fill: platformColors[platform as keyof typeof platformColors] || '#6B7280',
                      strokeWidth: 2,
                      stroke: '#ffffff'
                    }}
                    name={platformNames[platform as keyof typeof platformNames] || platform}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}