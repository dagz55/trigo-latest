
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Toda
 * 
 */
export type Toda = $Result.DefaultSelection<Prisma.$TodaPayload>
/**
 * Model Location
 * 
 */
export type Location = $Result.DefaultSelection<Prisma.$LocationPayload>
/**
 * Model Trider
 * 
 */
export type Trider = $Result.DefaultSelection<Prisma.$TriderPayload>
/**
 * Model TriderQueueItem
 * 
 */
export type TriderQueueItem = $Result.DefaultSelection<Prisma.$TriderQueueItemPayload>
/**
 * Model RideRequest
 * 
 */
export type RideRequest = $Result.DefaultSelection<Prisma.$RideRequestPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const LocationType: {
  terminal: 'terminal',
  custom: 'custom'
};

export type LocationType = (typeof LocationType)[keyof typeof LocationType]


export const TriderStatus: {
  offline: 'offline',
  online: 'online',
  busy: 'busy'
};

export type TriderStatus = (typeof TriderStatus)[keyof typeof TriderStatus]


export const RideStatus: {
  pending: 'pending',
  accepted: 'accepted',
  picked_up: 'picked_up',
  completed: 'completed',
  cancelled: 'cancelled',
  waiting_for_trider: 'waiting_for_trider'
};

export type RideStatus = (typeof RideStatus)[keyof typeof RideStatus]

}

export type LocationType = $Enums.LocationType

export const LocationType: typeof $Enums.LocationType

export type TriderStatus = $Enums.TriderStatus

export const TriderStatus: typeof $Enums.TriderStatus

export type RideStatus = $Enums.RideStatus

export const RideStatus: typeof $Enums.RideStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Todas
 * const todas = await prisma.toda.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Todas
   * const todas = await prisma.toda.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.toda`: Exposes CRUD operations for the **Toda** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Todas
    * const todas = await prisma.toda.findMany()
    * ```
    */
  get toda(): Prisma.TodaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.location`: Exposes CRUD operations for the **Location** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Locations
    * const locations = await prisma.location.findMany()
    * ```
    */
  get location(): Prisma.LocationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trider`: Exposes CRUD operations for the **Trider** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Triders
    * const triders = await prisma.trider.findMany()
    * ```
    */
  get trider(): Prisma.TriderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.triderQueueItem`: Exposes CRUD operations for the **TriderQueueItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TriderQueueItems
    * const triderQueueItems = await prisma.triderQueueItem.findMany()
    * ```
    */
  get triderQueueItem(): Prisma.TriderQueueItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rideRequest`: Exposes CRUD operations for the **RideRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RideRequests
    * const rideRequests = await prisma.rideRequest.findMany()
    * ```
    */
  get rideRequest(): Prisma.RideRequestDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Toda: 'Toda',
    Location: 'Location',
    Trider: 'Trider',
    TriderQueueItem: 'TriderQueueItem',
    RideRequest: 'RideRequest'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "toda" | "location" | "trider" | "triderQueueItem" | "rideRequest"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Toda: {
        payload: Prisma.$TodaPayload<ExtArgs>
        fields: Prisma.TodaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TodaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TodaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TodaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TodaPayload>
          }
          findFirst: {
            args: Prisma.TodaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TodaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TodaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TodaPayload>
          }
          findMany: {
            args: Prisma.TodaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TodaPayload>[]
          }
          create: {
            args: Prisma.TodaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TodaPayload>
          }
          createMany: {
            args: Prisma.TodaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TodaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TodaPayload>[]
          }
          delete: {
            args: Prisma.TodaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TodaPayload>
          }
          update: {
            args: Prisma.TodaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TodaPayload>
          }
          deleteMany: {
            args: Prisma.TodaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TodaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TodaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TodaPayload>[]
          }
          upsert: {
            args: Prisma.TodaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TodaPayload>
          }
          aggregate: {
            args: Prisma.TodaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateToda>
          }
          groupBy: {
            args: Prisma.TodaGroupByArgs<ExtArgs>
            result: $Utils.Optional<TodaGroupByOutputType>[]
          }
          count: {
            args: Prisma.TodaCountArgs<ExtArgs>
            result: $Utils.Optional<TodaCountAggregateOutputType> | number
          }
        }
      }
      Location: {
        payload: Prisma.$LocationPayload<ExtArgs>
        fields: Prisma.LocationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findFirst: {
            args: Prisma.LocationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          findMany: {
            args: Prisma.LocationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          create: {
            args: Prisma.LocationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          createMany: {
            args: Prisma.LocationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          delete: {
            args: Prisma.LocationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          update: {
            args: Prisma.LocationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          deleteMany: {
            args: Prisma.LocationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>[]
          }
          upsert: {
            args: Prisma.LocationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPayload>
          }
          aggregate: {
            args: Prisma.LocationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocation>
          }
          groupBy: {
            args: Prisma.LocationGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationCountArgs<ExtArgs>
            result: $Utils.Optional<LocationCountAggregateOutputType> | number
          }
        }
      }
      Trider: {
        payload: Prisma.$TriderPayload<ExtArgs>
        fields: Prisma.TriderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TriderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TriderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderPayload>
          }
          findFirst: {
            args: Prisma.TriderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TriderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderPayload>
          }
          findMany: {
            args: Prisma.TriderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderPayload>[]
          }
          create: {
            args: Prisma.TriderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderPayload>
          }
          createMany: {
            args: Prisma.TriderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TriderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderPayload>[]
          }
          delete: {
            args: Prisma.TriderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderPayload>
          }
          update: {
            args: Prisma.TriderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderPayload>
          }
          deleteMany: {
            args: Prisma.TriderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TriderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TriderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderPayload>[]
          }
          upsert: {
            args: Prisma.TriderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderPayload>
          }
          aggregate: {
            args: Prisma.TriderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrider>
          }
          groupBy: {
            args: Prisma.TriderGroupByArgs<ExtArgs>
            result: $Utils.Optional<TriderGroupByOutputType>[]
          }
          count: {
            args: Prisma.TriderCountArgs<ExtArgs>
            result: $Utils.Optional<TriderCountAggregateOutputType> | number
          }
        }
      }
      TriderQueueItem: {
        payload: Prisma.$TriderQueueItemPayload<ExtArgs>
        fields: Prisma.TriderQueueItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TriderQueueItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderQueueItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TriderQueueItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderQueueItemPayload>
          }
          findFirst: {
            args: Prisma.TriderQueueItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderQueueItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TriderQueueItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderQueueItemPayload>
          }
          findMany: {
            args: Prisma.TriderQueueItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderQueueItemPayload>[]
          }
          create: {
            args: Prisma.TriderQueueItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderQueueItemPayload>
          }
          createMany: {
            args: Prisma.TriderQueueItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TriderQueueItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderQueueItemPayload>[]
          }
          delete: {
            args: Prisma.TriderQueueItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderQueueItemPayload>
          }
          update: {
            args: Prisma.TriderQueueItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderQueueItemPayload>
          }
          deleteMany: {
            args: Prisma.TriderQueueItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TriderQueueItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TriderQueueItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderQueueItemPayload>[]
          }
          upsert: {
            args: Prisma.TriderQueueItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TriderQueueItemPayload>
          }
          aggregate: {
            args: Prisma.TriderQueueItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTriderQueueItem>
          }
          groupBy: {
            args: Prisma.TriderQueueItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<TriderQueueItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.TriderQueueItemCountArgs<ExtArgs>
            result: $Utils.Optional<TriderQueueItemCountAggregateOutputType> | number
          }
        }
      }
      RideRequest: {
        payload: Prisma.$RideRequestPayload<ExtArgs>
        fields: Prisma.RideRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RideRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RideRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RideRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RideRequestPayload>
          }
          findFirst: {
            args: Prisma.RideRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RideRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RideRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RideRequestPayload>
          }
          findMany: {
            args: Prisma.RideRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RideRequestPayload>[]
          }
          create: {
            args: Prisma.RideRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RideRequestPayload>
          }
          createMany: {
            args: Prisma.RideRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RideRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RideRequestPayload>[]
          }
          delete: {
            args: Prisma.RideRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RideRequestPayload>
          }
          update: {
            args: Prisma.RideRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RideRequestPayload>
          }
          deleteMany: {
            args: Prisma.RideRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RideRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RideRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RideRequestPayload>[]
          }
          upsert: {
            args: Prisma.RideRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RideRequestPayload>
          }
          aggregate: {
            args: Prisma.RideRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRideRequest>
          }
          groupBy: {
            args: Prisma.RideRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<RideRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.RideRequestCountArgs<ExtArgs>
            result: $Utils.Optional<RideRequestCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    toda?: TodaOmit
    location?: LocationOmit
    trider?: TriderOmit
    triderQueueItem?: TriderQueueItemOmit
    rideRequest?: RideRequestOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TodaCountOutputType
   */

  export type TodaCountOutputType = {
    locations: number
    triders: number
    queue_items: number
    ride_requests: number
  }

  export type TodaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    locations?: boolean | TodaCountOutputTypeCountLocationsArgs
    triders?: boolean | TodaCountOutputTypeCountTridersArgs
    queue_items?: boolean | TodaCountOutputTypeCountQueue_itemsArgs
    ride_requests?: boolean | TodaCountOutputTypeCountRide_requestsArgs
  }

  // Custom InputTypes
  /**
   * TodaCountOutputType without action
   */
  export type TodaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TodaCountOutputType
     */
    select?: TodaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TodaCountOutputType without action
   */
  export type TodaCountOutputTypeCountLocationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
  }

  /**
   * TodaCountOutputType without action
   */
  export type TodaCountOutputTypeCountTridersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TriderWhereInput
  }

  /**
   * TodaCountOutputType without action
   */
  export type TodaCountOutputTypeCountQueue_itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TriderQueueItemWhereInput
  }

  /**
   * TodaCountOutputType without action
   */
  export type TodaCountOutputTypeCountRide_requestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RideRequestWhereInput
  }


  /**
   * Count Type LocationCountOutputType
   */

  export type LocationCountOutputType = {
    pickup_requests: number
    dropoff_requests: number
  }

  export type LocationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pickup_requests?: boolean | LocationCountOutputTypeCountPickup_requestsArgs
    dropoff_requests?: boolean | LocationCountOutputTypeCountDropoff_requestsArgs
  }

  // Custom InputTypes
  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationCountOutputType
     */
    select?: LocationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountPickup_requestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RideRequestWhereInput
  }

  /**
   * LocationCountOutputType without action
   */
  export type LocationCountOutputTypeCountDropoff_requestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RideRequestWhereInput
  }


  /**
   * Count Type TriderCountOutputType
   */

  export type TriderCountOutputType = {
    queue_items: number
    ride_requests: number
  }

  export type TriderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    queue_items?: boolean | TriderCountOutputTypeCountQueue_itemsArgs
    ride_requests?: boolean | TriderCountOutputTypeCountRide_requestsArgs
  }

  // Custom InputTypes
  /**
   * TriderCountOutputType without action
   */
  export type TriderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderCountOutputType
     */
    select?: TriderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TriderCountOutputType without action
   */
  export type TriderCountOutputTypeCountQueue_itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TriderQueueItemWhereInput
  }

  /**
   * TriderCountOutputType without action
   */
  export type TriderCountOutputTypeCountRide_requestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RideRequestWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Toda
   */

  export type AggregateToda = {
    _count: TodaCountAggregateOutputType | null
    _min: TodaMinAggregateOutputType | null
    _max: TodaMaxAggregateOutputType | null
  }

  export type TodaMinAggregateOutputType = {
    id: string | null
    name: string | null
    city: string | null
    barangay: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TodaMaxAggregateOutputType = {
    id: string | null
    name: string | null
    city: string | null
    barangay: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TodaCountAggregateOutputType = {
    id: number
    name: number
    city: number
    barangay: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type TodaMinAggregateInputType = {
    id?: true
    name?: true
    city?: true
    barangay?: true
    created_at?: true
    updated_at?: true
  }

  export type TodaMaxAggregateInputType = {
    id?: true
    name?: true
    city?: true
    barangay?: true
    created_at?: true
    updated_at?: true
  }

  export type TodaCountAggregateInputType = {
    id?: true
    name?: true
    city?: true
    barangay?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type TodaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Toda to aggregate.
     */
    where?: TodaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Todas to fetch.
     */
    orderBy?: TodaOrderByWithRelationInput | TodaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TodaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Todas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Todas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Todas
    **/
    _count?: true | TodaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TodaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TodaMaxAggregateInputType
  }

  export type GetTodaAggregateType<T extends TodaAggregateArgs> = {
        [P in keyof T & keyof AggregateToda]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateToda[P]>
      : GetScalarType<T[P], AggregateToda[P]>
  }




  export type TodaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TodaWhereInput
    orderBy?: TodaOrderByWithAggregationInput | TodaOrderByWithAggregationInput[]
    by: TodaScalarFieldEnum[] | TodaScalarFieldEnum
    having?: TodaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TodaCountAggregateInputType | true
    _min?: TodaMinAggregateInputType
    _max?: TodaMaxAggregateInputType
  }

  export type TodaGroupByOutputType = {
    id: string
    name: string
    city: string
    barangay: string
    created_at: Date
    updated_at: Date
    _count: TodaCountAggregateOutputType | null
    _min: TodaMinAggregateOutputType | null
    _max: TodaMaxAggregateOutputType | null
  }

  type GetTodaGroupByPayload<T extends TodaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TodaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TodaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TodaGroupByOutputType[P]>
            : GetScalarType<T[P], TodaGroupByOutputType[P]>
        }
      >
    >


  export type TodaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    city?: boolean
    barangay?: boolean
    created_at?: boolean
    updated_at?: boolean
    locations?: boolean | Toda$locationsArgs<ExtArgs>
    triders?: boolean | Toda$tridersArgs<ExtArgs>
    queue_items?: boolean | Toda$queue_itemsArgs<ExtArgs>
    ride_requests?: boolean | Toda$ride_requestsArgs<ExtArgs>
    _count?: boolean | TodaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["toda"]>

  export type TodaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    city?: boolean
    barangay?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["toda"]>

  export type TodaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    city?: boolean
    barangay?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["toda"]>

  export type TodaSelectScalar = {
    id?: boolean
    name?: boolean
    city?: boolean
    barangay?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type TodaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "city" | "barangay" | "created_at" | "updated_at", ExtArgs["result"]["toda"]>
  export type TodaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    locations?: boolean | Toda$locationsArgs<ExtArgs>
    triders?: boolean | Toda$tridersArgs<ExtArgs>
    queue_items?: boolean | Toda$queue_itemsArgs<ExtArgs>
    ride_requests?: boolean | Toda$ride_requestsArgs<ExtArgs>
    _count?: boolean | TodaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TodaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type TodaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TodaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Toda"
    objects: {
      locations: Prisma.$LocationPayload<ExtArgs>[]
      triders: Prisma.$TriderPayload<ExtArgs>[]
      queue_items: Prisma.$TriderQueueItemPayload<ExtArgs>[]
      ride_requests: Prisma.$RideRequestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      city: string
      barangay: string
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["toda"]>
    composites: {}
  }

  type TodaGetPayload<S extends boolean | null | undefined | TodaDefaultArgs> = $Result.GetResult<Prisma.$TodaPayload, S>

  type TodaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TodaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TodaCountAggregateInputType | true
    }

  export interface TodaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Toda'], meta: { name: 'Toda' } }
    /**
     * Find zero or one Toda that matches the filter.
     * @param {TodaFindUniqueArgs} args - Arguments to find a Toda
     * @example
     * // Get one Toda
     * const toda = await prisma.toda.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TodaFindUniqueArgs>(args: SelectSubset<T, TodaFindUniqueArgs<ExtArgs>>): Prisma__TodaClient<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Toda that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TodaFindUniqueOrThrowArgs} args - Arguments to find a Toda
     * @example
     * // Get one Toda
     * const toda = await prisma.toda.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TodaFindUniqueOrThrowArgs>(args: SelectSubset<T, TodaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TodaClient<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Toda that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TodaFindFirstArgs} args - Arguments to find a Toda
     * @example
     * // Get one Toda
     * const toda = await prisma.toda.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TodaFindFirstArgs>(args?: SelectSubset<T, TodaFindFirstArgs<ExtArgs>>): Prisma__TodaClient<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Toda that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TodaFindFirstOrThrowArgs} args - Arguments to find a Toda
     * @example
     * // Get one Toda
     * const toda = await prisma.toda.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TodaFindFirstOrThrowArgs>(args?: SelectSubset<T, TodaFindFirstOrThrowArgs<ExtArgs>>): Prisma__TodaClient<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Todas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TodaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Todas
     * const todas = await prisma.toda.findMany()
     * 
     * // Get first 10 Todas
     * const todas = await prisma.toda.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const todaWithIdOnly = await prisma.toda.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TodaFindManyArgs>(args?: SelectSubset<T, TodaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Toda.
     * @param {TodaCreateArgs} args - Arguments to create a Toda.
     * @example
     * // Create one Toda
     * const Toda = await prisma.toda.create({
     *   data: {
     *     // ... data to create a Toda
     *   }
     * })
     * 
     */
    create<T extends TodaCreateArgs>(args: SelectSubset<T, TodaCreateArgs<ExtArgs>>): Prisma__TodaClient<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Todas.
     * @param {TodaCreateManyArgs} args - Arguments to create many Todas.
     * @example
     * // Create many Todas
     * const toda = await prisma.toda.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TodaCreateManyArgs>(args?: SelectSubset<T, TodaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Todas and returns the data saved in the database.
     * @param {TodaCreateManyAndReturnArgs} args - Arguments to create many Todas.
     * @example
     * // Create many Todas
     * const toda = await prisma.toda.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Todas and only return the `id`
     * const todaWithIdOnly = await prisma.toda.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TodaCreateManyAndReturnArgs>(args?: SelectSubset<T, TodaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Toda.
     * @param {TodaDeleteArgs} args - Arguments to delete one Toda.
     * @example
     * // Delete one Toda
     * const Toda = await prisma.toda.delete({
     *   where: {
     *     // ... filter to delete one Toda
     *   }
     * })
     * 
     */
    delete<T extends TodaDeleteArgs>(args: SelectSubset<T, TodaDeleteArgs<ExtArgs>>): Prisma__TodaClient<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Toda.
     * @param {TodaUpdateArgs} args - Arguments to update one Toda.
     * @example
     * // Update one Toda
     * const toda = await prisma.toda.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TodaUpdateArgs>(args: SelectSubset<T, TodaUpdateArgs<ExtArgs>>): Prisma__TodaClient<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Todas.
     * @param {TodaDeleteManyArgs} args - Arguments to filter Todas to delete.
     * @example
     * // Delete a few Todas
     * const { count } = await prisma.toda.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TodaDeleteManyArgs>(args?: SelectSubset<T, TodaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Todas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TodaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Todas
     * const toda = await prisma.toda.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TodaUpdateManyArgs>(args: SelectSubset<T, TodaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Todas and returns the data updated in the database.
     * @param {TodaUpdateManyAndReturnArgs} args - Arguments to update many Todas.
     * @example
     * // Update many Todas
     * const toda = await prisma.toda.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Todas and only return the `id`
     * const todaWithIdOnly = await prisma.toda.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TodaUpdateManyAndReturnArgs>(args: SelectSubset<T, TodaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Toda.
     * @param {TodaUpsertArgs} args - Arguments to update or create a Toda.
     * @example
     * // Update or create a Toda
     * const toda = await prisma.toda.upsert({
     *   create: {
     *     // ... data to create a Toda
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Toda we want to update
     *   }
     * })
     */
    upsert<T extends TodaUpsertArgs>(args: SelectSubset<T, TodaUpsertArgs<ExtArgs>>): Prisma__TodaClient<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Todas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TodaCountArgs} args - Arguments to filter Todas to count.
     * @example
     * // Count the number of Todas
     * const count = await prisma.toda.count({
     *   where: {
     *     // ... the filter for the Todas we want to count
     *   }
     * })
    **/
    count<T extends TodaCountArgs>(
      args?: Subset<T, TodaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TodaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Toda.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TodaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TodaAggregateArgs>(args: Subset<T, TodaAggregateArgs>): Prisma.PrismaPromise<GetTodaAggregateType<T>>

    /**
     * Group by Toda.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TodaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TodaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TodaGroupByArgs['orderBy'] }
        : { orderBy?: TodaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TodaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTodaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Toda model
   */
  readonly fields: TodaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Toda.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TodaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    locations<T extends Toda$locationsArgs<ExtArgs> = {}>(args?: Subset<T, Toda$locationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    triders<T extends Toda$tridersArgs<ExtArgs> = {}>(args?: Subset<T, Toda$tridersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    queue_items<T extends Toda$queue_itemsArgs<ExtArgs> = {}>(args?: Subset<T, Toda$queue_itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TriderQueueItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ride_requests<T extends Toda$ride_requestsArgs<ExtArgs> = {}>(args?: Subset<T, Toda$ride_requestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Toda model
   */
  interface TodaFieldRefs {
    readonly id: FieldRef<"Toda", 'String'>
    readonly name: FieldRef<"Toda", 'String'>
    readonly city: FieldRef<"Toda", 'String'>
    readonly barangay: FieldRef<"Toda", 'String'>
    readonly created_at: FieldRef<"Toda", 'DateTime'>
    readonly updated_at: FieldRef<"Toda", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Toda findUnique
   */
  export type TodaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Toda
     */
    select?: TodaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Toda
     */
    omit?: TodaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TodaInclude<ExtArgs> | null
    /**
     * Filter, which Toda to fetch.
     */
    where: TodaWhereUniqueInput
  }

  /**
   * Toda findUniqueOrThrow
   */
  export type TodaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Toda
     */
    select?: TodaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Toda
     */
    omit?: TodaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TodaInclude<ExtArgs> | null
    /**
     * Filter, which Toda to fetch.
     */
    where: TodaWhereUniqueInput
  }

  /**
   * Toda findFirst
   */
  export type TodaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Toda
     */
    select?: TodaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Toda
     */
    omit?: TodaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TodaInclude<ExtArgs> | null
    /**
     * Filter, which Toda to fetch.
     */
    where?: TodaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Todas to fetch.
     */
    orderBy?: TodaOrderByWithRelationInput | TodaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Todas.
     */
    cursor?: TodaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Todas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Todas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Todas.
     */
    distinct?: TodaScalarFieldEnum | TodaScalarFieldEnum[]
  }

  /**
   * Toda findFirstOrThrow
   */
  export type TodaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Toda
     */
    select?: TodaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Toda
     */
    omit?: TodaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TodaInclude<ExtArgs> | null
    /**
     * Filter, which Toda to fetch.
     */
    where?: TodaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Todas to fetch.
     */
    orderBy?: TodaOrderByWithRelationInput | TodaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Todas.
     */
    cursor?: TodaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Todas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Todas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Todas.
     */
    distinct?: TodaScalarFieldEnum | TodaScalarFieldEnum[]
  }

  /**
   * Toda findMany
   */
  export type TodaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Toda
     */
    select?: TodaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Toda
     */
    omit?: TodaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TodaInclude<ExtArgs> | null
    /**
     * Filter, which Todas to fetch.
     */
    where?: TodaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Todas to fetch.
     */
    orderBy?: TodaOrderByWithRelationInput | TodaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Todas.
     */
    cursor?: TodaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Todas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Todas.
     */
    skip?: number
    distinct?: TodaScalarFieldEnum | TodaScalarFieldEnum[]
  }

  /**
   * Toda create
   */
  export type TodaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Toda
     */
    select?: TodaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Toda
     */
    omit?: TodaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TodaInclude<ExtArgs> | null
    /**
     * The data needed to create a Toda.
     */
    data: XOR<TodaCreateInput, TodaUncheckedCreateInput>
  }

  /**
   * Toda createMany
   */
  export type TodaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Todas.
     */
    data: TodaCreateManyInput | TodaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Toda createManyAndReturn
   */
  export type TodaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Toda
     */
    select?: TodaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Toda
     */
    omit?: TodaOmit<ExtArgs> | null
    /**
     * The data used to create many Todas.
     */
    data: TodaCreateManyInput | TodaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Toda update
   */
  export type TodaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Toda
     */
    select?: TodaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Toda
     */
    omit?: TodaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TodaInclude<ExtArgs> | null
    /**
     * The data needed to update a Toda.
     */
    data: XOR<TodaUpdateInput, TodaUncheckedUpdateInput>
    /**
     * Choose, which Toda to update.
     */
    where: TodaWhereUniqueInput
  }

  /**
   * Toda updateMany
   */
  export type TodaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Todas.
     */
    data: XOR<TodaUpdateManyMutationInput, TodaUncheckedUpdateManyInput>
    /**
     * Filter which Todas to update
     */
    where?: TodaWhereInput
    /**
     * Limit how many Todas to update.
     */
    limit?: number
  }

  /**
   * Toda updateManyAndReturn
   */
  export type TodaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Toda
     */
    select?: TodaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Toda
     */
    omit?: TodaOmit<ExtArgs> | null
    /**
     * The data used to update Todas.
     */
    data: XOR<TodaUpdateManyMutationInput, TodaUncheckedUpdateManyInput>
    /**
     * Filter which Todas to update
     */
    where?: TodaWhereInput
    /**
     * Limit how many Todas to update.
     */
    limit?: number
  }

  /**
   * Toda upsert
   */
  export type TodaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Toda
     */
    select?: TodaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Toda
     */
    omit?: TodaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TodaInclude<ExtArgs> | null
    /**
     * The filter to search for the Toda to update in case it exists.
     */
    where: TodaWhereUniqueInput
    /**
     * In case the Toda found by the `where` argument doesn't exist, create a new Toda with this data.
     */
    create: XOR<TodaCreateInput, TodaUncheckedCreateInput>
    /**
     * In case the Toda was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TodaUpdateInput, TodaUncheckedUpdateInput>
  }

  /**
   * Toda delete
   */
  export type TodaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Toda
     */
    select?: TodaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Toda
     */
    omit?: TodaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TodaInclude<ExtArgs> | null
    /**
     * Filter which Toda to delete.
     */
    where: TodaWhereUniqueInput
  }

  /**
   * Toda deleteMany
   */
  export type TodaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Todas to delete
     */
    where?: TodaWhereInput
    /**
     * Limit how many Todas to delete.
     */
    limit?: number
  }

  /**
   * Toda.locations
   */
  export type Toda$locationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    cursor?: LocationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Toda.triders
   */
  export type Toda$tridersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderInclude<ExtArgs> | null
    where?: TriderWhereInput
    orderBy?: TriderOrderByWithRelationInput | TriderOrderByWithRelationInput[]
    cursor?: TriderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TriderScalarFieldEnum | TriderScalarFieldEnum[]
  }

  /**
   * Toda.queue_items
   */
  export type Toda$queue_itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemInclude<ExtArgs> | null
    where?: TriderQueueItemWhereInput
    orderBy?: TriderQueueItemOrderByWithRelationInput | TriderQueueItemOrderByWithRelationInput[]
    cursor?: TriderQueueItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TriderQueueItemScalarFieldEnum | TriderQueueItemScalarFieldEnum[]
  }

  /**
   * Toda.ride_requests
   */
  export type Toda$ride_requestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
    where?: RideRequestWhereInput
    orderBy?: RideRequestOrderByWithRelationInput | RideRequestOrderByWithRelationInput[]
    cursor?: RideRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RideRequestScalarFieldEnum | RideRequestScalarFieldEnum[]
  }

  /**
   * Toda without action
   */
  export type TodaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Toda
     */
    select?: TodaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Toda
     */
    omit?: TodaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TodaInclude<ExtArgs> | null
  }


  /**
   * Model Location
   */

  export type AggregateLocation = {
    _count: LocationCountAggregateOutputType | null
    _avg: LocationAvgAggregateOutputType | null
    _sum: LocationSumAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  export type LocationAvgAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type LocationSumAggregateOutputType = {
    latitude: number | null
    longitude: number | null
  }

  export type LocationMinAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    latitude: number | null
    longitude: number | null
    city: string | null
    barangay: string | null
    type: string | null
    toda_id: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type LocationMaxAggregateOutputType = {
    id: string | null
    name: string | null
    address: string | null
    latitude: number | null
    longitude: number | null
    city: string | null
    barangay: string | null
    type: string | null
    toda_id: string | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type LocationCountAggregateOutputType = {
    id: number
    name: number
    address: number
    latitude: number
    longitude: number
    city: number
    barangay: number
    type: number
    toda_id: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type LocationAvgAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type LocationSumAggregateInputType = {
    latitude?: true
    longitude?: true
  }

  export type LocationMinAggregateInputType = {
    id?: true
    name?: true
    address?: true
    latitude?: true
    longitude?: true
    city?: true
    barangay?: true
    type?: true
    toda_id?: true
    created_at?: true
    updated_at?: true
  }

  export type LocationMaxAggregateInputType = {
    id?: true
    name?: true
    address?: true
    latitude?: true
    longitude?: true
    city?: true
    barangay?: true
    type?: true
    toda_id?: true
    created_at?: true
    updated_at?: true
  }

  export type LocationCountAggregateInputType = {
    id?: true
    name?: true
    address?: true
    latitude?: true
    longitude?: true
    city?: true
    barangay?: true
    type?: true
    toda_id?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type LocationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Location to aggregate.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Locations
    **/
    _count?: true | LocationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationMaxAggregateInputType
  }

  export type GetLocationAggregateType<T extends LocationAggregateArgs> = {
        [P in keyof T & keyof AggregateLocation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocation[P]>
      : GetScalarType<T[P], AggregateLocation[P]>
  }




  export type LocationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationWhereInput
    orderBy?: LocationOrderByWithAggregationInput | LocationOrderByWithAggregationInput[]
    by: LocationScalarFieldEnum[] | LocationScalarFieldEnum
    having?: LocationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationCountAggregateInputType | true
    _avg?: LocationAvgAggregateInputType
    _sum?: LocationSumAggregateInputType
    _min?: LocationMinAggregateInputType
    _max?: LocationMaxAggregateInputType
  }

  export type LocationGroupByOutputType = {
    id: string
    name: string
    address: string
    latitude: number
    longitude: number
    city: string
    barangay: string
    type: string
    toda_id: string | null
    created_at: Date
    updated_at: Date
    _count: LocationCountAggregateOutputType | null
    _avg: LocationAvgAggregateOutputType | null
    _sum: LocationSumAggregateOutputType | null
    _min: LocationMinAggregateOutputType | null
    _max: LocationMaxAggregateOutputType | null
  }

  type GetLocationGroupByPayload<T extends LocationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationGroupByOutputType[P]>
            : GetScalarType<T[P], LocationGroupByOutputType[P]>
        }
      >
    >


  export type LocationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    city?: boolean
    barangay?: boolean
    type?: boolean
    toda_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    toda?: boolean | Location$todaArgs<ExtArgs>
    pickup_requests?: boolean | Location$pickup_requestsArgs<ExtArgs>
    dropoff_requests?: boolean | Location$dropoff_requestsArgs<ExtArgs>
    _count?: boolean | LocationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["location"]>

  export type LocationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    city?: boolean
    barangay?: boolean
    type?: boolean
    toda_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    toda?: boolean | Location$todaArgs<ExtArgs>
  }, ExtArgs["result"]["location"]>

  export type LocationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    city?: boolean
    barangay?: boolean
    type?: boolean
    toda_id?: boolean
    created_at?: boolean
    updated_at?: boolean
    toda?: boolean | Location$todaArgs<ExtArgs>
  }, ExtArgs["result"]["location"]>

  export type LocationSelectScalar = {
    id?: boolean
    name?: boolean
    address?: boolean
    latitude?: boolean
    longitude?: boolean
    city?: boolean
    barangay?: boolean
    type?: boolean
    toda_id?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type LocationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "address" | "latitude" | "longitude" | "city" | "barangay" | "type" | "toda_id" | "created_at" | "updated_at", ExtArgs["result"]["location"]>
  export type LocationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    toda?: boolean | Location$todaArgs<ExtArgs>
    pickup_requests?: boolean | Location$pickup_requestsArgs<ExtArgs>
    dropoff_requests?: boolean | Location$dropoff_requestsArgs<ExtArgs>
    _count?: boolean | LocationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LocationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    toda?: boolean | Location$todaArgs<ExtArgs>
  }
  export type LocationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    toda?: boolean | Location$todaArgs<ExtArgs>
  }

  export type $LocationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Location"
    objects: {
      toda: Prisma.$TodaPayload<ExtArgs> | null
      pickup_requests: Prisma.$RideRequestPayload<ExtArgs>[]
      dropoff_requests: Prisma.$RideRequestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      address: string
      latitude: number
      longitude: number
      city: string
      barangay: string
      type: string
      toda_id: string | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["location"]>
    composites: {}
  }

  type LocationGetPayload<S extends boolean | null | undefined | LocationDefaultArgs> = $Result.GetResult<Prisma.$LocationPayload, S>

  type LocationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocationCountAggregateInputType | true
    }

  export interface LocationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Location'], meta: { name: 'Location' } }
    /**
     * Find zero or one Location that matches the filter.
     * @param {LocationFindUniqueArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationFindUniqueArgs>(args: SelectSubset<T, LocationFindUniqueArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Location that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocationFindUniqueOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationFindFirstArgs>(args?: SelectSubset<T, LocationFindFirstArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Location that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindFirstOrThrowArgs} args - Arguments to find a Location
     * @example
     * // Get one Location
     * const location = await prisma.location.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Locations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Locations
     * const locations = await prisma.location.findMany()
     * 
     * // Get first 10 Locations
     * const locations = await prisma.location.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationWithIdOnly = await prisma.location.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationFindManyArgs>(args?: SelectSubset<T, LocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Location.
     * @param {LocationCreateArgs} args - Arguments to create a Location.
     * @example
     * // Create one Location
     * const Location = await prisma.location.create({
     *   data: {
     *     // ... data to create a Location
     *   }
     * })
     * 
     */
    create<T extends LocationCreateArgs>(args: SelectSubset<T, LocationCreateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Locations.
     * @param {LocationCreateManyArgs} args - Arguments to create many Locations.
     * @example
     * // Create many Locations
     * const location = await prisma.location.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocationCreateManyArgs>(args?: SelectSubset<T, LocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Locations and returns the data saved in the database.
     * @param {LocationCreateManyAndReturnArgs} args - Arguments to create many Locations.
     * @example
     * // Create many Locations
     * const location = await prisma.location.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Locations and only return the `id`
     * const locationWithIdOnly = await prisma.location.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocationCreateManyAndReturnArgs>(args?: SelectSubset<T, LocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Location.
     * @param {LocationDeleteArgs} args - Arguments to delete one Location.
     * @example
     * // Delete one Location
     * const Location = await prisma.location.delete({
     *   where: {
     *     // ... filter to delete one Location
     *   }
     * })
     * 
     */
    delete<T extends LocationDeleteArgs>(args: SelectSubset<T, LocationDeleteArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Location.
     * @param {LocationUpdateArgs} args - Arguments to update one Location.
     * @example
     * // Update one Location
     * const location = await prisma.location.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationUpdateArgs>(args: SelectSubset<T, LocationUpdateArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Locations.
     * @param {LocationDeleteManyArgs} args - Arguments to filter Locations to delete.
     * @example
     * // Delete a few Locations
     * const { count } = await prisma.location.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationDeleteManyArgs>(args?: SelectSubset<T, LocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Locations
     * const location = await prisma.location.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationUpdateManyArgs>(args: SelectSubset<T, LocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Locations and returns the data updated in the database.
     * @param {LocationUpdateManyAndReturnArgs} args - Arguments to update many Locations.
     * @example
     * // Update many Locations
     * const location = await prisma.location.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Locations and only return the `id`
     * const locationWithIdOnly = await prisma.location.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocationUpdateManyAndReturnArgs>(args: SelectSubset<T, LocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Location.
     * @param {LocationUpsertArgs} args - Arguments to update or create a Location.
     * @example
     * // Update or create a Location
     * const location = await prisma.location.upsert({
     *   create: {
     *     // ... data to create a Location
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Location we want to update
     *   }
     * })
     */
    upsert<T extends LocationUpsertArgs>(args: SelectSubset<T, LocationUpsertArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Locations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationCountArgs} args - Arguments to filter Locations to count.
     * @example
     * // Count the number of Locations
     * const count = await prisma.location.count({
     *   where: {
     *     // ... the filter for the Locations we want to count
     *   }
     * })
    **/
    count<T extends LocationCountArgs>(
      args?: Subset<T, LocationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocationAggregateArgs>(args: Subset<T, LocationAggregateArgs>): Prisma.PrismaPromise<GetLocationAggregateType<T>>

    /**
     * Group by Location.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationGroupByArgs['orderBy'] }
        : { orderBy?: LocationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Location model
   */
  readonly fields: LocationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Location.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    toda<T extends Location$todaArgs<ExtArgs> = {}>(args?: Subset<T, Location$todaArgs<ExtArgs>>): Prisma__TodaClient<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    pickup_requests<T extends Location$pickup_requestsArgs<ExtArgs> = {}>(args?: Subset<T, Location$pickup_requestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    dropoff_requests<T extends Location$dropoff_requestsArgs<ExtArgs> = {}>(args?: Subset<T, Location$dropoff_requestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Location model
   */
  interface LocationFieldRefs {
    readonly id: FieldRef<"Location", 'String'>
    readonly name: FieldRef<"Location", 'String'>
    readonly address: FieldRef<"Location", 'String'>
    readonly latitude: FieldRef<"Location", 'Float'>
    readonly longitude: FieldRef<"Location", 'Float'>
    readonly city: FieldRef<"Location", 'String'>
    readonly barangay: FieldRef<"Location", 'String'>
    readonly type: FieldRef<"Location", 'String'>
    readonly toda_id: FieldRef<"Location", 'String'>
    readonly created_at: FieldRef<"Location", 'DateTime'>
    readonly updated_at: FieldRef<"Location", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Location findUnique
   */
  export type LocationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findUniqueOrThrow
   */
  export type LocationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location findFirst
   */
  export type LocationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findFirstOrThrow
   */
  export type LocationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Location to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Locations.
     */
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location findMany
   */
  export type LocationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter, which Locations to fetch.
     */
    where?: LocationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Locations to fetch.
     */
    orderBy?: LocationOrderByWithRelationInput | LocationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Locations.
     */
    cursor?: LocationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Locations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Locations.
     */
    skip?: number
    distinct?: LocationScalarFieldEnum | LocationScalarFieldEnum[]
  }

  /**
   * Location create
   */
  export type LocationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to create a Location.
     */
    data: XOR<LocationCreateInput, LocationUncheckedCreateInput>
  }

  /**
   * Location createMany
   */
  export type LocationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Locations.
     */
    data: LocationCreateManyInput | LocationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Location createManyAndReturn
   */
  export type LocationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * The data used to create many Locations.
     */
    data: LocationCreateManyInput | LocationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Location update
   */
  export type LocationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The data needed to update a Location.
     */
    data: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
    /**
     * Choose, which Location to update.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location updateMany
   */
  export type LocationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Locations.
     */
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyInput>
    /**
     * Filter which Locations to update
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to update.
     */
    limit?: number
  }

  /**
   * Location updateManyAndReturn
   */
  export type LocationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * The data used to update Locations.
     */
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyInput>
    /**
     * Filter which Locations to update
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Location upsert
   */
  export type LocationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * The filter to search for the Location to update in case it exists.
     */
    where: LocationWhereUniqueInput
    /**
     * In case the Location found by the `where` argument doesn't exist, create a new Location with this data.
     */
    create: XOR<LocationCreateInput, LocationUncheckedCreateInput>
    /**
     * In case the Location was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocationUpdateInput, LocationUncheckedUpdateInput>
  }

  /**
   * Location delete
   */
  export type LocationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
    /**
     * Filter which Location to delete.
     */
    where: LocationWhereUniqueInput
  }

  /**
   * Location deleteMany
   */
  export type LocationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Locations to delete
     */
    where?: LocationWhereInput
    /**
     * Limit how many Locations to delete.
     */
    limit?: number
  }

  /**
   * Location.toda
   */
  export type Location$todaArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Toda
     */
    select?: TodaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Toda
     */
    omit?: TodaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TodaInclude<ExtArgs> | null
    where?: TodaWhereInput
  }

  /**
   * Location.pickup_requests
   */
  export type Location$pickup_requestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
    where?: RideRequestWhereInput
    orderBy?: RideRequestOrderByWithRelationInput | RideRequestOrderByWithRelationInput[]
    cursor?: RideRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RideRequestScalarFieldEnum | RideRequestScalarFieldEnum[]
  }

  /**
   * Location.dropoff_requests
   */
  export type Location$dropoff_requestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
    where?: RideRequestWhereInput
    orderBy?: RideRequestOrderByWithRelationInput | RideRequestOrderByWithRelationInput[]
    cursor?: RideRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RideRequestScalarFieldEnum | RideRequestScalarFieldEnum[]
  }

  /**
   * Location without action
   */
  export type LocationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Location
     */
    select?: LocationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Location
     */
    omit?: LocationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationInclude<ExtArgs> | null
  }


  /**
   * Model Trider
   */

  export type AggregateTrider = {
    _count: TriderCountAggregateOutputType | null
    _avg: TriderAvgAggregateOutputType | null
    _sum: TriderSumAggregateOutputType | null
    _min: TriderMinAggregateOutputType | null
    _max: TriderMaxAggregateOutputType | null
  }

  export type TriderAvgAggregateOutputType = {
    current_latitude: number | null
    current_longitude: number | null
  }

  export type TriderSumAggregateOutputType = {
    current_latitude: number | null
    current_longitude: number | null
  }

  export type TriderMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    toda_id: string | null
    first_name: string | null
    last_name: string | null
    contact_number: string | null
    plate_number: string | null
    license_number: string | null
    status: string | null
    current_latitude: number | null
    current_longitude: number | null
    last_online: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TriderMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    toda_id: string | null
    first_name: string | null
    last_name: string | null
    contact_number: string | null
    plate_number: string | null
    license_number: string | null
    status: string | null
    current_latitude: number | null
    current_longitude: number | null
    last_online: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type TriderCountAggregateOutputType = {
    id: number
    user_id: number
    toda_id: number
    first_name: number
    last_name: number
    contact_number: number
    plate_number: number
    license_number: number
    status: number
    current_latitude: number
    current_longitude: number
    last_online: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type TriderAvgAggregateInputType = {
    current_latitude?: true
    current_longitude?: true
  }

  export type TriderSumAggregateInputType = {
    current_latitude?: true
    current_longitude?: true
  }

  export type TriderMinAggregateInputType = {
    id?: true
    user_id?: true
    toda_id?: true
    first_name?: true
    last_name?: true
    contact_number?: true
    plate_number?: true
    license_number?: true
    status?: true
    current_latitude?: true
    current_longitude?: true
    last_online?: true
    created_at?: true
    updated_at?: true
  }

  export type TriderMaxAggregateInputType = {
    id?: true
    user_id?: true
    toda_id?: true
    first_name?: true
    last_name?: true
    contact_number?: true
    plate_number?: true
    license_number?: true
    status?: true
    current_latitude?: true
    current_longitude?: true
    last_online?: true
    created_at?: true
    updated_at?: true
  }

  export type TriderCountAggregateInputType = {
    id?: true
    user_id?: true
    toda_id?: true
    first_name?: true
    last_name?: true
    contact_number?: true
    plate_number?: true
    license_number?: true
    status?: true
    current_latitude?: true
    current_longitude?: true
    last_online?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type TriderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Trider to aggregate.
     */
    where?: TriderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Triders to fetch.
     */
    orderBy?: TriderOrderByWithRelationInput | TriderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TriderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Triders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Triders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Triders
    **/
    _count?: true | TriderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TriderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TriderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TriderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TriderMaxAggregateInputType
  }

  export type GetTriderAggregateType<T extends TriderAggregateArgs> = {
        [P in keyof T & keyof AggregateTrider]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrider[P]>
      : GetScalarType<T[P], AggregateTrider[P]>
  }




  export type TriderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TriderWhereInput
    orderBy?: TriderOrderByWithAggregationInput | TriderOrderByWithAggregationInput[]
    by: TriderScalarFieldEnum[] | TriderScalarFieldEnum
    having?: TriderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TriderCountAggregateInputType | true
    _avg?: TriderAvgAggregateInputType
    _sum?: TriderSumAggregateInputType
    _min?: TriderMinAggregateInputType
    _max?: TriderMaxAggregateInputType
  }

  export type TriderGroupByOutputType = {
    id: string
    user_id: string
    toda_id: string
    first_name: string
    last_name: string
    contact_number: string
    plate_number: string
    license_number: string
    status: string
    current_latitude: number | null
    current_longitude: number | null
    last_online: Date | null
    created_at: Date
    updated_at: Date
    _count: TriderCountAggregateOutputType | null
    _avg: TriderAvgAggregateOutputType | null
    _sum: TriderSumAggregateOutputType | null
    _min: TriderMinAggregateOutputType | null
    _max: TriderMaxAggregateOutputType | null
  }

  type GetTriderGroupByPayload<T extends TriderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TriderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TriderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TriderGroupByOutputType[P]>
            : GetScalarType<T[P], TriderGroupByOutputType[P]>
        }
      >
    >


  export type TriderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    toda_id?: boolean
    first_name?: boolean
    last_name?: boolean
    contact_number?: boolean
    plate_number?: boolean
    license_number?: boolean
    status?: boolean
    current_latitude?: boolean
    current_longitude?: boolean
    last_online?: boolean
    created_at?: boolean
    updated_at?: boolean
    toda?: boolean | TodaDefaultArgs<ExtArgs>
    queue_items?: boolean | Trider$queue_itemsArgs<ExtArgs>
    ride_requests?: boolean | Trider$ride_requestsArgs<ExtArgs>
    _count?: boolean | TriderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trider"]>

  export type TriderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    toda_id?: boolean
    first_name?: boolean
    last_name?: boolean
    contact_number?: boolean
    plate_number?: boolean
    license_number?: boolean
    status?: boolean
    current_latitude?: boolean
    current_longitude?: boolean
    last_online?: boolean
    created_at?: boolean
    updated_at?: boolean
    toda?: boolean | TodaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trider"]>

  export type TriderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    toda_id?: boolean
    first_name?: boolean
    last_name?: boolean
    contact_number?: boolean
    plate_number?: boolean
    license_number?: boolean
    status?: boolean
    current_latitude?: boolean
    current_longitude?: boolean
    last_online?: boolean
    created_at?: boolean
    updated_at?: boolean
    toda?: boolean | TodaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["trider"]>

  export type TriderSelectScalar = {
    id?: boolean
    user_id?: boolean
    toda_id?: boolean
    first_name?: boolean
    last_name?: boolean
    contact_number?: boolean
    plate_number?: boolean
    license_number?: boolean
    status?: boolean
    current_latitude?: boolean
    current_longitude?: boolean
    last_online?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type TriderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "toda_id" | "first_name" | "last_name" | "contact_number" | "plate_number" | "license_number" | "status" | "current_latitude" | "current_longitude" | "last_online" | "created_at" | "updated_at", ExtArgs["result"]["trider"]>
  export type TriderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    toda?: boolean | TodaDefaultArgs<ExtArgs>
    queue_items?: boolean | Trider$queue_itemsArgs<ExtArgs>
    ride_requests?: boolean | Trider$ride_requestsArgs<ExtArgs>
    _count?: boolean | TriderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TriderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    toda?: boolean | TodaDefaultArgs<ExtArgs>
  }
  export type TriderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    toda?: boolean | TodaDefaultArgs<ExtArgs>
  }

  export type $TriderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Trider"
    objects: {
      toda: Prisma.$TodaPayload<ExtArgs>
      queue_items: Prisma.$TriderQueueItemPayload<ExtArgs>[]
      ride_requests: Prisma.$RideRequestPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      toda_id: string
      first_name: string
      last_name: string
      contact_number: string
      plate_number: string
      license_number: string
      status: string
      current_latitude: number | null
      current_longitude: number | null
      last_online: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["trider"]>
    composites: {}
  }

  type TriderGetPayload<S extends boolean | null | undefined | TriderDefaultArgs> = $Result.GetResult<Prisma.$TriderPayload, S>

  type TriderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TriderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TriderCountAggregateInputType | true
    }

  export interface TriderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Trider'], meta: { name: 'Trider' } }
    /**
     * Find zero or one Trider that matches the filter.
     * @param {TriderFindUniqueArgs} args - Arguments to find a Trider
     * @example
     * // Get one Trider
     * const trider = await prisma.trider.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TriderFindUniqueArgs>(args: SelectSubset<T, TriderFindUniqueArgs<ExtArgs>>): Prisma__TriderClient<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Trider that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TriderFindUniqueOrThrowArgs} args - Arguments to find a Trider
     * @example
     * // Get one Trider
     * const trider = await prisma.trider.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TriderFindUniqueOrThrowArgs>(args: SelectSubset<T, TriderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TriderClient<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Trider that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderFindFirstArgs} args - Arguments to find a Trider
     * @example
     * // Get one Trider
     * const trider = await prisma.trider.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TriderFindFirstArgs>(args?: SelectSubset<T, TriderFindFirstArgs<ExtArgs>>): Prisma__TriderClient<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Trider that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderFindFirstOrThrowArgs} args - Arguments to find a Trider
     * @example
     * // Get one Trider
     * const trider = await prisma.trider.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TriderFindFirstOrThrowArgs>(args?: SelectSubset<T, TriderFindFirstOrThrowArgs<ExtArgs>>): Prisma__TriderClient<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Triders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Triders
     * const triders = await prisma.trider.findMany()
     * 
     * // Get first 10 Triders
     * const triders = await prisma.trider.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const triderWithIdOnly = await prisma.trider.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TriderFindManyArgs>(args?: SelectSubset<T, TriderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Trider.
     * @param {TriderCreateArgs} args - Arguments to create a Trider.
     * @example
     * // Create one Trider
     * const Trider = await prisma.trider.create({
     *   data: {
     *     // ... data to create a Trider
     *   }
     * })
     * 
     */
    create<T extends TriderCreateArgs>(args: SelectSubset<T, TriderCreateArgs<ExtArgs>>): Prisma__TriderClient<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Triders.
     * @param {TriderCreateManyArgs} args - Arguments to create many Triders.
     * @example
     * // Create many Triders
     * const trider = await prisma.trider.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TriderCreateManyArgs>(args?: SelectSubset<T, TriderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Triders and returns the data saved in the database.
     * @param {TriderCreateManyAndReturnArgs} args - Arguments to create many Triders.
     * @example
     * // Create many Triders
     * const trider = await prisma.trider.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Triders and only return the `id`
     * const triderWithIdOnly = await prisma.trider.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TriderCreateManyAndReturnArgs>(args?: SelectSubset<T, TriderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Trider.
     * @param {TriderDeleteArgs} args - Arguments to delete one Trider.
     * @example
     * // Delete one Trider
     * const Trider = await prisma.trider.delete({
     *   where: {
     *     // ... filter to delete one Trider
     *   }
     * })
     * 
     */
    delete<T extends TriderDeleteArgs>(args: SelectSubset<T, TriderDeleteArgs<ExtArgs>>): Prisma__TriderClient<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Trider.
     * @param {TriderUpdateArgs} args - Arguments to update one Trider.
     * @example
     * // Update one Trider
     * const trider = await prisma.trider.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TriderUpdateArgs>(args: SelectSubset<T, TriderUpdateArgs<ExtArgs>>): Prisma__TriderClient<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Triders.
     * @param {TriderDeleteManyArgs} args - Arguments to filter Triders to delete.
     * @example
     * // Delete a few Triders
     * const { count } = await prisma.trider.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TriderDeleteManyArgs>(args?: SelectSubset<T, TriderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Triders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Triders
     * const trider = await prisma.trider.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TriderUpdateManyArgs>(args: SelectSubset<T, TriderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Triders and returns the data updated in the database.
     * @param {TriderUpdateManyAndReturnArgs} args - Arguments to update many Triders.
     * @example
     * // Update many Triders
     * const trider = await prisma.trider.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Triders and only return the `id`
     * const triderWithIdOnly = await prisma.trider.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TriderUpdateManyAndReturnArgs>(args: SelectSubset<T, TriderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Trider.
     * @param {TriderUpsertArgs} args - Arguments to update or create a Trider.
     * @example
     * // Update or create a Trider
     * const trider = await prisma.trider.upsert({
     *   create: {
     *     // ... data to create a Trider
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Trider we want to update
     *   }
     * })
     */
    upsert<T extends TriderUpsertArgs>(args: SelectSubset<T, TriderUpsertArgs<ExtArgs>>): Prisma__TriderClient<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Triders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderCountArgs} args - Arguments to filter Triders to count.
     * @example
     * // Count the number of Triders
     * const count = await prisma.trider.count({
     *   where: {
     *     // ... the filter for the Triders we want to count
     *   }
     * })
    **/
    count<T extends TriderCountArgs>(
      args?: Subset<T, TriderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TriderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Trider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TriderAggregateArgs>(args: Subset<T, TriderAggregateArgs>): Prisma.PrismaPromise<GetTriderAggregateType<T>>

    /**
     * Group by Trider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TriderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TriderGroupByArgs['orderBy'] }
        : { orderBy?: TriderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TriderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTriderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Trider model
   */
  readonly fields: TriderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Trider.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TriderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    toda<T extends TodaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TodaDefaultArgs<ExtArgs>>): Prisma__TodaClient<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    queue_items<T extends Trider$queue_itemsArgs<ExtArgs> = {}>(args?: Subset<T, Trider$queue_itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TriderQueueItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ride_requests<T extends Trider$ride_requestsArgs<ExtArgs> = {}>(args?: Subset<T, Trider$ride_requestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Trider model
   */
  interface TriderFieldRefs {
    readonly id: FieldRef<"Trider", 'String'>
    readonly user_id: FieldRef<"Trider", 'String'>
    readonly toda_id: FieldRef<"Trider", 'String'>
    readonly first_name: FieldRef<"Trider", 'String'>
    readonly last_name: FieldRef<"Trider", 'String'>
    readonly contact_number: FieldRef<"Trider", 'String'>
    readonly plate_number: FieldRef<"Trider", 'String'>
    readonly license_number: FieldRef<"Trider", 'String'>
    readonly status: FieldRef<"Trider", 'String'>
    readonly current_latitude: FieldRef<"Trider", 'Float'>
    readonly current_longitude: FieldRef<"Trider", 'Float'>
    readonly last_online: FieldRef<"Trider", 'DateTime'>
    readonly created_at: FieldRef<"Trider", 'DateTime'>
    readonly updated_at: FieldRef<"Trider", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Trider findUnique
   */
  export type TriderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderInclude<ExtArgs> | null
    /**
     * Filter, which Trider to fetch.
     */
    where: TriderWhereUniqueInput
  }

  /**
   * Trider findUniqueOrThrow
   */
  export type TriderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderInclude<ExtArgs> | null
    /**
     * Filter, which Trider to fetch.
     */
    where: TriderWhereUniqueInput
  }

  /**
   * Trider findFirst
   */
  export type TriderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderInclude<ExtArgs> | null
    /**
     * Filter, which Trider to fetch.
     */
    where?: TriderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Triders to fetch.
     */
    orderBy?: TriderOrderByWithRelationInput | TriderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Triders.
     */
    cursor?: TriderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Triders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Triders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Triders.
     */
    distinct?: TriderScalarFieldEnum | TriderScalarFieldEnum[]
  }

  /**
   * Trider findFirstOrThrow
   */
  export type TriderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderInclude<ExtArgs> | null
    /**
     * Filter, which Trider to fetch.
     */
    where?: TriderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Triders to fetch.
     */
    orderBy?: TriderOrderByWithRelationInput | TriderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Triders.
     */
    cursor?: TriderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Triders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Triders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Triders.
     */
    distinct?: TriderScalarFieldEnum | TriderScalarFieldEnum[]
  }

  /**
   * Trider findMany
   */
  export type TriderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderInclude<ExtArgs> | null
    /**
     * Filter, which Triders to fetch.
     */
    where?: TriderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Triders to fetch.
     */
    orderBy?: TriderOrderByWithRelationInput | TriderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Triders.
     */
    cursor?: TriderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Triders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Triders.
     */
    skip?: number
    distinct?: TriderScalarFieldEnum | TriderScalarFieldEnum[]
  }

  /**
   * Trider create
   */
  export type TriderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderInclude<ExtArgs> | null
    /**
     * The data needed to create a Trider.
     */
    data: XOR<TriderCreateInput, TriderUncheckedCreateInput>
  }

  /**
   * Trider createMany
   */
  export type TriderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Triders.
     */
    data: TriderCreateManyInput | TriderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Trider createManyAndReturn
   */
  export type TriderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * The data used to create many Triders.
     */
    data: TriderCreateManyInput | TriderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Trider update
   */
  export type TriderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderInclude<ExtArgs> | null
    /**
     * The data needed to update a Trider.
     */
    data: XOR<TriderUpdateInput, TriderUncheckedUpdateInput>
    /**
     * Choose, which Trider to update.
     */
    where: TriderWhereUniqueInput
  }

  /**
   * Trider updateMany
   */
  export type TriderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Triders.
     */
    data: XOR<TriderUpdateManyMutationInput, TriderUncheckedUpdateManyInput>
    /**
     * Filter which Triders to update
     */
    where?: TriderWhereInput
    /**
     * Limit how many Triders to update.
     */
    limit?: number
  }

  /**
   * Trider updateManyAndReturn
   */
  export type TriderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * The data used to update Triders.
     */
    data: XOR<TriderUpdateManyMutationInput, TriderUncheckedUpdateManyInput>
    /**
     * Filter which Triders to update
     */
    where?: TriderWhereInput
    /**
     * Limit how many Triders to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Trider upsert
   */
  export type TriderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderInclude<ExtArgs> | null
    /**
     * The filter to search for the Trider to update in case it exists.
     */
    where: TriderWhereUniqueInput
    /**
     * In case the Trider found by the `where` argument doesn't exist, create a new Trider with this data.
     */
    create: XOR<TriderCreateInput, TriderUncheckedCreateInput>
    /**
     * In case the Trider was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TriderUpdateInput, TriderUncheckedUpdateInput>
  }

  /**
   * Trider delete
   */
  export type TriderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderInclude<ExtArgs> | null
    /**
     * Filter which Trider to delete.
     */
    where: TriderWhereUniqueInput
  }

  /**
   * Trider deleteMany
   */
  export type TriderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Triders to delete
     */
    where?: TriderWhereInput
    /**
     * Limit how many Triders to delete.
     */
    limit?: number
  }

  /**
   * Trider.queue_items
   */
  export type Trider$queue_itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemInclude<ExtArgs> | null
    where?: TriderQueueItemWhereInput
    orderBy?: TriderQueueItemOrderByWithRelationInput | TriderQueueItemOrderByWithRelationInput[]
    cursor?: TriderQueueItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TriderQueueItemScalarFieldEnum | TriderQueueItemScalarFieldEnum[]
  }

  /**
   * Trider.ride_requests
   */
  export type Trider$ride_requestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
    where?: RideRequestWhereInput
    orderBy?: RideRequestOrderByWithRelationInput | RideRequestOrderByWithRelationInput[]
    cursor?: RideRequestWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RideRequestScalarFieldEnum | RideRequestScalarFieldEnum[]
  }

  /**
   * Trider without action
   */
  export type TriderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderInclude<ExtArgs> | null
  }


  /**
   * Model TriderQueueItem
   */

  export type AggregateTriderQueueItem = {
    _count: TriderQueueItemCountAggregateOutputType | null
    _avg: TriderQueueItemAvgAggregateOutputType | null
    _sum: TriderQueueItemSumAggregateOutputType | null
    _min: TriderQueueItemMinAggregateOutputType | null
    _max: TriderQueueItemMaxAggregateOutputType | null
  }

  export type TriderQueueItemAvgAggregateOutputType = {
    queue_position: number | null
  }

  export type TriderQueueItemSumAggregateOutputType = {
    queue_position: number | null
  }

  export type TriderQueueItemMinAggregateOutputType = {
    id: string | null
    trider_id: string | null
    toda_id: string | null
    queue_position: number | null
    joined_at: Date | null
  }

  export type TriderQueueItemMaxAggregateOutputType = {
    id: string | null
    trider_id: string | null
    toda_id: string | null
    queue_position: number | null
    joined_at: Date | null
  }

  export type TriderQueueItemCountAggregateOutputType = {
    id: number
    trider_id: number
    toda_id: number
    queue_position: number
    joined_at: number
    _all: number
  }


  export type TriderQueueItemAvgAggregateInputType = {
    queue_position?: true
  }

  export type TriderQueueItemSumAggregateInputType = {
    queue_position?: true
  }

  export type TriderQueueItemMinAggregateInputType = {
    id?: true
    trider_id?: true
    toda_id?: true
    queue_position?: true
    joined_at?: true
  }

  export type TriderQueueItemMaxAggregateInputType = {
    id?: true
    trider_id?: true
    toda_id?: true
    queue_position?: true
    joined_at?: true
  }

  export type TriderQueueItemCountAggregateInputType = {
    id?: true
    trider_id?: true
    toda_id?: true
    queue_position?: true
    joined_at?: true
    _all?: true
  }

  export type TriderQueueItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TriderQueueItem to aggregate.
     */
    where?: TriderQueueItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TriderQueueItems to fetch.
     */
    orderBy?: TriderQueueItemOrderByWithRelationInput | TriderQueueItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TriderQueueItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TriderQueueItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TriderQueueItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TriderQueueItems
    **/
    _count?: true | TriderQueueItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TriderQueueItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TriderQueueItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TriderQueueItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TriderQueueItemMaxAggregateInputType
  }

  export type GetTriderQueueItemAggregateType<T extends TriderQueueItemAggregateArgs> = {
        [P in keyof T & keyof AggregateTriderQueueItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTriderQueueItem[P]>
      : GetScalarType<T[P], AggregateTriderQueueItem[P]>
  }




  export type TriderQueueItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TriderQueueItemWhereInput
    orderBy?: TriderQueueItemOrderByWithAggregationInput | TriderQueueItemOrderByWithAggregationInput[]
    by: TriderQueueItemScalarFieldEnum[] | TriderQueueItemScalarFieldEnum
    having?: TriderQueueItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TriderQueueItemCountAggregateInputType | true
    _avg?: TriderQueueItemAvgAggregateInputType
    _sum?: TriderQueueItemSumAggregateInputType
    _min?: TriderQueueItemMinAggregateInputType
    _max?: TriderQueueItemMaxAggregateInputType
  }

  export type TriderQueueItemGroupByOutputType = {
    id: string
    trider_id: string
    toda_id: string
    queue_position: number
    joined_at: Date
    _count: TriderQueueItemCountAggregateOutputType | null
    _avg: TriderQueueItemAvgAggregateOutputType | null
    _sum: TriderQueueItemSumAggregateOutputType | null
    _min: TriderQueueItemMinAggregateOutputType | null
    _max: TriderQueueItemMaxAggregateOutputType | null
  }

  type GetTriderQueueItemGroupByPayload<T extends TriderQueueItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TriderQueueItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TriderQueueItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TriderQueueItemGroupByOutputType[P]>
            : GetScalarType<T[P], TriderQueueItemGroupByOutputType[P]>
        }
      >
    >


  export type TriderQueueItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    trider_id?: boolean
    toda_id?: boolean
    queue_position?: boolean
    joined_at?: boolean
    trider?: boolean | TriderDefaultArgs<ExtArgs>
    toda?: boolean | TodaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["triderQueueItem"]>

  export type TriderQueueItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    trider_id?: boolean
    toda_id?: boolean
    queue_position?: boolean
    joined_at?: boolean
    trider?: boolean | TriderDefaultArgs<ExtArgs>
    toda?: boolean | TodaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["triderQueueItem"]>

  export type TriderQueueItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    trider_id?: boolean
    toda_id?: boolean
    queue_position?: boolean
    joined_at?: boolean
    trider?: boolean | TriderDefaultArgs<ExtArgs>
    toda?: boolean | TodaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["triderQueueItem"]>

  export type TriderQueueItemSelectScalar = {
    id?: boolean
    trider_id?: boolean
    toda_id?: boolean
    queue_position?: boolean
    joined_at?: boolean
  }

  export type TriderQueueItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "trider_id" | "toda_id" | "queue_position" | "joined_at", ExtArgs["result"]["triderQueueItem"]>
  export type TriderQueueItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trider?: boolean | TriderDefaultArgs<ExtArgs>
    toda?: boolean | TodaDefaultArgs<ExtArgs>
  }
  export type TriderQueueItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trider?: boolean | TriderDefaultArgs<ExtArgs>
    toda?: boolean | TodaDefaultArgs<ExtArgs>
  }
  export type TriderQueueItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trider?: boolean | TriderDefaultArgs<ExtArgs>
    toda?: boolean | TodaDefaultArgs<ExtArgs>
  }

  export type $TriderQueueItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TriderQueueItem"
    objects: {
      trider: Prisma.$TriderPayload<ExtArgs>
      toda: Prisma.$TodaPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      trider_id: string
      toda_id: string
      queue_position: number
      joined_at: Date
    }, ExtArgs["result"]["triderQueueItem"]>
    composites: {}
  }

  type TriderQueueItemGetPayload<S extends boolean | null | undefined | TriderQueueItemDefaultArgs> = $Result.GetResult<Prisma.$TriderQueueItemPayload, S>

  type TriderQueueItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TriderQueueItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TriderQueueItemCountAggregateInputType | true
    }

  export interface TriderQueueItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TriderQueueItem'], meta: { name: 'TriderQueueItem' } }
    /**
     * Find zero or one TriderQueueItem that matches the filter.
     * @param {TriderQueueItemFindUniqueArgs} args - Arguments to find a TriderQueueItem
     * @example
     * // Get one TriderQueueItem
     * const triderQueueItem = await prisma.triderQueueItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TriderQueueItemFindUniqueArgs>(args: SelectSubset<T, TriderQueueItemFindUniqueArgs<ExtArgs>>): Prisma__TriderQueueItemClient<$Result.GetResult<Prisma.$TriderQueueItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TriderQueueItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TriderQueueItemFindUniqueOrThrowArgs} args - Arguments to find a TriderQueueItem
     * @example
     * // Get one TriderQueueItem
     * const triderQueueItem = await prisma.triderQueueItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TriderQueueItemFindUniqueOrThrowArgs>(args: SelectSubset<T, TriderQueueItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TriderQueueItemClient<$Result.GetResult<Prisma.$TriderQueueItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TriderQueueItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderQueueItemFindFirstArgs} args - Arguments to find a TriderQueueItem
     * @example
     * // Get one TriderQueueItem
     * const triderQueueItem = await prisma.triderQueueItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TriderQueueItemFindFirstArgs>(args?: SelectSubset<T, TriderQueueItemFindFirstArgs<ExtArgs>>): Prisma__TriderQueueItemClient<$Result.GetResult<Prisma.$TriderQueueItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TriderQueueItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderQueueItemFindFirstOrThrowArgs} args - Arguments to find a TriderQueueItem
     * @example
     * // Get one TriderQueueItem
     * const triderQueueItem = await prisma.triderQueueItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TriderQueueItemFindFirstOrThrowArgs>(args?: SelectSubset<T, TriderQueueItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__TriderQueueItemClient<$Result.GetResult<Prisma.$TriderQueueItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TriderQueueItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderQueueItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TriderQueueItems
     * const triderQueueItems = await prisma.triderQueueItem.findMany()
     * 
     * // Get first 10 TriderQueueItems
     * const triderQueueItems = await prisma.triderQueueItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const triderQueueItemWithIdOnly = await prisma.triderQueueItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TriderQueueItemFindManyArgs>(args?: SelectSubset<T, TriderQueueItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TriderQueueItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TriderQueueItem.
     * @param {TriderQueueItemCreateArgs} args - Arguments to create a TriderQueueItem.
     * @example
     * // Create one TriderQueueItem
     * const TriderQueueItem = await prisma.triderQueueItem.create({
     *   data: {
     *     // ... data to create a TriderQueueItem
     *   }
     * })
     * 
     */
    create<T extends TriderQueueItemCreateArgs>(args: SelectSubset<T, TriderQueueItemCreateArgs<ExtArgs>>): Prisma__TriderQueueItemClient<$Result.GetResult<Prisma.$TriderQueueItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TriderQueueItems.
     * @param {TriderQueueItemCreateManyArgs} args - Arguments to create many TriderQueueItems.
     * @example
     * // Create many TriderQueueItems
     * const triderQueueItem = await prisma.triderQueueItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TriderQueueItemCreateManyArgs>(args?: SelectSubset<T, TriderQueueItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TriderQueueItems and returns the data saved in the database.
     * @param {TriderQueueItemCreateManyAndReturnArgs} args - Arguments to create many TriderQueueItems.
     * @example
     * // Create many TriderQueueItems
     * const triderQueueItem = await prisma.triderQueueItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TriderQueueItems and only return the `id`
     * const triderQueueItemWithIdOnly = await prisma.triderQueueItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TriderQueueItemCreateManyAndReturnArgs>(args?: SelectSubset<T, TriderQueueItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TriderQueueItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TriderQueueItem.
     * @param {TriderQueueItemDeleteArgs} args - Arguments to delete one TriderQueueItem.
     * @example
     * // Delete one TriderQueueItem
     * const TriderQueueItem = await prisma.triderQueueItem.delete({
     *   where: {
     *     // ... filter to delete one TriderQueueItem
     *   }
     * })
     * 
     */
    delete<T extends TriderQueueItemDeleteArgs>(args: SelectSubset<T, TriderQueueItemDeleteArgs<ExtArgs>>): Prisma__TriderQueueItemClient<$Result.GetResult<Prisma.$TriderQueueItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TriderQueueItem.
     * @param {TriderQueueItemUpdateArgs} args - Arguments to update one TriderQueueItem.
     * @example
     * // Update one TriderQueueItem
     * const triderQueueItem = await prisma.triderQueueItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TriderQueueItemUpdateArgs>(args: SelectSubset<T, TriderQueueItemUpdateArgs<ExtArgs>>): Prisma__TriderQueueItemClient<$Result.GetResult<Prisma.$TriderQueueItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TriderQueueItems.
     * @param {TriderQueueItemDeleteManyArgs} args - Arguments to filter TriderQueueItems to delete.
     * @example
     * // Delete a few TriderQueueItems
     * const { count } = await prisma.triderQueueItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TriderQueueItemDeleteManyArgs>(args?: SelectSubset<T, TriderQueueItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TriderQueueItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderQueueItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TriderQueueItems
     * const triderQueueItem = await prisma.triderQueueItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TriderQueueItemUpdateManyArgs>(args: SelectSubset<T, TriderQueueItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TriderQueueItems and returns the data updated in the database.
     * @param {TriderQueueItemUpdateManyAndReturnArgs} args - Arguments to update many TriderQueueItems.
     * @example
     * // Update many TriderQueueItems
     * const triderQueueItem = await prisma.triderQueueItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TriderQueueItems and only return the `id`
     * const triderQueueItemWithIdOnly = await prisma.triderQueueItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TriderQueueItemUpdateManyAndReturnArgs>(args: SelectSubset<T, TriderQueueItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TriderQueueItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TriderQueueItem.
     * @param {TriderQueueItemUpsertArgs} args - Arguments to update or create a TriderQueueItem.
     * @example
     * // Update or create a TriderQueueItem
     * const triderQueueItem = await prisma.triderQueueItem.upsert({
     *   create: {
     *     // ... data to create a TriderQueueItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TriderQueueItem we want to update
     *   }
     * })
     */
    upsert<T extends TriderQueueItemUpsertArgs>(args: SelectSubset<T, TriderQueueItemUpsertArgs<ExtArgs>>): Prisma__TriderQueueItemClient<$Result.GetResult<Prisma.$TriderQueueItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TriderQueueItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderQueueItemCountArgs} args - Arguments to filter TriderQueueItems to count.
     * @example
     * // Count the number of TriderQueueItems
     * const count = await prisma.triderQueueItem.count({
     *   where: {
     *     // ... the filter for the TriderQueueItems we want to count
     *   }
     * })
    **/
    count<T extends TriderQueueItemCountArgs>(
      args?: Subset<T, TriderQueueItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TriderQueueItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TriderQueueItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderQueueItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TriderQueueItemAggregateArgs>(args: Subset<T, TriderQueueItemAggregateArgs>): Prisma.PrismaPromise<GetTriderQueueItemAggregateType<T>>

    /**
     * Group by TriderQueueItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TriderQueueItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TriderQueueItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TriderQueueItemGroupByArgs['orderBy'] }
        : { orderBy?: TriderQueueItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TriderQueueItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTriderQueueItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TriderQueueItem model
   */
  readonly fields: TriderQueueItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TriderQueueItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TriderQueueItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    trider<T extends TriderDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TriderDefaultArgs<ExtArgs>>): Prisma__TriderClient<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    toda<T extends TodaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TodaDefaultArgs<ExtArgs>>): Prisma__TodaClient<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TriderQueueItem model
   */
  interface TriderQueueItemFieldRefs {
    readonly id: FieldRef<"TriderQueueItem", 'String'>
    readonly trider_id: FieldRef<"TriderQueueItem", 'String'>
    readonly toda_id: FieldRef<"TriderQueueItem", 'String'>
    readonly queue_position: FieldRef<"TriderQueueItem", 'Int'>
    readonly joined_at: FieldRef<"TriderQueueItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TriderQueueItem findUnique
   */
  export type TriderQueueItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemInclude<ExtArgs> | null
    /**
     * Filter, which TriderQueueItem to fetch.
     */
    where: TriderQueueItemWhereUniqueInput
  }

  /**
   * TriderQueueItem findUniqueOrThrow
   */
  export type TriderQueueItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemInclude<ExtArgs> | null
    /**
     * Filter, which TriderQueueItem to fetch.
     */
    where: TriderQueueItemWhereUniqueInput
  }

  /**
   * TriderQueueItem findFirst
   */
  export type TriderQueueItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemInclude<ExtArgs> | null
    /**
     * Filter, which TriderQueueItem to fetch.
     */
    where?: TriderQueueItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TriderQueueItems to fetch.
     */
    orderBy?: TriderQueueItemOrderByWithRelationInput | TriderQueueItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TriderQueueItems.
     */
    cursor?: TriderQueueItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TriderQueueItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TriderQueueItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TriderQueueItems.
     */
    distinct?: TriderQueueItemScalarFieldEnum | TriderQueueItemScalarFieldEnum[]
  }

  /**
   * TriderQueueItem findFirstOrThrow
   */
  export type TriderQueueItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemInclude<ExtArgs> | null
    /**
     * Filter, which TriderQueueItem to fetch.
     */
    where?: TriderQueueItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TriderQueueItems to fetch.
     */
    orderBy?: TriderQueueItemOrderByWithRelationInput | TriderQueueItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TriderQueueItems.
     */
    cursor?: TriderQueueItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TriderQueueItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TriderQueueItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TriderQueueItems.
     */
    distinct?: TriderQueueItemScalarFieldEnum | TriderQueueItemScalarFieldEnum[]
  }

  /**
   * TriderQueueItem findMany
   */
  export type TriderQueueItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemInclude<ExtArgs> | null
    /**
     * Filter, which TriderQueueItems to fetch.
     */
    where?: TriderQueueItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TriderQueueItems to fetch.
     */
    orderBy?: TriderQueueItemOrderByWithRelationInput | TriderQueueItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TriderQueueItems.
     */
    cursor?: TriderQueueItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TriderQueueItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TriderQueueItems.
     */
    skip?: number
    distinct?: TriderQueueItemScalarFieldEnum | TriderQueueItemScalarFieldEnum[]
  }

  /**
   * TriderQueueItem create
   */
  export type TriderQueueItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemInclude<ExtArgs> | null
    /**
     * The data needed to create a TriderQueueItem.
     */
    data: XOR<TriderQueueItemCreateInput, TriderQueueItemUncheckedCreateInput>
  }

  /**
   * TriderQueueItem createMany
   */
  export type TriderQueueItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TriderQueueItems.
     */
    data: TriderQueueItemCreateManyInput | TriderQueueItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TriderQueueItem createManyAndReturn
   */
  export type TriderQueueItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * The data used to create many TriderQueueItems.
     */
    data: TriderQueueItemCreateManyInput | TriderQueueItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TriderQueueItem update
   */
  export type TriderQueueItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemInclude<ExtArgs> | null
    /**
     * The data needed to update a TriderQueueItem.
     */
    data: XOR<TriderQueueItemUpdateInput, TriderQueueItemUncheckedUpdateInput>
    /**
     * Choose, which TriderQueueItem to update.
     */
    where: TriderQueueItemWhereUniqueInput
  }

  /**
   * TriderQueueItem updateMany
   */
  export type TriderQueueItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TriderQueueItems.
     */
    data: XOR<TriderQueueItemUpdateManyMutationInput, TriderQueueItemUncheckedUpdateManyInput>
    /**
     * Filter which TriderQueueItems to update
     */
    where?: TriderQueueItemWhereInput
    /**
     * Limit how many TriderQueueItems to update.
     */
    limit?: number
  }

  /**
   * TriderQueueItem updateManyAndReturn
   */
  export type TriderQueueItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * The data used to update TriderQueueItems.
     */
    data: XOR<TriderQueueItemUpdateManyMutationInput, TriderQueueItemUncheckedUpdateManyInput>
    /**
     * Filter which TriderQueueItems to update
     */
    where?: TriderQueueItemWhereInput
    /**
     * Limit how many TriderQueueItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TriderQueueItem upsert
   */
  export type TriderQueueItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemInclude<ExtArgs> | null
    /**
     * The filter to search for the TriderQueueItem to update in case it exists.
     */
    where: TriderQueueItemWhereUniqueInput
    /**
     * In case the TriderQueueItem found by the `where` argument doesn't exist, create a new TriderQueueItem with this data.
     */
    create: XOR<TriderQueueItemCreateInput, TriderQueueItemUncheckedCreateInput>
    /**
     * In case the TriderQueueItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TriderQueueItemUpdateInput, TriderQueueItemUncheckedUpdateInput>
  }

  /**
   * TriderQueueItem delete
   */
  export type TriderQueueItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemInclude<ExtArgs> | null
    /**
     * Filter which TriderQueueItem to delete.
     */
    where: TriderQueueItemWhereUniqueInput
  }

  /**
   * TriderQueueItem deleteMany
   */
  export type TriderQueueItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TriderQueueItems to delete
     */
    where?: TriderQueueItemWhereInput
    /**
     * Limit how many TriderQueueItems to delete.
     */
    limit?: number
  }

  /**
   * TriderQueueItem without action
   */
  export type TriderQueueItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TriderQueueItem
     */
    select?: TriderQueueItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TriderQueueItem
     */
    omit?: TriderQueueItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderQueueItemInclude<ExtArgs> | null
  }


  /**
   * Model RideRequest
   */

  export type AggregateRideRequest = {
    _count: RideRequestCountAggregateOutputType | null
    _avg: RideRequestAvgAggregateOutputType | null
    _sum: RideRequestSumAggregateOutputType | null
    _min: RideRequestMinAggregateOutputType | null
    _max: RideRequestMaxAggregateOutputType | null
  }

  export type RideRequestAvgAggregateOutputType = {
    estimated_fare: number | null
    estimated_time: number | null
    route_distance: number | null
    route_duration: number | null
  }

  export type RideRequestSumAggregateOutputType = {
    estimated_fare: number | null
    estimated_time: number | null
    route_distance: number | null
    route_duration: number | null
  }

  export type RideRequestMinAggregateOutputType = {
    id: string | null
    booking_code: string | null
    passenger_id: string | null
    toda_id: string | null
    pickup_location_id: string | null
    dropoff_location_id: string | null
    status: string | null
    estimated_fare: number | null
    estimated_time: number | null
    route_distance: number | null
    route_duration: number | null
    route_geometry: string | null
    trider_id: string | null
    created_at: Date | null
    accepted_at: Date | null
    picked_up_at: Date | null
    completed_at: Date | null
    cancelled_at: Date | null
    cancellation_reason: string | null
  }

  export type RideRequestMaxAggregateOutputType = {
    id: string | null
    booking_code: string | null
    passenger_id: string | null
    toda_id: string | null
    pickup_location_id: string | null
    dropoff_location_id: string | null
    status: string | null
    estimated_fare: number | null
    estimated_time: number | null
    route_distance: number | null
    route_duration: number | null
    route_geometry: string | null
    trider_id: string | null
    created_at: Date | null
    accepted_at: Date | null
    picked_up_at: Date | null
    completed_at: Date | null
    cancelled_at: Date | null
    cancellation_reason: string | null
  }

  export type RideRequestCountAggregateOutputType = {
    id: number
    booking_code: number
    passenger_id: number
    toda_id: number
    pickup_location_id: number
    dropoff_location_id: number
    status: number
    estimated_fare: number
    estimated_time: number
    route_distance: number
    route_duration: number
    route_geometry: number
    trider_id: number
    created_at: number
    accepted_at: number
    picked_up_at: number
    completed_at: number
    cancelled_at: number
    cancellation_reason: number
    _all: number
  }


  export type RideRequestAvgAggregateInputType = {
    estimated_fare?: true
    estimated_time?: true
    route_distance?: true
    route_duration?: true
  }

  export type RideRequestSumAggregateInputType = {
    estimated_fare?: true
    estimated_time?: true
    route_distance?: true
    route_duration?: true
  }

  export type RideRequestMinAggregateInputType = {
    id?: true
    booking_code?: true
    passenger_id?: true
    toda_id?: true
    pickup_location_id?: true
    dropoff_location_id?: true
    status?: true
    estimated_fare?: true
    estimated_time?: true
    route_distance?: true
    route_duration?: true
    route_geometry?: true
    trider_id?: true
    created_at?: true
    accepted_at?: true
    picked_up_at?: true
    completed_at?: true
    cancelled_at?: true
    cancellation_reason?: true
  }

  export type RideRequestMaxAggregateInputType = {
    id?: true
    booking_code?: true
    passenger_id?: true
    toda_id?: true
    pickup_location_id?: true
    dropoff_location_id?: true
    status?: true
    estimated_fare?: true
    estimated_time?: true
    route_distance?: true
    route_duration?: true
    route_geometry?: true
    trider_id?: true
    created_at?: true
    accepted_at?: true
    picked_up_at?: true
    completed_at?: true
    cancelled_at?: true
    cancellation_reason?: true
  }

  export type RideRequestCountAggregateInputType = {
    id?: true
    booking_code?: true
    passenger_id?: true
    toda_id?: true
    pickup_location_id?: true
    dropoff_location_id?: true
    status?: true
    estimated_fare?: true
    estimated_time?: true
    route_distance?: true
    route_duration?: true
    route_geometry?: true
    trider_id?: true
    created_at?: true
    accepted_at?: true
    picked_up_at?: true
    completed_at?: true
    cancelled_at?: true
    cancellation_reason?: true
    _all?: true
  }

  export type RideRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RideRequest to aggregate.
     */
    where?: RideRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RideRequests to fetch.
     */
    orderBy?: RideRequestOrderByWithRelationInput | RideRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RideRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RideRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RideRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RideRequests
    **/
    _count?: true | RideRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RideRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RideRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RideRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RideRequestMaxAggregateInputType
  }

  export type GetRideRequestAggregateType<T extends RideRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateRideRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRideRequest[P]>
      : GetScalarType<T[P], AggregateRideRequest[P]>
  }




  export type RideRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RideRequestWhereInput
    orderBy?: RideRequestOrderByWithAggregationInput | RideRequestOrderByWithAggregationInput[]
    by: RideRequestScalarFieldEnum[] | RideRequestScalarFieldEnum
    having?: RideRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RideRequestCountAggregateInputType | true
    _avg?: RideRequestAvgAggregateInputType
    _sum?: RideRequestSumAggregateInputType
    _min?: RideRequestMinAggregateInputType
    _max?: RideRequestMaxAggregateInputType
  }

  export type RideRequestGroupByOutputType = {
    id: string
    booking_code: string
    passenger_id: string
    toda_id: string
    pickup_location_id: string
    dropoff_location_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance: number | null
    route_duration: number | null
    route_geometry: string | null
    trider_id: string | null
    created_at: Date
    accepted_at: Date | null
    picked_up_at: Date | null
    completed_at: Date | null
    cancelled_at: Date | null
    cancellation_reason: string | null
    _count: RideRequestCountAggregateOutputType | null
    _avg: RideRequestAvgAggregateOutputType | null
    _sum: RideRequestSumAggregateOutputType | null
    _min: RideRequestMinAggregateOutputType | null
    _max: RideRequestMaxAggregateOutputType | null
  }

  type GetRideRequestGroupByPayload<T extends RideRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RideRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RideRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RideRequestGroupByOutputType[P]>
            : GetScalarType<T[P], RideRequestGroupByOutputType[P]>
        }
      >
    >


  export type RideRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    booking_code?: boolean
    passenger_id?: boolean
    toda_id?: boolean
    pickup_location_id?: boolean
    dropoff_location_id?: boolean
    status?: boolean
    estimated_fare?: boolean
    estimated_time?: boolean
    route_distance?: boolean
    route_duration?: boolean
    route_geometry?: boolean
    trider_id?: boolean
    created_at?: boolean
    accepted_at?: boolean
    picked_up_at?: boolean
    completed_at?: boolean
    cancelled_at?: boolean
    cancellation_reason?: boolean
    toda?: boolean | TodaDefaultArgs<ExtArgs>
    pickup_location?: boolean | LocationDefaultArgs<ExtArgs>
    dropoff_location?: boolean | LocationDefaultArgs<ExtArgs>
    trider?: boolean | RideRequest$triderArgs<ExtArgs>
  }, ExtArgs["result"]["rideRequest"]>

  export type RideRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    booking_code?: boolean
    passenger_id?: boolean
    toda_id?: boolean
    pickup_location_id?: boolean
    dropoff_location_id?: boolean
    status?: boolean
    estimated_fare?: boolean
    estimated_time?: boolean
    route_distance?: boolean
    route_duration?: boolean
    route_geometry?: boolean
    trider_id?: boolean
    created_at?: boolean
    accepted_at?: boolean
    picked_up_at?: boolean
    completed_at?: boolean
    cancelled_at?: boolean
    cancellation_reason?: boolean
    toda?: boolean | TodaDefaultArgs<ExtArgs>
    pickup_location?: boolean | LocationDefaultArgs<ExtArgs>
    dropoff_location?: boolean | LocationDefaultArgs<ExtArgs>
    trider?: boolean | RideRequest$triderArgs<ExtArgs>
  }, ExtArgs["result"]["rideRequest"]>

  export type RideRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    booking_code?: boolean
    passenger_id?: boolean
    toda_id?: boolean
    pickup_location_id?: boolean
    dropoff_location_id?: boolean
    status?: boolean
    estimated_fare?: boolean
    estimated_time?: boolean
    route_distance?: boolean
    route_duration?: boolean
    route_geometry?: boolean
    trider_id?: boolean
    created_at?: boolean
    accepted_at?: boolean
    picked_up_at?: boolean
    completed_at?: boolean
    cancelled_at?: boolean
    cancellation_reason?: boolean
    toda?: boolean | TodaDefaultArgs<ExtArgs>
    pickup_location?: boolean | LocationDefaultArgs<ExtArgs>
    dropoff_location?: boolean | LocationDefaultArgs<ExtArgs>
    trider?: boolean | RideRequest$triderArgs<ExtArgs>
  }, ExtArgs["result"]["rideRequest"]>

  export type RideRequestSelectScalar = {
    id?: boolean
    booking_code?: boolean
    passenger_id?: boolean
    toda_id?: boolean
    pickup_location_id?: boolean
    dropoff_location_id?: boolean
    status?: boolean
    estimated_fare?: boolean
    estimated_time?: boolean
    route_distance?: boolean
    route_duration?: boolean
    route_geometry?: boolean
    trider_id?: boolean
    created_at?: boolean
    accepted_at?: boolean
    picked_up_at?: boolean
    completed_at?: boolean
    cancelled_at?: boolean
    cancellation_reason?: boolean
  }

  export type RideRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "booking_code" | "passenger_id" | "toda_id" | "pickup_location_id" | "dropoff_location_id" | "status" | "estimated_fare" | "estimated_time" | "route_distance" | "route_duration" | "route_geometry" | "trider_id" | "created_at" | "accepted_at" | "picked_up_at" | "completed_at" | "cancelled_at" | "cancellation_reason", ExtArgs["result"]["rideRequest"]>
  export type RideRequestInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    toda?: boolean | TodaDefaultArgs<ExtArgs>
    pickup_location?: boolean | LocationDefaultArgs<ExtArgs>
    dropoff_location?: boolean | LocationDefaultArgs<ExtArgs>
    trider?: boolean | RideRequest$triderArgs<ExtArgs>
  }
  export type RideRequestIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    toda?: boolean | TodaDefaultArgs<ExtArgs>
    pickup_location?: boolean | LocationDefaultArgs<ExtArgs>
    dropoff_location?: boolean | LocationDefaultArgs<ExtArgs>
    trider?: boolean | RideRequest$triderArgs<ExtArgs>
  }
  export type RideRequestIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    toda?: boolean | TodaDefaultArgs<ExtArgs>
    pickup_location?: boolean | LocationDefaultArgs<ExtArgs>
    dropoff_location?: boolean | LocationDefaultArgs<ExtArgs>
    trider?: boolean | RideRequest$triderArgs<ExtArgs>
  }

  export type $RideRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RideRequest"
    objects: {
      toda: Prisma.$TodaPayload<ExtArgs>
      pickup_location: Prisma.$LocationPayload<ExtArgs>
      dropoff_location: Prisma.$LocationPayload<ExtArgs>
      trider: Prisma.$TriderPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      booking_code: string
      passenger_id: string
      toda_id: string
      pickup_location_id: string
      dropoff_location_id: string
      status: string
      estimated_fare: number
      estimated_time: number
      route_distance: number | null
      route_duration: number | null
      route_geometry: string | null
      trider_id: string | null
      created_at: Date
      accepted_at: Date | null
      picked_up_at: Date | null
      completed_at: Date | null
      cancelled_at: Date | null
      cancellation_reason: string | null
    }, ExtArgs["result"]["rideRequest"]>
    composites: {}
  }

  type RideRequestGetPayload<S extends boolean | null | undefined | RideRequestDefaultArgs> = $Result.GetResult<Prisma.$RideRequestPayload, S>

  type RideRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RideRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RideRequestCountAggregateInputType | true
    }

  export interface RideRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RideRequest'], meta: { name: 'RideRequest' } }
    /**
     * Find zero or one RideRequest that matches the filter.
     * @param {RideRequestFindUniqueArgs} args - Arguments to find a RideRequest
     * @example
     * // Get one RideRequest
     * const rideRequest = await prisma.rideRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RideRequestFindUniqueArgs>(args: SelectSubset<T, RideRequestFindUniqueArgs<ExtArgs>>): Prisma__RideRequestClient<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RideRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RideRequestFindUniqueOrThrowArgs} args - Arguments to find a RideRequest
     * @example
     * // Get one RideRequest
     * const rideRequest = await prisma.rideRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RideRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, RideRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RideRequestClient<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RideRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RideRequestFindFirstArgs} args - Arguments to find a RideRequest
     * @example
     * // Get one RideRequest
     * const rideRequest = await prisma.rideRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RideRequestFindFirstArgs>(args?: SelectSubset<T, RideRequestFindFirstArgs<ExtArgs>>): Prisma__RideRequestClient<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RideRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RideRequestFindFirstOrThrowArgs} args - Arguments to find a RideRequest
     * @example
     * // Get one RideRequest
     * const rideRequest = await prisma.rideRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RideRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, RideRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__RideRequestClient<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RideRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RideRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RideRequests
     * const rideRequests = await prisma.rideRequest.findMany()
     * 
     * // Get first 10 RideRequests
     * const rideRequests = await prisma.rideRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rideRequestWithIdOnly = await prisma.rideRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RideRequestFindManyArgs>(args?: SelectSubset<T, RideRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RideRequest.
     * @param {RideRequestCreateArgs} args - Arguments to create a RideRequest.
     * @example
     * // Create one RideRequest
     * const RideRequest = await prisma.rideRequest.create({
     *   data: {
     *     // ... data to create a RideRequest
     *   }
     * })
     * 
     */
    create<T extends RideRequestCreateArgs>(args: SelectSubset<T, RideRequestCreateArgs<ExtArgs>>): Prisma__RideRequestClient<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RideRequests.
     * @param {RideRequestCreateManyArgs} args - Arguments to create many RideRequests.
     * @example
     * // Create many RideRequests
     * const rideRequest = await prisma.rideRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RideRequestCreateManyArgs>(args?: SelectSubset<T, RideRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RideRequests and returns the data saved in the database.
     * @param {RideRequestCreateManyAndReturnArgs} args - Arguments to create many RideRequests.
     * @example
     * // Create many RideRequests
     * const rideRequest = await prisma.rideRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RideRequests and only return the `id`
     * const rideRequestWithIdOnly = await prisma.rideRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RideRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, RideRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RideRequest.
     * @param {RideRequestDeleteArgs} args - Arguments to delete one RideRequest.
     * @example
     * // Delete one RideRequest
     * const RideRequest = await prisma.rideRequest.delete({
     *   where: {
     *     // ... filter to delete one RideRequest
     *   }
     * })
     * 
     */
    delete<T extends RideRequestDeleteArgs>(args: SelectSubset<T, RideRequestDeleteArgs<ExtArgs>>): Prisma__RideRequestClient<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RideRequest.
     * @param {RideRequestUpdateArgs} args - Arguments to update one RideRequest.
     * @example
     * // Update one RideRequest
     * const rideRequest = await prisma.rideRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RideRequestUpdateArgs>(args: SelectSubset<T, RideRequestUpdateArgs<ExtArgs>>): Prisma__RideRequestClient<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RideRequests.
     * @param {RideRequestDeleteManyArgs} args - Arguments to filter RideRequests to delete.
     * @example
     * // Delete a few RideRequests
     * const { count } = await prisma.rideRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RideRequestDeleteManyArgs>(args?: SelectSubset<T, RideRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RideRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RideRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RideRequests
     * const rideRequest = await prisma.rideRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RideRequestUpdateManyArgs>(args: SelectSubset<T, RideRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RideRequests and returns the data updated in the database.
     * @param {RideRequestUpdateManyAndReturnArgs} args - Arguments to update many RideRequests.
     * @example
     * // Update many RideRequests
     * const rideRequest = await prisma.rideRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RideRequests and only return the `id`
     * const rideRequestWithIdOnly = await prisma.rideRequest.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RideRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, RideRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RideRequest.
     * @param {RideRequestUpsertArgs} args - Arguments to update or create a RideRequest.
     * @example
     * // Update or create a RideRequest
     * const rideRequest = await prisma.rideRequest.upsert({
     *   create: {
     *     // ... data to create a RideRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RideRequest we want to update
     *   }
     * })
     */
    upsert<T extends RideRequestUpsertArgs>(args: SelectSubset<T, RideRequestUpsertArgs<ExtArgs>>): Prisma__RideRequestClient<$Result.GetResult<Prisma.$RideRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RideRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RideRequestCountArgs} args - Arguments to filter RideRequests to count.
     * @example
     * // Count the number of RideRequests
     * const count = await prisma.rideRequest.count({
     *   where: {
     *     // ... the filter for the RideRequests we want to count
     *   }
     * })
    **/
    count<T extends RideRequestCountArgs>(
      args?: Subset<T, RideRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RideRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RideRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RideRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RideRequestAggregateArgs>(args: Subset<T, RideRequestAggregateArgs>): Prisma.PrismaPromise<GetRideRequestAggregateType<T>>

    /**
     * Group by RideRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RideRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RideRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RideRequestGroupByArgs['orderBy'] }
        : { orderBy?: RideRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RideRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRideRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RideRequest model
   */
  readonly fields: RideRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RideRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RideRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    toda<T extends TodaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TodaDefaultArgs<ExtArgs>>): Prisma__TodaClient<$Result.GetResult<Prisma.$TodaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    pickup_location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    dropoff_location<T extends LocationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LocationDefaultArgs<ExtArgs>>): Prisma__LocationClient<$Result.GetResult<Prisma.$LocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    trider<T extends RideRequest$triderArgs<ExtArgs> = {}>(args?: Subset<T, RideRequest$triderArgs<ExtArgs>>): Prisma__TriderClient<$Result.GetResult<Prisma.$TriderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RideRequest model
   */
  interface RideRequestFieldRefs {
    readonly id: FieldRef<"RideRequest", 'String'>
    readonly booking_code: FieldRef<"RideRequest", 'String'>
    readonly passenger_id: FieldRef<"RideRequest", 'String'>
    readonly toda_id: FieldRef<"RideRequest", 'String'>
    readonly pickup_location_id: FieldRef<"RideRequest", 'String'>
    readonly dropoff_location_id: FieldRef<"RideRequest", 'String'>
    readonly status: FieldRef<"RideRequest", 'String'>
    readonly estimated_fare: FieldRef<"RideRequest", 'Float'>
    readonly estimated_time: FieldRef<"RideRequest", 'Int'>
    readonly route_distance: FieldRef<"RideRequest", 'Float'>
    readonly route_duration: FieldRef<"RideRequest", 'Float'>
    readonly route_geometry: FieldRef<"RideRequest", 'String'>
    readonly trider_id: FieldRef<"RideRequest", 'String'>
    readonly created_at: FieldRef<"RideRequest", 'DateTime'>
    readonly accepted_at: FieldRef<"RideRequest", 'DateTime'>
    readonly picked_up_at: FieldRef<"RideRequest", 'DateTime'>
    readonly completed_at: FieldRef<"RideRequest", 'DateTime'>
    readonly cancelled_at: FieldRef<"RideRequest", 'DateTime'>
    readonly cancellation_reason: FieldRef<"RideRequest", 'String'>
  }
    

  // Custom InputTypes
  /**
   * RideRequest findUnique
   */
  export type RideRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
    /**
     * Filter, which RideRequest to fetch.
     */
    where: RideRequestWhereUniqueInput
  }

  /**
   * RideRequest findUniqueOrThrow
   */
  export type RideRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
    /**
     * Filter, which RideRequest to fetch.
     */
    where: RideRequestWhereUniqueInput
  }

  /**
   * RideRequest findFirst
   */
  export type RideRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
    /**
     * Filter, which RideRequest to fetch.
     */
    where?: RideRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RideRequests to fetch.
     */
    orderBy?: RideRequestOrderByWithRelationInput | RideRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RideRequests.
     */
    cursor?: RideRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RideRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RideRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RideRequests.
     */
    distinct?: RideRequestScalarFieldEnum | RideRequestScalarFieldEnum[]
  }

  /**
   * RideRequest findFirstOrThrow
   */
  export type RideRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
    /**
     * Filter, which RideRequest to fetch.
     */
    where?: RideRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RideRequests to fetch.
     */
    orderBy?: RideRequestOrderByWithRelationInput | RideRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RideRequests.
     */
    cursor?: RideRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RideRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RideRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RideRequests.
     */
    distinct?: RideRequestScalarFieldEnum | RideRequestScalarFieldEnum[]
  }

  /**
   * RideRequest findMany
   */
  export type RideRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
    /**
     * Filter, which RideRequests to fetch.
     */
    where?: RideRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RideRequests to fetch.
     */
    orderBy?: RideRequestOrderByWithRelationInput | RideRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RideRequests.
     */
    cursor?: RideRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RideRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RideRequests.
     */
    skip?: number
    distinct?: RideRequestScalarFieldEnum | RideRequestScalarFieldEnum[]
  }

  /**
   * RideRequest create
   */
  export type RideRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
    /**
     * The data needed to create a RideRequest.
     */
    data: XOR<RideRequestCreateInput, RideRequestUncheckedCreateInput>
  }

  /**
   * RideRequest createMany
   */
  export type RideRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RideRequests.
     */
    data: RideRequestCreateManyInput | RideRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RideRequest createManyAndReturn
   */
  export type RideRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * The data used to create many RideRequests.
     */
    data: RideRequestCreateManyInput | RideRequestCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RideRequest update
   */
  export type RideRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
    /**
     * The data needed to update a RideRequest.
     */
    data: XOR<RideRequestUpdateInput, RideRequestUncheckedUpdateInput>
    /**
     * Choose, which RideRequest to update.
     */
    where: RideRequestWhereUniqueInput
  }

  /**
   * RideRequest updateMany
   */
  export type RideRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RideRequests.
     */
    data: XOR<RideRequestUpdateManyMutationInput, RideRequestUncheckedUpdateManyInput>
    /**
     * Filter which RideRequests to update
     */
    where?: RideRequestWhereInput
    /**
     * Limit how many RideRequests to update.
     */
    limit?: number
  }

  /**
   * RideRequest updateManyAndReturn
   */
  export type RideRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * The data used to update RideRequests.
     */
    data: XOR<RideRequestUpdateManyMutationInput, RideRequestUncheckedUpdateManyInput>
    /**
     * Filter which RideRequests to update
     */
    where?: RideRequestWhereInput
    /**
     * Limit how many RideRequests to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RideRequest upsert
   */
  export type RideRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
    /**
     * The filter to search for the RideRequest to update in case it exists.
     */
    where: RideRequestWhereUniqueInput
    /**
     * In case the RideRequest found by the `where` argument doesn't exist, create a new RideRequest with this data.
     */
    create: XOR<RideRequestCreateInput, RideRequestUncheckedCreateInput>
    /**
     * In case the RideRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RideRequestUpdateInput, RideRequestUncheckedUpdateInput>
  }

  /**
   * RideRequest delete
   */
  export type RideRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
    /**
     * Filter which RideRequest to delete.
     */
    where: RideRequestWhereUniqueInput
  }

  /**
   * RideRequest deleteMany
   */
  export type RideRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RideRequests to delete
     */
    where?: RideRequestWhereInput
    /**
     * Limit how many RideRequests to delete.
     */
    limit?: number
  }

  /**
   * RideRequest.trider
   */
  export type RideRequest$triderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Trider
     */
    select?: TriderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Trider
     */
    omit?: TriderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TriderInclude<ExtArgs> | null
    where?: TriderWhereInput
  }

  /**
   * RideRequest without action
   */
  export type RideRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RideRequest
     */
    select?: RideRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RideRequest
     */
    omit?: RideRequestOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RideRequestInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TodaScalarFieldEnum: {
    id: 'id',
    name: 'name',
    city: 'city',
    barangay: 'barangay',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type TodaScalarFieldEnum = (typeof TodaScalarFieldEnum)[keyof typeof TodaScalarFieldEnum]


  export const LocationScalarFieldEnum: {
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

  export type LocationScalarFieldEnum = (typeof LocationScalarFieldEnum)[keyof typeof LocationScalarFieldEnum]


  export const TriderScalarFieldEnum: {
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

  export type TriderScalarFieldEnum = (typeof TriderScalarFieldEnum)[keyof typeof TriderScalarFieldEnum]


  export const TriderQueueItemScalarFieldEnum: {
    id: 'id',
    trider_id: 'trider_id',
    toda_id: 'toda_id',
    queue_position: 'queue_position',
    joined_at: 'joined_at'
  };

  export type TriderQueueItemScalarFieldEnum = (typeof TriderQueueItemScalarFieldEnum)[keyof typeof TriderQueueItemScalarFieldEnum]


  export const RideRequestScalarFieldEnum: {
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

  export type RideRequestScalarFieldEnum = (typeof RideRequestScalarFieldEnum)[keyof typeof RideRequestScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type TodaWhereInput = {
    AND?: TodaWhereInput | TodaWhereInput[]
    OR?: TodaWhereInput[]
    NOT?: TodaWhereInput | TodaWhereInput[]
    id?: StringFilter<"Toda"> | string
    name?: StringFilter<"Toda"> | string
    city?: StringFilter<"Toda"> | string
    barangay?: StringFilter<"Toda"> | string
    created_at?: DateTimeFilter<"Toda"> | Date | string
    updated_at?: DateTimeFilter<"Toda"> | Date | string
    locations?: LocationListRelationFilter
    triders?: TriderListRelationFilter
    queue_items?: TriderQueueItemListRelationFilter
    ride_requests?: RideRequestListRelationFilter
  }

  export type TodaOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    barangay?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    locations?: LocationOrderByRelationAggregateInput
    triders?: TriderOrderByRelationAggregateInput
    queue_items?: TriderQueueItemOrderByRelationAggregateInput
    ride_requests?: RideRequestOrderByRelationAggregateInput
  }

  export type TodaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TodaWhereInput | TodaWhereInput[]
    OR?: TodaWhereInput[]
    NOT?: TodaWhereInput | TodaWhereInput[]
    name?: StringFilter<"Toda"> | string
    city?: StringFilter<"Toda"> | string
    barangay?: StringFilter<"Toda"> | string
    created_at?: DateTimeFilter<"Toda"> | Date | string
    updated_at?: DateTimeFilter<"Toda"> | Date | string
    locations?: LocationListRelationFilter
    triders?: TriderListRelationFilter
    queue_items?: TriderQueueItemListRelationFilter
    ride_requests?: RideRequestListRelationFilter
  }, "id">

  export type TodaOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    barangay?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: TodaCountOrderByAggregateInput
    _max?: TodaMaxOrderByAggregateInput
    _min?: TodaMinOrderByAggregateInput
  }

  export type TodaScalarWhereWithAggregatesInput = {
    AND?: TodaScalarWhereWithAggregatesInput | TodaScalarWhereWithAggregatesInput[]
    OR?: TodaScalarWhereWithAggregatesInput[]
    NOT?: TodaScalarWhereWithAggregatesInput | TodaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Toda"> | string
    name?: StringWithAggregatesFilter<"Toda"> | string
    city?: StringWithAggregatesFilter<"Toda"> | string
    barangay?: StringWithAggregatesFilter<"Toda"> | string
    created_at?: DateTimeWithAggregatesFilter<"Toda"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Toda"> | Date | string
  }

  export type LocationWhereInput = {
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    id?: StringFilter<"Location"> | string
    name?: StringFilter<"Location"> | string
    address?: StringFilter<"Location"> | string
    latitude?: FloatFilter<"Location"> | number
    longitude?: FloatFilter<"Location"> | number
    city?: StringFilter<"Location"> | string
    barangay?: StringFilter<"Location"> | string
    type?: StringFilter<"Location"> | string
    toda_id?: StringNullableFilter<"Location"> | string | null
    created_at?: DateTimeFilter<"Location"> | Date | string
    updated_at?: DateTimeFilter<"Location"> | Date | string
    toda?: XOR<TodaNullableScalarRelationFilter, TodaWhereInput> | null
    pickup_requests?: RideRequestListRelationFilter
    dropoff_requests?: RideRequestListRelationFilter
  }

  export type LocationOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    city?: SortOrder
    barangay?: SortOrder
    type?: SortOrder
    toda_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    toda?: TodaOrderByWithRelationInput
    pickup_requests?: RideRequestOrderByRelationAggregateInput
    dropoff_requests?: RideRequestOrderByRelationAggregateInput
  }

  export type LocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LocationWhereInput | LocationWhereInput[]
    OR?: LocationWhereInput[]
    NOT?: LocationWhereInput | LocationWhereInput[]
    name?: StringFilter<"Location"> | string
    address?: StringFilter<"Location"> | string
    latitude?: FloatFilter<"Location"> | number
    longitude?: FloatFilter<"Location"> | number
    city?: StringFilter<"Location"> | string
    barangay?: StringFilter<"Location"> | string
    type?: StringFilter<"Location"> | string
    toda_id?: StringNullableFilter<"Location"> | string | null
    created_at?: DateTimeFilter<"Location"> | Date | string
    updated_at?: DateTimeFilter<"Location"> | Date | string
    toda?: XOR<TodaNullableScalarRelationFilter, TodaWhereInput> | null
    pickup_requests?: RideRequestListRelationFilter
    dropoff_requests?: RideRequestListRelationFilter
  }, "id">

  export type LocationOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    city?: SortOrder
    barangay?: SortOrder
    type?: SortOrder
    toda_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: LocationCountOrderByAggregateInput
    _avg?: LocationAvgOrderByAggregateInput
    _max?: LocationMaxOrderByAggregateInput
    _min?: LocationMinOrderByAggregateInput
    _sum?: LocationSumOrderByAggregateInput
  }

  export type LocationScalarWhereWithAggregatesInput = {
    AND?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    OR?: LocationScalarWhereWithAggregatesInput[]
    NOT?: LocationScalarWhereWithAggregatesInput | LocationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Location"> | string
    name?: StringWithAggregatesFilter<"Location"> | string
    address?: StringWithAggregatesFilter<"Location"> | string
    latitude?: FloatWithAggregatesFilter<"Location"> | number
    longitude?: FloatWithAggregatesFilter<"Location"> | number
    city?: StringWithAggregatesFilter<"Location"> | string
    barangay?: StringWithAggregatesFilter<"Location"> | string
    type?: StringWithAggregatesFilter<"Location"> | string
    toda_id?: StringNullableWithAggregatesFilter<"Location"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Location"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Location"> | Date | string
  }

  export type TriderWhereInput = {
    AND?: TriderWhereInput | TriderWhereInput[]
    OR?: TriderWhereInput[]
    NOT?: TriderWhereInput | TriderWhereInput[]
    id?: StringFilter<"Trider"> | string
    user_id?: StringFilter<"Trider"> | string
    toda_id?: StringFilter<"Trider"> | string
    first_name?: StringFilter<"Trider"> | string
    last_name?: StringFilter<"Trider"> | string
    contact_number?: StringFilter<"Trider"> | string
    plate_number?: StringFilter<"Trider"> | string
    license_number?: StringFilter<"Trider"> | string
    status?: StringFilter<"Trider"> | string
    current_latitude?: FloatNullableFilter<"Trider"> | number | null
    current_longitude?: FloatNullableFilter<"Trider"> | number | null
    last_online?: DateTimeNullableFilter<"Trider"> | Date | string | null
    created_at?: DateTimeFilter<"Trider"> | Date | string
    updated_at?: DateTimeFilter<"Trider"> | Date | string
    toda?: XOR<TodaScalarRelationFilter, TodaWhereInput>
    queue_items?: TriderQueueItemListRelationFilter
    ride_requests?: RideRequestListRelationFilter
  }

  export type TriderOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    toda_id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    contact_number?: SortOrder
    plate_number?: SortOrder
    license_number?: SortOrder
    status?: SortOrder
    current_latitude?: SortOrderInput | SortOrder
    current_longitude?: SortOrderInput | SortOrder
    last_online?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    toda?: TodaOrderByWithRelationInput
    queue_items?: TriderQueueItemOrderByRelationAggregateInput
    ride_requests?: RideRequestOrderByRelationAggregateInput
  }

  export type TriderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TriderWhereInput | TriderWhereInput[]
    OR?: TriderWhereInput[]
    NOT?: TriderWhereInput | TriderWhereInput[]
    user_id?: StringFilter<"Trider"> | string
    toda_id?: StringFilter<"Trider"> | string
    first_name?: StringFilter<"Trider"> | string
    last_name?: StringFilter<"Trider"> | string
    contact_number?: StringFilter<"Trider"> | string
    plate_number?: StringFilter<"Trider"> | string
    license_number?: StringFilter<"Trider"> | string
    status?: StringFilter<"Trider"> | string
    current_latitude?: FloatNullableFilter<"Trider"> | number | null
    current_longitude?: FloatNullableFilter<"Trider"> | number | null
    last_online?: DateTimeNullableFilter<"Trider"> | Date | string | null
    created_at?: DateTimeFilter<"Trider"> | Date | string
    updated_at?: DateTimeFilter<"Trider"> | Date | string
    toda?: XOR<TodaScalarRelationFilter, TodaWhereInput>
    queue_items?: TriderQueueItemListRelationFilter
    ride_requests?: RideRequestListRelationFilter
  }, "id">

  export type TriderOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    toda_id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    contact_number?: SortOrder
    plate_number?: SortOrder
    license_number?: SortOrder
    status?: SortOrder
    current_latitude?: SortOrderInput | SortOrder
    current_longitude?: SortOrderInput | SortOrder
    last_online?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: TriderCountOrderByAggregateInput
    _avg?: TriderAvgOrderByAggregateInput
    _max?: TriderMaxOrderByAggregateInput
    _min?: TriderMinOrderByAggregateInput
    _sum?: TriderSumOrderByAggregateInput
  }

  export type TriderScalarWhereWithAggregatesInput = {
    AND?: TriderScalarWhereWithAggregatesInput | TriderScalarWhereWithAggregatesInput[]
    OR?: TriderScalarWhereWithAggregatesInput[]
    NOT?: TriderScalarWhereWithAggregatesInput | TriderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Trider"> | string
    user_id?: StringWithAggregatesFilter<"Trider"> | string
    toda_id?: StringWithAggregatesFilter<"Trider"> | string
    first_name?: StringWithAggregatesFilter<"Trider"> | string
    last_name?: StringWithAggregatesFilter<"Trider"> | string
    contact_number?: StringWithAggregatesFilter<"Trider"> | string
    plate_number?: StringWithAggregatesFilter<"Trider"> | string
    license_number?: StringWithAggregatesFilter<"Trider"> | string
    status?: StringWithAggregatesFilter<"Trider"> | string
    current_latitude?: FloatNullableWithAggregatesFilter<"Trider"> | number | null
    current_longitude?: FloatNullableWithAggregatesFilter<"Trider"> | number | null
    last_online?: DateTimeNullableWithAggregatesFilter<"Trider"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"Trider"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"Trider"> | Date | string
  }

  export type TriderQueueItemWhereInput = {
    AND?: TriderQueueItemWhereInput | TriderQueueItemWhereInput[]
    OR?: TriderQueueItemWhereInput[]
    NOT?: TriderQueueItemWhereInput | TriderQueueItemWhereInput[]
    id?: StringFilter<"TriderQueueItem"> | string
    trider_id?: StringFilter<"TriderQueueItem"> | string
    toda_id?: StringFilter<"TriderQueueItem"> | string
    queue_position?: IntFilter<"TriderQueueItem"> | number
    joined_at?: DateTimeFilter<"TriderQueueItem"> | Date | string
    trider?: XOR<TriderScalarRelationFilter, TriderWhereInput>
    toda?: XOR<TodaScalarRelationFilter, TodaWhereInput>
  }

  export type TriderQueueItemOrderByWithRelationInput = {
    id?: SortOrder
    trider_id?: SortOrder
    toda_id?: SortOrder
    queue_position?: SortOrder
    joined_at?: SortOrder
    trider?: TriderOrderByWithRelationInput
    toda?: TodaOrderByWithRelationInput
  }

  export type TriderQueueItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TriderQueueItemWhereInput | TriderQueueItemWhereInput[]
    OR?: TriderQueueItemWhereInput[]
    NOT?: TriderQueueItemWhereInput | TriderQueueItemWhereInput[]
    trider_id?: StringFilter<"TriderQueueItem"> | string
    toda_id?: StringFilter<"TriderQueueItem"> | string
    queue_position?: IntFilter<"TriderQueueItem"> | number
    joined_at?: DateTimeFilter<"TriderQueueItem"> | Date | string
    trider?: XOR<TriderScalarRelationFilter, TriderWhereInput>
    toda?: XOR<TodaScalarRelationFilter, TodaWhereInput>
  }, "id">

  export type TriderQueueItemOrderByWithAggregationInput = {
    id?: SortOrder
    trider_id?: SortOrder
    toda_id?: SortOrder
    queue_position?: SortOrder
    joined_at?: SortOrder
    _count?: TriderQueueItemCountOrderByAggregateInput
    _avg?: TriderQueueItemAvgOrderByAggregateInput
    _max?: TriderQueueItemMaxOrderByAggregateInput
    _min?: TriderQueueItemMinOrderByAggregateInput
    _sum?: TriderQueueItemSumOrderByAggregateInput
  }

  export type TriderQueueItemScalarWhereWithAggregatesInput = {
    AND?: TriderQueueItemScalarWhereWithAggregatesInput | TriderQueueItemScalarWhereWithAggregatesInput[]
    OR?: TriderQueueItemScalarWhereWithAggregatesInput[]
    NOT?: TriderQueueItemScalarWhereWithAggregatesInput | TriderQueueItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TriderQueueItem"> | string
    trider_id?: StringWithAggregatesFilter<"TriderQueueItem"> | string
    toda_id?: StringWithAggregatesFilter<"TriderQueueItem"> | string
    queue_position?: IntWithAggregatesFilter<"TriderQueueItem"> | number
    joined_at?: DateTimeWithAggregatesFilter<"TriderQueueItem"> | Date | string
  }

  export type RideRequestWhereInput = {
    AND?: RideRequestWhereInput | RideRequestWhereInput[]
    OR?: RideRequestWhereInput[]
    NOT?: RideRequestWhereInput | RideRequestWhereInput[]
    id?: StringFilter<"RideRequest"> | string
    booking_code?: StringFilter<"RideRequest"> | string
    passenger_id?: StringFilter<"RideRequest"> | string
    toda_id?: StringFilter<"RideRequest"> | string
    pickup_location_id?: StringFilter<"RideRequest"> | string
    dropoff_location_id?: StringFilter<"RideRequest"> | string
    status?: StringFilter<"RideRequest"> | string
    estimated_fare?: FloatFilter<"RideRequest"> | number
    estimated_time?: IntFilter<"RideRequest"> | number
    route_distance?: FloatNullableFilter<"RideRequest"> | number | null
    route_duration?: FloatNullableFilter<"RideRequest"> | number | null
    route_geometry?: StringNullableFilter<"RideRequest"> | string | null
    trider_id?: StringNullableFilter<"RideRequest"> | string | null
    created_at?: DateTimeFilter<"RideRequest"> | Date | string
    accepted_at?: DateTimeNullableFilter<"RideRequest"> | Date | string | null
    picked_up_at?: DateTimeNullableFilter<"RideRequest"> | Date | string | null
    completed_at?: DateTimeNullableFilter<"RideRequest"> | Date | string | null
    cancelled_at?: DateTimeNullableFilter<"RideRequest"> | Date | string | null
    cancellation_reason?: StringNullableFilter<"RideRequest"> | string | null
    toda?: XOR<TodaScalarRelationFilter, TodaWhereInput>
    pickup_location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
    dropoff_location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
    trider?: XOR<TriderNullableScalarRelationFilter, TriderWhereInput> | null
  }

  export type RideRequestOrderByWithRelationInput = {
    id?: SortOrder
    booking_code?: SortOrder
    passenger_id?: SortOrder
    toda_id?: SortOrder
    pickup_location_id?: SortOrder
    dropoff_location_id?: SortOrder
    status?: SortOrder
    estimated_fare?: SortOrder
    estimated_time?: SortOrder
    route_distance?: SortOrderInput | SortOrder
    route_duration?: SortOrderInput | SortOrder
    route_geometry?: SortOrderInput | SortOrder
    trider_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    accepted_at?: SortOrderInput | SortOrder
    picked_up_at?: SortOrderInput | SortOrder
    completed_at?: SortOrderInput | SortOrder
    cancelled_at?: SortOrderInput | SortOrder
    cancellation_reason?: SortOrderInput | SortOrder
    toda?: TodaOrderByWithRelationInput
    pickup_location?: LocationOrderByWithRelationInput
    dropoff_location?: LocationOrderByWithRelationInput
    trider?: TriderOrderByWithRelationInput
  }

  export type RideRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    booking_code?: string
    AND?: RideRequestWhereInput | RideRequestWhereInput[]
    OR?: RideRequestWhereInput[]
    NOT?: RideRequestWhereInput | RideRequestWhereInput[]
    passenger_id?: StringFilter<"RideRequest"> | string
    toda_id?: StringFilter<"RideRequest"> | string
    pickup_location_id?: StringFilter<"RideRequest"> | string
    dropoff_location_id?: StringFilter<"RideRequest"> | string
    status?: StringFilter<"RideRequest"> | string
    estimated_fare?: FloatFilter<"RideRequest"> | number
    estimated_time?: IntFilter<"RideRequest"> | number
    route_distance?: FloatNullableFilter<"RideRequest"> | number | null
    route_duration?: FloatNullableFilter<"RideRequest"> | number | null
    route_geometry?: StringNullableFilter<"RideRequest"> | string | null
    trider_id?: StringNullableFilter<"RideRequest"> | string | null
    created_at?: DateTimeFilter<"RideRequest"> | Date | string
    accepted_at?: DateTimeNullableFilter<"RideRequest"> | Date | string | null
    picked_up_at?: DateTimeNullableFilter<"RideRequest"> | Date | string | null
    completed_at?: DateTimeNullableFilter<"RideRequest"> | Date | string | null
    cancelled_at?: DateTimeNullableFilter<"RideRequest"> | Date | string | null
    cancellation_reason?: StringNullableFilter<"RideRequest"> | string | null
    toda?: XOR<TodaScalarRelationFilter, TodaWhereInput>
    pickup_location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
    dropoff_location?: XOR<LocationScalarRelationFilter, LocationWhereInput>
    trider?: XOR<TriderNullableScalarRelationFilter, TriderWhereInput> | null
  }, "id" | "booking_code">

  export type RideRequestOrderByWithAggregationInput = {
    id?: SortOrder
    booking_code?: SortOrder
    passenger_id?: SortOrder
    toda_id?: SortOrder
    pickup_location_id?: SortOrder
    dropoff_location_id?: SortOrder
    status?: SortOrder
    estimated_fare?: SortOrder
    estimated_time?: SortOrder
    route_distance?: SortOrderInput | SortOrder
    route_duration?: SortOrderInput | SortOrder
    route_geometry?: SortOrderInput | SortOrder
    trider_id?: SortOrderInput | SortOrder
    created_at?: SortOrder
    accepted_at?: SortOrderInput | SortOrder
    picked_up_at?: SortOrderInput | SortOrder
    completed_at?: SortOrderInput | SortOrder
    cancelled_at?: SortOrderInput | SortOrder
    cancellation_reason?: SortOrderInput | SortOrder
    _count?: RideRequestCountOrderByAggregateInput
    _avg?: RideRequestAvgOrderByAggregateInput
    _max?: RideRequestMaxOrderByAggregateInput
    _min?: RideRequestMinOrderByAggregateInput
    _sum?: RideRequestSumOrderByAggregateInput
  }

  export type RideRequestScalarWhereWithAggregatesInput = {
    AND?: RideRequestScalarWhereWithAggregatesInput | RideRequestScalarWhereWithAggregatesInput[]
    OR?: RideRequestScalarWhereWithAggregatesInput[]
    NOT?: RideRequestScalarWhereWithAggregatesInput | RideRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"RideRequest"> | string
    booking_code?: StringWithAggregatesFilter<"RideRequest"> | string
    passenger_id?: StringWithAggregatesFilter<"RideRequest"> | string
    toda_id?: StringWithAggregatesFilter<"RideRequest"> | string
    pickup_location_id?: StringWithAggregatesFilter<"RideRequest"> | string
    dropoff_location_id?: StringWithAggregatesFilter<"RideRequest"> | string
    status?: StringWithAggregatesFilter<"RideRequest"> | string
    estimated_fare?: FloatWithAggregatesFilter<"RideRequest"> | number
    estimated_time?: IntWithAggregatesFilter<"RideRequest"> | number
    route_distance?: FloatNullableWithAggregatesFilter<"RideRequest"> | number | null
    route_duration?: FloatNullableWithAggregatesFilter<"RideRequest"> | number | null
    route_geometry?: StringNullableWithAggregatesFilter<"RideRequest"> | string | null
    trider_id?: StringNullableWithAggregatesFilter<"RideRequest"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"RideRequest"> | Date | string
    accepted_at?: DateTimeNullableWithAggregatesFilter<"RideRequest"> | Date | string | null
    picked_up_at?: DateTimeNullableWithAggregatesFilter<"RideRequest"> | Date | string | null
    completed_at?: DateTimeNullableWithAggregatesFilter<"RideRequest"> | Date | string | null
    cancelled_at?: DateTimeNullableWithAggregatesFilter<"RideRequest"> | Date | string | null
    cancellation_reason?: StringNullableWithAggregatesFilter<"RideRequest"> | string | null
  }

  export type TodaCreateInput = {
    id?: string
    name: string
    city: string
    barangay: string
    created_at?: Date | string
    updated_at?: Date | string
    locations?: LocationCreateNestedManyWithoutTodaInput
    triders?: TriderCreateNestedManyWithoutTodaInput
    queue_items?: TriderQueueItemCreateNestedManyWithoutTodaInput
    ride_requests?: RideRequestCreateNestedManyWithoutTodaInput
  }

  export type TodaUncheckedCreateInput = {
    id?: string
    name: string
    city: string
    barangay: string
    created_at?: Date | string
    updated_at?: Date | string
    locations?: LocationUncheckedCreateNestedManyWithoutTodaInput
    triders?: TriderUncheckedCreateNestedManyWithoutTodaInput
    queue_items?: TriderQueueItemUncheckedCreateNestedManyWithoutTodaInput
    ride_requests?: RideRequestUncheckedCreateNestedManyWithoutTodaInput
  }

  export type TodaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationUpdateManyWithoutTodaNestedInput
    triders?: TriderUpdateManyWithoutTodaNestedInput
    queue_items?: TriderQueueItemUpdateManyWithoutTodaNestedInput
    ride_requests?: RideRequestUpdateManyWithoutTodaNestedInput
  }

  export type TodaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationUncheckedUpdateManyWithoutTodaNestedInput
    triders?: TriderUncheckedUpdateManyWithoutTodaNestedInput
    queue_items?: TriderQueueItemUncheckedUpdateManyWithoutTodaNestedInput
    ride_requests?: RideRequestUncheckedUpdateManyWithoutTodaNestedInput
  }

  export type TodaCreateManyInput = {
    id?: string
    name: string
    city: string
    barangay: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type TodaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TodaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationCreateInput = {
    id?: string
    name: string
    address: string
    latitude: number
    longitude: number
    city: string
    barangay: string
    type: string
    created_at?: Date | string
    updated_at?: Date | string
    toda?: TodaCreateNestedOneWithoutLocationsInput
    pickup_requests?: RideRequestCreateNestedManyWithoutPickup_locationInput
    dropoff_requests?: RideRequestCreateNestedManyWithoutDropoff_locationInput
  }

  export type LocationUncheckedCreateInput = {
    id?: string
    name: string
    address: string
    latitude: number
    longitude: number
    city: string
    barangay: string
    type: string
    toda_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    pickup_requests?: RideRequestUncheckedCreateNestedManyWithoutPickup_locationInput
    dropoff_requests?: RideRequestUncheckedCreateNestedManyWithoutDropoff_locationInput
  }

  export type LocationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    toda?: TodaUpdateOneWithoutLocationsNestedInput
    pickup_requests?: RideRequestUpdateManyWithoutPickup_locationNestedInput
    dropoff_requests?: RideRequestUpdateManyWithoutDropoff_locationNestedInput
  }

  export type LocationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    toda_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    pickup_requests?: RideRequestUncheckedUpdateManyWithoutPickup_locationNestedInput
    dropoff_requests?: RideRequestUncheckedUpdateManyWithoutDropoff_locationNestedInput
  }

  export type LocationCreateManyInput = {
    id?: string
    name: string
    address: string
    latitude: number
    longitude: number
    city: string
    barangay: string
    type: string
    toda_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type LocationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LocationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    toda_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TriderCreateInput = {
    id?: string
    user_id: string
    first_name: string
    last_name: string
    contact_number: string
    plate_number: string
    license_number: string
    status: string
    current_latitude?: number | null
    current_longitude?: number | null
    last_online?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    toda: TodaCreateNestedOneWithoutTridersInput
    queue_items?: TriderQueueItemCreateNestedManyWithoutTriderInput
    ride_requests?: RideRequestCreateNestedManyWithoutTriderInput
  }

  export type TriderUncheckedCreateInput = {
    id?: string
    user_id: string
    toda_id: string
    first_name: string
    last_name: string
    contact_number: string
    plate_number: string
    license_number: string
    status: string
    current_latitude?: number | null
    current_longitude?: number | null
    last_online?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    queue_items?: TriderQueueItemUncheckedCreateNestedManyWithoutTriderInput
    ride_requests?: RideRequestUncheckedCreateNestedManyWithoutTriderInput
  }

  export type TriderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    license_number?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    current_latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    current_longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    last_online?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    toda?: TodaUpdateOneRequiredWithoutTridersNestedInput
    queue_items?: TriderQueueItemUpdateManyWithoutTriderNestedInput
    ride_requests?: RideRequestUpdateManyWithoutTriderNestedInput
  }

  export type TriderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    license_number?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    current_latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    current_longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    last_online?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    queue_items?: TriderQueueItemUncheckedUpdateManyWithoutTriderNestedInput
    ride_requests?: RideRequestUncheckedUpdateManyWithoutTriderNestedInput
  }

  export type TriderCreateManyInput = {
    id?: string
    user_id: string
    toda_id: string
    first_name: string
    last_name: string
    contact_number: string
    plate_number: string
    license_number: string
    status: string
    current_latitude?: number | null
    current_longitude?: number | null
    last_online?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type TriderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    license_number?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    current_latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    current_longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    last_online?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TriderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    license_number?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    current_latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    current_longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    last_online?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TriderQueueItemCreateInput = {
    id?: string
    queue_position: number
    joined_at?: Date | string
    trider: TriderCreateNestedOneWithoutQueue_itemsInput
    toda: TodaCreateNestedOneWithoutQueue_itemsInput
  }

  export type TriderQueueItemUncheckedCreateInput = {
    id?: string
    trider_id: string
    toda_id: string
    queue_position: number
    joined_at?: Date | string
  }

  export type TriderQueueItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    queue_position?: IntFieldUpdateOperationsInput | number
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trider?: TriderUpdateOneRequiredWithoutQueue_itemsNestedInput
    toda?: TodaUpdateOneRequiredWithoutQueue_itemsNestedInput
  }

  export type TriderQueueItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    trider_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    queue_position?: IntFieldUpdateOperationsInput | number
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TriderQueueItemCreateManyInput = {
    id?: string
    trider_id: string
    toda_id: string
    queue_position: number
    joined_at?: Date | string
  }

  export type TriderQueueItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    queue_position?: IntFieldUpdateOperationsInput | number
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TriderQueueItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    trider_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    queue_position?: IntFieldUpdateOperationsInput | number
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RideRequestCreateInput = {
    id?: string
    booking_code: string
    passenger_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
    toda: TodaCreateNestedOneWithoutRide_requestsInput
    pickup_location: LocationCreateNestedOneWithoutPickup_requestsInput
    dropoff_location: LocationCreateNestedOneWithoutDropoff_requestsInput
    trider?: TriderCreateNestedOneWithoutRide_requestsInput
  }

  export type RideRequestUncheckedCreateInput = {
    id?: string
    booking_code: string
    passenger_id: string
    toda_id: string
    pickup_location_id: string
    dropoff_location_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    trider_id?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
  }

  export type RideRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    toda?: TodaUpdateOneRequiredWithoutRide_requestsNestedInput
    pickup_location?: LocationUpdateOneRequiredWithoutPickup_requestsNestedInput
    dropoff_location?: LocationUpdateOneRequiredWithoutDropoff_requestsNestedInput
    trider?: TriderUpdateOneWithoutRide_requestsNestedInput
  }

  export type RideRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    pickup_location_id?: StringFieldUpdateOperationsInput | string
    dropoff_location_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    trider_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RideRequestCreateManyInput = {
    id?: string
    booking_code: string
    passenger_id: string
    toda_id: string
    pickup_location_id: string
    dropoff_location_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    trider_id?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
  }

  export type RideRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RideRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    pickup_location_id?: StringFieldUpdateOperationsInput | string
    dropoff_location_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    trider_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LocationListRelationFilter = {
    every?: LocationWhereInput
    some?: LocationWhereInput
    none?: LocationWhereInput
  }

  export type TriderListRelationFilter = {
    every?: TriderWhereInput
    some?: TriderWhereInput
    none?: TriderWhereInput
  }

  export type TriderQueueItemListRelationFilter = {
    every?: TriderQueueItemWhereInput
    some?: TriderQueueItemWhereInput
    none?: TriderQueueItemWhereInput
  }

  export type RideRequestListRelationFilter = {
    every?: RideRequestWhereInput
    some?: RideRequestWhereInput
    none?: RideRequestWhereInput
  }

  export type LocationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TriderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TriderQueueItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RideRequestOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TodaCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    barangay?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TodaMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    barangay?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TodaMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    city?: SortOrder
    barangay?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type TodaNullableScalarRelationFilter = {
    is?: TodaWhereInput | null
    isNot?: TodaWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LocationCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    city?: SortOrder
    barangay?: SortOrder
    type?: SortOrder
    toda_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type LocationAvgOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type LocationMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    city?: SortOrder
    barangay?: SortOrder
    type?: SortOrder
    toda_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type LocationMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    address?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    city?: SortOrder
    barangay?: SortOrder
    type?: SortOrder
    toda_id?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type LocationSumOrderByAggregateInput = {
    latitude?: SortOrder
    longitude?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TodaScalarRelationFilter = {
    is?: TodaWhereInput
    isNot?: TodaWhereInput
  }

  export type TriderCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    toda_id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    contact_number?: SortOrder
    plate_number?: SortOrder
    license_number?: SortOrder
    status?: SortOrder
    current_latitude?: SortOrder
    current_longitude?: SortOrder
    last_online?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TriderAvgOrderByAggregateInput = {
    current_latitude?: SortOrder
    current_longitude?: SortOrder
  }

  export type TriderMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    toda_id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    contact_number?: SortOrder
    plate_number?: SortOrder
    license_number?: SortOrder
    status?: SortOrder
    current_latitude?: SortOrder
    current_longitude?: SortOrder
    last_online?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TriderMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    toda_id?: SortOrder
    first_name?: SortOrder
    last_name?: SortOrder
    contact_number?: SortOrder
    plate_number?: SortOrder
    license_number?: SortOrder
    status?: SortOrder
    current_latitude?: SortOrder
    current_longitude?: SortOrder
    last_online?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type TriderSumOrderByAggregateInput = {
    current_latitude?: SortOrder
    current_longitude?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type TriderScalarRelationFilter = {
    is?: TriderWhereInput
    isNot?: TriderWhereInput
  }

  export type TriderQueueItemCountOrderByAggregateInput = {
    id?: SortOrder
    trider_id?: SortOrder
    toda_id?: SortOrder
    queue_position?: SortOrder
    joined_at?: SortOrder
  }

  export type TriderQueueItemAvgOrderByAggregateInput = {
    queue_position?: SortOrder
  }

  export type TriderQueueItemMaxOrderByAggregateInput = {
    id?: SortOrder
    trider_id?: SortOrder
    toda_id?: SortOrder
    queue_position?: SortOrder
    joined_at?: SortOrder
  }

  export type TriderQueueItemMinOrderByAggregateInput = {
    id?: SortOrder
    trider_id?: SortOrder
    toda_id?: SortOrder
    queue_position?: SortOrder
    joined_at?: SortOrder
  }

  export type TriderQueueItemSumOrderByAggregateInput = {
    queue_position?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type LocationScalarRelationFilter = {
    is?: LocationWhereInput
    isNot?: LocationWhereInput
  }

  export type TriderNullableScalarRelationFilter = {
    is?: TriderWhereInput | null
    isNot?: TriderWhereInput | null
  }

  export type RideRequestCountOrderByAggregateInput = {
    id?: SortOrder
    booking_code?: SortOrder
    passenger_id?: SortOrder
    toda_id?: SortOrder
    pickup_location_id?: SortOrder
    dropoff_location_id?: SortOrder
    status?: SortOrder
    estimated_fare?: SortOrder
    estimated_time?: SortOrder
    route_distance?: SortOrder
    route_duration?: SortOrder
    route_geometry?: SortOrder
    trider_id?: SortOrder
    created_at?: SortOrder
    accepted_at?: SortOrder
    picked_up_at?: SortOrder
    completed_at?: SortOrder
    cancelled_at?: SortOrder
    cancellation_reason?: SortOrder
  }

  export type RideRequestAvgOrderByAggregateInput = {
    estimated_fare?: SortOrder
    estimated_time?: SortOrder
    route_distance?: SortOrder
    route_duration?: SortOrder
  }

  export type RideRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    booking_code?: SortOrder
    passenger_id?: SortOrder
    toda_id?: SortOrder
    pickup_location_id?: SortOrder
    dropoff_location_id?: SortOrder
    status?: SortOrder
    estimated_fare?: SortOrder
    estimated_time?: SortOrder
    route_distance?: SortOrder
    route_duration?: SortOrder
    route_geometry?: SortOrder
    trider_id?: SortOrder
    created_at?: SortOrder
    accepted_at?: SortOrder
    picked_up_at?: SortOrder
    completed_at?: SortOrder
    cancelled_at?: SortOrder
    cancellation_reason?: SortOrder
  }

  export type RideRequestMinOrderByAggregateInput = {
    id?: SortOrder
    booking_code?: SortOrder
    passenger_id?: SortOrder
    toda_id?: SortOrder
    pickup_location_id?: SortOrder
    dropoff_location_id?: SortOrder
    status?: SortOrder
    estimated_fare?: SortOrder
    estimated_time?: SortOrder
    route_distance?: SortOrder
    route_duration?: SortOrder
    route_geometry?: SortOrder
    trider_id?: SortOrder
    created_at?: SortOrder
    accepted_at?: SortOrder
    picked_up_at?: SortOrder
    completed_at?: SortOrder
    cancelled_at?: SortOrder
    cancellation_reason?: SortOrder
  }

  export type RideRequestSumOrderByAggregateInput = {
    estimated_fare?: SortOrder
    estimated_time?: SortOrder
    route_distance?: SortOrder
    route_duration?: SortOrder
  }

  export type LocationCreateNestedManyWithoutTodaInput = {
    create?: XOR<LocationCreateWithoutTodaInput, LocationUncheckedCreateWithoutTodaInput> | LocationCreateWithoutTodaInput[] | LocationUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutTodaInput | LocationCreateOrConnectWithoutTodaInput[]
    createMany?: LocationCreateManyTodaInputEnvelope
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
  }

  export type TriderCreateNestedManyWithoutTodaInput = {
    create?: XOR<TriderCreateWithoutTodaInput, TriderUncheckedCreateWithoutTodaInput> | TriderCreateWithoutTodaInput[] | TriderUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: TriderCreateOrConnectWithoutTodaInput | TriderCreateOrConnectWithoutTodaInput[]
    createMany?: TriderCreateManyTodaInputEnvelope
    connect?: TriderWhereUniqueInput | TriderWhereUniqueInput[]
  }

  export type TriderQueueItemCreateNestedManyWithoutTodaInput = {
    create?: XOR<TriderQueueItemCreateWithoutTodaInput, TriderQueueItemUncheckedCreateWithoutTodaInput> | TriderQueueItemCreateWithoutTodaInput[] | TriderQueueItemUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: TriderQueueItemCreateOrConnectWithoutTodaInput | TriderQueueItemCreateOrConnectWithoutTodaInput[]
    createMany?: TriderQueueItemCreateManyTodaInputEnvelope
    connect?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
  }

  export type RideRequestCreateNestedManyWithoutTodaInput = {
    create?: XOR<RideRequestCreateWithoutTodaInput, RideRequestUncheckedCreateWithoutTodaInput> | RideRequestCreateWithoutTodaInput[] | RideRequestUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutTodaInput | RideRequestCreateOrConnectWithoutTodaInput[]
    createMany?: RideRequestCreateManyTodaInputEnvelope
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
  }

  export type LocationUncheckedCreateNestedManyWithoutTodaInput = {
    create?: XOR<LocationCreateWithoutTodaInput, LocationUncheckedCreateWithoutTodaInput> | LocationCreateWithoutTodaInput[] | LocationUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutTodaInput | LocationCreateOrConnectWithoutTodaInput[]
    createMany?: LocationCreateManyTodaInputEnvelope
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
  }

  export type TriderUncheckedCreateNestedManyWithoutTodaInput = {
    create?: XOR<TriderCreateWithoutTodaInput, TriderUncheckedCreateWithoutTodaInput> | TriderCreateWithoutTodaInput[] | TriderUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: TriderCreateOrConnectWithoutTodaInput | TriderCreateOrConnectWithoutTodaInput[]
    createMany?: TriderCreateManyTodaInputEnvelope
    connect?: TriderWhereUniqueInput | TriderWhereUniqueInput[]
  }

  export type TriderQueueItemUncheckedCreateNestedManyWithoutTodaInput = {
    create?: XOR<TriderQueueItemCreateWithoutTodaInput, TriderQueueItemUncheckedCreateWithoutTodaInput> | TriderQueueItemCreateWithoutTodaInput[] | TriderQueueItemUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: TriderQueueItemCreateOrConnectWithoutTodaInput | TriderQueueItemCreateOrConnectWithoutTodaInput[]
    createMany?: TriderQueueItemCreateManyTodaInputEnvelope
    connect?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
  }

  export type RideRequestUncheckedCreateNestedManyWithoutTodaInput = {
    create?: XOR<RideRequestCreateWithoutTodaInput, RideRequestUncheckedCreateWithoutTodaInput> | RideRequestCreateWithoutTodaInput[] | RideRequestUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutTodaInput | RideRequestCreateOrConnectWithoutTodaInput[]
    createMany?: RideRequestCreateManyTodaInputEnvelope
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LocationUpdateManyWithoutTodaNestedInput = {
    create?: XOR<LocationCreateWithoutTodaInput, LocationUncheckedCreateWithoutTodaInput> | LocationCreateWithoutTodaInput[] | LocationUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutTodaInput | LocationCreateOrConnectWithoutTodaInput[]
    upsert?: LocationUpsertWithWhereUniqueWithoutTodaInput | LocationUpsertWithWhereUniqueWithoutTodaInput[]
    createMany?: LocationCreateManyTodaInputEnvelope
    set?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    disconnect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    delete?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    update?: LocationUpdateWithWhereUniqueWithoutTodaInput | LocationUpdateWithWhereUniqueWithoutTodaInput[]
    updateMany?: LocationUpdateManyWithWhereWithoutTodaInput | LocationUpdateManyWithWhereWithoutTodaInput[]
    deleteMany?: LocationScalarWhereInput | LocationScalarWhereInput[]
  }

  export type TriderUpdateManyWithoutTodaNestedInput = {
    create?: XOR<TriderCreateWithoutTodaInput, TriderUncheckedCreateWithoutTodaInput> | TriderCreateWithoutTodaInput[] | TriderUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: TriderCreateOrConnectWithoutTodaInput | TriderCreateOrConnectWithoutTodaInput[]
    upsert?: TriderUpsertWithWhereUniqueWithoutTodaInput | TriderUpsertWithWhereUniqueWithoutTodaInput[]
    createMany?: TriderCreateManyTodaInputEnvelope
    set?: TriderWhereUniqueInput | TriderWhereUniqueInput[]
    disconnect?: TriderWhereUniqueInput | TriderWhereUniqueInput[]
    delete?: TriderWhereUniqueInput | TriderWhereUniqueInput[]
    connect?: TriderWhereUniqueInput | TriderWhereUniqueInput[]
    update?: TriderUpdateWithWhereUniqueWithoutTodaInput | TriderUpdateWithWhereUniqueWithoutTodaInput[]
    updateMany?: TriderUpdateManyWithWhereWithoutTodaInput | TriderUpdateManyWithWhereWithoutTodaInput[]
    deleteMany?: TriderScalarWhereInput | TriderScalarWhereInput[]
  }

  export type TriderQueueItemUpdateManyWithoutTodaNestedInput = {
    create?: XOR<TriderQueueItemCreateWithoutTodaInput, TriderQueueItemUncheckedCreateWithoutTodaInput> | TriderQueueItemCreateWithoutTodaInput[] | TriderQueueItemUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: TriderQueueItemCreateOrConnectWithoutTodaInput | TriderQueueItemCreateOrConnectWithoutTodaInput[]
    upsert?: TriderQueueItemUpsertWithWhereUniqueWithoutTodaInput | TriderQueueItemUpsertWithWhereUniqueWithoutTodaInput[]
    createMany?: TriderQueueItemCreateManyTodaInputEnvelope
    set?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    disconnect?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    delete?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    connect?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    update?: TriderQueueItemUpdateWithWhereUniqueWithoutTodaInput | TriderQueueItemUpdateWithWhereUniqueWithoutTodaInput[]
    updateMany?: TriderQueueItemUpdateManyWithWhereWithoutTodaInput | TriderQueueItemUpdateManyWithWhereWithoutTodaInput[]
    deleteMany?: TriderQueueItemScalarWhereInput | TriderQueueItemScalarWhereInput[]
  }

  export type RideRequestUpdateManyWithoutTodaNestedInput = {
    create?: XOR<RideRequestCreateWithoutTodaInput, RideRequestUncheckedCreateWithoutTodaInput> | RideRequestCreateWithoutTodaInput[] | RideRequestUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutTodaInput | RideRequestCreateOrConnectWithoutTodaInput[]
    upsert?: RideRequestUpsertWithWhereUniqueWithoutTodaInput | RideRequestUpsertWithWhereUniqueWithoutTodaInput[]
    createMany?: RideRequestCreateManyTodaInputEnvelope
    set?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    disconnect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    delete?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    update?: RideRequestUpdateWithWhereUniqueWithoutTodaInput | RideRequestUpdateWithWhereUniqueWithoutTodaInput[]
    updateMany?: RideRequestUpdateManyWithWhereWithoutTodaInput | RideRequestUpdateManyWithWhereWithoutTodaInput[]
    deleteMany?: RideRequestScalarWhereInput | RideRequestScalarWhereInput[]
  }

  export type LocationUncheckedUpdateManyWithoutTodaNestedInput = {
    create?: XOR<LocationCreateWithoutTodaInput, LocationUncheckedCreateWithoutTodaInput> | LocationCreateWithoutTodaInput[] | LocationUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: LocationCreateOrConnectWithoutTodaInput | LocationCreateOrConnectWithoutTodaInput[]
    upsert?: LocationUpsertWithWhereUniqueWithoutTodaInput | LocationUpsertWithWhereUniqueWithoutTodaInput[]
    createMany?: LocationCreateManyTodaInputEnvelope
    set?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    disconnect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    delete?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    connect?: LocationWhereUniqueInput | LocationWhereUniqueInput[]
    update?: LocationUpdateWithWhereUniqueWithoutTodaInput | LocationUpdateWithWhereUniqueWithoutTodaInput[]
    updateMany?: LocationUpdateManyWithWhereWithoutTodaInput | LocationUpdateManyWithWhereWithoutTodaInput[]
    deleteMany?: LocationScalarWhereInput | LocationScalarWhereInput[]
  }

  export type TriderUncheckedUpdateManyWithoutTodaNestedInput = {
    create?: XOR<TriderCreateWithoutTodaInput, TriderUncheckedCreateWithoutTodaInput> | TriderCreateWithoutTodaInput[] | TriderUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: TriderCreateOrConnectWithoutTodaInput | TriderCreateOrConnectWithoutTodaInput[]
    upsert?: TriderUpsertWithWhereUniqueWithoutTodaInput | TriderUpsertWithWhereUniqueWithoutTodaInput[]
    createMany?: TriderCreateManyTodaInputEnvelope
    set?: TriderWhereUniqueInput | TriderWhereUniqueInput[]
    disconnect?: TriderWhereUniqueInput | TriderWhereUniqueInput[]
    delete?: TriderWhereUniqueInput | TriderWhereUniqueInput[]
    connect?: TriderWhereUniqueInput | TriderWhereUniqueInput[]
    update?: TriderUpdateWithWhereUniqueWithoutTodaInput | TriderUpdateWithWhereUniqueWithoutTodaInput[]
    updateMany?: TriderUpdateManyWithWhereWithoutTodaInput | TriderUpdateManyWithWhereWithoutTodaInput[]
    deleteMany?: TriderScalarWhereInput | TriderScalarWhereInput[]
  }

  export type TriderQueueItemUncheckedUpdateManyWithoutTodaNestedInput = {
    create?: XOR<TriderQueueItemCreateWithoutTodaInput, TriderQueueItemUncheckedCreateWithoutTodaInput> | TriderQueueItemCreateWithoutTodaInput[] | TriderQueueItemUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: TriderQueueItemCreateOrConnectWithoutTodaInput | TriderQueueItemCreateOrConnectWithoutTodaInput[]
    upsert?: TriderQueueItemUpsertWithWhereUniqueWithoutTodaInput | TriderQueueItemUpsertWithWhereUniqueWithoutTodaInput[]
    createMany?: TriderQueueItemCreateManyTodaInputEnvelope
    set?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    disconnect?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    delete?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    connect?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    update?: TriderQueueItemUpdateWithWhereUniqueWithoutTodaInput | TriderQueueItemUpdateWithWhereUniqueWithoutTodaInput[]
    updateMany?: TriderQueueItemUpdateManyWithWhereWithoutTodaInput | TriderQueueItemUpdateManyWithWhereWithoutTodaInput[]
    deleteMany?: TriderQueueItemScalarWhereInput | TriderQueueItemScalarWhereInput[]
  }

  export type RideRequestUncheckedUpdateManyWithoutTodaNestedInput = {
    create?: XOR<RideRequestCreateWithoutTodaInput, RideRequestUncheckedCreateWithoutTodaInput> | RideRequestCreateWithoutTodaInput[] | RideRequestUncheckedCreateWithoutTodaInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutTodaInput | RideRequestCreateOrConnectWithoutTodaInput[]
    upsert?: RideRequestUpsertWithWhereUniqueWithoutTodaInput | RideRequestUpsertWithWhereUniqueWithoutTodaInput[]
    createMany?: RideRequestCreateManyTodaInputEnvelope
    set?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    disconnect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    delete?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    update?: RideRequestUpdateWithWhereUniqueWithoutTodaInput | RideRequestUpdateWithWhereUniqueWithoutTodaInput[]
    updateMany?: RideRequestUpdateManyWithWhereWithoutTodaInput | RideRequestUpdateManyWithWhereWithoutTodaInput[]
    deleteMany?: RideRequestScalarWhereInput | RideRequestScalarWhereInput[]
  }

  export type TodaCreateNestedOneWithoutLocationsInput = {
    create?: XOR<TodaCreateWithoutLocationsInput, TodaUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: TodaCreateOrConnectWithoutLocationsInput
    connect?: TodaWhereUniqueInput
  }

  export type RideRequestCreateNestedManyWithoutPickup_locationInput = {
    create?: XOR<RideRequestCreateWithoutPickup_locationInput, RideRequestUncheckedCreateWithoutPickup_locationInput> | RideRequestCreateWithoutPickup_locationInput[] | RideRequestUncheckedCreateWithoutPickup_locationInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutPickup_locationInput | RideRequestCreateOrConnectWithoutPickup_locationInput[]
    createMany?: RideRequestCreateManyPickup_locationInputEnvelope
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
  }

  export type RideRequestCreateNestedManyWithoutDropoff_locationInput = {
    create?: XOR<RideRequestCreateWithoutDropoff_locationInput, RideRequestUncheckedCreateWithoutDropoff_locationInput> | RideRequestCreateWithoutDropoff_locationInput[] | RideRequestUncheckedCreateWithoutDropoff_locationInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutDropoff_locationInput | RideRequestCreateOrConnectWithoutDropoff_locationInput[]
    createMany?: RideRequestCreateManyDropoff_locationInputEnvelope
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
  }

  export type RideRequestUncheckedCreateNestedManyWithoutPickup_locationInput = {
    create?: XOR<RideRequestCreateWithoutPickup_locationInput, RideRequestUncheckedCreateWithoutPickup_locationInput> | RideRequestCreateWithoutPickup_locationInput[] | RideRequestUncheckedCreateWithoutPickup_locationInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutPickup_locationInput | RideRequestCreateOrConnectWithoutPickup_locationInput[]
    createMany?: RideRequestCreateManyPickup_locationInputEnvelope
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
  }

  export type RideRequestUncheckedCreateNestedManyWithoutDropoff_locationInput = {
    create?: XOR<RideRequestCreateWithoutDropoff_locationInput, RideRequestUncheckedCreateWithoutDropoff_locationInput> | RideRequestCreateWithoutDropoff_locationInput[] | RideRequestUncheckedCreateWithoutDropoff_locationInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutDropoff_locationInput | RideRequestCreateOrConnectWithoutDropoff_locationInput[]
    createMany?: RideRequestCreateManyDropoff_locationInputEnvelope
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TodaUpdateOneWithoutLocationsNestedInput = {
    create?: XOR<TodaCreateWithoutLocationsInput, TodaUncheckedCreateWithoutLocationsInput>
    connectOrCreate?: TodaCreateOrConnectWithoutLocationsInput
    upsert?: TodaUpsertWithoutLocationsInput
    disconnect?: TodaWhereInput | boolean
    delete?: TodaWhereInput | boolean
    connect?: TodaWhereUniqueInput
    update?: XOR<XOR<TodaUpdateToOneWithWhereWithoutLocationsInput, TodaUpdateWithoutLocationsInput>, TodaUncheckedUpdateWithoutLocationsInput>
  }

  export type RideRequestUpdateManyWithoutPickup_locationNestedInput = {
    create?: XOR<RideRequestCreateWithoutPickup_locationInput, RideRequestUncheckedCreateWithoutPickup_locationInput> | RideRequestCreateWithoutPickup_locationInput[] | RideRequestUncheckedCreateWithoutPickup_locationInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutPickup_locationInput | RideRequestCreateOrConnectWithoutPickup_locationInput[]
    upsert?: RideRequestUpsertWithWhereUniqueWithoutPickup_locationInput | RideRequestUpsertWithWhereUniqueWithoutPickup_locationInput[]
    createMany?: RideRequestCreateManyPickup_locationInputEnvelope
    set?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    disconnect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    delete?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    update?: RideRequestUpdateWithWhereUniqueWithoutPickup_locationInput | RideRequestUpdateWithWhereUniqueWithoutPickup_locationInput[]
    updateMany?: RideRequestUpdateManyWithWhereWithoutPickup_locationInput | RideRequestUpdateManyWithWhereWithoutPickup_locationInput[]
    deleteMany?: RideRequestScalarWhereInput | RideRequestScalarWhereInput[]
  }

  export type RideRequestUpdateManyWithoutDropoff_locationNestedInput = {
    create?: XOR<RideRequestCreateWithoutDropoff_locationInput, RideRequestUncheckedCreateWithoutDropoff_locationInput> | RideRequestCreateWithoutDropoff_locationInput[] | RideRequestUncheckedCreateWithoutDropoff_locationInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutDropoff_locationInput | RideRequestCreateOrConnectWithoutDropoff_locationInput[]
    upsert?: RideRequestUpsertWithWhereUniqueWithoutDropoff_locationInput | RideRequestUpsertWithWhereUniqueWithoutDropoff_locationInput[]
    createMany?: RideRequestCreateManyDropoff_locationInputEnvelope
    set?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    disconnect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    delete?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    update?: RideRequestUpdateWithWhereUniqueWithoutDropoff_locationInput | RideRequestUpdateWithWhereUniqueWithoutDropoff_locationInput[]
    updateMany?: RideRequestUpdateManyWithWhereWithoutDropoff_locationInput | RideRequestUpdateManyWithWhereWithoutDropoff_locationInput[]
    deleteMany?: RideRequestScalarWhereInput | RideRequestScalarWhereInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type RideRequestUncheckedUpdateManyWithoutPickup_locationNestedInput = {
    create?: XOR<RideRequestCreateWithoutPickup_locationInput, RideRequestUncheckedCreateWithoutPickup_locationInput> | RideRequestCreateWithoutPickup_locationInput[] | RideRequestUncheckedCreateWithoutPickup_locationInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutPickup_locationInput | RideRequestCreateOrConnectWithoutPickup_locationInput[]
    upsert?: RideRequestUpsertWithWhereUniqueWithoutPickup_locationInput | RideRequestUpsertWithWhereUniqueWithoutPickup_locationInput[]
    createMany?: RideRequestCreateManyPickup_locationInputEnvelope
    set?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    disconnect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    delete?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    update?: RideRequestUpdateWithWhereUniqueWithoutPickup_locationInput | RideRequestUpdateWithWhereUniqueWithoutPickup_locationInput[]
    updateMany?: RideRequestUpdateManyWithWhereWithoutPickup_locationInput | RideRequestUpdateManyWithWhereWithoutPickup_locationInput[]
    deleteMany?: RideRequestScalarWhereInput | RideRequestScalarWhereInput[]
  }

  export type RideRequestUncheckedUpdateManyWithoutDropoff_locationNestedInput = {
    create?: XOR<RideRequestCreateWithoutDropoff_locationInput, RideRequestUncheckedCreateWithoutDropoff_locationInput> | RideRequestCreateWithoutDropoff_locationInput[] | RideRequestUncheckedCreateWithoutDropoff_locationInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutDropoff_locationInput | RideRequestCreateOrConnectWithoutDropoff_locationInput[]
    upsert?: RideRequestUpsertWithWhereUniqueWithoutDropoff_locationInput | RideRequestUpsertWithWhereUniqueWithoutDropoff_locationInput[]
    createMany?: RideRequestCreateManyDropoff_locationInputEnvelope
    set?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    disconnect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    delete?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    update?: RideRequestUpdateWithWhereUniqueWithoutDropoff_locationInput | RideRequestUpdateWithWhereUniqueWithoutDropoff_locationInput[]
    updateMany?: RideRequestUpdateManyWithWhereWithoutDropoff_locationInput | RideRequestUpdateManyWithWhereWithoutDropoff_locationInput[]
    deleteMany?: RideRequestScalarWhereInput | RideRequestScalarWhereInput[]
  }

  export type TodaCreateNestedOneWithoutTridersInput = {
    create?: XOR<TodaCreateWithoutTridersInput, TodaUncheckedCreateWithoutTridersInput>
    connectOrCreate?: TodaCreateOrConnectWithoutTridersInput
    connect?: TodaWhereUniqueInput
  }

  export type TriderQueueItemCreateNestedManyWithoutTriderInput = {
    create?: XOR<TriderQueueItemCreateWithoutTriderInput, TriderQueueItemUncheckedCreateWithoutTriderInput> | TriderQueueItemCreateWithoutTriderInput[] | TriderQueueItemUncheckedCreateWithoutTriderInput[]
    connectOrCreate?: TriderQueueItemCreateOrConnectWithoutTriderInput | TriderQueueItemCreateOrConnectWithoutTriderInput[]
    createMany?: TriderQueueItemCreateManyTriderInputEnvelope
    connect?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
  }

  export type RideRequestCreateNestedManyWithoutTriderInput = {
    create?: XOR<RideRequestCreateWithoutTriderInput, RideRequestUncheckedCreateWithoutTriderInput> | RideRequestCreateWithoutTriderInput[] | RideRequestUncheckedCreateWithoutTriderInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutTriderInput | RideRequestCreateOrConnectWithoutTriderInput[]
    createMany?: RideRequestCreateManyTriderInputEnvelope
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
  }

  export type TriderQueueItemUncheckedCreateNestedManyWithoutTriderInput = {
    create?: XOR<TriderQueueItemCreateWithoutTriderInput, TriderQueueItemUncheckedCreateWithoutTriderInput> | TriderQueueItemCreateWithoutTriderInput[] | TriderQueueItemUncheckedCreateWithoutTriderInput[]
    connectOrCreate?: TriderQueueItemCreateOrConnectWithoutTriderInput | TriderQueueItemCreateOrConnectWithoutTriderInput[]
    createMany?: TriderQueueItemCreateManyTriderInputEnvelope
    connect?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
  }

  export type RideRequestUncheckedCreateNestedManyWithoutTriderInput = {
    create?: XOR<RideRequestCreateWithoutTriderInput, RideRequestUncheckedCreateWithoutTriderInput> | RideRequestCreateWithoutTriderInput[] | RideRequestUncheckedCreateWithoutTriderInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutTriderInput | RideRequestCreateOrConnectWithoutTriderInput[]
    createMany?: RideRequestCreateManyTriderInputEnvelope
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type TodaUpdateOneRequiredWithoutTridersNestedInput = {
    create?: XOR<TodaCreateWithoutTridersInput, TodaUncheckedCreateWithoutTridersInput>
    connectOrCreate?: TodaCreateOrConnectWithoutTridersInput
    upsert?: TodaUpsertWithoutTridersInput
    connect?: TodaWhereUniqueInput
    update?: XOR<XOR<TodaUpdateToOneWithWhereWithoutTridersInput, TodaUpdateWithoutTridersInput>, TodaUncheckedUpdateWithoutTridersInput>
  }

  export type TriderQueueItemUpdateManyWithoutTriderNestedInput = {
    create?: XOR<TriderQueueItemCreateWithoutTriderInput, TriderQueueItemUncheckedCreateWithoutTriderInput> | TriderQueueItemCreateWithoutTriderInput[] | TriderQueueItemUncheckedCreateWithoutTriderInput[]
    connectOrCreate?: TriderQueueItemCreateOrConnectWithoutTriderInput | TriderQueueItemCreateOrConnectWithoutTriderInput[]
    upsert?: TriderQueueItemUpsertWithWhereUniqueWithoutTriderInput | TriderQueueItemUpsertWithWhereUniqueWithoutTriderInput[]
    createMany?: TriderQueueItemCreateManyTriderInputEnvelope
    set?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    disconnect?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    delete?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    connect?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    update?: TriderQueueItemUpdateWithWhereUniqueWithoutTriderInput | TriderQueueItemUpdateWithWhereUniqueWithoutTriderInput[]
    updateMany?: TriderQueueItemUpdateManyWithWhereWithoutTriderInput | TriderQueueItemUpdateManyWithWhereWithoutTriderInput[]
    deleteMany?: TriderQueueItemScalarWhereInput | TriderQueueItemScalarWhereInput[]
  }

  export type RideRequestUpdateManyWithoutTriderNestedInput = {
    create?: XOR<RideRequestCreateWithoutTriderInput, RideRequestUncheckedCreateWithoutTriderInput> | RideRequestCreateWithoutTriderInput[] | RideRequestUncheckedCreateWithoutTriderInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutTriderInput | RideRequestCreateOrConnectWithoutTriderInput[]
    upsert?: RideRequestUpsertWithWhereUniqueWithoutTriderInput | RideRequestUpsertWithWhereUniqueWithoutTriderInput[]
    createMany?: RideRequestCreateManyTriderInputEnvelope
    set?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    disconnect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    delete?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    update?: RideRequestUpdateWithWhereUniqueWithoutTriderInput | RideRequestUpdateWithWhereUniqueWithoutTriderInput[]
    updateMany?: RideRequestUpdateManyWithWhereWithoutTriderInput | RideRequestUpdateManyWithWhereWithoutTriderInput[]
    deleteMany?: RideRequestScalarWhereInput | RideRequestScalarWhereInput[]
  }

  export type TriderQueueItemUncheckedUpdateManyWithoutTriderNestedInput = {
    create?: XOR<TriderQueueItemCreateWithoutTriderInput, TriderQueueItemUncheckedCreateWithoutTriderInput> | TriderQueueItemCreateWithoutTriderInput[] | TriderQueueItemUncheckedCreateWithoutTriderInput[]
    connectOrCreate?: TriderQueueItemCreateOrConnectWithoutTriderInput | TriderQueueItemCreateOrConnectWithoutTriderInput[]
    upsert?: TriderQueueItemUpsertWithWhereUniqueWithoutTriderInput | TriderQueueItemUpsertWithWhereUniqueWithoutTriderInput[]
    createMany?: TriderQueueItemCreateManyTriderInputEnvelope
    set?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    disconnect?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    delete?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    connect?: TriderQueueItemWhereUniqueInput | TriderQueueItemWhereUniqueInput[]
    update?: TriderQueueItemUpdateWithWhereUniqueWithoutTriderInput | TriderQueueItemUpdateWithWhereUniqueWithoutTriderInput[]
    updateMany?: TriderQueueItemUpdateManyWithWhereWithoutTriderInput | TriderQueueItemUpdateManyWithWhereWithoutTriderInput[]
    deleteMany?: TriderQueueItemScalarWhereInput | TriderQueueItemScalarWhereInput[]
  }

  export type RideRequestUncheckedUpdateManyWithoutTriderNestedInput = {
    create?: XOR<RideRequestCreateWithoutTriderInput, RideRequestUncheckedCreateWithoutTriderInput> | RideRequestCreateWithoutTriderInput[] | RideRequestUncheckedCreateWithoutTriderInput[]
    connectOrCreate?: RideRequestCreateOrConnectWithoutTriderInput | RideRequestCreateOrConnectWithoutTriderInput[]
    upsert?: RideRequestUpsertWithWhereUniqueWithoutTriderInput | RideRequestUpsertWithWhereUniqueWithoutTriderInput[]
    createMany?: RideRequestCreateManyTriderInputEnvelope
    set?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    disconnect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    delete?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    connect?: RideRequestWhereUniqueInput | RideRequestWhereUniqueInput[]
    update?: RideRequestUpdateWithWhereUniqueWithoutTriderInput | RideRequestUpdateWithWhereUniqueWithoutTriderInput[]
    updateMany?: RideRequestUpdateManyWithWhereWithoutTriderInput | RideRequestUpdateManyWithWhereWithoutTriderInput[]
    deleteMany?: RideRequestScalarWhereInput | RideRequestScalarWhereInput[]
  }

  export type TriderCreateNestedOneWithoutQueue_itemsInput = {
    create?: XOR<TriderCreateWithoutQueue_itemsInput, TriderUncheckedCreateWithoutQueue_itemsInput>
    connectOrCreate?: TriderCreateOrConnectWithoutQueue_itemsInput
    connect?: TriderWhereUniqueInput
  }

  export type TodaCreateNestedOneWithoutQueue_itemsInput = {
    create?: XOR<TodaCreateWithoutQueue_itemsInput, TodaUncheckedCreateWithoutQueue_itemsInput>
    connectOrCreate?: TodaCreateOrConnectWithoutQueue_itemsInput
    connect?: TodaWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TriderUpdateOneRequiredWithoutQueue_itemsNestedInput = {
    create?: XOR<TriderCreateWithoutQueue_itemsInput, TriderUncheckedCreateWithoutQueue_itemsInput>
    connectOrCreate?: TriderCreateOrConnectWithoutQueue_itemsInput
    upsert?: TriderUpsertWithoutQueue_itemsInput
    connect?: TriderWhereUniqueInput
    update?: XOR<XOR<TriderUpdateToOneWithWhereWithoutQueue_itemsInput, TriderUpdateWithoutQueue_itemsInput>, TriderUncheckedUpdateWithoutQueue_itemsInput>
  }

  export type TodaUpdateOneRequiredWithoutQueue_itemsNestedInput = {
    create?: XOR<TodaCreateWithoutQueue_itemsInput, TodaUncheckedCreateWithoutQueue_itemsInput>
    connectOrCreate?: TodaCreateOrConnectWithoutQueue_itemsInput
    upsert?: TodaUpsertWithoutQueue_itemsInput
    connect?: TodaWhereUniqueInput
    update?: XOR<XOR<TodaUpdateToOneWithWhereWithoutQueue_itemsInput, TodaUpdateWithoutQueue_itemsInput>, TodaUncheckedUpdateWithoutQueue_itemsInput>
  }

  export type TodaCreateNestedOneWithoutRide_requestsInput = {
    create?: XOR<TodaCreateWithoutRide_requestsInput, TodaUncheckedCreateWithoutRide_requestsInput>
    connectOrCreate?: TodaCreateOrConnectWithoutRide_requestsInput
    connect?: TodaWhereUniqueInput
  }

  export type LocationCreateNestedOneWithoutPickup_requestsInput = {
    create?: XOR<LocationCreateWithoutPickup_requestsInput, LocationUncheckedCreateWithoutPickup_requestsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutPickup_requestsInput
    connect?: LocationWhereUniqueInput
  }

  export type LocationCreateNestedOneWithoutDropoff_requestsInput = {
    create?: XOR<LocationCreateWithoutDropoff_requestsInput, LocationUncheckedCreateWithoutDropoff_requestsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutDropoff_requestsInput
    connect?: LocationWhereUniqueInput
  }

  export type TriderCreateNestedOneWithoutRide_requestsInput = {
    create?: XOR<TriderCreateWithoutRide_requestsInput, TriderUncheckedCreateWithoutRide_requestsInput>
    connectOrCreate?: TriderCreateOrConnectWithoutRide_requestsInput
    connect?: TriderWhereUniqueInput
  }

  export type TodaUpdateOneRequiredWithoutRide_requestsNestedInput = {
    create?: XOR<TodaCreateWithoutRide_requestsInput, TodaUncheckedCreateWithoutRide_requestsInput>
    connectOrCreate?: TodaCreateOrConnectWithoutRide_requestsInput
    upsert?: TodaUpsertWithoutRide_requestsInput
    connect?: TodaWhereUniqueInput
    update?: XOR<XOR<TodaUpdateToOneWithWhereWithoutRide_requestsInput, TodaUpdateWithoutRide_requestsInput>, TodaUncheckedUpdateWithoutRide_requestsInput>
  }

  export type LocationUpdateOneRequiredWithoutPickup_requestsNestedInput = {
    create?: XOR<LocationCreateWithoutPickup_requestsInput, LocationUncheckedCreateWithoutPickup_requestsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutPickup_requestsInput
    upsert?: LocationUpsertWithoutPickup_requestsInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutPickup_requestsInput, LocationUpdateWithoutPickup_requestsInput>, LocationUncheckedUpdateWithoutPickup_requestsInput>
  }

  export type LocationUpdateOneRequiredWithoutDropoff_requestsNestedInput = {
    create?: XOR<LocationCreateWithoutDropoff_requestsInput, LocationUncheckedCreateWithoutDropoff_requestsInput>
    connectOrCreate?: LocationCreateOrConnectWithoutDropoff_requestsInput
    upsert?: LocationUpsertWithoutDropoff_requestsInput
    connect?: LocationWhereUniqueInput
    update?: XOR<XOR<LocationUpdateToOneWithWhereWithoutDropoff_requestsInput, LocationUpdateWithoutDropoff_requestsInput>, LocationUncheckedUpdateWithoutDropoff_requestsInput>
  }

  export type TriderUpdateOneWithoutRide_requestsNestedInput = {
    create?: XOR<TriderCreateWithoutRide_requestsInput, TriderUncheckedCreateWithoutRide_requestsInput>
    connectOrCreate?: TriderCreateOrConnectWithoutRide_requestsInput
    upsert?: TriderUpsertWithoutRide_requestsInput
    disconnect?: TriderWhereInput | boolean
    delete?: TriderWhereInput | boolean
    connect?: TriderWhereUniqueInput
    update?: XOR<XOR<TriderUpdateToOneWithWhereWithoutRide_requestsInput, TriderUpdateWithoutRide_requestsInput>, TriderUncheckedUpdateWithoutRide_requestsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type LocationCreateWithoutTodaInput = {
    id?: string
    name: string
    address: string
    latitude: number
    longitude: number
    city: string
    barangay: string
    type: string
    created_at?: Date | string
    updated_at?: Date | string
    pickup_requests?: RideRequestCreateNestedManyWithoutPickup_locationInput
    dropoff_requests?: RideRequestCreateNestedManyWithoutDropoff_locationInput
  }

  export type LocationUncheckedCreateWithoutTodaInput = {
    id?: string
    name: string
    address: string
    latitude: number
    longitude: number
    city: string
    barangay: string
    type: string
    created_at?: Date | string
    updated_at?: Date | string
    pickup_requests?: RideRequestUncheckedCreateNestedManyWithoutPickup_locationInput
    dropoff_requests?: RideRequestUncheckedCreateNestedManyWithoutDropoff_locationInput
  }

  export type LocationCreateOrConnectWithoutTodaInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutTodaInput, LocationUncheckedCreateWithoutTodaInput>
  }

  export type LocationCreateManyTodaInputEnvelope = {
    data: LocationCreateManyTodaInput | LocationCreateManyTodaInput[]
    skipDuplicates?: boolean
  }

  export type TriderCreateWithoutTodaInput = {
    id?: string
    user_id: string
    first_name: string
    last_name: string
    contact_number: string
    plate_number: string
    license_number: string
    status: string
    current_latitude?: number | null
    current_longitude?: number | null
    last_online?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    queue_items?: TriderQueueItemCreateNestedManyWithoutTriderInput
    ride_requests?: RideRequestCreateNestedManyWithoutTriderInput
  }

  export type TriderUncheckedCreateWithoutTodaInput = {
    id?: string
    user_id: string
    first_name: string
    last_name: string
    contact_number: string
    plate_number: string
    license_number: string
    status: string
    current_latitude?: number | null
    current_longitude?: number | null
    last_online?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    queue_items?: TriderQueueItemUncheckedCreateNestedManyWithoutTriderInput
    ride_requests?: RideRequestUncheckedCreateNestedManyWithoutTriderInput
  }

  export type TriderCreateOrConnectWithoutTodaInput = {
    where: TriderWhereUniqueInput
    create: XOR<TriderCreateWithoutTodaInput, TriderUncheckedCreateWithoutTodaInput>
  }

  export type TriderCreateManyTodaInputEnvelope = {
    data: TriderCreateManyTodaInput | TriderCreateManyTodaInput[]
    skipDuplicates?: boolean
  }

  export type TriderQueueItemCreateWithoutTodaInput = {
    id?: string
    queue_position: number
    joined_at?: Date | string
    trider: TriderCreateNestedOneWithoutQueue_itemsInput
  }

  export type TriderQueueItemUncheckedCreateWithoutTodaInput = {
    id?: string
    trider_id: string
    queue_position: number
    joined_at?: Date | string
  }

  export type TriderQueueItemCreateOrConnectWithoutTodaInput = {
    where: TriderQueueItemWhereUniqueInput
    create: XOR<TriderQueueItemCreateWithoutTodaInput, TriderQueueItemUncheckedCreateWithoutTodaInput>
  }

  export type TriderQueueItemCreateManyTodaInputEnvelope = {
    data: TriderQueueItemCreateManyTodaInput | TriderQueueItemCreateManyTodaInput[]
    skipDuplicates?: boolean
  }

  export type RideRequestCreateWithoutTodaInput = {
    id?: string
    booking_code: string
    passenger_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
    pickup_location: LocationCreateNestedOneWithoutPickup_requestsInput
    dropoff_location: LocationCreateNestedOneWithoutDropoff_requestsInput
    trider?: TriderCreateNestedOneWithoutRide_requestsInput
  }

  export type RideRequestUncheckedCreateWithoutTodaInput = {
    id?: string
    booking_code: string
    passenger_id: string
    pickup_location_id: string
    dropoff_location_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    trider_id?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
  }

  export type RideRequestCreateOrConnectWithoutTodaInput = {
    where: RideRequestWhereUniqueInput
    create: XOR<RideRequestCreateWithoutTodaInput, RideRequestUncheckedCreateWithoutTodaInput>
  }

  export type RideRequestCreateManyTodaInputEnvelope = {
    data: RideRequestCreateManyTodaInput | RideRequestCreateManyTodaInput[]
    skipDuplicates?: boolean
  }

  export type LocationUpsertWithWhereUniqueWithoutTodaInput = {
    where: LocationWhereUniqueInput
    update: XOR<LocationUpdateWithoutTodaInput, LocationUncheckedUpdateWithoutTodaInput>
    create: XOR<LocationCreateWithoutTodaInput, LocationUncheckedCreateWithoutTodaInput>
  }

  export type LocationUpdateWithWhereUniqueWithoutTodaInput = {
    where: LocationWhereUniqueInput
    data: XOR<LocationUpdateWithoutTodaInput, LocationUncheckedUpdateWithoutTodaInput>
  }

  export type LocationUpdateManyWithWhereWithoutTodaInput = {
    where: LocationScalarWhereInput
    data: XOR<LocationUpdateManyMutationInput, LocationUncheckedUpdateManyWithoutTodaInput>
  }

  export type LocationScalarWhereInput = {
    AND?: LocationScalarWhereInput | LocationScalarWhereInput[]
    OR?: LocationScalarWhereInput[]
    NOT?: LocationScalarWhereInput | LocationScalarWhereInput[]
    id?: StringFilter<"Location"> | string
    name?: StringFilter<"Location"> | string
    address?: StringFilter<"Location"> | string
    latitude?: FloatFilter<"Location"> | number
    longitude?: FloatFilter<"Location"> | number
    city?: StringFilter<"Location"> | string
    barangay?: StringFilter<"Location"> | string
    type?: StringFilter<"Location"> | string
    toda_id?: StringNullableFilter<"Location"> | string | null
    created_at?: DateTimeFilter<"Location"> | Date | string
    updated_at?: DateTimeFilter<"Location"> | Date | string
  }

  export type TriderUpsertWithWhereUniqueWithoutTodaInput = {
    where: TriderWhereUniqueInput
    update: XOR<TriderUpdateWithoutTodaInput, TriderUncheckedUpdateWithoutTodaInput>
    create: XOR<TriderCreateWithoutTodaInput, TriderUncheckedCreateWithoutTodaInput>
  }

  export type TriderUpdateWithWhereUniqueWithoutTodaInput = {
    where: TriderWhereUniqueInput
    data: XOR<TriderUpdateWithoutTodaInput, TriderUncheckedUpdateWithoutTodaInput>
  }

  export type TriderUpdateManyWithWhereWithoutTodaInput = {
    where: TriderScalarWhereInput
    data: XOR<TriderUpdateManyMutationInput, TriderUncheckedUpdateManyWithoutTodaInput>
  }

  export type TriderScalarWhereInput = {
    AND?: TriderScalarWhereInput | TriderScalarWhereInput[]
    OR?: TriderScalarWhereInput[]
    NOT?: TriderScalarWhereInput | TriderScalarWhereInput[]
    id?: StringFilter<"Trider"> | string
    user_id?: StringFilter<"Trider"> | string
    toda_id?: StringFilter<"Trider"> | string
    first_name?: StringFilter<"Trider"> | string
    last_name?: StringFilter<"Trider"> | string
    contact_number?: StringFilter<"Trider"> | string
    plate_number?: StringFilter<"Trider"> | string
    license_number?: StringFilter<"Trider"> | string
    status?: StringFilter<"Trider"> | string
    current_latitude?: FloatNullableFilter<"Trider"> | number | null
    current_longitude?: FloatNullableFilter<"Trider"> | number | null
    last_online?: DateTimeNullableFilter<"Trider"> | Date | string | null
    created_at?: DateTimeFilter<"Trider"> | Date | string
    updated_at?: DateTimeFilter<"Trider"> | Date | string
  }

  export type TriderQueueItemUpsertWithWhereUniqueWithoutTodaInput = {
    where: TriderQueueItemWhereUniqueInput
    update: XOR<TriderQueueItemUpdateWithoutTodaInput, TriderQueueItemUncheckedUpdateWithoutTodaInput>
    create: XOR<TriderQueueItemCreateWithoutTodaInput, TriderQueueItemUncheckedCreateWithoutTodaInput>
  }

  export type TriderQueueItemUpdateWithWhereUniqueWithoutTodaInput = {
    where: TriderQueueItemWhereUniqueInput
    data: XOR<TriderQueueItemUpdateWithoutTodaInput, TriderQueueItemUncheckedUpdateWithoutTodaInput>
  }

  export type TriderQueueItemUpdateManyWithWhereWithoutTodaInput = {
    where: TriderQueueItemScalarWhereInput
    data: XOR<TriderQueueItemUpdateManyMutationInput, TriderQueueItemUncheckedUpdateManyWithoutTodaInput>
  }

  export type TriderQueueItemScalarWhereInput = {
    AND?: TriderQueueItemScalarWhereInput | TriderQueueItemScalarWhereInput[]
    OR?: TriderQueueItemScalarWhereInput[]
    NOT?: TriderQueueItemScalarWhereInput | TriderQueueItemScalarWhereInput[]
    id?: StringFilter<"TriderQueueItem"> | string
    trider_id?: StringFilter<"TriderQueueItem"> | string
    toda_id?: StringFilter<"TriderQueueItem"> | string
    queue_position?: IntFilter<"TriderQueueItem"> | number
    joined_at?: DateTimeFilter<"TriderQueueItem"> | Date | string
  }

  export type RideRequestUpsertWithWhereUniqueWithoutTodaInput = {
    where: RideRequestWhereUniqueInput
    update: XOR<RideRequestUpdateWithoutTodaInput, RideRequestUncheckedUpdateWithoutTodaInput>
    create: XOR<RideRequestCreateWithoutTodaInput, RideRequestUncheckedCreateWithoutTodaInput>
  }

  export type RideRequestUpdateWithWhereUniqueWithoutTodaInput = {
    where: RideRequestWhereUniqueInput
    data: XOR<RideRequestUpdateWithoutTodaInput, RideRequestUncheckedUpdateWithoutTodaInput>
  }

  export type RideRequestUpdateManyWithWhereWithoutTodaInput = {
    where: RideRequestScalarWhereInput
    data: XOR<RideRequestUpdateManyMutationInput, RideRequestUncheckedUpdateManyWithoutTodaInput>
  }

  export type RideRequestScalarWhereInput = {
    AND?: RideRequestScalarWhereInput | RideRequestScalarWhereInput[]
    OR?: RideRequestScalarWhereInput[]
    NOT?: RideRequestScalarWhereInput | RideRequestScalarWhereInput[]
    id?: StringFilter<"RideRequest"> | string
    booking_code?: StringFilter<"RideRequest"> | string
    passenger_id?: StringFilter<"RideRequest"> | string
    toda_id?: StringFilter<"RideRequest"> | string
    pickup_location_id?: StringFilter<"RideRequest"> | string
    dropoff_location_id?: StringFilter<"RideRequest"> | string
    status?: StringFilter<"RideRequest"> | string
    estimated_fare?: FloatFilter<"RideRequest"> | number
    estimated_time?: IntFilter<"RideRequest"> | number
    route_distance?: FloatNullableFilter<"RideRequest"> | number | null
    route_duration?: FloatNullableFilter<"RideRequest"> | number | null
    route_geometry?: StringNullableFilter<"RideRequest"> | string | null
    trider_id?: StringNullableFilter<"RideRequest"> | string | null
    created_at?: DateTimeFilter<"RideRequest"> | Date | string
    accepted_at?: DateTimeNullableFilter<"RideRequest"> | Date | string | null
    picked_up_at?: DateTimeNullableFilter<"RideRequest"> | Date | string | null
    completed_at?: DateTimeNullableFilter<"RideRequest"> | Date | string | null
    cancelled_at?: DateTimeNullableFilter<"RideRequest"> | Date | string | null
    cancellation_reason?: StringNullableFilter<"RideRequest"> | string | null
  }

  export type TodaCreateWithoutLocationsInput = {
    id?: string
    name: string
    city: string
    barangay: string
    created_at?: Date | string
    updated_at?: Date | string
    triders?: TriderCreateNestedManyWithoutTodaInput
    queue_items?: TriderQueueItemCreateNestedManyWithoutTodaInput
    ride_requests?: RideRequestCreateNestedManyWithoutTodaInput
  }

  export type TodaUncheckedCreateWithoutLocationsInput = {
    id?: string
    name: string
    city: string
    barangay: string
    created_at?: Date | string
    updated_at?: Date | string
    triders?: TriderUncheckedCreateNestedManyWithoutTodaInput
    queue_items?: TriderQueueItemUncheckedCreateNestedManyWithoutTodaInput
    ride_requests?: RideRequestUncheckedCreateNestedManyWithoutTodaInput
  }

  export type TodaCreateOrConnectWithoutLocationsInput = {
    where: TodaWhereUniqueInput
    create: XOR<TodaCreateWithoutLocationsInput, TodaUncheckedCreateWithoutLocationsInput>
  }

  export type RideRequestCreateWithoutPickup_locationInput = {
    id?: string
    booking_code: string
    passenger_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
    toda: TodaCreateNestedOneWithoutRide_requestsInput
    dropoff_location: LocationCreateNestedOneWithoutDropoff_requestsInput
    trider?: TriderCreateNestedOneWithoutRide_requestsInput
  }

  export type RideRequestUncheckedCreateWithoutPickup_locationInput = {
    id?: string
    booking_code: string
    passenger_id: string
    toda_id: string
    dropoff_location_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    trider_id?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
  }

  export type RideRequestCreateOrConnectWithoutPickup_locationInput = {
    where: RideRequestWhereUniqueInput
    create: XOR<RideRequestCreateWithoutPickup_locationInput, RideRequestUncheckedCreateWithoutPickup_locationInput>
  }

  export type RideRequestCreateManyPickup_locationInputEnvelope = {
    data: RideRequestCreateManyPickup_locationInput | RideRequestCreateManyPickup_locationInput[]
    skipDuplicates?: boolean
  }

  export type RideRequestCreateWithoutDropoff_locationInput = {
    id?: string
    booking_code: string
    passenger_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
    toda: TodaCreateNestedOneWithoutRide_requestsInput
    pickup_location: LocationCreateNestedOneWithoutPickup_requestsInput
    trider?: TriderCreateNestedOneWithoutRide_requestsInput
  }

  export type RideRequestUncheckedCreateWithoutDropoff_locationInput = {
    id?: string
    booking_code: string
    passenger_id: string
    toda_id: string
    pickup_location_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    trider_id?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
  }

  export type RideRequestCreateOrConnectWithoutDropoff_locationInput = {
    where: RideRequestWhereUniqueInput
    create: XOR<RideRequestCreateWithoutDropoff_locationInput, RideRequestUncheckedCreateWithoutDropoff_locationInput>
  }

  export type RideRequestCreateManyDropoff_locationInputEnvelope = {
    data: RideRequestCreateManyDropoff_locationInput | RideRequestCreateManyDropoff_locationInput[]
    skipDuplicates?: boolean
  }

  export type TodaUpsertWithoutLocationsInput = {
    update: XOR<TodaUpdateWithoutLocationsInput, TodaUncheckedUpdateWithoutLocationsInput>
    create: XOR<TodaCreateWithoutLocationsInput, TodaUncheckedCreateWithoutLocationsInput>
    where?: TodaWhereInput
  }

  export type TodaUpdateToOneWithWhereWithoutLocationsInput = {
    where?: TodaWhereInput
    data: XOR<TodaUpdateWithoutLocationsInput, TodaUncheckedUpdateWithoutLocationsInput>
  }

  export type TodaUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    triders?: TriderUpdateManyWithoutTodaNestedInput
    queue_items?: TriderQueueItemUpdateManyWithoutTodaNestedInput
    ride_requests?: RideRequestUpdateManyWithoutTodaNestedInput
  }

  export type TodaUncheckedUpdateWithoutLocationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    triders?: TriderUncheckedUpdateManyWithoutTodaNestedInput
    queue_items?: TriderQueueItemUncheckedUpdateManyWithoutTodaNestedInput
    ride_requests?: RideRequestUncheckedUpdateManyWithoutTodaNestedInput
  }

  export type RideRequestUpsertWithWhereUniqueWithoutPickup_locationInput = {
    where: RideRequestWhereUniqueInput
    update: XOR<RideRequestUpdateWithoutPickup_locationInput, RideRequestUncheckedUpdateWithoutPickup_locationInput>
    create: XOR<RideRequestCreateWithoutPickup_locationInput, RideRequestUncheckedCreateWithoutPickup_locationInput>
  }

  export type RideRequestUpdateWithWhereUniqueWithoutPickup_locationInput = {
    where: RideRequestWhereUniqueInput
    data: XOR<RideRequestUpdateWithoutPickup_locationInput, RideRequestUncheckedUpdateWithoutPickup_locationInput>
  }

  export type RideRequestUpdateManyWithWhereWithoutPickup_locationInput = {
    where: RideRequestScalarWhereInput
    data: XOR<RideRequestUpdateManyMutationInput, RideRequestUncheckedUpdateManyWithoutPickup_locationInput>
  }

  export type RideRequestUpsertWithWhereUniqueWithoutDropoff_locationInput = {
    where: RideRequestWhereUniqueInput
    update: XOR<RideRequestUpdateWithoutDropoff_locationInput, RideRequestUncheckedUpdateWithoutDropoff_locationInput>
    create: XOR<RideRequestCreateWithoutDropoff_locationInput, RideRequestUncheckedCreateWithoutDropoff_locationInput>
  }

  export type RideRequestUpdateWithWhereUniqueWithoutDropoff_locationInput = {
    where: RideRequestWhereUniqueInput
    data: XOR<RideRequestUpdateWithoutDropoff_locationInput, RideRequestUncheckedUpdateWithoutDropoff_locationInput>
  }

  export type RideRequestUpdateManyWithWhereWithoutDropoff_locationInput = {
    where: RideRequestScalarWhereInput
    data: XOR<RideRequestUpdateManyMutationInput, RideRequestUncheckedUpdateManyWithoutDropoff_locationInput>
  }

  export type TodaCreateWithoutTridersInput = {
    id?: string
    name: string
    city: string
    barangay: string
    created_at?: Date | string
    updated_at?: Date | string
    locations?: LocationCreateNestedManyWithoutTodaInput
    queue_items?: TriderQueueItemCreateNestedManyWithoutTodaInput
    ride_requests?: RideRequestCreateNestedManyWithoutTodaInput
  }

  export type TodaUncheckedCreateWithoutTridersInput = {
    id?: string
    name: string
    city: string
    barangay: string
    created_at?: Date | string
    updated_at?: Date | string
    locations?: LocationUncheckedCreateNestedManyWithoutTodaInput
    queue_items?: TriderQueueItemUncheckedCreateNestedManyWithoutTodaInput
    ride_requests?: RideRequestUncheckedCreateNestedManyWithoutTodaInput
  }

  export type TodaCreateOrConnectWithoutTridersInput = {
    where: TodaWhereUniqueInput
    create: XOR<TodaCreateWithoutTridersInput, TodaUncheckedCreateWithoutTridersInput>
  }

  export type TriderQueueItemCreateWithoutTriderInput = {
    id?: string
    queue_position: number
    joined_at?: Date | string
    toda: TodaCreateNestedOneWithoutQueue_itemsInput
  }

  export type TriderQueueItemUncheckedCreateWithoutTriderInput = {
    id?: string
    toda_id: string
    queue_position: number
    joined_at?: Date | string
  }

  export type TriderQueueItemCreateOrConnectWithoutTriderInput = {
    where: TriderQueueItemWhereUniqueInput
    create: XOR<TriderQueueItemCreateWithoutTriderInput, TriderQueueItemUncheckedCreateWithoutTriderInput>
  }

  export type TriderQueueItemCreateManyTriderInputEnvelope = {
    data: TriderQueueItemCreateManyTriderInput | TriderQueueItemCreateManyTriderInput[]
    skipDuplicates?: boolean
  }

  export type RideRequestCreateWithoutTriderInput = {
    id?: string
    booking_code: string
    passenger_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
    toda: TodaCreateNestedOneWithoutRide_requestsInput
    pickup_location: LocationCreateNestedOneWithoutPickup_requestsInput
    dropoff_location: LocationCreateNestedOneWithoutDropoff_requestsInput
  }

  export type RideRequestUncheckedCreateWithoutTriderInput = {
    id?: string
    booking_code: string
    passenger_id: string
    toda_id: string
    pickup_location_id: string
    dropoff_location_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
  }

  export type RideRequestCreateOrConnectWithoutTriderInput = {
    where: RideRequestWhereUniqueInput
    create: XOR<RideRequestCreateWithoutTriderInput, RideRequestUncheckedCreateWithoutTriderInput>
  }

  export type RideRequestCreateManyTriderInputEnvelope = {
    data: RideRequestCreateManyTriderInput | RideRequestCreateManyTriderInput[]
    skipDuplicates?: boolean
  }

  export type TodaUpsertWithoutTridersInput = {
    update: XOR<TodaUpdateWithoutTridersInput, TodaUncheckedUpdateWithoutTridersInput>
    create: XOR<TodaCreateWithoutTridersInput, TodaUncheckedCreateWithoutTridersInput>
    where?: TodaWhereInput
  }

  export type TodaUpdateToOneWithWhereWithoutTridersInput = {
    where?: TodaWhereInput
    data: XOR<TodaUpdateWithoutTridersInput, TodaUncheckedUpdateWithoutTridersInput>
  }

  export type TodaUpdateWithoutTridersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationUpdateManyWithoutTodaNestedInput
    queue_items?: TriderQueueItemUpdateManyWithoutTodaNestedInput
    ride_requests?: RideRequestUpdateManyWithoutTodaNestedInput
  }

  export type TodaUncheckedUpdateWithoutTridersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationUncheckedUpdateManyWithoutTodaNestedInput
    queue_items?: TriderQueueItemUncheckedUpdateManyWithoutTodaNestedInput
    ride_requests?: RideRequestUncheckedUpdateManyWithoutTodaNestedInput
  }

  export type TriderQueueItemUpsertWithWhereUniqueWithoutTriderInput = {
    where: TriderQueueItemWhereUniqueInput
    update: XOR<TriderQueueItemUpdateWithoutTriderInput, TriderQueueItemUncheckedUpdateWithoutTriderInput>
    create: XOR<TriderQueueItemCreateWithoutTriderInput, TriderQueueItemUncheckedCreateWithoutTriderInput>
  }

  export type TriderQueueItemUpdateWithWhereUniqueWithoutTriderInput = {
    where: TriderQueueItemWhereUniqueInput
    data: XOR<TriderQueueItemUpdateWithoutTriderInput, TriderQueueItemUncheckedUpdateWithoutTriderInput>
  }

  export type TriderQueueItemUpdateManyWithWhereWithoutTriderInput = {
    where: TriderQueueItemScalarWhereInput
    data: XOR<TriderQueueItemUpdateManyMutationInput, TriderQueueItemUncheckedUpdateManyWithoutTriderInput>
  }

  export type RideRequestUpsertWithWhereUniqueWithoutTriderInput = {
    where: RideRequestWhereUniqueInput
    update: XOR<RideRequestUpdateWithoutTriderInput, RideRequestUncheckedUpdateWithoutTriderInput>
    create: XOR<RideRequestCreateWithoutTriderInput, RideRequestUncheckedCreateWithoutTriderInput>
  }

  export type RideRequestUpdateWithWhereUniqueWithoutTriderInput = {
    where: RideRequestWhereUniqueInput
    data: XOR<RideRequestUpdateWithoutTriderInput, RideRequestUncheckedUpdateWithoutTriderInput>
  }

  export type RideRequestUpdateManyWithWhereWithoutTriderInput = {
    where: RideRequestScalarWhereInput
    data: XOR<RideRequestUpdateManyMutationInput, RideRequestUncheckedUpdateManyWithoutTriderInput>
  }

  export type TriderCreateWithoutQueue_itemsInput = {
    id?: string
    user_id: string
    first_name: string
    last_name: string
    contact_number: string
    plate_number: string
    license_number: string
    status: string
    current_latitude?: number | null
    current_longitude?: number | null
    last_online?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    toda: TodaCreateNestedOneWithoutTridersInput
    ride_requests?: RideRequestCreateNestedManyWithoutTriderInput
  }

  export type TriderUncheckedCreateWithoutQueue_itemsInput = {
    id?: string
    user_id: string
    toda_id: string
    first_name: string
    last_name: string
    contact_number: string
    plate_number: string
    license_number: string
    status: string
    current_latitude?: number | null
    current_longitude?: number | null
    last_online?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    ride_requests?: RideRequestUncheckedCreateNestedManyWithoutTriderInput
  }

  export type TriderCreateOrConnectWithoutQueue_itemsInput = {
    where: TriderWhereUniqueInput
    create: XOR<TriderCreateWithoutQueue_itemsInput, TriderUncheckedCreateWithoutQueue_itemsInput>
  }

  export type TodaCreateWithoutQueue_itemsInput = {
    id?: string
    name: string
    city: string
    barangay: string
    created_at?: Date | string
    updated_at?: Date | string
    locations?: LocationCreateNestedManyWithoutTodaInput
    triders?: TriderCreateNestedManyWithoutTodaInput
    ride_requests?: RideRequestCreateNestedManyWithoutTodaInput
  }

  export type TodaUncheckedCreateWithoutQueue_itemsInput = {
    id?: string
    name: string
    city: string
    barangay: string
    created_at?: Date | string
    updated_at?: Date | string
    locations?: LocationUncheckedCreateNestedManyWithoutTodaInput
    triders?: TriderUncheckedCreateNestedManyWithoutTodaInput
    ride_requests?: RideRequestUncheckedCreateNestedManyWithoutTodaInput
  }

  export type TodaCreateOrConnectWithoutQueue_itemsInput = {
    where: TodaWhereUniqueInput
    create: XOR<TodaCreateWithoutQueue_itemsInput, TodaUncheckedCreateWithoutQueue_itemsInput>
  }

  export type TriderUpsertWithoutQueue_itemsInput = {
    update: XOR<TriderUpdateWithoutQueue_itemsInput, TriderUncheckedUpdateWithoutQueue_itemsInput>
    create: XOR<TriderCreateWithoutQueue_itemsInput, TriderUncheckedCreateWithoutQueue_itemsInput>
    where?: TriderWhereInput
  }

  export type TriderUpdateToOneWithWhereWithoutQueue_itemsInput = {
    where?: TriderWhereInput
    data: XOR<TriderUpdateWithoutQueue_itemsInput, TriderUncheckedUpdateWithoutQueue_itemsInput>
  }

  export type TriderUpdateWithoutQueue_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    license_number?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    current_latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    current_longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    last_online?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    toda?: TodaUpdateOneRequiredWithoutTridersNestedInput
    ride_requests?: RideRequestUpdateManyWithoutTriderNestedInput
  }

  export type TriderUncheckedUpdateWithoutQueue_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    license_number?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    current_latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    current_longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    last_online?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    ride_requests?: RideRequestUncheckedUpdateManyWithoutTriderNestedInput
  }

  export type TodaUpsertWithoutQueue_itemsInput = {
    update: XOR<TodaUpdateWithoutQueue_itemsInput, TodaUncheckedUpdateWithoutQueue_itemsInput>
    create: XOR<TodaCreateWithoutQueue_itemsInput, TodaUncheckedCreateWithoutQueue_itemsInput>
    where?: TodaWhereInput
  }

  export type TodaUpdateToOneWithWhereWithoutQueue_itemsInput = {
    where?: TodaWhereInput
    data: XOR<TodaUpdateWithoutQueue_itemsInput, TodaUncheckedUpdateWithoutQueue_itemsInput>
  }

  export type TodaUpdateWithoutQueue_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationUpdateManyWithoutTodaNestedInput
    triders?: TriderUpdateManyWithoutTodaNestedInput
    ride_requests?: RideRequestUpdateManyWithoutTodaNestedInput
  }

  export type TodaUncheckedUpdateWithoutQueue_itemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationUncheckedUpdateManyWithoutTodaNestedInput
    triders?: TriderUncheckedUpdateManyWithoutTodaNestedInput
    ride_requests?: RideRequestUncheckedUpdateManyWithoutTodaNestedInput
  }

  export type TodaCreateWithoutRide_requestsInput = {
    id?: string
    name: string
    city: string
    barangay: string
    created_at?: Date | string
    updated_at?: Date | string
    locations?: LocationCreateNestedManyWithoutTodaInput
    triders?: TriderCreateNestedManyWithoutTodaInput
    queue_items?: TriderQueueItemCreateNestedManyWithoutTodaInput
  }

  export type TodaUncheckedCreateWithoutRide_requestsInput = {
    id?: string
    name: string
    city: string
    barangay: string
    created_at?: Date | string
    updated_at?: Date | string
    locations?: LocationUncheckedCreateNestedManyWithoutTodaInput
    triders?: TriderUncheckedCreateNestedManyWithoutTodaInput
    queue_items?: TriderQueueItemUncheckedCreateNestedManyWithoutTodaInput
  }

  export type TodaCreateOrConnectWithoutRide_requestsInput = {
    where: TodaWhereUniqueInput
    create: XOR<TodaCreateWithoutRide_requestsInput, TodaUncheckedCreateWithoutRide_requestsInput>
  }

  export type LocationCreateWithoutPickup_requestsInput = {
    id?: string
    name: string
    address: string
    latitude: number
    longitude: number
    city: string
    barangay: string
    type: string
    created_at?: Date | string
    updated_at?: Date | string
    toda?: TodaCreateNestedOneWithoutLocationsInput
    dropoff_requests?: RideRequestCreateNestedManyWithoutDropoff_locationInput
  }

  export type LocationUncheckedCreateWithoutPickup_requestsInput = {
    id?: string
    name: string
    address: string
    latitude: number
    longitude: number
    city: string
    barangay: string
    type: string
    toda_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    dropoff_requests?: RideRequestUncheckedCreateNestedManyWithoutDropoff_locationInput
  }

  export type LocationCreateOrConnectWithoutPickup_requestsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutPickup_requestsInput, LocationUncheckedCreateWithoutPickup_requestsInput>
  }

  export type LocationCreateWithoutDropoff_requestsInput = {
    id?: string
    name: string
    address: string
    latitude: number
    longitude: number
    city: string
    barangay: string
    type: string
    created_at?: Date | string
    updated_at?: Date | string
    toda?: TodaCreateNestedOneWithoutLocationsInput
    pickup_requests?: RideRequestCreateNestedManyWithoutPickup_locationInput
  }

  export type LocationUncheckedCreateWithoutDropoff_requestsInput = {
    id?: string
    name: string
    address: string
    latitude: number
    longitude: number
    city: string
    barangay: string
    type: string
    toda_id?: string | null
    created_at?: Date | string
    updated_at?: Date | string
    pickup_requests?: RideRequestUncheckedCreateNestedManyWithoutPickup_locationInput
  }

  export type LocationCreateOrConnectWithoutDropoff_requestsInput = {
    where: LocationWhereUniqueInput
    create: XOR<LocationCreateWithoutDropoff_requestsInput, LocationUncheckedCreateWithoutDropoff_requestsInput>
  }

  export type TriderCreateWithoutRide_requestsInput = {
    id?: string
    user_id: string
    first_name: string
    last_name: string
    contact_number: string
    plate_number: string
    license_number: string
    status: string
    current_latitude?: number | null
    current_longitude?: number | null
    last_online?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    toda: TodaCreateNestedOneWithoutTridersInput
    queue_items?: TriderQueueItemCreateNestedManyWithoutTriderInput
  }

  export type TriderUncheckedCreateWithoutRide_requestsInput = {
    id?: string
    user_id: string
    toda_id: string
    first_name: string
    last_name: string
    contact_number: string
    plate_number: string
    license_number: string
    status: string
    current_latitude?: number | null
    current_longitude?: number | null
    last_online?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
    queue_items?: TriderQueueItemUncheckedCreateNestedManyWithoutTriderInput
  }

  export type TriderCreateOrConnectWithoutRide_requestsInput = {
    where: TriderWhereUniqueInput
    create: XOR<TriderCreateWithoutRide_requestsInput, TriderUncheckedCreateWithoutRide_requestsInput>
  }

  export type TodaUpsertWithoutRide_requestsInput = {
    update: XOR<TodaUpdateWithoutRide_requestsInput, TodaUncheckedUpdateWithoutRide_requestsInput>
    create: XOR<TodaCreateWithoutRide_requestsInput, TodaUncheckedCreateWithoutRide_requestsInput>
    where?: TodaWhereInput
  }

  export type TodaUpdateToOneWithWhereWithoutRide_requestsInput = {
    where?: TodaWhereInput
    data: XOR<TodaUpdateWithoutRide_requestsInput, TodaUncheckedUpdateWithoutRide_requestsInput>
  }

  export type TodaUpdateWithoutRide_requestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationUpdateManyWithoutTodaNestedInput
    triders?: TriderUpdateManyWithoutTodaNestedInput
    queue_items?: TriderQueueItemUpdateManyWithoutTodaNestedInput
  }

  export type TodaUncheckedUpdateWithoutRide_requestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    locations?: LocationUncheckedUpdateManyWithoutTodaNestedInput
    triders?: TriderUncheckedUpdateManyWithoutTodaNestedInput
    queue_items?: TriderQueueItemUncheckedUpdateManyWithoutTodaNestedInput
  }

  export type LocationUpsertWithoutPickup_requestsInput = {
    update: XOR<LocationUpdateWithoutPickup_requestsInput, LocationUncheckedUpdateWithoutPickup_requestsInput>
    create: XOR<LocationCreateWithoutPickup_requestsInput, LocationUncheckedCreateWithoutPickup_requestsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutPickup_requestsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutPickup_requestsInput, LocationUncheckedUpdateWithoutPickup_requestsInput>
  }

  export type LocationUpdateWithoutPickup_requestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    toda?: TodaUpdateOneWithoutLocationsNestedInput
    dropoff_requests?: RideRequestUpdateManyWithoutDropoff_locationNestedInput
  }

  export type LocationUncheckedUpdateWithoutPickup_requestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    toda_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    dropoff_requests?: RideRequestUncheckedUpdateManyWithoutDropoff_locationNestedInput
  }

  export type LocationUpsertWithoutDropoff_requestsInput = {
    update: XOR<LocationUpdateWithoutDropoff_requestsInput, LocationUncheckedUpdateWithoutDropoff_requestsInput>
    create: XOR<LocationCreateWithoutDropoff_requestsInput, LocationUncheckedCreateWithoutDropoff_requestsInput>
    where?: LocationWhereInput
  }

  export type LocationUpdateToOneWithWhereWithoutDropoff_requestsInput = {
    where?: LocationWhereInput
    data: XOR<LocationUpdateWithoutDropoff_requestsInput, LocationUncheckedUpdateWithoutDropoff_requestsInput>
  }

  export type LocationUpdateWithoutDropoff_requestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    toda?: TodaUpdateOneWithoutLocationsNestedInput
    pickup_requests?: RideRequestUpdateManyWithoutPickup_locationNestedInput
  }

  export type LocationUncheckedUpdateWithoutDropoff_requestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    toda_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    pickup_requests?: RideRequestUncheckedUpdateManyWithoutPickup_locationNestedInput
  }

  export type TriderUpsertWithoutRide_requestsInput = {
    update: XOR<TriderUpdateWithoutRide_requestsInput, TriderUncheckedUpdateWithoutRide_requestsInput>
    create: XOR<TriderCreateWithoutRide_requestsInput, TriderUncheckedCreateWithoutRide_requestsInput>
    where?: TriderWhereInput
  }

  export type TriderUpdateToOneWithWhereWithoutRide_requestsInput = {
    where?: TriderWhereInput
    data: XOR<TriderUpdateWithoutRide_requestsInput, TriderUncheckedUpdateWithoutRide_requestsInput>
  }

  export type TriderUpdateWithoutRide_requestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    license_number?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    current_latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    current_longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    last_online?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    toda?: TodaUpdateOneRequiredWithoutTridersNestedInput
    queue_items?: TriderQueueItemUpdateManyWithoutTriderNestedInput
  }

  export type TriderUncheckedUpdateWithoutRide_requestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    license_number?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    current_latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    current_longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    last_online?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    queue_items?: TriderQueueItemUncheckedUpdateManyWithoutTriderNestedInput
  }

  export type LocationCreateManyTodaInput = {
    id?: string
    name: string
    address: string
    latitude: number
    longitude: number
    city: string
    barangay: string
    type: string
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type TriderCreateManyTodaInput = {
    id?: string
    user_id: string
    first_name: string
    last_name: string
    contact_number: string
    plate_number: string
    license_number: string
    status: string
    current_latitude?: number | null
    current_longitude?: number | null
    last_online?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type TriderQueueItemCreateManyTodaInput = {
    id?: string
    trider_id: string
    queue_position: number
    joined_at?: Date | string
  }

  export type RideRequestCreateManyTodaInput = {
    id?: string
    booking_code: string
    passenger_id: string
    pickup_location_id: string
    dropoff_location_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    trider_id?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
  }

  export type LocationUpdateWithoutTodaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    pickup_requests?: RideRequestUpdateManyWithoutPickup_locationNestedInput
    dropoff_requests?: RideRequestUpdateManyWithoutDropoff_locationNestedInput
  }

  export type LocationUncheckedUpdateWithoutTodaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    pickup_requests?: RideRequestUncheckedUpdateManyWithoutPickup_locationNestedInput
    dropoff_requests?: RideRequestUncheckedUpdateManyWithoutDropoff_locationNestedInput
  }

  export type LocationUncheckedUpdateManyWithoutTodaInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    city?: StringFieldUpdateOperationsInput | string
    barangay?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TriderUpdateWithoutTodaInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    license_number?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    current_latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    current_longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    last_online?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    queue_items?: TriderQueueItemUpdateManyWithoutTriderNestedInput
    ride_requests?: RideRequestUpdateManyWithoutTriderNestedInput
  }

  export type TriderUncheckedUpdateWithoutTodaInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    license_number?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    current_latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    current_longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    last_online?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    queue_items?: TriderQueueItemUncheckedUpdateManyWithoutTriderNestedInput
    ride_requests?: RideRequestUncheckedUpdateManyWithoutTriderNestedInput
  }

  export type TriderUncheckedUpdateManyWithoutTodaInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    first_name?: StringFieldUpdateOperationsInput | string
    last_name?: StringFieldUpdateOperationsInput | string
    contact_number?: StringFieldUpdateOperationsInput | string
    plate_number?: StringFieldUpdateOperationsInput | string
    license_number?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    current_latitude?: NullableFloatFieldUpdateOperationsInput | number | null
    current_longitude?: NullableFloatFieldUpdateOperationsInput | number | null
    last_online?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TriderQueueItemUpdateWithoutTodaInput = {
    id?: StringFieldUpdateOperationsInput | string
    queue_position?: IntFieldUpdateOperationsInput | number
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    trider?: TriderUpdateOneRequiredWithoutQueue_itemsNestedInput
  }

  export type TriderQueueItemUncheckedUpdateWithoutTodaInput = {
    id?: StringFieldUpdateOperationsInput | string
    trider_id?: StringFieldUpdateOperationsInput | string
    queue_position?: IntFieldUpdateOperationsInput | number
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TriderQueueItemUncheckedUpdateManyWithoutTodaInput = {
    id?: StringFieldUpdateOperationsInput | string
    trider_id?: StringFieldUpdateOperationsInput | string
    queue_position?: IntFieldUpdateOperationsInput | number
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RideRequestUpdateWithoutTodaInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    pickup_location?: LocationUpdateOneRequiredWithoutPickup_requestsNestedInput
    dropoff_location?: LocationUpdateOneRequiredWithoutDropoff_requestsNestedInput
    trider?: TriderUpdateOneWithoutRide_requestsNestedInput
  }

  export type RideRequestUncheckedUpdateWithoutTodaInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    pickup_location_id?: StringFieldUpdateOperationsInput | string
    dropoff_location_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    trider_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RideRequestUncheckedUpdateManyWithoutTodaInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    pickup_location_id?: StringFieldUpdateOperationsInput | string
    dropoff_location_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    trider_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RideRequestCreateManyPickup_locationInput = {
    id?: string
    booking_code: string
    passenger_id: string
    toda_id: string
    dropoff_location_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    trider_id?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
  }

  export type RideRequestCreateManyDropoff_locationInput = {
    id?: string
    booking_code: string
    passenger_id: string
    toda_id: string
    pickup_location_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    trider_id?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
  }

  export type RideRequestUpdateWithoutPickup_locationInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    toda?: TodaUpdateOneRequiredWithoutRide_requestsNestedInput
    dropoff_location?: LocationUpdateOneRequiredWithoutDropoff_requestsNestedInput
    trider?: TriderUpdateOneWithoutRide_requestsNestedInput
  }

  export type RideRequestUncheckedUpdateWithoutPickup_locationInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    dropoff_location_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    trider_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RideRequestUncheckedUpdateManyWithoutPickup_locationInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    dropoff_location_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    trider_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RideRequestUpdateWithoutDropoff_locationInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    toda?: TodaUpdateOneRequiredWithoutRide_requestsNestedInput
    pickup_location?: LocationUpdateOneRequiredWithoutPickup_requestsNestedInput
    trider?: TriderUpdateOneWithoutRide_requestsNestedInput
  }

  export type RideRequestUncheckedUpdateWithoutDropoff_locationInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    pickup_location_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    trider_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RideRequestUncheckedUpdateManyWithoutDropoff_locationInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    pickup_location_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    trider_id?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TriderQueueItemCreateManyTriderInput = {
    id?: string
    toda_id: string
    queue_position: number
    joined_at?: Date | string
  }

  export type RideRequestCreateManyTriderInput = {
    id?: string
    booking_code: string
    passenger_id: string
    toda_id: string
    pickup_location_id: string
    dropoff_location_id: string
    status: string
    estimated_fare: number
    estimated_time: number
    route_distance?: number | null
    route_duration?: number | null
    route_geometry?: string | null
    created_at?: Date | string
    accepted_at?: Date | string | null
    picked_up_at?: Date | string | null
    completed_at?: Date | string | null
    cancelled_at?: Date | string | null
    cancellation_reason?: string | null
  }

  export type TriderQueueItemUpdateWithoutTriderInput = {
    id?: StringFieldUpdateOperationsInput | string
    queue_position?: IntFieldUpdateOperationsInput | number
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
    toda?: TodaUpdateOneRequiredWithoutQueue_itemsNestedInput
  }

  export type TriderQueueItemUncheckedUpdateWithoutTriderInput = {
    id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    queue_position?: IntFieldUpdateOperationsInput | number
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TriderQueueItemUncheckedUpdateManyWithoutTriderInput = {
    id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    queue_position?: IntFieldUpdateOperationsInput | number
    joined_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RideRequestUpdateWithoutTriderInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
    toda?: TodaUpdateOneRequiredWithoutRide_requestsNestedInput
    pickup_location?: LocationUpdateOneRequiredWithoutPickup_requestsNestedInput
    dropoff_location?: LocationUpdateOneRequiredWithoutDropoff_requestsNestedInput
  }

  export type RideRequestUncheckedUpdateWithoutTriderInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    pickup_location_id?: StringFieldUpdateOperationsInput | string
    dropoff_location_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RideRequestUncheckedUpdateManyWithoutTriderInput = {
    id?: StringFieldUpdateOperationsInput | string
    booking_code?: StringFieldUpdateOperationsInput | string
    passenger_id?: StringFieldUpdateOperationsInput | string
    toda_id?: StringFieldUpdateOperationsInput | string
    pickup_location_id?: StringFieldUpdateOperationsInput | string
    dropoff_location_id?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    estimated_fare?: FloatFieldUpdateOperationsInput | number
    estimated_time?: IntFieldUpdateOperationsInput | number
    route_distance?: NullableFloatFieldUpdateOperationsInput | number | null
    route_duration?: NullableFloatFieldUpdateOperationsInput | number | null
    route_geometry?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    accepted_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    picked_up_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    completed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancelled_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    cancellation_reason?: NullableStringFieldUpdateOperationsInput | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}