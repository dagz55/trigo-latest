# TriGo - Location-based TODA Ride Hailing App

TriGo is a modern ride-hailing platform specifically designed for Tricycle Operators and Drivers Associations (TODA) in the Philippines. The application connects passengers with local tricycle drivers, providing an efficient, affordable, and accessible transportation solution.

![TriGo Logo](public/images/trigo-logo.png)

## Features

### Multi-role System

- **Passengers**: Book rides, track triders, save locations
- **Triders**: Manage ride requests, track earnings, update status
- **Dispatchers**: Monitor operations, manage queue, track rides
- **Administrators**: System configuration, user management, analytics

### Smart Location Services

- Real-time location tracking
- Auto-detection for pickup locations
- Place search with Mapbox integration
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

## Recent Updates (April 2025)

A significant refactoring and enhancement effort was undertaken to improve the application's stability, error handling, and maintainability. Key improvements include:

- Migration to the latest Supabase SSR library for authentication
- Enhanced error handling across components and API routes using standardized responses and user-friendly toast notifications
- Improved type safety throughout the codebase
- Added more detailed logging for easier debugging
- Enhanced map features with custom markers, animations, and improved error handling
- Implemented various loading indicators for better user experience
- Resolved various build errors and component-specific bugs
- (See `CHANGELOG.md` for detailed changes)

## Technologies

- **Frontend**:
  - Next.js 15.2.4 (App Router)
  - React 18.2.0 with TypeScript 5
  - Tailwind CSS 3.4.17 for styling
  - shadcn/ui components
  - Mapbox GL for mapping capabilities

- **Backend**:
  - Supabase (PostgreSQL)
  - Prisma ORM 6.6.0
  - Real-time subscriptions
  - Row Level Security
  - PostGIS for location data

- **Maps & Location**:
  - Mapbox GL JS for interactive maps
  - Mapbox Geocoding API for location search
  - Mapbox Directions API for route planning
  - Mapbox Matrix API for fare and time calculation
  - Custom markers and popups
  - Real-time location tracking
  - Fallback demo mode for testing

- **Authentication**:
  - Supabase Auth
  - Role-based access control
  - Secure sessions

## Getting Started

### Prerequisites

- Node.js 20.19 or higher
- npm, yarn, or pnpm
- Supabase account
- Mapbox access token with:
  - Maps API
  - Geocoding API
  - Directions API
  - Matrix API

### Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/dagz55/trigo-latest.git
   cd trigo-latest
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Create `.env.local` file:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
   ```

4. Configure Mapbox:
   - Create a Mapbox account at mapbox.com
   - Create a new access token with the required scopes
   - Set token restrictions to your domain if needed

### Running the App

1. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

2. Access the application:
   - Local: [http://localhost:3000](http://localhost:3000) (or :3001 if 3000 is in use)
   - Network: [http://192.168.1.101:3000](http://192.168.1.101:3000) (or :3001)

### Test Accounts

#### Passenger

```text
Email: passenger.test@trigo.ph
Password: Passenger123!
```

#### Trider

```text
Email: trider1.test@trigo.ph
Password: Trider123!
```

```text
Email: trider2.test@trigo.ph
Password: Trider123!
```

#### Dispatcher

```text
Email: dispatcher.test@trigo.ph
Password: Dispatcher123!
```

#### Administrator

```text
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

```text
trigo-latest/
├── app/                 # Next.js app router pages
├── components/          # React components
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── prisma/              # Prisma ORM schema and client
├── public/              # Static assets
├── styles/              # Global styles
├── supabase/            # Database migrations
└── types/               # TypeScript type definitions
```

### Key Components

- `app/`: Route handlers and page components
- `components/`: Reusable UI components
- `components/ui/`: UI component library based on shadcn/ui
- `lib/`: Helper functions and API clients
- `prisma/`: Database schema and client
- `supabase/`: Database schema and migrations

## Support

For technical support or feature requests:

- Create an issue in the repository
- Contact [support@trigo.ph](mailto:support@trigo.ph)
- Join our Discord community

## License

Copyright © 2025 TriGo. All rights reserved.

Last updated: April 13, 2025
