# CrownSync Backend & Database Comprehensive Guide

## 🎯 Overview

CrownSync's backend architecture is built on Supabase (PostgreSQL) with Next.js API routes, providing a robust foundation for data analytics, campaign management, and real-time features. This guide covers the complete backend and database architecture, schemas, services, and integration patterns.

## 🏗️ Backend Architecture Overview

### **Technology Stack**
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **API Layer**: Next.js 14 API routes with App Router
- **Authentication**: Supabase Auth with Row Level Security (RLS)
- **Real-time**: Supabase real-time subscriptions
- **File Storage**: Supabase Storage (planned)
- **External APIs**: Ayrshare (social media), OpenAI (chat)
- **Type Safety**: Generated TypeScript types from database schema

### **Architecture Principles**
- **Database-First**: Schema-driven development
- **Type Safety**: End-to-end TypeScript coverage
- **Real-time**: Live data updates across the platform
- **Security**: Row Level Security and audit trails
- **Scalability**: Optimized queries and indexing
- **Modularity**: Service-oriented architecture

## 🗄️ Database Schema Overview

### **Core Database Systems**

#### 1. **User Management & Authentication**
- Multi-tenant system with role-based access
- Retailer, brand, and admin user types
- Session tracking and audit trails

#### 2. **Campaign Management System**
- Marketing campaign orchestration
- Email and SMS campaign tracking
- Performance analytics and ROI calculation
- Multi-channel attribution

#### 3. **Social Media Analytics System**
- Multi-platform social media integration (LinkedIn, Instagram, Facebook, Google Business)
- Real-time engagement tracking
- Content performance analysis
- Retailer social media rankings

#### 4. **Asset Management System**
- Digital asset storage and tracking
- Download analytics and engagement metrics
- Collection organization and sharing

#### 5. **CRM System**
- Customer management with Shopify integration
- Customer segmentation and behavior tracking
- Order history and lifecycle management

#### 6. **Analytics & Reporting System**
- Real-time analytics aggregation
- Performance metrics calculation
- Historical trend analysis

## 📊 Database Schema Details

### **User Management Tables**

#### `users`
**Purpose**: Central user management for all platform users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) DEFAULT 'retailer',
    region VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);
```

**Key Features**:
- Multi-tenant user system
- Regional classification for analytics
- Role-based access control
- Audit trail integration

#### `sessions`
**Purpose**: User session tracking and analytics
```sql
CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    started_at TIMESTAMP DEFAULT NOW(),
    ended_at TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    location_data JSONB
);
```

### **Campaign Management Tables**

#### `campaigns`
**Purpose**: Master campaign records with budget tracking
```sql
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget_allocated DECIMAL(12,2),
    budget_spent DECIMAL(12,2) DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `email_campaigns` & `email_sends`
**Purpose**: Email marketing campaign tracking
```sql
CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    subject VARCHAR(500) NOT NULL,
    content TEXT,
    sender_email VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE,
    total_recipients INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE email_sends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    retailer_id UUID REFERENCES users(id),
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'sent',
    bounce_reason TEXT
);
```

#### `crm_conversions` & `ecommerce_orders`
**Purpose**: Revenue tracking and ROI calculation
```sql
CREATE TABLE crm_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    retailer_id UUID REFERENCES users(id),
    email_send_id UUID REFERENCES email_sends(id),
    conversion_type VARCHAR(50),
    conversion_value DECIMAL(12,2),
    conversion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    product_category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE ecommerce_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    retailer_id UUID REFERENCES users(id),
    order_value DECIMAL(12,2),
    order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    product_count INTEGER DEFAULT 1,
    order_status VARCHAR(50) DEFAULT 'completed',
    attributed_to_email BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Social Media Analytics Tables**

#### `social_accounts`
**Purpose**: Social media account management with Ayrshare integration
```sql
CREATE TABLE social_accounts (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID REFERENCES users(id),
    platform VARCHAR(50) NOT NULL,
    account_handle VARCHAR(255),
    account_name VARCHAR(255),
    ayrshare_profile_key VARCHAR(255),
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    sync_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB
);
```

#### `social_posts`
**Purpose**: Social media post tracking with campaign attribution
```sql
CREATE TABLE social_posts (
    post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES social_accounts(account_id),
    campaign_id UUID REFERENCES campaigns(id),
    external_post_id VARCHAR(255),
    post_content TEXT,
    post_type VARCHAR(50),
    media_urls TEXT[],
    hashtags TEXT[],
    scheduled_at TIMESTAMP,
    published_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB
);
```

#### `social_analytics`
**Purpose**: Daily post-level analytics with engagement metrics
```sql
CREATE TABLE social_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES social_posts(post_id),
    analytics_date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    reach INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    video_views INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    click_through_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### `account_analytics`
**Purpose**: Daily account-level performance tracking
```sql
CREATE TABLE account_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES social_accounts(account_id),
    analytics_date DATE NOT NULL,
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    profile_visits INTEGER DEFAULT 0,
    website_clicks INTEGER DEFAULT 0,
    new_followers INTEGER DEFAULT 0,
    unfollowers INTEGER DEFAULT 0,
    follower_growth_rate DECIMAL(5,2) DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### **Retailer Performance Tables**

#### `retailer_performance_metrics`
**Purpose**: Comprehensive retailer performance tracking
```sql
CREATE TABLE retailer_performance_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID NOT NULL,
    retailer_name VARCHAR(255) NOT NULL,
    region_id UUID REFERENCES retailer_regions(region_id),
    measurement_date DATE NOT NULL,
    measurement_period VARCHAR(20) DEFAULT 'daily',
    
    -- Email metrics
    emails_sent INTEGER DEFAULT 0,
    emails_delivered INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    emails_bounced INTEGER DEFAULT 0,
    
    -- Performance rates
    delivery_rate DECIMAL(5,2) DEFAULT 0,
    open_rate DECIMAL(5,2) DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Business metrics
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    revenue_generated DECIMAL(12,2) DEFAULT 0,
    roi_percentage DECIMAL(6,2) DEFAULT 0,
    
    -- Performance indicators
    performance_grade VARCHAR(1) DEFAULT 'C',
    needs_attention BOOLEAN DEFAULT FALSE,
    is_top_performer BOOLEAN DEFAULT FALSE,
    overall_rank INTEGER,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### **Asset Management Tables**

#### `brand_assets`
**Purpose**: Digital asset management with analytics
```sql
CREATE TABLE brand_assets (
    asset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_name VARCHAR(500) NOT NULL,
    asset_type VARCHAR(50) NOT NULL,
    file_size BIGINT,
    file_url TEXT,
    download_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT FALSE,
    metadata JSONB
);
```

#### `retailer_asset_activity`
**Purpose**: Asset engagement tracking
```sql
CREATE TABLE retailer_asset_activity (
    activity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID REFERENCES users(id),
    asset_id UUID REFERENCES brand_assets(asset_id),
    activity_type VARCHAR(20) NOT NULL,
    activity_date TIMESTAMP DEFAULT NOW(),
    unique_files_count INTEGER DEFAULT 1
);
```

### **CRM System Tables**

#### `customers`
**Purpose**: Customer management with Shopify integration
```sql
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_customer_id VARCHAR(255),
    email VARCHAR(255),
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(50),
    customer_segment VARCHAR(50),
    total_orders INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    last_order_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    tags TEXT[],
    metadata JSONB
);
```

## 🔄 Database Views and Functions

### **Performance Views**

#### `campaign_performance_summary`
**Purpose**: Comprehensive campaign analytics
```sql
CREATE OR REPLACE VIEW campaign_performance_summary AS
SELECT 
    c.id as campaign_id,
    c.name as campaign_name,
    c.status,
    c.budget_allocated,
    c.budget_spent,
    
    -- Email metrics
    COUNT(DISTINCT u.id) FILTER (WHERE u.user_type = 'retailer') as total_retailers,
    COUNT(es.id) as total_emails_sent,
    COUNT(es.id) FILTER (WHERE es.status = 'delivered') as emails_delivered,
    COUNT(es.id) FILTER (WHERE es.opened_at IS NOT NULL) as emails_opened,
    COUNT(es.id) FILTER (WHERE es.clicked_at IS NOT NULL) as emails_clicked,
    
    -- Calculated rates
    CASE 
        WHEN COUNT(es.id) FILTER (WHERE es.status = 'delivered') > 0 
        THEN ROUND((COUNT(es.id) FILTER (WHERE es.opened_at IS NOT NULL)::DECIMAL / COUNT(es.id) FILTER (WHERE es.status = 'delivered')) * 100, 2)
        ELSE 0 
    END as open_rate,
    
    -- Revenue and ROI
    COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) as total_revenue,
    CASE 
        WHEN c.budget_spent > 0 
        THEN ROUND(((COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) - c.budget_spent) / c.budget_spent) * 100, 1)
        ELSE 0 
    END as roi_percentage

FROM campaigns c
LEFT JOIN email_campaigns ec ON c.id = ec.campaign_id
LEFT JOIN email_sends es ON ec.id = es.email_campaign_id
LEFT JOIN users u ON es.retailer_id = u.id
LEFT JOIN crm_conversions cc ON c.id = cc.campaign_id
LEFT JOIN ecommerce_orders eo ON c.id = eo.campaign_id
GROUP BY c.id, c.name, c.status, c.budget_allocated, c.budget_spent;
```

#### `social_performance_summary`
**Purpose**: Social media performance overview
```sql
CREATE OR REPLACE VIEW social_performance_summary AS
SELECT 
    sa.retailer_id,
    u.name as retailer_name,
    u.region,
    sa.platform,
    sa.follower_count,
    
    -- Engagement metrics
    AVG(san.engagement_rate) as avg_engagement_rate,
    SUM(san.impressions) as total_impressions,
    SUM(san.reach) as total_reach,
    SUM(san.likes + san.comments + san.shares) as total_engagement,
    
    -- Performance indicators
    CASE 
        WHEN AVG(san.engagement_rate) >= 5.0 THEN 'High'
        WHEN AVG(san.engagement_rate) >= 2.0 THEN 'Good'
        ELSE 'Standard'
    END as engagement_tier,
    
    COUNT(sp.post_id) as total_posts,
    MAX(san.analytics_date) as last_activity_date

FROM social_accounts sa
JOIN users u ON sa.retailer_id = u.id
LEFT JOIN social_posts sp ON sa.account_id = sp.account_id
LEFT JOIN social_analytics san ON sp.post_id = san.post_id
WHERE sa.is_active = true
GROUP BY sa.retailer_id, u.name, u.region, sa.platform, sa.follower_count;
```

### **Database Functions**

#### Campaign Analytics Functions
```sql
-- Refresh materialized views
CREATE OR REPLACE FUNCTION refresh_retailer_performance_dashboard()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW retailer_performance_dashboard;
END;
$$ LANGUAGE plpgsql;

-- Calculate campaign ROI
CREATE OR REPLACE FUNCTION calculate_campaign_roi(campaign_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_revenue DECIMAL;
    total_spent DECIMAL;
    roi_result DECIMAL;
BEGIN
    SELECT 
        COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0),
        c.budget_spent
    INTO total_revenue, total_spent
    FROM campaigns c
    LEFT JOIN crm_conversions cc ON c.id = cc.campaign_id
    LEFT JOIN ecommerce_orders eo ON c.id = eo.campaign_id
    WHERE c.id = campaign_uuid
    GROUP BY c.budget_spent;
    
    IF total_spent > 0 THEN
        roi_result := ((total_revenue - total_spent) / total_spent) * 100;
    ELSE
        roi_result := 0;
    END IF;
    
    RETURN roi_result;
END;
$$ LANGUAGE plpgsql;
```

#### Social Media Functions
```sql
-- Sync social media data
CREATE OR REPLACE FUNCTION sync_social_account_data(account_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE social_accounts 
    SET 
        last_sync_at = NOW(),
        sync_status = 'completed'
    WHERE account_id = account_uuid;
END;
$$ LANGUAGE plpgsql;

-- Calculate engagement rate
CREATE OR REPLACE FUNCTION calculate_engagement_rate(
    likes_count INTEGER,
    comments_count INTEGER,
    shares_count INTEGER,
    impressions_count INTEGER
)
RETURNS DECIMAL AS $$
BEGIN
    IF impressions_count > 0 THEN
        RETURN ROUND(((likes_count + comments_count + shares_count)::DECIMAL / impressions_count) * 100, 2);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

## 🔧 Service Layer Architecture

### **Core Services**

#### Database Services
```typescript
// lib/services/database.ts
export class DatabaseService {
  private supabase: SupabaseClient

  async query(sql: string, params?: any[]) {
    const { data, error } = await this.supabase.rpc('execute_sql', {
      query: sql,
      parameters: params
    })
    if (error) throw error
    return data
  }

  async getCampaignAnalytics(campaignId: string) {
    const { data, error } = await this.supabase
      .from('campaign_performance_summary')
      .select('*')
      .eq('campaign_id', campaignId)
      .single()
    
    if (error) throw error
    return data
  }
}
```

#### Campaign Analytics Service
```typescript
// lib/services/simplifiedCampaignAnalytics.ts
export class SimplifiedCampaignAnalyticsService {
  async getRetailerPerformance(campaignId: string) {
    const { data, error } = await supabase
      .from('retailer_performance_dashboard')
      .select('*')
      .order('overall_rank')
    
    if (error) throw error
    return this.transformRetailerData(data)
  }

  private transformRetailerData(data: any[]) {
    return data.map(retailer => ({
      ...retailer,
      performance_tier: this.calculatePerformanceTier(retailer.roi_percentage),
      engagement_level: this.calculateEngagementLevel(retailer.click_rate)
    }))
  }
}
```

#### Social Media Services
```typescript
// lib/services/ayrshareService.ts
export class AyrshareService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.AYRSHARE_API_KEY!
    this.baseUrl = process.env.AYRSHARE_BASE_URL!
  }

  async getAccountAnalytics(profileKey: string, startDate: string, endDate: string) {
    const response = await fetch(`${this.baseUrl}/analytics/profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        profileKey,
        startDate,
        endDate
      })
    })

    if (!response.ok) {
      throw new Error(`Ayrshare API error: ${response.statusText}`)
    }

    return response.json()
  }

  async getPostAnalytics(postId: string) {
    const response = await fetch(`${this.baseUrl}/analytics/post/${postId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    })

    return response.json()
  }
}

// lib/services/socialDataSyncService.ts
export class SocialDataSyncService {
  private ayrshare: AyrshareService
  private supabase: SupabaseClient

  async syncAccountData(accountId: string) {
    try {
      const account = await this.getAccountById(accountId)
      const analytics = await this.ayrshare.getAccountAnalytics(
        account.ayrshare_profile_key,
        this.getStartDate(),
        this.getEndDate()
      )

      await this.updateAccountAnalytics(accountId, analytics)
      await this.markSyncComplete(accountId)
    } catch (error) {
      await this.markSyncFailed(accountId, error.message)
      throw error
    }
  }

  async syncAllAccounts() {
    const accounts = await this.getActiveAccounts()
    const syncPromises = accounts.map(account => 
      this.syncAccountData(account.account_id)
    )
    
    await Promise.allSettled(syncPromises)
  }
}
```

#### CRM Service
```typescript
// lib/services/crmService.ts
export class CRMService {
  async getCustomers(filters: CustomerFilters) {
    let query = supabase
      .from('customers')
      .select('*')

    if (filters.segment) {
      query = query.eq('customer_segment', filters.segment)
    }

    if (filters.search) {
      query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(filters.offset, filters.offset + filters.limit - 1)

    if (error) throw error
    return data
  }

  async getCustomerMetrics() {
    const { data, error } = await supabase
      .rpc('get_customer_metrics')

    if (error) throw error
    return data
  }
}
```

## 🔌 API Routes Architecture

### **Campaign Analytics APIs**
```typescript
// app/api/campaigns/[id]/analytics/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = params.id
    const service = new SimplifiedCampaignAnalyticsService()
    
    const [
      campaignData,
      retailerPerformance,
      summaryStats
    ] = await Promise.all([
      service.getCampaignData(campaignId),
      service.getRetailerPerformance(campaignId),
      service.getSummaryStats(campaignId)
    ])

    return Response.json({
      campaign: campaignData,
      retailers: retailerPerformance,
      summary: summaryStats
    })
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch campaign analytics' },
      { status: 500 }
    )
  }
}
```

### **Social Media Analytics APIs**
```typescript
// app/api/social-analytics/route.ts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const region = searchParams.get('region')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const service = new SocialMetricsService()
    const data = await service.getAnalytics({
      platform,
      region,
      startDate,
      endDate
    })

    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch social analytics' },
      { status: 500 }
    )
  }
}

// app/api/social-analytics/performance/route.ts
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('social_performance_summary')
      .select('*')
      .order('avg_engagement_rate', { ascending: false })

    if (error) throw error
    return Response.json(data)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch performance data' },
      { status: 500 }
    )
  }
}
```

### **CRM APIs**
```typescript
// app/api/crm/customers/route.ts
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      segment: searchParams.get('segment'),
      search: searchParams.get('search'),
      offset: parseInt(searchParams.get('offset') || '0'),
      limit: parseInt(searchParams.get('limit') || '50')
    }

    const service = new CRMService()
    const customers = await service.getCustomers(filters)
    
    return Response.json(customers)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
```

## 🔐 Security & Authentication

### **Row Level Security (RLS)**
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Retailers can only see their own performance data
CREATE POLICY "Retailers view own performance" ON retailer_performance_metrics
    FOR SELECT USING (
        retailer_id IN (
            SELECT id FROM users WHERE auth.uid() = id AND user_type = 'retailer'
        )
    );

-- Brand users can see all retailer data
CREATE POLICY "Brand users view all performance" ON retailer_performance_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth.uid() = id AND user_type = 'brand'
        )
    );

-- Social accounts access control
CREATE POLICY "Users access own social accounts" ON social_accounts
    FOR ALL USING (
        retailer_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users 
            WHERE auth.uid() = id AND user_type IN ('brand', 'admin')
        )
    );
```

### **Audit Logging**
```sql
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        changed_by
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        auth.uid()
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

## 📊 Performance Optimization

### **Database Indexes**
```sql
-- Campaign performance indexes
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_email_sends_campaign ON email_sends(email_campaign_id);
CREATE INDEX idx_email_sends_retailer ON email_sends(retailer_id);

-- Social media indexes
CREATE INDEX idx_social_accounts_retailer ON social_accounts(retailer_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX idx_social_analytics_date ON social_analytics(analytics_date);
CREATE INDEX idx_social_analytics_post ON social_analytics(post_id);

-- Performance metrics indexes
CREATE INDEX idx_retailer_performance_date ON retailer_performance_metrics(measurement_date);
CREATE INDEX idx_retailer_performance_rank ON retailer_performance_metrics(overall_rank);
CREATE INDEX idx_retailer_performance_roi ON retailer_performance_metrics(roi_percentage);
```

### **Query Optimization**
```sql
-- Materialized views for expensive queries
CREATE MATERIALIZED VIEW retailer_performance_dashboard AS
SELECT 
    rpm.retailer_id,
    rpm.retailer_name,
    rr.region_name as region,
    rpm.click_rate,
    rpm.roi_percentage,
    rpm.performance_grade,
    rpm.overall_rank
FROM retailer_performance_metrics rpm
LEFT JOIN retailer_regions rr ON rpm.region_id = rr.region_id
WHERE rpm.measurement_date = CURRENT_DATE
ORDER BY rpm.overall_rank;

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_performance_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW retailer_performance_dashboard;
    REFRESH MATERIALIZED VIEW social_performance_summary;
END;
$$ LANGUAGE plpgsql;
```

## 🔄 Real-time Features

### **Supabase Real-time Setup**
```typescript
// Real-time subscription for campaign updates
useEffect(() => {
  const subscription = supabase
    .channel('campaign_updates')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'campaigns' 
      },
      (payload) => {
        handleCampaignUpdate(payload)
      }
    )
    .on('postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'retailer_performance_metrics'
      },
      (payload) => {
        handlePerformanceUpdate(payload)
      }
    )
    .subscribe()

  return () => subscription.unsubscribe()
}, [])
```

### **Data Synchronization**
```typescript
// Scheduled sync jobs
export async function scheduledSocialSync() {
  const syncService = new SocialDataSyncService()
  
  try {
    await syncService.syncAllAccounts()
    console.log('Social media sync completed successfully')
  } catch (error) {
    console.error('Social media sync failed:', error)
  }
}

// API endpoint for manual sync
export async function POST(request: Request) {
  try {
    const { accountId } = await request.json()
    const syncService = new SocialDataSyncService()
    
    await syncService.syncAccountData(accountId)
    
    return Response.json({ success: true })
  } catch (error) {
    return Response.json(
      { error: 'Sync failed' },
      { status: 500 }
    )
  }
}
```

## 🧪 Testing & Validation

### **Database Testing**
```sql
-- Test campaign ROI calculation
SELECT 
    campaign_id,
    campaign_name,
    calculate_campaign_roi(campaign_id) as calculated_roi,
    roi_percentage as stored_roi
FROM campaign_performance_summary
WHERE ABS(calculate_campaign_roi(campaign_id) - roi_percentage) > 0.1;

-- Test social media data integrity
SELECT 
    sa.account_id,
    sa.platform,
    COUNT(sp.post_id) as posts_count,
    COUNT(san.analytics_id) as analytics_count
FROM social_accounts sa
LEFT JOIN social_posts sp ON sa.account_id = sp.account_id
LEFT JOIN social_analytics san ON sp.post_id = san.post_id
GROUP BY sa.account_id, sa.platform
HAVING COUNT(sp.post_id) > 0 AND COUNT(san.analytics_id) = 0;
```

### **API Testing**
```typescript
// Test campaign analytics endpoint
describe('Campaign Analytics API', () => {
  test('should return campaign data', async () => {
    const response = await fetch('/api/campaigns/test-id/analytics')
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.campaign).toBeDefined()
    expect(data.retailers).toBeInstanceOf(Array)
    expect(data.summary).toBeDefined()
  })
})

// Test social analytics endpoint
describe('Social Analytics API', () => {
  test('should return filtered social data', async () => {
    const response = await fetch('/api/social-analytics?platform=instagram&region=west')
    const data = await response.json()
    
    expect(response.status).toBe(200)
    expect(data.overview).toBeDefined()
    expect(data.retailers).toBeInstanceOf(Array)
  })
})
```

## 🚀 Deployment & Monitoring

### **Database Migration Strategy**
```bash
# Production deployment
supabase db push --db-url $PRODUCTION_DB_URL

# Backup before migration
pg_dump $PRODUCTION_DB_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Run migrations
supabase migration up

# Verify deployment
npm run verify:production
```

### **Performance Monitoring**
```sql
-- Monitor query performance
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Monitor table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY size_bytes DESC;
```

This comprehensive backend and database architecture provides a robust foundation for the CrownSync platform, supporting real-time analytics, multi-tenant security, and scalable performance across all features.