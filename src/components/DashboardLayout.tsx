'use client'

import * as React from 'react'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Package,
  FileText,
  ClipboardList,
  User,
} from 'lucide-react'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/tailwind'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ProfileDropdown from '@/components/ProfileDropdown'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const sidebarNavItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      title: 'Appointment',
      href: '/appointments',
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: 'Master',
      icon: <Users className="h-4 w-4" />,
      subItems: [
        {
          title: 'Staff',
          href: '/staff',
          icon: <Users className="h-4 w-4" />,
        },
        {
          title: 'Customers',
          href: '/customers',
          icon: <User className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'Inventory',
      href: '/dashboard/inventory',
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: 'Invoice',
      href: '/dashboard/invoice',
      icon: <FileText className="h-4 w-4" />,
      subItems: [
        {
          title: 'Sales',
          href: '/dashboard/invoice/sales',
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: 'Sales Return',
          href: '/dashboard/invoice/sales-return',
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: 'Purchase',
          href: '/dashboard/invoice/purchase',
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: 'Purchase Return',
          href: '/dashboard/invoice/purchase-return',
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: 'Transfer In',
          href: '/dashboard/invoice/transfer-in',
          icon: <FileText className="h-4 w-4" />,
        },
        {
          title: 'Transfer Out',
          href: '/dashboard/invoice/transfer-out',
          icon: <FileText className="h-4 w-4" />,
        },
      ],
    },
    {
      title: 'Reports',
      href: '/dashboard/reports',
      icon: <ClipboardList className="h-4 w-4" />,
    },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Mobile Nav */}
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              {sidebarNavItems.map((item) => (
                <NavItem key={item.href} item={item} pathname={pathname} />
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center justify-between">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <ProfileDropdown />
        </div>
      </header>

      {/* Desktop Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden border-r bg-muted/40 md:block md:w-[220px] lg:w-[280px]">
          <ScrollArea className="h-full">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-[60px] items-center border-b px-6">
                <h2 className="text-lg font-semibold tracking-tight">
                  Salon ERP
                </h2>
              </div>
              <nav className="grid items-start px-4 text-sm font-medium">
                {sidebarNavItems.map((item, index) => (
                  <NavItem
                    key={item.href || `nav-item-${index}`}
                    item={item}
                    pathname={pathname}
                  />
                ))}
              </nav>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({ item, pathname }: { item: any; pathname: string }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const isActive = pathname === item.href

  if (item.subItems) {
    return (
      <div className="w-full">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary',
            isActive && 'bg-muted text-primary',
          )}
        >
          {item.icon}
          {item.title}
          <ChevronRightIcon
            className={cn(
              'ml-auto h-4 w-4 transition-transform duration-200',
              isOpen && 'rotate-90',
            )}
          />
        </Button>
        <div
          className={cn(
            'overflow-hidden transition-all duration-200 ease-in-out',
            isOpen ? 'max-h-96' : 'max-h-0',
          )}
        >
          <div className="space-y-1 pl-8 pt-1">
            {item.subItems.map((subItem: any, subIndex: number) => (
              <Link
                key={subItem.href || `${item.title}-subitem-${subIndex}`}
                href={subItem.href}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/50',
                  pathname === subItem.href && 'bg-accent/50 text-primary',
                )}
              >
                {subItem.icon && subItem.icon}
                {subItem.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (item.onClick) {
    return (
      <button
        onClick={item.onClick}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
          isActive && 'bg-muted text-primary',
        )}
      >
        {item.icon}
        {item.title}
      </button>
    )
  }

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
        isActive && 'bg-muted text-primary',
      )}
    >
      {item.icon}
      {item.title}
    </Link>
  )
}
