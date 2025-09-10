// =============================================
// DATABASE SERVICE FUNCTIONS
// Clean API for database operations
// =============================================

import { supabase, supabaseAdmin } from '../supabase'
import type {
  User,
  File,
  Campaign,
  EmailCampaign,
  SmsCampaign,
  SocialPost,
  Product,
  CreateUserForm,
  CreateCampaignForm,
  CreateEmailCampaignForm,
  CreateSmsCampaignForm,
  CreateSocialPostForm,
  CreateProductForm,
  UserFilter,
  FileFilter,
  CampaignFilter,
  ApiResponse,
  PaginatedResponse,
  ActionType,
  FileAnalytics,
  UserAnalytics,
  CampaignAnalytics,
  EmailAnalytics,
  DashboardStats
} from '../types/database'

// =============================================
// USER MANAGEMENT
// =============================================

export class UserService {
  static async createUser(userData: CreateUserForm): Promise<ApiResponse<User>> {
    try {
      if (!supabaseAdmin) {
        throw new Error('Supabase admin client not available. This function requires server-side execution.')
      }

      const { data, error } = await supabaseAdmin.rpc('create_user', {
        p_email: userData.user_email,
        p_name: userData.user_name,
        p_user_type: userData.user_type,
        p_profile_data: userData.profile_data || {}
      })

      if (error) throw error

      // Return the data from the RPC function directly
      // The create_user function should return the complete user object
      return { data: data as any, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async getUsers(filter?: UserFilter, page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    try {
      let query = supabase.from('users').select('*', { count: 'exact' })

      // Apply filters
      if (filter?.user_type) {
        query = query.eq('user_type', filter.user_type)
      }
      if (filter?.is_active !== undefined) {
        query = query.eq('is_active', filter.is_active)
      }
      if (filter?.created_after) {
        query = query.gte('created_at', filter.created_after)
      }
      if (filter?.created_before) {
        query = query.lte('created_at', filter.created_before)
      }
      if (filter?.search) {
        query = query.or(`user_name.ilike.%${filter.search}%,user_email.ilike.%${filter.search}%`)
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to).order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        },
        success: true
      }
    } catch (error: any) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        success: false
      }
    }
  }

  static async getUserById(userId: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error

      return { data, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await (supabase as any)
        .from('users')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      return { data, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async deactivateUser(userId: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await (supabase as any)
        .from('users')
        .update({ is_active: false })
        .eq('user_id', userId)

      if (error) throw error

      return { data: true, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }
}

// =============================================
// FILE MANAGEMENT
// =============================================

export class FileService {
  static async getFiles(filter?: FileFilter, page = 1, limit = 10): Promise<PaginatedResponse<File>> {
    try {
      let query = supabase.from('files').select('*', { count: 'exact' })

      // Apply filters
      if (!filter?.include_deleted) {
        query = query.is('deleted_at', null)
      }
      if (filter?.file_type) {
        query = query.eq('file_type', filter.file_type)
      }
      if (filter?.created_by_user_id) {
        query = query.eq('created_by_user_id', filter.created_by_user_id)
      }
      if (filter?.created_after) {
        query = query.gte('created_at', filter.created_after)
      }
      if (filter?.created_before) {
        query = query.lte('created_at', filter.created_before)
      }
      if (filter?.search) {
        query = query.ilike('file_name', `%${filter.search}%`)
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to).order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        },
        success: true
      }
    } catch (error: any) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        success: false
      }
    }
  }

  static async getFileById(fileId: string): Promise<ApiResponse<File>> {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('file_id', fileId)
        .is('deleted_at', null)
        .single()

      if (error) throw error

      return { data, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async recordFileAction(
    fileId: string,
    userId: string,
    actionType: ActionType,
    sessionId?: string,
    metadata?: Record<string, any>
  ): Promise<ApiResponse<string>> {
    try {
      const { data, error } = await supabase.rpc('record_file_action', {
        p_file_id: fileId,
        p_user_id: userId,
        p_action_type: actionType,
        p_session_id: sessionId,
        p_metadata: metadata || {}
      } as any)

      if (error) throw error

      return { data, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async deleteFile(fileId: string, userId: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase.rpc('soft_delete_file', {
        p_file_id: fileId,
        p_user_id: userId
      } as any)

      if (error) throw error

      return { data: true, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }
}

// =============================================
// CAMPAIGN MANAGEMENT
// =============================================

export class CampaignService {
  static async createCampaign(campaignData: CreateCampaignForm, userId: string): Promise<ApiResponse<Campaign>> {
    try {
      const { data, error } = await supabase.rpc('create_campaign', {
        p_name: campaignData.campaign_name,
        p_description: campaignData.campaign_description,
        p_created_by_user_id: userId,
        p_start_date: campaignData.start_date,
        p_end_date: campaignData.end_date,
        p_budget_allocated: campaignData.budget_allocated,
        p_target_audience: campaignData.target_audience || {},
        p_campaign_settings: campaignData.campaign_settings || {}
      })

      if (error) throw error

      // Fetch the created campaign
      const { data: campaign, error: fetchError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('campaign_id', data)
        .single()

      if (fetchError) throw fetchError

      return { data: campaign, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async getCampaigns(filter?: CampaignFilter, page = 1, limit = 10): Promise<PaginatedResponse<Campaign>> {
    try {
      let query = supabase.from('campaigns').select('*', { count: 'exact' })

      // Apply filters
      if (filter?.campaign_status) {
        query = query.eq('campaign_status', filter.campaign_status)
      }
      if (filter?.created_by_user_id) {
        query = query.eq('created_by_user_id', filter.created_by_user_id)
      }
      if (filter?.start_date_after) {
        query = query.gte('start_date', filter.start_date_after)
      }
      if (filter?.start_date_before) {
        query = query.lte('start_date', filter.start_date_before)
      }
      if (filter?.search) {
        query = query.or(`campaign_name.ilike.%${filter.search}%,campaign_description.ilike.%${filter.search}%`)
      }

      // Apply pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to).order('created_at', { ascending: false })

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        },
        success: true
      }
    } catch (error: any) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        success: false
      }
    }
  }

  static async getCampaignById(campaignId: string): Promise<ApiResponse<Campaign>> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('campaign_id', campaignId)
        .single()

      if (error) throw error

      return { data, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async updateCampaign(campaignId: string, updates: Partial<Campaign>): Promise<ApiResponse<Campaign>> {
    try {
      const { data, error } = await (supabase as any)
        .from('campaigns')
        .update(updates)
        .eq('campaign_id', campaignId)
        .select()
        .single()

      if (error) throw error

      return { data, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }
}

// =============================================
// EMAIL CAMPAIGN MANAGEMENT
// =============================================

export class EmailCampaignService {
  static async createEmailCampaign(emailData: CreateEmailCampaignForm, userId: string): Promise<ApiResponse<EmailCampaign>> {
    try {
      const { data, error } = await (supabase as any)
        .from('email_campaigns')
        .insert({
          campaign_id: emailData.campaign_id,
          campaign_name: emailData.campaign_name,
          subject_line: emailData.subject_line,
          email_content: emailData.email_content,
          sender_email: emailData.sender_email,
          sender_name: emailData.sender_name,
          created_by_user_id: userId,
          metadata: {}
        })
        .select()
        .single()

      if (error) throw error

      return { data, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async sendEmailCampaign(emailCampaignId: string, recipients: Array<{email: string, name?: string}>): Promise<ApiResponse<number>> {
    try {
      const { data, error } = await supabase.rpc('send_email_campaign', {
        p_email_campaign_id: emailCampaignId,
        p_recipients: recipients
      })

      if (error) throw error

      return { data, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async getEmailCampaigns(page = 1, limit = 10): Promise<PaginatedResponse<EmailCampaign>> {
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await supabase
        .from('email_campaigns')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        },
        success: true
      }
    } catch (error: any) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        success: false
      }
    }
  }
}

// =============================================
// SMS CAMPAIGN MANAGEMENT
// =============================================

export class SmsCampaignService {
  static async createSmsCampaign(smsData: CreateSmsCampaignForm, userId: string): Promise<ApiResponse<SmsCampaign>> {
    try {
      const { data, error } = await (supabase as any)
        .from('sms_campaigns')
        .insert({
          campaign_id: smsData.campaign_id,
          campaign_name: smsData.campaign_name,
          message_content: smsData.message_content,
          sender_number: smsData.sender_number,
          created_by_user_id: userId,
          metadata: {}
        })
        .select()
        .single()

      if (error) throw error

      return { data, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async sendSmsCampaign(smsCampaignId: string, recipients: Array<{phone: string, name?: string}>): Promise<ApiResponse<number>> {
    try {
      const { data, error } = await supabase.rpc('send_sms_campaign', {
        p_sms_campaign_id: smsCampaignId,
        p_recipients: recipients
      })

      if (error) throw error

      return { data, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async getSmsCampaigns(page = 1, limit = 10): Promise<PaginatedResponse<SmsCampaign>> {
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await supabase
        .from('sms_campaigns')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        },
        success: true
      }
    } catch (error: any) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        success: false
      }
    }
  }
}

// =============================================
// SOCIAL MEDIA MANAGEMENT
// =============================================

export class SocialMediaService {
  static async createSocialPost(postData: CreateSocialPostForm): Promise<ApiResponse<SocialPost>> {
    try {
      const { data, error } = await supabase.rpc('create_social_post', {
        p_account_id: postData.account_id,
        p_campaign_id: postData.campaign_id,
        p_content: postData.post_content,
        p_post_type: postData.post_type,
        p_scheduled_at: postData.scheduled_at,
        p_metadata: postData.metadata || {}
      })

      if (error) throw error

      // Fetch the created post
      const { data: post, error: fetchError } = await supabase
        .from('social_posts')
        .select('*')
        .eq('post_id', data)
        .single()

      if (fetchError) throw fetchError

      return { data: post, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async getSocialPosts(page = 1, limit = 10): Promise<PaginatedResponse<SocialPost>> {
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await supabase
        .from('social_posts')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        },
        success: true
      }
    } catch (error: any) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        success: false
      }
    }
  }
}

// =============================================
// PRODUCT MANAGEMENT
// =============================================

export class ProductService {
  static async createProduct(productData: CreateProductForm, userId: string): Promise<ApiResponse<Product>> {
    try {
      const { data, error } = await (supabase as any)
        .from('products')
        .insert({
          product_name: productData.product_name,
          product_description: productData.product_description,
          product_category: productData.product_category,
          brand_name: productData.brand_name,
          base_price: productData.base_price,
          currency_code: productData.currency_code,
          product_metadata: productData.product_metadata || {},
          created_by_user_id: userId
        })
        .select()
        .single()

      if (error) throw error

      return { data, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async getProducts(page = 1, limit = 10): Promise<PaginatedResponse<Product>> {
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .range(from, to)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        },
        success: true
      }
    } catch (error: any) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        success: false
      }
    }
  }
}

// =============================================
// ANALYTICS SERVICE
// =============================================

export class AnalyticsService {
  static async getFileAnalytics(page = 1, limit = 10): Promise<PaginatedResponse<FileAnalytics>> {
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await supabase
        .from('file_analytics')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('engagement_score', { ascending: false })

      if (error) throw error

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        },
        success: true
      }
    } catch (error: any) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        success: false
      }
    }
  }

  static async getUserAnalytics(page = 1, limit = 10): Promise<PaginatedResponse<UserAnalytics>> {
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await supabase
        .from('user_analytics')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('total_file_actions', { ascending: false })

      if (error) throw error

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        },
        success: true
      }
    } catch (error: any) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        success: false
      }
    }
  }

  static async getCampaignAnalytics(page = 1, limit = 10): Promise<PaginatedResponse<CampaignAnalytics>> {
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await supabase
        .from('campaign_analytics')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('total_views', { ascending: false })

      if (error) throw error

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        },
        success: true
      }
    } catch (error: any) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        success: false
      }
    }
  }

  static async getEmailAnalytics(page = 1, limit = 10): Promise<PaginatedResponse<EmailAnalytics>> {
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data, error, count } = await supabase
        .from('email_analytics')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('total_sent', { ascending: false })

      if (error) throw error

      return {
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        },
        success: true
      }
    } catch (error: any) {
      return {
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
        success: false
      }
    }
  }

  static async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    try {
      // Get basic counts
      const [usersResult, filesResult, campaignsResult] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('files').select('*', { count: 'exact', head: true }).is('deleted_at', null),
        supabase.from('campaigns').select('*', { count: 'exact', head: true })
      ])

      // Get active users (logged in within last 30 days)
      const { count: activeUsersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('last_login_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

      // Get active campaigns
      const { count: activeCampaignsCount } = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_status', 'active')

      // Get file action counts
      const { count: totalFileViews } = await supabase
        .from('file_actions')
        .select('*', { count: 'exact', head: true })
        .eq('action_type', 'VIEW')

      const { count: totalFileDownloads } = await supabase
        .from('file_actions')
        .select('*', { count: 'exact', head: true })
        .eq('action_type', 'DOWNLOAD')

      // Get email and SMS counts
      const { count: totalEmailsSent } = await supabase
        .from('email_sends')
        .select('*', { count: 'exact', head: true })

      const { count: totalSmsSent } = await supabase
        .from('sms_sends')
        .select('*', { count: 'exact', head: true })

      const { count: totalSocialPosts } = await supabase
        .from('social_posts')
        .select('*', { count: 'exact', head: true })

      const stats: DashboardStats = {
        totalUsers: usersResult.count || 0,
        activeUsers: activeUsersCount || 0,
        totalFiles: filesResult.count || 0,
        totalCampaigns: campaignsResult.count || 0,
        activeCampaigns: activeCampaignsCount || 0,
        totalFileViews: totalFileViews || 0,
        totalFileDownloads: totalFileDownloads || 0,
        totalEmailsSent: totalEmailsSent || 0,
        totalSmsSent: totalSmsSent || 0,
        totalSocialPosts: totalSocialPosts || 0
      }

      return { data: stats, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }
}

// =============================================
// SESSION MANAGEMENT
// =============================================

export class SessionService {
  static async startSession(
    userId: string,
    ipAddress?: string,
    userAgent?: string,
    deviceInfo?: Record<string, any>,
    locationData?: Record<string, any>
  ): Promise<ApiResponse<string>> {
    try {
      const { data, error } = await supabase.rpc('start_session', {
        p_user_id: userId,
        p_ip_address: ipAddress,
        p_user_agent: userAgent,
        p_device_info: deviceInfo || {},
        p_location_data: locationData || {}
      })

      if (error) throw error

      return { data, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }

  static async endSession(sessionId: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase.rpc('end_session', {
        p_session_id: sessionId
      })

      if (error) throw error

      return { data: true, success: true }
    } catch (error: any) {
      return { error: error.message, success: false }
    }
  }
}