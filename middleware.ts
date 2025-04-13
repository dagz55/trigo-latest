import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Create the response object first
  let response = NextResponse.next({
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
          // Set cookie on the request object for potential use in later middleware/handlers
          req.cookies.set({ name, value, ...options })
          // **Crucially, set the cookie on the response object that will be sent back to the browser**
          response = NextResponse.next({ // Create response to modify
            request: { headers: req.headers },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // Delete cookie from request
          req.cookies.set({ name, value: '', ...options })
          // **Crucially, delete the cookie on the response object**
          response = NextResponse.next({ // Create response to modify
            request: { headers: req.headers },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session if expired - This will automatically handle setting/removing cookies via the handlers above
  await supabase.auth.getUser()

  // Optional: Check auth for protected routes - Example using getUser()
  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
  //   const redirectUrl = req.nextUrl.clone()
  //   redirectUrl.pathname = '/auth'
  //   return NextResponse.redirect(redirectUrl)
  // }

  // Return the potentially modified response object
  return response
}

export const config = {
  matcher: [
    // Apply this middleware to all routes except static files and api routes that don't need auth
    "/((?!_next/static|_next/image|favicon.ico|api/public).*)",
  ],
}
