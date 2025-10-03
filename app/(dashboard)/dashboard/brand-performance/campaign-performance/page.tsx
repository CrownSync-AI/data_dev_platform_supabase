'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';
import CampaignDetailView from '@/components/brand-performance/campaign-dashboard/CampaignDetailView';
import CampaignCardView from '@/components/brand-performance/campaign-performance/CampaignCardView';



export default function CampaignPerformancePage() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)



  const handleBackToDashboard = () => {
    setSelectedCampaignId(null)
  }

  const handleRefresh = () => {
    // Refresh functionality can be handled by child components
    window.location.reload()
  }

  // Show detailed view if campaign is selected
  if (selectedCampaignId) {
    return (
      <CampaignDetailView 
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
        <CampaignCardView 
          role="brand" 
          onCampaignClick={(campaignId) => setSelectedCampaignId(campaignId)}
        />
      </div>
    </div>
  )
}