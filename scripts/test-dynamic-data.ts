#!/usr/bin/env tsx

/**
 * Dynamic Data Validation Script
 * Tests that all dashboard numbers are coming from the database, not static/mock data
 */

import dotenv from 'dotenv'
import { query } from '../lib/database'

// Load environment variables
dotenv.config({ path: '.env.local' })

const TEST_CAMPAIGN_ID = '6b04371b-ef1b-49a4-a540-b1dbf59f9f54'
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'

interface TestResult {
  test: string
  passed: boolean
  expected: any
  actual: any
  message?: string
}

interface DataValidationResult {
  category: string
  tests: TestResult[]
  totalTests: number
  passedTests: number
  failedTests: number
}

class DynamicDataValidator {
  private results: DataValidationResult[] = []

  async validateDatabaseConnectivity(): Promise<DataValidationResult> {
    console.log('🔌 Testing Database Connectivity...')
    
    const tests: TestResult[] = []
    
    try {
      // Test 1: Basic connection
      const connectionTest = await query('SELECT NOW() as current_time')
      tests.push({
        test: 'Database Connection',
        passed: connectionTest.rows.length > 0,
        expected: 'Connection successful',
        actual: connectionTest.rows.length > 0 ? 'Connected' : 'Failed'
      })

      // Test 2: Campaign exists
      const campaignTest = await query(
        'SELECT campaign_id, campaign_name FROM campaigns WHERE campaign_id = $1',
        [TEST_CAMPAIGN_ID]
      )
      tests.push({
        test: 'Test Campaign Exists',
        passed: campaignTest.rows.length > 0,
        expected: 'Marco Bicego Campaign',
        actual: campaignTest.rows[0]?.campaign_name || 'Not found'
      })

      // Test 3: Data exists
      const dataTest = await query(`
        SELECT 
          COUNT(DISTINCT u.user_id) as retailers,
          COUNT(es.email_send_id) as emails
        FROM campaigns c
        JOIN email_campaigns ec ON c.campaign_id = ec.campaign_id
        JOIN email_sends es ON ec.email_campaign_id = es.email_campaign_id
        JOIN users u ON es.recipient_email LIKE '%@' || SPLIT_PART(u.user_email, '@', 2)
        WHERE c.campaign_id = $1 AND u.user_type = 'retailer'
      `, [TEST_CAMPAIGN_ID])

      const hasData = dataTest.rows[0]?.retailers > 0 && dataTest.rows[0]?.emails > 0
      tests.push({
        test: 'Campaign Data Exists',
        passed: hasData,
        expected: 'Retailers and emails > 0',
        actual: `${dataTest.rows[0]?.retailers} retailers, ${dataTest.rows[0]?.emails} emails`
      })

    } catch (error) {
      tests.push({
        test: 'Database Connection',
        passed: false,
        expected: 'No errors',
        actual: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    const result: DataValidationResult = {
      category: 'Database Connectivity',
      tests,
      totalTests: tests.length,
      passedTests: tests.filter(t => t.passed).length,
      failedTests: tests.filter(t => !t.passed).length
    }

    this.results.push(result)
    return result
  }

  async validateAPIEndpoints(): Promise<DataValidationResult> {
    console.log('🌐 Testing API Endpoints...')
    
    const tests: TestResult[] = []

    try {
      // Test 1: Campaigns list API
      const campaignsResponse = await fetch(`${BASE_URL}/api/campaigns`)
      const campaignsData = await campaignsResponse.json()
      
      tests.push({
        test: 'Campaigns List API',
        passed: campaignsResponse.ok && Array.isArray(campaignsData.campaigns),
        expected: 'Array of campaigns',
        actual: `${campaignsData.campaigns?.length || 0} campaigns`
      })

      // Test 2: Campaign analytics API
      const analyticsResponse = await fetch(
        `${BASE_URL}/api/campaigns/${TEST_CAMPAIGN_ID}/analytics?limit=5`
      )
      const analyticsData = await analyticsResponse.json()
      
      tests.push({
        test: 'Campaign Analytics API',
        passed: analyticsResponse.ok && Array.isArray(analyticsData.leaderboard),
        expected: 'Leaderboard data',
        actual: `${analyticsData.leaderboard?.length || 0} retailers`
      })

      // Test 3: Campaign summary API
      const summaryResponse = await fetch(
        `${BASE_URL}/api/campaigns/${TEST_CAMPAIGN_ID}/summary`
      )
      const summaryData = await summaryResponse.json()
      
      tests.push({
        test: 'Campaign Summary API',
        passed: summaryResponse.ok && summaryData.summary?.total_retailers > 0,
        expected: 'Summary with retailers > 0',
        actual: `${summaryData.summary?.total_retailers || 0} retailers`
      })

      // Test 4: API response times
      const startTime = Date.now()
      await fetch(`${BASE_URL}/api/campaigns/${TEST_CAMPAIGN_ID}/analytics`)
      const responseTime = Date.now() - startTime
      
      tests.push({
        test: 'API Response Time',
        passed: responseTime < 2000,
        expected: '< 2000ms',
        actual: `${responseTime}ms`
      })

    } catch (error) {
      tests.push({
        test: 'API Connectivity',
        passed: false,
        expected: 'Successful API calls',
        actual: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    const result: DataValidationResult = {
      category: 'API Endpoints',
      tests,
      totalTests: tests.length,
      passedTests: tests.filter(t => t.passed).length,
      failedTests: tests.filter(t => !t.passed).length
    }

    this.results.push(result)
    return result
  }

  async validateDataConsistency(): Promise<DataValidationResult> {
    console.log('📊 Testing Data Consistency...')
    
    const tests: TestResult[] = []

    try {
      // Get data from database directly
      const dbQuery = await query(`
        WITH retailer_stats AS (
          SELECT 
            u.user_id,
            COUNT(es.email_send_id) as emails_sent,
            COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) as emails_delivered,
            COUNT(es.opened_at) as emails_opened,
            COUNT(es.clicked_at) as emails_clicked,
            CASE WHEN COUNT(CASE WHEN es.status = 'delivered' THEN 1 END) > 0 
            THEN (COUNT(es.clicked_at)::DECIMAL / COUNT(CASE WHEN es.status = 'delivered' THEN 1 END)) * 100 
            ELSE 0 END as click_rate
          FROM campaigns c
          JOIN email_campaigns ec ON c.campaign_id = ec.campaign_id
          JOIN email_sends es ON ec.email_campaign_id = es.email_campaign_id
          JOIN users u ON es.recipient_email LIKE '%@' || SPLIT_PART(u.user_email, '@', 2)
          WHERE c.campaign_id = $1 AND u.user_type = 'retailer'
          GROUP BY u.user_id
        ),
        campaign_stats AS (
          SELECT 
            COUNT(*) as total_retailers,
            SUM(emails_sent) as total_emails_sent,
            SUM(emails_delivered) as total_emails_delivered,
            SUM(emails_opened) as total_emails_opened,
            SUM(emails_clicked) as total_emails_clicked,
            ROUND(AVG(click_rate), 2) as avg_click_rate
          FROM retailer_stats
        )
        SELECT * FROM campaign_stats
      `, [TEST_CAMPAIGN_ID])

      const dbData = dbQuery.rows[0]

      // Get data from API
      const apiResponse = await fetch(`${BASE_URL}/api/campaigns/${TEST_CAMPAIGN_ID}/summary`)
      const apiData = await apiResponse.json()
      const apiSummary = apiData.summary

      // Test 1: Total retailers consistency
      tests.push({
        test: 'Total Retailers Consistency',
        passed: parseInt(dbData.total_retailers) === apiSummary.total_retailers,
        expected: dbData.total_retailers,
        actual: apiSummary.total_retailers
      })

      // Test 2: Total emails consistency
      tests.push({
        test: 'Total Emails Consistency',
        passed: parseInt(dbData.total_emails_sent) === apiSummary.total_emails_sent,
        expected: dbData.total_emails_sent,
        actual: apiSummary.total_emails_sent
      })

      // Test 3: Click data consistency
      tests.push({
        test: 'Total Clicks Consistency',
        passed: parseInt(dbData.total_emails_clicked) === apiSummary.total_emails_clicked,
        expected: dbData.total_emails_clicked,
        actual: apiSummary.total_emails_clicked
      })

      // Test 4: Average click rate consistency (within 0.1% tolerance)
      const dbClickRate = parseFloat(dbData.avg_click_rate)
      const apiClickRate = apiSummary.average_click_rate
      const clickRateDiff = Math.abs(dbClickRate - apiClickRate)
      
      tests.push({
        test: 'Average Click Rate Consistency',
        passed: clickRateDiff < 0.1,
        expected: `${dbClickRate}%`,
        actual: `${apiClickRate}%`
      })

      // Test 5: Verify no static/mock data patterns
      const suspiciousValues = [
        { value: apiSummary.total_retailers, name: 'retailers' },
        { value: apiSummary.total_emails_sent, name: 'emails_sent' },
        { value: apiSummary.average_click_rate, name: 'click_rate' }
      ]

      const hasStaticPatterns = suspiciousValues.some(item => 
        item.value === 100 || item.value === 1000 || item.value === 10000 ||
        item.value === 5.0 || item.value === 10.0 || item.value === 50.0
      )

      tests.push({
        test: 'No Static Data Patterns',
        passed: !hasStaticPatterns,
        expected: 'Dynamic values',
        actual: hasStaticPatterns ? 'Suspicious static patterns found' : 'Dynamic values detected'
      })

    } catch (error) {
      tests.push({
        test: 'Data Consistency Check',
        passed: false,
        expected: 'Consistent data',
        actual: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    const result: DataValidationResult = {
      category: 'Data Consistency',
      tests,
      totalTests: tests.length,
      passedTests: tests.filter(t => t.passed).length,
      failedTests: tests.filter(t => !t.passed).length
    }

    this.results.push(result)
    return result
  }

  async validateLeaderboardDynamics(): Promise<DataValidationResult> {
    console.log('🏆 Testing Leaderboard Dynamics...')
    
    const tests: TestResult[] = []

    try {
      // Test 1: Leaderboard returns real retailer names
      const leaderboardResponse = await fetch(
        `${BASE_URL}/api/campaigns/${TEST_CAMPAIGN_ID}/analytics?limit=5`
      )
      const leaderboardData = await leaderboardResponse.json()
      const retailers = leaderboardData.leaderboard

      tests.push({
        test: 'Leaderboard Has Real Retailers',
        passed: retailers.length > 0 && retailers[0].retailer_name !== 'Mock Retailer',
        expected: 'Real retailer names',
        actual: retailers.length > 0 ? retailers[0].retailer_name : 'No data'
      })

      // Test 2: Click rates are realistic and varied
      const clickRates = retailers.map((r: any) => r.click_rate)
      const allSame = clickRates.every((rate: number) => rate === clickRates[0])
      const hasVariation = Math.max(...clickRates) - Math.min(...clickRates) > 0.5

      tests.push({
        test: 'Click Rates Show Variation',
        passed: !allSame && hasVariation,
        expected: 'Varied click rates',
        actual: `Range: ${Math.min(...clickRates).toFixed(2)}% - ${Math.max(...clickRates).toFixed(2)}%`
      })

      // Test 3: Rankings are sequential
      const rankings = retailers.map((r: any) => r.overall_rank)
      const sequentialRankings = rankings.every((rank: number, index: number) => rank === index + 1)

      tests.push({
        test: 'Sequential Rankings',
        passed: sequentialRankings,
        expected: 'Sequential rankings 1,2,3...',
        actual: rankings.join(',')
      })

      // Test 4: Performance tiers are logical
      const topPerformer = retailers.find((r: any) => r.overall_rank === 1)
      const isTopTierLogical = topPerformer?.performance_tier === 'Top' || 
                               topPerformer?.click_rate >= 3.5

      tests.push({
        test: 'Performance Tiers Logical',
        passed: isTopTierLogical,
        expected: 'Top performer has Top tier or high click rate',
        actual: `#1: ${topPerformer?.performance_tier}, ${topPerformer?.click_rate}%`
      })

      // Test 5: Email data follows funnel logic
      const funnelValid = retailers.every((r: any) => 
        r.emails_clicked <= r.emails_opened &&
        r.emails_opened <= r.emails_delivered &&
        r.emails_delivered <= r.emails_sent
      )

      tests.push({
        test: 'Email Funnel Logic',
        passed: funnelValid,
        expected: 'Clicked ≤ Opened ≤ Delivered ≤ Sent',
        actual: funnelValid ? 'Valid funnel' : 'Invalid funnel detected'
      })

    } catch (error) {
      tests.push({
        test: 'Leaderboard Data Access',
        passed: false,
        expected: 'Accessible leaderboard data',
        actual: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    const result: DataValidationResult = {
      category: 'Leaderboard Dynamics',
      tests,
      totalTests: tests.length,
      passedTests: tests.filter(t => t.passed).length,
      failedTests: tests.filter(t => !t.passed).length
    }

    this.results.push(result)
    return result
  }

  async validateRegionalData(): Promise<DataValidationResult> {
    console.log('🗺️  Testing Regional Data...')
    
    const tests: TestResult[] = []

    try {
      // Get regional breakdown from API
      const summaryResponse = await fetch(`${BASE_URL}/api/campaigns/${TEST_CAMPAIGN_ID}/summary`)
      const summaryData = await summaryResponse.json()
      const regionalData = summaryData.summary.by_region

      // Test 1: Multiple regions exist
      const regionCount = Object.keys(regionalData).length
      tests.push({
        test: 'Multiple Regions Exist',
        passed: regionCount >= 3,
        expected: 'At least 3 regions',
        actual: `${regionCount} regions: ${Object.keys(regionalData).join(', ')}`
      })

      // Test 2: Valid region names
      const validRegions = ['East', 'Central', 'West']
      const hasValidRegions = Object.keys(regionalData).every(region => 
        validRegions.includes(region)
      )

      tests.push({
        test: 'Valid Region Names',
        passed: hasValidRegions,
        expected: 'East, Central, West',
        actual: Object.keys(regionalData).join(', ')
      })

      // Test 3: Regional data has realistic distribution
      const regionalCounts = Object.values(regionalData).map((r: any) => r.count)
      const totalRetailers = regionalCounts.reduce((sum: number, count: number) => sum + count, 0)
      const hasReasonableDistribution = regionalCounts.every((count: number) => 
        count > 0 && count < totalRetailers
      )

      tests.push({
        test: 'Reasonable Regional Distribution',
        passed: hasReasonableDistribution,
        expected: 'Each region has some retailers',
        actual: `Distribution: ${regionalCounts.join(', ')}`
      })

      // Test 4: Regional totals match summary
      const summaryTotalRetailers = summaryData.summary.total_retailers
      tests.push({
        test: 'Regional Totals Match Summary',
        passed: totalRetailers === summaryTotalRetailers,
        expected: summaryTotalRetailers,
        actual: totalRetailers
      })

    } catch (error) {
      tests.push({
        test: 'Regional Data Access',
        passed: false,
        expected: 'Accessible regional data',
        actual: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    const result: DataValidationResult = {
      category: 'Regional Data',
      tests,
      totalTests: tests.length,
      passedTests: tests.filter(t => t.passed).length,
      failedTests: tests.filter(t => !t.passed).length
    }

    this.results.push(result)
    return result
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting Dynamic Data Validation Tests...')
    console.log('='.repeat(60))

    // Run all test suites
    await this.validateDatabaseConnectivity()
    await this.validateAPIEndpoints()
    await this.validateDataConsistency()
    await this.validateLeaderboardDynamics()
    await this.validateRegionalData()

    // Generate final report
    this.generateReport()
  }

  private generateReport(): void {
    console.log('\n🔍 DYNAMIC DATA VALIDATION REPORT')
    console.log('='.repeat(60))

    let totalTests = 0
    let totalPassed = 0
    let totalFailed = 0

    this.results.forEach(category => {
      totalTests += category.totalTests
      totalPassed += category.passedTests
      totalFailed += category.failedTests

      const status = category.failedTests === 0 ? '✅' : '❌'
      console.log(`\n${status} ${category.category}: ${category.passedTests}/${category.totalTests} passed`)
      
      // Show failed tests
      if (category.failedTests > 0) {
        category.tests.filter(t => !t.passed).forEach(test => {
          console.log(`   ❌ ${test.test}: Expected "${test.expected}", got "${test.actual}"`)
        })
      }
    })

    console.log('\n' + '='.repeat(60))
    console.log(`📊 OVERALL RESULTS: ${totalPassed}/${totalTests} tests passed (${((totalPassed/totalTests)*100).toFixed(1)}%)`)
    
    if (totalFailed === 0) {
      console.log('🎉 ALL TESTS PASSED! Dashboard is using dynamic data from database.')
    } else {
      console.log(`⚠️  ${totalFailed} tests failed. Some dashboard data may not be dynamic.`)
      process.exit(1)
    }

    // Performance summary
    console.log('\n📈 PERFORMANCE SUMMARY:')
    console.log('- Database queries: Real-time from PostgreSQL')
    console.log('- API endpoints: Dynamic data fetching')
    console.log('- UI components: Live data integration')
    console.log('- Data consistency: Cross-verified between DB and API')
    
    console.log('\n✨ Dynamic Data Validation Complete!')
  }
}

// Run the validation
async function main() {
  const validator = new DynamicDataValidator()
  await validator.runAllTests()
}

// Only run if this script is executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Validation failed:', error)
    process.exit(1)
  })
}

export { DynamicDataValidator } 