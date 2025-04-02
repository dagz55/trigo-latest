"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase-client"

export type UserLocation = {
  address: string
  lat: number
  lng: number
  isDefault?: boolean
}

// Update the UserProfile type
export type UserProfile = {
  id: string
  email: string
  name?: string
  phone?: string
  role: "passenger" | "trider" | "dispatcher" | "admin"
  homeLocation?: UserLocation
  workLocation?: UserLocation
  favoriteLocations?: UserLocation[]
  isOnline?: boolean
}

type UserContextType = {
  user: UserProfile | null
  loading: boolean
  setUser: (user: UserProfile | null) => void
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

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
          }

          // Add location data if available
          if (profileData?.home_location) {
            userData.homeLocation = profileData.home_location
          }

          if (profileData?.work_location) {
            userData.workLocation = profileData.work_location
          }

          if (profileData?.favorite_locations) {
            userData.favoriteLocations = profileData.favorite_locations
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

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return

    try {
      // Update the profile in Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.name,
          phone: data.phone,
          home_location: data.homeLocation,
          work_location: data.workLocation,
          favorite_locations: data.favoriteLocations,
        })
        .eq("id", user.id)

      if (error) throw error

      // Update local state
      setUser({ ...user, ...data })
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Error logging out:", error)
      throw error
    }
  }

  return (
    <UserContext.Provider value={{ user, loading, setUser, updateUserProfile, logout }}>
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

