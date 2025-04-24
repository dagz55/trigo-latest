import { createServerAdminClient } from '@/lib/supabase-server-client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Use admin client to bypass RLS
    const supabase = createServerAdminClient();
    
    // Get all TODA data
    const { data, error } = await supabase
      .from('todas')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching todas:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If successful, also check for existing triders in each TODA
    const todasWithRiderCount = await Promise.all(
      data.map(async (toda) => {
        const { count, error: countError } = await supabase
          .from('triders')
          .select('*', { count: 'exact', head: true })
          .eq('toda_id', toda.id);
          
        return {
          ...toda,
          riderCount: countError ? null : count
        };
      })
    );

    return NextResponse.json({
      todas: todasWithRiderCount || []
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Server error' 
    }, { status: 500 });
  }
} 