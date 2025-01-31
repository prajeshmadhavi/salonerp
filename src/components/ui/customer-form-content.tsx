'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import * as z from 'zod'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

const customerFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  phone1: z.string().min(10, {
    message: 'Phone number must be at least 10 digits.',
  }),
  phone2: z
    .string()
    .min(10, {
      message: 'Phone number must be at least 10 digits.',
    })
    .optional(),
  gender: z.enum(['male', 'female', 'other']),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  dob: z.string().refine(
    (val) => {
      try {
        new Date(val)
        return true
      } catch {
        return false
      }
    },
    {
      message: 'Invalid date format',
    },
  ),
  anniversaryDate: z.string().optional(),
  address: z.string().min(5, {
    message: 'Address must be at least 5 characters.',
  }),
  pincode: z.string().regex(/^\d{6}$/, {
    message: 'Pincode must be exactly 6 digits',
  }),
})

type CustomerFormValues = z.infer<typeof customerFormSchema>

interface CustomerFormContentProps {
  onSuccess?: () => void
}

export function CustomerFormContent({ onSuccess }: CustomerFormContentProps) {
  const { toast } = useToast()
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      phone1: '',
      phone2: '',
      gender: 'male',
      email: '',
      dob: new Date().toISOString(),
      anniversaryDate: undefined,
      address: '',
      pincode: '',
    },
  })

  const onSubmit: SubmitHandler<CustomerFormValues> = async (data) => {
    try {
      const supabase = createClientComponentClient()
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        throw new Error('You must be logged in to add customer')
      }

      const { error } = await supabase.from('customers').insert({
        name: data.name,
        email: data.email,
        phone1: data.phone1,
        phone2: data.phone2,
        gender: data.gender,
        dob: data.dob,
        anniversary_date: data.anniversaryDate,
        address: data.address,
        pincode: data.pincode,
        UID: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_activity_at: new Date().toISOString(),
      })

      if (error) throw new Error(error.message)

      toast({
        title: 'Customer Added Successfully',
        description: `${data.name} has been added to the customer database.`,
      })

      // Reset form and close modal
      form.reset()
      if (onSuccess) onSuccess()
    } catch (error) {
      toast({
        title: 'Error Adding Customer',
        description:
          error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'default',
      })
    }
  }

  return (
    <Form {...form} form={form} onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Customer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Phone</FormLabel>
              <FormControl>
                <Input placeholder="Primary phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary Phone</FormLabel>
              <FormControl>
                <Input placeholder="Secondary phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="dob"
            render={({ field }) => {
              const dateValue = field.value ? new Date(field.value) : undefined
              return (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        dateValue ? dateValue.toISOString().split('T')[0] : ''
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : undefined
                        field.onChange(date?.toISOString() || '')
                      }}
                      max={new Date().toISOString().split('T')[0]}
                      min="1900-01-01"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="anniversaryDate"
            render={({ field }) => {
              const dateValue = field.value ? new Date(field.value) : undefined
              return (
                <FormItem>
                  <FormLabel>Anniversary Date</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      value={
                        dateValue ? dateValue.toISOString().split('T')[0] : ''
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value)
                          : undefined
                        field.onChange(date?.toISOString() || '')
                      }}
                      max={new Date().toISOString().split('T')[0]}
                      min="1900-01-01"
                      placeholder="Optional"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </div>
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Full address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="pincode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pincode</FormLabel>
              <FormControl>
                <Input placeholder="6-digit pincode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-2">
          <Button type="submit" className="w-full">
            Add Customer
          </Button>
        </div>
      </div>
    </Form>
  )
}
