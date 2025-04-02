import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrigoLoadingSpinner } from "@/components/ui/trigo-loading-spinner"
import { LoadingInline } from "@/components/ui/loading-inline"
import Link from "next/link"
import { Header } from "@/components/layout/header"

export default function LoadingDemoPage() {
  return (
    <>
      <Header />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Loading Components</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>TrigoLoadingSpinner</CardTitle>
              <CardDescription>The base loading spinner component with the Trigo logo</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="grid grid-cols-4 gap-4 w-full">
                <div className="flex flex-col items-center">
                  <p className="text-sm mb-2">Small</p>
                  <TrigoLoadingSpinner size="sm" />
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm mb-2">Medium</p>
                  <TrigoLoadingSpinner size="md" />
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm mb-2">Large</p>
                  <TrigoLoadingSpinner size="lg" />
                </div>
                <div className="flex flex-col items-center">
                  <p className="text-sm mb-2">XL</p>
                  <TrigoLoadingSpinner size="xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>LoadingInline</CardTitle>
              <CardDescription>Inline loading component for buttons and small spaces</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-6">
              <div className="flex items-center space-x-4">
                <Button disabled className="w-36">
                  <LoadingInline size="sm" className="mr-2" />
                  Loading...
                </Button>
                <Button disabled variant="outline" className="w-36">
                  <LoadingInline size="sm" className="mr-2" />
                  Submitting
                </Button>
              </div>
              <div className="p-4 border rounded-md flex items-center justify-center">
                <LoadingInline size="md" />
                <span className="ml-3">Loading content...</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Full Page & Overlay Loading</CardTitle>
              <CardDescription>Loading components that cover the entire page or create an overlay</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-md h-64 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/images/trigologo1.png" alt="Trigo Logo" className="h-16 w-auto mb-4" />
                  </div>
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex flex-col items-center justify-center">
                    <TrigoLoadingSpinner size="md" />
                    <p className="mt-4 text-sm">Loading Overlay Preview</p>
                  </div>
                </div>
                <div className="border rounded-md h-64 flex flex-col items-center justify-center">
                  <TrigoLoadingSpinner size="lg" />
                  <p className="mt-4 text-sm">Full Page Loading Preview</p>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <Link href="/loading-demo/overlay">
                  <Button>View Overlay Example</Button>
                </Link>
                <Link href="/loading-demo/fullpage">
                  <Button variant="outline">View Full Page Example</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

