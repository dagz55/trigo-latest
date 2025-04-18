"use client"

import MapboxMap from "@/components/map/mapbox-map"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useUser } from "@/contexts/user-context"
import {
  supabase,
  getPendingRideRequests,
  updateRideStatus,
  updateTriderStatus,
  type RideRequest,
  type Trider
} from "@/lib/supabase-client"
import { formatDistanceToNow } from "date-fns"
import { Clock, MapPin } from "lucide-react"
import { useEffect, useState } from "react"

// Extended RideRequest type to include the fields we need
interface ExtendedRideRequest extends RideRequest {
  pickup_location?: {
    name: string;
    latitude: number;
    longitude: number;
  };
  dropoff_location?: {
    name: string;
    latitude: number;
    longitude: number;
  };
  accepted_at?: string;
  requested_at: string;
  fare_amount?: number;
}

export default function TriderDashboard() {
  const { user, startTracking, stopTracking, isTracking } = useUser()
  const [trider, setTrider] = useState<Trider | null>(null)
  const [isOnline, setIsOnline] = useState(false)
  const [pendingRides, setPendingRides] = useState<ExtendedRideRequest[]>([])
  const [currentRide, setCurrentRide] = useState<ExtendedRideRequest | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Get trider data
    const getTriderData = async () => {
      try {
        const { data, error } = await supabase
          .from('triders')
          .select('*')
          .eq('user_id', user?.id)
          .single()

        if (error) throw error
        setTrider(data)
        // Also handle 'busy' as technically online for receiving updates
        setIsOnline(data.status === 'online' || data.status === 'busy')
      } catch (error: any) {
        console.error("Error fetching trider data:", error)
        toast.error("Error Loading Profile", {
          description: error.message || "Failed to load trider data. Please try again.",
        })
      }
    }

    if (user) {
      getTriderData()
    }
  }, [user, toast])

  useEffect(() => {
    if (!trider || !isOnline) return

    // Get pending rides
    const loadPendingRides = async () => {
      try {
        const rides = await getPendingRideRequests(trider.toda_id)
        // Map the rides to include required ExtendedRideRequest properties
        const extendedRides: ExtendedRideRequest[] = rides.map(ride => ({
          ...ride,
          requested_at: ride.created_at // Assuming created_at is the equivalent of requested_at
        }))
        setPendingRides(extendedRides)
      } catch (error: any) {
        console.error("Error fetching pending rides:", error)
        toast.error("Error Fetching Rides", {
          description: error.message || "Could not fetch pending rides.",
        })
      }
    }

    loadPendingRides()

    // Subscribe to ride updates
    const rideSubscription = supabase
      .channel('ride-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ride_requests'
      }, () => {
        loadPendingRides()
      })
      .subscribe((status, err) => {
         if (status === 'CHANNEL_ERROR' || err) {
            console.error('Ride subscription error (trider):', err);
            toast.error("Real-time Error (Rides)", { description: "Could not subscribe to ride updates." });
         }
      })

    return () => {
      supabase.removeChannel(rideSubscription)
    }
  }, [trider, isOnline]) // Dependencies seem correct

  // Listen for location updates from the browser
  useEffect(() => {
    if (!isOnline) return

    // Get current position once to initialize the map
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setCurrentLocation(newLocation)
      },
      (error) => {
        console.error("Error getting initial location:", error)
        toast.error("Location Error", {
          description: `${error.message}. Please enable location services.`,
        })
      }
    )

    // Start location tracking if not already tracking
    if (!isTracking && isOnline) {
      startTracking()
    }

    return () => {
      // Stop tracking when component unmounts or trider goes offline
      if (isTracking) {
        stopTracking()
      }
    }
  }, [isOnline, isTracking, startTracking, stopTracking]) // Dependencies

  const handleOnlineToggle = async () => {
    if (!trider) return

    try {
      // Update trider status in the database
      await updateTriderStatus(
        trider.id,
        !isOnline ? 'online' : 'offline',
        currentLocation?.lat,
        currentLocation?.lng
      )

      // Update local state
      setIsOnline(!isOnline)

      // Start or stop location tracking
      if (!isOnline) {
        // Going online - start tracking
        startTracking()
      } else {
        // Going offline - stop tracking
        stopTracking()
      }

      // Show success message
      toast.success(!isOnline ? "You're now online" : "You're now offline", {
        description: !isOnline
          ? "You can now receive ride requests"
          : "You won't receive any new requests",
      })
    } catch (error: any) {
      console.error("Error updating status:", error)
      toast.error("Status Update Failed", {
        description: error.message || "Failed to update status. Please try again.",
      })
      // Optionally revert state
      // setIsOnline(prev => !prev);
    }
  }

  const handleAcceptRide = async (ride: RideRequest) => {
    if (!trider) return

    try {
      await updateRideStatus(ride.id, 'accepted', trider.id)
      await updateTriderStatus(trider.id, 'busy')
      // Map the ride to ExtendedRideRequest
      setCurrentRide({
        ...ride,
        requested_at: ride.created_at // Assuming created_at is the equivalent of requested_at
      })
      setPendingRides(rides => rides.filter(r => r.id !== ride.id))

      toast.success("Ride Accepted", {
        description: "Head to the pickup location to collect your passenger.",
      })
    } catch (error: any) {
      console.error("Error accepting ride:", error)
      toast.error("Accept Ride Failed", {
        description: error.message || "Failed to accept ride. Please try again.",
      })
    }
  }

  const handlePickupPassenger = async () => {
    if (!currentRide) return

    try {
      await updateRideStatus(currentRide.id, 'picked_up')
      setCurrentRide(prev => prev ? { ...prev, status: 'picked_up' } : null)

      toast.success("Passenger Picked Up", {
        description: "Drive safely to the drop-off location.",
      })
    } catch (error: any) {
      console.error("Error updating ride status to picked_up:", error)
      toast.error("Update Failed", {
        description: error.message || "Failed to update ride status. Please try again.",
      })
      // Revert state if needed
      // setCurrentRide(prev => prev ? { ...prev, status: 'accepted' } : null);
    }
  }

  const handleCompleteRide = async () => {
    if (!currentRide || !trider) return

    try {
      await updateRideStatus(currentRide.id, 'completed')
      await updateTriderStatus(trider.id, 'online')
      setCurrentRide(null)

      toast.success("Ride Completed", {
        description: "You're now available for new rides.",
      })
    } catch (error: any) {
      console.error("Error completing ride:", error)
      toast.error("Completion Failed", {
        description: error.message || "Failed to complete ride. Please try again.",
      })
      // Revert state if needed
      // await updateTriderStatus(trider.id, 'busy');
      // setCurrentRide(rideDataBeforeCompletion); // Need to store it first
    }
  }

  const getMapMarkers = () => {
    const markers: Array<{ lat: number; lng: number; type: "terminal" | "pickup" | "dropoff"; title?: string }> = []

    if (currentLocation) {
      markers.push({
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        title: 'Your Location',
        type: 'terminal'
      })
    }

    if (currentRide) {
      if (currentRide.pickup_location) {
        markers.push({
          lat: currentRide.pickup_location.latitude,
          lng: currentRide.pickup_location.longitude,
          title: 'Pickup: ' + currentRide.pickup_location.name,
          type: 'pickup'
        })
      }
      if (currentRide.dropoff_location) {
        markers.push({
          lat: currentRide.dropoff_location.latitude,
          lng: currentRide.dropoff_location.longitude,
          title: 'Drop-off: ' + currentRide.dropoff_location.name,
          type: 'dropoff'
        })
      }
    }

    return markers
  }

  if (!trider) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">Loading trider data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{trider.first_name} {trider.last_name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Plate Number: {trider.plate_number}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">Go Online</span>
              <Switch
                checked={isOnline}
                onCheckedChange={handleOnlineToggle}
                disabled={!!currentRide}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>
              {currentRide ? 'Current Ride' : 'Available Rides'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              {currentRide ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className={currentRide.status === 'picked_up' ? 'bg-green-500' : 'bg-blue-500'}>
                        {currentRide.status === 'picked_up' ? 'In Progress' : 'Heading to Pickup'}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm text-muted-foreground">
                          Started {formatDistanceToNow(new Date(currentRide.accepted_at || currentRide.requested_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-green-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium">Pickup</p>
                          <p className="text-xs text-muted-foreground">
                            {currentRide.pickup_location?.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-red-500 mt-1" />
                        <div>
                          <p className="text-sm font-medium">Drop-off</p>
                          <p className="text-xs text-muted-foreground">
                            {currentRide.dropoff_location?.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      {currentRide.status === 'accepted' ? (
                        <Button
                          className="w-full"
                          onClick={handlePickupPassenger}
                        >
                          Pickup Passenger
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={handleCompleteRide}
                        >
                          Complete Ride
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {isOnline ? (
                    pendingRides.length > 0 ? (
                      pendingRides.map((ride) => (
                        <div
                          key={ride.id}
                          className="p-4 rounded-lg border"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <Badge variant="secondary">
                              {formatDistanceToNow(new Date(ride.requested_at), { addSuffix: true })}
                            </Badge>
                            <span className="text-sm font-medium">
                              ₱{ride.fare_amount?.toFixed(2)}
                            </span>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-4 h-4 text-green-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium">Pickup</p>
                                <p className="text-xs text-muted-foreground">
                                  {ride.pickup_location?.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-4 h-4 text-red-500 mt-1" />
                              <div>
                                <p className="text-sm font-medium">Drop-off</p>
                                <p className="text-xs text-muted-foreground">
                                  {ride.dropoff_location?.name}
                                </p>
                              </div>
                            </div>
                          </div>

                          <Button
                            className="w-full mt-4"
                            onClick={() => handleAcceptRide(ride)}
                          >
                            Accept Ride
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 text-muted-foreground">
                        No rides available at the moment
                      </div>
                    )
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">
                      Go online to see available rides
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <MapboxMap
                center={currentLocation ? { lat: currentLocation.lat, lng: currentLocation.lng } : { lat: 14.4507, lng: 120.9826 }}
                markers={getMapMarkers().map(marker => ({
                  lat: marker.lat,
                  lng: marker.lng,
                  title: marker.title,
                  type: marker.type
                }))}
                height="400px"
                zoom={15}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
