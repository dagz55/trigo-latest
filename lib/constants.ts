import { User, Bike, PhoneCall, Settings } from "lucide-react";

export type Role = {
  id: string;
  name: string;
  icon: any;
  route: string;
  description: string;
  color?: string;
};

export const roles: Role[] = [
  { 
    id: 'passenger', 
    name: 'Passenger',
    icon: User, 
    route: '/passenger/dashboard',
    description: 'Book rides and track your journey',
    color: 'orange'
  },
  { 
    id: 'trider', 
    name: 'Trider',
    icon: Bike, 
    route: '/trider/dashboard',
    description: 'Accept ride requests and manage trips',
    color: 'cyan'
  },
  { 
    id: 'dispatcher', 
    name: 'Dispatcher',
    icon: PhoneCall, 
    route: '/dispatcher/dashboard',
    description: 'Coordinate rides and manage operations',
    color: 'yellow'
  },
  { 
    id: 'admin', 
    name: 'Admin',
    icon: Settings, 
    route: '/admin/dashboard',
    description: 'Oversee system and access all features',
    color: 'green'
  }
];