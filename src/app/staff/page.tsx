'use client'

import { Button } from '@/components/ui/button'
import { StaffForm } from '@/components/StaffForm'
import { DashboardLayout } from '@/components/DashboardLayout'
import { StaffPerformanceDashboard } from '@/components/StaffPerformanceDashboard'

export default function StaffPage() {
  const totalRevenue = 5095 // TODO: Fetch from API
  const staffRevenue = [
    { name: 'John Doe', revenue: 1500 },
    { name: 'Jane Smith', revenue: 2000 },
    { name: 'Bob Johnson', revenue: 1595 },
  ]
  const topPerformers = [
    { rank: 1, name: 'Jane Smith', sales: 42 },
    { rank: 2, name: 'John Doe', sales: 38 },
    { rank: 3, name: 'Bob Johnson', sales: 35 },
  ]

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Staff Management</h1>
          <StaffForm>
            <Button variant="default">Add New Staff</Button>
          </StaffForm>
        </div>

        <div className="mt-8">
          <StaffPerformanceDashboard
            totalRevenue={totalRevenue}
            staffRevenue={staffRevenue}
            topPerformers={topPerformers}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
