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
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Download,
  RefreshCw,
  Search,
  Star,
  Target,
  Activity
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [timeframe, setTimeframe] = useState('past_year');

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        timeframe,
        region: selectedRegion,
        grade: selectedGrade
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
  }, [timeframe, selectedRegion, selectedGrade]);

  const filteredRetailers = data?.retailers.filter(retailer =>
    retailer.retailerName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getPerformanceColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

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

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Retailer Performance</h1>
          <p className="text-gray-600">Comprehensive retailer performance management and analytics dashboard</p>
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

      {/* Retailer Performance Data Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Retailer Performance Data Table</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Table
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Quantified metrics for each retailer - {filteredRetailers.length} retailers shown
          </p>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search retailers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {data.filters.regions.slice(1).map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Grades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Grades</SelectItem>
                {data.filters.grades.slice(1).map(grade => (
                  <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Retailer Name</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Emails Sent</TableHead>
                  <TableHead>Delivery Rate</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>Click Rate</TableHead>
                  <TableHead>Conversion Rate</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRetailers.map((retailer) => (
                  <TableRow key={retailer.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {retailer.isTopPerformer && <Star className="h-4 w-4 text-yellow-500" />}
                        {getRankIcon(retailer.rank)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{retailer.retailerName}</div>
                        <div className="text-sm text-gray-500">
                          Last active: {new Date(retailer.lastActiveDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{retailer.region}</Badge>
                    </TableCell>
                    <TableCell>{retailer.emailsSent.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, parseFloat(retailer.deliveryRate.replace('%', '')))}%` }}
                          ></div>
                        </div>
                        {retailer.deliveryRate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, parseFloat(retailer.openRate.replace('%', '')))}%` }}
                          ></div>
                        </div>
                        {retailer.openRate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, parseFloat(retailer.clickRate.replace('%', '')) * 10)}%` }}
                          ></div>
                        </div>
                        {retailer.clickRate}
                      </div>
                    </TableCell>
                    <TableCell>{retailer.conversionRate}</TableCell>
                    <TableCell>
                      <Badge className={getPerformanceColor(retailer.performanceGrade)}>
                        {retailer.performanceGrade}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredRetailers.length} of {data.retailers.length} retailers
            </p>
            <Button variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              All Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}