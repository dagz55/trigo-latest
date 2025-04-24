import { type Trider, type TriderStatus } from '@/lib/supabase-client'; // Import types
import { createServerAdminClient } from '@/lib/supabase-server-client';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { triderId, status, latitude, longitude } = await request.json();

    if (!triderId || !status) {
      return NextResponse.json({ error: 'triderId and status are required' }, { status: 400 });
    }

    const validStatuses: TriderStatus[] = ['online', 'offline', 'busy'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid trider status' }, { status: 400 });
    }

    // Use admin client to bypass RLS policies
    const supabase = createServerAdminClient();
    const updates: Partial<Trider> = { status };
    const now = new Date().toISOString();

    if (latitude !== undefined && longitude !== undefined) {
      updates.current_latitude = latitude;
      updates.current_longitude = longitude;
      // Update last_online only when location is provided and status is potentially online/busy
      if (status !== 'offline') {
         updates.last_online = now;
      }
    } else if (status === 'online' || status === 'busy') {
       // Update last_online when going online/busy even without location update
       updates.last_online = now;
    }
    // Note: We don't explicitly set last_online when going offline

    console.log(`API: Updating trider ${triderId} with:`, updates);

    const { error } = await supabase
      .from('triders')
      .update(updates)
      .eq('id', triderId);

    if (error) {
      console.error(`API Error updating trider ${triderId}:`, error);
      return NextResponse.json({ error: 'Failed to update trider status', details: error.message }, { status: 500 });
    }

    console.log(`API: Successfully updated trider ${triderId} status to ${status}`);
    return NextResponse.json({ success: true, message: `Trider ${triderId} updated to ${status}` });

  } catch (err: any) {
    console.error('API Route Unexpected Error (updateTriderStatus):', err);
    return NextResponse.json({ error: 'Internal Server Error', details: err.message }, { status: 500 });
  }
} 