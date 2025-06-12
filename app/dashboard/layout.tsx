"use client"

import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { AuthGuard } from "@/components/auth-guard"
import { SidebarProvider } from "@/components/ui/sidebar" // Import SidebarProvider

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthGuard>
      <SidebarProvider defaultOpen={true}>
        {" "}
        {/* Wrap the dashboard structure with SidebarProvider */}
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <DashboardHeader />
            <main className="flex-1 bg-muted/40">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
