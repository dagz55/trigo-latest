-- First add the new column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS terminal_exit jsonb;

-- Drop the work_location column since it doesn't exist anymore
ALTER TABLE profiles 
DROP COLUMN IF EXISTS work_location;
