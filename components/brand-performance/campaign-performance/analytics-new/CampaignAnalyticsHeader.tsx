'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Eye, MousePointer, Share2, Users } from 'lucide-react';

interface CampaignAnalyticsHeaderProps {
  data: {
    campaign: {
      name: string;
      status: string;
      type: string;
    };
    summary: {
      currentPeriodER: number;
      previousPeriodER: number;
      changePercent: number;
      totalReach: number;
      totalEngagement: number;
      totalImpressions: number;
      avgEngagementRate: number;
    };
    driverAnalysis: {
      insights: string[];
    };
  };
}

export default function CampaignAnalyticsHeader({ data }: CampaignAnalyticsHeaderProps) {
  const { campaign, summary, driverAnalysis } = data;
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (changePercent: number) => {
    if (changePercent > 0) {
      return <TrendingUp className="h-5 w-5 text-green-600" />;
    } else if (changePercent < 0) {
      return <TrendingDown className="h-5 w-5 text-red-600" />;
    }
    return <div className="h-5 w-5" />;
  };

  const getTrendColor = (changePercent: number) => {
    if (changePercent > 0) return 'text-green-600';
    if (changePercent < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Campaign Overview Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{campaign.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getStatusColor(campaign.status)}>
                  {campaign.status}
                </Badge>
                <Badge variant="outline">{campaign.type}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-1">
                {getTrendIcon(summary.changePercent)}
                <span className={`text-2xl font-bold ${getTrendColor(summary.changePercent)}`}>
                  {summary.currentPeriodER.toFixed(2)}%
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {summary.changePercent > 0 ? '+' : ''}{summary.changePercent.toFixed(1)}% vs. last period
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* AI Smart Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📊 AI Smart Summary</h3>
            <div className="space-y-2">
              {driverAnalysis.insights.map((insight, index) => (
                <p key={index} className="text-blue-800 text-sm leading-relaxed">
                  {insight}
                </p>
              ))}
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(summary.totalImpressions)}
              </p>
              <p className="text-sm text-gray-600">Total Impressions</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(summary.totalReach)}
              </p>
              <p className="text-sm text-gray-600">Total Reach</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <MousePointer className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(summary.totalEngagement)}
              </p>
              <p className="text-sm text-gray-600">Total Engagement</p>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Share2 className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {summary.avgEngagementRate.toFixed(2)}%
              </p>
              <p className="text-sm text-gray-600">Avg. Engagement Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}