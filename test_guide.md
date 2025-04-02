# TriGo Testing Guide

This guide provides step-by-step instructions for testing the TriGo platform's features across different user roles.

## Prerequisites

- Node.js 20.19 or higher
- npm installed
- Running local development server:
  ```bash
  npm run dev
  ```
- Access URLs:
  - Local: http://localhost:3000 (or http://localhost:3001)
  - Network: http://192.168.1.101:3000 (or :3001)

## Test Accounts

### Passenger Account
```
Email: passenger.test@trigo.ph
Password: Passenger123!
```

### Trider Accounts
```
Email: trider1.test@trigo.ph
Password: Trider123!
```
```
Email: trider2.test@trigo.ph
Password: Trider123!
```

### Dispatcher Account
```
Email: dispatcher.test@trigo.ph
Password: Dispatcher123!
```

### Administrator Account
```
Email: admin.test@trigo.ph
Password: Admin123!
```

## Testing Workflows

### 1. Passenger Booking Flow

1. **Login**
   - Navigate to http://localhost:3000
   - Login with passenger credentials
   - Verify redirect to passenger dashboard

2. **Location Selection**
   - Test current location detection
   - Search for addresses in Talon Kuatro
   - Try saving a favorite location
   - Select from terminal exits

3. **Booking Process**
   - Set pickup and drop-off points
   - Verify fare estimation
   - Confirm booking
   - Track ride status

4. **Ride Completion**
   - Monitor trider approach
   - Track ride progress
   - Verify ride completion
   - Check trip history

### 2. Trider Operations

1. **Login & Status**
   - Access http://localhost:3000/trider/dashboard
   - Login with trider credentials
   - Toggle online status
   - Verify queue position

2. **Ride Management**
   - Wait for incoming requests
   - Accept a ride request
   - Navigate to pickup point
   - Mark passenger as picked up
   - Complete the ride

3. **Location Updates**
   - Enable location services
   - Verify location tracking
   - Check map updates
   - Monitor position accuracy

### 3. Dispatcher Operations

1. **Dashboard Access**
   - Visit http://localhost:3000/dispatcher/dashboard
   - Login with dispatcher credentials
   - Verify real-time updates

2. **Queue Management**
   - Monitor trider queue
   - Check online/offline status
   - Verify queue positions
   - Track active rides

3. **Ride Monitoring**
   - View pending requests
   - Track active rides
   - Monitor completion status
   - Check ride history

### 4. Administrator Tasks

1. **System Management**
   - Access admin dashboard
   - Review user accounts
   - Check system settings
   - Monitor analytics

2. **Location Management**
   - Update terminal locations
   - Manage popular destinations
   - Configure service areas
   - Set boundaries

## Testing Scenarios

### Basic Flow
1. Passenger books a ride
2. Trider goes online
3. Dispatcher monitors queue
4. Trider accepts ride
5. Complete the journey
6. Verify all updates

### Map Features Testing

1. **Map Loading**
   - Verify map loads correctly on all pages
   - Check loading indicators appear
   - Confirm map centers on correct location
   - Test fallback behavior when maps fail to load

2. **Marker Testing**
   - Verify different marker types (pickup, dropoff, terminal)
   - Check marker animations work
   - Test marker click behavior
   - Verify info windows display correctly

3. **Location Selection**
   - Test place search autocomplete
   - Verify current location detection
   - Check saved location selection
   - Test terminal exit selection

4. **Map Interaction**
   - Test pan and zoom controls
   - Verify bounds adjustment with multiple markers
   - Check map style and controls visibility
   - Test marker clustering if applicable

### Edge Cases

1. **Location Services**
   - Test with location permissions denied
   - Check behavior with inaccurate GPS
   - Verify timeout handling
   - Test offline behavior

2. **Map Loading Issues**
   - Test with slow connections
   - Check API key errors
   - Verify quota exceeded handling
   - Test browser compatibility

3. **Invalid Coordinates**
   - Test with null coordinates
   - Check out-of-bounds coordinates
   - Verify NaN handling
   - Test with invalid data types

### Performance Testing

1. **Response Times**
   - Page load speed
   - Real-time updates
   - Map rendering
   - Location searches

2. **Concurrent Users**
   - Multiple active triders
   - Multiple bookings
   - Queue management
   - System stability

## Common Issues & Solutions

### Location Services
- Enable location permissions
- Clear browser cache
- Refresh the page
- Try different browsers

### Authentication
- Clear cookies
- Try incognito mode
- Check credentials
- Verify email confirmation

### Map Issues
- Zoom level problems
- Marker not showing
- Route not displaying
- Location inaccuracy

### Map Loading Problems
1. **Blank Map**
   - Check console for API key errors
   - Verify billing is enabled
   - Clear browser cache
   - Check network connectivity

2. **Marker Issues**
   - Refresh the page
   - Check coordinate validity
   - Verify marker creation timing
   - Clear and recreate markers

3. **Location Detection**
   - Enable location services
   - Check HTTPS requirement
   - Try different browsers
   - Update browser settings

4. **Performance Issues**
   - Reduce number of markers
   - Optimize map options
   - Check memory usage
   - Monitor API quotas

## Map Testing Checklist

### Passenger App
- [ ] Map loads on booking page
- [ ] Location search works
- [ ] Markers appear correctly
- [ ] Info windows function
- [ ] Current location works
- [ ] Route display works

### Trider App
- [ ] Live location updates
- [ ] Route navigation works
- [ ] Terminal markers visible
- [ ] Location tracking accurate
- [ ] Map updates in real-time

### Dispatcher App
- [ ] All triders visible
- [ ] Terminal coverage clear
- [ ] Real-time updates work
- [ ] Multiple markers handled
- [ ] Map bounds correct

## Reporting Bugs

When reporting issues:
1. Describe the expected behavior
2. Detail the actual behavior
3. List reproduction steps
4. Include error messages
5. Add screenshots if possible
6. Note the test account used

## Contact Support

For technical assistance:
- Email: support@trigo.ph
- Create GitHub issue
- Join Discord community

## Version Information

- Next.js: 15.2.4
- Node.js: 20.19
- Testing Environment: Local Development
- Last Updated: April 2025 