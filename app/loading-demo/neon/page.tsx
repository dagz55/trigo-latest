"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { NeonLoadingSpinner } from "@/components/ui/neon-loading-spinner"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { LoadingPage } from "@/components/ui/loading-page"
import Link from "next/link"

export default function NeonLoadingDemoPage() {
  const [showOverlay, setShowOverlay] = useState(false)
  const [showPage, setShowPage] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const triggerOverlay = () => {
    setShowOverlay(true)
    setTimeout(() => setShowOverlay(false), 3000)
  }

  const triggerPage = () => {
    setShowPage(true)
    setTimeout(() => setShowPage(false), 3000)
  }

  // Fix: Use the correct function name and ensure toggle logic is correct
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      // This correctly toggles the class on the root <html> element
      document.documentElement.classList.toggle("dark", newMode);
      return newMode;
    });
  }

  if (showPage) {
    return (
      // Remove the explicit "dark" class here.
      // Tailwind's dark: variants will work based on the <html> tag's class.
      <div className="min-h-screen dark:bg-gray-900">
        <LoadingPage message="Loading TriGo...">
          <NeonLoadingSpinner size="xl" />
        </LoadingPage>
      </div>
    );
  }

  return (
    // Remove the outer div that only added the "dark" class
    <div className="dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {showOverlay && (
        <LoadingOverlay message="Processing your request...">
          <NeonLoadingSpinner size="lg" />
        </LoadingOverlay>
      )}

      <div className="container mx-auto py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">TriGo Neon Loading Components</h1>
          <div className="flex gap-4">
            {/* Ensure onClick uses the correct function */}
            <Button variant="outline" onClick={toggleDarkMode} className="dark:text-white dark:border-gray-700">
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Button>
            <Link href="/loading-demo">
              <Button variant="outline" className="dark:text-white dark:border-gray-700">
                Standard Spinners
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Neon Loading Spinner</CardTitle>
              <CardDescription className="dark:text-gray-400">
                The new neon triangle loading spinner with TriGo logo
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <NeonLoadingSpinner size="lg" />
            </CardContent>
            <CardFooter>
              <div className="grid grid-cols-4 gap-2 w-full">
                <NeonLoadingSpinner size="sm" />
                <NeonLoadingSpinner size="md" />
                <NeonLoadingSpinner size="lg" />
                <NeonLoadingSpinner size="xl" />
              </div>
            </CardFooter>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Original Loading Spinner</CardTitle>
              <CardDescription className="dark:text-gray-400">
                The standard loading spinner for comparison
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <LoadingSpinner size="lg" />
            </CardContent>
            <CardFooter>
              <div className="grid grid-cols-4 gap-2 w-full">
                <LoadingSpinner size="sm" />
                <LoadingSpinner size="md" />
                <LoadingSpinner size="lg" />
                <LoadingSpinner size="xl" />
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Loading Overlay</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Full-screen overlay with neon loading spinner
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Button onClick={triggerOverlay} className="dark:bg-purple-700 dark:hover:bg-purple-600">
                Show Overlay for 3 seconds
              </Button>
            </CardContent>
            <CardFooter className="dark:text-gray-400">
              <p className="text-sm text-muted-foreground">
                The overlay will appear on top of the current page with a semi-transparent background
              </p>
            </CardFooter>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">Loading Page</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Full-page loading screen with neon effect
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <Button onClick={triggerPage} className="dark:bg-purple-700 dark:hover:bg-purple-600">
                Show Loading Page for 3 seconds
              </Button>
            </CardContent>
            <CardFooter className="dark:text-gray-400">
              <p className="text-sm text-muted-foreground">
                The loading page will replace the current content completely
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

