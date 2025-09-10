"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import {
  Download,
  FileText,
  ImageIcon,
  Video,
  Archive,
  Printer,
  FileDown,
  TrendingUp,
  Mail,
  MessageSquare,
  Smartphone,
} from "lucide-react"
import {
  fetchDailyDownloadsData,
  fetchDistributionData,
  fetchTopDownloadedAssets,
  fetchTopActiveRetailers,
  fetchTemplateUsageData,
  fetchRetailerScores,
  fetchTopWishListItems,
  fetchRegionalWishLists,
  type DailyDownloadData,
  type DistributionData,
  type TopAsset,
  type TopRetailer,
  type TemplateUsageData,
  type RetailerScore,
  type WishListItem,
  type RegionalWishList
} from "@/lib/analytics-data"

// All data is now fetched from Supabase database










const getFileTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "video":
      return <Video className="h-4 w-4 text-purple-500" />
    case "image":
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    case "pdf":
      return <FileText className="h-4 w-4 text-red-500" />
    case "presentation":
      return <FileText className="h-4 w-4 text-orange-500" />
    case "design file":
      return <Archive className="h-4 w-4 text-green-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-500" />
  }
}

const getFileTypeBadge = (type: string) => {
  const variants = {
    Video: "secondary",
    Image: "default",
    PDF: "destructive",
    Presentation: "outline",
    "Design File": "secondary",
  } as const

  return <Badge variant={variants[type as keyof typeof variants] || "outline"}>{type}</Badge>
}

const getCampaignTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "email":
      return <Mail className="h-4 w-4 text-blue-500" />
    case "sms":
      return <Smartphone className="h-4 w-4 text-green-500" />
    case "social":
      return <MessageSquare className="h-4 w-4 text-purple-500" />
    default:
      return <Mail className="h-4 w-4 text-gray-500" />
  }
}

const getCampaignTypeBadge = (type: string) => {
  const variants = {
    Email: "default",
    SMS: "secondary",
    Social: "outline",
  } as const

  return <Badge variant={variants[type as keyof typeof variants] || "outline"}>{type}</Badge>
}

const getResponseQualityBadge = (quality: string) => {
  const variants = {
    A: "default",
    B: "secondary",
    C: "destructive",
  } as const

  return <Badge variant={variants[quality as keyof typeof variants] || "outline"}>{quality}</Badge>
}

export default function AnalyticsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentTab = searchParams.get("tab_name") || "brandAssets"
  
  // State for all analytics data
  const [dailyDownloadsData, setDailyDownloadsData] = useState<DailyDownloadData[]>([])
  const [distributionData, setDistributionData] = useState<DistributionData[]>([])
  const [topDownloadedAssets, setTopDownloadedAssets] = useState<TopAsset[]>([])
  const [topActiveRetailers, setTopActiveRetailers] = useState<TopRetailer[]>([])
  const [templateUsageData, setTemplateUsageData] = useState<TemplateUsageData[]>([])
  const [retailerScoreData, setRetailerScoreData] = useState<RetailerScore[]>([])
  const [topWishListItems, setTopWishListItems] = useState<WishListItem[]>([])
  const [regionalWishLists, setRegionalWishLists] = useState<RegionalWishList>({
    northeast: [],
    midwest: [],
    south: [],
    west: []
  })
  const [loading, setLoading] = useState(true)
  
  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        const [
          dailyDownloads,
          distribution,
          topAssets,
          topRetailers,
          templateUsage,
          retailerScores,
          wishListItems,
          regionalWishData
        ] = await Promise.all([
          fetchDailyDownloadsData(),
          fetchDistributionData(),
          fetchTopDownloadedAssets(),
          fetchTopActiveRetailers(),
          fetchTemplateUsageData(),
          fetchRetailerScores(),
          fetchTopWishListItems(),
          fetchRegionalWishLists()
        ])
        
        setDailyDownloadsData(dailyDownloads)
        setDistributionData(distribution)
        setTopDownloadedAssets(topAssets)
        setTopActiveRetailers(topRetailers)
        setTemplateUsageData(templateUsage)
        setRetailerScoreData(retailerScores)
        setTopWishListItems(wishListItems)
        setRegionalWishLists(regionalWishData)
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAllData()
  }, [])

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab_name", value)
    router.push(`/dashboard/analytics?${params.toString()}`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <span>Home</span>
              <span>/</span>
              <span>Analytics</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">Track your performance metrics</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Home</span>
            <span>/</span>
            <span>Analytics</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">Track your performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <FileDown className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="brandAssets">Brand Assets Data</TabsTrigger>
            <TabsTrigger value="campaign">Campaign Data</TabsTrigger>
            <TabsTrigger value="retailerScore">Retailer Score Data</TabsTrigger>
            <TabsTrigger value="wishList">Wish List Data</TabsTrigger>
          </TabsList>
          <Select defaultValue="30">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="brandAssets" className="space-y-6">
          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Daily Downloads Statistics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Daily Downloads Statistics
                </CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#8B7355] rounded"></div>
                    <span>Others</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#B8860B] rounded"></div>
                    <span>Video</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#D4AF37] rounded"></div>
                    <span>Image</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyDownloadsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="Others" stackId="a" fill="#8B7355" />
                      <Bar dataKey="Video" stackId="a" fill="#B8860B" />
                      <Bar dataKey="Image" stackId="a" fill="#D4AF37" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Downloads Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Downloads Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const entry = payload[0]
                          if (entry && entry.payload) {
                            return (
                              <div className="bg-background border rounded-lg p-3 shadow-lg">
                                <p className="font-medium">{entry.payload?.name || 'Unknown'}</p>
                                 <p className="text-sm text-muted-foreground">
                                   {entry.payload?.value || 0} downloads
                                 </p>
                              </div>
                            )
                          }
                        }
                        return null
                      }} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry) => `${value} - ${entry.payload?.value || 0} downloads`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tables Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top 10 Most Downloaded Assets */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top 10 Most Downloaded Assets</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Download Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topDownloadedAssets.map((asset) => (
                      <TableRow key={asset.rank}>
                        <TableCell className="font-medium">{asset.rank}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFileTypeIcon(asset.type)}
                            <span className="truncate max-w-[200px]">{asset.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getFileTypeBadge(asset.type)}</TableCell>
                        <TableCell className="text-right font-medium">{asset.downloadCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top 10 Most Active Retailers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top 10 Most Active Retailers</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Unique Files</TableHead>
                      <TableHead className="text-right">Download Count</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topActiveRetailers.map((retailer) => (
                      <TableRow key={retailer.rank}>
                        <TableCell className="font-medium">{retailer.rank}</TableCell>
                        <TableCell>
                          <span className="truncate max-w-[180px] block">{retailer.name}</span>
                        </TableCell>
                        <TableCell className="text-right">{retailer.uniqueFiles}</TableCell>
                        <TableCell className="text-right font-medium">{retailer.downloadCount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaign" className="space-y-6">
          {/* Main Content Layout */}
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Marketing Campaign Template Usage Statistics - Takes 3 columns */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Marketing Campaign Template Usage Statistics
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Type</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[500px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={templateUsageData}
                      layout="horizontal"
                      margin={{ top: 5, right: 30, left: 250, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[0, "dataMax + 10"]}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        width={240}
                        interval={0}
                      />
                      <Tooltip formatter={(value) => [value, "Usage"]} labelStyle={{ fontSize: "12px" }} />
                      <Bar dataKey="usage" fill="#D4AF37" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top 10 Campaign Templates Coverage - Takes 1 column */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Top 10 Campaign Templates Coverage</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 text-xs">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-xs">Rank</TableHead>
                      <TableHead className="text-xs">Name</TableHead>
                      <TableHead className="text-xs text-right">Unique Retailers</TableHead>
                      <TableHead className="text-xs text-right">Unique Recipients</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templateUsageData.map((template) => (
                      <TableRow key={template.rank}>
                        <TableCell className="font-medium text-xs">{template.rank}</TableCell>
                        <TableCell className="text-xs">
                          <span className="truncate max-w-[120px] block">{template.name}</span>
                        </TableCell>
                        <TableCell className="text-xs text-right">{template.uniqueRetailers}</TableCell>
                        <TableCell className="text-xs text-right">
                          {template.uniqueRecipients.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Tables Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Top 10 Campaign Performance */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top 10 Campaign Performance</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Conversion Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templateUsageData.map((campaign) => (
                      <TableRow key={campaign.rank}>
                        <TableCell className="font-medium">{campaign.rank}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCampaignTypeIcon(campaign.type)}
                            <span className="truncate max-w-[180px]">{campaign.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getCampaignTypeBadge(campaign.type)}</TableCell>
                        <TableCell className="text-right font-medium">{campaign.conversionRate}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top 10 Active Retailers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top 10 Active Retailers</CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Rank</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Campaigns Joined</TableHead>
                      <TableHead className="text-right">Total Sends</TableHead>
                      <TableHead className="text-right">Last Active Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topActiveRetailers.map((retailer) => (
                      <TableRow key={retailer.rank}>
                        <TableCell className="font-medium">{retailer.rank}</TableCell>
                        <TableCell>
                          <span className="truncate max-w-[150px] block">{retailer.name}</span>
                        </TableCell>
                        <TableCell className="text-right">{retailer.campaignsJoined}</TableCell>
                        <TableCell className="text-right">{retailer.totalSends}</TableCell>
                        <TableCell className="text-right text-xs">{retailer.lastActiveDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retailerScore" className="space-y-6">
          {/* Retailer Score Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Retailer Score Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead className="min-w-[200px]">Retailer Name</TableHead>
                    <TableHead className="text-center">Email Avg Response Time</TableHead>
                    <TableHead className="text-center">Social Media Response Time</TableHead>
                    <TableHead className="text-center">Social Post Frequency</TableHead>
                    <TableHead className="text-center">Response Quality</TableHead>
                    <TableHead className="text-center">First Follow-up Time</TableHead>
                    <TableHead className="text-center">Campaign ROI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {retailerScoreData.map((retailer) => (
                    <TableRow key={retailer.rank}>
                      <TableCell className="font-medium">{retailer.rank}</TableCell>
                      <TableCell className="font-medium">{retailer.name}</TableCell>
                      <TableCell className="text-center">{retailer.emailResponseTime}</TableCell>
                      <TableCell className="text-center">{retailer.socialResponseTime}</TableCell>
                      <TableCell className="text-center">{retailer.socialPostFreq}</TableCell>
                      <TableCell className="text-center">{getResponseQualityBadge(retailer.responseQuality)}</TableCell>
                      <TableCell className="text-center">{retailer.firstFollowupTime}</TableCell>
                      <TableCell className="text-center font-medium">{retailer.campaignROI}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishList" className="space-y-6">
          {/* Top Wish List Items */}
          <Card>
            <CardHeader>
              <CardTitle>Top Wish List Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead className="min-w-[200px]">Model</TableHead>
                    <TableHead>Collection</TableHead>
                    <TableHead className="text-center">Size</TableHead>
                    <TableHead className="text-center">Gender</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-center">MPN</TableHead>
                    <TableHead className="text-center">Wish Count</TableHead>
                    <TableHead className="text-center">Unique Retailers</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topWishListItems.map((item) => (
                    <TableRow key={item.rank}>
                      <TableCell className="font-medium">{item.rank}</TableCell>
                      <TableCell className="font-medium">{item.model}</TableCell>
                      <TableCell>{item.collection}</TableCell>
                      <TableCell className="text-center">{item.size}</TableCell>
                      <TableCell className="text-center">{item.gender}</TableCell>
                      <TableCell>{item.material}</TableCell>
                      <TableCell className="text-center font-mono text-sm">{item.mpn}</TableCell>
                      <TableCell className="text-center font-medium">{item.wishCount}</TableCell>
                      <TableCell className="text-center">{item.uniqueRetailers}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Regional Wish Lists */}
          <Card>
            <CardHeader>
              <CardTitle>Wish List by Region (North America)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Northeast */}
                <div>
                  <h4 className="font-semibold mb-3">Northeast</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead className="text-center">Size</TableHead>
                        <TableHead className="text-center">MPN</TableHead>
                        <TableHead className="text-center">Wish Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regionalWishLists.northeast.map((item) => (
                        <TableRow key={item.rank}>
                          <TableCell className="font-medium">{item.rank}</TableCell>
                          <TableCell className="text-sm">{item.model}</TableCell>
                          <TableCell className="text-center text-sm">{item.size}</TableCell>
                          <TableCell className="text-center font-mono text-xs">{item.mpn}</TableCell>
                          <TableCell className="text-center font-medium">{item.wishCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Midwest */}
                <div>
                  <h4 className="font-semibold mb-3">Midwest</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead className="text-center">Size</TableHead>
                        <TableHead className="text-center">MPN</TableHead>
                        <TableHead className="text-center">Wish Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regionalWishLists.midwest.map((item) => (
                        <TableRow key={item.rank}>
                          <TableCell className="font-medium">{item.rank}</TableCell>
                          <TableCell className="text-sm">{item.model}</TableCell>
                          <TableCell className="text-center text-sm">{item.size}</TableCell>
                          <TableCell className="text-center font-mono text-xs">{item.mpn}</TableCell>
                          <TableCell className="text-center font-medium">{item.wishCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* South */}
                <div>
                  <h4 className="font-semibold mb-3">South</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead className="text-center">Size</TableHead>
                        <TableHead className="text-center">MPN</TableHead>
                        <TableHead className="text-center">Wish Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regionalWishLists.south.map((item) => (
                        <TableRow key={item.rank}>
                          <TableCell className="font-medium">{item.rank}</TableCell>
                          <TableCell className="text-sm">{item.model}</TableCell>
                          <TableCell className="text-center text-sm">{item.size}</TableCell>
                          <TableCell className="text-center font-mono text-xs">{item.mpn}</TableCell>
                          <TableCell className="text-center font-medium">{item.wishCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* West */}
                <div>
                  <h4 className="font-semibold mb-3">West</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead className="text-center">Size</TableHead>
                        <TableHead className="text-center">MPN</TableHead>
                        <TableHead className="text-center">Wish Count</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {regionalWishLists.west.map((item) => (
                        <TableRow key={item.rank}>
                          <TableCell className="font-medium">{item.rank}</TableCell>
                          <TableCell className="text-sm">{item.model}</TableCell>
                          <TableCell className="text-center text-sm">{item.size}</TableCell>
                          <TableCell className="text-center font-mono text-xs">{item.mpn}</TableCell>
                          <TableCell className="text-center font-medium">{item.wishCount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
