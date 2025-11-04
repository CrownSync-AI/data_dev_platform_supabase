'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Eye, MousePointer, Heart, Clock, Hash, Target, Users, TrendingUp, ChevronDown, ChevronUp, BarChart3 } from 'lucide-react';

interface PostDiagnostics {
  timing: 'optimal' | 'good' | 'poor';
  format: 'video' | 'image' | 'carousel' | 'text';
  caption: 'strong' | 'moderate' | 'weak';
  hashtags: number;
  cta: boolean;
  audienceMatch: 'high' | 'medium' | 'low';
}

interface TopPost {
  id: string;
  platform: string;
  content: string;
  mediaUrl?: string;
  metrics: any;
  contribution: number;
  publishedAt: string;
  diagnostics: PostDiagnostics;
}

interface TopPostsSectionProps {
  posts: TopPost[];
  onPostClick?: (postId: string) => void;
  selectedPost?: string | null;
}

interface ExpandedPost {
  [postId: string]: boolean;
}

export default function TopPostsSection({ posts }: TopPostsSectionProps) {
  const [expandedPosts, setExpandedPosts] = useState<ExpandedPost>({});

  const togglePostExpansion = (postId: string) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlatformLogo = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
            alt="Facebook"
            className="w-8 h-8 object-contain"
          />
        );
      case 'instagram':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" 
            alt="Instagram"
            className="w-8 h-8 object-contain"
          />
        );
      case 'linkedin':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" 
            alt="LinkedIn"
            className="w-8 h-8 object-contain"
          />
        );
      case 'twitter':
      case 'x':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg" 
            alt="X"
            className="w-8 h-8 object-contain"
          />
        );
      case 'tiktok':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/3/34/Ionicons_logo-tiktok.svg" 
            alt="TikTok"
            className="w-8 h-8 object-contain"
          />
        );
      case 'youtube':
        return (
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png" 
            alt="YouTube"
            className="w-8 h-8 object-contain"
          />
        );
      default:
        return (
          <div className="w-8 h-8 rounded bg-gray-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">?</span>
          </div>
        );
    }
  };

  const getDiagnosticColor = (value: string, type: string) => {
    if (type === 'timing' || type === 'caption' || type === 'audienceMatch') {
      switch (value) {
        case 'optimal':
        case 'strong':
        case 'high':
          return 'bg-green-100 text-green-800 border-green-200';
        case 'good':
        case 'moderate':
        case 'medium':
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'poor':
        case 'weak':
        case 'low':
          return 'bg-red-100 text-red-800 border-red-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };



  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Top Performing Posts & Assets
        </CardTitle>
        <p className="text-gray-600">
          Highest contributing posts with expandable diagnostics and improvement recommendations
        </p>
      </CardHeader>
      <CardContent>


        <div className="space-y-4">
          <div className="grid gap-4">
              {posts.map((post, index) => (
                <Card key={post.id} className={`transition-all hover:shadow-md border ${expandedPosts[post.id] ? 'border-blue-200 shadow-sm' : 'border-gray-200'}`}>
                  <CardContent className="p-0">
                    {/* Main Post Content */}
                    <div className="p-5">
                      <div className="flex gap-4">
                        {/* Post Media */}
                        <div className="flex-shrink-0">
                          {post.mediaUrl ? (
                            <img 
                              src={post.mediaUrl} 
                              alt="Post media"
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center p-2">
                              {getPlatformLogo(post.platform)}
                            </div>
                          )}
                        </div>

                        {/* Post Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="capitalize">
                                #{index + 1}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {post.platform}
                              </Badge>
                              <Badge className="bg-green-100 text-green-800">
                                {post.contribution.toFixed(1)}% contribution
                              </Badge>
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatDate(post.publishedAt)}
                            </span>
                          </div>

                          <p className="text-sm text-gray-700 mb-4 line-clamp-2 leading-relaxed">
                            {post.content}
                          </p>

                          {/* Metrics Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="text-sm font-medium">{formatNumber(post.metrics.impressions || post.metrics.views || 0)}</p>
                                <p className="text-xs text-gray-500">Views</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <MousePointer className="h-4 w-4 text-purple-600" />
                              <div>
                                <p className="text-sm font-medium">{formatNumber(post.metrics.engagement || post.metrics.engagementCount || 0)}</p>
                                <p className="text-xs text-gray-500">Engagement</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-red-600" />
                              <div>
                                <p className="text-sm font-medium">{formatNumber(post.metrics.likes || post.metrics.likeCount || 0)}</p>
                                <p className="text-xs text-gray-500">Likes</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600" />
                              <div>
                                <p className="text-sm font-medium">{post.metrics.engagementRate?.toFixed(2) || '0.00'}%</p>
                                <p className="text-xs text-gray-500">ER</p>
                              </div>
                            </div>
                          </div>

                          {/* Quick Diagnostics and Expand Button Row */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-wrap gap-2 flex-1">
                              <Badge className={getDiagnosticColor(post.diagnostics.timing, 'timing')}>
                                <Clock className="h-3 w-3 mr-1" />
                                {post.diagnostics.timing} timing
                              </Badge>
                              <Badge className={getDiagnosticColor(post.diagnostics.format, 'format')}>
                                {post.diagnostics.format}
                              </Badge>
                              <Badge className={getDiagnosticColor(post.diagnostics.caption, 'caption')}>
                                {post.diagnostics.caption} caption
                              </Badge>
                              {post.diagnostics.cta && (
                                <Badge className="bg-blue-100 text-blue-800">
                                  <Target className="h-3 w-3 mr-1" />
                                  CTA
                                </Badge>
                              )}
                            </div>
                            
                            {/* Expand Diagnostics Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => togglePostExpansion(post.id)}
                              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 shrink-0"
                            >
                              <BarChart3 className="h-4 w-4" />
                              {expandedPosts[post.id] ? (
                                <>
                                  Hide
                                  <ChevronUp className="h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  Details
                                  <ChevronDown className="h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Diagnostics Panel */}
                    <Collapsible open={expandedPosts[post.id]}>
                      <CollapsibleContent className="border-t bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                        <div className="p-5 space-y-4">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <BarChart3 className="h-4 w-4 text-blue-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900">Post Performance Diagnostics</h4>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">Detailed analysis of content performance factors</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Content Analysis */}
                            <div className="space-y-3">
                              <h5 className="font-medium text-gray-700">Content Analysis</h5>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Content Format</span>
                                  <Badge className={getDiagnosticColor(post.diagnostics.format, 'format')}>
                                    {post.diagnostics.format}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Caption Strength</span>
                                  <Badge className={getDiagnosticColor(post.diagnostics.caption, 'caption')}>
                                    {post.diagnostics.caption}
                                  </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Hashtags Used</span>
                                  <Badge variant="outline">
                                    <Hash className="h-3 w-3 mr-1" />
                                    {post.diagnostics.hashtags}
                                  </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Call-to-Action</span>
                                  <Badge className={post.diagnostics.cta ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                    {post.diagnostics.cta ? 'Present' : 'Missing'}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Performance Analysis */}
                            <div className="space-y-3">
                              <h5 className="font-medium text-gray-700">Performance Analysis</h5>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Publishing Timing</span>
                                  <Badge className={getDiagnosticColor(post.diagnostics.timing, 'timing')}>
                                    <Clock className="h-3 w-3 mr-1" />
                                    {post.diagnostics.timing}
                                  </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Audience Match</span>
                                  <Badge className={getDiagnosticColor(post.diagnostics.audienceMatch, 'audienceMatch')}>
                                    <Users className="h-3 w-3 mr-1" />
                                    {post.diagnostics.audienceMatch}
                                  </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-600">Campaign Contribution</span>
                                  <Badge className="bg-purple-100 text-purple-800">
                                    {post.contribution.toFixed(1)}%
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Improvement Recommendations */}
                          <div className="mt-4 p-4 bg-white border border-blue-200 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-yellow-600 text-sm">💡</span>
                              </div>
                              <h5 className="font-medium text-gray-900">Optimization Recommendations</h5>
                            </div>
                            <div className="space-y-2 text-sm text-gray-700">
                              {post.diagnostics.timing === 'poor' && (
                                <div className="flex items-start gap-2">
                                  <span className="text-orange-500 mt-0.5">⏰</span>
                                  <p>Consider posting during peak engagement hours (8-10 AM or 6-8 PM)</p>
                                </div>
                              )}
                              {post.diagnostics.caption === 'weak' && (
                                <div className="flex items-start gap-2">
                                  <span className="text-purple-500 mt-0.5">✍️</span>
                                  <p>Strengthen caption with storytelling elements and emotional hooks</p>
                                </div>
                              )}
                              {!post.diagnostics.cta && (
                                <div className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-0.5">🎯</span>
                                  <p>Add a clear call-to-action to drive specific user actions</p>
                                </div>
                              )}
                              {post.diagnostics.hashtags < 3 && (
                                <div className="flex items-start gap-2">
                                  <span className="text-green-500 mt-0.5">#️⃣</span>
                                  <p>Use 3-5 relevant hashtags to improve discoverability</p>
                                </div>
                              )}
                              {post.diagnostics.audienceMatch === 'low' && (
                                <div className="flex items-start gap-2">
                                  <span className="text-red-500 mt-0.5">👥</span>
                                  <p>Review targeting to better align with core audience interests</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}