// Maps client configuration

// Get the Google Maps API key from environment variables
export const getGoogleMapsApiKey = (): string => {
  return process.env.GOOGLE_MAPS_API_KEY || ""
}

// Get the base URL for API requests
export const getBaseUrl = (): string => {
  // Use VERCEL_URL if available, otherwise fallback to localhost
  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) {
    return `https://${vercelUrl}`
  }
  return "http://localhost:3000"
}

// Check if Google Maps API key is configured
export const isGoogleMapsConfigured = (): boolean => {
  return !!getGoogleMapsApiKey()
}

// Log configuration status
if (typeof window === "undefined") {
  // Only log on server-side to avoid client console pollution
  console.log(`Google Maps configuration: ${isGoogleMapsConfigured() ? "Configured ✓" : "Not configured ✗"}`)
}

