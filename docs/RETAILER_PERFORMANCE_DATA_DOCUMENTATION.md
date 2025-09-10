# Retailer Performance Database Documentation

## Overview

This document provides comprehensive documentation for the retailer performance database structure, designed to track and analyze luxury brand retailer marketing performance across multiple channels and metrics.

## Database Architecture

The retailer performance system consists of **5 core tables**, **1 materialized view**, and **1 summary view** that work together to provide comprehensive retailer analytics and performance tracking.

---

## Core Tables

### 1. `retailer_regions`

**Purpose**: Geographic region lookup table for retailer location categorization

**Data Source**: Manual configuration/administrative setup

**Schema**:
```sql
CREATE TABLE retailer_regions (
    region_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_name VARCHAR(50) NOT NULL,
    region_code VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Column Descriptions**:
- `region_id`: Unique identifier for each geographic region
- `region_name`: Full region name (e.g., "West", "East", "Central")
- `region_code`: Short code for region (e.g., "W", "E", "C")
- `created_at`: Record creation timestamp

**Frontend Usage**: 
- Region filter dropdown in retailer performance dashboard
- Regional performance analysis and grouping
- Geographic distribution charts

**Relationships**: 
- Referenced by `retailer_performance_metrics.region_id`

---

### 2. `retailer_targets`

**Purpose**: Performance targets and benchmarks for individual retailers

**Data Source**: CRM system / Business planning / Manual configuration

**Schema**:
```sql
CREATE TABLE retailer_targets (
    target_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID NOT NULL,
    metric_name VARCHAR(50) NOT NULL,
    target_value DECIMAL(5,2) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Column Descriptions**:
- `target_id`: Unique identifier for each target record
- `retailer_id`: Reference to specific retailer
- `metric_name`: Name of metric being targeted (e.g., "click_rate", "conversion_rate")
- `target_value`: Numerical target value for the metric
- `period_start/period_end`: Date range for target validity
- `created_at/updated_at`: Record lifecycle timestamps

**Frontend Usage**:
- Target vs actual performance comparison in retailer cards
- Performance status indicators ("Above Target", "Below Target")
- Goal tracking and progress visualization

**Relationships**:
- Links to `retailer_performance_metrics` via `retailer_id`
- Used in `retailer_performance_dashboard` materialized view

---

### 3. `retailer_performance_metrics` (Core Table)

**Purpose**: Primary table storing comprehensive retailer performance data and metrics

**Data Source**: 
- **Email Marketing Platform**: Email delivery, open, click metrics
- **CRM System**: Conversion tracking, revenue data
- **E-commerce Platform**: Order data, ROI calculations
- **Server-side Event Tracking**: User engagement, campaign participation

**Schema**:
```sql
CREATE TABLE retailer_performance_metrics (
    metric_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID NOT NULL,
    retailer_name VARCHAR(255) NOT NULL,
    region_id UUID REFERENCES retailer_regions(region_id),
    measurement_date DATE NOT NULL,
    measurement_period VARCHAR(20) DEFAULT 'daily',
    
    -- Email metrics (from email marketing platform)
    emails_sent INTEGER DEFAULT 0,
    emails_delivered INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    emails_bounced INTEGER DEFAULT 0,
    
    -- Performance rates (calculated from raw metrics)
    delivery_rate DECIMAL(5,2) DEFAULT 0,
    open_rate DECIMAL(5,2) DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Conversion and ROI metrics (from CRM/e-commerce)
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    revenue_generated DECIMAL(12,2) DEFAULT 0,
    roi_percentage DECIMAL(6,2) DEFAULT 0,
    
    -- Engagement metrics (from server-side tracking)
    campaign_participation_count INTEGER DEFAULT 0,
    last_active_date TIMESTAMP,
    response_time_hours DECIMAL(6,2) DEFAULT 0,
    
    -- Performance indicators (calculated/assigned)
    performance_grade VARCHAR(1) DEFAULT 'C', -- A, B, C, D, F
    needs_attention BOOLEAN DEFAULT FALSE,
    is_top_performer BOOLEAN DEFAULT FALSE,
    overall_rank INTEGER,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Column Descriptions**:

**Identity & Classification**:
- `metric_id`: Unique record identifier
- `retailer_id`: Unique retailer identifier (links to external retailer system)
- `retailer_name`: Display name of retailer
- `region_id`: Geographic region reference
- `measurement_date`: Date of measurement
- `measurement_period`: Aggregation period (daily, weekly, monthly)

**Email Marketing Metrics** (Source: Email Platform API):
- `emails_sent`: Total emails sent to retailer's customer base
- `emails_delivered`: Successfully delivered emails
- `emails_opened`: Emails opened by recipients
- `emails_clicked`: Emails with link clicks
- `emails_bounced`: Failed email deliveries

**Performance Rates** (Calculated):
- `delivery_rate`: (emails_delivered / emails_sent) * 100
- `open_rate`: (emails_opened / emails_delivered) * 100
- `click_rate`: (emails_clicked / emails_opened) * 100
- `bounce_rate`: (emails_bounced / emails_sent) * 100

**Business Metrics** (Source: CRM/E-commerce):
- `conversions`: Number of completed purchases/actions
- `conversion_rate`: (conversions / emails_clicked) * 100
- `revenue_generated`: Total revenue attributed to campaigns
- `roi_percentage`: (revenue_generated / campaign_cost) * 100

**Engagement Metrics** (Source: Server-side Tracking):
- `campaign_participation_count`: Number of campaigns retailer participated in
- `last_active_date`: Most recent activity timestamp
- `response_time_hours`: Average response time to campaign invitations

**Performance Classification** (Business Logic):
- `performance_grade`: Letter grade (A=Excellent, B=Good, C=Average, D=Poor, F=Failing)
- `needs_attention`: Boolean flag for underperforming retailers
- `is_top_performer`: Boolean flag for high-performing retailers
- `overall_rank`: Numerical ranking among all retailers

**Frontend Usage**:
- Main data table in retailer performance dashboard
- Summary cards (top retailers, needs attention, average ROI)
- Performance ranking and comparison
- Filtering and search functionality

**Relationships**:
- References `retailer_regions(region_id)`
- Referenced by `retailer_engagement_history.retailer_id`
- Referenced by `retailer_targets.retailer_id`
- Primary source for `retailer_performance_dashboard` materialized view

---

### 4. `retailer_engagement_history`

**Purpose**: Historical daily engagement tracking for trend analysis and performance monitoring

**Data Source**: 
- **Daily ETL Process**: Aggregated from email platform, CRM, and e-commerce systems
- **Server-side Event Tracking**: Real-time engagement events

**Schema**:
```sql
CREATE TABLE retailer_engagement_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    retailer_id UUID NOT NULL,
    date_recorded DATE NOT NULL,
    
    -- Daily engagement metrics
    emails_sent_today INTEGER DEFAULT 0,
    opens_today INTEGER DEFAULT 0,
    clicks_today INTEGER DEFAULT 0,
    conversions_today INTEGER DEFAULT 0,
    revenue_today DECIMAL(10,2) DEFAULT 0,
    
    -- Cumulative metrics
    total_emails_sent INTEGER DEFAULT 0,
    total_opens INTEGER DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    
    -- Performance indicators
    daily_roi DECIMAL(6,2) DEFAULT 0,
    cumulative_roi DECIMAL(6,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Column Descriptions**:

**Daily Metrics** (Source: Daily ETL):
- `emails_sent_today`: Emails sent on specific date
- `opens_today`: Email opens on specific date
- `clicks_today`: Email clicks on specific date
- `conversions_today`: Conversions completed on specific date
- `revenue_today`: Revenue generated on specific date

**Cumulative Metrics** (Calculated):
- `total_emails_sent`: Running total of all emails sent
- `total_opens`: Running total of all opens
- `total_clicks`: Running total of all clicks
- `total_conversions`: Running total of all conversions
- `total_revenue`: Running total of all revenue

**Performance Indicators**:
- `daily_roi`: ROI for specific date
- `cumulative_roi`: Overall ROI to date

**Frontend Usage**:
- Trend charts and historical performance analysis
- Performance over time visualization
- Seasonal pattern identification
- Growth rate calculations

**Relationships**:
- Links to `retailer_performance_metrics` via `retailer_id`

---

## Views and Materialized Views

### 5. `retailer_performance_dashboard` (Materialized View)

**Purpose**: Optimized, pre-computed view combining retailer metrics with regional and target data for fast dashboard queries

**Data Source**: Computed from `retailer_performance_metrics`, `retailer_regions`, and `retailer_targets`

**SQL Query**:
```sql
CREATE MATERIALIZED VIEW retailer_performance_dashboard AS
SELECT 
    rpm.retailer_id,
    rpm.retailer_name,
    rr.region_name as region,
    rpm.emails_sent,
    rpm.delivery_rate,
    rpm.open_rate,
    rpm.click_rate,
    rpm.conversion_rate,
    rpm.roi_percentage,
    rpm.performance_grade,
    rpm.is_top_performer,
    rpm.needs_attention,
    rpm.overall_rank,
    rpm.last_active_date,
    rt.target_value as click_rate_target,
    
    -- Performance indicators
    CASE 
        WHEN rpm.click_rate >= rt.target_value THEN 'Above Target'
        WHEN rpm.click_rate >= rt.target_value * 0.9 THEN 'Near Target'
        ELSE 'Below Target'
    END as click_rate_status,
    
    -- Engagement level
    CASE 
        WHEN rpm.roi_percentage >= 120 THEN 'Excellent Performance'
        WHEN rpm.roi_percentage >= 100 THEN 'Good Performance'
        WHEN rpm.roi_percentage >= 80 THEN 'Average Performance'
        ELSE 'Improvement Required'
    END as performance_level,
    
    -- Activity status
    CASE 
        WHEN rpm.last_active_date >= CURRENT_DATE - INTERVAL '7 days' THEN 'Active'
        WHEN rpm.last_active_date >= CURRENT_DATE - INTERVAL '30 days' THEN 'Recently Active'
        ELSE 'Inactive'
    END as activity_status,
    
    rpm.measurement_date,
    rpm.created_at,
    rpm.updated_at
FROM retailer_performance_metrics rpm
LEFT JOIN retailer_regions rr ON rpm.region_id = rr.region_id
LEFT JOIN retailer_targets rt ON rpm.retailer_id = rt.retailer_id AND rt.metric_name = 'click_rate'
WHERE rpm.measurement_date = CURRENT_DATE
ORDER BY rpm.overall_rank;
```

**Computed Fields**:
- `click_rate_status`: Categorizes performance vs targets
- `performance_level`: ROI-based performance classification
- `activity_status`: Recent activity classification

**Frontend Usage**:
- Primary data source for `/api/retailer-performance` endpoint
- Main retailer performance table
- Top performer cards
- Filtering and sorting operations

**Performance Optimization**:
- Materialized for fast query response
- Indexed on rank, ROI, region, and performance level
- Refreshed via `refresh_retailer_performance_dashboard()` function

**Relationships**:
- Joins `retailer_performance_metrics`, `retailer_regions`, `retailer_targets`

---

### 6. `retailer_performance_summary` (View)

**Purpose**: Real-time aggregated statistics for dashboard summary cards

**Data Source**: Computed from `retailer_performance_metrics`

**SQL Query**:
```sql
CREATE OR REPLACE VIEW retailer_performance_summary AS
SELECT 
    COUNT(*) FILTER (WHERE roi_percentage > 120) as top_retailers_count,
    COUNT(*) FILTER (WHERE roi_percentage < 80) as needs_attention_count,
    ROUND(AVG(roi_percentage), 1) as average_roi,
    COUNT(*) FILTER (WHERE last_active_date >= CURRENT_DATE - INTERVAL '30 days') as active_retailers,
    COUNT(*) as total_retailers,
    ROUND((COUNT(*) FILTER (WHERE last_active_date >= CURRENT_DATE - INTERVAL '30 days')::DECIMAL / COUNT(*) * 100), 1) as participation_rate,
    
    -- Performance distribution
    COUNT(*) FILTER (WHERE performance_grade = 'A') as grade_a_count,
    COUNT(*) FILTER (WHERE performance_grade = 'B') as grade_b_count,
    COUNT(*) FILTER (WHERE performance_grade = 'C') as grade_c_count,
    COUNT(*) FILTER (WHERE performance_grade IN ('D', 'F')) as grade_df_count,
    
    -- Engagement metrics
    ROUND(AVG(click_rate), 2) as average_click_rate,
    ROUND(AVG(open_rate), 2) as average_open_rate,
    ROUND(AVG(delivery_rate), 2) as average_delivery_rate,
    ROUND(AVG(conversion_rate), 2) as average_conversion_rate,
    
    CURRENT_DATE as summary_date
FROM retailer_performance_metrics
WHERE measurement_date = CURRENT_DATE;
```

**Computed Metrics**:

**Performance Counts**:
- `top_retailers_count`: Retailers with ROI > 120%
- `needs_attention_count`: Retailers with ROI < 80%
- `active_retailers`: Retailers active in last 30 days
- `total_retailers`: Total retailer count

**Performance Averages**:
- `average_roi`: Mean ROI across all retailers
- `participation_rate`: Percentage of active retailers
- `average_click_rate/open_rate/delivery_rate/conversion_rate`: Mean performance metrics

**Grade Distribution**:
- `grade_a_count/grade_b_count/grade_c_count/grade_df_count`: Count by performance grade

**Frontend Usage**:
- Summary cards in retailer performance dashboard
- KPI displays (15 top retailers, 7 needs attention, 109.3% average ROI, 23/25 active)
- Performance distribution charts

**Relationships**:
- Aggregates data from `retailer_performance_metrics`

---

## Database Indexes

**Performance Optimization Indexes**:

```sql
-- Core table indexes
CREATE INDEX idx_retailer_performance_retailer_date ON retailer_performance_metrics(retailer_id, measurement_date);
CREATE INDEX idx_retailer_performance_date ON retailer_performance_metrics(measurement_date);
CREATE INDEX idx_retailer_performance_rank ON retailer_performance_metrics(overall_rank);
CREATE INDEX idx_retailer_performance_roi ON retailer_performance_metrics(roi_percentage);
CREATE INDEX idx_retailer_engagement_retailer_date ON retailer_engagement_history(retailer_id, date_recorded);

-- Materialized view indexes
CREATE INDEX idx_retailer_dashboard_rank ON retailer_performance_dashboard(overall_rank);
CREATE INDEX idx_retailer_dashboard_roi ON retailer_performance_dashboard(roi_percentage);
CREATE INDEX idx_retailer_dashboard_region ON retailer_performance_dashboard(region);
CREATE INDEX idx_retailer_dashboard_performance ON retailer_performance_dashboard(performance_level);
```

---

## Data Flow and Integration

### Data Sources Integration

1. **Email Marketing Platform** → `retailer_performance_metrics`
   - Daily ETL process extracts email metrics
   - API integration for real-time updates
   - Metrics: sends, deliveries, opens, clicks, bounces

2. **CRM System** → `retailer_performance_metrics`
   - Conversion tracking integration
   - Revenue attribution
   - Customer lifecycle data

3. **E-commerce Platform** → `retailer_performance_metrics`
   - Order data and revenue tracking
   - ROI calculations
   - Purchase attribution

4. **Server-side Event Tracking** → `retailer_engagement_history`
   - Real-time engagement events
   - Campaign participation tracking
   - Activity timestamps

### Frontend Integration

**API Endpoint**: `/api/retailer-performance`

**Data Flow**:
1. Frontend requests data via API
2. API queries `retailer_performance_summary` for summary stats
3. API queries `retailer_performance_dashboard` for detailed retailer data
4. API transforms and formats data for frontend consumption
5. Frontend renders dashboard components

**Frontend Components Using This Data**:
- **Summary Cards**: Top retailers, needs attention, average ROI, active retailers
- **Performance Table**: Complete retailer listing with metrics and rankings
- **Top Performer Cards**: Detailed cards for best-performing retailers
- **Filters**: Region and grade filtering
- **Search**: Retailer name search functionality

---

## Data Refresh and Maintenance

### Materialized View Refresh

```sql
-- Manual refresh function
CREATE OR REPLACE FUNCTION refresh_retailer_performance_dashboard()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW retailer_performance_dashboard;
END;
$$ LANGUAGE plpgsql;

-- Usage
SELECT refresh_retailer_performance_dashboard();
```

### Recommended Refresh Schedule

- **Real-time**: `retailer_performance_summary` (view, auto-updates)
- **Hourly**: `retailer_performance_dashboard` (materialized view)
- **Daily**: `retailer_engagement_history` (ETL process)
- **Daily**: `retailer_performance_metrics` (ETL process)

---

## Sample Data

The database contains **25 luxury brand retailers** with realistic performance data:

**Top Performers** (Grade A, ROI > 120%):
- Cartier Rodeo Drive (#1, 124.5% ROI, 4.64% click rate)
- Betteridge NY (#2, 148.2% ROI, 3.87% click rate)
- Tiffany & Co Beverly Hills (#6, 132.7% ROI, 5.12% click rate)

**Needs Attention** (Grade C/F, ROI < 80%):
- Montblanc Nashville (78.9% ROI)
- Frederique Constant Salt Lake (75.6% ROI)
- Swatch Detroit (0% ROI, inactive)

**Regional Distribution**:
- West: 7 retailers
- East: 6 retailers  
- Central: 5 retailers
- South: 5 retailers
- North: 2 retailers

This comprehensive database structure supports full retailer performance analytics with real-time insights, historical trending, and actionable business intelligence for luxury brand marketing optimization.