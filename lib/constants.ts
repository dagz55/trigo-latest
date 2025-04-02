// Hardcoded API keys and URLs for development purposes only
// In production, these should be environment variables
export const GOOGLE_MAPS_API_KEY = "AIzaSyCTe26ELY4ESk4xlf6oO2tXpDvmZKrZ0hg"
export const VERCEL_URL = "https://v0-trigo-app.vercel.app/"

// Helper function to get environment variables with fallbacks
export function getEnvVariable(key: string, fallback: string): string {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] as string
  }

  // Check if window is defined (client-side)
  if (typeof window !== "undefined" && (window as any).__ENV && (window as any).__ENV[key]) {
    return (window as any).__ENV[key]
  }

  return fallback
}

// Get Google Maps API key with fallback
export function getGoogleMapsApiKey(): string {
  return getEnvVariable("GOOGLE_MAPS_API_KEY", GOOGLE_MAPS_API_KEY)
}

// Get Vercel URL with fallback
export function getVercelUrl(): string {
  return getEnvVariable("VERCEL_URL", VERCEL_URL)
}

