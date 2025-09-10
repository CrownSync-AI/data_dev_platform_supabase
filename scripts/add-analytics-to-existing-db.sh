#!/bin/bash

# =============================================
# ADD ANALYTICS TABLES TO EXISTING DATABASE
# =============================================

echo "🔧 Adding Analytics Tables to Your Existing Database"
echo "===================================================="

# Check if the SQL file exists
if [ ! -f "supabase/add_analytics_tables.sql" ]; then
    echo "❌ Error: supabase/add_analytics_tables.sql not found!"
    exit 1
fi

echo "📋 What this script will add to your database:"
echo "   ✅ brand_assets - Marketing materials tracking"
echo "   ✅ watch_models - Product catalog"
echo "   ✅ retailer_asset_activity - Download tracking"
echo "   ✅ campaign_templates - Marketing templates"
echo "   ✅ wish_list_items - Customer preferences"
echo "   ✅ regional_wish_lists - Geographic data"
echo "   ✅ Analytics views for dashboard"
echo "   ✅ Sample data for testing"
echo ""

echo "🔧 Instructions:"
echo "1. Go to your Supabase dashboard > SQL Editor"
echo "2. Click 'New Query'"
echo "3. Copy and paste the content from: supabase/add_analytics_tables.sql"
echo "4. Click 'Run' (takes ~30 seconds)"
echo "5. Run 'npm run verify:production' to test"
echo ""

echo "📁 File ready: supabase/add_analytics_tables.sql"
echo "📖 This script only ADDS new tables - it won't affect your existing data"
echo ""

read -p "Press Enter to continue..."

echo "🎉 Ready! Follow the instructions above to add analytics tables."
echo "After running the SQL script, your analytics dashboard will have data!"