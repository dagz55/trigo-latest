"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { useState } from "react"
import { Header } from "@/components/layout/header"
import Link from "next/link"

export default function OverlayLoadingDemo() {
  const [isLoading, setIsLoading] = useState(false)

  const handleShowLoading = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  return (
    <>
      {isLoading && <LoadingOverlay message="Processing your request..." />}
      <Header />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Loading Overlay Demo</h1>
          <Link href="/loading-demo">
            <Button variant="outline">Back to Demo</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Test Loading Overlay</CardTitle>
            <CardDescription>Click the button below to show a loading overlay for 3 seconds</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleShowLoading} disabled={isLoading}>
              {isLoading ? "Loading..." : "Show Loading Overlay"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

