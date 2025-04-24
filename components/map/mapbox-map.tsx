"use client"

import { MapPinIcon, Navigation } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { GeolocateControl, Layer, Map, Marker, NavigationControl, Popup, Source } from 'react-map-gl';
import styles from './mapbox-map.module.css';
import markerStyles from './marker-styles.module.css';

// Define types
interface MapboxMapProps {
  center?: { lat: number; lng: number }
  zoom?: number
  height?: string
  markers?: Array<{
    lat: number
    lng: number
    title?: string
    type?: string
  }>
  routeGeojson?: any
  onClick?: (event: any) => void
  onMove?: (event: any) => void
  onLoaded?: () => void
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  center = { lat: 14.5995, lng: 120.9826 },
  zoom = 12,
  markers = [],
  routeGeojson = null,
  height = "400px",
  onClick,
  onMove,
  onLoaded,
}) => {
  const [popupInfo, setPopupInfo] = useState<{ title: string; lat: number; lng: number } | null>(null);
  const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);

  // Set the CSS variable for height
  useEffect(() => {
    if (mapWrapperRef.current) {
      mapWrapperRef.current.style.setProperty('--container-height', height);
    }
  }, [height]);

  if (!mapToken) {
    return <div className="text-red-500">Mapbox token not found</div>;
  }

  // Route line style
  const routeLineLayer = {
    id: 'route-layer',
    type: 'line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#0080ff',
      'line-width': 4,
      'line-opacity': 0.8
    }
  };

  const handleMapLoad = (event: any) => {
    mapRef.current = event.target;
    if (onLoaded) onLoaded();
  };

  // Function to get marker icon and label classes based on marker type
  const getMarkerClasses = (type?: string) => {
    switch (type) {
      case 'pickup':
        return {
          icon: markerStyles.markerIconBlue,
          label: markerStyles.markerLabelBlue
        };
      case 'dropoff':
        return {
          icon: markerStyles.markerIconRed,
          label: markerStyles.markerLabelRed
        };
      default:
        return {
          icon: markerStyles.markerIconGray,
          label: markerStyles.markerLabelGray
        };
    }
  };

  return (
    <div ref={mapWrapperRef} className={styles.mapWrapper}>
      <Map
        mapboxAccessToken={mapToken}
        initialViewState={{
          longitude: center.lng,
          latitude: center.lat,
          zoom: zoom,
        }}
        className={styles.mapContainer}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onClick={onClick}
        onMove={onMove}
        onLoad={handleMapLoad}
        reuseMaps
      >
        {/* Add navigation controls */}
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" />

        {/* Display route if routeGeojson is available */}
        {routeGeojson && (
          <Source id="route" type="geojson" data={routeGeojson}>
            <Layer {...routeLineLayer as any} />
          </Source>
        )}
        
        {/* Display all markers */}
        {markers.map((marker, index) => {
          const markerClasses = getMarkerClasses(marker.type);
          const MarkerIcon = marker.type === 'dropoff' ? Navigation : MapPinIcon;
          return (
            <Marker
              key={`marker-${index}`}
              longitude={marker.lng}
              latitude={marker.lat}
              anchor="bottom"
              onClick={e => {
                // If you have a popup
                e.originalEvent.stopPropagation();
                setPopupInfo({
                  title: marker.title || 'Location',
                  lat: marker.lat,
                  lng: marker.lng
                });
              }}
            >
              <div className={markerStyles.markerContainer}>
                <MarkerIcon className={`${markerStyles.markerIcon} ${markerClasses.icon}`} />
                <div className={`${markerStyles.markerLabel} ${markerClasses.label}`}>
                  {marker.title || (marker.type === 'pickup' ? 'Pickup' : marker.type === 'dropoff' ? 'Dropoff' : 'Location')}
                </div>
              </div>
            </Marker>
          );
        })}

        {/* Popup for marker information */}
        {popupInfo && (
          <Popup
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
          >
            <div className={markerStyles.popupContent}>
              <h3 className={markerStyles.popupTitle}>{popupInfo.title}</h3>
              <p className={markerStyles.popupCoordinates}>{popupInfo.lat.toFixed(6)}, {popupInfo.lng.toFixed(6)}</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapboxMap;
