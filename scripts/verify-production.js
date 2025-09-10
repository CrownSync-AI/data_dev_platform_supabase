#!/usr/bin/env node

/**
 * 🔍 Production Database Verification Script
 * This script tests the connection to your production Supabase database
 * and verifies that all analytics tables and views are properly set up.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyConnection() {
  console.log('🔍 Verifying Production Database Connection');
  console.log('=========================================');
  console.log('');
  
  try {
    // Test basic connection
    console.log('📡 Testing connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Connection successful!');
    console.log('');
    
    // Verify analytics tables
    console.log('📊 Verifying Analytics Tables:');
    const tables = [
      'brand_assets',
      'watch_models', 
      'retailer_asset_activity',
      'campaign_templates',
      'wish_list_items',
      'regional_wish_lists'
    ];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: OK (${data.length > 0 ? 'has data' : 'empty'})`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
      }
    }
    
    console.log('');
    
    // Verify analytics views
    console.log('📈 Verifying Analytics Views:');
    const views = [
      'top_downloaded_assets',
      'top_active_retailers_assets',
      'top_wish_list_items',
      'top_templates_coverage'
    ];
    
    for (const view of views) {
      try {
        const { data, error } = await supabase.from(view).select('*').limit(1);
        if (error) {
          console.log(`❌ ${view}: ${error.message}`);
        } else {
          console.log(`✅ ${view}: OK (${data.length} records)`);
        }
      } catch (err) {
        console.log(`❌ ${view}: ${err.message}`);
      }
    }
    
    console.log('');
    
    // Test analytics functions
    console.log('🧪 Testing Analytics Functions:');
    
    try {
      // Test fetchTopDownloadedAssets equivalent
      const { data: assets, error: assetsError } = await supabase
        .from('brand_assets')
        .select('*')
        .order('download_count', { ascending: false })
        .limit(5);
        
      if (assetsError) {
        console.log('❌ Top Downloaded Assets query failed:', assetsError.message);
      } else {
        console.log(`✅ Top Downloaded Assets: ${assets.length} records`);
      }
      
      // Test fetchTopWishListItems equivalent
      const { data: wishItems, error: wishError } = await supabase
        .from('top_wish_list_items')
        .select('*')
        .limit(5);
        
      if (wishError) {
        console.log('❌ Top Wish List Items query failed:', wishError.message);
      } else {
        console.log(`✅ Top Wish List Items: ${wishItems.length} records`);
      }
      
      // Test fetchTopActiveRetailers equivalent
      const { data: retailers, error: retailersError } = await supabase
        .from('top_active_retailers_assets')
        .select('*')
        .limit(5);
        
      if (retailersError) {
        console.log('❌ Top Active Retailers query failed:', retailersError.message);
      } else {
        console.log(`✅ Top Active Retailers: ${retailers.length} records`);
      }
      
    } catch (err) {
      console.log('❌ Analytics function test failed:', err.message);
    }
    
    console.log('');
    console.log('🎉 Verification Complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Visit: http://localhost:3000/dashboard/analytics');
    console.log('3. Verify all charts and data display correctly');
    
    return true;
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

verifyConnection().then(success => {
  process.exit(success ? 0 : 1);
});