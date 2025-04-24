import { createServerAdminClient } from '@/lib/supabase-server-client';
import { type NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get the user_id from the query string
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const triderId = searchParams.get('id');

    if (!userId && !triderId) {
      return NextResponse.json({ error: 'user_id or id parameter is required' }, { status: 400 });
    }

    // Use admin client to bypass RLS
    const supabase = createServerAdminClient();
    
    // First try to get just the trider data without joins to isolate issues
    let query = supabase
      .from('triders')
      .select('*');
      
    // Apply the appropriate filter
    if (userId) {
      query = query.eq('user_id', userId);
    } else if (triderId) {
      query = query.eq('id', triderId);
    }
    
    // Execute the query
    const { data: triderData, error: triderError } = await query.single();

    if (triderError) {
      console.error('Error fetching trider basic data:', triderError);
      return NextResponse.json({ error: triderError.message }, { status: 500 });
    }
    
    // Now try to get the user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, phone')
      .eq('id', triderData.user_id)
      .single();
      
    if (userError) {
      console.error('Error fetching user data for trider:', userError);
      // Continue anyway, we'll just return what we have
    }
    
    // Try to get the toda data
    const { data: todaData, error: todaError } = await supabase
      .from('todas')
      .select('id, name, city, barangay')
      .eq('id', triderData.toda_id)
      .single();
      
    if (todaError) {
      console.error('Error fetching toda data for trider:', todaError);
      // Continue anyway, we'll just return what we have
    }
    
    // Construct the full response with all data we were able to fetch
    const triderWithRelations = {
      ...triderData,
      user: userData || null,
      toda: todaData || null
    };

    return NextResponse.json({
      trider: triderWithRelations
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Server error' 
    }, { status: 500 });
  }
} 