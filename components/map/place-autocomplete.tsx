"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { MapPin } from "lucide-react"
import { useRef, useState } from "react"

interface PlaceAutocompleteProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onPlaceSelect?: (place: {
    address: string
    location: { lat: number; lng: number } | null
    placeId?: string
  }) => void
}

export function PlaceAutocomplete({ className, onPlaceSelect, ...props }: PlaceAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Demo mode suggestions
  const [demoSuggestions, setDemoSuggestions] = useState<string[]>([])
  const [showDemoSuggestions, setShowDemoSuggestions] = useState(false)
  const [inputValue, setInputValue] = useState("")

  const demoPlaces = [
    "FnF HQ",
    "Ophir",
    "Vape Shop",
    "Sari-sari store",
    "Public School",
    "Refilling Station",
    "Apartment for rent",
    "House for sale",
    "Basketball court",
  ]

  // Nearby locations
  const nearbyLocations = [
    "Terminal (0.3 km)",
    "Exit point A (0.5 km)",
    "Exit point B (0.7 km)",
    "Exit point C (0.9 km)",
    "Exit point D (1.1 km)",
  ]

  // Demo mode functionality
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value.length > 2) {
      // First show nearby locations if the input matches
      const nearbyMatches = nearbyLocations.filter((place) => place.toLowerCase().includes(value.toLowerCase()))

      // Then add other locations
      const otherMatches = demoPlaces.filter((place) => place.toLowerCase().includes(value.toLowerCase()))

      // Combine with nearby locations first
      const allMatches = [
        ...nearbyMatches,
        ...otherMatches.filter((place) => !nearbyMatches.some((nearby) => nearby.includes(place.split(",")[0]))),
      ]

      setDemoSuggestions(allMatches)
      setShowDemoSuggestions(allMatches.length > 0)
    } else {
      setShowDemoSuggestions(false)
    }
  }

  const handleDemoSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    setShowDemoSuggestions(false)

    // Simulate selecting a place
    if (onPlaceSelect) {
      // Generate a random location near Manila
      const baseLat = 14.5995
      const baseLng = 120.9842
      const randomLat = baseLat + (Math.random() - 0.5) * 0.1
      const randomLng = baseLng + (Math.random() - 0.5) * 0.1

      onPlaceSelect({
        address: suggestion,
        location: {
          lat: randomLat,
          lng: randomLng,
        },
        placeId: `demo-${Date.now()}`,
      })
    }
  }

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        className={cn("pr-10", className)}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Search or select a nearby location"
        {...props}
      />

      {/* Show nearby locations when input is empty and focused */}
      {inputValue === "" && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg">
          <div className="px-4 py-2 border-b border-input">
            <p className="text-sm font-medium text-muted-foreground">Nearby Locations</p>
          </div>
          <ul className="py-1">
            {nearbyLocations.map((location, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-muted cursor-pointer flex items-center"
                onClick={() => handleDemoSuggestionClick(location)}
              >
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span>{location}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Demo suggestions dropdown */}
      {showDemoSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg">
          <ul className="py-1">
            {demoSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-muted cursor-pointer"
                onClick={() => handleDemoSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

