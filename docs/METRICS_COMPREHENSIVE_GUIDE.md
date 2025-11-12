# 📊 CrownSync Metrics Comprehensive Guide

## 🎯 Overview

This document provides complete documentation for all metrics used across CrownSync's Campaign Performance and Retailer Performance systems. Every metric is defined with its calculation method, data source, and usage context.

---

## 📈 **Campaign Performance Metrics**

### **🎯 Brand View - Campaign Card Metrics**

#### **1. Engagement Rate**
- **Name**: Engagement Rate
- **Description**: Percentage of total impressions that resulted in user engagement (likes, comments, shares, saves)
- **Calculation**: `(Total Engagement / Total Impressions) × 100`
- **Formula**: `SUM(engagement) / SUM(impressions) × 100`
- **Data Source**: `social_analytics.engagement`, `social_analytics.impressions`
- **Display Format**: Percentage with 2 decimal places (e.g., "4.25%")
- **Usage**: Campaign card primary metric, performance comparison

#### **2. Social Reach**
- **Name**: Social Reach
- **Description**: Total number of unique users who saw the campaign content across all platforms
- **Calculation**: Sum of unique reach across all social platforms for the campaign
- **Formula**: `SUM(reach)`
- **Data Source**: `social_analytics.reach`
- **Display Format**: Formatted number with K/M suffixes (e.g., "45.2K", "1.2M")
- **Usage**: Campaign card secondary metric, audience size indicator

#### **3. Social Engagement**
- **Name**: Social Engagement
- **Description**: Total number of user interactions (likes, comments, shares, saves) across all platforms
- **Calculation**: Sum of all engagement actions for the campaign
- **Formula**: `SUM(engagement)`
- **Data Source**: `social_analytics.engagement`
- **Display Format**: Formatted number with K/M suffixes (e.g., "2.1K", "15.3K")
- **Usage**: Campaign card tertiary metric, interaction volume

#### **4. Platforms**
- **Name**: Active Platforms
- **Description**: Number of social media platforms where the campaign is active
- **Calculation**: Count of distinct platforms with campaign content
- **Formula**: `COUNT(DISTINCT platform)`
- **Data Source**: `social_posts.platform`
- **Display Format**: Integer with platform icons (e.g., "4 platforms")
- **Usage**: Campaign card platform indicator, coverage metric

#### **5. Campaign Status**
- **Name**: Campaign Status
- **Description**: Current operational status of the campaign
- **Calculation**: Direct field value
- **Formula**: `campaigns.status`
- **Data Source**: `campaigns.status`
- **Display Format**: Status badge with color coding
- **Values**: `active`, `paused`, `completed`, `draft`
- **Usage**: Campaign card status indicator

#### **6. Campaign Duration**
- **Name**: Campaign Duration
- **Description**: Time span from campaign start to end date
- **Calculation**: Difference between end_date and start_date
- **Formula**: `end_date - start_date`
- **Data Source**: `campaigns.start_date`, `campaigns.end_date`
- **Display Format**: "X days" or date range
- **Usage**: Campaign card temporal context

### **🔍 Brand View - Campaign Detail Metrics**

#### **Social Platform Overview Metrics**

#### **7. Platform Impressions**
- **Name**: Platform Impressions
- **Description**: Total number of times content was displayed on a specific platform
- **Calculation**: Sum of impressions for the platform within campaign
- **Formula**: `SUM(impressions) WHERE platform = 'platform_name'`
- **Data Source**: `social_analytics.impressions`
- **Display Format**: Formatted number (e.g., "125,430")
- **Usage**: Platform-specific performance comparison

#### **8. Platform Reach**
- **Name**: Platform Reach
- **Description**: Number of unique users who saw content on a specific platform
- **Calculation**: Sum of reach for the platform within campaign
- **Formula**: `SUM(reach) WHERE platform = 'platform_name'`
- **Data Source**: `social_analytics.reach`
- **Display Format**: Formatted number (e.g., "67,890")
- **Usage**: Platform audience penetration metric

#### **9. Platform Engagement**
- **Name**: Platform Engagement
- **Description**: Total interactions on a specific platform
- **Calculation**: Sum of engagement for the platform within campaign
- **Formula**: `SUM(engagement) WHERE platform = 'platform_name'`
- **Data Source**: `social_analytics.engagement`
- **Display Format**: Formatted number (e.g., "3,245")
- **Usage**: Platform interaction volume

#### **10. Platform Engagement Rate**
- **Name**: Platform Engagement Rate
- **Description**: Engagement percentage for a specific platform
- **Calculation**: Platform engagement divided by platform impressions
- **Formula**: `(SUM(engagement) / SUM(impressions)) × 100 WHERE platform = 'platform_name'`
- **Data Source**: `social_analytics.engagement`, `social_analytics.impressions`
- **Display Format**: Percentage (e.g., "3.85%")
- **Usage**: Platform efficiency comparison

#### **Performance Trend Metrics**

#### **11. Daily Impressions Trend**
- **Name**: Daily Impressions
- **Description**: Impressions tracked over time for trend analysis
- **Calculation**: Sum of impressions grouped by date
- **Formula**: `SUM(impressions) GROUP BY analytics_date`
- **Data Source**: `social_analytics.impressions`, `social_analytics.analytics_date`
- **Display Format**: Time series chart data
- **Usage**: Trend visualization, performance patterns

#### **12. Daily Engagement Trend**
- **Name**: Daily Engagement
- **Description**: Engagement tracked over time for trend analysis
- **Calculation**: Sum of engagement grouped by date
- **Formula**: `SUM(engagement) GROUP BY analytics_date`
- **Data Source**: `social_analytics.engagement`, `social_analytics.analytics_date`
- **Display Format**: Time series chart data
- **Usage**: Engagement pattern analysis

#### **13. Daily Reach Trend**
- **Name**: Daily Reach
- **Description**: Reach tracked over time for trend analysis
- **Calculation**: Sum of reach grouped by date
- **Formula**: `SUM(reach) GROUP BY analytics_date`
- **Data Source**: `social_analytics.reach`, `social_analytics.analytics_date`
- **Display Format**: Time series chart data
- **Usage**: Audience growth tracking

#### **Platform-Specific Detailed Metrics**

#### **14. Facebook Reactions**
- **Name**: Facebook Reactions
- **Description**: Breakdown of Facebook reaction types (like, love, wow, etc.)
- **Calculation**: Extract from Facebook-specific metrics JSON
- **Formula**: `facebook_metrics->'reactions'`
- **Data Source**: `social_analytics.facebook_metrics`
- **Display Format**: JSON object with reaction counts
- **Usage**: Facebook-specific engagement analysis

#### **15. Instagram Saves**
- **Name**: Instagram Saves
- **Description**: Number of times Instagram content was saved
- **Calculation**: Extract from Instagram-specific metrics
- **Formula**: `instagram_metrics->'savedCount'`
- **Data Source**: `social_analytics.instagram_metrics`
- **Display Format**: Integer count
- **Usage**: Instagram content value indicator

#### **16. Twitter Retweets**
- **Name**: Twitter Retweets
- **Description**: Number of times Twitter content was retweeted
- **Calculation**: Extract from Twitter-specific metrics
- **Formula**: `twitter_metrics->'retweetCount'`
- **Data Source**: `social_analytics.twitter_metrics`
- **Display Format**: Integer count
- **Usage**: Twitter virality metric

#### **17. LinkedIn Clicks**
- **Name**: LinkedIn Clicks
- **Description**: Number of clicks on LinkedIn content
- **Calculation**: Extract from LinkedIn-specific metrics
- **Formula**: `linkedin_metrics->'clickCount'`
- **Data Source**: `social_analytics.linkedin_metrics`
- **Display Format**: Integer count
- **Usage**: LinkedIn engagement depth

#### **18. Video Views**
- **Name**: Video Views
- **Description**: Total number of video plays across platforms
- **Calculation**: Sum of video views for video content
- **Formula**: `SUM(video_views)`
- **Data Source**: `social_analytics.video_views`
- **Display Format**: Formatted number
- **Usage**: Video content performance

#### **19. Video Completion Rate**
- **Name**: Video Completion Rate
- **Description**: Percentage of video views that watched to completion
- **Calculation**: Average completion rate across video posts
- **Formula**: `AVG(video_completion_rate)`
- **Data Source**: `social_analytics.video_completion_rate`
- **Display Format**: Percentage (e.g., "78.5%")
- **Usage**: Video content quality metric

#### **20. Average Watch Time**
- **Name**: Average Watch Time
- **Description**: Average time users spent watching video content
- **Calculation**: Average watch time across video posts
- **Formula**: `AVG(average_watch_time)`
- **Data Source**: `social_analytics.average_watch_time`
- **Display Format**: Time format (e.g., "0:45")
- **Usage**: Video engagement depth

### **🏪 Retailer View - Campaign Metrics**

#### **21. Retailer Campaign Count**
- **Name**: Active Campaigns
- **Description**: Number of campaigns currently running for the retailer
- **Calculation**: Count of active campaigns for retailer
- **Formula**: `COUNT(*) WHERE status = 'active' AND retailer_id = ?`
- **Data Source**: `campaigns.status`, `campaigns.retailer_id`
- **Display Format**: Integer count
- **Usage**: Retailer activity level

#### **22. Retailer Total Reach**
- **Name**: Total Reach
- **Description**: Combined reach across all retailer campaigns
- **Calculation**: Sum of reach for all retailer campaigns
- **Formula**: `SUM(reach) WHERE campaign_id IN (retailer_campaigns)`
- **Data Source**: `social_analytics.reach`
- **Display Format**: Formatted number with K/M suffixes
- **Usage**: Retailer audience size

#### **23. Retailer Total Engagement**
- **Name**: Total Engagement
- **Description**: Combined engagement across all retailer campaigns
- **Calculation**: Sum of engagement for all retailer campaigns
- **Formula**: `SUM(engagement) WHERE campaign_id IN (retailer_campaigns)`
- **Data Source**: `social_analytics.engagement`
- **Display Format**: Formatted number with K/M suffixes
- **Usage**: Retailer interaction volume

#### **24. Retailer Engagement Rate**
- **Name**: Overall Engagement Rate
- **Description**: Average engagement rate across all retailer campaigns
- **Calculation**: Total engagement divided by total impressions
- **Formula**: `(SUM(engagement) / SUM(impressions)) × 100`
- **Data Source**: `social_analytics.engagement`, `social_analytics.impressions`
- **Display Format**: Percentage (e.g., "4.12%")
- **Usage**: Retailer performance efficiency

---

## 🏪 **Retailer Performance Metrics**

### **📊 Retailer Performance Dashboard**

#### **Core Performance Metrics**

#### **25. Performance Score**
- **Name**: Overall Performance Score
- **Description**: Composite score based on multiple performance indicators
- **Calculation**: Weighted average of key performance metrics
- **Formula**: `(revenue_score × 0.3 + engagement_score × 0.25 + efficiency_score × 0.25 + growth_score × 0.2)`
- **Data Source**: `retailer_performance_metrics.performance_score`
- **Display Format**: Score out of 100 (e.g., "87.5")
- **Usage**: Primary ranking and comparison metric

#### **26. Revenue**
- **Name**: Total Revenue
- **Description**: Total sales revenue for the measurement period
- **Calculation**: Sum of all sales transactions
- **Formula**: `SUM(order_value)`
- **Data Source**: `retailer_performance_metrics.revenue`
- **Display Format**: Currency format (e.g., "$125,000")
- **Usage**: Financial performance indicator

#### **27. Orders Count**
- **Name**: Total Orders
- **Description**: Number of orders processed in the period
- **Calculation**: Count of completed orders
- **Formula**: `COUNT(orders)`
- **Data Source**: `retailer_performance_metrics.orders_count`
- **Display Format**: Integer with comma separators (e.g., "1,245")
- **Usage**: Sales volume indicator

#### **28. Average Order Value (AOV)**
- **Name**: Average Order Value
- **Description**: Average value per order transaction
- **Calculation**: Total revenue divided by number of orders
- **Formula**: `revenue / orders_count`
- **Data Source**: `retailer_performance_metrics.average_order_value`
- **Display Format**: Currency format (e.g., "$156.78")
- **Usage**: Customer spending behavior metric

#### **29. Conversion Rate**
- **Name**: Conversion Rate
- **Description**: Percentage of visitors who made a purchase
- **Calculation**: Orders divided by total website visitors
- **Formula**: `(orders_count / website_traffic) × 100`
- **Data Source**: `retailer_performance_metrics.conversion_rate`
- **Display Format**: Percentage (e.g., "3.25%")
- **Usage**: Sales efficiency metric

#### **Customer Metrics**

#### **30. Customer Acquisition Cost (CAC)**
- **Name**: Customer Acquisition Cost
- **Description**: Average cost to acquire a new customer
- **Calculation**: Marketing spend divided by new customers acquired
- **Formula**: `marketing_spend / new_customers`
- **Data Source**: `retailer_performance_metrics.customer_acquisition_cost`
- **Display Format**: Currency format (e.g., "$45.50")
- **Usage**: Marketing efficiency metric

#### **31. Customer Lifetime Value (CLV)**
- **Name**: Customer Lifetime Value
- **Description**: Predicted total value of a customer relationship
- **Calculation**: Average order value × purchase frequency × customer lifespan
- **Formula**: `average_order_value × avg_orders_per_year × avg_customer_lifespan`
- **Data Source**: `retailer_performance_metrics.customer_lifetime_value`
- **Display Format**: Currency format (e.g., "$1,250.00")
- **Usage**: Customer value assessment

#### **32. Customer Satisfaction (CSAT)**
- **Name**: Customer Satisfaction Score
- **Description**: Average customer satisfaction rating
- **Calculation**: Average of customer satisfaction surveys
- **Formula**: `AVG(satisfaction_rating)`
- **Data Source**: `retailer_performance_metrics.customer_satisfaction`
- **Display Format**: Rating out of 5 (e.g., "4.2/5")
- **Usage**: Service quality indicator

#### **33. Net Promoter Score (NPS)**
- **Name**: Net Promoter Score
- **Description**: Customer loyalty and recommendation likelihood
- **Calculation**: Percentage of promoters minus percentage of detractors
- **Formula**: `(promoters% - detractors%)`
- **Data Source**: `retailer_performance_metrics.net_promoter_score`
- **Display Format**: Score from -100 to +100 (e.g., "+65")
- **Usage**: Customer loyalty metric

#### **Digital Marketing Metrics**

#### **34. Email Open Rate**
- **Name**: Email Open Rate
- **Description**: Percentage of sent emails that were opened
- **Calculation**: Opened emails divided by delivered emails
- **Formula**: `(emails_opened / emails_delivered) × 100`
- **Data Source**: `retailer_performance_metrics.email_open_rate`
- **Display Format**: Percentage (e.g., "24.5%")
- **Usage**: Email marketing effectiveness

#### **35. Email Click Rate**
- **Name**: Email Click Rate
- **Description**: Percentage of opened emails that received clicks
- **Calculation**: Clicked emails divided by opened emails
- **Formula**: `(emails_clicked / emails_opened) × 100`
- **Data Source**: `retailer_performance_metrics.email_click_rate`
- **Display Format**: Percentage (e.g., "4.2%")
- **Usage**: Email content engagement

#### **36. Social Engagement Rate**
- **Name**: Social Media Engagement Rate
- **Description**: Average engagement rate across all social platforms
- **Calculation**: Total social engagement divided by total social impressions
- **Formula**: `(total_social_engagement / total_social_impressions) × 100`
- **Data Source**: `retailer_performance_metrics.social_engagement_rate`
- **Display Format**: Percentage (e.g., "5.8%")
- **Usage**: Social media performance

#### **37. Social Follower Growth**
- **Name**: Follower Growth
- **Description**: Net increase in social media followers
- **Calculation**: Current followers minus previous period followers
- **Formula**: `current_followers - previous_followers`
- **Data Source**: `retailer_performance_metrics.social_follower_growth`
- **Display Format**: Integer with +/- indicator (e.g., "+125")
- **Usage**: Social media growth tracking

#### **Website & Traffic Metrics**

#### **38. Website Traffic**
- **Name**: Website Traffic
- **Description**: Total number of website visits in the period
- **Calculation**: Sum of all website sessions
- **Formula**: `COUNT(website_sessions)`
- **Data Source**: `retailer_performance_metrics.website_traffic`
- **Display Format**: Formatted number (e.g., "8,500")
- **Usage**: Digital presence indicator

#### **39. Bounce Rate**
- **Name**: Bounce Rate
- **Description**: Percentage of visitors who leave after viewing one page
- **Calculation**: Single-page sessions divided by total sessions
- **Formula**: `(single_page_sessions / total_sessions) × 100`
- **Data Source**: `retailer_performance_metrics.bounce_rate`
- **Display Format**: Percentage (e.g., "35.2%")
- **Usage**: Website engagement quality

#### **40. Page Views**
- **Name**: Total Page Views
- **Description**: Total number of pages viewed across all sessions
- **Calculation**: Sum of all page views
- **Formula**: `SUM(page_views)`
- **Data Source**: `retailer_performance_metrics.page_views`
- **Display Format**: Formatted number (e.g., "25,000")
- **Usage**: Content consumption metric

#### **41. Session Duration**
- **Name**: Average Session Duration
- **Description**: Average time users spend on the website per session
- **Calculation**: Total session time divided by number of sessions
- **Formula**: `total_session_time / session_count`
- **Data Source**: `retailer_performance_metrics.session_duration`
- **Display Format**: Time format (e.g., "3:45")
- **Usage**: User engagement depth

#### **Operational Metrics**

#### **42. Inventory Turnover**
- **Name**: Inventory Turnover Rate
- **Description**: How quickly inventory is sold and replaced
- **Calculation**: Cost of goods sold divided by average inventory value
- **Formula**: `cost_of_goods_sold / average_inventory_value`
- **Data Source**: `retailer_performance_metrics.inventory_turnover`
- **Display Format**: Decimal (e.g., "4.5x")
- **Usage**: Inventory management efficiency

#### **43. Return Rate**
- **Name**: Return Rate
- **Description**: Percentage of orders that are returned
- **Calculation**: Returned orders divided by total orders
- **Formula**: `(returned_orders / total_orders) × 100`
- **Data Source**: `retailer_performance_metrics.return_rate`
- **Display Format**: Percentage (e.g., "8.5%")
- **Usage**: Product quality and satisfaction indicator

#### **Competitive & Market Metrics**

#### **44. Market Share**
- **Name**: Regional Market Share
- **Description**: Retailer's share of the regional luxury market
- **Calculation**: Retailer revenue divided by total regional market revenue
- **Formula**: `(retailer_revenue / regional_market_revenue) × 100`
- **Data Source**: `retailer_performance_metrics.market_share`
- **Display Format**: Percentage (e.g., "12.5%")
- **Usage**: Market position indicator

#### **45. Competitive Ranking**
- **Name**: Market Position Ranking
- **Description**: Retailer's ranking among regional competitors
- **Calculation**: Rank based on performance score within region
- **Formula**: `RANK() OVER (PARTITION BY region ORDER BY performance_score DESC)`
- **Data Source**: `retailer_performance_metrics.competitive_ranking`
- **Display Format**: Ordinal number (e.g., "#3")
- **Usage**: Competitive position tracking

### **📈 Retailer Performance Rankings**

#### **46. Overall Ranking**
- **Name**: Overall Performance Ranking
- **Description**: Retailer's rank among all retailers in the system
- **Calculation**: Rank based on overall performance score
- **Formula**: `RANK() OVER (ORDER BY performance_score DESC)`
- **Data Source**: Calculated from `retailer_performance_metrics.performance_score`
- **Display Format**: Ordinal ranking (e.g., "#15 of 250")
- **Usage**: Global performance comparison

#### **47. Regional Ranking**
- **Name**: Regional Performance Ranking
- **Description**: Retailer's rank within their geographic region
- **Calculation**: Rank based on performance score within region
- **Formula**: `RANK() OVER (PARTITION BY region ORDER BY performance_score DESC)`
- **Data Source**: Calculated from performance metrics and retailer region
- **Display Format**: Ordinal ranking (e.g., "#3 in East Coast")
- **Usage**: Regional performance comparison

#### **48. Tier Ranking**
- **Name**: Tier Performance Ranking
- **Description**: Retailer's rank within their business tier (premium, standard, etc.)
- **Calculation**: Rank based on performance score within tier
- **Formula**: `RANK() OVER (PARTITION BY tier ORDER BY performance_score DESC)`
- **Data Source**: Calculated from performance metrics and retailer tier
- **Display Format**: Ordinal ranking (e.g., "#2 in Premium Tier")
- **Usage**: Peer group comparison

#### **Growth & Trend Metrics**

#### **49. Performance Score Change**
- **Name**: Performance Score Trend
- **Description**: Change in performance score compared to previous period
- **Calculation**: Current score minus previous period score
- **Formula**: `current_performance_score - previous_performance_score`
- **Data Source**: Time-series comparison of `performance_score`
- **Display Format**: Change with +/- indicator (e.g., "+5.2")
- **Usage**: Performance trend tracking

#### **50. Revenue Growth Rate**
- **Name**: Revenue Growth Rate
- **Description**: Percentage change in revenue compared to previous period
- **Calculation**: Revenue change divided by previous revenue
- **Formula**: `((current_revenue - previous_revenue) / previous_revenue) × 100`
- **Data Source**: Time-series comparison of `revenue`
- **Display Format**: Percentage with +/- (e.g., "+12.5%")
- **Usage**: Financial growth tracking

---

## 🔄 **Metric Calculation Workflows**

### **Real-time Metric Updates**
1. **Social Analytics**: Updated every 4 hours via Ayrshare API simulation
2. **Email Metrics**: Updated in real-time as events occur
3. **Performance Scores**: Recalculated daily at midnight
4. **Rankings**: Updated after performance score recalculation

### **Data Aggregation Periods**
- **Daily**: Most granular level for trend analysis
- **Weekly**: Rolling 7-day periods for short-term trends
- **Monthly**: Calendar month aggregations for reporting
- **Quarterly**: 3-month periods for business reviews

### **Metric Dependencies**
```
Performance Score = f(
  Revenue Metrics (30%),
  Engagement Metrics (25%),
  Efficiency Metrics (25%),
  Growth Metrics (20%)
)

Engagement Rate = Total Engagement / Total Impressions
ROI = (Revenue - Cost) / Cost × 100
Customer LTV = AOV × Purchase Frequency × Customer Lifespan
```

---

## 📋 **Metric Usage Matrix**

| Metric | Campaign Cards | Campaign Details | Retailer Dashboard | Rankings | Trends |
|--------|---------------|------------------|-------------------|----------|--------|
| Engagement Rate | ✅ | ✅ | ✅ | ✅ | ✅ |
| Social Reach | ✅ | ✅ | ✅ | ❌ | ✅ |
| Performance Score | ❌ | ❌ | ✅ | ✅ | ✅ |
| Revenue | ❌ | ❌ | ✅ | ✅ | ✅ |
| Platform Metrics | ❌ | ✅ | ❌ | ❌ | ✅ |
| Video Metrics | ❌ | ✅ | ❌ | ❌ | ✅ |
| Customer Metrics | ❌ | ❌ | ✅ | ✅ | ✅ |

This comprehensive metrics guide ensures every metric across CrownSync is properly defined, calculated, and documented for consistent implementation and understanding across all development teams.