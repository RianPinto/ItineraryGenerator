"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  const login = (token: string) => {
    localStorage.setItem("authToken", token)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userId")
    localStorage.clear()
    setIsAuthenticated(false)
    router.push("/auth")
  }

  return { isAuthenticated, isLoading, login, logout }
}
