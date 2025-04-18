import { NextResponse } from "next/server"
import { getMapboxToken } from "@/lib/maps-client" // Import the Mapbox helper

export async function GET(request: Request) {
  // We don't need to parse URL parameters for Mapbox
  // Just log the request for debugging
  console.log(`[API /api/maps-proxy] Received request from ${request.url}`);

  // Get the Mapbox token using the helper function
  const mapboxToken = getMapboxToken()

  if (!mapboxToken) {
    const errorMessage = "Mapbox access token is not configured on the server.";
    console.error(`[API Error /api/maps-proxy] ${errorMessage}`);
    // Return a standard JSON error response with 500 status
    return NextResponse.json(
       { error: "Server Configuration Error", message: errorMessage },
       { status: 500 }
    );
  }

  try {
    // Instead of redirecting to the Mapbox JS file, return the token
    // This is more secure and follows Mapbox's recommended approach
    console.log(`[API /api/maps-proxy] Returning Mapbox token`);

    return NextResponse.json({
      token: mapboxToken,
      // Include CDN URLs for convenience
      jsUrl: 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js',
      cssUrl: 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css'
    });

  } catch (error: any) {
    const errorMessage = "Failed to provide Mapbox access token via proxy.";
    console.error(`[API Error /api/maps-proxy] ${errorMessage}`, error);
    // Return a standard JSON error response with 500 status
    return NextResponse.json(
      { error: "Internal Server Error", message: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}
