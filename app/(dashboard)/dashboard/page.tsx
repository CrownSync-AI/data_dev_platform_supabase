'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Activity,
  Users,
  TrendingUp,
  AlertCircle,
  Megaphone,
  ArrowRight,
  Plus,
  Store,
  BarChart3,
  Instagram,
  Facebook,
  Linkedin,
  Twitter
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

// Mock Data for Brand Dashboard
const brandStats = {
  activeCampaigns: 3,
  totalRetailers: 142,
  activeRetailers: 118,
  totalReach: 2450000,
  reachGrowth: 12.5,
  avgEngagement: 4.8,
  engagementGrowth: 0.5
}

const alerts = [
  { id: 1, type: 'warning', message: '3 Retailers pending approval', action: 'Review', time: '2 hours ago' },
  { id: 2, type: 'info', message: 'Holiday Campaign ending in 5 days', action: 'View Campaign', time: '5 hours ago' },
  { id: 3, type: 'error', message: 'Instagram API token expiring soon', action: 'Reconnect', time: '1 day ago' }
]

const activeCampaigns = [
  {
    id: 1,
    name: 'Holiday Collection 2023',
    status: 'Active',
    retailers: 45,
    totalRetailers: 50,
    reach: '1.2M',
    engagement: '5.2%',
    progress: 85,
    image: '/campaigns/holiday.jpg'
  },
  {
    id: 2,
    name: 'New Year Resolution',
    status: 'Scheduled',
    retailers: 32,
    totalRetailers: 40,
    reach: '-',
    engagement: '-',
    progress: 0,
    image: '/campaigns/newyear.jpg'
  },
  {
    id: 3,
    name: 'Winter Clearance',
    status: 'Active',
    retailers: 28,
    totalRetailers: 30,
    reach: '450K',
    engagement: '3.8%',
    progress: 45,
    image: '/campaigns/winter.jpg'
  }
]

const trendData = [
  { date: 'Nov 1', reach: 120000, engagement: 4500 },
  { date: 'Nov 5', reach: 150000, engagement: 5200 },
  { date: 'Nov 10', reach: 180000, engagement: 6100 },
  { date: 'Nov 15', reach: 220000, engagement: 7500 },
  { date: 'Nov 20', reach: 210000, engagement: 7200 },
  { date: 'Nov 25', reach: 250000, engagement: 8500 },
  { date: 'Nov 30', reach: 280000, engagement: 9200 },
]

const platformData = [
  { name: 'Instagram', value: 45, color: '#E1306C', icon: Instagram },
  { name: 'Facebook', value: 30, color: '#1877F2', icon: Facebook },
  { name: 'LinkedIn', value: 15, color: '#0A66C2', icon: Linkedin },
  { name: 'X (Twitter)', value: 10, color: '#000000', icon: Twitter },
]

const retailerActivity = [
  { name: 'Luxury Boutique NYC', action: 'Posted content', time: '10 mins ago', campaign: 'Holiday Collection' },
  { name: 'Fashion Forward LA', action: 'Joined campaign', time: '45 mins ago', campaign: 'New Year Resolution' },
  { name: 'Style Central Chicago', action: 'Downloaded assets', time: '2 hours ago', campaign: 'Holiday Collection' },
  { name: 'Trend Setters Miami', action: 'Posted content', time: '3 hours ago', campaign: 'Winter Clearance' },
]

export default function BrandDashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6 bg-neu-bg min-h-screen text-neu-text">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Good morning, Rolex</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening with your brand today.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden md:flex gap-2 rounded-full shadow-neu hover:shadow-neu-pressed active:shadow-neu-pressed bg-neu-bg text-gray-600 border-none transition-all px-6 h-12">
            <Store className="h-4 w-4" />
            Invite Retailer
          </Button>
          <Button className="gap-2 bg-black text-white hover:bg-gray-800 rounded-full shadow-lg border-none px-6 h-12 transition-transform hover:-translate-y-0.5">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-neu rounded-neu border-none transition-transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Campaigns</CardTitle>
            <div className="h-8 w-8 rounded-full bg-neu-bg shadow-neu-pressed flex items-center justify-center">
              <Megaphone className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">{brandStats.activeCampaigns}</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +1
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-neu rounded-neu border-none transition-transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Retailer Network</CardTitle>
            <div className="h-8 w-8 rounded-full bg-neu-bg shadow-neu-pressed flex items-center justify-center">
              <Store className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">{brandStats.totalRetailers}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-medium text-green-600 bg-green-100/50 px-2 py-0.5 rounded-full shadow-inner">
                {brandStats.activeRetailers} Active
              </span>
              <span className="text-xs text-gray-500">
                {(brandStats.activeRetailers / brandStats.totalRetailers * 100).toFixed(0)}% Participation
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-neu rounded-neu border-none transition-transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Reach</CardTitle>
            <div className="h-8 w-8 rounded-full bg-neu-bg shadow-neu-pressed flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">{(brandStats.totalReach / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{brandStats.reachGrowth}%
              </span>
              vs last 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-neu rounded-neu border-none transition-transform hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Engagement</CardTitle>
            <div className="h-8 w-8 rounded-full bg-neu-bg shadow-neu-pressed flex items-center justify-center">
              <Activity className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-700">{brandStats.avgEngagement}%</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{brandStats.engagementGrowth}%
              </span>
              vs last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 md:grid-cols-7">

        {/* Left Column (Main) */}
        <div className="md:col-span-5 space-y-8">

          {/* Performance Trend Chart */}
          <Card className="shadow-neu rounded-neu border-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Performance Trends</CardTitle>
                  <CardDescription>Aggregated reach and engagement across all campaigns</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-white">Last 30 Days</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pl-0">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      yAxisId="left"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#F0F2F5', borderRadius: '16px', border: 'none', boxShadow: '6px 6px 12px #D1D9E6, -6px -6px 12px #FFFFFF', color: '#1A202C' }}
                      itemStyle={{ color: '#4A5568', fontSize: '12px', fontWeight: 600 }}
                      labelStyle={{ color: '#1A202C', fontWeight: 'bold', marginBottom: '4px' }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="reach"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#8B5CF6', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Reach"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="engagement"
                      stroke="#F97316"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#F97316', strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      name="Engagement"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Active Campaigns List */}
          <Card className="shadow-neu rounded-neu border-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Active Campaigns</CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {activeCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-md transition-all gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center shrink-0">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{campaign.name}</h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${campaign.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {campaign.status}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center font-medium">
                            <Store className="h-3.5 w-3.5 mr-1.5" />
                            {campaign.retailers}/{campaign.totalRetailers} Retailers
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto mt-2 md:mt-0">
                      <div className="text-left md:text-right">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Reach</p>
                        <p className="font-bold text-gray-900 text-lg">{campaign.reach}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Engagement</p>
                        <p className="font-bold text-gray-900 text-lg">{campaign.engagement}</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-9 px-4 rounded-full border-gray-200 hover:bg-gray-50 hover:text-gray-900 font-medium">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column (Side) */}
        <div className="md:col-span-2 space-y-8">

          {/* Needs Attention / Alerts */}
          <Card className="shadow-neu rounded-neu border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Needs Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 rounded-xl bg-neu-bg shadow-neu-pressed border-none">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 shadow-sm ${alert.type === 'warning' ? 'bg-orange-500' :
                        alert.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 leading-snug">{alert.message}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500 font-medium">{alert.time}</p>
                          <Button variant="link" className="h-auto p-0 text-xs font-bold text-blue-600 hover:text-blue-700">
                            {alert.action}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Mix */}
          <Card className="shadow-neu rounded-neu border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Platform Mix</CardTitle>
              <CardDescription>Reach distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">4</p>
                    <p className="text-xs text-gray-500">Platforms</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {platformData.map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: platform.color }} />
                      <span className="text-gray-600">{platform.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{platform.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Retailer Activity Feed */}
          <Card className="shadow-neu rounded-neu border-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {retailerActivity.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-50 text-blue-600 text-xs">
                        {activity.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.name}</span> {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
