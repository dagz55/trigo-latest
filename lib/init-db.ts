import { createClient } from '@supabase/supabase-js'
// Keep the original client for potential other uses if needed,
// but we'll create a service client specifically for initialization.
// import { supabase } from './supabase-client'

// This function assumes migrations have run and tables ('todas', 'locations') exist.
// It primarily checks if the default TODA and a specific location exist,
// and inserts them only if they are missing. This makes it safe to run
// during application startup without causing errors or duplicate data.
export async function initializeDatabase() {
  console.log('Initializing database: Checking for default data...');

  // Create a temporary Supabase client using the service role key to bypass RLS
  // Ensure these environment variables are set in your .env.local
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error('Missing Supabase URL or Service Role Key in environment variables. Cannot perform initialization.');
    return;
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: {
      // Important: These options prevent the admin client from interfering
      // with the regular user authentication flow.
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  });

  console.log('Using service role client for initialization.');

  try {
    let todaId: string | undefined;

    // 1. Check for the default TODA by name using the admin client
    const defaultTodaName = 'Talon Kuatro Tricycle Operators and Drivers Association';
    const { data: defaultToda, error: fetchTodaError } = await supabaseAdmin // Use admin client
      .from('todas') // Use correct table name 'todas'
      .select('id') // Only select id
      .eq('name', defaultTodaName) // Check by name instead of code
      .maybeSingle(); // Use maybeSingle to handle null result gracefully

    if (fetchTodaError) {
      console.error(`Error checking for default TODA ('${defaultTodaName}'):`, fetchTodaError);
      // Don't proceed if we can't even check for the TODA
      return;
    }

    if (!defaultToda) {
      console.log(`Default TODA ('${defaultTodaName}') not found. Attempting to insert (assuming table exists)...`);
      // Insert default TODA if it doesn't exist using the admin client
      const { data: insertedToda, error: insertTodaError } = await supabaseAdmin // Use admin client
        .from('todas')
        .insert([
          {
            name: defaultTodaName,
            // code: 'TK4-TODA', // Removed non-existent code field
            city: 'Las Piñas City',
            barangay: 'Talon Kuatro',
            // Add other necessary fields as defined in your 'todas' table schema if needed
            // terminal_address: '...', contact_number: '...', president_name: '...', status: 'active'
          }
        ])
        .select('id') // Select the inserted row to get the ID
        .single(); // Expecting a single row

      if (insertTodaError) {
        console.error('Error inserting default TODA:', insertTodaError);
        // Don't proceed if insertion fails
        return;
      }
      console.log(`Default TODA ('${defaultTodaName}') inserted successfully.`);
      todaId = insertedToda.id;
    } else {
      console.log(`Default TODA ('${defaultTodaName}') already exists.`);
      todaId = defaultToda.id;
    }

    // If we couldn't get a todaId, stop here.
    if (!todaId) {
        console.error('Failed to obtain default TODA ID. Cannot proceed with location check.');
        return;
    }

    // 2. Check for the specific initial location using the admin client
    const { data: existingLocation, error: checkLocationError } = await supabaseAdmin // Use admin client
      .from('locations')
      .select('id') // Only select id
      .eq('name', 'Rose of Heaven Drive Corner')
      .eq('city', 'Las Piñas City')
      .eq('barangay', 'Talon Kuatro')
      .eq('toda_id', todaId) // Check against the correct TODA ID
      .maybeSingle();

    if (checkLocationError) {
      console.error('Error checking for initial location:', checkLocationError);
      return;
    }

    if (!existingLocation) {
      console.log("'Rose of Heaven Drive Corner' location not found. Attempting to insert...");
      // Insert the location if it doesn't exist using the admin client
      const { error: insertLocationError } = await supabaseAdmin // Use admin client
        .from('locations')
        .insert([
          {
            name: 'Rose of Heaven Drive Corner',
            address: '19 Rose of Heaven Drive corner Periwinkle St., Talon Village, Talon 4, Las Piñas City',
            latitude: 14.4507,
            longitude: 120.9826,
            city: 'Las Piñas City',
            barangay: 'Talon Kuatro',
            type: 'terminal', // Ensure this matches your enum/type if applicable
            toda_id: todaId // Use the obtained todaId
          }
        ]);

      if (insertLocationError) {
        console.error('Error inserting initial location:', insertLocationError);
        return;
      }
      console.log('Initial location data inserted successfully.');
    } else {
      console.log("'Rose of Heaven Drive Corner' location already exists.");
    }

    console.log('Database initialization check complete.');

  } catch (error) {
    console.error('Unexpected error during database initialization check:', error);
  }
}
