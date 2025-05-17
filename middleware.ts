import { getRoleBasedRedirectPath } from '@/lib/utils'; // Import the helper
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // If the cookie is set, update the request and response cookies
            req.cookies.set({ name, value, ...options })
            response = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            response.cookies.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            // If the cookie is removed, update the request and response cookies
            req.cookies.set({ name, value: '', ...options })
            response = NextResponse.next({
              request: {
                headers: req.headers,
              },
            })
            response.cookies.set({ name, value: '', ...options })
          },
        },
      }
    )

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error("Error getting session in middleware:", sessionError);
      // Decide how to handle session errors - potentially allow access or redirect to an error page?
      return response; 
    }
    const user = sessionData.session?.user;

    const currentPath = req.nextUrl.pathname;

    // --- Logic for Authenticated Users ---
    if (user) {
      // If authenticated user is trying to access auth page, redirect them to their dashboard
      if (currentPath === '/auth' || currentPath === '/login') { // Assuming /login might also exist
        // Fetch user profile to get the role
        const { data: profile, error: profileError } = await supabase
          .from('profiles') // Make sure 'profiles' is your table name
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile in middleware:", profileError);
          // Redirect to a generic dashboard or home if profile fails
          const redirectUrl = req.nextUrl.clone();
          redirectUrl.pathname = '/'; // Or a generic dashboard
          return NextResponse.redirect(redirectUrl);
        }

        const redirectPath = getRoleBasedRedirectPath(profile?.role);
        console.log(`Authenticated user on ${currentPath}, redirecting to ${redirectPath}`);
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = redirectPath;
        return NextResponse.redirect(redirectUrl);
      }
      
      // Allow authenticated users to access any other page (including protected ones)
      // Note: Role-based access *within* protected routes should be handled 
      // by the specific page/layout components, not typically in middleware.
      return response;
    }

    // --- Logic for Unauthenticated Users ---
    const isProtectedRoute = 
      currentPath.startsWith('/passenger/dashboard') ||
      currentPath.startsWith('/trider/dashboard') ||
      currentPath.startsWith('/dispatcher/dashboard') ||
      currentPath.startsWith('/admin/dashboard') ||
      currentPath === '/dashboard' ||
      currentPath === '/profile'; // Added /profile as likely protected

    // If unauthenticated user tries to access a protected route, redirect to /auth
    if (isProtectedRoute) {
      console.log(`Unauthenticated access attempt to ${currentPath}, redirecting to /auth`);
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/auth';
      // Preserve cookies set by getSession
      const redirectResponse = NextResponse.redirect(redirectUrl);
      const sessionCookie = response.cookies.get('sb-access-token'); // Example cookie name, adjust if needed
      if (sessionCookie) redirectResponse.cookies.set(sessionCookie);
      return redirectResponse;
    }

    // Allow unauthenticated users to access public routes
    return response;

  } catch (error) {
    console.error('Error in middleware:', error)
    // Fallback: allow request to proceed but log error
    return response 
  }
}

export const config = {
  matcher: [
    // Apply this middleware to all routes except static files and api routes that don't need auth
    "/((?!_next/static|_next/image|favicon.ico|api/public).*)",
  ],
}
