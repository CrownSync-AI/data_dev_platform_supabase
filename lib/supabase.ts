import { createClient } from '@supabase/supabase-js'
import { Database } from './types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Client for browser/client-side operations
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Function to create admin client (server-side only)
export function createSupabaseAdmin() {
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable. This function can only be used server-side.')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Legacy export for backward compatibility (server-side only)
// This will be undefined on the client side, which is expected
let supabaseAdmin: ReturnType<typeof createSupabaseAdmin> | undefined

if (typeof window === 'undefined') {
  // Only initialize on server side
  try {
    supabaseAdmin = createSupabaseAdmin()
  } catch (error) {
    console.warn('Could not initialize supabaseAdmin:', error)
  }
}

export { supabaseAdmin }

// Re-export the Database type for convenience
export type { Database } from './types/database'