"use client"

import { GoogleMap } from "@/components/map/google-map"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { useToast } from "@/components/ui/use-toast" // Remove old hook
import { toast } from "sonner" // Import sonner toast
import { useUser } from "@/contexts/user-context"
import {
  supabase, // Import the actual supabase client instance
  getActiveRideRequests,
  getPendingRideRequests,
  getTriderQueue,
  getTridersByToda,
  type RideRequest,
  type Trider,
  type TriderQueueItem
} from "@/lib/supabase-client"
// import { supabase } from "@/lib/supabase-instance" // Remove incorrect import
import { formatDistanceToNow } from "date-fns"
import { Activity, Clock, MapPin, User } from "lucide-react"
import { useEffect, useState } from "react"

export default function DispatcherDashboard() {
  const { user } = useUser()
  // const { toast } = useToast() // Remove old hook usage
  const [triders, setTriders] = useState<Trider[]>([])
  const [triderQueue, setTriderQueue] = useState<TriderQueueItem[]>([])
  const [pendingRides, setPendingRides] = useState<RideRequest[]>([])
  const [activeRides, setActiveRides] = useState<RideRequest[]>([])
  const [selectedRide, setSelectedRide] = useState<RideRequest | null>(null)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const toda_id = "TK4-TODA" // Replace with actual TODA ID from context
        const [triderData, queueData, pendingData, activeData] = await Promise.all([
          getTridersByToda(toda_id),
          getTriderQueue(toda_id),
          getPendingRideRequests(toda_id),
          getActiveRideRequests(toda_id)
        ])

        setTriders(triderData)
        setTriderQueue(queueData)
        setPendingRides(pendingData)
        setActiveRides(activeData)
      } catch (error: any) { // Catch errors thrown by the utility functions
        console.error("Error loading dashboard data:", error)
        // Use sonner toast
        toast.error("Error Loading Data", {
          description: error.message || "Failed to load dashboard data. Please try again.",
        })
      }
    }

    loadInitialData()

    // Subscribe to real-time updates
    const triderSubscription = supabase
      .channel('trider-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'triders'
      }, () => {
        loadInitialData()
      })
      .subscribe((status, err) => {
         if (status === 'CHANNEL_ERROR' || err) {
            console.error('Trider subscription error:', err);
            toast.error("Real-time Error (Triders)", { description: "Could not subscribe to trider updates." });
         }
      })

    const queueSubscription = supabase
      .channel('queue-updates') // Consider more specific channel name if needed
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'trider_queue'
      }, () => {
        loadInitialData()
      })
      .subscribe((status, err) => {
         if (status === 'CHANNEL_ERROR' || err) {
            console.error('Queue subscription error:', err);
            toast.error("Real-time Error (Queue)", { description: "Could not subscribe to queue updates." });
         }
      })

    const rideSubscription = supabase
      .channel('ride-updates') // Consider more specific channel name if needed
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'ride_requests'
      }, () => {
        loadInitialData()
      })
      .subscribe((status, err) => {
         if (status === 'CHANNEL_ERROR' || err) {
            console.error('Ride subscription error:', err);
            toast.error("Real-time Error (Rides)", { description: "Could not subscribe to ride updates." });
         }
      })

    return () => {
      // Use removeChannel for cleanup
      supabase.removeChannel(triderSubscription)
      supabase.removeChannel(queueSubscription)
      supabase.removeChannel(rideSubscription)
    }
  }, []) // Remove toast from dependency array

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'busy':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getRideStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500'
      case 'accepted':
        return 'bg-blue-500'
      case 'picked_up':
        return 'bg-green-500'
      case 'completed':
        return 'bg-gray-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getMapMarkers = () => {
    if (!selectedRide) return []

    const markers = []

    if (selectedRide.pickup_location) {
      markers.push({
        lat: selectedRide.pickup_location.latitude,
        lng: selectedRide.pickup_location.longitude,
        title: 'Pickup: ' + selectedRide.pickup_location.name,
        type: 'pickup' as const // Add 'as const' for literal type
      })
    }

    if (selectedRide.dropoff_location) {
      markers.push({
        lat: selectedRide.dropoff_location.latitude,
        lng: selectedRide.dropoff_location.longitude,
        title: 'Drop-off: ' + selectedRide.dropoff_location.name,
        type: 'dropoff' as const // Add 'as const' for literal type
      })
    }

    if (selectedRide.trider && selectedRide.trider.current_latitude && selectedRide.trider.current_longitude) {
      markers.push({
        lat: selectedRide.trider.current_latitude,
        lng: selectedRide.trider.current_longitude,
        title: `Trider: ${selectedRide.trider.first_name} ${selectedRide.trider.last_name}`,
        type: 'terminal' as const // Add 'as const' for literal type (or maybe a different 'trider' type?)
      })
    }

    return markers
  }

  return (
    <div className="container py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Online Triders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {triders.filter(t => t.status === 'online').length}
            </div>
            <p className="text-xs text-muted-foreground">
              out of {triders.length} total triders
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Queue Length</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{triderQueue.length}</div>
            <p className="text-xs text-muted-foreground">triders in queue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRides.length}</div>
            <p className="text-xs text-muted-foreground">waiting for triders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRides.length}</div>
            <p className="text-xs text-muted-foreground">rides in progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Trider Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {triderQueue.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">
                          {item.trider?.first_name} {item.trider?.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.trider?.plate_number}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">#{item.queue_position}</Badge>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(item.trider?.status || 'offline')}`} />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <Tabs defaultValue="pending">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ride Requests</CardTitle>
                <TabsList>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="pending" className="mt-0">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {pendingRides.map((ride) => (
                      <div
                        key={ride.id}
                        className="p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => setSelectedRide(ride)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">
                            {formatDistanceToNow(new Date(ride.requested_at), { addSuffix: true })}
                          </Badge>
                          <Badge className={getRideStatusColor(ride.status)}>
                            {ride.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
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
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="active" className="mt-0">
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {activeRides.map((ride) => (
                      <div
                        key={ride.id}
                        className="p-4 rounded-lg border cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => setSelectedRide(ride)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {ride.trider?.first_name} {ride.trider?.last_name}
                            </span>
                          </div>
                          <Badge className={getRideStatusColor(ride.status)}>
                            {ride.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
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
                          <div className="flex items-center space-x-2 mt-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs text-muted-foreground">
                              Started {formatDistanceToNow(new Date(ride.accepted_at || ride.requested_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] rounded-lg overflow-hidden">
              <GoogleMap
                center={
                  selectedRide?.pickup_location
                    ? {
                        lat: selectedRide.pickup_location.latitude,
                        lng: selectedRide.pickup_location.longitude,
                      }
                    : { lat: 14.4507, lng: 120.9826 }
                }
                markers={getMapMarkers()}
                height="300px"
                zoom={15}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
