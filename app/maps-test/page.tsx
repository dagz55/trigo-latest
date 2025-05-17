"use client"

import { Header } from "@/components/layout/header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { getMapboxToken } from "@/lib/maps-client"
import { AlertTriangle, CheckCircle, RefreshCw, XCircle } from "lucide-react"
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react"

// Import MapboxMap dynamically with no SSR
const MapboxMap = dynamic(
  () => import('@/components/map/mapbox-map'),
  { ssr: false, loading: () => <div className="h-full flex items-center justify-center">Loading map...</div> }
)

export default function MapsTestPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [mapStatus, setMapStatus] = useState<"success" | "error" | "loading">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // Check if Mapbox token is configured
    const checkMapsConfig = async () => {
      setIsLoading(true)

      try {
        // Check if API key is configured
        const mapboxToken = getMapboxToken()

        if (!mapboxToken) {
          setMapStatus("error")
          setErrorMessage("Mapbox access token is not configured")
          return
        }

        // Test if we can fetch the Mapbox token from our API
        try {
          const response = await fetch('/api/maps')
          if (response.ok) {
            const data = await response.json()
            if (data.token) {
              setMapStatus("success")
            } else {
              setMapStatus("error")
              setErrorMessage("API returned invalid Mapbox token")
            }
          } else {
            setMapStatus("error")
            setErrorMessage(`API returned status ${response.status}`)
          }
        } catch (fetchError: any) {
          setMapStatus("error")
          setErrorMessage(`Failed to fetch Mapbox token: ${fetchError.message}`)
        }
      } catch (error: any) {
        console.error("Maps test failed:", error)
        setMapStatus("error")
        setErrorMessage(error.message || "Unknown error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    checkMapsConfig()
  }, [])

  const retryLoading = () => {
    window.location.reload()
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Mapbox Integration Test</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mapbox Status</CardTitle>
            <CardDescription>Testing Mapbox API integration</CardDescription>
          </CardHeader>
          <CardContent>
            {mapStatus === "loading" ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
                <span className="ml-4">Testing Mapbox integration...</span>
              </div>
            ) : mapStatus === "success" ? (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">Mapbox Loaded Successfully</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                  <p>Mapbox API has been successfully loaded and initialized.</p>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-red-800 dark:text-red-300">Mapbox Failed to Load</AlertTitle>
                <AlertDescription className="text-red-700 dark:text-red-400">
                  <p>Failed to load Mapbox API. Please check your configuration.</p>
                  {errorMessage && (
                    <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-sm">
                      <p>
                        <strong>Error:</strong> {errorMessage}
                      </p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-6">
              <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-800 dark:text-amber-300">Environment Variables</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-400">
                  <p>Make sure you have set the following environment variables:</p>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                    <li>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</li>
                    <li>VERCEL_URL (for production deployments)</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>

            {mapStatus === "success" && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Map Preview</h3>
                <div className="rounded-md overflow-hidden border">
                  <MapboxMap
                    center={{ lat: 14.5995, lng: 120.9842 }} // Manila
                    zoom={12}
                    markers={[{
                      lat: 14.5995,
                      lng: 120.9842,
                      title: "Manila",
                      type: "terminal"
                    }]}
                    height="300px"
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={retryLoading} disabled={isLoading} className="flex items-center">
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Reload Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

