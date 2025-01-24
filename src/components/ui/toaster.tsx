'use client'

import * as React from 'react'
import { ToastProvider as RadixToastProvider } from '@radix-ui/react-toast'

export function Toaster() {
  return <RadixToastProvider>{/* Toast implementation */}</RadixToastProvider>
}
