# Database Documentation - Data Development Platform

## Overview

This document provides a comprehensive overview of the database structure for the Data Development Platform, a Next.js application built with Supabase (PostgreSQL) that serves as a marketing and asset management platform for brands and retailers.

## Database Architecture

The database is designed to support a multi-tenant platform with three main user types:
- **Brand Users**: Create and manage marketing assets, campaigns, and templates
- **Retailer Users**: Access brand assets, participate in campaigns, manage their own marketing activities
- **Admin Users**: System administration and oversight

## Core Database Tables

### 1. User Management

#### `users` Table
**Purpose**: Central user management for all platform users

| Column | Type | Description |
|--------|------|-------------|
| `user_id` | UUID (PK) | Unique identifier for each user |
| `user_email` | VARCHAR(255) | User's email address (unique) |
| `user_name` | VARCHAR(255) | Display name |
| `user_type` | ENUM | 'brand', 'retailer', or 'admin' |
| `created_at` | TIMESTAMP | Account creation timestamp |
| `updated_at` | TIMESTAMP | Last profile update |
| `last_login_at` | TIMESTAMP | Last login timestamp |
| `is_active` | BOOLEAN | Account status |
| `profile_data` | JSONB | Additional profile information |

**Used in**: Authentication, user management, analytics dashboards
**Relationships**: Referenced by most other tables as `created_by_user_id` or `user_id`

### 2. File Management System

#### `files` Table
**Purpose**: Stores metadata for all uploaded files and brand assets

| Column | Type | Description |
|--------|------|-------------|
| `file_id` | UUID (PK) | Unique file identifier |
| `file_name` | VARCHAR(500) | Original filename |
| `file_type` | ENUM | 'image', 'video', 'pdf', 'document', 'audio', 'other' |
| `file_size` | BIGINT | File size in bytes |
| `file_path` | TEXT | Storage path |
| `file_url` | TEXT | Public URL for access |
| `created_by_user_id` | UUID (FK) | User who uploaded the file |
| `created_at` | TIMESTAMP | Upload timestamp |
| `updated_at` | TIMESTAMP | Last modification |
| `deleted_at` | TIMESTAMP | Soft delete timestamp |
| `metadata` | JSONB | File-specific metadata |

**Used in**: Brand asset management, file downloads, analytics
**Relationships**: 
- Links to `users` table
- Referenced by `file_actions`, `brand_assets`, `collection_files`

#### `file_actions` Table
**Purpose**: Tracks all user interactions with files (views, downloads, shares)

| Column | Type | Description |
|--------|------|-------------|
| `action_id` | UUID (PK) | Unique action identifier |
| `file_id` | UUID (FK) | File being acted upon |
| `user_id` | UUID (FK) | User performing the action |
| `action_type` | ENUM | 'VIEW', 'DOWNLOAD', 'SHARE', 'DELETE', 'UPLOAD', 'EDIT' |
| `action_timestamp` | TIMESTAMP | When the action occurred |
| `session_id` | UUID | User session identifier |
| `ip_address` | INET | User's IP address |
| `user_agent` | TEXT | Browser/client information |
| `metadata` | JSONB | Additional action context |

**Used in**: Analytics dashboards, usage tracking, engagement metrics
**Relationships**: Links to `files` and `users` tables

### 3. Campaign Management

#### `campaigns` Table
**Purpose**: Marketing campaigns created by brands

| Column | Type | Description |
|--------|------|-------------|
| `campaign_id` | UUID (PK) | Unique campaign identifier |
| `campaign_name` | VARCHAR(255) | Campaign name |
| `campaign_description` | TEXT | Campaign description |
| `campaign_status` | ENUM | 'draft', 'active', 'paused', 'completed', 'archived' |
| `created_by_user_id` | UUID (FK) | Brand user who created campaign |
| `start_date` | TIMESTAMP | Campaign start date |
| `end_date` | TIMESTAMP | Campaign end date |
| `budget_allocated` | DECIMAL(12,2) | Allocated budget |
| `budget_spent` | DECIMAL(12,2) | Amount spent |
| `target_audience` | JSONB | Audience targeting criteria |
| `campaign_settings` | JSONB | Campaign configuration |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update |

**Used in**: Campaign management, budget tracking, performance analytics
**Relationships**: 
- Links to `users` table
- Referenced by email/SMS campaigns, social posts

#### `templates` Table
**Purpose**: Reusable marketing templates

| Column | Type | Description |
|--------|------|-------------|
| `template_id` | UUID (PK) | Unique template identifier |
| `template_name` | VARCHAR(255) | Template name |
| `template_type` | ENUM | 'email', 'sms', 'social', 'web', 'print' |
| `template_content` | JSONB | Template content and structure |
| `created_by_user_id` | UUID (FK) | User who created template |
| `is_active` | BOOLEAN | Template availability |
| `version` | INTEGER | Template version number |
| `parent_template_id` | UUID (FK) | Parent template for versioning |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update |

**Used in**: Template management, campaign creation
**Relationships**: Self-referencing for versioning, links to `users`

### 4. Email Marketing System

#### `email_campaigns` Table
**Purpose**: Email marketing campaigns

| Column | Type | Description |
|--------|------|-------------|
| `email_campaign_id` | UUID (PK) | Unique email campaign identifier |
| `campaign_id` | UUID (FK) | Parent campaign |
| `email_subject` | VARCHAR(500) | Email subject line |
| `email_content` | TEXT | Email HTML content |
| `sender_email` | VARCHAR(255) | Sender email address |
| `sender_name` | VARCHAR(255) | Sender display name |
| `created_at` | TIMESTAMP | Creation timestamp |
| `sent_at` | TIMESTAMP | Send timestamp |
| `total_recipients` | INTEGER | Number of recipients |
| `metadata` | JSONB | Additional campaign data |

**Used in**: Email marketing, campaign analytics
**Relationships**: Links to `campaigns` table

#### `email_sends` Table
**Purpose**: Individual email delivery tracking

| Column | Type | Description |
|--------|------|-------------|
| `email_send_id` | UUID (PK) | Unique send identifier |
| `email_campaign_id` | UUID (FK) | Parent email campaign |
| `recipient_email` | VARCHAR(255) | Recipient email |
| `recipient_name` | VARCHAR(255) | Recipient name |
| `sent_at` | TIMESTAMP | Send timestamp |
| `delivered_at` | TIMESTAMP | Delivery timestamp |
| `opened_at` | TIMESTAMP | Open timestamp |
| `clicked_at` | TIMESTAMP | Click timestamp |
| `bounced_at` | TIMESTAMP | Bounce timestamp |
| `status` | ENUM | 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed' |
| `bounce_reason` | TEXT | Bounce error message |
| `metadata` | JSONB | Delivery metadata |

**Used in**: Email analytics, delivery tracking, performance metrics
**Relationships**: Links to `email_campaigns`

### 5. SMS Marketing System

#### `sms_campaigns` Table
**Purpose**: SMS marketing campaigns

| Column | Type | Description |
|--------|------|-------------|
| `sms_campaign_id` | UUID (PK) | Unique SMS campaign identifier |
| `campaign_id` | UUID (FK) | Parent campaign |
| `sms_content` | TEXT | SMS message content |
| `sender_number` | VARCHAR(20) | Sender phone number |
| `created_at` | TIMESTAMP | Creation timestamp |
| `sent_at` | TIMESTAMP | Send timestamp |
| `total_recipients` | INTEGER | Number of recipients |
| `metadata` | JSONB | Additional campaign data |

**Used in**: SMS marketing, campaign analytics
**Relationships**: Links to `campaigns` table

#### `sms_sends` Table
**Purpose**: Individual SMS delivery tracking

| Column | Type | Description |
|--------|------|-------------|
| `sms_send_id` | UUID (PK) | Unique send identifier |
| `sms_campaign_id` | UUID (FK) | Parent SMS campaign |
| `recipient_phone` | VARCHAR(20) | Recipient phone number |
| `recipient_name` | VARCHAR(255) | Recipient name |
| `sent_at` | TIMESTAMP | Send timestamp |
| `delivered_at` | TIMESTAMP | Delivery timestamp |
| `status` | ENUM | 'sent', 'delivered', 'failed', 'pending' |
| `failure_reason` | TEXT | Failure error message |
| `metadata` | JSONB | Delivery metadata |

**Used in**: SMS analytics, delivery tracking
**Relationships**: Links to `sms_campaigns`

### 6. Social Media Management

#### `social_accounts` Table
**Purpose**: Connected social media accounts

| Column | Type | Description |
|--------|------|-------------|
| `account_id` | UUID (PK) | Unique account identifier |
| `user_id` | UUID (FK) | Account owner |
| `platform` | ENUM | 'facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube' |
| `account_handle` | VARCHAR(255) | Social media handle |
| `account_name` | VARCHAR(255) | Display name |
| `access_token_encrypted` | TEXT | Encrypted API token |
| `is_active` | BOOLEAN | Account status |
| `created_at` | TIMESTAMP | Connection timestamp |
| `updated_at` | TIMESTAMP | Last update |
| `metadata` | JSONB | Platform-specific data |

**Used in**: Social media posting, account management
**Relationships**: Links to `users` table

#### `social_posts` Table
**Purpose**: Social media posts

| Column | Type | Description |
|--------|------|-------------|
| `post_id` | UUID (PK) | Unique post identifier |
| `account_id` | UUID (FK) | Social media account |
| `campaign_id` | UUID (FK) | Associated campaign |
| `post_content` | TEXT | Post content |
| `post_type` | VARCHAR(50) | Post type (text, image, video, etc.) |
| `external_post_id` | VARCHAR(255) | Platform's post ID |
| `scheduled_at` | TIMESTAMP | Scheduled post time |
| `published_at` | TIMESTAMP | Actual publish time |
| `created_at` | TIMESTAMP | Creation timestamp |
| `metadata` | JSONB | Post metadata |

**Used in**: Social media management, campaign tracking
**Relationships**: Links to `social_accounts` and `campaigns`

#### `social_engagement` Table
**Purpose**: Social media engagement metrics

| Column | Type | Description |
|--------|------|-------------|
| `engagement_id` | UUID (PK) | Unique engagement identifier |
| `post_id` | UUID (FK) | Associated post |
| `engagement_type` | VARCHAR(50) | Type (like, comment, share, reaction) |
| `engagement_count` | INTEGER | Count of engagements |
| `recorded_at` | TIMESTAMP | Measurement timestamp |
| `metadata` | JSONB | Engagement metadata |

**Used in**: Social media analytics, engagement tracking
**Relationships**: Links to `social_posts`

### 7. Product Management

#### `products` Table
**Purpose**: Product catalog for e-commerce integration

| Column | Type | Description |
|--------|------|-------------|
| `product_id` | UUID (PK) | Unique product identifier |
| `external_product_id` | VARCHAR(255) | External system ID (e.g., Shopify) |
| `product_title` | VARCHAR(500) | Product name |
| `product_description` | TEXT | Product description |
| `product_type` | VARCHAR(255) | Product category |
| `vendor` | VARCHAR(255) | Product vendor |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update |
| `published_at` | TIMESTAMP | Publication timestamp |
| `status` | VARCHAR(50) | Product status |
| `tags` | TEXT[] | Product tags array |
| `metadata` | JSONB | Additional product data |

**Used in**: Product management, wish list functionality
**Relationships**: Referenced by `product_variants`

#### `product_variants` Table
**Purpose**: Product variations (size, color, etc.)

| Column | Type | Description |
|--------|------|-------------|
| `variant_id` | UUID (PK) | Unique variant identifier |
| `product_id` | UUID (FK) | Parent product |
| `external_variant_id` | VARCHAR(255) | External system ID |
| `variant_title` | VARCHAR(500) | Variant name |
| `sku` | VARCHAR(255) | Stock keeping unit |
| `price` | DECIMAL(12,2) | Variant price |
| `compare_at_price` | DECIMAL(12,2) | Original price |
| `inventory_quantity` | INTEGER | Stock quantity |
| `weight` | DECIMAL(10,3) | Product weight |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update |
| `metadata` | JSONB | Variant metadata |

**Used in**: Product management, inventory tracking
**Relationships**: Links to `products`

### 8. Collections and Organization

#### `collections` Table
**Purpose**: Organized groups of files/assets

| Column | Type | Description |
|--------|------|-------------|
| `collection_id` | UUID (PK) | Unique collection identifier |
| `collection_name` | VARCHAR(255) | Collection name |
| `collection_description` | TEXT | Collection description |
| `created_by_user_id` | UUID (FK) | Collection creator |
| `is_public` | BOOLEAN | Public visibility |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update |
| `metadata` | JSONB | Collection metadata |

**Used in**: Asset organization, file management
**Relationships**: Links to `users`, referenced by `collection_files`

#### `collection_files` Table
**Purpose**: Many-to-many relationship between collections and files

| Column | Type | Description |
|--------|------|-------------|
| `collection_id` | UUID (FK) | Collection identifier |
| `file_id` | UUID (FK) | File identifier |
| `added_at` | TIMESTAMP | Addition timestamp |
| `added_by_user_id` | UUID (FK) | User who added file |
| `sort_order` | INTEGER | Display order |

**Used in**: Collection management, file organization
**Relationships**: Links to `collections`, `files`, and `users`

### 9. Session and Activity Tracking

#### `sessions` Table
**Purpose**: User session tracking

| Column | Type | Description |
|--------|------|-------------|
| `session_id` | UUID (PK) | Unique session identifier |
| `user_id` | UUID (FK) | Session owner |
| `started_at` | TIMESTAMP | Session start |
| `ended_at` | TIMESTAMP | Session end |
| `ip_address` | INET | User's IP address |
| `user_agent` | TEXT | Browser information |
| `device_info` | JSONB | Device details |
| `location_data` | JSONB | Geographic information |

**Used in**: User analytics, session tracking
**Relationships**: Links to `users`

### 10. Geographic and Device Data

#### `geography` Table
**Purpose**: Geographic reference data

| Column | Type | Description |
|--------|------|-------------|
| `geography_id` | UUID (PK) | Unique geography identifier |
| `country_code` | VARCHAR(2) | ISO country code |
| `country_name` | VARCHAR(100) | Country name |
| `region` | VARCHAR(100) | State/province |
| `city` | VARCHAR(100) | City name |
| `latitude` | DECIMAL(10,8) | Latitude coordinate |
| `longitude` | DECIMAL(11,8) | Longitude coordinate |
| `timezone` | VARCHAR(50) | Timezone identifier |
| `created_at` | TIMESTAMP | Creation timestamp |

**Used in**: Location-based analytics, user tracking
**Relationships**: Referenced for geographic analysis

#### `devices` Table
**Purpose**: Device information catalog

| Column | Type | Description |
|--------|------|-------------|
| `device_id` | UUID (PK) | Unique device identifier |
| `device_type` | VARCHAR(50) | Device category (mobile, desktop, tablet) |
| `device_brand` | VARCHAR(100) | Device manufacturer |
| `device_model` | VARCHAR(100) | Device model |
| `operating_system` | VARCHAR(100) | OS name and version |
| `browser` | VARCHAR(100) | Browser name |
| `screen_resolution` | VARCHAR(20) | Screen dimensions |
| `user_agent` | TEXT | Full user agent string |
| `created_at` | TIMESTAMP | First seen timestamp |

**Used in**: Device analytics, user experience optimization
**Relationships**: Referenced for device-based analysis

## Extended Analytics Tables

### 11. Brand Assets Analytics

#### `brand_assets` Table
**Purpose**: Enhanced brand asset tracking with analytics

| Column | Type | Description |
|--------|------|-------------|
| `asset_id` | UUID (PK) | Unique asset identifier |
| `asset_name` | VARCHAR(500) | Asset name |
| `asset_type` | VARCHAR(50) | Asset category |
| `file_id` | UUID (FK) | Associated file |
| `download_count` | INTEGER | Total downloads |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update |
| `is_featured` | BOOLEAN | Featured status |
| `metadata` | JSONB | Asset metadata |

**Used in**: Brand asset analytics dashboard
**Relationships**: Links to `files`

#### `daily_asset_downloads` Table
**Purpose**: Daily download statistics by asset type

| Column | Type | Description |
|--------|------|-------------|
| `download_date` | DATE | Date of downloads |
| `asset_type` | VARCHAR(50) | Asset category |
| `download_count` | INTEGER | Downloads for that day |
| `created_at` | TIMESTAMP | Record creation |

**Used in**: Daily download charts, trend analysis
**Relationships**: Aggregated data table

#### `retailer_asset_activity` Table
**Purpose**: Retailer interactions with brand assets

| Column | Type | Description |
|--------|------|-------------|
| `activity_id` | UUID (PK) | Unique activity identifier |
| `retailer_id` | UUID (FK) | Retailer user |
| `asset_id` | UUID (FK) | Brand asset |
| `activity_type` | VARCHAR(20) | Activity type (download, view, share) |
| `activity_date` | TIMESTAMP | Activity timestamp |
| `unique_files_count` | INTEGER | Number of unique files |

**Used in**: Retailer activity analytics, engagement tracking
**Relationships**: Links to `users` and `brand_assets`

### 12. Campaign Templates Analytics

#### `campaign_templates` Table
**Purpose**: Campaign template usage analytics

| Column | Type | Description |
|--------|------|-------------|
| `template_id` | UUID (PK) | Unique template identifier |
| `template_name` | VARCHAR(255) | Template name |
| `template_type` | ENUM | Template category |
| `usage_count` | INTEGER | Total usage count |
| `unique_retailers_count` | INTEGER | Unique retailers using template |
| `unique_recipients_count` | INTEGER | Total recipients reached |
| `conversion_rate` | DECIMAL(5,2) | Template conversion rate |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update |
| `is_active` | BOOLEAN | Template status |
| `metadata` | JSONB | Template metadata |

**Used in**: Template performance analytics
**Relationships**: Standalone analytics table

#### `template_retailer_usage` Table
**Purpose**: Template usage by individual retailers

| Column | Type | Description |
|--------|------|-------------|
| `usage_id` | UUID (PK) | Unique usage identifier |
| `template_id` | UUID (FK) | Campaign template |
| `retailer_id` | UUID (FK) | Retailer user |
| `campaign_id` | UUID (FK) | Associated campaign |
| `campaigns_joined` | INTEGER | Number of campaigns joined |
| `total_sends` | INTEGER | Total messages sent |
| `last_active_date` | TIMESTAMP | Last activity |
| `created_at` | TIMESTAMP | First usage |

**Used in**: Retailer engagement analytics, template performance
**Relationships**: Links to `campaign_templates`, `users`, `campaigns`

### 13. Retailer Performance Scoring

#### `retailer_scores` Table
**Purpose**: Retailer performance metrics and scoring

| Column | Type | Description |
|--------|------|-------------|
| `score_id` | UUID (PK) | Unique score identifier |
| `retailer_id` | UUID (FK) | Retailer user |
| `retailer_name` | VARCHAR(255) | Retailer name |
| `email_response_time_hours` | DECIMAL(4,1) | Average email response time |
| `social_response_time_hours` | DECIMAL(4,1) | Average social response time |
| `social_post_frequency_per_week` | DECIMAL(3,1) | Weekly posting frequency |
| `response_quality_grade` | VARCHAR(1) | Quality grade (A, B, C) |
| `first_followup_time_hours` | DECIMAL(4,1) | First follow-up time |
| `campaign_roi_percentage` | DECIMAL(5,1) | Campaign ROI |
| `overall_rank` | INTEGER | Overall ranking |
| `calculated_at` | TIMESTAMP | Score calculation time |
| `updated_at` | TIMESTAMP | Last update |

**Used in**: Retailer performance dashboard, ranking system
**Relationships**: Links to `users`

### 14. Wish List Functionality

#### `watch_models` Table
**Purpose**: Watch model catalog for wish lists

| Column | Type | Description |
|--------|------|-------------|
| `model_id` | UUID (PK) | Unique model identifier |
| `model_name` | VARCHAR(255) | Model name |
| `collection_name` | VARCHAR(255) | Collection name |
| `size` | VARCHAR(20) | Watch size |
| `gender` | VARCHAR(20) | Target gender |
| `material` | VARCHAR(255) | Watch material |
| `mpn` | VARCHAR(100) | Manufacturer part number |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update |
| `is_active` | BOOLEAN | Model status |
| `metadata` | JSONB | Model metadata |

**Used in**: Wish list functionality, product catalog
**Relationships**: Referenced by wish list tables

#### `wish_list_items` Table
**Purpose**: Individual retailer wish list items

| Column | Type | Description |
|--------|------|-------------|
| `wish_id` | UUID (PK) | Unique wish identifier |
| `model_id` | UUID (FK) | Watch model |
| `retailer_id` | UUID (FK) | Retailer user |
| `wish_count` | INTEGER | Wish count/priority |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update |

**Used in**: Wish list management, demand analytics
**Relationships**: Links to `watch_models` and `users`

#### `regional_wish_lists` Table
**Purpose**: Regional aggregation of wish list data

| Column | Type | Description |
|--------|------|-------------|
| `regional_wish_id` | UUID (PK) | Unique regional wish identifier |
| `model_id` | UUID (FK) | Watch model |
| `region` | VARCHAR(50) | Geographic region |
| `wish_count` | INTEGER | Total wishes in region |
| `rank_in_region` | INTEGER | Regional ranking |
| `updated_at` | TIMESTAMP | Last update |

**Used in**: Regional demand analysis, geographic insights
**Relationships**: Links to `watch_models`

### 15. Analytics and Audit

#### `daily_analytics` Table
**Purpose**: Daily aggregated analytics data

| Column | Type | Description |
|--------|------|-------------|
| `analytics_id` | UUID (PK) | Unique analytics identifier |
| `date_recorded` | DATE | Date of metrics |
| `entity_type` | VARCHAR(50) | Entity being measured |
| `entity_id` | UUID | Specific entity identifier |
| `metric_name` | VARCHAR(100) | Metric name |
| `metric_value` | DECIMAL(15,4) | Metric value |
| `created_at` | TIMESTAMP | Record creation |
| `metadata` | JSONB | Additional metric data |

**Used in**: Analytics dashboards, trend analysis
**Relationships**: Generic analytics storage

#### `audit_logs` Table
**Purpose**: System audit trail

| Column | Type | Description |
|--------|------|-------------|
| `log_id` | UUID (PK) | Unique log identifier |
| `table_name` | VARCHAR(100) | Table being modified |
| `record_id` | UUID | Record identifier |
| `action` | VARCHAR(20) | Action type (INSERT, UPDATE, DELETE) |
| `old_values` | JSONB | Previous values |
| `new_values` | JSONB | New values |
| `changed_by` | UUID (FK) | User making change |
| `changed_at` | TIMESTAMP | Change timestamp |
| `ip_address` | INET | User's IP address |
| `user_agent` | TEXT | Browser information |

**Used in**: System auditing, change tracking
**Relationships**: Links to `users`

## Database Views

The database includes several materialized views for optimized analytics queries:

### Analytics Views

1. **`file_analytics`** - File engagement metrics with views, downloads, shares
2. **`user_analytics`** - User activity summaries with session data
3. **`campaign_analytics`** - Campaign performance metrics
4. **`email_campaign_analytics`** - Email campaign performance with rates
5. **`sms_campaign_analytics`** - SMS campaign performance with rates
6. **`social_post_analytics`** - Social media engagement metrics
7. **`product_analytics`** - Product performance metrics
8. **`session_analytics`** - Session duration and activity analysis
9. **`collection_analytics`** - Collection engagement metrics

### Specialized Views

1. **`top_downloaded_assets`** - Top 10 most downloaded brand assets
2. **`top_active_retailers_assets`** - Most active retailers by asset downloads
3. **`top_templates_coverage`** - Template usage coverage metrics
4. **`top_campaign_performance`** - Best performing campaigns
5. **`top_wish_list_items`** - Most wished-for products
6. **`daily_metrics_summary`** - Daily aggregated platform metrics

## Database Functions

The database includes several stored functions for common operations:

### User Management Functions
- `create_user()` - Create new user with validation
- `update_user_last_login()` - Update login timestamp

### File Management Functions
- `record_file_action()` - Log file interactions
- `soft_delete_file()` - Soft delete files
- `calculate_file_engagement_score()` - Calculate engagement metrics

### Session Management Functions
- `start_session()` - Initialize user session
- `end_session()` - Close user session

### Campaign Management Functions
- `create_campaign()` - Create campaign with validation
- `update_campaign_budget_spent()` - Update budget tracking
- `send_email_campaign()` - Process email campaign sends
- `send_sms_campaign()` - Process SMS campaign sends

### Social Media Functions
- `create_social_post()` - Create social media posts
- `update_social_engagement()` - Update engagement metrics

### Analytics Functions
- `get_user_activity_summary()` - Generate user activity reports
- `refresh_all_analytics()` - Refresh materialized views

### Cleanup Functions
- `cleanup_old_sessions()` - Remove old session data
- `cleanup_old_file_actions()` - Remove old activity logs
- `cleanup_old_audit_logs()` - Remove old audit records

## Row Level Security (RLS)

The database implements comprehensive Row Level Security policies:

### User Access Patterns
- **Brand Users**: Can access their own data and shared resources
- **Retailer Users**: Can access brand assets and their own campaigns
- **Admin Users**: Full system access

### Security Policies
- Users can only view/edit their own profiles
- File access based on ownership and sharing permissions
- Campaign access restricted to creators and participants
- Analytics data filtered by user permissions
- Audit logs restricted to admin users

## Database Relationships

### Primary Relationships

1. **Users → Files**: One-to-many (user creates multiple files)
2. **Files → File Actions**: One-to-many (file has multiple interactions)
3. **Users → Campaigns**: One-to-many (user creates multiple campaigns)
4. **Campaigns → Email/SMS Campaigns**: One-to-many
5. **Users → Social Accounts**: One-to-many
6. **Social Accounts → Social Posts**: One-to-many
7. **Products → Product Variants**: One-to-many
8. **Collections → Files**: Many-to-many (through collection_files)

### Analytics Relationships

1. **Brand Assets → Files**: One-to-one enhanced tracking
2. **Retailer Activity → Users/Assets**: Many-to-many activity tracking
3. **Template Usage → Templates/Users**: Many-to-many usage tracking
4. **Wish Lists → Users/Products**: Many-to-many demand tracking

## Usage in Application

### Frontend Integration

The database is accessed through:

1. **Supabase Client**: Browser-side queries with RLS
2. **Supabase Admin Client**: Server-side operations
3. **TypeScript Types**: Full type safety with generated types
4. **Service Layer**: Abstracted database operations

### Key Application Features

1. **Analytics Dashboard**: 
   - Uses views and aggregated tables
   - Real-time metrics from `daily_analytics`
   - Chart data from specialized analytics tables

2. **File Management**:
   - Upload tracking through `files` table
   - Download analytics via `file_actions`
   - Organization through `collections`

3. **Campaign Management**:
   - Multi-channel campaigns (email, SMS, social)
   - Performance tracking and analytics
   - Template reuse and optimization

4. **User Management**:
   - Multi-tenant architecture
   - Role-based access control
   - Activity and session tracking

### Performance Optimizations

1. **Indexes**: Comprehensive indexing on frequently queried columns
2. **Materialized Views**: Pre-computed analytics for dashboard performance
3. **Partitioning**: Time-based partitioning for large analytics tables
4. **Triggers**: Automated data maintenance and calculations

## Data Flow

### Typical User Journey

1. **User Registration**: Record created in `users` table
2. **File Upload**: Metadata stored in `files`, activity logged in `file_actions`
3. **Campaign Creation**: Campaign record with associated email/SMS campaigns
4. **Asset Download**: Tracked in `file_actions`, aggregated in analytics tables
5. **Performance Analysis**: Data retrieved from analytics views and functions

### Analytics Pipeline

1. **Raw Data Collection**: User actions stored in transaction tables
2. **Aggregation**: Daily/hourly rollups in analytics tables
3. **View Materialization**: Complex analytics pre-computed
4. **Dashboard Queries**: Optimized queries against materialized views

This database design supports a comprehensive marketing platform with robust analytics, multi-tenant security, and scalable performance for both brand and retailer users.