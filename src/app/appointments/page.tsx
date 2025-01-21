'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { AppointmentForm } from '@/components/AppointmentForm'

export default function AppointmentsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 p-6">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Appointments</h1>
          </div>
          <div className="space-y-6">
            <AppointmentForm />
            <div className="mt-6 flex items-center justify-between">
              <Button variant="outline">Add Service</Button>
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
