'use client'

// Remove local Mapbox CSS import
// import 'mapbox-gl/dist/mapbox-gl.css' 
import * as React from 'react'
import Map, { FullscreenControl, GeolocateControl, Marker, NavigationControl, type ViewStateChangeEvent } from 'react-map-gl/mapbox'
import styles from './mapbox-map.module.css'

// Pin component (optional, for custom markers)
const Pin = ({ size = 20, color = 'red' }: { size?: number; color?: string }) => (
  // eslint-disable-next-line react/forbid-dom-props
  <svg 
    height={size} 
    viewBox="0 0 24 24" 
    className={styles.pinSvg} 
    style={{ '--pin-fill-color': color } as React.CSSProperties}
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

interface MapboxMapProps {
  center: { lat: number; lng: number }
  markers?: Array<{ lat: number; lng: number; title?: string; type?: string }>
  zoom?: number
  height?: string
  style?: React.CSSProperties
}

export function MapboxMap({ center, markers = [], zoom = 15, height = '400px', style }: MapboxMapProps) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY

  if (!mapboxToken) {
    console.error("Mapbox API key is missing!")
    return (
      <div className={styles.errorContainer} style={{ height }}>
        Mapbox API key is missing.
      </div>
    )
  }

  const [viewState, setViewState] = React.useState({
    longitude: center.lng,
    latitude: center.lat,
    zoom: zoom,
  })

  // Update viewState when center prop changes
  React.useEffect(() => {
    setViewState(prev => ({
      ...prev,
      longitude: center.lng,
      latitude: center.lat,
    }))
  }, [center.lat, center.lng])

  // Update viewState when zoom prop changes
  React.useEffect(() => {
    setViewState(prev => ({
      ...prev,
      zoom: zoom,
    }))
  }, [zoom])

  const getMarkerColor = (type?: string): string => {
    switch (type) {
      case 'pickup':
        return '#16a34a' // Green
      case 'dropoff':
        return '#dc2626' // Red
      case 'terminal':
        return '#2563eb' // Blue
      default:
        return '#f59e0b' // Amber (default)
    }
  }

  return (
    <div className={styles.mapContainer} style={{ height, ...style }}>
      <Map
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v12" // Or choose another style
        mapboxAccessToken={mapboxToken}
      >
        {/* Map Controls */}
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />

        {/* Markers */}
        {markers.map((marker, index) => (
          <Marker key={index} longitude={marker.lng} latitude={marker.lat} anchor="bottom">
            <Pin size={30} color={getMarkerColor(marker.type)} />
            {/* Optional: Add tooltip/popup on hover/click */}
          </Marker>
        ))}

        {/* Add starting center marker if no specific markers are provided initially */}
        {markers.length === 0 && (
            <Marker longitude={center.lng} latitude={center.lat} anchor="bottom">
                 <Pin size={30} color={getMarkerColor('default')} />
            </Marker>
        )}
      </Map>
    </div>
  )
} 