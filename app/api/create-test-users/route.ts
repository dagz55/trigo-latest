import { createServerAdminClient } from '@/lib/supabase-server-client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseAdmin = createServerAdminClient();
    
    // Test user credentials 
    const testUsers = [
      {
        email: 'juan.garcia@example.com',
        password: 'Test123!',
        user_metadata: {
          first_name: 'Juan',
          last_name: 'Garcia'
        }
      },
      {
        email: 'pedro.santos@example.com',
        password: 'Test123!',
        user_metadata: {
          first_name: 'Pedro',
          last_name: 'Santos'
        }
      },
      {
        email: 'maria.cruz@example.com',
        password: 'Test123!',
        user_metadata: {
          first_name: 'Maria',
          last_name: 'Cruz'
        }
      }
    ];
    
    const createdUsers = [];
    
    // Create each user
    for (const testUser of testUsers) {
      try {
        // Check if user already exists
        const { data: existingUser, error: findError } = await supabaseAdmin.auth.admin.getUserByEmail(testUser.email);
        
        if (findError && findError.message !== 'User not found') {
          createdUsers.push({
            email: testUser.email,
            status: 'error',
            message: findError.message
          });
          continue;
        }
        
        if (existingUser?.user) {
          createdUsers.push({
            email: testUser.email,
            id: existingUser.user.id,
            status: 'already_exists'
          });
          continue;
        }
        
        // Create the user with the Admin API
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: testUser.email,
          password: testUser.password,
          email_confirm: true, // Auto-confirm the email
          user_metadata: testUser.user_metadata
        });
        
        if (error) {
          createdUsers.push({
            email: testUser.email,
            status: 'error',
            message: error.message
          });
        } else {
          createdUsers.push({
            email: testUser.email,
            id: data.user.id,
            status: 'created'
          });
        }
      } catch (error) {
        createdUsers.push({
          email: testUser.email,
          status: 'exception',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
    
    return NextResponse.json({
      message: 'Test users creation complete',
      users: createdUsers
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Server error' 
    }, { status: 500 });
  }
} 