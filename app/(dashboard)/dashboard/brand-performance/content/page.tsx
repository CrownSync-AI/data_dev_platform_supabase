'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { FileImage, TrendingUp, BarChart3, Download, Users, MousePointer, Play, FileText, Image, Zap } from 'lucide-react'
import { TimeRangeSelector } from '@/components/brand-performance/TimeRangeSelector'

interface TimeRange {
  label: string
  value: string
  startDate: Date
  endDate: Date
}

// Content performance data with realistic values
const contentPerformanceData = [
  { type: 'Video', q1: 61, q2: 39, q3: 92, q4: 18 },
  { type: 'Image', q1: 45, q2: 78, q3: 28, q4: 60 },
  { type: 'PDF', q1: 26, q2: 65, q3: 73, q4: 85 },
  { type: 'Other Types', q1: 67, q2: 34, q3: 41, q4: 52 }
]



export default function ContentAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>({
    label: 'Past 1 year',
    value: '1y',
    startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  })

  // timeRange is used for UI state management
  console.log('Current time range:', timeRange.label)
  const [selectedMetric, _setSelectedMetric] = useState('engagement')
  console.log('Current metric:', selectedMetric)
  
  // Function to generate gold color intensity based on performance value
  const getHeatmapColor = (value: number) => {
    // Gold color gradient: light gold (low %) → dark gold (high %)
    const intensity = value / 100
    // Light gold for low values, dark gold for high values
    const red = Math.round(255 - intensity * 40)     // 255 → 215 (lighter to darker gold)
    const green = Math.round(235 - intensity * 80)   // 235 → 155 (maintain gold hue)
    const blue = Math.round(200 - intensity * 150)   // 200 → 50 (reduce blue for deeper gold)
    return `rgb(${red}, ${green}, ${blue})`
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <Play className="h-4 w-4" />
      case 'Image':
        return <Image className="h-4 w-4" />
      case 'PDF':
        return <FileText className="h-4 w-4" />
      case 'Other Types':
        return <FileImage className="h-4 w-4" />
      default:
        return <FileImage className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Analytics</h1>
          <p className="text-muted-foreground">
            Content performance analysis and engagement insights across different formats
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
            Export Report
          </Button>
        </div>
      </div>

      {/* Content Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Content</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">
              +12% from last quarter
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">64.2%</div>
            <p className="text-xs text-muted-foreground">
              +5.1% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Video</div>
            <p className="text-xs text-muted-foreground">
              92% engagement in Q3
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8K</div>
            <p className="text-xs text-muted-foreground">
              +18% from last quarter
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Performance Heatmap */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Content Performance Heatmap</span>
                </CardTitle>
                <CardDescription>
                  Quarterly engagement rates by content type (darker = higher engagement)
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {/* Header row */}
              <div></div>
              {['Q1', 'Q2', 'Q3', 'Q4'].map(quarter => (
                <div key={quarter} className="text-center text-sm font-medium p-2 text-muted-foreground">
                  {quarter}
                </div>
              ))}
              
              {/* Data rows */}
              {contentPerformanceData.map((contentType) => (
                <div key={contentType.type} className="contents">
                  <div className="flex items-center space-x-2 p-2 text-sm font-medium">
                    {getContentIcon(contentType.type)}
                    <span>{contentType.type}</span>
                  </div>
                  {[contentType.q1, contentType.q2, contentType.q3, contentType.q4].map((value, cellIndex) => (
                    <div 
                      key={cellIndex}
                      className="h-12 rounded border flex items-center justify-center text-sm font-bold transition-all hover:scale-105 cursor-pointer"
                      style={{ 
                        backgroundColor: getHeatmapColor(value),
                        color: value > 60 ? 'white' : 'black'
                      }}
                      title={`${contentType.type} Q${cellIndex + 1}: ${value}% engagement`}
                    >
                      {value}%
                    </div>
                  ))}
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Low Engagement</span>
              <div className="flex space-x-1">
                {[20, 40, 60, 80, 100].map(val => (
                  <div 
                    key={val}
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ backgroundColor: getHeatmapColor(val) }}
                    title={`${val}% engagement`}
                  />
                ))}
              </div>
              <span>High Engagement</span>
            </div>
          </CardContent>
        </Card>

        {/* Content Type Performance Details - Now side by side */}
        <Card>
          <CardHeader>
            <CardTitle>Content Type Performance Breakdown</CardTitle>
            <CardDescription>
              Detailed metrics for each content format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentPerformanceData.map((content) => {
                const avgPerformance = Math.round((content.q1 + content.q2 + content.q3 + content.q4) / 4)
                const bestQuarter = Math.max(content.q1, content.q2, content.q3, content.q4)
                
                return (
                  <div key={content.type} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getContentIcon(content.type)}
                      <div>
                        <h4 className="font-medium">{content.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          Peak: {bestQuarter}% engagement
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Avg Performance</div>
                        <div className="text-xl font-bold">{avgPerformance}%</div>
                      </div>
                      
                      <div className="w-32">
                        <Progress value={avgPerformance} className="h-2" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 10 Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Most Downloaded Assets */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Top 10 Most Downloaded Assets</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2 mb-3">
                <div>Rank</div>
                <div>Name</div>
                <div>Type</div>
                <div className="text-right">Download Count</div>
              </div>
              {[
                { rank: 1, name: 'DayDate_Launch_Video.mp4', type: 'Video', downloads: 112 },
                { rank: 2, name: 'Explorer_Heritage_Lookbook.pdf', type: 'PDF', downloads: 98 },
                { rank: 3, name: 'Rolex_Oyster_Perpetual_Banner.jpg', type: 'Image', downloads: 94 },
                { rank: 4, name: 'GMT_Master_II_Social_Post.png', type: 'Image', downloads: 82 },
                { rank: 5, name: 'YachtMaster_Summer_Promo.tiff', type: 'Design File', downloads: 79 },
                { rank: 6, name: '2025_VIP_Event_Template.pptx', type: 'Presentation', downloads: 68 },
                { rank: 7, name: 'Valentines_Teaser_Poster.pdf', type: 'PDF', downloads: 61 },
                { rank: 8, name: 'Rolex_Retail_Guide_2025.pdf', type: 'PDF', downloads: 57 },
                { rank: 9, name: 'DayDate_Social_Boost_Clip.mp4', type: 'Video', downloads: 53 },
                { rank: 10, name: 'Oyster_Style_Lifestyle.jpg', type: 'Image', downloads: 48 }
              ].map((asset) => (
                <div key={asset.rank} className="grid grid-cols-4 gap-4 py-2 text-sm border-b border-gray-100 hover:bg-gray-50">
                  <div className="font-medium">{asset.rank}</div>
                  <div className="truncate">{asset.name}</div>
                  <div className="text-muted-foreground">{asset.type}</div>
                  <div className="text-right font-medium">{asset.downloads}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 10 Most Active Retailers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg">Top 10 Most Active Retailers</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2 mb-3">
                <div>Rank</div>
                <div>Name</div>
                <div>Unique Files</div>
                <div className="text-right">Download Count</div>
              </div>
              {[
                { rank: 1, name: 'William Barthman Jeweler, Ltd.', uniqueFiles: 56, downloads: 68 },
                { rank: 2, name: 'DeVons Jewelers', uniqueFiles: 52, downloads: 64 },
                { rank: 3, name: 'De Boulle Diamond & Jewelry', uniqueFiles: 50, downloads: 61 },
                { rank: 4, name: 'Louis Anthony Jewelers', uniqueFiles: 47, downloads: 58 },
                { rank: 5, name: 'Brent L. Miller Jewelers & Goldsmiths', uniqueFiles: 46, downloads: 55 },
                { rank: 6, name: 'Alson Jewelers', uniqueFiles: 44, downloads: 52 },
                { rank: 7, name: 'O.C. Tanner Jewelers', uniqueFiles: 41, downloads: 49 },
                { rank: 8, name: 'Manfredi Jewels', uniqueFiles: 39, downloads: 47 },
                { rank: 9, name: 'Walters & Hogsett Jewelers', uniqueFiles: 38, downloads: 46 },
                { rank: 10, name: 'Feldmar Watch Co.', uniqueFiles: 36, downloads: 44 }
              ].map((retailer) => (
                <div key={retailer.rank} className="grid grid-cols-4 gap-4 py-2 text-sm border-b border-gray-100 hover:bg-gray-50">
                  <div className="font-medium">{retailer.rank}</div>
                  <div className="truncate">{retailer.name}</div>
                  <div className="text-muted-foreground">{retailer.uniqueFiles}</div>
                  <div className="text-right font-medium">{retailer.downloads}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Generated Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Content Strategy Insights</span>
          </CardTitle>
          <CardDescription>
            Data-driven recommendations for content optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <h4 className="font-medium text-green-800 mb-2 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Best Performance</span>
              </h4>
              <p className="text-sm text-green-700">
                Video content achieved 92% engagement in Q3. Consider increasing video production for upcoming campaigns.
              </p>
            </Card>
            
            <Card className="p-4 bg-orange-50 border-orange-200">
              <h4 className="font-medium text-orange-800 mb-2 flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Growth Opportunity</span>
              </h4>
              <p className="text-sm text-orange-700">
                PDF materials show consistent growth over 3 quarters. Invest in more technical documentation and guides.
              </p>
            </Card>
            
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Optimization</span>
              </h4>
              <p className="text-sm text-blue-700">
                Brochure performance declined in Q2-Q3. Consider refreshing design templates and distribution strategy.
              </p>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
      )
} 