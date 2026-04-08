"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: ("admin" | "customer")[]
}

export function ProtectedRoute({ children, allowedRoles = ["admin"] }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from cookies
        const cookies = document.cookie.split("; ")
        const tokenEntry = cookies.find((cookie) => cookie.startsWith("auth_token="))
        const token = tokenEntry?.split("=")[1]

        if (!token) {
          router.push(`/login?redirect=${pathname}`)
          return
        }

        // TODO: Verify token with backend and get user role
        // For demo, check token prefix
        let userRole: "admin" | "customer" | null = null
        if (token.startsWith("admin_")) {
          userRole = "admin"
        } else if (token.startsWith("user_")) {
          userRole = "customer"
        }

        if (!userRole || !allowedRoles.includes(userRole)) {
          router.push("/?error=access_denied")
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error("Auth check failed:", error)
        router.push(`/login?redirect=${pathname}`)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router, allowedRoles])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
