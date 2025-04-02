-- Create a function to execute dynamic SQL for table creation
CREATE OR REPLACE FUNCTION create_locations_table(create_table_sql TEXT)
RETURNS void AS $$
BEGIN
    EXECUTE create_table_sql;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 