'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import PlatformSpecificOverview from './PlatformSpecificOverview'
import PlatformAnalyticsCharts from './PlatformAnalyticsCharts'
import { BarChart3, TrendingUp, PieChart, Activity, ArrowLeft } from 'lucide-react'

type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'email' | 'all'

interface EnhancedPlatformViewProps {
  selectedPlatform: Platform
  selectedRole: string
  retailerId?: string
  onBack?: () => void
}

export default function EnhancedPlatformView({
  selectedPlatform,
  selectedRole,
  retailerId,
  onBack
}: EnhancedPlatformViewProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <div className="w-5 h-5 bg-blue-600 rounded"></div>
      case 'instagram': return <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
      case 'twitter': return <div className="w-5 h-5 bg-blue-400 rounded"></div>
      case 'linkedin': return <div className="w-5 h-5 bg-blue-700 rounded"></div>
      default: return <BarChart3 className="w-5 h-5" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'facebook': return 'border-blue-500 bg-blue-50'
      case 'instagram': return 'border-pink-500 bg-pink-50'
      case 'twitter': return 'border-blue-400 bg-blue-50'
      case 'linkedin': return 'border-blue-700 bg-blue-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className={`${getPlatformColor(selectedPlatform)} border-2`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <div className="flex items-center gap-3">
                {getPlatformIcon(selectedPlatform)}
                <div>
                  <CardTitle className="text-2xl capitalize">
                    {selectedPlatform} Analytics Dashboard
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Comprehensive platform-specific metrics and visualizations
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {selectedRole} View
              </Badge>
              {retailerId && (
                <Badge variant="secondary">
                  Retailer Specific
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends & Analytics
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Detailed Breakdown
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Performance Insights
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Original Platform Specific Overview */}
        <TabsContent value="overview" className="space-y-6">
          <PlatformSpecificOverview
            selectedPlatform={selectedPlatform}
            selectedRole={selectedRole}
            retailerId={retailerId}
          />
        </TabsContent>

        {/* Trends & Analytics Tab - New Charts Component */}
        <TabsContent value="trends" className="space-y-6">
          <PlatformAnalyticsCharts
            platform={selectedPlatform}
            timeRange="30d"
          />
        </TabsContent>

        {/* Detailed Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Platform-Specific Metrics Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Platform-Specific Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedPlatform === 'facebook' && (
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Facebook Unique Metrics</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-600">Video Views:</span>
                            <div className="font-bold">12.5K</div>
                          </div>
                          <div>
                            <span className="text-blue-600">Page Likes:</span>
                            <div className="font-bold">450</div>
                          </div>
                          <div>
                            <span className="text-blue-600">Post Clicks:</span>
                            <div className="font-bold">1.2K</div>
                          </div>
                          <div>
                            <span className="text-blue-600">Reactions:</span>
                            <div className="font-bold">1.1K</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Reaction Breakdown</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>❤️ Love</span>
                            <span className="font-medium">450</span>
                          </div>
                          <div className="flex justify-between">
                            <span>😂 Haha</span>
                            <span className="font-medium">380</span>
                          </div>
                          <div className="flex justify-between">
                            <span>😮 Wow</span>
                            <span className="font-medium">220</span>
                          </div>
                          <div className="flex justify-between">
                            <span>😡 Angry</span>
                            <span className="font-medium">25</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPlatform === 'instagram' && (
                    <div className="space-y-3">
                      <div className="p-4 bg-pink-50 rounded-lg">
                        <h4 className="font-medium text-pink-800 mb-2">Instagram Unique Metrics</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-pink-600">Saves:</span>
                            <div className="font-bold">3.2K</div>
                          </div>
                          <div>
                            <span className="text-pink-600">Profile Visits:</span>
                            <div className="font-bold">8.5K</div>
                          </div>
                          <div>
                            <span className="text-pink-600">Story Exits:</span>
                            <div className="font-bold">150</div>
                          </div>
                          <div>
                            <span className="text-pink-600">Reel Plays:</span>
                            <div className="font-bold">25.8K</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Content Performance</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>📸 Photo Posts</span>
                            <span className="font-medium">65% engagement</span>
                          </div>
                          <div className="flex justify-between">
                            <span>🎥 Reels</span>
                            <span className="font-medium">85% engagement</span>
                          </div>
                          <div className="flex justify-between">
                            <span>📖 Stories</span>
                            <span className="font-medium">45% completion</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPlatform === 'twitter' && (
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">Twitter Unique Metrics</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-600">Retweets:</span>
                            <div className="font-bold">1.8K</div>
                          </div>
                          <div>
                            <span className="text-blue-600">Quote Tweets:</span>
                            <div className="font-bold">450</div>
                          </div>
                          <div>
                            <span className="text-blue-600">Bookmarks:</span>
                            <div className="font-bold">950</div>
                          </div>
                          <div>
                            <span className="text-blue-600">Profile Clicks:</span>
                            <div className="font-bold">2.1K</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Tweet Performance</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>📝 Text Tweets</span>
                            <span className="font-medium">3.2% engagement</span>
                          </div>
                          <div className="flex justify-between">
                            <span>🖼️ Image Tweets</span>
                            <span className="font-medium">4.8% engagement</span>
                          </div>
                          <div className="flex justify-between">
                            <span>🎥 Video Tweets</span>
                            <span className="font-medium">6.1% engagement</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPlatform === 'linkedin' && (
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2">LinkedIn Unique Metrics</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-600">Unique Impressions:</span>
                            <div className="font-bold">45.2K</div>
                          </div>
                          <div>
                            <span className="text-blue-600">Clicks:</span>
                            <div className="font-bold">2.8K</div>
                          </div>
                          <div>
                            <span className="text-blue-600">Followers Gained:</span>
                            <div className="font-bold">125</div>
                          </div>
                          <div>
                            <span className="text-blue-600">Video Views:</span>
                            <div className="font-bold">3.2K</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Professional Reactions</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>👏 Praise</span>
                            <span className="font-medium">450</span>
                          </div>
                          <div className="flex justify-between">
                            <span>💡 Insightful</span>
                            <span className="font-medium">380</span>
                          </div>
                          <div className="flex justify-between">
                            <span>❤️ Support</span>
                            <span className="font-medium">280</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Engagement Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">High Engagement Post</div>
                      <div className="text-xs text-gray-600">2 hours ago</div>
                      <div className="text-xs text-green-700">8.5% engagement rate - Above average</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Video Content Published</div>
                      <div className="text-xs text-gray-600">5 hours ago</div>
                      <div className="text-xs text-blue-700">1.2K views in first hour</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Engagement Spike</div>
                      <div className="text-xs text-gray-600">1 day ago</div>
                      <div className="text-xs text-yellow-700">25% increase in interactions</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Follower Milestone</div>
                      <div className="text-xs text-gray-600">2 days ago</div>
                      <div className="text-xs text-purple-700">Reached 10K followers</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Insights Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Score */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">8.7</div>
                  <div className="text-sm text-gray-600 mb-4">Out of 10</div>
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  <div className="mt-4 text-xs text-gray-500">
                    Based on engagement rate, reach, and growth metrics
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Strengths */}
            <Card>
              <CardHeader>
                <CardTitle>Key Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">High engagement rate (8.7%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Consistent posting schedule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Strong video performance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Growing follower base</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Improvement Areas */}
            <Card>
              <CardHeader>
                <CardTitle>Improvement Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Increase posting frequency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Optimize posting times</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Diversify content types</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">Improve story completion rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Actionable Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-green-800">🎯 Content Strategy</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <strong>Video Content:</strong> Your video posts perform 40% better than average. Consider increasing video content to 60% of your posts.
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <strong>Optimal Timing:</strong> Posts between 2-4 PM show highest engagement. Schedule more content during these hours.
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <strong>Hashtag Strategy:</strong> Use 5-8 relevant hashtags for maximum reach without appearing spammy.
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-blue-800">📊 Growth Tactics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <strong>Engagement Rate:</strong> Respond to comments within 2 hours to boost algorithm visibility.
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <strong>Cross-Platform:</strong> Share {selectedPlatform} content to other platforms to drive traffic.
                    </div>
                    <div className="p-3 bg-pink-50 rounded-lg">
                      <strong>User-Generated Content:</strong> Encourage followers to create content featuring your brand.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}