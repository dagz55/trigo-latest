import { useState, useEffect, useRef, useCallback } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/lib/supabase-client'; // Adjusted path for TriGo

// Replace with your Mapbox access token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN; // Using TriGo's env variable name

// Icons for different user types (example)
const TriderIcon = () => <div style={{ fontSize: '24px' }}>🚖</div>;
const PassengerIcon = () => <div style={{ fontSize: '24px' }}>🙋</div>;

// Function to parse PostGIS point string like "POINT(lon lat)"
const parsePoint = (pointString: string) => {
  if (!pointString || typeof pointString !== 'string') return null;
  const match = pointString.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
  if (match && match.length === 3) {
    return { longitude: parseFloat(match[1]), latitude: parseFloat(match[2]) };
  }
  return null;
};

interface UserLocation {
  latitude: number;
  longitude: number;
  role: string;
  updated_at: string;
}

interface UserLocations {
  [userId: string]: UserLocation;
}

export default function DispatcherMap() {
  const [viewport, setViewport] = useState({
    // Set initial view centered on Las Piñas, Philippines (approx)
    latitude: 14.4444,
    longitude: 120.9939,
    zoom: 13,
    pitch: 30, // Add some perspective
  });
  const [userLocations, setUserLocations] = useState<UserLocations>({}); // Store locations by user_id { userId: {lat, lng, role, updated_at} }
  const mapRef = useRef<any>(null);

  // Fetch initial locations and subscribe to changes
  useEffect(() => {
    let subscription: any = null;

    // Fetch initial data - only users updated recently? Or all online?
    const fetchInitialLocations = async () => {
      try {
        // Fetch users (Triders/Passengers) that are relevant (e.g., Triders who are online)
        // This might require joining user_locations with your 'profiles' table
        // Example: Fetch all locations updated in the last 5 minutes with profile info
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

        const { data, error } = await supabase
          .from('user_locations')
          .select(`
            user_id,
            location,
            updated_at,
            profiles ( role, is_online )
          `)
          // Only fetch triders who are online OR passengers (adapt filter as needed)
          .filter('profiles.role', 'in', '("trider","passenger")')
          // .filter('profiles.is_online', 'eq', true) // Filter only online triders? Needs is_online in profiles
          .gt('updated_at', fiveMinutesAgo); // Only recently updated

        if (error) {
          console.error('Error fetching initial locations:', error);
          return;
        }

        const initialLocations: UserLocations = {};
        if (data) {
          data.forEach(item => {
            const coords = parsePoint(item.location); // Use the parser here
            if (coords && item.profiles) { // Ensure profile data exists
              // Type assertion to handle the profiles object
              // First convert to unknown, then to the expected type
              const profile = item.profiles as unknown as { role: string; is_online: boolean };

              // Only add Triders if they are online, always add passengers for this example
              if (profile.role === 'trider' && !profile.is_online) {
                return; // Skip offline triders
              }
              initialLocations[item.user_id] = {
                ...coords,
                role: profile.role,
                updated_at: item.updated_at,
              };
            }
          });
        }
        console.log('Fetched initial locations:', initialLocations);
        setUserLocations(initialLocations);
      } catch (err) {
        console.error('Error in fetchInitialLocations:', err);
      }
    };

    fetchInitialLocations();

    // Subscribe to real-time updates on the user_locations table
    subscription = supabase
      .channel('public:user_locations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_locations' },
        async (payload) => {
          console.log('Realtime location change received:', payload);

          // Handle INSERT or UPDATE
          if (payload.new && (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE')) {
            const { user_id, location, updated_at } = payload.new;
            const coords = parsePoint(location); // Use the parser here

            if (coords) {
              try {
                // Need to fetch the user's role and online status
                const { data: profileData, error: profileError } = await supabase
                  .from('profiles')
                  .select('role, is_online')
                  .eq('id', user_id)
                  .single();

                if (profileError || !profileData) {
                  console.error('Error fetching profile for updated location:', profileError);
                  // Optionally remove the marker if profile info is missing
                  // setUserLocations(prev => {
                  //     const next = { ...prev };
                  //     delete next[user_id];
                  //     return next;
                  // });
                  return;
                }

                // Decide whether to show this user
                // Example: Show only online Triders, always show passengers
                const showUser = (profileData.role === 'trider' && profileData.is_online) || profileData.role === 'passenger';

                if (showUser) {
                  setUserLocations(prev => ({
                    ...prev,
                    [user_id]: {
                      ...coords,
                      role: profileData.role,
                      updated_at: updated_at,
                    },
                  }));
                } else {
                  // If user should not be shown (e.g., Trider went offline), remove them
                  setUserLocations(prev => {
                    const next = { ...prev };
                    delete next[user_id];
                    return next;
                  });
                }
              } catch (err) {
                console.error('Error processing location update:', err);
              }
            }
          }
          // Handle DELETE (optional - if users can be deleted from user_locations)
          else if (payload.eventType === 'DELETE' && payload.old) {
            const { user_id } = payload.old;
            setUserLocations(prev => {
              const next = { ...prev };
              delete next[user_id];
              return next;
            });
          }
        }
      )
      .subscribe((status: string, err?: any) => {
        if (status === 'SUBSCRIBED') {
          console.log('Subscribed to user_locations updates!');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('Subscription error:', err);
        }
      });

    // Cleanup subscription on component unmount
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
        console.log("Unsubscribed from user_locations updates.");
      }
    };
  }, []); // Run only once on mount

  // Center map on a specific user when their marker is clicked (optional)
  const handleMarkerClick = useCallback((longitude: number, latitude: number) => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [longitude, latitude], duration: 1500, zoom: 16 });
    }
  }, []);

  return (
    <Map
      ref={mapRef}
      {...viewport}
      style={{ width: '100%', height: '80vh' }} // Adjust size as needed
      mapStyle="mapbox://styles/mapbox/dark-v11" // Use a Mapbox style (dark mode example)
      mapboxAccessToken={MAPBOX_TOKEN}
      onMove={evt => setViewport(evt.viewState)}
    >
      <NavigationControl position="top-left" />
      <GeolocateControl // Optional: Allows dispatcher to see their own location
        position="top-left"
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        showAccuracyCircle={false} // Simpler display
      />

      {Object.entries(userLocations).map(([userId, data]) => {
        // Add a check for valid coordinates
        if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
          console.warn(`Invalid coordinates for user ${userId}:`, data);
          return null; // Don't render marker if coordinates are invalid
        }

        // Optional: Filter out very old locations if needed (though initial fetch and updates should handle this)
        // const locationAge = Date.now() - new Date(data.updated_at).getTime();
        // if (locationAge > 10 * 60 * 1000) { // Older than 10 minutes
        //     return null;
        // }

        return (
          <Marker
            key={userId}
            longitude={data.longitude}
            latitude={data.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation(); // Prevent map click event
              handleMarkerClick(data.longitude, data.latitude);
            }}
          >
            {data.role === 'trider' ? <TriderIcon /> : <PassengerIcon />}
          </Marker>
        );
      })}
    </Map>
  );
}
