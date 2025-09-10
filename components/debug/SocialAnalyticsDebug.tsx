'use client';

import { useState, useEffect } from 'react';

export function SocialAnalyticsDebug() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('🔍 Debug: Fetching social analytics data...');
        const response = await fetch('/api/social-analytics');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('🔍 Debug: API Response:', result);
        
        if (result.success && result.data) {
          setData(result.data);
          console.log('✅ Debug: Data set successfully:', result.data);
        } else {
          throw new Error(result.error || 'Invalid response format');
        }
      } catch (err) {
        console.error('❌ Debug: Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-yellow-50">
        <h3 className="font-semibold text-yellow-800">🔄 Loading Social Analytics Data...</h3>
        <p className="text-yellow-600">Fetching data from API...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50">
        <h3 className="font-semibold text-red-800">❌ Error Loading Data</h3>
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-red-500 mt-2">Check browser console for more details.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <h3 className="font-semibold text-gray-800">⚠️ No Data Available</h3>
        <p className="text-gray-600">API returned success but no data.</p>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-green-50">
      <h3 className="font-semibold text-green-800 mb-4">✅ Social Analytics Data Loaded</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white p-3 rounded border">
          <div className="text-sm text-gray-600">Total Reach</div>
          <div className="text-lg font-semibold">{data.totalReach?.toLocaleString() || 0}</div>
        </div>
        <div className="bg-white p-3 rounded border">
          <div className="text-sm text-gray-600">Total Engagement</div>
          <div className="text-lg font-semibold">{data.totalEngagement?.toLocaleString() || 0}</div>
        </div>
        <div className="bg-white p-3 rounded border">
          <div className="text-sm text-gray-600">Engagement Rate</div>
          <div className="text-lg font-semibold">{data.avgEngagementRate?.toFixed(2) || 0}%</div>
        </div>
        <div className="bg-white p-3 rounded border">
          <div className="text-sm text-gray-600">New Followers</div>
          <div className="text-lg font-semibold">{data.newFollowers?.toLocaleString() || 0}</div>
        </div>
      </div>

      <div className="bg-white p-3 rounded border">
        <h4 className="font-semibold mb-2">Platform Breakdown</h4>
        {data.platformBreakdown?.map((platform: any) => (
          <div key={platform.platform} className="flex justify-between items-center py-1">
            <span className="capitalize">{platform.platform}</span>
            <span className="text-sm">
              {platform.reach?.toLocaleString()} reach, {platform.engagement?.toLocaleString()} engagement
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-green-600">
        ✅ If you see this data, the API is working correctly. The main dashboard should show the same numbers.
      </div>
    </div>
  );
}