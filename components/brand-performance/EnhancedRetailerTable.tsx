'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, ArrowUp, ArrowDown, Share2, Mail, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedRetailerData {
  id: string;
  rank: number;
  retailerName: string;
  region: string;
  
  // Email Performance
  emailsSent: number;
  deliveryRate: string;
  openRate: string;
  clickRate: string;
  conversionRate: string;
  roiPercentage: number;
  
  // Social Media Performance
  socialFollowers: number;
  socialEngagementRate: number;
  socialReach: number;
  socialPosts: number;
  socialGrowthRate: number;
  
  // Combined Performance
  performanceGrade: string;
  overallScore: number;
  isTopPerformer: boolean;
  needsAttention: boolean;
  lastActiveDate: string;
}

interface EnhancedRetailerTableProps {
  showSocialData?: boolean;
}

export function EnhancedRetailerTable({ showSocialData = true }: EnhancedRetailerTableProps) {
  const [data, setData] = useState<EnhancedRetailerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof EnhancedRetailerData>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [activeTab, setActiveTab] = useState('combined');

  useEffect(() => {
    fetchEnhancedRetailerData();
  }, []);

  const fetchEnhancedRetailerData = async () => {
    try {
      setLoading(true);
      
      // Fetch both email and social data
      const [emailResponse, socialResponse] = await Promise.all([
        fetch('/api/retailer-performance'),
        fetch('/api/social-analytics/performance')
      ]);

      const emailData = await emailResponse.json();
      const socialData = await socialResponse.json();

      // Combine the data
      const combinedData = emailData.retailers?.map((retailer: any) => {
        const socialMetrics = socialData.retailers?.find((s: any) => 
          s.retailer_name === retailer.retailerName
        );

        return {
          ...retailer,
          socialFollowers: socialMetrics?.total_followers || 0,
          socialEngagementRate: socialMetrics?.avg_engagement_rate || 0,
          socialReach: socialMetrics?.total_reach || 0,
          socialPosts: socialMetrics?.content_frequency || 0,
          socialGrowthRate: socialMetrics?.growth_trend || 0,
          overallScore: calculateOverallScore(retailer, socialMetrics)
        };
      }) || [];

      setData(combinedData);
    } catch (error) {
      console.error('Error fetching enhanced retailer data:', error);
      setData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallScore = (emailData: any, socialData: any): number => {
    const emailScore = (
      parseFloat(emailData.clickRate) * 0.3 +
      parseFloat(emailData.openRate) * 0.2 +
      parseFloat(emailData.deliveryRate) * 0.1 +
      parseFloat(emailData.conversionRate) * 0.4
    );
    
    const socialScore = socialData ? (
      (socialData.avg_engagement_rate || 0) * 0.4 +
      (socialData.growth_trend || 0) * 0.3 +
      (socialData.content_frequency || 0) * 0.3
    ) : 0;

    return showSocialData ? (emailScore * 0.6 + socialScore * 0.4) : emailScore;
  };

  const generateMockData = (): EnhancedRetailerData[] => [
    {
      id: '1',
      rank: 1,
      retailerName: 'Luxury Jewelers NYC',
      region: 'East',
      emailsSent: 15420,
      deliveryRate: '98.5%',
      openRate: '24.8%',
      clickRate: '8.9%',
      conversionRate: '3.2%',
      roiPercentage: 245,
      socialFollowers: 28500,
      socialEngagementRate: 5.8,
      socialReach: 89500,
      socialPosts: 12,
      socialGrowthRate: 12.5,
      performanceGrade: 'A+',
      overallScore: 87.5,
      isTopPerformer: true,
      needsAttention: false,
      lastActiveDate: '2025-01-09'
    },
    {
      id: '2',
      rank: 2,
      retailerName: 'Elite Diamonds West',
      region: 'West',
      emailsSent: 12890,
      deliveryRate: '97.2%',
      openRate: '22.1%',
      clickRate: '7.8%',
      conversionRate: '2.9%',
      roiPercentage: 198,
      socialFollowers: 18750,
      socialEngagementRate: 4.2,
      socialReach: 45600,
      socialPosts: 8,
      socialGrowthRate: 8.5,
      performanceGrade: 'A',
      overallScore: 82.3,
      isTopPerformer: true,
      needsAttention: false,
      lastActiveDate: '2025-01-08'
    }
  ];

  const handleSort = (field: keyof EnhancedRetailerData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof EnhancedRetailerData) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getGradeBadge = (grade: string) => {
    const variants: Record<string, string> = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'B': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-red-100 text-red-800'
    };
    return (
      <Badge className={variants[grade] || 'bg-gray-100 text-gray-800'}>
        {grade}
      </Badge>
    );
  };

  const sortedData = [...data].sort((a, b) => {
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
        <CardTitle className="flex items-center gap-2">
          Enhanced Retailer Performance
          {showSocialData && <Share2 className="h-4 w-4 text-muted-foreground" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="combined">Combined Performance</TabsTrigger>
            <TabsTrigger value="email">Email Only</TabsTrigger>
            {showSocialData && <TabsTrigger value="social">Social Only</TabsTrigger>}
          </TabsList>

          <TabsContent value="combined" className="space-y-4">
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
                      <Button variant="ghost" onClick={() => handleSort('retailerName')}>
                        Retailer {getSortIcon('retailerName')}
                      </Button>
                    </TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">
                      <Button variant="ghost" onClick={() => handleSort('overallScore')}>
                        Overall Score {getSortIcon('overallScore')}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email Performance
                    </TableHead>
                    {showSocialData && (
                      <TableHead className="text-right">
                        <Share2 className="h-4 w-4 inline mr-1" />
                        Social Performance
                      </TableHead>
                    )}
                    <TableHead className="text-center">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        Loading enhanced retailer data...
                      </TableCell>
                    </TableRow>
                  ) : sortedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No retailer data available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedData.map((retailer) => (
                      <TableRow key={retailer.id}>
                        <TableCell className="text-center font-medium">
                          {retailer.rank}
                        </TableCell>
                        <TableCell className="font-medium">
                          {retailer.retailerName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{retailer.region}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {retailer.overallScore.toFixed(1)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="space-y-1 text-xs">
                            <div>Click: {retailer.clickRate}</div>
                            <div>Open: {retailer.openRate}</div>
                            <div>Conv: {retailer.conversionRate}</div>
                          </div>
                        </TableCell>
                        {showSocialData && (
                          <TableCell className="text-right">
                            <div className="space-y-1 text-xs">
                              <div>Followers: {formatNumber(retailer.socialFollowers)}</div>
                              <div>Engagement: {retailer.socialEngagementRate.toFixed(1)}%</div>
                              <div>Growth: {retailer.socialGrowthRate > 0 ? '+' : ''}{retailer.socialGrowthRate.toFixed(1)}%</div>
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="text-center">
                          {getGradeBadge(retailer.performanceGrade)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="email">
            <div className="text-center py-8 text-muted-foreground">
              Email-only performance view (existing retailer performance table)
            </div>
          </TabsContent>

          {showSocialData && (
            <TabsContent value="social">
              <div className="text-center py-8 text-muted-foreground">
                Social-only performance view (social analytics table)
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}