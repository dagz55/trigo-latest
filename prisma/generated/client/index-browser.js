
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.TodaScalarFieldEnum = {
  id: 'id',
  name: 'name',
  city: 'city',
  barangay: 'barangay',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.LocationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  address: 'address',
  latitude: 'latitude',
  longitude: 'longitude',
  city: 'city',
  barangay: 'barangay',
  type: 'type',
  toda_id: 'toda_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.TriderScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  toda_id: 'toda_id',
  first_name: 'first_name',
  last_name: 'last_name',
  contact_number: 'contact_number',
  plate_number: 'plate_number',
  license_number: 'license_number',
  status: 'status',
  current_latitude: 'current_latitude',
  current_longitude: 'current_longitude',
  last_online: 'last_online',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.TriderQueueItemScalarFieldEnum = {
  id: 'id',
  trider_id: 'trider_id',
  toda_id: 'toda_id',
  queue_position: 'queue_position',
  joined_at: 'joined_at'
};

exports.Prisma.RideRequestScalarFieldEnum = {
  id: 'id',
  booking_code: 'booking_code',
  passenger_id: 'passenger_id',
  toda_id: 'toda_id',
  pickup_location_id: 'pickup_location_id',
  dropoff_location_id: 'dropoff_location_id',
  pickup_name: 'pickup_name',
  pickup_address: 'pickup_address',
  pickup_latitude: 'pickup_latitude',
  pickup_longitude: 'pickup_longitude',
  dropoff_name: 'dropoff_name',
  dropoff_address: 'dropoff_address',
  dropoff_latitude: 'dropoff_latitude',
  dropoff_longitude: 'dropoff_longitude',
  status: 'status',
  estimated_fare: 'estimated_fare',
  estimated_time: 'estimated_time',
  route_distance: 'route_distance',
  route_duration: 'route_duration',
  route_geometry: 'route_geometry',
  trider_id: 'trider_id',
  created_at: 'created_at',
  accepted_at: 'accepted_at',
  picked_up_at: 'picked_up_at',
  completed_at: 'completed_at',
  cancelled_at: 'cancelled_at',
  cancellation_reason: 'cancellation_reason'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.LocationType = exports.$Enums.LocationType = {
  terminal: 'terminal',
  custom: 'custom'
};

exports.TriderStatus = exports.$Enums.TriderStatus = {
  offline: 'offline',
  online: 'online',
  busy: 'busy'
};

exports.RideStatus = exports.$Enums.RideStatus = {
  pending: 'pending',
  accepted: 'accepted',
  picked_up: 'picked_up',
  completed: 'completed',
  cancelled: 'cancelled',
  waiting_for_trider: 'waiting_for_trider'
};

exports.Prisma.ModelName = {
  Toda: 'Toda',
  Location: 'Location',
  Trider: 'Trider',
  TriderQueueItem: 'TriderQueueItem',
  RideRequest: 'RideRequest'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
