#!/usr/bin/env node

/**
 * Create tables and insert data using Supabase SQL execution
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🚀 Creating tables and inserting data...')
console.log(`📡 URL: ${supabaseUrl}`)

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTables() {
  console.log('🏗️  Creating database tables...')
  
  const createTablesSQL = `
    -- Enable extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Drop existing tables if they exist
    DROP TABLE IF EXISTS ecommerce_orders CASCADE;
    DROP TABLE IF EXISTS crm_conversions CASCADE;
    DROP TABLE IF EXISTS email_sends CASCADE;
    DROP TABLE IF EXISTS email_campaigns CASCADE;
    DROP TABLE IF EXISTS campaigns CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    
    -- Create users table
    CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        user_type VARCHAR(50) DEFAULT 'retailer',
        region VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true
    );
    
    -- Create campaigns table
    CREATE TABLE campaigns (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        start_date TIMESTAMP WITH TIME ZONE,
        end_date TIMESTAMP WITH TIME ZONE,
        budget_allocated DECIMAL(12,2),
        budget_spent DECIMAL(12,2) DEFAULT 0,
        created_by UUID REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create email campaigns table
    CREATE TABLE email_campaigns (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
        subject VARCHAR(500) NOT NULL,
        sender_email VARCHAR(255) NOT NULL,
        sent_at TIMESTAMP WITH TIME ZONE,
        total_recipients INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create email sends table
    CREATE TABLE email_sends (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email_campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
        retailer_id UUID REFERENCES users(id),
        recipient_email VARCHAR(255) NOT NULL,
        sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        delivered_at TIMESTAMP WITH TIME ZONE,
        opened_at TIMESTAMP WITH TIME ZONE,
        clicked_at TIMESTAMP WITH TIME ZONE,
        status VARCHAR(50) DEFAULT 'sent'
    );
    
    -- Create CRM conversions table
    CREATE TABLE crm_conversions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        campaign_id UUID REFERENCES campaigns(id),
        retailer_id UUID REFERENCES users(id),
        conversion_value DECIMAL(12,2),
        conversion_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Create e-commerce orders table
    CREATE TABLE ecommerce_orders (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        campaign_id UUID REFERENCES campaigns(id),
        retailer_id UUID REFERENCES users(id),
        order_value DECIMAL(12,2),
        order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  `
  
  try {
    // Try using the SQL editor endpoint directly
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql: createTablesSQL })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    console.log('✅ Tables created successfully!')
    return true
  } catch (error) {
    console.error('❌ Table creation failed:', error.message)
    console.log('\n📋 Manual setup required:')
    console.log('1. Go to your Supabase SQL Editor')
    console.log('2. Copy and paste the following SQL:')
    console.log('\n' + '='.repeat(50))
    console.log(createTablesSQL)
    console.log('='.repeat(50))
    return false
  }
}

async function insertSampleData() {
  console.log('📝 Inserting sample data...')
  
  // Sample data
  const users = [
    { id: '550e8400-e29b-41d4-a716-446655440001', email: 'contact@betteridgeny.com', name: 'Betteridge NY', user_type: 'retailer', region: 'East' },
    { id: '550e8400-e29b-41d4-a716-446655440002', email: 'info@tourneau.com', name: 'Tourneau Times Square', user_type: 'retailer', region: 'East' },
    { id: '550e8400-e29b-41d4-a716-446655440003', email: 'sales@manfredijewels.com', name: 'Manfredi Jewels', user_type: 'retailer', region: 'East' },
    { id: '550e8400-e29b-41d4-a716-446655440004', email: 'hello@davidyurman.com', name: 'David Yurman Boston', user_type: 'retailer', region: 'East' },
    { id: '550e8400-e29b-41d4-a716-446655440005', email: 'contact@tiffanyco.com', name: 'Tiffany & Co Fifth Ave', user_type: 'retailer', region: 'East' },
    { id: '550e8400-e29b-41d4-a716-446655440006', email: 'info@bachendorfs.com', name: 'Bachendorf\'s Dallas', user_type: 'retailer', region: 'Central' },
    { id: '550e8400-e29b-41d4-a716-446655440007', email: 'sales@mayorsjewelry.com', name: 'Mayors Jewelry', user_type: 'retailer', region: 'Central' },
    { id: '550e8400-e29b-41d4-a716-446655440008', email: 'contact@fieldsjewelers.com', name: 'Fields Jewelers', user_type: 'retailer', region: 'Central' },
    { id: '550e8400-e29b-41d4-a716-446655440009', email: 'hello@jewelrydesign.com', name: 'Jewelry Design Center', user_type: 'retailer', region: 'Central' },
    { id: '550e8400-e29b-41d4-a716-446655440010', email: 'info@luxurytime.com', name: 'Luxury Time Chicago', user_type: 'retailer', region: 'Central' },
    { id: '550e8400-e29b-41d4-a716-446655440011', email: 'contact@cartierrodeo.com', name: 'Cartier Rodeo Drive', user_type: 'retailer', region: 'West' },
    { id: '550e8400-e29b-41d4-a716-446655440012', email: 'sales@westimela.com', name: 'Westime LA', user_type: 'retailer', region: 'West' },
    { id: '550e8400-e29b-41d4-a716-446655440013', email: 'info@cellinibh.com', name: 'Cellini Beverly Hills', user_type: 'retailer', region: 'West' },
    { id: '550e8400-e29b-41d4-a716-446655440014', email: 'hello@shreve.com', name: 'Shreve & Co', user_type: 'retailer', region: 'West' },
    { id: '550e8400-e29b-41d4-a716-446655440015', email: 'contact@benbridge.com', name: 'Ben Bridge Jeweler', user_type: 'retailer', region: 'West' },
    { id: '550e8400-e29b-41d4-a716-446655440016', email: 'marketing@marcobicego.com', name: 'Marco Bicego Marketing', user_type: 'brand', region: null }
  ]

  try {
    console.log('👥 Inserting users...')
    const { error: usersError } = await supabase
      .from('users')
      .insert(users)
    
    if (usersError) throw usersError
    console.log('✅ Users inserted')

    console.log('📋 Inserting campaigns...')
    const { error: campaignsError } = await supabase
      .from('campaigns')
      .insert([{
        id: '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
        name: 'Marco Bicego New 2025 Campaign',
        description: 'Launch campaign for new Marco Bicego jewelry collection',
        status: 'active',
        start_date: '2025-01-14T00:00:00+00:00',
        end_date: '2025-02-14T23:59:59+00:00',
        budget_allocated: 75000.00,
        budget_spent: 33500.00,
        created_by: '550e8400-e29b-41d4-a716-446655440016'
      }])
    
    if (campaignsError) throw campaignsError
    console.log('✅ Campaigns inserted')

    console.log('📧 Inserting email campaigns...')
    const { error: emailCampaignsError } = await supabase
      .from('email_campaigns')
      .insert([{
        id: 'aa48715f-f4a-53f6-c652-668877662177',
        campaign_id: '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
        subject: 'Introducing Marco Bicego New 2025 Collection',
        sender_email: 'marketing@marcobicego.com',
        sent_at: '2025-01-15T09:00:00+00:00',
        total_recipients: 15
      }])
    
    if (emailCampaignsError) throw emailCampaignsError
    console.log('✅ Email campaigns inserted')

    // Generate email sends data to reach ~27,037 total
    console.log('📨 Generating email sends data...')
    const emailSends = []
    const retailers = users.filter(u => u.user_type === 'retailer')
    
    // Create approximately 27,037 email sends (1802 per retailer * 15 retailers = 27,030)
    const sendsPerRetailer = 1802
    
    for (const retailer of retailers) {
      for (let i = 0; i < sendsPerRetailer; i++) {
        const baseDate = new Date('2025-01-15T09:00:00Z')
        const sentAt = new Date(baseDate.getTime() + (i * 60000)) // 1 minute apart
        
        emailSends.push({
          email_campaign_id: 'aa48715f-f4a-53f6-c652-668877662177',
          retailer_id: retailer.id,
          recipient_email: retailer.email,
          sent_at: sentAt.toISOString(),
          delivered_at: new Date(sentAt.getTime() + 120000).toISOString(),
          opened_at: Math.random() < 0.43 ? new Date(sentAt.getTime() + 3600000).toISOString() : null,
          clicked_at: Math.random() < 0.032 ? new Date(sentAt.getTime() + 7200000).toISOString() : null,
          status: Math.random() < 0.98 ? 'delivered' : 'bounced'
        })
      }
    }

    console.log(`📨 Inserting ${emailSends.length} email sends in batches...`)
    
    // Insert in batches of 1000 to avoid timeouts
    const batchSize = 1000
    for (let i = 0; i < emailSends.length; i += batchSize) {
      const batch = emailSends.slice(i, i + batchSize)
      const { error } = await supabase
        .from('email_sends')
        .insert(batch)
      
      if (error) throw error
      
      console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(emailSends.length/batchSize)} inserted`)
      
      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // Insert CRM conversions
    console.log('💰 Inserting CRM conversions...')
    const conversions = retailers.map(retailer => ({
      campaign_id: '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
      retailer_id: retailer.id,
      conversion_value: 2000 + Math.random() * 8000,
      conversion_date: '2025-01-20T00:00:00+00:00'
    }))

    const { error: conversionsError } = await supabase
      .from('crm_conversions')
      .insert(conversions)
    
    if (conversionsError) throw conversionsError
    console.log('✅ CRM conversions inserted')

    // Insert e-commerce orders
    console.log('🛒 Inserting e-commerce orders...')
    const orders = retailers.map(retailer => ({
      campaign_id: '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
      retailer_id: retailer.id,
      order_value: 1500 + Math.random() * 5000,
      order_date: '2025-01-25T00:00:00+00:00'
    }))

    const { error: ordersError } = await supabase
      .from('ecommerce_orders')
      .insert(orders)
    
    if (ordersError) throw ordersError
    console.log('✅ E-commerce orders inserted')

    return true
  } catch (error) {
    console.error('❌ Data insertion failed:', error.message)
    return false
  }
}

async function createPerformanceView() {
  console.log('📊 Creating performance view...')
  
  const viewSQL = `
    CREATE OR REPLACE VIEW campaign_performance_summary AS
    SELECT 
        c.id as campaign_id,
        c.name as campaign_name,
        c.status,
        c.start_date,
        c.end_date,
        c.budget_allocated,
        c.budget_spent,
        
        -- Count metrics
        COUNT(DISTINCT CASE WHEN u.user_type = 'retailer' THEN u.id END) as total_retailers,
        COUNT(es.id) as total_emails_sent,
        COUNT(CASE WHEN es.status = 'delivered' THEN es.id END) as emails_delivered,
        COUNT(es.opened_at) as emails_opened,
        COUNT(es.clicked_at) as emails_clicked,
        
        -- Calculate rates
        CASE 
            WHEN COUNT(CASE WHEN es.status = 'delivered' THEN es.id END) > 0 
            THEN ROUND((COUNT(es.opened_at)::DECIMAL / COUNT(CASE WHEN es.status = 'delivered' THEN es.id END)) * 100, 2)
            ELSE 0 
        END as open_rate,
        
        CASE 
            WHEN COUNT(CASE WHEN es.status = 'delivered' THEN es.id END) > 0 
            THEN ROUND((COUNT(es.clicked_at)::DECIMAL / COUNT(CASE WHEN es.status = 'delivered' THEN es.id END)) * 100, 2)
            ELSE 0 
        END as click_rate,
        
        -- Revenue and ROI
        COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) as total_revenue,
        CASE 
            WHEN c.budget_spent > 0 
            THEN ROUND(((COALESCE(SUM(cc.conversion_value), 0) + COALESCE(SUM(eo.order_value), 0) - c.budget_spent) / c.budget_spent) * 100, 1)
            ELSE 0 
        END as roi_percentage,
        
        c.created_at

    FROM campaigns c
    LEFT JOIN email_campaigns ec ON c.id = ec.campaign_id
    LEFT JOIN email_sends es ON ec.id = es.email_campaign_id
    LEFT JOIN users u ON es.retailer_id = u.id
    LEFT JOIN crm_conversions cc ON c.id = cc.campaign_id
    LEFT JOIN ecommerce_orders eo ON c.id = eo.campaign_id
    GROUP BY c.id, c.name, c.status, c.start_date, c.end_date, c.budget_allocated, c.budget_spent, c.created_at;
  `
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql: viewSQL })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    console.log('✅ Performance view created')
    return true
  } catch (error) {
    console.error('❌ View creation failed:', error.message)
    return false
  }
}

async function verifyData() {
  console.log('\n🧪 Verifying data...')
  
  const tables = ['users', 'campaigns', 'email_campaigns', 'email_sends', 'crm_conversions', 'ecommerce_orders']
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`)
      } else {
        console.log(`✅ ${table}: ${count} records`)
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`)
    }
  }
  
  // Test the performance view
  try {
    const { data, error } = await supabase
      .from('campaign_performance_summary')
      .select('*')
      .eq('campaign_name', 'Marco Bicego New 2025 Campaign')
      .single()
    
    if (error) {
      console.log('❌ Performance view: Not accessible')
    } else if (data) {
      console.log('\n🎯 Marco Bicego Campaign:')
      console.log(`   📧 Total Emails: ${data.total_emails_sent}`)
      console.log(`   📊 Click Rate: ${data.click_rate}%`)
      console.log(`   💰 ROI: ${data.roi_percentage}%`)
      console.log(`   👥 Retailers: ${data.total_retailers}`)
    }
  } catch (err) {
    console.log('❌ Performance view test failed:', err.message)
  }
}

async function main() {
  console.log('🔧 Starting complete setup...')
  
  const tablesCreated = await createTables()
  if (!tablesCreated) {
    console.log('❌ Setup failed at table creation step')
    return
  }
  
  // Wait a moment for tables to be ready
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const dataInserted = await insertSampleData()
  if (!dataInserted) {
    console.log('❌ Setup failed at data insertion step')
    return
  }
  
  const viewCreated = await createPerformanceView()
  if (!viewCreated) {
    console.log('⚠️  View creation failed, but data is inserted')
  }
  
  await verifyData()
  
  console.log('\n🎉 Setup completed!')
  console.log('\n📋 Next steps:')
  console.log('1. npm run dev')
  console.log('2. Go to: http://localhost:3000/dashboard/brand-performance/campaigns')
  console.log('3. You should see the Marco Bicego campaign!')
}

if (require.main === module) {
  main()
}

module.exports = { createTables, insertSampleData, verifyData }