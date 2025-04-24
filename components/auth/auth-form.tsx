"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrigoLoadingSpinner } from "@/components/ui/trigo-loading-spinner"
import { useUser } from "@/contexts/user-context"
import { supabase } from "@/lib/supabase-client"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"; // Import toast

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState("passenger")
  const [loading, setLoading] = useState(false)
  // Remove message and error states, use toast instead
  // const [message, setMessage] = useState<string | null>(null)
  // const [error, setError] = useState<string | null>(null)
  // Remove rememberMe state
  // const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const { setUser } = useUser()
  const [activeTab, setActiveTab] = useState<string>("signin")

  // Check for tab parameter in URL on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const tabParam = searchParams.get("tab")
    if (tabParam === "signup") {
      setActiveTab("signup")
    }
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log("Attempting sign in for:", email)

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        console.error("Sign in error:", authError.message)
        toast.error(`Sign in failed: ${authError.message}`)
        setLoading(false)
        return
      }

      if (!authData.user) {
        // Should not happen if error is null, but good practice to check
        console.error("Sign in error: No user data returned despite no error.")
        toast.error("Sign in failed: An unexpected error occurred.")
        setLoading(false)
        return
      }

      console.log("Sign in successful for user:", authData.user.id)

      // Fetch user profile from profiles table
      console.log("Fetching profile for user:", authData.user.id)
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role, full_name, phone") // Select only needed fields
        .eq("id", authData.user.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile after sign in:", profileError.message)
        // Decide how to handle this: show error? Log out?
        // For now, show error and don't proceed with context/redirect
        toast.error(`Error fetching profile: ${profileError.message}. Please try again later.`)
        // Optionally sign the user out if profile is critical
        // await supabase.auth.signOut();
        setLoading(false)
        return
      }

      if (!profileData) {
        console.error("Profile not found for user:", authData.user.id)
        toast.error("User profile not found. Please contact support.")
        // Optionally sign the user out
        // await supabase.auth.signOut();
        setLoading(false)
        return
      }

      console.log("Profile fetched successfully:", profileData)

      // Set user with profile data in context
      setUser({
        id: authData.user.id,
        email: authData.user.email || "",
        role: profileData.role || "passenger", // Default role if missing?
        name: profileData.full_name,
        phone: profileData.phone,
      })
      console.log("User context set.")

      // Redirect based on user role
      const userRole = profileData.role
      let redirectPath = "/dashboard" // Default redirect
      if (userRole === "passenger") {
        redirectPath = "/passenger"
      } else if (userRole === "rider") {
        redirectPath = "/trider"
      } else if (userRole === "dispatcher") {
        redirectPath = "/dispatcher"
      } else if (userRole === "admin") {
        redirectPath = "/admin" // Add admin redirect if applicable
      }

      console.log(`Redirecting to ${redirectPath} for role ${userRole}`)
      toast.success("Sign in successful!")

      // Use router.replace for better history management after login
      // No need for setTimeout unless showing a message briefly before redirect
      router.replace(redirectPath)
      // setLoading(false) // No need to set loading false if redirecting immediately

    } catch (error: any) {
      // Catch any unexpected errors not handled above
      console.error("Unexpected error during sign in:", error)
      toast.error(error.message || "An unexpected error occurred during sign in")
      setLoading(false)
    }
    // Removed finally block as setLoading is handled within try/catch paths
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log("Attempting sign up for:", email, "as role:", role)

    try {
      // Register the user with Supabase
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone,
            role: role,
          },
        },
      })

      if (signUpError) {
        console.error("Sign up error:", signUpError.message)
        toast.error(`Sign up failed: ${signUpError.message}`)
        setLoading(false)
        return
      }

      // Check if user needs verification
      if (signUpData.user && signUpData.user.identities?.length === 0) {
         // This might indicate an issue like email already exists but unverified
         console.warn("Sign up warning: User created but might need verification or already exists.", signUpData);
         toast.warning("Account may already exist or require verification. Please check your email or try signing in.");
      } else if (signUpData.user) {
        console.log("Sign up successful for:", email, "User ID:", signUpData.user.id)
        toast.success("Account created successfully! Please check your email for verification.")
        // Optionally clear form fields
        setEmail("")
        setPassword("")
        setName("")
        setPhone("")
        setRole("passenger")
        setActiveTab("signin") // Switch to signin tab after successful signup
      } else {
         // Handle cases where sign up might seem successful but no user object is returned
         console.warn("Sign up warning: No user data returned after sign up.", signUpData);
         toast.warning("Sign up process completed, but confirmation is pending. Please check your email.");
      }

    } catch (error: any) {
      // Catch any unexpected errors
      console.error("Unexpected error during sign up:", error)
      toast.error(error.message || "An unexpected error occurred during sign up")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-black/20 rounded-xl border border-white/10 shadow-xl">
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm rounded-xl">
          <TrigoLoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Authenticating...</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardHeader>
          <CardTitle className="text-2xl text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-300">Login to Trigo</CardTitle>
          <CardDescription className="text-center text-white/80">Sign in or create an account to get started</CardDescription>
          <TabsList className="grid w-full grid-cols-2 mt-4 bg-gray-900/50">
            <TabsTrigger value="signin" className="data-[state=active]:bg-purple-500/20">Sign In</TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-purple-500/20">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          {/* Remove message and error divs */}
          {/* {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-md">{message}</div>} */}
          {/* {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>} */}

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signin" className="text-white/80">Email</Label>
                <Input
                  id="email-signin"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 focus:border-purple-500/50 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signin" className="text-white/80">Password</Label>
                <Input
                  id="password-signin"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 focus:border-purple-500/50 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="text-right">
                <Link href="/auth/reset-password" className="text-sm text-purple-400 hover:text-purple-300 hover:underline">
                  Forgot password? Reset here
                </Link>
              </div>
              {/* Remove Remember Me checkbox */}
              {/* <div className="flex items-center space-x-2 mb-2"> ... </div> */}
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 transition-all duration-300">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center pt-2 text-xs text-gray-400">
                Dont have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className="text-purple-400 hover:text-purple-300 hover:underline focus:outline-none"
                >
                  Sign up now
                </button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name-signup" className="text-white/80">Full Name</Label>
                <Input
                  id="name-signup"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 focus:border-purple-500/50 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup" className="text-white/80">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 focus:border-purple-500/50 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup" className="text-white/80">Password</Label>
                <Input
                  id="password-signup"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 focus:border-purple-500/50 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white/80">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700 focus:border-purple-500/50 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white/80">Account Type</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2 rounded-md border bg-gray-800/50 border-gray-700 focus:border-purple-500/50 text-white"
                  aria-label="Account Type"
                >
                  <option value="passenger">Passenger</option>
                  <option value="rider">Rider</option>
                  <option value="dispatcher">Dispatcher</option>
                </select>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 transition-all duration-300">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center pt-2 text-xs text-gray-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signin")}
                  className="text-purple-400 hover:text-purple-300 hover:underline focus:outline-none"
                >
                  Sign in instead
                </button>
              </div>
            </form>
          </TabsContent>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-white/10 pt-4 text-white/60">
          <div className="text-xs">
            &copy; {new Date().getFullYear()} Trigo Transportation. All rights reserved.
          </div>
        </CardFooter>
      </Tabs>
    </Card>
  )
}
