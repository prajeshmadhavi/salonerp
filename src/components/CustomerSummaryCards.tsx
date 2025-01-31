'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserCheck, UserX } from 'lucide-react'

export function CustomerSummaryCards() {
  const [summaryData, setSummaryData] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    inactiveCustomers: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchSummaryData() {
      try {
        const supabase = createClientComponentClient()

        // Total Customers
        const { count: totalCustomers, error: totalError } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })

        // Active Customers (assuming active means they have made a purchase or appointment recently)
        const { count: activeCustomers, error: activeError } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .gte(
            'last_activity_at',
            new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          )

        // Inactive Customers
        const { count: inactiveCustomers, error: inactiveError } =
          await supabase
            .from('customers')
            .select('*', { count: 'exact', head: true })
            .lt(
              'last_activity_at',
              new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            )

        if (totalError || activeError || inactiveError) {
          throw new Error('Error fetching customer summary')
        }

        setSummaryData({
          totalCustomers: totalCustomers ?? 0,
          activeCustomers: activeCustomers ?? 0,
          inactiveCustomers: inactiveCustomers ?? 0,
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch customer summary:', error)
        setIsLoading(false)
      }
    }

    fetchSummaryData()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <div className="h-4 w-4 rounded-full bg-gray-200"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 rounded bg-gray-200 text-2xl font-bold"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summaryData.totalCustomers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Customers
          </CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summaryData.activeCustomers}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Inactive Customers
          </CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summaryData.inactiveCustomers}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
