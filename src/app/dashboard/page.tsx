'use client'

import { DashboardLayout } from '@/components/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { createBrowserClient } from '@/utils/supabase'
import { MetricsGrid, SalesChart } from '@/components/dashboard'
import { useState } from 'react'

export default function DashboardPage() {
  const supabase = createBrowserClient()

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_metrics')
        .select('*')

      if (error) {
        console.error('Error fetching dashboard metrics:', error)
        return null
      }

      return data
    },
  })

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">Business Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Key performance indicators for your salon
            </p>
          </div>

          <div className="flex w-full gap-2 md:w-auto">
            <Select>
              <SelectTrigger className="bg-gradient-to-r from-pink-100 to-purple-100">
                <SelectValue placeholder="Envi Spa & Salon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="envi">Envi Spa & Salon</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="bg-gradient-to-r from-pink-100 to-purple-100">
                <SelectValue placeholder="Today" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">Current Month</SelectItem>
                <SelectItem value="custom">Custom Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <MetricsGrid data={data} loading={isLoading} />
        <Card className="bg-gradient-to-br from-white to-pink-50/50 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Sales Analytics</h3>
            <div className="flex gap-2">
              <Button variant="outline">Daily</Button>
              <Button variant="outline">Weekly</Button>
              <Button>Annual</Button>
            </div>
          </div>
          <SalesChart data={data?.[0]?.sales || []} />
        </Card>
      </div>
    </DashboardLayout>
  )
}
