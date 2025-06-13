"use client"

import Image from "next/image"
import Link from "next/link"
import { LogOut, UserPlus, LogInIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"
import { NotificationsDropdown } from "./notifications-dropdown" // Import new component
import { SearchDialog } from "./search-dialog" // Import new component

export function DashboardHeader() {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b bg-background px-3 sm:px-4 md:px-6">
      <SidebarTrigger className="md:hidden" />
      <div className="flex-1 min-w-0">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard" className="text-sm sm:text-base">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
        <SearchDialog />
        <NotificationsDropdown />

        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-10 sm:w-10">
                <Image
                  src={`/placeholder.svg?height=32&width=32&text=${user?.name?.charAt(0) || "U"}`}
                  width={32}
                  height={32}
                  alt={user?.name || "User avatar"}
                  className="rounded-full h-6 w-6 sm:h-8 sm:w-8"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56">
              <DropdownMenuLabel className="text-sm sm:text-base">{user?.name || "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm">Profile</DropdownMenuItem>
              <DropdownMenuItem className="text-sm">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="outline" size="sm" asChild className="h-8 px-2 sm:h-9 sm:px-3">
              <Link href="/login">
                <LogInIcon className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Login</span>
              </Link>
            </Button>
            <Button size="sm" asChild className="h-8 px-2 sm:h-9 sm:px-3">
              <Link href="/signup">
                <UserPlus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Sign Up</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
