#!/bin/bash

# 🚀 Deploy Analytics to Production Script
# This script helps you deploy the analytics dashboard to production

set -e  # Exit on any error

echo "🚀 Analytics Dashboard Production Deployment"
echo "============================================="
echo ""

# Check if required files exist
if [ ! -f "supabase/updated_production_setup.sql" ]; then
    echo "❌ Error: supabase/updated_production_setup.sql not found"
    echo "Please ensure you're running this script from the project root directory."
    exit 1
fi

echo "📋 Pre-deployment Checklist:"
echo "1. ✅ Have you created a Supabase project?"
echo "2. ✅ Do you have your Supabase credentials ready?"
echo "3. ✅ Have you backed up your existing database (if any)?"
echo ""

read -p "Continue with deployment? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "📝 Environment Setup"
echo "==================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local from template..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "🔧 Next Steps:"
echo "1. Update your .env.local file with production Supabase credentials"
echo "2. Go to your Supabase dashboard > SQL Editor"
echo "3. Copy and run the content from: supabase/updated_production_setup.sql"
echo "4. Restart your development server: npm run dev"
echo "5. Visit: http://localhost:3000/dashboard/analytics"
echo ""

echo "📁 Files created/updated:"
echo "- ✅ supabase/updated_production_setup.sql (Complete production schema)"
echo "- ✅ DEPLOY_ANALYTICS_TO_PRODUCTION.md (Detailed deployment guide)"
echo "- ✅ .env.local (Environment variables template)"
echo ""

echo "📖 For detailed instructions, see: DEPLOY_ANALYTICS_TO_PRODUCTION.md"
echo ""
echo "🎉 Ready for deployment!"
echo "Follow the guide in DEPLOY_ANALYTICS_TO_PRODUCTION.md to complete the setup."