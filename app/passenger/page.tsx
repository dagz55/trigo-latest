"use client"

import { useEffect, useState } from "react"
import { PassengerBooking } from "@/components/passenger/passenger-booking"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { LoadingPage } from "@/components/ui/loading-page"
import { Header } from "@/components/layout/header"
import dynamic from 'next/dynamic'

const LocationTracker = dynamic(
  () => import('@/components/location/location-tracker').then(mod => mod.LocationTracker),
  { ssr: false }
)

export default function PassengerPage() {
  const { user, loading: userLoading } = useUser()
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    // Only start initial loading timer after user context is ready
    if (!userLoading) {
      const timer = setTimeout(() => {
        setInitialLoading(false)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [userLoading])

  if (userLoading || initialLoading) {
    return <LoadingPage message="Loading Passenger Dashboard..." />
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Passenger Dashboard</h1>
          <div className="flex items-center gap-2">
            {user && (
              <LocationTracker showControls={true} className="mr-2" />
            )}
            {user ? (
              <Link href="/profile">
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  My Profile
                </Button>
              </Link>
            ) : (
              <Link href="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
            )}
            <Link href="/roles">
              <Button variant="outline">Change Role</Button>
            </Link>
          </div>
        </div>

        {user ? (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Welcome back, {user.name}</AlertTitle>
            <AlertDescription>
              Your saved locations are ready to use. Need to update them? Visit your{" "}
              <Link href="/profile" className="underline">
                profile
              </Link>
              .
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertTitle>Passenger Mode</AlertTitle>
            <AlertDescription>
              You are now in passenger mode.{" "}
              <Link href="/auth" className="underline">
                Sign in
              </Link>{" "}
              to use your saved locations and preferences.
            </AlertDescription>
          </Alert>
        )}

        <PassengerBooking />
      </div>
    </>
  )
}

