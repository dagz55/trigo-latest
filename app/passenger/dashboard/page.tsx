"use client"

import BackgroundAnimation from "@/components/BackgroundAnimation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase-client"
import { BellIcon, Bike, CalendarIcon, Car, Clock, CreditCard, History, MapPinIcon, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface RideHistory {
  id: string
  created_at: string
  pickup_location: string
  dropoff_location: string
  status: string
  amount: number
  trider_name?: string
}

export default function PassengerDashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [rideHistory, setRideHistory] = useState<RideHistory[]>([])
  const [pendingRide, setPendingRide] = useState<any>(null)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push("/login")
          return
        }

        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError) {
          throw profileError
        }

        // Check if user role is passenger
        if (profileData.role !== "passenger") {
          toast.error("Access denied", {
            description: "You do not have permission to access this page."
          })
          router.push("/roles")
          return
        }

        setUserData(profileData)
        
        // Get ride history
        const { data: rides, error: ridesError } = await supabase
          .from("rides")
          .select(`
            id,
            created_at,
            pickup_location,
            dropoff_location,
            status,
            amount,
            trider:trider_id (
              first_name,
              last_name
            )
          `)
          .eq("passenger_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(10)

        if (ridesError) {
          throw ridesError
        }

        const formattedRides = rides.map(ride => ({
          id: ride.id,
          created_at: ride.created_at,
          pickup_location: ride.pickup_location,
          dropoff_location: ride.dropoff_location,
          status: ride.status,
          amount: ride.amount,
          trider_name: ride.trider 
            ? `${(ride.trider as any).first_name || ''} ${(ride.trider as any).last_name || ''}`
            : "Not assigned"
        }))

        setRideHistory(formattedRides)

        // Check for pending ride
        const pendingRide = formattedRides.find(ride => 
          ["requested", "accepted", "picked_up"].includes(ride.status)
        )
        
        if (pendingRide) {
          setPendingRide(pendingRide)
        }

      } catch (error) {
        console.error("Session check error:", error)
        toast.error("Error loading dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-white">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const bookRide = () => {
    router.push("/passenger/book-ride")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500"
      case "cancelled":
        return "bg-red-500/10 text-red-500"
      case "requested":
        return "bg-yellow-500/10 text-yellow-500"
      case "accepted":
        return "bg-blue-500/10 text-blue-500"
      case "picked_up":
        return "bg-purple-500/10 text-purple-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <BackgroundAnimation />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-bold text-xl">
                <span className="text-white">Tri</span>
                <span className="text-purple-500">Go</span>
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative rounded-full bg-gray-800 p-2" aria-label="Notifications">
                <BellIcon className="h-5 w-5 text-white" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-purple-500"></span>
              </button>
              <div className="flex items-center">
                <Avatar className="h-8 w-8 border border-purple-500/50">
                  <AvatarImage src={userData?.avatar_url || ""} alt={userData?.first_name} />
                  <AvatarFallback className="bg-purple-500/20 text-purple-200">
                    {userData?.first_name?.charAt(0)}{userData?.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          {/* Welcome Section */}
          <section className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Hi, {userData?.first_name || "Passenger"} 👋
            </h1>
            <p className="text-white/60">Where are you going today?</p>
          </section>

          {/* Active Ride Section */}
          {pendingRide && (
            <section className="mb-8">
              <Card className="bg-gradient-to-br from-purple-900/30 to-black/40 border border-purple-500/20 backdrop-blur-lg overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-purple-400" />
                    Active Ride
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    {pendingRide.status === "requested" ? "Waiting for a trider..." : 
                     pendingRide.status === "accepted" ? "Trider is on the way" :
                     "On your way to destination"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <div className="w-0.5 h-12 bg-gray-700"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="text-sm text-white/60">Pickup Location</p>
                          <p className="font-medium">{pendingRide.pickup_location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Dropoff Location</p>
                          <p className="font-medium">{pendingRide.dropoff_location}</p>
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pendingRide.status)}`}>
                          {pendingRide.status.replace("_", " ")}
                        </div>
                        <p className="mt-2 text-lg font-bold">₱{pendingRide.amount.toFixed(2)}</p>
                      </div>
                    </div>

                    {pendingRide.trider_name !== "Not assigned" && (
                      <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg mt-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3 border border-purple-500/50">
                            <AvatarFallback className="bg-purple-500/20">
                              {pendingRide.trider_name.split(" ").map((n: string) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{pendingRide.trider_name}</p>
                            <p className="text-sm text-white/60">Your Trider</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                          Contact
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-white/5 border-t border-white/10 flex justify-between">
                  <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                    View Details
                  </Button>
                  <Button variant="destructive" size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border-0">
                    Cancel Ride
                  </Button>
                </CardFooter>
              </Card>
            </section>
          )}

          {/* Quick Actions */}
          <section className="mb-8 grid grid-cols-2 gap-4">
            <Button 
              onClick={bookRide}
              className="h-auto py-6 bg-gradient-to-r from-purple-600/80 to-purple-800/80 hover:from-purple-600 hover:to-purple-800 backdrop-blur-lg border border-purple-500/30"
            >
              <div className="flex flex-col items-center text-center">
                <Bike className="h-8 w-8 mb-2" />
                <span className="text-lg font-medium">Book a Ride</span>
              </div>
            </Button>
            <Button 
              className="h-auto py-6 bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-800 hover:to-gray-900 backdrop-blur-lg border border-gray-700/30"
            >
              <div className="flex flex-col items-center text-center">
                <MapPinIcon className="h-8 w-8 mb-2" />
                <span className="text-lg font-medium">Saved Locations</span>
              </div>
            </Button>
          </section>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid grid-cols-3 bg-gray-800/50 backdrop-blur-sm">
              <TabsTrigger value="history" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <CreditCard className="h-4 w-4 mr-2" />
                Payment
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="history" className="mt-4">
              <Card className="bg-black/40 border border-gray-800 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle>Recent Trips</CardTitle>
                  <CardDescription>Your latest ride activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {rideHistory.length > 0 ? (
                      <div className="space-y-4">
                        {rideHistory.map((ride) => (
                          <div 
                            key={ride.id} 
                            className="p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg flex flex-col"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="text-sm text-white/60">
                                  <CalendarIcon className="h-3 w-3 inline mr-1" />
                                  {formatDate(ride.created_at)}
                                </p>
                                <p className="font-medium mt-1">Ride with {ride.trider_name}</p>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                                {ride.status.replace("_", " ")}
                              </div>
                            </div>
                            
                            <div className="flex items-start mt-2">
                              <div className="flex flex-col items-center mr-3">
                                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                <div className="w-0.5 h-8 bg-gray-700"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              </div>
                              <div className="flex-1 space-y-2 text-sm">
                                <p className="truncate">{ride.pickup_location}</p>
                                <p className="truncate">{ride.dropoff_location}</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-700/50">
                              <p className="font-medium">₱{ride.amount.toFixed(2)}</p>
                              <Button variant="ghost" size="sm" className="h-8 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <Car className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium">No ride history</h3>
                        <p className="text-white/60 mt-1">Book your first ride to see it here.</p>
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="payment" className="mt-4">
              <Card className="bg-black/40 border border-gray-800 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage your payment options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/30 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                          <CreditCard className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium">Cash Payment</p>
                          <p className="text-sm text-white/60">Default payment method</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-gray-700 text-white/70">
                        Default
                      </Button>
                    </div>
                    
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-800 border border-purple-500/30">
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile" className="mt-4">
              <Card className="bg-black/40 border border-gray-800 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center mb-6">
                    <Avatar className="h-20 w-20 mb-4 border-2 border-purple-500/50">
                      <AvatarImage src={userData?.avatar_url || ""} alt={userData?.first_name} />
                      <AvatarFallback className="bg-purple-500/20 text-purple-200 text-xl">
                        {userData?.first_name?.charAt(0)}{userData?.last_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold">{userData?.first_name} {userData?.last_name}</h3>
                    <p className="text-white/60">{userData?.email || "No email provided"}</p>
                    <div className="mt-2 px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                      Passenger
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-purple-400" />
                          </div>
                          <div>
                            <p className="font-medium">Account Information</p>
                            <p className="text-sm text-white/60">Update your personal details</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-white/70">
                          Edit
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                            <MapPinIcon className="h-5 w-5 text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium">Saved Locations</p>
                            <p className="text-sm text-white/60">Manage your favorite places</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-white/70">
                          View
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-700 rounded-lg bg-gray-800/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                            <BellIcon className="h-5 w-5 text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium">Notifications</p>
                            <p className="text-sm text-white/60">Configure your alerts</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-white/70">
                          Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full mt-6 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    onClick={async () => {
                      await supabase.auth.signOut()
                      router.push("/login")
                    }}
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
} 