"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLocationsByCity, type Location } from "@/lib/supabase-client"
import { MapPin } from "lucide-react"
import { useEffect, useState } from "react"

interface TerminalExitsProps {
  onSelect: (location: Location) => void
  terminals?: Location[]
  currentSelection?: Location | null
}

export function TerminalExits({ onSelect, terminals: externalTerminals, currentSelection }: TerminalExitsProps) {
  const [terminalExits, setTerminalExits] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If terminals are provided externally, use them
    if (externalTerminals && externalTerminals.length > 0) {
      setTerminalExits(externalTerminals);
      setLoading(false);
      return;
    }

    const fetchTerminalExits = async () => {
      try {
        const locations = await getLocationsByCity('Las Piñas City')
        const terminals = locations.filter(loc => 
          loc.type === 'terminal' && 
          loc.barangay === 'Talon Kuatro'
        )
        setTerminalExits(terminals)
      } catch (error) {
        console.error("Error fetching terminal exits:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTerminalExits()
  }, [externalTerminals])

  // Calculate distance from a fixed reference point in Talon 4
  const calculateDistance = (lat: number, lng: number) => {
    const referencePoint = {
      lat: 14.4507, // Talon 4 center
      lng: 120.9826
    }

    const R = 6371e3 // Earth's radius in meters
    const φ1 = (referencePoint.lat * Math.PI) / 180
    const φ2 = (lat * Math.PI) / 180
    const Δφ = ((lat - referencePoint.lat) * Math.PI) / 180
    const Δλ = ((lng - referencePoint.lng) * Math.PI) / 180

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distance = R * c
    return (distance / 1000).toFixed(1) // Convert to kilometers
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Terminal Exits</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {loading ? (
          <div className="col-span-2 flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : terminalExits.length > 0 ? (
          terminalExits.map((terminal) => (
            <div
              key={terminal.id}
              className={`flex items-start space-x-2 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors ${
                currentSelection?.id === terminal.id ? 'bg-accent/50' : ''
              }`}
              onClick={() => onSelect(terminal)}
            >
              <MapPin className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{terminal.name}</p>
                <p className="text-xs text-muted-foreground truncate">{terminal.address}</p>
                <p className="text-xs text-blue-500">
                  {calculateDistance(terminal.latitude, terminal.longitude)} km away
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-4 text-sm text-muted-foreground">
            No terminal exits found
          </div>
        )}
      </CardContent>
    </Card>
  )
}

