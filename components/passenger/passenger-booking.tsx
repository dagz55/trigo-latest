"use client"

// import { GoogleMap } from "@/components/map/google-map"
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

const MapboxMap = dynamic(() => 
  import('@/components/map/mapbox-map').then(mod => mod.MapboxMap), 
  { 
    ssr: false, // Ensure it only renders client-side
    loading: () => <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">Loading Map...</div> 
  }
)

export function PassengerBooking() {
  // const { toast } = useToast() // Remove useToast hook usage
  const { user } = useUser()
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
      if (!user?.id) {
        throw new Error("Please sign in to save locations");
      }

      // First, check if user already has a default exit point
      const { data: existingLocations, error: fetchError } = await supabase
        .from('saved_locations')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'exit_point')
        .eq('is_default', true)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw fetchError;
      }

      let result;
      
      if (existingLocations?.id) {
        // Update existing location
        const { data, error: updateError } = await supabase
          .from('saved_locations')
          .update({
            name: "Default Exit Point",
            address: location.address || `Custom Location (${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)})`,
            latitude: location.latitude,
            longitude: location.longitude,
            city: location.city || "Las Piñas City",
            barangay: location.barangay || "Talon Kuatro",
            updated_at: new Date().toISOString()
          })
          .eq('id', existingLocations.id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = data;
      } else {
        // Insert new location
        const { data, error: insertError } = await supabase
          .from('saved_locations')
          .insert({
            user_id: user.id,
            name: "Default Exit Point",
            address: location.address || `Custom Location (${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)})`,
            latitude: location.latitude,
            longitude: location.longitude,
            city: location.city || "Las Piñas City",
            barangay: location.barangay || "Talon Kuatro",
            type: 'exit_point',
            is_default: true,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) throw insertError;
        result = data;
      }

      if (result) {
        toast.success("Location Saved", {
          description: "This location has been saved as your default exit point."
        });
      }

      return result;
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error("Save Failed", {
        description: error instanceof Error ? error.message : "Could not save the location. Please try again."
      });
      return null;
    }
  };

  // Update handleMapClick function
  const handleMapClick = useCallback((event: { lngLat: { lat: number; lng: number } }) => {
    if (!mapClickEnabled) return;

    const { lat, lng } = event.lngLat;
    
    // Create a new location from the clicked point
    const clickedLocation: Location = {
      id: `map-${Date.now()}`,
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
  }, [mapClickEnabled, user?.id]);

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
          }, 10000); // 10 second timeout

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
              timeout: 10000,
              maximumAge: 0
            }
          );
        });

        const position = await getPositionPromise;

        // Create location data object
        const locationData: Location = {
          id: `current-${Date.now()}`,
          name: "Current Location",
          address: "Current Location",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: "Las Piñas City", // Default to app's service area
          barangay: "Talon Kuatro", // Default to app's service area
          type: 'custom',
        };

        // Update state based on location type
        if (locationType === "pickup") {
          setSelectedPickup(locationData);
          setPickupLocation("Current Location");
          setShowPickupResults(false);
          setMapCenter({ 
            lat: position.coords.latitude, 
            lng: position.coords.longitude 
          });
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

  // Select a terminal exit for drop-off
  const selectTerminalExit = (terminal: Location) => {
    setSelectedDropoff(terminal)
    setDropoffLocation(terminal.name)
    setShowDropoffResults(false)

    // Use direct toast import
    toast.info("Terminal Selected", {
      description: `${terminal.name} has been set as your drop-off location.`,
    })
  }

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

  // Add this function to handle dispatcher notification
  const notifyDispatcher = async (bookingId: string) => {
    try {
      const { data: dispatcherData, error: dispatcherError } = await supabase
        .from('dispatcher_notifications')
        .insert([{
          booking_id: bookingId,
          status: 'pending',
          notification_type: 'unassigned_booking',
          message: 'New booking requires manual assignment',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (dispatcherError) throw dispatcherError;

      setDispatcherNotified(true);
      toast.info("Dispatcher Notified", {
        description: "A dispatcher has been notified and will assign a trider soon."
      });
    } catch (error) {
      console.error("Error notifying dispatcher:", error);
    }
  };

  // Update the handleConfirmBooking function with better error handling
  const handleConfirmBooking = async () => {
    if (!user || !selectedPickup || !selectedDropoff) {
      toast.error("Invalid Booking", {
        description: "Please select both pickup and dropoff locations."
      });
      return;
    }

    setIsLoading(true);
    try {
      // Generate booking code
      const bookingCode = `TG${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Get TODA ID
      const todaId = selectedPickup.toda_id || selectedDropoff.toda_id;
      if (!todaId) {
        throw new Error("No TODA assigned to pickup or dropoff location");
      }

      // Parse fare and time values
      const parsedFare = parseFloat(String(estimatedFare).replace(/[^\d.]/g, ''));
      const parsedTime = parseInt(String(estimatedTime).replace(/[^\d]/g, ''));

      if (isNaN(parsedFare) || isNaN(parsedTime) || parsedFare <= 0 || parsedTime <= 0) {
        throw new Error("Invalid fare or time values");
      }

      // Calculate route metrics
      const routeMetrics = {
        distance: routeDistance || 0,
        duration: routeDuration || 0,
        geometry: routeGeojson || '',
      };

      // Prepare the ride request data
      const rideRequestData = {
        booking_code: bookingCode,
        passenger_id: user.id,
        toda_id: todaId,
        pickup_location_id: selectedPickup.id,
        dropoff_location_id: selectedDropoff.id,
        pickup_name: selectedPickup.name,
        pickup_address: selectedPickup.address,
        pickup_latitude: selectedPickup.latitude,
        pickup_longitude: selectedPickup.longitude,
        dropoff_name: selectedDropoff.name,
        dropoff_address: selectedDropoff.address,
        dropoff_latitude: selectedDropoff.latitude,
        dropoff_longitude: selectedDropoff.longitude,
        status: 'pending',
        estimated_fare: parsedFare,
        estimated_time: parsedTime,
        route_distance: routeMetrics.distance,
        route_duration: routeMetrics.duration,
        route_geometry: routeMetrics.geometry,
        created_at: new Date().toISOString()
      };

      // Insert the ride request
      const { data: newRideRequest, error: insertError } = await supabase
        .from('ride_requests')
        .insert([rideRequestData])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating ride request:', insertError);
        throw new Error(insertError.message);
      }

      if (!newRideRequest) {
        throw new Error('Failed to create ride request');
      }

      // Update UI state
      setBookingCode(bookingCode);
      setBookingSuccess(true);
      setBookingStatus('waiting');
      setShowConfirmation(false);

      // Start dispatcher notification timeout
      setTimeout(() => {
        if (bookingStatus === 'waiting' && newRideRequest.id) {
          notifyDispatcher(newRideRequest.id);
        }
      }, 30000);

      toast.success("Booking Successful", {
        description: `Your ride has been booked. Booking code: ${bookingCode}`
      });

    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error("Booking Failed", {
        description: error.message || "Could not process your booking. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to fetch route from Mapbox Directions API
  const fetchRoute = async (start: Location, end: Location) => {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
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
                        onClick={() => detectCurrentLocation("dropoff")}
                        disabled={isLocating || bookingSuccess || isMapPinningMode}
                      >
                        {isLocating ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Navigation className="h-3 w-3 mr-1" />
                        )}
                        Current
                      </Button>
                      <Button
                        type="button"
                        variant={isMapPinningMode ? "secondary" : "ghost"}
                        size="sm"
                        className="h-8"
                        onClick={() => {
                          setIsMapPinningMode(!isMapPinningMode);
                          setMapClickEnabled(!mapClickEnabled);
                          if (!isMapPinningMode) {
                            toast.info("Map Pinning Mode", {
                              description: "Click anywhere on the map to set your drop-off location."
                            });
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
