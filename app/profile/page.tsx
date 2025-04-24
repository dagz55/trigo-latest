"use client"

import BackgroundAnimation from "@/components/BackgroundAnimation"
import { Header } from "@/components/layout/header"
import { TodaPreferences } from "@/components/profile/toda-preferences"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { LoadingPage } from "@/components/ui/loading-page"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/contexts/user-context"
import { ArrowLeft, Briefcase, Home, LogOut, MapPin, Star, User } from "lucide-react"
import dynamic from 'next/dynamic'
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Simplified dynamic import for the mock map component
const MapboxMap = dynamic(() => import('@/components/map/mapbox-map'), {
  loading: () => <div className="h-64 flex items-center justify-center bg-gray-700/50 rounded-lg">Loading map...</div>,
  ssr: false,
});

export default function ProfilePage() {
  const { user, updateUserProfile, logout, loading } = useUser()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [homeAddress, setHomeAddress] = useState("")
  const [workAddress, setWorkAddress] = useState("")
  
  useEffect(() => {
    setMounted(true)
    
    if (user) {
      setName(user.name || "")
      setPhone(user.phone || "")
      setHomeAddress(user.homeLocation?.address || "")
      setWorkAddress(user.terminalExit?.address || "")
    }
  }, [user])

  // Wait for component to mount before rendering to avoid hydration issues
  if (!mounted) {
    return <LoadingPage message="Loading profile..." />
  }

  // Redirect if not logged in
  if (!loading && !user) {
    router.push("/auth")
    return null
  }

  const handleLogout = async () => {
    try {
      setIsUpdating(true)
      await logout()
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true)
      await updateUserProfile({
        name,
        phone,
      })
      toast.success("Your profile information has been updated successfully.")
    } catch (error) {
      toast.error("There was an error updating your profile. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return <LoadingPage message="Loading profile..." />
  }

  return (
    <main className="min-h-screen w-full relative flex flex-col items-start overflow-hidden">
      <BackgroundAnimation />
      
      <Header />
      
      <div className="container max-w-5xl mx-auto py-8 px-4 z-10 pt-20">
        {isUpdating && <LoadingOverlay message="Updating profile..." />}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link href={user?.role === "passenger" ? "/passenger" : user?.role === "trider" ? "/trider" : "/dashboard"}>
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-300">My Profile</h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="border-red-500/30 text-red-400 hover:bg-red-950/20 hover:text-red-300"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-purple-400" />
                <CardTitle className="text-white/90">Account Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-white/80">Email</p>
                  <p className="text-sm text-white/60">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Role</p>
                  <p className="text-sm text-white/60 capitalize">{user?.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Member Since</p>
                  <p className="text-sm text-white/60">January 2023</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="personal">
              <TabsList className="mb-4 bg-black/30 backdrop-blur-sm">
                <TabsTrigger value="personal" className="data-[state=active]:bg-purple-500/20">Personal Info</TabsTrigger>
                <TabsTrigger value="locations" className="data-[state=active]:bg-purple-500/20">Saved Locations</TabsTrigger>
                <TabsTrigger value="preferences" className="data-[state=active]:bg-purple-500/20">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white/90">Personal Information</CardTitle>
                    <CardDescription className="text-white/60">Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white/80">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="bg-gray-800/50 border-gray-700 focus:border-purple-500/50 text-white placeholder:text-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white/80">Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="bg-gray-800/50 border-gray-700 focus:border-purple-500/50 text-white placeholder:text-gray-500"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleUpdateProfile}
                      className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 transition-all duration-300"
                    >
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="locations">
                <Card className="bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white/90">Saved Locations</CardTitle>
                    <CardDescription className="text-white/60">Manage your frequently used locations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-purple-400" />
                        <h3 className="font-medium text-white/80">Home Location</h3>
                      </div>

                      {user?.homeLocation ? (
                        <div className="space-y-3">
                          <div className="mt-4">
                            <h2 className="text-lg font-semibold text-white/90">Home Location</h2>
                            <div className="h-64 rounded-lg overflow-hidden">
                              <MapboxMap
                                center={{ lat: user.homeLocation.lat, lng: user.homeLocation.lng }}
                                zoom={14}
                                height="256px"
                                markers={[
                                  {
                                    lat: user.homeLocation.lat,
                                    lng: user.homeLocation.lng,
                                    title: "Home",
                                    type: "terminal" as "terminal"
                                  }
                                ]}
                              />
                            </div>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded-md">
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mt-1 mr-2 text-purple-400" />
                              <div>
                                <p className="text-sm font-medium text-white/80">{user.homeLocation.address}</p>
                                <p className="text-xs text-white/60">
                                  Lat: {user.homeLocation.lat.toFixed(6)}, Lng: {user.homeLocation.lng.toFixed(6)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-800/30 rounded-md text-center">
                          <p className="text-sm text-white/60">No home location set</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 border-purple-500/30 text-purple-400 hover:bg-purple-950/20"
                          >
                            Add Home Location
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-purple-400" />
                        <h3 className="font-medium text-white/80">Terminal Exit</h3>
                      </div>

                      {user?.terminalExit ? (
                        <div className="space-y-3">
                          <div className="mt-4">
                            <h2 className="text-lg font-semibold text-white/90">Terminal Exit Location</h2>
                            <div className="h-64 rounded-lg overflow-hidden">
                              <MapboxMap
                                center={{ lat: user.terminalExit.lat, lng: user.terminalExit.lng }}
                                zoom={14}
                                height="256px"
                                markers={[
                                  {
                                    lat: user.terminalExit.lat,
                                    lng: user.terminalExit.lng,
                                    title: "Terminal Exit",
                                    type: "terminal" as "terminal"
                                  }
                                ]}
                              />
                            </div>
                          </div>
                          <div className="p-3 bg-gray-800/50 rounded-md">
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mt-1 mr-2 text-purple-400" />
                              <div>
                                <p className="text-sm font-medium text-white/80">{user.terminalExit.address}</p>
                                <p className="text-xs text-white/60">
                                  Lat: {user.terminalExit.lat.toFixed(6)}, Lng: {user.terminalExit.lng.toFixed(6)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-800/30 rounded-md text-center">
                          <p className="text-sm text-white/60">No terminal exit location set</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2 border-purple-500/30 text-purple-400 hover:bg-purple-950/20"
                          >
                            Add Terminal Exit
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card className="bg-black/20 backdrop-blur-sm border border-white/10 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white/90">Preferences</CardTitle>
                    <CardDescription className="text-white/60">Customize your experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user?.role === "passenger" && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-purple-400" />
                          <h3 className="font-medium text-white/80">Preferred TODA</h3>
                        </div>
                        
                        <TodaPreferences 
                          userId={user.id} 
                          preferredTodaId={user.preferredTodaId} 
                          onUpdate={() => {
                            toast.success("Preferences updated successfully")
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}

