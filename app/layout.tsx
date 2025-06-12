import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/hooks/use-auth"
import { NotificationsProvider } from "@/hooks/use-notifications" // Import NotificationsProvider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Duralux Dashboard",
  description: "Data Analysis Dashboard",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <NotificationsProvider>
              {" "}
              {/* Wrap with NotificationsProvider */}
              {children}
            </NotificationsProvider>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
