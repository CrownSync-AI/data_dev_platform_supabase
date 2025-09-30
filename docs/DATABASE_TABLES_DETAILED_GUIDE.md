# CrownSync Database Tables - Detailed Guide

## 📚 **Table of Contents**
1. [Core User Management](#core-user-management)
2. [Brand & Retailer Management](#brand--retailer-management)
3. [Campaign Management](#campaign-management)
4. [Social Media Analytics](#social-media-analytics)
5. [Email Campaign Tracking](#email-campaign-tracking)
6. [Performance Analytics](#performance-analytics)
7. [Real-time Metrics](#real-time-metrics)

---

## 🔐 **Core User Management**

### **Table 1: users**
**Purpose**: Central user authentication and role management
**Usage**: Login, permissions, user profiles
**Frontend Usage**: User authentication, role-based UI rendering

| Column Name | Data Type | Purpose | Example Value | Constraints |
|-------------|-----------|---------|---------------|-------------|
| `id` | UUID | Unique user identifier | `123e4567-e89b-12d3-a456-426614174000` | PRIMARY KEY |
| `email` | VARCHAR(255) | User login email | `john@luxuryboutique.com` | UNIQUE, NOT NULL |
| `full_name` | VARCHAR(255) | Display name | `John Smith` | NOT NULL |
| `role` | VARCHAR(50) | User permission level | `brand`, `retailer`, `admin` | CHECK constraint |
| `region` | VARCHAR(100) | Geographic location | `East Coast`, `West Coast` | Optional |
| `company_name` | VARCHAR(255) | Associated company | `Luxury Boutique NYC` | Optional |
| `phone` | VARCHAR(50) | Contact number | `+1-555-123-4567` | Optional |
| `avatar_url` | TEXT | Profile picture URL | `https://...` | Optional |
| `is_active` | BOOLEAN | Account status | `true`, `false` | DEFAULT true |
| `last_login` | TIMESTAMPTZ | Last access time | `2024-12-20T10:30:00Z` | Optional |
| `created_at` | TIMESTAMPTZ | Account creation | `2024-01-15T09:00:00Z` | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | Last modification | `2024-12-20T14:22:00Z` | DEFAULT NOW() |

---

## 🏢 **Brand & Retailer Management**

### **Table 2: brands**
**Purpose**: Brand company profiles and branding settings
**Usage**: Brand identity, campaign ownership, visual customization
**Frontend Usage**: Brand dashboard, campaign attribution, UI theming
|
 Column Name | Data Type | Purpose | Example Value | Constraints |
|-------------|-----------|---------|---------------|-------------|
| `brand_id` | UUID | Unique brand identifier | `456e7890-e89b-12d3-a456-426614174001` | PRIMARY KEY |
| `brand_name` | VARCHAR(255) | Company brand name | `Luxury Fashion House` | NOT NULL |
| `brand_description` | TEXT | Brand story/description | `Premium luxury fashion...` | Optional |
| `industry` | VARCHAR(100) | Business sector | `Fashion`, `Jewelry`, `Cosmetics` | Optional |
| `headquarters_region` | VARCHAR(100) | Main office location | `New York`, `Los Angeles` | Optional |
| `website_url` | TEXT | Brand website | `https://luxuryfashion.com` | Optional |
| `logo_url` | TEXT | Brand logo image | `https://cdn.../logo.png` | Optional |
| `primary_color` | VARCHAR(7) | Brand color (hex) | `#1a365d` | Optional |
| `secondary_color` | VARCHAR(7) | Accent color (hex) | `#2d3748` | Optional |
| `created_by` | UUID | Creator user ID | References `users(id)` | FOREIGN KEY |
| `is_active` | BOOLEAN | Brand status | `true`, `false` | DEFAULT true |
| `created_at` | TIMESTAMPTZ | Creation timestamp | `2024-01-15T09:00:00Z` | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | Last update | `2024-12-20T14:22:00Z` | DEFAULT NOW() |

### **Table 3: retailers**
**Purpose**: Retailer partner profiles and geographic classification
**Usage**: Retailer management, performance tracking, regional analysis
**Frontend Usage**: Retailer selection, performance rankings, regional filters

| Column Name | Data Type | Purpose | Example Value | Constraints |
|-------------|-----------|---------|---------------|-------------|
| `retailer_id` | UUID | Unique retailer identifier | `789e0123-e89b-12d3-a456-426614174002` | PRIMARY KEY |
| `retailer_name` | VARCHAR(255) | Store/company name | `Luxury Boutique NYC` | NOT NULL |
| `region` | VARCHAR(100) | Geographic region | `East Coast`, `Central`, `West Coast` | NOT NULL |
| `contact_email` | VARCHAR(255) | Primary contact email | `contact@luxuryboutique.com` | Optional |
| `contact_phone` | VARCHAR(50) | Primary phone number | `+1-212-555-0123` | Optional |
| `address` | TEXT | Physical address | `123 Fifth Avenue, Suite 100` | Optional |
| `city` | VARCHAR(100) | City location | `New York` | Optional |
| `state` | VARCHAR(100) | State/province | `New York` | Optional |
| `country` | VARCHAR(100) | Country | `United States` | Optional |
| `postal_code` | VARCHAR(20) | ZIP/postal code | `10001` | Optional |
| `website_url` | TEXT | Retailer website | `https://luxuryboutique.com` | Optional |
| `store_type` | VARCHAR(100) | Store category | `boutique`, `department`, `online` | Optional |
| `tier` | VARCHAR(50) | Partnership level | `premium`, `standard`, `basic` | CHECK constraint |
| `is_active` | BOOLEAN | Active status | `true`, `false` | DEFAULT true |
| `onboarding_date` | DATE | Partnership start | `2024-01-15` | Optional |
| `created_at` | TIMESTAMPTZ | Record creation | `2024-01-15T09:00:00Z` | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | Last modification | `2024-12-20T14:22:00Z` | DEFAULT NOW() |

---

## 🎯 **Campaign Management**

### **Table 4: campaigns**
**Purpose**: Central campaign orchestration and management
**Usage**: Campaign creation, status tracking, budget management
**Frontend Usage**: Campaign cards, filters, performance tracking

| Column Name | Data Type | Purpose | Example Value | Constraints |
|-------------|-----------|---------|---------------|-------------|
| `campaign_id` | UUID | Unique campaign identifier | `abc12345-e89b-12d3-a456-426614174003` | PRIMARY KEY |
| `campaign_name` | VARCHAR(255) | Campaign title | `Spring Collection Preview` | NOT NULL |
| `campaign_description` | TEXT | Campaign details | `Showcase new spring collection...` | Optional |
| `campaign_type` | VARCHAR(50) | Campaign category | `social`, `email`, `mixed` | CHECK constraint |
| `campaign_status` | VARCHAR(50) | Current status | `draft`, `active`, `paused`, `completed` | CHECK constraint |
| `brand_id` | UUID | Owning brand | References `brands(brand_id)` | FOREIGN KEY |
| `start_date` | DATE | Campaign launch date | `2024-12-01` | NOT NULL |
| `end_date` | DATE | Campaign end date | `2025-01-01` | Optional |
| `budget_allocated` | DECIMAL(12,2) | Total budget | `50000.00` | Optional |
| `budget_spent` | DECIMAL(12,2) | Amount spent | `32500.75` | DEFAULT 0 |
| `target_audience` | TEXT | Audience description | `Luxury fashion enthusiasts 25-45` | Optional |
| `campaign_objectives` | TEXT[] | Goal array | `["brand_awareness", "sales"]` | Optional |
| `performance_tier` | VARCHAR(50) | Performance level | `high`, `good`, `standard` | CHECK constraint |
| `trend_direction` | VARCHAR(50) | Performance trend | `up`, `down`, `stable` | CHECK constraint |
| `created_by` | UUID | Creator user ID | References `users(id)` | FOREIGN KEY |
| `created_at` | TIMESTAMPTZ | Creation time | `2024-11-01T09:00:00Z` | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | Last update | `2024-12-20T14:22:00Z` | DEFAULT NOW() |

### **Table 5: campaign_retailers**
**Purpose**: Link campaigns with participating retailers
**Usage**: Track which retailers participate in which campaigns
**Frontend Usage**: Retailer selection, participation tracking

| Column Name | Data Type | Purpose | Example Value | Constraints |
|-------------|-----------|---------|---------------|-------------|
| `id` | UUID | Unique relationship ID | `def67890-e89b-12d3-a456-426614174004` | PRIMARY KEY |
| `campaign_id` | UUID | Campaign reference | References `campaigns(campaign_id)` | FOREIGN KEY |
| `retailer_id` | UUID | Retailer reference | References `retailers(retailer_id)` | FOREIGN KEY |
| `participation_status` | VARCHAR(50) | Participation level | `active`, `inactive`, `pending` | CHECK constraint |
| `joined_date` | DATE | Participation start | `2024-12-01` | DEFAULT CURRENT_DATE |
| `performance_score` | DECIMAL(5,2) | Individual score | `8.6` | Optional |
| `notes` | TEXT | Additional notes | `High performer in social media` | Optional |
| `created_at` | TIMESTAMPTZ | Record creation | `2024-12-01T10:00:00Z` | DEFAULT NOW() |

---

## 📱 **Social Media Analytics**

### **Table 6: social_accounts**
**Purpose**: Manage social media accounts for each retailer
**Usage**: Platform connection, account verification, follower tracking
**Frontend Usage**: Platform selection, account status, follower counts
### **Tab
le 10: email_sends**
**Purpose**: Individual email delivery tracking and engagement metrics
**Usage**: Email performance analysis, delivery status monitoring
**Frontend Usage**: Email analytics, engagement charts, delivery reports

| Column Name | Data Type | Purpose | Example Value | Constraints |
|-------------|-----------|---------|---------------|-------------|
| `send_id` | UUID | Unique send record ID | `stu67890-e89b-12d3-a456-426614174009` | PRIMARY KEY |
| `email_campaign_id` | UUID | Parent email campaign | References `email_campaigns(email_campaign_id)` | FOREIGN KEY |
| `retailer_id` | UUID | Recipient retailer | References `retailers(retailer_id)` | FOREIGN KEY |
| `recipient_email` | VARCHAR(255) | Recipient address | `manager@luxurystore.com` | NOT NULL |
| `recipient_name` | VARCHAR(255) | Recipient name | `Sarah Johnson` | Optional |
| `send_status` | VARCHAR(50) | Delivery status | `sent`, `delivered`, `bounced`, `failed` | CHECK constraint |
| `sent_at` | TIMESTAMPTZ | Send timestamp | `2024-12-20T10:01:23Z` | Optional |
| `delivered_at` | TIMESTAMPTZ | Delivery timestamp | `2024-12-20T10:01:45Z` | Optional |
| `opened_at` | TIMESTAMPTZ | First open time | `2024-12-20T11:15:30Z` | Optional |
| `clicked_at` | TIMESTAMPTZ | First click time | `2024-12-20T11:16:15Z` | Optional |
| `open_count` | INTEGER | Total opens | `3` | DEFAULT 0 |
| `click_count` | INTEGER | Total clicks | `1` | DEFAULT 0 |
| `bounce_reason` | TEXT | Bounce error message | `Mailbox full` | Optional |
| `unsubscribed_at` | TIMESTAMPTZ | Unsubscribe time | `2024-12-20T12:00:00Z` | Optional |
| `spam_reported_at` | TIMESTAMPTZ | Spam report time | `2024-12-20T13:00:00Z` | Optional |
| `user_agent` | TEXT | Email client info | `Mozilla/5.0 (iPhone; CPU iPhone OS...)` | Optional |
| `ip_address` | INET | Recipient IP | `192.168.1.100` | Optional |
| `location_data` | JSONB | Geographic data | `{"city": "New York", "country": "US"}` | Optional |
| `created_at` | TIMESTAMPTZ | Record creation | `2024-12-20T10:00:00Z` | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | Last update | `2024-12-20T14:22:00Z` | DEFAULT NOW() |

---

## 👥 **Customer Relationship Management (CRM)**

### **Table 11: customers**
**Purpose**: Customer profile and contact information management
**Usage**: CRM operations, customer segmentation, communication tracking
**Frontend Usage**: Customer profiles, contact management, segmentation

| Column Name | Data Type | Purpose | Example Value | Constraints |
|-------------|-----------|---------|---------------|-------------|
| `customer_id` | UUID | Unique customer identifier | `vwx12345-e89b-12d3-a456-426614174010` | PRIMARY KEY |
| `retailer_id` | UUID | Associated retailer | References `retailers(retailer_id)` | FOREIGN KEY |
| `first_name` | VARCHAR(255) | Customer first name | `Emma` | Optional |
| `last_name` | VARCHAR(255) | Customer last name | `Thompson` | Optional |
| `email` | VARCHAR(255) | Primary email | `emma.thompson@email.com` | UNIQUE |
| `phone` | VARCHAR(50) | Phone number | `+1-555-0123` | Optional |
| `date_of_birth` | DATE | Birth date | `1985-03-15` | Optional |
| `gender` | VARCHAR(20) | Gender identity | `female`, `male`, `non-binary`, `prefer-not-to-say` | Optional |
| `address_line1` | VARCHAR(255) | Street address | `123 Fashion Ave` | Optional |
| `address_line2` | VARCHAR(255) | Apt/Suite | `Suite 4B` | Optional |
| `city` | VARCHAR(100) | City | `New York` | Optional |
| `state` | VARCHAR(100) | State/Province | `NY` | Optional |
| `postal_code` | VARCHAR(20) | ZIP/Postal code | `10001` | Optional |
| `country` | VARCHAR(100) | Country | `United States` | Optional |
| `customer_tier` | VARCHAR(50) | Loyalty tier | `bronze`, `silver`, `gold`, `platinum` | DEFAULT 'bronze' |
| `lifetime_value` | DECIMAL(10,2) | Total customer value | `2500.00` | DEFAULT 0 |
| `total_orders` | INTEGER | Order count | `12` | DEFAULT 0 |
| `last_order_date` | DATE | Most recent order | `2024-12-15` | Optional |
| `acquisition_source` | VARCHAR(100) | How customer found us | `social_media`, `referral`, `organic` | Optional |
| `acquisition_date` | DATE | First interaction | `2023-06-10` | DEFAULT CURRENT_DATE |
| `communication_preferences` | JSONB | Contact preferences | `{"email": true, "sms": false, "phone": true}` | Optional |
| `tags` | TEXT[] | Customer tags | `["vip", "frequent-buyer", "social-influencer"]` | Optional |
| `notes` | TEXT | Customer notes | `Prefers sustainable fashion options` | Optional |
| `is_active` | BOOLEAN | Account status | `true`, `false` | DEFAULT true |
| `created_at` | TIMESTAMPTZ | Record creation | `2023-06-10T14:30:00Z` | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | Last update | `2024-12-20T14:22:00Z` | DEFAULT NOW() |

### **Table 12: customer_interactions**
**Purpose**: Customer touchpoint and interaction history tracking
**Usage**: Interaction timeline, customer journey analysis
**Frontend Usage**: Customer timeline, interaction history, engagement tracking

| Column Name | Data Type | Purpose | Example Value | Constraints |
|-------------|-----------|---------|---------------|-------------|
| `interaction_id` | UUID | Unique interaction ID | `yza23456-e89b-12d3-a456-426614174011` | PRIMARY KEY |
| `customer_id` | UUID | Customer involved | References `customers(customer_id)` | FOREIGN KEY |
| `retailer_id` | UUID | Retailer context | References `retailers(retailer_id)` | FOREIGN KEY |
| `interaction_type` | VARCHAR(100) | Type of interaction | `email_open`, `website_visit`, `purchase`, `support_call` | NOT NULL |
| `interaction_channel` | VARCHAR(50) | Communication channel | `email`, `phone`, `website`, `social_media`, `in_store` | Optional |
| `interaction_subject` | VARCHAR(500) | Interaction topic | `Spring Collection Inquiry` | Optional |
| `interaction_details` | TEXT | Detailed description | `Customer inquired about availability of...` | Optional |
| `interaction_outcome` | VARCHAR(100) | Result/resolution | `resolved`, `follow_up_needed`, `escalated` | Optional |
| `staff_member` | VARCHAR(255) | Staff involved | `Sarah Johnson` | Optional |
| `interaction_duration` | INTEGER | Duration in minutes | `15` | Optional |
| `interaction_rating` | INTEGER | Customer satisfaction | `5` | CHECK (1-5) |
| `follow_up_required` | BOOLEAN | Needs follow-up | `false` | DEFAULT false |
| `follow_up_date` | DATE | Scheduled follow-up | `2024-12-25` | Optional |
| `metadata` | JSONB | Additional data | `{"campaign_id": "abc123", "source_page": "/products"}` | Optional |
| `interaction_date` | TIMESTAMPTZ | When it occurred | `2024-12-20T14:30:00Z` | DEFAULT NOW() |
| `created_at` | TIMESTAMPTZ | Record creation | `2024-12-20T14:35:00Z` | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | Last update | `2024-12-20T14:35:00Z` | DEFAULT NOW() |

---

## 📊 **Performance Analytics & Reporting**

### **Table 13: retailer_performance_metrics**
**Purpose**: Comprehensive retailer performance tracking and KPI management
**Usage**: Performance dashboards, retailer rankings, business intelligence
**Frontend Usage**: Performance cards, ranking tables, trend charts

| Column Name | Data Type | Purpose | Example Value | Constraints |
|-------------|-----------|---------|---------------|-------------|
| `metric_id` | UUID | Unique metric record | `bcd34567-e89b-12d3-a456-426614174012` | PRIMARY KEY |
| `retailer_id` | UUID | Retailer being measured | References `retailers(retailer_id)` | FOREIGN KEY |
| `metric_date` | DATE | Measurement date | `2024-12-20` | NOT NULL |
| `metric_period` | VARCHAR(20) | Time period type | `daily`, `weekly`, `monthly`, `quarterly` | NOT NULL |
| `revenue` | DECIMAL(12,2) | Total revenue | `125000.00` | DEFAULT 0 |
| `orders_count` | INTEGER | Number of orders | `45` | DEFAULT 0 |
| `average_order_value` | DECIMAL(10,2) | AOV | `2777.78` | DEFAULT 0 |
| `customer_acquisition_cost` | DECIMAL(10,2) | CAC | `150.00` | DEFAULT 0 |
| `customer_lifetime_value` | DECIMAL(10,2) | CLV | `3500.00` | DEFAULT 0 |
| `conversion_rate` | DECIMAL(5,2) | Conversion percentage | `3.25` | DEFAULT 0 |
| `email_open_rate` | DECIMAL(5,2) | Email engagement | `24.5` | DEFAULT 0 |
| `email_click_rate` | DECIMAL(5,2) | Email clicks | `4.2` | DEFAULT 0 |
| `social_engagement_rate` | DECIMAL(5,2) | Social media engagement | `5.8` | DEFAULT 0 |
| `social_follower_growth` | INTEGER | New followers | `125` | DEFAULT 0 |
| `website_traffic` | INTEGER | Site visits | `8500` | DEFAULT 0 |
| `bounce_rate` | DECIMAL(5,2) | Website bounce rate | `35.2` | DEFAULT 0 |
| `page_views` | INTEGER | Total page views | `25000` | DEFAULT 0 |
| `session_duration` | INTEGER | Avg session (seconds) | `180` | DEFAULT 0 |
| `inventory_turnover` | DECIMAL(8,2) | Inventory efficiency | `4.5` | DEFAULT 0 |
| `return_rate` | DECIMAL(5,2) | Return percentage | `8.5` | DEFAULT 0 |
| `customer_satisfaction` | DECIMAL(3,1) | CSAT score | `4.2` | CHECK (1.0-5.0) |
| `net_promoter_score` | INTEGER | NPS | `65` | CHECK (-100 to 100) |
| `market_share` | DECIMAL(5,2) | Regional market share | `12.5` | DEFAULT 0 |
| `competitive_ranking` | INTEGER | Market position | `3` | Optional |
| `performance_score` | DECIMAL(5,2) | Overall score | `87.5` | DEFAULT 0 |
| `created_at` | TIMESTAMPTZ | Record creation | `2024-12-20T23:59:59Z` | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | Last update | `2024-12-20T23:59:59Z` | DEFAULT NOW() |

### **Table 14: brand_assets**
**Purpose**: Digital asset management and performance tracking
**Usage**: Asset library, usage analytics, ROI measurement
**Frontend Usage**: Asset gallery, usage reports, performance metrics

| Column Name | Data Type | Purpose | Example Value | Constraints |
|-------------|-----------|---------|---------------|-------------|
| `asset_id` | UUID | Unique asset identifier | `efg45678-e89b-12d3-a456-426614174013` | PRIMARY KEY |
| `asset_name` | VARCHAR(255) | Asset display name | `Spring Collection Hero Image` | NOT NULL |
| `asset_type` | VARCHAR(50) | Type of asset | `image`, `video`, `document`, `template` | NOT NULL |
| `asset_category` | VARCHAR(100) | Asset category | `product_photos`, `marketing_materials`, `logos` | Optional |
| `file_path` | TEXT | Storage location | `/assets/images/spring-2024/hero.jpg` | NOT NULL |
| `file_url` | TEXT | Public URL | `https://cdn.crownsync.com/assets/hero.jpg` | Optional |
| `file_size` | BIGINT | File size in bytes | `2048576` | DEFAULT 0 |
| `file_format` | VARCHAR(20) | File extension | `jpg`, `png`, `mp4`, `pdf` | Optional |
| `dimensions` | VARCHAR(50) | Image/video dimensions | `1920x1080` | Optional |
| `duration` | INTEGER | Video duration (seconds) | `30` | Optional |
| `alt_text` | TEXT | Accessibility description | `Model wearing spring dress in garden` | Optional |
| `tags` | TEXT[] | Asset tags | `["spring", "fashion", "outdoor", "lifestyle"]` | Optional |
| `usage_count` | INTEGER | Times used | `25` | DEFAULT 0 |
| `last_used` | TIMESTAMPTZ | Last usage date | `2024-12-20T10:00:00Z` | Optional |
| `performance_score` | DECIMAL(5,2) | Engagement score | `8.5` | DEFAULT 0 |
| `total_impressions` | INTEGER | Total views | `150000` | DEFAULT 0 |
| `total_engagement` | INTEGER | Total interactions | `3500` | DEFAULT 0 |
| `conversion_rate` | DECIMAL(5,2) | Asset conversion rate | `2.3` | DEFAULT 0 |
| `created_by` | UUID | Creator user ID | References `users(user_id)` | FOREIGN KEY |
| `approved_by` | UUID | Approver user ID | References `users(user_id)` | FOREIGN KEY |
| `approval_status` | VARCHAR(50) | Approval state | `pending`, `approved`, `rejected` | DEFAULT 'pending' |
| `approval_date` | TIMESTAMPTZ | Approval timestamp | `2024-12-19T15:00:00Z` | Optional |
| `expiry_date` | DATE | Asset expiration | `2025-06-01` | Optional |
| `is_active` | BOOLEAN | Active status | `true`, `false` | DEFAULT true |
| `created_at` | TIMESTAMPTZ | Upload time | `2024-12-19T14:00:00Z` | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | Last modification | `2024-12-20T14:22:00Z` | DEFAULT NOW() |

---

## 🔄 **System Management & Audit**

### **Table 15: audit_logs**
**Purpose**: System activity tracking and security audit trail
**Usage**: Security monitoring, compliance reporting, debugging
**Frontend Usage**: Activity logs, security reports, system monitoring

| Column Name | Data Type | Purpose | Example Value | Constraints |
|-------------|-----------|---------|---------------|-------------|
| `log_id` | UUID | Unique log entry ID | `hij56789-e89b-12d3-a456-426614174014` | PRIMARY KEY |
| `user_id` | UUID | User who performed action | References `users(user_id)` | FOREIGN KEY |
| `action_type` | VARCHAR(100) | Type of action | `login`, `create`, `update`, `delete`, `view` | NOT NULL |
| `table_name` | VARCHAR(100) | Affected table | `campaigns`, `retailers`, `users` | Optional |
| `record_id` | UUID | Affected record ID | `abc12345-e89b-12d3-a456-426614174000` | Optional |
| `action_description` | TEXT | Human-readable description | `User updated campaign "Spring Collection"` | Optional |
| `old_values` | JSONB | Previous data state | `{"status": "draft", "budget": 10000}` | Optional |
| `new_values` | JSONB | New data state | `{"status": "active", "budget": 15000}` | Optional |
| `ip_address` | INET | User IP address | `192.168.1.100` | Optional |
| `user_agent` | TEXT | Browser/client info | `Mozilla/5.0 (Macintosh; Intel Mac OS X...)` | Optional |
| `session_id` | VARCHAR(255) | User session ID | `sess_abc123def456` | Optional |
| `request_method` | VARCHAR(10) | HTTP method | `GET`, `POST`, `PUT`, `DELETE` | Optional |
| `request_url` | TEXT | Request endpoint | `/api/campaigns/123` | Optional |
| `response_status` | INTEGER | HTTP status code | `200`, `404`, `500` | Optional |
| `execution_time` | INTEGER | Processing time (ms) | `150` | Optional |
| `error_message` | TEXT | Error details | `Validation failed: Budget exceeds limit` | Optional |
| `severity_level` | VARCHAR(20) | Log severity | `info`, `warning`, `error`, `critical` | DEFAULT 'info' |
| `created_at` | TIMESTAMPTZ | Log timestamp | `2024-12-20T14:22:00Z` | DEFAULT NOW() |

### **Table 16: system_settings**
**Purpose**: Application configuration and feature flags management
**Usage**: System configuration, feature toggles, environment settings
**Frontend Usage**: Admin settings, feature controls, system status

| Column Name | Data Type | Purpose | Example Value | Constraints |
|-------------|-----------|---------|---------------|-------------|
| `setting_id` | UUID | Unique setting ID | `klm67890-e89b-12d3-a456-426614174015` | PRIMARY KEY |
| `setting_key` | VARCHAR(255) | Setting identifier | `email_rate_limit`, `social_sync_interval` | UNIQUE, NOT NULL |
| `setting_value` | TEXT | Setting value | `100`, `true`, `{"max_retries": 3}` | Optional |
| `setting_type` | VARCHAR(50) | Data type | `string`, `integer`, `boolean`, `json` | NOT NULL |
| `setting_category` | VARCHAR(100) | Setting group | `email`, `social_media`, `security`, `performance` | Optional |
| `description` | TEXT | Setting description | `Maximum emails per hour per retailer` | Optional |
| `default_value` | TEXT | Default setting | `50` | Optional |
| `is_encrypted` | BOOLEAN | Encryption flag | `false` | DEFAULT false |
| `is_public` | BOOLEAN | Public visibility | `false` | DEFAULT false |
| `validation_rules` | JSONB | Validation constraints | `{"min": 1, "max": 1000, "type": "integer"}` | Optional |
| `last_modified_by` | UUID | Last editor | References `users(user_id)` | FOREIGN KEY |
| `environment` | VARCHAR(50) | Environment scope | `development`, `staging`, `production` | DEFAULT 'production' |
| `created_at` | TIMESTAMPTZ | Creation time | `2024-01-01T00:00:00Z` | DEFAULT NOW() |
| `updated_at` | TIMESTAMPTZ | Last update | `2024-12-20T14:22:00Z` | DEFAULT NOW() |

---

## 📈 **Performance Views & Aggregations**

### **View 1: campaign_performance_summary**
**Purpose**: Aggregated campaign metrics for dashboard display
**Usage**: Campaign analytics, performance comparisons, ROI analysis
**Frontend Usage**: Campaign cards, performance charts, summary tables

```sql
CREATE VIEW campaign_performance_summary AS
SELECT 
    c.campaign_id,
    c.campaign_name,
    c.campaign_type,
    c.start_date,
    c.end_date,
    c.budget,
    c.status,
    -- Email Metrics
    COUNT(DISTINCT es.send_id) as total_emails_sent,
    COUNT(DISTINCT CASE WHEN es.opened_at IS NOT NULL THEN es.send_id END) as emails_opened,
    COUNT(DISTINCT CASE WHEN es.clicked_at IS NOT NULL THEN es.send_id END) as emails_clicked,
    ROUND(
        COUNT(DISTINCT CASE WHEN es.opened_at IS NOT NULL THEN es.send_id END)::DECIMAL / 
        NULLIF(COUNT(DISTINCT es.send_id), 0) * 100, 2
    ) as email_open_rate,
    -- Social Metrics
    SUM(sa.impressions) as total_impressions,
    SUM(sa.reach) as total_reach,
    SUM(sa.engagement) as total_engagement,
    ROUND(
        SUM(sa.engagement)::DECIMAL / NULLIF(SUM(sa.impressions), 0) * 100, 2
    ) as engagement_rate,
    -- Performance Score
    ROUND(
        (COALESCE(SUM(sa.engagement), 0) * 0.4 + 
         COALESCE(COUNT(DISTINCT CASE WHEN es.opened_at IS NOT NULL THEN es.send_id END), 0) * 0.6) / 
        GREATEST(COALESCE(SUM(sa.impressions), 1), COALESCE(COUNT(DISTINCT es.send_id), 1)) * 100, 2
    ) as performance_score
FROM campaigns c
LEFT JOIN email_campaigns ec ON c.campaign_id = ec.campaign_id
LEFT JOIN email_sends es ON ec.email_campaign_id = es.email_campaign_id
LEFT JOIN social_posts sp ON c.campaign_id = sp.campaign_id
LEFT JOIN social_analytics sa ON sp.post_id = sa.post_id
GROUP BY c.campaign_id, c.campaign_name, c.campaign_type, c.start_date, c.end_date, c.budget, c.status;
```

### **View 2: retailer_performance_dashboard**
**Purpose**: Retailer ranking and performance comparison
**Usage**: Retailer rankings, performance benchmarking, regional analysis
**Frontend Usage**: Leaderboards, performance tables, regional comparisons

```sql
CREATE VIEW retailer_performance_dashboard AS
SELECT 
    r.retailer_id,
    r.retailer_name,
    r.region,
    r.tier,
    -- Current Period Metrics
    rpm.revenue,
    rpm.orders_count,
    rpm.average_order_value,
    rpm.conversion_rate,
    rpm.performance_score,
    -- Rankings
    RANK() OVER (ORDER BY rpm.performance_score DESC) as overall_ranking,
    RANK() OVER (PARTITION BY r.region ORDER BY rpm.performance_score DESC) as regional_ranking,
    RANK() OVER (PARTITION BY r.tier ORDER BY rpm.performance_score DESC) as tier_ranking,
    -- Growth Metrics (vs previous period)
    LAG(rpm.performance_score) OVER (
        PARTITION BY r.retailer_id ORDER BY rpm.metric_date
    ) as previous_score,
    rpm.performance_score - LAG(rpm.performance_score) OVER (
        PARTITION BY r.retailer_id ORDER BY rpm.metric_date
    ) as score_change
FROM retailers r
JOIN retailer_performance_metrics rpm ON r.retailer_id = rpm.retailer_id
WHERE rpm.metric_date = CURRENT_DATE - INTERVAL '1 day'
  AND rpm.metric_period = 'daily';
```

---

## 🔍 **Table Relationships & Dependencies**

### **Primary Relationships**
1. **Users → Retailers**: One-to-many (users belong to retailers)
2. **Retailers → Campaigns**: One-to-many (retailers create campaigns)
3. **Campaigns → Email Campaigns**: One-to-many (campaigns have email components)
4. **Campaigns → Social Posts**: One-to-many (campaigns have social content)
5. **Social Posts → Social Analytics**: One-to-many (posts have daily metrics)
6. **Email Campaigns → Email Sends**: One-to-many (campaigns send to multiple recipients)
7. **Retailers → Customers**: One-to-many (retailers have customer bases)
8. **Customers → Customer Interactions**: One-to-many (customers have interaction history)

### **Performance Optimization**
- **Indexes**: All foreign keys, date columns, and frequently queried fields
- **Partitioning**: Large tables (analytics, audit_logs) partitioned by date
- **Materialized Views**: Performance summaries refreshed hourly
- **Archiving**: Historical data moved to archive tables after 2 years

### **Security & Compliance**
- **Row Level Security (RLS)**: All tables filtered by user's retailer_id
- **Audit Trail**: All modifications logged in audit_logs table
- **Data Encryption**: Sensitive fields encrypted at rest
- **GDPR Compliance**: Customer data anonymization and deletion procedures

---

## 📚 **Usage Examples**

### **Common Query Patterns**

```sql
-- Get retailer's campaign performance
SELECT * FROM campaign_performance_summary 
WHERE campaign_id IN (
    SELECT campaign_id FROM campaigns 
    WHERE retailer_id = 'user-retailer-id'
);

-- Top performing retailers by region
SELECT * FROM retailer_performance_dashboard 
WHERE region = 'East Coast' 
ORDER BY performance_score DESC 
LIMIT 10;

-- Customer interaction timeline
SELECT * FROM customer_interactions 
WHERE customer_id = 'customer-uuid' 
ORDER BY interaction_date DESC;

-- Social media performance trends
SELECT 
    analytics_date,
    SUM(impressions) as daily_impressions,
    SUM(engagement) as daily_engagement
FROM social_analytics 
WHERE post_id IN (
    SELECT post_id FROM social_posts 
    WHERE account_id = 'account-uuid'
)
GROUP BY analytics_date 
ORDER BY analytics_date DESC;
```

This comprehensive table guide provides detailed specifications for all core CrownSync database tables, making it easy for developers to understand data structures, relationships, and usage patterns across the entire platform.