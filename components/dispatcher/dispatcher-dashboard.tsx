"use client"

import { TodaSelector } from "@/components/toda/toda-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type UserProfile } from "@/contexts/user-context"; // Import UserProfile
import { supabase } from "@/lib/supabase-client";
import { Loader2 } from "lucide-react"; // Add Loader2 and Navigation
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { toast } from "sonner"; // Import toast directly

// Import MapboxMap dynamically with no SSR
const MapboxMap = dynamic(
  () => import('@/components/map/mapbox-map'),
  { ssr: false, loading: () => <div className="h-full flex items-center justify-center">Loading map...</div> }
)

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
  assigned_to?: string
  trider?: {
    id: string
    first_name: string
    last_name: string
  }
}

export function DispatcherDashboard({ user }: { user: UserProfile }) {
  const [loading, setLoading] = useState(true)
  const [selectedTodaId, setSelectedTodaId] = useState<string | null>(user?.preferredTodaId || null)
  const [selectedTodaName, setSelectedTodaName] = useState<string>("")
  const [onlineTriders, setOnlineTriders] = useState<OnlineTrider[]>([])
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([])
  const [mapCenter] = useState({ lat: 14.4507, lng: 120.9826 })
  const [mapMarkers, setMapMarkers] = useState<any[]>([])

  // Add function to handle TODA selection and saving
  const handleTodaSelect = async (todaId: string) => {
    try {
      setLoading(true)
      
      // Update the profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          preferred_toda_id: todaId
        })
        .eq("id", user.id)

      if (error) throw error

      // Get TODA name
      const { data: todaData, error: todaError } = await supabase
        .from('todas')
        .select('name')
        .eq('id', todaId)
        .single()

      if (todaError) throw todaError

      setSelectedTodaId(todaId)
      setSelectedTodaName(todaData.name)

      toast.success("TODA preference saved", {
        description: "Your default TODA has been updated."
      })

      // Refresh dashboard data with new TODA
      await fetchActiveBookings()
      await fetchOnlineTriders()
      
    } catch (error) {
      console.error("Error saving TODA preference:", error)
      toast.error("Failed to save TODA preference", {
        description: "Please try again or contact support."
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch data
  useEffect(() => {
    const loadInitialData = async () => {
      if (!selectedTodaId) return
      
      setLoading(true)
      try {
        await Promise.all([
          fetchActiveBookings(),
          fetchOnlineTriders()
        ])
      } catch (error) {
        console.error("Error loading initial data:", error)
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()

    // Set up subscriptions with error handling
    const bookingsSubscription = supabase
      .channel("public:bookings:dispatcher") // Unique channel name
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "bookings", // Correct table
        },
        () => {
          console.log("Dispatcher: Booking change received!");
          fetchActiveBookings(); // Refetch bookings data
        }
      )
      .subscribe((status, err) => {
         if (status === 'SUBSCRIBED') {
            console.log('Dispatcher: Subscribed to booking updates.');
         }
         if (status === 'CHANNEL_ERROR' || err) {
            console.error('Dispatcher: Booking subscription error:', err);
            toast.error("Real-time Error (Bookings)", { description: "Could not subscribe to booking updates." });
         }
      });

    const tridersSubscription = supabase
      .channel("public:trider_locations:dispatcher") // Unique channel name
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "trider_locations", // Correct table
        },
        () => {
          console.log("Dispatcher: Trider location change received!");
          fetchOnlineTriders(); // Refetch trider data
        }
      )
       .subscribe((status, err) => {
         if (status === 'SUBSCRIBED') {
            console.log('Dispatcher: Subscribed to trider location updates.');
         }
         if (status === 'CHANNEL_ERROR' || err) {
            console.error('Dispatcher: Trider location subscription error:', err);
            toast.error("Real-time Error (Triders)", { description: "Could not subscribe to trider updates." });
         }
      });

    // Cleanup function
    return () => {
      console.log("Dispatcher: Removing subscription channels.");
      supabase.removeChannel(bookingsSubscription);
      supabase.removeChannel(tridersSubscription);
    };
  }, [selectedTodaId]); // Add selectedTodaId as dependency

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
      }, () => {
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

      // Transform the data to match the OnlineTrider interface
      const triders: OnlineTrider[] = data.map((row: any) => ({
        id: row.trider?.id || 'unknown',
        name: row.trider?.name || 'Unknown Trider',
        current_location: {
          latitude: row.latitude,
          longitude: row.longitude
        },
        status: row.status as 'available' | 'busy' | 'offline',
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
          assigned_to,
          created_at,
          trider:assigned_to(id, first_name, last_name)
        `)
        .in('status', ['pending', 'assigned', 'accepted'])
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform the data to match the ActiveBooking interface
      const bookings: ActiveBooking[] = data.map((booking: any) => ({
        id: booking.id,
        booking_code: booking.booking_code,
        passenger: {
          id: booking.passenger?.id || 'unknown',
          name: booking.passenger?.name || 'Unknown Passenger'
        },
        pickup_latitude: booking.pickup_latitude,
        pickup_longitude: booking.pickup_longitude,
        dropoff_latitude: booking.dropoff_latitude,
        dropoff_longitude: booking.dropoff_longitude,
        status: booking.status,
        created_at: booking.created_at,
        assigned_to: booking.assigned_to,
        trider: booking.trider ? {
          id: booking.trider.id,
          first_name: booking.trider.first_name,
          last_name: booking.trider.last_name
        } : undefined
      }))

      setActiveBookings(bookings)
    } catch (error) {
      console.error('Error fetching active bookings:', error)
      toast.error("Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }

  // Note: We're using assignTriderToBooking instead of this function
  // This comment is kept for documentation purposes

  const assignTriderToBooking = async (bookingId: string, triderId: string) => {
    try {
      // First check if the booking is still available
      const { data: bookingCheck, error: checkError } = await supabase
        .from('bookings')
        .select('status, assigned_to')
        .eq('id', bookingId)
        .single();

      if (checkError) throw checkError;

      // If booking is already assigned, show error
      if (bookingCheck.assigned_to || bookingCheck.status !== 'pending') {
        toast.error("Booking Unavailable", {
          description: "This booking has already been assigned to another trider."
        });
        return;
      }

      // Check if the trider is still available
      const { data: triderCheck, error: triderError } = await supabase
        .from('triders')
        .select('status')
        .eq('id', triderId)
        .single();

      if (triderError) throw triderError;

      if (triderCheck.status !== 'online') {
        toast.error("Trider Unavailable", {
          description: "This trider is no longer available."
        });
        return;
      }

      // Update the booking with transaction safety
      const { data: updatedBooking, error } = await supabase
        .from('bookings')
        .update({
          assigned_to: triderId,
          status: 'assigned', // Use 'assigned' status first
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('status', 'pending') // Only update if still pending
        .is('assigned_to', null) // Only update if not assigned
        .select()
        .single();

      if (error) throw error;

      // If no rows were updated (race condition)
      if (!updatedBooking) {
        toast.error("Assignment Failed", {
          description: "This booking may have been assigned to another trider."
        });
        return;
      }

      // Create a notification for the trider
      const { error: notificationError } = await supabase
        .from('trider_notifications')
        .insert({
          trider_id: triderId,
          booking_id: bookingId,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (notificationError) {
        console.error('Error creating trider notification:', notificationError);
        // Non-critical error, don't throw
      }

      toast.success("Trider Assigned", {
        description: "The booking has been assigned successfully. Waiting for trider to accept."
      });

      // Refresh the bookings list
      fetchActiveBookings();
    } catch (error) {
      console.error('Error assigning trider:', error);
      toast.error("Failed to assign trider", {
        description: error instanceof Error ? error.message : "An unknown error occurred"
      });
    }
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dispatcher Dashboard</h1>

      {/* TODA Selection Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>TODA Selection</CardTitle>
          <CardDescription>
            Select the TODA you want to manage. This will be saved as your default.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TodaSelector
            selectedTodaId={selectedTodaId}
            onSelect={handleTodaSelect}
          />
        </CardContent>
      </Card>

      {loading && (
        <div className="text-center py-10">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Loading Dashboard Data...</p>
        </div>
      )}

      {!loading && selectedTodaId && (
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
                            <p className="font-medium">{booking.booking_code || `Booking #${booking.id.slice(0, 8)}`}</p>
                            <p className="text-sm">{booking.passenger?.name || 'Unknown passenger'}</p>
                            {booking.assigned_to && booking.trider && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Assigned to: {booking.trider.first_name} {booking.trider.last_name}
                              </p>
                            )}
                          </div>
                          <Badge
                            variant={
                              booking.status === 'pending' ? 'warning' :
                              booking.status === 'assigned' ? 'secondary' : 'success'
                            }
                          >
                            {booking.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>

                        {/* Only show assignment options for pending bookings */}
                        {booking.status === 'pending' && onlineTriders.length > 0 && (
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

                        {/* Show status message for assigned bookings */}
                        {booking.status === 'assigned' && (
                          <div className="pt-2 text-sm text-amber-600">
                            <p>Waiting for trider to accept...</p>
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
      )}

      {!loading && !selectedTodaId && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>Please select a TODA to view the dashboard</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
