import { supabase } from './supabase-client'

export async function initializeDatabase() {
  try {
    // First check if the TODA table exists
    const { error: todaTableError } = await supabase
      .from('toda')
      .select('count')
      .limit(1)
    
    // If TODA table doesn't exist, create it first
    if (todaTableError?.code === '42P01') {
      console.log('Creating TODA table...')
      
      const { error: createTodaError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.toda (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR NOT NULL,
            code VARCHAR NOT NULL UNIQUE,
            city VARCHAR NOT NULL,
            barangay VARCHAR NOT NULL,
            terminal_address TEXT NOT NULL,
            contact_number VARCHAR,
            president_name VARCHAR,
            status VARCHAR NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_toda_city ON public.toda(city);
          CREATE INDEX IF NOT EXISTS idx_toda_barangay ON public.toda(barangay);
          CREATE INDEX IF NOT EXISTS idx_toda_status ON public.toda(status);
        `
      })

      if (createTodaError) {
        console.error('Error creating TODA table:', createTodaError)
        return
      }

      console.log('TODA table created successfully')

      // Insert default TODA
      const { error: insertTodaError } = await supabase
        .from('toda')
        .insert([
          {
            name: 'Talon Kuatro Tricycle Operators and Drivers Association',
            code: 'TK4-TODA',
            city: 'Las Piñas City',
            barangay: 'Talon Kuatro',
            terminal_address: '19 Rose of Heaven Drive corner Periwinkle St., Talon Village, Talon 4, Las Piñas City',
            contact_number: '+63-915-123-4567',
            president_name: 'Juan Dela Cruz',
            status: 'active'
          }
        ])

      if (insertTodaError) {
        console.error('Error inserting default TODA:', insertTodaError)
        return
      }

      console.log('Default TODA inserted successfully')
    }

    // Then check if the locations table exists
    const { error: locationsTableError } = await supabase
      .from('locations')
      .select('count')
      .limit(1)
    
    // If locations table doesn't exist, create it
    if (locationsTableError?.code === '42P01') {
      console.log('Creating locations table...')
      
      const { error: createLocationsError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.locations (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR NOT NULL,
            address TEXT NOT NULL,
            latitude DOUBLE PRECISION NOT NULL,
            longitude DOUBLE PRECISION NOT NULL,
            city VARCHAR NOT NULL,
            barangay VARCHAR NOT NULL,
            type VARCHAR NOT NULL CHECK (type IN ('pickup', 'dropoff', 'terminal')),
            toda_id UUID REFERENCES public.toda(id),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_locations_city ON public.locations(city);
          CREATE INDEX IF NOT EXISTS idx_locations_barangay ON public.locations(barangay);
          CREATE INDEX IF NOT EXISTS idx_locations_type ON public.locations(type);
          CREATE INDEX IF NOT EXISTS idx_locations_toda_id ON public.locations(toda_id);
        `
      })

      if (createLocationsError) {
        console.error('Error creating locations table:', createLocationsError)
        return
      }

      console.log('Locations table created successfully')
    }

    // Get the default TODA
    const { data: toda, error: todaError } = await supabase
      .from('toda')
      .select('*')
      .eq('code', 'TK4-TODA')
      .single()

    if (todaError || !toda) {
      console.error('Error fetching default TODA:', todaError)
      return
    }

    // Check if we have our test location
    const { data: existingLocation, error: checkError } = await supabase
      .from('locations')
      .select('*, toda(*)')
      .eq('city', 'Las Piñas City')
      .eq('barangay', 'Talon Kuatro')
      .maybeSingle()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing location:', checkError)
      return
    }

    if (!existingLocation) {
      console.log('Inserting initial location...')
      
      // Insert our test location
      const { error: insertError } = await supabase
        .from('locations')
        .insert([
          {
            name: 'Rose of Heaven Drive Corner',
            address: '19 Rose of Heaven Drive corner Periwinkle St., Talon Village, Talon 4, Las Piñas City',
            latitude: 14.4507,
            longitude: 120.9826,
            city: 'Las Piñas City',
            barangay: 'Talon Kuatro',
            type: 'terminal',
            toda_id: toda.id
          }
        ])

      if (insertError) {
        console.error('Error inserting initial location:', insertError)
        return
      }

      console.log('Initial location data inserted successfully')
    } else {
      console.log('Test location already exists:', existingLocation)
    }

  } catch (error) {
    console.error('Unexpected error initializing database:', error)
  }
} 