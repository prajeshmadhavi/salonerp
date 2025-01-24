'use client'

import * as React from 'react'
import { Check, X } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const toastVariants = cva(
  'fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg transition-all',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        success: 'bg-green-50 text-green-900 border-green-200',
        error: 'bg-red-50 text-red-900 border-red-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string
  description?: string
}

function Toast({
  className,
  variant,
  title,
  description,
  ...props
}: ToastProps) {
  return (
    <div className={cn(toastVariants({ variant }), className)} {...props}>
      <div className="flex items-start space-x-4">
        {variant === 'success' && (
          <Check className="h-6 w-6 flex-shrink-0 text-green-500" />
        )}
        {variant === 'error' && (
          <X className="h-6 w-6 flex-shrink-0 text-red-500" />
        )}
        <div className="flex-1">
          {title && <p className="font-medium">{title}</p>}
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

interface ToastContextType {
  toast: (props: ToastProps) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const toast = React.useCallback((props: ToastProps) => {
    setToasts((prev) => [...prev, props])
    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.map((toast, index) => (
        <Toast key={index} {...toast} />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
