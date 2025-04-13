import "@/app/globals.css"
// Import Mapbox CSS globally
import { SupabaseProvider } from "@/components/supabase-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { UserProvider } from "@/contexts/user-context"
import { initializeDatabase } from '@/lib/init-db'
import 'mapbox-gl/dist/mapbox-gl.css'
import type React from "react"

// Initialize database when app starts
initializeDatabase().catch(console.error)

export const metadata = {
  title: "Trigo Ride Hailing",
  description: "Location-based TODA rider and dispatcher system",
  icons: {
    icon: [
      {
        url: "/images/trigologo1.png",
        href: "/images/trigologo1.png",
      },
    ],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/trigologo1.png" />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SupabaseProvider>
            <UserProvider>{children}</UserProvider>
          </SupabaseProvider>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
