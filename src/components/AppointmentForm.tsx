'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { DayPickerCalendar } from '@/components/ui/day-picker-calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface AppointmentFormValues {
  name: string
  phone: string
  gender: 'Male' | 'Female' | 'Other'
  appointmentDate: Date
  appointmentTime: string
  reportDate: Date
  advancedPaid: number
  isCancelled: boolean
  isDone: boolean
  serviceId: string
  staffId: string
}

export function AppointmentForm() {
  const supabase = createClientComponentClient()
  const { register, handleSubmit, watch, setValue } =
    useForm<AppointmentFormValues>({
      defaultValues: {
        appointmentDate: new Date(),
        reportDate: new Date(),
        isCancelled: false,
        isDone: false,
        advancedPaid: 0,
      },
    })
  const [services, setServices] = useState<{ id: string; name: string }[]>([])
  const [staff, setStaff] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    async function fetchData() {
      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .returns<{ id: string; name: string }[]>()

      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('*')
        .returns<{ id: string; name: string }[]>()

      if (!servicesError && servicesData) {
        setServices(servicesData)
      }
      if (!staffError && staffData) {
        setStaff(staffData)
      }
    }
    fetchData()
  }, [])

  async function onSubmit(values: AppointmentFormValues) {
    try {
      const { error } = await supabase.from('appointments').insert([values])
      if (error) throw error
      // Handle success
    } catch (error) {
      // Handle error
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label>Name</label>
          <Input {...register('name')} placeholder="Enter name" />
        </div>

        <div className="space-y-2">
          <label>Phone Number</label>
          <Input {...register('phone')} placeholder="Enter phone number" />
        </div>

        <div className="space-y-2">
          <label>Gender</label>
          <Select
            onValueChange={(value: 'Male' | 'Female' | 'Other') =>
              setValue('gender', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label>Appointment Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {watch('appointmentDate')?.toLocaleDateString() ||
                  'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <DayPickerCalendar
                mode="single"
                selected={watch('appointmentDate')}
                onSelect={(date) => date && setValue('appointmentDate', date)}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label>Appointment Time</label>
          <Input type="time" {...register('appointmentTime')} />
        </div>

        <div className="space-y-2">
          <label>Report Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                {watch('appointmentDate')?.toLocaleDateString() ||
                  'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <DayPickerCalendar
                mode="single"
                selected={watch('appointmentDate')}
                onSelect={(date) => date && setValue('appointmentDate', date)}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label>Advanced Paid</label>
          <Input type="number" {...register('advancedPaid')} />
        </div>

        <div className="space-y-2">
          <label>Appointment Cancelled?</label>
          <Select
            onValueChange={(value) => setValue('isCancelled', value === 'Yes')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label>Appointment Done?</label>
          <Select
            onValueChange={(value) => setValue('isDone', value === 'Yes')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label>Service</label>
          <Select onValueChange={(value) => setValue('serviceId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label>Staff</label>
          <Select onValueChange={(value) => setValue('staffId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select staff" />
            </SelectTrigger>
            <SelectContent>
              {staff.map((staffMember) => (
                <SelectItem key={staffMember.id} value={staffMember.id}>
                  {staffMember.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit">Add Appointment</Button>
    </form>
  )
}
