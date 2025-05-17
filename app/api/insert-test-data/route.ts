import { createServerAdminClient } from '@/lib/supabase-server-client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get admin client to bypass RLS
    const supabaseAdmin = createServerAdminClient();
    
    // First create a test TODA if one doesn't exist
    const { data: existingTodas, error: selectError } = await supabaseAdmin
      .from('todas')
      .select('id')
      .eq('name', 'Talon Kuatro TODA')
      .limit(1);
      
    if (selectError) {
      return NextResponse.json({ error: selectError.message }, { status: 500 });
    }
      
    let todaId;
    if (existingTodas && existingTodas.length > 0) {
      todaId = existingTodas[0].id;
    } else {
      // Insert a test TODA
      const { data: newToda, error: insertError } = await supabaseAdmin
        .from('todas')
        .insert({
          name: 'Talon Kuatro TODA',
          code: 'TK4-TODA',
          city: 'Las Piñas City',
          barangay: 'Talon Kuatro',
          province: 'Metro Manila',
          status: 'active',
          coverage_area: {
            type: 'Polygon',
            coordinates: [
              [
                [120.981, 14.446],
                [120.991, 14.446],
                [120.991, 14.456],
                [120.981, 14.456],
                [120.981, 14.446]
              ]
            ]
          }
        })
        .select('id')
        .single();
          
      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
        
      todaId = newToda.id;
    }
    
    const results = {
      toda: { id: todaId },
      triders: [],
      locations: [],
      users: []
    };
    
    // Check for test auth users by email to get their IDs
    const emails = [
      'juan.garcia@example.com',
      'pedro.santos@example.com',
      'maria.cruz@example.com'
    ];
    
    // Process each test user
    for (const email of emails) {
      try {
        // Get the auth user ID
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserByEmail(email);
        
        if (authError || !authUser?.user) {
          console.log(`User ${email} not found in auth, skipping`);
          continue;
        }
        
        const authId = authUser.user.id;
        
        // Check if user already exists in the users table
        const { data: existingUser, error: userError } = await supabaseAdmin
          .from('users')
          .select('id, auth_id, email, first_name, last_name')
          .eq('auth_id', authId)
          .maybeSingle();
          
        if (userError) {
          console.error(`Error checking user ${email}:`, userError);
          continue;
        }
        
        let userId: string;
        
        // Create user if doesn't exist
        if (!existingUser) {
          // Get user metadata from auth
          const firstName = authUser.user.user_metadata?.first_name || email.split('@')[0];
          const lastName = authUser.user.user_metadata?.last_name || 'Test';
          
          // Create the user
          const { data: newUser, error: createError } = await supabaseAdmin
            .from('users')
            .insert({
              auth_id: authId,
              email: email,
              first_name: firstName,
              last_name: lastName,
              phone: `+63-915-${Math.floor(1000000 + Math.random() * 9000000)}`, // Random PH number
              role: 'trider',
            })
            .select('id')
            .single();
            
          if (createError) {
            console.error(`Error creating user ${email}:`, createError);
            continue;
          }
          
          userId = newUser.id;
          results.users.push({
            id: userId,
            email: email,
            status: 'created'
          });
        } else {
          userId = existingUser.id;
          results.users.push({
            id: userId,
            email: email,
            status: 'already_exists'
          });
        }
        
        // Check if trider exists
        const { data: existingTrider, error: triderCheckError } = await supabaseAdmin
          .from('triders')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();
          
        if (triderCheckError) {
          console.error(`Error checking trider for user ${userId}:`, triderCheckError);
          continue;
        }
        
        if (!existingTrider) {
          // Generate a plate number and license number with a unique suffix based on the email
          const emailFirstChar = email.charAt(0).toUpperCase();
          const plateNumber = `TK${emailFirstChar}-${Math.floor(100 + Math.random() * 900)}`;
          const licenseNumber = `LIC-${emailFirstChar}${Math.floor(10000 + Math.random() * 90000)}`;
          
          // Create trider
          const { data: newTrider, error: triderError } = await supabaseAdmin
            .from('triders')
            .insert({
              user_id: userId,
              toda_id: todaId,
              status: 'offline',
              plate_number: plateNumber,
              license_number: licenseNumber,
            })
            .select()
            .single();
            
          if (triderError) {
            console.error(`Error creating trider for user ${userId}:`, triderError);
            continue;
          }
          
          results.triders.push({
            id: newTrider.id,
            email: email,
            status: 'created'
          });
        } else {
          results.triders.push({
            id: existingTrider.id,
            email: email,
            status: 'already_exists'
          });
        }
      } catch (error) {
        console.error(`Error processing user ${email}:`, error);
      }
    }
    
    // Create test locations for the TODA if needed
    const testLocations = [
      {
        name: 'Talon Kuatro Terminal',
        address: 'Rose of Heaven Drive corner Periwinkle St., Talon Village, Las Piñas City',
        latitude: 14.4507,
        longitude: 120.9826,
        type: 'terminal',
      },
      {
        name: 'SM Southmall',
        address: 'Alabang-Zapote Road, Las Piñas City',
        latitude: 14.4378,
        longitude: 120.9830,
        type: 'pickup',
      },
      {
        name: 'Robinsons Las Piñas',
        address: 'Alabang-Zapote Road, Talon Uno, Las Piñas City',
        latitude: 14.4511,
        longitude: 120.9770,
        type: 'pickup',
      },
      {
        name: 'Las Piñas City Hall',
        address: 'Real St, Las Pinas, Metro Manila',
        latitude: 14.4511,
        longitude: 120.9819,
        type: 'pickup',
      },
      {
        name: 'Las Piñas General Hospital',
        address: 'Marcos Alvarez Avenue, Talon Dos, Las Piñas City',
        latitude: 14.4404,
        longitude: 120.9875,
        type: 'pickup',
      }
    ];
    
    for (const location of testLocations) {
      // Check if location already exists
      const { data: existingLocation, error: locationError } = await supabaseAdmin
        .from('locations')
        .select('id')
        .eq('name', location.name)
        .eq('toda_id', todaId)
        .maybeSingle();
        
      if (locationError) {
        console.error(`Error checking for location ${location.name}:`, locationError);
        continue;
      }
      
      if (!existingLocation) {
        // Create location
        const { data: newLocation, error: createError } = await supabaseAdmin
          .from('locations')
          .insert({
            ...location,
            city: 'Las Piñas City',
            barangay: 'Talon Kuatro',
            toda_id: todaId,
          })
          .select('id')
          .single();
          
        if (createError) {
          console.error(`Error creating location ${location.name}:`, createError);
          continue;
        }
        
        results.locations.push({
          id: newLocation.id,
          name: location.name,
          status: 'created'
        });
      } else {
        results.locations.push({
          id: existingLocation.id,
          name: location.name,
          status: 'already_exists'
        });
      }
    }
    
    return NextResponse.json({
      message: 'Test data insertion complete',
      results
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Server error' 
    }, { status: 500 });
  }
} 