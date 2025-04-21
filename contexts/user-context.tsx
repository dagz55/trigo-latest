"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { supabase } from "@/lib/supabase-client"
import { startLocationTracking } from "@/lib/location-utils"

export type UserLocation = {
  address: string
  lat: number
  lng: number
  isDefault?: boolean
}

export type UserProfile = {
  id: string
  email: string
  name?: string
  phone?: string
  role: "passenger" | "trider" | "dispatcher" | "admin"
  homeLocation?: UserLocation
  terminalExit?: UserLocation // Changed from workLocation
  favoriteLocations?: UserLocation[]
  isOnline?: boolean
  preferredTodaId?: string | null
}

type UserContextType = {
  user: UserProfile | null
  loading: boolean
  setUser: (user: UserProfile | null) => void
  updateUser: (data: Partial<UserProfile>) => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void> // Keep for backward compatibility
  logout: () => Promise<void>
  startTracking: () => void
  stopTracking: () => void
  isTracking: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isTracking, setIsTracking] = useState(false)
  const stopTrackingRef = useRef<(() => void) | null>(null)

  // Load user on mount
  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true)

        // Get the current session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Fetch user profile from profiles table
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (profileError) throw profileError

          // Set user with profile data
          const userData: UserProfile = {
            id: session.user.id,
            email: session.user.email || "",
            role: profileData?.role || "passenger",
            name: profileData?.full_name,
            phone: profileData?.phone,
            preferredTodaId: profileData?.preferred_toda_id || null,
          }

          // Add location data if available
          if (profileData?.home_location) {
            userData.homeLocation = profileData.home_location
          }

          if (profileData?.work_location) {
            userData.workLocation = profileData.work_location
          }

          // Load favorite locations from localStorage instead of database
          try {
            const savedLocations = localStorage.getItem("trigo_favorite_locations")
            if (savedLocations) {
              userData.favoriteLocations = JSON.parse(savedLocations)
            }
          } catch (e) {
            console.error("Error loading favorite locations from localStorage:", e)
          }

          setUser(userData)
        }
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("trigo_user", JSON.stringify(user))
    }
  }, [user])

  // Update user profile - new version
  const updateUser = async (data: Partial<UserProfile>) => {
    if (!user) return

    try {
      // First, check if we're trying to update favorite locations
      if (data.favoriteLocations) {
        // Just update the local state for favorite locations
        // We'll store them in localStorage but not in the database
        // This avoids issues with the database schema
        setUser({ ...user, favoriteLocations: data.favoriteLocations })
        localStorage.setItem("trigo_favorite_locations", JSON.stringify(data.favoriteLocations))
        return
      }

      // Prepare update payload
      const updatePayload: any = {}

      // Only include fields that exist in the database schema
      if (data.name !== undefined) updatePayload.full_name = data.name
      if (data.phone !== undefined) updatePayload.phone = data.phone
      if (data.preferredTodaId !== undefined) updatePayload.preferred_toda_id = data.preferredTodaId

      // Only update if we have fields to update
      if (Object.keys(updatePayload).length > 0) {
        const { error } = await supabase
          .from("profiles")
          .update(updatePayload)
          .eq("id", user.id)

        if (error) throw error
      }

      // Update local state
      setUser({ ...user, ...data })
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  // Keep for backward compatibility
  const updateUserProfile = updateUser

  // Start location tracking
  const startTracking = () => {
    if (!user || isTracking) return

    try {
      // Start tracking and store the stop function
      const stopTracking = startLocationTracking(user.id)
      stopTrackingRef.current = stopTracking
      setIsTracking(true)

      // Update user's isOnline status
      updateUser({ isOnline: true })
        .catch(error => console.error("Error updating online status:", error))

      console.log("Location tracking started for user:", user.id)
    } catch (error) {
      console.error("Error starting location tracking:", error)
    }
  }

  // Stop location tracking
  const stopTracking = () => {
    if (!isTracking || !stopTrackingRef.current) return

    try {
      // Call the stop function
      stopTrackingRef.current()
      stopTrackingRef.current = null
      setIsTracking(false)

      // Update user's isOnline status if they're logged in
      if (user) {
        updateUser({ isOnline: false })
          .catch(error => console.error("Error updating online status:", error))
      }

      console.log("Location tracking stopped")
    } catch (error) {
      console.error("Error stopping location tracking:", error)
    }
  }

  // Logout
  const logout = async () => {
    try {
      // Stop tracking if active
      if (isTracking) {
        stopTracking()
      }

      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Error logging out:", error)
      throw error
    }
  }

  return (
    <UserContext.Provider value={{
      user,
      loading,
      setUser,
      updateUser,
      updateUserProfile,
      logout,
      startTracking,
      stopTracking,
      isTracking
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

