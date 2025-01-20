'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 p-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Appointments</h1>
            <Button>New Appointment</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
