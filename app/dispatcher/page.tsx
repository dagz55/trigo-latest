import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info, Headset, MapPin, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/layout/header"

export default function DispatcherPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dispatcher Dashboard</h1>
          <Link href="/roles">
            <Button variant="outline">Change Role</Button>
          </Link>
        </div>

        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Dispatcher Mode</AlertTitle>
          <AlertDescription>
            You are now in dispatcher mode. You can assign rides to triders and manage operations.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-6">
                <div className="text-4xl font-bold text-primary">0</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Active Rides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-6">
                <div className="text-4xl font-bold text-primary">0</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Available Triders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-6">
                <div className="text-4xl font-bold text-primary">0</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending Requests</TabsTrigger>
                <TabsTrigger value="active">Active Rides</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              <TabsContent value="pending">
                <div className="text-center py-12 text-muted-foreground">
                  <Headset className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No pending ride requests</p>
                  <p className="text-sm">New ride requests will appear here</p>
                </div>
              </TabsContent>
              <TabsContent value="active">
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No active rides</p>
                  <p className="text-sm">Assigned rides will appear here</p>
                </div>
              </TabsContent>
              <TabsContent value="completed">
                <div className="text-center py-12 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No completed rides today</p>
                  <p className="text-sm">Completed rides will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Available Triders</CardTitle>
                <CardDescription>0 triders currently online</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-sm">No triders available</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

