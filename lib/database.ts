import { Pool } from 'pg'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export { pool }

// Helper function for queries
export async function query(text: string, params?: any[]) {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Closing database pool...')
  pool.end(() => {
    console.log('Database pool closed.')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  console.log('Closing database pool...')
  pool.end(() => {
    console.log('Database pool closed.')
    process.exit(0)
  })
}) 