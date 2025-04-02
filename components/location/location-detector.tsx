"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

export default function LocationDetector() {
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<any | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const { toast } = useToast()
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [manualLat, setManualLat] = useState("")
  const [manualLng, setManualLng] = useState("")

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (error) {
        console.error("Error getting user session:", error)
      }
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation. Please enter your location manually.",
        variant: "destructive",
      })
      setManualMode(true)
      return
    }

    setLocating(true)
    setPermissionDenied(false)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setCurrentLocation(pos)
        setAddress("Location detected")
        setLocating(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        setLocating(false)

        if (error.code === 1) {
          // PERMISSION_DENIED
          setPermissionDenied(true)
          toast({
            title: "Location Permission Denied",
            description:
              "You've denied access to your location. You can enter coordinates manually or try again after enabling location services.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please try again or enter coordinates manually.",
            variant: "destructive",
          })
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    )
  }

  // Handle manual location input
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const lat = Number.parseFloat(manualLat)
      const lng = Number.parseFloat(manualLng)

      if (isNaN(lat) || isNaN(lng)) {
        toast({
          title: "Invalid Coordinates",
          description: "Please enter valid latitude and longitude values.",
          variant: "destructive",
        })
        return
      }

      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        toast({
          title: "Invalid Coordinates",
          description: "Latitude must be between -90 and 90, and longitude must be between -180 and 180.",
          variant: "destructive",
        })
        return
      }

      setCurrentLocation({ lat, lng })
      setAddress("Manually entered location")
      setManualMode(false)

      toast({
        title: "Location Set",
        description: "Your location has been set manually.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set location. Please check your input and try again.",
        variant: "destructive",
      })
    }
  }

  // Save location
  const saveLocation = async () => {
    if (!user || !currentLocation) {
      toast({
        title: "Cannot Save Location",
        description: "Please ensure you are logged in and have detected your location.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from("locations").insert({
        user_id: user.id,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        address: address || "Address not available",
        toda_id: null,
      })

      if (error) throw error

      toast({
        title: "Location Saved",
        description: "Your location has been saved successfully.",
      })
    } catch (error: any) {
      console.error("Error saving location:", error)
      toast({
        title: "Error Saving Location",
        description: error.message || "An error occurred while saving your location.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detect Your Location</CardTitle>
        <CardDescription>
          Click the button to automatically detect your location or enter coordinates manually
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[200px] rounded-md bg-muted flex items-center justify-center mb-4">
          <MapPin className="w-12 h-12 text-muted-foreground" />
        </div>

        <Button onClick={getCurrentLocation} className="w-full" disabled={locating}>
          <Navigation className="w-4 h-4 mr-2" />
          {locating ? "Detecting..." : "Detect My Location"}
        </Button>

        {currentLocation && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
            <p>Longitude: {currentLocation.lng.toFixed(6)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

