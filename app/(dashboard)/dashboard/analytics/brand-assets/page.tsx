"use client"
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

// Fake data for charts - replace with Supabase queries later
const dailyDownloadsData = [
  { date: "06/01", Others: 45, Video: 32, Image: 78 },
  { date: "06/02", Others: 52, Video: 28, Image: 85 },
  { date: "06/03", Others: 48, Video: 35, Image: 92 },
  { date: "06/04", Others: 61, Video: 42, Image: 88 },
  { date: "06/05", Others: 55, Video: 38, Image: 95 },
  { date: "06/06", Others: 67, Video: 45, Image: 102 },
  { date: "06/07", Others: 58, Video: 41, Image: 89 },
  { date: "06/08", Others: 72, Video: 48, Image: 98 },
  { date: "06/09", Others: 64, Video: 52, Image: 105 },
  { date: "06/10", Others: 69, Video: 46, Image: 93 },
  { date: "06/11", Others: 75, Video: 55, Image: 110 },
  { date: "06/12", Others: 68, Video: 49, Image: 87 },
  { date: "06/13", Others: 82, Video: 58, Image: 115 },
  { date: "06/14", Others: 76, Video: 53, Image: 99 },
  { date: "06/15", Others: 88, Video: 61, Image: 122 },
  { date: "06/16", Others: 79, Video: 56, Image: 108 },
  { date: "06/17", Others: 91, Video: 64, Image: 125 },
  { date: "06/18", Others: 85, Video: 59, Image: 112 },
  { date: "06/19", Others: 94, Video: 67, Image: 128 },
  { date: "06/20", Others: 87, Video: 62, Image: 118 },
  { date: "06/21", Others: 96, Video: 69, Image: 135 },
  { date: "06/22", Others: 89, Video: 65, Image: 121 },
  { date: "06/23", Others: 102, Video: 72, Image: 142 },
  { date: "06/24", Others: 95, Video: 68, Image: 129 },
  { date: "06/25", Others: 108, Video: 75, Image: 148 },
  { date: "06/26", Others: 101, Video: 71, Image: 136 },
  { date: "06/27", Others: 115, Video: 78, Image: 155 },
  { date: "06/28", Others: 109, Video: 74, Image: 142 },
  { date: "06/29", Others: 122, Video: 81, Image: 162 },
  { date: "06/30", Others: 116, Video: 77, Image: 149 },
]

const distributionData = [
  { name: "Image", value: 34, color: "#D4AF37" },
  { name: "Video", value: 21, color: "#B8860B" },
  { name: "Others", value: 45, color: "#8B7355" },
]

const topDownloadedAssets = [
  { rank: 1, name: "Daytona_Launch_Video.mp4", type: "Video", downloadCount: 152 },
  { rank: 2, name: "Explorer_Heritage_Lookbook.pdf", type: "PDF", downloadCount: 98 },
  { rank: 3, name: "Rolex_Oyster_Perpetual_Banner.jpg", type: "Image", downloadCount: 94 },
  { rank: 4, name: "GMT_Master_II_Social_Post.png", type: "Image", downloadCount: 87 },
  { rank: 5, name: "YachtMaster_Summer_Promo.gif", type: "Design File", downloadCount: 79 },
  { rank: 6, name: "2025_VIP_Event_Template.pptx", type: "Presentation", downloadCount: 68 },
  { rank: 7, name: "Submariner_Teaser_Poster.pdf", type: "PDF", downloadCount: 61 },
  { rank: 8, name: "Rolex_Retail_Guide_2025.pdf", type: "PDF", downloadCount: 57 },
  { rank: 9, name: "Daytona_Social_Boost_Clip.mp4", type: "Video", downloadCount: 53 },
  { rank: 10, name: "Oyster_Style_Lifestyle.jpg", type: "Image", downloadCount: 48 },
]

const topActiveRetailers = [
  { rank: 1, name: "Bucherer Hermann Jewelers Ltd.", uniqueFiles: 58, downloadCount: 84 },
  { rank: 2, name: "Tourneau Jewelers", uniqueFiles: 52, downloadCount: 74 },
  { rank: 3, name: "De Boulle Diamond & Jewelry", uniqueFiles: 50, downloadCount: 61 },
  { rank: 4, name: "Long's Anthony Jewelers", uniqueFiles: 47, downloadCount: 58 },
  { rank: 5, name: "Brent L. Miller Jewelers & Goldsmiths", uniqueFiles: 46, downloadCount: 55 },
  { rank: 6, name: "Alson Jewelers", uniqueFiles: 44, downloadCount: 52 },
  { rank: 7, name: "O.C Turner Jewelers", uniqueFiles: 41, downloadCount: 49 },
  { rank: 8, name: "Manfredi Jewels", uniqueFiles: 39, downloadCount: 47 },
  { rank: 9, name: "Walters & Hoggett Jewelers", uniqueFiles: 36, downloadCount: 46 },
  { rank: 10, name: "Fashion Watch Co.", uniqueFiles: 35, downloadCount: 44 },
]

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

// Campaign Data
const templateUsageData = [
  { campaignType: "Email", count: 120 },
  { campaignType: "SMS", count: 85 },
  { campaignType: "Social Media", count: 150 },
]

const topTemplatesCoverage = [
  { templateName: "New Collection Launch", coverage: 78 },
  { templateName: "Summer Sale", coverage: 65 },
  { templateName: "VIP Event Invitation", coverage: 52 },
]

const topCampaignPerformance = [
  { rank: 1, name: "Spring Collection Email", type: "Email", sent: 1250, opened: 875, clicked: 340 },
  { rank: 2, name: "Summer Sale SMS", type: "SMS", sent: 980, opened: 920, clicked: 410 },
  { rank: 3, name: "Autumn Lookbook Social Media", type: "Social Media", sent: 1500, opened: 1350, clicked: 620 },
  { rank: 4, name: "Winter Promo Email", type: "Email", sent: 1100, opened: 780, clicked: 290 },
  { rank: 5, name: "Anniversary Discount SMS", type: "SMS", sent: 850, opened: 800, clicked: 360 },
]

const getCampaignTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "email":
      return <Mail className="h-4 w-4 text-blue-500" />
    case "sms":
      return <MessageSquare className="h-4 w-4 text-green-500" />
    case "social media":
      return <Smartphone className="h-4 w-4 text-purple-500" />
    default:
      return <Mail className="h-4 w-4 text-gray-500" />
  }
}

const getCampaignTypeBadge = (type: string) => {
  const variants = {
    Email: "default",
    SMS: "secondary",
    "Social Media": "outline",
  } as const

  return <Badge variant={variants[type as keyof typeof variants] || "outline"}>{type}</Badge>
}

export default function BrandAssetsAnalyticsPage() {
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
      <Tabs defaultValue="brand-assets" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="brand-assets">Brand Assets Data</TabsTrigger>
            <TabsTrigger value="campaign">Campaign Data</TabsTrigger>
            <TabsTrigger value="retailer">Retailer Score Data</TabsTrigger>
            <TabsTrigger value="wishlist">Wish List Data</TabsTrigger>
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

        <TabsContent value="brand-assets" className="space-y-6">
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
                      <Tooltip formatter={(value) => `${value}%`} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry) => `${value} - ${entry.payload?.value || 0}%`}
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

        {/* Placeholder tabs */}
        <TabsContent value="campaign">
          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Template Usage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Template Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={templateUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="campaignType" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Templates Coverage */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Top Templates Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead className="text-right">Coverage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topTemplatesCoverage.map((template) => (
                      <TableRow key={template.templateName}>
                        <TableCell>{template.templateName}</TableCell>
                        <TableCell className="text-right font-medium">{template.coverage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Tables Row */}
          <div className="grid gap-6 lg:grid-cols-1">
            {/* Top Campaign Performance */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top Campaign Performance</CardTitle>
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
                      <TableHead className="text-right">Sent</TableHead>
                      <TableHead className="text-right">Opened</TableHead>
                      <TableHead className="text-right">Clicked</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topCampaignPerformance.map((campaign) => (
                      <TableRow key={campaign.rank}>
                        <TableCell className="font-medium">{campaign.rank}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getCampaignTypeIcon(campaign.type)}
                            <span className="truncate max-w-[200px]">{campaign.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getCampaignTypeBadge(campaign.type)}</TableCell>
                        <TableCell className="text-right">{campaign.sent}</TableCell>
                        <TableCell className="text-right">{campaign.opened}</TableCell>
                        <TableCell className="text-right font-medium">{campaign.clicked}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retailer">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Retailer Score Data analytics will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">Wish List Data analytics will be displayed here</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
