"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Printer, FileDown, Mail, MessageSquare, Smartphone } from "lucide-react"

// Fake data for Marketing Campaign Template Usage Statistics
const templateUsageData = [
  { name: "Land Oyster Craftsmanship Insight", usage: 45 },
  { name: "Daytona Legends in Motor Sport", usage: 78 },
  { name: "Oyster Perpetual Mastery Series", usage: 32 },
  { name: "Explorer Journeys of Endurance", usage: 95 },
  { name: "GMT Master II Heritage Unveiling", usage: 68 },
  { name: "Submariner Depth-Test Chronicles", usage: 28 },
  { name: "Sky Dweller Innovation Showcase", usage: 85 },
  { name: "Yacht Master Sailing Heritage", usage: 58 },
  { name: "Milgauss Science & Precision", usage: 42 },
  { name: "Datejust Wimbledon Moments", usage: 72 },
  { name: "Cellini Artistry & Elegance", usage: 55 },
  { name: "Rolex at Le Mans Endurance", usage: 25 },
  { name: "Rolex at US Daytona Highlights", usage: 88 },
  { name: "Rolex x Atilla Championship Series", usage: 75 },
  { name: "Marketing Moments: The Perpetual Rolex Story", usage: 38 },
]

// Top 10 Campaign Templates Coverage
const topTemplatesCoverage = [
  { rank: 1, name: "Land Oyster Craftsmanship Insight", uniqueRetailers: 118, uniqueRecipients: 44200 },
  { rank: 2, name: "Explorer Journeys of Endurance", uniqueRetailers: 102, uniqueRecipients: 40800 },
  { rank: 3, name: "Sky Dweller Innovation Showcase", uniqueRetailers: 95, uniqueRecipients: 38120 },
  { rank: 4, name: "Daytona Legends in Motor Sport", uniqueRetailers: 87, uniqueRecipients: 33400 },
  { rank: 5, name: "Rolex at US Daytona Highlights", uniqueRetailers: 78, uniqueRecipients: 29830 },
  { rank: 6, name: "Yacht Master Sailing Heritage", uniqueRetailers: 69, uniqueRecipients: 25380 },
  { rank: 7, name: "Submariner Depth-Test Chronicles", uniqueRetailers: 64, uniqueRecipients: 23800 },
  { rank: 8, name: "Milgauss Science & Precision", uniqueRetailers: 58, uniqueRecipients: 19270 },
  { rank: 9, name: "Oyster Perpetual Mastery Series", uniqueRetailers: 47, uniqueRecipients: 16840 },
  { rank: 10, name: "Datejust Wimbledon Moments", uniqueRetailers: 41, uniqueRecipients: 15230 },
]

// Top 10 Campaign Performance
const topCampaignPerformance = [
  { rank: 1, name: "Yacht Master Sailing Heritage", type: "SMS", conversionRate: 68.5 },
  { rank: 2, name: "Daytona Legends in Motor Sport", type: "SMS", conversionRate: 63.2 },
  { rank: 3, name: "Datejust Wimbledon Moments", type: "Email", conversionRate: 62.8 },
  { rank: 4, name: "GMT Master II Heritage Unveiling", type: "SMS", conversionRate: 58.9 },
  { rank: 5, name: "Sky Dweller Innovation Showcase", type: "Email", conversionRate: 57.3 },
]

// Top 10 Active Retailers
const topActiveRetailers = [
  { rank: 1, name: "Manifold Jewels", campaignsJoined: 21, totalSends: 68, lastActiveDate: "2025-07-06" },
  { rank: 2, name: "Fortune Watch Co.", campaignsJoined: 19, totalSends: 72, lastActiveDate: "2025-07-04" },
  { rank: 3, name: "De Boulle Diamond & Jewelry", campaignsJoined: 17, totalSends: 59, lastActiveDate: "2025-07-04" },
  { rank: 4, name: "Bucherer & Phillips Jewelers", campaignsJoined: 16, totalSends: 55, lastActiveDate: "2025-07-03" },
  { rank: 5, name: "Cartwright Jewelers", campaignsJoined: 14, totalSends: 48, lastActiveDate: "2025-07-02" },
]

const getCampaignTypeBadge = (type: string) => {
  const variants = {
    Email: "default",
    SMS: "secondary",
    Social: "outline",
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

export default function CampaignAnalyticsPage() {
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
      <Tabs defaultValue="campaign" className="space-y-4">
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
                    {topTemplatesCoverage.map((template) => (
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
                    {topCampaignPerformance.map((campaign) => (
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

        {/* Placeholder tabs */}
        <TabsContent value="brand-assets">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                Brand Assets Data analytics will be displayed here
              </div>
            </CardContent>
          </Card>
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
