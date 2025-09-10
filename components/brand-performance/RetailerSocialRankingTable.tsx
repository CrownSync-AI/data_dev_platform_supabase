'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Trophy, Medal, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SocialAnalyticsFilters, RetailerSocialData } from '@/lib/types/social-media';

interface RetailerSocialRankingTableProps {
  filters: SocialAnalyticsFilters;
}

type SortField = keyof RetailerSocialData;
type SortDirection = 'asc' | 'desc';

export function RetailerSocialRankingTable({ filters }: RetailerSocialRankingTableProps) {
  const [data, setData] = useState<RetailerSocialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    fetchRetailerData();
  }, [filters]);

  const fetchRetailerData = async () => {
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

      const response = await fetch(`/api/social-analytics/performance?${params}`);
      if (!response.ok) throw new Error('Failed to fetch retailer data');
      
      const result = await response.json();
      
      // Handle the API response structure
      if (result.success && result.data) {
        setData(Array.isArray(result.data) ? result.data : []);
      } else {
        console.warn('Performance API returned unexpected format:', result);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching retailer data:', error);
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
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return <span className="text-sm font-medium">{rank}</span>;
    }
  };

  const getGradeBadge = (grade: 'A' | 'B' | 'C') => {
    const variants = {
      A: 'bg-green-100 text-green-800',
      B: 'bg-yellow-100 text-yellow-800',
      C: 'bg-red-100 text-red-800'
    };
    return (
      <Badge className={variants[grade]}>
        {grade}
      </Badge>
    );
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <span className="text-gray-400">—</span>;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(2)}%`;
  };

  // Filter and sort data
  const filteredData = data
    .filter(item => 
      item.retailer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.region.toLowerCase().includes(searchTerm.toLowerCase())
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
          <CardTitle>Retailer Social Media Rankings</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search retailers..."
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
                <TableHead className="w-16">
                  <Button variant="ghost" onClick={() => handleSort('rank')}>
                    Rank {getSortIcon('rank')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('retailer_name')}>
                    Retailer {getSortIcon('retailer_name')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('region')}>
                    Region {getSortIcon('region')}
                  </Button>
                </TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('total_followers')}>
                    Followers {getSortIcon('total_followers')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('avg_engagement_rate')}>
                    Engagement Rate {getSortIcon('avg_engagement_rate')}
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" onClick={() => handleSort('content_frequency')}>
                    Posts/Week {getSortIcon('content_frequency')}
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button variant="ghost" onClick={() => handleSort('performance_grade')}>
                    Grade {getSortIcon('performance_grade')}
                  </Button>
                </TableHead>
                <TableHead className="text-center">Trend</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('last_activity')}>
                    Last Activity {getSortIcon('last_activity')}
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    Loading retailer data...
                  </TableCell>
                </TableRow>
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8">
                    No retailers found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((retailer) => (
                  <TableRow key={retailer.retailer_id}>
                    <TableCell className="text-center">
                      {getRankIcon(retailer.rank)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {retailer.retailer_name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{retailer.region}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {retailer.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatNumber(retailer.total_followers)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatPercentage(retailer.avg_engagement_rate)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {retailer.content_frequency}
                    </TableCell>
                    <TableCell className="text-center">
                      {getGradeBadge(retailer.performance_grade)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getTrendIcon(retailer.growth_trend)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(retailer.last_activity).toLocaleDateString()}
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