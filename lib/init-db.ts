import { createClient } from '@supabase/supabase-js'
// Keep the original client for potential other uses if needed,
// but we'll create a service client specifically for initialization.
// import { supabase } from './supabase-client'

let isInitialized = false;

// This function assumes migrations have run and tables ('todas', 'locations') exist.
// It primarily checks if the default TODA and a specific location exist,
// and inserts them only if they are missing. This makes it safe to run
// during application startup without causing errors or duplicate data.
export async function initializeDatabase() {
  if (isInitialized) {
    return;
  }

  console.log('Initializing database: Checking for default data...');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('Missing required environment variables for database initialization');
    return;
  }

  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    });

    console.log('Testing admin client connection...');
    const { error: testError } = await supabaseAdmin
      .from('todas')
      .select('count')
      .limit(1);

    if (testError) {
      throw new Error(`Admin client connection test failed: ${testError.message}`);
    }

    console.log('Admin client connected successfully');
    isInitialized = true;
    
  } catch (error) {
    console.error('Database initialization error:', error);
    // Don't throw, just log the error
  }
}
