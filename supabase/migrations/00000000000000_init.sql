-- Enable the pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create exec_sql function
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS void AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create enum types
CREATE TYPE user_role AS ENUM ('passenger', 'trider', 'dispatcher', 'admin');
CREATE TYPE trider_status AS ENUM ('offline', 'online', 'busy');
CREATE TYPE ride_status AS ENUM ('pending', 'accepted', 'picked_up', 'completed', 'cancelled');
CREATE TYPE location_type AS ENUM ('pickup', 'dropoff', 'terminal', 'popular');

-- Create TODA table with consistent fields
CREATE TABLE IF NOT EXISTS public.todas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    city TEXT NOT NULL,
    barangay TEXT NOT NULL,
    terminal_address TEXT,
    contact_number TEXT,
    president_name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    coverage_area GEOMETRY(POLYGON, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create locations table with consistent fields
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    city TEXT NOT NULL,
    barangay TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('terminal', 'pickup', 'dropoff', 'custom')),
    toda_id UUID REFERENCES public.todas(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE NOT NULL,
    role user_role NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create triders table
CREATE TABLE IF NOT EXISTS public.triders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    toda_id UUID REFERENCES public.todas(id),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    plate_number TEXT NOT NULL,
    license_number TEXT NOT NULL,
    status trider_status DEFAULT 'offline',
    current_latitude DOUBLE PRECISION,
    current_longitude DOUBLE PRECISION,
    last_location_update TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_coordinates CHECK (
        (current_latitude IS NULL AND current_longitude IS NULL) OR
        (current_latitude BETWEEN -90 AND 90 AND current_longitude BETWEEN -180 AND 180)
    )
);

-- Create trider queue table
CREATE TABLE IF NOT EXISTS public.trider_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trider_id UUID REFERENCES public.triders(id),
    toda_id UUID REFERENCES public.todas(id),
    queue_position INTEGER NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (trider_id, toda_id)
);

-- Create ride requests table
CREATE TABLE IF NOT EXISTS public.ride_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passenger_id UUID REFERENCES public.users(id),
    trider_id UUID REFERENCES public.triders(id),
    toda_id UUID REFERENCES public.todas(id),
    pickup_location_id UUID REFERENCES public.locations(id),
    dropoff_location_id UUID REFERENCES public.locations(id),
    status ride_status DEFAULT 'pending',
    fare_amount DECIMAL(10,2),
    distance_km DECIMAL(10,2),
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create saved_locations table
CREATE TABLE IF NOT EXISTS public.saved_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    location_id UUID REFERENCES public.locations NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, location_id)
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_todas_updated_at
    BEFORE UPDATE ON public.todas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON public.locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_triders_updated_at
    BEFORE UPDATE ON public.triders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ride_requests_updated_at
    BEFORE UPDATE ON public.ride_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_saved_locations_updated_at
    BEFORE UPDATE ON public.saved_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default TODA data
INSERT INTO public.todas (name, city, barangay, coverage_area)
VALUES (
    'Talon Kuatro TODA',
    'Las Piñas City',
    'Talon Kuatro',
    ST_GeomFromText('POLYGON((120.9726 14.4407, 120.9926 14.4407, 120.9926 14.4607, 120.9726 14.4607, 120.9726 14.4407))', 4326)
) ON CONFLICT DO NOTHING;

-- Create indexes for TODA
CREATE INDEX IF NOT EXISTS idx_toda_city ON public.todas(city);
CREATE INDEX IF NOT EXISTS idx_toda_barangay ON public.todas(barangay);
CREATE INDEX IF NOT EXISTS idx_toda_status ON public.todas(status);

-- Insert default TODA
INSERT INTO public.todas (
  name,
  code,
  city,
  barangay,
  terminal_address,
  contact_number,
  president_name,
  status
) VALUES (
  'Talon Kuatro Tricycle Operators and Drivers Association',
  'TK4-TODA',
  'Las Piñas City',
  'Talon Kuatro',
  '19 Rose of Heaven Drive corner Periwinkle St., Talon Village, Talon 4, Las Piñas City',
  '+63-915-123-4567',
  'Juan Dela Cruz',
  'active'
) ON CONFLICT (code) DO NOTHING;

-- Create the locations table with TODA reference
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  city VARCHAR NOT NULL,
  barangay VARCHAR NOT NULL,
  type VARCHAR NOT NULL CHECK (type IN ('pickup', 'dropoff', 'terminal')),
  toda_id UUID REFERENCES public.todas(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_locations_city ON public.locations(city);
CREATE INDEX IF NOT EXISTS idx_locations_barangay ON public.locations(barangay);
CREATE INDEX IF NOT EXISTS idx_locations_type ON public.locations(type);
CREATE INDEX IF NOT EXISTS idx_locations_toda_id ON public.locations(toda_id);

-- Insert initial location data with TODA reference
WITH default_toda AS (
  SELECT id FROM public.todas WHERE code = 'TK4-TODA' LIMIT 1
)
INSERT INTO public.locations (
  name,
  address,
  latitude,
  longitude,
  city,
  barangay,
  type,
  toda_id
) 
SELECT
  'Rose of Heaven Drive Corner',
  '19 Rose of Heaven Drive corner Periwinkle St., Talon Village, Talon 4, Las Piñas City',
  14.4507,
  120.9826,
  'Las Piñas City',
  'Talon Kuatro',
  'terminal',
  id
FROM default_toda
ON CONFLICT DO NOTHING;

-- Insert additional locations for Talon Kuatro area
WITH default_toda AS (
  SELECT id FROM public.todas WHERE code = 'TK4-TODA' LIMIT 1
)
INSERT INTO public.locations (
  name,
  address,
  latitude,
  longitude,
  city,
  barangay,
  type,
  toda_id
) 
SELECT
  unnest(ARRAY[
    'Talon 4 Main Gate',
    'Periwinkle Street',
    'Lily Street',
    'Jasmine Street',
    'Orchid Street',
    'Rose Street',
    'Sampaguita Street',
    'Dahlia Street',
    'Camia Street',
    'Rosal Street'
  ]) as name,
  unnest(ARRAY[
    'Talon 4 Main Gate, Las Piñas City',
    'Periwinkle St., Talon 4, Las Piñas City',
    'Lily St., Talon 4, Las Piñas City',
    'Jasmine St., Talon 4, Las Piñas City',
    'Orchid St., Talon 4, Las Piñas City',
    'Rose St., Talon 4, Las Piñas City',
    'Sampaguita St., Talon 4, Las Piñas City',
    'Dahlia St., Talon 4, Las Piñas City',
    'Camia St., Talon 4, Las Piñas City',
    'Rosal St., Talon 4, Las Piñas City'
  ]) as address,
  unnest(ARRAY[
    14.4515,
    14.4505,
    14.4498,
    14.4492,
    14.4488,
    14.4482,
    14.4475,
    14.4468,
    14.4462,
    14.4455
  ]) as latitude,
  unnest(ARRAY[
    120.9830,
    120.9825,
    120.9822,
    120.9828,
    120.9824,
    120.9820,
    120.9818,
    120.9823,
    120.9819,
    120.9815
  ]) as longitude,
  'Las Piñas City',
  'Talon Kuatro',
  'pickup',
  id
FROM default_toda
ON CONFLICT DO NOTHING;

-- Insert additional terminal exits for Talon Kuatro
WITH default_toda AS (
  SELECT id FROM public.todas WHERE code = 'TK4-TODA' LIMIT 1
)
INSERT INTO public.locations (
  name,
  address,
  latitude,
  longitude,
  city,
  barangay,
  type,
  toda_id
) 
SELECT
  unnest(ARRAY[
    'Rose of Heaven Main Terminal',
    'Talon 4 Gate Terminal',
    'Marcos Alvarez Terminal',
    'BF Resort Terminal'
  ]) as name,
  unnest(ARRAY[
    '19 Rose of Heaven Drive corner Periwinkle St., Talon Village, Talon 4, Las Piñas City',
    'Talon 4 Main Gate, Las Piñas City',
    'Marcos Alvarez Road, Talon 4, Las Piñas City',
    'BF Resort Drive, Talon 4, Las Piñas City'
  ]) as address,
  unnest(ARRAY[
    14.4507,
    14.4515,
    14.4492,
    14.4475
  ]) as latitude,
  unnest(ARRAY[
    120.9826,
    120.9830,
    120.9828,
    120.9818
  ]) as longitude,
  'Las Piñas City',
  'Talon Kuatro',
  'terminal',
  id
FROM default_toda
ON CONFLICT DO NOTHING;

-- Insert additional pickup/dropoff points
WITH default_toda AS (
  SELECT id FROM public.todas WHERE code = 'TK4-TODA' LIMIT 1
)
INSERT INTO public.locations (
  name,
  address,
  latitude,
  longitude,
  city,
  barangay,
  type,
  toda_id
) 
SELECT
  unnest(ARRAY[
    'Talon 4 Plaza',
    'Talon 4 Health Center',
    'Talon 4 Elementary School',
    'Talon 4 Chapel',
    'Marcos Alvarez Gate',
    'BF Resort Gate',
    'Rose of Heaven Church',
    'Periwinkle Market',
    'Lily Street Corner',
    'Jasmine Street Park',
    'Orchid Street Plaza',
    'Rose Street Junction',
    'Sampaguita Street Market',
    'Dahlia Street Corner',
    'Camia Street Plaza'
  ]) as name,
  unnest(ARRAY[
    'Talon 4 Plaza, Las Piñas City',
    'Talon 4 Health Center, Las Piñas City',
    'Talon 4 Elementary School, Las Piñas City',
    'Talon 4 Chapel, Las Piñas City',
    'Marcos Alvarez Gate, Talon 4, Las Piñas City',
    'BF Resort Gate, Talon 4, Las Piñas City',
    'Rose of Heaven Church, Talon 4, Las Piñas City',
    'Periwinkle Market, Talon 4, Las Piñas City',
    'Lily Street Corner, Talon 4, Las Piñas City',
    'Jasmine Street Park, Talon 4, Las Piñas City',
    'Orchid Street Plaza, Talon 4, Las Piñas City',
    'Rose Street Junction, Talon 4, Las Piñas City',
    'Sampaguita Street Market, Talon 4, Las Piñas City',
    'Dahlia Street Corner, Talon 4, Las Piñas City',
    'Camia Street Plaza, Talon 4, Las Piñas City'
  ]) as address,
  unnest(ARRAY[
    14.4510,
    14.4508,
    14.4505,
    14.4502,
    14.4492,
    14.4475,
    14.4507,
    14.4505,
    14.4498,
    14.4492,
    14.4488,
    14.4482,
    14.4475,
    14.4468,
    14.4462
  ]) as latitude,
  unnest(ARRAY[
    120.9828,
    120.9827,
    120.9825,
    120.9824,
    120.9828,
    120.9818,
    120.9826,
    120.9825,
    120.9822,
    120.9828,
    120.9824,
    120.9820,
    120.9818,
    120.9823,
    120.9819
  ]) as longitude,
  'Las Piñas City',
  'Talon Kuatro',
  'pickup',
  id
FROM default_toda
ON CONFLICT DO NOTHING;

-- Insert additional landmarks and points of interest
WITH default_toda AS (
  SELECT id FROM public.todas WHERE code = 'TK4-TODA' LIMIT 1
)
INSERT INTO public.locations (
  name,
  address,
  latitude,
  longitude,
  city,
  barangay,
  type,
  toda_id
) 
SELECT
  unnest(ARRAY[
    'Talon 4 Covered Court',
    'Talon 4 Mini Park',
    'Talon 4 Barangay Hall',
    'Talon 4 Day Care Center',
    'Rose of Heaven Subdivision Gate',
    'Marcos Alvarez Corner',
    'BF Resort Corner',
    'Periwinkle Street Corner',
    'Lily Street Junction',
    'Jasmine Street Corner',
    'Orchid Street Plaza',
    'Rose Street Market',
    'Sampaguita Street Corner',
    'Dahlia Street Plaza',
    'Camia Street Junction',
    'Rosal Street Corner',
    'Adelfa Street',
    'Gumamela Street',
    'Ilang-Ilang Street',
    'Daisy Street'
  ]) as name,
  unnest(ARRAY[
    'Talon 4 Covered Court, Las Piñas City',
    'Talon 4 Mini Park, Las Piñas City',
    'Talon 4 Barangay Hall, Las Piñas City',
    'Talon 4 Day Care Center, Las Piñas City',
    'Rose of Heaven Subdivision Gate, Las Piñas City',
    'Marcos Alvarez Corner, Talon 4, Las Piñas City',
    'BF Resort Corner, Talon 4, Las Piñas City',
    'Periwinkle Street Corner, Talon 4, Las Piñas City',
    'Lily Street Junction, Talon 4, Las Piñas City',
    'Jasmine Street Corner, Talon 4, Las Piñas City',
    'Orchid Street Plaza, Talon 4, Las Piñas City',
    'Rose Street Market, Talon 4, Las Piñas City',
    'Sampaguita Street Corner, Talon 4, Las Piñas City',
    'Dahlia Street Plaza, Talon 4, Las Piñas City',
    'Camia Street Junction, Talon 4, Las Piñas City',
    'Rosal Street Corner, Talon 4, Las Piñas City',
    'Adelfa Street, Talon 4, Las Piñas City',
    'Gumamela Street, Talon 4, Las Piñas City',
    'Ilang-Ilang Street, Talon 4, Las Piñas City',
    'Daisy Street, Talon 4, Las Piñas City'
  ]) as address,
  unnest(ARRAY[
    14.4512,
    14.4509,
    14.4506,
    14.4503,
    14.4507,
    14.4492,
    14.4475,
    14.4505,
    14.4498,
    14.4492,
    14.4488,
    14.4482,
    14.4475,
    14.4468,
    14.4462,
    14.4455,
    14.4458,
    14.4465,
    14.4472,
    14.4479
  ]) as latitude,
  unnest(ARRAY[
    120.9829,
    120.9827,
    120.9825,
    120.9823,
    120.9826,
    120.9828,
    120.9818,
    120.9825,
    120.9822,
    120.9828,
    120.9824,
    120.9820,
    120.9818,
    120.9823,
    120.9819,
    120.9815,
    120.9817,
    120.9821,
    120.9825,
    120.9829
  ]) as longitude,
  'Las Piñas City',
  'Talon Kuatro',
  'pickup',
  id
FROM default_toda
ON CONFLICT DO NOTHING;

-- Add more terminal exits with better coverage
WITH default_toda AS (
  SELECT id FROM public.todas WHERE code = 'TK4-TODA' LIMIT 1
)
INSERT INTO public.locations (
  name,
  address,
  latitude,
  longitude,
  city,
  barangay,
  type,
  toda_id
) 
SELECT
  unnest(ARRAY[
    'Rose of Heaven Main Terminal',
    'Talon 4 Gate Terminal',
    'Marcos Alvarez Terminal',
    'BF Resort Terminal',
    'Periwinkle Street Terminal',
    'Lily Street Terminal',
    'Jasmine Street Terminal',
    'Orchid Street Terminal'
  ]) as name,
  unnest(ARRAY[
    '19 Rose of Heaven Drive corner Periwinkle St., Talon Village, Talon 4, Las Piñas City',
    'Talon 4 Main Gate, Las Piñas City',
    'Marcos Alvarez Road, Talon 4, Las Piñas City',
    'BF Resort Drive, Talon 4, Las Piñas City',
    'Periwinkle Street, Talon 4, Las Piñas City',
    'Lily Street, Talon 4, Las Piñas City',
    'Jasmine Street, Talon 4, Las Piñas City',
    'Orchid Street, Talon 4, Las Piñas City'
  ]) as address,
  unnest(ARRAY[
    14.4507,
    14.4515,
    14.4492,
    14.4475,
    14.4505,
    14.4498,
    14.4492,
    14.4488
  ]) as latitude,
  unnest(ARRAY[
    120.9826,
    120.9830,
    120.9828,
    120.9818,
    120.9825,
    120.9822,
    120.9828,
    120.9824
  ]) as longitude,
  'Las Piñas City',
  'Talon Kuatro',
  'terminal',
  id
FROM default_toda
ON CONFLICT DO NOTHING;

-- Create function to update trider queue positions
CREATE OR REPLACE FUNCTION update_queue_positions()
RETURNS TRIGGER AS $$
BEGIN
  -- Update queue positions for the affected TODA
  WITH ranked AS (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY toda_id 
      ORDER BY joined_at
    ) as new_position
    FROM public.trider_queue
    WHERE toda_id = NEW.toda_id
  )
  UPDATE public.trider_queue tq
  SET queue_position = ranked.new_position
  FROM ranked
  WHERE tq.id = ranked.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for queue position updates
CREATE TRIGGER trider_queue_update
AFTER INSERT OR DELETE ON public.trider_queue
FOR EACH ROW
EXECUTE FUNCTION update_queue_positions();

-- Create function to handle trider status updates
CREATE OR REPLACE FUNCTION update_trider_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'online' THEN
    -- Add to queue if coming online
    INSERT INTO public.trider_queue (trider_id, toda_id, queue_position)
    VALUES (NEW.id, NEW.toda_id, (
      SELECT COALESCE(MAX(queue_position), 0) + 1
      FROM public.trider_queue
      WHERE toda_id = NEW.toda_id
    ))
    ON CONFLICT (trider_id, toda_id) DO NOTHING;
    
    NEW.last_online = NOW();
  ELSIF NEW.status = 'offline' THEN
    -- Remove from queue if going offline
    DELETE FROM public.trider_queue
    WHERE trider_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for trider status updates
CREATE TRIGGER trider_status_update
BEFORE UPDATE OF status ON public.triders
FOR EACH ROW
EXECUTE FUNCTION update_trider_status();

-- Insert sample trider data
WITH default_toda AS (
  SELECT id FROM public.todas WHERE code = 'TK4-TODA' LIMIT 1
)
INSERT INTO public.triders (
  user_id,
  toda_id,
  first_name,
  last_name,
  contact_number,
  plate_number,
  license_number,
  status
)
SELECT
  gen_random_uuid(),
  id,
  unnest(ARRAY['Juan', 'Pedro', 'Mario', 'Carlo', 'Miguel']),
  unnest(ARRAY['Dela Cruz', 'Santos', 'Garcia', 'Lopez', 'Rodriguez']),
  unnest(ARRAY[
    '+63-915-123-4567',
    '+63-915-234-5678',
    '+63-915-345-6789',
    '+63-915-456-7890',
    '+63-915-567-8901'
  ]),
  unnest(ARRAY['ABC-123', 'DEF-456', 'GHI-789', 'JKL-012', 'MNO-345']),
  unnest(ARRAY['L01-12345', 'L01-23456', 'L01-34567', 'L01-45678', 'L01-56789']),
  'offline'
FROM default_toda;

-- Insert test users for authentication
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
VALUES 
  -- Dispatcher test account
  ('d141c967-89d3-4cc8-8444-11111111111', 'dispatcher.test@trigo.ph', crypt('Dispatcher123!', gen_salt('bf')), now(), '{"role": "dispatcher"}'),
  -- Trider test accounts
  ('t141c967-89d3-4cc8-8444-22222222222', 'trider1.test@trigo.ph', crypt('Trider123!', gen_salt('bf')), now(), '{"role": "trider"}'),
  ('t141c967-89d3-4cc8-8444-33333333333', 'trider2.test@trigo.ph', crypt('Trider123!', gen_salt('bf')), now(), '{"role": "trider"}')
ON CONFLICT (id) DO NOTHING;

-- Insert dispatcher profile
INSERT INTO dispatchers (
  id,
  user_id,
  toda_id,
  first_name,
  last_name,
  contact_number,
  shift_schedule
)
VALUES (
  'disp-001',
  'd141c967-89d3-4cc8-8444-11111111111',
  (SELECT id FROM todas WHERE name = 'Talon Kuatro TODA'),
  'Juan',
  'Dela Cruz',
  '09171234567',
  'Morning Shift (6AM-2PM)'
)
ON CONFLICT (id) DO NOTHING;

-- Insert trider profiles
INSERT INTO triders (
  id,
  user_id,
  toda_id,
  first_name,
  last_name,
  contact_number,
  plate_number,
  license_number,
  status,
  vehicle_type,
  vehicle_model,
  vehicle_color
)
VALUES 
  (
    'trid-001',
    't141c967-89d3-4cc8-8444-22222222222',
    (SELECT id FROM todas WHERE name = 'Talon Kuatro TODA'),
    'Pedro',
    'Santos',
    '09189876543',
    'TR-1234',
    'N04-12-123456',
    'offline',
    'Regular',
    'Honda TMX 125',
    'Blue'
  ),
  (
    'trid-002',
    't141c967-89d3-4cc8-8444-33333333333',
    (SELECT id FROM todas WHERE name = 'Talon Kuatro TODA'),
    'Miguel',
    'Garcia',
    '09209876543',
    'TR-5678',
    'N04-12-789012',
    'offline',
    'Regular',
    'Kawasaki Barako 175',
    'Red'
  )
ON CONFLICT (id) DO NOTHING;

-- Update RLS policies for saved_locations table
ALTER TABLE public.saved_locations ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own locations
CREATE POLICY "Users can insert their own locations" 
ON public.saved_locations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own locations
CREATE POLICY "Users can update their own locations" 
ON public.saved_locations FOR UPDATE
USING (auth.uid() = user_id);

-- Allow users to read their own locations
CREATE POLICY "Users can read their own locations" 
ON public.saved_locations FOR SELECT
USING (auth.uid() = user_id);

-- Update RLS policies for todas table to allow public read access
CREATE POLICY "Allow public read access to todas"
ON public.todas FOR SELECT
TO PUBLIC
USING (true);
