
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime,
  createParam,
} = require('./runtime/wasm.js')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/robertsuarez/clone-trigo-v5/trigo-latest/prisma/generated/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "darwin-arm64",
        "native": true
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "sourceFilePath": "/Users/robertsuarez/clone-trigo-v5/trigo-latest/prisma/schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../..",
  "clientVersion": "6.6.0",
  "engineVersion": "f676762280b54cd07c770017ed3711ddde35f37a",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\ngenerator client {\n  provider        = \"prisma-client-js\"\n  output          = \"./generated/client\"\n  previewFeatures = [\"driverAdapters\"]\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_URL\")\n}\n\nenum LocationType {\n  terminal\n  custom\n}\n\nenum TriderStatus {\n  offline\n  online\n  busy\n}\n\nenum RideStatus {\n  pending\n  accepted\n  picked_up\n  completed\n  cancelled\n  waiting_for_trider\n}\n\nmodel Toda {\n  id            String            @id @default(uuid())\n  name          String\n  city          String\n  barangay      String\n  created_at    DateTime          @default(now())\n  updated_at    DateTime          @updatedAt\n  locations     Location[]\n  triders       Trider[]\n  queue_items   TriderQueueItem[]\n  ride_requests RideRequest[]\n}\n\nmodel Location {\n  id               String        @id @default(uuid())\n  name             String\n  address          String\n  latitude         Float\n  longitude        Float\n  city             String\n  barangay         String\n  type             String // terminal or custom\n  toda_id          String?\n  toda             Toda?         @relation(fields: [toda_id], references: [id])\n  created_at       DateTime      @default(now())\n  updated_at       DateTime      @updatedAt\n  pickup_requests  RideRequest[] @relation(\"PickupLocation\")\n  dropoff_requests RideRequest[] @relation(\"DropoffLocation\")\n}\n\nmodel Trider {\n  id                String            @id @default(uuid())\n  user_id           String\n  toda_id           String\n  toda              Toda              @relation(fields: [toda_id], references: [id])\n  first_name        String\n  last_name         String\n  contact_number    String\n  plate_number      String\n  license_number    String\n  status            String // offline, online, busy\n  current_latitude  Float?\n  current_longitude Float?\n  last_online       DateTime?\n  created_at        DateTime          @default(now())\n  updated_at        DateTime          @updatedAt\n  queue_items       TriderQueueItem[]\n  ride_requests     RideRequest[]\n}\n\nmodel TriderQueueItem {\n  id             String   @id @default(uuid())\n  trider_id      String\n  trider         Trider   @relation(fields: [trider_id], references: [id])\n  toda_id        String\n  toda           Toda     @relation(fields: [toda_id], references: [id])\n  queue_position Int\n  joined_at      DateTime @default(now())\n}\n\nmodel RideRequest {\n  id                  String    @id @default(uuid())\n  booking_code        String    @unique\n  passenger_id        String\n  toda_id             String\n  toda                Toda      @relation(fields: [toda_id], references: [id])\n  pickup_location_id  String\n  pickup_location     Location  @relation(\"PickupLocation\", fields: [pickup_location_id], references: [id])\n  dropoff_location_id String\n  dropoff_location    Location  @relation(\"DropoffLocation\", fields: [dropoff_location_id], references: [id])\n  status              String // pending, accepted, picked_up, completed, cancelled\n  estimated_fare      Float\n  estimated_time      Int\n  route_distance      Float?\n  route_duration      Float?\n  route_geometry      String?\n  trider_id           String?\n  trider              Trider?   @relation(fields: [trider_id], references: [id])\n  created_at          DateTime  @default(now())\n  accepted_at         DateTime?\n  picked_up_at        DateTime?\n  completed_at        DateTime?\n  cancelled_at        DateTime?\n  cancellation_reason String?\n}\n",
  "inlineSchemaHash": "23f23dad8ebff331e85c606733eb5aa3f4590da95fddcaaad50d4c1689b77ae9",
  "copyEngine": false
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"Toda\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"city\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"barangay\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"locations\",\"kind\":\"object\",\"type\":\"Location\",\"relationName\":\"LocationToToda\"},{\"name\":\"triders\",\"kind\":\"object\",\"type\":\"Trider\",\"relationName\":\"TodaToTrider\"},{\"name\":\"queue_items\",\"kind\":\"object\",\"type\":\"TriderQueueItem\",\"relationName\":\"TodaToTriderQueueItem\"},{\"name\":\"ride_requests\",\"kind\":\"object\",\"type\":\"RideRequest\",\"relationName\":\"RideRequestToToda\"}],\"dbName\":null},\"Location\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"address\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"latitude\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"longitude\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"city\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"barangay\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"toda_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"toda\",\"kind\":\"object\",\"type\":\"Toda\",\"relationName\":\"LocationToToda\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"pickup_requests\",\"kind\":\"object\",\"type\":\"RideRequest\",\"relationName\":\"PickupLocation\"},{\"name\":\"dropoff_requests\",\"kind\":\"object\",\"type\":\"RideRequest\",\"relationName\":\"DropoffLocation\"}],\"dbName\":null},\"Trider\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"toda_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"toda\",\"kind\":\"object\",\"type\":\"Toda\",\"relationName\":\"TodaToTrider\"},{\"name\":\"first_name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"last_name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contact_number\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"plate_number\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"license_number\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"current_latitude\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"current_longitude\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"last_online\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"updated_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"queue_items\",\"kind\":\"object\",\"type\":\"TriderQueueItem\",\"relationName\":\"TriderToTriderQueueItem\"},{\"name\":\"ride_requests\",\"kind\":\"object\",\"type\":\"RideRequest\",\"relationName\":\"RideRequestToTrider\"}],\"dbName\":null},\"TriderQueueItem\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"trider_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"trider\",\"kind\":\"object\",\"type\":\"Trider\",\"relationName\":\"TriderToTriderQueueItem\"},{\"name\":\"toda_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"toda\",\"kind\":\"object\",\"type\":\"Toda\",\"relationName\":\"TodaToTriderQueueItem\"},{\"name\":\"queue_position\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"joined_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"}],\"dbName\":null},\"RideRequest\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"booking_code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"passenger_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"toda_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"toda\",\"kind\":\"object\",\"type\":\"Toda\",\"relationName\":\"RideRequestToToda\"},{\"name\":\"pickup_location_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"pickup_location\",\"kind\":\"object\",\"type\":\"Location\",\"relationName\":\"PickupLocation\"},{\"name\":\"dropoff_location_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"dropoff_location\",\"kind\":\"object\",\"type\":\"Location\",\"relationName\":\"DropoffLocation\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"estimated_fare\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"estimated_time\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"route_distance\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"route_duration\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"route_geometry\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"trider_id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"trider\",\"kind\":\"object\",\"type\":\"Trider\",\"relationName\":\"RideRequestToTrider\"},{\"name\":\"created_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"accepted_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"picked_up_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"completed_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"cancelled_at\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"cancellation_reason\",\"kind\":\"scalar\",\"type\":\"String\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined
config.compilerWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

