import { NextRequest, NextResponse } from 'next/server';
import { generateMockCampaignAnalytics } from '@/lib/services/mockCampaignAnalyticsService';

export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  try {
    const { campaignId } = params;

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    // Generate mock analytics data based on Ayrshare structure
    const analyticsData = generateMockCampaignAnalytics(campaignId);

    return NextResponse.json({
      success: true,
      data: analyticsData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch campaign analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Optional: Handle POST requests for updating analytics preferences
export async function POST(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
) {
  try {
    const { campaignId } = params;
    const body = await request.json();

    // In a real implementation, this would update user preferences
    // For now, we'll just return success
    console.log(`Updating analytics preferences for campaign ${campaignId}:`, body);

    return NextResponse.json({
      success: true,
      message: 'Analytics preferences updated successfully',
      campaignId: campaignId,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error updating analytics preferences:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update analytics preferences',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}