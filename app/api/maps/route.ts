import { NextResponse } from "next/server"
import { getMapboxToken } from "@/lib/maps-client"

export async function GET(_request: Request) {
  // We don't need searchParams for Mapbox token endpoint
  // const { searchParams } = new URL(request.url)

  // Get the Mapbox token from environment variable
  const mapboxToken = getMapboxToken()

  if (!mapboxToken) {
    const errorMessage = "Mapbox access token is not configured on the server.";
    console.error(`[API Error /api/maps] ${errorMessage}`);
    // Return a standard JSON error response with 500 status
    return NextResponse.json(
       { error: "Server Configuration Error", message: errorMessage },
       { status: 500 }
    );
  }

  try {
    // Return the Mapbox token as JSON
    return NextResponse.json({ token: mapboxToken });
  } catch (error: any) {
    const errorMessage = "Failed to provide Mapbox access token.";
    console.error(`[API Error /api/maps] ${errorMessage}`, error);
    // Return a standard JSON error response with 500 status
    return NextResponse.json(
      { error: "Internal Server Error", message: errorMessage, details: error.message },
      { status: 500 }
    );
  }
}
