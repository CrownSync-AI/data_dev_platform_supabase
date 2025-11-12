// Temporarily disabled Supabase - using fake data for demo
// import { createBrowserClient } from '@supabase/ssr'

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
  // Fake data for demo
  return [
    { date: '01/01', Others: 45, Video: 89, Image: 156 },
    { date: '01/02', Others: 52, Video: 95, Image: 168 },
    { date: '01/03', Others: 48, Video: 102, Image: 145 },
    { date: '01/04', Others: 61, Video: 87, Image: 178 },
    { date: '01/05', Others: 55, Video: 115, Image: 162 },
    { date: '01/06', Others: 67, Video: 98, Image: 189 },
    { date: '01/07', Others: 58, Video: 108, Image: 171 },
    { date: '01/08', Others: 72, Video: 92, Image: 195 },
    { date: '01/09', Others: 63, Video: 125, Image: 183 },
    { date: '01/10', Others: 69, Video: 101, Image: 207 },
  ]
}

export async function fetchDistributionData(): Promise<DistributionData[]> {
  // Fake data for demo
  return [
    { name: 'Image', value: 1850, color: '#D4AF37' },
    { name: 'Video', value: 1025, color: '#B8860B' },
    { name: 'Document', value: 450, color: '#d97706' },
    { name: 'Others', value: 275, color: '#8B7355' },
  ]
}

export async function fetchTopDownloadedAssets(): Promise<TopAsset[]> {
  // Fake data for demo
  return [
    { rank: 1, name: 'Spring Collection 2025 Catalog', downloads: 342, downloadCount: 342, type: 'image', icon: 'ImageIcon' },
    { rank: 2, name: 'Product Demo Video', downloads: 298, downloadCount: 298, type: 'video', icon: 'Video' },
    { rank: 3, name: 'Brand Guidelines PDF', downloads: 256, downloadCount: 256, type: 'document', icon: 'FileText' },
    { rank: 4, name: 'Summer Sale Banner', downloads: 234, downloadCount: 234, type: 'image', icon: 'ImageIcon' },
    { rank: 5, name: 'Product Photography Set', downloads: 198, downloadCount: 198, type: 'image', icon: 'ImageIcon' },
    { rank: 6, name: 'Tutorial Video Series', downloads: 187, downloadCount: 187, type: 'video', icon: 'Video' },
    { rank: 7, name: 'Marketing Materials Pack', downloads: 165, downloadCount: 165, type: 'document', icon: 'FileText' },
    { rank: 8, name: 'Social Media Templates', downloads: 143, downloadCount: 143, type: 'image', icon: 'ImageIcon' },
    { rank: 9, name: 'Brand Story Video', downloads: 128, downloadCount: 128, type: 'video', icon: 'Video' },
    { rank: 10, name: 'Email Campaign Assets', downloads: 112, downloadCount: 112, type: 'image', icon: 'ImageIcon' },
  ]
}

export async function fetchTopActiveRetailers(): Promise<TopRetailer[]> {
  // Fake data for demo
  return [
    { rank: 1, name: 'Luxury Jewelers NYC', downloads: 245, downloadCount: 245, uniqueFiles: 89, campaignsJoined: 15, totalSends: 500, lastActiveDate: '2025-01-15' },
    { rank: 2, name: 'Beverly Hills Boutique', downloads: 223, downloadCount: 223, uniqueFiles: 76, campaignsJoined: 12, totalSends: 400, lastActiveDate: '2025-01-14' },
    { rank: 3, name: 'Chicago Diamond Gallery', downloads: 198, downloadCount: 198, uniqueFiles: 65, campaignsJoined: 18, totalSends: 600, lastActiveDate: '2025-01-13' },
    { rank: 4, name: 'Miami Fashion House', downloads: 187, downloadCount: 187, uniqueFiles: 58, campaignsJoined: 10, totalSends: 350, lastActiveDate: '2025-01-12' },
    { rank: 5, name: 'Dallas Luxury Retail', downloads: 165, downloadCount: 165, uniqueFiles: 52, campaignsJoined: 14, totalSends: 450, lastActiveDate: '2025-01-11' },
    { rank: 6, name: 'San Francisco Style', downloads: 154, downloadCount: 154, uniqueFiles: 48, campaignsJoined: 11, totalSends: 380, lastActiveDate: '2025-01-10' },
    { rank: 7, name: 'Atlanta Premium Goods', downloads: 142, downloadCount: 142, uniqueFiles: 45, campaignsJoined: 16, totalSends: 520, lastActiveDate: '2025-01-09' },
    { rank: 8, name: 'Boston Elite Fashion', downloads: 128, downloadCount: 128, uniqueFiles: 41, campaignsJoined: 9, totalSends: 320, lastActiveDate: '2025-01-08' },
    { rank: 9, name: 'Seattle Luxury Co.', downloads: 115, downloadCount: 115, uniqueFiles: 38, campaignsJoined: 13, totalSends: 420, lastActiveDate: '2025-01-07' },
    { rank: 10, name: 'Denver Style House', downloads: 98, downloadCount: 98, uniqueFiles: 32, campaignsJoined: 8, totalSends: 280, lastActiveDate: '2025-01-06' },
  ]
}

export async function fetchTemplateUsageData(): Promise<TemplateUsageData[]> {
  // Fake data for demo
  return [
    { rank: 1, name: 'Spring Newsletter', usage: 45, type: 'Email', coverage: 85, performance: 92, retailer: 'Luxury Jewelers NYC', campaigns: 8, engagement: 78, uniqueRetailers: 12, uniqueRecipients: 450, conversionRate: 15 },
    { rank: 2, name: 'Product Launch Template', usage: 38, type: 'Email', coverage: 72, performance: 88, retailer: 'Beverly Hills Boutique', campaigns: 6, engagement: 82, uniqueRetailers: 10, uniqueRecipients: 380, conversionRate: 18 },
    { rank: 3, name: 'Sale Announcement', usage: 35, type: 'Email', coverage: 78, performance: 85, retailer: 'Chicago Diamond Gallery', campaigns: 9, engagement: 75, uniqueRetailers: 15, uniqueRecipients: 520, conversionRate: 12 },
    { rank: 4, name: 'Weekly Highlights', usage: 32, type: 'Email', coverage: 68, performance: 79, retailer: 'Miami Fashion House', campaigns: 5, engagement: 71, uniqueRetailers: 8, uniqueRecipients: 320, conversionRate: 14 },
    { rank: 5, name: 'VIP Exclusive', usage: 28, type: 'Email', coverage: 82, performance: 94, retailer: 'Dallas Luxury Retail', campaigns: 7, engagement: 89, uniqueRetailers: 11, uniqueRecipients: 420, conversionRate: 22 },
  ]
}

export async function fetchRetailerScores(): Promise<RetailerScore[]> {
  // Fake data for demo
  return [
    { rank: 1, name: 'Luxury Jewelers NYC', emailResponse: 2.5, emailResponseTime: 2.5, socialResponse: 1.8, socialResponseTime: 1.8, socialPosts: 12, socialPostFreq: 12, responseQuality: 'A+', firstFollowupTime: 4, campaignROI: 185, overallScore: 95 },
    { rank: 2, name: 'Beverly Hills Boutique', emailResponse: 3.2, emailResponseTime: 3.2, socialResponse: 2.1, socialResponseTime: 2.1, socialPosts: 10, socialPostFreq: 10, responseQuality: 'A', firstFollowupTime: 6, campaignROI: 172, overallScore: 92 },
    { rank: 3, name: 'Chicago Diamond Gallery', emailResponse: 4.1, emailResponseTime: 4.1, socialResponse: 2.8, socialResponseTime: 2.8, socialPosts: 15, socialPostFreq: 15, responseQuality: 'A', firstFollowupTime: 5, campaignROI: 165, overallScore: 89 },
    { rank: 4, name: 'Miami Fashion House', emailResponse: 5.5, emailResponseTime: 5.5, socialResponse: 3.2, socialResponseTime: 3.2, socialPosts: 8, socialPostFreq: 8, responseQuality: 'B+', firstFollowupTime: 8, campaignROI: 158, overallScore: 85 },
    { rank: 5, name: 'Dallas Luxury Retail', emailResponse: 6.2, emailResponseTime: 6.2, socialResponse: 4.1, socialResponseTime: 4.1, socialPosts: 9, socialPostFreq: 9, responseQuality: 'B', firstFollowupTime: 12, campaignROI: 142, overallScore: 82 },
  ]
}

export async function fetchTopWishListItems(): Promise<WishListItem[]> {
  // Fake data for demo
  return [
    { rank: 1, model: 'Capri Necklace', modelName: 'Capri Necklace', collection: 'Spring 2025', size: '18"', gender: 'Women', material: '18K Gold', mpn: 'CN-2025-001', wishCount: 45, uniqueRetailers: 12 },
    { rank: 2, model: 'Marrakech Bracelet', modelName: 'Marrakech Bracelet', collection: 'Heritage', size: 'Medium', gender: 'Unisex', material: 'Sterling Silver', mpn: 'MB-2024-089', wishCount: 38, uniqueRetailers: 10 },
    { rank: 3, model: 'Cairo Ring', modelName: 'Cairo Ring', collection: 'Classic', size: '7', gender: 'Women', material: 'White Gold', mpn: 'CR-2024-145', wishCount: 32, uniqueRetailers: 9 },
    { rank: 4, model: 'Venice Earrings', modelName: 'Venice Earrings', collection: 'Luxury', size: 'One Size', gender: 'Women', material: 'Diamond & Gold', mpn: 'VE-2025-023', wishCount: 28, uniqueRetailers: 8 },
    { rank: 5, model: 'Jaipur Pendant', modelName: 'Jaipur Pendant', collection: 'Exotic', size: '20"', gender: 'Unisex', material: 'Rose Gold', mpn: 'JP-2024-178', wishCount: 25, uniqueRetailers: 7 },
    { rank: 6, model: 'Lunaria Hoops', modelName: 'Lunaria Hoops', collection: 'Contemporary', size: 'Large', gender: 'Women', material: '18K Gold', mpn: 'LH-2025-012', wishCount: 22, uniqueRetailers: 6 },
    { rank: 7, model: 'Goa Cuff', modelName: 'Goa Cuff', collection: 'Beach', size: 'Adjustable', gender: 'Unisex', material: 'Silver & Gemstone', mpn: 'GC-2024-234', wishCount: 19, uniqueRetailers: 6 },
    { rank: 8, model: 'Maui Chain', modelName: 'Maui Chain', collection: 'Island', size: '24"', gender: 'Men', material: 'Yellow Gold', mpn: 'MC-2024-156', wishCount: 16, uniqueRetailers: 5 },
    { rank: 9, model: 'Sicily Choker', modelName: 'Sicily Choker', collection: 'Statement', size: '16"', gender: 'Women', material: 'White Gold', mpn: 'SC-2025-067', wishCount: 14, uniqueRetailers: 5 },
    { rank: 10, model: 'Bali Anklet', modelName: 'Bali Anklet', collection: 'Casual', size: '10"', gender: 'Women', material: 'Sterling Silver', mpn: 'BA-2024-198', wishCount: 12, uniqueRetailers: 4 },
  ]
}

export async function fetchRegionalWishLists(): Promise<RegionalWishList> {
  // Fake data for demo
  return {
    northeast: [
      { rank: 1, model: 'Capri Necklace', size: '18"', mpn: 'CN-2025-001', wishCount: 18, region: 'Northeast' },
      { rank: 2, model: 'Venice Earrings', size: 'One Size', mpn: 'VE-2025-023', wishCount: 15, region: 'Northeast' },
      { rank: 3, model: 'Sicily Choker', size: '16"', mpn: 'SC-2025-067', wishCount: 12, region: 'Northeast' },
    ],
    midwest: [
      { rank: 1, model: 'Marrakech Bracelet', size: 'Medium', mpn: 'MB-2024-089', wishCount: 16, region: 'Midwest' },
      { rank: 2, model: 'Cairo Ring', size: '7', mpn: 'CR-2024-145', wishCount: 14, region: 'Midwest' },
      { rank: 3, model: 'Goa Cuff', size: 'Adjustable', mpn: 'GC-2024-234', wishCount: 10, region: 'Midwest' },
    ],
    south: [
      { rank: 1, model: 'Jaipur Pendant', size: '20"', mpn: 'JP-2024-178', wishCount: 14, region: 'South' },
      { rank: 2, model: 'Bali Anklet', size: '10"', mpn: 'BA-2024-198', wishCount: 11, region: 'South' },
      { rank: 3, model: 'Maui Chain', size: '24"', mpn: 'MC-2024-156', wishCount: 9, region: 'South' },
    ],
    west: [
      { rank: 1, model: 'Lunaria Hoops', size: 'Large', mpn: 'LH-2025-012', wishCount: 17, region: 'West' },
      { rank: 2, model: 'Capri Necklace', size: '18"', mpn: 'CN-2025-001', wishCount: 13, region: 'West' },
      { rank: 3, model: 'Venice Earrings', size: 'One Size', mpn: 'VE-2025-023', wishCount: 11, region: 'West' },
    ]
  }
}