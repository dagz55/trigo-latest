import { createServerAdminClient } from '@/lib/supabase-server-client';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { rideId, status, triderId, cancellationReason } = await request.json();

    if (!rideId || !status) {
      return NextResponse.json({ error: 'rideId and status are required' }, { status: 400 });
    }

    const validStatuses = ['pending', 'accepted', 'picked_up', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid ride status' }, { status: 400 });
    }

    // Use admin client to bypass RLS
    const supabase = createServerAdminClient();
    
    const updates: any = { status };
    
    // Add trider_id for 'accepted' status if provided
    if (status === 'accepted' && triderId) {
      updates.trider_id = triderId;
      updates.accepted_at = new Date().toISOString();
    }
    
    // Add cancellation reason if provided
    if (status === 'cancelled' && cancellationReason) {
      updates.cancellation_reason = cancellationReason;
      updates.cancelled_at = new Date().toISOString();
    }
    
    // Add picked_up timestamp
    if (status === 'picked_up') {
      updates.picked_up_at = new Date().toISOString();
    }
    
    // Add completed timestamp
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    // Update the ride status
    const { error } = await supabase
      .from('ride_requests')
      .update(updates)
      .eq('id', rideId);

    if (error) {
      console.error(`Error updating ride ${rideId} status to ${status}:`, error);
      return NextResponse.json({ error: 'Failed to update ride status', details: error.message }, { status: 500 });
    }

    // If status is accepted, also update the trider status to busy
    if (status === 'accepted' && triderId) {
      const { error: triderError } = await supabase
        .from('triders')
        .update({ status: 'busy' })
        .eq('id', triderId);

      if (triderError) {
        console.error(`Error updating trider ${triderId} status to busy:`, triderError);
        // Don't fail the request if only the trider update fails
      }
    }
    
    // If status is completed and we have a trider, set trider back to online
    if (status === 'completed' && triderId) {
      const { error: triderError } = await supabase
        .from('triders')
        .update({ status: 'online' })
        .eq('id', triderId);

      if (triderError) {
        console.error(`Error updating trider ${triderId} status to online:`, triderError);
        // Don't fail the request if only the trider update fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Ride ${rideId} status updated to ${status}` 
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Server error' 
    }, { status: 500 });
  }
} 