import { supabase } from './supabase-client';

/**
 * Updates the user's location in the database
 * @param userId The user's ID
 * @param latitude The user's latitude
 * @param longitude The user's longitude
 * @param accuracy Optional accuracy in meters
 * @param heading Optional heading in degrees
 * @param speed Optional speed in m/s
 * @returns Promise that resolves when the location is updated
 */
export async function updateUserLocation(
  userId: string,
  latitude: number,
  longitude: number,
  accuracy?: number,
  heading?: number,
  speed?: number
): Promise<void> {
  try {
    // Call the RPC function to update the user's location
    const { error } = await supabase.rpc('update_user_location', {
      p_user_id: userId,
      p_latitude: latitude,
      p_longitude: longitude,
      p_accuracy: accuracy || null,
      p_heading: heading || null,
      p_speed: speed || null
    });

    if (error) {
      console.error('Error updating user location:', error);
      throw error;
    }

    console.log('User location updated successfully');
  } catch (error) {
    console.error('Error in updateUserLocation:', error);
    throw error;
  }
}

/**
 * Gets the user's current location using the browser's geolocation API
 * @returns Promise that resolves with the user's location
 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

/**
 * Starts watching the user's location and updates it in the database
 * @param userId The user's ID
 * @returns A function to stop watching the user's location
 */
export function startLocationTracking(userId: string): () => void {
  if (!navigator.geolocation) {
    console.error('Geolocation is not supported by this browser');
    return () => {};
  }

  // Start watching the user's location
  const watchId = navigator.geolocation.watchPosition(
    async (position) => {
      try {
        const { latitude, longitude, accuracy, heading, speed } = position.coords;
        
        // Update the user's location in the database
        await updateUserLocation(
          userId,
          latitude,
          longitude,
          accuracy,
          heading || undefined,
          speed || undefined
        );
      } catch (error) {
        console.error('Error updating location during tracking:', error);
      }
    },
    (error) => {
      console.error('Error watching position:', error);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );

  // Return a function to stop watching the user's location
  return () => {
    navigator.geolocation.clearWatch(watchId);
    console.log('Location tracking stopped');
  };
}
