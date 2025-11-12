#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  try {
    console.log('🚀 Creating retailer performance tables...');
    
    // Create sample data directly in the tables the API expects
    console.log('📊 Creating retailer_performance_summary table...');
    
    // First, let's create a simple table with the summary data
    const summaryData = {
      top_retailers_count: 12,
      needs_attention_count: 8,
      average_roi: 105.7,
      active_retailers: 20,
      total_retailers: 25,
      participation_rate: 80.0,
      grade_a_count: 12,
      grade_b_count: 6,
      grade_c_count: 5,
      grade_df_count: 2,
      average_click_rate: 3.24,
      average_open_rate: 36.8,
      average_delivery_rate: 97.2,
      average_conversion_rate: 0.78
    };
    
    // Insert summary data
    const { error: summaryError } = await supabase
      .from('retailer_performance_summary')
      .upsert([summaryData]);
    
    if (summaryError) {
      console.log('Creating retailer_performance_summary table...');
      // Table doesn't exist, we need to create it via SQL
      console.log('Summary table needs to be created manually in Supabase dashboard');
    } else {
      console.log('✅ Summary data inserted');
    }
    
    // Create dashboard data
    console.log('📈 Creating dashboard data...');
    
    const dashboardData = [
      {
        retailer_id: '550e8400-e29b-41d4-a716-446655440001',
        retailer_name: 'Cartier Rodeo Drive',
        region: 'West',
        emails_sent: 3848,
        delivery_rate: 98.2,
        open_rate: 45.7,
        click_rate: 4.64,
        conversion_rate: 1.15,
        roi_percentage: 124.5,
        performance_grade: 'A',
        is_top_performer: true,
        needs_attention: false,
        overall_rank: 1,
        last_active_date: '2025-01-15T14:30:00Z',
        click_rate_target: 5.8,
        click_rate_status: 'Below Target',
        performance_level: 'Excellent Performance',
        activity_status: 'Active'
      },
      {
        retailer_id: '550e8400-e29b-41d4-a716-446655440002',
        retailer_name: 'Betteridge NY',
        region: 'East',
        emails_sent: 2685,
        delivery_rate: 98.0,
        open_rate: 42.9,
        click_rate: 3.87,
        conversion_rate: 0.95,
        roi_percentage: 118.2,
        performance_grade: 'A',
        is_top_performer: true,
        needs_attention: false,
        overall_rank: 2,
        last_active_date: '2025-01-14T16:45:00Z',
        click_rate_target: 4.6,
        click_rate_status: 'Below Target',
        performance_level: 'Excellent Performance',
        activity_status: 'Active'
      },
      {
        retailer_id: '550e8400-e29b-41d4-a716-446655440003',
        retailer_name: 'Westime LA',
        region: 'West',
        emails_sent: 356,
        delivery_rate: 98.1,
        open_rate: 42.8,
        click_rate: 3.69,
        conversion_rate: 0.89,
        roi_percentage: 115.7,
        performance_grade: 'A',
        is_top_performer: true,
        needs_attention: false,
        overall_rank: 3,
        last_active_date: '2025-01-13T12:20:00Z',
        click_rate_target: 3.5,
        click_rate_status: 'Above Target',
        performance_level: 'Excellent Performance',
        activity_status: 'Active'
      },
      {
        retailer_id: '550e8400-e29b-41d4-a716-446655440004',
        retailer_name: 'Tourneau Times Square',
        region: 'East',
        emails_sent: 1842,
        delivery_rate: 98.0,
        open_rate: 38.9,
        click_rate: 3.27,
        conversion_rate: 0.76,
        roi_percentage: 108.4,
        performance_grade: 'B',
        is_top_performer: false,
        needs_attention: false,
        overall_rank: 4,
        last_active_date: '2025-01-12T09:15:00Z',
        click_rate_target: 3.5,
        click_rate_status: 'Below Target',
        performance_level: 'Good Performance',
        activity_status: 'Active'
      },
      {
        retailer_id: '550e8400-e29b-41d4-a716-446655440005',
        retailer_name: 'Mayors Jewelry',
        region: 'Central',
        emails_sent: 1287,
        delivery_rate: 98.0,
        open_rate: 35.9,
        click_rate: 2.78,
        conversion_rate: 0.62,
        roi_percentage: 95.3,
        performance_grade: 'B',
        is_top_performer: false,
        needs_attention: false,
        overall_rank: 5,
        last_active_date: '2025-01-11T11:30:00Z',
        click_rate_target: 3.5,
        click_rate_status: 'Below Target',
        performance_level: 'Average Performance',
        activity_status: 'Active'
      }
    ];
    
    // Try to insert dashboard data
    const { error: dashboardError } = await supabase
      .from('retailer_performance_dashboard')
      .upsert(dashboardData);
    
    if (dashboardError) {
      console.log('Dashboard table needs to be created. Error:', dashboardError.message);
    } else {
      console.log('✅ Dashboard data inserted');
    }
    
    console.log('🎉 Setup completed! You may need to create tables manually in Supabase dashboard.');
    console.log('📋 Required tables:');
    console.log('  - retailer_performance_summary');
    console.log('  - retailer_performance_dashboard');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

createTables();