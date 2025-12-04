# Brand Campaign Performance - Mock Data Source Documentation

## Overview
This document describes the centralized mock data source for the Brand Campaign Performance dashboard.

## Data Source Location
**File**: `/lib/brand-campaign-data.ts`

This file contains all mock data for brand campaign performance metrics, ensuring consistency across all components.

## Data Structure

### 1. Retailer Performance Data
**Type**: `RetailerPerformance[]`
**Export**: `retailerPerformance`

Contains performance metrics for 13 retailers across 4 regions (East, West, Central, South):
- Basic info: id, name, region
- Metrics: posts, engagement, reach, engagementRate, followers, postingFrequency
- Performance indicators: performance level, growth percentage, top platform

### 2. Platform Posting Status Data
**Type**: `RetailerPostingData[]`
**Export**: `retailerPostingData`

Tracks posting status across 4 platforms (Instagram, Facebook, X/Twitter, LinkedIn) for each retailer:
- Status: 'posted', 'not_posted', 'not_planned'
- Post details: postTime, postUrl, engagement metrics (likes, comments, shares)
- Reasons for non-posting when applicable

### 3. Platform Performance Data
**Type**: `PlatformPerformance[]`
**Export**: `platformPerformance`

Aggregated performance metrics for each social media platform:
- Posts count, engagement, reach
- Engagement rate and growth
- Top content type per platform

### 4. Campaign Metrics
**Function**: `getCampaignMetrics()`
**Export**: `fetchCampaignMetrics()`

Dynamically calculates aggregate campaign metrics:
- Total posts, engagement, reach
- Average engagement rate
- Retailer counts (total and active)
- Number of platforms used

### 5. Regional Data
**Function**: `calculateRegionalData()`
**Export**: `fetchRegionalData()`

Dynamically calculates regional performance from retailer data:
- Aggregates metrics by region
- Calculates averages for engagement rate and growth
- Determines performance scores
- Identifies top retailer per region

## Usage

### Importing Data

```typescript
import { 
  retailerPerformance,
  retailerPostingData,
  platformPerformance,
  getCampaignMetrics,
  calculateRegionalData,
  // Or use async wrappers:
  fetchRetailerPerformance,
  fetchRetailerPostingData,
  fetchPlatformPerformance,
  fetchCampaignMetrics,
  fetchRegionalData
} from '@/lib/brand-campaign-data'
```

### Using in Components

#### Synchronous Usage
```typescript
const retailers = retailerPerformance
const metrics = getCampaignMetrics()
const regions = calculateRegionalData()
```

#### Async Usage (for future API integration)
```typescript
const retailers = await fetchRetailerPerformance()
const metrics = await fetchCampaignMetrics()
const regions = await fetchRegionalData()
```

## Components Using This Data

1. **SocialCampaignAnalytics.tsx**
   - Uses: `retailerPerformance`, `calculateRegionalData()`
   - Displays: Retailer performance table, regional heatmap, performance scoring

2. **PlatformPostingMatrix.tsx**
   - Uses: `retailerPostingData` (indirectly)
   - Displays: Platform posting status matrix

3. **RegionalHeatmap.tsx**
   - Uses: Regional data passed as props
   - Displays: US map visualization with regional metrics

## Benefits of Centralized Data

1. **Consistency**: All components use the same data source
2. **Maintainability**: Update data in one place
3. **Type Safety**: TypeScript interfaces ensure data integrity
4. **Scalability**: Easy to replace with real API calls
5. **Testing**: Simplified mock data management

## Future Enhancements

### Replacing with Real API
To connect to a real API, update the async functions:

```typescript
export async function fetchRetailerPerformance(): Promise<RetailerPerformance[]> {
  const response = await fetch('/api/retailers/performance')
  return response.json()
}
```

### Adding More Data Points
1. Add new interfaces in `brand-campaign-data.ts`
2. Create mock data following existing patterns
3. Export async wrapper functions
4. Import and use in components

## Data Relationships

```
retailerPerformance (13 retailers)
    ↓
calculateRegionalData() → Regional aggregations (4 regions)
    ↓
RegionalHeatmap → Map visualization

retailerPostingData (6 retailers with detailed posting info)
    ↓
PlatformPostingMatrix → Status matrix

platformPerformance (4 platforms)
    ↓
Platform analytics cards
```

## Mock Data Statistics

- **Total Retailers**: 13
- **Regions**: 4 (East, West, Central, South)
- **Platforms**: 4 (Instagram, Facebook, X, LinkedIn)
- **Total Posts**: 235 (calculated from retailer data)
- **Total Engagement**: 57,600+ (calculated)
- **Total Reach**: 1,020,000+ (calculated)

## Notes

- All data is currently static mock data
- Calculations are performed client-side
- Data updates require page refresh
- No persistence layer (data resets on reload)
