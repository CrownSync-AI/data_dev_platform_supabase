// =============================================
// DATABASE TYPES
// TypeScript types for the database schema
// =============================================

// =============================================
// ENUM TYPES
// =============================================

export type UserType = 'admin' | 'brand' | 'retailer';
export type FileType = 'image' | 'video' | 'document' | 'audio' | 'other';
export type ActionType = 'VIEW' | 'DOWNLOAD' | 'SHARE' | 'DELETE' | 'EDIT' | 'UPLOAD';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
export type TemplateType = 'email' | 'sms' | 'social' | 'web' | 'print';
export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';
export type EmailStatus = 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'failed';
export type SmsStatus = 'pending' | 'sent' | 'delivered' | 'failed';

// =============================================
// CORE TABLE TYPES
// =============================================

export interface User {
  user_id: string;
  user_email: string;
  user_name: string;
  user_type: UserType;
  is_active: boolean;
  profile_data: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

export interface File {
  file_id: string;
  file_name: string;
  file_type: FileType;
  file_size_bytes: number;
  file_path: string;
  file_url?: string;
  mime_type?: string;
  file_hash?: string;
  created_by_user_id: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface FileAction {
  action_id: string;
  file_id: string;
  user_id: string;
  action_type: ActionType;
  session_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata: Record<string, any>;
  action_timestamp: string;
}

export interface Campaign {
  campaign_id: string;
  campaign_name: string;
  campaign_description?: string;
  campaign_status: CampaignStatus;
  created_by_user_id: string;
  start_date?: string;
  end_date?: string;
  budget_allocated?: number;
  budget_spent?: number;
  target_audience: Record<string, any>;
  campaign_settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Template {
  template_id: string;
  template_name: string;
  template_type: TemplateType;
  template_content: string;
  template_variables: Record<string, any>;
  created_by_user_id: string;
  is_active: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Session {
  session_id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  ip_address?: string;
  user_agent?: string;
  device_info: Record<string, any>;
  location_data: Record<string, any>;
}

export interface Collection {
  collection_id: string;
  collection_name: string;
  collection_description?: string;
  created_by_user_id: string;
  is_public: boolean;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CollectionFile {
  collection_id: string;
  file_id: string;
  added_by_user_id: string;
  added_at: string;
  display_order?: number;
}

export interface Geography {
  geography_id: string;
  country_code: string;
  country_name: string;
  region?: string;
  city?: string;
  timezone?: string;
  currency_code?: string;
  language_code?: string;
  metadata: Record<string, any>;
}

export interface Device {
  device_id: string;
  device_type: string;
  device_brand?: string;
  device_model?: string;
  operating_system?: string;
  browser?: string;
  screen_resolution?: string;
  metadata: Record<string, any>;
  first_seen_at: string;
  last_seen_at: string;
}

// =============================================
// EMAIL CAMPAIGN TYPES
// =============================================

export interface EmailCampaign {
  email_campaign_id: string;
  campaign_id?: string;
  campaign_name: string;
  subject_line: string;
  email_content: string;
  sender_email: string;
  sender_name?: string;
  created_by_user_id: string;
  sent_at?: string;
  total_recipients?: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface EmailSend {
  email_send_id: string;
  email_campaign_id: string;
  recipient_email: string;
  recipient_name?: string;
  status: EmailStatus;
  sent_at: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  bounced_at?: string;
  bounce_reason?: string;
  metadata: Record<string, any>;
}

// =============================================
// SMS CAMPAIGN TYPES
// =============================================

export interface SmsCampaign {
  sms_campaign_id: string;
  campaign_id?: string;
  campaign_name: string;
  message_content: string;
  sender_number: string;
  created_by_user_id: string;
  sent_at?: string;
  total_recipients?: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SmsSend {
  sms_send_id: string;
  sms_campaign_id: string;
  recipient_phone: string;
  recipient_name?: string;
  status: SmsStatus;
  sent_at: string;
  delivered_at?: string;
  failure_reason?: string;
  metadata: Record<string, any>;
}

// =============================================
// SOCIAL MEDIA TYPES
// =============================================

export interface SocialAccount {
  account_id: string;
  platform: SocialPlatform;
  account_handle: string;
  account_name?: string;
  access_token_encrypted?: string;
  refresh_token_encrypted?: string;
  token_expires_at?: string;
  account_metadata: Record<string, any>;
  is_active: boolean;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface SocialPost {
  post_id: string;
  account_id: string;
  campaign_id?: string;
  post_content: string;
  post_type: string;
  external_post_id?: string;
  scheduled_at?: string;
  published_at?: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SocialEngagement {
  engagement_id: string;
  post_id: string;
  engagement_type: string;
  engagement_count: number;
  recorded_at: string;
  metadata: Record<string, any>;
}

// =============================================
// PRODUCT TYPES
// =============================================

export interface Product {
  product_id: string;
  product_name: string;
  product_description?: string;
  product_category?: string;
  brand_name?: string;
  base_price?: number;
  currency_code?: string;
  product_metadata: Record<string, any>;
  is_active: boolean;
  created_by_user_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  variant_id: string;
  product_id: string;
  variant_name: string;
  sku?: string;
  price?: number;
  inventory_count?: number;
  variant_attributes: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// =============================================
// ANALYTICS TYPES
// =============================================

export interface DailyAnalytics {
  analytics_id: string;
  date_recorded: string;
  entity_type: string;
  entity_id: string;
  metric_name: string;
  metric_value: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface AuditLog {
  log_id: string;
  table_name: string;
  record_id: string;
  operation: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  changed_by_user_id?: string;
  changed_at: string;
  ip_address?: string;
  user_agent?: string;
}

// =============================================
// VIEW TYPES (Analytics)
// =============================================

export interface FileAnalytics {
  file_id: string;
  file_name: string;
  file_type: FileType;
  total_views: number;
  total_downloads: number;
  total_shares: number;
  unique_viewers: number;
  engagement_score: number;
  last_accessed: string;
  created_by_user_name: string;
}

export interface UserAnalytics {
  user_id: string;
  user_name: string;
  user_email: string;
  user_type: UserType;
  total_sessions: number;
  total_file_actions: number;
  avg_session_duration_minutes: number;
  last_login: string;
  files_uploaded: number;
  campaigns_created: number;
}

export interface CampaignAnalytics {
  campaign_id: string;
  campaign_name: string;
  campaign_status: CampaignStatus;
  total_files: number;
  total_views: number;
  total_downloads: number;
  total_shares: number;
  budget_utilization_percent: number;
  created_by_user_name: string;
  start_date?: string;
  end_date?: string;
}

export interface EmailAnalytics {
  email_campaign_id: string;
  campaign_name: string;
  total_sent: number;
  total_delivered: number;
  total_opened: number;
  total_clicked: number;
  total_bounced: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  sent_at?: string;
}

export interface SmsAnalytics {
  sms_campaign_id: string;
  campaign_name: string;
  total_sent: number;
  total_delivered: number;
  total_failed: number;
  delivery_rate: number;
  failure_rate: number;
  sent_at?: string;
}

export interface SocialAnalytics {
  account_id: string;
  platform: SocialPlatform;
  account_handle: string;
  total_posts: number;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  total_views: number;
  avg_engagement_rate: number;
  last_post_date?: string;
}

export interface ProductAnalytics {
  product_id: string;
  product_name: string;
  total_variants: number;
  total_inventory: number;
  avg_price: number;
  total_views: number;
  conversion_rate: number;
  revenue_generated: number;
}

export interface DailyMetricsSummary {
  date_recorded: string;
  total_users: number;
  active_users: number;
  total_files: number;
  total_file_actions: number;
  total_campaigns: number;
  total_email_sends: number;
  total_sms_sends: number;
  total_social_posts: number;
}

// =============================================
// API RESPONSE TYPES
// =============================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
}

// =============================================
// FORM TYPES
// =============================================

export interface CreateUserForm {
  user_email: string;
  user_name: string;
  user_type: UserType;
  profile_data?: Record<string, any>;
}

export interface CreateCampaignForm {
  campaign_name: string;
  campaign_description?: string;
  start_date?: string;
  end_date?: string;
  budget_allocated?: number;
  target_audience?: Record<string, any>;
  campaign_settings?: Record<string, any>;
}

export interface CreateEmailCampaignForm {
  campaign_id?: string;
  campaign_name: string;
  subject_line: string;
  email_content: string;
  sender_email: string;
  sender_name?: string;
  recipients: Array<{
    email: string;
    name?: string;
  }>;
}

export interface CreateSmsCampaignForm {
  campaign_id?: string;
  campaign_name: string;
  message_content: string;
  sender_number: string;
  recipients: Array<{
    phone: string;
    name?: string;
  }>;
}

export interface CreateSocialPostForm {
  account_id: string;
  campaign_id?: string;
  post_content: string;
  post_type: string;
  scheduled_at?: string;
  metadata?: Record<string, any>;
}

export interface CreateProductForm {
  product_name: string;
  product_description?: string;
  product_category?: string;
  brand_name?: string;
  base_price?: number;
  currency_code?: string;
  product_metadata?: Record<string, any>;
}

export interface FileUploadForm {
  file: File;
  file_name?: string;
  metadata?: Record<string, any>;
}

// =============================================
// FILTER TYPES
// =============================================

export interface UserFilter {
  user_type?: UserType;
  is_active?: boolean;
  created_after?: string;
  created_before?: string;
  search?: string;
}

export interface FileFilter {
  file_type?: FileType;
  created_by_user_id?: string;
  created_after?: string;
  created_before?: string;
  search?: string;
  include_deleted?: boolean;
}

export interface CampaignFilter {
  campaign_status?: CampaignStatus;
  created_by_user_id?: string;
  start_date_after?: string;
  start_date_before?: string;
  search?: string;
}

export interface AnalyticsFilter {
  date_from?: string;
  date_to?: string;
  entity_type?: string;
  entity_id?: string;
  metric_name?: string;
}

// =============================================
// DASHBOARD TYPES
// =============================================

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalFiles: number;
  totalCampaigns: number;
  activeCampaigns: number;
  totalFileViews: number;
  totalFileDownloads: number;
  totalEmailsSent: number;
  totalSmsSent: number;
  totalSocialPosts: number;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }>;
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

// =============================================
// UTILITY TYPES
// =============================================

export type DatabaseTable = 
  | 'users'
  | 'files'
  | 'file_actions'
  | 'campaigns'
  | 'templates'
  | 'sessions'
  | 'collections'
  | 'collection_files'
  | 'geography'
  | 'devices'
  | 'email_campaigns'
  | 'email_sends'
  | 'sms_campaigns'
  | 'sms_sends'
  | 'social_accounts'
  | 'social_posts'
  | 'social_engagement'
  | 'products'
  | 'product_variants'
  | 'daily_analytics'
  | 'audit_logs';

export type SortOrder = 'asc' | 'desc';

export interface SortConfig {
  field: string;
  order: SortOrder;
}

export interface PaginationConfig {
  page: number;
  limit: number;
}

// =============================================
// SUPABASE SPECIFIC TYPES
// =============================================

export interface SupabaseError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
  count?: number;
  status: number;
  statusText: string;
}

// =============================================
// EXPORT DATABASE TYPE
// =============================================

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'user_id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'user_id' | 'created_at'>>;
      };
      files: {
        Row: File;
        Insert: Omit<File, 'file_id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<File, 'file_id' | 'created_at'>>;
      };
      file_actions: {
        Row: FileAction;
        Insert: Omit<FileAction, 'action_id' | 'action_timestamp'>;
        Update: Partial<Omit<FileAction, 'action_id'>>;
      };
      campaigns: {
        Row: Campaign;
        Insert: Omit<Campaign, 'campaign_id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Campaign, 'campaign_id' | 'created_at'>>;
      };
      templates: {
        Row: Template;
        Insert: Omit<Template, 'template_id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Template, 'template_id' | 'created_at'>>;
      };
      sessions: {
        Row: Session;
        Insert: Omit<Session, 'session_id' | 'started_at'>;
        Update: Partial<Omit<Session, 'session_id'>>;
      };
      collections: {
        Row: Collection;
        Insert: Omit<Collection, 'collection_id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Collection, 'collection_id' | 'created_at'>>;
      };
      collection_files: {
        Row: CollectionFile;
        Insert: Omit<CollectionFile, 'added_at'>;
        Update: Partial<CollectionFile>;
      };
      geography: {
        Row: Geography;
        Insert: Omit<Geography, 'geography_id'>;
        Update: Partial<Omit<Geography, 'geography_id'>>;
      };
      devices: {
        Row: Device;
        Insert: Omit<Device, 'device_id' | 'first_seen_at' | 'last_seen_at'>;
        Update: Partial<Omit<Device, 'device_id'>>;
      };
      email_campaigns: {
        Row: EmailCampaign;
        Insert: Omit<EmailCampaign, 'email_campaign_id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<EmailCampaign, 'email_campaign_id' | 'created_at'>>;
      };
      email_sends: {
        Row: EmailSend;
        Insert: Omit<EmailSend, 'email_send_id' | 'sent_at'>;
        Update: Partial<Omit<EmailSend, 'email_send_id'>>;
      };
      sms_campaigns: {
        Row: SmsCampaign;
        Insert: Omit<SmsCampaign, 'sms_campaign_id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SmsCampaign, 'sms_campaign_id' | 'created_at'>>;
      };
      sms_sends: {
        Row: SmsSend;
        Insert: Omit<SmsSend, 'sms_send_id' | 'sent_at'>;
        Update: Partial<Omit<SmsSend, 'sms_send_id'>>;
      };
      social_accounts: {
        Row: SocialAccount;
        Insert: Omit<SocialAccount, 'account_id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SocialAccount, 'account_id' | 'created_at'>>;
      };
      social_posts: {
        Row: SocialPost;
        Insert: Omit<SocialPost, 'post_id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SocialPost, 'post_id' | 'created_at'>>;
      };
      social_engagement: {
        Row: SocialEngagement;
        Insert: Omit<SocialEngagement, 'engagement_id' | 'recorded_at'>;
        Update: Partial<Omit<SocialEngagement, 'engagement_id'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'product_id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'product_id' | 'created_at'>>;
      };
      product_variants: {
        Row: ProductVariant;
        Insert: Omit<ProductVariant, 'variant_id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProductVariant, 'variant_id' | 'created_at'>>;
      };
      daily_analytics: {
        Row: DailyAnalytics;
        Insert: Omit<DailyAnalytics, 'analytics_id' | 'created_at'>;
        Update: Partial<Omit<DailyAnalytics, 'analytics_id'>>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'log_id' | 'changed_at'>;
        Update: Partial<Omit<AuditLog, 'log_id'>>;
      };
    };
    Views: {
      file_analytics: {
        Row: FileAnalytics;
      };
      user_analytics: {
        Row: UserAnalytics;
      };
      campaign_analytics: {
        Row: CampaignAnalytics;
      };
      email_analytics: {
        Row: EmailAnalytics;
      };
      sms_analytics: {
        Row: SmsAnalytics;
      };
      social_analytics: {
        Row: SocialAnalytics;
      };
      product_analytics: {
        Row: ProductAnalytics;
      };
      daily_metrics_summary: {
        Row: DailyMetricsSummary;
      };
    };
    Functions: {
      create_user: {
        Args: {
          p_email: string;
          p_name: string;
          p_user_type: UserType;
          p_profile_data?: Record<string, any>;
        };
        Returns: string;
      };
      record_file_action: {
        Args: {
          p_file_id: string;
          p_user_id: string;
          p_action_type: ActionType;
          p_session_id?: string;
          p_ip_address?: string;
          p_user_agent?: string;
          p_metadata?: Record<string, any>;
        };
        Returns: string;
      };
      calculate_file_engagement_score: {
        Args: {
          p_file_id: string;
        };
        Returns: number;
      };
      get_user_activity_summary: {
        Args: {
          p_user_id: string;
          p_days?: number;
        };
        Returns: {
          total_sessions: number;
          total_file_views: number;
          total_file_downloads: number;
          total_file_shares: number;
          avg_session_duration_minutes: number;
          most_active_day: string;
        }[];
      };
    };
  };
}