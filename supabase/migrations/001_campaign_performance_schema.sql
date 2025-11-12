-- =============================================
-- SIMPLIFIED CAMPAIGN PERFORMANCE DATABASE SCHEMA
-- For early-phase production template
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- CORE TABLES FOR CAMPAIGN PERFORMANCE
-- =============================================

-- Users table (simplified for retailers and brand users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) DEFAULT 'retailer', -- 'brand', 'retailer', 'admin'
    region VARCHAR(50), -- 'East', 'Central', 'West'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget_allocated DECIMAL(12,2),
    budget_spent DECIMAL(12,2) DEFAULT 0,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email campaigns linked to main campaigns
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

-- Individual email sends for tracking
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
    status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'delivered', 'opened', 'clicked', 'bounced'
    bounce_reason TEXT
);

-- CRM data for ROI calculations (simulated future integration)
CREATE TABLE crm_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES campaigns(id),
    retailer_id UUID REFERENCES users(id),
    email_send_id UUID REFERENCES email_sends(id),
    conversion_type VARCHAR(50), -- 'sale', 'lead', 'signup'
    conversion_value DECIMAL(12,2), -- Revenue generated
    conversion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    product_category VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- E-commerce integration data (simulated future integration)
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

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_region ON users(region);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);
CREATE INDEX idx_email_sends_campaign ON email_sends(email_campaign_id);
CREATE INDEX idx_email_sends_retailer ON email_sends(retailer_id);
CREATE INDEX idx_email_sends_status ON email_sends(status);
CREATE INDEX idx_email_sends_dates ON email_sends(sent_at, clicked_at);
CREATE INDEX idx_crm_conversions_campaign ON crm_conversions(campaign_id);
CREATE INDEX idx_ecommerce_orders_campaign ON ecommerce_orders(campaign_id);

-- =============================================
-- CAMPAIGN PERFORMANCE VIEW
-- =============================================

CREATE OR REPLACE VIEW campaign_performance_summary AS
SELECT 
    c.id as campaign_id,
    c.name as campaign_name,
    c.status,
    c.start_date,
    c.end_date,
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
    
    CASE 
        WHEN COUNT(es.id) FILTER (WHERE es.status = 'delivered') > 0 
        THEN ROUND((COUNT(es.id) FILTER (WHERE es.clicked_at IS NOT NULL)::DECIMAL / COUNT(es.id) FILTER (WHERE es.status = 'delivered')) * 100, 2)
        ELSE 0 
    END as click_rate,
    
    -- Revenue and ROI calculations
    COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) as total_revenue,
    CASE 
        WHEN c.budget_spent > 0 
        THEN ROUND(((COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) - c.budget_spent) / c.budget_spent) * 100, 1)
        ELSE 0 
    END as roi_percentage,
    
    -- Performance tier based on ROI
    CASE 
        WHEN c.budget_spent > 0 AND ((COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) - c.budget_spent) / c.budget_spent) * 100 >= 100 THEN 'High ROI'
        WHEN c.budget_spent > 0 AND ((COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) - c.budget_spent) / c.budget_spent) * 100 >= 50 THEN 'Good ROI'
        ELSE 'Standard'
    END as performance_tier,
    
    c.created_at,
    c.updated_at

FROM campaigns c
LEFT JOIN email_campaigns ec ON c.id = ec.campaign_id
LEFT JOIN email_sends es ON ec.id = es.email_campaign_id
LEFT JOIN users u ON es.retailer_id = u.id
LEFT JOIN crm_conversions cc ON c.id = cc.campaign_id
LEFT JOIN ecommerce_orders eo ON c.id = eo.campaign_id
GROUP BY c.id, c.name, c.status, c.start_date, c.end_date, c.budget_allocated, c.budget_spent, c.created_at, c.updated_at;

-- =============================================
-- ROW LEVEL SECURITY (Basic)
-- =============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_orders ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users (simplified for demo)
CREATE POLICY "Allow read access" ON users FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON campaigns FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON email_campaigns FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON email_sends FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON crm_conversions FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON ecommerce_orders FOR SELECT USING (true);

-- Allow service role full access
CREATE POLICY "Service role full access" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access" ON campaigns FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access" ON email_campaigns FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access" ON email_sends FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access" ON crm_conversions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
CREATE POLICY "Service role full access" ON ecommerce_orders FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

COMMIT;