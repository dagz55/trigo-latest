-- 2025-04-17: Add dropoff_location_id to bookings
BEGIN;

-- 1. Add column (nullable) and FK constraint to locations.id
ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS dropoff_location_id uuid
REFERENCES public.locations(id)
ON DELETE SET NULL;

-- 2. Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_dropoff_location_id
ON public.bookings(dropoff_location_id);

COMMIT;