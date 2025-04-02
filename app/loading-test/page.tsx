"use client"

import { useState, useEffect } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { LoadingPage } from "@/components/ui/loading-page"
import { Button } from "@/components/ui/button"
import { LoadingOverlay } from "@/components/ui/loading-overlay"

export default function LoadingTestPage() {
  const [showFullPage, setShowFullPage] = useState(true)
  const [showOverlay, setShowOverlay] = useState(false)

  // Auto-hide the full page loader after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFullPage(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (showFullPage) {
    return <LoadingPage message="Loading TriGo..." />
  }

  const handleShowOverlay = () => {
    setShowOverlay(true)
    setTimeout(() => setShowOverlay(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {showOverlay && <LoadingOverlay message="Processing your request..." />}

      <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6">Neon Loading Spinner Test</h1>

        <div className="space-y-8">
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-300">Large Spinner</p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <LoadingSpinner size="sm" />
              <p className="mt-2 text-xs text-gray-400">Small</p>
            </div>
            <div className="flex flex-col items-center">
              <LoadingSpinner size="md" />
              <p className="mt-2 text-xs text-gray-400">Medium</p>
            </div>
            <div className="flex flex-col items-center">
              <LoadingSpinner size="lg" />
              <p className="mt-2 text-xs text-gray-400">Large</p>
            </div>
            <div className="flex flex-col items-center">
              <LoadingSpinner size="xl" />
              <p className="mt-2 text-xs text-gray-400">XL</p>
            </div>
          </div>

          <Button onClick={handleShowOverlay} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Show Overlay for 3 Seconds
          </Button>

          <Button onClick={() => setShowFullPage(true)} className="w-full bg-purple-800 hover:bg-purple-900 text-white">
            Show Full Page Loader
          </Button>
        </div>
      </div>
    </div>
  )
}

