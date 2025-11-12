// Preset responses for Quick Actions to provide immediate feedback
export interface PresetResponse {
  id: string;
  query: string;
  response: string;
  category: 'campaign' | 'retailer' | 'database' | 'email' | 'user' | 'document';
  lastUpdated: string;
}

export const presetResponses: PresetResponse[] = [
  {
    id: 'campaign-performance',
    query: 'Show me the performance of all active campaigns with their ROI and key metrics',
    response: `# 📊 Campaign Performance Overview

Based on the latest data from your CrownSync platform:

## Active Campaigns Summary
- **Total Active Campaigns**: 4
- **Average ROI**: 285%
- **Total Reach**: 1.2M users
- **Total Engagement**: 92,400 interactions

## Top Performing Campaigns

| Campaign | Status | ROI | Reach | Engagement |
|----------|--------|-----|-------|------------|
| Spring Collection Preview | Active | 340% | 285K | 24.5K |
| Winter Wonderland Exclusive | Active | 380% | 312K | 28.9K |
| Timeless Elegance Launch | Active | 320% | 245K | 21.8K |
| Holiday Luxury Campaign | Paused | 190% | 198K | 18.2K |

## Key Insights
- **Best Performer**: Winter Wonderland Exclusive (380% ROI)
- **Highest Reach**: Winter Wonderland Exclusive (312K users)
- **Most Engaging**: Winter Wonderland Exclusive (28.9K interactions)

*🔄 Fetching live data to enhance this summary...*`,
    category: 'campaign',
    lastUpdated: '2025-01-14T10:30:00Z'
  },
  {
    id: 'top-retailers',
    query: 'Who are the top 5 performing retailers and what makes them successful?',
    response: `# 🏆 Top 5 Performing Retailers

## Performance Rankings

| Rank | Retailer | Region | Grade | Performance Score |
|------|----------|--------|-------|------------------|
| 1 | Cartier Rodeo Drive (West) | West | A+ | 98.2% |
| 2 | Betteridge NY (East) | East | A+ | 96.8% |
| 3 | Westime LA (West) | West | A | 94.5% |
| 4 | Tourneau Times Square (East) | East | A | 92.1% |
| 5 | Mayors Jewelry (Central) | Central | A | 89.7% |

## Success Factors

### 🎯 **What Makes Them Successful:**
- **Near-perfect delivery rates** (98%+ across all top performers)
- **Strong engagement** with click rates above 3.2%
- **Consistent performance** across multiple campaigns
- **High customer satisfaction** scores
- **Excellent regional market penetration**

### 📈 **Key Performance Metrics:**
- **Average Delivery Rate**: 98.1%
- **Average Open Rate**: 45.7%
- **Average Click Rate**: 3.8%
- **Customer Retention**: 94.3%

*🔄 Gathering detailed performance analytics...*`,
    category: 'retailer',
    lastUpdated: '2025-01-14T10:30:00Z'
  },
  {
    id: 'database-overview',
    query: 'What data tables are available in the database and what information do they contain?',
    response: `# 🗄️ CrownSync Database Overview

## Available Data Tables

### 📊 **Campaign Management**
- **campaigns** - Marketing campaign data with budgets, dates, and status
- **campaign_performance_summary** - Campaign analytics including ROI, email metrics, and performance tiers
- **email_campaigns** - Email campaign details and content
- **email_sends** - Email delivery and engagement data

### 🏪 **Retailer Analytics**
- **retailer_performance_dashboard** - Retailer rankings, regions, performance grades, and sales data
- **retailer_performance_metrics** - Detailed retailer analytics and KPIs

### 👥 **User Management**
- **users** - User information including retailers, brands, admins, regions, and activity status
- **user_analytics** - User behavior and engagement tracking

### 📱 **Social Media & Assets**
- **social_accounts** - Social media account management
- **social_analytics** - Social media performance data
- **brand_assets** - Digital asset management and tracking

## Query Capabilities
- **Campaign Performance**: ROI analysis, email metrics, campaign comparisons
- **Retailer Rankings**: Performance grades, regional analysis, sales data
- **User Analytics**: Activity patterns, demographic breakdowns, engagement metrics
- **Email Analytics**: Delivery rates, open rates, click-through rates

*🔄 Loading detailed schema information...*`,
    category: 'database',
    lastUpdated: '2025-01-14T10:30:00Z'
  },
  {
    id: 'email-analytics',
    query: 'Show me email campaign performance including open rates and click rates',
    response: `# 📧 Email Campaign Performance

## Overall Email Metrics

| Metric | Current Period | Previous Period | Change |
|--------|---------------|-----------------|--------|
| **Total Emails Sent** | 27,450 | 24,200 | +13.4% ↗️ |
| **Delivery Rate** | 98.2% | 97.8% | +0.4% ↗️ |
| **Open Rate** | 42.8% | 39.5% | +3.3% ↗️ |
| **Click Rate** | 3.2% | 2.9% | +0.3% ↗️ |
| **Conversion Rate** | 1.8% | 1.6% | +0.2% ↗️ |

## Top Performing Email Campaigns

### 🥇 **Spring Collection Preview**
- **Open Rate**: 45.7% (Above average)
- **Click Rate**: 3.8% (Above average)
- **Emails Sent**: 8,500
- **Conversions**: 187

### 🥈 **Winter Wonderland Exclusive**
- **Open Rate**: 44.2% (Above average)
- **Click Rate**: 3.6% (Above average)
- **Emails Sent**: 9,200
- **Conversions**: 201

### 🥉 **Timeless Elegance Launch**
- **Open Rate**: 43.1% (Above average)
- **Click Rate**: 3.4% (Above average)
- **Emails Sent**: 7,800
- **Conversions**: 156

## Performance Insights
- **Best Open Rate**: Spring Collection Preview (45.7%)
- **Best Click Rate**: Spring Collection Preview (3.8%)
- **Most Conversions**: Winter Wonderland Exclusive (201)

*🔄 Analyzing detailed email engagement patterns...*`,
    category: 'email',
    lastUpdated: '2025-01-14T10:30:00Z'
  },
  {
    id: 'user-statistics',
    query: 'Give me a breakdown of users by type and region with activity statistics',
    response: `# 👥 User Statistics & Demographics

## User Distribution by Type

| User Type | Count | Percentage | Active Users |
|-----------|-------|------------|--------------|
| **Retailers** | 125 | 62.5% | 118 (94.4%) |
| **Brand Partners** | 45 | 22.5% | 43 (95.6%) |
| **Administrators** | 30 | 15.0% | 30 (100%) |
| **Total** | 200 | 100% | 191 (95.5%) |

## Regional Distribution

### 🌍 **By Geographic Region**
| Region | Retailers | Brands | Admins | Total | Activity Rate |
|--------|-----------|--------|--------|-------|---------------|
| **East** | 35 | 12 | 8 | 55 | 96.4% |
| **West** | 32 | 15 | 7 | 54 | 94.4% |
| **Central** | 28 | 8 | 6 | 42 | 95.2% |
| **North** | 18 | 6 | 5 | 29 | 93.1% |
| **South** | 12 | 4 | 4 | 20 | 100% |

## Activity Insights

### 📈 **Engagement Metrics**
- **Daily Active Users**: 156 (78%)
- **Weekly Active Users**: 184 (92%)
- **Monthly Active Users**: 191 (95.5%)

### 🏆 **Top Performing Regions**
1. **South**: 100% activity rate (20/20 users)
2. **East**: 96.4% activity rate (53/55 users)
3. **Central**: 95.2% activity rate (40/42 users)

### 📊 **User Type Performance**
- **Administrators**: Highest activity rate (100%)
- **Brand Partners**: Strong engagement (95.6%)
- **Retailers**: Consistent activity (94.4%)

*🔄 Loading detailed user behavior analytics...*`,
    category: 'user',
    lastUpdated: '2025-01-14T10:30:00Z'
  },
  {
    id: 'upload-documents',
    query: 'How can I upload documents to ask questions about their content?',
    response: `# 📄 Document Upload & Q&A Guide

## How to Upload Documents

### 📁 **Supported File Types**
- **Text Files**: .txt, .md, .markdown
- **Data Files**: .csv
- **Maximum Size**: 10MB per file

### 🚀 **Upload Process**
1. **Switch to Documents Tab** - Click the "Documents" tab at the top
2. **Choose Your File** - Click "Choose File" in the upload area
3. **Select Document** - Browse and select your file
4. **Upload Complete** - File will appear in your document list

### 🤖 **AI Integration**
- **Toggle AI Access** - Use the switch next to each document
- **Connected Documents** - Only connected documents are searchable
- **Document Preview** - Click the eye icon to preview content

## Asking Questions About Documents

### 💬 **Example Questions**
- *"What are the key findings in the uploaded report?"*
- *"Summarize the main points from my document"*
- *"What does the document say about performance metrics?"*
- *"Find information about campaign results in my files"*

### 🔍 **How It Works**
1. **Upload & Connect** - Upload your document and toggle AI access ON
2. **Ask Questions** - Return to Chat tab and ask about your document
3. **AI Search** - I'll search through your documents for relevant information
4. **Get Answers** - Receive specific quotes and insights from your files

### 📋 **Best Practices**
- **Clear Filenames** - Use descriptive names for easy identification
- **Organize Content** - Well-structured documents work best
- **Connect Relevant Files** - Only connect documents you want searchable

*Ready to upload your first document? Switch to the Documents tab to get started!*`,
    category: 'document',
    lastUpdated: '2025-01-14T10:30:00Z'
  }
];

export class PresetResponsesService {
  /**
   * Get preset response for a query
   */
  static getPresetResponse(query: string): PresetResponse | null {
    const normalizedQuery = query.toLowerCase().trim();
    
    return presetResponses.find(preset => 
      normalizedQuery.includes(preset.query.toLowerCase()) ||
      this.isQueryMatch(normalizedQuery, preset)
    ) || null;
  }

  /**
   * Check if query matches preset based on keywords
   */
  private static isQueryMatch(query: string, preset: PresetResponse): boolean {
    const keywordMap: Record<string, string[]> = {
      'campaign-performance': ['campaign', 'performance', 'roi', 'metrics'],
      'top-retailers': ['retailer', 'top', 'best', 'performing'],
      'database-overview': ['database', 'table', 'schema', 'data'],
      'email-analytics': ['email', 'open rate', 'click rate', 'analytics'],
      'user-statistics': ['user', 'statistics', 'demographics', 'breakdown'],
      'upload-documents': ['upload', 'document', 'file', 'q&a']
    };

    const keywords = keywordMap[preset.id] || [];
    return keywords.some(keyword => query.includes(keyword));
  }

  /**
   * Get all preset responses by category
   */
  static getPresetsByCategory(category: PresetResponse['category']): PresetResponse[] {
    return presetResponses.filter(preset => preset.category === category);
  }

  /**
   * Check if query has a preset response available
   */
  static hasPresetResponse(query: string): boolean {
    return this.getPresetResponse(query) !== null;
  }

  /**
   * Get contextual message for query type
   */
  static getContextualMessage(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('campaign')) {
      return 'Analyzing campaign performance data...';
    }
    if (lowerQuery.includes('retailer')) {
      return 'Checking retailer rankings and metrics...';
    }
    if (lowerQuery.includes('email')) {
      return 'Gathering email campaign analytics...';
    }
    if (lowerQuery.includes('user') || lowerQuery.includes('statistics')) {
      return 'Compiling user demographics and activity data...';
    }
    if (lowerQuery.includes('database') || lowerQuery.includes('table')) {
      return 'Loading database schema information...';
    }
    if (lowerQuery.includes('document') || lowerQuery.includes('upload')) {
      return 'Preparing document upload guidance...';
    }
    
    return 'Processing your request...';
  }
}