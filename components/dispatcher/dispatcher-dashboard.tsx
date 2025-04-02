"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  supabase,
  updateRideStatus, // Import utility
  type RideRequest,
  type Trider,
  type Location,
} from "@/lib/supabase-client"
import { type UserProfile } from "@/contexts/user-context" // Import UserProfile
import { toast } from "sonner" // Import toast directly
import { MapPin, Phone, MessageCircle, UserCheck, Loader2 } from "lucide-react" // Add Loader2

export function DispatcherDashboard({ user }: { user: UserProfile }) { // Use UserProfile type
  const [newRides, setNewRides] = useState<RideRequest[]>([]) // Use RideRequest type
  const [assignedRides, setAssignedRides] = useState<RideRequest[]>([]) // Use RideRequest type
  const [availableTriders, setAvailableTriders] = useState<Trider[]>([]) // Use Trider type
  const [loading, setLoading] = useState(true); // Add loading state
  // const { toast } = useToast() // Remove useToast

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
        <div className="md:col-span-2">
          <Tabs defaultValue="new">
            <TabsList className="mb-4">
              <TabsTrigger value="new">
                New Requests
                {newRides.length > 0 && (
                  <Badge className="ml-2 bg-primary" variant="secondary">
                    {newRides.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="active">Active Rides</TabsTrigger>
            </TabsList>

            <TabsContent value="new">
              {newRides.length > 0 ? (
                <div className="grid gap-4">
                  {newRides.map((ride) => (
                    <Card key={ride.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">New Ride Request</span>
                            {/* Use correct timestamp column */}
                            <Badge variant="outline">{new Date(ride.requested_at).toLocaleTimeString()}</Badge>
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
                                {/* Use correct nested location property names */}
                                <p className="text-sm text-muted-foreground">
                                  {ride.dropoff_location?.name || 'Unknown Dropoff'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {ride.dropoff_location?.address}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                             {/* Basic assignment: assign first available trider */}
                             {/* TODO: Add better trider selection UI */}
                            <Button
                               className="flex-1"
                               onClick={() => assignTrider(ride.id, availableTriders[0]?.id)}
                               disabled={availableTriders.length === 0}
                             >
                              <UserCheck className="w-4 h-4 mr-2" />
                              Assign Trider {availableTriders.length === 0 ? '(None Available)' : `(${availableTriders[0]?.first_name || 'First Available'})`}
                            </Button>
                            <Button variant="outline">
                              <Phone className="w-4 h-4 mr-2" />
                              Contact
                            </Button>
                            <Button variant="outline">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-muted-foreground">No new ride requests</p>
              )}
            </TabsContent>

            <TabsContent value="active">
              {assignedRides.length > 0 ? (
                <div className="grid gap-4">
                  {assignedRides.map((ride) => (
                    <Card key={ride.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Ride #{ride.id.slice(0, 8)}...</span>
                            {/* Use correct status values */}
                            <Badge variant={ride.status === "picked_up" ? "default" : "secondary"}>
                              {ride.status === "picked_up" ? "Picked Up" : "Accepted"}
                            </Badge>
                          </div>

                          {/* Display assigned trider info */}
                          {ride.trider && (
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                                <UserCheck className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{`${ride.trider.first_name} ${ride.trider.last_name}`}</p>
                                <p className="text-xs text-muted-foreground">{ride.trider.contact_number || "No phone"}</p>
                              </div>
                            </div>
                          )}

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
                                {/* Use correct nested location property names */}
                                <p className="text-sm text-muted-foreground">
                                  {ride.dropoff_location?.name || 'Unknown Dropoff'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {ride.dropoff_location?.address}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button variant="outline">
                              <Phone className="w-4 h-4 mr-2" />
                              Call Trider
                            </Button>
                            <Button variant="outline">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-muted-foreground">No active rides at the moment</p>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Available Triders</CardTitle>
              <CardDescription>{availableTriders.length} trider(s) currently online</CardDescription>
            </CardHeader>
            <CardContent>
              {availableTriders.length > 0 ? (
                <div className="space-y-4">
                  {/* Use correct Trider properties */}
                  {availableTriders.map((trider) => (
                    <div key={trider.id} className="flex items-center p-2 border rounded-md">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <UserCheck className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{`${trider.first_name} ${trider.last_name}`}</p>
                        <p className="text-xs text-muted-foreground">{trider.contact_number || "No phone"}</p>
                        {/* Optionally display current location if available */}
                        {trider.current_latitude && trider.current_longitude && (
                           <p className="text-xs text-muted-foreground">
                              Loc: {trider.current_latitude.toFixed(4)}, {trider.current_longitude.toFixed(4)}
                           </p>
                        )}
                      </div>
                      {/* TODO: Add button to assign this specific trider */}
                      {/* <Button size="sm" variant="ghost" onClick={() => assignTrider(selectedRideId, trider.id)}>Assign</Button> */}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">No triders available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      )} {/* End conditional rendering based on loading state */}
    </div>
  )
}
