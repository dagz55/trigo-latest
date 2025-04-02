import { RoleNavigation } from "@/components/navigation/role-navigation"
import { Header } from "@/components/layout/header"

export default function RolesPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-muted/30 py-12">
        <div className="container">
          <h1 className="text-3xl font-bold text-center mb-8">Welcome to Trigo</h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Select your role to access the appropriate dashboard and features for your needs.
          </p>
          <RoleNavigation />
        </div>
      </div>
    </>
  )
}

