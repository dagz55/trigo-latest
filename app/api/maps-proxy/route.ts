import { NextResponse } from "next/server"
import { getGoogleMapsApiKey } from "@/lib/maps-client" // Import the helper

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const callback = searchParams.get("callback") || "initMap"
  const libraries = searchParams.get("libraries") || "places"

  // Get the API key using the consistent helper function
  const apiKey = getGoogleMapsApiKey() // Use the helper

  if (!apiKey) {
    const errorMessage = "Google Maps API key is not configured on the server.";
    console.error(`[API Error /api/maps-proxy] ${errorMessage}`);
    // Return a standard JSON error response with 500 status
    return NextResponse.json(
       { error: "Server Configuration Error", message: errorMessage },
       { status: 500 }
    );
  }

  try {
    // Construct the Google Maps API URL
    const mapsUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries}&callback=${callback}`

    // Redirect to Google Maps API
    // Use 302 Found for temporary redirect to external resource unless specific reason for 307
    console.log(`[API /api/maps-proxy] Redirecting to: ${mapsUrl}`);
    return NextResponse.redirect(mapsUrl, { status: 302 })

  } catch (error: any) {
    const errorMessage = "Failed to construct or redirect to Google Maps API URL via proxy.";
    console.error(`[API Error /api/maps-proxy] ${errorMessage}`, error);
    // Return a standard JSON error response with 500 status
     return NextResponse.json(
       { error: "Internal Server Error", message: errorMessage, details: error.message },
       { status: 500 }
    );
  }
}
