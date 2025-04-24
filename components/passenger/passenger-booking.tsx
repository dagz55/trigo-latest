"use client"

import { TodaSelector } from "@/components/toda/toda-selector"
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
import { Loader2, MapPin, Navigation, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"; // Import toast directly
// Import the TerminalExits component
import { TerminalExits } from "@/components/passenger/terminal-exits"
// Import the SavedLocations component
// Import dynamically
import { debounce } from 'lodash'
import dynamic from 'next/dynamic'
import { v4 as uuidv4 } from 'uuid'

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
  const [mapCenter, setMapCenter] = useState({
    lat: 14.5995,
    lng: 120.9826,
  })
  const [mapMarkers, setMapMarkers] = useState<Array<{
    lat: number
    lng: number
    title: string
    type?: string
  }>>([])
  const [isMapPinningMode, setIsMapPinningMode] = useState(false)
  const [mapClickEnabled, setMapClickEnabled] = useState(false)
  const [bookingStatus, setBookingStatus] = useState('waiting')
  const [dispatcherNotified, setDispatcherNotified] = useState(false)
  const [showSaveLocationDialog, setShowSaveLocationDialog] = useState(false)
  const [tempDropoffLocation, setTempDropoffLocation] = useState<Location | null>(null)
  const [selectedTodaId, setSelectedTodaId] = useState<string | null>(user?.preferredTodaId || null)
  const [selectedTodaName, setSelectedTodaName] = useState<string | null>(null)

  // Load TODA name if user has a preferred TODA
  useEffect(() => {
    if (selectedTodaId) {
      supabase
        .from('todas')
        .select('name')
        .eq('id', selectedTodaId)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setSelectedTodaName(data.name);
          }
        });
    }
  }, [selectedTodaId]);

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
  const detectCurrentLocation = async (locationType: 'pickup' | 'dropoff') => {
      setIsLocating(true);

      try {
      // Add Navigator lock handling
      if (navigator.permissions) {
        const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
        if (permissionStatus.state === 'denied') {
          toast({
            title: "Location Access Denied",
            description: "Please enable location access in your browser settings.",
            variant: "destructive"
          });
          setIsLocating(false);
          return;
        }
      }
      
      const position = await getCurrentPosition().catch(error => {
        console.error('Error getting current position:', error);
        toast({
          title: "Location Error",
          description: error.message || "Couldn't get your current location.",
          variant: "destructive"
        });
        throw error; // Re-throw to be caught by outer catch block
      });
      
      const { latitude, longitude } = position.coords;
      
      // Format coordinates for geocoding API
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!mapboxToken) {
        throw new Error("Mapbox token not found");
      }
      
      // Get location name from coordinates using Mapbox Geocoding API
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxToken}&types=address,poi,neighborhood,locality`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location name');
      }
      
      const data = await response.json();
      
      // Extract location name and address
      let locationName = "Current Location";
      let fullAddress = "";
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        locationName = feature.text || "Current Location";
        fullAddress = feature.place_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      }
      
      // Create location object
      const location = {
          id: `current-${Date.now()}`,
        name: locationName,
        address: fullAddress,
        latitude,
        longitude,
        city: "Las Piñas City", // Default city
        barangay: "Talon Kuatro", // Default barangay
        type: "custom" as LocationType
        };

        // Update state based on location type
      if (locationType === 'pickup') {
        setSelectedPickup(location);
        setPickupLocation(location.name);
          setShowPickupResults(false);
        } else {
        setSelectedDropoff(location);
        setDropoffLocation(location.name);
          setShowDropoffResults(false);
      }
      
      // If both locations are selected, fetch route data
      if (
        (locationType === 'pickup' && selectedDropoff) ||
        (locationType === 'dropoff' && selectedPickup)
      ) {
        const startLocation = locationType === 'pickup' ? location : selectedPickup!;
        const endLocation = locationType === 'pickup' ? selectedDropoff! : location;
        
        await fetchRouteData(
          startLocation.latitude,
          startLocation.longitude,
          endLocation.latitude,
          endLocation.longitude
        );
      }
      
      // Save location to user profile for future use
      if (user) {
        try {
          await saveLocationToProfile(location);
        } catch (error) {
          console.error('Failed to save location to profile:', error);
          // Don't throw error here, just log it
        }
      }
    } catch (error) {
      console.error('Error detecting current location:', error);
      toast({
        title: "Location Error",
        description: (error as Error).message || "Couldn't detect your current location.",
        variant: "destructive"
      });
      } finally {
        setIsLocating(false);
      }
  };

  // Add a useEffect to get current location when the component mounts
  useEffect(() => {
    // Only auto-detect location if we don't already have a pickup set 
    // and user didn't explicitly set a location
    if (!selectedPickup && !pickupLocation) {
      detectCurrentLocation("pickup");
    }
  }, [selectedPickup, pickupLocation, detectCurrentLocation]); // Add proper dependencies

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
  // Returns the number of triders notified, or 0 if none were found or notification failed
  const notifyNearbyTriders = async (bookingId: string, pickupLat: number, pickupLng: number, todaId: string | undefined): Promise<number> => {
    if (!todaId) {
      console.log('No TODA ID provided');
      return 0; // Return 0 to indicate no triders were notified
    }

    // Default to using the virtual TODA ID if the provided ID is the default one
    const effectiveTodaId = todaId === "00000000-0000-0000-0000-000000000000" ? undefined : todaId;

    try {
      // 1. Get all online triders
      let query = supabase
        .from('triders')
        .select('*')
        .eq('status', 'online');

      // Only filter by TODA ID if we have a real one
      if (effectiveTodaId) {
        query = query.eq('toda_id', effectiveTodaId);
      }

      const { data: onlineTriders, error: tridersError } = await query;

      if (tridersError) {
        console.error('Error fetching online triders:', tridersError);
        return 0; // Return 0 instead of throwing
      }

      if (!onlineTriders || onlineTriders.length === 0) {
        console.log('No online triders found');
        return 0; // Return 0 to indicate no triders were notified
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
        console.log('No nearby triders found');
        return 0; // Return 0 to indicate no triders were notified
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

      // Handle the case where we have no notifications to insert
      if (notifications.length === 0) {
        console.log('No notifications to insert');
        return 0;
      }

      const { error: notificationError } = await supabase
        .from('trider_notifications')
        .insert(notifications);

      if (notificationError) {
        console.error('Error inserting trider notifications:', notificationError);
        return 0; // Return 0 instead of throwing
      }

      console.log(`Notified ${nearbyTriders.length} nearby triders about booking ${bookingId}`);
      return nearbyTriders.length; // Return the number of triders notified

    } catch (error) {
      console.error('Error notifying nearby triders:', error);
      return 0; // Return 0 to indicate notification failed
    }
  };

  // Enhanced function to handle dispatcher notification with booking status check
  const notifyDispatcher = async (bookingId: string) => {
    if (dispatcherNotified) {
      console.log('Dispatcher already notified for this booking');
      return;
    }

    try {
      console.log(`Notifying dispatcher about booking ${bookingId}`);

      // First, check if the booking is still pending and unassigned
      const { data: bookingCheck, error: checkError } = await supabase
        .from('bookings')
        .select('status, assigned_to')
        .eq('id', bookingId)
        .single();

      if (checkError) throw checkError;

      // Only notify dispatcher if booking is still pending and not assigned
      if (bookingCheck.status !== 'pending' || bookingCheck.assigned_to) {
        console.log('Booking already assigned or not pending, no need to notify dispatcher');
        return;
      }

      // Create a notification for the dispatcher
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

      // Update the booking status to indicate it's been sent to dispatcher
      const { error: updateError } = await supabase
        .from('bookings')
        .update({
          dispatcher_notified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('status', 'pending') // Only update if still pending
        .is('assigned_to', null); // Only update if not assigned

      if (updateError) {
        console.warn('Error updating booking with dispatcher notification status:', updateError);
        // Non-critical error, don't throw
      }

      setDispatcherNotified(true);
      toast.info("Dispatcher Notified", {
        description: "A dispatcher has been notified and will assign a trider soon."
      });
    } catch (error) {
      console.error("Error notifying dispatcher:", error);
      toast.error("Dispatcher Notification Failed", {
        description: "Could not notify dispatcher. Please try again or contact support."
      });
    }
  };

  // Helper function to find nearest TODA from a list
  const findNearestTodaFromList = (latitude: number, longitude: number, todasList: any[]) => {
    // Calculate distance to each TODA and find the nearest one
    let nearestToda = null;
    let shortestDistance = Infinity;

    // First try to find TODAs with proper coverage area
    for (const toda of todasList) {
      // Check if toda has the required fields for precise location matching
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

    // If no TODA was found within its radius, just return the closest one
    // regardless of distance (if we found any TODAs at all)
    if (!nearestToda && todasList.length > 0) {
      console.warn("No TODA found within service radius, using closest one");

      // Reset shortest distance to find any TODA regardless of radius
      shortestDistance = Infinity;

      for (const toda of todasList) {
        if (toda.center_latitude && toda.center_longitude) {
          const distance = calculateDistance(
            latitude,
            longitude,
            toda.center_latitude,
            toda.center_longitude
          );

          // Convert distance to kilometers
          const distanceInKm = distance / 1000;

          // Just find the closest one regardless of radius
          if (distanceInKm < shortestDistance) {
            nearestToda = toda;
            shortestDistance = distanceInKm;
          }
        }
      }

      // If we still don't have a TODA with coordinates, just use the first one
      if (!nearestToda && todasList.length > 0) {
        nearestToda = todasList[0];
        console.warn("Using first available TODA as fallback", nearestToda);
      }
    }

    // If we still don't have a TODA, return a default one
    if (!nearestToda) {
      console.warn("No suitable TODA found, using default TODA");
      return {
        id: "00000000-0000-0000-0000-000000000001",
        name: "Talon Kuatro TODA",
        code: "TK-TODA",
        city: "Las Piñas City",
        barangay: "Talon Kuatro",
        status: "active"
      };
    }

    return nearestToda;
  };

  // Helper function to find nearest TODA (client-side implementation)
  const findNearestToda = async (latitude: number, longitude: number) => {
    // Define sample TODAs to use as fallback
    const sampleTodas = [
      {
        id: "00000000-0000-0000-0000-000000000001",
        name: "Talon Kuatro TODA",
        code: "TK-TODA",
        city: "Las Piñas City",
        barangay: "Talon Kuatro",
        status: "active",
        center_latitude: 14.4507,
        center_longitude: 120.9826,
        radius: 5
      },
      {
        id: "00000000-0000-0000-0000-000000000002",
        name: "Talon Singko TODA",
        code: "TS-TODA",
        city: "Las Piñas City",
        barangay: "Talon Singko",
        status: "active",
        center_latitude: 14.4607,
        center_longitude: 120.9726,
        radius: 5
      },
      {
        id: "00000000-0000-0000-0000-000000000003",
        name: "Almanza TODA",
        code: "ALM-TODA",
        city: "Las Piñas City",
        barangay: "Almanza",
        status: "active",
        center_latitude: 14.4407,
        center_longitude: 120.9926,
        radius: 5
      }
    ];

    try {
      // Get all TODAs from the database
      const { data: todas, error: todasError } = await supabase
        .from('todas')
        .select('*');

      // If there was an error or no TODAs found, use sample TODAs
      if (todasError || !todas || todas.length === 0) {
        if (todasError) {
          console.error("Error fetching TODAs:", todasError);
        } else {
          console.warn("No TODAs found in the database");
        }

        // Use sample TODAs instead
        console.log("Using sample TODAs as fallback");
        return findNearestTodaFromList(latitude, longitude, sampleTodas);
      }

      // Use our helper function to find the nearest TODA from the database results
      return findNearestTodaFromList(latitude, longitude, todas);
    } catch (error) {
      console.error("Error finding nearest TODA:", error);
      // Use sample TODAs as fallback
      return findNearestTodaFromList(latitude, longitude, sampleTodas);
    }
  };

  // Enhanced handleConfirmBooking function with improved notification flow
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

      // Calculate fare based on distance using the correct formula:
      // PHP 20.00 base fare + PHP 10.00 per additional kilometer
      const baseFare = 20; // PHP base fare
      const farePerExtraKm = 10; // PHP per additional km

      // Calculate the base fare plus additional distance
      let estimatedFareValue = baseFare;
      if (distanceInKm > 1) {
        // Add PHP 10 for each additional kilometer (rounded up)
        estimatedFareValue += Math.ceil(distanceInKm - 1) * farePerExtraKm;
      }

      // Add a small range to account for potential traffic or waiting time
      // The upper bound is calculated as base fare + 15% to account for traffic conditions
      const upperBound = Math.ceil(estimatedFareValue * 1.15);
      const fareRange = `₱${estimatedFareValue} - ₱${upperBound}`;

      // Calculate estimated time based on distance and traffic conditions
      // For more accurate results, we should use Mapbox Matrix API in production
      // For now, we'll use a more sophisticated estimation based on time of day and distance

      // Get current hour to estimate traffic conditions
      const currentHour = new Date().getHours();

      // Adjust speed based on time of day (rush hour vs non-rush hour)
      // Rush hours: 7-9 AM and 5-7 PM typically have slower speeds
      let avgSpeedKmh = 20; // Default average speed in km/h

      if ((currentHour >= 7 && currentHour <= 9) || (currentHour >= 17 && currentHour <= 19)) {
        // Rush hour - slower speed
        avgSpeedKmh = 15;
      } else if (currentHour >= 22 || currentHour <= 5) {
        // Late night/early morning - faster speed
        avgSpeedKmh = 25;
      }

      // Calculate base time in minutes
      const baseTimeMinutes = Math.ceil((distanceInKm / avgSpeedKmh) * 60);

      // Add buffer time for short trips (minimum 5 minutes)
      const estimatedTimeMinutes = Math.max(5, baseTimeMinutes);

      // Add a range to account for variability
      const timeRangeEnd = Math.ceil(estimatedTimeMinutes * 1.2); // 20% buffer
      const estimatedTimeStr = `${estimatedTimeMinutes}-${timeRangeEnd} minutes`;

      // 2. Get TODA - first try selected TODA, then user's preferred TODA, then nearest TODA
      // Define a default TODA to use as fallback
      let todaData = {
        id: "00000000-0000-0000-0000-000000000001", // Use the first sample TODA ID
        name: "Talon Kuatro TODA",
        code: "TK-TODA",
        city: "Las Piñas City",
        barangay: "Talon Kuatro",
        status: "active"
      };

      try {
        // First check if a TODA was selected for this booking
        if (selectedTodaId) {
          console.log("TODA selected for this booking:", selectedTodaId);
          try {
            const { data: selectedToda, error: selectedTodaError } = await supabase
              .from('todas')
              .select('*')
              .eq('id', selectedTodaId)
              .single();

            if (!selectedTodaError && selectedToda) {
              todaData = selectedToda;
              console.log("Using selected TODA:", selectedToda.name);
            } else {
              console.warn("Selected TODA not found, will try user's preferred TODA");
              // If we have a name for the selected TODA, use it with the default TODA
              if (selectedTodaName) {
                todaData.name = selectedTodaName;
                console.log("Using selected TODA name with default TODA:", selectedTodaName);
              }
            }
          } catch (error) {
            console.warn("Error fetching selected TODA:", error);
            // If we have a name for the selected TODA, use it with the default TODA
            if (selectedTodaName) {
              todaData.name = selectedTodaName;
              console.log("Using selected TODA name with default TODA:", selectedTodaName);
            }
          }
        }

        // If no TODA was selected or it wasn't found, try user's preferred TODA
        if (todaData.id === "00000000-0000-0000-0000-000000000001" && user?.preferredTodaId) {
          console.log("User has preferred TODA:", user.preferredTodaId);
          try {
            const { data: preferredToda, error: preferredTodaError } = await supabase
              .from('todas')
              .select('*')
              .eq('id', user.preferredTodaId)
              .single();

            if (!preferredTodaError && preferredToda) {
              todaData = preferredToda;
              console.log("Using preferred TODA:", preferredToda.name);
            } else {
              console.warn("Preferred TODA not found, will try to find nearest TODA");
            }
          } catch (error) {
            console.warn("Error fetching preferred TODA:", error);
          }
        }

        // If no TODA was selected or preferred, or they weren't found, try to find nearest TODA
        if (todaData.id === "00000000-0000-0000-0000-000000000001") {
          try {
            const nearestToda = await findNearestToda(pickupCoords[0], pickupCoords[1]);

            // Only use the nearest TODA if it's not the default one
            if (nearestToda.id !== "00000000-0000-0000-0000-000000000000") {
              todaData = nearestToda;
              console.log("Using nearest TODA:", nearestToda.name);
            } else {
              // We're already using a default TODA, so just show a warning
              toast.warning("Using Default TODA", {
                description: "No TODA is available in your area. Using a default TODA for your booking."
              });
            }
          } catch (error) {
            console.warn("Error finding nearest TODA:", error);
            // We're already using a default TODA, so just show a warning
            toast.warning("Using Default TODA", {
              description: "Could not find a TODA for your area. Using a default TODA for your booking."
            });
          }
        }
      } catch (todaError) {
        console.warn("Error in TODA selection process, using default", todaError);
        toast.warning("Using Default TODA", {
          description: "Could not find a TODA for your area. Using a default TODA for your booking."
        });
      }

      // Generate a unique booking code
      const bookingCode = `TG-${Math.floor(100000 + Math.random() * 900000)}`;

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
        estimated_time: estimatedTimeStr,
        code: bookingCode,
        created_at: new Date().toISOString()
      };

      // 4. Insert booking into DB with fallback for schema cache issues
      let booking;
      let bookingError;

      try {
        // First attempt with full payload
        console.log("Attempting to insert booking with full payload");
        const result = await supabase
        .from('bookings')
          .insert(bookingPayload)
        .select()
        .single();

        booking = result.data;
        bookingError = result.error;

      if (bookingError) {
          console.error("Error inserting booking with full payload:", bookingError);

          // Check if it's a schema cache issue
          if (bookingError.message?.includes('schema cache') ||
              bookingError.message?.includes('column') ||
              bookingError.message?.includes('not found')) {

            console.log("Schema cache issue detected, trying with minimal payload");

            // Create a minimal payload with only essential fields
            const minimalPayload = {
              passenger_id: passenger.id,
              status: 'pending',
              code: bookingCode,
              created_at: new Date().toISOString()
            };

            // Try inserting with minimal payload
            const fallbackResult = await supabase
              .from('bookings')
              .insert(minimalPayload)
              .select()
              .single();

            booking = fallbackResult.data;
            bookingError = fallbackResult.error;

            if (fallbackResult.error) {
              console.error("Error inserting booking with minimal payload:", fallbackResult.error);
              throw new Error(fallbackResult.error.message);
            }

            if (!fallbackResult.data) {
              throw new Error("Failed to create booking with minimal payload");
            }

            // If successful, try to update with the remaining fields
            console.log("Minimal booking created, updating with additional fields");
            try {
              await supabase
                .from('bookings')
                .update({
                  passenger_name: passenger.name,
                  cp_number: passenger.cp_number,
                  toda_id: todaData.id,
                  pickup_lat: pickupCoords[0],
                  pickup_lng: pickupCoords[1],
                  dropoff_lat: dropoffCoords[0],
                  dropoff_lng: dropoffCoords[1],
                  estimated_fare: fareRange,
                  estimated_time: estimatedTimeStr
                })
                .eq('id', booking.id);

              console.log("Successfully updated booking with additional fields");
            } catch (updateError) {
              console.warn("Could not update booking with additional fields:", updateError);
              // Non-critical error, continue with the booking we have
            }
          } else {
            // If it's not a schema cache issue, throw the original error
            throw bookingError;
          }
        }
      } catch (error) {
        console.error("Booking insertion failed:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to create booking");
      }

      if (!booking) {
        throw new Error("Failed to create booking");
      }

      // 5. Handle successful booking
      setBookingCode(booking.code || bookingCode);
      setBookingSuccess(true);
      setBookingStatus('waiting');
      setShowConfirmation(false);

      toast.success("Booking Confirmed", {
        description: "Your booking has been confirmed. Searching for nearby triders..."
      });

      // 6. Notify nearby triders immediately
      try {
        const notifiedTriders = await notifyNearbyTriders(booking.id, pickupCoords[0], pickupCoords[1], todaData.id);

        // 7. If no nearby triders were found or notification failed, notify dispatcher immediately
        if (!notifiedTriders || notifiedTriders === 0) {
          await notifyDispatcher(booking.id);
        } else {
          // Otherwise, start dispatcher notification timeout (if no trider accepts within 30 seconds)
          setTimeout(() => {
            // Check current booking status before notifying dispatcher
            const checkBookingStatus = async () => {
              try {
                const { data: currentBooking, error } = await supabase
                  .from('bookings')
                  .select('status, assigned_to')
                  .eq('id', booking.id)
                  .single();

                if (error) throw error;

                // Only notify dispatcher if booking is still pending and not assigned
                if (currentBooking && currentBooking.status === 'pending' && !currentBooking.assigned_to) {
                  await notifyDispatcher(booking.id);
                }
    } catch (error) {
                console.error("Error checking booking status:", error);
                // Notify dispatcher anyway as a fallback
                await notifyDispatcher(booking.id);
              }
            };

            checkBookingStatus();
          }, 30000); // 30 seconds timeout
        }
      } catch (notificationError) {
        console.error("Error in trider notification process:", notificationError);
        // Notify dispatcher as fallback if trider notification process fails
        try {
          await notifyDispatcher(booking.id);
        } catch (dispatcherError) {
          console.error("Error notifying dispatcher:", dispatcherError);
          // At this point, we've created the booking but failed to notify anyone
          // The booking will still be visible in the dispatcher dashboard
        }
      }

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

  // Listen for booking status updates with enhanced error handling and more status updates
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

          // Fetch trider details to show to the passenger
          const fetchTriderDetails = async () => {
            try {
              const { data: trider, error } = await supabase
                .from('triders')
                .select('first_name, last_name, contact_number, plate_number')
                .eq('id', payload.new.assigned_to)
                .single();

              if (error) throw error;

              if (trider) {
                toast.info("Trider Information", {
                  description: `${trider.first_name} ${trider.last_name} (${trider.plate_number}) will be your driver. Contact: ${trider.contact_number}`
                });
              }
            } catch (error) {
              console.error("Error fetching trider details:", error);
            }
          };

          fetchTriderDetails();
        } else if (payload.new.status === 'cancelled') {
          setBookingStatus('cancelled');
          toast.error("Ride Cancelled", {
            description: "Your booking has been cancelled."
          });
        } else if (payload.new.status === 'completed') {
          setBookingStatus('completed');
          toast.success("Ride Completed", {
            description: "Your ride has been completed. Thank you for using TriGo!"
          });
        }
      })
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to booking updates for passenger:', user.id);
        }
        if (status === 'CHANNEL_ERROR' || err) {
          console.error('Booking subscription error:', err);
          toast.error("Real-time Error", { description: "Could not subscribe to booking updates. Please refresh the page." });
        }
      });

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

  // Define the updateMarkersFromLocations function
  const updateMarkersFromLocations = useCallback(() => {
    const markers = [];
    
    // Add pickup marker if we have it
    if (selectedPickup) {
      markers.push({
        lat: selectedPickup.latitude,
        lng: selectedPickup.longitude,
        type: 'pickup',
        title: selectedPickup.name
      });
    }
    
    // Add dropoff marker if we have it
    if (selectedDropoff) {
      markers.push({
        lat: selectedDropoff.latitude,
        lng: selectedDropoff.longitude,
        type: 'dropoff',
        title: selectedDropoff.name
      });
    }
    
    // Update the markers state
    setMapMarkers(markers);
    
    // If we have both pickup and dropoff, update the map center to focus on both points
    if (selectedPickup && selectedDropoff) {
      // Calculate the midpoint
      const midLat = (selectedPickup.latitude + selectedDropoff.latitude) / 2;
      const midLng = (selectedPickup.longitude + selectedDropoff.longitude) / 2;
      setMapCenter({ lat: midLat, lng: midLng });
      
      // Create a simple geojson for the route
      if (!routeGeojson) {
        fetchRouteData(
          selectedPickup.latitude, 
          selectedPickup.longitude, 
          selectedDropoff.latitude, 
          selectedDropoff.longitude
        );
      }
    } else if (selectedPickup) {
      // Only pickup location set, center on it
      setMapCenter({ lat: selectedPickup.latitude, lng: selectedPickup.longitude });
    } else if (selectedDropoff) {
      // Only dropoff location set, center on it
      setMapCenter({ lat: selectedDropoff.latitude, lng: selectedDropoff.longitude });
    }
  }, [selectedPickup, selectedDropoff, routeGeojson]);
  
  // Add function to fetch route data from Mapbox Directions API
  const fetchRouteData = async (startLat: number, startLng: number, endLat: number, endLng: number) => {
    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!mapboxToken) {
        console.error("Mapbox token not found");
        toast({
          title: "Map Error",
          description: "Unable to load map service. Please try again later.",
          variant: "destructive"
        });
        return;
      }
      
      // Add error handling with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?geometries=geojson&alternatives=true&overview=full&access_token=${mapboxToken}`,
          { signal: controller.signal }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch route data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          // Find the shortest route by distance
          const shortestRoute = data.routes.reduce((shortest, current) => 
            current.distance < shortest.distance ? current : shortest, data.routes[0]);
          
          // Create GeoJSON for the route
          const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: shortestRoute.geometry.coordinates
            }
          };
          
          setRouteGeojson(geojson);
          
          // Update route distance and duration
          if (shortestRoute.distance && shortestRoute.duration) {
            setRouteDistance(shortestRoute.distance);
            setRouteDuration(shortestRoute.duration);
          }
          
          return { 
            distance: shortestRoute.distance,
            duration: shortestRoute.duration,
            geometry: shortestRoute.geometry
          };
        }
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          console.error('Route fetch request timed out');
          toast({
            title: "Route Error",
            description: "Route calculation timed out. Please try again.",
            variant: "destructive"
          });
        } else {
          throw fetchError; // Re-throw to be caught by outer catch
        }
      }
    } catch (error) {
      console.error('Error fetching route data:', error);
      toast({
        title: "Route Error",
        description: "Couldn't calculate the route. Using straight line instead.",
        variant: "destructive"
      });
      
      // Create a simple straight line as fallback
      const geojson = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [startLng, startLat],
            [endLng, endLat]
          ]
        }
      };
      setRouteGeojson(geojson);
      
      // Calculate straight-line distance as fallback
      const distance = calculateDistance(startLat, startLng, endLat, endLng) * 1000; // Convert km to meters
      setRouteDistance(distance);
      
      // Estimate duration based on average speed of 20 km/h (tricycle)
      const duration = (distance / 1000) / 20 * 3600; // hours to seconds
      setRouteDuration(duration);
      
      return { 
        distance,
        duration,
        geometry: geojson.geometry
      };
    }
  };

  // Add useEffect to update markers whenever locations change
  useEffect(() => {
    updateMarkersFromLocations();
  }, [selectedPickup, selectedDropoff, updateMarkersFromLocations]);

  return (
    <>
      {isLoading && (
        <LoadingOverlay message={bookingSuccess ? "Finalizing your booking..." : "Finding available triders..."} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Form */}
        <Card className="bg-black/30 backdrop-blur-md border border-green-500/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Book a Ride</CardTitle>
            <CardDescription className="text-white/70">Enter your pickup and dropoff locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Pickup Location */}
                <div className="space-y-2">
                <Label htmlFor="pickup" className="text-white/80">Pickup Location</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-green-400" />
                    </div>
                    <Input
                      id="pickup"
                      placeholder="Enter pickup location"
                      value={pickupLocation}
                      onChange={(e) => handlePickupSearch(e.target.value)}
                    onFocus={() => setShowPickupResults(pickupSearchResults.length > 0)}
                    className="pl-10 bg-gray-800/50 border-gray-700 focus:border-green-500/50 text-white placeholder:text-gray-500"
                    />
                  {pickupLocation.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearPickup}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                          aria-label="Clear pickup location"
                        >
                      <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                
                {/* Pickup Search Results */}
                  {showPickupResults && pickupSearchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-800/95 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    <ul className="py-1">
                      {pickupSearchResults.map((location) => (
                          <li
                            key={location.id}
                          className="px-4 py-2 hover:bg-gray-700/50 cursor-pointer text-white flex items-start"
                            onClick={() => handleSelectPickup(location)}
                          >
                          <MapPin className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-white/60">{location.address}</div>
                          </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                    onClick={() => setMapClickEnabled(true)}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Pin on Map
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm" 
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                    onClick={() => detectCurrentLocation("pickup")}
                    disabled={isLocating}
                  >
                    {isLocating ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4 mr-1" />
                    )}
                    Current Location
                  </Button>
                </div>
                </div>

              {/* Dropoff Location */}
                <div className="space-y-2">
                <Label htmlFor="dropoff" className="text-white/80">Dropoff Location</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPin className="h-5 w-5 text-green-400" />
                    </div>
                    <Input
                      id="dropoff"
                    placeholder="Enter dropoff location"
                      value={dropoffLocation}
                      onChange={(e) => handleDropoffSearch(e.target.value)}
                    onFocus={() => setShowDropoffResults(dropoffSearchResults.length > 0)}
                    className="pl-10 bg-gray-800/50 border-gray-700 focus:border-green-500/50 text-white placeholder:text-gray-500"
                    />
                  {dropoffLocation.length > 0 && (
                        <button
                          type="button"
                          onClick={handleClearDropoff}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                          aria-label="Clear dropoff location"
                        >
                      <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                
                {/* Dropoff Search Results */}
                  {showDropoffResults && dropoffSearchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-gray-800/95 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    <ul className="py-1">
                      {dropoffSearchResults.map((location) => (
                          <li
                            key={location.id}
                          className="px-4 py-2 hover:bg-gray-700/50 cursor-pointer text-white flex items-start"
                            onClick={() => handleSelectDropoff(location)}
                          >
                          <MapPin className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium">{location.name}</div>
                            <div className="text-sm text-white/60">{location.address}</div>
                          </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                    onClick={() => setIsMapPinningMode(true)}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Pin on Map
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm" 
                    className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                    onClick={() => detectCurrentLocation("dropoff")}
                    disabled={isLocating}
                  >
                    {isLocating ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4 mr-1" />
                    )}
                    Current Location
                  </Button>
                  </div>
                </div>
              
              {/* TODA Selection */}
              <div className="space-y-2 mt-4">
                <Label htmlFor="toda-selection" className="text-white/80">Select TODA</Label>
                <TodaSelector 
                  selectedTodaId={selectedTodaId} 
                  onSelect={setSelectedTodaId}
                />
                <p className="text-xs text-white/60 mt-1">
                  Choosing a TODA will prioritize triders from that association
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleBookRide}
              disabled={!selectedPickup || !selectedDropoff || isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding riders...
                </>
              ) : (
                "Book Ride"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Map View */}
        <Card className="bg-black/30 backdrop-blur-md border border-green-500/20 shadow-lg overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle className="text-white">Map View</CardTitle>
            <CardDescription className="text-white/70">View your route on the map</CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-4">
            <div className="h-[400px] overflow-hidden rounded-lg">
              <MapboxMap
                center={mapCenter}
                zoom={14}
                markers={mapMarkers}
                routeGeojson={routeGeojson}
                height="100%"
                onClick={(e) => {
                  if (mapClickEnabled) {
                    // Map click handler code
                  }
                }}
                onMove={(e) => {
                  // Optional: Handle map movement
                }}
              />
            </div>
          </CardContent>
          {routeDistance && routeDuration && (
            <CardFooter className="flex flex-col items-start pt-3">
              <div className="flex items-center justify-between w-full">
                <div className="text-white/70">
                  <span className="text-white font-medium">Distance:</span> {(routeDistance / 1000).toFixed(1)} km
                </div>
                <div className="text-white/70">
                  <span className="text-white font-medium">Est. time:</span> {Math.ceil(routeDuration / 60)} min
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
        
        {/* Terminal Exits Card */}
        <div className="lg:col-span-2">
          <TerminalExits 
            terminals={terminalExits} 
            onSelect={(terminal) => {
              setSelectedDropoff(terminal);
              setDropoffLocation(terminal.name);
              updateMarkersFromLocations();
            }}
            currentSelection={selectedDropoff}
          />
        </div>
        
        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="bg-gray-900 border-green-500/30 text-white">
            <DialogHeader>
              <DialogTitle>Confirm Your Ride</DialogTitle>
              <DialogDescription className="text-white/70">
                Review the details of your booking below.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-medium text-white/80">Pickup Location</h4>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{selectedPickup?.name}</p>
                    <p className="text-sm text-white/60">{selectedPickup?.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-white/80">Dropoff Location</h4>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{selectedDropoff?.name}</p>
                    <p className="text-sm text-white/60">{selectedDropoff?.address}</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-white/70">Estimated Time</p>
                  <p className="text-lg font-medium text-white">{estimatedTime}</p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-white/70">Estimated Fare</p>
                  <p className="text-lg font-medium text-white">{estimatedFare}</p>
                </div>
              </div>
              
              {selectedTodaName && (
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-white/70">Selected TODA</p>
                  <p className="text-white">{selectedTodaName}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="border-gray-700 text-white/70 hover:bg-gray-800 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmBooking}
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
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
      </div>
    </>
  )
}
