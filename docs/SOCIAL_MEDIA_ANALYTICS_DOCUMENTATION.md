# 📱 Social Media Analytics Documentation

## 📋 Overview

The CrownSync platform includes comprehensive social media analytics integration that provides luxury brand retailers with unified social media performance insights across LinkedIn, Facebook, Instagram, and Google Business Profile platforms using the Ayrshare API.

## 🎯 Key Features

### **Unified Social Analytics**
- Centralized dashboard for multi-platform social media performance
- Cross-platform engagement metrics and comparison
- Real-time data updates with Supabase subscriptions
- Export functionality (CSV, JSON, PDF)

### **Retailer Performance Tracking**
- Individual retailer social media engagement and growth metrics
- Performance rankings and benchmarking
- Regional performance analysis
- Platform-specific analytics dashboards

### **Campaign Attribution**
- Connect social media performance to marketing campaigns and ROI
- Multi-touch attribution modeling
- Campaign effectiveness measurement
- Social commerce tracking

### **Content Analytics**
- Top-performing content identification
- Hashtag performance tracking
- Optimal posting time recommendations
- Content type performance analysis

## 🗄️ Database Schema

### Core Social Media Tables

The social media analytics system uses 6 main database tables:

#### 1. `social_accounts`
Enhanced social account management with Ayrshare integration
- Multi-platform support (LinkedIn, Facebook, Instagram, Google Business)
- Ayrshare profile key mapping for API integration
- Sync status tracking for data freshness
- Platform-specific metadata storage

#### 2. `social_posts`
Comprehensive post tracking with campaign attribution
- Campaign attribution for ROI analysis
- Multi-media support (images, videos, carousels, stories)
- Hashtag tracking for performance analysis
- Scheduling and status management

#### 3. `social_analytics`
Daily post-level analytics with calculated engagement metrics
- Comprehensive engagement tracking (likes, comments, shares, reactions)
- Reach and impression metrics (organic vs paid)
- Video performance metrics
- Auto-calculated engagement rates

#### 4. `account_analytics`
Daily account-level performance tracking
- Follower growth and churn tracking
- Profile engagement metrics
- Content performance aggregation
- Auto-calculated growth rates

#### 5. `audience_demographics`
Audience demographic analysis for targeting optimization
- Age and gender distribution tracking
- Geographic audience breakdown
- Interest category analysis
- Platform-specific demographic data

#### 6. `hashtag_performance`
Hashtag performance tracking for content optimization
- Hashtag usage and performance metrics
- Cross-platform hashtag analysis
- Engagement rate by hashtag
- Content strategy optimization data

### Database Views

#### `social_performance_summary`
Comprehensive social media performance overview for dashboard cards and rankings

#### `top_performing_content`
Top-performing content identification for content strategy optimization

## 🎨 Frontend Components

### Main Social Analytics Page
**Route**: `/dashboard/brand-performance/social-analytics`

#### Overview Cards
- Total Reach with trend indicators
- Engagement Rate with platform breakdown
- Link Clicks and conversion metrics
- New Followers and growth tracking

#### Platform Tabs
- **Overview**: Cross-platform analytics and comparison
- **LinkedIn**: Professional metrics and company page performance
- **Instagram**: Stories, reels, and shopping performance
- **Facebook**: Page insights and audience demographics
- **Google Business**: Profile views and customer actions

#### Data Visualization
- **Engagement Trends Chart**: Time-series engagement analysis
- **Platform Comparison Chart**: Radar chart for platform performance
- **Retailer Ranking Table**: Sortable retailer performance rankings
- **Top Content Table**: Best performing content analysis

### Core Components

#### Analytics Components
- `SocialMetricCard.tsx` - Overview metric cards with trend indicators
- `EngagementTrendsChart.tsx` - Time-series engagement chart using Recharts
- `PlatformComparisonChart.tsx` - Radar chart for platform comparison
- `RetailerSocialRankingTable.tsx` - Sortable retailer performance table
- `TopContentTable.tsx` - Best performing content with pagination

#### Filter Components
- `TimeRangeSelector.tsx` - Date range picker for filtering
- `PlatformFilter.tsx` - Multi-platform selection filter
- `RegionFilter.tsx` - Geographic filtering component

#### Platform-Specific Components
- `LinkedInAnalytics.tsx` - Professional metrics and company page performance
- `InstagramAnalytics.tsx` - Stories, reels, and shopping performance
- `FacebookAnalytics.tsx` - Page insights and audience demographics
- `GoogleBusinessAnalytics.tsx` - Profile views and customer actions

### Advanced Features

#### Real-time Updates
- `useSocialAnalyticsRealtime.ts` - Supabase subscriptions for live data
- Automatic refresh indicators
- Live update notifications

#### Export System
- `SocialAnalyticsExport.tsx` - Multi-format export component
- CSV, JSON, and PDF export options
- Customizable data sets and date ranges

## 🔄 API Integration

### Ayrshare Service Integration
The platform integrates with Ayrshare API for social media data synchronization:

#### Core Services
- `ayrshareService.ts` - Complete Ayrshare API client
- `socialDataSyncService.ts` - Automated sync service with error handling
- Data transformation utilities for platform normalization

#### API Endpoints
- `/api/social-analytics` - Main analytics endpoint with filtering
- `/api/social-analytics/accounts` - Social account management
- `/api/social-analytics/performance` - Retailer performance rankings
- `/api/social-analytics/content` - Top performing content analysis
- `/api/social-analytics/trends` - Engagement trends and platform comparison
- `/api/social-analytics/export` - Data export functionality

### Data Synchronization
- Scheduled data synchronization (hourly/daily)
- Manual sync triggers for specific accounts
- Error handling and retry logic
- Data validation and sanitization
- Rate limiting for API calls

## 📊 Key Metrics Tracked

### Post Performance Metrics
- **Engagement Rate**: likes, comments, shares, reactions
- **Reach & Impressions**: organic vs paid reach
- **Click-through Rate**: link clicks from posts
- **Video Metrics**: views, completion rate, watch time
- **Story Metrics**: views, replies, exits

### Account-Level Analytics
- **Follower Growth**: new followers, unfollows, net growth
- **Profile Visits**: profile views and actions
- **Website Clicks**: traffic driven to brand websites
- **Audience Demographics**: age, gender, location breakdown

### Platform-Specific Metrics
- **LinkedIn**: professional engagement, company page views
- **Instagram**: story completion, reel performance, shopping clicks
- **Facebook**: page likes, post shares, event responses
- **Google Business**: review ratings, photo views, direction requests

### Comparative Analytics
- **Cross-platform Performance**: unified metrics across channels
- **Best Performing Content**: top posts by engagement
- **Optimal Posting Times**: engagement by time/day
- **Hashtag Performance**: reach and engagement by hashtags

## 🚀 Setup and Configuration

### Environment Variables
```bash
# Ayrshare API Configuration
AYRSHARE_API_KEY=your_ayrshare_api_key
AYRSHARE_BASE_URL=https://app.ayrshare.com/api

# Supabase Configuration (for real-time updates)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Database Setup
1. Run social media analytics migrations
2. Populate sample data for development
3. Configure Row Level Security (RLS) policies
4. Set up database indexes for performance

### Ayrshare Integration
1. Create Ayrshare account and obtain API key
2. Configure social media accounts in Ayrshare
3. Set up webhook endpoints for real-time updates
4. Configure sync schedules and data retention

## 🔧 Development Workflow

### Component Development
```bash
# Social analytics components location
components/brand-performance/
├── SocialMetricCard.tsx
├── EngagementTrendsChart.tsx
├── PlatformComparisonChart.tsx
├── RetailerSocialRankingTable.tsx
├── TopContentTable.tsx
├── LinkedInAnalytics.tsx
├── InstagramAnalytics.tsx
├── FacebookAnalytics.tsx
├── GoogleBusinessAnalytics.tsx
└── SocialAnalyticsExport.tsx
```

### API Development
```bash
# Social analytics API routes
app/api/social-analytics/
├── route.ts                    # Main analytics endpoint
├── accounts/route.ts           # Account management
├── performance/route.ts        # Performance rankings
├── content/route.ts           # Content analysis
├── trends/route.ts            # Engagement trends
└── export/route.ts            # Data export
```

### Testing
```bash
npm run test:social-analytics   # Run social analytics tests
npm run test:api               # Test API endpoints
npm run test:components        # Test React components
```

## 📈 Performance Optimization

### Database Optimization
- Proper indexing on frequently queried columns
- Database views for complex aggregations
- Query optimization for large datasets
- Data archiving for historical data

### Frontend Optimization
- Lazy loading for large datasets
- Virtual scrolling for tables
- Chart optimization with data sampling
- Caching strategies for frequently accessed data

### API Optimization
- Response caching for static data
- Pagination for large result sets
- Rate limiting and throttling
- Efficient data transformation

## 🎯 Success Metrics

### Technical Metrics
- Page Load Performance: < 2 seconds for social analytics dashboard
- Data Freshness: Social data updated within 1 hour of Ayrshare sync
- API Response Time: < 500ms for analytics queries
- Database Query Performance: < 100ms for complex aggregations

### Business Metrics
- User Engagement: 80%+ of retailers actively use social analytics
- Data Accuracy: 95%+ accuracy compared to native platform analytics
- Performance Improvement: 15%+ average engagement rate improvement after 3 months
- Cross-Platform Visibility: 100% of active retailers have multi-platform presence tracked

## 🔮 Future Enhancements

### Planned Features
- **AI-Powered Content Recommendations**: Suggest optimal content based on historical performance
- **Automated Posting Scheduling**: Recommend best posting times per platform
- **Competitor Analysis**: Benchmark against industry competitors
- **Influencer Collaboration Tracking**: Track influencer partnership performance
- **Social Commerce Integration**: Track social media driven sales

### Technical Roadmap
- **Real-Time Data Streaming**: WebSocket-based live updates
- **Advanced Caching**: Redis implementation for improved performance
- **Mobile App**: React Native companion app for mobile analytics
- **API Rate Optimization**: Intelligent API call batching and caching
- **Advanced Security**: Enhanced data encryption and access controls

## 📞 Support and Resources

### Documentation Links
- [Ayrshare API Documentation](https://docs.ayrshare.com/)
- [Supabase Real-time Documentation](https://supabase.com/docs/guides/realtime)
- [Recharts Documentation](https://recharts.org/)

### Development Resources
- **Component Library**: Shadcn/UI components for consistent design
- **Type Safety**: Full TypeScript coverage across all components
- **Testing**: Jest and React Testing Library for component testing
- **Performance**: React Query for efficient data fetching and caching

This comprehensive social media analytics system provides luxury brand retailers with powerful insights to optimize their social media presence and drive engagement across all major platforms.