-- Create all required tables for campaign analytics

-- Users table (retailers and brands)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email VARCHAR(255) UNIQUE NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) CHECK (user_type IN ('retailer', 'brand', 'admin')),
    region TEXT CHECK (region IN ('East', 'Central', 'West')),
    profile_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Campaigns table
CREATE TABLE campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_name VARCHAR(255) NOT NULL,
    campaign_description TEXT,
    campaign_status VARCHAR(50) CHECK (campaign_status IN ('active', 'paused', 'completed', 'draft')),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_by_user_id UUID REFERENCES users(user_id),
    budget_allocated DECIMAL(12,2),
    target_audience JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email campaigns table
CREATE TABLE email_campaigns (
    email_campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(campaign_id),
    email_subject VARCHAR(500) NOT NULL,
    email_content TEXT,
    sender_email VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    sent_at TIMESTAMP,
    total_recipients INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email sends table (individual email tracking)
CREATE TABLE email_sends (
    email_send_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_campaign_id UUID REFERENCES email_campaigns(email_campaign_id),
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    opened_at TIMESTAMP,
    clicked_at TIMESTAMP,
    status VARCHAR(50) CHECK (status IN ('sent', 'delivered', 'bounced', 'failed')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(user_email);
CREATE INDEX idx_users_type_region ON users(user_type, region);
CREATE INDEX idx_campaigns_status ON campaigns(campaign_status);
CREATE INDEX idx_email_campaigns_campaign_id ON email_campaigns(campaign_id);
CREATE INDEX idx_email_sends_campaign_id ON email_sends(email_campaign_id);
CREATE INDEX idx_email_sends_recipient ON email_sends(recipient_email);
CREATE INDEX idx_email_sends_status ON email_sends(status); 