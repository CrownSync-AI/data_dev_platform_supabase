# CrownSync Frontend Comprehensive Guide

## 🎯 Overview

CrownSync is a comprehensive data analytics and campaign management platform built with modern frontend technologies. This guide covers the complete frontend architecture, components, features, and development workflows.

## 🏗️ Architecture Overview

### **Technology Stack**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **UI Library**: Shadcn/UI + Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks with custom data fetching
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod validation
- **Real-time**: Supabase real-time subscriptions

### **Design Principles**
- **Component-First**: Modular, reusable components
- **Type Safety**: Full TypeScript coverage
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized loading and rendering
- **Accessibility**: WCAG compliant components
- **Real-time**: Live data updates

## 📁 Project Structure

```
app/                                    # Next.js App Router
├── (dashboard)/                       # Dashboard layout group
│   ├── dashboard/                     # Main dashboard pages
│   │   ├── analytics/                 # Analytics & reporting
│   │   │   ├── brand-assets/          # Brand asset analytics
│   │   │   ├── campaign/              # Campaign analytics
│   │   │   └── page.tsx               # Main analytics dashboard
│   │   ├── brand-performance/         # Brand performance dashboard
│   │   │   ├── campaigns/             # Campaign management
│   │   │   ├── retailer-performance/  # Retailer analytics
│   │   │   ├── market/                # Market intelligence
│   │   │   ├── brand-assets/          # Asset performance
│   │   │   ├── content/               # Content analytics
│   │   │   └── social-analytics/      # Social media analytics
│   │   ├── chat/                      # AI Assistant
│   │   ├── crm/                       # Customer management
│   │   ├── inbox/                     # Email management
│   │   ├── auth/                      # Authentication
│   │   ├── calendar/                  # Calendar management
│   │   ├── database/                  # Database management
│   │   ├── documents/                 # Document management
│   │   ├── messages/                  # Messaging system
│   │   ├── projects/                  # Project management
│   │   ├── security/                  # Security settings
│   │   ├── settings/                  # User settings
│   │   ├── users/                     # User management
│   │   ├── help/                      # Help & support
│   │   ├── errors/                    # Error pages
│   │   └── page.tsx                   # Main dashboard
│   └── layout.tsx                     # Dashboard layout
├── api/                               # API routes
│   ├── campaigns/                     # Campaign analytics APIs
│   ├── chat/                          # AI chat endpoints
│   ├── crm/                           # CRM APIs
│   ├── inbox/                         # Email APIs
│   ├── retailer-performance/          # Performance APIs
│   └── social-analytics/              # Social media APIs
├── globals.css                        # Global styles
├── layout.tsx                         # Root layout
├── page.tsx                           # Landing page
├── not-found.tsx                      # 404 page
├── robots.ts                          # SEO robots
└── sitemap.ts                         # SEO sitemap

components/                            # Reusable components
├── brand-performance/                 # Brand performance components
│   ├── RetailerDataTable.tsx          # Dynamic retailer table
│   ├── RetailerPerformanceCard.tsx    # Performance cards
│   ├── CampaignROIRanking.tsx         # ROI comparison
│   ├── ConversionFunnel.tsx           # Conversion analytics
│   ├── RetailerBubbleChart.tsx        # Bubble chart visualization
│   ├── RetailerMetricsCards.tsx       # Metrics overview
│   ├── TimeRangeSelector.tsx          # Date range picker
│   ├── TopRetailersWidget.tsx         # Top performers widget
│   ├── SocialMetricCard.tsx           # Social media metrics
│   ├── EngagementTrendsChart.tsx      # Engagement trends
│   ├── PlatformComparisonChart.tsx    # Platform comparison
│   ├── RetailerSocialRankingTable.tsx # Social rankings
│   ├── TopContentTable.tsx           # Top content analysis
│   ├── SocialAnalyticsExport.tsx     # Export functionality
│   ├── LinkedInAnalytics.tsx         # LinkedIn specific
│   ├── InstagramAnalytics.tsx        # Instagram specific
│   ├── FacebookAnalytics.tsx         # Facebook specific
│   ├── GoogleBusinessAnalytics.tsx   # Google Business specific
│   ├── PlatformFilter.tsx            # Platform filtering
│   └── RegionFilter.tsx              # Region filtering
├── chat/                              # AI Assistant components
│   ├── ChatBot.tsx                    # Main chat interface
│   ├── ChatInput.tsx                  # Message input
│   ├── MessageList.tsx                # Message display
│   ├── MessageRenderer.tsx            # Message formatting
│   ├── DocumentUpload.tsx             # File upload
│   ├── DocumentPreview.tsx            # Document viewer
│   ├── QuickActions.tsx               # Quick action buttons
│   ├── ToolInvocationRenderer.tsx     # Tool result display
│   ├── CodeBlockRenderer.tsx          # Code highlighting
│   └── DataTableRenderer.tsx          # Data table display
├── crm/                               # CRM components
│   ├── CustomerDataTable.tsx          # Customer table
│   ├── CustomerFiltersBar.tsx         # Filter controls
│   ├── CustomerMetricsCards.tsx       # CRM metrics
│   └── CustomerTablePagination.tsx    # Pagination
├── inbox/                             # Email components
│   ├── CRMPanel.tsx                   # CRM integration panel
│   └── EmailThreadSummary.tsx         # Email thread view
├── charts/                            # Chart components
│   ├── campaign-chart.tsx             # Campaign visualizations
│   └── user-analytics.tsx             # User analytics charts
├── dashboard/                         # Dashboard components
│   └── SocialMediaMetricsCard.tsx     # Social media overview
├── shared/                            # Shared components
│   ├── sidebar.tsx                    # Navigation sidebar
│   ├── topbar.tsx                     # Top navigation bar
│   ├── ErrorPage.tsx                  # Error handling
│   └── app-switcher.tsx               # App navigation
├── providers/                         # Context providers
│   └── ChatPersistenceProvider.tsx    # Chat state management
├── debug/                             # Debug components
│   └── SocialAnalyticsDebug.tsx       # Debug utilities
└── ui/                                # Shadcn/UI components
    ├── button.tsx                     # Button component
    ├── card.tsx                       # Card component
    ├── table.tsx                      # Table component
    ├── dialog.tsx                     # Modal dialogs
    ├── form.tsx                       # Form components
    ├── input.tsx                      # Input fields
    ├── select.tsx                     # Select dropdowns
    ├── tabs.tsx                       # Tab navigation
    ├── badge.tsx                      # Status badges
    ├── progress.tsx                   # Progress bars
    ├── skeleton.tsx                   # Loading skeletons
    ├── toast.tsx                      # Notifications
    └── [40+ more components]          # Complete UI library

hooks/                                 # Custom React hooks
├── use-dashboard-data.ts              # Dashboard data fetching
├── use-mobile.tsx                     # Mobile detection
└── useChatPersistence.ts              # Chat state persistence

lib/                                   # Utility functions & services
├── services/                          # Service layer
│   ├── databaseRAGService.ts          # Database query service
│   ├── documentRAGService.ts          # Document processing
│   ├── simplifiedCampaignAnalytics.ts # Campaign analytics
│   ├── ayrshareService.ts             # Social media API
│   ├── socialDataSyncService.ts       # Social data sync
│   ├── socialMetricsService.ts        # Social metrics
│   ├── campaignAnalytics.ts           # Campaign data
│   ├── crmService.ts                  # CRM operations
│   └── dummyDataService.ts            # Test data
├── hooks/                             # Additional hooks
│   ├── useChatPersistence.ts          # Chat persistence hook
│   └── useSocialAnalyticsRealtime.ts  # Real-time social data
├── types/                             # TypeScript definitions
│   ├── database.ts                    # Database schema types
│   ├── chat.ts                        # Chat interface types
│   ├── crm.ts                         # CRM types
│   ├── email.ts                       # Email types
│   └── social-media.ts                # Social media types
├── utils/                             # Utility functions
│   └── chatCleanup.ts                 # Chat utilities
├── supabase.ts                        # Supabase client
├── analytics-data.ts                  # Analytics data layer
├── database.ts                        # Database utilities
└── utils.ts                           # General utilities
```

## 🎨 Design System

### **Color Palette**
- **Primary**: Blue-based brand colors
- **Secondary**: Complementary accent colors
- **Neutral**: Gray scale for text and backgrounds
- **Status**: Success (green), warning (yellow), error (red)
- **Performance Tiers**: Top (gold), Good (silver), Average (bronze)

### **Typography**
- **Headings**: Inter font family, multiple weights
- **Body**: System font stack for optimal performance
- **Code**: Monospace for technical content

### **Spacing & Layout**
- **Grid System**: CSS Grid and Flexbox
- **Breakpoints**: Mobile-first responsive design
- **Spacing Scale**: Consistent 4px base unit

### **Component Variants**
- **Sizes**: xs, sm, md, lg, xl
- **States**: default, hover, active, disabled, loading
- **Themes**: Light and dark mode support

## 🧩 Core Features & Components

### **1. Dashboard Overview**
**Location**: `app/(dashboard)/dashboard/page.tsx`

**Features**:
- Real-time metrics cards (budget, users, campaigns)
- Interactive charts and visualizations
- Recent activity feeds
- Campaign status overview
- User analytics summary
- Social media metrics integration

**Key Components**:
- `CampaignChart` - Campaign performance visualization
- `UserAnalytics` - User engagement metrics
- `SocialMediaMetricsCard` - Social media overview
- Metric cards with trend indicators
- Data tables with sorting and filtering

### **2. AI Assistant (Chat)**
**Location**: `app/(dashboard)/dashboard/chat/page.tsx`

**Features**:
- Natural language database queries
- Document upload and analysis
- Real-time streaming responses
- Chat history persistence
- Quick action buttons
- Tool invocation results

**Key Components**:
- `ChatBot` - Main chat interface
- `MessageList` - Message display with formatting
- `DocumentUpload` - File upload with preview
- `QuickActions` - Predefined query buttons
- `ToolInvocationRenderer` - Database result display
- `CodeBlockRenderer` - Code syntax highlighting
- `DataTableRenderer` - Structured data display

**Technical Implementation**:
```typescript
// Chat message flow
User Input → ChatInput → API Route → OpenAI → Streaming Response → MessageRenderer
```

### **3. Brand Performance Dashboard**
**Location**: `app/(dashboard)/dashboard/brand-performance/`

**Features**:
- Retailer performance rankings
- Campaign ROI analysis
- Regional market intelligence
- Performance tier classification
- Export capabilities
- Real-time data updates
- Social media analytics integration

**Key Components**:
- `RetailerDataTable` - Dynamic data table with 15+ retailers
- `CampaignROIRanking` - Multi-campaign comparison
- `ConversionFunnel` - Sales funnel analysis
- `RetailerBubbleChart` - Performance visualization
- `TimeRangeSelector` - Date filtering
- `RetailerMetricsCards` - Performance overview

**Data Flow**:
```typescript
// Performance data pipeline
Database → API Route → React Hook → Component State → UI Update
```

### **4. Social Media Analytics**
**Location**: `app/(dashboard)/dashboard/brand-performance/social-analytics/`

**Features**:
- Multi-platform social media performance (LinkedIn, Instagram, Facebook, Google Business)
- Real-time engagement metrics
- Platform comparison and analysis
- Retailer social media rankings
- Content performance analysis
- Export functionality

**Key Components**:
- `SocialMetricCard` - Overview metric cards with trend indicators
- `EngagementTrendsChart` - Time-series engagement analysis
- `PlatformComparisonChart` - Radar chart for platform comparison
- `RetailerSocialRankingTable` - Sortable retailer performance table
- `TopContentTable` - Best performing content analysis
- `LinkedInAnalytics` - LinkedIn-specific metrics
- `InstagramAnalytics` - Instagram stories, reels, shopping
- `FacebookAnalytics` - Facebook page insights
- `GoogleBusinessAnalytics` - Local business metrics
- `SocialAnalyticsExport` - Multi-format export

### **5. CRM System**
**Location**: `app/(dashboard)/dashboard/crm/`

**Features**:
- Customer management (Shopify-based structure)
- Customer segmentation (new, returning, VIP, at-risk)
- Order history tracking
- Customer behavior analytics
- Search and filtering

**Key Components**:
- `CustomerDataTable` - Customer list with pagination
- `CustomerFiltersBar` - Advanced filtering
- `CustomerMetricsCards` - CRM overview metrics
- `CustomerTablePagination` - Table pagination

### **6. Unified Inbox**
**Location**: `app/(dashboard)/dashboard/inbox/`

**Features**:
- Email thread management
- Compose and reply functionality
- CRM integration panel (Intercom-style)
- Read/unread status tracking
- Customer context in emails

**Key Components**:
- `CRMPanel` - Right-side customer information
- `EmailThreadSummary` - Conversation view

### **7. Analytics Dashboard**
**Location**: `app/(dashboard)/dashboard/analytics/`

**Features**:
- Comprehensive analytics overview
- Brand asset performance
- Campaign analytics
- User engagement metrics
- Export and filtering capabilities

**Key Components**:
- Various chart components for data visualization
- Performance tables and metrics cards
- Filter and search functionality

## 🔄 State Management

### **Global State**
- **Chat Persistence**: `ChatPersistenceProvider` manages chat history
- **Theme**: `ThemeProvider` handles light/dark mode
- **Authentication**: Supabase Auth context

### **Local State Patterns**
```typescript
// Custom hooks for data fetching
const { data, loading, error } = useDashboardData()

// Component state for UI interactions
const [searchTerm, setSearchTerm] = useState('')
const [sortField, setSortField] = useState('rank')
const [filters, setFilters] = useState({})
```

### **Real-time Updates**
```typescript
// Supabase real-time subscriptions
useEffect(() => {
  const subscription = supabase
    .channel('retailer_performance')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'campaigns' },
      handleDataUpdate
    )
    .subscribe()
  
  return () => subscription.unsubscribe()
}, [])
```

## 🎯 Data Flow Architecture

### **API Layer**
```typescript
// API route structure
app/api/
├── campaigns/[id]/analytics/    # Retailer performance data
├── chat/                        # AI assistant endpoints
├── crm/customers/              # Customer management
├── inbox/emails/               # Email operations
├── retailer-performance/       # Performance metrics
└── social-analytics/           # Social media analytics
    ├── route.ts                # Main analytics endpoint
    ├── accounts/route.ts       # Account management
    ├── performance/route.ts    # Performance rankings
    ├── content/route.ts        # Content analysis
    ├── trends/route.ts         # Engagement trends
    └── export/route.ts         # Data export
```

### **Service Layer**
```typescript
// Service abstractions
lib/services/
├── databaseRAGService.ts       # Database query abstraction
├── documentRAGService.ts       # Document processing
├── simplifiedCampaignAnalytics.ts # Campaign data processing
├── ayrshareService.ts          # Social media API integration
├── socialDataSyncService.ts    # Social data synchronization
├── socialMetricsService.ts     # Social metrics calculation
├── campaignAnalytics.ts        # Campaign analytics
├── crmService.ts               # CRM operations
└── dummyDataService.ts         # Test data generation
```

### **Data Fetching Patterns**
```typescript
// Server-side data fetching (API routes)
export async function GET(request: Request) {
  const data = await databaseService.query(sql)
  return Response.json(data)
}

// Client-side data fetching (hooks)
const fetchData = async () => {
  const response = await fetch('/api/campaigns/analytics')
  const data = await response.json()
  setData(data)
}
```

## 🎨 UI/UX Patterns

### **Loading States**
```typescript
// Skeleton loading for better UX
{loading ? (
  <Skeleton className="h-8 w-24" />
) : (
  <div className="text-2xl font-bold">{data.value}</div>
)}
```

### **Error Handling**
```typescript
// Graceful error boundaries
if (error) {
  return (
    <ErrorPage 
      title="Failed to load data"
      message={error.message}
      action={<Button onClick={retry}>Try Again</Button>}
    />
  )
}
```

### **Responsive Design**
```typescript
// Mobile-first responsive classes
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  <Card className="col-span-full md:col-span-1">
    {/* Content */}
  </Card>
</div>
```

### **Interactive Elements**
```typescript
// Sortable table headers
<TableHead 
  className="cursor-pointer hover:bg-muted"
  onClick={() => handleSort('retailer_name')}
>
  Retailer Name
  <ArrowUpDown className="ml-2 h-4 w-4" />
</TableHead>
```

## 🔧 Development Workflow

### **Component Development**
1. **Create Component**: Use TypeScript with proper interfaces
2. **Add Styling**: Tailwind CSS with consistent patterns
3. **Handle State**: Local state or custom hooks
4. **Add Interactions**: Event handlers and user feedback
5. **Test Responsiveness**: Mobile and desktop layouts
6. **Document Props**: TypeScript interfaces and JSDoc

### **Code Quality Standards**
```typescript
// Component interface example
interface RetailerDataTableProps {
  campaignId: string
  startDate?: Date
  endDate?: Date
  onDataChange?: (data: RetailerData[]) => void
}

// Component with proper error handling
export default function RetailerDataTable({ 
  campaignId, 
  startDate, 
  endDate 
}: RetailerDataTableProps) {
  const [data, setData] = useState<RetailerData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Implementation...
}
```

### **Performance Optimization**
- **Code Splitting**: Automatic with Next.js App Router
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: React.lazy for heavy components
- **Memoization**: React.memo for expensive renders
- **Virtual Scrolling**: For large data tables

## 🚀 Key Features Implementation

### **Real-time Data Updates**
```typescript
// Live retailer performance updates
useEffect(() => {
  const interval = setInterval(fetchRetailerData, 30000) // 30s refresh
  return () => clearInterval(interval)
}, [campaignId])
```

### **Advanced Filtering & Search**
```typescript
// Multi-criteria filtering
const filteredData = useMemo(() => {
  return data.filter(retailer => {
    const matchesSearch = retailer.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRegion = regionFilter === 'all' || retailer.region === regionFilter
    const matchesGrade = gradeFilter === 'all' || retailer.grade === gradeFilter
    return matchesSearch && matchesRegion && matchesGrade
  })
}, [data, searchTerm, regionFilter, gradeFilter])
```

### **Data Export Functionality**
```typescript
// CSV export with proper formatting
const exportToCSV = () => {
  const csvData = filteredData.map(row => ({
    'Retailer Name': row.retailer_name,
    'Region': row.region,
    'Emails Sent': row.emails_sent,
    'Click Rate': `${row.click_rate}%`,
    'ROI': `${row.roi}%`
  }))
  
  downloadCSV(csvData, `retailer-performance-${campaignId}.csv`)
}
```

## 📱 Mobile Responsiveness

### **Responsive Patterns**
- **Navigation**: Collapsible sidebar on mobile
- **Tables**: Horizontal scroll with sticky columns
- **Cards**: Stack vertically on small screens
- **Charts**: Responsive sizing with touch interactions

### **Mobile-Specific Features**
- **Touch Gestures**: Swipe navigation
- **Optimized Inputs**: Large touch targets
- **Progressive Enhancement**: Core functionality first

## 🔐 Security & Performance

### **Security Measures**
- **Type Safety**: Full TypeScript coverage
- **Input Validation**: Zod schemas for forms
- **XSS Prevention**: Proper content sanitization
- **CSRF Protection**: Built-in Next.js protection

### **Performance Metrics**
- **Core Web Vitals**: Optimized for Google metrics
- **Bundle Size**: Code splitting and tree shaking
- **Loading Performance**: Skeleton states and lazy loading
- **Runtime Performance**: Optimized re-renders

## 🧪 Testing Strategy

### **Component Testing**
```typescript
// Jest + React Testing Library
import { render, screen } from '@testing-library/react'
import RetailerDataTable from './RetailerDataTable'

test('renders retailer data correctly', () => {
  render(<RetailerDataTable campaignId="test-id" />)
  expect(screen.getByText('Retailer Performance')).toBeInTheDocument()
})
```

### **Integration Testing**
- **API Integration**: Test API route responses
- **User Flows**: End-to-end user interactions
- **Data Flow**: Component state management

## 🚀 Future Enhancements

### **Planned Features**
- **Advanced Analytics**: Machine learning insights
- **Real-time Collaboration**: Multi-user editing
- **Mobile App**: React Native companion
- **Offline Support**: Progressive Web App features
- **Advanced Visualizations**: D3.js integration

### **Technical Improvements**
- **Micro-frontends**: Module federation
- **Edge Computing**: Vercel Edge Functions
- **Advanced Caching**: Redis integration
- **WebSocket Integration**: Real-time updates

## 📚 Development Resources

### **Documentation**
- **Component Library**: Storybook documentation
- **API Reference**: OpenAPI specifications
- **Design System**: Figma design tokens
- **Development Guide**: Setup and contribution guidelines

### **Tools & Extensions**
- **VS Code Extensions**: TypeScript, Tailwind CSS, ESLint
- **Browser DevTools**: React Developer Tools
- **Performance Monitoring**: Web Vitals extension
- **Accessibility Testing**: axe DevTools

This frontend architecture provides a solid foundation for building scalable, maintainable, and user-friendly data analytics applications with modern web technologies.