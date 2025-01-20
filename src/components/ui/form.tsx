'use client'

import * as React from 'react'
import {
  useFormContext,
  useController,
  SubmitHandler,
  FieldValues,
  UseFormReturn,
  Control,
  ControllerRenderProps,
  Path,
} from 'react-hook-form'

interface FormProps<T extends FieldValues> {
  children: React.ReactNode
  form: UseFormReturn<T>
  onSubmit: SubmitHandler<T>
  className?: string
}

export function Form<T extends FieldValues>({
  children,
  form,
  onSubmit,
  ...props
}: FormProps<T>) {
  return (
    <form {...props} onSubmit={form.handleSubmit(onSubmit)}>
      {children}
    </form>
  )
}

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>
  control: Control<T>
  render: ({ field }: { field: ControllerRenderProps<T> }) => React.ReactNode
}

export function FormField<T extends FieldValues>({
  name,
  control,
  render,
}: FormFieldProps<T>) {
  const { field } = useController({
    name,
    control,
  })

  return render({ field })
}

interface FormItemProps {
  children: React.ReactNode
}

export function FormItem({ children }: FormItemProps) {
  return <div className="space-y-2">{children}</div>
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
}

export function FormLabel({ children, ...props }: FormLabelProps) {
  return (
    <label className="text-sm font-medium leading-none" {...props}>
      {children}
    </label>
  )
}

interface FormControlProps {
  children: React.ReactNode
}

export function FormControl({ children }: FormControlProps) {
  return <>{children}</>
}

interface FormMessageProps {
  children?: React.ReactNode
}

export function FormMessage({ children }: FormMessageProps) {
  return <p className="text-sm font-medium text-destructive">{children}</p>
}
