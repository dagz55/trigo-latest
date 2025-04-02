"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { MapPin, User, LogOut, Home, Briefcase, Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { GoogleMap } from "@/components/map/google-map"
import { useToast } from "@/hooks/use-toast"
import { LoadingPage } from "@/components/ui/loading-page"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { Header } from "@/components/layout/header"

export default function ProfilePage() {
  const { user, updateUserProfile, logout, loading } = useUser()
  const router = useRouter()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [name, setName] = useState(user?.name || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [homeAddress, setHomeAddress] = useState(user?.homeLocation?.address || "")
  const [workAddress, setWorkAddress] = useState(user?.workLocation?.address || "")

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
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return <LoadingPage message="Loading profile..." />
  }

  return (
    <>
      <Header />
      <div className="container max-w-4xl mx-auto py-8">
        {isUpdating && <LoadingOverlay message="Updating profile..." />}

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href={user?.role === "passenger" ? "/passenger" : user?.role === "trider" ? "/trider" : "/dashboard"}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">My Profile</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Account Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Role</p>
                  <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">January 2023</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Tabs defaultValue="personal">
              <TabsList className="mb-4">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="locations">Saved Locations</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleUpdateProfile}>Save Changes</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="locations">
                <Card>
                  <CardHeader>
                    <CardTitle>Saved Locations</CardTitle>
                    <CardDescription>Manage your frequently used locations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Home className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Home Location</h3>
                      </div>

                      {user?.homeLocation ? (
                        <div className="space-y-3">
                          <GoogleMap
                            center={{ lat: user.homeLocation.lat, lng: user.homeLocation.lng }}
                            markers={[{ lat: user.homeLocation.lat, lng: user.homeLocation.lng, title: "Home" }]}
                            height="150px"
                          />
                          <div className="p-3 bg-muted rounded-md">
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mt-1 mr-2 text-primary" />
                              <div>
                                <p className="text-sm font-medium">{user.homeLocation.address}</p>
                                <p className="text-xs text-muted-foreground">
                                  Lat: {user.homeLocation.lat.toFixed(6)}, Lng: {user.homeLocation.lng.toFixed(6)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-muted/50 rounded-md text-center">
                          <p className="text-sm text-muted-foreground">No home location set</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Add Home Location
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" />
                        <h3 className="font-medium">Work Location</h3>
                      </div>

                      {user?.workLocation ? (
                        <div className="space-y-3">
                          <GoogleMap
                            center={{ lat: user.workLocation.lat, lng: user.workLocation.lng }}
                            markers={[{ lat: user.workLocation.lat, lng: user.workLocation.lng, title: "Work" }]}
                            height="150px"
                          />
                          <div className="p-3 bg-muted rounded-md">
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mt-1 mr-2 text-primary" />
                              <div>
                                <p className="text-sm font-medium">{user.workLocation.address}</p>
                                <p className="text-xs text-muted-foreground">
                                  Lat: {user.workLocation.lat.toFixed(6)}, Lng: {user.workLocation.lng.toFixed(6)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-muted/50 rounded-md text-center">
                          <p className="text-sm text-muted-foreground">No work location set</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Add Work Location
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">Favorite Locations</h3>
                        </div>
                        <Button variant="outline" size="sm">
                          Add New
                        </Button>
                      </div>

                      {user?.favoriteLocations && user.favoriteLocations.length > 0 ? (
                        <div className="space-y-3">
                          {user.favoriteLocations.map((location, index) => (
                            <div key={index} className="p-3 bg-muted rounded-md">
                              <div className="flex items-start">
                                <MapPin className="w-4 h-4 mt-1 mr-2 text-primary" />
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{location.address}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Lat: {location.lat.toFixed(6)}, Lng: {location.lng.toFixed(6)}
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Star className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 bg-muted/50 rounded-md text-center">
                          <p className="text-sm text-muted-foreground">No favorite locations saved</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Add locations you visit frequently for quick access
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your app experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Dark Mode</p>
                          <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                        </div>
                        <Button variant="outline">Toggle Theme</Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Notifications</p>
                          <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                        </div>
                        <Button variant="outline">Configure</Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Language</p>
                          <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                        </div>
                        <select className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                          <option>English</option>
                          <option>Filipino</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}

