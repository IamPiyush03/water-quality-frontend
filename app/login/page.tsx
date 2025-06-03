"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { setAuthToken } from "@/lib/auth"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [defaultTab, setDefaultTab] = useState("login")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "signup") {
      setDefaultTab("signup")
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    console.log("Attempting login with username:", username)

    try {
      const response = await fetch("http://localhost:8000/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
      })

      if (!response.ok) {
        console.error("Login failed with status:", response.status)
        const errorData = await response.json()
        console.error("Error data:", errorData)
        throw new Error(errorData.detail || "Invalid credentials")
      }

      const data = await response.json()
      console.log("Login successful. Received token:", data.access_token)
      setAuthToken(data.access_token)
      console.log("Token stored in localStorage:", localStorage.getItem('token'))
      toast.success("Login successful")
      router.push("/dashboard/overview")
    } catch (error) {
      console.error("Login error:", error)
      toast.error((error as Error).message || "Invalid username or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("Attempting signup with username:", username)

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username,
          email,
          password 
        }),
      })

      if (!response.ok) {
         console.error("Signup failed with status:", response.status)
         const errorData = await response.json()
         console.error("Error data:", errorData)
        throw new Error(errorData.detail || "Registration failed")
      }

      console.log("Signup successful.")
      toast.success("Registration successful. Please login.")
      setDefaultTab("login")
    } catch (error) {
      console.error("Signup error:", error)
      toast.error((error as Error).message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <Tabs defaultValue={defaultTab} className="w-full" value={defaultTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" onClick={() => setDefaultTab("login")}>Login</TabsTrigger>
            <TabsTrigger value="signup" onClick={() => setDefaultTab("signup")}>Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex flex-col gap-2">
                <h4 className="text-2xl font-bold">Login</h4>
                <p className="text-sm text-muted-foreground">
                  Login to your account to continue
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Username"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  required
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="flex flex-col gap-2">
                <h4 className="text-2xl font-bold">Sign up</h4>
                <p className="text-sm text-muted-foreground">
                  Sign up to create an account
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  name="username"
                  placeholder="Username"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  placeholder="Email"
                  type="email"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  placeholder="Password"
                  type="password"
                  required
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Signing up..." : "Sign up"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 