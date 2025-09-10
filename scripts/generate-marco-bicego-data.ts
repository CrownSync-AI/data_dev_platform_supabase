import { query } from '../lib/database'

const MARCO_BICEGO_RETAILERS = [
  // East Region - High Performers
  { name: 'Manfredi Jewels', email: 'manfredi@jewels.com', region: 'East', tier: 'premium', baseClickRate: 0.042 },
  { name: 'Betteridge NY', email: 'betteridge@ny.com', region: 'East', tier: 'premium', baseClickRate: 0.038 },
  { name: 'London Jewelers', email: 'london@jewelers.com', region: 'East', tier: 'good', baseClickRate: 0.034 },
  { name: 'Tourneau NYC', email: 'tourneau@nyc.com', region: 'East', tier: 'good', baseClickRate: 0.031 },
  { name: 'Wempe NY', email: 'wempe@newyork.com', region: 'East', tier: 'average', baseClickRate: 0.028 },
  
  // Central Region - Mixed Performers
  { name: 'Bachendorf\'s Dallas', email: 'bachendorf@dallas.com', region: 'Central', tier: 'good', baseClickRate: 0.032 },
  { name: 'Shreve & Co', email: 'shreve@co.com', region: 'Central', tier: 'average', baseClickRate: 0.026 },
  { name: 'Hyde Park Jewelers', email: 'hydeparks@jewelers.com', region: 'Central', tier: 'average', baseClickRate: 0.024 },
  { name: 'Eiseman Jewels', email: 'eiseman@jewels.com', region: 'Central', tier: 'poor', baseClickRate: 0.019 },
  
  // West Region - Variable Performance
  { name: 'Cartier Rodeo Drive', email: 'cartier@rodeo.com', region: 'West', tier: 'premium', baseClickRate: 0.041 },
  { name: 'Cellini Beverly Hills', email: 'cellini@bevhills.com', region: 'West', tier: 'good', baseClickRate: 0.033 },
  { name: 'Tourneau SF', email: 'tourneau@sf.com', region: 'West', tier: 'average', baseClickRate: 0.027 },
  { name: 'Ben Bridge Seattle', email: 'benbridge@seattle.com', region: 'West', tier: 'average', baseClickRate: 0.025 },
  { name: 'Westime LA', email: 'westime@la.com', region: 'West', tier: 'poor', baseClickRate: 0.021 },
  { name: 'Mayors SF', email: 'mayors@sf.com', region: 'West', tier: 'poor', baseClickRate: 0.018 }
];

export async function generateMarcoBicegoData() {
  console.log('🎭 Generating Marco Bicego campaign data...')
  
  try {
    // 1. Create brand user first
    console.log('👤 Creating brand user...')
    const brandUserResult = await query(`
      INSERT INTO users (user_email, user_name, user_type, created_at, is_active)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_email) DO UPDATE SET user_name = EXCLUDED.user_name
      RETURNING user_id
    `, ['marketing@marcobicego.com', 'Marco Bicego Brand', 'brand', '2024-01-01', true])
    
    const brandUserId = brandUserResult.rows[0].user_id
    console.log(`✅ Brand user created with ID: ${brandUserId}`)
    
    // 2. Create retailers
    console.log('🏪 Creating retailers...')
    for (const retailer of MARCO_BICEGO_RETAILERS) {
      await query(`
        INSERT INTO users (user_email, user_name, user_type, region, profile_data, created_at, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (user_email) DO UPDATE SET 
          user_name = EXCLUDED.user_name,
          region = EXCLUDED.region,
          profile_data = EXCLUDED.profile_data
      `, [
        retailer.email,
        retailer.name,
        'retailer',
        retailer.region,
        JSON.stringify({ tier: retailer.tier }),
        '2024-01-01',
        true
      ])
      console.log(`   ✅ Created ${retailer.name} (${retailer.region})`)
    }
    
    // 3. Create Marco Bicego Campaign
    console.log('📋 Creating Marco Bicego campaign...')
    const campaignResult = await query(`
      INSERT INTO campaigns (
        campaign_name, campaign_description, campaign_status, 
        start_date, end_date, created_by_user_id, budget_allocated, target_audience
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (campaign_name) DO UPDATE SET 
        campaign_description = EXCLUDED.campaign_description
      RETURNING campaign_id
    `, [
      'Marco Bicego New 2025 Campaign',
      'Luxury jewelry collection launch for Spring 2025',
      'active',
      '2025-01-15T00:00:00Z',
      '2025-02-15T00:00:00Z',
      brandUserId,
      150000,
      JSON.stringify({ demographic: 'luxury_jewelry_buyers', regions: ['East', 'Central', 'West'] })
    ])
    
    const campaignId = campaignResult.rows[0].campaign_id
    console.log(`✅ Campaign created with ID: ${campaignId}`)
    
    // 4. Create Email Campaign
    console.log('📧 Creating email campaign...')
    const emailCampaignResult = await query(`
      INSERT INTO email_campaigns (
        campaign_id, email_subject, email_content, sender_email, 
        sender_name, sent_at, total_recipients
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING email_campaign_id
    `, [
      campaignId,
      'Introducing Marco Bicego New Collection 2025',
      'Discover the latest luxury jewelry collection featuring exquisite craftsmanship and timeless elegance.',
      'marketing@marcobicego.com',
      'Marco Bicego Marketing',
      '2025-01-15T10:00:00Z',
      MARCO_BICEGO_RETAILERS.length
    ])
    
    const emailCampaignId = emailCampaignResult.rows[0].email_campaign_id
    console.log(`✅ Email campaign created with ID: ${emailCampaignId}`)
    
    // 5. Generate realistic email performance data
    console.log('📊 Generating email performance data...')
    for (const retailer of MARCO_BICEGO_RETAILERS) {
      const sendTime = generateRealisticSendTime(retailer.region)
      const emailsSent = generateEmailVolume(retailer.tier)
      
      console.log(`   📈 Generating ${emailsSent} emails for ${retailer.name}`)
      
      const emailBatch = []
      for (let i = 0; i < emailsSent; i++) {
        const performanceData = generateEmailPerformance(retailer.baseClickRate)
        
        emailBatch.push({
          email_campaign_id: emailCampaignId,
          recipient_email: `customer${i}@${retailer.email.split('@')[1]}`,
          recipient_name: `Customer ${i}`,
          sent_at: sendTime,
          delivered_at: performanceData.delivered ? addMinutes(sendTime, 1) : null,
          opened_at: performanceData.opened ? addMinutes(sendTime, randomBetween(15, 120)) : null,
          clicked_at: performanceData.clicked ? addMinutes(sendTime, randomBetween(20, 180)) : null,
          status: performanceData.delivered ? 'delivered' : 'bounced'
        })
        
        // Insert in batches of 100 for better performance
        if (emailBatch.length === 100 || i === emailsSent - 1) {
          for (const email of emailBatch) {
            await query(`
              INSERT INTO email_sends (
                email_campaign_id, recipient_email, recipient_name, sent_at,
                delivered_at, opened_at, clicked_at, status
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [
              email.email_campaign_id,
              email.recipient_email,
              email.recipient_name,
              email.sent_at,
              email.delivered_at,
              email.opened_at,
              email.clicked_at,
              email.status
            ])
          }
          emailBatch.length = 0 // Clear batch
        }
      }
    }
    
    console.log('🎉 Marco Bicego campaign data generated successfully!')
    
    // Display summary
    const summaryResult = await query(`
      SELECT 
        COUNT(DISTINCT u.user_id) as total_retailers,
        COUNT(es.email_send_id) as total_emails,
        COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) as delivered_emails,
        COUNT(es.clicked_at) as clicked_emails
      FROM campaigns c
      JOIN email_campaigns ec ON c.campaign_id = ec.campaign_id
      JOIN email_sends es ON ec.email_campaign_id = es.email_campaign_id
      JOIN users u ON es.recipient_email LIKE '%@' || SPLIT_PART(u.user_email, '@', 2)
      WHERE u.user_type = 'retailer' AND c.campaign_id = $1
    `, [campaignId])
    
    const summary = summaryResult.rows[0]
    console.log('\n📈 Campaign Summary:')
    console.log(`   📊 Total Retailers: ${summary.total_retailers}`)
    console.log(`   📧 Total Emails: ${summary.total_emails}`)
    console.log(`   ✅ Delivered: ${summary.delivered_emails}`)
    console.log(`   🖱️  Clicked: ${summary.clicked_emails}`)
    console.log(`   📍 Campaign ID: ${campaignId}`)
    
    return { success: true, campaignId }
    
  } catch (error) {
    console.error('❌ Error generating campaign data:', error)
    throw error
  }
}

function generateRealisticSendTime(region: string): string {
  const baseDate = new Date('2025-01-15')
  const timeZoneOffset = region === 'East' ? -5 : region === 'Central' ? -6 : -8
  const optimalHour = randomBetween(9, 16) // Business hours
  
  baseDate.setHours(optimalHour + timeZoneOffset)
  baseDate.setMinutes(randomBetween(0, 59))
  
  return baseDate.toISOString()
}

function generateEmailVolume(tier: string): number {
  switch (tier) {
    case 'premium': return randomBetween(800, 1200)
    case 'good': return randomBetween(400, 800)
    case 'average': return randomBetween(200, 400)
    case 'poor': return randomBetween(50, 200)
    default: return 100
  }
}

function generateEmailPerformance(baseClickRate: number) {
  const delivered = Math.random() > 0.02 // 98% delivery rate
  const opened = delivered && Math.random() < (baseClickRate * 20) // Open rate ~20x click rate
  const clicked = opened && Math.random() < (baseClickRate / (baseClickRate * 20))
  
  return { delivered, opened, clicked }
}

function addMinutes(date: string, minutes: number): string {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() + minutes)
  return d.toISOString()
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Run the script if called directly
if (require.main === module) {
  generateMarcoBicegoData()
    .then(() => {
      console.log('✅ Data generation completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Data generation failed:', error)
      process.exit(1)
    })
} 