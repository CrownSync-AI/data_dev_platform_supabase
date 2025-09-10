#!/usr/bin/env node

/**
 * Direct data insertion using Supabase JavaScript client
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🚀 Direct data insertion starting...')
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

const campaigns = [
  {
    id: '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
    name: 'Marco Bicego New 2025 Campaign',
    description: 'Launch campaign for new Marco Bicego jewelry collection',
    status: 'active',
    start_date: '2025-01-14T00:00:00+00:00',
    end_date: '2025-02-14T23:59:59+00:00',
    budget_allocated: 75000.00,
    budget_spent: 33500.00,
    created_by: '550e8400-e29b-41d4-a716-446655440016'
  }
]

const emailCampaigns = [
  {
    id: 'aa48715f-f4a-53f6-c652-668877662177',
    campaign_id: '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
    subject: 'Introducing Marco Bicego New 2025 Collection',
    sender_email: 'marketing@marcobicego.com',
    sent_at: '2025-01-15T09:00:00+00:00',
    total_recipients: 15
  }
]

async function insertData() {
  try {
    console.log('👥 Inserting users...')
    const { error: usersError } = await supabase
      .from('users')
      .insert(users)
    
    if (usersError) {
      console.error('❌ Users insert failed:', usersError.message)
      return false
    }
    console.log('✅ Users inserted')

    console.log('📋 Inserting campaigns...')
    const { error: campaignsError } = await supabase
      .from('campaigns')
      .insert(campaigns)
    
    if (campaignsError) {
      console.error('❌ Campaigns insert failed:', campaignsError.message)
      return false
    }
    console.log('✅ Campaigns inserted')

    console.log('📧 Inserting email campaigns...')
    const { error: emailCampaignsError } = await supabase
      .from('email_campaigns')
      .insert(emailCampaigns)
    
    if (emailCampaignsError) {
      console.error('❌ Email campaigns insert failed:', emailCampaignsError.message)
      return false
    }
    console.log('✅ Email campaigns inserted')

    // Generate email sends data (smaller batch for testing)
    console.log('📨 Generating email sends...')
    const emailSends = []
    const retailers = users.filter(u => u.user_type === 'retailer')
    
    // Create 1000 email sends for testing (instead of 27,037)
    for (let i = 0; i < 1000; i++) {
      const retailer = retailers[i % retailers.length]
      const baseDate = new Date('2025-01-15T09:00:00Z')
      const sentAt = new Date(baseDate.getTime() + (i * 60000)) // 1 minute apart
      
      emailSends.push({
        email_campaign_id: 'aa48715f-f4a-53f6-c652-668877662177',
        retailer_id: retailer.id,
        recipient_email: retailer.email,
        sent_at: sentAt.toISOString(),
        delivered_at: new Date(sentAt.getTime() + 120000).toISOString(), // 2 minutes later
        opened_at: Math.random() < 0.43 ? new Date(sentAt.getTime() + 3600000).toISOString() : null, // 43% open rate
        clicked_at: Math.random() < 0.032 ? new Date(sentAt.getTime() + 7200000).toISOString() : null, // 3.2% click rate
        status: Math.random() < 0.98 ? 'delivered' : 'bounced'
      })
    }

    console.log(`📨 Inserting ${emailSends.length} email sends...`)
    
    // Insert in batches of 100
    for (let i = 0; i < emailSends.length; i += 100) {
      const batch = emailSends.slice(i, i + 100)
      const { error } = await supabase
        .from('email_sends')
        .insert(batch)
      
      if (error) {
        console.error(`❌ Email sends batch ${i/100 + 1} failed:`, error.message)
        return false
      }
      
      console.log(`✅ Batch ${i/100 + 1}/${Math.ceil(emailSends.length/100)} inserted`)
    }

    // Insert CRM conversions
    console.log('💰 Inserting CRM conversions...')
    const conversions = retailers.map(retailer => ({
      campaign_id: '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
      retailer_id: retailer.id,
      conversion_value: 2000 + Math.random() * 8000, // $2K-$10K
      conversion_date: '2025-01-20T00:00:00+00:00'
    }))

    const { error: conversionsError } = await supabase
      .from('crm_conversions')
      .insert(conversions)
    
    if (conversionsError) {
      console.error('❌ CRM conversions insert failed:', conversionsError.message)
      return false
    }
    console.log('✅ CRM conversions inserted')

    // Insert e-commerce orders
    console.log('🛒 Inserting e-commerce orders...')
    const orders = retailers.map(retailer => ({
      campaign_id: '6b04371b-ef1b-49a4-a540-b1dbf59f9f54',
      retailer_id: retailer.id,
      order_value: 1500 + Math.random() * 5000, // $1.5K-$6.5K
      order_date: '2025-01-25T00:00:00+00:00'
    }))

    const { error: ordersError } = await supabase
      .from('ecommerce_orders')
      .insert(orders)
    
    if (ordersError) {
      console.error('❌ E-commerce orders insert failed:', ordersError.message)
      return false
    }
    console.log('✅ E-commerce orders inserted')

    return true
  } catch (error) {
    console.error('💥 Insert failed:', error.message)
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
}

async function main() {
  console.log('🔧 Starting data insertion...')
  
  const success = await insertData()
  
  if (success) {
    await verifyData()
    console.log('\n🎉 Data insertion completed!')
    console.log('\n📋 Next steps:')
    console.log('1. npm run dev')
    console.log('2. Go to: http://localhost:3000/dashboard/brand-performance/campaigns')
    console.log('\n⚠️  Note: This created 1,000 email sends for testing.')
    console.log('   For the full 27,037 emails, run the SQL script manually in Supabase.')
  } else {
    console.log('\n❌ Data insertion failed. Check the errors above.')
  }
}

if (require.main === module) {
  main()
}

module.exports = { insertData, verifyData }