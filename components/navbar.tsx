"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth"

export function Navbar() {
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold">
            Water Quality Monitor
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href="/dashboard/overview"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/dashboard/overview")
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                Overview
              </Link>
              <Link
                href="/dashboard/trends"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/dashboard/trends")
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                Trends
              </Link>
              <Link
                href="/dashboard/parameters"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/dashboard/parameters")
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                Parameters
              </Link>
              <Link
                href="/measurements/new"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActive("/measurements/new")
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                New Measurement
              </Link>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {isAuthenticated ? (
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/login?tab=signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
} 