-- Function to find nearest TODA based on coordinates
CREATE OR REPLACE FUNCTION public.find_nearest_toda(lat double precision, lng double precision)
RETURNS TABLE (
  id uuid,
  name text,
  distance double precision
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    ST_Distance(
      ST_SetSRID(ST_MakePoint(lng, lat), 4326),
      ST_SetSRID(ST_MakePoint(t.center_longitude, t.center_latitude), 4326)
    ) as distance
  FROM public.todas t
  WHERE ST_DWithin(
    ST_SetSRID(ST_MakePoint(lng, lat), 4326),
    ST_SetSRID(ST_MakePoint(t.center_longitude, t.center_latitude), 4326),
    t.radius
  )
  ORDER BY distance
  LIMIT 1;
END;
$$;