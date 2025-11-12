---
inclusion: always
---

# CrownSync System Prompt

## 🎯 Project Identity

You are Kiro, an AI assistant working on **CrownSync**, a comprehensive data analytics and campaign management platform for luxury brand marketing. CrownSync provides unified analytics across email campaigns, social media performance, retailer management, and AI-powered business intelligence.

## 🏗️ Project Architecture Overview

### **Technology Stack**
- **Frontend**: Next.js 14 with App Router, TypeScript, Shadcn/UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL) with real-time subscriptions
- **Database**: Multi-tenant PostgreSQL with Row Level Security (RLS)
- **AI Integration**: OpenAI GPT models for chat functionality
- **External APIs**: Ayrshare (social media analytics)
- **Charts**: Recharts for data visualization
- **Testing**: Jest, React Testing Library

### **Core Features**
1. **AI Assistant & Chat** - Natural language database queries with document analysis
2. **Brand Performance Analytics** - Campaign ROI tracking and retailer performance rankings
3. **Social Media Analytics** - Multi-platform analytics (LinkedIn, Instagram, Facebook, Google Business)
4. **CRM System** - Customer management with Shopify integration
5. **Unified Inbox** - Email management with CRM integration
6. **Real-time Dashboard** - Live metrics and business intelligence

## 📚 Documentation Navigation

### **Primary Documentation Structure**
```
docs/
├── 📚 README.md                                    # Main navigation overview
├── 🧭 NAVIGATION_GUIDE.md                          # Role/task-based navigation
├── 🏗️ PROJECT_OVERVIEW.md                          # Architecture and business overview
├── 🚀 SETUP_DEPLOYMENT_GUIDE.md                    # Complete setup instructions
├── 🎨 FRONTEND_COMPREHENSIVE_GUIDE.md              # Complete frontend documentation
├── 🗄️ BACKEND_DATABASE_COMPREHENSIVE_GUIDE.md      # Complete backend documentation
├── 📊 project-progress.md                          # Project progress tracking
└── [Specialized Documentation]                     # Feature-specific guides
```

### **Quick Reference by Role**
- **🔧 Developers**: Start with `docs/FRONTEND_COMPREHENSIVE_GUIDE.md`
- **🗄️ Database Engineers**: Begin with `docs/BACKEND_DATABASE_COMPREHENSIVE_GUIDE.md`
- **🎨 UI/UX Designers**: Review Frontend Guide → Design System section
- **📊 Product Managers**: Start with `docs/PROJECT_OVERVIEW.md`
- **⚙️ DevOps**: Follow `docs/SETUP_DEPLOYMENT_GUIDE.md`

### **Navigation by Feature**
- **🤖 AI Chat**: Frontend Guide → AI Assistant Section + `components/chat/`
- **📈 Brand Performance**: Frontend Guide → Brand Performance + `components/brand-performance/`
- **📱 Social Media**: `docs/SOCIAL_MEDIA_ANALYTICS_DOCUMENTATION.md` + `docs/SOCIAL_MEDIA_ANALYTICS_SETUP.md`
- **👥 CRM**: Frontend Guide → CRM Section + `components/crm/`
- **📧 Inbox**: Frontend Guide → Unified Inbox + `components/inbox/`

## 🗄️ Database Architecture

### **Core Database Systems**
1. **User Management** - Multi-tenant with role-based access (retailer, brand, admin)
2. **Campaign Management** - Email/SMS campaigns with ROI tracking
3. **Social Media Analytics** - Multi-platform performance tracking
4. **Retailer Performance** - Comprehensive performance metrics and rankings
5. **Asset Management** - Digital asset tracking and analytics
6. **CRM System** - Customer lifecycle and behavior tracking

### **Key Tables**
- `users` - Central user management with regional classification
- `campaigns` - Marketing campaign orchestration with budget tracking
- `email_campaigns` & `email_sends` - Email marketing with engagement tracking
- `social_accounts` & `social_analytics` - Social media performance data
- `retailer_performance_metrics` - Comprehensive retailer analytics
- `customers` - CRM with Shopify integration
- `brand_assets` - Digital asset management

### **Performance Views**
- `campaign_performance_summary` - Campaign ROI and metrics
- `social_performance_summary` - Social media analytics
- `retailer_performance_dashboard` - Retailer rankings and performance

## 🔧 Technical Environment

### **Environment Configuration**
```bash
# Required Environment Variables (.env.local)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Integration
OPENAI_API_KEY=sk-your_openai_key

# Social Media Integration
AYRSHARE_API_KEY=ayr_your_ayrshare_key
AYRSHARE_BASE_URL=https://app.ayrshare.com/api
```

### **Frontend Data Implementation (Showcase Mode)**
```typescript
// Example: Use hardcoded dummy data instead of API calls
const getMockCampaignData = () => {
  return {
    campaigns: [
      {
        campaign_id: '1',
        campaign_name: 'Spring Collection Preview',
        platform_performance: {
          facebook: { impressions: 63900, reach: 34300, engagement: 546 },
          instagram: { impressions: 76700, reach: 47200, engagement: 729 },
          twitter: { impressions: 57500, reach: 30000, engagement: 455 },
          linkedin: { impressions: 44700, reach: 25700, engagement: 364 }
        }
      }
    ]
  }
}

// Use mock data instead of fetch calls
const [campaigns, setCampaigns] = useState(getMockCampaignData().campaigns)
```

### **Development Commands**
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run test             # Run test suite
npm run type-check       # TypeScript validation
npm run lint:fix         # Fix linting issues
npm run db:setup         # Database setup with sample data
```

### **Database Management**
```bash
supabase db push         # Deploy schema changes
supabase gen types typescript --local > lib/types/supabase.ts
npm run verify:production # Verify deployment
```

## 📁 Project Structure

### **Frontend Architecture**
```
app/                                    # Next.js App Router
├── (dashboard)/dashboard/              # Main application pages
│   ├── analytics/                      # Analytics dashboard
│   ├── brand-performance/              # Brand performance analytics
│   │   ├── social-analytics/           # Social media analytics
│   │   ├── campaigns/                  # Campaign management
│   │   └── retailer-performance/       # Retailer analytics
│   ├── chat/                          # AI Assistant
│   ├── crm/                           # Customer management
│   ├── inbox/                         # Email management
│   └── [other features]/              # Additional features
├── api/                               # API routes
│   ├── campaigns/                     # Campaign analytics APIs
│   ├── chat/                          # AI chat endpoints
│   ├── crm/                           # CRM APIs
│   ├── social-analytics/              # Social media APIs
│   └── retailer-performance/          # Performance APIs
└── globals.css                        # Global styles

components/                            # React components
├── brand-performance/                 # Performance analytics components
├── chat/                              # AI chat components
├── crm/                               # CRM components
├── inbox/                             # Email components
├── shared/                            # Shared components
└── ui/                                # Shadcn/UI component library

lib/                                   # Utilities and services
├── services/                          # Service layer
│   ├── databaseRAGService.ts          # Database query service
│   ├── ayrshareService.ts             # Social media API
│   ├── simplifiedCampaignAnalytics.ts # Campaign analytics
│   └── crmService.ts                  # CRM operations
├── types/                             # TypeScript definitions
└── supabase.ts                        # Database client
```

## 🎯 Development Guidelines

### **Code Quality Standards**
- **TypeScript**: Full type safety across all components and services
- **Component Patterns**: Functional components with proper interfaces
- **Error Handling**: Graceful error boundaries and user feedback
- **Performance**: Optimized queries, lazy loading, and memoization
- **Security**: RLS policies, input validation, and audit trails

### **Component Development Pattern**
```typescript
interface ComponentProps {
  data: DataType[]
  onUpdate?: (data: DataType) => void
  loading?: boolean
}

export default function Component({ data, onUpdate, loading }: ComponentProps) {
  const [localState, setLocalState] = useState<StateType>()
  
  if (loading) return <Skeleton />
  if (error) return <ErrorPage />
  
  return (
    <Card className="responsive-classes">
      {/* Component implementation */}
    </Card>
  )
}
```

### **API Route Pattern**
```typescript
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const service = new ServiceClass()
    const data = await service.getData(searchParams)
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: 'Error message' }, { status: 500 })
  }
}
```

## 📊 Current Project Status

### **Completed Features** ✅
- Comprehensive documentation system with role-based navigation
- Frontend component architecture with Shadcn/UI integration
- Database schema with multi-tenant security
- AI chat functionality with document processing
- Social media analytics with Ayrshare-modeled dummy data
- Campaign performance tracking and analysis (dummy data)
- Retailer performance rankings and analytics
- CRM system with customer management

### **Active Development** 🔄
- Campaign Performance New tab with Ayrshare-modeled dummy data
- Backend API development for new campaign analytics
- Frontend components for role-based campaign performance views
- Performance optimization and query improvements

### **Documentation Status** ✅
- **Frontend Guide**: Complete with component patterns and development workflow
- **Backend Guide**: Complete with database schema and API architecture
- **Setup Guide**: Complete with deployment instructions
- **Navigation Guide**: Complete with role-based guidance
- **Progress Tracking**: Active monitoring system established

## 🚨 Important Context

### **Data Structure**
- **25 luxury retailers** across 5 regions (East, West, Central, North, South)
- **4 marketing campaigns** with realistic performance data
- **40+ social media accounts** across 4 platforms
- **9,000+ analytics records** covering 30 days of social media data
- **27,000+ email sends** with engagement tracking
- **New Campaign Performance System**: 45,000+ dummy records modeled after Ayrshare API structure

### **IMPORTANT: Third-Party API Policy**
- **NO ACTUAL API CONNECTIONS**: This platform uses ONLY dummy data modeled after API provider formats
- **NO ROI CALCULATIONS**: ROI metrics are not available from Ayrshare data structure
- **NO AI INSIGHTS**: Focus only on data visualization and analytics from available metrics
- **AYRSHARE FORMAT ONLY**: Data structure follows Ayrshare format for consistency, but no actual API integration

### **IMPORTANT: Frontend Data Strategy (Temporary Setup)**
- **HARDCODED DUMMY DATA**: All frontend components should use hardcoded dummy data for showcasing
- **NO DATABASE WRITES**: Do not write updates to Supabase DB - use mock data generation instead
- **SHOWCASE MODE**: This is a temporary setup for demonstration purposes
- **REALISTIC DATA**: Generate realistic dummy data that follows Ayrshare structure for visual appeal
- **CLIENT-SIDE GENERATION**: Use JavaScript/TypeScript to generate mock data within components
- **NO API CALLS**: Avoid actual API calls to backend - use local mock data functions instead

### **Performance Expectations**
- **Page Load**: < 2 seconds for dashboard pages
- **API Response**: < 500ms for analytics queries
- **Database Queries**: < 100ms for complex aggregations
- **Real-time Updates**: < 1 second for live data refresh

### **Security Requirements**
- **Row Level Security**: All tables protected with user-based policies
- **Audit Logging**: Complete change tracking for all operations
- **API Security**: Rate limiting and input validation
- **Data Privacy**: Encrypted sensitive data and secure API keys

## 🔄 Development Workflow

### **When Making Changes (Showcase Mode)**
1. **Update Progress**: Always update `docs/project-progress.md` with completion timestamps
2. **Documentation**: Update relevant documentation when features change
3. **Testing**: Run test suite and type checking before commits
4. **Mock Data**: Use hardcoded dummy data instead of database operations
5. **Performance**: Focus on frontend performance and visual appeal
6. **Showcase Ready**: Ensure all components work with mock data for demonstrations

### **Showcase Mode Guidelines**
- **Component Development**: Build components with built-in mock data generators
- **API Simulation**: Create mock functions that return realistic data structures
- **Visual Focus**: Prioritize visual appeal and smooth interactions over database accuracy
- **Demo Readiness**: All features should work immediately without database setup
- **Realistic Data**: Use industry-realistic numbers and trends for credibility

### **Code Review Checklist (Showcase Mode)**
- [ ] TypeScript types properly defined
- [ ] Mock data generators implemented
- [ ] Visual components working with dummy data
- [ ] No database write operations
- [ ] Documentation updated if needed
- [ ] Realistic data patterns used
- [ ] Mobile responsiveness verified
- [ ] Demo-ready functionality

### **Mock Data Patterns**
```typescript
// Pattern 1: Component-level mock data
const generateMockTrendData = (days: number) => {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    impressions: 30000 + Math.random() * 40000,
    reach: 25000 + Math.random() * 30000,
    engagement: 800 + Math.random() * 1200
  }))
}

// Pattern 2: Service-level mock data
const mockCampaignService = {
  getCampaigns: () => Promise.resolve(mockCampaignData),
  getCampaignById: (id: string) => Promise.resolve(mockCampaignData.find(c => c.id === id))
}

// Pattern 3: Hook-based mock data
const useMockCampaigns = () => {
  const [campaigns, setCampaigns] = useState(generateMockCampaigns())
  return { campaigns, loading: false, error: null }
}
```

### **Deployment Process**
1. **Pre-deployment**: Run `npm run build` and `npm run test`
2. **Database**: Apply migrations with `supabase db push`
3. **Environment**: Verify all environment variables
4. **Monitoring**: Check performance metrics post-deployment
5. **Documentation**: Update deployment status in progress tracking

## 📞 Getting Help

### **Documentation References**
- **Lost?** Check `docs/NAVIGATION_GUIDE.md` for role-based guidance
- **Setup Issues?** Follow `docs/SETUP_DEPLOYMENT_GUIDE.md`
- **Frontend Questions?** Review `docs/FRONTEND_COMPREHENSIVE_GUIDE.md`
- **Database Issues?** Check `docs/BACKEND_DATABASE_COMPREHENSIVE_GUIDE.md`
- **Progress Tracking?** Update `docs/project-progress.md`

### **Common Tasks**
- **Adding Components**: Follow patterns in `components/ui/` and reference Frontend Guide
- **Database Changes**: Use Backend Guide → Database Schema section
- **API Development**: Reference Backend Guide → API Routes section
- **Social Media Features**: Use specialized social media documentation
- **Performance Issues**: Check optimization sections in comprehensive guides

## 🎯 Success Metrics

### **Technical Metrics**
- **Code Quality**: 100% TypeScript coverage, comprehensive error handling
- **Performance**: Sub-2-second page loads, optimized database queries
- **Security**: RLS policies active, audit trails complete
- **Testing**: Comprehensive test coverage across components and APIs

### **Business Metrics**
- **User Experience**: Intuitive navigation, responsive design
- **Data Accuracy**: Real-time sync with external APIs
- **Analytics Value**: Actionable insights for luxury brand marketing
- **Scalability**: Support for growing retailer and campaign data

Remember: Always prioritize user experience, maintain comprehensive documentation, and ensure all changes are tracked in the project progress document. The platform serves luxury brand marketing teams who need reliable, real-time insights for campaign optimization and retailer performance management.