'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Home, Star, MapPin } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { LocationPicker } from '@/components/trigoui/location-picker'

interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  type: 'home' | 'favorite' | 'custom'
}

export function SavedLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [locationType, setLocationType] = useState<Location['type']>('home')

  const handleAddLocation = async (latitude: number, longitude: number) => {
    const newLocation: Location = {
      id: Date.now().toString(),
      name: locationType === 'custom' ? 'Custom Pinned Location' : `${locationType.charAt(0).toUpperCase() + locationType.slice(1)} Location`,
      latitude,
      longitude,
      type: locationType
    }

    setLocations([...locations, newLocation])
    setIsAddingLocation(false)

    // Here you would typically make an API call to save the location
    try {
      // await saveLocation(newLocation)
      // toast.success('Location saved successfully')
    } catch (error) {
      console.error('Failed to save location:', error)
      // toast.error('Failed to save location')
    }
  }

  const openLocationPicker = (type: Location['type']) => {
    setLocationType(type)
    setIsAddingLocation(true)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Saved Locations</h2>
      <p className="text-sm text-muted-foreground">Manage your frequently used locations</p>

      <div className="space-y-4">
        {/* Home Location */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <h3 className="font-medium">Home Location</h3>
          </div>
          {!locations.find(loc => loc.type === 'home') ? (
            <Dialog open={isAddingLocation && locationType === 'home'} onOpenChange={(open) => !open && setIsAddingLocation(false)}>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => openLocationPicker('home')}>
                  Add Home Location
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Set Home Location</DialogTitle>
                </DialogHeader>
                <LocationPicker onLocationSelect={handleAddLocation} />
              </DialogContent>
            </Dialog>
          ) : (
            <div className="p-3 bg-secondary rounded-md">
              {/* Display saved home location */}
            </div>
          )}
        </div>

        {/* Favorite Locations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <h3 className="font-medium">Favorite Locations</h3>
            </div>
            <Dialog open={isAddingLocation && locationType === 'favorite'} onOpenChange={(open) => !open && setIsAddingLocation(false)}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" onClick={() => openLocationPicker('favorite')}>
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add Favorite Location</DialogTitle>
                </DialogHeader>
                <LocationPicker onLocationSelect={handleAddLocation} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-2">
            {locations
              .filter(loc => loc.type === 'favorite')
              .map(location => (
                <div key={location.id} className="p-3 bg-secondary rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{location.name}</span>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
