import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Locate } from "lucide-react"
import { toast } from "sonner"

interface LocationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  locationType: "home" | "work" | "favorite"
  onSave: (location: {
    name: string
    address: string
    lat: number
    lng: number
  }) => Promise<void>
}

export function LocationFormDialog({
  open,
  onOpenChange,
  locationType,
  onSave
}: LocationFormDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [address, setAddress] = useState("")
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      return
    }

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCoordinates({ lat: latitude, lng: longitude })
        
        // Attempt to get address from coordinates using reverse geocoding
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
          )
          const data = await response.json()
          if (data.features?.[0]?.place_name) {
            setAddress(data.features[0].place_name)
          }
        } catch (error) {
          console.error("Error fetching address:", error)
        }
        
        setIsLoading(false)
      },
      (error) => {
        setIsLoading(false)
        toast.error("Error getting location: " + error.message)
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!coordinates || !address) {
      toast.error("Please provide both location and address")
      return
    }

    setIsLoading(true)
    try {
      await onSave({
        name: name || getDefaultName(),
        address,
        lat: coordinates.lat,
        lng: coordinates.lng
      })
      onOpenChange(false)
      resetForm()
    } catch (error) {
      toast.error("Failed to save location")
    } finally {
      setIsLoading(false)
    }
  }

  const getDefaultName = () => {
    switch (locationType) {
      case "home":
        return "Home"
      case "work":
        return "Work"
      default:
        return "Favorite Location"
    }
  }

  const resetForm = () => {
    setName("")
    setAddress("")
    setCoordinates(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {locationType === "favorite" ? "Favorite" : `${locationType.charAt(0).toUpperCase() + locationType.slice(1)}`} Location</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {locationType === "favorite" && (
            <div className="space-y-2">
              <Label htmlFor="name">Location Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter a name for this location"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="flex gap-2">
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGetCurrentLocation}
                disabled={isLoading}
              >
                <Locate className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {coordinates && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </span>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !coordinates || !address}>
              {isLoading ? "Saving..." : "Save Location"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}