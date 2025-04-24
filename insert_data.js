const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createToda() {
  console.log('Creating TODA...');
  
  // First check if it already exists
  const { data: existingToda } = await supabase
    .from('todas')
    .select('id')
    .eq('name', 'Talon Kuatro Tricycle Operators and Drivers Association')
    .maybeSingle();
    
  if (existingToda) {
    console.log('TODA already exists:', existingToda);
    return existingToda;
  }
  
  const { data, error } = await supabase
    .from('todas')
    .insert({
      name: 'Talon Kuatro Tricycle Operators and Drivers Association',
      city: 'Las Piñas City',
      barangay: 'Talon Kuatro'
    })
    .select();

  if (error) {
    console.error('Error creating TODA:', error);
    return null;
  }

  console.log('TODA created successfully:', data);
  return data[0];
}

async function createTriders(todaId) {
  console.log('Creating triders...');
  
  const triders = [
    {
      user_id: 'trider-user-1',
      toda_id: todaId,
      first_name: 'Juan',
      last_name: 'Garcia',
      contact_number: '09123456789',
      plate_number: 'TRK-001',
      license_number: 'L-12345',
      status: 'online'
    },
    {
      user_id: 'trider-user-2',
      toda_id: todaId,
      first_name: 'Pedro',
      last_name: 'Santos',
      contact_number: '09234567890',
      plate_number: 'TRK-002',
      license_number: 'L-23456',
      status: 'online'
    },
    {
      user_id: 'trider-user-3',
      toda_id: todaId,
      first_name: 'Maria',
      last_name: 'Cruz',
      contact_number: '09345678901',
      plate_number: 'TRK-003',
      license_number: 'L-34567',
      status: 'offline'
    }
  ];
  
  const { data, error } = await supabase
    .from('triders')
    .insert(triders)
    .select();
    
  if (error) {
    console.error('Error creating triders:', error);
    return null;
  }
  
  console.log('Triders created successfully:', data);
  return data;
}

async function main() {
  try {
    const toda = await createToda();
    if (!toda) {
      console.error('Failed to create TODA');
      return;
    }
    
    console.log(`TODA ID: ${toda.id}`);
    
    const triders = await createTriders(toda.id);
    if (!triders) {
      console.error('Failed to create triders');
      return;
    }
    
    console.log(`Created ${triders.length} triders`);
  } catch (err) {
    console.error('Unhandled error:', err);
  }
}

main(); 