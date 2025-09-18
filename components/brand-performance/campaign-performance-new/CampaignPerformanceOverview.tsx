'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, Eye, MousePointer, Trophy, Target } from 'lucide-react';

type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'email' | 'all';

interface CampaignPerformanceOverviewProps {
  data: {
    overview: any;
    campaigns: any[];
    retailers: any[];
    platforms: any[];
    breakdowns?: {
      postType: any[];
      campaignType: any[];
      platform: any[];
      summary: any;
    };
  };
  selectedPlatforms: Platform[];
  role: 'brand' | 'retailer';
}

export function CampaignPerformanceOverview({ 
  data, 
  selectedPlatforms, 
  role 
}: CampaignPerformanceOverviewProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getPerformanceTier = (engagementRate: number) => {
    if (engagementRate >= 6) return { label: 'High Performance', color: 'bg-green-100 text-green-800' };
    if (engagementRate >= 3) return { label: 'Good Performance', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Standard Performance', color: 'bg-gray-100 text-gray-800' };
  };

  // Get top performing campaigns
  const topCampaigns = data.campaigns
    .sort((a, b) => b.avg_engagement_rate - a.avg_engagement_rate)
    .slice(0, 3);

  // Get top performing retailers (for brand view)
  const topRetailers = data.retailers
    .sort((a, b) => b.avg_engagement_rate - a.avg_engagement_rate)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Top Performing Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCampaigns.length > 0 ? (
                topCampaigns.map((campaign, index) => {
                  const tier = getPerformanceTier(campaign.avg_engagement_rate || 0);
                  return (
                    <div key={campaign.campaign_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          'bg-orange-500 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{campaign.campaign_name}</p>
                          <Badge className={tier.color} variant="secondary">
                            {tier.label}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{(campaign.avg_engagement_rate || 0).toFixed(2)}%</div>
                        <div className="text-xs text-gray-500">
                          {formatNumber(campaign.total_reach || 0)} reach
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center py-4">No campaign data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {role === 'brand' ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Top Performing Retailers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topRetailers.length > 0 ? (
                  topRetailers.map((retailer, index) => (
                    <div key={retailer.retailer_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          'bg-gray-300 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{retailer.retailer_name}</p>
                          <p className="text-xs text-gray-500">{retailer.region}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{(retailer.avg_engagement_rate || 0).toFixed(2)}%</div>
                        <div className="text-xs text-gray-500">
                          {formatNumber(retailer.total_reach || 0)} reach
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No retailer data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                My Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Total Reach</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">
                    {formatNumber(data.overview.totalReach)}
                  </p>
                  <p className="text-sm text-blue-700">
                    Across all my social media platforms
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <MousePointer className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Engagement Rate</span>
                  </div>
                  <p className="text-2xl font-bold text-green-900">
                    {data.overview.avgEngagementRate.toFixed(2)}%
                  </p>
                  <p className="text-sm text-green-700">
                    My average performance rate
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-800">Growth Trend</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">
                    {data.overview.followersTrend}
                  </p>
                  <p className="text-sm text-purple-700">
                    Follower growth this period
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Platform Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedPlatforms.includes('all') 
              ? 'Platform Performance Summary' 
              : `${selectedPlatforms[0].charAt(0).toUpperCase() + selectedPlatforms[0].slice(1)} Performance`
            }
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {selectedPlatforms.includes('all') 
              ? 'Performance breakdown across all platforms'
              : `Detailed metrics for ${selectedPlatforms[0]} platform`
            }
          </p>
        </CardHeader>
        <CardContent>
          {selectedPlatforms.includes('all') ? (
            // All Platforms View - Show comparison cards
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {data.platforms.length > 0 ? (
                  data.platforms.map((platform) => {
                    const tier = getPerformanceTier(platform.avg_engagement_rate || 0);
                    return (
                      <Card key={platform.platform} className="border-2">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium capitalize">{platform.platform}</h4>
                            <Badge className={tier.color} variant="secondary">
                              {tier.label}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Engagement Rate:</span>
                              <span className="font-medium">{(platform.avg_engagement_rate || 0).toFixed(2)}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total Reach:</span>
                              <span className="font-medium">{formatNumber(platform.total_reach || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Posts:</span>
                              <span className="font-medium">{platform.posts_count || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Link Clicks:</span>
                              <span className="font-medium">{formatNumber(platform.total_link_clicks || 0)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No platform data available</p>
                  </div>
                )}
              </div>
              
              {/* Platform-Specific Analysis Call-to-Action */}
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Want deeper platform insights?
                    </h4>
                    <p className="text-sm text-blue-700 mb-4">
                      Select a specific platform above to see detailed Ayrshare-based metrics including video performance, 
                      reaction breakdowns, saves, retweets, and more platform-specific analytics.
                    </p>
                    <div className="flex justify-center gap-2 text-xs text-blue-600">
                      <span>📊 Video Analytics</span>
                      <span>💝 Reaction Insights</span>
                      <span>🔄 Engagement Patterns</span>
                      <span>📈 Performance Trends</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Platform Comparison Chart */}
              {data.platforms.length > 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Performance Comparison</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Engagement rate comparison across platforms
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data.platforms
                        .sort((a, b) => (b.avg_engagement_rate || 0) - (a.avg_engagement_rate || 0))
                        .map((platform, index) => {
                          const maxEngagement = Math.max(...data.platforms.map(p => p.avg_engagement_rate || 0));
                          const percentage = maxEngagement > 0 ? ((platform.avg_engagement_rate || 0) / maxEngagement) * 100 : 0;
                          
                          return (
                            <div key={platform.platform} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium capitalize">{platform.platform}</span>
                                  {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                                </div>
                                <span className="text-sm font-medium">
                                  {(platform.avg_engagement_rate || 0).toFixed(2)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    index === 0 ? 'bg-green-500' : 
                                    index === 1 ? 'bg-blue-500' : 
                                    index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            // Single Platform View - Show detailed metrics for selected platform only
            <div className="space-y-6">
              {(() => {
                const selectedPlatform = data.platforms.find(p => p.platform === selectedPlatforms[0]);
                if (!selectedPlatform) {
                  return (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No data available for {selectedPlatforms[0]} platform</p>
                    </div>
                  );
                }
                
                const tier = getPerformanceTier(selectedPlatform.avg_engagement_rate || 0);
                
                return (
                  <>
                    {/* Platform-Specific Metrics */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card className="border-2 border-blue-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-blue-800">Total Reach</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-900">
                            {formatNumber(selectedPlatform.total_reach || 0)}
                          </p>
                          <p className="text-sm text-blue-700">Unique users reached</p>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MousePointer className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-800">Engagement Rate</span>
                          </div>
                          <p className="text-2xl font-bold text-green-900">
                            {(selectedPlatform.avg_engagement_rate || 0).toFixed(2)}%
                          </p>
                          <Badge className={tier.color} variant="secondary">
                            {tier.label}
                          </Badge>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-purple-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-purple-800">Total Engagement</span>
                          </div>
                          <p className="text-2xl font-bold text-purple-900">
                            {formatNumber(selectedPlatform.total_engagement || 0)}
                          </p>
                          <p className="text-sm text-purple-700">Likes, comments, shares</p>
                        </CardContent>
                      </Card>

                      <Card className="border-2 border-orange-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-orange-600" />
                            <span className="font-medium text-orange-800">Content Posts</span>
                          </div>
                          <p className="text-2xl font-bold text-orange-900">
                            {selectedPlatform.posts_count || 0}
                          </p>
                          <p className="text-sm text-orange-700">Total content pieces</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Enhanced Platform-Specific Analysis Call-to-Action */}
                    <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <h4 className="font-semibold text-indigo-900 mb-2 text-lg">
                            🚀 Unlock Advanced {selectedPlatforms[0].charAt(0).toUpperCase() + selectedPlatforms[0].slice(1)} Analytics
                          </h4>
                          <p className="text-sm text-indigo-700 mb-4">
                            Click the "{selectedPlatforms[0].charAt(0).toUpperCase() + selectedPlatforms[0].slice(1)} Analytics" tab above to access detailed platform-specific metrics including:
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-indigo-600 mb-4">
                            {selectedPlatforms[0] === 'facebook' && (
                              <>
                                <span>📹 Video Completion Rates</span>
                                <span>😍 Reaction Breakdowns</span>
                                <span>👍 Page Like Growth</span>
                                <span>🔗 Post Click Analysis</span>
                              </>
                            )}
                            {selectedPlatforms[0] === 'instagram' && (
                              <>
                                <span>💾 Save Rates</span>
                                <span>👤 Profile Visit Tracking</span>
                                <span>📱 Story Interactions</span>
                                <span>🎬 Reels Performance</span>
                              </>
                            )}
                            {selectedPlatforms[0] === 'twitter' && (
                              <>
                                <span>🔄 Retweet Analysis</span>
                                <span>🔖 Bookmark Tracking</span>
                                <span>📊 Video Completion</span>
                                <span>🔗 URL Click Rates</span>
                              </>
                            )}
                            {selectedPlatforms[0] === 'linkedin' && (
                              <>
                                <span>👏 Professional Reactions</span>
                                <span>👁️ Unique Impressions</span>
                                <span>🖱️ Click-through Rates</span>
                                <span>📹 Video Engagement</span>
                              </>
                            )}
                            {selectedPlatforms[0] === 'email' && (
                              <>
                                <span>📧 Open Rate Analysis</span>
                                <span>🖱️ Click Rate Tracking</span>
                                <span>📬 Delivery Performance</span>
                                <span>📊 Campaign Comparison</span>
                              </>
                            )}
                          </div>
                          <Badge variant="outline" className="bg-white text-indigo-700 border-indigo-300">
                            Based on Ayrshare API Structure
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Platform-Specific Insights */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="capitalize">{selectedPlatforms[0]} Performance Insights</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Detailed analysis for {selectedPlatforms[0]} platform
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            <h4 className="font-medium">Key Metrics</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Link Clicks:</span>
                                <span className="font-medium">{formatNumber(selectedPlatform.total_link_clicks || 0)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Click-Through Rate:</span>
                                <span className="font-medium">
                                  {selectedPlatform.total_impressions > 0 
                                    ? ((selectedPlatform.total_link_clicks / selectedPlatform.total_impressions) * 100).toFixed(2)
                                    : '0'
                                  }%
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Engagement per Post:</span>
                                <span className="font-medium">
                                  {selectedPlatform.posts_count > 0 
                                    ? Math.round((selectedPlatform.total_engagement || 0) / selectedPlatform.posts_count)
                                    : 0
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <h4 className="font-medium">Performance Analysis</h4>
                            <div className="space-y-2">
                              {(selectedPlatform.avg_engagement_rate || 0) >= 6 && (
                                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                  <p className="text-sm text-green-800">
                                    🎉 Excellent performance on {selectedPlatforms[0]}! Engagement rate is above industry average.
                                  </p>
                                </div>
                              )}
                              {(selectedPlatform.avg_engagement_rate || 0) >= 3 && (selectedPlatform.avg_engagement_rate || 0) < 6 && (
                                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                  <p className="text-sm text-yellow-800">
                                    👍 Good performance on {selectedPlatforms[0]}. Consider optimizing content for higher engagement.
                                  </p>
                                </div>
                              )}
                              {(selectedPlatform.avg_engagement_rate || 0) < 3 && (
                                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                  <p className="text-sm text-orange-800">
                                    💡 Room for improvement on {selectedPlatforms[0]}. Focus on content quality and posting frequency.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Breakdown Analytics */}
      {data.breakdowns && selectedPlatforms.includes('all') && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Post Type Performance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Content Performance by Type</CardTitle>
              <p className="text-sm text-muted-foreground">
                Performance breakdown by post type (image, video, carousel, etc.)
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.breakdowns.postType.length > 0 ? (
                  data.breakdowns.postType
                    .sort((a, b) => (b.avg_engagement_rate || 0) - (a.avg_engagement_rate || 0))
                    .slice(0, 5)
                    .map((postType, index) => {
                      const maxEngagement = Math.max(...data.breakdowns.postType.map(p => p.avg_engagement_rate || 0));
                      const percentage = maxEngagement > 0 ? ((postType.avg_engagement_rate || 0) / maxEngagement) * 100 : 0;
                      
                      return (
                        <div key={`${postType.post_type}-${postType.campaign_type}`} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-medium capitalize">
                                {postType.post_type} 
                                <span className="text-xs text-muted-foreground ml-1">
                                  ({postType.campaign_type})
                                </span>
                              </span>
                              {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-medium">
                                {(postType.avg_engagement_rate || 0).toFixed(2)}%
                              </span>
                              <div className="text-xs text-muted-foreground">
                                {postType.total_posts} posts
                              </div>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                index === 0 ? 'bg-green-500' : 
                                index === 1 ? 'bg-blue-500' : 
                                index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-muted-foreground text-center py-4">No post type data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Organic vs Paid Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Organic vs Paid Performance</CardTitle>
              <p className="text-sm text-muted-foreground">
                Comparison between organic and promoted content
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.breakdowns.summary?.organicVsPaidRatio && (
                  <>
                    {/* Content Distribution */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Content Distribution</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-l-full"
                            style={{ width: `${data.breakdowns.summary.organicVsPaidRatio.organic}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {data.breakdowns.summary.organicVsPaidRatio.organic}% Organic
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-500 h-3 rounded-l-full"
                            style={{ width: `${data.breakdowns.summary.organicVsPaidRatio.paid}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {data.breakdowns.summary.organicVsPaidRatio.paid}% Paid
                        </span>
                      </div>
                    </div>

                    {/* Performance Comparison */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm">Engagement Performance</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-center">
                            <p className="text-xs text-green-600 font-medium">Organic</p>
                            <p className="text-lg font-bold text-green-800">
                              {(data.breakdowns.summary.organicVsPaidRatio.organicEngagement || 0).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-center">
                            <p className="text-xs text-blue-600 font-medium">Paid</p>
                            <p className="text-lg font-bold text-blue-800">
                              {(data.breakdowns.summary.organicVsPaidRatio.paidEngagement || 0).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Performance Insights */}
                    <div className="space-y-2">
                      {data.breakdowns.summary.organicVsPaidRatio.paidEngagement > data.breakdowns.summary.organicVsPaidRatio.organicEngagement ? (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-800">
                            💰 Paid content is outperforming organic by {
                              (data.breakdowns.summary.organicVsPaidRatio.paidEngagement - 
                               data.breakdowns.summary.organicVsPaidRatio.organicEngagement).toFixed(1)
                            }% engagement rate
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-green-800">
                            🌱 Organic content is performing well with {
                              data.breakdowns.summary.organicVsPaidRatio.organicEngagement.toFixed(1)
                            }% engagement rate
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Single Platform Breakdown */}
      {data.breakdowns && !selectedPlatforms.includes('all') && (
        <Card>
          <CardHeader>
            <CardTitle className="capitalize">
              {selectedPlatforms[0]} Content Performance Breakdown
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Content type and campaign performance on {selectedPlatforms[0]}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Platform-specific post type breakdown */}
              <div className="space-y-4">
                <h4 className="font-medium">Content Types</h4>
                {data.breakdowns.postType
                  .filter(item => data.breakdowns.platform.some(p => 
                    p.platform === selectedPlatforms[0] && p.campaign_id === item.campaign_id
                  ))
                  .sort((a, b) => (b.avg_engagement_rate || 0) - (a.avg_engagement_rate || 0))
                  .slice(0, 4)
                  .map((postType, index) => (
                    <div key={`${postType.post_type}-${postType.campaign_type}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="capitalize text-sm">
                        {postType.post_type}
                        <span className="text-xs text-muted-foreground ml-1">
                          ({postType.campaign_type})
                        </span>
                      </span>
                      <span className="text-sm font-medium">
                        {(postType.avg_engagement_rate || 0).toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>

              {/* Platform-specific organic vs paid */}
              <div className="space-y-4">
                <h4 className="font-medium">Campaign Types</h4>
                {data.breakdowns.campaignType
                  .filter(item => data.breakdowns.platform.some(p => 
                    p.platform === selectedPlatforms[0] && p.campaign_id === item.campaign_id
                  ))
                  .map((campaignType) => (
                    <div key={campaignType.campaign_type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="capitalize text-sm">{campaignType.campaign_type}</span>
                      <div className="text-right">
                        <span className="text-sm font-medium">
                          {(campaignType.avg_engagement_rate || 0).toFixed(1)}%
                        </span>
                        <div className="text-xs text-muted-foreground">
                          {campaignType.total_posts} posts
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
          <p className="text-sm text-muted-foreground">
            Performance analysis and recommendations
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium">Performance Highlights</h4>
              <div className="space-y-2">
                {data.overview.avgEngagementRate >= 6 && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      🎉 Excellent engagement rate of {data.overview.avgEngagementRate.toFixed(2)}% - well above industry average!
                    </p>
                  </div>
                )}
                {data.overview.totalReach >= 100000 && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      📈 Strong reach of {formatNumber(data.overview.totalReach)} - great audience coverage
                    </p>
                  </div>
                )}
                {data.overview.newFollowers > 0 && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-800">
                      👥 Growing audience with {formatNumber(data.overview.newFollowers)} new followers
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Recommendations</h4>
              <div className="space-y-2">
                {data.overview.avgEngagementRate < 3 && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      💡 Consider improving content quality to boost engagement rates
                    </p>
                  </div>
                )}
                {data.overview.totalLinkClicks < 1000 && (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <p className="text-sm text-orange-800">
                      🔗 Add more call-to-action links to drive traffic
                    </p>
                  </div>
                )}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-800">
                    📊 Monitor performance trends regularly for optimization opportunities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}