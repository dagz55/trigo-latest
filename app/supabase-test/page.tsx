"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from "lucide-react"
import { Header } from "@/components/layout/header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function SupabaseTestPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<"success" | "error" | "loading">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [profilesCount, setProfilesCount] = useState<number | null>(null)
  const [supabaseUrl, setSupabaseUrl] = useState<string | null>(null)
  const [environment, setEnvironment] = useState<string | null>(null)

  const testConnection = async () => {
    setIsLoading(true)
    setConnectionStatus("loading")
    setErrorMessage(null)

    try {
      // Test the connection by fetching the count of profiles
      const { count, error } = await supabase.from("profiles").select("*", { count: "exact", head: true })

      if (error) throw error

      setProfilesCount(count)
      setConnectionStatus("success")

      // Get Supabase URL (masked for security)
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "Not configured"
      setSupabaseUrl(url.replace(/^(https?:\/\/[^.]+).*$/, "$1..."))

      // Get environment
      const response = await fetch("/api/supabase-health")
      const data = await response.json()
      setEnvironment(data.environment || "unknown")
    } catch (error: any) {
      console.error("Supabase connection test failed:", error)
      setConnectionStatus("error")
      setErrorMessage(error.message || "Unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <>
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>Testing connection to your Supabase project</CardDescription>
          </CardHeader>
          <CardContent>
            {connectionStatus === "loading" ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
                <span className="ml-4">Testing connection...</span>
              </div>
            ) : connectionStatus === "success" ? (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">Connection Successful</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-400">
                  <p>Successfully connected to Supabase!</p>
                  <ul className="mt-2 space-y-1">
                    <li>
                      <strong>URL:</strong> {supabaseUrl}
                    </li>
                    <li>
                      <strong>Environment:</strong> {environment}
                    </li>
                    <li>
                      <strong>Profiles Count:</strong> {profilesCount}
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <AlertTitle className="text-red-800 dark:text-red-300">Connection Failed</AlertTitle>
                <AlertDescription className="text-red-700 dark:text-red-400">
                  <p>Failed to connect to Supabase. Please check your configuration.</p>
                  {errorMessage && (
                    <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/40 rounded text-sm">
                      <p>
                        <strong>Error:</strong> {errorMessage}
                      </p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <div className="mt-6">
              <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <AlertTitle className="text-amber-800 dark:text-amber-300">Environment Variables</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-400">
                  <p>Make sure you have set the following environment variables:</p>
                  <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                    <li>NEXT_PUBLIC_SUPABASE_URL</li>
                    <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={testConnection} disabled={isLoading} className="flex items-center">
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Test Connection Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

