import { MapPin } from 'lucide-react'
import type { Location } from '@/types'

interface LocationDisplayProps {
  location: {
    address: string;
    lat: number;
    lng: number;
  }
}

export function LocationDisplay({ location }: LocationDisplayProps) {
  return (
    <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
      <MapPin className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
      <div>
        <p className="text-sm">{location.address}</p>
        <p className="text-xs text-muted-foreground">
          {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
        </p>
      </div>
    </div>
  )
}