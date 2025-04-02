"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { User, LogOut } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useUser()

  // Don't show header on auth page
  if (pathname === "/auth") {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center -space-x-1">
              <div className="h-9 w-9 flex items-center justify-center">
                <img src="/images/trigologo1.png" alt="Trigo Logo" className="h-9 w-auto" />
              </div>
              <span className="font-bold text-lg">
                <span className="text-black dark:text-white">Tri</span>
                <span className="text-primary">Go</span>
              </span>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            {user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="gap-2" onClick={() => logout()}>
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

