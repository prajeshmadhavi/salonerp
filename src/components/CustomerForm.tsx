'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { CustomerFormContent } from './ui/customer-form-content'
import { useToast } from './ui/use-toast'
import { Toaster } from './ui/toaster'
import { ToastProvider } from './ui/use-toast'

export function CustomerForm({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
          </DialogHeader>
          <CustomerFormContent />
        </DialogContent>
      </Dialog>
      <Toaster />
    </ToastProvider>
  )
}
