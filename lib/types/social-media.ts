// Social Media Analytics Types
// Generated from Supabase schema for social media analytics integration

export interface SocialAccount {
  id: string
  user_id: string
  platform: 'linkedin' | 'facebook' | 'instagram' | 'google_business'
  account_handle?: string
  account_name?: string
  account_id?: string
  profile_url?: string
  ayrshare_profile_key?: string
  is_active: boolean
  connected_at: string
  last_sync_at?: string
  account_metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface SocialPost {
  id: string
  account_id: string
  campaign_id?: string
  ayrshare_post_id?: string
  platform_post_id?: string
  post_type?: 'image' | 'video' | 'carousel' | 'story' | 'reel' | 'text'
  content?: string
  media_urls?: string[]
  hashtags?: string[]
  scheduled_at?: string
  published_at?: string
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  post_metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface SocialAnalytics {
  id: string
  post_id: string
  account_id: string
  platform: 'linkedin' | 'facebook' | 'instagram' | 'google_business'
  analytics_date: string
  
  // Engagement Metrics
  likes: number
  comments: number
  shares: number
  reactions: number
  saves: number
  
  // Reach & Impressions
  impressions: number
  reach: number
  organic_reach: number
  paid_reach: number
  
  // Click Metrics
  link_clicks: number
  profile_clicks: number
  website_clicks: number
  
  // Video Metrics
  video_views: number
  video_completion_rate: number
  average_watch_time: number
  
  // Platform-Specific Metrics
  platform_metrics: Record<string, any>
  
  // Calculated Metrics
  engagement_rate: number
  
  created_at: string
  updated_at: string
}

export interface AccountAnalytics {
  id: string
  account_id: string
  platform: 'linkedin' | 'facebook' | 'instagram' | 'google_business'
  analytics_date: string
  
  // Follower Metrics
  followers_count: number
  following_count: number
  new_followers: number
  unfollowers: number
  net_follower_growth: number
  
  // Profile Metrics
  profile_visits: number
  profile_actions: number
  website_clicks_from_profile: number
  
  // Content Performance
  total_posts: number
  total_impressions: number
  total_reach: number
  total_engagement: number
  
  // Platform-Specific Account Metrics
  platform_account_metrics: Record<string, any>
  
  // Calculated Metrics
  average_engagement_rate: number
  follower_growth_rate: number
  
  created_at: string
  updated_at: string
}

export interface AudienceDemographics {
  id: string
  account_id: string
  platform: 'linkedin' | 'facebook' | 'instagram' | 'google_business'
  analytics_date: string
  
  // Age Demographics
  age_13_17: number
  age_18_24: number
  age_25_34: number
  age_35_44: number
  age_45_54: number
  age_55_64: number
  age_65_plus: number
  
  // Gender Demographics
  gender_male: number
  gender_female: number
  gender_other: number
  
  // Geographic Data
  top_countries: Record<string, number>
  top_cities: Record<string, number>
  
  // Interest Categories
  interests: Record<string, number>
  
  created_at: string
}

export interface HashtagPerformance {
  id: string
  account_id: string
  hashtag: string
  platform: 'linkedin' | 'facebook' | 'instagram' | 'google_business'
  analytics_date: string
  
  // Usage Metrics
  posts_count: number
  total_impressions: number
  total_reach: number
  total_engagement: number
  
  // Performance Metrics
  average_engagement_rate: number
  click_through_rate: number
  
  created_at: string
}

// View Types for Dashboard Consumption
export interface SocialPerformanceSummary {
  account_id: string
  platform: 'linkedin' | 'facebook' | 'instagram' | 'google_business'
  account_name?: string
  user_id: string
  retailer_name?: string
  region?: string
  
  // Current Period Metrics (Last 30 days)
  total_impressions: number
  total_reach: number
  total_engagement: number
  avg_engagement_rate: number
  total_clicks: number
  posts_count: number
  
  // Growth Metrics
  avg_daily_follower_growth: number
  current_followers: number
  
  // Performance Tier
  performance_tier: 'High Engagement' | 'Good Engagement' | 'Standard'
  
  last_updated: string
}

export interface TopPerformingContent {
  post_id: string
  content?: string
  post_type?: string
  platform: string
  account_name?: string
  retailer_name?: string
  
  impressions: number
  reach: number
  engagement_rate: number
  total_engagement: number
  link_clicks: number
  
  published_at?: string
  hashtags?: string[]
  
  platform_rank: number
}

// API Request/Response Types
export interface SocialAnalyticsFilters {
  platform?: string[]
  region?: string
  performanceTier?: string
  dateRange?: {
    start: string
    end: string
  }
  retailerId?: string
}

export interface SocialMetricsResponse {
  totalReach: number
  totalEngagement: number
  avgEngagementRate: number
  totalClicks: number
  newFollowers: number
  platformBreakdown: {
    platform: string
    reach: number
    engagement: number
    followers: number
  }[]
}

export interface EngagementTrendData {
  date: string
  platform: string
  engagement_rate: number
  reach: number
  follower_growth: number
}

export interface PlatformPerformanceData {
  platform: string
  engagement_rate: number
  reach_efficiency: number
  click_through_rate: number
  follower_growth_rate: number
  content_frequency: number
  response_time?: number
}

export interface RetailerSocialData {
  retailer_id: string
  retailer_name: string
  region: string
  platforms: string[]
  total_followers: number
  avg_engagement_rate: number
  content_frequency: number
  performance_grade: 'A' | 'B' | 'C'
  growth_trend: number
  last_activity: string
  rank: number
}

// Platform-Specific Types
export interface LinkedInMetrics {
  company_followers: number
  page_views: number
  unique_visitors: number
  career_page_clicks: number
  employee_advocacy_reach: number
  lead_form_submissions: number
}

export interface InstagramMetrics {
  story_views: number
  story_completion_rate: number
  reel_views: number
  reel_shares: number
  shopping_product_taps: number
  profile_visits: number
}

export interface FacebookMetrics {
  page_likes: number
  page_follows: number
  post_reach: number
  video_views: number
  event_responses: number
}

export interface GoogleBusinessMetrics {
  profile_views: number
  search_views: number
  map_views: number
  direction_requests: number
  phone_calls: number
  website_clicks: number
  booking_requests: number
  photo_views: number
  average_rating: number
  total_reviews: number
}

// Ayrshare API Integration Types
export interface AyrshareAccountResponse {
  platform: string
  profileKey: string
  metrics: {
    followers: number
    following: number
    posts: number
    engagement_rate: number
    reach: number
    impressions: number
  }
  demographics?: {
    age_groups: Record<string, number>
    gender: Record<string, number>
    top_locations: Record<string, number>
    interests: Record<string, number>
  }
}

export interface AyrsharePostResponse {
  post_id: string
  platform: string
  content: string
  media_type: string
  published_at: string
  metrics: {
    impressions: number
    reach: number
    likes: number
    comments: number
    shares: number
    engagement_rate: number
    link_clicks: number
  }
}

// Component Props Types
export interface SocialMetricCardProps {
  title: string
  value: string | number
  change: string
  platform: 'all' | 'linkedin' | 'instagram' | 'facebook' | 'google'
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
}

export interface TimeRangeSelectorProps {
  defaultValue: string
  options: { label: string; value: string }[]
  onRangeChange: (range: string) => void
}

export interface PlatformFilterProps {
  selectedPlatforms: string[]
  onFilterChange: (platforms: string[]) => void
}

export interface RegionFilterProps {
  selectedRegion: string
  onFilterChange: (region: string) => void
}

// Export utility types
export type Platform = 'linkedin' | 'facebook' | 'instagram' | 'google_business'
export type PostType = 'image' | 'video' | 'carousel' | 'story' | 'reel' | 'text'
export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed'
export type PerformanceTier = 'High Engagement' | 'Good Engagement' | 'Standard'
export type PerformanceGrade = 'A' | 'B' | 'C'
export type TrendDirection = 'up' | 'down' | 'neutral'