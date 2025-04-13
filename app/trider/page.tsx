"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { Header } from "@/components/layout/header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { LoadingPage } from "@/components/ui/loading-page"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { getPendingRideRequests, supabase } from "@/lib/supabase-client"
import { Bike, Calendar, Clock, Info, MapPin, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function TriderPage() {
  const [isOnline, setIsOnline] = useState(false)
  const [onlineTime, setOnlineTime] = useState<Date | null>(null)
  const [offlineTime, setOfflineTime] = useState<Date | null>(null)
  const [onlineDuration, setOnlineDuration] = useState(0) // in seconds
  const [currentTimer, setCurrentTimer] = useState<NodeJS.Timeout | null>(null)
  const [timeLog, setTimeLog] = useState<
    Array<{
      type: "online" | "offline"
      startTime: Date
      endTime?: Date
      duration?: number
    }>
  >([])

  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentLocation, setCurrentLocation] = useState({ lat: 14.5995, lng: 120.9842 }) // Default to Manila
  const [locationAddress, setLocationAddress] = useState("Manila, Philippines")
  const [assignedToda, setAssignedToda] = useState<any | null>(null)
  const [showLocationDialog, setShowLocationDialog] = useState(false)
  const [bookingRequests, setBookingRequests] = useState<any[]>([])
  const [todaAreas, setTodaAreas] = useState<any[]>([])
  const [activeRide, setActiveRide] = useState<any | null>(null)
  const [hasNewRequests, setHasNewRequests] = useState(false)
  const [showServiceAreaInfo, setShowServiceAreaInfo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [initialLoading, setInitialLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("available")

  // Add this useEffect to fetch TODA areas
  useEffect(() => {
    const fetchTodaAreas = async () => {
      const { data, error } = await supabase.from("todas").select("*")

      if (!error && data) {
        setTodaAreas(
          data.map((toda) => ({
            id: toda.id,
            name: toda.name,
            area: toda.area,
            center: {
              lat: toda.center_latitude,
              lng: toda.center_longitude,
            },
            radius: toda.radius,
            landmarks: toda.landmarks || [],
          })),
        )
      }
    }

    fetchTodaAreas()
  }, [])

  // Initial loading simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  // Format date
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString(undefined, options)
  }

  // Format duration as HH:MM:SS
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
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

  // Find TODA based on location
  const findTodaForLocation = (location: { lat: number; lng: number }) => {
    for (const toda of todaAreas) {
      const distance = calculateDistance(location.lat, location.lng, toda.center.lat, toda.center.lng)
      if (distance <= toda.radius) {
        return toda
      }
    }
    return null
  }

  // Check if a location is within a TODA's service area
  const isLocationWithinTodaArea = (location: { lat: number; lng: number }, toda: any) => {
    const distance = calculateDistance(location.lat, location.lng, toda.center.lat, toda.center.lng)
    return distance <= toda.radius
  }

  // Set location manually
  const setManualLocation = (toda: any) => {
    setIsLoading(true)
    setLoadingMessage("Updating your location...")

    // Simulate API call
    setTimeout(() => {
      setCurrentLocation(toda.center)
      setLocationAddress(`${toda.area}, Philippines`)
      setAssignedToda(toda)
      setShowLocationDialog(false)
      setIsLoading(false)

      toast({
        title: "TODA Assignment Updated",
        description: `You have been assigned to ${toda.name}.`,
      })
    }, 1500)
  }

  // Update the useEffect that fetches ride requests:
  useEffect(() => {
    // Only run if online and assigned to a TODA
    if (isOnline && assignedToda && assignedToda.id) { 
      setIsLoading(true)
      setLoadingMessage("Searching for ride requests...")

      const fetchRideRequests = async () => {
        console.log(`Fetching requests for TODA ID: ${assignedToda.id}`) // Debug log
        try {
          // Use the function from supabase-client which handles filtering
          const requests = await getPendingRideRequests(assignedToda.id)
          
          console.log(`Fetched ${requests.length} requests.`) // Debug log

          if (requests && requests.length > 0) {
            // Optional: Perform additional client-side checks if needed, like destination area
            const processedRequests = requests.map(request => ({
              ...request,
              // Mark if the dropoff is also within TODA area (optional rule)
              // Check if dropoff coordinates exist before using them
              isWithinTodaArea: request.dropoff_latitude && request.dropoff_longitude
                ? isLocationWithinTodaArea(
                    { lat: request.dropoff_latitude, lng: request.dropoff_longitude },
                    assignedToda
                  ) 
                : false // Default to false if dropoff coordinates are missing
            }))

            setBookingRequests(processedRequests)
            setHasNewRequests(true)
            toast({
              title: "New Ride Requests",
              description: `You have ${processedRequests.length} new ride request(s) in your area.`,
            })
          } else {
            // Clear existing requests if none are fetched
            setBookingRequests([])
            setHasNewRequests(false)
          }
        } catch (error: any) { // Catch specific error type if known
          console.error("Error fetching ride requests:", error)
          // Log the detailed error if available
          const errorDetails = error.message || JSON.stringify(error);
          console.error("Error fetching ride requests:", errorDetails);
          toast({
            title: "Error Fetching Rides",
            description: `Could not retrieve ride requests: ${error.message || 'Unknown error'}`,
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
          setLoadingMessage("")
        }
      }

      fetchRideRequests() // Initial fetch

      // Set up subscription for new ride requests for the specific TODA
      // Note: RLS should ideally handle TODA filtering for subscriptions
      const ridesSubscription = supabase
        .channel(`public:ride_requests:toda_id=eq.${assignedToda.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "ride_requests",
            filter: `status=eq.pending`, // Match status used in getPendingRideRequests
          },
          (payload) => {
            console.log("New ride request received via subscription:", payload)
            toast({ title: "New Ride Request Available!" })
            fetchRideRequests() // Re-fetch the list
          }
        )
        .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') {
                console.log(`Subscribed to ride_requests for TODA ${assignedToda.id}`);
            } else {
                console.error('Subscription Error:', err);
            }
        })

      // Cleanup function
      return () => {
        console.log(`Unsubscribing from ride_requests for TODA ${assignedToda.id}`);
        supabase.removeChannel(ridesSubscription)
      }
    } else {
       // Clear requests if not online or no TODA assigned
       setBookingRequests([])
       setHasNewRequests(false)
       console.log("Not fetching requests: Not online or no TODA assigned.");
    }
  }, [isOnline, assignedToda]) // Dependencies: online status and assigned TODA

  // Handle online/offline toggle
  const handleStatusChange = (checked: boolean) => {
    setIsLoading(true)
    setLoadingMessage(checked ? "Going online..." : "Going offline...")

    // Simulate network delay
    setTimeout(() => {
      const now = new Date()

      if (checked) {
        // Going online
        setIsOnline(true)
        setOnlineTime(now)

        // Log the offline period if there was one
        if (offlineTime) {
          const duration = Math.floor((now.getTime() - offlineTime.getTime()) / 1000)
          setTimeLog((prev) => [
            ...prev,
            {
              type: "offline",
              startTime: offlineTime,
              endTime: now,
              duration,
            },
          ])
        }

        // Check if we need to select a TODA
        if (!assignedToda) {
          setShowLocationDialog(true)
        }
      } else {
        // Going offline
        setIsOnline(false)
        setOfflineTime(now)

        // Log the online period
        if (onlineTime) {
          const duration = Math.floor((now.getTime() - onlineTime.getTime()) / 1000)
          setTimeLog((prev) => [
            ...prev,
            {
              type: "online",
              startTime: onlineTime,
              endTime: now,
              duration,
            },
          ])
          setOnlineDuration((prev) => prev + duration)
        }
      }

      setIsLoading(false)
    }, 1500)
  }

  // Accept a booking request
  const acceptBookingRequest = (requestId: string) => {
    setIsLoading(true)
    setLoadingMessage("Accepting ride request...")

    // Simulate API call
    setTimeout(() => {
      const request = bookingRequests.find((req) => req.id === requestId)
      if (request) {
        if (!request.isWithinTodaArea) {
          toast({
            title: "Cannot Accept Ride",
            description: "This ride's destination is outside your TODA's service area.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // Remove from booking requests
        setBookingRequests(bookingRequests.filter((req) => req.id !== requestId))
        setHasNewRequests(bookingRequests.length > 1)

        // Set as active ride
        setActiveRide({
          ...request,
          status: "in-progress",
        })

        // Switch to active tab
        setActiveTab("active")

        toast({
          title: "Ride Accepted",
          description: `You have accepted the ride request from ${request.passengerName}.`,
        })
      }
      setIsLoading(false)
    }, 1500)
  }

  // Complete active ride
  const completeActiveRide = () => {
    setIsLoading(true)
    setLoadingMessage("Completing ride...")

    // Simulate API call
    setTimeout(() => {
      if (activeRide) {
        toast({
          title: "Ride Completed",
          description: `You have completed the ride with ${activeRide.passengerName}.`,
        })

        // Clear active ride
        setActiveRide(null)
      }
      setIsLoading(false)
    }, 1500)
  }

  // Decline a booking request
  const declineBookingRequest = (requestId: string) => {
    setIsLoading(true)
    setLoadingMessage("Declining ride request...")

    // Simulate API call
    setTimeout(() => {
      setBookingRequests(bookingRequests.filter((req) => req.id !== requestId))
      setHasNewRequests(bookingRequests.length > 1)

      toast({
        title: "Ride Declined",
        description: "You have declined the ride request.",
      })
      setIsLoading(false)
    }, 1000)
  }

  if (initialLoading) {
    return <LoadingPage message="Loading Trider Dashboard..." />
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-6">
        {isLoading && <LoadingOverlay message={loadingMessage} />}

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Trider Dashboard</h1>
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center justify-center px-4 py-2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${
                isOnline
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
                  : "bg-gradient-to-r from-gray-400 to-slate-500 hover:from-gray-500 hover:to-slate-600"
              }`}
              onClick={() => {
                if (!isLoading) {
                  // Toggle online/offline status
                  handleStatusChange(!isOnline)
                }
              }}
            >
              <span className="text-white font-medium">{isOnline ? "Online" : "Go Online"}</span>
            </div>
            <Link href="/roles">
              <Button variant="outline">Change Role</Button>
            </Link>
          </div>
        </div>

        {assignedToda && (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>TODA Service Area Limitation</AlertTitle>
            <AlertDescription>
              As a member of {assignedToda.name}, you can only accept rides within {assignedToda.area}.
              <Button variant="link" className="h-auto p-0 pl-1" onClick={() => setShowServiceAreaInfo(true)}>
                Learn more
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm border border-blue-100">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="text-lg font-medium text-gray-800">{formatDate(currentTime)}</p>
              <p className="text-sm text-gray-500">Welcome back, Trider!</p>
            </div>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <Clock className="h-6 w-6 text-indigo-500 mr-2" />
            <p className="text-2xl font-bold text-indigo-600 tabular-nums">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </p>
          </div>
        </div>

        <Card className="mb-6 overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
            <div className="flex items-center gap-2">
              <div
                className={`h-12 w-12 rounded-full ${isOnline ? "bg-gradient-to-r from-green-400 to-green-500" : "bg-gradient-to-r from-gray-300 to-gray-400"} flex items-center justify-center shadow-md`}
              >
                <Bike className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Trider Status</CardTitle>
                <CardDescription className={isOnline ? "text-green-600 font-medium" : "text-gray-500"}>
                  You are currently {isOnline ? "online" : "offline"}
                  {assignedToda && isOnline && ` in ${assignedToda.name}`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Current Location</p>
                  <p className="text-xs text-muted-foreground">
                    {locationAddress || `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Online Time</p>
                  <p className="text-xs text-muted-foreground">
                    {isOnline ? (
                      <span className="text-green-600 font-medium">Active: {formatDuration(onlineDuration)}</span>
                    ) : (
                      formatDuration(onlineDuration)
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">TODA Assignment</p>
                  <p className="text-xs text-muted-foreground">
                    {assignedToda ? (
                      <span className="text-blue-600 font-medium">{assignedToda.name}</span>
                    ) : (
                      <Button
                        variant="link"
                        className="h-auto p-0 text-xs text-blue-600"
                        onClick={() => setShowLocationDialog(true)}
                      >
                        Select TODA area
                      </Button>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-md overflow-hidden bg-muted h-[200px] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-10 w-10 mx-auto mb-2 text-muted-foreground/50" />
                <p className="text-muted-foreground">Map view</p>
                <p className="text-xs text-muted-foreground">Click the location button to select a TODA area</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="available" className="relative">
              Available Rides
              {hasNewRequests && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center">
                    {bookingRequests.length}
                  </span>
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">Active Ride</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="available">
            {bookingRequests.length > 0 ? (
              <div className="space-y-4">
                {bookingRequests.map((request) => (
                  <Card
                    key={request.id}
                    className={`overflow-hidden border-l-4 ${
                      request.isWithinTodaArea ? "border-l-blue-500" : "border-l-amber-500"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">New Ride Request</CardTitle>
                        <Badge variant="outline" className="ml-2">
                          ₱{request.estimatedFare}
                        </Badge>
                      </div>
                      <CardDescription>
                        From {request.passengerName} • {new Date(request.requestTime).toLocaleTimeString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-3">
                        <div className="flex">
                          <MapPin className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Pickup</p>
                            <p className="text-sm text-muted-foreground">{request.pickupLocation.address}</p>
                          </div>
                        </div>
                        <div className="flex">
                          <MapPin className="h-5 w-5 mr-2 text-red-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium">Dropoff</p>
                            <p className="text-sm text-muted-foreground">{request.dropoffLocation.address}</p>
                          </div>
                        </div>

                        {!request.isWithinTodaArea && (
                          <Card className="bg-yellow-50 border-yellow-200">
                            <CardHeader>
                              <CardTitle className="text-yellow-800">Outside Service Area</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-yellow-700">
                                The drop-off location for this ride is outside your TODA's designated service area.
                              </p>
                            </CardContent>
                            <CardFooter>
                              <Button variant="destructive" onClick={() => declineBookingRequest(request.id)}>
                                Decline Request
                              </Button>
                            </CardFooter>
                          </Card>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <Button variant="outline" className="w-[48%]" onClick={() => declineBookingRequest(request.id)}>
                        Decline
                      </Button>
                      <Button
                        className="w-[48%]"
                        onClick={() => acceptBookingRequest(request.id)}
                        disabled={!request.isWithinTodaArea}
                      >
                        Accept
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Bike className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>No available rides at the moment</p>
                <p className="text-sm">
                  {isOnline
                    ? "Waiting for ride requests in your area..."
                    : "Go online to start receiving ride requests"}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="active">
            {activeRide ? (
              <Card className="overflow-hidden border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">Active Ride</CardTitle>
                    <Badge variant="outline" className="ml-2">
                      ₱{activeRide.estimatedFare}
                    </Badge>
                  </div>
                  <CardDescription>Passenger: {activeRide.passengerName}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-3">
                    <div className="flex">
                      <MapPin className="h-5 w-5 mr-2 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Pickup</p>
                        <p className="text-sm text-muted-foreground">{activeRide.pickupLocation.address}</p>
                      </div>
                    </div>
                    <div className="flex">
                      <MapPin className="h-5 w-5 mr-2 text-red-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Dropoff</p>
                        <p className="text-sm text-muted-foreground">{activeRide.dropoffLocation.address}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-green-50 rounded-md border border-green-200">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Bike className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-green-800">Ride in Progress</p>
                          <p className="text-xs text-green-700">Navigate to the destination</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" className="w-[48%]">
                    Contact Passenger
                  </Button>
                  <Button className="w-[48%]" onClick={completeActiveRide}>
                    Complete Ride
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Bike className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p>You don't have any active rides</p>
                <p className="text-sm">Accept a ride request to see it here</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <div className="text-center py-12 text-muted-foreground">
              <Bike className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>No ride history yet</p>
              <p className="text-sm">Your completed rides will appear here</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Time Log Card */}
        <Card className="mb-6 overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <CardTitle className="flex items-center text-xl">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              Time Log
            </CardTitle>
            <CardDescription>Your online and offline activity</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {timeLog.length > 0 ? (
              <div className="space-y-3">
                {timeLog.map((log, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-md flex justify-between items-center shadow-sm ${
                      log.type === "online"
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200"
                        : "bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200"
                    }`}
                  >
                    <div>
                      <p
                        className={`text-sm font-medium ${log.type === "online" ? "text-green-700" : "text-gray-700"}`}
                      >
                        {log.type === "online" ? "Online" : "Offline"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {log.startTime.toLocaleTimeString()} - {log.endTime?.toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant={log.type === "online" ? "default" : "secondary"}>
                      {log.duration ? formatDuration(log.duration) : "Active"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                <p>No time logs yet</p>
                <p className="text-sm">Toggle online status to start logging time</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Selection Dialog */}
        <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select Your TODA Area</DialogTitle>
              <DialogDescription>
                Choose the TODA area you want to operate in. You will only be able to accept rides within this area.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              {todaAreas.map((toda) => (
                <Button
                  key={toda.id}
                  variant="outline"
                  className="justify-start h-auto py-3"
                  onClick={() => setManualLocation(toda)}
                >
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
                    <div className="text-left">
                      <p className="font-medium">{toda.name}</p>
                      <p className="text-xs text-muted-foreground">{toda.area}</p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLocationDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Service Area Info Dialog */}
        <Dialog open={showServiceAreaInfo} onOpenChange={setShowServiceAreaInfo}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>TODA Service Area Limitations</DialogTitle>
              <DialogDescription>Understanding the boundaries of your TODA's service area</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm">
                As a Trider, you are only authorized to operate within your assigned TODA's service area, which is
                typically limited to a specific barangay or village.
              </p>

              {assignedToda && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Your current TODA: {assignedToda.name}</p>
                  <p className="text-sm">Service area: {assignedToda.area}</p>
                  <p className="text-sm font-medium mt-2">Notable landmarks within your service area:</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {assignedToda.landmarks.map((landmark: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        - {landmark}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-xs">
                  Rides with destinations outside your TODA's service area will be marked with a warning and cannot be
                  accepted.
                </AlertDescription>
              </Alert>

              <p className="text-sm">
                This limitation is in place to respect the territorial agreements between different TODAs and to ensure
                fair distribution of rides among all drivers.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowServiceAreaInfo(false)}>I Understand</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

