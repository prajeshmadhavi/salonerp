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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('id, service_name')
          .order('service_name', { ascending: true })

        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('id, name')
          .order('name', { ascending: true })

        if (servicesError || staffError) {
          console.error('Supabase errors:', { servicesError, staffError })
          throw new Error(servicesError?.message || staffError?.message)
        }

        console.log('Fetched services:', servicesData)
        console.log('Fetched staff:', staffData)

        const mappedServices =
          servicesData?.map((s) => ({
            id: s.id,
            name: s.service_name,
          })) || []

        const mappedStaff =
          staffData?.map((staffMember) => ({
            id: staffMember.id,
            name: staffMember.name,
          })) || []

        console.log('Mapped services:', mappedServices)
        console.log('Mapped staff:', mappedStaff)

        setServices(mappedServices)
        setStaff(mappedStaff)

        if (!mappedStaff.length) {
          setError('No staff members found. Please add staff members first.')
        }
        if (!mappedServices.length) {
          setError('No services found. Please add services first.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(
          error instanceof Error ? error.message : 'Failed to fetch data',
        )
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [supabase])

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
