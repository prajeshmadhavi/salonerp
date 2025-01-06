'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export default function ThemeInitializer({
  children,
}: {
  children: React.ReactNode
}) {
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    if (!resolvedTheme) {
      setTheme('dark')
    }
  }, [resolvedTheme, setTheme])

  return <>{children}</>
}
