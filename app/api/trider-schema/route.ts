import { createServerAdminClient } from '@/lib/supabase-server-client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Use the server admin client
    const supabase = createServerAdminClient();
    
    // Try directly checking tables we need
    const userRes = await supabase.from('users').select('*').limit(1);
    const triderRes = await supabase.from('triders').select('*').limit(1);
    const todaRes = await supabase.from('todas').select('*').limit(1);
    const locationsRes = await supabase.from('locations').select('*').limit(1);
    
    // Also fetch the raw definition of the toda table
    const { data: todaColumns, error: todaColumnsError } = await supabase.rpc(
      'get_table_definition',
      { table_name: 'todas' }
    ).maybeSingle();
    
    return NextResponse.json({
      message: 'Database schema check',
      users: {
        schema: Object.keys(userRes.data?.[0] || {}),
        error: userRes.error
      },
      triders: {
        schema: Object.keys(triderRes.data?.[0] || {}),
        error: triderRes.error
      },
      todas: {
        schema: Object.keys(todaRes.data?.[0] || {}),
        sample: todaRes.data?.[0],
        columnDefinition: todaColumns || null,
        error: todaRes.error || todaColumnsError
      },
      locations: {
        schema: Object.keys(locationsRes.data?.[0] || {}),
        error: locationsRes.error
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Server error' 
    }, { status: 500 });
  }
} 