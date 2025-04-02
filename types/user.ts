export type UserRole = "trider" | "passenger" | "dispatcher"

export type User = {
  id: string
  email: string
  role: UserRole
  name?: string
  phone?: string
  isOnline?: boolean
}

export type Trider = User & {
  role: "trider"
  currentLocation?: {
    lat: number
    lng: number
  }
  isAvailable: boolean
  vehicleDetails?: {
    type: string
    plateNumber: string
    color: string
  }
}

export type Dispatcher = User & {
  role: "dispatcher"
  assignedAreas: string[]
}

export type RideStatus = "requested" | "assigned" | "inProgress" | "completed" | "cancelled"

export type Ride = {
  id: string
  passengerId: string
  riderId?: string
  dispatcherId?: string
  pickupLocation: {
    lat: number
    lng: number
    address?: string
  }
  dropoffLocation: {
    lat: number
    lng: number
    address?: string
  }
  requestTime: string
  status: RideStatus
  fare?: number
  paymentMethod: "cash" | "online"
}

