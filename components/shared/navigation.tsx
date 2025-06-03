"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Droplets, Menu } from "lucide-react"
import { useAuth } from "@/lib/auth"

export function Navigation() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Droplets className="h-5 w-5 text-primary" />
          <span>Water Quality Monitor</span>
        </Link>

        <div className="hidden md:flex items-center space-x-1 mx-6">
          {isAuthenticated && (
            <>
              <Link href="/dashboard/overview" className="px-3 py-2 text-sm rounded-md hover:bg-accent">
                Dashboard
              </Link>
              <Link href="/measurements/new" className="px-3 py-2 text-sm rounded-md hover:bg-accent">
                New Measurement
              </Link>
              <Link href="/dashboard/trends" className="px-3 py-2 text-sm rounded-md hover:bg-accent">
                Trends
              </Link>
              <Link href="/dashboard/parameters" className="px-3 py-2 text-sm rounded-md hover:bg-accent">
                Parameters
              </Link>
            </>
          )}
        </div>

        <div className="md:hidden ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAuthenticated ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/overview">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/measurements/new">New Measurement</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/trends">Trends</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/parameters">Parameters</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href="/login">Login</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          {isAuthenticated ? (
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}
