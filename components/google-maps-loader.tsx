"use client"

import { useToast } from "@/hooks/use-toast"
import { getBaseUrl } from "@/lib/maps-client"
import { useEffect, useState } from "react"

export default function GoogleMapsLoader() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      console.log("Google Maps already loaded")
      window.googleMapsInitialized = true
      setIsLoaded(true)
      return
    }

    // Function to load the Google Maps script
    const loadGoogleMapsScript = () => {
      try {
        // Create script element
        const script = document.createElement("script")
        const baseUrl = getBaseUrl()
        script.src = `${baseUrl}/api/maps?callback=initMap&libraries=places,geometry`
        script.async = true
        script.defer = true

        // Define the callback function
        window.initMap = () => {
          console.log("Google Maps initialized successfully")
          window.googleMapsInitialized = true
          setIsLoaded(true)
          toast({
            title: "Maps Loaded",
            description: "Google Maps has been loaded successfully.",
            duration: 3000,
          })
        }

        // Handle errors
        script.onerror = () => {
          console.error("Error loading Google Maps API")
          toast({
            title: "Maps Error",
            description: "Failed to load Google Maps. Some features may be limited.",
            variant: "destructive",
            duration: 5000,
          })
          // Fallback to demo mode
          window.googleMapsInitialized = true
          setIsLoaded(true)
        }

        // Add loading timeout
        const timeout = setTimeout(() => {
          if (!window.google || !window.google.maps) {
            console.warn("Google Maps loading timed out")
            toast({
              title: "Maps Loading Timeout",
              description: "Maps are taking longer than expected to load. Some features may be limited.",
              variant: "warning",
              duration: 5000,
            })
            // Fallback to demo mode
            window.googleMapsInitialized = true
            setIsLoaded(true)
          }
        }, 10000) // 10 second timeout

        // Append script to document
        document.head.appendChild(script)

        // Cleanup
        return () => {
          clearTimeout(timeout)
          window.initMap = undefined
        }
      } catch (error) {
        console.error("Error setting up Google Maps:", error)
        toast({
          title: "Maps Setup Error",
          description: "Failed to setup Google Maps. Some features may be limited.",
          variant: "destructive",
          duration: 5000,
        })
        // Fallback to demo mode
        window.googleMapsInitialized = true
        setIsLoaded(true)
      }
    }

    loadGoogleMapsScript()
  }, [toast])

  return null
}

