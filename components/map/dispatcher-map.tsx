import { supabase } from '@/lib/supabase-client';
import { useEffect, useState } from 'react';

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

// Mock component that doesn't rely on mapbox-gl or react-map-gl
export default function DispatcherMap() {
  const [viewport, setViewport] = useState({
    latitude: 14.4444,
    longitude: 120.9939,
    zoom: 13,
    pitch: 30,
  });
  const [userLocations, setUserLocations] = useState<UserLocations>({});

  // Fetch initial locations and subscribe to changes
  useEffect(() => {
    let subscription: any = null;

    // Simplified fetch for testing
    const fetchInitialLocations = async () => {
      try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

        const { data, error } = await supabase
          .from('user_locations')
          .select(`
            user_id,
            location,
            updated_at,
            profiles ( role, is_online )
          `)
          .filter('profiles.role', 'in', '("trider","passenger")')
          .gt('updated_at', fiveMinutesAgo);

        if (error) {
          console.error('Error fetching initial locations:', error);
          return;
        }

        const initialLocations: UserLocations = {};
        if (data) {
          data.forEach(item => {
            const coords = parsePoint(item.location);
            if (coords && item.profiles) {
              const profile = item.profiles as unknown as { role: string; is_online: boolean };
              
              // Only add Triders if they are online
              if (profile.role === 'trider' && !profile.is_online) {
                return;
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

    // Cleanup subscription on component unmount
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  return (
    <div className="w-full h-[80vh] bg-gray-200 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Dispatcher Map (Placeholder)</h2>
      <div className="text-sm mb-4">
        <p>Center: {viewport.latitude.toFixed(6)}, {viewport.longitude.toFixed(6)}</p>
        <p>Zoom: {viewport.zoom}</p>
      </div>
      
      <div className="flex-1 border border-gray-300 p-4 overflow-auto">
        <h3 className="text-lg font-semibold mb-2">User Locations:</h3>
        {Object.entries(userLocations).length === 0 ? (
          <p className="text-gray-500">No active users found</p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(userLocations).map(([userId, data]) => (
              <li key={userId} className="p-2 bg-white rounded shadow-sm">
                <p><strong>User ID:</strong> {userId.substring(0, 8)}...</p>
                <p><strong>Role:</strong> {data.role}</p>
                <p><strong>Location:</strong> {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}</p>
                <p><strong>Updated:</strong> {new Date(data.updated_at).toLocaleTimeString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
