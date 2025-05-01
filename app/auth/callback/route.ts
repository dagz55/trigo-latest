import { createServerClient, type CookieOptions } from '@supabase/ssr'; // Import from @supabase/ssr
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (!code) {
    console.warn("Auth callback called without a code parameter.");
    // Redirect back to auth page if no code is present
    return NextResponse.redirect(`${origin}/auth?error=Authentication failed&error_description=Missing authorization code.`);
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );

  try {
    // Exchange the code for a session
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    if (sessionError) {
      console.error("Error exchanging code for session:", sessionError);
      return NextResponse.redirect(`${origin}/auth?error=Could not authenticate user&error_description=${encodeURIComponent(sessionError.message)}`);
    }

    // Get the user data after exchanging code for session
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("Error getting user data:", userError);
      return NextResponse.redirect(`${origin}/auth?error=Authentication failed&error_description=User not found after authentication.`);
    }

    // Get the user's profile to determine the role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();
      
    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return NextResponse.redirect(`${origin}/auth?error=Authentication failed&error_description=Could not determine user role.`);
    }
    
    // Determine redirect path based on role
    let redirectPath = "/dashboard"; // Default redirect
    if (profile.role === "passenger") {
      redirectPath = "/passenger/dashboard";
    } else if (profile.role === "rider") {
      redirectPath = "/trider/dashboard";
    } else if (profile.role === "dispatcher") {
      redirectPath = "/dispatcher/dashboard";
    } else if (profile.role === "admin") {
      redirectPath = "/admin/dashboard";
    }
    
    console.log(`Auth callback successful, redirecting to ${redirectPath}`);
    return NextResponse.redirect(`${origin}${redirectPath}`);
  } catch (error: any) {
    console.error("Unexpected error during authentication:", error);
    return NextResponse.redirect(`${origin}/auth?error=Server error during authentication&error_description=${encodeURIComponent(error.message || 'Unknown error')}`);
  }
}
