"use client"

import { Wrapper } from '@googlemaps/react-wrapper'
import { useEffect, useRef, useState } from 'react'

interface Marker {
  lat: number
  lng: number
  title?: string
  type?: 'pickup' | 'dropoff' | 'terminal'
}

interface GoogleMapProps {
  center?: { lat: number; lng: number }
  markers?: Marker[]
  zoom?: number
  height?: string
  onMarkerClick?: (marker: Marker) => void
  onMapLoad?: (map: google.maps.Map) => void
  onBoundsChanged?: (bounds: google.maps.LatLngBounds) => void
}

function MapComponent({
  center = { lat: 14.4507, lng: 120.9826 }, // Default to Talon Kuatro center
  markers = [],
  zoom = 15,
  height = '400px',
  onMarkerClick,
  onMapLoad,
  onBoundsChanged
}: GoogleMapProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [mapMarkers, setMapMarkers] = useState<google.maps.Marker[]>([])
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Validate coordinates
  const validateCoordinates = (coords: { lat: number; lng: number }) => {
    const validLat = typeof coords.lat === 'number' && !isNaN(coords.lat) && coords.lat >= -90 && coords.lat <= 90
    const validLng = typeof coords.lng === 'number' && !isNaN(coords.lng) && coords.lng >= -180 && coords.lng <= 180
    return validLat && validLng ? coords : { lat: 14.4507, lng: 120.9826 } // Default to Talon Kuatro if invalid
  }

  // Initialize map
  useEffect(() => {
    if (ref.current && !map) {
      try {
        const validCenter = validateCoordinates(center)
        const newMap = new window.google.maps.Map(ref.current, {
          center: validCenter,
          zoom,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false
        })

        // Add bounds changed listener
        if (onBoundsChanged) {
          newMap.addListener('bounds_changed', () => {
            const bounds = newMap.getBounds()
            if (bounds) {
              onBoundsChanged(bounds)
            }
          })
        }

        setMap(newMap)
        setInfoWindow(new google.maps.InfoWindow())
        setIsLoading(false)

        if (onMapLoad) {
          onMapLoad(newMap)
        }
      } catch (err) {
        console.error('Error initializing map:', err)
        setError('Failed to initialize map')
        setIsLoading(false)
      }
    }
  }, [ref, map, center, zoom, onMapLoad, onBoundsChanged])

  // Update map center when center prop changes
  useEffect(() => {
    if (map) {
      try {
        const validCenter = validateCoordinates(center)
        map.setCenter(validCenter)
      } catch (err) {
        console.error('Error updating map center:', err)
      }
    }
  }, [map, center])

  // Update markers
  useEffect(() => {
    if (map && markers) {
      try {
        // Clear existing markers
        mapMarkers.forEach(marker => marker.setMap(null))
        setMapMarkers([])

        // Create new markers
        const newMarkers = markers.map(marker => {
          const validPosition = validateCoordinates({ lat: marker.lat, lng: marker.lng })
          
          // Define marker icons
          const icons = {
            pickup: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#22c55e',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              scale: 8
            },
            dropoff: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#ef4444',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              scale: 8
            },
            terminal: {
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: '#3b82f6',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              scale: 8
            }
          }

          const newMarker = new google.maps.Marker({
            position: validPosition,
            map,
            title: marker.title,
            icon: marker.type ? icons[marker.type] : undefined,
            animation: google.maps.Animation.DROP
          })

          if (marker.title && infoWindow) {
            newMarker.addListener('click', () => {
              if (onMarkerClick) {
                onMarkerClick(marker)
              }
              infoWindow.setContent(
                `<div class="p-2">
                  <p class="font-medium">${marker.title}</p>
                  <p class="text-sm text-gray-600">
                    ${marker.type ? marker.type.charAt(0).toUpperCase() + marker.type.slice(1) : 'Location'}
                  </p>
                </div>`
              )
              infoWindow.open(map, newMarker)
            })
          }

          return newMarker
        })

        setMapMarkers(newMarkers)

        // Fit bounds if multiple markers
        if (newMarkers.length > 1) {
          const bounds = new google.maps.LatLngBounds()
          newMarkers.forEach(marker => {
            if (marker.getPosition()) {
              bounds.extend(marker.getPosition()!)
            }
          })
          map.fitBounds(bounds)
          
          // Don't zoom in too far
          const maxZoom = Math.min(map.getZoom() || zoom, zoom)
          map.setZoom(maxZoom)
        }
      } catch (err) {
        console.error('Error updating markers:', err)
      }
    }
  }, [map, markers, infoWindow, onMarkerClick, zoom])

  if (error) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-lg">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <div ref={ref} style={{ width: '100%', height }} />
}

export function GoogleMap(props: GoogleMapProps) {
  return (
    <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={['places']}>
      <MapComponent {...props} />
    </Wrapper>
  )
}

