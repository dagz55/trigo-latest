"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Import types and utility functions from supabase-client
import {
  supabase,
  updateTriderStatus as updateTriderStatusUtil, // Utility for trider online/offline/location
  updateRideStatus, // Utility for ride status updates
  type RideRequest,
  type Trider,
  type Location,
} from "@/lib/supabase-client"
import { type UserProfile } from "@/contexts/user-context" // Import UserProfile from context
import { toast } from "sonner" // Import toast directly
import { Loader2, MapPin, Navigation } from "lucide-react"

// Helper function to calculate distance between two points
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

// Correct component name and use UserProfile type
export function TriderDashboard({ user }: { user: UserProfile }) {
  // Find the associated trider profile based on user.id - ASSUMPTION: user.id links to triders.user_id
  // This might need adjustment based on actual data structure linking auth user to trider profile
  // For now, let's assume we need the trider ID separately. We might need to fetch it.
  const [triderProfile, setTriderProfile] = useState<Trider | null>(null);
  const [isOnline, setIsOnline] = useState(false) // Will be set from triderProfile
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null) // Type location
  const [locating, setLocating] = useState(false)
  const [rides, setRides] = useState<RideRequest[]>([]) // Use RideRequest type
  // const { toast } = useToast() // Remove useToast

  // Fetch Trider profile data on mount
  useEffect(() => {
    const fetchTriderProfile = async () => {
      if (!user?.id) return;
      console.log("Fetching trider profile for user:", user.id);
      try {
        const { data, error } = await supabase
          .from('triders')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') { // No rows found
             console.error("No trider profile found for user:", user.id);
             toast.error("Trider Profile Not Found", { description: "Could not find an associated trider profile." });
          } else {
            throw error; // Rethrow other errors
          }
        } else if (data) {
          console.log("Trider profile found:", data);
          setTriderProfile(data);
          setIsOnline(data.status === 'online' || data.status === 'busy'); // Set initial online state
          if (data.current_latitude && data.current_longitude) {
            setCurrentLocation({ lat: data.current_latitude, lng: data.current_longitude });
          }
        }
      } catch (error: any) {
        console.error("Error fetching trider profile:", error);
        toast.error("Error Loading Profile", { description: error.message || "Could not load trider profile." });
      }
    };
    fetchTriderProfile();
  }, [user]);


  // Local function to handle status updates, now uses the utility
  const handleUpdateTriderStatus = async (newStatus: 'online' | 'offline', newLocation?: { lat: number; lng: number }) => {
    if (!triderProfile) {
       toast.error("Trider profile not loaded yet.");
       return;
    }
    console.log(`Updating trider ${triderProfile.id} status to ${newStatus} ${newLocation ? 'with location' : ''}`);
    // Remove extra nested try
    try {
      // Use the imported utility function
      await updateTriderStatusUtil(
        triderProfile.id,
        newStatus,
        newLocation?.lat,
        newLocation?.lng
      );

      setIsOnline(newStatus === 'online'); // Update local state
      if (newLocation) {
        setCurrentLocation(newLocation);
      }

      toast.success(newStatus === 'online' ? "You are now online" : "You are now offline", {
        description: newStatus === 'online' ? "You can now receive ride requests" : "You will not receive new ride requests",
      });
    } catch (error: any) {
      console.error(`Error updating trider status to ${newStatus}:`, error);
      toast.error("Error Updating Status", {
        description: error.message || "Could not update your online status.",
      });
      // Optionally revert local state if update fails
      // setIsOnline(currentStatus => !currentStatus);
    }
  };

  // Handle online/offline toggle
  const handleToggleOnlineStatus = (checked: boolean) => {
    const newStatus = checked ? 'online' : 'offline';
    if (checked) {
      // If going online, first try to detect location
      detectLocation(true); // Pass flag to indicate it's for going online
    } else {
      // If going offline, just update status
      handleUpdateTriderStatus('offline');
    }
  };

  // Function to handle accepting a booking
  const handleAcceptBooking = async (bookingId: string, notificationId: string) => {
    if (!triderProfile) return;

    try {
      // 1. Update the notification status
      const { error: notificationError } = await supabase
        .from('trider_notifications')
        .update({ status: 'accepted' })
        .eq('id', notificationId);

      if (notificationError) throw notificationError;

      // 2. Update the booking with this trider's ID
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({
          trider_id: triderProfile.id,
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (bookingError) throw bookingError;

      // 3. Update trider status to busy
      await updateTriderStatusUtil(
        triderProfile.id,
        'busy',
        currentLocation?.lat,
        currentLocation?.lng
      );

      toast.success("Booking Accepted", {
        description: "You have accepted the booking. Please proceed to pickup location."
      });

      // 4. Fetch rides to update the UI
      fetchRides();

    } catch (error) {
      console.error("Error accepting booking:", error);
      toast.error("Failed to Accept", {
        description: "There was an error accepting the booking. Please try again."
      });
    }
  };

  // Function to handle declining a booking
  const handleDeclineBooking = async (notificationId: string) => {
    try {
      // Update the notification status to declined
      const { error } = await supabase
        .from('trider_notifications')
        .update({ status: 'declined' })
        .eq('id', notificationId);

      if (error) throw error;

      toast.info("Booking Declined", {
        description: "You have declined the booking request."
      });

    } catch (error) {
      console.error("Error declining booking:", error);
      toast.error("Failed to Decline", {
        description: "There was an error declining the booking. Please try again."
      });
    }
  };

  // Get trider's current location and update status/location
  const detectLocation = (isGoingOnline = false) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation Not Supported", {
        description: "Your browser doesn't support location detection.",
      });
      if (isGoingOnline) setIsOnline(false); // Prevent going online if no geolocation
      return;
    }

    if (!triderProfile) {
       toast.error("Trider profile not loaded yet.");
       if (isGoingOnline) setIsOnline(false);
       return;
    }

    setLocating(true);
    console.log("Detecting location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("Location detected:", newLocation);
        setCurrentLocation(newLocation); // Update local state first
        setLocating(false);

        // Update status and location in DB
        // If called as part of going online, set status to 'online'
        // Otherwise, just update location but keep current status (which should be online/busy)
        const statusToSet = isGoingOnline ? 'online' : (isOnline ? 'online' : 'offline'); // Maintain current online state if just updating location
         if (statusToSet === 'online') {
            handleUpdateTriderStatus('online', newLocation);
         } else {
             // If user is offline and just clicks update location, maybe don't update DB?
             // Or update location but keep status offline? Let's just update if online.
             console.log("User is offline, location detected but not updating DB status.");
             toast.info("Location Updated", { description: "Your location was detected but you remain offline." });
         }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        setLocating(false);
        toast.error("Location Error", {
          description: `${error.message}. Please enable location services.`,
        });
        // If trying to go online failed due to location error, revert the switch
        if (isGoingOnline) {
          setIsOnline(false);
          toast.warning("You remain offline", { description: "Location is required to go online." });
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Options for better accuracy
    );
  };

  // Fetch trider's assigned rides
  useEffect(() => {
    const fetchRides = async () => {
      if (!triderProfile?.id) return; // Use triderProfile ID now

      console.log("Fetching rides for trider:", triderProfile.id);
      try {
        // Use correct table and column names, and select nested locations
        const { data, error } = await supabase
          .from("ride_requests") // Correct table name
          .select(`
            *,
            pickup_location:locations!pickup_location_id(*),
            dropoff_location:locations!dropoff_location_id(*)
          `)
          .eq("trider_id", triderProfile.id) // Correct column name
          .order("requested_at", { ascending: false }); // Use correct timestamp column

        if (error) throw error; // Throw error to be caught below

        console.log(`Fetched ${data?.length || 0} rides.`);
        setRides(data || []);
      } catch (error: any) {
        console.error("Error fetching rides:", error);
        toast.error("Error Fetching Rides", {
          description: error.message || "Could not load ride data.",
        });
      }
    };

    fetchRides();

    // Subscribe to changes on the correct table and filter
    const ridesSubscription = supabase
      .channel(`public:ride_requests:trider=${triderProfile?.id}`) // Unique channel name
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ride_requests", // Correct table name
          filter: `trider_id=eq.${triderProfile?.id}`, // Correct column name
        },
        (payload) => {
          console.log("Ride change received!", payload);
          // Consider more granular updates based on payload (INSERT, UPDATE, DELETE)
          // For simplicity now, just refetch all rides
          fetchRides();
        }
      )
      .subscribe((status, err) => {
         if (status === 'SUBSCRIBED') {
            console.log('Subscribed to ride updates for trider:', triderProfile?.id);
         }
         if (status === 'CHANNEL_ERROR' || err) {
            console.error('Ride subscription error:', err);
            toast.error("Real-time Error", { description: "Could not subscribe to ride updates." });
         }
      });

    // Subscribe to trider notifications for new booking requests
    const notificationsSubscription = supabase
      .channel(`public:trider_notifications:trider=${triderProfile?.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trider_notifications",
          filter: `trider_id=eq.${triderProfile?.id} AND status=eq.pending`,
        },
        async (payload) => {
          console.log("New booking notification received!", payload);

          // Fetch the booking details
          const { data: booking, error } = await supabase
            .from('bookings')
            .select(`
              *,
              pickup_location:locations!pickup_location_id(*),
              dropoff_location:locations!dropoff_location_id(*),
              passenger:users!passenger_id(*)
            `)
            .eq('id', payload.new.booking_id)
            .single();

          if (error) {
            console.error("Error fetching booking details:", error);
            return;
          }

          // Calculate distance to pickup
          const distanceToPickup = calculateDistance(
            currentLocation?.lat || 0,
            currentLocation?.lng || 0,
            booking.pickup_location.latitude,
            booking.pickup_location.longitude
          );

          const distanceInKm = (distanceToPickup / 1000).toFixed(1);

          // Show notification to trider with accept/decline buttons
          toast({
            title: "New Ride Request",
            description: (
              <div className="space-y-2">
                <div>
                  <strong>From:</strong> {booking.pickup_location.name}<br/>
                  <strong>To:</strong> {booking.dropoff_location.name}<br/>
                  <strong>Distance:</strong> {distanceInKm} km<br/>
                  <strong>Fare:</strong> {booking.estimated_fare}
                </div>
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={() => handleAcceptBooking(booking.id, payload.new.id)}
                    className="flex-1 px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineBooking(payload.new.id)}
                    className="flex-1 px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ),
            duration: 30000, // 30 seconds to decide
          });
        }
      )
      .subscribe((status, err) => {
         if (status === 'SUBSCRIBED') {
            console.log('Subscribed to notification updates for trider:', triderProfile?.id);
         }
         if (status === 'CHANNEL_ERROR' || err) {
            console.error('Notification subscription error:', err);
            toast.error("Real-time Error", { description: "Could not subscribe to booking notifications." });
         }
      });


    // Cleanup function
    return () => {
      console.log("Removing subscription channels.");
      supabase.removeChannel(ridesSubscription);
      supabase.removeChannel(notificationsSubscription);
    };
  }, [triderProfile]); // Depend on triderProfile now

  return (
    <div className="container mx-auto py-6">
      {/* Render only if trider profile is loaded */}
      {!triderProfile ? (
         <div className="text-center py-10">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Loading Trider Profile...</p>
         </div>
      ) : (
      <>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Trider Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch id="online-mode" checked={isOnline} onCheckedChange={handleToggleOnlineStatus} />
              <Label htmlFor="online-mode">{isOnline ? "Online" : "Offline"}</Label>
            </div>
            {/* Pass false to detectLocation as this is just an update, not going online */}
            <Button variant="outline" onClick={() => detectLocation(false)} disabled={locating}>
              {locating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Navigation className="w-4 h-4 mr-2" />}
              Update Location
            </Button>
          </div>
        </div>
        {/* Remove the extra closing div here */}

      {currentLocation && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Current Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-primary" />
              <div>
                <p>
                  Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Rides</TabsTrigger>
          <TabsTrigger value="history">Ride History</TabsTrigger>
        </TabsList>

          <TabsContent value="active">
            {/* Use correct status values from schema & check triderProfile */}
            {triderProfile && rides.filter((ride) => ["accepted", "picked_up"].includes(ride.status)).length > 0 ? (
              <div className="grid gap-4">
                {rides
                  .filter((ride) => ["accepted", "picked_up"].includes(ride.status))
                  .map((ride) => (
                    // Add null check for triderProfile.id just in case, though outer check should suffice
                    <RideCard key={ride.id} ride={ride} triderId={triderProfile!.id} />
                  ))}
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No active rides at the moment</p>
            )}
          </TabsContent>

          <TabsContent value="history">
            {/* Check triderProfile */}
            {triderProfile && rides.filter((ride) => ["completed", "cancelled"].includes(ride.status)).length > 0 ? (
              <div className="grid gap-4">
                {rides
                  .filter((ride) => ["completed", "cancelled"].includes(ride.status))
                  .map((ride) => (
                     // Add null check for triderProfile.id just in case, though outer check should suffice
                    <RideCard key={ride.id} ride={ride} triderId={triderProfile!.id} isHistory />
                  ))}
              </div>
            ) : (
              <p className="text-center py-12 text-muted-foreground">No ride history yet</p>
            )}
          </TabsContent>
        </Tabs>
      </> // Closing fragment for conditional rendering
      )}
    </div> // Closing div for outer container
  )
}

// Simple ride card component - Use RideRequest type
function RideCard({ ride, triderId, isHistory = false }: { ride: RideRequest; triderId: string; isHistory?: boolean }) {
  const [cardLoading, setCardLoading] = useState(false);

  // Handler for ride actions (Start/Complete)
  const handleRideAction = async () => {
    setCardLoading(true);
    const nextStatus = ride.status === 'accepted' ? 'picked_up' : 'completed';
    console.log(`Attempting to update ride ${ride.id} to ${nextStatus}`);
    try {
      // Use the correct utility function for updating RIDE status (already correct)
      await updateRideStatus(ride.id, nextStatus, triderId);
      toast.success(`Ride ${nextStatus === 'picked_up' ? 'Started' : 'Completed'}`, {
         description: `Ride ${ride.id.slice(0, 8)} marked as ${nextStatus}.`
      });
      // No need to manually update state here, real-time subscription should handle it
    } catch (error: any) {
       console.error(`Error updating ride ${ride.id} status:`, error);
       toast.error("Update Failed", { description: error.message || "Could not update ride status." });
    } finally {
       setCardLoading(false);
    }
  };

  // Handler for contacting passenger (placeholder)
  const handleContactPassenger = () => {
     console.log("Contacting passenger for ride:", ride.id);
     // TODO: Implement actual contact logic (e.g., show phone number, open chat)
     toast.info("Contact Passenger", { description: "Contact functionality not yet implemented." });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Ride #{ride.id.slice(0, 8)}...</span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                ride.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : ride.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : (ride.status === "picked_up") // Use valid status 'picked_up' instead of 'inProgress'
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800" // Default for 'accepted' or 'pending'
              }`}
            >
              {/* Display status more dynamically */}
              {ride.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex">
              <MapPin className="w-5 h-5 mr-2 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Pickup</p>
                {/* Use correct nested location property names */}
                <p className="text-sm text-muted-foreground">
                  {ride.pickup_location?.name || 'Unknown Pickup'}
                </p>
                 <p className="text-xs text-muted-foreground">
                  {ride.pickup_location?.address}
                </p>
              </div>
            </div>

            <div className="flex">
              <MapPin className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium">Dropoff</p>
                 <p className="text-sm text-muted-foreground">
                  {ride.dropoff_location?.name || 'Unknown Dropoff'}
                </p>
                 <p className="text-xs text-muted-foreground">
                  {ride.dropoff_location?.address}
                </p>
              </div>
            </div>
          </div>

          {/* Use correct status values for button logic */}
          {!isHistory && (ride.status === 'accepted' || ride.status === 'picked_up') && (
            <div className="flex space-x-2 pt-4 border-t mt-4">
              <Button className="flex-1" onClick={handleRideAction} disabled={cardLoading}>
                 {cardLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                 {ride.status === "accepted" ? "Start Ride" : "Complete Ride"}
              </Button>
              <Button variant="outline" onClick={handleContactPassenger} disabled={cardLoading}>Contact Passenger</Button>
            </div>
          )}

          {/* Use correct fare property name */}
          {isHistory && ride.fare_amount && (
            <div className="pt-4 border-t mt-4">
              <p className="flex justify-between">
                <span>Fare:</span>
                <span className="font-medium">₱{ride.fare_amount.toFixed(2)}</span>
              </p>
              {/* Add payment method if available in schema */}
              {/* <p className="flex justify-between text-sm text-muted-foreground">
                <span>Payment:</span>
                <span>{ride.paymentMethod === "cash" ? "Cash" : "Online"}</span>
              </p> */}
            </div>
          )}
        </div> {/* Closing div for flex flex-col space-y-4 */}
      </CardContent>
    </Card>
  )
}
