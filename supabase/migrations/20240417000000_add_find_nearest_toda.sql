-- Function to find nearest TODA based on coordinates - always returns a result
CREATE OR REPLACE FUNCTION public.find_nearest_toda(lat double precision, lng double precision)
RETURNS TABLE (
  id uuid,
  name text,
  distance double precision
)
LANGUAGE plpgsql
AS $$
DECLARE
  point_geom geometry;
  found_toda boolean := false;
BEGIN
  point_geom := ST_SetSRID(ST_MakePoint(lng, lat), 4326);

  -- First try: Find TODA within 2km radius with coverage area
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    ST_Distance(point_geom, ST_Centroid(t.coverage_area)) as distance
  FROM public.todas t
  WHERE
    t.status = 'active' AND
    t.coverage_area IS NOT NULL AND
    ST_DWithin(point_geom, t.coverage_area, 2000) -- 2km radius in meters
  ORDER BY distance
  LIMIT 1;

  IF FOUND THEN
    found_toda := true;
  END IF;

  -- Second try: Find any TODA with coverage area, regardless of distance
  IF NOT found_toda THEN
    RETURN QUERY
    SELECT
      t.id,
      t.name,
      ST_Distance(point_geom, ST_Centroid(t.coverage_area)) as distance
    FROM public.todas t
    WHERE
      t.status = 'active' AND
      t.coverage_area IS NOT NULL
    ORDER BY distance
    LIMIT 1;

    IF FOUND THEN
      found_toda := true;
    END IF;
  END IF;

  -- Third try: Find any TODA with center coordinates
  IF NOT found_toda THEN
    RETURN QUERY
    SELECT
      t.id,
      t.name,
      ST_Distance(
        point_geom,
        ST_SetSRID(ST_MakePoint(t.center_longitude, t.center_latitude), 4326)
      ) as distance
    FROM public.todas t
    WHERE
      t.status = 'active' AND
      t.center_latitude IS NOT NULL AND
      t.center_longitude IS NOT NULL
    ORDER BY distance
    LIMIT 1;

    IF FOUND THEN
      found_toda := true;
    END IF;
  END IF;

  -- Last resort: Any active TODA
  IF NOT found_toda THEN
    RETURN QUERY
    SELECT
      t.id,
      t.name,
      0::double precision as distance
    FROM public.todas t
    WHERE t.status = 'active'
    LIMIT 1;

    IF FOUND THEN
      found_toda := true;
    END IF;
  END IF;

  -- If still no TODA found, return a virtual one
  IF NOT found_toda THEN
    RETURN QUERY
    SELECT
      '00000000-0000-0000-0000-000000000000'::uuid as id,
      'Default TODA'::text as name,
      0::double precision as distance;
  END IF;
END;
$$;

-- Add fallback function for backward compatibility - always returns a TODA
CREATE OR REPLACE FUNCTION public.find_nearest_toda_fallback(lat double precision, lng double precision)
RETURNS TABLE (
  id uuid,
  name text,
  code text,
  city text,
  barangay text
)
LANGUAGE plpgsql
AS $$
BEGIN
  -- First try to find a TODA in the specified city/barangay
  RETURN QUERY
  SELECT
    t.id,
    t.name,
    t.code,
    t.city,
    t.barangay
  FROM public.todas t
  WHERE
    t.status = 'active' AND
    t.city = 'Las Piñas City' AND
    t.barangay = 'Talon Kuatro'
  LIMIT 1;

  -- If no rows were returned, try any active TODA
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT
      t.id,
      t.name,
      t.code,
      t.city,
      t.barangay
    FROM public.todas t
    WHERE t.status = 'active'
    LIMIT 1;
  END IF;

  -- If still no rows, create a virtual TODA
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT
      '00000000-0000-0000-0000-000000000000'::uuid as id,
      'Default TODA'::text as name,
      'DEFAULT'::text as code,
      'Default City'::text as city,
      'Default Barangay'::text as barangay;
  END IF;
END;
$$;