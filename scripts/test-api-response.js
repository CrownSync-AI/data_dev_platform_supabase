#!/usr/bin/env node

/**
 * Test API Response Structure
 * Check what the API actually returns
 */

async function testAPI() {
  try {
    const response = await fetch('http://localhost:3000/api/social-analytics')
    
    if (response.ok) {
      const data = await response.json()
      console.log('🔍 API Response Structure:')
      console.log(JSON.stringify(data, null, 2))
    } else {
      console.log(`❌ API failed: ${response.status}`)
    }
  } catch (err) {
    console.log(`❌ Error: ${err.message}`)
    console.log('💡 Make sure development server is running: npm run dev')
  }
}

testAPI()