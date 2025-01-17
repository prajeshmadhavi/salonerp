import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file first
config({ path: resolve(process.cwd(), '.env.local') })

// Import supabase after env vars are loaded
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function insertService() {
  try {
    // First, sign in (replace with your actual email and password)
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: 'your-email@example.com', // Replace with your email
        password: 'your-password', // Replace with your password
      })

    if (authError) {
      console.error('Error signing in:', authError.message)
      return
    }

    console.log('Successfully signed in:', authData.user?.email)

    // Now try to insert the service
    const { data, error } = await supabase
      .from('services')
      .insert([{ service_name: 'Noesis Infotech Services' }])
      .select()

    if (error) {
      console.error('Error inserting service:', error.message)
      return
    }

    console.log('Service inserted successfully:', data)
  } catch (err) {
    console.error('Failed to insert service:', err)
  }
}

insertService()
