import { supabase } from './supabase-client'

// This function assumes migrations have run and tables ('todas', 'locations') exist.
// It primarily checks if the default TODA and a specific location exist,
// and inserts them only if they are missing. This makes it safe to run
// during application startup without causing errors or duplicate data.
export async function initializeDatabase() {
  console.log('Initializing database: Checking for default data...');
  try {
    let todaId: string | undefined;

    // 1. Check for the default TODA ('TK4-TODA')
    const { data: defaultToda, error: fetchTodaError } = await supabase
      .from('todas') // Use correct table name 'todas'
      .select('id') // Only select id
      .eq('code', 'TK4-TODA')
      .maybeSingle(); // Use maybeSingle to handle null result gracefully

    if (fetchTodaError) {
      console.error('Error checking for default TODA:', fetchTodaError);
      // Don't proceed if we can't even check for the TODA
      return;
    }

    if (!defaultToda) {
      console.log("Default TODA ('TK4-TODA') not found. Attempting to insert (assuming table exists)...");
      // Insert default TODA if it doesn't exist (migration should handle this ideally)
      const { data: insertedToda, error: insertTodaError } = await supabase
        .from('todas')
        .insert([
          {
            name: 'Talon Kuatro Tricycle Operators and Drivers Association',
            code: 'TK4-TODA',
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
      console.log('Default TODA inserted successfully.');
      todaId = insertedToda.id;
    } else {
      console.log("Default TODA ('TK4-TODA') already exists.");
      todaId = defaultToda.id;
    }

    // If we couldn't get a todaId, stop here.
    if (!todaId) {
        console.error('Failed to obtain default TODA ID. Cannot proceed with location check.');
        return;
    }

    // 2. Check for the specific initial location
    const { data: existingLocation, error: checkLocationError } = await supabase
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
      // Insert the location if it doesn't exist
      const { error: insertLocationError } = await supabase
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
