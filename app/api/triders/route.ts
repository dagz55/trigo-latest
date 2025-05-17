import { createServerAdminClient } from '@/lib/supabase-server-client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use the server admin client
    const supabase = createServerAdminClient();
    
    // Get all triders for debugging
    const { data: triders, error } = await supabase
      .from('triders')
      .select('*, users(id, first_name, last_name, email, phone)');
      
    if (error) {
      console.error('Error fetching triders:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      triders: triders || []
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Server error' 
    }, { status: 500 });
  }
} 