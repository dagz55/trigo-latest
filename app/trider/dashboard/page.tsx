"use client"

import { supabase } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function TriderDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push("/")
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

        // Check if user role is trider
        if (profileData.role !== "trider") {
          toast.error("Access denied", {
            description: "You do not have permission to access this page."
          })
          router.push("/")
          return
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
          <div className="w-16 h-16 border-t-4 border-cyan-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-white">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Trider Dashboard</h1>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Welcome to your TriGo Trider dashboard!</h2>
          <p className="text-gray-300 mb-6">
            From here you can manage your rides, track earnings, and update your availability.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="font-medium text-cyan-300 mb-2">Pending Requests</h3>
              <p className="text-sm text-gray-300">Accept or decline incoming ride requests</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="font-medium text-cyan-300 mb-2">Earnings Summary</h3>
              <p className="text-sm text-gray-300">View your daily, weekly, and monthly earnings</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="font-medium text-cyan-300 mb-2">Vehicle Details</h3>
              <p className="text-sm text-gray-300">Update your vehicle information</p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
              <h3 className="font-medium text-cyan-300 mb-2">Performance Stats</h3>
              <p className="text-sm text-gray-300">Check your ratings and completion rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}