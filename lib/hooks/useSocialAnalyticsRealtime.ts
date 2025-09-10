'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { SocialMetricsResponse, SocialAnalyticsFilters } from '@/lib/types/social-media';

interface UseSocialAnalyticsRealtimeProps {
  filters?: SocialAnalyticsFilters;
  refreshInterval?: number; // in milliseconds
}

export function useSocialAnalyticsRealtime({
  filters,
  refreshInterval = 30000 // 30 seconds default
}: UseSocialAnalyticsRealtimeProps = {}) {
  const [data, setData] = useState<SocialMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      
      if (filters?.platform && filters.platform.length > 0) {
        params.append('platforms', filters.platform.join(','));
      }
      if (filters?.region && filters.region !== 'all') {
        params.append('region', filters.region);
      }
      if (filters?.dateRange) {
        params.append('startDate', filters.dateRange.start);
        params.append('endDate', filters.dateRange.end);
      }

      const response = await fetch(`/api/social-analytics?${params}`);
      if (!response.ok) throw new Error('Failed to fetch social analytics data');
      
      const result = await response.json();
      console.log('🔍 Hook: API Response:', result);
      
      if (result.success && result.data) {
        setData(result.data);
        console.log('✅ Hook: Data set successfully:', result.data);
      } else {
        throw new Error(result.error || 'Invalid response format');
      }
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching social analytics data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up real-time subscriptions
  useEffect(() => {
    const channel = supabase
      .channel('social_analytics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_analytics'
        },
        (payload: any) => {
          console.log('Social analytics data changed:', payload);
          // Refresh data when changes occur
          fetchData();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'account_analytics'
        },
        (payload: any) => {
          console.log('Account analytics data changed:', payload);
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchData]);

  // Set up periodic refresh
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  };
}

// Hook for real-time social metrics overview (for dashboard)
export function useSocialMetricsOverviewRealtime() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch('/api/social-analytics?overview=true');
      if (!response.ok) throw new Error('Failed to fetch social metrics overview');
      
      const result = await response.json();
      setMetrics(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching social metrics overview:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();

    // Set up real-time subscription for overview metrics
    const channel = supabase
      .channel('social_metrics_overview')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'social_analytics'
        },
        () => fetchMetrics()
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'account_analytics'
        },
        () => fetchMetrics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchMetrics]);

  return { metrics, loading, error, refresh: fetchMetrics };
}