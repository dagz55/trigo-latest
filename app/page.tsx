import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MapPin, Users, Shield } from "lucide-react"
import { Header } from "@/components/layout/header"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 flex items-center justify-center">
            <span>Welcome to </span>
            <span className="flex items-center ml-3">
              <span className="text-black dark:text-white">Tri</span>
              <span className="text-primary">Go</span>
            </span>
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Your trusted ride-hailing service for tricycle operators and drivers association (TODA)
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="gap-2">
                Sign In <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Book a Ride
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Trigo?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-muted-foreground">
                Book a ride with just a few taps. No account required for passengers.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Drivers</h3>
              <p className="text-muted-foreground">All our drivers are verified members of local TODA associations.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-muted-foreground">
                Track your ride in real-time and share your trip details with loved ones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of riders and passengers using Trigo every day.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/auth?tab=signup">
              <Button size="lg">Sign Up Now</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                Book Without Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-card border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold flex items-center justify-center">
                <span className="text-black dark:text-white">Tri</span>
                <span className="text-primary">Go</span>
              </h2>
              <p className="text-muted-foreground">Your trusted ride-hailing service</p>
            </div>
            <div className="flex gap-6">
              <Link href="/about" className="text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                Contact
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                Terms
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Trigo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

