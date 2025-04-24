import { createServerAdminClient } from '@/lib/supabase-server-client';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const todaId = searchParams.get('toda_id');

    if (!todaId) {
      return NextResponse.json({ error: 'toda_id parameter is required' }, { status: 400 });
    }

    // Use admin client to bypass RLS
    const supabase = createServerAdminClient();
    
    // Get pending rides for this TODA
    const { data, error } = await supabase
      .from('ride_requests')
      .select(`
        *,
        passengers (id, first_name, last_name, phone),
        pickup_location: pickup_location_id (*),
        dropoff_location: dropoff_location_id (*)
      `)
      .eq('toda_id', todaId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending rides:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      rides: data || []
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Server error' 
    }, { status: 500 });
  }
} 