-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create custom types
CREATE TYPE user_type_enum AS ENUM ('brand', 'retailer', 'admin');
CREATE TYPE file_type_enum AS ENUM ('image', 'video', 'pdf', 'document', 'audio', 'other');
CREATE TYPE action_type_enum AS ENUM ('VIEW', 'DOWNLOAD', 'SHARE', 'DELETE', 'UPLOAD', 'EDIT');
CREATE TYPE campaign_status_enum AS ENUM ('draft', 'active', 'paused', 'completed', 'archived');
CREATE TYPE template_type_enum AS ENUM ('email', 'sms', 'social', 'web', 'print');
CREATE TYPE social_platform_enum AS ENUM ('facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube');
CREATE TYPE email_status_enum AS ENUM ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed');
CREATE TYPE sms_status_enum AS ENUM ('sent', 'delivered', 'failed', 'pending');

-- =============================================
-- CORE USER MANAGEMENT TABLES
-- =============================================

-- Users table (Brand Side & Retailer Side)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_type user_type_enum NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    profile_data JSONB DEFAULT '{}',
    
    -- Indexes
    CONSTRAINT users_email_check CHECK (user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(user_email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_created_at ON users(created_at);

-- =============================================
-- FILE MANAGEMENT SYSTEM
-- =============================================

-- Files table (Brand Side)
CREATE TABLE files (
    file_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name VARCHAR(500) NOT NULL,
    file_type file_type_enum NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size > 0),
    file_path TEXT NOT NULL,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by_user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    
    -- Computed fields will be handled by views
    CONSTRAINT files_size_positive CHECK (file_size > 0)
);

CREATE INDEX idx_files_created_by ON files(created_by_user_id);
CREATE INDEX idx_files_type ON files(file_type);
CREATE INDEX idx_files_created_at ON files(created_at);
CREATE INDEX idx_files_deleted_at ON files(deleted_at);

-- File actions table for tracking interactions
CREATE TABLE file_actions (
    action_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(file_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    action_type action_type_enum NOT NULL,
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id UUID,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_file_actions_file_id ON file_actions(file_id);
CREATE INDEX idx_file_actions_user_id ON file_actions(user_id);
CREATE INDEX idx_file_actions_type ON file_actions(action_type);
CREATE INDEX idx_file_actions_timestamp ON file_actions(action_timestamp);
CREATE INDEX idx_file_actions_session ON file_actions(session_id);

-- =============================================
-- CAMPAIGN MANAGEMENT
-- =============================================

-- Campaigns table (Brand Side & Retailer Side)
CREATE TABLE campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_name VARCHAR(255) NOT NULL,
    campaign_description TEXT,
    campaign_status campaign_status_enum DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by_user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget_allocated DECIMAL(12,2),
    budget_spent DECIMAL(12,2) DEFAULT 0,
    target_audience JSONB DEFAULT '{}',
    campaign_settings JSONB DEFAULT '{}',
    
    CONSTRAINT campaigns_dates_check CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
    CONSTRAINT campaigns_budget_check CHECK (budget_allocated IS NULL OR budget_allocated >= 0)
);

CREATE INDEX idx_campaigns_created_by ON campaigns(created_by_user_id);
CREATE INDEX idx_campaigns_status ON campaigns(campaign_status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);

-- Templates table (Brand Side)
CREATE TABLE templates (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_name VARCHAR(255) NOT NULL,
    template_type template_type_enum NOT NULL,
    template_content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by_user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    parent_template_id UUID REFERENCES templates(template_id)
);

CREATE INDEX idx_templates_created_by ON templates(created_by_user_id);
CREATE INDEX idx_templates_type ON templates(template_type);
CREATE INDEX idx_templates_active ON templates(is_active);

-- =============================================
-- SESSION TRACKING
-- =============================================

-- Sessions table (Brand Side)
CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB DEFAULT '{}',
    location_data JSONB DEFAULT '{}'
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);
CREATE INDEX idx_sessions_ip ON sessions(ip_address);

-- =============================================
-- COLLECTIONS
-- =============================================

-- Collections table (Brand Side)
CREATE TABLE collections (
    collection_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_name VARCHAR(255) NOT NULL,
    collection_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by_user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_collections_created_by ON collections(created_by_user_id);
CREATE INDEX idx_collections_public ON collections(is_public);

-- Collection files junction table
CREATE TABLE collection_files (
    collection_id UUID NOT NULL REFERENCES collections(collection_id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES files(file_id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    added_by_user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    sort_order INTEGER DEFAULT 0,
    
    PRIMARY KEY (collection_id, file_id)
);

CREATE INDEX idx_collection_files_collection ON collection_files(collection_id);
CREATE INDEX idx_collection_files_file ON collection_files(file_id);

-- =============================================
-- GEOGRAPHY & DEVICE TRACKING
-- =============================================

-- Geography table (Brand Side)
CREATE TABLE geography (
    geography_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(2),
    country_name VARCHAR(100),
    region VARCHAR(100),
    city VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_geography_country ON geography(country_code);
CREATE INDEX idx_geography_location ON geography(latitude, longitude);

-- Device information table (Brand Side)
CREATE TABLE devices (
    device_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_type VARCHAR(50), -- mobile, desktop, tablet
    device_brand VARCHAR(100),
    device_model VARCHAR(100),
    operating_system VARCHAR(100),
    browser VARCHAR(100),
    screen_resolution VARCHAR(20),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_agent) -- Prevent duplicate entries for same user agent
);

CREATE INDEX idx_devices_type ON devices(device_type);
CREATE INDEX idx_devices_os ON devices(operating_system);

-- =============================================
-- RETAILER SIDE - EMAIL MARKETING
-- =============================================

-- Email campaigns table (Retailer Side)
CREATE TABLE email_campaigns (
    email_campaign_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    email_subject VARCHAR(500) NOT NULL,
    email_content TEXT NOT NULL,
    sender_email VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    total_recipients INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_email_campaigns_campaign ON email_campaigns(campaign_id);
CREATE INDEX idx_email_campaigns_sent_at ON email_campaigns(sent_at);

-- Email sends table (individual email tracking)
CREATE TABLE email_sends (
    email_send_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email_campaign_id UUID NOT NULL REFERENCES email_campaigns(email_campaign_id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced_at TIMESTAMP WITH TIME ZONE,
    status email_status_enum DEFAULT 'sent',
    bounce_reason TEXT,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_email_sends_campaign ON email_sends(email_campaign_id);
CREATE INDEX idx_email_sends_recipient ON email_sends(recipient_email);
CREATE INDEX idx_email_sends_status ON email_sends(status);
CREATE INDEX idx_email_sends_sent_at ON email_sends(sent_at);

-- =============================================
-- RETAILER SIDE - SMS MARKETING
-- =============================================

-- SMS campaigns table (Retailer Side)
CREATE TABLE sms_campaigns (
    sms_campaign_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(campaign_id) ON DELETE CASCADE,
    sms_content TEXT NOT NULL,
    sender_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    total_recipients INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    
    CONSTRAINT sms_content_length CHECK (LENGTH(sms_content) <= 1600) -- SMS length limit
);

CREATE INDEX idx_sms_campaigns_campaign ON sms_campaigns(campaign_id);
CREATE INDEX idx_sms_campaigns_sent_at ON sms_campaigns(sent_at);

-- SMS sends table (individual SMS tracking)
CREATE TABLE sms_sends (
    sms_send_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sms_campaign_id UUID NOT NULL REFERENCES sms_campaigns(sms_campaign_id) ON DELETE CASCADE,
    recipient_phone VARCHAR(20) NOT NULL,
    recipient_name VARCHAR(255),
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    status sms_status_enum DEFAULT 'sent',
    failure_reason TEXT,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_sms_sends_campaign ON sms_sends(sms_campaign_id);
CREATE INDEX idx_sms_sends_recipient ON sms_sends(recipient_phone);
CREATE INDEX idx_sms_sends_status ON sms_sends(status);
CREATE INDEX idx_sms_sends_sent_at ON sms_sends(sent_at);

-- =============================================
-- RETAILER SIDE - SOCIAL MEDIA
-- =============================================

-- Social media accounts table
CREATE TABLE social_accounts (
    account_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    platform social_platform_enum NOT NULL,
    account_handle VARCHAR(255) NOT NULL,
    account_name VARCHAR(255),
    access_token_encrypted TEXT, -- Store encrypted tokens
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    
    UNIQUE(user_id, platform, account_handle)
);

CREATE INDEX idx_social_accounts_user ON social_accounts(user_id);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);

-- Social media posts table
CREATE TABLE social_posts (
    post_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES social_accounts(account_id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES campaigns(campaign_id) ON DELETE SET NULL,
    post_content TEXT NOT NULL,
    post_type VARCHAR(50), -- text, image, video, carousel
    external_post_id VARCHAR(255), -- Platform's post ID
    scheduled_at TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_social_posts_account ON social_posts(account_id);
CREATE INDEX idx_social_posts_campaign ON social_posts(campaign_id);
CREATE INDEX idx_social_posts_published_at ON social_posts(published_at);

-- Social media engagement table
CREATE TABLE social_engagement (
    engagement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES social_posts(post_id) ON DELETE CASCADE,
    engagement_type VARCHAR(50) NOT NULL, -- like, comment, share, reaction
    engagement_count INTEGER DEFAULT 0,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_social_engagement_post ON social_engagement(post_id);
CREATE INDEX idx_social_engagement_type ON social_engagement(engagement_type);

-- =============================================
-- RETAILER SIDE - RESOURCE HUB (E-COMMERCE)
-- =============================================

-- Products table (Retailer Side)
CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    external_product_id VARCHAR(255), -- Shopify product ID
    product_title VARCHAR(500) NOT NULL,
    product_description TEXT,
    product_type VARCHAR(255),
    vendor VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active',
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    
    UNIQUE(external_product_id)
);

CREATE INDEX idx_products_external_id ON products(external_product_id);
CREATE INDEX idx_products_title ON products USING gin(to_tsvector('english', product_title));
CREATE INDEX idx_products_vendor ON products(vendor);
CREATE INDEX idx_products_status ON products(status);

-- Product variants table
CREATE TABLE product_variants (
    variant_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    external_variant_id VARCHAR(255), -- Shopify variant ID
    variant_title VARCHAR(500),
    sku VARCHAR(255),
    price DECIMAL(12,2),
    compare_at_price DECIMAL(12,2),
    inventory_quantity INTEGER DEFAULT 0,
    weight DECIMAL(10,3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    
    UNIQUE(external_variant_id)
);

CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_external_id ON product_variants(external_variant_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);

-- =============================================
-- ANALYTICS & DERIVED DATA TABLES
-- =============================================

-- Daily analytics summary table
CREATE TABLE daily_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_recorded DATE NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'file', 'campaign', 'user', etc.
    entity_id UUID NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    
    UNIQUE(date_recorded, entity_type, entity_id, metric_name)
);

CREATE INDEX idx_daily_analytics_date ON daily_analytics(date_recorded);
CREATE INDEX idx_daily_analytics_entity ON daily_analytics(entity_type, entity_id);
CREATE INDEX idx_daily_analytics_metric ON daily_analytics(metric_name);

-- =============================================
-- AUDIT TRAIL
-- =============================================

-- Audit log table for tracking all changes
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES users(user_id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_changed_by ON audit_logs(changed_by);
CREATE INDEX idx_audit_logs_changed_at ON audit_logs(changed_at);

-- =============================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- =============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_accounts_updated_at BEFORE UPDATE ON social_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, changed_at)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), NOW());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, changed_at)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (table_name, record_id, action, new_values, changed_at)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), NOW());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- INITIAL DATA SETUP
-- =============================================

-- Insert some initial geography data
INSERT INTO geography (country_code, country_name, region, city, timezone) VALUES
('US', 'United States', 'California', 'San Francisco', 'America/Los_Angeles'),
('US', 'United States', 'New York', 'New York', 'America/New_York'),
('CA', 'Canada', 'Ontario', 'Toronto', 'America/Toronto'),
('GB', 'United Kingdom', 'England', 'London', 'Europe/London'),
('AU', 'Australia', 'New South Wales', 'Sydney', 'Australia/Sydney');

-- Create admin user
INSERT INTO users (user_email, user_name, user_type) VALUES
('admin@datadevplatform.com', 'System Administrator', 'admin');

COMMIT;