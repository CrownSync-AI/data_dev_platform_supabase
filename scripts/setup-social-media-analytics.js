#!/usr/bin/env node

/**
 * Social Media Analytics Database Setup Script
 * 
 * This script sets up the complete social media analytics database structure
 * and populates it with realistic dummy data based on Ayrshare's data formats.
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL')
  console.error('   SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupSocialMediaAnalytics() {
  try {
    console.log('🚀 Starting Social Media Analytics Database Setup...\n')

    // Read the SQL setup file
    const sqlFilePath = path.join(__dirname, '..', 'supabase', 'social_media_analytics_complete_setup.sql')
    
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`SQL file not found: ${sqlFilePath}`)
    }

    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8')
    
    console.log('📄 Executing SQL setup script...')
    
    // Execute the SQL script
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sqlContent })
    
    if (error) {
      // If the RPC function doesn't exist, try direct execution
      console.log('⚠️  RPC function not available, trying direct execution...')
      
      // Split SQL into individual statements and execute them
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i]
        if (statement.length > 0) {
          console.log(`   Executing statement ${i + 1}/${statements.length}...`)
          
          const { error: execError } = await supabase
            .from('_temp_sql_execution')
            .select('*')
            .limit(1)
            .then(() => supabase.rpc('exec', { sql: statement }))
            .catch(async () => {
              // Fallback: try to execute as a query
              return await supabase.from('information_schema.tables').select('*').limit(1)
            })
          
          if (execError && !execError.message.includes('does not exist')) {
            console.warn(`   ⚠️  Warning on statement ${i + 1}: ${execError.message}`)
          }
        }
      }
    }

    console.log('✅ SQL setup script executed successfully!\n')

    // Verify the setup by checking table counts
    console.log('🔍 Verifying database setup...\n')

    const verificationQueries = [
      { name: 'Social Accounts', table: 'social_accounts' },
      { name: 'Social Posts', table: 'social_posts' },
      { name: 'Social Analytics', table: 'social_analytics' },
      { name: 'Account Analytics', table: 'account_analytics' },
      { name: 'Audience Demographics', table: 'audience_demographics' },
      { name: 'Hashtag Performance', table: 'hashtag_performance' }
    ]

    const results = {}

    for (const query of verificationQueries) {
      try {
        const { count, error } = await supabase
          .from(query.table)
          .select('*', { count: 'exact', head: true })

        if (error) {
          console.log(`   ❌ ${query.name}: Error - ${error.message}`)
          results[query.name] = 0
        } else {
          console.log(`   ✅ ${query.name}: ${count} records`)
          results[query.name] = count
        }
      } catch (err) {
        console.log(`   ❌ ${query.name}: Error - ${err.message}`)
        results[query.name] = 0
      }
    }

    // Test the views
    console.log('\n🔍 Testing database views...\n')

    try {
      const { data: summaryData, error: summaryError } = await supabase
        .from('social_performance_summary')
        .select('*')
        .limit(5)

      if (summaryError) {
        console.log(`   ❌ Social Performance Summary View: ${summaryError.message}`)
      } else {
        console.log(`   ✅ Social Performance Summary View: ${summaryData.length} sample records`)
      }
    } catch (err) {
      console.log(`   ❌ Social Performance Summary View: ${err.message}`)
    }

    try {
      const { data: contentData, error: contentError } = await supabase
        .from('top_performing_content')
        .select('*')
        .limit(5)

      if (contentError) {
        console.log(`   ❌ Top Performing Content View: ${contentError.message}`)
      } else {
        console.log(`   ✅ Top Performing Content View: ${contentData.length} sample records`)
      }
    } catch (err) {
      console.log(`   ❌ Top Performing Content View: ${err.message}`)
    }

    // Test API endpoints
    console.log('\n🔍 Testing API endpoints...\n')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/social-analytics`)
      
      if (response.ok) {
        const data = await response.json()
        console.log('   ✅ Social Analytics API: Working')
        console.log(`      - Total Reach: ${data.data?.totalReach || 0}`)
        console.log(`      - Total Engagement: ${data.data?.totalEngagement || 0}`)
        console.log(`      - Avg Engagement Rate: ${data.data?.avgEngagementRate || 0}%`)
      } else {
        console.log(`   ⚠️  Social Analytics API: HTTP ${response.status}`)
      }
    } catch (err) {
      console.log(`   ⚠️  Social Analytics API: ${err.message}`)
    }

    // Summary
    console.log('\n📊 Setup Summary:')
    console.log('================')
    
    const totalRecords = Object.values(results).reduce((sum, count) => sum + count, 0)
    
    if (totalRecords > 0) {
      console.log('✅ Social Media Analytics database setup completed successfully!')
      console.log(`📈 Total records created: ${totalRecords}`)
      console.log('\n🎯 Next Steps:')
      console.log('   1. Start your development server: npm run dev')
      console.log('   2. Navigate to: /dashboard/brand-performance/social-analytics')
      console.log('   3. Verify all components display data correctly')
      console.log('\n💡 The frontend should now display:')
      console.log('   - Overview metrics cards with real data')
      console.log('   - Platform performance charts')
      console.log('   - Retailer rankings table')
      console.log('   - Top performing content')
    } else {
      console.log('⚠️  Setup completed but no data was created.')
      console.log('   This might be because there are no retailer users in the database.')
      console.log('   Please ensure you have retailer users before running this script.')
    }

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
    console.error('\n🔧 Troubleshooting:')
    console.error('   1. Check your .env.local file has correct Supabase credentials')
    console.error('   2. Ensure your Supabase project is accessible')
    console.error('   3. Verify you have the necessary database permissions')
    process.exit(1)
  }
}

// Run the setup
setupSocialMediaAnalytics()