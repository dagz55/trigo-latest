"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Database, Map, RefreshCw } from "lucide-react"
import { Header } from "@/components/layout/header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import Link from "next/link"
import { supabase } from "@/lib/supabase-client"
import { isGoogleMapsConfigured } from "@/lib/maps-client"

export default function IntegrationTestPage() {
  const [supabaseStatus, setSupabaseStatus] = useState<"success" | "error" | "loading">("loading")
  const [mapsStatus, setMapsStatus] = useState<"success" | "error" | "loading">("loading")
  const [isLoading, setIsLoading] = useState(true)

  const testIntegrations = async () => {
    setIsLoading(true)
    setSupabaseStatus("loading")
    setMapsStatus("loading")

    // Test Supabase
    try {
      const { count, error } = await supabase.from("profiles").select("*", { count: "exact", head: true })

      if (error) throw error
      setSupabaseStatus("success")
    } catch (error) {
      console.error("Supabase test failed:", error)
      setSupabaseStatus("error")
    }

    // Test Google Maps
    try {
      const isConfigured = isGoogleMapsConfigured()
      if (!isConfigured) {
        setMapsStatus("error")
      } else {
        // Check if Google Maps is loaded
        if (typeof window !== "undefined") {
          if (window.google && window.google.maps) {
            setMapsStatus("success")
          } else {
            // Wait for Google Maps to load
            let attempts = 0
            const interval = setInterval(() => {
              attempts++
              if (window.google && window.google.maps) {
                clearInterval(interval)
                setMapsStatus("success")
              } else if (attempts > 10) {
                clearInterval(interval)
                setMapsStatus("error")
              }
            }, 500)
          }
        }
      }
    } catch (error) {
      console.error("Maps test failed:", error)
      setMapsStatus("error")
    }

    setIsLoading(false)
  }

  useEffect(() => {
    testIntegrations()
  }, [])

  return (
    <>
      <Header />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Integration Tests</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-primary" />
                <CardTitle>Supabase Integration</CardTitle>
              </div>
              <CardDescription>Testing connection to Supabase</CardDescription>
            </CardHeader>
            <CardContent>
              {supabaseStatus === "loading" ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Testing Supabase connection...</span>
                </div>
              ) : supabaseStatus === "success" ? (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertTitle>Connection Successful</AlertTitle>
                  <AlertDescription>Successfully connected to Supabase!</AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <AlertTitle>Connection Failed</AlertTitle>
                  <AlertDescription>Failed to connect to Supabase.</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/supabase-test" className="w-full">
                <Button variant="outline" className="w-full">
                  View Detailed Test
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Map className="h-5 w-5 mr-2 text-primary" />
                <CardTitle>Google Maps Integration</CardTitle>
              </div>
              <CardDescription>Testing Google Maps API</CardDescription>
            </CardHeader>
            <CardContent>
              {mapsStatus === "loading" ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Testing Google Maps API...</span>
                </div>
              ) : mapsStatus === "success" ? (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertTitle>Integration Successful</AlertTitle>
                  <AlertDescription>Google Maps API loaded successfully!</AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <AlertTitle>Integration Failed</AlertTitle>
                  <AlertDescription>Failed to load Google Maps API.</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Link href="/maps-test" className="w-full">
                <Button variant="outline" className="w-full">
                  View Detailed Test
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>Overall status of all integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                  <span>Supabase Database</span>
                </div>
                {supabaseStatus === "loading" ? (
                  <LoadingSpinner size="sm" />
                ) : supabaseStatus === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center">
                  <Map className="h-5 w-5 mr-2 text-primary" />
                  <span>Google Maps API</span>
                </div>
                {mapsStatus === "loading" ? (
                  <LoadingSpinner size="sm" />
                ) : mapsStatus === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={testIntegrations} disabled={isLoading} className="flex items-center">
              {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Test All Integrations
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

