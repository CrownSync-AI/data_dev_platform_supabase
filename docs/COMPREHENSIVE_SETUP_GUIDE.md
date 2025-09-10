# 📊 Data Development Platform - Comprehensive Setup Guide

This comprehensive guide covers everything you need to set up, develop, and deploy the Data Development Platform with Supabase database integration.

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Database Architecture](#-database-architecture)
3. [Environment Setup](#-environment-setup)
4. [Database Deployment](#-database-deployment)
5. [Development Workflow](#-development-workflow)
6. [Production Deployment](#-production-deployment)
7. [Code Style Guide](#-code-style-guide)
8. [Performance Guidelines](#-performance-guidelines)
9. [Troubleshooting](#-troubleshooting)
10. [Resources](#-resources)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: 20.x)
- npm 9+
- Git
- Supabase account

### Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd data_dev_platform
   npm install
   ```

2. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Sign up or log in
   - Click **"New Project"**
   - Choose organization, project name: `data-dev-platform`
   - Create a strong database password (⚠️ **SAVE THIS!**)
   - Select closest region
   - Wait 2-3 minutes for provisioning

3. **Get API Credentials**
   - Navigate to **Settings > API** in Supabase dashboard
   - Copy: Project URL, anon public key, service_role secret key

4. **Environment Configuration**
   ```bash
   # Create .env.local with your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

5. **Database Setup**
   - Go to **SQL Editor** in Supabase dashboard
   - Run the complete setup script from `supabase/complete_production_setup.sql`
   - Verify tables are created in **Table Editor**

6. **Start Development**
   ```bash
   npm run dev
   ```
   - Open: `http://localhost:3000/dashboard/analytics`

## 🏗️ Database Architecture

### Overview

The database implements a comprehensive data platform supporting:

- **User Management**: Multi-tenant system with admin, brand, and retailer user types
- **Asset Management**: Secure file storage with detailed action tracking
- **Campaign Management**: Marketing campaign orchestration across multiple channels
- **Analytics & Reporting**: Real-time analytics with calculated metrics
- **Audit & Security**: Complete audit trails and Row Level Security (RLS)

### Core Tables

#### User & Authentication
- **users** - User management with role-based access
- **sessions** - User session tracking

#### Asset Management
- **brand_assets** - Downloadable marketing materials
- **daily_asset_downloads** - Download tracking and analytics
- **retailer_asset_activity** - User engagement with assets

#### Campaign & Templates
- **campaign_templates** - Marketing campaign templates
- **template_retailer_usage** - Template usage tracking

#### Product Catalog
- **watch_models** - Product catalog with specifications
- **wish_list_items** - Customer wishlist data
- **regional_wish_lists** - Geographic preference data

#### Analytics
- **daily_analytics** - Time-series analytics data
- **audit_logs** - Complete system audit trail

### Analytics Views

Pre-built views for dashboard consumption:
- **top_downloaded_assets** - Most popular downloads
- **top_active_retailers_assets** - Most engaged retailers
- **top_wish_list_items** - Most wanted products
- **top_campaign_templates** - Best performing campaigns

### Data Model Relationships

```
users (1) -----> (*) brand_assets
users (1) -----> (*) retailer_asset_activity
users (1) -----> (*) template_retailer_usage
users (1) -----> (*) wish_list_items

brand_assets (1) -----> (*) daily_asset_downloads
brand_assets (1) -----> (*) retailer_asset_activity

campaign_templates (1) -----> (*) template_retailer_usage
watch_models (1) -----> (*) wish_list_items
```

## 🔧 Environment Setup

### Environment Variables

**Development (.env.local):**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Production (.env.production):**
```env
# Production Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

### Project Structure

```
├── app/                     # Next.js App Router
│   ├── (dashboard)/        # Route groups
│   │   ├── dashboard/      # Dashboard pages
│   │   └── layout.tsx      # Dashboard layout
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # React components
│   ├── ui/                # Base UI components (Shadcn/UI)
│   ├── charts/            # Chart components
│   └── shared/            # Shared components
├── lib/                   # Utilities and configurations
│   ├── analytics-data.ts  # Data fetching functions
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # General utilities
├── hooks/                 # Custom React hooks
├── __tests__/            # Test files
├── supabase/             # Database migrations
└── public/               # Static assets
```

## 🗄️ Database Deployment

### Option 1: Supabase CLI (Recommended)

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Link to Remote Project**
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. **Deploy Schema**
   ```bash
   # Deploy all migrations
   supabase db push
   
   # Or dry run first
   supabase db push --dry-run
   ```

4. **Useful CLI Commands**
   ```bash
   supabase status              # Check project status
   supabase db reset           # Reset local database
   supabase gen types typescript --local > lib/types/supabase.ts
   supabase migration new name # Create new migration
   ```

### Option 2: Manual SQL Execution

1. **Complete Fresh Setup**
   - Go to **SQL Editor** in Supabase dashboard
   - Copy content from `supabase/complete_production_setup.sql`
   - Execute the script (takes 1-2 minutes)

2. **Incremental Setup** (for existing databases)
   - Run specific sections from the setup script:
     - Analytics tables creation
     - Views and indexes
     - Sample data insertion
     - RLS policies

### Post-Deployment Verification

1. **Check Tables**
   - Verify all tables exist in **Table Editor**
   - Confirm sample data is present

2. **Test Views**
   ```sql
   SELECT * FROM top_downloaded_assets LIMIT 5;
   SELECT * FROM top_active_retailers_assets LIMIT 5;
   SELECT * FROM top_wish_list_items LIMIT 5;
   ```

3. **Test Application**
   - Start dev server: `npm run dev`
   - Visit: `http://localhost:3000/dashboard/analytics`
   - Verify all charts load with data

## 🛠️ Development Workflow

### Branch Strategy

```
main          # Production branch
├── develop   # Development branch
├── feature/* # Feature branches
├── bugfix/*  # Bug fix branches
└── hotfix/*  # Hotfix branches
```

### Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new analytics chart
fix: resolve data loading issue
docs: update setup guide
style: format code with prettier
refactor: optimize data fetching
test: add unit tests for analytics
chore: update dependencies
```

### Development Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/analytics-enhancement
   ```

2. **Development**
   - Write code following project conventions
   - Add tests for new functionality
   - Update documentation as needed

3. **Quality Checks**
   ```bash
   npm run test              # Run tests
   npm run type-check        # TypeScript check
   npm run lint             # ESLint
   npm run format           # Prettier
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add new analytics chart"
   git push origin feature/analytics-enhancement
   ```

### Testing Strategy

#### Test Types
1. **Unit Tests** - Component and function testing
2. **Integration Tests** - API and database testing
3. **E2E Tests** - User workflow testing (future)

#### Test Commands
```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # Coverage report
```

## 🚀 Production Deployment

### Database Backup (Recommended)

Before deploying to production:
1. Go to **Settings > Database** in Supabase
2. Click **"Download backup"**

### Deployment Steps

1. **Update Environment Variables**
   - Set production Supabase credentials
   - Update `.env.production` or hosting platform variables

2. **Deploy Database Schema**
   - Use complete setup script for fresh deployment
   - Use incremental scripts for existing databases

3. **Platform-Specific Deployment**

   **For Vercel:**
   ```bash
   # Set environment variables in Vercel dashboard
   # Then deploy
   git push origin main
   ```

   **For other platforms:**
   - Configure environment variables in platform settings
   - Follow platform-specific deployment process

4. **Verify Production**
   - Visit production URL
   - Navigate to `/dashboard/analytics`
   - Confirm all sections display data
   - Check browser console for errors

### What's Included in Production

**Tables:**
- Brand assets with download tracking
- Watch models catalog
- Retailer activity and engagement
- Campaign templates and usage
- Wishlist and regional data

**Sample Data:**
- 5 brand assets (videos, PDFs, images)
- 5 watch models (Submariner, GMT-Master II, etc.)
- 5 retailer users
- 100+ activity records
- 50+ wishlist entries

## 🎨 Code Style Guide

### TypeScript Guidelines

```typescript
// ✅ Good - Strict typing
interface AnalyticsData {
  downloads: number
  date: string
  growth?: number
}

// ✅ Good - Function return types
async function fetchData(): Promise<AnalyticsData[]> {
  // implementation
}

// ❌ Avoid - Any types
const data: any = { ... }
```

### React Guidelines

```typescript
// ✅ Good - Component structure
interface Props {
  title: string
  data: AnalyticsData[]
  onUpdate?: () => void
}

export function AnalyticsChart({ title, data, onUpdate }: Props) {
  // implementation
}

// ✅ Good - Custom hooks
function useAnalyticsData() {
  const [data, setData] = useState<AnalyticsData[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchAnalyticsData().then(setData).finally(() => setLoading(false))
  }, [])
  
  return { data, loading }
}
```

### CSS/Styling Guidelines

```typescript
// ✅ Good - Concise Tailwind classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">

// ✅ Good - Component variants with CVA
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
    },
  }
)
```

## 📊 Performance Guidelines

### Next.js Optimization

```typescript
// ✅ Image optimization
import Image from 'next/image'

<Image
  src="/chart-icon.png"
  alt="Chart"
  width={24}
  height={24}
  priority={false}
/>

// ✅ Dynamic imports
const Chart = dynamic(() => import('@/components/chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false
})

// ✅ Server components
async function AnalyticsPage() {
  const data = await fetchAnalyticsData()
  return <AnalyticsChart data={data} />
}
```

### Database Optimization

```typescript
// ✅ Efficient queries
const { data } = await supabase
  .from('downloads')
  .select('date, count')
  .gte('date', startDate)
  .order('date')
  .limit(30)

// ✅ Caching strategy
export const revalidate = 300 // 5 minutes

async function getAnalyticsData() {
  return unstable_cache(
    async () => fetchAnalyticsData(),
    ['analytics-data'],
    { revalidate: 300 }
  )()
}
```

### Security Features

- **Row Level Security (RLS)**: All tables protected with user-based policies
- **Audit Logging**: Automatic trail for all data changes
- **Data Encryption**: Sensitive tokens encrypted at rest
- **API Key Management**: Separate anon and service role keys

## 🚨 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear cache and rebuild
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Database Connection:**
- Verify environment variables are correct
- Check Supabase project status
- Ensure RLS policies allow access
- Confirm service role key for server operations

**No Data in Charts:**
- Verify SQL script ran successfully
- Check tables contain sample data in Table Editor
- Confirm views are created and accessible

**Type Errors:**
```bash
npm run type-check
supabase gen types typescript --local > lib/types/supabase.ts
```

**Test Failures:**
```bash
npx jest --clearCache
npm test -- --testNamePattern="AnalyticsCard"
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run dev

# Next.js debug
NEXT_DEBUG=1 npm run dev
```

### Performance Monitoring

```sql
-- Check database health
SELECT 
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes
FROM pg_stat_user_tables
ORDER BY n_tup_ins + n_tup_upd + n_tup_del DESC;

-- Check slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## 📚 Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tools & Extensions

**VS Code Extensions:**
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- Auto Rename Tag

**VS Code Settings:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Getting Help

- **Issues**: Create GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Code Review**: Request reviews on pull requests
- **Documentation**: Update docs when adding features

## 🎉 Next Steps

1. **Customize Sample Data**: Replace with your actual business data
2. **Add More Data**: Use Supabase dashboard to expand datasets
3. **Monitor Performance**: Use Supabase's built-in monitoring
4. **Set Up Backups**: Configure automatic backups
5. **Add Authentication**: Implement user authentication
6. **Extend Analytics**: Add more charts and metrics
7. **Optimize Performance**: Implement caching strategies

---

**Happy coding! 🚀**

*This guide combines and replaces the previous separate documentation files. For the most up-to-date information, always refer to this comprehensive guide.*