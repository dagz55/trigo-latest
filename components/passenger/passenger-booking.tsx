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
  const [estimatedTime, setEstimatedTime] = useState("10-15 minutes")
  const [estimatedFare, setEstimatedFare] = useState("₱120 - ₱150")
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingCode, setBookingCode] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [terminalExits, setTerminalExits] = useState<Location[]>([])
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
        type: 'pickup', // Set type appropriately
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

  const handleDropoffSearch = async (value: string) => {
    setDropoffLocation(value)
    setSelectedDropoff(null) // Clear selection when searching
    if (value.length > 2) {
      console.log("Searching dropoff locations for:", value)
      try {
        const { data: searchResults, error } = await supabase
          .from('locations')
          .select('*')
          .or(`name.ilike.%${value}%,address.ilike.%${value}%`)
          .eq('city', 'Las Piñas City') // Keep scope limited
          .eq('barangay', 'Talon Kuatro') // Keep scope limited
          .limit(5)

        if (error) throw error // Throw error to be caught below

        console.log(`Found ${searchResults?.length || 0} dropoff results.`)
        setDropoffSearchResults(searchResults || [])
        setShowDropoffResults(true)
      } catch (error: any) {
          console.error("Error searching dropoff locations:", error)
          toast.error("Search Failed", {
            description: error.message || "Could not perform dropoff location search."
          })
          setDropoffSearchResults([])
          setShowDropoffResults(false)
      }
    } else {
      setDropoffSearchResults([])
      setShowDropoffResults(false)
    }
  }

  // Remove unused getAddressFromCoordinates function
  // const getAddressFromCoordinates = async ...

  // Update the detectCurrentLocation function
  const detectCurrentLocation = useCallback(
    async (locationType: "pickup" | "dropoff") => {
      setIsLocating(true)

      try {
        // For demo purposes, use the Talon Kuatro terminal location
        const locationData: Location = {
          id: `current-${Date.now()}`,
          name: "Current Location",
          address: "19 Rose of Heaven Drive corner Periwinkle St., Talon Village, Talon 4, Las Piñas City",
          latitude: 14.4507,
          longitude: 120.9826,
          city: "Las Piñas City",
          barangay: "Talon Kuatro",
          type: locationType
        }

        if (locationType === "pickup") {
          setSelectedPickup(locationData)
          setPickupLocation("Current Location")
          setShowPickupResults(false)
        } else {
          setSelectedDropoff(locationData)
          setDropoffLocation("Current Location")
          setShowDropoffResults(false)
        }

        // Use direct toast import
        toast.success("Location Set", {
          description: `Your location has been set as the ${locationType} location.`,
        })
      } catch (error: any) {
        console.error("Error setting location:", error)
        // Use direct toast import
        toast.error("Location Error", {
          description: error.message || "Unable to set your location. Please try again.",
        })
      } finally {
        setIsLocating(false)
      }
    },
    [] // Removed toast dependency as it's imported directly
  )

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
      // Use direct toast import
      toast.warning("Missing Information", {
        description: "Please select both pickup and dropoff locations.",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Calculate estimated time and fare based on distance
      const distance = calculateDistance(
        selectedPickup.latitude,
        selectedPickup.longitude,
        selectedDropoff.latitude,
        selectedDropoff.longitude,
      )

      const time = Math.round(distance / 500) * 5 // Rough estimate: 5 minutes per 500 meters
      const fare = Math.round(distance / 100) * 10 + 50 // Base fare of 50 + 10 per 100 meters

      setEstimatedTime(`${time}-${time + 5} minutes`)
      setEstimatedFare(`₱${fare} - ₱${fare + 30}`)

      setIsLoading(false)
      setShowConfirmation(true)
    }, 2000)
  }

  // Confirm booking
  const handleConfirmBooking = async () => {
    if (!user || !selectedPickup || !selectedDropoff) {
      toast.error("Booking Error", {
        description: "Missing user or location information.",
      })
      return
    }

    setIsLoading(true)
    console.log("Confirming booking...")

    // Generate a unique booking code locally first (can be refined)
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    const bookingData = {
      passenger_id: user.id,
      pickup_location_id: selectedPickup.id, // Assuming selectedPickup has an ID from the 'locations' table
      dropoff_location_id: selectedDropoff.id, // Assuming selectedDropoff has an ID from the 'locations' table
      status: 'pending', // Initial status
      estimated_fare: estimatedFare, // Use the state value
      estimated_time: estimatedTime, // Use the state value
      booking_code: generatedCode, // Use the generated code
      // Add pickup/dropoff details directly if needed, or rely on relation IDs
      pickup_name: selectedPickup.name,
      pickup_address: selectedPickup.address,
      pickup_latitude: selectedPickup.latitude,
      pickup_longitude: selectedPickup.longitude,
      dropoff_name: selectedDropoff.name,
      dropoff_address: selectedDropoff.address,
      dropoff_latitude: selectedDropoff.latitude,
      dropoff_longitude: selectedDropoff.longitude,
      // toda_id: selectedPickup.toda_id, // Assuming pickup location determines the TODA
    }

    console.log("Attempting to insert booking:", bookingData)

    try {
      const { data, error } = await supabase
        .from('bookings') // Ensure 'bookings' is the correct table name
        .insert([bookingData])
        .select() // Select the inserted row to get the actual data back
        .single() // Expecting a single row back

      if (error) {
        console.error("Supabase insert error:", error)
        throw error // Throw error to be caught below
      }

      if (!data) {
        throw new Error("Booking data was not returned after insert.")
      }

      console.log("Booking successfully inserted:", data)

      // Use the actual booking code from the database if it's generated there, otherwise use the local one
      const actualBookingCode = data.booking_code || generatedCode
      setBookingCode(actualBookingCode)
      setBookingSuccess(true)

      // Use direct toast import
      toast.success("Booking Successful", {
        description: `Your ride has been booked. Booking code: ${actualBookingCode}`,
      })

    } catch (error: any) {
      console.error("Error during booking confirmation:", error)
      toast.error("Booking Failed", {
        description: error.message || "Could not confirm your booking. Please try again.",
      })
      setShowConfirmation(false) // Close confirmation dialog on error
    } finally {
      setIsLoading(false)
    }
  }

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
        type: 'pickup' as const // Ensure type is literal
      })
    }

    // Use selectedDropoff object (if it exists)
    if (selectedDropoff) {
      console.log("Adding dropoff marker:", selectedDropoff.name)
      markers.push({
        lat: selectedDropoff.latitude,
        lng: selectedDropoff.longitude,
        title: selectedDropoff.name || 'Drop-off Location',
        type: 'dropoff' as const // Ensure type is literal
      })
    }

    // Add terminal locations
    terminalExits.forEach(terminal => {
      markers.push({
        lat: terminal.latitude,
        lng: terminal.longitude,
        title: terminal.name,
        type: 'terminal' as const // Ensure type is literal
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
  }, [selectedPickup, selectedDropoff, terminalExits]) // Depend on the objects, not the strings

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
                        Find Me
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
                      placeholder="Enter dropoff location"
                      value={dropoffLocation}
                      onChange={(e) => handleDropoffSearch(e.target.value)}
                      className="pl-10 pr-20"
                      disabled={bookingSuccess}
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
                        disabled={isLocating || bookingSuccess}
                      >
                        {isLocating ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Navigation className="h-3 w-3 mr-1" />
                        )}
                        Find Me
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
                  <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-medium">Booking Confirmed!</h3>
                  <p className="text-sm text-muted-foreground">Your ride has been booked successfully.</p>
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
                  <p>A trider will contact you shortly.</p>
                  <p>Please be ready at your pickup location.</p>
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
                height="400px"
                zoom={16}
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
    </>
  )
}
