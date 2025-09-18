'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
 
  Users, 
  Eye, 
  MousePointer,
  MapPin,
  Trophy,
  Target
} from 'lucide-react';

type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'email' | 'all';

interface RetailerPerformanceTableProps {
  retailers: any[];
  role: 'brand' | 'retailer';
  selectedPlatforms: Platform[];
}

export function RetailerPerformanceTable({ 
  retailers, 
  role, 
  selectedPlatforms 
}: RetailerPerformanceTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('engagement');
  const [filterRegion, setFilterRegion] = useState('all');

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getPerformanceTier = (engagementRate: number) => {
    if (engagementRate >= 6) return { label: 'High', color: 'bg-green-100 text-green-800', icon: '🔥' };
    if (engagementRate >= 3) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800', icon: '👍' };
    return { label: 'Standard', color: 'bg-gray-100 text-gray-800', icon: '📊' };
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { color: 'bg-yellow-500 text-white', icon: '🥇' };
    if (rank === 2) return { color: 'bg-gray-400 text-white', icon: '🥈' };
    if (rank === 3) return { color: 'bg-orange-500 text-white', icon: '🥉' };
    return { color: 'bg-gray-300 text-gray-600', icon: rank.toString() };
  };

  // Filter and sort retailers
  const filteredRetailers = retailers
    .filter(retailer => {
      const matchesSearch = retailer.retailer_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRegion = filterRegion === 'all' || retailer.region === filterRegion;
      return matchesSearch && matchesRegion;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'engagement':
          return (b.avg_engagement_rate || 0) - (a.avg_engagement_rate || 0);
        case 'reach':
          return (b.total_reach || 0) - (a.total_reach || 0);
        case 'followers':
          return (b.current_followers || 0) - (a.current_followers || 0);
        case 'name':
          return (a.retailer_name || '').localeCompare(b.retailer_name || '');
        default:
          return 0;
      }
    });

  // Get unique regions for filter
  const regions = [...new Set(retailers.map(r => r.region).filter(Boolean))];

  if (!retailers || retailers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              {role === 'retailer' 
                ? 'No performance data available for your account'
                : 'No retailer performance data available'
              }
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Summary for Retailer View */}
      {role === 'retailer' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              My Performance Summary
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your performance across all campaigns and platforms
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {filteredRetailers.slice(0, 1).map((retailer) => {
                const tier = getPerformanceTier(retailer.avg_engagement_rate || 0);
                return (
                  <div key="my-performance" className="col-span-full">
                    <div className="grid gap-4 md:grid-cols-4">
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">My Reach</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">
                          {formatNumber(retailer.total_reach || 0)}
                        </p>
                        <p className="text-sm text-blue-700">Total audience reached</p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2 mb-2">
                          <MousePointer className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800">My Engagement</span>
                        </div>
                        <p className="text-2xl font-bold text-green-900">
                          {(retailer.avg_engagement_rate || 0).toFixed(2)}%
                        </p>
                        <Badge className={tier.color} variant="secondary">
                          {tier.label} Performance
                        </Badge>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-purple-800">My Followers</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-900">
                          {formatNumber(retailer.current_followers || 0)}
                        </p>
                        <p className="text-sm text-purple-700">
                          +{formatNumber(retailer.new_followers || 0)} new
                        </p>
                      </div>

                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="h-4 w-4 text-orange-600" />
                          <span className="font-medium text-orange-800">My Ranking</span>
                        </div>
                        <p className="text-2xl font-bold text-orange-900">
                          #{retailer.engagement_rank || 'N/A'}
                        </p>
                        <p className="text-sm text-orange-700">Engagement ranking</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      {role === 'brand' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search retailers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engagement">Engagement Rate</SelectItem>
                  <SelectItem value="reach">Total Reach</SelectItem>
                  <SelectItem value="followers">Followers</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRegion} onValueChange={setFilterRegion}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Badge variant="outline" className="text-xs">
                {filteredRetailers.length} retailer{filteredRetailers.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Retailer Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {role === 'brand' ? 'Retailer Performance Rankings' : 'Platform Performance Breakdown'}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {role === 'brand' 
              ? `Performance metrics across ${selectedPlatforms.includes('all') ? 'all platforms' : selectedPlatforms.join(', ')}`
              : 'Your performance breakdown by platform'
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {role === 'brand' && (
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Rank</th>
                  )}
                  <th className="text-left py-3 px-4 font-medium text-gray-600">
                    {role === 'brand' ? 'Retailer' : 'Platform'}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Region</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Reach</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Engagement</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Rate</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Followers</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Posts</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Performance</th>
                </tr>
              </thead>
              <tbody>
                {filteredRetailers.map((retailer, index) => {
                  const tier = getPerformanceTier(retailer.avg_engagement_rate || 0);
                  const rank = getRankBadge(index + 1);
                  
                  return (
                    <tr key={retailer.retailer_id} className="border-b hover:bg-gray-50">
                      {role === 'brand' && (
                        <td className="py-4 px-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${rank.color}`}>
                            {index < 3 ? rank.icon : index + 1}
                          </div>
                        </td>
                      )}
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium">{retailer.retailer_name}</div>
                          {role === 'retailer' && (
                            <div className="text-sm text-gray-500 capitalize">
                              {retailer.platform || 'All Platforms'}
                            </div>
                          )}
                          {retailer.campaign_name && (
                            <div className="text-xs text-gray-400">
                              {retailer.campaign_name}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{retailer.region}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {formatNumber(retailer.total_reach || 0)}
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {formatNumber(retailer.total_engagement || 0)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`font-medium ${
                            (retailer.avg_engagement_rate || 0) >= 6 ? 'text-green-600' : 
                            (retailer.avg_engagement_rate || 0) >= 3 ? 'text-yellow-600' : 'text-gray-600'
                          }`}>
                            {(retailer.avg_engagement_rate || 0).toFixed(2)}%
                          </span>
                          {(retailer.avg_engagement_rate || 0) >= 6 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (retailer.avg_engagement_rate || 0) < 3 ? (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          ) : null}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div>
                          <div className="font-medium">
                            {formatNumber(retailer.current_followers || 0)}
                          </div>
                          {retailer.new_followers > 0 && (
                            <div className="text-xs text-green-600">
                              +{formatNumber(retailer.new_followers)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right font-medium">
                        {retailer.posts_count || 0}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Badge className={tier.color} variant="secondary">
                          {tier.icon} {tier.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredRetailers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No retailers match your current filters</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterRegion('all');
                }}
                className="mt-2"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      {role === 'brand' && filteredRetailers.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Regional Performance</CardTitle>
              <p className="text-sm text-muted-foreground">Performance by region</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {regions.map(region => {
                  const regionRetailers = filteredRetailers.filter(r => r.region === region);
                  const avgEngagement = regionRetailers.length > 0 
                    ? regionRetailers.reduce((sum, r) => sum + (r.avg_engagement_rate || 0), 0) / regionRetailers.length
                    : 0;
                  
                  return (
                    <div key={region} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{region}</span>
                        <Badge variant="outline" className="text-xs">
                          {regionRetailers.length} retailers
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{avgEngagement.toFixed(2)}%</div>
                        <div className="text-xs text-gray-500">avg engagement</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Distribution</CardTitle>
              <p className="text-sm text-muted-foreground">Retailer performance tiers</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'High Performers', min: 6, color: 'bg-green-100 text-green-800', icon: '🔥' },
                  { label: 'Good Performers', min: 3, max: 6, color: 'bg-yellow-100 text-yellow-800', icon: '👍' },
                  { label: 'Standard Performers', max: 3, color: 'bg-gray-100 text-gray-800', icon: '📊' }
                ].map(tier => {
                  const count = filteredRetailers.filter(r => {
                    const rate = r.avg_engagement_rate || 0;
                    if (tier.min && tier.max) return rate >= tier.min && rate < tier.max;
                    if (tier.min) return rate >= tier.min;
                    if (tier.max) return rate < tier.max;
                    return false;
                  }).length;
                  
                  const percentage = filteredRetailers.length > 0 
                    ? (count / filteredRetailers.length) * 100 
                    : 0;
                  
                  return (
                    <div key={tier.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{tier.icon}</span>
                        <span className="font-medium">{tier.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{count} retailers</div>
                        <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}