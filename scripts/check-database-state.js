#!/usr/bin/env node

/**
 * Quick Database State Check
 * Checks if social media tables exist and have data
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Environment variables missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkState() {
  console.log('🔍 Checking Database State...\n')

  // Check if social_accounts table exists
  try {
    const { count, error } = await supabase
      .from('social_accounts')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log('❌ Social media tables do NOT exist')
      console.log('   Error:', error.message)
      console.log('\n🔧 SOLUTION: Run the setup scripts')
      console.log('   1. Copy supabase/social_media_quick_setup.sql to Supabase SQL Editor')
      console.log('   2. Execute the script')
      console.log('   3. Copy supabase/social_media_dummy_data.sql to Supabase SQL Editor')
      console.log('   4. Execute the script')
      return
    }

    console.log(`✅ Social accounts table exists with ${count} records`)

    // Check users table
    const { data: users } = await supabase
      .from('users')
      .select('id, name, user_type')
      .eq('user_type', 'retailer')

    console.log(`✅ Found ${users.length} retailer users`)

    if (users.length === 0) {
      console.log('\n❌ No retailer users found!')
      console.log('🔧 SOLUTION: Create retailer users first')
      console.log('   Run this in Supabase SQL Editor:')
      console.log(`
INSERT INTO users (name, email, user_type, region) VALUES 
('Luxury Jewelers NYC', 'nyc@luxury.com', 'retailer', 'East'),
('Elite Gems LA', 'la@elite.com', 'retailer', 'West'),
('Premium Jewelry Chicago', 'chicago@premium.com', 'retailer', 'Central'),
('Diamond Gallery Miami', 'miami@diamond.com', 'retailer', 'East'),
('Golden Gate Jewelers', 'sf@golden.com', 'retailer', 'West');`)
      return
    }

    // Check if we have analytics data
    const { count: analyticsCount } = await supabase
      .from('social_analytics')
      .select('*', { count: 'exact', head: true })

    console.log(`✅ Found ${analyticsCount} analytics records`)

    if (analyticsCount === 0) {
      console.log('\n❌ No analytics data found!')
      console.log('🔧 SOLUTION: Run the dummy data script')
      console.log('   Copy supabase/social_media_dummy_data.sql to Supabase SQL Editor and execute')
      return
    }

    console.log('\n✅ Database appears to be set up correctly!')
    console.log('🔧 If dashboard still shows zeros, check API endpoints')

  } catch (err) {
    console.log('❌ Database check failed:', err.message)
  }
}

checkState()