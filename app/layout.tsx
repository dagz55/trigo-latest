import "@/app/globals.css"
import 'mapbox-gl/dist/mapbox-gl.css'
import { SupabaseProvider } from "@/components/supabase-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { UserProvider } from "@/contexts/user-context"
import { initializeDatabase } from '@/lib/init-db'
import type { Metadata } from 'next'

// Initialize database only on server side
if (typeof window === 'undefined') {
  initializeDatabase().catch(console.error)
}

export const metadata: Metadata = {
  title: "Trigo Ride Hailing",
  description: "Location-based TODA rider and dispatcher system",
  icons: {
    icon: "/images/trigo-logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SupabaseProvider>
            <UserProvider>
              {children}
              <Toaster />
            </UserProvider>
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
