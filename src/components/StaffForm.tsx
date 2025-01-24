'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { StaffFormContent } from './ui/staff-form-content'
import { useToast } from './ui/use-toast'
import { Toaster } from './ui/toaster'
import { ToastProvider } from './ui/use-toast'

export function StaffForm({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
          </DialogHeader>
          <StaffFormContent />
        </DialogContent>
      </Dialog>
      <Toaster />
    </ToastProvider>
  )
}
