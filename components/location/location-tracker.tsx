"use client"

import { useEffect } from "react"
import { useUser } from "@/contexts/user-context"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { MapPin, MapPinOff } from "lucide-react"

interface LocationTrackerProps {
  autoStart?: boolean
  showControls?: boolean
  className?: string
}

export function LocationTracker({ 
  autoStart = false, 
  showControls = false,
  className = ""
}: LocationTrackerProps) {
  const { user, startTracking, stopTracking, isTracking } = useUser()

  // Auto-start tracking if enabled
  useEffect(() => {
    if (autoStart && user && !isTracking) {
      // Check if the browser supports geolocation
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser", {
          description: "Location tracking is not available."
        })
        return
      }

      // Request permission and start tracking
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          startTracking()
        } else if (result.state === "prompt") {
          // Will prompt the user
          toast.info("Location permission required", {
            description: "Please allow location access to use this feature."
          })
          
          // Try to start tracking, which will trigger the permission prompt
          startTracking()
        } else if (result.state === "denied") {
          toast.error("Location permission denied", {
            description: "Please enable location access in your browser settings."
          })
        }
      })
    }

    // Cleanup on unmount
    return () => {
      if (isTracking) {
        stopTracking()
      }
    }
  }, [autoStart, user, isTracking, startTracking, stopTracking])

  // Don't render anything if controls are hidden
  if (!showControls) {
    return null
  }

  return (
    <div className={className}>
      {isTracking ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={stopTracking}
          className="flex items-center gap-2"
        >
          <MapPinOff className="h-4 w-4" />
          <span>Stop Sharing Location</span>
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={startTracking}
          className="flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          <span>Share My Location</span>
        </Button>
      )}
    </div>
  )
}
