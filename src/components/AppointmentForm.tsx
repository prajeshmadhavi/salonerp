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

interface ServiceStaffPair {
  serviceId: string
  staffId: string
}

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
  serviceStaffPairs: ServiceStaffPair[]
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
  const [serviceStaffPairs, setServiceStaffPairs] = useState<
    ServiceStaffPair[]
  >([{ serviceId: '', staffId: '' }])

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

        <div className="col-span-2 space-y-2">
          {serviceStaffPairs.map((pair, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_1fr_auto] items-end gap-2"
            >
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Service</label>
                <Select
                  value={pair.serviceId}
                  onValueChange={(value) => {
                    const newPairs = [...serviceStaffPairs]
                    newPairs[index].serviceId = value
                    setServiceStaffPairs(newPairs)
                    setValue(`serviceStaffPairs.${index}.serviceId`, value)
                  }}
                >
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

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Staff</label>
                <Select
                  value={pair.staffId}
                  onValueChange={(value) => {
                    const newPairs = [...serviceStaffPairs]
                    newPairs[index].staffId = value
                    setServiceStaffPairs(newPairs)
                    setValue(`serviceStaffPairs.${index}.staffId`, value)
                  }}
                >
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

              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  const newPairs = serviceStaffPairs.filter(
                    (_, i) => i !== index,
                  )
                  setServiceStaffPairs(newPairs)
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-50"
            onClick={() =>
              setServiceStaffPairs([
                ...serviceStaffPairs,
                { serviceId: '', staffId: '' },
              ])
            }
          >
            Add Service
          </Button>
        </div>
      </div>
    </form>
  )
}
