'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building, ShoppingBag, Crown } from "lucide-react"

interface User {
  user_name: string
  user_email: string
  user_type: string
  created_at: string
}

interface UserAnalyticsProps {
  users: User[]
  loading: boolean
}

export function UserAnalytics({ users, loading }: UserAnalyticsProps) {
  if (loading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>User Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto text-gray-400 mb-2 animate-pulse" />
              <p className="text-gray-500">Loading analytics...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const usersByType = users.reduce((acc, user) => {
    acc[user.user_type] = (acc[user.user_type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalUsers = users.length
  const brandUsers = usersByType.brand || 0
  const retailerUsers = usersByType.retailer || 0
  const adminUsers = usersByType.admin || 0

  const userTypeData = [
    {
      type: 'Brand',
      count: brandUsers,
      percentage: totalUsers > 0 ? Math.round((brandUsers / totalUsers) * 100) : 0,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: Building
    },
    {
      type: 'Retailer',
      count: retailerUsers,
      percentage: totalUsers > 0 ? Math.round((retailerUsers / totalUsers) * 100) : 0,
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      textColor: 'text-green-700',
      icon: ShoppingBag
    },
    {
      type: 'Admin',
      count: adminUsers,
      percentage: totalUsers > 0 ? Math.round((adminUsers / totalUsers) * 100) : 0,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      icon: Crown
    }
  ]

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>User Analytics</CardTitle>
        <p className="text-sm text-muted-foreground">
          {totalUsers} total users across all types
        </p>
      </CardHeader>
      <CardContent>
        {totalUsers === 0 ? (
          <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No users found</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {userTypeData.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.type} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${item.lightColor}`}>
                        <Icon className={`h-4 w-4 ${item.textColor}`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.type} Users</p>
                        <p className="text-xs text-muted-foreground">
                          {item.count} users ({item.percentage}%)
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${item.lightColor} ${item.textColor} border-0`}>
                      {item.count}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${item.color}`}
                      style={{ width: `${Math.max(item.percentage, 2)}%` }}
                    />
                  </div>
                </div>
              )
            })}
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Growth Rate</span>
                <span className="font-medium text-green-600">+12% this month</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}