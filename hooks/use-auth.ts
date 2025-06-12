"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { getItem, setItem, removeItem } from "@/lib/storage"

const AUTH_STORAGE_KEY = "duralux_auth_user"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, pass: string) => Promise<boolean>
  signup: (name: string, email: string, pass: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const router = useRouter()

  React.useEffect(() => {
    const storedUser = getItem<User>(AUTH_STORAGE_KEY)
    if (storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Mock login: in a real app, this would be an API call
    if (email === "test@example.com" && pass === "password") {
      const mockUser: User = { id: "1", name: "Test User", email }
      setItem(AUTH_STORAGE_KEY, mockUser)
      setUser(mockUser)
      return true
    }
    return false
  }

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    // Mock signup
    const mockUser: User = { id: String(Date.now()), name, email }
    setItem(AUTH_STORAGE_KEY, mockUser)
    setUser(mockUser)
    return true
  }

  const logout = () => {
    removeItem(AUTH_STORAGE_KEY)
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
