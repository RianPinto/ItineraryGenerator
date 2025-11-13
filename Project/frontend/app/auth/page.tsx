"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { apiFetch } from "../lib/api"

type AuthData = {
  username: string
  password: string
}

export default function AuthPage() {
  const [registerData, setRegisterData] = useState<AuthData>({ username: "", password: "" })
  const [loginData, setLoginData] = useState<AuthData>({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = await apiFetch("http://localhost:8090/api/auth/register", {
        method: "POST",
        body: JSON.stringify(registerData),
      })
      console.log("✅ Register success:", data)
      alert("Registration successful! Please log in.")
    } catch (err: any) {
      console.error("❌ Register error:", err)
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = await apiFetch<{ token: string }>("http://localhost:8090/api/auth/login", {
        method: "POST",
        body: JSON.stringify(loginData),
      })
      console.log("✅ Login success:", data)

      if (data.token) {
        login(data.token)

        localStorage.setItem("userId",data.userId)
        router.push("/")
      }
    } catch (err: any) {
      console.error("❌ Login error:", err)
      alert(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-primary text-primary-foreground shadow-sm">
        <Navbar />
      </header>

      <main className="flex-1">
        <section className="container mx-auto max-w-xl px-4 py-10 md:py-14">
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-semibold">Welcome to TravelMate</h1>
            <p className="text-muted-foreground mt-2">
              Create an account or sign in to access your itineraries.
            </p>
          </div>

          <Tabs defaultValue="register" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>

            <TabsContent value="register" className="mt-6">
              <form className="grid gap-4" onSubmit={handleRegister}>
                <Field
                  id="register-username"
                  label="Username"
                  value={registerData.username}
                  onChange={(v) => setRegisterData({ ...registerData, username: v })}
                />
                <Field
                  id="register-password"
                  label="Password"
                  type="password"
                  value={registerData.password}
                  onChange={(v) => setRegisterData({ ...registerData, password: v })}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="login" className="mt-6">
              <form className="grid gap-4" onSubmit={handleLogin}>
                <Field
                  id="login-username"
                  label="Username"
                  value={loginData.username}
                  onChange={(v) => setLoginData({ ...loginData, username: v })}
                />
                <Field
                  id="login-password"
                  label="Password"
                  type="password"
                  value={loginData.password}
                  onChange={(v) => setLoginData({ ...loginData, password: v })}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <p className="text-center text-muted-foreground mt-6">
            Prefer exploring first?{" "}
            <Link className="underline underline-offset-4" href="/landing">
              Visit landing page
            </Link>
          </p>
        </section>
      </main>
    </div>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} type={type} required />
    </div>
  )
}
