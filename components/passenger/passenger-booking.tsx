"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { useUser } from "@/contexts/user-context"
import type { UserLocation } from "@/contexts/user-context"
// import { useToast } from "@/hooks/use-toast" // Remove useToast hook
import { getLocationsByCity, supabase, type Location } from "@/lib/supabase-client"
import { Calendar, Check, Clock, Loader2, MapPin, Navigation, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"; // Import toast directly
// Import the TerminalExits component
import { TerminalExits } from "@/components/passenger/terminal-exits"
// Import the SavedLocations component
import { SavedLocations } from "@/components/passenger/saved-locations"
// Import dynamically
import { debounce } from 'lodash'
import dynamic from 'next/dynamic'
import { v4 as uuidv4 } from 'uuid';

const MapboxMap = dynamic(() =>
  import('@/components/map/mapbox-map').then(mod => mod.default),
  {
    ssr: false, // Ensure it only renders client-side
    loading: () => <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">Loading Map...</div>
  }
)

export function PassengerBooking() {
  // const { toast } = useToast() // Remove useToast hook usage
  const { user, updateUserProfile } = useUser()
  const [locations, setLocations] = useState<Location[]>([])
  const [pickupLocation, setPickupLocation] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [pickupSearchResults, setPickupSearchResults] = useState<Location[]>([])
  const [dropoffSearchResults, setDropoffSearchResults] = useState<Location[]>([])
  const [selectedPickup, setSelectedPickup] = useState<Location | null>(null)
  const [selectedDropoff, setSelectedDropoff] = useState<Location | null>(null)
  const [showPickupResults, setShowPickupResults] = useState(false)
  const [showDropoffResults, setShowDropoffResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [estimatedTime, setEstimatedTime] = useState<string | number>("10-15 minutes")
  const [estimatedFare, setEstimatedFare] = useState<string | number>("₱120 - ₱150")
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingCode, setBookingCode] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [terminalExits, setTerminalExits] = useState<Location[]>([])
  const [routeGeojson, setRouteGeojson] = useState<any>(null)
  const [routeDistance, setRouteDistance] = useState<number | null>(null)
  const [routeDuration, setRouteDuration] = useState<number | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 14.4507, // Talon Kuatro center
    lng: 120.9826,
  })
  const [mapMarkers, setMapMarkers] = useState<Array<{
    lat: number
    lng: number
    title: string
    type: 'pickup' | 'dropoff' | 'terminal'
  }>>([])
  const [isMapPinningMode, setIsMapPinningMode] = useState(false)
  const [mapClickEnabled, setMapClickEnabled] = useState(false)
  const [bookingStatus, setBookingStatus] = useState('waiting')
  const [dispatcherNotified, setDispatcherNotified] = useState(false)
  const [showSaveLocationDialog, setShowSaveLocationDialog] = useState(false)
  const [tempDropoffLocation, setTempDropoffLocation] = useState<Location | null>(null)

  // Update the useEffect to fetch locations from Supabase
  useEffect(() => {
    const fetchLocations = async () => {
      console.log("Fetching initial locations...")
      try {
        // Fetch locations for Las Piñas City, Talon Kuatro
        // getLocationsByCity now throws error on failure
        const cityLocations = await getLocationsByCity('Las Piñas City') // Remove type assertion
        const talonKuatroLocations = cityLocations.filter(loc => loc.barangay === 'Talon Kuatro')
        console.log(`Fetched ${talonKuatroLocations.length} locations for Talon Kuatro.`)

        if (talonKuatroLocations.length > 0) {
          setLocations(talonKuatroLocations)

          // Set default pickup to Talon Kuatro terminal if user home location wasn't set
          if (!selectedPickup) {
            const terminal = talonKuatroLocations.find(loc => loc.type === 'terminal')
            if (terminal) {
              console.log("Setting default pickup to terminal:", terminal.name)
              setSelectedPickup(terminal)
              setPickupLocation(terminal.name)
            }
          }
        } else {
           console.warn("No locations found for Talon Kuatro.")
        }
      } catch (error: any) {
        console.error('Error fetching initial locations:', error)
        toast.error("Failed to load locations", {
          description: error.message || "Could not fetch initial location data. Please refresh.",
        })
      }
    }

    fetchLocations()
    // Add selectedPickup to dependency array to prevent overwriting user home location
  }, [])

  // Set default locations when component mounts
  useEffect(() => {
    // Set pickup location to user's home address if available, adapting the type
    if (user?.homeLocation) {
      console.log("Setting default pickup from user context:", user.homeLocation)
      // Adapt UserLocation to Location type
      const homeAsLocation: Location = {
        id: `home-${user.id}`, // Create a pseudo-ID
        name: "Home", // Use a default name or user.homeLocation.address?
        address: user.homeLocation.address,
        latitude: user.homeLocation.lat, // Map lat to latitude
        longitude: user.homeLocation.lng, // Map lng to longitude
        city: "Las Piñas City", // Assume city/barangay or fetch if needed
        barangay: "Talon Kuatro", // Assume city/barangay or fetch if needed
        // Use the correct DB enum value
        type: 'custom',
        // Other fields like toda_id, created_at are optional or not applicable here
      };
      setSelectedPickup(homeAsLocation);
      setPickupLocation(homeAsLocation.name); // Use the adapted name
    } else {
      console.log("No user home location found in context.")
    }

    // Fetch terminal exits for drop-off defaults
    const fetchTerminalExits = async () => {
      console.log("Fetching terminal exits...")
      try {
        // getLocationsByCity now throws error on failure
        const allCityLocations = await getLocationsByCity('Las Piñas City') // Remove type assertion and keep rename
        const terminals = allCityLocations.filter(loc =>
          loc.type === 'terminal' &&
          loc.barangay === 'Talon Kuatro'
        )
        console.log(`Fetched ${terminals.length} terminal exits.`)
        setTerminalExits(terminals)

        // Set default drop-off to the main terminal if not already set
        if (terminals.length > 0 && !selectedDropoff) {
           console.log("Setting default dropoff to terminal:", terminals[0].name)
           setSelectedDropoff(terminals[0])
           setDropoffLocation(terminals[0].name)
        } else if (terminals.length === 0) {
            console.warn("No terminal exits found for Talon Kuatro.")
        }
      } catch (error: any) {
        console.error("Error fetching terminal exits:", error)
        toast.error("Failed to load terminals", {
          description: error.message || "Could not fetch terminal exit data. Please refresh.",
        })
      }
    }

    fetchTerminalExits()
    // Add selectedDropoff to dependency array? Maybe not needed if only setting default once.
  }, [user, selectedPickup]) // Add selectedPickup dependency here

  // Update the search functions to use Supabase with error handling
  const handlePickupSearch = async (value: string) => {
    setPickupLocation(value)
    setSelectedPickup(null) // Clear selection when searching
    if (value.length > 2) {
      console.log("Searching pickup locations for:", value)
      try {
        const { data: searchResults, error } = await supabase
          .from('locations')
          .select('*')
          .or(`name.ilike.%${value}%,address.ilike.%${value}%`)
          .eq('city', 'Las Piñas City') // Keep scope limited
          .eq('barangay', 'Talon Kuatro') // Keep scope limited
          .limit(5)

        if (error) throw error // Throw error to be caught below

        console.log(`Found ${searchResults?.length || 0} pickup results.`)
        setPickupSearchResults(searchResults || [])
        setShowPickupResults(true)
      } catch (error: any) {
          console.error("Error searching pickup locations:", error)
          toast.error("Search Failed", {
            description: error.message || "Could not perform pickup location search."
          })
          setPickupSearchResults([])
          setShowPickupResults(false)
      }
    } else {
      setPickupSearchResults([])
      setShowPickupResults(false)
    }
  }

  // Add function to save location to user profile
  const saveLocationToProfile = async (location: Location) => {
    try {
      // First, get the current authenticated user from Supabase directly
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData?.user?.id) {
        console.error("Authentication error:", authError);
        toast.error("Authentication Required", {
          description: "Please sign in to save locations"
        });
        return;
      }

      const userId = authData.user.id;
      console.log("Current authenticated user ID:", userId);

      // Log the location object for debugging
      console.log("Attempting to save location:", location);

      // Validate location object
      if (!location.id) {
        throw new Error("Invalid location data");
      }

      // Skip checking if location exists and trying to insert it directly
      // Instead, we'll use a different approach that works with RLS policies

      // First, check if the location is already saved by the user
      const { data: existingData, error: checkError } = await supabase
        .from('saved_locations')
        .select('*')
        .eq('user_id', userId)
        .eq('location_id', location.id);

      if (checkError) {
        console.error("Database error while checking location:", checkError);
        throw new Error(checkError.message || "Failed to check existing location");
      }

      // Check if location already exists in saved_locations
      if (existingData && existingData.length > 0) {
        toast.info("Location already saved", {
          description: "This location is already in your saved locations"
        });
        setShowSaveLocationDialog(false);
        return;
      }

      // Create a custom location in the user's profile instead of the locations table
      // This avoids RLS issues with the locations table
      if (user) {
        // Get current favorite locations or initialize empty array
        const favoriteLocations = user.favoriteLocations || [];

        // Add the new location to favorites
        const newFavoriteLocation = {
          address: location.address || 'Custom Pinned Location',
          lat: location.latitude,
          lng: location.longitude,
          isDefault: false
        };

        // Update user profile with the new favorite location
        await updateUserProfile({
          favoriteLocations: [...favoriteLocations, newFavoriteLocation]
        });

        toast.success("Location Saved", {
          description: "Location has been added to your saved locations"
        });

        setShowSaveLocationDialog(false);
        setTempDropoffLocation(null);
        return;
      }

      // Fallback approach if user context is not available
      // Try to insert directly into saved_locations
      const { error: insertError } = await supabase
        .from('saved_locations')
        .insert([{
          user_id: userId,
          location_id: location.id,
          created_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error("Database error while inserting:", insertError);
        throw new Error(insertError.message || "Failed to save location");
      }

      // Success handling
      toast.success("Location Saved", {
        description: "Location has been added to your saved locations"
      });

      // Clean up UI state
      setShowSaveLocationDialog(false);
      setTempDropoffLocation(null);

    } catch (error) {
      console.error("Error in saveLocationToProfile:", error);
      toast.error("Failed to save location", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  };

  // Update handleMapClick function
  const handleMapClick = useCallback((event: { lngLat: { lat: number; lng: number } }) => {
    if (!mapClickEnabled) return;

    const { lat, lng } = event.lngLat;

    // Create a new location from the clicked point with proper UUID
    const clickedLocation: Location = {
      id: uuidv4(), // Generate proper UUID instead of map- prefix
      name: "Custom Location",
      address: "Custom Pinned Location",
      latitude: lat,
      longitude: lng,
      city: "Las Piñas City",
      barangay: "Talon Kuatro",
      type: 'custom'
    };

    // Store the location temporarily
    setTempDropoffLocation(clickedLocation);

    // Show the save location dialog
    setShowSaveLocationDialog(true);

    // Disable map clicking mode
    setMapClickEnabled(false);
    setIsMapPinningMode(false);
  }, [mapClickEnabled]);

  // Enhance dropoff search with debouncing
  const debouncedDropoffSearch = useCallback(
    debounce(async (searchValue: string) => {
      if (searchValue.length < 3) return;

      console.log("Searching dropoff locations for:", searchValue);
      try {
        const { data: searchResults, error } = await supabase
          .from('locations')
          .select('*')
          .or(`name.ilike.%${searchValue}%,address.ilike.%${searchValue}%`)
          .eq('city', 'Las Piñas City')
          .eq('barangay', 'Talon Kuatro')
          .limit(5);

        if (error) throw error;

        console.log(`Found ${searchResults?.length || 0} dropoff results.`);
        setDropoffSearchResults(searchResults || []);
        setShowDropoffResults(true);
      } catch (error: any) {
        console.error("Error searching dropoff locations:", error);
        toast.error("Search Failed", {
          description: error.message || "Could not perform dropoff location search."
        });
        setDropoffSearchResults([]);
        setShowDropoffResults(false);
      }
    }, 300),
    []
  );

  // Update the handleDropoffSearch function
  const handleDropoffSearch = (value: string) => {
    setDropoffLocation(value);
    if (!value) {
      setSelectedDropoff(null);
      setDropoffSearchResults([]);
      setShowDropoffResults(false);
      return;
    }
    debouncedDropoffSearch(value);
  };

  // Update the detectCurrentLocation function
  const detectCurrentLocation = useCallback(
    async (locationType: "pickup" | "dropoff") => {
      if (isLocating) {
        return; // Prevent multiple simultaneous calls
      }

      setIsLocating(true);

      try {
        // Check for geolocation support
        if (!navigator.geolocation) {
          throw new Error("Your browser doesn't support location detection.");
        }

        // Wrap geolocation in a promise with timeout
        const getPositionPromise = new Promise<GeolocationPosition>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error("Location request timed out. Please try again."));
          }, 15000); // 15 second timeout

          navigator.geolocation.getCurrentPosition(
            (position) => {
              clearTimeout(timeoutId);
              resolve(position);
            },
            (error) => {
              clearTimeout(timeoutId);
              reject(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0
            }
          );
        });

        const position = await getPositionPromise;
        console.log("Got position:", position.coords.latitude, position.coords.longitude);

        // Create location data object with proper UUID
        const locationData: Location = {
          id: uuidv4(), // Generate proper UUID instead of timestamp
          name: "Current Location",
          address: "Current Location",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: "Las Piñas City", // Default to app's service area
          barangay: "Talon Kuatro", // Default to app's service area
          type: 'custom',
        };

        // First update the map center to ensure it's visible immediately
        const newCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setMapCenter(newCenter);
        console.log("Map center updated to current location:", newCenter);

        // Update state based on location type
        if (locationType === "pickup") {
          setSelectedPickup(locationData);
          setPickupLocation("Current Location");
          setShowPickupResults(false);

          // Update markers after setting the center
          setMapMarkers(prev => [
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              title: "Pickup",
              type: "pickup"
            },
            ...prev.filter(m => m.type !== "pickup")
          ]);
        } else {
          setSelectedDropoff(locationData);
          setDropoffLocation("Current Location");
          setShowDropoffResults(false);

          // Update markers after setting the center
          setMapMarkers(prev => [
            ...prev.filter(m => m.type !== "dropoff"),
            {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              title: "Dropoff",
              type: "dropoff"
            }
          ]);
        }

        toast.success("Location Set", {
          description: `Your current location has been set as the ${locationType} location.`
        });

      } catch (error) {
        console.error("Location detection error:", error);

        let errorMessage = "Unable to get your location. ";

        if (error instanceof GeolocationPositionError) {
          switch (error.code) {
            case GeolocationPositionError.PERMISSION_DENIED:
              errorMessage += "Please enable location access in your browser settings.";
              break;
            case GeolocationPositionError.POSITION_UNAVAILABLE:
              errorMessage += "Location service is unavailable. Please try again later.";
              break;
            case GeolocationPositionError.TIMEOUT:
              errorMessage += "Location request timed out. Please try again.";
              break;
            default:
              errorMessage += "An unknown error occurred.";
          }
        } else if (error instanceof Error) {
          errorMessage += error.message;
        }

        toast.error("Location Error", {
          description: errorMessage
        });

      } finally {
        setIsLocating(false);
      }
    },
    [isLocating, setMapCenter, setMapMarkers] // Add dependencies
  );

  // Select a location from search results
  const handleSelectPickup = (location: Location) => {
    setSelectedPickup(location)
    setPickupLocation(location.name)
    setShowPickupResults(false)
  }

  const handleSelectDropoff = (location: Location) => {
    setSelectedDropoff(location)
    setDropoffLocation(location.name)
    setShowDropoffResults(false)
  }

  // This function is now handled directly in the Terminal Exit button click handler

  // Clear selected location
  const handleClearPickup = () => {
    setSelectedPickup(null)
    setPickupLocation("")
  }

  const handleClearDropoff = () => {
    setSelectedDropoff(null)
    setDropoffLocation("")
  }

  // Book a ride
  const handleBookRide = () => {
    if (!selectedPickup || !selectedDropoff) {
      toast.warning("Missing Information", {
        description: "Please select both pickup and dropoff locations.",
      })
      return
    }

    setIsLoading(true)

    try {
      // Calculate distance between points
      const distance = calculateDistance(
        selectedPickup.latitude,
        selectedPickup.longitude,
        selectedDropoff.latitude,
        selectedDropoff.longitude
      )

      // Convert distance to kilometers
      const distanceInKm = distance / 1000

      // Base fare is PHP 25
      let fare = 25

      // Add PHP 10 for every kilometer after the first kilometer
      if (distanceInKm > 1) {
        fare += Math.ceil(distanceInKm - 1) * 10
      }

      // Estimate time: roughly 3 minutes per kilometer, minimum 5 minutes
      const estimatedTimeInMinutes = Math.max(5, Math.round(distanceInKm * 3))

      setEstimatedTime(`${estimatedTimeInMinutes}-${estimatedTimeInMinutes + 5} minutes`)
      setEstimatedFare(`₱${fare} - ₱${fare + 10}`) // Add a small range for traffic/waiting

      setIsLoading(false)
      setShowConfirmation(true)
    } catch (error) {
      console.error("Error calculating fare:", error)
      toast.error("Calculation Error", {
        description: "Could not calculate fare. Please try again."
      })
      setIsLoading(false)
    }
  }

  // Function to notify nearby triders about a new booking
  const notifyNearbyTriders = async (bookingId: string, pickupLat: number, pickupLng: number, todaId: string | undefined) => {
    if (!todaId) {
      console.log('No TODA ID provided, notifying dispatcher directly');
      await notifyDispatcher(bookingId);
      return;
    }
    try {
      // 1. Get all online triders
      const { data: onlineTriders, error: tridersError } = await supabase
        .from('triders')
        .select('*')
        .eq('status', 'online')
        .eq('toda_id', todaId);

      if (tridersError) {
        throw new Error(tridersError.message);
      }

      if (!onlineTriders || onlineTriders.length === 0) {
        console.log('No online triders found, will notify dispatcher directly');
        // If no online triders, notify dispatcher immediately instead of waiting
        await notifyDispatcher(bookingId);
        return;
      }

      // 2. Filter triders by distance (within 2km of pickup location)
      const nearbyTriders = onlineTriders.filter(trider => {
        if (!trider.current_latitude || !trider.current_longitude) return false;

        const distance = calculateDistance(
          pickupLat,
          pickupLng,
          trider.current_latitude,
          trider.current_longitude
        );

        // Convert to kilometers and check if within 2km
        return (distance / 1000) <= 2;
      });

      if (nearbyTriders.length === 0) {
        console.log('No nearby triders found, will notify dispatcher directly');
        // If no nearby triders, notify dispatcher immediately
        await notifyDispatcher(bookingId);
        return;
      }

      // 3. Create trider notifications for each nearby trider
      const notifications = nearbyTriders.map(trider => {
        // Calculate distance for each trider
        const distanceInKm = trider.current_latitude && trider.current_longitude ?
          calculateDistance(pickupLat, pickupLng, trider.current_latitude, trider.current_longitude) / 1000 : 0;

        return {
          booking_id: bookingId,
          trider_id: trider.id,
          status: 'pending',
          distance_km: parseFloat(distanceInKm.toFixed(2)),
          created_at: new Date().toISOString()
        };
      });

      const { error: notificationError } = await supabase
        .from('trider_notifications')
        .insert(notifications);

      if (notificationError) {
        throw new Error(notificationError.message);
      }

      console.log(`Notified ${nearbyTriders.length} nearby triders about booking ${bookingId}`);

    } catch (error) {
      console.error('Error notifying nearby triders:', error);
      // Fallback to dispatcher notification if trider notification fails
      await notifyDispatcher(bookingId);
    }
  };

  // Add this function to handle dispatcher notification
  const notifyDispatcher = async (bookingId: string) => {
    try {
      const { error: dispatcherError } = await supabase
        .from('dispatcher_notifications')
        .insert([{
          booking_id: bookingId,
          status: 'pending',
          notification_type: 'unassigned_booking',
          message: 'New booking requires manual assignment',
          created_at: new Date().toISOString()
        }]);

      if (dispatcherError) throw dispatcherError;

      setDispatcherNotified(true);
      toast.info("Dispatcher Notified", {
        description: "A dispatcher has been notified and will assign a trider soon."
      });
    } catch (error) {
      console.error("Error notifying dispatcher:", error);
    }
  };

  // Helper function to find nearest TODA (client-side implementation)
  const findNearestToda = async (latitude: number, longitude: number) => {
    try {
      // Get all TODAs from the database
      const { data: todas, error: todasError } = await supabase
        .from('todas')
        .select('*');

      if (todasError) {
        throw new Error(todasError.message);
      }

      if (!todas || todas.length === 0) {
        throw new Error("No TODAs available in the system");
      }

      // Calculate distance to each TODA and find the nearest one
      let nearestToda = null;
      let shortestDistance = Infinity;

      for (const toda of todas) {
        // Check if toda has the required fields
        if (toda.center_latitude && toda.center_longitude && toda.radius) {
          const distance = calculateDistance(
            latitude,
            longitude,
            toda.center_latitude,
            toda.center_longitude
          );

          // Convert distance to kilometers
          const distanceInKm = distance / 1000;

          // Check if this TODA is within its service radius and closer than previous matches
          if (distanceInKm <= toda.radius && distanceInKm < shortestDistance) {
            nearestToda = toda;
            shortestDistance = distanceInKm;
          }
        }
      }

      return nearestToda;
    } catch (error) {
      console.error("Error finding nearest TODA:", error);
      throw error;
    }
  };

  // Update the handleConfirmBooking function with enhanced implementation
  const handleConfirmBooking = async () => {
    try {
      setIsLoading(true);

      if (!user?.id) {
        throw new Error("Please sign in to make a booking");
      }

      if (!selectedPickup || !selectedDropoff) {
        throw new Error("Please select both pickup and dropoff locations");
      }

      // Create passenger object with necessary details
      const passenger = {
        id: user.id,
        name: user.name || user.email || 'Anonymous',
        cp_number: user.phone || 'Not provided'
      };

      // Get coordinates from selected locations
      const pickupCoords = [selectedPickup.latitude, selectedPickup.longitude];
      const dropoffCoords = [selectedDropoff.latitude, selectedDropoff.longitude];

      // 1. Compute Distance using Haversine formula
      const getDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) ** 2 +
                  Math.cos(lat1 * Math.PI / 180) *
                  Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      // Calculate distance between pickup and dropoff
      const distanceInKm = getDistanceKm(
        pickupCoords[0], pickupCoords[1],
        dropoffCoords[0], dropoffCoords[1]
      );

      // Calculate fare based on distance
      const baseFare = 25; // PHP
      const farePerExtraKm = 10; // PHP per km after first km
      let estimatedFareValue = baseFare;
      if (distanceInKm > 1) {
        estimatedFareValue += Math.ceil(distanceInKm - 1) * farePerExtraKm;
      }
      // Add a small range for traffic/waiting
      const fareRange = `₱${estimatedFareValue} - ₱${estimatedFareValue + 10}`;

      // 2. Call nearest TODA zone (via Supabase RPC function or client-side implementation)
      let todaData;
      try {
        // Try using the RPC function first
        const { data, error } = await supabase
          .rpc('find_nearest_toda', {
            lat: pickupCoords[0],
            lng: pickupCoords[1]
          });

        if (error) throw error;
        todaData = data;
      } catch (todaError) {
        console.warn("RPC function failed, falling back to client-side implementation", todaError);
        // Fall back to client-side implementation
        todaData = await findNearestToda(pickupCoords[0], pickupCoords[1]);
      }

      if (!todaData?.id) {
        throw new Error("No TODA available in this area");
      }

      // 3. Create booking payload
      const bookingPayload = {
        passenger_id: passenger.id,
        passenger_name: passenger.name,
        cp_number: passenger.cp_number,
        toda_id: todaData.id,
        pickup_location_id: selectedPickup.id,
        dropoff_location_id: selectedDropoff.id,
        pickup_lat: pickupCoords[0],
        pickup_lng: pickupCoords[1],
        dropoff_lat: dropoffCoords[0],
        dropoff_lng: dropoffCoords[1],
        status: 'pending',
        estimated_fare: fareRange,
        estimated_time: estimatedTime,
        created_at: new Date().toISOString()
      };

      // 4. Insert booking into DB
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingPayload)
        .select()
        .single();

      if (bookingError) {
        throw new Error(bookingError.message);
      }

      if (!booking) {
        throw new Error("Failed to create booking");
      }

      // 5. Handle successful booking
      setBookingCode(booking.code || '');
      setBookingSuccess(true);
      setBookingStatus('waiting');
      setShowConfirmation(false);

      toast.success("Booking Confirmed", {
        description: "Your booking has been confirmed. Waiting for a driver."
      });

      // 6. Notify nearby triders immediately
      await notifyNearbyTriders(booking.id, pickupCoords[0], pickupCoords[1], todaData.id);

      // 7. Start dispatcher notification timeout (if no trider accepts within 30 seconds)
      setTimeout(() => {
        if (bookingStatus === 'waiting' && booking.id) {
          notifyDispatcher(booking.id);
        }
      }, 30000);

    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Booking Failed", {
        description: error instanceof Error ? error.message : "Failed to create booking"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Note: This function is currently unused but kept for future implementation
  // We'll add a comment to indicate it's intentionally kept for future use
  /*
  // Helper function to fetch route from Mapbox Directions API
  const fetchRoute = async (start: Location, end: Location) => {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    if (!mapboxToken) {
      throw new Error("Mapbox token is missing");
    }

    const startCoords = `${start.longitude},${start.latitude}`;
    const endCoords = `${end.longitude},${end.latitude}`;
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords};${endCoords}?geometries=geojson&overview=full&access_token=${mapboxToken}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes?.length) {
      throw new Error(data.message || "No route found");
    }

    const route = data.routes[0];
    return {
      geojson: route.geometry,
      distance: route.distance,
      duration: route.duration,
    };
  };
  */

  // Reset booking
  const handleNewBooking = () => {
    setSelectedPickup(null)
    setSelectedDropoff(null)
    setPickupLocation("")
    setDropoffLocation("")
    setBookingSuccess(false)
    setShowConfirmation(false)
  }

  // Calculate distance between two points in meters
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  // Listen for booking status updates
  useEffect(() => {
    if (!bookingSuccess || !user) return;

    // Set up subscription to listen for booking updates
    const bookingSubscription = supabase
      .channel('booking-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'bookings',
        filter: `passenger_id=eq.${user.id}`,
      }, (payload) => {
        console.log('Booking update received:', payload);

        // Check if a trider has been assigned
        if (payload.new.assigned_to && payload.new.status === 'accepted') {
          setBookingStatus('accepted');
          toast.success("Ride Accepted", {
            description: "A trider has accepted your booking and is on the way."
          });
        }
      })
      .subscribe();

    // Cleanup subscription on unmount or when booking is no longer active
    return () => {
      supabase.removeChannel(bookingSubscription);
    };
  }, [bookingSuccess, user]);

  useEffect(() => {
    // Update map markers whenever selected pickup, selected dropoff, or terminal locations change
    console.log("Updating map markers...")
    const markers = []

    // Use selectedPickup object (if it exists)
    if (selectedPickup) {
      console.log("Adding pickup marker:", selectedPickup.name)
      markers.push({
        lat: selectedPickup.latitude,
        lng: selectedPickup.longitude,
        title: selectedPickup.name || 'Pickup Location',
        type: 'pickup' as const
      })
    }

    // Use selectedDropoff object (if it exists)
    if (selectedDropoff) {
      console.log("Adding dropoff marker:", selectedDropoff.name)
      markers.push({
        lat: selectedDropoff.latitude,
        lng: selectedDropoff.longitude,
        title: selectedDropoff.name || 'Drop-off Location',
        type: 'dropoff' as const
      })
    }

    // Add terminal locations
    terminalExits.forEach(terminal => {
      markers.push({
        lat: terminal.latitude,
        lng: terminal.longitude,
        title: terminal.name,
        type: 'terminal' as const
      })
    })
    console.log("Adding terminal markers:", terminalExits.length)

    setMapMarkers(markers)
    console.log("Total markers set:", markers.length)

    // Center map on selected pickup location or first terminal if available
    if (selectedPickup) {
      console.log("Centering map on pickup:", selectedPickup.name)
      setMapCenter({ lat: selectedPickup.latitude, lng: selectedPickup.longitude })
    } else if (terminalExits.length > 0) {
      console.log("Centering map on first terminal:", terminalExits[0].name)
      setMapCenter({ lat: terminalExits[0].latitude, lng: terminalExits[0].longitude })
    } else {
      console.log("Using default map center.")
      // Keep default center if no pickup or terminals
      setMapCenter({ lat: 14.4507, lng: 120.9826 })
    }
  }, [selectedPickup, selectedDropoff, terminalExits]) // Add proper dependencies

  return (
    <>
      {isLoading && (
        <LoadingOverlay message={bookingSuccess ? "Finalizing your booking..." : "Finding available triders..."} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Book a Ride</CardTitle>
            <CardDescription>Enter your pickup and dropoff locations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!bookingSuccess ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="pickup">Pickup Location</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="pickup"
                      placeholder="Enter pickup location"
                      value={pickupLocation}
                      onChange={(e) => handlePickupSearch(e.target.value)}
                      className="pl-10 pr-20"
                      disabled={bookingSuccess}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      {selectedPickup && (
                        <button
                          type="button"
                          className="p-1 mr-1"
                          onClick={handleClearPickup}
                          disabled={bookingSuccess}
                          aria-label="Clear pickup location"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 mr-1"
                        onClick={() => detectCurrentLocation("pickup")}
                        disabled={isLocating || bookingSuccess}
                      >
                        {isLocating ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Navigation className="h-3 w-3 mr-1" />
                        )}
                        Current Location
                      </Button>
                    </div>
                  </div>
                  {showPickupResults && pickupSearchResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-card rounded-md shadow-lg border">
                      <ul className="py-1 text-sm">
                        {pickupSearchResults.map((location: Location) => (
                          <li
                            key={location.id}
                            className="px-4 py-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleSelectPickup(location)}
                          >
                            <div className="font-medium">{location.name}</div>
                            <div className="text-xs text-muted-foreground">{location.address}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dropoff">Dropoff Location</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      id="dropoff"
                      placeholder="Enter dropoff location or pin on map"
                      value={dropoffLocation}
                      onChange={(e) => handleDropoffSearch(e.target.value)}
                      className="pl-10 pr-32"
                      disabled={bookingSuccess || isMapPinningMode}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      {selectedDropoff && (
                        <button
                          type="button"
                          className="p-1 mr-1"
                          onClick={handleClearDropoff}
                          disabled={bookingSuccess}
                          aria-label="Clear dropoff location"
                        >
                          <X className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 mr-1"
                        onClick={() => {
                          if (terminalExits.length > 0) {
                            setSelectedDropoff(terminalExits[0]);
                            setDropoffLocation(terminalExits[0].name);
                            setShowDropoffResults(false);
                            toast.info("Terminal Selected", {
                              description: `${terminalExits[0].name} has been set as your drop-off location.`,
                            });
                          } else {
                            toast.warning("No Terminals", {
                              description: "No terminal exits are available."
                            });
                          }
                        }}
                        disabled={bookingSuccess || isMapPinningMode}
                      >
                        <Navigation className="h-3 w-3 mr-1" />
                        Terminal Exit
                      </Button>
                      <Button
                        type="button"
                        variant={isMapPinningMode ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8"
                        onClick={() => {
                          const newPinningMode = !isMapPinningMode;
                          setIsMapPinningMode(newPinningMode);
                          setMapClickEnabled(newPinningMode);
                          if (newPinningMode) {
                            toast.info("Map Pinning Mode", {
                              description: "Click anywhere on the map to set your drop-off location."
                            });
                            // Set cursor to crosshair when pinning mode is active
                            document.body.style.cursor = 'crosshair';
                          } else {
                            // Reset cursor when pinning mode is deactivated
                            document.body.style.cursor = 'default';
                          }
                        }}
                        disabled={bookingSuccess}
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        Pin
                      </Button>
                    </div>
                  </div>
                  {showDropoffResults && dropoffSearchResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-card rounded-md shadow-lg border">
                      <ul className="py-1 text-sm">
                        {dropoffSearchResults.map((location: Location) => (
                          <li
                            key={location.id}
                            className="px-4 py-2 hover:bg-muted cursor-pointer"
                            onClick={() => handleSelectDropoff(location)}
                          >
                            <div className="font-medium">{location.name}</div>
                            <div className="text-xs text-muted-foreground">{location.address}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {!bookingSuccess && (
                  <div className="mt-4">
                    <SavedLocations
                      onSelect={(location) => {
                        setSelectedPickup(location)
                        setPickupLocation(location.name)
                        setShowPickupResults(false)

                        // Use direct toast import
                        toast.info("Location Selected", {
                          description: `${location.name} has been set as your pickup location.`,
                        })
                      }}
                    />
                  </div>
                )}

                {!bookingSuccess && (
                  <div className="mt-4">
                    <TerminalExits
                      onSelect={(terminal) => {
                        setSelectedDropoff(terminal)
                        setDropoffLocation(terminal.name)
                        setShowDropoffResults(false)

                        // Use direct toast import
                        toast.info("Terminal Selected", {
                          description: `${terminal.name} has been set as your drop-off location.`,
                        })
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4 py-4">
                <div className="flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full bg-yellow-100 flex items-center justify-center">
                    {bookingStatus === 'waiting' ? (
                      <Loader2 className="h-8 w-8 text-yellow-600 animate-spin" />
                    ) : (
                      <Check className="h-8 w-8 text-green-600" />
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium">Booking Confirmed!</h3>
                  <p className="text-sm text-yellow-600 font-medium">
                    {bookingStatus === 'waiting'
                      ? "Waiting for a trider to accept your request..."
                      : "Your ride has been accepted!"}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Booking Code:</span>
                    <span className="text-sm font-bold">{bookingCode}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Estimated Arrival:</span>
                    <span className="text-sm">{estimatedTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Estimated Fare:</span>
                    <span className="text-sm">{estimatedFare}</span>
                  </div>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {bookingStatus === 'waiting' ? (
                    <>
                      <p>Please wait while we find a trider for you.</p>
                      <p>This usually takes 1-2 minutes.</p>
                    </>
                  ) : (
                    <>
                      <p>A trider has accepted your request.</p>
                      <p>Please be ready at your pickup location.</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {!bookingSuccess ? (
              <Button
                className="w-full"
                onClick={handleBookRide}
                disabled={!selectedPickup || !selectedDropoff || isLoading}
              >
                Book Ride
              </Button>
            ) : (
              <Button className="w-full" variant="outline" onClick={handleNewBooking}>
                Book Another Ride
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Map View</CardTitle>
            <CardDescription>View your route on the map</CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-hidden rounded-b-lg">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
              {/* Use the MapboxMap component */}
              <MapboxMap
                center={mapCenter}
                markers={mapMarkers}
                routeGeojson={routeGeojson}
                height="400px"
                zoom={16}
                onClick={handleMapClick}
                style={{ cursor: mapClickEnabled ? 'crosshair' : 'grab' }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={showConfirmation && !bookingSuccess} onOpenChange={() => setDialogOpen((open) => !open)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>Please review your ride details before confirming</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex">
                <MapPin className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Pickup Location</p>
                  <p className="text-sm text-muted-foreground">{selectedPickup?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedPickup?.address}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex">
                <Navigation className="h-5 w-5 mr-2 text-red-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Dropoff Location</p>
                  <p className="text-sm text-muted-foreground">{selectedDropoff?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedDropoff?.address}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Time</p>
                    <p className="text-sm font-medium">{estimatedTime}</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Fare</p>
                    <p className="text-sm font-medium">{estimatedFare}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Save Location Dialog */}
      <Dialog open={showSaveLocationDialog} onOpenChange={setShowSaveLocationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Location</DialogTitle>
            <DialogDescription>
              Would you like to save this as your default exit point?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Custom Location</p>
                <p className="text-sm text-muted-foreground">
                  {tempDropoffLocation?.latitude.toFixed(6)}, {tempDropoffLocation?.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                // Just set as current dropoff without saving
                if (tempDropoffLocation) {
                  setSelectedDropoff(tempDropoffLocation);
                  setDropoffLocation("Custom Location");
                  setShowDropoffResults(false);
                }
                setShowSaveLocationDialog(false);
              }}
            >
              Don't Save
            </Button>
            <Button
              onClick={() => {
                if (tempDropoffLocation) {
                  // Save to profile and set as current dropoff
                  saveLocationToProfile(tempDropoffLocation);
                  setSelectedDropoff(tempDropoffLocation);
                  setDropoffLocation("Custom Location");
                  setShowDropoffResults(false);
                }
                setShowSaveLocationDialog(false);
              }}
            >
              Save as Default
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
