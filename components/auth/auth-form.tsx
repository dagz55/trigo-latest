"xcuse client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useUser } from "@/contexts/user-context"
import { TrigoLoadingSpinner } from "@/components/ui/trigo-loading-spinner"
import { supabase } from "@/lib/supabase-client"
import { toast } from "sonner" // Import toast

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
    <Card className="w-full max-w-md mx-auto">
      {loading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
          <TrigoLoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Authenticating...</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to Trigo</CardTitle>
          <CardDescription className="text-center">Sign in or create an account to get started</CardDescription>
          <TabsList className="grid w-full grid-cols-2 mt-4">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          {/* Remove message and error divs */}
          {/* {message && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-md">{message}</div>} */}
          {/* {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">{error}</div>} */}

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signin">Email</Label>
                <Input
                  id="email-signin"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signin">Password</Label>
                <Input
                  id="password-signin"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-right">
                <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
                  Forgot password? Reset here
                </Link>
              </div>
              {/* Remove Remember Me checkbox */}
              {/* <div className="flex items-center space-x-2 mb-2"> ... </div> */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input
                  id="password-signup"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">I am a:</Label>
                <select
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                  aria-label="I am a:" // Add aria-label for accessibility
                >
                  <option value="passenger">Passenger</option>
                  <option value="rider">Rider/Driver</option>
                  <option value="dispatcher">Dispatcher</option>
                </select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Sign Up
              </Button>
            </form>
          </TabsContent>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
            <Link href="/" className="text-sm text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </CardFooter>
      </Tabs>
    </Card>
  )
}
