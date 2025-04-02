import { RoleNavigation } from "@/components/navigation/role-navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { Header } from "@/components/layout/header"

export default function DashboardPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto py-6">
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Welcome to Trigo</AlertTitle>
          <AlertDescription>Please select your role to continue to the appropriate dashboard.</AlertDescription>
        </Alert>

        <h1 className="text-3xl font-bold mb-6">Select Your Role</h1>
        <RoleNavigation />
      </div>
    </>
  )
}

