import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, MapPin, Star } from "lucide-react"
import { LocationFormDialog } from "./location-form-dialog"
import { useUser } from "@/contexts/user-context"
import { toast } from "sonner"
import type { UserLocation } from "@/contexts/user-context"

type DialogType = "home" | "work" | "favorite" | null

export function SavedLocations() {
  const { user, updateUserProfile } = useUser()
  const [activeDialog, setActiveDialog] = useState<DialogType>(null)

  const handleSaveLocation = async (location: {
    name: string
    address: string
    lat: number
    lng: number
  }): Promise<void> => {
    try {
      switch (activeDialog) {
        case "home":
          await updateUserProfile({
            homeLocation: {
              address: location.address,
              lat: location.lat,
              lng: location.lng,
              isDefault: true
            }
          })
          toast.success("Home location saved successfully")
          break

        case "work":
          await updateUserProfile({
            terminalExit: {
              address: location.address,
              lat: location.lat,
              lng: location.lng,
              isDefault: true
            }
          })
          toast.success("Work location saved successfully")
          break

        case "favorite": {
          const favoriteLocations = user?.favoriteLocations ?? []
          const newFavoriteLocation: UserLocation = {
            address: location.address,
            lat: location.lat,
            lng: location.lng,
            isDefault: false
          }
          await updateUserProfile({
            favoriteLocations: [...favoriteLocations, newFavoriteLocation]
          })
          toast.success("Favorite location saved successfully")
          break
        }
      }
    } catch (error) {
      console.error("Error saving location:", error)
      throw error
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Home className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Home Location</h3>
        </div>
        {user?.homeLocation ? (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">{user.homeLocation.address}</p>
            <p className="text-xs text-muted-foreground">
              {user.homeLocation.lat.toFixed(6)}, {user.homeLocation.lng.toFixed(6)}
            </p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-4">No home location set</p>
            <Button 
              variant="outline" 
              onClick={() => setActiveDialog("home")}
            >
              Add Home Location
            </Button>
          </>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Work Location</h3>
        </div>
        {user?.terminalExit ? (
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">{user.terminalExit.address}</p>
            <p className="text-xs text-muted-foreground">
              {user.terminalExit.lat.toFixed(6)}, {user.terminalExit.lng.toFixed(6)}
            </p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-4">No work location set</p>
            <Button 
              variant="outline" 
              onClick={() => setActiveDialog("work")}
            >
              Add Work Location
            </Button>
          </>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Favorite Locations</h3>
          </div>
          <Button 
            variant="outline"
            onClick={() => setActiveDialog("favorite")}
          >
            Add New
          </Button>
        </div>
        {user?.favoriteLocations?.length ? (
          <div className="space-y-2">
            {user.favoriteLocations.map((location, index) => (
              <div key={index} className="bg-muted p-4 rounded-lg">
                <p className="text-sm">{location.address}</p>
                <p className="text-xs text-muted-foreground">
                  {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground">No favorite locations saved</p>
            <p className="text-sm text-muted-foreground">
              Add locations you visit frequently for quick access
            </p>
          </div>
        )}
      </div>

      <LocationFormDialog
        open={activeDialog !== null}
        onOpenChange={(open) => !open && setActiveDialog(null)}
        locationType={activeDialog ?? "home"}
        onSave={handleSaveLocation}
      />
    </div>
  )
}
