import { toast } from 'sonner';
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
) {
  if (!userId) {
    console.warn('No user ID provided for location update')
    return
  }

  try {
    // Call the PostgreSQL function to update location using PostGIS
    const { error } = await supabase.rpc('update_user_location', {
      p_user_id: userId,
      p_latitude: latitude,
      p_longitude: longitude, 
      p_accuracy: accuracy || null,
      p_heading: heading || null,
      p_speed: speed || null
    });

    if (error) {
      console.error('Error updating location in database:', error)
      throw new Error(`Database error: ${error.message}`)
    }

  } catch (error) {
    console.error('Error updating user location:', error)
    toast.error('Location Update Failed', {
      description: 'Unable to update your location. Please check your connection.'
    })
    // Don't throw the error, just log it to prevent app crashes
    return false
  }

  return true
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
export function startLocationTracking(userId: string) {
  if (!navigator.geolocation) {
    toast.error('Location Services Unavailable', {
      description: 'Your browser does not support location tracking.'
    })
    return null
  }

  const watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const { latitude, longitude, accuracy, heading, speed } = position.coords
      
      try {
        await updateUserLocation(
          userId,
          latitude,
          longitude,
          accuracy,
          heading || undefined,
          speed || undefined
        )
      } catch (error) {
        // Error is already handled in updateUserLocation
        console.debug('Location update failed silently')
      }
    },
    (error) => {
      let message = 'Unable to get your location'
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Please enable location access in your browser settings'
          break
        case error.POSITION_UNAVAILABLE:
          message = 'Location information is unavailable'
          break
        case error.TIMEOUT:
          message = 'Location request timed out'
          break
      }

      toast.error('Location Error', {
        description: message
      })
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  )

  return () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId)
    }
  }
}
