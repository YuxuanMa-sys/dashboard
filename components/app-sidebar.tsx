"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BarChart3, ShoppingCart, FileInput } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import type { NavItem } from "@/types"
import { KpiSummary } from "./kpi-summary" // Import new component

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { title: "Form Submissions", href: "/dashboard/form-submissions", icon: FileInput },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r bg-background flex flex-col">
      <SidebarHeader className="p-3 sm:p-4 border-b h-14 sm:h-16 flex items-center">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/placeholder.svg?height=32&width=32" width={32} height={32} alt="Duralux Logo" />
          <span className="font-bold text-base sm:text-lg text-primary">DURALUX</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2 sm:p-3">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                variant={
                  pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard")
                    ? "default"
                    : "outline"
                }
                className={cn(
                  (pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard")) &&
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  <span className="text-sm sm:text-base">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <KpiSummary />
      </SidebarFooter>
    </Sidebar>
  )
}
