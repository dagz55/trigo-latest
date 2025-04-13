"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLocationsByCity, type Location } from "@/lib/supabase-client"
import { Briefcase, Heart, Home, MapPin, Star } from "lucide-react"
import { useEffect, useState } from "react"

interface SavedLocationsProps {
  onSelect: (location: Location) => void
}

export function SavedLocations({ onSelect }: SavedLocationsProps) {
  const [savedLocations, setSavedLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true); // Ensure loading state is set at the beginning
      try {
        const locationsResult = await getLocationsByCity('las_pinas_city');

        // Check if the result indicates an error (e.g., not an array, or has error property)
        // This handles the case where the function might return an error object directly
        if (!Array.isArray(locationsResult)) {
          // Handle cases where the result is not the expected array (likely an error)
          console.error("Error fetching saved locations or invalid data format:", locationsResult);
          setSavedLocations([]);
        } else {
          // Proceed assuming locationsResult is Location[]
          // Use type assertion via unknown to satisfy TypeScript here
          const locations = locationsResult as unknown as Location[];
          // Filter using the correct DB enum value
          const filteredLocations = locations.filter((loc: Location) => 
            loc.type === 'custom' && 
            loc.barangay === 'Talon Kuatro'
          ).slice(0, 8); // Limit to 8 locations for better display
          setSavedLocations(filteredLocations);
        }
      } catch (error: any) { // Catch any unexpected errors during the async operation
        console.error("Unexpected error in fetchLocations:", error);
        // Log specific properties if available
        if (error && typeof error === 'object') {
          console.error("Error details:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });
        }
        setSavedLocations([]); // Ensure state is cleared on unexpected errors
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const getLocationIcon = (name: string) => {
    const lowerName = name.toLowerCase()
    if (lowerName.includes('home') || lowerName.includes('house')) {
      return <Home className="h-4 w-4 text-green-500" />
    } else if (lowerName.includes('work') || lowerName.includes('office')) {
      return <Briefcase className="h-4 w-4 text-blue-500" />
    } else if (lowerName.includes('favorite') || lowerName.includes('heart')) {
      return <Heart className="h-4 w-4 text-red-500" />
    } else if (lowerName.includes('star') || lowerName.includes('special')) {
      return <Star className="h-4 w-4 text-yellow-500" />
    }
    return <MapPin className="h-4 w-4 text-primary" />
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Saved Locations</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {loading ? (
          <div className="col-span-2 flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : savedLocations.length > 0 ? (
          savedLocations.map((location) => (
            <div
              key={location.id}
              className="flex items-start space-x-2 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
              onClick={() => onSelect(location)}
            >
              {getLocationIcon(location.name)}
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{location.name}</p>
                <p className="text-xs text-muted-foreground truncate">{location.address}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-4 text-sm text-muted-foreground">
            No saved locations found
          </div>
        )}
      </CardContent>
    </Card>
  )
}
