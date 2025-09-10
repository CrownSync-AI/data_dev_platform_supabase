# Campaign Performance Database Documentation

## Overview

This document provides comprehensive documentation for the campaign performance database structure, designed to track and analyze luxury brand marketing campaigns across email channels, CRM conversions, and e-commerce orders with detailed ROI analytics.

## Database Architecture

The campaign performance system consists of **6 core tables** and **1 performance view** that work together to provide comprehensive campaign analytics, retailer performance tracking, and ROI calculations.

---

## Core Tables

### 1. `users`

**Purpose**: Central user management for retailers, brand users, and system administrators

**Data Source**: 
- **User Registration System**: Account creation and profile management
- **CRM Integration**: Retailer onboarding and contact information
- **Administrative Setup**: Manual user creation and role assignment

**Schema**:
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

**Column Descriptions**:
- `id`: Unique user identifier (UUID)
- `email`: User's email address (unique constraint)
- `name`: Display name for the user/retailer
- `user_type`: Role classification ('retailer', 'brand', 'admin')
- `region`: Geographic region ('East', 'West', 'Central', 'North', 'South')
- `created_at/updated_at`: Record lifecycle timestamps
- `is_active`: Account status flag

**Frontend Usage**:
- Retailer selection and filtering in campaign analytics
- Regional performance analysis and grouping
- User authentication and authorization
- Retailer performance leaderboards

**Relationships**:
- Referenced by `campaigns.created_by`
- Referenced by `email_sends.retailer_id`
- Referenced by `crm_conversions.retailer_id`
- Referenced by `ecommerce_orders.retailer_id`

**Sample Data**: 15 luxury retailers + 1 brand user
- **East Region**: Betteridge NY, Tourneau Times Square, Manfredi Jewels, David Yurman Boston, Tiffany & Co Fifth Ave
- **Central Region**: Bachendorf's Dallas, Mayors Jewelry, Fields Jewelers, Jewelry Design Center, Luxury Time Chicago
- **West Region**: Cartier Rodeo Drive, Westime LA, Cellini Beverly Hills, Shreve & Co, Ben Bridge Jeweler

---

### 2. `campaigns`

**Purpose**: Master campaign records with budget tracking and lifecycle management

**Data Source**:
- **Campaign Management System**: Campaign creation and configuration
- **Marketing Planning**: Budget allocation and timeline setup
- **Brand Marketing Team**: Campaign strategy and execution

**Schema**:
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

**Column Descriptions**:

**Campaign Identity**:
- `id`: Unique campaign identifier
- `name`: Campaign display name
- `description`: Campaign description and objectives

**Campaign Lifecycle**:
- `status`: Campaign state ('draft', 'active', 'paused', 'completed')
- `start_date/end_date`: Campaign execution timeframe
- `created_by`: Reference to brand user who created campaign

**Budget Management**:
- `budget_allocated`: Total allocated budget for campaign
- `budget_spent`: Actual amount spent (updated from various sources)

**Frontend Usage**:
- Campaign listing and overview cards
- Budget tracking and spend analysis
- Campaign status management
- Timeline visualization
- ROI calculations (revenue vs budget_spent)

**Relationships**:
- References `users(id)` via `created_by`
- Referenced by `email_campaigns.campaign_id`
- Referenced by `crm_conversions.campaign_id`
- Referenced by `ecommerce_orders.campaign_id`

**Sample Data**:
- **Marco Bicego New 2025 Campaign**: $75,000 allocated, $33,500 spent, active
- **Spring Collection Preview**: $45,000 allocated, $42,000 spent, completed
- **Holiday Luxury Campaign**: $120,000 allocated, $85,000 spent, paused
- **Summer Elegance 2025**: $60,000 allocated, $0 spent, draft

---

### 3. `email_campaigns`

**Purpose**: Email-specific campaign details and content management

**Data Source**:
- **Email Marketing Platform**: Campaign creation and content management
- **Marketing Automation**: Email scheduling and delivery management
- **Content Management System**: Email templates and personalization

**Schema**:
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
```

**Column Descriptions**:

**Email Content**:
- `subject`: Email subject line
- `content`: Email HTML/text content
- `sender_email/sender_name`: From address and display name

**Delivery Management**:
- `sent_at`: Actual send timestamp
- `total_recipients`: Number of recipients targeted

**Frontend Usage**:
- Email campaign performance breakdown
- Subject line analysis and A/B testing
- Send volume tracking
- Campaign timeline visualization

**Relationships**:
- References `campaigns(id)` via `campaign_id`
- Referenced by `email_sends.email_campaign_id`

**Sample Data** (Marco Bicego Campaign):
- **"✨ Introducing Marco Bicego New 2025 Collection"**: 15 recipients
- **"🎯 Exclusive Retailer Pricing - Marco Bicego 2025"**: 15 recipients  
- **"💎 Marco Bicego: Marketing Materials Available"**: 15 recipients

---

### 4. `email_sends` (Core Tracking Table)

**Purpose**: Individual email delivery tracking with engagement metrics

**Data Source**:
- **Email Service Provider (ESP)**: Delivery, bounce, and engagement tracking
- **Email Marketing Platform API**: Real-time delivery status updates
- **Webhook Integration**: Open and click tracking events
- **Server-side Event Tracking**: Email interaction logging

**Schema**:
```sql
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

**Column Descriptions**:

**Email Identity**:
- `email_campaign_id`: Reference to parent email campaign
- `retailer_id`: Target retailer receiving email
- `recipient_email/recipient_name`: Actual recipient details

**Delivery Tracking** (Source: ESP API):
- `sent_at`: Email send timestamp
- `delivered_at`: Successful delivery confirmation
- `status`: Delivery status ('sent', 'delivered', 'bounced', 'failed')
- `bounce_reason`: Error message for failed deliveries

**Engagement Tracking** (Source: Pixel/Link Tracking):
- `opened_at`: Email open timestamp (pixel tracking)
- `clicked_at`: Link click timestamp (click tracking)

**Frontend Usage**:
- **Email Performance Metrics**: Delivery rate, open rate, click rate calculations
- **Engagement Timeline**: Chronological view of email interactions
- **Retailer Performance Analysis**: Individual retailer engagement tracking
- **Campaign Funnel Analysis**: Conversion funnel from send → delivery → open → click

**Relationships**:
- References `email_campaigns(id)` via `email_campaign_id`
- References `users(id)` via `retailer_id`

**Data Volume**: ~27,000 email sends for Marco Bicego campaign (600+ emails per retailer × 15 retailers × 3 email campaigns)

**Performance Calculations**:
```sql
-- Delivery Rate = (delivered emails / total sent) * 100
-- Open Rate = (opened emails / delivered emails) * 100  
-- Click Rate = (clicked emails / delivered emails) * 100
```

---

### 5. `crm_conversions`

**Purpose**: CRM-tracked conversions and lead generation from email campaigns

**Data Source**:
- **CRM System API**: Lead creation and conversion tracking
- **Sales Pipeline Integration**: Opportunity and deal tracking
- **Customer Journey Tracking**: Attribution from email to conversion
- **Sales Team Input**: Manual conversion logging

**Schema**:
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
```

**Column Descriptions**:

**Conversion Attribution**:
- `campaign_id`: Campaign that generated the conversion
- `retailer_id`: Retailer who converted
- `email_send_id`: Specific email that led to conversion (attribution)

**Conversion Details**:
- `conversion_type`: Type of conversion ('sale', 'lead', 'signup', 'demo_request')
- `conversion_value`: Monetary value of conversion
- `conversion_date`: When conversion occurred
- `product_category`: Product category involved ('Necklaces', 'Bracelets', 'Earrings', 'Rings')

**Frontend Usage**:
- **ROI Calculations**: Revenue attribution to campaigns
- **Conversion Funnel Analysis**: Email → Click → Conversion tracking
- **Product Performance**: Category-wise conversion analysis
- **Retailer Conversion Tracking**: Individual retailer conversion rates

**Relationships**:
- References `campaigns(id)` via `campaign_id`
- References `users(id)` via `retailer_id`
- References `email_sends(id)` via `email_send_id`

**Sample Data Distribution**:
- **70% Sales**: $2,000-$10,000 value range
- **20% Leads**: $500-$2,000 value range
- **10% Signups**: $100-$400 value range

---

### 6. `ecommerce_orders`

**Purpose**: E-commerce order tracking with campaign attribution

**Data Source**:
- **E-commerce Platform API**: Order creation and fulfillment data
- **Shopping Cart Integration**: Purchase tracking and attribution
- **Payment Gateway**: Transaction completion confirmation
- **Order Management System**: Order lifecycle tracking

**Schema**:
```sql
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

**Column Descriptions**:

**Order Attribution**:
- `campaign_id`: Campaign that influenced the order
- `retailer_id`: Retailer who placed the order
- `attributed_to_email`: Whether order can be attributed to email campaign

**Order Details**:
- `order_value`: Total order amount
- `order_date`: Order placement timestamp
- `product_count`: Number of items in order
- `order_status`: Order state ('completed', 'pending', 'cancelled', 'refunded')

**Frontend Usage**:
- **Revenue Tracking**: Total revenue generated by campaigns
- **Order Volume Analysis**: Number of orders per campaign
- **Attribution Analysis**: Email-attributed vs organic orders
- **Average Order Value**: AOV calculations per campaign/retailer

**Relationships**:
- References `campaigns(id)` via `campaign_id`
- References `users(id)` via `retailer_id`

**Sample Data**: 1-4 orders per retailer, $1,000-$6,000 order values, 60% attributed to email

---

## Views and Performance Calculations

### 7. `campaign_performance_summary` (View)

**Purpose**: Comprehensive campaign analytics with calculated performance metrics

**Data Source**: Computed from `campaigns`, `email_sends`, `crm_conversions`, and `ecommerce_orders`

**SQL Query**:
```sql
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
```

**Computed Metrics**:

**Email Performance**:
- `total_retailers`: Unique retailers targeted
- `total_emails_sent`: Total email volume
- `emails_delivered/opened/clicked`: Engagement funnel metrics
- `open_rate`: (emails_opened / emails_delivered) × 100
- `click_rate`: (emails_clicked / emails_delivered) × 100

**Financial Performance**:
- `total_revenue`: Sum of CRM conversions + e-commerce orders
- `roi_percentage`: ((total_revenue - budget_spent) / budget_spent) × 100
- `performance_tier`: ROI-based classification ('High ROI', 'Good ROI', 'Standard')

**Frontend Usage**:
- **Campaign Overview Cards**: Main campaign listing with key metrics
- **ROI Dashboard**: Financial performance tracking
- **Campaign Comparison**: Performance benchmarking
- **Executive Reporting**: High-level campaign summaries

**Sample Results** (Marco Bicego Campaign):
- **15 retailers**, **27,037 emails sent**, **43% open rate**, **3.2% click rate**
- **$41,500 total revenue**, **124% ROI**, **"High ROI" performance tier**

---

## Database Indexes

**Performance Optimization Indexes**:

```sql
-- User and region-based queries
CREATE INDEX idx_users_user_type ON users(user_type);
CREATE INDEX idx_users_region ON users(region);

-- Campaign lifecycle queries
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_dates ON campaigns(start_date, end_date);

-- Email tracking performance
CREATE INDEX idx_email_sends_campaign ON email_sends(email_campaign_id);
CREATE INDEX idx_email_sends_retailer ON email_sends(retailer_id);
CREATE INDEX idx_email_sends_status ON email_sends(status);
CREATE INDEX idx_email_sends_dates ON email_sends(sent_at, clicked_at);

-- Revenue and conversion tracking
CREATE INDEX idx_crm_conversions_campaign ON crm_conversions(campaign_id);
CREATE INDEX idx_ecommerce_orders_campaign ON ecommerce_orders(campaign_id);
```

---

## Data Flow and Integration

### Data Sources Integration

1. **Email Service Provider** → `email_sends`
   - Real-time delivery status updates via webhooks
   - Open/click tracking via pixel and link tracking
   - Bounce handling and error reporting

2. **CRM System** → `crm_conversions`
   - Lead creation and qualification tracking
   - Sales pipeline progression
   - Deal closure and revenue attribution

3. **E-commerce Platform** → `ecommerce_orders`
   - Order placement and fulfillment tracking
   - Revenue and product data
   - Campaign attribution via UTM parameters

4. **Marketing Automation** → `email_campaigns`
   - Campaign creation and scheduling
   - Content management and personalization
   - A/B testing and optimization

### Frontend Integration

**API Endpoints**:
- `/api/campaigns` - Campaign listing and overview
- `/api/campaigns/[id]` - Individual campaign details
- Campaign analytics service (`SimplifiedCampaignAnalyticsService`)

**Data Flow**:
1. Frontend requests campaign data via API
2. API queries `campaign_performance_summary` view
3. Service layer processes retailer performance data
4. Frontend renders dashboard components with real-time metrics

**Frontend Components Using This Data**:

**Campaign Overview Page** (`/dashboard/brand-performance/campaigns`):
- **Campaign Cards**: Name, status, ROI, email metrics
- **Performance Summary**: Total campaigns, average ROI, top performers
- **Status Filtering**: Active, completed, draft campaigns

**Individual Campaign Page** (`/dashboard/brand-performance/campaigns/[id]`):
- **Campaign Header**: Name, dates, budget, ROI
- **Email Performance Metrics**: Send volume, open rate, click rate
- **Retailer Performance Table**: Individual retailer rankings and metrics
- **Revenue Tracking**: CRM conversions + e-commerce orders
- **Regional Analysis**: Performance breakdown by geographic region

**Analytics Components**:
- **Conversion Funnel**: Email → Open → Click → Conversion visualization
- **ROI Tracking**: Revenue vs spend with profit/loss indicators
- **Performance Leaderboard**: Top-performing retailers by click rate
- **Timeline Charts**: Campaign performance over time

---

## Data Refresh and Maintenance

### Real-time Data Updates

**Email Tracking** (Real-time via webhooks):
- Delivery confirmations update `email_sends.delivered_at`
- Open tracking updates `email_sends.opened_at`
- Click tracking updates `email_sends.clicked_at`

**CRM Integration** (Hourly sync):
- New conversions added to `crm_conversions`
- Conversion values updated for ROI calculations

**E-commerce Integration** (Real-time via API):
- Order placement creates `ecommerce_orders` records
- Campaign attribution via referrer tracking

### Performance View Refresh

The `campaign_performance_summary` view is automatically updated as underlying data changes, providing real-time campaign metrics without manual refresh requirements.

---

## Sample Data and Metrics

### Marco Bicego New 2025 Campaign

**Campaign Overview**:
- **Budget**: $75,000 allocated, $33,500 spent
- **Timeline**: January 14 - February 14, 2025
- **Status**: Active

**Email Performance**:
- **27,037 emails sent** across 15 retailers
- **43% open rate** (industry-leading for luxury brands)
- **3.2% click rate** (above luxury industry average of 2.1%)
- **98% delivery rate** (high-quality email list)

**Revenue Performance**:
- **$41,500 total revenue** (CRM + e-commerce combined)
- **124% ROI** ((41,500 - 33,500) / 33,500 × 100)
- **"High ROI" performance tier**

**Regional Breakdown**:
- **East Region**: 5 retailers, highest engagement
- **Central Region**: 5 retailers, strong conversion rates
- **West Region**: 5 retailers, premium order values

**Top Performing Retailers**:
1. **Cartier Rodeo Drive**: 4.8% click rate, $8,500 attributed revenue
2. **Betteridge NY**: 4.2% click rate, $7,200 attributed revenue
3. **Tiffany & Co Fifth Ave**: 3.9% click rate, $6,800 attributed revenue

This comprehensive database structure supports full campaign lifecycle management with real-time performance tracking, detailed ROI analysis, and actionable insights for luxury brand marketing optimization.