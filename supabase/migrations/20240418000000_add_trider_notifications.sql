-- Create trider_notifications table for notifying triders about new bookings
CREATE TABLE IF NOT EXISTS public.trider_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    trider_id UUID REFERENCES public.triders(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'seen', 'accepted', 'declined')),
    distance_km DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_trider_notifications_booking_id ON public.trider_notifications(booking_id);
CREATE INDEX IF NOT EXISTS idx_trider_notifications_trider_id ON public.trider_notifications(trider_id);
CREATE INDEX IF NOT EXISTS idx_trider_notifications_status ON public.trider_notifications(status);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_trider_notifications_updated_at
    BEFORE UPDATE ON public.trider_notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE public.trider_notifications ENABLE ROW LEVEL SECURITY;

-- Triders can see their own notifications
CREATE POLICY "Triders can view their own notifications"
ON public.trider_notifications FOR SELECT
TO authenticated
USING (
    auth.uid() IN (
        SELECT user_id FROM public.triders WHERE id = trider_id
    )
);

-- Triders can update their own notifications (to mark as seen/accepted/declined)
CREATE POLICY "Triders can update their own notifications"
ON public.trider_notifications FOR UPDATE
TO authenticated
USING (
    auth.uid() IN (
        SELECT user_id FROM public.triders WHERE id = trider_id
    )
)
WITH CHECK (
    auth.uid() IN (
        SELECT user_id FROM public.triders WHERE id = trider_id
    )
);

-- Dispatchers can view all notifications
CREATE POLICY "Dispatchers can view all notifications"
ON public.trider_notifications FOR SELECT
TO authenticated
USING (
    auth.uid() IN (
        SELECT user_id FROM public.users WHERE role = 'dispatcher'
    )
);

-- Passengers can view notifications related to their bookings
CREATE POLICY "Passengers can view notifications for their bookings"
ON public.trider_notifications FOR SELECT
TO authenticated
USING (
    auth.uid() IN (
        SELECT passenger_id FROM public.bookings WHERE id = booking_id
    )
);
