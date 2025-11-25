'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend
} from 'recharts'
import {
    Users,
    Megaphone,
    MousePointer,
    Percent,
    Store,
    ArrowUpRight,
    ArrowDownRight,
    Activity
} from 'lucide-react'

// Mock Data for Overview
const overviewMetrics = [
    {
        title: 'Active Campaigns',
        value: '12',
        change: '+2',
        trend: 'up',
        icon: Megaphone,
        description: 'Currently running campaigns'
    },
    {
        title: 'Total Retailers',
        value: '1,248',
        change: '+156',
        trend: 'up',
        icon: Store,
        description: 'Participating retailers'
    },
    {
        title: 'Total Reach',
        value: '2.4M',
        change: '+18%',
        trend: 'up',
        icon: Users,
        description: 'Across all channels'
    },
    {
        title: 'Total Engagement',
        value: '185K',
        change: '+12%',
        trend: 'up',
        icon: MousePointer,
        description: 'Likes, shares, comments'
    },
    {
        title: 'Avg. Engagement Rate',
        value: '4.2%',
        change: '-0.5%',
        trend: 'down',
        icon: Activity,
        description: 'Per campaign average'
    },
    {
        title: 'Participation Rate',
        value: '68%',
        change: '+5%',
        trend: 'up',
        icon: Percent,
        description: 'Retailer opt-in rate'
    }
]

// Mock Data for Charts
const engagementTrendData = [
    { month: 'Jun', engagement: 120000, reach: 1800000 },
    { month: 'Jul', engagement: 135000, reach: 1950000 },
    { month: 'Aug', engagement: 128000, reach: 2100000 },
    { month: 'Sep', engagement: 155000, reach: 2250000 },
    { month: 'Oct', engagement: 172000, reach: 2350000 },
    { month: 'Nov', engagement: 185000, reach: 2400000 },
]

const retailerParticipationData = [
    { month: 'Jun', participating: 850, invited: 1100 },
    { month: 'Jul', participating: 920, invited: 1150 },
    { month: 'Aug', participating: 980, invited: 1200 },
    { month: 'Sep', participating: 1050, invited: 1250 },
    { month: 'Oct', participating: 1150, invited: 1300 },
    { month: 'Nov', participating: 1248, invited: 1350 },
]

export default function CampaignOverview() {
    return (
        <div className="space-y-4">
            <Tabs defaultValue="overview" className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold tracking-tight">Performance Overview</h2>
                    <TabsList>
                        <TabsTrigger value="overview">Overview Numbers</TabsTrigger>
                        <TabsTrigger value="trends">Trend Visualization</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {overviewMetrics.map((metric, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {metric.title}
                                    </CardTitle>
                                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline justify-between">
                                        <div className="text-2xl font-bold">{metric.value}</div>
                                        <div className={`flex items-center text-xs font-medium ${metric.trend === 'up' ? 'text-green-600' :
                                            metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                                            }`}>
                                            {metric.trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> :
                                                metric.trend === 'down' ? <ArrowDownRight className="h-3 w-3 mr-1" /> : null}
                                            {metric.change}
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {metric.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="trends" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Engagement & Reach Trends</CardTitle>
                                <CardDescription>6-month performance history</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={engagementTrendData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" />
                                            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                                            <Tooltip />
                                            <Legend />
                                            <Line yAxisId="left" type="monotone" dataKey="engagement" stroke="#8884d8" activeDot={{ r: 8 }} name="Engagement" />
                                            <Line yAxisId="right" type="monotone" dataKey="reach" stroke="#82ca9d" name="Reach" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Retailer Participation</CardTitle>
                                <CardDescription>Active vs Invited Retailers</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={retailerParticipationData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="invited" fill="#e2e8f0" name="Invited" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="participating" fill="#3b82f6" name="Participating" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
