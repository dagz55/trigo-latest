import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export function ServiceUnavailable({ service = "service", returnPath = "/" }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Service Unavailable</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 bg-yellow-50 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-medium text-yellow-800">{service} Error</h3>
            <p className="text-yellow-700 mt-1">
              We're experiencing issues with our {service.toLowerCase()}. Please try again later or contact support if
              the problem persists.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href={returnPath}>
          <Button variant="outline">Return to Home</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

