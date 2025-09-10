#!/usr/bin/env node

// Test Supabase connection and environment variables
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Supabase Environment Variables...\n');

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY', 
  'SUPABASE_SERVICE_ROLE_KEY'
];

let allVarsPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
    allVarsPresent = false;
  }
});

if (!allVarsPresent) {
  console.log('\n❌ Some required environment variables are missing!');
  process.exit(1);
}

console.log('\n🔗 Testing Supabase Client Initialization...');

try {
  const { createClient } = require('@supabase/supabase-js');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Test client initialization
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase client (anon) initialized successfully');

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
  console.log('✅ Supabase admin client initialized successfully');

  console.log('\n🎉 All Supabase connections are working!');
  
} catch (error) {
  console.log('\n❌ Error initializing Supabase clients:');
  console.error(error.message);
  process.exit(1);
}