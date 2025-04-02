import { NextResponse } from "next/server"
import { getGoogleMapsApiKey } from "@/lib/maps-client"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const callback = searchParams.get("callback") || "initMap"
  const libraries = searchParams.get("libraries") || "places"

  // Get the API key from environment variable
  const apiKey = getGoogleMapsApiKey()

  if (!apiKey) {
    const errorMessage = "Google Maps API key is not configured on the server.";
    console.error(`[API Error /api/maps] ${errorMessage}`);
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
    return NextResponse.redirect(mapsUrl, { status: 302 })
  } catch (error: any) {
    const errorMessage = "Failed to construct or redirect to Google Maps API URL.";
    console.error(`[API Error /api/maps] ${errorMessage}`, error);
    // Return a standard JSON error response with 500 status
     return NextResponse.json(
       { error: "Internal Server Error", message: errorMessage, details: error.message },
       { status: 500 }
    );
  }
}
