"use client"

import { MapboxMap } from "@/components/map/mapbox-map"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type UserProfile } from "@/contexts/user-context"; // Import UserProfile
import {
    supabase,
    updateRideStatus, // Import utility
    type RideRequest,
    type Trider
} from "@/lib/supabase-client"
import { Loader2 } from "lucide-react"; // Add Loader2 and Navigation
import { useEffect, useState } from "react"
import { toast } from "sonner"; // Import toast directly

interface OnlineTrider {
  id: string
  name: string
  current_location: {
    latitude: number
    longitude: number
  }
  status: 'available' | 'busy' | 'offline'
  last_updated: string
}

interface ActiveBooking {
  id: string
  booking_code: string
  passenger: {
    id: string
    name: string
  }
  pickup_latitude: number
  pickup_longitude: number
  dropoff_latitude: number
  dropoff_longitude: number
  status: string
  created_at: string
}

export function DispatcherDashboard({ user }: { user: UserProfile }) { // Use UserProfile type
  const [newRides, setNewRides] = useState<RideRequest[]>([]) // Use RideRequest type
  const [assignedRides, setAssignedRides] = useState<RideRequest[]>([]) // Use RideRequest type
  const [availableTriders, setAvailableTriders] = useState<Trider[]>([]) // Use Trider type
  const [loading, setLoading] = useState(true); // Add loading state
  const [onlineTriders, setOnlineTriders] = useState<OnlineTrider[]>([])
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([])
  const [mapCenter, setMapCenter] = useState({ lat: 14.4507, lng: 120.9826 })
  const [mapMarkers, setMapMarkers] = useState<any[]>([])

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("Dispatcher: Fetching initial data...");
      try {
        // Fetch new ride requests (status: pending)
        const { data: newRidesData, error: newRidesError } = await supabase
          .from("ride_requests") // Correct table
          .select(`
            *,
            pickup_location:locations!pickup_location_id(*),
            dropoff_location:locations!dropoff_location_id(*)
          `)
          .eq("status", "pending") // Correct status
          .order("requested_at", { ascending: true }); // Correct column

        if (newRidesError) throw newRidesError;
        setNewRides(newRidesData || []);
        console.log(`Dispatcher: Fetched ${newRidesData?.length || 0} new rides.`);

        // Fetch assigned/active rides (status: accepted, picked_up)
        const { data: assignedData, error: assignedError } = await supabase
          .from("ride_requests") // Correct table
          .select(`
            *,
            pickup_location:locations!pickup_location_id(*),
            dropoff_location:locations!dropoff_location_id(*),
            trider:triders(*)
          `) // Select trider info
          .in("status", ["accepted", "picked_up"]) // Correct statuses
          .order("requested_at", { ascending: true }); // Correct column

        if (assignedError) throw assignedError;
        setAssignedRides(assignedData || []);
         console.log(`Dispatcher: Fetched ${assignedData?.length || 0} active rides.`);

        // Fetch available triders (status: online)
        const { data: tridersData, error: tridersError } = await supabase
          .from("triders") // Correct table
          .select("*") // Select necessary fields
          .eq("status", "online"); // Correct status check

        if (tridersError) throw tridersError;
        setAvailableTriders(tridersData || []);
        console.log(`Dispatcher: Fetched ${tridersData?.length || 0} available triders.`);

      } catch (error: any) {
        console.error("Dispatcher: Error fetching data:", error);
        toast.error("Data Load Failed", {
          description: error.message || "Could not load dashboard data. Please refresh.",
        });
        // Clear potentially stale data on error?
        setNewRides([]);
        setAssignedRides([]);
        setAvailableTriders([]);
      } finally {
         setLoading(false);
      }
    };

    fetchData();

    // Set up subscriptions with error handling
    const ridesSubscription = supabase
      .channel("public:ride_requests:dispatcher") // Unique channel name
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "ride_requests", // Correct table
        },
        (payload) => {
          console.log("Dispatcher: Ride change received!", payload);
          fetchData(); // Refetch all data for simplicity
        }
      )
      .subscribe((status, err) => {
         if (status === 'SUBSCRIBED') {
            console.log('Dispatcher: Subscribed to ride updates.');
         }
         if (status === 'CHANNEL_ERROR' || err) {
            console.error('Dispatcher: Ride subscription error:', err);
            toast.error("Real-time Error (Rides)", { description: "Could not subscribe to ride updates." });
         }
      });

    const tridersSubscription = supabase
      .channel("public:triders:dispatcher") // Unique channel name
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "triders", // Correct table
        },
        (payload) => {
          console.log("Dispatcher: Trider change received!", payload);
          fetchData(); // Refetch all data for simplicity
        }
      )
       .subscribe((status, err) => {
         if (status === 'SUBSCRIBED') {
            console.log('Dispatcher: Subscribed to trider updates.');
         }
         if (status === 'CHANNEL_ERROR' || err) {
            console.error('Dispatcher: Trider subscription error:', err);
            toast.error("Real-time Error (Triders)", { description: "Could not subscribe to trider updates." });
         }
      });

    // Cleanup function
    return () => {
      console.log("Dispatcher: Removing subscription channels.");
      supabase.removeChannel(ridesSubscription);
      supabase.removeChannel(tridersSubscription);
    };
  }, []); // Empty dependency array, fetchData runs once and subscriptions handle updates

  // Subscribe to real-time updates
  useEffect(() => {
    // Subscribe to trider location updates
    const triderSubscription = supabase
      .channel('trider_locations')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'trider_locations'
      }, (payload) => {
        setOnlineTriders(current => {
          const updated = [...current]
          const index = updated.findIndex(t => t.id === payload.new.trider_id)
          if (index !== -1) {
            updated[index] = {
              ...updated[index],
              current_location: {
                latitude: payload.new.latitude,
                longitude: payload.new.longitude
              },
              last_updated: payload.new.updated_at
            }
          }
          return updated
        })
      })
      .subscribe()

    // Subscribe to booking updates
    const bookingSubscription = supabase
      .channel('active_bookings')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          fetchActiveBookings()
        }
      })
      .subscribe()

    // Subscribe to dispatcher notifications
    const notificationSubscription = supabase
      .channel('dispatcher_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'dispatcher_notifications'
      }, (payload) => {
        toast.info("New Booking Alert", {
          description: "A booking requires your attention."
        })
      })
      .subscribe()

    // Initial data fetch
    fetchOnlineTriders()
    fetchActiveBookings()

    // Cleanup subscriptions
    return () => {
      triderSubscription.unsubscribe()
      bookingSubscription.unsubscribe()
      notificationSubscription.unsubscribe()
    }
  }, [])

  // Update map markers when data changes
  useEffect(() => {
    const markers = [
      // Add trider markers
      ...onlineTriders.map(trider => ({
        lat: trider.current_location.latitude,
        lng: trider.current_location.longitude,
        title: trider.name,
        type: 'trider'
      })),
      // Add booking markers
      ...activeBookings.flatMap(booking => [
        {
          lat: booking.pickup_latitude,
          lng: booking.pickup_longitude,
          title: `Pickup: ${booking.booking_code}`,
          type: 'pickup'
        },
        {
          lat: booking.dropoff_latitude,
          lng: booking.dropoff_longitude,
          title: `Dropoff: ${booking.booking_code}`,
          type: 'dropoff'
        }
      ])
    ]
    setMapMarkers(markers)
  }, [onlineTriders, activeBookings])

  const fetchOnlineTriders = async () => {
    try {
      const { data, error } = await supabase
        .from('trider_locations')
        .select(`
          id,
          trider:trider_id(id, name),
          latitude,
          longitude,
          status,
          updated_at
        `)
        .eq('status', 'available')

      if (error) throw error

      const triders: OnlineTrider[] = data.map(row => ({
        id: row.trider.id,
        name: row.trider.name,
        current_location: {
          latitude: row.latitude,
          longitude: row.longitude
        },
        status: row.status,
        last_updated: row.updated_at
      }))

      setOnlineTriders(triders)
    } catch (error) {
      console.error('Error fetching online triders:', error)
      toast.error("Failed to fetch triders")
    }
  }

  const fetchActiveBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_code,
          passenger:passenger_id(id, name),
          pickup_latitude,
          pickup_longitude,
          dropoff_latitude,
          dropoff_longitude,
          status,
          created_at
        `)
        .in('status', ['waiting_for_trider', 'accepted'])
        .order('created_at', { ascending: false })

      if (error) throw error

      setActiveBookings(data)
    } catch (error) {
      console.error('Error fetching active bookings:', error)
      toast.error("Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }

  // Assign a trider to a ride using the utility function
  const assignTrider = async (rideId: string, triderId: string | undefined) => {
     if (!triderId) {
        toast.error("No Trider Selected", { description: "Cannot assign ride without selecting a trider." });
        return;
     }
     if (!user?.id) {
         toast.error("Dispatcher Info Missing", { description: "Cannot assign ride without dispatcher ID." });
         return;
     }

     console.log(`Dispatcher ${user.id} assigning trider ${triderId} to ride ${rideId}`);
     try {
       // Use the updateRideStatus utility to set status to 'accepted' and assign trider
       // Pass dispatcher_id if needed by the function/policy (assuming it's user.id here)
       await updateRideStatus(rideId, "accepted", triderId /*, user.id */); // Pass dispatcher ID if needed

       toast.success("Trider Assigned", {
         description: `Trider ${triderId.slice(0, 8)}... assigned to ride ${rideId.slice(0,8)}...`,
       });
       // Real-time subscription should update the lists automatically
     } catch (error: any) {
       console.error("Error assigning trider:", error);
       toast.error("Assignment Failed", {
         description: error.message || "Could not assign the trider to the ride.",
       });
     }
  };

  const assignTriderToBooking = async (bookingId: string, triderId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          assigned_to: triderId,
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)

      if (error) throw error

      toast.success("Trider Assigned", {
        description: "The booking has been assigned successfully."
      })

      // Refresh the bookings list
      fetchActiveBookings()
    } catch (error) {
      console.error('Error assigning trider:', error)
      toast.error("Failed to assign trider")
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dispatcher Dashboard</h1>

      {loading && (
         <div className="text-center py-10">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading Dashboard Data...</p>
         </div>
      )}

      {!loading && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Live Map View</CardTitle>
            <CardDescription>Track triders and active bookings</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[600px] rounded-lg overflow-hidden">
              <MapboxMap
                center={mapCenter}
                markers={mapMarkers}
                height="600px"
                zoom={15}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Online Triders</CardTitle>
              <CardDescription>Currently available triders</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : onlineTriders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No triders currently online
                </p>
              ) : (
                <div className="space-y-4">
                  {onlineTriders.map(trider => (
                    <div key={trider.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{trider.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Last updated: {new Date(trider.last_updated).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant={trider.status === 'available' ? 'success' : 'secondary'}>
                        {trider.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Bookings</CardTitle>
              <CardDescription>Pending and ongoing rides</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : activeBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No active bookings
                </p>
              ) : (
                <div className="space-y-4">
                  {activeBookings.map(booking => (
                    <div key={booking.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{booking.booking_code}</p>
                          <p className="text-sm">{booking.passenger.name}</p>
                        </div>
                        <Badge variant={booking.status === 'waiting_for_trider' ? 'warning' : 'success'}>
                          {booking.status}
                        </Badge>
                      </div>
                      {booking.status === 'waiting_for_trider' && onlineTriders.length > 0 && (
                        <div className="pt-2">
                          <p className="text-sm font-medium mb-2">Assign Trider:</p>
                          <div className="flex flex-wrap gap-2">
                            {onlineTriders
                              .filter(trider => trider.status === 'available')
                              .map(trider => (
                                <Button
                                  key={trider.id}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => assignTriderToBooking(booking.id, trider.id)}
                                >
                                  {trider.name}
                                </Button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      )} {/* End conditional rendering based on loading state */}
    </div>
  )
}
