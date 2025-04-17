-- Create saved_locations table
create table if not exists saved_locations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  location_id uuid references locations(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, location_id)
);

-- Add RLS (Row Level Security) policies
alter table saved_locations enable row level security;

-- Allow users to read their own saved locations
create policy "Users can view their own saved locations"
on saved_locations for select
using (auth.uid() = user_id);

-- Allow users to insert their own saved locations
create policy "Users can insert their own saved locations"
on saved_locations for insert
with check (auth.uid() = user_id);

-- Allow users to delete their own saved locations
create policy "Users can delete their own saved locations"
on saved_locations for delete
using (auth.uid() = user_id);