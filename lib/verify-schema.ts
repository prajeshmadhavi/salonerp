import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file first
config({ path: resolve(process.cwd(), '.env.local') })

// Import supabase after env vars are loaded
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifySchema() {
  try {
    console.log('Verifying database schema...\n')

    // Verify tables were created
    const tables = ['customers', 'services', 'staff', 'appointments']
    console.log('Checking tables:')
    for (const table of tables) {
      const { data, error: tableError } = await supabase
        .from(table)
        .select('id')
        .limit(1)

      if (tableError) {
        console.error(`❌ Table ${table}: ${tableError.message}`)
      } else {
        console.log(`✅ Table ${table} exists`)
      }
    }

    console.log('\nChecking views:')
    // Verify views were created
    const views = [
      'active_appointments',
      'appointment_history',
      'staff_schedules',
    ]
    for (const view of views) {
      const { data, error: viewError } = await supabase
        .from(view)
        .select('*')
        .limit(1)

      if (viewError) {
        console.error(`❌ View ${view}: ${viewError.message}`)
      } else {
        console.log(`✅ View ${view} exists`)
      }
    }
  } catch (err) {
    console.error('Failed to verify schema:', err)
  }
}

verifySchema()
