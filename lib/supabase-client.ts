import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL or Anon Key is missing. Check your environment variables.")
}

// Update LocationType enum to match database
export type LocationType = 'terminal' | 'pickup' | 'dropoff' | 'custom'

export type TodaStatus = 'active' | 'inactive'

export interface Toda {
  id: string
  name: string
  code: string
  city: string
  barangay: string
  terminal_address?: string
  contact_number?: string
  president_name?: string
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
}

export interface Location {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  city: string
  barangay: string
  type: LocationType
  toda_id?: string
  created_at?: string
  updated_at?: string
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to get current user (throws error on failure)
export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    console.error("Error getting current user session:", error)
    throw error // Propagate the error
  }
  return session?.user || null
}

// Log connection status
console.log(`Supabase client initialized with URL: ${supabaseUrl.substring(0, 20)}...`)

// Helper function to get default TODA
export async function getDefaultToda() {
  const defaultTodaName = 'Talon Kuatro Tricycle Operators and Drivers Association'; // Define name
  const { data, error } = await supabase
    .from('todas') // Corrected table name from 'toda' to 'todas'
    .select('*')
    .eq('name', defaultTodaName) // Use name instead of code
    // .eq('code', 'TK4-TODA') // Remove code check
    .single()

  if (error) {
    console.error(`Error fetching default TODA ('${defaultTodaName}'):`, error) // Update log message
    throw error // Propagate the error
  }

  return data
}

// Helper function to get locations by TODA
export async function getLocationsByToda(todaId: string) {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      todas (
        id,
        name,
        city,
        barangay
      )
    `)
    .eq('toda_id', todaId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error fetching locations for TODA ${todaId}:`, error)
    throw error // Propagate the error
  }

  return data
}

// Helper function to get locations by city
export async function getLocationsByCity(city: string) {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      todas (
        id,
        name,
        city,
        barangay
      )
    `)
    .eq('city', city)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error fetching locations for city ${city}:`, error)
    throw error // Propagate the error
  }

  return data
}

// Helper function to get locations by barangay
export async function getLocationsByBarangay(barangay: string) {
  const { data, error } = await supabase
    .from('locations')
    .select(`
      *,
      todas (
        id,
        name,
        city,
        barangay
      )
    `)
    .eq('barangay', barangay)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(`Error fetching locations for barangay ${barangay}:`, error)
    throw error // Propagate the error
  }

  return data
}

// Helper function to insert initial location data (throws error on failure)
export async function insertInitialLocation() {
  console.log('Attempting to insert initial location...')
  // Get the default TODA first
  const toda = await getDefaultToda() // Relies on getDefaultToda throwing error if it fails
  if (!toda) {
    // This case should ideally not be reached if getDefaultToda throws
    throw new Error('Default TODA not found, cannot insert initial location.')
  }

  // Check if the location already exists
  const { data: existingLocation, error: checkError } = await supabase
    .from('locations')
    .select('id') // Only select id for checking existence
    .eq('city', 'Las Piñas City')
    .eq('barangay', 'Talon Kuatro')
    .eq('name', 'Rose of Heaven Drive Corner') // Be more specific
    .maybeSingle() // Use maybeSingle to handle 0 or 1 result without error

  if (checkError) {
    console.error('Error checking existing location:', checkError)
    throw checkError // Propagate the error
  }

  if (existingLocation) {
    console.log('Initial location already exists (ID:', existingLocation.id, '). Skipping insertion.')
    // Optionally fetch full data if needed, or just return existing ID/minimal info
    // For simplicity, let's return the existing minimal data
    return existingLocation
  }

  // Insert new location if it doesn't exist
  console.log('Initial location not found. Inserting...')
  const newLocationData = {
    name: 'Rose of Heaven Drive Corner',
    address: '19 Rose of Heaven Drive corner Periwinkle St., Talon Village, Talon 4, Las Piñas City',
    latitude: 14.4507,
    longitude: 120.9826,
    city: 'Las Piñas City',
    barangay: 'Talon Kuatro',
    type: 'terminal' as LocationType,
    toda_id: toda.id
  }
  const { data, error: insertError } = await supabase
    .from('locations')
    .insert(newLocationData)
    .select('*, todas(*)') // Corrected relationship name & Select full data after insert
    .single()

  if (insertError) {
    console.error('Error inserting initial location:', insertError)
    throw insertError // Propagate the error
  }

  console.log('Successfully inserted initial location:', data)
  return data
}

// Trider types
export type TriderStatus = 'offline' | 'online' | 'busy'

export interface Trider {
  id: string
  user_id: string
  toda_id: string
  first_name: string
  last_name: string
  contact_number: string
  plate_number: string
  license_number: string
  status: TriderStatus
  current_latitude?: number
  current_longitude?: number
  last_online?: string
  created_at: string
  updated_at: string
}

export interface TriderQueueItem {
  id: string
  trider_id: string
  toda_id: string
  queue_position: number
  joined_at: string
  trider?: Trider
}

// Ride types
export type RideStatus = 'pending' | 'accepted' | 'picked_up' | 'completed' | 'cancelled'

export interface RideRequest {
  id: string;
  booking_code: string;
  passenger: {
    id: string;
    name: string;
    contact_number: string;
  };
  pickup_location_id: string;
  dropoff_location_id: string;
  pickup_name: string;
  pickup_address: string;
  pickup_latitude: number;
  pickup_longitude: number;
  dropoff_name: string;
  dropoff_address: string;
  dropoff_latitude: number;
  dropoff_longitude: number;
  status: 'waiting_for_trider' | 'accepted' | 'picked_up' | 'completed' | 'cancelled';
  estimated_fare: number;
  estimated_time: number;
  route_distance: number;
  route_duration: number;
  route_geometry: string;
  trider_id: string;
  created_at: string;
}

// Trider functions
export async function getTridersByToda(toda_id: string): Promise<Trider[]> {
  const { data, error } = await supabase
    .from('triders')
    .select('*')
    .eq('toda_id', toda_id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error(`Error fetching triders for TODA ${toda_id}:`, error)
    throw error
  }
  return data
}

export async function getOnlineTriders(toda_id: string): Promise<Trider[]> {
  const { data, error } = await supabase
    .from('triders')
    .select('*')
    .eq('toda_id', toda_id)
    .eq('status', 'online')
    .order('last_online', { ascending: true })

  if (error) {
    console.error(`Error fetching online triders for TODA ${toda_id}:`, error)
    throw error
  }
  return data
}

export async function getTriderQueue(toda_id: string): Promise<TriderQueueItem[]> {
  const { data, error } = await supabase
    .from('trider_queue')
    .select(`
      *,
      trider:triders(*)
    `)
    .eq('toda_id', toda_id)
    .order('queue_position', { ascending: true })

  if (error) {
    console.error(`Error fetching trider queue for TODA ${toda_id}:`, error)
    throw error
  }
  return data
}

export async function updateTriderStatus(
  trider_id: string,
  status: TriderStatus,
  latitude?: number,
  longitude?: number
): Promise<void> {
  const updates: any = { status }
  if (latitude !== undefined && longitude !== undefined) {
    updates.current_latitude = latitude
    updates.current_longitude = longitude
  }

  const { error } = await supabase
    .from('triders')
    .update(updates)
    .eq('id', trider_id)

  if (error) {
    console.error(`Error updating trider ${trider_id} status to ${status}:`, error)
    throw error
  }
  console.log(`Trider ${trider_id} status updated to ${status}`)
}

// Ride request functions
export async function createRideRequest(
  passenger_id: string,
  toda_id: string,
  pickup_location_id: string,
  dropoff_location_id: string,
  fare_amount: number,
  distance_km: number
): Promise<RideRequest> {
  const { data, error } = await supabase
    .from('ride_requests')
    .insert({
      passenger_id,
      toda_id,
      pickup_location_id,
      dropoff_location_id,
      fare_amount,
      distance_km,
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating ride request:', error)
    throw error
  }
  console.log(`Ride request created successfully (ID: ${data.id}) for passenger ${passenger_id}`)
  return data
}

export async function getPendingRideRequests(toda_id: string): Promise<RideRequest[]> {
  const { data: requests, error } = await supabase
    .from('ride_requests')
    .select(`
      *,
      pickup_location:locations!pickup_location_id(*),
      dropoff_location:locations!dropoff_location_id(*),
      trider:triders(*)
    `)
    .eq('toda_id', toda_id)
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching pending ride requests:', error);
    throw error;
  }

  return requests.map(req => ({
    id: req.id,
    passenger_id: req.passenger_id,
    toda_id: req.toda_id,
    trider_id: req.trider_id || '',
    pickup_location_id: req.pickup_location_id,
    dropoff_location_id: req.dropoff_location_id,
    passenger: {
      id: req.passenger_id,
      name: '', // You might want to fetch this from users table
      contact_number: '' // You might want to fetch this from users table
    },
    booking_code: req.booking_code,
    route_geometry: req.route_geometry || '',
    status: req.status,
    estimated_fare: req.estimated_fare || 0,
    estimated_time: req.estimated_time || 0,
    route_distance: req.route_distance || 0,
    route_duration: req.route_duration || 0,
    pickup_name: req.pickup_location?.name || '',
    pickup_address: req.pickup_location?.address || '',
    pickup_latitude: req.pickup_location?.latitude || 0,
    pickup_longitude: req.pickup_location?.longitude || 0,
    dropoff_name: req.dropoff_location?.name || '',
    dropoff_address: req.dropoff_location?.address || '',
    dropoff_latitude: req.dropoff_location?.latitude || 0,
    dropoff_longitude: req.dropoff_location?.longitude || 0,
    pickup_location: req.pickup_location,
    dropoff_location: req.dropoff_location,
    trider: req.trider,
    created_at: req.created_at,
    cancellation_reason: req.cancellation_reason || null
  }));
}

export async function getActiveRideRequests(toda_id: string): Promise<RideRequest[]> {
  const { data, error } = await supabase
    .from('ride_requests')
    .select(`
      *,
      pickup_location:locations!pickup_location_id(*),
      dropoff_location:locations!dropoff_location_id(*),
      trider:triders(*)
    `)
    .eq('toda_id', toda_id)
    .in('status', ['accepted', 'picked_up'])
    .order('requested_at', { ascending: true })

  if (error) {
    console.error(`Error fetching active ride requests for TODA ${toda_id}:`, error)
    throw error
  }
  return data
}

export async function updateRideStatus(
  ride_id: string,
  status: RideStatus,
  trider_id?: string,
  cancellation_reason?: string
): Promise<void> {
  const updates: any = { status }

  if (status === 'accepted') {
    updates.accepted_at = new Date().toISOString()
    updates.trider_id = trider_id
  } else if (status === 'picked_up') {
    updates.picked_up_at = new Date().toISOString()
  } else if (status === 'completed') {
    updates.completed_at = new Date().toISOString()
  } else if (status === 'cancelled') {
    updates.cancelled_at = new Date().toISOString()
    updates.cancellation_reason = cancellation_reason
  }

  const { error } = await supabase
    .from('ride_requests')
    .update(updates)
    .eq('id', ride_id)

  if (error) {
    console.error(`Error updating ride ${ride_id} status to ${status}:`, error)
    throw error
  }
  console.log(`Ride ${ride_id} status updated to ${status}`)
}
