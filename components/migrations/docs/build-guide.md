Documentation:

user_locations: Stores the most recent geographic location for each user.
user_id: Foreign key linking to the auth.users table (and potentially your profiles table). Marked UNIQUE to simplify storing only the latest location per user via ON CONFLICT.
location: A PostGIS GEOMETRY type storing the point (Longitude, Latitude). SRID 4326 is the standard for GPS coordinates.
heading: Optional device direction.
updated_at: Timestamp of the last update.
Realtime: Ensure you enable replication for this table in the Supabase dashboard so clients can subscribe to changes.
update_user_location Function: Provides a secure way (SECURITY DEFINER) to upsert location data via Supabase RPC (Remote Procedure Call). This is generally safer than allowing direct table writes from the client, especially if row-level security (RLS) is complex. Remember to grant EXECUTE permission.
Step 2: Mobile App (React Native - Common Logic)

You'll need a location library. react-native-geolocation-service is a popular choice, or expo-location if you're using Expo.

Bash

# Using npm
npm install react-native-geolocation-service
# --- or ---
# Using yarn
yarn add react-native-geolocation-service

# If not using Expo, link native dependencies
npx react-native link react-native-geolocation-service

# --- or if using Expo ---
npx expo install expo-location
Add necessary permissions to AndroidManifest.xml (Android) and Info.plist (iOS).

Android (android/app/src/main/AndroidManifest.xml):

XML

<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
iOS (ios/YourProjectName/Info.plist):

XML

<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to show you on the map and connect you with rides.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Triders need to share location in the background to stay online and receive ride requests.</string> <key>UIBackgroundModes</key> <array>
  <string>location</string>
</array>
Conceptual Location Tracking Hook/Service:

JavaScript

// src/hooks/useLocationTracking.js
import { useState, useEffect, useRef } from 'react';
import { Platform, PermissionsAndroid, AppState } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
// For Expo: import * as Location from 'expo-location';
import { supabase } from '../lib/supabase'; // Adjust path to your Supabase client

const LOCATION_UPDATE_INTERVAL = 10000; // Update every 10 seconds
const BACKGROUND_LOCATION_UPDATE_INTERVAL = 30000; // Update every 30 seconds (adjust based on need/battery)

export function useLocationTracking(enabled = true, isBackgroundAllowed = false) {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const watchId = useRef(null);
  const appState = useRef(AppState.currentState);
  const isTracking = useRef(false);

  // Request Permissions (React Native Geolocation Service Example)
  const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
          const auth = await Geolocation.requestAuthorization('whenInUse');
          if (auth === 'granted') return true;
          // Handle background permission separately if needed
          if (isBackgroundAllowed) {
               const backgroundAuth = await Geolocation.requestAuthorization('always');
               if (backgroundAuth === 'granted') return true;
          }
          return false;
      }

      if (Platform.OS === 'android') {
          try {
              const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                  {
                      title: 'TriGo Location Permission',
                      message: 'TriGo needs access to your location.',
                      buttonNeutral: 'Ask Me Later',
                      buttonNegative: 'Cancel',
                      buttonPositive: 'OK',
                  },
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  // TODO: Handle background permission if needed for Android Q+
                  return true;
              } else {
                  console.log('Location permission denied');
                  return false;
              }
          } catch (err) {
              console.warn(err);
              return false;
          }
      }
      return false;
  };

  // --- Expo Location Example ---
  // const requestLocationPermissionExpo = async () => {
  //   let { status } = await Location.requestForegroundPermissionsAsync();
  //   if (status !== 'granted') {
  //     setError('Foreground permission denied');
  //     return false;
  //   }
  //   if (isBackgroundAllowed) {
  //       let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
  //       if (backgroundStatus !== 'granted') {
  //           // Decide if background is critical or optional
  //           console.warn('Background location permission denied');
  //           // return false; // Uncomment if background is mandatory
  //       }
  //   }
  //   return true;
  // };

  // Send location to Supabase
  const updateLocationInSupabase = async (newLocation) => {
    if (!newLocation?.coords) return;

    const { latitude, longitude, heading } = newLocation.coords;
    const { data: user } = await supabase.auth.getUser(); // Get current user

    if (!user?.user?.id) {
      console.error('User not logged in, cannot update location.');
      return;
    }

    console.log(`Updating location for ${user.user.id}:`, latitude, longitude, heading);

    // Call the RPC function
    const { error: rpcError } = await supabase.rpc('update_user_location', {
      p_user_id: user.user.id,
      p_latitude: latitude,
      p_longitude: longitude,
      p_heading: heading ?? null, // Pass heading if available
    });

    // --- Alternative: Direct Upsert (Requires RLS allowing update/insert) ---
    // const { error: upsertError } = await supabase
    //   .from('user_locations')
    //   .upsert({
    //     user_id: user.user.id,
    //     location: `POINT(${longitude} ${latitude})`, // WKT format for PostGIS
    //     heading: heading ?? null,
    //     updated_at: new Date().toISOString(),
    //   }, { onConflict: 'user_id' }); // Requires 'user_id' to be unique constraint or PK

    if (rpcError) {
      console.error('Error updating location in Supabase:', rpcError);
      setError(rpcError.message);
    } else {
      // console.log('Location updated successfully');
    }
  };

  // Start watching location
  const startWatching = (interval) => {
    if (!enabled || isTracking.current) return;
    console.log(`Starting location watch with interval ${interval}ms`);
    isTracking.current = true;
    setError(null);

    watchId.current = Geolocation.watchPosition(
      (position) => {
        // console.log('Received new position:', position);
        setLocation(position);
        updateLocationInSupabase(position); // Send update to backend
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError(err.message);
        // Consider stopping watch if error persists (e.g., permissions revoked)
        if (err.code === 1 || err.code === 2) { // PERMISSION_DENIED or POSITION_UNAVAILABLE
            stopWatching();
        }
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        distanceFilter: 10, // Update only if moved 10 meters
        interval: interval, // Desired update interval
        fastestInterval: Math.max(5000, interval / 2), // Fastest possible interval
        showLocationDialog: false, // Don't show system dialog if location is off (handle manually)
        forceRequestLocation: false,
        // forceLocationManager: false, // Android specific
        // useSignificantChanges: false, // iOS specific for background efficiency (less frequent)
      }
    );
  };

  // --- Expo Location Example ---
  // const startWatchingExpo = async (interval) => {
  //    if (!enabled || isTracking.current) return;
  //    console.log(`Starting location watch (Expo) with interval ${interval}ms`);
  //    isTracking.current = true;
  //    setError(null);
  //    try {
  //        watchId.current = await Location.watchPositionAsync(
  //            {
  //                accuracy: Location.Accuracy.BestForNavigation,
  //                timeInterval: interval,
  //                distanceInterval: 10, // In meters
  //            },
  //            (newLocation) => {
  //                setLocation(newLocation);
  //                updateLocationInSupabase(newLocation);
  //            }
  //        );
  //    } catch (err) {
  //        console.error("Expo Location watch error:", err);
  //        setError(err.message);
  //        isTracking.current = false;
  //    }
  // };

  // Stop watching location
  const stopWatching = () => {
    if (watchId.current !== null) {
      console.log('Stopping location watch');
      Geolocation.clearWatch(watchId.current);
      // if (watchId.current?.remove) watchId.current.remove(); // For Expo
      watchId.current = null;
    }
    isTracking.current = false;
  };

  // Handle App State Changes (Foreground/Background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        // Restart watch with foreground interval if it was stopped or using background interval
        if (enabled && isTracking.current) {
             stopWatching(); // Stop existing watch (might be background)
             requestLocationPermission().then(granted => {
                 if(granted) startWatching(LOCATION_UPDATE_INTERVAL);
             });
        } else if (enabled) {
             requestLocationPermission().then(granted => {
                 if(granted) startWatching(LOCATION_UPDATE_INTERVAL);
             });
        }

      } else if (
          appState.current === 'active' &&
          nextAppState.match(/inactive|background/)
      ) {
         console.log('App has gone to the background!');
         if (isBackgroundAllowed && enabled) {
             console.log("Continuing location tracking in background.");
             // Optional: Switch to a less frequent update interval for background
             stopWatching();
             startWatching(BACKGROUND_LOCATION_UPDATE_INTERVAL);
         } else {
             console.log("Stopping location tracking in background.");
             stopWatching();
         }
      }
      appState.current = nextAppState;
    });

    // Initial setup
    if (enabled) {
      requestLocationPermission().then((granted) => {
        if (granted) {
            startWatching(LOCATION_UPDATE_INTERVAL); // Start with foreground interval
        } else {
          setError('Permission not granted.');
        }
      });
    }

    // Cleanup
    return () => {
      subscription.remove();
      stopWatching();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, isBackgroundAllowed]); // Rerun effect if enabled or background permission changes

  return { location, error, startWatching, stopWatching };
}
How to use the hook in your Passenger/Trider app:

JavaScript

import React from 'react';
import { View, Text } from 'react-native';
import { useLocationTracking } from './hooks/useLocationTracking';

// Example Usage in a Trider Component (needs background tracking)
const TriderAppScreen = () => {
  // Assuming 'isOnline' state determines if tracking should be active
  const [isOnline, setIsOnline] = useState(true); // Manage this state based on Trider actions
  const { location, error } = useLocationTracking(isOnline, true); // Enable tracking if 'isOnline', allow background

  return (
    <View>
      <Text>Trider Status: {isOnline ? 'Online' : 'Offline'}</Text>
      {/* Add button to toggle isOnline state */}
      {location && (
        <Text>
          Lat: {location.coords.latitude}, Lng: {location.coords.longitude}
        </Text>
      )}
      {error && <Text style={{ color: 'red' }}>Error: {error}</Text>}
    </View>
  );
};

// Example Usage in a Passenger Component (only when needed, e.g., during booking)
const PassengerBookingScreen = ({ isBookingActive }) => {
  // Track location only when booking is active, foreground only
  const { location, error } = useLocationTracking(isBookingActive, false);

  return (
    <View>
      <Text>Booking Status: {isBookingActive ? 'Active' : 'Inactive'}</Text>
      {isBookingActive && location && (
        <Text>
          Your Location: Lat: {location.coords.latitude}, Lng: {location.coords.longitude}
        </Text>
      )}
      {isBookingActive && error && <Text style={{ color: 'red' }}>Location Error: {error}</Text>}
    </View>
  );
};
Documentation:

Uses react-native-geolocation-service (or expo-location) to watch position changes.
useLocationTracking Hook: Manages permissions, starts/stops location watching, and handles app state changes (foreground/background).
enabled: Prop to easily turn tracking on/off (e.g., based on Trider's online status or Passenger's booking state).
isBackgroundAllowed: Prop to indicate if background tracking is required/permitted (mainly for Triders).
updateLocationInSupabase: Sends coordinates and optional heading to the Supabase update_user_location RPC function.
Error Handling: Basic error state is included.
Intervals: Uses different intervals for foreground and background to save battery.
Permissions: Includes logic to request necessary permissions. Note that background permission handling, especially on newer Android versions, can be complex and requires careful testing.
Step 3: Dispatcher Dashboard (Next.js/V0.dev + Mapbox + Supabase Realtime)

Install necessary libraries:

Bash

npm install @supabase/supabase-js mapbox-gl react-map-gl
# or
yarn add @supabase/supabase-js mapbox-gl react-map-gl
Conceptual Dispatcher Map Component:

JavaScript

// src/components/DispatcherMap.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '../lib/supabase'; // Adjust path

// Replace with your Mapbox access token
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN; // Store securely

// Icons for different user types (example)
const TriderIcon = () => <div style={{ fontSize: '24px' }}>🚖</div>;
const PassengerIcon = () => <div style={{ fontSize: '24px' }}>🙋</div>;

// Function to parse PostGIS point string like "POINT(lon lat)"
const parsePoint = (pointString) => {
  if (!pointString || typeof pointString !== 'string') return null;
  const match = pointString.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
  if (match && match.length === 3) {
    return { longitude: parseFloat(match[1]), latitude: parseFloat(match[2]) };
  }
  return null;
};

export default function DispatcherMap() {
  const [viewport, setViewport] = useState({
    // Set initial view centered on Las Piñas, Philippines (approx)
    latitude: 14.4444,
    longitude: 120.9939,
    zoom: 13,
    pitch: 30, // Add some perspective
  });
  const [userLocations, setUserLocations] = useState({}); // Store locations by user_id { userId: {lat, lng, role, updated_at} }
  const mapRef = useRef();

  // Fetch initial locations and subscribe to changes
  useEffect(() => {
    let subscription = null;

    // Fetch initial data - only users updated recently? Or all online?
    const fetchInitialLocations = async () => {
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

      const initialLocations = {};
      data.forEach(item => {
        const coords = parsePoint(item.location); // Use the parser here
        if (coords && item.profiles) { // Ensure profile data exists
           // Only add Triders if they are online, always add passengers for this example
           if (item.profiles.role === 'trider' && !item.profiles.is_online) {
               return; // Skip offline triders
           }
           initialLocations[item.user_id] = {
             ...coords,
             role: item.profiles.role,
             updated_at: item.updated_at,
           };
        }
      });
      console.log('Fetched initial locations:', initialLocations);
      setUserLocations(initialLocations);
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
            }
          }
          // Handle DELETE (optional - if users can be deleted from user_locations)
          else if (payload.eventType === 'DELETE') {
            const { user_id } = payload.old;
            setUserLocations(prev => {
              const next = { ...prev };
              delete next[user_id];
              return next;
            });
          }
        }
      )
      .subscribe((status, err) => {
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
  const handleMarkerClick = useCallback((longitude, latitude) => {
    mapRef.current?.flyTo({ center: [longitude, latitude], duration: 1500, zoom: 16 });
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
Documentation:

Uses react-map-gl as a wrapper for Mapbox GL JS.
MAPBOX_TOKEN: Your Mapbox access token (should be stored securely, e.g., in environment variables).
userLocations State: Stores the location data (latitude, longitude, role, updated_at) keyed by user_id.
parsePoint: Helper function to extract lat/lon from PostGIS POINT string format.
Initial Fetch: Fetches recently updated locations on component mount, including user role and online status from the profiles table. Crucially, you need to adapt the filters here to fetch the relevant users (e.g., only online Triders, maybe passengers with active requests).
Realtime Subscription: Subscribes to INSERT, UPDATE, and DELETE events on the user_locations table using supabase.channel.
Handling Updates: When an update is received:
Parses the location data.
Fetches the associated user's profile (role, is_online) to decide if they should be displayed. This adds latency; a more advanced approach might involve embedding role/status directly in the user_locations table via triggers or fetching less frequently.
Updates the userLocations state, triggering a re-render of the markers.
Removes markers for users who should no longer be shown (e.g., Trider goes offline).
Markers: Renders different markers (TriderIcon, PassengerIcon) based on the user's role. Includes an onClick handler to center the map on the clicked marker.
Map Controls: Includes standard navigation and optional geolocate controls.
Cleanup: Unsubscribes from the Supabase channel when the component unmounts to prevent memory leaks.
Next Steps & Considerations:

Implement Status Management: You need a reliable way for Triders to set their status to "online" or "offline" (e.g., a toggle in their app that updates the is_online flag in the profiles table). The dispatcher map relies on this flag. Passengers might have implicit status based on whether they have an active ride request or ongoing trip.
Refine Filtering: Adjust the initial fetch and real-time update logic on the dispatcher dashboard to show precisely the users you need (e.g., only online Triders, passengers actively seeking a ride).
Error Handling & Edge Cases: Add more robust error handling (e.g., what happens if Supabase connection drops? What if location permissions are revoked mid-session?).
Optimization:
For the dispatcher map, fetching the profile on every location update can be inefficient. Consider denormalizing the role and is_online status into the user_locations table (updated via a trigger on the profiles table) or using a more sophisticated caching/update strategy.
Adjust location update frequency (LOCATION_UPDATE_INTERVAL, distanceFilter) based on testing to balance real-time feel with battery life.
Security: Ensure appropriate Row Level Security (RLS) policies are set up in Supabase to control who can read/write location data. For example, dispatchers should be able to read all relevant locations, while users should only be able to update their own location. The RPC function with SECURITY DEFINER bypasses RLS for the function's execution but the user calling it still needs EXECUTE permission. Ensure the function itself doesn't expose sensitive data inappropriately.