# Environment Setup

To fix the errors you're seeing, you need to create a `.env.local` file at the root of your project with the required environment variables. 

## Required Environment Variables

Create a `.env.local` file with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nlkxmqyhrrezdrbukgdu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sa3htcXlocnJlemRyYnVrZ2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA0OTA2NTUsImV4cCI6MjAyNjA2NjY1NX0.7MGgRbhgBOZGo-MHNgSAjVKhd8ZsZv5CfXDOBdgNuRk
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5sa3htcXlocnJlemRyYnVrZ2R1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxMDQ5MDY1NSwiZXhwIjoyMDI2MDY2NjU1fQ.tAiZjALgvJuU8S-eRjlG9jK7mWbfkJcHdHLvLbhJiQ0

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoiam9yZHRyYXRvcyIsImEiOiJjbHYydHByemEwMGluM2twZG0zZ2w5MjJ1In0.HQhTbmT_8WQSr1_7QQgc7g
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12

# Application Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Additional Configuration

Make sure you have the following dependencies installed:

1. @supabase/ssr (^0.6.1)
2. @supabase/supabase-js (^2.49.4)
3. mapbox-gl (^3.11.0)
4. react-map-gl (^8.0.4)

These are the latest versions that work well with Next.js 14+.

## Fixing the Row Level Security (RLS) Issue

If you're seeing RLS errors, you need to:

1. Make sure the SUPABASE_SERVICE_ROLE_KEY is correct
2. Ensure your supabase-server-client.ts is properly using the service role key
3. Modify your Supabase RLS policies to permit the required operations

## Important Note About Service Role Keys

The service role key has full admin access to your database, so only use it on the server side and never expose it to clients. Make sure all client-side code uses the anon key only. 