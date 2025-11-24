'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw, Download, Share2 } from 'lucide-react';
import CampaignAnalyticsHeader from '@/components/campaigns/retailer-view/analytics/CampaignAnalyticsHeader';
import DriverWaterfallChart from '@/components/campaigns/retailer-view/analytics/DriverWaterfallChart';
import TopPostsSection from '@/components/campaigns/retailer-view/analytics/TopPostsSection';
import RecommendationCards from '@/components/campaigns/retailer-view/analytics/RecommendationCards';
import PlatformPerformanceGrid from '@/components/campaigns/retailer-view/analytics/PlatformPerformanceGrid';
import { generateMockCampaignAnalytics } from '@/lib/services/mockCampaignAnalyticsService';

export default function RetailerCampaignAnalyticsNewPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId as string;

  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  useEffect(() => {
    if (campaignId) {
      loadAnalyticsData();
    }
  }, [campaignId]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      // Generate mock analytics data based on Ayrshare structure
      const data = generateMockCampaignAnalytics(campaignId);
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    loadAnalyticsData();
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Campaign not found</h2>
          <p className="text-gray-600 mb-4">The requested campaign analytics could not be loaded.</p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Campaigns
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Campaign Analytics New</h1>
            <p className="text-gray-600">{analyticsData.campaign.name} - Retailer View</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Retailer-specific notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-1">🏪 Retailer Analytics View</h3>
        <p className="text-blue-800 text-sm">
          This view shows campaign performance data relevant to your retail location and customer engagement.
          Contact your brand representative for additional insights and collaboration opportunities.
        </p>
      </div>

      {/* Analytics Header - What (The Outcome) */}
      <CampaignAnalyticsHeader data={analyticsData} />

      {/* Driver Waterfall - Why (The Reason) */}
      <DriverWaterfallChart data={analyticsData.driverAnalysis} />

      {/* Platform Performance Grid */}
      <PlatformPerformanceGrid
        data={analyticsData.platformPerformance}
        onPlatformClick={(platform) => console.log('Platform clicked:', platform)}
      />

      {/* Top Posts/Assets - Drill Down */}
      <TopPostsSection
        posts={analyticsData.topPosts}
        onPostClick={setSelectedPost}
        selectedPost={selectedPost}
      />

      {/* Recommendations - Next (The Action) */}
      <RecommendationCards recommendations={analyticsData.recommendations} />
    </div>
  );
}