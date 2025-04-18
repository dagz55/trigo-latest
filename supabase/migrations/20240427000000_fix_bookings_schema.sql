-- Create bookings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passenger_id UUID,
    toda_id UUID,
    status TEXT DEFAULT 'pending',
    code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fix bookings table schema to ensure all required columns exist
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS estimated_fare TEXT,
ADD COLUMN IF NOT EXISTS estimated_time TEXT,
ADD COLUMN IF NOT EXISTS code TEXT,
ADD COLUMN IF NOT EXISTS dispatcher_notified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS assigned_to UUID,
ADD COLUMN IF NOT EXISTS pickup_location_id UUID,
ADD COLUMN IF NOT EXISTS dropoff_location_id UUID,
ADD COLUMN IF NOT EXISTS passenger_id UUID,
ADD COLUMN IF NOT EXISTS toda_id UUID,
ADD COLUMN IF NOT EXISTS passenger_name TEXT,
ADD COLUMN IF NOT EXISTS cp_number TEXT,
ADD COLUMN IF NOT EXISTS pickup_lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS pickup_lng DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS dropoff_lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS dropoff_lng DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Note: We're not setting default values for estimated_fare and estimated_time
-- These should be calculated dynamically based on distance and traffic conditions
-- using the proper formula: PHP 20.00 base fare + PHP 10.00 per additional kilometer
-- and Mapbox matrix API for time estimation

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_code ON public.bookings(code);
CREATE INDEX IF NOT EXISTS idx_bookings_assigned_to ON public.bookings(assigned_to);
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_location_id ON public.bookings(pickup_location_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dropoff_location_id ON public.bookings(dropoff_location_id);
CREATE INDEX IF NOT EXISTS idx_bookings_passenger_id ON public.bookings(passenger_id);
CREATE INDEX IF NOT EXISTS idx_bookings_toda_id ON public.bookings(toda_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);

-- Create function to update updated_at timestamp if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $update_timestamp$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$update_timestamp$ LANGUAGE plpgsql;

-- Create trigger for updated_at if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bookings_updated_at') THEN
        CREATE TRIGGER update_bookings_updated_at
            BEFORE UPDATE ON public.bookings
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
DO $$
BEGIN
    -- Check if the policy exists
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Passengers can view their own bookings') THEN
        -- Create the policy
        CREATE POLICY "Passengers can view their own bookings"
        ON public.bookings FOR SELECT
        USING (auth.uid() = passenger_id);
    END IF;

    -- Check if the policy exists
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Passengers can insert their own bookings') THEN
        -- Create the policy
        CREATE POLICY "Passengers can insert their own bookings"
        ON public.bookings FOR INSERT
        WITH CHECK (auth.uid() = passenger_id);
    END IF;

    -- Check if the policy exists
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Triders can view bookings assigned to them') THEN
        -- Create the policy
        CREATE POLICY "Triders can view bookings assigned to them"
        ON public.bookings FOR SELECT
        USING (auth.uid() IN (SELECT user_id FROM public.triders WHERE id = assigned_to));
    END IF;

    -- Check if the policy exists
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Triders can update bookings assigned to them') THEN
        -- Create the policy
        CREATE POLICY "Triders can update bookings assigned to them"
        ON public.bookings FOR UPDATE
        USING (auth.uid() IN (SELECT user_id FROM public.triders WHERE id = assigned_to));
    END IF;

    -- Check if the policy exists
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Dispatchers can view all bookings') THEN
        -- Create the policy
        CREATE POLICY "Dispatchers can view all bookings"
        ON public.bookings FOR SELECT
        USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'dispatcher'));
    END IF;

    -- Check if the policy exists
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Dispatchers can update all bookings') THEN
        -- Create the policy
        CREATE POLICY "Dispatchers can update all bookings"
        ON public.bookings FOR UPDATE
        USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'dispatcher'));
    END IF;
END $$;
