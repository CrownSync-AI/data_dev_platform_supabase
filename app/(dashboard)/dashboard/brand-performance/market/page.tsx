'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Globe, TrendingUp, TrendingDown, Users, Target, MapPin, Download } from 'lucide-react'
import { TimeRangeSelector } from '@/components/brand-performance/TimeRangeSelector'

interface TimeRange {
  label: string
  value: string
  startDate: Date
  endDate: Date
}

// Regional performance data based on existing retailer data
const regionalPerformanceData = [
  {
    region: 'East',
    retailers: 8,
    avgClickRate: 3.24,
    avgROI: 112.5,
    totalEmails: 9200,
    topPerformer: 'Betteridge NY',
    marketShare: 35,
    growth: 8.2
  },
  {
    region: 'Central', 
    retailers: 5,
    avgClickRate: 2.41,
    avgROI: 87.4,
    totalEmails: 4200,
    topPerformer: 'Shreve & Co',
    marketShare: 18,
    growth: -2.1
  },
  {
    region: 'West',
    retailers: 12,
    avgClickRate: 4.12,
    avgROI: 128.7,
    totalEmails: 12800,
    topPerformer: 'Cartier Rodeo Drive',
    marketShare: 47,
    growth: 12.5
  }
]



// Regional radar data for comparison
const radarData = [
  { metric: 'Engagement', East: 65, Central: 45, West: 85 },
  { metric: 'Conversion', East: 70, Central: 50, West: 90 },
  { metric: 'Retention', East: 75, Central: 60, West: 80 },
  { metric: 'Growth', East: 68, Central: 35, West: 95 },
  { metric: 'Efficiency', East: 72, Central: 55, West: 88 },
  { metric: 'Innovation', East: 60, Central: 40, West: 85 }
]

interface MarketIntelligenceProps {}

export default function MarketIntelligencePage({}: MarketIntelligenceProps) {
  // radarData is used for future radar chart implementation
  console.log('Radar data available:', radarData.length)
  
  const [timeRange, setTimeRange] = useState<TimeRange>({
    label: 'Past 1 year',
    value: '1y',
    startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  })
  const [selectedMetric, _setSelectedMetric] = useState('roi')
  const [marketData, _setMarketData] = useState(regionalPerformanceData)
  
  // Variables used for UI state management
  console.log('Current metric:', selectedMetric)
  console.log('Market data loaded:', marketData.length)

  useEffect(() => {
    // Simulate API call to get market data with time filtering
    _setMarketData(regionalPerformanceData)
  }, [timeRange])

  const getRegionBadgeColor = (region: string) => {
    const colors = {
      'East': 'bg-blue-100 text-blue-800 border-blue-300',
      'Central': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'West': 'bg-green-100 text-green-800 border-green-300'
    }
    return colors[region as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const totalRetailers = marketData.reduce((sum, region) => sum + region.retailers, 0)
  const weightedAvgROI = marketData.reduce((sum, region) => sum + (region.avgROI * region.retailers), 0) / totalRetailers
  const totalEmails = marketData.reduce((sum, region) => sum + region.totalEmails, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Intelligence</h1>
          <p className="text-muted-foreground">
            Regional market analysis, trends forecasting, and strategic insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TimeRangeSelector 
            options={[
              { label: 'Past 7 days', value: '7d' },
              { label: 'Past 30 days', value: '30d' },
              { label: 'Past 90 days', value: '90d' },
              { label: 'Past 1 year', value: '1y' }
            ]}
            onRangeChange={(value) => {
              const ranges = {
                '7d': { label: 'Past 7 days', value: '7d', startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), endDate: new Date() },
                '30d': { label: 'Past 30 days', value: '30d', startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), endDate: new Date() },
                '90d': { label: 'Past 90 days', value: '90d', startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), endDate: new Date() },
                '1y': { label: 'Past 1 year', value: '1y', startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), endDate: new Date() }
              }
              setTimeRange(ranges[value as keyof typeof ranges])
            }}
          />
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Markets</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              East, Central, West regions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Market ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weightedAvgROI.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              +6.2% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leading Region</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">West</div>
            <p className="text-xs text-muted-foreground">
              47% market share
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalEmails / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">
              emails across all regions
            </p>
          </CardContent>
        </Card>
      </div>



      {/* Regional Market Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Market Analysis</CardTitle>
          <CardDescription>
            Detailed performance breakdown and strategic insights by region
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketData.map((region) => (
              <Card key={region.region} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <CardTitle className="text-lg">{region.region} Region</CardTitle>
                    </div>
                    <Badge className={getRegionBadgeColor(region.region)}>
                      {region.marketShare}% Share
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{region.retailers}</div>
                      <div className="text-xs text-muted-foreground">Retailers</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{region.avgROI}%</div>
                      <div className="text-xs text-muted-foreground">Avg ROI</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Click Rate Performance</span>
                      <span>{region.avgClickRate}%</span>
                    </div>
                    <Progress value={region.avgClickRate * 20} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Top Performer:</span>
                      <span className="font-medium">{region.topPerformer}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Growth Rate:</span>
                      <div className={`flex items-center space-x-1 ${region.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {region.growth > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span className="font-medium">{region.growth > 0 ? '+' : ''}{region.growth}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Strategic Market Insights</span>
          </CardTitle>
          <CardDescription>
            AI-powered analysis and actionable recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opportunities */}
            <div>
              <h4 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Market Opportunities</span>
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-medium text-green-800">West Region Expansion</p>
                  <p className="text-sm text-green-700">
                    West region shows 12.5% growth and highest ROI. Consider increasing investment and retailer partnerships.
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-blue-800">East Region Optimization</p>
                  <p className="text-sm text-blue-700">
                    Strong retailer network with stable performance. Focus on conversion rate optimization.
                  </p>
                </div>
              </div>
            </div>

            {/* Challenges */}
            <div>
              <h4 className="font-semibold text-orange-800 mb-3 flex items-center space-x-2">
                <TrendingDown className="h-4 w-4" />
                <span>Market Challenges</span>
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <p className="font-medium text-orange-800">Central Region Recovery</p>
                  <p className="text-sm text-orange-700">
                    -2.1% decline requires immediate attention. Implement targeted support programs for underperforming retailers.
                  </p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="font-medium text-red-800">Market Concentration Risk</p>
                  <p className="text-sm text-red-700">
                    West region dominance (47% share) creates dependency risk. Diversify regional portfolio.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Items */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-3">Recommended Actions (Next 90 Days)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-purple-800">Immediate</p>
                  <p className="text-sm text-purple-700">Launch Central region retailer training program</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-blue-800">30 Days</p>
                  <p className="text-sm text-blue-700">Increase West region marketing budget by 25%</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-green-800">60 Days</p>
                  <p className="text-sm text-green-700">Evaluate new retailer partnerships in Central region</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 