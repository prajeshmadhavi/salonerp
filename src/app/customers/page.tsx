'use client'

import { Button } from '@/components/ui/button'
import { CustomerForm } from '@/components/CustomerForm'
import { DashboardLayout } from '@/components/DashboardLayout'
import { CustomerSummaryCards } from '@/components/CustomerSummaryCards'
import { CustomerCharts } from '@/components/CustomerCharts'
import { CustomerTable } from '@/components/ui/customer-table'

export default function CustomersPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Customers Management</h1>
          <CustomerForm>
            <Button variant="default">Add New Customer</Button>
          </CustomerForm>
        </div>

        <div className="mb-8">
          <CustomerSummaryCards />
        </div>

        <div className="mb-8">
          <CustomerCharts />
        </div>

        <div className="mb-8">
          <CustomerTable />
        </div>
      </div>
    </DashboardLayout>
  )
}
