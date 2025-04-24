import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Create a server-side Supabase client for use in Server Actions and Route Handlers
export function createServerActionClient() {
  const cookieStore = cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase URL or key in environment variables");
    throw new Error("Missing Supabase configuration");
  }
  
  // Create client with admin privileges when using service role key
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      // Pass the cookies to the Supabase client
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });
}

// Create admin client that bypasses RLS policies 
// (only use for admin operations where RLS should be ignored)
export function createServerAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase URL or Service Role Key in environment variables");
    throw new Error("Missing Supabase admin configuration");
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
} 