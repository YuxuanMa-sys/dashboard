"use client"

import type * as React from "react"
// import { useRouter, usePathname } from "next/navigation" // No longer needed for redirection
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth()
  // const router = useRouter() // No longer needed for redirection
  // const pathname = usePathname() // No longer needed for redirection

  // React.useEffect(() => {
  //   // If dashboard should be public, remove redirection logic
  //   // if (!isLoading && !isAuthenticated && pathname.startsWith("/dashboard")) {
  //   //   router.push("/login")
  //   // }
  // }, [isAuthenticated, isLoading, router, pathname])

  if (isLoading) {
    // This loading state is primarily for when auth state is initially checked.
    // If the dashboard is public, we might not need to show a full-screen loader here,
    // unless specific authenticated content within the children needs it.
    // For now, keeping a simple loader if auth is still loading.
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Since dashboard is public, we just render children.
  // Specific components within children can check `isAuthenticated` if they need to behave differently.
  return <>{children}</>
}
