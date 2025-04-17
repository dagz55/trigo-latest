-- Update bookings table to include additional fields for enhanced booking flow
ALTER TABLE IF EXISTS public.bookings
ADD COLUMN IF NOT EXISTS passenger_name TEXT,
ADD COLUMN IF NOT EXISTS cp_number TEXT,
ADD COLUMN IF NOT EXISTS pickup_lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS pickup_lng DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS dropoff_lat DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS dropoff_lng DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS assigned_to UUID;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_passenger_id ON public.bookings(passenger_id);
CREATE INDEX IF NOT EXISTS idx_bookings_toda_id ON public.bookings(toda_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_assigned_to ON public.bookings(assigned_to);

-- Add RLS policies if they don't exist
DO $$
BEGIN
    -- Check if the policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'bookings'
        AND policyname = 'Passengers can view their own bookings'
    ) THEN
        -- Create the policy
        EXECUTE 'CREATE POLICY "Passengers can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = passenger_id)';
    END IF;

    -- Check if the policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'bookings'
        AND policyname = 'Triders can view bookings assigned to them'
    ) THEN
        -- Create the policy
        EXECUTE 'CREATE POLICY "Triders can view bookings assigned to them" ON public.bookings FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.triders WHERE id = assigned_to))';
    END IF;

    -- Check if the policy exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
        AND tablename = 'bookings'
        AND policyname = 'Dispatchers can view all bookings'
    ) THEN
        -- Create the policy
        EXECUTE 'CREATE POLICY "Dispatchers can view all bookings" ON public.bookings FOR SELECT USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = ''dispatcher''))';
    END IF;
END
$$;
