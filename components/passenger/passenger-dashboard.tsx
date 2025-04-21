/// <reference types="mapbox-gl" />
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import type { FC } from 'react'
import mapboxgl, { Map, LngLatBounds, AnySourceData, AnyLayer } from 'mapbox-gl'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase-client'

interface Location {
  latitude: number
  longitude: number
}

interface RouteInfoProps {
  distance: number | null
  duration: number | null
}

const RouteInfo: FC<RouteInfoProps> = ({ distance, duration }) => {
  if (!distance || !duration) return null

  return (
    <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
      <div className="text-sm font-medium">
        <div>Distance: {distance.toFixed(1)} km</div>
        <div>Duration: ~{duration} min</div>
      </div>
    </div>
  )
}

const PassengerDashboard: FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Map | null>(null)
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([])
  const [distance, setDistance] = useState<number | null>(null)
  const [duration, setDuration] = useState<number | null>(null)
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null)
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null)

  useEffect(() => {
    // Subscribe to location updates
    const locationSubscription = supabase
      .channel('location-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'locations'
      }, () => {
        // Refresh map data when locations change
        if (pickupLocation && dropoffLocation) {
          void drawRoute(pickupLocation, dropoffLocation)
        }
      })
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR' || err) {
          console.error('Location subscription error:', err)
          toast.error("Real-time Error", { 
            description: "Could not subscribe to location updates." 
          })
        }
      })

    return () => {
      supabase.removeChannel(locationSubscription)
    }
  }, [pickupLocation, dropoffLocation])

  const drawRoute = useCallback(async (pickup: Location, dropoff: Location) => {
    const map = mapRef.current
    if (!map) return

    // Type-safe layer and source operations
    const routeLayer = map.getLayer('route')
    if (routeLayer) {
      map.removeLayer('route')
    }
    
    const routeSource = map.getSource('route')
    if (routeSource) {
      map.removeSource('route')
    }

    try {
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
      if (!mapboxToken) {
        throw new Error('Mapbox token is not configured')
      }

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.longitude},${pickup.latitude};${dropoff.longitude},${dropoff.latitude}?geometries=geojson&access_token=${mapboxToken}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch route')
      }

      const data = await response.json()

      if (!data.routes?.[0]) {
        throw new Error('No route found')
      }

      const route = data.routes[0]
      setRouteCoordinates(route.geometry.coordinates)
      setDistance(route.distance / 1000) // Convert to km
      setDuration(Math.round(route.duration / 60)) // Convert to minutes

      // Type-safe source addition
      const sourceData: AnySourceData = {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route.geometry
        }
      }
      map.addSource('route', sourceData)

      // Type-safe layer addition
      const layerData: AnyLayer = {
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#4A3AFF',
          'line-width': 4,
          'line-opacity': 0.75
        }
      }
      map.addLayer(layerData)

      // Type-safe bounds operations
      const bounds = new LngLatBounds()
      route.geometry.coordinates.forEach((coord: [number, number]) => {
        bounds.extend(coord)
      })
      map.fitBounds(bounds, { padding: 50 })
    } catch (error) {
      console.error('Error fetching route:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to load route')
    }
  }, [])

  useEffect(() => {
    if (!pickupLocation || !dropoffLocation) return
    void drawRoute(pickupLocation, dropoffLocation)
  }, [pickupLocation, dropoffLocation, drawRoute])

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return

    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!mapboxToken) {
      toast.error('Mapbox token is not configured')
      return
    }

    ;(mapboxgl as any).accessToken = mapboxToken

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [120.9939, 14.4444], // Las Piñas coordinates
      zoom: 14
    })
    
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full" />
      <RouteInfo distance={distance} duration={duration} />
    </div>
  )
}

export default PassengerDashboard
