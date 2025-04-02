import { createServerClient, type CookieOptions } from '@supabase/ssr' // Import from @supabase/ssr
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const origin = requestUrl.origin

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, // URL first
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Key second
      // Third argument is the options object
      {
        cookies: {
          async get(name: string) { // Make async
            const store = await cookieStore; // Await the promise
            return store.get(name)?.value
          },
          async set(name: string, value: string, options: CookieOptions) { // Make async
             const store = await cookieStore; // Await the promise
            store.set({ name, value, ...options })
          },
          async remove(name: string, options: CookieOptions) { // Make async
             const store = await cookieStore; // Await the promise
            store.delete({ name, ...options })
          },
        },
      }
    )
    try {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
            console.error("Error exchanging code for session:", error)
            // Redirect to an error page or show an error message
            return NextResponse.redirect(`${origin}/auth?error=Could not authenticate user&error_description=${encodeURIComponent(error.message)}`)
        }
    } catch (error: any) {
        console.error("Unexpected error during code exchange:", error)
        return NextResponse.redirect(`${origin}/auth?error=Server error during authentication&error_description=${encodeURIComponent(error.message || 'Unknown error')}`)
    }
  } else {
     console.warn("Auth callback called without a code parameter.")
     // Redirect back to auth page if no code is present
     return NextResponse.redirect(`${origin}/auth?error=Authentication failed&error_description=Missing authorization code.`)
  }

  // URL to redirect to after sign in process completes
  // TODO: Consider redirecting based on user role after fetching profile?
  // For now, redirecting to a generic dashboard or roles page might be safer.
  console.log("Auth callback successful, redirecting to /roles");
  return NextResponse.redirect(`${origin}/roles`) // Redirect to roles page to handle role-specific redirects
}
