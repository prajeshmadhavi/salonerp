'use client'

import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useState } from 'react'

// Mock data - replace with actual data fetching later
const MOCK_STAFF_DATA = [
  {
    staffNumber: 'ST001',
    phoneNumber: '123-456-7890',
    service: 'Haircut',
    product: 'Hair Gel',
    packageService: 'Monthly Styling',
    total: 1500,
  },
  {
    staffNumber: 'ST002',
    phoneNumber: '987-654-3210',
    service: 'Coloring',
    product: 'Hair Dye',
    packageService: 'Color Maintenance',
    total: 2000,
  },
  {
    staffNumber: 'ST003',
    phoneNumber: '456-789-0123',
    service: 'Styling',
    product: 'Styling Cream',
    packageService: 'Weekly Styling',
    total: 1750,
  },
]

export function StaffTable() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredStaff = MOCK_STAFF_DATA.filter(
    (staff) =>
      staff.staffNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search Staff by Name/Phone Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Staff Number</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Service</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Package Service</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStaff.map((staff, index) => (
            <TableRow key={index}>
              <TableCell>{staff.staffNumber}</TableCell>
              <TableCell>{staff.phoneNumber}</TableCell>
              <TableCell>{staff.service}</TableCell>
              <TableCell>{staff.product}</TableCell>
              <TableCell>{staff.packageService}</TableCell>
              <TableCell>${staff.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
