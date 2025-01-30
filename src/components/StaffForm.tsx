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
      <Dialog
        modal={true}
        onOpenChange={(open) => {
          if (!open) {
            const target = document.querySelector('.rdp-calendar')
            if (target?.contains(document.activeElement)) {
              return false
            }
          }
          return true
        }}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          onPointerDownOutside={(e) => {
            const target = e.target as HTMLElement
            if (target.closest('.rdp')) {
              e.preventDefault()
            }
          }}
        >
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
