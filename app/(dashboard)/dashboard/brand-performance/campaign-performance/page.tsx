'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import CampaignDetail from '@/components/campaigns/brand-view/dashboard/CampaignDetail';
import CampaignCard from '@/components/campaigns/brand-view/dashboard/CampaignCard';
import SocialCampaignAnalytics from '@/components/campaigns/brand-view/intelligence/SocialCampaignAnalytics';



export default function CampaignPerformancePage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)
  const [selectedCampaignType, setSelectedCampaignType] = useState<string | null>(null)



  const handleBackToDashboard = () => {
    setSelectedCampaignId(null)
    setSelectedCampaignType(null)
  }

  const handleRefresh = () => {
    // Refresh functionality can be handled by child components
    window.location.reload()
  }

  // Show detailed view if campaign is selected
  if (selectedCampaignId) {
    // Check if it's a social campaign based on the type passed from the card
    const isSocialCampaign = selectedCampaignType === 'social' || selectedCampaignId === '4' || selectedCampaignId.endsWith('-social');

    if (isSocialCampaign) {
      return (
        <SocialCampaignAnalytics
          campaignId={selectedCampaignId}
          onBack={handleBackToDashboard}
        />
      )
    }

    return (
      <CampaignDetail
        campaignId={selectedCampaignId}
        onBack={handleBackToDashboard}
      />
    )
  }



  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Performance</h1>
          <p className="text-muted-foreground">Brand-focused campaign analytics and performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Campaign
          </Button>
        </div>
      </div>

      {/* Brand Campaign View */}
      <div className="space-y-6">
        <CampaignCard
          role="brand"
          onCampaignClick={(campaignId: string, campaign: any) => {
            setSelectedCampaignId(campaignId)
            if (campaign) {
              setSelectedCampaignType(campaign.campaign_type)
            }
          }}
        />
      </div>
    </div>
  )
}