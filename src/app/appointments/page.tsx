'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Session } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { AppointmentForm } from '@/components/AppointmentForm'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default function AppointmentsPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login')
      }
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push('/login')
    return null
  }
  return (
    <DashboardLayout>
      <div className="flex-1 p-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Appointments</h1>
          </div>
          <div className="space-y-6">
            <AppointmentForm session={session} />
            <div className="mt-6 flex items-center justify-end">
              <div className="space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
