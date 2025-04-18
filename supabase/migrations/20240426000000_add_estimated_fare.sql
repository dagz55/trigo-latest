-- Add estimated_fare column to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS estimated_fare TEXT;

-- Update existing bookings with a default value if needed
UPDATE public.bookings 
SET estimated_fare = '₱25 - ₱35' 
WHERE estimated_fare IS NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bookings_estimated_fare ON public.bookings(estimated_fare);
