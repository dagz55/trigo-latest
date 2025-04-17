"use client"

import 'mapbox-gl/dist/mapbox-gl.css'
import { Map, Marker, NavigationControl } from 'react-map-gl'
import Image from 'next/image'
import { useEffect, useRef } from 'react'

// Define types
interface MapboxMapProps {
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  markers?: Array<{
    lat: number
    lng: number
    type: 'pickup' | 'dropoff' | 'terminal'
    title?: string
  }>
  routeGeojson?: any
  onClick?: (event: { lngLat: { lat: number; lng: number } }) => void
  onMove?: (event: { viewState: { latitude: number; longitude: number; zoom: number } }) => void
  style?: React.CSSProperties
}

export default function MapboxMap({
  center,
  zoom = 15,
  height = '100%',
  markers = [],
  routeGeojson,
  onClick,
  onMove,
  style
}: MapboxMapProps) {
  const mapRef = useRef<any>(null)

  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && !process.env.NEXT_PUBLIC_MAPBOX_API_KEY) {
    console.error('Mapbox token is missing')
    return <div>Map configuration error</div>
  }

  // Use either NEXT_PUBLIC_MAPBOX_TOKEN or NEXT_PUBLIC_MAPBOX_API_KEY
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_API_KEY

  // Update map view when center prop changes
  useEffect(() => {
    if (mapRef.current && center) {
      console.log('Updating map center to:', center);
      mapRef.current.flyTo({
        center: [center.lng, center.lat],
        zoom: zoom,
        duration: 1000 // Animation duration in milliseconds
      });
    }
  }, [center, zoom]);

  return (
    <div className="w-full relative" style={{ height, ...style }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: center?.lng || 120.9826, // Default to Las Piñas coordinates
          latitude: center?.lat || 14.4507,
          zoom: zoom
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onClick={onClick}
        onMove={onMove}
      >
        <NavigationControl position="top-right" />

        {markers.map((marker, index) => (
          <Marker
            key={index}
            longitude={marker.lng}
            latitude={marker.lat}
            anchor="bottom"
          >
            <div className="w-8 h-8 relative">
              <Image
                src={
                  marker.type === 'pickup' ? '/pickup-pin.svg' :
                  marker.type === 'dropoff' ? '/dropoff-pin.svg' :
                  '/terminal-pin.svg'
                }
                alt={
                  marker.type === 'pickup' ? 'Pickup location' :
                  marker.type === 'dropoff' ? 'Drop-off location' :
                  'Terminal location'
                }
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  )
}
