// Mock Campaign Analytics Service based on Ayrshare Data Structure
// This service generates realistic analytics data following Ayrshare's API format

interface AyrsharePost {
  id: string;
  postUrl: string;
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'youtube';
  analytics: any;
  lastUpdated: string;
  nextUpdate: string;
}

interface CampaignAnalytics {
  campaign: {
    id: string;
    name: string;
    status: string;
    startDate: string;
    endDate: string;
    type: string;
  };
  summary: {
    currentPeriodER: number;
    previousPeriodER: number;
    changePercent: number;
    totalReach: number;
    totalEngagement: number;
    totalImpressions: number;
    avgEngagementRate: number;
  };
  driverAnalysis: {
    totalLift: number;
    drivers: Array<{
      name: string;
      contribution: number;
      percentage: number;
      type: 'positive' | 'negative';
      description: string;
    }>;
    insights: string[];
  };
  platformPerformance: Array<{
    platform: string;
    metrics: {
      impressions: number;
      reach: number;
      engagement: number;
      engagementRate: number;
      clicks?: number;
      shares?: number;
      saves?: number;
    };
    trend: 'up' | 'down' | 'stable';
    posts: AyrsharePost[];
  }>;
  topPosts: Array<{
    id: string;
    platform: string;
    content: string;
    mediaUrl?: string;
    metrics: any;
    contribution: number;
    publishedAt: string;
    diagnostics: {
      timing: 'optimal' | 'good' | 'poor';
      format: 'video' | 'image' | 'carousel' | 'text';
      caption: 'strong' | 'moderate' | 'weak';
      hashtags: number;
      cta: boolean;
      audienceMatch: 'high' | 'medium' | 'low';
    };
  }>;
  recommendations: Array<{
    id: string;
    priority: 'high' | 'medium' | 'low';
    category: 'budget' | 'content' | 'timing' | 'audience';
    title: string;
    description: string;
    estimatedImpact: string;
    action: string;
    actionType: 'copy_template' | 'share_retailer' | 'generate_assets' | 'schedule_post' | 'create_task';
  }>;
}

export function generateMockCampaignAnalytics(campaignId: string): CampaignAnalytics {
  // Handle both brand campaigns (simple IDs) and retailer campaigns (UUID-based IDs)
  const brandCampaigns = {
    '1': 'Spring Collection Preview',
    '2': 'Holiday Luxury Campaign',
    '3': 'Winter Elegance Collection',
    '4': 'Winter Wonderland Exclusive',
    '5': 'Artisan Heritage Collection',
    '6': 'Timeless Elegance Launch',
    '7': 'Modern Minimalist Series',
    '8': 'Luxury Lifestyle Showcase'
  };

  // Extract campaign name from retailer campaign IDs or use brand campaign mapping
  let campaignName = 'Unknown Campaign';
  
  if (brandCampaigns[campaignId as keyof typeof brandCampaigns]) {
    campaignName = brandCampaigns[campaignId as keyof typeof brandCampaigns];
  } else if (campaignId.includes('campaign-')) {
    // Retailer campaign ID format: retailerId-campaign-X-type
    const campaignTemplates = [
      'Spring Collection Preview',
      'Holiday Luxury Campaign', 
      'Summer Elegance 2025',
      'Winter Wonderland Exclusive',
      'Artisan Heritage Collection',
      'Timeless Elegance Launch',
      'Modern Minimalist Series',
      'Luxury Lifestyle Showcase'
    ];
    
    // Extract campaign number from ID
    const match = campaignId.match(/campaign-(\d+)/);
    if (match) {
      const campaignIndex = parseInt(match[1]) - 1;
      if (campaignIndex >= 0 && campaignIndex < campaignTemplates.length) {
        campaignName = campaignTemplates[campaignIndex];
      }
    }
  }

  // Generate realistic metrics based on campaign performance
  const baseER = Math.random() * 2 + 1; // 1-3% base engagement rate
  const previousER = baseER * (0.7 + Math.random() * 0.6); // Previous period variation
  const changePercent = ((baseER - previousER) / previousER) * 100;

  const totalImpressions = Math.floor(Math.random() * 500000 + 200000);
  const totalReach = Math.floor(totalImpressions * (0.6 + Math.random() * 0.3));
  const totalEngagement = Math.floor(totalReach * (baseER / 100));

  return {
    campaign: {
      id: campaignId,
      name: campaignName,
      status: 'active',
      startDate: '2025-09-15',
      endDate: '2025-10-15',
      type: 'social'
    },
    summary: {
      currentPeriodER: baseER,
      previousPeriodER: previousER,
      changePercent: changePercent,
      totalReach: totalReach,
      totalEngagement: totalEngagement,
      totalImpressions: totalImpressions,
      avgEngagementRate: baseER
    },
    driverAnalysis: generateDriverAnalysis(changePercent),
    platformPerformance: generatePlatformPerformance(totalImpressions, totalReach, totalEngagement),
    topPosts: generateTopPosts(),
    recommendations: generateRecommendations(changePercent, baseER)
  };
}

function generateDriverAnalysis(changePercent: number) {
  const drivers = [
    {
      name: 'Instagram Follower Growth',
      contribution: 0.32,
      percentage: 15.2,
      type: 'positive' as const,
      description: '+10% follower growth increased reach and engagement'
    },
    {
      name: 'Video Content Increase',
      contribution: 0.18,
      percentage: 8.5,
      type: 'positive' as const,
      description: '+20% video content proportion improved engagement rates'
    },
    {
      name: 'Posting Frequency',
      contribution: 0.12,
      percentage: 5.7,
      type: 'positive' as const,
      description: 'Increased posting frequency from 3 to 5 posts/week'
    },
    {
      name: 'Twitter Click-through Decline',
      contribution: -0.08,
      percentage: -3.8,
      type: 'negative' as const,
      description: 'Weak CTAs and suboptimal posting times reduced clicks'
    },
    {
      name: 'LinkedIn Reach Drop',
      contribution: -0.05,
      percentage: -2.4,
      type: 'negative' as const,
      description: 'Algorithm changes affected organic reach'
    }
  ];

  const insights = [
    `This period's engagement rate ${changePercent > 0 ? 'increased' : 'decreased'} by ${Math.abs(changePercent).toFixed(1)}%, primarily driven by Instagram follower growth and increased video content.`,
    'Instagram video content performed 40% better than static images, contributing significantly to overall engagement lift.',
    'Twitter performance declined due to weak call-to-action messaging and posting outside peak engagement hours.'
  ];

  return {
    totalLift: changePercent / 100,
    drivers: drivers,
    insights: insights
  };
}

function generatePlatformPerformance(totalImpressions: number, totalReach: number, totalEngagement: number) {
  const platforms = ['instagram', 'facebook', 'twitter', 'linkedin'];
  
  return platforms.map(platform => {
    const platformShare = Math.random() * 0.4 + 0.15; // 15-55% share per platform
    const impressions = Math.floor(totalImpressions * platformShare);
    const reach = Math.floor(totalReach * platformShare);
    const engagement = Math.floor(totalEngagement * platformShare);
    const engagementRate = (engagement / impressions) * 100;

    return {
      platform: platform,
      metrics: {
        impressions: impressions,
        reach: reach,
        engagement: engagement,
        engagementRate: engagementRate,
        clicks: platform === 'twitter' ? Math.floor(engagement * 0.3) : undefined,
        shares: Math.floor(engagement * 0.1),
        saves: platform === 'instagram' ? Math.floor(engagement * 0.05) : undefined
      },
      trend: Math.random() > 0.5 ? 'up' : (Math.random() > 0.5 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
      posts: generatePlatformPosts(platform, 5)
    };
  });
}

function generatePlatformPosts(platform: string, count: number): AyrsharePost[] {
  const posts: AyrsharePost[] = [];
  
  for (let i = 0; i < count; i++) {
    const postId = `${platform}_post_${i + 1}`;
    const post: AyrsharePost = {
      id: postId,
      postUrl: `https://www.${platform}.com/post/${postId}`,
      platform: platform as any,
      analytics: generatePlatformSpecificAnalytics(platform),
      lastUpdated: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      nextUpdate: new Date(Date.now() + 15 * 60 * 1000).toISOString()
    };
    posts.push(post);
  }
  
  return posts;
}

function generatePlatformSpecificAnalytics(platform: string) {
  const baseImpressions = Math.floor(Math.random() * 50000 + 10000);
  const baseReach = Math.floor(baseImpressions * (0.6 + Math.random() * 0.3));
  const baseEngagement = Math.floor(baseReach * (Math.random() * 0.05 + 0.01));

  switch (platform) {
    case 'instagram':
      return {
        caption: "Discover timeless elegance with our latest collection ✨ #LuxuryWatches #Elegance",
        commentsCount: Math.floor(Math.random() * 50 + 5),
        created: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        engagementCount: baseEngagement,
        likeCount: Math.floor(baseEngagement * 0.8),
        mediaProductType: Math.random() > 0.5 ? "REELS" : "FEED",
        mediaType: Math.random() > 0.6 ? "VIDEO" : "IMAGE",
        reachCount: baseReach,
        savedCount: Math.floor(baseEngagement * 0.1),
        sharesCount: Math.floor(baseEngagement * 0.05),
        viewsCount: baseImpressions,
        username: "luxurybrand"
      };

    case 'facebook':
      return {
        impressions: baseImpressions,
        impressionsUnique: baseReach,
        likeCount: Math.floor(baseEngagement * 0.7),
        commentsCount: Math.floor(Math.random() * 30 + 2),
        sharesCount: Math.floor(baseEngagement * 0.08),
        reactions: {
          like: Math.floor(baseEngagement * 0.6),
          love: Math.floor(baseEngagement * 0.2),
          wow: Math.floor(baseEngagement * 0.1),
          haha: Math.floor(baseEngagement * 0.05),
          anger: Math.floor(baseEngagement * 0.02),
          sorry: Math.floor(baseEngagement * 0.03),
          total: baseEngagement
        },
        videoViews: Math.random() > 0.5 ? Math.floor(baseImpressions * 0.8) : undefined
      };

    case 'twitter':
      return {
        created: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        post: "Craftsmanship meets innovation in our latest timepiece collection. Discover excellence. #LuxuryWatches #Craftsmanship",
        publicMetrics: {
          retweetCount: Math.floor(baseEngagement * 0.15),
          quoteCount: Math.floor(baseEngagement * 0.05),
          likeCount: Math.floor(baseEngagement * 0.7),
          replyCount: Math.floor(baseEngagement * 0.1),
          bookmarkCount: Math.floor(baseEngagement * 0.08),
          impressionCount: baseImpressions
        },
        nonPublicMetrics: {
          userProfileClicks: Math.floor(baseEngagement * 0.12),
          engagements: baseEngagement,
          impressionCount: baseImpressions
        }
      };

    case 'linkedin':
      return {
        clickCount: Math.floor(baseEngagement * 0.2),
        commentCount: Math.floor(Math.random() * 20 + 1),
        engagement: (baseEngagement / baseImpressions) * 100,
        impressionCount: baseImpressions,
        likeCount: Math.floor(baseEngagement * 0.8),
        reactions: {
          like: Math.floor(baseEngagement * 0.6),
          praise: Math.floor(baseEngagement * 0.2),
          interest: Math.floor(baseEngagement * 0.15),
          empathy: Math.floor(baseEngagement * 0.03),
          maybe: Math.floor(baseEngagement * 0.02)
        },
        shareCount: Math.floor(baseEngagement * 0.1),
        uniqueImpressionsCount: baseReach
      };

    default:
      return {
        impressions: baseImpressions,
        reach: baseReach,
        engagement: baseEngagement
      };
  }
}

function generateTopPosts() {
  const posts = [
    {
      id: 'post_1',
      platform: 'instagram',
      content: 'Discover the art of precision with our Heritage Collection ⌚✨ Each timepiece tells a story of craftsmanship spanning generations. #LuxuryWatches #Heritage #Craftsmanship',
      mediaUrl: 'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=400&h=400&fit=crop',
      metrics: {
        impressions: 45230,
        reach: 38940,
        engagement: 1847,
        engagementRate: 4.08,
        likes: 1456,
        comments: 89,
        shares: 234,
        saves: 68
      },
      contribution: 18.5,
      publishedAt: '2025-10-01T14:30:00Z',
      diagnostics: {
        timing: 'optimal' as const,
        format: 'video' as const,
        caption: 'strong' as const,
        hashtags: 3,
        cta: true,
        audienceMatch: 'high' as const
      }
    },
    {
      id: 'post_2',
      platform: 'facebook',
      content: 'Behind the scenes: Master watchmakers at work creating tomorrow\'s heirlooms. See the dedication that goes into every detail.',
      mediaUrl: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop',
      metrics: {
        impressions: 38920,
        reach: 32150,
        engagement: 1234,
        engagementRate: 3.17,
        likes: 987,
        comments: 156,
        shares: 91
      },
      contribution: 15.2,
      publishedAt: '2025-09-28T16:45:00Z',
      diagnostics: {
        timing: 'good' as const,
        format: 'image' as const,
        caption: 'strong' as const,
        hashtags: 2,
        cta: false,
        audienceMatch: 'high' as const
      }
    },
    {
      id: 'post_3',
      platform: 'linkedin',
      content: 'Innovation meets tradition: How our R&D team is pushing the boundaries of horological excellence while honoring our 150-year legacy.',
      metrics: {
        impressions: 28450,
        reach: 24380,
        engagement: 892,
        engagementRate: 3.14,
        likes: 654,
        comments: 78,
        shares: 160
      },
      contribution: 12.8,
      publishedAt: '2025-09-30T09:15:00Z',
      diagnostics: {
        timing: 'optimal' as const,
        format: 'text' as const,
        caption: 'strong' as const,
        hashtags: 1,
        cta: true,
        audienceMatch: 'medium' as const
      }
    },
    {
      id: 'post_4',
      platform: 'twitter',
      content: 'Time is the most precious gift. Make every moment count with precision that lasts generations. 🕰️ #TimeMatters #LuxuryLifestyle',
      metrics: {
        impressions: 22340,
        reach: 19230,
        engagement: 567,
        engagementRate: 2.54,
        likes: 423,
        retweets: 89,
        replies: 55
      },
      contribution: 8.9,
      publishedAt: '2025-10-02T11:20:00Z',
      diagnostics: {
        timing: 'good' as const,
        format: 'text' as const,
        caption: 'moderate' as const,
        hashtags: 2,
        cta: false,
        audienceMatch: 'medium' as const
      }
    },
    {
      id: 'post_5',
      platform: 'instagram',
      content: 'New arrival: The Midnight Collection. Where darkness meets brilliance. Available exclusively at select retailers.',
      mediaUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
      metrics: {
        impressions: 31280,
        reach: 26940,
        engagement: 743,
        engagementRate: 2.37,
        likes: 589,
        comments: 67,
        shares: 87
      },
      contribution: 7.3,
      publishedAt: '2025-09-29T18:00:00Z',
      diagnostics: {
        timing: 'poor' as const,
        format: 'image' as const,
        caption: 'moderate' as const,
        hashtags: 0,
        cta: true,
        audienceMatch: 'low' as const
      }
    }
  ];

  return posts;
}

function generateRecommendations(changePercent: number, currentER: number) {
  const recommendations = [
    {
      id: 'rec_1',
      priority: 'high' as const,
      category: 'content' as const,
      title: 'Increase Video Content Proportion',
      description: 'Video posts are generating 40% higher engagement rates than static images. Increase video content to ≥60% of total posts.',
      estimatedImpact: '+0.3pp engagement rate increase',
      action: 'Create video content calendar',
      actionType: 'generate_assets' as const
    },
    {
      id: 'rec_2',
      priority: 'high' as const,
      category: 'budget' as const,
      title: 'Reallocate Budget to Instagram',
      description: 'Instagram is driving 45% of total engagement with only 30% of budget allocation. Increase Instagram spend by 20%.',
      estimatedImpact: '+15% reach, +0.2pp ER',
      action: 'Adjust budget allocation',
      actionType: 'create_task' as const
    },
    {
      id: 'rec_3',
      priority: 'medium' as const,
      category: 'timing' as const,
      title: 'Optimize Twitter Posting Schedule',
      description: 'Twitter posts are underperforming due to suboptimal timing. Shift to 8-10 AM and 6-8 PM posting windows.',
      estimatedImpact: '+25% click-through rate',
      action: 'Update posting schedule',
      actionType: 'schedule_post' as const
    },
    {
      id: 'rec_4',
      priority: 'medium' as const,
      category: 'content' as const,
      title: 'Strengthen Call-to-Action Messages',
      description: 'Posts with clear CTAs are generating 35% more clicks. Add compelling CTAs to all social posts.',
      estimatedImpact: '+0.15pp engagement rate',
      action: 'Copy high-performing CTA templates',
      actionType: 'copy_template' as const
    },
    {
      id: 'rec_5',
      priority: 'low' as const,
      category: 'audience' as const,
      title: 'Expand LinkedIn Targeting',
      description: 'LinkedIn audience match is only 65%. Expand targeting to include luxury goods enthusiasts and collectors.',
      estimatedImpact: '+10% reach expansion',
      action: 'Update audience targeting',
      actionType: 'create_task' as const
    }
  ];

  return recommendations;
}