'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Eye, Heart, MousePointer } from 'lucide-react';

import type { SocialAnalyticsFilters, TopPerformingContent } from '@/lib/types/social-media';

interface TopContentTableProps {
  filters: SocialAnalyticsFilters;
}

type SortField = keyof TopPerformingContent;
type SortDirection = 'asc' | 'desc';

export function TopContentTable({ filters }: TopContentTableProps) {
  const [data, setData] = useState<TopPerformingContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('engagement_rate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    fetchContentData();
  }, [filters]);

  const fetchContentData = async () => {
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

      const response = await fetch(`/api/social-analytics/content?${params}`);
      if (!response.ok) throw new Error('Failed to fetch content data');
      
      const result = await response.json();
      
      // Handle the API response structure
      if (result.success && result.data) {
        setData(Array.isArray(result.data) ? result.data : []);
      } else {
        console.warn('Content API returned unexpected format:', result);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching content data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'engagement_rate' || field === 'total_engagement' ? 'desc' : 'asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getPlatformBadge = (platform: string) => {
    const colors = {
      linkedin: 'bg-blue-100 text-blue-800',
      instagram: 'bg-pink-100 text-pink-800',
      facebook: 'bg-blue-100 text-blue-800',
      google_business: 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge className={colors[platform as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {platform.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPostTypeBadge = (postType?: string) => {
    if (!postType) return null;
    
    const colors = {
      image: 'bg-purple-100 text-purple-800',
      video: 'bg-red-100 text-red-800',
      carousel: 'bg-orange-100 text-orange-800',
      story: 'bg-yellow-100 text-yellow-800',
      reel: 'bg-pink-100 text-pink-800',
      text: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge variant="outline" className={colors[postType as keyof typeof colors]}>
        {postType.toUpperCase()}
      </Badge>
    );
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(2)}%`;
  };

  const truncateContent = (content?: string, maxLength: number = 60): string => {
    if (!content) return 'No content preview';
    return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;
  };

  // Filter and sort data
  const filteredData = data
    .filter(item => 
      (item.content?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (item.retailer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      item.platform.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Top Performing Content</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead className="min-w-[300px]">Content</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Retailer</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('impressions')}>
                    <Eye className="h-4 w-4 mr-1" />
                    Impressions {getSortIcon('impressions')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('reach')}>
                    Reach {getSortIcon('reach')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('total_engagement')}>
                    <Heart className="h-4 w-4 mr-1" />
                    Engagement {getSortIcon('total_engagement')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('engagement_rate')}>
                    Rate {getSortIcon('engagement_rate')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('link_clicks')}>
                    <MousePointer className="h-4 w-4 mr-1" />
                    Clicks {getSortIcon('link_clicks')}
                  </Button>
                </TableHead>
                <TableHead>Published</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    Loading content data...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8">
                    No content found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((content, index) => (
                  <TableRow key={content.post_id}>
                    <TableCell className="text-center font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="space-y-1">
                        <p className="text-sm">{truncateContent(content.content)}</p>
                        {content.hashtags && content.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {content.hashtags.slice(0, 3).map((hashtag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                #{hashtag}
                              </Badge>
                            ))}
                            {content.hashtags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{content.hashtags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPlatformBadge(content.platform)}
                    </TableCell>
                    <TableCell>
                      {getPostTypeBadge(content.post_type)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {content.retailer_name || content.account_name}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(content.impressions)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(content.reach)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(content.total_engagement)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPercentage(content.engagement_rate)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(content.link_clicks)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {content.published_at 
                        ? new Date(content.published_at).toLocaleDateString()
                        : 'N/A'
                      }
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}