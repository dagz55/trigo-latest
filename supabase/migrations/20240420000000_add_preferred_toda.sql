-- Add preferred_toda_id to profiles table
ALTER TABLE public.profiles
ADD COLUMN preferred_toda_id UUID REFERENCES public.todas(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_toda_id ON public.profiles(preferred_toda_id);

-- Create function to get all active TODAs
CREATE OR REPLACE FUNCTION public.get_active_todas()
RETURNS TABLE (
  id uuid,
  name text,
  code text,
  city text,
  barangay text
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.code,
    t.city,
    t.barangay
  FROM public.todas t
  WHERE t.status = 'active'
  ORDER BY t.name ASC;
END;
$$;
