# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
## [Unreleased]

## [0.2.0] - 2025-04-13

### Added
- **Mapping & Location Features:**
    - Integrated Google Maps for displaying maps and routes.
    - Implemented Place Autocomplete for easy address searching.
    - Added Location Detection capabilities.
    - Developed components for passenger booking flow involving maps (e.g., setting pickup/dropoff).
    - Introduced components for displaying popular destinations, saved locations, and terminal exits.
    - Created API routes for map-related functionalities (`/api/maps`, `/api/maps-proxy`, `/api/maps-url`).
- **Database:**
    - Added `locations` table and related functions to store and manage location data (See `supabase/migrations/`).
- **Loading States:**
    - Implemented various loading indicators (spinners, overlays, full-page loaders) for improved user experience during data fetching and transitions.
    - Added demo pages for different loading styles.
- **Supabase Integration:**
    - Added Supabase health check endpoint (`/api/supabase-health`).
    - Included pages for testing Supabase functionality (`/supabase-test`).
- **UI Enhancements:**
    - Expanded the UI component library based on Shadcn UI.
    - Developed role-specific dashboards and navigation (`Admin`, `Dispatcher`, `Passenger`, `Trider`).
- **Enhanced Map Features:**
    - Added @googlemaps/react-wrapper for better map integration
    - Implemented custom marker icons with animations
    - Added improved info windows with styled content
    - Implemented map loading states and error handling
    - Added fallback demo mode for testing
    - Added coordinate validation and bounds management
    - Implemented map style customization
    - Added real-time location tracking improvements

### Changed
- **Error Handling & Logging:**
    - Refactored core components (`AuthForm`, `PassengerBooking`, `TriderDashboard`, `DispatcherDashboard`) and Supabase client utilities (`lib/supabase-client.ts`) for improved error handling (using `try...catch`, throwing errors consistently) and user feedback (using `sonner` toasts).
    - Standardized API route error responses (`/api/maps`, `/api/maps-proxy`, `/api/auth/callback`) to use JSON format and appropriate HTTP status codes (e.g., 500).
    - Added more detailed console logging for debugging key operations (authentication, data fetching, status updates, API route execution).
    - Improved real-time subscription setup in dashboards with basic error handling.
- **Code Refactoring & Consistency:**
    - Updated data fetching, status updates, and assignment logic in dashboards (`TriderDashboard`, `DispatcherDashboard`) to align with the database schema (correct table/column names) and use utility functions from `lib/supabase-client.ts`.
    - Improved type safety across components by replacing `any` with specific types (`UserProfile`, `RideRequest`, `Trider`, etc.).
    - Switched from `useToast` hook to direct `sonner` import for consistency.
- **Map Component Updates:**
    - Improved map initialization process
    - Enhanced marker management system
    - Updated location validation logic
    - Improved error handling and user feedback
    - Enhanced map loading performance
    - Updated map styling and controls

### Deprecated
- *(Add details of deprecated features here)*

### Removed
- Removed unused "Remember Me" checkbox functionality from `AuthForm`.
- Removed unused `getAddressFromCoordinates` function from `PassengerBooking`.
- Identified `/api/maps-url` and `/api/maps-proxy` as likely unused (pending confirmation/removal).

### Fixed
- **Supabase Integration:** Migrated authentication flow from deprecated `@supabase/auth-helpers-nextjs` to the current `@supabase/ssr` package, resolving build errors and ensuring future compatibility. Updated `middleware.ts` and `app/auth/callback/route.ts`.
- **Build Errors:** Resolved various build failures caused by incorrect module imports (`@/lib/supabase-instance`, `@supabase/auth-helpers-nextjs`), missing `"use client"` directives (`app/auth/page.tsx`), and TypeScript errors introduced during refactoring.
- **Component Bugs:**
    - Fixed type mismatch (`UserLocation` vs `Location`) when setting default pickup in `PassengerBooking`.
    - Corrected map marker update logic in `PassengerBooking` to use object state instead of string state.
    - Resolved JSX structure errors and type errors in `TriderDashboard` and `DispatcherDashboard` (including map marker types).
    - Fixed incorrect toast call signature in `TriderDashboard`.
    - Fixed syntax error (`/"use client"`) in `AuthForm`.
- **Accessibility:** Added missing `aria-label` to role selection dropdown in `AuthForm`.
- **Map Component Issues:**
    - Map loading issues with API key validation
    - Marker animation and cleanup
    - Info window content styling
    - Map center and zoom handling
    - Location coordinate validation
    - Map bounds calculation
    - Performance issues with multiple markers

### Security
- Added API key restrictions and validation
- Improved location data handling
- Updated map loading security measures
- Implemented secure cookie handling in middleware
- Enhanced authentication flow with proper session management

## [0.1.0] - 2025-03-15

### Added
- Initial release with basic functionality
- Core application structure
- Multi-role system (Passenger, Trider, Dispatcher, Admin)
- Basic authentication with Supabase
