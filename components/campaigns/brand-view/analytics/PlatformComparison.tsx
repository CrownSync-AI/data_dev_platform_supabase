'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import type { SocialAnalyticsFilters, PlatformPerformanceData } from '@/lib/types/social-media';

interface PlatformComparisonChartProps {
  filters: SocialAnalyticsFilters;
}

export function PlatformComparisonChart({ filters }: PlatformComparisonChartProps) {
  const [data, setData] = useState<PlatformPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformData();
  }, [filters]);

  const fetchPlatformData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.region && filters.region !== 'all') {
        params.append('region', filters.region);
      }
      if (filters.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      const response = await fetch(`/api/social-analytics/performance?${params}`);
      if (!response.ok) throw new Error('Failed to fetch platform data');
      
      const result = await response.json();
      
      // Handle the API response structure
      if (result.success && result.data) {
        setData(Array.isArray(result.data) ? result.data : []);
      } else {
        console.warn('Performance API returned unexpected format:', result);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching platform data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // Transform data for radar chart
  const safeData = Array.isArray(data) ? data : [];
  const radarData = [
    {
      metric: 'Engagement Rate',
      linkedin: safeData.find(p => p.platform === 'linkedin')?.engagement_rate || 0,
      instagram: safeData.find(p => p.platform === 'instagram')?.engagement_rate || 0,
      facebook: safeData.find(p => p.platform === 'facebook')?.engagement_rate || 0,
      google_business: safeData.find(p => p.platform === 'google_business')?.engagement_rate || 0,
    },
    {
      metric: 'Reach Efficiency',
      linkedin: safeData.find(p => p.platform === 'linkedin')?.reach_efficiency || 0,
      instagram: safeData.find(p => p.platform === 'instagram')?.reach_efficiency || 0,
      facebook: safeData.find(p => p.platform === 'facebook')?.reach_efficiency || 0,
      google_business: safeData.find(p => p.platform === 'google_business')?.reach_efficiency || 0,
    },
    {
      metric: 'Click Rate',
      linkedin: safeData.find(p => p.platform === 'linkedin')?.click_through_rate || 0,
      instagram: safeData.find(p => p.platform === 'instagram')?.click_through_rate || 0,
      facebook: safeData.find(p => p.platform === 'facebook')?.click_through_rate || 0,
      google_business: safeData.find(p => p.platform === 'google_business')?.click_through_rate || 0,
    },
    {
      metric: 'Growth Rate',
      linkedin: safeData.find(p => p.platform === 'linkedin')?.follower_growth_rate || 0,
      instagram: safeData.find(p => p.platform === 'instagram')?.follower_growth_rate || 0,
      facebook: safeData.find(p => p.platform === 'facebook')?.follower_growth_rate || 0,
      google_business: safeData.find(p => p.platform === 'google_business')?.follower_growth_rate || 0,
    },
    {
      metric: 'Content Frequency',
      linkedin: safeData.find(p => p.platform === 'linkedin')?.content_frequency || 0,
      instagram: safeData.find(p => p.platform === 'instagram')?.content_frequency || 0,
      facebook: safeData.find(p => p.platform === 'facebook')?.content_frequency || 0,
      google_business: safeData.find(p => p.platform === 'google_business')?.content_frequency || 0,
    }
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Platform Comparison</CardTitle>
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
        <CardTitle>Platform Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis 
                dataKey="metric" 
                fontSize={10}
                className="text-xs"
              />
              <PolarRadiusAxis 
                angle={90} 
                domain={[0, 100]} 
                fontSize={8}
                className="text-xs"
              />
              <Radar
                name="LinkedIn"
                dataKey="linkedin"
                stroke="#0077B5"
                fill="#0077B5"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Instagram"
                dataKey="instagram"
                stroke="#E4405F"
                fill="#E4405F"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Facebook"
                dataKey="facebook"
                stroke="#1877F2"
                fill="#1877F2"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Radar
                name="Google Business"
                dataKey="google_business"
                stroke="#4285F4"
                fill="#4285F4"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}