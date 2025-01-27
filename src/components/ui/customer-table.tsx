'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Trash2, Search } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type BaseCustomer = {
  id: number
  name: string
  email: string
  phone1: string
  phone2?: string
  gender: 'male' | 'female' | 'other'
  dob: string
  anniversary_date?: string
  address: string
  pincode: string
}

type CustomerWithMetrics = BaseCustomer & {
  total_purchase_value: number
  visit_count: number
  last_visited_date: string | null
}

export function CustomerTable() {
  const supabase = createClientComponentClient()
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const pageSize = 10

  const fetchCustomers = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select(
        `
        id,
        name,
        email,
        phone1,
        phone2,
        gender,
        dob,
        anniversary_date,
        address,
        pincode
      `,
      )
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('created_at', { ascending: false })
      .or(
        searchTerm
          ? `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone1.ilike.%${searchTerm}%,dob.ilike.%${searchTerm}%`
          : '',
      )

    if (error) throw error

    // Fetch additional metrics separately
    const customersWithMetrics = await Promise.all(
      data.map(async (customer) => {
        const { data: purchaseData } = await supabase
          .from('purchases')
          .select('amount')
          .eq('customer_id', customer.id)

        const { data: appointmentData } = await supabase
          .from('appointments')
          .select('appointment_date')
          .eq('customer_id', customer.id)

        return {
          ...customer,
          total_purchase_value: purchaseData
            ? Number(
                purchaseData
                  .reduce((sum, item) => sum + (item.amount || 0), 0)
                  .toFixed(2),
              )
            : 0,
          visit_count: appointmentData ? appointmentData.length : 0,
          last_visited_date:
            appointmentData && appointmentData.length > 0
              ? new Date(
                  Math.max(
                    ...appointmentData.map((a) =>
                      new Date(a.appointment_date).getTime(),
                    ),
                  ),
                )
              : null,
        } as CustomerWithMetrics
      }),
    )

    return customersWithMetrics
  }

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers', page, searchTerm],
    queryFn: fetchCustomers,
  })

  const handleDeleteCustomer = async (customerId: number) => {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId)

    if (error) {
      console.error('Error deleting customer:', error)
      // TODO: Add toast notification
    } else {
      // Refetch customers or remove from local state
    }
  }

  if (isLoading) {
    return <div>Loading customers...</div>
  }

  return (
    <div>
      <div className="mb-4 flex items-center space-x-2">
        <div className="relative w-1/2">
          <Input
            type="text"
            placeholder="Search customers (Name, Mobile, Email, DOB)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Email ID</TableHead>
            <TableHead>DOB</TableHead>
            <TableHead>Anniversary Date</TableHead>
            <TableHead>Purchase Value</TableHead>
            <TableHead>Visit Count</TableHead>
            <TableHead>Last Visited Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers?.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>
                {customer.phone1}
                {customer.phone2 && <div>{customer.phone2}</div>}
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                {customer.dob ? format(new Date(customer.dob), 'PP') : '-'}
              </TableCell>
              <TableCell>
                {customer.anniversary_date
                  ? format(new Date(customer.anniversary_date), 'PP')
                  : '-'}
              </TableCell>
              <TableCell>
                ₹{customer.total_purchase_value?.toFixed(2) || '0.00'}
              </TableCell>
              <TableCell>{customer.visit_count || 0}</TableCell>
              <TableCell>
                {customer.last_visited_date
                  ? format(new Date(customer.last_visited_date), 'PP')
                  : '-'}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteCustomer(customer.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage(page + 1)}
          disabled={!customers || customers.length < pageSize}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
