

// Hardcoded API keys and URLs for development purposes only
// In production, these should be environment variables
// export const GOOGLE_MAPS_API_KEY = "AIzaSyCTe26ELY4ESk4xlf6oO2tXpDvmZKrZ0hg"
export const VERCEL_URL = "https://v0-trigo-app.vercel.app/"

// Helper function to get environment variables with fallbacks
export function getEnvVariable(key: string, fallback: string): string {
  const value = process.env[key]
  if (!value && process.env.NODE_ENV !== "development") {
    console.warn(`Environment variable ${key} is not set. Using fallback.`)
  }
  return value || fallback
}

// Get Vercel URL with fallback
export function getVercelUrl(): string {
  return getEnvVariable("VERCEL_URL", VERCEL_URL)
}

