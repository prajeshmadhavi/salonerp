import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local file first
config({ path: resolve(process.cwd(), '.env.local') })

// Import supabase after env vars are loaded
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function insertSampleData() {
  try {
    // First authenticate with Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email: process.env.SUPABASE_ADMIN_EMAIL,
      password: process.env.SUPABASE_ADMIN_PASSWORD,
    })

    if (authError) throw authError
    console.log('Authenticated as:', user?.email)

    // Insert customers
    const { data: customers, error: custError } = await supabase
      .from('customers')
      .insert([
        {
          id: '11111111-1111-1111-1111-111111111111',
          name: 'John Doe',
          phone_number1: '1234567890',
          gender: 'male',
          email_id: 'john@example.com',
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          name: 'Jane Smith',
          phone_number1: '0987654321',
          gender: 'female',
          email_id: 'jane@example.com',
        },
      ])

    if (custError) throw custError
    console.log('Inserted customers:', customers)

    // Insert services
    const { data: services, error: servError } = await supabase
      .from('services')
      .insert([
        {
          id: '33333333-3333-3333-3333-333333333333',
          service_name: 'Haircut',
        },
        {
          id: '44444444-4444-4444-4444-444444444444',
          service_name: 'Manicure',
        },
        {
          id: '55555555-5555-5555-5555-555555555555',
          service_name: 'Facial',
        },
      ])

    if (servError) throw servError
    console.log('Inserted services:', services)

    // Insert staff
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .insert([
        {
          id: '66666666-6666-6666-6666-666666666666',
          name: 'Alice Johnson',
          phone_number1: '1122334455',
          gender: 'female',
        },
        {
          id: '77777777-7777-7777-7777-777777777777',
          name: 'Bob Williams',
          phone_number1: '5566778899',
          gender: 'male',
        },
      ])

    if (staffError) throw staffError
    console.log('Inserted staff:', staff)

    // Insert appointments
    const { data: appointments, error: apptError } = await supabase
      .from('appointments')
      .insert([
        {
          id: '88888888-8888-8888-8888-888888888888',
          customer_id: '11111111-1111-1111-1111-111111111111',
          service_id: '33333333-3333-3333-3333-333333333333',
          staff_id: '66666666-6666-6666-6666-666666666666',
          appointment_date: '2024-03-22',
          appointment_time: '10:00:00',
          status: 'confirmed',
        },
        {
          id: '99999999-9999-9999-9999-999999999999',
          customer_id: '22222222-2222-2222-2222-222222222222',
          service_id: '44444444-4444-4444-4444-444444444444',
          staff_id: '77777777-7777-7777-7777-777777777777',
          appointment_date: '2024-03-23',
          appointment_time: '14:30:00',
          status: 'pending',
        },
        {
          id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
          customer_id: '11111111-1111-1111-1111-111111111111',
          service_id: '55555555-5555-5555-5555-555555555555',
          staff_id: '66666666-6666-6666-6666-666666666666',
          appointment_date: '2024-03-24',
          appointment_time: '11:00:00',
          status: 'confirmed',
        },
      ])

    if (apptError) throw apptError
    console.log('Inserted appointments:', appointments)

    console.log('✅ All sample data inserted successfully')
  } catch (error) {
    console.error('❌ Error inserting sample data:', error)
  }
}

insertSampleData()
