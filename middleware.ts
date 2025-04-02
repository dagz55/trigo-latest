import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next({ // Re-create response to apply cookie changes
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res = NextResponse.next({ // Re-create response to apply cookie changes
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - important to do before potentially checking session below
  await supabase.auth.getUser() // Using getUser() is often sufficient in middleware for session refresh

  // Optional: Check auth for protected routes - Example using getUser()
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
  //   const redirectUrl = req.nextUrl.clone()
  //   redirectUrl.pathname = '/auth'
  //   return NextResponse.redirect(redirectUrl)
  // }

  return res
}

export const config = {
  matcher: [
    // Apply this middleware to all routes except static files and api routes that don't need auth
    "/((?!_next/static|_next/image|favicon.ico|api/public).*)",
  ],
}
