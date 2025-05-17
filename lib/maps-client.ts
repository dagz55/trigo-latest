/**
 * Maps client utility functions for Mapbox integration
 */

// Get Mapbox access token from environment variable
export function getMapboxToken(): string | null {
  const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  
  if (!token) {
    console.warn('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is not set in environment variables');
    return null;
  }
  
  return token;
}

// Calculate distance between two coordinates in kilometers
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

// Convert degrees to radians
function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance.toFixed(1)} km`;
}

// Fetch route data from Mapbox Directions API
export async function fetchRouteData(
  startLat: number, 
  startLng: number, 
  endLat: number, 
  endLng: number
): Promise<{
  routeGeojson: any;
  distance: number;
  duration: number;
}> {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  
  if (!mapboxToken) {
    throw new Error("Mapbox token not found");
  }
  
  // Set up a controller for timeouts
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?geometries=geojson&alternatives=false&overview=full&access_token=${mapboxToken}`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch route data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.routes || data.routes.length === 0) {
      throw new Error("No routes found");
    }
    
    const route = data.routes[0];
    
    // Convert to GeoJSON format for MapboxMap component
    const routeGeojson = {
      type: 'Feature',
      properties: {},
      geometry: route.geometry
    };
    
    return {
      routeGeojson,
      distance: route.distance, // in meters
      duration: route.duration // in seconds
    };
  } catch (error) {
    console.error('Error fetching route data:', error);
    
    // Create a fallback simple straight line between points
    const fallbackGeojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [startLng, startLat],
          [endLng, endLat]
        ]
      }
    };
    
    // Use haversine formula for fallback distance calculation
    const fallbackDistance = calculateDistance(startLat, startLng, endLat, endLng) * 1000; // Convert km to meters
    
    // Estimate duration based on average speed of 20 km/h (typical tricycle speed)
    const fallbackDuration = (fallbackDistance / 1000) / 20 * 3600; // hours to seconds
    
    return {
      routeGeojson: fallbackGeojson,
      distance: fallbackDistance,
      duration: fallbackDuration
    };
  }
}
