'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, MapPinOff } from 'lucide-react'
import { useUser } from '@/contexts/user-context'
import { startLocationTracking } from '@/lib/location-utils'
import { toast } from 'sonner'

interface LocationTrackerProps {
  showControls?: boolean
  className?: string
}

export function LocationTracker({ showControls = true, className = '' }: LocationTrackerProps) {
  const { user } = useUser()
  const [isTracking, setIsTracking] = useState(false)
  const [stopTracking, setStopTracking] = useState<(() => void) | null>(null)

  useEffect(() => {
    return () => {
      if (stopTracking) {
        stopTracking()
      }
    }
  }, [stopTracking])

  const handleStartTracking = () => {
    if (!user?.id) {
      toast.error('Authentication Required', {
        description: 'Please sign in to share your location'
      })
      return
    }

    const stopFn = startLocationTracking(user.id)
    if (stopFn) {
      setStopTracking(() => stopFn)
      setIsTracking(true)
      toast.success('Location Sharing Started', {
        description: 'Your location is now being shared'
      })
    }
  }

  const handleStopTracking = () => {
    if (stopTracking) {
      stopTracking()
      setStopTracking(null)
      setIsTracking(false)
      toast.success('Location Sharing Stopped', {
        description: 'Your location is no longer being shared'
      })
    }
  }

  if (!showControls) {
    return null
  }

  return (
    <div className={className}>
      {isTracking ? (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleStopTracking}
          className="flex items-center gap-2"
        >
          <MapPinOff className="h-4 w-4" />
          <span>Stop Sharing Location</span>
        </Button>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleStartTracking}
          className="flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          <span>Share My Location</span>
        </Button>
      )}
    </div>
  )
}
