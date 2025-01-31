import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file first
config({ path: resolve(process.cwd(), '.env.local') })

// Only import supabase after env vars are loaded
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

    // Test auth service
    const { data: authData } = await supabase.auth.getSession()
    console.log(
      'Auth Service Status:',
      authData ? 'Connected' : 'Not Connected',
    )

    // Test database connection with notes table
    const { data: notesData, error: notesError } = await supabase
      .from('notes')
      .select('*')
      .limit(1)

    if (notesError) {
      console.error('Database Error:', notesError.message)
      return
    }

    console.log('Database Connection: Successful')
    console.log('Sample Notes Data:', notesData)
  } catch (err) {
    console.error('Connection failed:', err)
  }
}

testConnection()
