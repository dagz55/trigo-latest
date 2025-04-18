-- Add preferred_toda_id to profiles table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'preferred_toda_id'
  ) THEN
    ALTER TABLE profiles
    ADD COLUMN preferred_toda_id UUID REFERENCES todas(id);
  END IF;
END $$;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_toda_id ON profiles(preferred_toda_id);