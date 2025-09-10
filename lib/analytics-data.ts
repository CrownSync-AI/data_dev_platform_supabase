import { createBrowserClient } from '@supabase/ssr'

// Create browser client for analytics
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export interface DailyDownloadData {
  date: string
  Others: number
  Video: number
  Image: number
}

export interface DistributionData {
  name: string
  value: number
  color: string
}

export interface TopAsset {
  rank: number
  name: string
  downloads: number
  downloadCount: number
  type: string
  icon: string
}

export interface TopRetailer {
  rank: number
  name: string
  downloads: number
  downloadCount: number
  uniqueFiles: number
  campaignsJoined: number
  totalSends: number
  lastActiveDate: string
}

export interface TemplateUsageData {
  rank: number
  name: string
  usage: number
  type: string
  coverage: number
  performance: number
  retailer: string
  campaigns: number
  engagement: number
  uniqueRetailers: number
  uniqueRecipients: number
  conversionRate: number
}

export interface CampaignPerformance {
  name: string
  performance: number
  status: string
}

export interface RetailerScore {
  rank: number
  name: string
  emailResponse: number
  emailResponseTime: number
  socialResponse: number
  socialResponseTime: number
  socialPosts: number
  socialPostFreq: number
  responseQuality: string
  firstFollowupTime: number
  campaignROI: number
  overallScore: number
}

export interface WishListItem {
  rank: number
  model: string
  modelName: string
  collection: string
  size: string
  gender: string
  material: string
  mpn: string
  wishCount: number
  uniqueRetailers: number
}

export interface RegionalWishListItem {
  rank: number
  model: string
  size: string
  mpn: string
  wishCount: number
  region: string
}

export interface RegionalWishList {
  northeast: RegionalWishListItem[]
  midwest: RegionalWishListItem[]
  south: RegionalWishListItem[]
  west: RegionalWishListItem[]
}

export async function fetchDailyDownloadsData(): Promise<DailyDownloadData[]> {
  
  const { data, error } = await supabase
    .from('daily_asset_downloads')
    .select('download_date, asset_type, download_count')
    .order('download_date', { ascending: true })
  
  if (error) {
    console.error('Error fetching daily downloads:', error)
    return []
  }
  
  // Group by date and aggregate by asset type
  const groupedData: { [key: string]: { Others: number, Video: number, Image: number } } = {}
  
  data.forEach(item => {
    const date = new Date(item.download_date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })
    if (!groupedData[date]) {
      groupedData[date] = { Others: 0, Video: 0, Image: 0 }
    }
    
    if (item.asset_type.toLowerCase() === 'video') {
      groupedData[date].Video += item.download_count
    } else if (item.asset_type.toLowerCase() === 'image') {
      groupedData[date].Image += item.download_count
    } else {
      groupedData[date].Others += item.download_count
    }
  })
  
  return Object.entries(groupedData).map(([date, counts]) => ({
    date,
    ...counts
  }))
}

export async function fetchDistributionData(): Promise<DistributionData[]> {
  
  const { data, error } = await supabase
    .from('daily_asset_downloads')
    .select('asset_type, download_count')
  
  if (error) {
    console.error('Error fetching distribution data:', error)
    return []
  }
  
  const distribution: { [key: string]: number } = {}
  data.forEach(item => {
    distribution[item.asset_type] = (distribution[item.asset_type] || 0) + item.download_count
  })
  
  const colors = {
    image: '#D4AF37',
    video: '#B8860B', 
    document: '#d97706',
    others: '#8B7355',
    other: '#8B7355'
  }
  
  return Object.entries(distribution).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
    color: colors[type.toLowerCase() as keyof typeof colors] || '#6b7280'
  }))
}

export async function fetchTopDownloadedAssets(): Promise<TopAsset[]> {
  
  const { data, error } = await supabase
    .from('brand_assets')
    .select(`
      asset_name,
      asset_type,
      download_count
    `)
    .order('download_count', { ascending: false })
    .limit(10)
  
  if (error) {
    console.error('Error fetching top assets:', error)
    return []
  }
  
  return data.map((item, index) => {
    const getIcon = (type: string) => {
      switch (type.toLowerCase()) {
        case 'video': return 'Video'
        case 'image': return 'ImageIcon'
        case 'document': return 'FileText'
        default: return 'Archive'
      }
    }
    
    return {
      rank: index + 1,
      name: item.asset_name,
      downloads: item.download_count || 0,
      downloadCount: item.download_count || 0,
      type: item.asset_type,
      icon: getIcon(item.asset_type)
    }
  })
}

export async function fetchTopActiveRetailers(): Promise<TopRetailer[]> {
  
  const { data, error } = await supabase
    .from('retailer_asset_activity')
    .select(`
      retailer_id,
      activity_type,
      unique_files_count,
      users!inner(user_name, user_email)
    `)
    .eq('activity_type', 'download')
  
  if (error) {
    console.error('Error fetching top retailers:', error)
    return []
  }
  
  // Aggregate downloads by retailer
  const retailerStats: { [key: string]: { name: string, downloads: number, uniqueFiles: number } } = {}
  
  data.forEach(item => {
    const retailerId = item.retailer_id
    const user = Array.isArray(item.users) ? item.users[0] : item.users
    const retailerName = user?.user_name || user?.user_email || 'Unknown Retailer'
    
    if (!retailerStats[retailerId]) {
      retailerStats[retailerId] = {
        name: retailerName,
        downloads: 0,
        uniqueFiles: 0
      }
    }
    
    retailerStats[retailerId].downloads += 1
    retailerStats[retailerId].uniqueFiles += item.unique_files_count || 1
  })
  
  // Convert to array and sort by downloads
  const sortedRetailers = Object.entries(retailerStats)
    .map(([id, stats]) => ({
      id,
      ...stats
    }))
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 10)
  
  return sortedRetailers.map((item, index) => ({
    rank: index + 1,
    name: item.name,
    downloads: item.downloads,
    downloadCount: item.downloads,
    uniqueFiles: item.uniqueFiles,
    campaignsJoined: (index % 20) + 1,
    totalSends: ((index % 10) * 100) + 100,
    lastActiveDate: new Date(2024, 0, 1 + (index % 30)).toISOString().split('T')[0]
  }))
}

export async function fetchTemplateUsageData(): Promise<TemplateUsageData[]> {
  
  const { data, error } = await supabase
    .from('template_retailer_usage')
    .select(`
      campaign_templates!inner(template_name),
      campaigns_joined
    `)
  
  if (error) {
    console.error('Error fetching template usage:', error)
    return []
  }
  
  const usage: { [key: string]: number } = {}
  data.forEach(item => {
    const templateName = (item.campaign_templates as any).template_name
    usage[templateName] = (usage[templateName] || 0) + item.campaigns_joined
  })
  
  return Object.entries(usage).map(([template, count], index) => ({
     rank: index + 1,
     name: template,
     usage: count,
     type: 'Email',
     coverage: ((index * 7) % 100) + 1,
    performance: ((index * 11) % 100) + 1,
    retailer: `Retailer ${index + 1}`,
    campaigns: ((index * 3) % 50) + 1,
    engagement: ((index * 13) % 100) + 1,
    uniqueRetailers: ((index * 5) % 20) + 1,
    uniqueRecipients: ((index * 17) % 500) + 50,
    conversionRate: ((index * 2) % 30) + 5
   }))
}

export async function fetchRetailerScores(): Promise<RetailerScore[]> {
  
  const { data, error } = await supabase
    .from('retailer_scores')
    .select('*')
    .order('overall_rank', { ascending: true })
  
  if (error) {
    console.error('Error fetching retailer scores:', error)
    return []
  }
  
  return data.map(item => ({
    rank: item.overall_rank,
    name: item.retailer_name,
    emailResponse: item.email_response_time_hours,
    emailResponseTime: item.email_response_time_hours,
    socialResponse: item.social_response_time_hours,
    socialResponseTime: item.social_response_time_hours,
    socialPosts: item.social_post_frequency_per_week,
    socialPostFreq: item.social_post_frequency_per_week,
    responseQuality: item.response_quality_grade || 'A',
    firstFollowupTime: item.first_followup_time_hours || 24,
    campaignROI: item.campaign_roi_percentage || 150,
    overallScore: item.overall_score || 85
  }))
}

export async function fetchTopWishListItems(): Promise<WishListItem[]> {
  
  const { data, error } = await supabase
    .from('top_wish_list_items')
    .select('*')
    .order('total_wish_count', { ascending: false })
    .limit(10)
  
  if (error) {
    console.error('Error fetching wish list items:', error)
    return []
  }
  
  return data.map((item, index) => ({
    rank: index + 1,
    model: item.model_name,
    modelName: item.model_name,
    collection: item.collection_name || 'Classic',
    size: item.size || '40mm',
    gender: item.gender || 'Unisex',
    material: item.material || 'Steel',
    mpn: item.mpn || 'N/A',
    wishCount: item.total_wish_count,
    uniqueRetailers: item.unique_retailers || 5
  }))
}

export async function fetchRegionalWishLists(): Promise<RegionalWishList> {
  
  const { data, error } = await supabase
    .from('regional_wish_lists')
    .select('*')
    .order('wish_count', { ascending: false })

  if (error) {
    console.error('Error fetching regional wish lists:', error)
    return {
      northeast: [],
      midwest: [],
      south: [],
      west: []
    }
  }

  // Group data by region
  const groupedData: { [key: string]: RegionalWishListItem[] } = {
    northeast: [],
    midwest: [],
    south: [],
    west: []
  }

  data.forEach((item) => {
    const region = item.region.toLowerCase()
    if (groupedData[region]) {
      groupedData[region].push({
        rank: groupedData[region].length + 1,
        model: item.model_name,
        size: item.size,
        mpn: item.mpn,
        wishCount: item.wish_count,
        region: item.region
      })
    }
  })

  return {
    northeast: groupedData.northeast,
    midwest: groupedData.midwest,
    south: groupedData.south,
    west: groupedData.west
  }
}