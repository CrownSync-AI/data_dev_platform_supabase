'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Eye, Users, MousePointer, Share2, ExternalLink } from 'lucide-react';

interface PlatformMetrics {
  impressions: number;
  reach: number;
  engagement: number;
  engagementRate: number;
  clicks?: number;
  shares?: number;
  saves?: number;
}

interface PlatformData {
  platform: string;
  metrics: PlatformMetrics;
  trend: 'up' | 'down' | 'stable';
  posts: any[];
}

interface PlatformPerformanceGridProps {
  data: PlatformData[];
  onPlatformClick: (platform: string) => void;
}

export default function PlatformPerformanceGrid({ data, onPlatformClick }: PlatformPerformanceGridProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getPlatformLogo = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
            alt="Facebook"
            className="w-6 h-6 object-contain"
          />
        );
      case 'instagram':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" 
            alt="Instagram"
            className="w-6 h-6 object-contain"
          />
        );
      case 'linkedin':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" 
            alt="LinkedIn"
            className="w-6 h-6 object-contain"
          />
        );
      case 'twitter':
      case 'x':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg" 
            alt="X"
            className="w-6 h-6 object-contain"
          />
        );
      case 'tiktok':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/3/34/Ionicons_logo-tiktok.svg" 
            alt="TikTok"
            className="w-6 h-6 object-contain"
          />
        );
      case 'youtube':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" 
            alt="YouTube"
            className="w-6 h-6 object-contain"
          />
        );
      default:
        return (
          <div className="w-6 h-6 rounded bg-gray-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">?</span>
          </div>
        );
    }
  };



  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50 border-green-200';
      case 'down': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Platform Performance Breakdown
        </CardTitle>
        <p className="text-gray-600">
          Detailed metrics and trends across all social media platforms
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.map((platform) => (
            <Card 
              key={platform.platform} 
              className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-200"
              onClick={() => onPlatformClick(platform.platform)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      {getPlatformLogo(platform.platform)}
                    </div>
                    <div>
                      <h3 className="font-semibold capitalize">{platform.platform}</h3>
                      <p className="text-xs text-gray-500">{platform.posts.length} posts</p>
                    </div>
                  </div>
                  <Badge className={`${getTrendColor(platform.trend)} border`}>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(platform.trend)}
                      <span className="text-xs capitalize">{platform.trend}</span>
                    </div>
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Key Metric - Engagement Rate */}
                <div className="text-center mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {platform.metrics.engagementRate.toFixed(2)}%
                  </p>
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                </div>

                {/* Detailed Metrics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Eye className="h-3 w-3 text-blue-600" />
                      <span className="text-gray-600">Impressions</span>
                    </div>
                    <span className="font-medium">{formatNumber(platform.metrics.impressions)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-green-600" />
                      <span className="text-gray-600">Reach</span>
                    </div>
                    <span className="font-medium">{formatNumber(platform.metrics.reach)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-3 w-3 text-purple-600" />
                      <span className="text-gray-600">Engagement</span>
                    </div>
                    <span className="font-medium">{formatNumber(platform.metrics.engagement)}</span>
                  </div>

                  {/* Platform-specific metrics */}
                  {platform.metrics.clicks && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-3 w-3 text-indigo-600" />
                        <span className="text-gray-600">Clicks</span>
                      </div>
                      <span className="font-medium">{formatNumber(platform.metrics.clicks)}</span>
                    </div>
                  )}

                  {platform.metrics.shares && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Share2 className="h-3 w-3 text-orange-600" />
                        <span className="text-gray-600">Shares</span>
                      </div>
                      <span className="font-medium">{formatNumber(platform.metrics.shares)}</span>
                    </div>
                  )}

                  {platform.metrics.saves && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-600">💾</span>
                        <span className="text-gray-600">Saves</span>
                      </div>
                      <span className="font-medium">{formatNumber(platform.metrics.saves)}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlatformClick(platform.platform);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Comparison Summary */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">📈 Platform Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-800">
                <strong>Best Performing:</strong> {data.reduce((best, current) => 
                  current.metrics.engagementRate > best.metrics.engagementRate ? current : best
                ).platform} ({data.reduce((best, current) => 
                  current.metrics.engagementRate > best.metrics.engagementRate ? current : best
                ).metrics.engagementRate.toFixed(2)}% ER)
              </p>
            </div>
            <div>
              <p className="text-blue-800">
                <strong>Highest Reach:</strong> {data.reduce((best, current) => 
                  current.metrics.reach > best.metrics.reach ? current : best
                ).platform} ({formatNumber(data.reduce((best, current) => 
                  current.metrics.reach > best.metrics.reach ? current : best
                ).metrics.reach)} people)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}