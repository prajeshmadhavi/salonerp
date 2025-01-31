import { supabase } from './supabase'

async function testConnection() {
  try {
    const { data, error } = await supabase.from('services').select('*').limit(1)

    if (error) {
      console.error('Supabase connection error:', error)
    } else {
      console.log('Supabase connection successful! Data:', data)
    }
  } catch (err) {
    console.error('Error testing Supabase connection:', err)
  }
}

testConnection()
