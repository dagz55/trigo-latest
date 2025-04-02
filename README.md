# TriGo - Location-based TODA Ride Hailing App

TriGo is a modern ride-hailing platform specifically designed for Tricycle Operators and Drivers Associations (TODA) in the Philippines. The application connects passengers with local tricycle drivers, providing an efficient, affordable, and accessible transportation solution.

![TriGo Logo](public/images/trigologo1.png)

## Features

### Multi-role System
- **Passengers**: Book rides, track triders, save locations
- **Triders**: Manage ride requests, track earnings, update status
- **Dispatchers**: Monitor operations, manage queue, track rides
- **Administrators**: System configuration, user management, analytics

### Smart Location Services
- Real-time location tracking
- Auto-detection for pickup locations
- Place search with Google Maps integration
- Terminal exit selection
- Saved locations management
- Popular destinations

### Ride Management
- Intelligent queue system for triders
- Real-time ride tracking
- Accurate fare estimation
- Multiple payment options
- Ride history and analytics
- Status updates and notifications

### Enhanced User Experience
- Modern, responsive design
- Dark mode support
- Real-time updates
- Interactive maps
- Smooth animations
- Cross-device compatibility

## Recent Refactoring (April 2025)

A significant refactoring effort was undertaken to improve the application's stability, error handling, and maintainability. Key improvements include:
- Migration to the latest Supabase SSR library for authentication.
- Enhanced error handling across components and API routes using standardized responses and user-friendly toast notifications.
- Improved type safety throughout the codebase.
- Added more detailed logging for easier debugging.
- Resolved various build errors and component-specific bugs.
- (See `CHANGELOG.md` for detailed changes)

## Technologies

- **Frontend**: 
  - Next.js 15.2.4 (App Router)
  - React with TypeScript
  - Tailwind CSS for styling
  - shadcn/ui components
  - @googlemaps/react-wrapper for Maps integration

- **Backend**:
  - Supabase (PostgreSQL)
  - Real-time subscriptions
  - Row Level Security
  - PostGIS for location data

- **Maps & Location**:
  - Google Maps JavaScript API
  - Places API for location search
  - Geocoding API for address lookup
  - Distance Matrix API for fare calculation
  - Custom markers and info windows
  - Real-time location tracking
  - Fallback demo mode for testing

- **Authentication**:
  - Supabase Auth
  - Role-based access control
  - Secure sessions

## Getting Started

### Prerequisites

- Node.js 20.19 or higher
- npm or yarn
- Supabase account
- Google Maps API key with:
  - Maps JavaScript API
  - Places API
  - Geocoding API
  - Distance Matrix API

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/dagz55/trigo.git
   cd trigo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. Configure Google Maps:
   - Enable required APIs in Google Cloud Console
   - Set API key restrictions to your domain
   - Add billing information if required

### Running the App

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Access the application:
   - Local: http://localhost:3000 (or :3001 if 3000 is in use)
   - Network: http://192.168.1.101:3000 (or :3001)

### Test Accounts

#### Passenger
```
Email: passenger.test@trigo.ph
Password: Passenger123!
```

#### Trider
```
Email: trider1.test@trigo.ph
Password: Trider123!
```
```
Email: trider2.test@trigo.ph
Password: Trider123!
```

#### Dispatcher
```
Email: dispatcher.test@trigo.ph
Password: Dispatcher123!
```

#### Administrator
```
Email: admin.test@trigo.ph
Password: Admin123!
```

## Documentation

- [Passenger Guide](README_passengers.md)
- [Trider Guide](README_triders.md)
- [Dispatcher Guide](README_dispatchers.md)
- [Administrator Guide](README_admin.md)

## Development

### Project Structure
```
trigo/
├── app/                 # Next.js app router pages
├── components/          # React components
├── contexts/           # React contexts
├── lib/                # Utility functions
├── public/             # Static assets
├── styles/            # Global styles
└── supabase/          # Database migrations
```

### Key Components
- `app/`: Route handlers and page components
- `components/`: Reusable UI components
- `lib/`: Helper functions and API clients
- `supabase/`: Database schema and migrations

## Support

For technical support or feature requests:
- Create an issue in the repository
- Contact support@trigo.ph
- Join our Discord community

## License

Copyright © 2025 TriGo. All rights reserved.
