"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, FileText, Home, X } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Form Submissions", href: "/dashboard/form-submissions", icon: FileText },
]

interface AppSidebarProps {
  onClose?: () => void
}

export function AppSidebar({ onClose }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-xl">
      <div className="flex flex-1 flex-col min-h-0">
        <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
          <h1 className="text-white text-xl font-semibold">Laguna Dashboard</h1>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-r-2 border-indigo-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                  } group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200`}
                >
                  <item.icon
                    className={`${
                      isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-600"
                    } mr-3 flex-shrink-0 h-5 w-5 transition-colors`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              © 2024 Laguna Dashboard
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 