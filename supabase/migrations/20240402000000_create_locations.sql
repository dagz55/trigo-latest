-- Create enum for location types
CREATE TYPE location_type AS ENUM ('pickup', 'dropoff', 'terminal');

-- Create locations table
CREATE TABLE locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    city VARCHAR NOT NULL,
    barangay VARCHAR NOT NULL,
    type location_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for city and barangay searches
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_barangay ON locations(barangay);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert initial location data
INSERT INTO locations (name, address, latitude, longitude, city, barangay, type)
VALUES (
    'Rose of Heaven Drive Corner',
    '19 Rose of Heaven Drive corner Periwinkle St., Talon Village, Talon 4, Las Piñas City',
    14.4507,
    120.9826,
    'Las Piñas City',
    'Talon Kuatro',
    'pickup'
); 