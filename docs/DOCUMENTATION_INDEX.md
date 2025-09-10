# 📚 CrownSync Documentation Index

## 🎯 Quick Navigation

This index provides a comprehensive overview of all documentation in the CrownSync platform after cleanup and consolidation.

## 📖 Core Documentation

### **Main Documentation**
- **[README.md](../README.md)** - Project overview, setup instructions, and getting started guide
- **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Comprehensive project architecture and business logic
- **[COMPREHENSIVE_SETUP_GUIDE.md](./COMPREHENSIVE_SETUP_GUIDE.md)** - Complete setup and deployment guide

### **Frontend Documentation**
- **[FRONTEND_ARCHITECTURE_GUIDE.md](./FRONTEND_ARCHITECTURE_GUIDE.md)** - Complete frontend architecture, components, and development guide

### **Database Documentation**
- **[Database Documentation](./DATABASE_DOCUMENTATION.md)** - Core database schema and architecture
- **[Campaign Performance Data](./CAMPAIGN_PERFORMANCE_DATA_DOCUMENTATION.md)** - Campaign analytics database schema
- **[Retailer Performance Data](./RETAILER_PERFORMANCE_DATA_DOCUMENTATION.md)** - Retailer analytics database schema
- **[Social Media Analytics](./SOCIAL_MEDIA_ANALYTICS_DOCUMENTATION.md)** - Social media analytics integration and schema
- **[Database Schema Diagram](./supabase-schema-wdywpqnfxhczdvqnvaaz.svg)** - Visual database schema

### **Setup Guides**
- **[Social Media Analytics Setup](./SOCIAL_MEDIA_ANALYTICS_SETUP.md)** - Complete database and dummy data setup
- **[Ayrshare Setup Guide](./AYRSHARE_SETUP_GUIDE.md)** - API configuration and integration guide

## 🏗️ Architecture Overview

### **Frontend Stack**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI**: Shadcn/UI + Radix UI + Tailwind CSS
- **Charts**: Recharts
- **State**: React hooks + custom data fetching

### **Backend Stack**
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase subscriptions
- **API**: Next.js API routes

### **Key Features**
- **AI Assistant**: Natural language database queries with document upload
- **Brand Performance**: Campaign analytics and retailer performance tracking
- **Social Media Analytics**: Multi-platform social media performance insights and analytics
- **CRM System**: Customer management with Shopify-based structure
- **Unified Inbox**: Email management with CRM integration
- **Real-time Dashboard**: Live metrics and data visualization

## 📁 Project Structure

```
CrownSync/
├── 📖 Documentation/
│   ├── README.md                           # Main project documentation (root)
│   └── docs/                               # Complete documentation suite
│       ├── DOCUMENTATION_INDEX.md         # This navigation guide
│       ├── PROJECT_OVERVIEW.md            # Architecture overview
│       ├── FRONTEND_ARCHITECTURE_GUIDE.md # Frontend documentation
│       ├── COMPREHENSIVE_SETUP_GUIDE.md   # Setup instructions
│       ├── DATABASE_DOCUMENTATION.md      # Database schema
│       ├── CAMPAIGN_PERFORMANCE_DATA_DOCUMENTATION.md
│       ├── RETAILER_PERFORMANCE_DATA_DOCUMENTATION.md
│       ├── SOCIAL_MEDIA_ANALYTICS_DOCUMENTATION.md
│       └── supabase-schema-wdywpqnfxhczdvqnvaaz.svg
├── 🎨 Frontend/
│   ├── app/                                # Next.js App Router
│   ├── components/                         # React components
│   ├── hooks/                              # Custom hooks
│   └── lib/                                # Utilities & services
├── 🗄️ Database/
│   └── supabase/                           # Database migrations & setup
├── 🧪 Testing/
│   └── __tests__/                          # Test files
└── 🔧 Configuration/
    ├── package.json                        # Dependencies & scripts
    ├── tailwind.config.ts                  # Styling configuration
    ├── tsconfig.json                       # TypeScript configuration
    └── next.config.mjs                     # Next.js configuration
```

## 🚀 Getting Started

### **For Developers**
1. Read [README.md](../README.md) for project overview
2. Follow [COMPREHENSIVE_SETUP_GUIDE.md](./COMPREHENSIVE_SETUP_GUIDE.md) for setup
3. Review [FRONTEND_ARCHITECTURE_GUIDE.md](./FRONTEND_ARCHITECTURE_GUIDE.md) for development

### **For Database Work**
1. Start with [Database Documentation](./DATABASE_DOCUMENTATION.md)
2. Review specific schemas:
   - [Campaign Performance](./CAMPAIGN_PERFORMANCE_DATA_DOCUMENTATION.md)
   - [Retailer Performance](./RETAILER_PERFORMANCE_DATA_DOCUMENTATION.md)

### **For UI/UX Work**
1. Review [FRONTEND_ARCHITECTURE_GUIDE.md](./FRONTEND_ARCHITECTURE_GUIDE.md)
2. Explore component structure in `/components`
3. Check design system in Tailwind configuration

## 🧹 Documentation Cleanup Summary

### **Removed Files (58 total)**
- ✅ **47 test/debug scripts** - Development-only files
- ✅ **11 redundant documentation** - Duplicate setup guides and status reports
- ✅ **Consolidated setup guides** - Single comprehensive guide
- ✅ **Removed development artifacts** - Phase docs, status reports, temp files

### **Retained Essential Documentation**
- ✅ **Core project documentation** - README, PROJECT_OVERVIEW
- ✅ **Frontend architecture guide** - Complete frontend documentation
- ✅ **Database documentation** - Schema and structure guides
- ✅ **Setup instructions** - Single comprehensive setup guide

## 📋 Development Workflow

### **Code Quality**
```bash
npm run check-all      # Run all quality checks
npm run lint:fix       # Fix linting issues
npm run format         # Format code
npm run type-check     # TypeScript validation
```

### **Testing**
```bash
npm run test           # Run all tests
npm run test:coverage  # Coverage report
npm run test:dynamic-data  # Data validation
```

### **Database**
```bash
npm run db:migrate     # Run migrations
npm run db:seed        # Seed test data
npm run verify:production  # Verify setup
```

## 🎯 Key Features Documentation

### **AI Assistant**
- **Location**: `/app/(dashboard)/dashboard/chat`
- **Components**: ChatBot, DocumentUpload, MessageRenderer
- **Features**: Natural language queries, document analysis, streaming responses

### **Brand Performance**
- **Location**: `/app/(dashboard)/dashboard/brand-performance`
- **Components**: RetailerDataTable, CampaignROIRanking, ConversionFunnel
- **Features**: Performance tracking, ROI analysis, regional insights

### **Social Media Analytics**
- **Location**: `/app/(dashboard)/dashboard/brand-performance/social-analytics`
- **Components**: SocialMetricCard, EngagementTrendsChart, PlatformComparisonChart
- **Features**: Multi-platform analytics, real-time updates, export functionality

### **CRM System**
- **Location**: `/app/(dashboard)/dashboard/crm`
- **Components**: CustomerDataTable, CustomerFiltersBar, CustomerMetricsCards
- **Features**: Customer management, segmentation, behavior tracking

### **Unified Inbox**
- **Location**: `/app/(dashboard)/dashboard/inbox`
- **Components**: CRMPanel, EmailThreadSummary
- **Features**: Email management, CRM integration, thread support

## 🔗 Quick Links

- **[Live Demo](http://localhost:3000)** - Local development server
- **[Component Library](../components)** - Reusable UI components
- **[API Documentation](../app/api)** - Backend API endpoints
- **[Database Schema](./supabase-schema-wdywpqnfxhczdvqnvaaz.svg)** - Visual schema diagram

## 📞 Support & Resources

### **Development Resources**
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Utility-first styling with design system
- **Shadcn/UI**: High-quality component library
- **Supabase**: Backend-as-a-service with real-time features

### **Best Practices**
- **Component-first development** - Modular, reusable components
- **Type safety** - Full TypeScript coverage
- **Responsive design** - Mobile-first approach
- **Performance optimization** - Code splitting and lazy loading
- **Accessibility** - WCAG compliant components

This documentation structure provides a clear, organized approach to understanding and developing the CrownSync platform.