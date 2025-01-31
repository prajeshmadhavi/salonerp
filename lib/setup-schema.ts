import { config } from 'dotenv'
import { resolve } from 'path'
import fs from 'fs'

// Load .env.local file first
config({ path: resolve(process.cwd(), '.env.local') })

// Import supabase after env vars are loaded
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupSchema() {
  try {
    // Read the schema.sql file
    const schema = fs.readFileSync('schema.sql', 'utf8')

    // Execute the SQL schema
    const { error } = await supabase.rpc('exec_sql', { sql_query: schema })

    if (error) {
      console.error('Error setting up schema:', error.message)
      return
    }

    console.log('Schema setup successful!')

    // Verify tables were created
    const tables = ['customers', 'services', 'staff', 'appointments']
    for (const table of tables) {
      const { data, error: tableError } = await supabase
        .from(table)
        .select('count(*)')
        .limit(1)

      if (tableError) {
        console.error(`Error verifying table ${table}:`, tableError.message)
      } else {
        console.log(`Table ${table} created successfully`)
      }
    }

    // Verify views were created
    const views = [
      'active_appointments',
      'appointment_history',
      'staff_schedules',
    ]
    for (const view of views) {
      const { data, error: viewError } = await supabase
        .from(view)
        .select('count(*)')
        .limit(1)

      if (viewError) {
        console.error(`Error verifying view ${view}:`, viewError.message)
      } else {
        console.log(`View ${view} created successfully`)
      }
    }
  } catch (err) {
    console.error('Failed to setup schema:', err)
  }
}

setupSchema()
