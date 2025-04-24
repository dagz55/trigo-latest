"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"
import type React from "react"
import { useState } from "react"
import { toast } from "sonner"

interface AuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AuthForm({ className, ...props }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [role, setRole] = useState<string>("passenger")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isSignUp, setIsSignUp] = useState<boolean>(false)

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role,
            },
          },
        })

        if (error) {
          throw error
        }

        toast.success("Verification email sent", {
          description: "Please check your email to verify your account",
        })
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          throw error
        }

        // The callback handler will handle redirect
        toast.success("Login successful", {
          description: "Redirecting you to your dashboard...",
        })
      }
    } catch (error: any) {
      toast.error(isSignUp ? "Sign up failed" : "Login failed", {
        description: error.message || "Please check your credentials and try again.",
      })
      console.error("Auth error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {isSignUp ? "Create an account" : "Sign in to your account"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isSignUp
            ? "Enter your details below to create your account"
            : "Enter your credentials below to sign in"}
        </p>
      </div>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              placeholder="Enter your password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="role">I am a:</Label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-label="Select your role"
                required
              >
                <option value="passenger">Passenger</option>
                <option value="trider">Trider/Driver</option>
                <option value="dispatcher">Dispatcher</option>
              </select>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading 
              ? "Loading..." 
              : isSignUp 
                ? "Create Account" 
                : "Sign In"
            }
          </Button>
        </div>
      </form>
      
      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm underline text-blue-500 hover:text-blue-700"
        >
          {isSignUp 
            ? "Already have an account? Sign in" 
            : "Don't have an account? Sign up"
          }
        </button>
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={async () => {
          try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
              },
            });

            if (error) {
              throw error;
            }
          } catch (error) {
            toast.error("Google sign in failed", {
              description: "An error occurred during sign in with Google.",
            });
            console.error("OAuth error:", error);
            setIsLoading(false);
          }
        }}
      >
        Google
      </Button>
    </div>
  )
}

