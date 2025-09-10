'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp } from "lucide-react"

interface Campaign {
  campaign_id: string
  campaign_name: string
  campaign_status: string
  budget_allocated: number
  created_at: string
}

interface CampaignChartProps {
  campaigns: Campaign[]
  loading: boolean
}

export function CampaignChart({ campaigns, loading }: CampaignChartProps) {
  if (loading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Campaign Budget Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[350px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2 animate-pulse" />
              <p className="text-gray-500">Loading chart data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const totalBudget = campaigns.reduce((sum, campaign) => sum + (campaign.budget_allocated || 0), 0)
  const activeCampaigns = campaigns.filter(c => c.campaign_status === 'active')
  const maxBudget = Math.max(...campaigns.map(c => c.budget_allocated || 0))

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Campaign Budget Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total budget: ${totalBudget.toLocaleString()} across {campaigns.length} campaigns
        </p>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px] space-y-4 overflow-y-auto pr-2">
          {campaigns.length === 0 ? (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No campaigns found</p>
                <p className="text-sm text-gray-400">Create your first campaign to see data</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>Campaign Budget Distribution</span>
                <span className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {activeCampaigns.length} active
                </span>
              </div>
              {campaigns.slice(0, 8).map((campaign) => {
                const percentage = maxBudget > 0 ? ((campaign.budget_allocated || 0) / maxBudget) * 100 : 0
                const statusColor = campaign.campaign_status === 'active' ? 'bg-green-500' : 
                                  campaign.campaign_status === 'draft' ? 'bg-gray-400' :
                                  campaign.campaign_status === 'paused' ? 'bg-yellow-500' :
                                  campaign.campaign_status === 'completed' ? 'bg-blue-500' : 'bg-red-400'
                
                return (
                  <div key={campaign.campaign_id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm gap-4">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${statusColor}`} />
                        <span className="font-medium truncate">
                          {campaign.campaign_name}
                        </span>
                      </div>
                      <span className="text-muted-foreground flex-shrink-0">
                        ${(campaign.budget_allocated || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${statusColor}`}
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              {campaigns.length > 8 && (
                <div className="text-center text-sm text-muted-foreground pt-2">
                  +{campaigns.length - 8} more campaigns
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}