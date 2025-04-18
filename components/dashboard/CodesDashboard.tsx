import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import CodeCard from './CodeCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CodesDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchCodes = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, code, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error) setBookings(data);
    };

    fetchCodes();
  }, []);

  return (
    <div className="p-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {bookings.map((booking) => (
        <CodeCard key={booking.id} data={booking} />
      ))}
    </div>
  );
}