'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  AlertTriangle, 
  Users, 
  Download,
  RefreshCw,
  Target,
  Star,
  Heart,
  FileImage,
  Calendar,
  Clock,
  BarChart3,
  PieChart,
  ExternalLink,
  Eye,
  ArrowRight,
  Bell
} from 'lucide-react';
import { RetailerPerformanceTable } from '@/components/brand-performance/campaign-performance/RetailerPerformanceTable';
import { BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RetailerPerformanceData {
  summary: {
    topRetailersCount: number;
    needsAttentionCount: number;
    averageRoi: number;
    activeRetailers: number;
    totalRetailers: number;
    participationRate: number;
    gradeDistribution: {
      gradeA: number;
      gradeB: number;
      gradeC: number;
      gradeDF: number;
    };
    averageMetrics: {
      clickRate: number;
      openRate: number;
      deliveryRate: number;
      conversionRate: number;
    };
  };
  retailers: Array<{
    id: string;
    rank: number;
    retailerName: string;
    region: string;
    emailsSent: number;
    deliveryRate: string;
    openRate: string;
    clickRate: string;
    conversionRate: string;
    roiPercentage: number;
    performanceGrade: string;
    isTopPerformer: boolean;
    needsAttention: boolean;
    lastActiveDate: string;
    clickRateTarget: number;
    clickRateStatus: string;
    performanceLevel: string;
    activityStatus: string;
  }>;
  topPerformers: Array<{
    id: string;
    name: string;
    region: string;
    clickRate: number;
    clickRateTarget: number;
    deliveryRate: number;
    openRate: number;
    overallRank: number;
    emailsSent: number;
    performanceLevel: string;
    activityStatus: string;
    lastActiveDate: string;
  }>;
  filters: {
    regions: string[];
    grades: string[];
  };
}

export default function RetailerPerformancePage() {
  const [data, setData] = useState<RetailerPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('past_year');

  // Mock data for new insight sections
  const getStrategicInsights = () => ({
    topPerformingCampaigns: [
      {
        id: '1',
        name: 'Rolex Submariner Holiday 2025',
        brand: 'Rolex',
        roi: 142.5,
        engagementRate: 8.9,
        trend: 'up',
        trendValue: 25.3,
        retailerCount: 12
      },
      {
        id: '2', 
        name: 'Cartier Love Collection Spring',
        brand: 'Cartier',
        roi: 138.2,
        engagementRate: 7.8,
        trend: 'up',
        trendValue: 18.7,
        retailerCount: 8
      },
      {
        id: '3',
        name: 'Omega Speedmaster Heritage',
        brand: 'Omega', 
        roi: 125.6,
        engagementRate: 6.9,
        trend: 'down',
        trendValue: -5.2,
        retailerCount: 15
      }
    ],
    topWishlistProducts: [
      {
        id: '1',
        name: 'Rolex Daytona Platinum',
        brand: 'Rolex',
        wishlistCount: 2847,
        changePercent: 34.2,
        trend: 'up'
      },
      {
        id: '2',
        name: 'Cartier Santos-Dumont',
        brand: 'Cartier', 
        wishlistCount: 2156,
        changePercent: 28.9,
        trend: 'up'
      },
      {
        id: '3',
        name: 'Patek Philippe Nautilus',
        brand: 'Patek Philippe',
        wishlistCount: 1923,
        changePercent: 15.7,
        trend: 'up'
      },
      {
        id: '4',
        name: 'Omega Seamaster Planet Ocean',
        brand: 'Omega',
        wishlistCount: 1687,
        changePercent: -8.3,
        trend: 'down'
      },
      {
        id: '5',
        name: 'Breitling Navitimer B01',
        brand: 'Breitling',
        wishlistCount: 1542,
        changePercent: 22.1,
        trend: 'up'
      }
    ],
    newBrandAssets: [
      {
        id: '1',
        name: 'Rolex 2025 Holiday Social Kit',
        category: 'Social Media Kit',
        uploadDate: '2025-01-12',
        isNew: true,
        fileType: 'ZIP',
        size: '45.2 MB'
      },
      {
        id: '2',
        name: 'Cartier Love Collection Product Images',
        category: 'Product Images',
        uploadDate: '2025-01-10',
        isNew: true,
        fileType: 'ZIP',
        size: '128.7 MB'
      },
      {
        id: '3',
        name: 'Omega Brand Guidelines 2025',
        category: 'Brand Guidelines',
        uploadDate: '2025-01-08',
        isNew: true,
        fileType: 'PDF',
        size: '12.3 MB'
      },
      {
        id: '4',
        name: 'Patek Philippe Email Templates',
        category: 'Email Templates',
        uploadDate: '2025-01-05',
        isNew: false,
        fileType: 'HTML',
        size: '8.9 MB'
      }
    ],
    expiringCampaigns: [
      {
        id: '1',
        name: 'Winter Luxury Collection',
        retailer: 'Cartier Rodeo Drive',
        brand: 'Cartier',
        endDate: '2025-02-15',
        remainingDays: 16,
        status: 'expiring_soon',
        performance: 'high'
      },
      {
        id: '2',
        name: 'New Year Timepiece Showcase',
        retailer: 'Westime LA',
        brand: 'Rolex',
        endDate: '2025-02-08',
        remainingDays: 9,
        status: 'expiring_soon',
        performance: 'good'
      },
      {
        id: '3',
        name: 'Heritage Collection Launch',
        retailer: 'Betteridge NY',
        brand: 'Omega',
        endDate: '2025-02-28',
        remainingDays: 29,
        status: 'active',
        performance: 'standard'
      }
    ],
    regionalPerformance: [
      { region: 'West Coast', roi: 128.4, color: '#3B82F6' },
      { region: 'East Coast', roi: 115.7, color: '#10B981' },
      { region: 'Central', roi: 98.3, color: '#F59E0B' }
    ],
    channelDistribution: [
      { channel: 'Social Media', value: 65, color: '#8B5CF6' },
      { channel: 'Email', value: 28, color: '#06B6D4' },
      { channel: 'Other', value: 7, color: '#84CC16' }
    ],
    recommendations: [
      {
        type: 'expiring',
        message: '3 campaigns are expiring within 30 days',
        priority: 'high',
        action: 'Review and extend high-performing campaigns'
      },
      {
        type: 'assets',
        message: '4 new brand assets available for download',
        priority: 'medium',
        action: 'Distribute to relevant retailers'
      },
      {
        type: 'performance',
        message: 'Top performing campaign: Rolex Submariner Holiday 2025 (+25.3% ROI)',
        priority: 'info',
        action: 'Analyze success factors for replication'
      }
    ]
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        timeframe
      });
      
      const response = await fetch(`/api/retailer-performance?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch retailer performance data');
      }
      
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchData}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  const insights = getStrategicInsights();

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const getDaysUntilExpiry = (endDate: string): number => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const isNewAsset = (uploadDate: string): boolean => {
    const today = new Date();
    const upload = new Date(uploadDate);
    const diffTime = today.getTime() - upload.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 14;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Retailer Performance</h1>
          <p className="text-gray-600">Strategic insights and comprehensive retailer performance management</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="past_year">Past 1 year</SelectItem>
              <SelectItem value="past_6_months">Past 6 months</SelectItem>
              <SelectItem value="past_3_months">Past 3 months</SelectItem>
              <SelectItem value="past_month">Past month</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                rec.priority === 'high' ? 'bg-red-50 border-l-red-500' :
                rec.priority === 'medium' ? 'bg-yellow-50 border-l-yellow-500' :
                'bg-blue-50 border-l-blue-500'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{rec.message}</p>
                    <p className="text-sm text-gray-600">{rec.action}</p>
                  </div>
                  <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                    {rec.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Top Performing Campaigns */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Top Performing Campaigns
            </CardTitle>
            <p className="text-sm text-muted-foreground">Highest ROI campaigns this period</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.topPerformingCampaigns.map((campaign, index) => (
                <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                      <span className="font-medium text-sm">{campaign.name}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{campaign.brand} • {campaign.retailerCount} retailers</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-semibold text-green-600">{campaign.roi}% ROI</span>
                      <div className="flex items-center gap-1">
                        {campaign.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={`text-xs ${campaign.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {campaign.trend === 'up' ? '+' : ''}{campaign.trendValue}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Wishlist Products */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Top Wishlist Products
            </CardTitle>
            <p className="text-sm text-muted-foreground">Most desired products by customers</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.topWishlistProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">#{index + 1}</Badge>
                      <span className="font-medium text-sm">{product.name}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{product.brand}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-semibold">{formatNumber(product.wishlistCount)} wishes</span>
                      <div className="flex items-center gap-1">
                        {product.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={`text-xs ${product.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {product.trend === 'up' ? '+' : ''}{product.changePercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Regional & Channel Performance */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Regional & Channel Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground">Top regions and channel distribution</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Regional Performance */}
              <div>
                <h4 className="text-sm font-medium mb-3">Top Regions by ROI</h4>
                <div className="space-y-2">
                  {insights.regionalPerformance.map((region, index) => (
                    <div key={region.region} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: region.color }}></div>
                        <span className="text-sm">{region.region}</span>
                      </div>
                      <span className="text-sm font-semibold">{region.roi}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Channel Distribution */}
              <div>
                <h4 className="text-sm font-medium mb-3">Channel Distribution</h4>
                <div className="space-y-2">
                  {insights.channelDistribution.map((channel) => (
                    <div key={channel.channel} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: channel.color }}></div>
                        <span className="text-sm">{channel.channel}</span>
                      </div>
                      <span className="text-sm font-semibold">{channel.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Brand Assets & Expiring Campaigns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Brand Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5 text-purple-500" />
              New Brand Assets Available
            </CardTitle>
            <p className="text-sm text-muted-foreground">Recently uploaded assets for retailer use</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.newBrandAssets.map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{asset.name}</span>
                      {isNewAsset(asset.uploadDate) && (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">New</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{asset.category} • {asset.fileType} • {asset.size}</p>
                    <p className="text-xs text-gray-500 mt-1">Uploaded {new Date(asset.uploadDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expiring Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Campaigns Expiring Soon
            </CardTitle>
            <p className="text-sm text-muted-foreground">Active campaigns ending within 30 days</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.expiringCampaigns.map((campaign) => {
                const remainingDays = getDaysUntilExpiry(campaign.endDate);
                return (
                  <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{campaign.name}</span>
                        <Badge variant={remainingDays <= 14 ? 'destructive' : 'default'} className="text-xs">
                          {remainingDays <= 14 ? 'Expiring Soon' : 'Active'}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{campaign.retailer} • {campaign.brand}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Ends {new Date(campaign.endDate).toLocaleDateString()}
                        </span>
                        <span className={`text-xs font-medium ${remainingDays <= 7 ? 'text-red-600' : remainingDays <= 14 ? 'text-orange-600' : 'text-gray-600'}`}>
                          {remainingDays} days left
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top Retailers</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{data.summary.topRetailersCount}</p>
                </div>
                <p className="text-xs text-gray-500">ROI &gt; 120%</p>
                <p className="text-xs text-green-600">Excellent Performance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Needs Attention</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{data.summary.needsAttentionCount}</p>
                </div>
                <p className="text-xs text-gray-500">ROI &lt; 80%</p>
                <p className="text-xs text-orange-600">Improvement Required</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average ROI</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{data.summary.averageRoi}%</p>
                </div>
                <p className="text-xs text-gray-500">vs 45.2% last month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Retailers</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold">{data.summary.activeRetailers}/{data.summary.totalRetailers}</p>
                </div>
                <p className="text-xs text-gray-500">{data.summary.participationRate}% participation rate</p>
                <p className="text-xs text-purple-600">High Engagement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Retailer Performance Table with Campaign Separation */}
      <RetailerPerformanceTable 
        role="brand"
        retailers={data?.retailers || []}
        selectedPlatforms={['all']}
      />
    </div>
  );
}