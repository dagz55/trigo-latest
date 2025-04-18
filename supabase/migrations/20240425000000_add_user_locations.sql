-- Create user_locations table for tracking real-time locations
CREATE TABLE IF NOT EXISTS public.user_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    location GEOMETRY(POINT, 4326) NOT NULL, -- PostGIS point type with SRID 4326 (WGS84)
    accuracy FLOAT, -- Accuracy in meters (optional)
    heading FLOAT, -- Direction in degrees (optional)
    speed FLOAT, -- Speed in m/s (optional)
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id) -- Each user can only have one location record
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON public.user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_updated_at ON public.user_locations(updated_at);
CREATE INDEX IF NOT EXISTS idx_user_locations_location ON public.user_locations USING GIST(location);

-- Add is_online field to profiles if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'is_online'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN is_online BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Create function to update location
CREATE OR REPLACE FUNCTION public.update_user_location(
    p_user_id UUID,
    p_latitude DOUBLE PRECISION,
    p_longitude DOUBLE PRECISION,
    p_accuracy FLOAT DEFAULT NULL,
    p_heading FLOAT DEFAULT NULL,
    p_speed FLOAT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_locations (
        user_id, 
        location, 
        accuracy, 
        heading, 
        speed, 
        updated_at
    ) 
    VALUES (
        p_user_id, 
        ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326),
        p_accuracy,
        p_heading,
        p_speed,
        NOW()
    )
    ON CONFLICT (user_id) 
    DO UPDATE SET
        location = ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326),
        accuracy = p_accuracy,
        heading = p_heading,
        speed = p_speed,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update profiles.is_online when location is updated
CREATE OR REPLACE FUNCTION public.update_user_online_status() RETURNS TRIGGER AS $$
BEGIN
    -- Update the user's online status to true when their location is updated
    UPDATE public.profiles
    SET is_online = TRUE
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS update_user_online_status_trigger ON public.user_locations;
CREATE TRIGGER update_user_online_status_trigger
AFTER INSERT OR UPDATE ON public.user_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_user_online_status();

-- Create RLS policies for user_locations table
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

-- Policy for users to update their own location
CREATE POLICY "Users can update their own location"
ON public.user_locations
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy for dispatchers to view all locations
CREATE POLICY "Dispatchers can view all locations"
ON public.user_locations
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'dispatcher'
    )
);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_locations TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.user_locations_id_seq TO authenticated;
