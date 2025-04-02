-- Create profiles table with extended fields for ride-hailing
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'passenger',
  isOnline BOOLEAN DEFAULT false,
  isAvailable BOOLEAN DEFAULT false,
  vehicle_type TEXT,
  plate_number TEXT,
  vehicle_color TEXT
);

-- Create locations table for tracking user locations
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_id UUID REFERENCES auth.users NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  toda_id UUID REFERENCES public.todas
);

-- Create TODAs table for TODA (Tricycle) associations
CREATE TABLE IF NOT EXISTS public.todas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  center_latitude DOUBLE PRECISION NOT NULL,
  center_longitude DOUBLE PRECISION NOT NULL,
  radius DOUBLE PRECISION NOT NULL
);

-- Create rides table for tracking ride requests and assignments
CREATE TABLE IF NOT EXISTS public.rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  passenger_id UUID REFERENCES auth.users,
  passenger_name TEXT,
  passenger_phone TEXT,
  trider_id UUID REFERENCES auth.users,
  dispatcher_id UUID REFERENCES auth.users,
  pickup_latitude DOUBLE PRECISION NOT NULL,
  pickup_longitude DOUBLE PRECISION NOT NULL,
  pickup_address TEXT,
  dropoff_latitude DOUBLE PRECISION NOT NULL,
  dropoff_longitude DOUBLE PRECISION NOT NULL,
  dropoff_address TEXT,
  request_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  assignment_time TIMESTAMP WITH TIME ZONE,
  pickup_time TIMESTAMP WITH TIME ZONE,
  completion_time TIMESTAMP WITH TIME ZONE,
  fare DECIMAL(10, 2),
  status TEXT DEFAULT 'requested',
  payment_method TEXT DEFAULT 'cash',
  notes TEXT
);

-- Create messages table for communication
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sender_id UUID REFERENCES auth.users NOT NULL,
  recipient_id UUID REFERENCES auth.users NOT NULL,
  ride_id UUID REFERENCES public.rides,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Dispatchers can view all profiles"
ON public.profiles FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'dispatcher'
);

-- Locations
CREATE POLICY "Users can view their own locations" 
ON public.locations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own locations" 
ON public.locations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Dispatchers can view all locations"
ON public.locations FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'dispatcher'
);

-- Rides
CREATE POLICY "Users can view rides they're involved in"
ON public.rides FOR SELECT
USING (
  auth.uid() = passenger_id OR 
  auth.uid() = trider_id OR 
  auth.uid() = dispatcher_id
);

CREATE POLICY "Passengers can create ride requests"
ON public.rides FOR INSERT
WITH CHECK (
  auth.uid() = passenger_id OR passenger_id IS NULL
);

CREATE POLICY "Involved users can update rides"
ON public.rides FOR UPDATE
USING (
  auth.uid() = passenger_id OR 
  auth.uid() = trider_id OR 
  auth.uid() = dispatcher_id OR
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'dispatcher'
);

CREATE POLICY "Dispatchers can view all rides"
ON public.rides FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'dispatcher'
);

-- Messages
CREATE POLICY "Users can view messages they're involved in"
ON public.messages FOR SELECT
USING (
  auth.uid() = sender_id OR 
  auth.uid() = recipient_id
);

CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
);

CREATE POLICY "Recipients can mark messages as read"
ON public.messages FOR UPDATE
USING (
  auth.uid() = recipient_id AND
  is_read = true
);

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, updated_at, role)
  VALUES (new.id, new.email, now(), 'passenger');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user signs up
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

