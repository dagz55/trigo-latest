-- Add toda_id column to ride_requests table
ALTER TABLE public.ride_requests
ADD COLUMN toda_id UUID REFERENCES public.todas(id);

-- Add index for better query performance
CREATE INDEX idx_ride_requests_toda_id ON public.ride_requests(toda_id);

-- Update existing records if needed (optional)
-- UPDATE public.ride_requests
-- SET toda_id = (SELECT id FROM public.todas LIMIT 1)
-- WHERE toda_id IS NULL;