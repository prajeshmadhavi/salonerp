import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export interface CreateStaffRequest {
  name: string
  email_id: string
  phone_number1: string
  phone_number2?: string
  gender: 'male' | 'female' | 'other'
  date_of_birth: string
  address: string
  pincode: string
}

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to add staff' },
        { status: 401 },
      )
    }

    // Insert the staff record
    const { data, error } = await supabase.from('staff').insert({
      ...json,
      UID: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
