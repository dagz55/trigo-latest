import { useEffect, useRef, Suspense } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getMapboxToken } from '@/lib/maps-client';

interface MapProps {
  location: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

const MapContent = ({ location, zoom = 15, className = '' }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const token = getMapboxToken();
    if (!token) {
      console.error('Mapbox access token is not configured');
      return;
    }

    // Properly type the mapboxgl access token
    (mapboxgl as any).accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [location.lng, location.lat],
      zoom: zoom
    });

    marker.current = new mapboxgl.Marker()
      .setLngLat([location.lng, location.lat])
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [location.lat, location.lng, zoom]);

  return <div ref={mapContainer} className={className} />;
};

const Map = (props: MapProps) => {
  return (
    <Suspense fallback={<div className={props.className}>Loading map...</div>}>
      <MapContent {...props} />
    </Suspense>
  );
};

export default Map;
