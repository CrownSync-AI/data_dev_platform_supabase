// Mock data source for Brand Campaign Performance
// This centralizes all campaign-related data for consistent metrics across components

export interface RetailerPerformance {
    id: string
    name: string
    region: string
    posts: number
    engagement: number
    reach: number
    engagementRate: number
    followers: number
    postingFrequency: number
    performance: string
    growth: number
    topPlatform: string
}

export interface PlatformData {
    status: 'posted' | 'not_posted' | 'not_planned'
    postTime?: string
    postUrl?: string
    engagement?: number
    reach?: number
    likes?: number
    comments?: number
    shares?: number
    scheduledTime?: string
    reason?: string
}

export interface RetailerPostingData {
    id: string
    name: string
    region: string
    platforms: {
        [key: string]: PlatformData
    }
}

export interface PlatformPerformance {
    platform: string
    color: string
    posts: number
    engagement: number
    reach: number
    engagementRate: number
    growth: number
    topContentType: string
}

export interface CampaignMetrics {
    totalPosts: number
    totalEngagement: number
    totalReach: number
    avgEngagementRate: number
    totalRetailers: number
    activeRetailers: number
    platformsUsed: number
}

// Retailer Performance Data
export const retailerPerformance: RetailerPerformance[] = [
    {
        id: 'retailer-001',
        name: 'Luxury Boutique NYC',
        region: 'East',
        posts: 24,
        engagement: 8420,
        reach: 145000,
        engagementRate: 5.81,
        followers: 89000,
        postingFrequency: 4.2,
        performance: 'excellent',
        growth: 18.5,
        topPlatform: 'Instagram'
    },
    {
        id: 'retailer-002',
        name: 'Fashion Forward LA',
        region: 'West',
        posts: 18,
        engagement: 6240,
        reach: 112000,
        engagementRate: 5.57,
        followers: 67000,
        postingFrequency: 3.8,
        performance: 'excellent',
        growth: 15.2,
        topPlatform: 'TikTok'
    },
    {
        id: 'retailer-003',
        name: 'Style Central Chicago',
        region: 'Central',
        posts: 16,
        engagement: 4680,
        reach: 89000,
        engagementRate: 5.26,
        followers: 54000,
        postingFrequency: 3.2,
        performance: 'good',
        growth: 12.8,
        topPlatform: 'Instagram'
    },
    {
        id: 'retailer-004',
        name: 'Trend Setters Miami',
        region: 'South',
        posts: 22,
        engagement: 7120,
        reach: 128000,
        engagementRate: 5.56,
        followers: 72000,
        postingFrequency: 4.1,
        performance: 'excellent',
        growth: 16.9,
        topPlatform: 'Instagram'
    },
    {
        id: 'retailer-005',
        name: 'Urban Style Dallas',
        region: 'South',
        posts: 14,
        engagement: 3840,
        reach: 68000,
        engagementRate: 5.65,
        followers: 41000,
        postingFrequency: 2.8,
        performance: 'good',
        growth: 11.4,
        topPlatform: 'Facebook'
    },
    {
        id: 'retailer-006',
        name: 'Metro Mode SF',
        region: 'West',
        posts: 25,
        engagement: 8500,
        reach: 156000,
        engagementRate: 5.45,
        followers: 92000,
        postingFrequency: 4.5,
        performance: 'excellent',
        growth: 19.2,
        topPlatform: 'Instagram'
    },
    {
        id: 'retailer-007',
        name: 'Capital Chic DC',
        region: 'East',
        posts: 19,
        engagement: 5100,
        reach: 98000,
        engagementRate: 5.20,
        followers: 58000,
        postingFrequency: 3.5,
        performance: 'good',
        growth: 13.5,
        topPlatform: 'LinkedIn'
    },
    {
        id: 'retailer-008',
        name: 'Vogue Valley Austin',
        region: 'South',
        posts: 15,
        engagement: 3200,
        reach: 62000,
        engagementRate: 5.16,
        followers: 38000,
        postingFrequency: 2.9,
        performance: 'average',
        growth: 8.4,
        topPlatform: 'Instagram'
    },
    {
        id: 'retailer-009',
        name: 'Harbor Trends Boston',
        region: 'East',
        posts: 10,
        engagement: 1800,
        reach: 45000,
        engagementRate: 4.00,
        followers: 28000,
        postingFrequency: 2.0,
        performance: 'poor',
        growth: 2.1,
        topPlatform: 'Facebook'
    },
    {
        id: 'retailer-010',
        name: 'Mountain High Denver',
        region: 'West',
        posts: 12,
        engagement: 2100,
        reach: 52000,
        engagementRate: 4.04,
        followers: 31000,
        postingFrequency: 2.2,
        performance: 'poor',
        growth: 3.5,
        topPlatform: 'Instagram'
    },
    {
        id: 'retailer-011',
        name: 'Peach State Fashion Atlanta',
        region: 'South',
        posts: 20,
        engagement: 6800,
        reach: 115000,
        engagementRate: 5.91,
        followers: 75000,
        postingFrequency: 3.9,
        performance: 'excellent',
        growth: 16.2,
        topPlatform: 'Instagram'
    },
    {
        id: 'retailer-012',
        name: 'Rain City Styles Seattle',
        region: 'West',
        posts: 17,
        engagement: 4200,
        reach: 82000,
        engagementRate: 5.12,
        followers: 48000,
        postingFrequency: 3.1,
        performance: 'average',
        growth: 9.8,
        topPlatform: 'Facebook'
    },
    {
        id: 'retailer-013',
        name: 'Motor City Mods Detroit',
        region: 'Central',
        posts: 11,
        engagement: 1950,
        reach: 48000,
        engagementRate: 4.06,
        followers: 29000,
        postingFrequency: 2.1,
        performance: 'poor',
        growth: 1.8,
        topPlatform: 'Facebook'
    }
]

// Platform Posting Status Matrix Data
export const retailerPostingData: RetailerPostingData[] = [
    {
        id: 'retailer-001',
        name: 'Luxury Boutique NYC',
        region: 'East',
        platforms: {
            instagram: {
                status: 'posted',
                postTime: '2025-03-15 14:30',
                postUrl: 'https://instagram.com/p/example1',
                engagement: 1245,
                reach: 18200,
                likes: 1089,
                comments: 87,
                shares: 69
            },
            facebook: {
                status: 'posted',
                postTime: '2025-03-15 15:00',
                postUrl: 'https://facebook.com/post/example1',
                engagement: 892,
                reach: 12400,
                likes: 734,
                comments: 94,
                shares: 64
            },
            x: {
                status: 'not_planned',
                reason: 'Not part of campaign strategy'
            },
            linkedin: {
                status: 'posted',
                postTime: '2025-03-16 09:00',
                postUrl: 'https://linkedin.com/post/example1',
                engagement: 456,
                reach: 8900,
                likes: 378,
                comments: 45,
                shares: 33
            }
        }
    },
    {
        id: 'retailer-002',
        name: 'Fashion Forward LA',
        region: 'West',
        platforms: {
            instagram: {
                status: 'posted',
                postTime: '2025-03-14 18:20',
                postUrl: 'https://instagram.com/p/example2',
                engagement: 2134,
                reach: 24800,
                likes: 1876,
                comments: 156,
                shares: 102
            },
            facebook: {
                status: 'posted',
                postTime: '2025-03-14 19:00',
                postUrl: 'https://facebook.com/post/example2',
                engagement: 1245,
                reach: 16700,
                likes: 1034,
                comments: 123,
                shares: 88
            },
            x: {
                status: 'posted',
                postTime: '2025-03-15 12:30',
                postUrl: 'https://x.com/post/example2',
                engagement: 678,
                reach: 11200,
                likes: 534,
                comments: 89,
                shares: 55
            },
            linkedin: {
                status: 'not_posted',
                reason: 'Pending content approval'
            }
        }
    },
    {
        id: 'retailer-003',
        name: 'Style Central Chicago',
        region: 'Central',
        platforms: {
            instagram: {
                status: 'posted',
                postTime: '2025-03-16 12:15',
                postUrl: 'https://instagram.com/p/example3',
                engagement: 987,
                reach: 15600,
                likes: 823,
                comments: 98,
                shares: 66
            },
            facebook: {
                status: 'not_posted',
                reason: 'Awaiting final creative approval'
            },
            x: {
                status: 'not_planned',
                reason: 'Not active on this platform'
            },
            linkedin: {
                status: 'posted',
                postTime: '2025-03-17 10:00',
                postUrl: 'https://linkedin.com/post/example3',
                engagement: 345,
                reach: 6800,
                likes: 267,
                comments: 43,
                shares: 35
            }
        }
    },
    {
        id: 'retailer-004',
        name: 'Trend Setters Miami',
        region: 'South',
        platforms: {
            instagram: {
                status: 'posted',
                postTime: '2025-03-13 11:45',
                postUrl: 'https://instagram.com/p/example4',
                engagement: 1567,
                reach: 21300,
                likes: 1323,
                comments: 145,
                shares: 99
            },
            facebook: {
                status: 'posted',
                postTime: '2025-03-13 12:30',
                postUrl: 'https://facebook.com/post/example4',
                engagement: 1089,
                reach: 14200,
                likes: 876,
                comments: 134,
                shares: 79
            },
            x: {
                status: 'posted',
                postTime: '2025-03-14 09:15',
                postUrl: 'https://x.com/post/example4',
                engagement: 534,
                reach: 9100,
                likes: 423,
                comments: 67,
                shares: 44
            },
            linkedin: {
                status: 'posted',
                postTime: '2025-03-15 08:00',
                postUrl: 'https://linkedin.com/post/example4',
                engagement: 423,
                reach: 7600,
                likes: 334,
                comments: 56,
                shares: 33
            }
        }
    },
    {
        id: 'retailer-005',
        name: 'Urban Style Dallas',
        region: 'South',
        platforms: {
            instagram: {
                status: 'not_posted',
                reason: 'Missed posting window'
            },
            facebook: {
                status: 'posted',
                postTime: '2025-03-12 16:20',
                postUrl: 'https://facebook.com/post/example5',
                engagement: 756,
                reach: 11800,
                likes: 612,
                comments: 89,
                shares: 55
            },
            x: {
                status: 'not_planned',
                reason: 'Platform not active for this retailer'
            },
            linkedin: {
                status: 'not_posted',
                reason: 'Content under legal review'
            }
        }
    },
    {
        id: 'retailer-006',
        name: 'Chic Boutique Seattle',
        region: 'West',
        platforms: {
            instagram: {
                status: 'posted',
                postTime: '2025-03-17 13:00',
                postUrl: 'https://instagram.com/p/example6',
                engagement: 1123,
                reach: 17400,
                likes: 945,
                comments: 112,
                shares: 66
            },
            facebook: {
                status: 'not_posted',
                reason: 'Technical issue with API'
            },
            x: {
                status: 'posted',
                postTime: '2025-03-17 14:30',
                postUrl: 'https://x.com/post/example6',
                engagement: 445,
                reach: 8200,
                likes: 356,
                comments: 54,
                shares: 35
            },
            linkedin: {
                status: 'posted',
                postTime: '2025-03-18 09:30',
                postUrl: 'https://linkedin.com/post/example6',
                engagement: 389,
                reach: 7100,
                likes: 312,
                comments: 48,
                shares: 29
            }
        }
    }
]

// Platform Performance Data
export const platformPerformance: PlatformPerformance[] = [
    {
        platform: 'Instagram',
        color: '#E1306C',
        posts: 89,
        engagement: 28450,
        reach: 485000,
        engagementRate: 5.87,
        growth: 22.5,
        topContentType: 'Reels'
    },
    {
        platform: 'Facebook',
        color: '#1877F2',
        posts: 67,
        engagement: 19230,
        reach: 342000,
        engagementRate: 5.62,
        growth: 18.3,
        topContentType: 'Video'
    },
    {
        platform: 'X (Twitter)',
        color: '#000000',
        posts: 45,
        engagement: 12890,
        reach: 256000,
        engagementRate: 5.03,
        growth: 15.7,
        topContentType: 'Thread'
    },
    {
        platform: 'LinkedIn',
        color: '#0A66C2',
        posts: 34,
        engagement: 8920,
        reach: 178000,
        engagementRate: 5.01,
        growth: 12.4,
        topContentType: 'Article'
    }
]

// Calculate aggregate campaign metrics
export function getCampaignMetrics(): CampaignMetrics {
    const totalPosts = retailerPerformance.reduce((sum, r) => sum + r.posts, 0)
    const totalEngagement = retailerPerformance.reduce((sum, r) => sum + r.engagement, 0)
    const totalReach = retailerPerformance.reduce((sum, r) => sum + r.reach, 0)
    const avgEngagementRate = retailerPerformance.reduce((sum, r) => sum + r.engagementRate, 0) / retailerPerformance.length
    const totalRetailers = retailerPerformance.length
    const activeRetailers = retailerPerformance.filter(r => r.posts > 0).length
    const platformsUsed = platformPerformance.length

    return {
        totalPosts,
        totalEngagement,
        totalReach,
        avgEngagementRate: Number(avgEngagementRate.toFixed(2)),
        totalRetailers,
        activeRetailers,
        platformsUsed
    }
}

// Calculate regional data dynamically
export function calculateRegionalData() {
    const regions = ['East', 'West', 'Central', 'South']

    return regions.map(regionName => {
        const regionRetailers = retailerPerformance.filter(r => r.region === regionName)
        const totalEngagement = regionRetailers.reduce((sum, r) => sum + r.engagement, 0)
        const totalReach = regionRetailers.reduce((sum, r) => sum + r.reach, 0)
        const totalPosts = regionRetailers.reduce((sum, r) => sum + r.posts, 0)
        const avgEngagementRate = regionRetailers.length > 0
            ? regionRetailers.reduce((sum, r) => sum + r.engagementRate, 0) / regionRetailers.length
            : 0
        const avgGrowth = regionRetailers.length > 0
            ? regionRetailers.reduce((sum, r) => sum + r.growth, 0) / regionRetailers.length
            : 0
        const topRetailer = regionRetailers.length > 0
            ? regionRetailers.sort((a, b) => b.engagementRate - a.engagementRate)[0].name
            : 'N/A'

        // Calculate performance score (0-100) based on engagement rate and growth
        const performance = Math.min(100, Math.round(
            (avgEngagementRate * 10) + (avgGrowth * 2)
        ))

        return {
            region: regionName,
            retailers: regionRetailers.length,
            posts: totalPosts,
            engagement: totalEngagement,
            reach: totalReach,
            engagementRate: Number(avgEngagementRate.toFixed(2)),
            performance,
            growth: Number(avgGrowth.toFixed(1)),
            topRetailer,
            cities: [] // Can be populated if needed
        }
    }).filter(r => r.retailers > 0) // Only include regions with retailers
}

// Async wrapper functions for consistency with existing patterns
export async function fetchRetailerPerformance(): Promise<RetailerPerformance[]> {
    return Promise.resolve(retailerPerformance)
}

export async function fetchRetailerPostingData(): Promise<RetailerPostingData[]> {
    return Promise.resolve(retailerPostingData)
}

export async function fetchPlatformPerformance(): Promise<PlatformPerformance[]> {
    return Promise.resolve(platformPerformance)
}

export async function fetchCampaignMetrics(): Promise<CampaignMetrics> {
    return Promise.resolve(getCampaignMetrics())
}

export async function fetchRegionalData() {
    return Promise.resolve(calculateRegionalData())
}
