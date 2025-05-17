"use client"

import BackgroundAnimation from "@/components/BackgroundAnimation"
import { Header } from "@/components/layout/header"
import { PassengerBooking } from "@/components/passenger/passenger-booking"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { LoadingPage } from "@/components/ui/loading-page"
import { useUser } from "@/contexts/user-context"
import { BookOpen, DollarSign, Gauge, Info, LayoutDashboard, User } from "lucide-react"
import dynamic from 'next/dynamic'
import Link from "next/link"
import { useEffect, useState } from "react"

const LocationTracker = dynamic(
  () => import('@/components/location/location-tracker').then(mod => mod.LocationTracker),
  { ssr: false }
)

export default function PassengerPage() {
  const { user, loading: userLoading } = useUser()
  const [initialLoading, setInitialLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("dashboard")

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

  const renderSection = () => {
    switch(activeSection) {
      case "dashboard":
        return <PassengerBooking />
      case "history":
        return (
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl border border-green-500/20 shadow-lg text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-green-400 opacity-70" />
            <h3 className="text-xl font-bold text-white mb-2">Ride History</h3>
            <p className="text-white/70">View your completed trips and transactions</p>
            <p className="text-green-400 mt-4 text-sm">Coming soon</p>
          </div>
        )
      case "payments":
        return (
          <div className="bg-black/30 backdrop-blur-md p-6 rounded-xl border border-green-500/20 shadow-lg text-center">
            <DollarSign className="h-16 w-16 mx-auto mb-4 text-green-400 opacity-70" />
            <h3 className="text-xl font-bold text-white mb-2">Payments</h3>
            <p className="text-white/70">Manage your payment methods and transaction history</p>
            <p className="text-green-400 mt-4 text-sm">Coming soon</p>
          </div>
        )
      default:
        return <PassengerBooking />
    }
  }

  return (
    <main className="min-h-screen w-full relative flex flex-col overflow-hidden">
      <BackgroundAnimation />
      <Header />
      
      <div className="container mx-auto px-4 py-8 z-10 flex-1 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-black/30 backdrop-blur-md rounded-xl border border-white/10 shadow-lg p-4">
              <div className="flex flex-col space-y-2 mb-6">
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <User className="h-8 w-8 text-purple-400" />
                  <div>
                    <h3 className="font-medium text-white">{user?.name || "Guest User"}</h3>
                    <p className="text-sm text-white/60">{user?.email || "Not signed in"}</p>
                  </div>
                </div>
              </div>
              
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveSection("dashboard")}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeSection === "dashboard" 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : "hover:bg-white/5 text-white/70"
                  }`}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </button>
                
                <button 
                  onClick={() => setActiveSection("history")}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeSection === "history" 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : "hover:bg-white/5 text-white/70"
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Ride History</span>
                </button>
                
                <button 
                  onClick={() => setActiveSection("payments")}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    activeSection === "payments" 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                      : "hover:bg-white/5 text-white/70"
                  }`}
                >
                  <DollarSign className="h-5 w-5" />
                  <span>Payments</span>
                </button>
              </nav>
              
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex flex-col space-y-2">
                  <Link href="/profile">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Button>
                  </Link>
                  
                  <Link href="/roles">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                    >
                      <Gauge className="h-4 w-4 mr-2" />
                      Change Role
                    </Button>
                  </Link>
                  
                  <div className="flex items-center mt-2">
                    {user && (
                      <LocationTracker showControls={true} className="w-full" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-2">
                {activeSection === "dashboard" ? "Book a Ride" : 
                 activeSection === "history" ? "Ride History" : "Payments"}
              </h1>
              <p className="text-white/60">
                {activeSection === "dashboard" ? "Enter pickup and dropoff locations to book your ride" : 
                 activeSection === "history" ? "View your completed trips and ride history" : 
                 "Manage your payment methods and transaction history"}
              </p>
            </div>
            
            {user ? (
              <Alert className="mb-6 bg-black/30 border border-green-500/20 text-white">
                <AlertTitle>
                  <div className="flex items-center">
                    <Info className="h-4 w-4 text-green-400 mr-2" />
                    Welcome back, {user.name}
                  </div>
                </AlertTitle>
                <AlertDescription className="text-white/70">
                  Your saved locations are ready to use. Need to update them? Visit your{" "}
                  <Link href="/profile" className="text-green-400 hover:underline">
                    profile
                  </Link>
                  .
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="mb-6 bg-black/30 border border-green-500/20 text-white">
                <AlertTitle>
                  <div className="flex items-center">
                    <Info className="h-4 w-4 text-green-400 mr-2" />
                    Passenger Mode
                  </div>
                </AlertTitle>
                <AlertDescription className="text-white/70">
                  You are now in passenger mode.{" "}
                  <Link href="/auth" className="text-green-400 hover:underline">
                    Sign in
                  </Link>{" "}
                  to use your saved locations and preferences.
                </AlertDescription>
              </Alert>
            )}
            
            {renderSection()}
          </div>
        </div>
      </div>
    </main>
  )
}

