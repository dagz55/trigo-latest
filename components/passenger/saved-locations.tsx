import { useState } from 'react'
import { useUser } from '@/contexts/user-context'
import { Button } from '@/components/ui/button'
import { LocationDisplay } from '@/components/location-display'
import { toast } from 'sonner'
import type { Location } from '@/types'

export function SavedLocations() {
  const { user, updateUserProfile } = useUser()
  const [showLocationPicker, setShowLocationPicker] = useState<'home' | 'terminal' | null>(null)

  const handleAddHomeLocation = async (location: Location) => {
    try {
      await updateUserProfile({
        homeLocation: {
          address: location.address,
          lat: location.lat,
          lng: location.lng,
          isDefault: true
        }
      })
      toast.success("Home location saved successfully")
    } catch (error) {
      toast.error("Failed to save home location")
    }
  }

  const handleAddTerminalExit = async (location: Location) => {
    try {
      await updateUserProfile({
        terminalExit: {
          address: location.address,
          lat: location.lat,
          lng: location.lng,
          isDefault: true
        }
      })
      toast.success("Terminal exit saved successfully")
    } catch (error) {
      toast.error("Failed to save terminal exit")
    }
  }

  return (
    <div className="space-y-4">
      <section>
        <h3 className="text-lg font-medium">Home Location</h3>
        {user?.homeLocation ? (
          <LocationDisplay location={user.homeLocation} />
        ) : (
          <Button 
            variant="outline" 
            onClick={() => setShowLocationPicker('home')}
          >
            Add Home Location
          </Button>
        )}
      </section>

      <section>
        <h3 className="text-lg font-medium">Terminal Exit</h3>
        {user?.terminalExit ? (
          <LocationDisplay location={user.terminalExit} />
        ) : (
          <Button 
            variant="outline" 
            onClick={() => setShowLocationPicker('terminal')}
          >
            Add Terminal Exit
          </Button>
        )}
      </section>

      {/* Add LocationPicker modal/component here */}
    </div>
  )
}
