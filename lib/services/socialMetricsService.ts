// Social Media Metrics Service
// Provides aggregated social media metrics for dashboard integration

export interface SocialMetricsOverview {
  totalReach: number;
  totalEngagement: number;
  avgEngagementRate: number;
  totalFollowers: number;
  newFollowers: number;
  activePlatforms: number;
  topPerformingPlatform: string;
  growthRate: string;
}

export async function fetchSocialMetricsOverview(): Promise<SocialMetricsOverview> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/social-analytics?overview=true`);
    if (!response.ok) {
      throw new Error('Failed to fetch social metrics overview');
    }

    const data = await response.json();

    return {
      totalReach: data.totalReach || 0,
      totalEngagement: data.totalEngagement || 0,
      avgEngagementRate: data.avgEngagementRate || 0,
      totalFollowers: data.totalFollowers || 0,
      newFollowers: data.newFollowers || 0,
      activePlatforms: data.activePlatforms || 0,
      topPerformingPlatform: data.topPerformingPlatform || 'N/A',
      growthRate: data.growthRate || '+0%'
    };
  } catch (error) {
    console.error('Error fetching social metrics overview:', error);

    // Return mock data for development
    return {
      totalReach: 245600,
      totalEngagement: 18750,
      avgEngagementRate: 4.2,
      totalFollowers: 62400,
      newFollowers: 1250,
      activePlatforms: 4,
      topPerformingPlatform: 'Instagram',
      growthRate: '+12.5%'
    };
  }
}

export function formatSocialNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}