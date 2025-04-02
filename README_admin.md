# TriGo Administrator Guide

This guide provides instructions for system administrators managing the TriGo platform.

## Key Features for Administrators

- **User Management**:
  - View and manage all user accounts:
    - Passengers
    - Triders
    - Dispatchers
  - Monitor user activity and status
  - Handle account issues and access control

- **TODA Management**:
  - Configure TODA details and coverage areas
  - Manage terminal locations and exits
  - Set operating parameters
  - Monitor TODA performance

- **Location Management**:
  - Add and update terminal locations
  - Manage popular destinations
  - Configure pickup/drop-off points
  - Set coverage boundaries

- **System Configuration**:
  - Fare calculation settings
  - Queue management rules
  - Operating hours
  - Service area boundaries
  - Map settings

- **Monitoring & Analytics**:
  - Real-time system status
  - User activity metrics
  - Ride statistics
  - Performance analytics
  - Error monitoring

## Getting Started

1. **Login**: Access the Admin dashboard at http://localhost:3000/admin using your credentials:
   ```
   Email: admin.test@trigo.ph
   Password: Admin123!
   ```

2. **Dashboard Navigation**:
   - System Overview
   - User Management
   - TODA Settings
   - Location Management
   - Configuration
   - Reports

3. **Key Tasks**:
   - Monitor system health
   - Manage user accounts
   - Configure TODA settings
   - Update locations
   - Generate reports
   - Handle support issues

## Database Management

The system uses Supabase with the following main tables:

- **Users**: Authentication and user profiles
- **TODA**: TODA information and settings
- **Locations**: All location-related data
- **Triders**: Trider profiles and status
- **Dispatchers**: Dispatcher accounts
- **Rides**: Ride history and tracking
- **Queue**: Trider queue management

## Security Considerations

- Regularly review user permissions
- Monitor system access logs
- Backup database regularly
- Update security settings
- Handle sensitive data appropriately

## Support Procedures

1. **User Issues**:
   - Review account status
   - Check activity logs
   - Verify permissions
   - Reset credentials if needed

2. **System Issues**:
   - Check error logs
   - Monitor performance
   - Review configuration
   - Update settings as needed

3. **Emergency Procedures**:
   - System backup
   - Critical error handling
   - Service restoration
   - User communication

## Maintenance Tasks

- Regular system updates
- Database optimization
- Performance monitoring
- Security audits
- Backup verification
