
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
 * Model Company
 * 
 */
export type Company = $Result.DefaultSelection<Prisma.$CompanyPayload>
/**
 * Model ProductiveUnit
 * 
 */
export type ProductiveUnit = $Result.DefaultSelection<Prisma.$ProductiveUnitPayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model AuthSession
 * 
 */
export type AuthSession = $Result.DefaultSelection<Prisma.$AuthSessionPayload>
/**
 * Model Badge
 * 
 */
export type Badge = $Result.DefaultSelection<Prisma.$BadgePayload>
/**
 * Model BadgeLegendSetting
 * 
 */
export type BadgeLegendSetting = $Result.DefaultSelection<Prisma.$BadgeLegendSettingPayload>
/**
 * Model UserBadge
 * 
 */
export type UserBadge = $Result.DefaultSelection<Prisma.$UserBadgePayload>
/**
 * Model BadgeSubmission
 * 
 */
export type BadgeSubmission = $Result.DefaultSelection<Prisma.$BadgeSubmissionPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model ImportSource
 * 
 */
export type ImportSource = $Result.DefaultSelection<Prisma.$ImportSourcePayload>
/**
 * Model ImportRun
 * 
 */
export type ImportRun = $Result.DefaultSelection<Prisma.$ImportRunPayload>
/**
 * Model ImportRunRow
 * 
 */
export type ImportRunRow = $Result.DefaultSelection<Prisma.$ImportRunRowPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  admin: 'admin',
  user: 'user'
};

export type Role = (typeof Role)[keyof typeof Role]


export const BadgeTone: {
  bronze: 'bronze',
  silver: 'silver',
  gold: 'gold',
  loss_1: 'loss_1',
  loss_2: 'loss_2'
};

export type BadgeTone = (typeof BadgeTone)[keyof typeof BadgeTone]


export const SubmissionStatus: {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected'
};

export type SubmissionStatus = (typeof SubmissionStatus)[keyof typeof SubmissionStatus]


export const ImportRowStatus: {
  valid: 'valid',
  invalid: 'invalid',
  imported: 'imported'
};

export type ImportRowStatus = (typeof ImportRowStatus)[keyof typeof ImportRowStatus]


export const ImportRunStatus: {
  pending: 'pending',
  completed: 'completed',
  failed: 'failed'
};

export type ImportRunStatus = (typeof ImportRunStatus)[keyof typeof ImportRunStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type BadgeTone = $Enums.BadgeTone

export const BadgeTone: typeof $Enums.BadgeTone

export type SubmissionStatus = $Enums.SubmissionStatus

export const SubmissionStatus: typeof $Enums.SubmissionStatus

export type ImportRowStatus = $Enums.ImportRowStatus

export const ImportRowStatus: typeof $Enums.ImportRowStatus

export type ImportRunStatus = $Enums.ImportRunStatus

export const ImportRunStatus: typeof $Enums.ImportRunStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Companies
 * const companies = await prisma.company.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
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
   * // Fetch zero or more Companies
   * const companies = await prisma.company.findMany()
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
   * `prisma.company`: Exposes CRUD operations for the **Company** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Companies
    * const companies = await prisma.company.findMany()
    * ```
    */
  get company(): Prisma.CompanyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.productiveUnit`: Exposes CRUD operations for the **ProductiveUnit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ProductiveUnits
    * const productiveUnits = await prisma.productiveUnit.findMany()
    * ```
    */
  get productiveUnit(): Prisma.ProductiveUnitDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.authSession`: Exposes CRUD operations for the **AuthSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuthSessions
    * const authSessions = await prisma.authSession.findMany()
    * ```
    */
  get authSession(): Prisma.AuthSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.badge`: Exposes CRUD operations for the **Badge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Badges
    * const badges = await prisma.badge.findMany()
    * ```
    */
  get badge(): Prisma.BadgeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.badgeLegendSetting`: Exposes CRUD operations for the **BadgeLegendSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BadgeLegendSettings
    * const badgeLegendSettings = await prisma.badgeLegendSetting.findMany()
    * ```
    */
  get badgeLegendSetting(): Prisma.BadgeLegendSettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userBadge`: Exposes CRUD operations for the **UserBadge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserBadges
    * const userBadges = await prisma.userBadge.findMany()
    * ```
    */
  get userBadge(): Prisma.UserBadgeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.badgeSubmission`: Exposes CRUD operations for the **BadgeSubmission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more BadgeSubmissions
    * const badgeSubmissions = await prisma.badgeSubmission.findMany()
    * ```
    */
  get badgeSubmission(): Prisma.BadgeSubmissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.importSource`: Exposes CRUD operations for the **ImportSource** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImportSources
    * const importSources = await prisma.importSource.findMany()
    * ```
    */
  get importSource(): Prisma.ImportSourceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.importRun`: Exposes CRUD operations for the **ImportRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImportRuns
    * const importRuns = await prisma.importRun.findMany()
    * ```
    */
  get importRun(): Prisma.ImportRunDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.importRunRow`: Exposes CRUD operations for the **ImportRunRow** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ImportRunRows
    * const importRunRows = await prisma.importRunRow.findMany()
    * ```
    */
  get importRunRow(): Prisma.ImportRunRowDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
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
    Company: 'Company',
    ProductiveUnit: 'ProductiveUnit',
    User: 'User',
    AuthSession: 'AuthSession',
    Badge: 'Badge',
    BadgeLegendSetting: 'BadgeLegendSetting',
    UserBadge: 'UserBadge',
    BadgeSubmission: 'BadgeSubmission',
    Notification: 'Notification',
    ImportSource: 'ImportSource',
    ImportRun: 'ImportRun',
    ImportRunRow: 'ImportRunRow'
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
      modelProps: "company" | "productiveUnit" | "user" | "authSession" | "badge" | "badgeLegendSetting" | "userBadge" | "badgeSubmission" | "notification" | "importSource" | "importRun" | "importRunRow"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Company: {
        payload: Prisma.$CompanyPayload<ExtArgs>
        fields: Prisma.CompanyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CompanyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CompanyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findFirst: {
            args: Prisma.CompanyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CompanyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          findMany: {
            args: Prisma.CompanyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          create: {
            args: Prisma.CompanyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          createMany: {
            args: Prisma.CompanyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CompanyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          delete: {
            args: Prisma.CompanyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          update: {
            args: Prisma.CompanyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          deleteMany: {
            args: Prisma.CompanyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CompanyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CompanyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>[]
          }
          upsert: {
            args: Prisma.CompanyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CompanyPayload>
          }
          aggregate: {
            args: Prisma.CompanyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompany>
          }
          groupBy: {
            args: Prisma.CompanyGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompanyGroupByOutputType>[]
          }
          count: {
            args: Prisma.CompanyCountArgs<ExtArgs>
            result: $Utils.Optional<CompanyCountAggregateOutputType> | number
          }
        }
      }
      ProductiveUnit: {
        payload: Prisma.$ProductiveUnitPayload<ExtArgs>
        fields: Prisma.ProductiveUnitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProductiveUnitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductiveUnitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProductiveUnitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductiveUnitPayload>
          }
          findFirst: {
            args: Prisma.ProductiveUnitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductiveUnitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProductiveUnitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductiveUnitPayload>
          }
          findMany: {
            args: Prisma.ProductiveUnitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductiveUnitPayload>[]
          }
          create: {
            args: Prisma.ProductiveUnitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductiveUnitPayload>
          }
          createMany: {
            args: Prisma.ProductiveUnitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProductiveUnitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductiveUnitPayload>[]
          }
          delete: {
            args: Prisma.ProductiveUnitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductiveUnitPayload>
          }
          update: {
            args: Prisma.ProductiveUnitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductiveUnitPayload>
          }
          deleteMany: {
            args: Prisma.ProductiveUnitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProductiveUnitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProductiveUnitUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductiveUnitPayload>[]
          }
          upsert: {
            args: Prisma.ProductiveUnitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProductiveUnitPayload>
          }
          aggregate: {
            args: Prisma.ProductiveUnitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProductiveUnit>
          }
          groupBy: {
            args: Prisma.ProductiveUnitGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProductiveUnitGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProductiveUnitCountArgs<ExtArgs>
            result: $Utils.Optional<ProductiveUnitCountAggregateOutputType> | number
          }
        }
      }
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      AuthSession: {
        payload: Prisma.$AuthSessionPayload<ExtArgs>
        fields: Prisma.AuthSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuthSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuthSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          findFirst: {
            args: Prisma.AuthSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuthSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          findMany: {
            args: Prisma.AuthSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>[]
          }
          create: {
            args: Prisma.AuthSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          createMany: {
            args: Prisma.AuthSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuthSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>[]
          }
          delete: {
            args: Prisma.AuthSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          update: {
            args: Prisma.AuthSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          deleteMany: {
            args: Prisma.AuthSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuthSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuthSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>[]
          }
          upsert: {
            args: Prisma.AuthSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuthSessionPayload>
          }
          aggregate: {
            args: Prisma.AuthSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuthSession>
          }
          groupBy: {
            args: Prisma.AuthSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuthSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuthSessionCountArgs<ExtArgs>
            result: $Utils.Optional<AuthSessionCountAggregateOutputType> | number
          }
        }
      }
      Badge: {
        payload: Prisma.$BadgePayload<ExtArgs>
        fields: Prisma.BadgeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BadgeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BadgeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>
          }
          findFirst: {
            args: Prisma.BadgeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BadgeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>
          }
          findMany: {
            args: Prisma.BadgeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>[]
          }
          create: {
            args: Prisma.BadgeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>
          }
          createMany: {
            args: Prisma.BadgeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BadgeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>[]
          }
          delete: {
            args: Prisma.BadgeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>
          }
          update: {
            args: Prisma.BadgeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>
          }
          deleteMany: {
            args: Prisma.BadgeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BadgeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BadgeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>[]
          }
          upsert: {
            args: Prisma.BadgeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgePayload>
          }
          aggregate: {
            args: Prisma.BadgeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBadge>
          }
          groupBy: {
            args: Prisma.BadgeGroupByArgs<ExtArgs>
            result: $Utils.Optional<BadgeGroupByOutputType>[]
          }
          count: {
            args: Prisma.BadgeCountArgs<ExtArgs>
            result: $Utils.Optional<BadgeCountAggregateOutputType> | number
          }
        }
      }
      BadgeLegendSetting: {
        payload: Prisma.$BadgeLegendSettingPayload<ExtArgs>
        fields: Prisma.BadgeLegendSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BadgeLegendSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeLegendSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BadgeLegendSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeLegendSettingPayload>
          }
          findFirst: {
            args: Prisma.BadgeLegendSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeLegendSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BadgeLegendSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeLegendSettingPayload>
          }
          findMany: {
            args: Prisma.BadgeLegendSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeLegendSettingPayload>[]
          }
          create: {
            args: Prisma.BadgeLegendSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeLegendSettingPayload>
          }
          createMany: {
            args: Prisma.BadgeLegendSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BadgeLegendSettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeLegendSettingPayload>[]
          }
          delete: {
            args: Prisma.BadgeLegendSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeLegendSettingPayload>
          }
          update: {
            args: Prisma.BadgeLegendSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeLegendSettingPayload>
          }
          deleteMany: {
            args: Prisma.BadgeLegendSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BadgeLegendSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BadgeLegendSettingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeLegendSettingPayload>[]
          }
          upsert: {
            args: Prisma.BadgeLegendSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeLegendSettingPayload>
          }
          aggregate: {
            args: Prisma.BadgeLegendSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBadgeLegendSetting>
          }
          groupBy: {
            args: Prisma.BadgeLegendSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<BadgeLegendSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.BadgeLegendSettingCountArgs<ExtArgs>
            result: $Utils.Optional<BadgeLegendSettingCountAggregateOutputType> | number
          }
        }
      }
      UserBadge: {
        payload: Prisma.$UserBadgePayload<ExtArgs>
        fields: Prisma.UserBadgeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserBadgeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserBadgeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>
          }
          findFirst: {
            args: Prisma.UserBadgeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserBadgeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>
          }
          findMany: {
            args: Prisma.UserBadgeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>[]
          }
          create: {
            args: Prisma.UserBadgeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>
          }
          createMany: {
            args: Prisma.UserBadgeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserBadgeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>[]
          }
          delete: {
            args: Prisma.UserBadgeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>
          }
          update: {
            args: Prisma.UserBadgeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>
          }
          deleteMany: {
            args: Prisma.UserBadgeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserBadgeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserBadgeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>[]
          }
          upsert: {
            args: Prisma.UserBadgeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserBadgePayload>
          }
          aggregate: {
            args: Prisma.UserBadgeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserBadge>
          }
          groupBy: {
            args: Prisma.UserBadgeGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserBadgeGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserBadgeCountArgs<ExtArgs>
            result: $Utils.Optional<UserBadgeCountAggregateOutputType> | number
          }
        }
      }
      BadgeSubmission: {
        payload: Prisma.$BadgeSubmissionPayload<ExtArgs>
        fields: Prisma.BadgeSubmissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.BadgeSubmissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeSubmissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.BadgeSubmissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeSubmissionPayload>
          }
          findFirst: {
            args: Prisma.BadgeSubmissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeSubmissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.BadgeSubmissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeSubmissionPayload>
          }
          findMany: {
            args: Prisma.BadgeSubmissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeSubmissionPayload>[]
          }
          create: {
            args: Prisma.BadgeSubmissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeSubmissionPayload>
          }
          createMany: {
            args: Prisma.BadgeSubmissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.BadgeSubmissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeSubmissionPayload>[]
          }
          delete: {
            args: Prisma.BadgeSubmissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeSubmissionPayload>
          }
          update: {
            args: Prisma.BadgeSubmissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeSubmissionPayload>
          }
          deleteMany: {
            args: Prisma.BadgeSubmissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.BadgeSubmissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.BadgeSubmissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeSubmissionPayload>[]
          }
          upsert: {
            args: Prisma.BadgeSubmissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$BadgeSubmissionPayload>
          }
          aggregate: {
            args: Prisma.BadgeSubmissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateBadgeSubmission>
          }
          groupBy: {
            args: Prisma.BadgeSubmissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<BadgeSubmissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.BadgeSubmissionCountArgs<ExtArgs>
            result: $Utils.Optional<BadgeSubmissionCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.NotificationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.NotificationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      ImportSource: {
        payload: Prisma.$ImportSourcePayload<ExtArgs>
        fields: Prisma.ImportSourceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImportSourceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSourcePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImportSourceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSourcePayload>
          }
          findFirst: {
            args: Prisma.ImportSourceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSourcePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImportSourceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSourcePayload>
          }
          findMany: {
            args: Prisma.ImportSourceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSourcePayload>[]
          }
          create: {
            args: Prisma.ImportSourceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSourcePayload>
          }
          createMany: {
            args: Prisma.ImportSourceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImportSourceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSourcePayload>[]
          }
          delete: {
            args: Prisma.ImportSourceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSourcePayload>
          }
          update: {
            args: Prisma.ImportSourceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSourcePayload>
          }
          deleteMany: {
            args: Prisma.ImportSourceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImportSourceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImportSourceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSourcePayload>[]
          }
          upsert: {
            args: Prisma.ImportSourceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportSourcePayload>
          }
          aggregate: {
            args: Prisma.ImportSourceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImportSource>
          }
          groupBy: {
            args: Prisma.ImportSourceGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImportSourceGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImportSourceCountArgs<ExtArgs>
            result: $Utils.Optional<ImportSourceCountAggregateOutputType> | number
          }
        }
      }
      ImportRun: {
        payload: Prisma.$ImportRunPayload<ExtArgs>
        fields: Prisma.ImportRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImportRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImportRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunPayload>
          }
          findFirst: {
            args: Prisma.ImportRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImportRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunPayload>
          }
          findMany: {
            args: Prisma.ImportRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunPayload>[]
          }
          create: {
            args: Prisma.ImportRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunPayload>
          }
          createMany: {
            args: Prisma.ImportRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImportRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunPayload>[]
          }
          delete: {
            args: Prisma.ImportRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunPayload>
          }
          update: {
            args: Prisma.ImportRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunPayload>
          }
          deleteMany: {
            args: Prisma.ImportRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImportRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImportRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunPayload>[]
          }
          upsert: {
            args: Prisma.ImportRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunPayload>
          }
          aggregate: {
            args: Prisma.ImportRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImportRun>
          }
          groupBy: {
            args: Prisma.ImportRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImportRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImportRunCountArgs<ExtArgs>
            result: $Utils.Optional<ImportRunCountAggregateOutputType> | number
          }
        }
      }
      ImportRunRow: {
        payload: Prisma.$ImportRunRowPayload<ExtArgs>
        fields: Prisma.ImportRunRowFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ImportRunRowFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunRowPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ImportRunRowFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunRowPayload>
          }
          findFirst: {
            args: Prisma.ImportRunRowFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunRowPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ImportRunRowFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunRowPayload>
          }
          findMany: {
            args: Prisma.ImportRunRowFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunRowPayload>[]
          }
          create: {
            args: Prisma.ImportRunRowCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunRowPayload>
          }
          createMany: {
            args: Prisma.ImportRunRowCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ImportRunRowCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunRowPayload>[]
          }
          delete: {
            args: Prisma.ImportRunRowDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunRowPayload>
          }
          update: {
            args: Prisma.ImportRunRowUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunRowPayload>
          }
          deleteMany: {
            args: Prisma.ImportRunRowDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ImportRunRowUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ImportRunRowUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunRowPayload>[]
          }
          upsert: {
            args: Prisma.ImportRunRowUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ImportRunRowPayload>
          }
          aggregate: {
            args: Prisma.ImportRunRowAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateImportRunRow>
          }
          groupBy: {
            args: Prisma.ImportRunRowGroupByArgs<ExtArgs>
            result: $Utils.Optional<ImportRunRowGroupByOutputType>[]
          }
          count: {
            args: Prisma.ImportRunRowCountArgs<ExtArgs>
            result: $Utils.Optional<ImportRunRowCountAggregateOutputType> | number
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
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
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
    company?: CompanyOmit
    productiveUnit?: ProductiveUnitOmit
    user?: UserOmit
    authSession?: AuthSessionOmit
    badge?: BadgeOmit
    badgeLegendSetting?: BadgeLegendSettingOmit
    userBadge?: UserBadgeOmit
    badgeSubmission?: BadgeSubmissionOmit
    notification?: NotificationOmit
    importSource?: ImportSourceOmit
    importRun?: ImportRunOmit
    importRunRow?: ImportRunRowOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

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
   * Count Type CompanyCountOutputType
   */

  export type CompanyCountOutputType = {
    productive_units: number
    users: number
  }

  export type CompanyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    productive_units?: boolean | CompanyCountOutputTypeCountProductive_unitsArgs
    users?: boolean | CompanyCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CompanyCountOutputType
     */
    select?: CompanyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountProductive_unitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductiveUnitWhereInput
  }

  /**
   * CompanyCountOutputType without action
   */
  export type CompanyCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type ProductiveUnitCountOutputType
   */

  export type ProductiveUnitCountOutputType = {
    users: number
  }

  export type ProductiveUnitCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | ProductiveUnitCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * ProductiveUnitCountOutputType without action
   */
  export type ProductiveUnitCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnitCountOutputType
     */
    select?: ProductiveUnitCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProductiveUnitCountOutputType without action
   */
  export type ProductiveUnitCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    user_badges: number
    awarded_badges: number
    submissions: number
    reviewed_submissions: number
    notifications: number
    badge_legend_settings: number
    import_runs: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    user_badges?: boolean | UserCountOutputTypeCountUser_badgesArgs
    awarded_badges?: boolean | UserCountOutputTypeCountAwarded_badgesArgs
    submissions?: boolean | UserCountOutputTypeCountSubmissionsArgs
    reviewed_submissions?: boolean | UserCountOutputTypeCountReviewed_submissionsArgs
    notifications?: boolean | UserCountOutputTypeCountNotificationsArgs
    badge_legend_settings?: boolean | UserCountOutputTypeCountBadge_legend_settingsArgs
    import_runs?: boolean | UserCountOutputTypeCountImport_runsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountUser_badgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserBadgeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAwarded_badgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserBadgeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSubmissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BadgeSubmissionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReviewed_submissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BadgeSubmissionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountNotificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountBadge_legend_settingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BadgeLegendSettingWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountImport_runsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImportRunWhereInput
  }


  /**
   * Count Type BadgeCountOutputType
   */

  export type BadgeCountOutputType = {
    user_badges: number
    submissions: number
  }

  export type BadgeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user_badges?: boolean | BadgeCountOutputTypeCountUser_badgesArgs
    submissions?: boolean | BadgeCountOutputTypeCountSubmissionsArgs
  }

  // Custom InputTypes
  /**
   * BadgeCountOutputType without action
   */
  export type BadgeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeCountOutputType
     */
    select?: BadgeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * BadgeCountOutputType without action
   */
  export type BadgeCountOutputTypeCountUser_badgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserBadgeWhereInput
  }

  /**
   * BadgeCountOutputType without action
   */
  export type BadgeCountOutputTypeCountSubmissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BadgeSubmissionWhereInput
  }


  /**
   * Count Type ImportSourceCountOutputType
   */

  export type ImportSourceCountOutputType = {
    import_runs: number
  }

  export type ImportSourceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    import_runs?: boolean | ImportSourceCountOutputTypeCountImport_runsArgs
  }

  // Custom InputTypes
  /**
   * ImportSourceCountOutputType without action
   */
  export type ImportSourceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSourceCountOutputType
     */
    select?: ImportSourceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ImportSourceCountOutputType without action
   */
  export type ImportSourceCountOutputTypeCountImport_runsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImportRunWhereInput
  }


  /**
   * Count Type ImportRunCountOutputType
   */

  export type ImportRunCountOutputType = {
    rows: number
  }

  export type ImportRunCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    rows?: boolean | ImportRunCountOutputTypeCountRowsArgs
  }

  // Custom InputTypes
  /**
   * ImportRunCountOutputType without action
   */
  export type ImportRunCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunCountOutputType
     */
    select?: ImportRunCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ImportRunCountOutputType without action
   */
  export type ImportRunCountOutputTypeCountRowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImportRunRowWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Company
   */

  export type AggregateCompany = {
    _count: CompanyCountAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  export type CompanyMinAggregateOutputType = {
    id: string | null
    name: string | null
    logo_url: string | null
    created_at: Date | null
  }

  export type CompanyMaxAggregateOutputType = {
    id: string | null
    name: string | null
    logo_url: string | null
    created_at: Date | null
  }

  export type CompanyCountAggregateOutputType = {
    id: number
    name: number
    logo_url: number
    created_at: number
    _all: number
  }


  export type CompanyMinAggregateInputType = {
    id?: true
    name?: true
    logo_url?: true
    created_at?: true
  }

  export type CompanyMaxAggregateInputType = {
    id?: true
    name?: true
    logo_url?: true
    created_at?: true
  }

  export type CompanyCountAggregateInputType = {
    id?: true
    name?: true
    logo_url?: true
    created_at?: true
    _all?: true
  }

  export type CompanyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Company to aggregate.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Companies
    **/
    _count?: true | CompanyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompanyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompanyMaxAggregateInputType
  }

  export type GetCompanyAggregateType<T extends CompanyAggregateArgs> = {
        [P in keyof T & keyof AggregateCompany]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompany[P]>
      : GetScalarType<T[P], AggregateCompany[P]>
  }




  export type CompanyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CompanyWhereInput
    orderBy?: CompanyOrderByWithAggregationInput | CompanyOrderByWithAggregationInput[]
    by: CompanyScalarFieldEnum[] | CompanyScalarFieldEnum
    having?: CompanyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompanyCountAggregateInputType | true
    _min?: CompanyMinAggregateInputType
    _max?: CompanyMaxAggregateInputType
  }

  export type CompanyGroupByOutputType = {
    id: string
    name: string
    logo_url: string | null
    created_at: Date
    _count: CompanyCountAggregateOutputType | null
    _min: CompanyMinAggregateOutputType | null
    _max: CompanyMaxAggregateOutputType | null
  }

  type GetCompanyGroupByPayload<T extends CompanyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompanyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompanyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompanyGroupByOutputType[P]>
            : GetScalarType<T[P], CompanyGroupByOutputType[P]>
        }
      >
    >


  export type CompanySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    logo_url?: boolean
    created_at?: boolean
    productive_units?: boolean | Company$productive_unitsArgs<ExtArgs>
    users?: boolean | Company$usersArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["company"]>

  export type CompanySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    logo_url?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["company"]>

  export type CompanySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    logo_url?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["company"]>

  export type CompanySelectScalar = {
    id?: boolean
    name?: boolean
    logo_url?: boolean
    created_at?: boolean
  }

  export type CompanyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "logo_url" | "created_at", ExtArgs["result"]["company"]>
  export type CompanyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    productive_units?: boolean | Company$productive_unitsArgs<ExtArgs>
    users?: boolean | Company$usersArgs<ExtArgs>
    _count?: boolean | CompanyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CompanyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CompanyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CompanyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Company"
    objects: {
      productive_units: Prisma.$ProductiveUnitPayload<ExtArgs>[]
      users: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      logo_url: string | null
      created_at: Date
    }, ExtArgs["result"]["company"]>
    composites: {}
  }

  type CompanyGetPayload<S extends boolean | null | undefined | CompanyDefaultArgs> = $Result.GetResult<Prisma.$CompanyPayload, S>

  type CompanyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CompanyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompanyCountAggregateInputType | true
    }

  export interface CompanyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Company'], meta: { name: 'Company' } }
    /**
     * Find zero or one Company that matches the filter.
     * @param {CompanyFindUniqueArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CompanyFindUniqueArgs>(args: SelectSubset<T, CompanyFindUniqueArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Company that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CompanyFindUniqueOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CompanyFindUniqueOrThrowArgs>(args: SelectSubset<T, CompanyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Company that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CompanyFindFirstArgs>(args?: SelectSubset<T, CompanyFindFirstArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Company that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindFirstOrThrowArgs} args - Arguments to find a Company
     * @example
     * // Get one Company
     * const company = await prisma.company.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CompanyFindFirstOrThrowArgs>(args?: SelectSubset<T, CompanyFindFirstOrThrowArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Companies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Companies
     * const companies = await prisma.company.findMany()
     * 
     * // Get first 10 Companies
     * const companies = await prisma.company.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const companyWithIdOnly = await prisma.company.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CompanyFindManyArgs>(args?: SelectSubset<T, CompanyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Company.
     * @param {CompanyCreateArgs} args - Arguments to create a Company.
     * @example
     * // Create one Company
     * const Company = await prisma.company.create({
     *   data: {
     *     // ... data to create a Company
     *   }
     * })
     * 
     */
    create<T extends CompanyCreateArgs>(args: SelectSubset<T, CompanyCreateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Companies.
     * @param {CompanyCreateManyArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CompanyCreateManyArgs>(args?: SelectSubset<T, CompanyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Companies and returns the data saved in the database.
     * @param {CompanyCreateManyAndReturnArgs} args - Arguments to create many Companies.
     * @example
     * // Create many Companies
     * const company = await prisma.company.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Companies and only return the `id`
     * const companyWithIdOnly = await prisma.company.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CompanyCreateManyAndReturnArgs>(args?: SelectSubset<T, CompanyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Company.
     * @param {CompanyDeleteArgs} args - Arguments to delete one Company.
     * @example
     * // Delete one Company
     * const Company = await prisma.company.delete({
     *   where: {
     *     // ... filter to delete one Company
     *   }
     * })
     * 
     */
    delete<T extends CompanyDeleteArgs>(args: SelectSubset<T, CompanyDeleteArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Company.
     * @param {CompanyUpdateArgs} args - Arguments to update one Company.
     * @example
     * // Update one Company
     * const company = await prisma.company.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CompanyUpdateArgs>(args: SelectSubset<T, CompanyUpdateArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Companies.
     * @param {CompanyDeleteManyArgs} args - Arguments to filter Companies to delete.
     * @example
     * // Delete a few Companies
     * const { count } = await prisma.company.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CompanyDeleteManyArgs>(args?: SelectSubset<T, CompanyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Companies
     * const company = await prisma.company.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CompanyUpdateManyArgs>(args: SelectSubset<T, CompanyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Companies and returns the data updated in the database.
     * @param {CompanyUpdateManyAndReturnArgs} args - Arguments to update many Companies.
     * @example
     * // Update many Companies
     * const company = await prisma.company.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Companies and only return the `id`
     * const companyWithIdOnly = await prisma.company.updateManyAndReturn({
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
    updateManyAndReturn<T extends CompanyUpdateManyAndReturnArgs>(args: SelectSubset<T, CompanyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Company.
     * @param {CompanyUpsertArgs} args - Arguments to update or create a Company.
     * @example
     * // Update or create a Company
     * const company = await prisma.company.upsert({
     *   create: {
     *     // ... data to create a Company
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Company we want to update
     *   }
     * })
     */
    upsert<T extends CompanyUpsertArgs>(args: SelectSubset<T, CompanyUpsertArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Companies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyCountArgs} args - Arguments to filter Companies to count.
     * @example
     * // Count the number of Companies
     * const count = await prisma.company.count({
     *   where: {
     *     // ... the filter for the Companies we want to count
     *   }
     * })
    **/
    count<T extends CompanyCountArgs>(
      args?: Subset<T, CompanyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompanyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CompanyAggregateArgs>(args: Subset<T, CompanyAggregateArgs>): Prisma.PrismaPromise<GetCompanyAggregateType<T>>

    /**
     * Group by Company.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompanyGroupByArgs} args - Group by arguments.
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
      T extends CompanyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CompanyGroupByArgs['orderBy'] }
        : { orderBy?: CompanyGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CompanyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Company model
   */
  readonly fields: CompanyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Company.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CompanyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    productive_units<T extends Company$productive_unitsArgs<ExtArgs> = {}>(args?: Subset<T, Company$productive_unitsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductiveUnitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    users<T extends Company$usersArgs<ExtArgs> = {}>(args?: Subset<T, Company$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Company model
   */
  interface CompanyFieldRefs {
    readonly id: FieldRef<"Company", 'String'>
    readonly name: FieldRef<"Company", 'String'>
    readonly logo_url: FieldRef<"Company", 'String'>
    readonly created_at: FieldRef<"Company", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Company findUnique
   */
  export type CompanyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findUniqueOrThrow
   */
  export type CompanyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company findFirst
   */
  export type CompanyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findFirstOrThrow
   */
  export type CompanyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Company to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Companies.
     */
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company findMany
   */
  export type CompanyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter, which Companies to fetch.
     */
    where?: CompanyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Companies to fetch.
     */
    orderBy?: CompanyOrderByWithRelationInput | CompanyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Companies.
     */
    cursor?: CompanyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Companies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Companies.
     */
    skip?: number
    distinct?: CompanyScalarFieldEnum | CompanyScalarFieldEnum[]
  }

  /**
   * Company create
   */
  export type CompanyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to create a Company.
     */
    data: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
  }

  /**
   * Company createMany
   */
  export type CompanyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Company createManyAndReturn
   */
  export type CompanyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * The data used to create many Companies.
     */
    data: CompanyCreateManyInput | CompanyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Company update
   */
  export type CompanyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The data needed to update a Company.
     */
    data: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
    /**
     * Choose, which Company to update.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company updateMany
   */
  export type CompanyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Companies.
     */
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>
    /**
     * Filter which Companies to update
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to update.
     */
    limit?: number
  }

  /**
   * Company updateManyAndReturn
   */
  export type CompanyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * The data used to update Companies.
     */
    data: XOR<CompanyUpdateManyMutationInput, CompanyUncheckedUpdateManyInput>
    /**
     * Filter which Companies to update
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to update.
     */
    limit?: number
  }

  /**
   * Company upsert
   */
  export type CompanyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * The filter to search for the Company to update in case it exists.
     */
    where: CompanyWhereUniqueInput
    /**
     * In case the Company found by the `where` argument doesn't exist, create a new Company with this data.
     */
    create: XOR<CompanyCreateInput, CompanyUncheckedCreateInput>
    /**
     * In case the Company was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CompanyUpdateInput, CompanyUncheckedUpdateInput>
  }

  /**
   * Company delete
   */
  export type CompanyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    /**
     * Filter which Company to delete.
     */
    where: CompanyWhereUniqueInput
  }

  /**
   * Company deleteMany
   */
  export type CompanyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Companies to delete
     */
    where?: CompanyWhereInput
    /**
     * Limit how many Companies to delete.
     */
    limit?: number
  }

  /**
   * Company.productive_units
   */
  export type Company$productive_unitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitInclude<ExtArgs> | null
    where?: ProductiveUnitWhereInput
    orderBy?: ProductiveUnitOrderByWithRelationInput | ProductiveUnitOrderByWithRelationInput[]
    cursor?: ProductiveUnitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProductiveUnitScalarFieldEnum | ProductiveUnitScalarFieldEnum[]
  }

  /**
   * Company.users
   */
  export type Company$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Company without action
   */
  export type CompanyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
  }


  /**
   * Model ProductiveUnit
   */

  export type AggregateProductiveUnit = {
    _count: ProductiveUnitCountAggregateOutputType | null
    _min: ProductiveUnitMinAggregateOutputType | null
    _max: ProductiveUnitMaxAggregateOutputType | null
  }

  export type ProductiveUnitMinAggregateOutputType = {
    id: string | null
    company_id: string | null
    name: string | null
    created_at: Date | null
  }

  export type ProductiveUnitMaxAggregateOutputType = {
    id: string | null
    company_id: string | null
    name: string | null
    created_at: Date | null
  }

  export type ProductiveUnitCountAggregateOutputType = {
    id: number
    company_id: number
    name: number
    created_at: number
    _all: number
  }


  export type ProductiveUnitMinAggregateInputType = {
    id?: true
    company_id?: true
    name?: true
    created_at?: true
  }

  export type ProductiveUnitMaxAggregateInputType = {
    id?: true
    company_id?: true
    name?: true
    created_at?: true
  }

  export type ProductiveUnitCountAggregateInputType = {
    id?: true
    company_id?: true
    name?: true
    created_at?: true
    _all?: true
  }

  export type ProductiveUnitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductiveUnit to aggregate.
     */
    where?: ProductiveUnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductiveUnits to fetch.
     */
    orderBy?: ProductiveUnitOrderByWithRelationInput | ProductiveUnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProductiveUnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductiveUnits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductiveUnits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ProductiveUnits
    **/
    _count?: true | ProductiveUnitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProductiveUnitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProductiveUnitMaxAggregateInputType
  }

  export type GetProductiveUnitAggregateType<T extends ProductiveUnitAggregateArgs> = {
        [P in keyof T & keyof AggregateProductiveUnit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProductiveUnit[P]>
      : GetScalarType<T[P], AggregateProductiveUnit[P]>
  }




  export type ProductiveUnitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProductiveUnitWhereInput
    orderBy?: ProductiveUnitOrderByWithAggregationInput | ProductiveUnitOrderByWithAggregationInput[]
    by: ProductiveUnitScalarFieldEnum[] | ProductiveUnitScalarFieldEnum
    having?: ProductiveUnitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProductiveUnitCountAggregateInputType | true
    _min?: ProductiveUnitMinAggregateInputType
    _max?: ProductiveUnitMaxAggregateInputType
  }

  export type ProductiveUnitGroupByOutputType = {
    id: string
    company_id: string
    name: string
    created_at: Date
    _count: ProductiveUnitCountAggregateOutputType | null
    _min: ProductiveUnitMinAggregateOutputType | null
    _max: ProductiveUnitMaxAggregateOutputType | null
  }

  type GetProductiveUnitGroupByPayload<T extends ProductiveUnitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProductiveUnitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProductiveUnitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProductiveUnitGroupByOutputType[P]>
            : GetScalarType<T[P], ProductiveUnitGroupByOutputType[P]>
        }
      >
    >


  export type ProductiveUnitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    company_id?: boolean
    name?: boolean
    created_at?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    users?: boolean | ProductiveUnit$usersArgs<ExtArgs>
    _count?: boolean | ProductiveUnitCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productiveUnit"]>

  export type ProductiveUnitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    company_id?: boolean
    name?: boolean
    created_at?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productiveUnit"]>

  export type ProductiveUnitSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    company_id?: boolean
    name?: boolean
    created_at?: boolean
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["productiveUnit"]>

  export type ProductiveUnitSelectScalar = {
    id?: boolean
    company_id?: boolean
    name?: boolean
    created_at?: boolean
  }

  export type ProductiveUnitOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "company_id" | "name" | "created_at", ExtArgs["result"]["productiveUnit"]>
  export type ProductiveUnitInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
    users?: boolean | ProductiveUnit$usersArgs<ExtArgs>
    _count?: boolean | ProductiveUnitCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProductiveUnitIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }
  export type ProductiveUnitIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | CompanyDefaultArgs<ExtArgs>
  }

  export type $ProductiveUnitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ProductiveUnit"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs>
      users: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      company_id: string
      name: string
      created_at: Date
    }, ExtArgs["result"]["productiveUnit"]>
    composites: {}
  }

  type ProductiveUnitGetPayload<S extends boolean | null | undefined | ProductiveUnitDefaultArgs> = $Result.GetResult<Prisma.$ProductiveUnitPayload, S>

  type ProductiveUnitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProductiveUnitFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProductiveUnitCountAggregateInputType | true
    }

  export interface ProductiveUnitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ProductiveUnit'], meta: { name: 'ProductiveUnit' } }
    /**
     * Find zero or one ProductiveUnit that matches the filter.
     * @param {ProductiveUnitFindUniqueArgs} args - Arguments to find a ProductiveUnit
     * @example
     * // Get one ProductiveUnit
     * const productiveUnit = await prisma.productiveUnit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProductiveUnitFindUniqueArgs>(args: SelectSubset<T, ProductiveUnitFindUniqueArgs<ExtArgs>>): Prisma__ProductiveUnitClient<$Result.GetResult<Prisma.$ProductiveUnitPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ProductiveUnit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProductiveUnitFindUniqueOrThrowArgs} args - Arguments to find a ProductiveUnit
     * @example
     * // Get one ProductiveUnit
     * const productiveUnit = await prisma.productiveUnit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProductiveUnitFindUniqueOrThrowArgs>(args: SelectSubset<T, ProductiveUnitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProductiveUnitClient<$Result.GetResult<Prisma.$ProductiveUnitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductiveUnit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductiveUnitFindFirstArgs} args - Arguments to find a ProductiveUnit
     * @example
     * // Get one ProductiveUnit
     * const productiveUnit = await prisma.productiveUnit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProductiveUnitFindFirstArgs>(args?: SelectSubset<T, ProductiveUnitFindFirstArgs<ExtArgs>>): Prisma__ProductiveUnitClient<$Result.GetResult<Prisma.$ProductiveUnitPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ProductiveUnit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductiveUnitFindFirstOrThrowArgs} args - Arguments to find a ProductiveUnit
     * @example
     * // Get one ProductiveUnit
     * const productiveUnit = await prisma.productiveUnit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProductiveUnitFindFirstOrThrowArgs>(args?: SelectSubset<T, ProductiveUnitFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProductiveUnitClient<$Result.GetResult<Prisma.$ProductiveUnitPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ProductiveUnits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductiveUnitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ProductiveUnits
     * const productiveUnits = await prisma.productiveUnit.findMany()
     * 
     * // Get first 10 ProductiveUnits
     * const productiveUnits = await prisma.productiveUnit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const productiveUnitWithIdOnly = await prisma.productiveUnit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProductiveUnitFindManyArgs>(args?: SelectSubset<T, ProductiveUnitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductiveUnitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ProductiveUnit.
     * @param {ProductiveUnitCreateArgs} args - Arguments to create a ProductiveUnit.
     * @example
     * // Create one ProductiveUnit
     * const ProductiveUnit = await prisma.productiveUnit.create({
     *   data: {
     *     // ... data to create a ProductiveUnit
     *   }
     * })
     * 
     */
    create<T extends ProductiveUnitCreateArgs>(args: SelectSubset<T, ProductiveUnitCreateArgs<ExtArgs>>): Prisma__ProductiveUnitClient<$Result.GetResult<Prisma.$ProductiveUnitPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ProductiveUnits.
     * @param {ProductiveUnitCreateManyArgs} args - Arguments to create many ProductiveUnits.
     * @example
     * // Create many ProductiveUnits
     * const productiveUnit = await prisma.productiveUnit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProductiveUnitCreateManyArgs>(args?: SelectSubset<T, ProductiveUnitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ProductiveUnits and returns the data saved in the database.
     * @param {ProductiveUnitCreateManyAndReturnArgs} args - Arguments to create many ProductiveUnits.
     * @example
     * // Create many ProductiveUnits
     * const productiveUnit = await prisma.productiveUnit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ProductiveUnits and only return the `id`
     * const productiveUnitWithIdOnly = await prisma.productiveUnit.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProductiveUnitCreateManyAndReturnArgs>(args?: SelectSubset<T, ProductiveUnitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductiveUnitPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ProductiveUnit.
     * @param {ProductiveUnitDeleteArgs} args - Arguments to delete one ProductiveUnit.
     * @example
     * // Delete one ProductiveUnit
     * const ProductiveUnit = await prisma.productiveUnit.delete({
     *   where: {
     *     // ... filter to delete one ProductiveUnit
     *   }
     * })
     * 
     */
    delete<T extends ProductiveUnitDeleteArgs>(args: SelectSubset<T, ProductiveUnitDeleteArgs<ExtArgs>>): Prisma__ProductiveUnitClient<$Result.GetResult<Prisma.$ProductiveUnitPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ProductiveUnit.
     * @param {ProductiveUnitUpdateArgs} args - Arguments to update one ProductiveUnit.
     * @example
     * // Update one ProductiveUnit
     * const productiveUnit = await prisma.productiveUnit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProductiveUnitUpdateArgs>(args: SelectSubset<T, ProductiveUnitUpdateArgs<ExtArgs>>): Prisma__ProductiveUnitClient<$Result.GetResult<Prisma.$ProductiveUnitPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ProductiveUnits.
     * @param {ProductiveUnitDeleteManyArgs} args - Arguments to filter ProductiveUnits to delete.
     * @example
     * // Delete a few ProductiveUnits
     * const { count } = await prisma.productiveUnit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProductiveUnitDeleteManyArgs>(args?: SelectSubset<T, ProductiveUnitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductiveUnits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductiveUnitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ProductiveUnits
     * const productiveUnit = await prisma.productiveUnit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProductiveUnitUpdateManyArgs>(args: SelectSubset<T, ProductiveUnitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ProductiveUnits and returns the data updated in the database.
     * @param {ProductiveUnitUpdateManyAndReturnArgs} args - Arguments to update many ProductiveUnits.
     * @example
     * // Update many ProductiveUnits
     * const productiveUnit = await prisma.productiveUnit.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ProductiveUnits and only return the `id`
     * const productiveUnitWithIdOnly = await prisma.productiveUnit.updateManyAndReturn({
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
    updateManyAndReturn<T extends ProductiveUnitUpdateManyAndReturnArgs>(args: SelectSubset<T, ProductiveUnitUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProductiveUnitPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ProductiveUnit.
     * @param {ProductiveUnitUpsertArgs} args - Arguments to update or create a ProductiveUnit.
     * @example
     * // Update or create a ProductiveUnit
     * const productiveUnit = await prisma.productiveUnit.upsert({
     *   create: {
     *     // ... data to create a ProductiveUnit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ProductiveUnit we want to update
     *   }
     * })
     */
    upsert<T extends ProductiveUnitUpsertArgs>(args: SelectSubset<T, ProductiveUnitUpsertArgs<ExtArgs>>): Prisma__ProductiveUnitClient<$Result.GetResult<Prisma.$ProductiveUnitPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ProductiveUnits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductiveUnitCountArgs} args - Arguments to filter ProductiveUnits to count.
     * @example
     * // Count the number of ProductiveUnits
     * const count = await prisma.productiveUnit.count({
     *   where: {
     *     // ... the filter for the ProductiveUnits we want to count
     *   }
     * })
    **/
    count<T extends ProductiveUnitCountArgs>(
      args?: Subset<T, ProductiveUnitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProductiveUnitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ProductiveUnit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductiveUnitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ProductiveUnitAggregateArgs>(args: Subset<T, ProductiveUnitAggregateArgs>): Prisma.PrismaPromise<GetProductiveUnitAggregateType<T>>

    /**
     * Group by ProductiveUnit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProductiveUnitGroupByArgs} args - Group by arguments.
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
      T extends ProductiveUnitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProductiveUnitGroupByArgs['orderBy'] }
        : { orderBy?: ProductiveUnitGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ProductiveUnitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductiveUnitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ProductiveUnit model
   */
  readonly fields: ProductiveUnitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ProductiveUnit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProductiveUnitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends CompanyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CompanyDefaultArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    users<T extends ProductiveUnit$usersArgs<ExtArgs> = {}>(args?: Subset<T, ProductiveUnit$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ProductiveUnit model
   */
  interface ProductiveUnitFieldRefs {
    readonly id: FieldRef<"ProductiveUnit", 'String'>
    readonly company_id: FieldRef<"ProductiveUnit", 'String'>
    readonly name: FieldRef<"ProductiveUnit", 'String'>
    readonly created_at: FieldRef<"ProductiveUnit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ProductiveUnit findUnique
   */
  export type ProductiveUnitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitInclude<ExtArgs> | null
    /**
     * Filter, which ProductiveUnit to fetch.
     */
    where: ProductiveUnitWhereUniqueInput
  }

  /**
   * ProductiveUnit findUniqueOrThrow
   */
  export type ProductiveUnitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitInclude<ExtArgs> | null
    /**
     * Filter, which ProductiveUnit to fetch.
     */
    where: ProductiveUnitWhereUniqueInput
  }

  /**
   * ProductiveUnit findFirst
   */
  export type ProductiveUnitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitInclude<ExtArgs> | null
    /**
     * Filter, which ProductiveUnit to fetch.
     */
    where?: ProductiveUnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductiveUnits to fetch.
     */
    orderBy?: ProductiveUnitOrderByWithRelationInput | ProductiveUnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductiveUnits.
     */
    cursor?: ProductiveUnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductiveUnits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductiveUnits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductiveUnits.
     */
    distinct?: ProductiveUnitScalarFieldEnum | ProductiveUnitScalarFieldEnum[]
  }

  /**
   * ProductiveUnit findFirstOrThrow
   */
  export type ProductiveUnitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitInclude<ExtArgs> | null
    /**
     * Filter, which ProductiveUnit to fetch.
     */
    where?: ProductiveUnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductiveUnits to fetch.
     */
    orderBy?: ProductiveUnitOrderByWithRelationInput | ProductiveUnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ProductiveUnits.
     */
    cursor?: ProductiveUnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductiveUnits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductiveUnits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ProductiveUnits.
     */
    distinct?: ProductiveUnitScalarFieldEnum | ProductiveUnitScalarFieldEnum[]
  }

  /**
   * ProductiveUnit findMany
   */
  export type ProductiveUnitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitInclude<ExtArgs> | null
    /**
     * Filter, which ProductiveUnits to fetch.
     */
    where?: ProductiveUnitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ProductiveUnits to fetch.
     */
    orderBy?: ProductiveUnitOrderByWithRelationInput | ProductiveUnitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ProductiveUnits.
     */
    cursor?: ProductiveUnitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ProductiveUnits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ProductiveUnits.
     */
    skip?: number
    distinct?: ProductiveUnitScalarFieldEnum | ProductiveUnitScalarFieldEnum[]
  }

  /**
   * ProductiveUnit create
   */
  export type ProductiveUnitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitInclude<ExtArgs> | null
    /**
     * The data needed to create a ProductiveUnit.
     */
    data: XOR<ProductiveUnitCreateInput, ProductiveUnitUncheckedCreateInput>
  }

  /**
   * ProductiveUnit createMany
   */
  export type ProductiveUnitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ProductiveUnits.
     */
    data: ProductiveUnitCreateManyInput | ProductiveUnitCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ProductiveUnit createManyAndReturn
   */
  export type ProductiveUnitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * The data used to create many ProductiveUnits.
     */
    data: ProductiveUnitCreateManyInput | ProductiveUnitCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductiveUnit update
   */
  export type ProductiveUnitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitInclude<ExtArgs> | null
    /**
     * The data needed to update a ProductiveUnit.
     */
    data: XOR<ProductiveUnitUpdateInput, ProductiveUnitUncheckedUpdateInput>
    /**
     * Choose, which ProductiveUnit to update.
     */
    where: ProductiveUnitWhereUniqueInput
  }

  /**
   * ProductiveUnit updateMany
   */
  export type ProductiveUnitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ProductiveUnits.
     */
    data: XOR<ProductiveUnitUpdateManyMutationInput, ProductiveUnitUncheckedUpdateManyInput>
    /**
     * Filter which ProductiveUnits to update
     */
    where?: ProductiveUnitWhereInput
    /**
     * Limit how many ProductiveUnits to update.
     */
    limit?: number
  }

  /**
   * ProductiveUnit updateManyAndReturn
   */
  export type ProductiveUnitUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * The data used to update ProductiveUnits.
     */
    data: XOR<ProductiveUnitUpdateManyMutationInput, ProductiveUnitUncheckedUpdateManyInput>
    /**
     * Filter which ProductiveUnits to update
     */
    where?: ProductiveUnitWhereInput
    /**
     * Limit how many ProductiveUnits to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ProductiveUnit upsert
   */
  export type ProductiveUnitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitInclude<ExtArgs> | null
    /**
     * The filter to search for the ProductiveUnit to update in case it exists.
     */
    where: ProductiveUnitWhereUniqueInput
    /**
     * In case the ProductiveUnit found by the `where` argument doesn't exist, create a new ProductiveUnit with this data.
     */
    create: XOR<ProductiveUnitCreateInput, ProductiveUnitUncheckedCreateInput>
    /**
     * In case the ProductiveUnit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProductiveUnitUpdateInput, ProductiveUnitUncheckedUpdateInput>
  }

  /**
   * ProductiveUnit delete
   */
  export type ProductiveUnitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitInclude<ExtArgs> | null
    /**
     * Filter which ProductiveUnit to delete.
     */
    where: ProductiveUnitWhereUniqueInput
  }

  /**
   * ProductiveUnit deleteMany
   */
  export type ProductiveUnitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ProductiveUnits to delete
     */
    where?: ProductiveUnitWhereInput
    /**
     * Limit how many ProductiveUnits to delete.
     */
    limit?: number
  }

  /**
   * ProductiveUnit.users
   */
  export type ProductiveUnit$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * ProductiveUnit without action
   */
  export type ProductiveUnitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitInclude<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    level: number | null
    xp: number | null
  }

  export type UserSumAggregateOutputType = {
    level: number | null
    xp: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    password_hash: string | null
    full_name: string | null
    avatar_url: string | null
    role: $Enums.Role | null
    company_id: string | null
    productive_unit_id: string | null
    level: number | null
    xp: number | null
    email_verified: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    password_hash: string | null
    full_name: string | null
    avatar_url: string | null
    role: $Enums.Role | null
    company_id: string | null
    productive_unit_id: string | null
    level: number | null
    xp: number | null
    email_verified: boolean | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    password_hash: number
    full_name: number
    avatar_url: number
    role: number
    company_id: number
    productive_unit_id: number
    level: number
    xp: number
    email_verified: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    level?: true
    xp?: true
  }

  export type UserSumAggregateInputType = {
    level?: true
    xp?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    password_hash?: true
    full_name?: true
    avatar_url?: true
    role?: true
    company_id?: true
    productive_unit_id?: true
    level?: true
    xp?: true
    email_verified?: true
    created_at?: true
    updated_at?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    password_hash?: true
    full_name?: true
    avatar_url?: true
    role?: true
    company_id?: true
    productive_unit_id?: true
    level?: true
    xp?: true
    email_verified?: true
    created_at?: true
    updated_at?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    password_hash?: true
    full_name?: true
    avatar_url?: true
    role?: true
    company_id?: true
    productive_unit_id?: true
    level?: true
    xp?: true
    email_verified?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    password_hash: string
    full_name: string
    avatar_url: string | null
    role: $Enums.Role
    company_id: string | null
    productive_unit_id: string | null
    level: number
    xp: number
    email_verified: boolean
    created_at: Date
    updated_at: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password_hash?: boolean
    full_name?: boolean
    avatar_url?: boolean
    role?: boolean
    company_id?: boolean
    productive_unit_id?: boolean
    level?: boolean
    xp?: boolean
    email_verified?: boolean
    created_at?: boolean
    updated_at?: boolean
    company?: boolean | User$companyArgs<ExtArgs>
    productive_unit?: boolean | User$productive_unitArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    user_badges?: boolean | User$user_badgesArgs<ExtArgs>
    awarded_badges?: boolean | User$awarded_badgesArgs<ExtArgs>
    submissions?: boolean | User$submissionsArgs<ExtArgs>
    reviewed_submissions?: boolean | User$reviewed_submissionsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    badge_legend_settings?: boolean | User$badge_legend_settingsArgs<ExtArgs>
    import_runs?: boolean | User$import_runsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password_hash?: boolean
    full_name?: boolean
    avatar_url?: boolean
    role?: boolean
    company_id?: boolean
    productive_unit_id?: boolean
    level?: boolean
    xp?: boolean
    email_verified?: boolean
    created_at?: boolean
    updated_at?: boolean
    company?: boolean | User$companyArgs<ExtArgs>
    productive_unit?: boolean | User$productive_unitArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    password_hash?: boolean
    full_name?: boolean
    avatar_url?: boolean
    role?: boolean
    company_id?: boolean
    productive_unit_id?: boolean
    level?: boolean
    xp?: boolean
    email_verified?: boolean
    created_at?: boolean
    updated_at?: boolean
    company?: boolean | User$companyArgs<ExtArgs>
    productive_unit?: boolean | User$productive_unitArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    password_hash?: boolean
    full_name?: boolean
    avatar_url?: boolean
    role?: boolean
    company_id?: boolean
    productive_unit_id?: boolean
    level?: boolean
    xp?: boolean
    email_verified?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "password_hash" | "full_name" | "avatar_url" | "role" | "company_id" | "productive_unit_id" | "level" | "xp" | "email_verified" | "created_at" | "updated_at", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | User$companyArgs<ExtArgs>
    productive_unit?: boolean | User$productive_unitArgs<ExtArgs>
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    user_badges?: boolean | User$user_badgesArgs<ExtArgs>
    awarded_badges?: boolean | User$awarded_badgesArgs<ExtArgs>
    submissions?: boolean | User$submissionsArgs<ExtArgs>
    reviewed_submissions?: boolean | User$reviewed_submissionsArgs<ExtArgs>
    notifications?: boolean | User$notificationsArgs<ExtArgs>
    badge_legend_settings?: boolean | User$badge_legend_settingsArgs<ExtArgs>
    import_runs?: boolean | User$import_runsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | User$companyArgs<ExtArgs>
    productive_unit?: boolean | User$productive_unitArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    company?: boolean | User$companyArgs<ExtArgs>
    productive_unit?: boolean | User$productive_unitArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      company: Prisma.$CompanyPayload<ExtArgs> | null
      productive_unit: Prisma.$ProductiveUnitPayload<ExtArgs> | null
      sessions: Prisma.$AuthSessionPayload<ExtArgs>[]
      user_badges: Prisma.$UserBadgePayload<ExtArgs>[]
      awarded_badges: Prisma.$UserBadgePayload<ExtArgs>[]
      submissions: Prisma.$BadgeSubmissionPayload<ExtArgs>[]
      reviewed_submissions: Prisma.$BadgeSubmissionPayload<ExtArgs>[]
      notifications: Prisma.$NotificationPayload<ExtArgs>[]
      badge_legend_settings: Prisma.$BadgeLegendSettingPayload<ExtArgs>[]
      import_runs: Prisma.$ImportRunPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      password_hash: string
      full_name: string
      avatar_url: string | null
      role: $Enums.Role
      company_id: string | null
      productive_unit_id: string | null
      level: number
      xp: number
      email_verified: boolean
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
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
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    company<T extends User$companyArgs<ExtArgs> = {}>(args?: Subset<T, User$companyArgs<ExtArgs>>): Prisma__CompanyClient<$Result.GetResult<Prisma.$CompanyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    productive_unit<T extends User$productive_unitArgs<ExtArgs> = {}>(args?: Subset<T, User$productive_unitArgs<ExtArgs>>): Prisma__ProductiveUnitClient<$Result.GetResult<Prisma.$ProductiveUnitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    user_badges<T extends User$user_badgesArgs<ExtArgs> = {}>(args?: Subset<T, User$user_badgesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    awarded_badges<T extends User$awarded_badgesArgs<ExtArgs> = {}>(args?: Subset<T, User$awarded_badgesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    submissions<T extends User$submissionsArgs<ExtArgs> = {}>(args?: Subset<T, User$submissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reviewed_submissions<T extends User$reviewed_submissionsArgs<ExtArgs> = {}>(args?: Subset<T, User$reviewed_submissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notifications<T extends User$notificationsArgs<ExtArgs> = {}>(args?: Subset<T, User$notificationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    badge_legend_settings<T extends User$badge_legend_settingsArgs<ExtArgs> = {}>(args?: Subset<T, User$badge_legend_settingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgeLegendSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    import_runs<T extends User$import_runsArgs<ExtArgs> = {}>(args?: Subset<T, User$import_runsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly password_hash: FieldRef<"User", 'String'>
    readonly full_name: FieldRef<"User", 'String'>
    readonly avatar_url: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly company_id: FieldRef<"User", 'String'>
    readonly productive_unit_id: FieldRef<"User", 'String'>
    readonly level: FieldRef<"User", 'Int'>
    readonly xp: FieldRef<"User", 'Int'>
    readonly email_verified: FieldRef<"User", 'Boolean'>
    readonly created_at: FieldRef<"User", 'DateTime'>
    readonly updated_at: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.company
   */
  export type User$companyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Company
     */
    select?: CompanySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Company
     */
    omit?: CompanyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CompanyInclude<ExtArgs> | null
    where?: CompanyWhereInput
  }

  /**
   * User.productive_unit
   */
  export type User$productive_unitArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProductiveUnit
     */
    select?: ProductiveUnitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ProductiveUnit
     */
    omit?: ProductiveUnitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProductiveUnitInclude<ExtArgs> | null
    where?: ProductiveUnitWhereInput
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    where?: AuthSessionWhereInput
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    cursor?: AuthSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * User.user_badges
   */
  export type User$user_badgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    where?: UserBadgeWhereInput
    orderBy?: UserBadgeOrderByWithRelationInput | UserBadgeOrderByWithRelationInput[]
    cursor?: UserBadgeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserBadgeScalarFieldEnum | UserBadgeScalarFieldEnum[]
  }

  /**
   * User.awarded_badges
   */
  export type User$awarded_badgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    where?: UserBadgeWhereInput
    orderBy?: UserBadgeOrderByWithRelationInput | UserBadgeOrderByWithRelationInput[]
    cursor?: UserBadgeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserBadgeScalarFieldEnum | UserBadgeScalarFieldEnum[]
  }

  /**
   * User.submissions
   */
  export type User$submissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionInclude<ExtArgs> | null
    where?: BadgeSubmissionWhereInput
    orderBy?: BadgeSubmissionOrderByWithRelationInput | BadgeSubmissionOrderByWithRelationInput[]
    cursor?: BadgeSubmissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BadgeSubmissionScalarFieldEnum | BadgeSubmissionScalarFieldEnum[]
  }

  /**
   * User.reviewed_submissions
   */
  export type User$reviewed_submissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionInclude<ExtArgs> | null
    where?: BadgeSubmissionWhereInput
    orderBy?: BadgeSubmissionOrderByWithRelationInput | BadgeSubmissionOrderByWithRelationInput[]
    cursor?: BadgeSubmissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BadgeSubmissionScalarFieldEnum | BadgeSubmissionScalarFieldEnum[]
  }

  /**
   * User.notifications
   */
  export type User$notificationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    cursor?: NotificationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * User.badge_legend_settings
   */
  export type User$badge_legend_settingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeLegendSetting
     */
    select?: BadgeLegendSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeLegendSetting
     */
    omit?: BadgeLegendSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeLegendSettingInclude<ExtArgs> | null
    where?: BadgeLegendSettingWhereInput
    orderBy?: BadgeLegendSettingOrderByWithRelationInput | BadgeLegendSettingOrderByWithRelationInput[]
    cursor?: BadgeLegendSettingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BadgeLegendSettingScalarFieldEnum | BadgeLegendSettingScalarFieldEnum[]
  }

  /**
   * User.import_runs
   */
  export type User$import_runsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunInclude<ExtArgs> | null
    where?: ImportRunWhereInput
    orderBy?: ImportRunOrderByWithRelationInput | ImportRunOrderByWithRelationInput[]
    cursor?: ImportRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImportRunScalarFieldEnum | ImportRunScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model AuthSession
   */

  export type AggregateAuthSession = {
    _count: AuthSessionCountAggregateOutputType | null
    _min: AuthSessionMinAggregateOutputType | null
    _max: AuthSessionMaxAggregateOutputType | null
  }

  export type AuthSessionMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    created_at: Date | null
    expires_at: Date | null
    revoked_at: Date | null
  }

  export type AuthSessionMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    created_at: Date | null
    expires_at: Date | null
    revoked_at: Date | null
  }

  export type AuthSessionCountAggregateOutputType = {
    id: number
    user_id: number
    created_at: number
    expires_at: number
    revoked_at: number
    _all: number
  }


  export type AuthSessionMinAggregateInputType = {
    id?: true
    user_id?: true
    created_at?: true
    expires_at?: true
    revoked_at?: true
  }

  export type AuthSessionMaxAggregateInputType = {
    id?: true
    user_id?: true
    created_at?: true
    expires_at?: true
    revoked_at?: true
  }

  export type AuthSessionCountAggregateInputType = {
    id?: true
    user_id?: true
    created_at?: true
    expires_at?: true
    revoked_at?: true
    _all?: true
  }

  export type AuthSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthSession to aggregate.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuthSessions
    **/
    _count?: true | AuthSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuthSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuthSessionMaxAggregateInputType
  }

  export type GetAuthSessionAggregateType<T extends AuthSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateAuthSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuthSession[P]>
      : GetScalarType<T[P], AggregateAuthSession[P]>
  }




  export type AuthSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuthSessionWhereInput
    orderBy?: AuthSessionOrderByWithAggregationInput | AuthSessionOrderByWithAggregationInput[]
    by: AuthSessionScalarFieldEnum[] | AuthSessionScalarFieldEnum
    having?: AuthSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuthSessionCountAggregateInputType | true
    _min?: AuthSessionMinAggregateInputType
    _max?: AuthSessionMaxAggregateInputType
  }

  export type AuthSessionGroupByOutputType = {
    id: string
    user_id: string
    created_at: Date
    expires_at: Date
    revoked_at: Date | null
    _count: AuthSessionCountAggregateOutputType | null
    _min: AuthSessionMinAggregateOutputType | null
    _max: AuthSessionMaxAggregateOutputType | null
  }

  type GetAuthSessionGroupByPayload<T extends AuthSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuthSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuthSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuthSessionGroupByOutputType[P]>
            : GetScalarType<T[P], AuthSessionGroupByOutputType[P]>
        }
      >
    >


  export type AuthSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    created_at?: boolean
    expires_at?: boolean
    revoked_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authSession"]>

  export type AuthSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    created_at?: boolean
    expires_at?: boolean
    revoked_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authSession"]>

  export type AuthSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    created_at?: boolean
    expires_at?: boolean
    revoked_at?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["authSession"]>

  export type AuthSessionSelectScalar = {
    id?: boolean
    user_id?: boolean
    created_at?: boolean
    expires_at?: boolean
    revoked_at?: boolean
  }

  export type AuthSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "created_at" | "expires_at" | "revoked_at", ExtArgs["result"]["authSession"]>
  export type AuthSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuthSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type AuthSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AuthSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuthSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      created_at: Date
      expires_at: Date
      revoked_at: Date | null
    }, ExtArgs["result"]["authSession"]>
    composites: {}
  }

  type AuthSessionGetPayload<S extends boolean | null | undefined | AuthSessionDefaultArgs> = $Result.GetResult<Prisma.$AuthSessionPayload, S>

  type AuthSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuthSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuthSessionCountAggregateInputType | true
    }

  export interface AuthSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuthSession'], meta: { name: 'AuthSession' } }
    /**
     * Find zero or one AuthSession that matches the filter.
     * @param {AuthSessionFindUniqueArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuthSessionFindUniqueArgs>(args: SelectSubset<T, AuthSessionFindUniqueArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuthSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuthSessionFindUniqueOrThrowArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuthSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, AuthSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionFindFirstArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuthSessionFindFirstArgs>(args?: SelectSubset<T, AuthSessionFindFirstArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuthSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionFindFirstOrThrowArgs} args - Arguments to find a AuthSession
     * @example
     * // Get one AuthSession
     * const authSession = await prisma.authSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuthSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, AuthSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuthSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuthSessions
     * const authSessions = await prisma.authSession.findMany()
     * 
     * // Get first 10 AuthSessions
     * const authSessions = await prisma.authSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const authSessionWithIdOnly = await prisma.authSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuthSessionFindManyArgs>(args?: SelectSubset<T, AuthSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuthSession.
     * @param {AuthSessionCreateArgs} args - Arguments to create a AuthSession.
     * @example
     * // Create one AuthSession
     * const AuthSession = await prisma.authSession.create({
     *   data: {
     *     // ... data to create a AuthSession
     *   }
     * })
     * 
     */
    create<T extends AuthSessionCreateArgs>(args: SelectSubset<T, AuthSessionCreateArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuthSessions.
     * @param {AuthSessionCreateManyArgs} args - Arguments to create many AuthSessions.
     * @example
     * // Create many AuthSessions
     * const authSession = await prisma.authSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuthSessionCreateManyArgs>(args?: SelectSubset<T, AuthSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuthSessions and returns the data saved in the database.
     * @param {AuthSessionCreateManyAndReturnArgs} args - Arguments to create many AuthSessions.
     * @example
     * // Create many AuthSessions
     * const authSession = await prisma.authSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuthSessions and only return the `id`
     * const authSessionWithIdOnly = await prisma.authSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuthSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, AuthSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuthSession.
     * @param {AuthSessionDeleteArgs} args - Arguments to delete one AuthSession.
     * @example
     * // Delete one AuthSession
     * const AuthSession = await prisma.authSession.delete({
     *   where: {
     *     // ... filter to delete one AuthSession
     *   }
     * })
     * 
     */
    delete<T extends AuthSessionDeleteArgs>(args: SelectSubset<T, AuthSessionDeleteArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuthSession.
     * @param {AuthSessionUpdateArgs} args - Arguments to update one AuthSession.
     * @example
     * // Update one AuthSession
     * const authSession = await prisma.authSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuthSessionUpdateArgs>(args: SelectSubset<T, AuthSessionUpdateArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuthSessions.
     * @param {AuthSessionDeleteManyArgs} args - Arguments to filter AuthSessions to delete.
     * @example
     * // Delete a few AuthSessions
     * const { count } = await prisma.authSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuthSessionDeleteManyArgs>(args?: SelectSubset<T, AuthSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuthSessions
     * const authSession = await prisma.authSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuthSessionUpdateManyArgs>(args: SelectSubset<T, AuthSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuthSessions and returns the data updated in the database.
     * @param {AuthSessionUpdateManyAndReturnArgs} args - Arguments to update many AuthSessions.
     * @example
     * // Update many AuthSessions
     * const authSession = await prisma.authSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuthSessions and only return the `id`
     * const authSessionWithIdOnly = await prisma.authSession.updateManyAndReturn({
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
    updateManyAndReturn<T extends AuthSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, AuthSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuthSession.
     * @param {AuthSessionUpsertArgs} args - Arguments to update or create a AuthSession.
     * @example
     * // Update or create a AuthSession
     * const authSession = await prisma.authSession.upsert({
     *   create: {
     *     // ... data to create a AuthSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuthSession we want to update
     *   }
     * })
     */
    upsert<T extends AuthSessionUpsertArgs>(args: SelectSubset<T, AuthSessionUpsertArgs<ExtArgs>>): Prisma__AuthSessionClient<$Result.GetResult<Prisma.$AuthSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuthSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionCountArgs} args - Arguments to filter AuthSessions to count.
     * @example
     * // Count the number of AuthSessions
     * const count = await prisma.authSession.count({
     *   where: {
     *     // ... the filter for the AuthSessions we want to count
     *   }
     * })
    **/
    count<T extends AuthSessionCountArgs>(
      args?: Subset<T, AuthSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuthSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuthSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends AuthSessionAggregateArgs>(args: Subset<T, AuthSessionAggregateArgs>): Prisma.PrismaPromise<GetAuthSessionAggregateType<T>>

    /**
     * Group by AuthSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuthSessionGroupByArgs} args - Group by arguments.
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
      T extends AuthSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuthSessionGroupByArgs['orderBy'] }
        : { orderBy?: AuthSessionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, AuthSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuthSession model
   */
  readonly fields: AuthSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuthSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuthSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the AuthSession model
   */
  interface AuthSessionFieldRefs {
    readonly id: FieldRef<"AuthSession", 'String'>
    readonly user_id: FieldRef<"AuthSession", 'String'>
    readonly created_at: FieldRef<"AuthSession", 'DateTime'>
    readonly expires_at: FieldRef<"AuthSession", 'DateTime'>
    readonly revoked_at: FieldRef<"AuthSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AuthSession findUnique
   */
  export type AuthSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession findUniqueOrThrow
   */
  export type AuthSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession findFirst
   */
  export type AuthSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthSessions.
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthSessions.
     */
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthSession findFirstOrThrow
   */
  export type AuthSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSession to fetch.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuthSessions.
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuthSessions.
     */
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthSession findMany
   */
  export type AuthSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter, which AuthSessions to fetch.
     */
    where?: AuthSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuthSessions to fetch.
     */
    orderBy?: AuthSessionOrderByWithRelationInput | AuthSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuthSessions.
     */
    cursor?: AuthSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuthSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuthSessions.
     */
    skip?: number
    distinct?: AuthSessionScalarFieldEnum | AuthSessionScalarFieldEnum[]
  }

  /**
   * AuthSession create
   */
  export type AuthSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a AuthSession.
     */
    data: XOR<AuthSessionCreateInput, AuthSessionUncheckedCreateInput>
  }

  /**
   * AuthSession createMany
   */
  export type AuthSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuthSessions.
     */
    data: AuthSessionCreateManyInput | AuthSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuthSession createManyAndReturn
   */
  export type AuthSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * The data used to create many AuthSessions.
     */
    data: AuthSessionCreateManyInput | AuthSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthSession update
   */
  export type AuthSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a AuthSession.
     */
    data: XOR<AuthSessionUpdateInput, AuthSessionUncheckedUpdateInput>
    /**
     * Choose, which AuthSession to update.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession updateMany
   */
  export type AuthSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuthSessions.
     */
    data: XOR<AuthSessionUpdateManyMutationInput, AuthSessionUncheckedUpdateManyInput>
    /**
     * Filter which AuthSessions to update
     */
    where?: AuthSessionWhereInput
    /**
     * Limit how many AuthSessions to update.
     */
    limit?: number
  }

  /**
   * AuthSession updateManyAndReturn
   */
  export type AuthSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * The data used to update AuthSessions.
     */
    data: XOR<AuthSessionUpdateManyMutationInput, AuthSessionUncheckedUpdateManyInput>
    /**
     * Filter which AuthSessions to update
     */
    where?: AuthSessionWhereInput
    /**
     * Limit how many AuthSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuthSession upsert
   */
  export type AuthSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the AuthSession to update in case it exists.
     */
    where: AuthSessionWhereUniqueInput
    /**
     * In case the AuthSession found by the `where` argument doesn't exist, create a new AuthSession with this data.
     */
    create: XOR<AuthSessionCreateInput, AuthSessionUncheckedCreateInput>
    /**
     * In case the AuthSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuthSessionUpdateInput, AuthSessionUncheckedUpdateInput>
  }

  /**
   * AuthSession delete
   */
  export type AuthSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
    /**
     * Filter which AuthSession to delete.
     */
    where: AuthSessionWhereUniqueInput
  }

  /**
   * AuthSession deleteMany
   */
  export type AuthSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuthSessions to delete
     */
    where?: AuthSessionWhereInput
    /**
     * Limit how many AuthSessions to delete.
     */
    limit?: number
  }

  /**
   * AuthSession without action
   */
  export type AuthSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuthSession
     */
    select?: AuthSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuthSession
     */
    omit?: AuthSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuthSessionInclude<ExtArgs> | null
  }


  /**
   * Model Badge
   */

  export type AggregateBadge = {
    _count: BadgeCountAggregateOutputType | null
    _avg: BadgeAvgAggregateOutputType | null
    _sum: BadgeSumAggregateOutputType | null
    _min: BadgeMinAggregateOutputType | null
    _max: BadgeMaxAggregateOutputType | null
  }

  export type BadgeAvgAggregateOutputType = {
    points: number | null
  }

  export type BadgeSumAggregateOutputType = {
    points: number | null
  }

  export type BadgeMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    category: string | null
    icon_name: string | null
    image_url: string | null
    points: number | null
    created_at: Date | null
  }

  export type BadgeMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    category: string | null
    icon_name: string | null
    image_url: string | null
    points: number | null
    created_at: Date | null
  }

  export type BadgeCountAggregateOutputType = {
    id: number
    name: number
    description: number
    category: number
    icon_name: number
    image_url: number
    points: number
    created_at: number
    _all: number
  }


  export type BadgeAvgAggregateInputType = {
    points?: true
  }

  export type BadgeSumAggregateInputType = {
    points?: true
  }

  export type BadgeMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    icon_name?: true
    image_url?: true
    points?: true
    created_at?: true
  }

  export type BadgeMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    icon_name?: true
    image_url?: true
    points?: true
    created_at?: true
  }

  export type BadgeCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    category?: true
    icon_name?: true
    image_url?: true
    points?: true
    created_at?: true
    _all?: true
  }

  export type BadgeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Badge to aggregate.
     */
    where?: BadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Badges to fetch.
     */
    orderBy?: BadgeOrderByWithRelationInput | BadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Badges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Badges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Badges
    **/
    _count?: true | BadgeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: BadgeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: BadgeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BadgeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BadgeMaxAggregateInputType
  }

  export type GetBadgeAggregateType<T extends BadgeAggregateArgs> = {
        [P in keyof T & keyof AggregateBadge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBadge[P]>
      : GetScalarType<T[P], AggregateBadge[P]>
  }




  export type BadgeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BadgeWhereInput
    orderBy?: BadgeOrderByWithAggregationInput | BadgeOrderByWithAggregationInput[]
    by: BadgeScalarFieldEnum[] | BadgeScalarFieldEnum
    having?: BadgeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BadgeCountAggregateInputType | true
    _avg?: BadgeAvgAggregateInputType
    _sum?: BadgeSumAggregateInputType
    _min?: BadgeMinAggregateInputType
    _max?: BadgeMaxAggregateInputType
  }

  export type BadgeGroupByOutputType = {
    id: string
    name: string
    description: string
    category: string
    icon_name: string
    image_url: string | null
    points: number
    created_at: Date
    _count: BadgeCountAggregateOutputType | null
    _avg: BadgeAvgAggregateOutputType | null
    _sum: BadgeSumAggregateOutputType | null
    _min: BadgeMinAggregateOutputType | null
    _max: BadgeMaxAggregateOutputType | null
  }

  type GetBadgeGroupByPayload<T extends BadgeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BadgeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BadgeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BadgeGroupByOutputType[P]>
            : GetScalarType<T[P], BadgeGroupByOutputType[P]>
        }
      >
    >


  export type BadgeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    icon_name?: boolean
    image_url?: boolean
    points?: boolean
    created_at?: boolean
    user_badges?: boolean | Badge$user_badgesArgs<ExtArgs>
    submissions?: boolean | Badge$submissionsArgs<ExtArgs>
    _count?: boolean | BadgeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["badge"]>

  export type BadgeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    icon_name?: boolean
    image_url?: boolean
    points?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["badge"]>

  export type BadgeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    icon_name?: boolean
    image_url?: boolean
    points?: boolean
    created_at?: boolean
  }, ExtArgs["result"]["badge"]>

  export type BadgeSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    category?: boolean
    icon_name?: boolean
    image_url?: boolean
    points?: boolean
    created_at?: boolean
  }

  export type BadgeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "category" | "icon_name" | "image_url" | "points" | "created_at", ExtArgs["result"]["badge"]>
  export type BadgeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user_badges?: boolean | Badge$user_badgesArgs<ExtArgs>
    submissions?: boolean | Badge$submissionsArgs<ExtArgs>
    _count?: boolean | BadgeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type BadgeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type BadgeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $BadgePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Badge"
    objects: {
      user_badges: Prisma.$UserBadgePayload<ExtArgs>[]
      submissions: Prisma.$BadgeSubmissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      category: string
      icon_name: string
      image_url: string | null
      points: number
      created_at: Date
    }, ExtArgs["result"]["badge"]>
    composites: {}
  }

  type BadgeGetPayload<S extends boolean | null | undefined | BadgeDefaultArgs> = $Result.GetResult<Prisma.$BadgePayload, S>

  type BadgeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BadgeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BadgeCountAggregateInputType | true
    }

  export interface BadgeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Badge'], meta: { name: 'Badge' } }
    /**
     * Find zero or one Badge that matches the filter.
     * @param {BadgeFindUniqueArgs} args - Arguments to find a Badge
     * @example
     * // Get one Badge
     * const badge = await prisma.badge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BadgeFindUniqueArgs>(args: SelectSubset<T, BadgeFindUniqueArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Badge that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BadgeFindUniqueOrThrowArgs} args - Arguments to find a Badge
     * @example
     * // Get one Badge
     * const badge = await prisma.badge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BadgeFindUniqueOrThrowArgs>(args: SelectSubset<T, BadgeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Badge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeFindFirstArgs} args - Arguments to find a Badge
     * @example
     * // Get one Badge
     * const badge = await prisma.badge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BadgeFindFirstArgs>(args?: SelectSubset<T, BadgeFindFirstArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Badge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeFindFirstOrThrowArgs} args - Arguments to find a Badge
     * @example
     * // Get one Badge
     * const badge = await prisma.badge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BadgeFindFirstOrThrowArgs>(args?: SelectSubset<T, BadgeFindFirstOrThrowArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Badges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Badges
     * const badges = await prisma.badge.findMany()
     * 
     * // Get first 10 Badges
     * const badges = await prisma.badge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const badgeWithIdOnly = await prisma.badge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BadgeFindManyArgs>(args?: SelectSubset<T, BadgeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Badge.
     * @param {BadgeCreateArgs} args - Arguments to create a Badge.
     * @example
     * // Create one Badge
     * const Badge = await prisma.badge.create({
     *   data: {
     *     // ... data to create a Badge
     *   }
     * })
     * 
     */
    create<T extends BadgeCreateArgs>(args: SelectSubset<T, BadgeCreateArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Badges.
     * @param {BadgeCreateManyArgs} args - Arguments to create many Badges.
     * @example
     * // Create many Badges
     * const badge = await prisma.badge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BadgeCreateManyArgs>(args?: SelectSubset<T, BadgeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Badges and returns the data saved in the database.
     * @param {BadgeCreateManyAndReturnArgs} args - Arguments to create many Badges.
     * @example
     * // Create many Badges
     * const badge = await prisma.badge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Badges and only return the `id`
     * const badgeWithIdOnly = await prisma.badge.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BadgeCreateManyAndReturnArgs>(args?: SelectSubset<T, BadgeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Badge.
     * @param {BadgeDeleteArgs} args - Arguments to delete one Badge.
     * @example
     * // Delete one Badge
     * const Badge = await prisma.badge.delete({
     *   where: {
     *     // ... filter to delete one Badge
     *   }
     * })
     * 
     */
    delete<T extends BadgeDeleteArgs>(args: SelectSubset<T, BadgeDeleteArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Badge.
     * @param {BadgeUpdateArgs} args - Arguments to update one Badge.
     * @example
     * // Update one Badge
     * const badge = await prisma.badge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BadgeUpdateArgs>(args: SelectSubset<T, BadgeUpdateArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Badges.
     * @param {BadgeDeleteManyArgs} args - Arguments to filter Badges to delete.
     * @example
     * // Delete a few Badges
     * const { count } = await prisma.badge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BadgeDeleteManyArgs>(args?: SelectSubset<T, BadgeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Badges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Badges
     * const badge = await prisma.badge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BadgeUpdateManyArgs>(args: SelectSubset<T, BadgeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Badges and returns the data updated in the database.
     * @param {BadgeUpdateManyAndReturnArgs} args - Arguments to update many Badges.
     * @example
     * // Update many Badges
     * const badge = await prisma.badge.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Badges and only return the `id`
     * const badgeWithIdOnly = await prisma.badge.updateManyAndReturn({
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
    updateManyAndReturn<T extends BadgeUpdateManyAndReturnArgs>(args: SelectSubset<T, BadgeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Badge.
     * @param {BadgeUpsertArgs} args - Arguments to update or create a Badge.
     * @example
     * // Update or create a Badge
     * const badge = await prisma.badge.upsert({
     *   create: {
     *     // ... data to create a Badge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Badge we want to update
     *   }
     * })
     */
    upsert<T extends BadgeUpsertArgs>(args: SelectSubset<T, BadgeUpsertArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Badges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeCountArgs} args - Arguments to filter Badges to count.
     * @example
     * // Count the number of Badges
     * const count = await prisma.badge.count({
     *   where: {
     *     // ... the filter for the Badges we want to count
     *   }
     * })
    **/
    count<T extends BadgeCountArgs>(
      args?: Subset<T, BadgeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BadgeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Badge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BadgeAggregateArgs>(args: Subset<T, BadgeAggregateArgs>): Prisma.PrismaPromise<GetBadgeAggregateType<T>>

    /**
     * Group by Badge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeGroupByArgs} args - Group by arguments.
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
      T extends BadgeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BadgeGroupByArgs['orderBy'] }
        : { orderBy?: BadgeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BadgeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBadgeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Badge model
   */
  readonly fields: BadgeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Badge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BadgeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user_badges<T extends Badge$user_badgesArgs<ExtArgs> = {}>(args?: Subset<T, Badge$user_badgesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    submissions<T extends Badge$submissionsArgs<ExtArgs> = {}>(args?: Subset<T, Badge$submissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Badge model
   */
  interface BadgeFieldRefs {
    readonly id: FieldRef<"Badge", 'String'>
    readonly name: FieldRef<"Badge", 'String'>
    readonly description: FieldRef<"Badge", 'String'>
    readonly category: FieldRef<"Badge", 'String'>
    readonly icon_name: FieldRef<"Badge", 'String'>
    readonly image_url: FieldRef<"Badge", 'String'>
    readonly points: FieldRef<"Badge", 'Int'>
    readonly created_at: FieldRef<"Badge", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Badge findUnique
   */
  export type BadgeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * Filter, which Badge to fetch.
     */
    where: BadgeWhereUniqueInput
  }

  /**
   * Badge findUniqueOrThrow
   */
  export type BadgeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * Filter, which Badge to fetch.
     */
    where: BadgeWhereUniqueInput
  }

  /**
   * Badge findFirst
   */
  export type BadgeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * Filter, which Badge to fetch.
     */
    where?: BadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Badges to fetch.
     */
    orderBy?: BadgeOrderByWithRelationInput | BadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Badges.
     */
    cursor?: BadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Badges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Badges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Badges.
     */
    distinct?: BadgeScalarFieldEnum | BadgeScalarFieldEnum[]
  }

  /**
   * Badge findFirstOrThrow
   */
  export type BadgeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * Filter, which Badge to fetch.
     */
    where?: BadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Badges to fetch.
     */
    orderBy?: BadgeOrderByWithRelationInput | BadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Badges.
     */
    cursor?: BadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Badges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Badges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Badges.
     */
    distinct?: BadgeScalarFieldEnum | BadgeScalarFieldEnum[]
  }

  /**
   * Badge findMany
   */
  export type BadgeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * Filter, which Badges to fetch.
     */
    where?: BadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Badges to fetch.
     */
    orderBy?: BadgeOrderByWithRelationInput | BadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Badges.
     */
    cursor?: BadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Badges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Badges.
     */
    skip?: number
    distinct?: BadgeScalarFieldEnum | BadgeScalarFieldEnum[]
  }

  /**
   * Badge create
   */
  export type BadgeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * The data needed to create a Badge.
     */
    data: XOR<BadgeCreateInput, BadgeUncheckedCreateInput>
  }

  /**
   * Badge createMany
   */
  export type BadgeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Badges.
     */
    data: BadgeCreateManyInput | BadgeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Badge createManyAndReturn
   */
  export type BadgeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * The data used to create many Badges.
     */
    data: BadgeCreateManyInput | BadgeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Badge update
   */
  export type BadgeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * The data needed to update a Badge.
     */
    data: XOR<BadgeUpdateInput, BadgeUncheckedUpdateInput>
    /**
     * Choose, which Badge to update.
     */
    where: BadgeWhereUniqueInput
  }

  /**
   * Badge updateMany
   */
  export type BadgeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Badges.
     */
    data: XOR<BadgeUpdateManyMutationInput, BadgeUncheckedUpdateManyInput>
    /**
     * Filter which Badges to update
     */
    where?: BadgeWhereInput
    /**
     * Limit how many Badges to update.
     */
    limit?: number
  }

  /**
   * Badge updateManyAndReturn
   */
  export type BadgeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * The data used to update Badges.
     */
    data: XOR<BadgeUpdateManyMutationInput, BadgeUncheckedUpdateManyInput>
    /**
     * Filter which Badges to update
     */
    where?: BadgeWhereInput
    /**
     * Limit how many Badges to update.
     */
    limit?: number
  }

  /**
   * Badge upsert
   */
  export type BadgeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * The filter to search for the Badge to update in case it exists.
     */
    where: BadgeWhereUniqueInput
    /**
     * In case the Badge found by the `where` argument doesn't exist, create a new Badge with this data.
     */
    create: XOR<BadgeCreateInput, BadgeUncheckedCreateInput>
    /**
     * In case the Badge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BadgeUpdateInput, BadgeUncheckedUpdateInput>
  }

  /**
   * Badge delete
   */
  export type BadgeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
    /**
     * Filter which Badge to delete.
     */
    where: BadgeWhereUniqueInput
  }

  /**
   * Badge deleteMany
   */
  export type BadgeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Badges to delete
     */
    where?: BadgeWhereInput
    /**
     * Limit how many Badges to delete.
     */
    limit?: number
  }

  /**
   * Badge.user_badges
   */
  export type Badge$user_badgesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    where?: UserBadgeWhereInput
    orderBy?: UserBadgeOrderByWithRelationInput | UserBadgeOrderByWithRelationInput[]
    cursor?: UserBadgeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserBadgeScalarFieldEnum | UserBadgeScalarFieldEnum[]
  }

  /**
   * Badge.submissions
   */
  export type Badge$submissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionInclude<ExtArgs> | null
    where?: BadgeSubmissionWhereInput
    orderBy?: BadgeSubmissionOrderByWithRelationInput | BadgeSubmissionOrderByWithRelationInput[]
    cursor?: BadgeSubmissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: BadgeSubmissionScalarFieldEnum | BadgeSubmissionScalarFieldEnum[]
  }

  /**
   * Badge without action
   */
  export type BadgeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Badge
     */
    select?: BadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Badge
     */
    omit?: BadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeInclude<ExtArgs> | null
  }


  /**
   * Model BadgeLegendSetting
   */

  export type AggregateBadgeLegendSetting = {
    _count: BadgeLegendSettingCountAggregateOutputType | null
    _min: BadgeLegendSettingMinAggregateOutputType | null
    _max: BadgeLegendSettingMaxAggregateOutputType | null
  }

  export type BadgeLegendSettingMinAggregateOutputType = {
    id: string | null
    bronze: string | null
    silver: string | null
    gold: string | null
    loss_1: string | null
    loss_2: string | null
    updated_by: string | null
    updated_at: Date | null
  }

  export type BadgeLegendSettingMaxAggregateOutputType = {
    id: string | null
    bronze: string | null
    silver: string | null
    gold: string | null
    loss_1: string | null
    loss_2: string | null
    updated_by: string | null
    updated_at: Date | null
  }

  export type BadgeLegendSettingCountAggregateOutputType = {
    id: number
    bronze: number
    silver: number
    gold: number
    loss_1: number
    loss_2: number
    updated_by: number
    updated_at: number
    _all: number
  }


  export type BadgeLegendSettingMinAggregateInputType = {
    id?: true
    bronze?: true
    silver?: true
    gold?: true
    loss_1?: true
    loss_2?: true
    updated_by?: true
    updated_at?: true
  }

  export type BadgeLegendSettingMaxAggregateInputType = {
    id?: true
    bronze?: true
    silver?: true
    gold?: true
    loss_1?: true
    loss_2?: true
    updated_by?: true
    updated_at?: true
  }

  export type BadgeLegendSettingCountAggregateInputType = {
    id?: true
    bronze?: true
    silver?: true
    gold?: true
    loss_1?: true
    loss_2?: true
    updated_by?: true
    updated_at?: true
    _all?: true
  }

  export type BadgeLegendSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BadgeLegendSetting to aggregate.
     */
    where?: BadgeLegendSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BadgeLegendSettings to fetch.
     */
    orderBy?: BadgeLegendSettingOrderByWithRelationInput | BadgeLegendSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BadgeLegendSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BadgeLegendSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BadgeLegendSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BadgeLegendSettings
    **/
    _count?: true | BadgeLegendSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BadgeLegendSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BadgeLegendSettingMaxAggregateInputType
  }

  export type GetBadgeLegendSettingAggregateType<T extends BadgeLegendSettingAggregateArgs> = {
        [P in keyof T & keyof AggregateBadgeLegendSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBadgeLegendSetting[P]>
      : GetScalarType<T[P], AggregateBadgeLegendSetting[P]>
  }




  export type BadgeLegendSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BadgeLegendSettingWhereInput
    orderBy?: BadgeLegendSettingOrderByWithAggregationInput | BadgeLegendSettingOrderByWithAggregationInput[]
    by: BadgeLegendSettingScalarFieldEnum[] | BadgeLegendSettingScalarFieldEnum
    having?: BadgeLegendSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BadgeLegendSettingCountAggregateInputType | true
    _min?: BadgeLegendSettingMinAggregateInputType
    _max?: BadgeLegendSettingMaxAggregateInputType
  }

  export type BadgeLegendSettingGroupByOutputType = {
    id: string
    bronze: string
    silver: string
    gold: string
    loss_1: string
    loss_2: string
    updated_by: string | null
    updated_at: Date
    _count: BadgeLegendSettingCountAggregateOutputType | null
    _min: BadgeLegendSettingMinAggregateOutputType | null
    _max: BadgeLegendSettingMaxAggregateOutputType | null
  }

  type GetBadgeLegendSettingGroupByPayload<T extends BadgeLegendSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BadgeLegendSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BadgeLegendSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BadgeLegendSettingGroupByOutputType[P]>
            : GetScalarType<T[P], BadgeLegendSettingGroupByOutputType[P]>
        }
      >
    >


  export type BadgeLegendSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bronze?: boolean
    silver?: boolean
    gold?: boolean
    loss_1?: boolean
    loss_2?: boolean
    updated_by?: boolean
    updated_at?: boolean
    updatedBy?: boolean | BadgeLegendSetting$updatedByArgs<ExtArgs>
  }, ExtArgs["result"]["badgeLegendSetting"]>

  export type BadgeLegendSettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bronze?: boolean
    silver?: boolean
    gold?: boolean
    loss_1?: boolean
    loss_2?: boolean
    updated_by?: boolean
    updated_at?: boolean
    updatedBy?: boolean | BadgeLegendSetting$updatedByArgs<ExtArgs>
  }, ExtArgs["result"]["badgeLegendSetting"]>

  export type BadgeLegendSettingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bronze?: boolean
    silver?: boolean
    gold?: boolean
    loss_1?: boolean
    loss_2?: boolean
    updated_by?: boolean
    updated_at?: boolean
    updatedBy?: boolean | BadgeLegendSetting$updatedByArgs<ExtArgs>
  }, ExtArgs["result"]["badgeLegendSetting"]>

  export type BadgeLegendSettingSelectScalar = {
    id?: boolean
    bronze?: boolean
    silver?: boolean
    gold?: boolean
    loss_1?: boolean
    loss_2?: boolean
    updated_by?: boolean
    updated_at?: boolean
  }

  export type BadgeLegendSettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bronze" | "silver" | "gold" | "loss_1" | "loss_2" | "updated_by" | "updated_at", ExtArgs["result"]["badgeLegendSetting"]>
  export type BadgeLegendSettingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    updatedBy?: boolean | BadgeLegendSetting$updatedByArgs<ExtArgs>
  }
  export type BadgeLegendSettingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    updatedBy?: boolean | BadgeLegendSetting$updatedByArgs<ExtArgs>
  }
  export type BadgeLegendSettingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    updatedBy?: boolean | BadgeLegendSetting$updatedByArgs<ExtArgs>
  }

  export type $BadgeLegendSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BadgeLegendSetting"
    objects: {
      updatedBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      bronze: string
      silver: string
      gold: string
      loss_1: string
      loss_2: string
      updated_by: string | null
      updated_at: Date
    }, ExtArgs["result"]["badgeLegendSetting"]>
    composites: {}
  }

  type BadgeLegendSettingGetPayload<S extends boolean | null | undefined | BadgeLegendSettingDefaultArgs> = $Result.GetResult<Prisma.$BadgeLegendSettingPayload, S>

  type BadgeLegendSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BadgeLegendSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BadgeLegendSettingCountAggregateInputType | true
    }

  export interface BadgeLegendSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BadgeLegendSetting'], meta: { name: 'BadgeLegendSetting' } }
    /**
     * Find zero or one BadgeLegendSetting that matches the filter.
     * @param {BadgeLegendSettingFindUniqueArgs} args - Arguments to find a BadgeLegendSetting
     * @example
     * // Get one BadgeLegendSetting
     * const badgeLegendSetting = await prisma.badgeLegendSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BadgeLegendSettingFindUniqueArgs>(args: SelectSubset<T, BadgeLegendSettingFindUniqueArgs<ExtArgs>>): Prisma__BadgeLegendSettingClient<$Result.GetResult<Prisma.$BadgeLegendSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BadgeLegendSetting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BadgeLegendSettingFindUniqueOrThrowArgs} args - Arguments to find a BadgeLegendSetting
     * @example
     * // Get one BadgeLegendSetting
     * const badgeLegendSetting = await prisma.badgeLegendSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BadgeLegendSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, BadgeLegendSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BadgeLegendSettingClient<$Result.GetResult<Prisma.$BadgeLegendSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BadgeLegendSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeLegendSettingFindFirstArgs} args - Arguments to find a BadgeLegendSetting
     * @example
     * // Get one BadgeLegendSetting
     * const badgeLegendSetting = await prisma.badgeLegendSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BadgeLegendSettingFindFirstArgs>(args?: SelectSubset<T, BadgeLegendSettingFindFirstArgs<ExtArgs>>): Prisma__BadgeLegendSettingClient<$Result.GetResult<Prisma.$BadgeLegendSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BadgeLegendSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeLegendSettingFindFirstOrThrowArgs} args - Arguments to find a BadgeLegendSetting
     * @example
     * // Get one BadgeLegendSetting
     * const badgeLegendSetting = await prisma.badgeLegendSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BadgeLegendSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, BadgeLegendSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__BadgeLegendSettingClient<$Result.GetResult<Prisma.$BadgeLegendSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BadgeLegendSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeLegendSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BadgeLegendSettings
     * const badgeLegendSettings = await prisma.badgeLegendSetting.findMany()
     * 
     * // Get first 10 BadgeLegendSettings
     * const badgeLegendSettings = await prisma.badgeLegendSetting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const badgeLegendSettingWithIdOnly = await prisma.badgeLegendSetting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BadgeLegendSettingFindManyArgs>(args?: SelectSubset<T, BadgeLegendSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgeLegendSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BadgeLegendSetting.
     * @param {BadgeLegendSettingCreateArgs} args - Arguments to create a BadgeLegendSetting.
     * @example
     * // Create one BadgeLegendSetting
     * const BadgeLegendSetting = await prisma.badgeLegendSetting.create({
     *   data: {
     *     // ... data to create a BadgeLegendSetting
     *   }
     * })
     * 
     */
    create<T extends BadgeLegendSettingCreateArgs>(args: SelectSubset<T, BadgeLegendSettingCreateArgs<ExtArgs>>): Prisma__BadgeLegendSettingClient<$Result.GetResult<Prisma.$BadgeLegendSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BadgeLegendSettings.
     * @param {BadgeLegendSettingCreateManyArgs} args - Arguments to create many BadgeLegendSettings.
     * @example
     * // Create many BadgeLegendSettings
     * const badgeLegendSetting = await prisma.badgeLegendSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BadgeLegendSettingCreateManyArgs>(args?: SelectSubset<T, BadgeLegendSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BadgeLegendSettings and returns the data saved in the database.
     * @param {BadgeLegendSettingCreateManyAndReturnArgs} args - Arguments to create many BadgeLegendSettings.
     * @example
     * // Create many BadgeLegendSettings
     * const badgeLegendSetting = await prisma.badgeLegendSetting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BadgeLegendSettings and only return the `id`
     * const badgeLegendSettingWithIdOnly = await prisma.badgeLegendSetting.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BadgeLegendSettingCreateManyAndReturnArgs>(args?: SelectSubset<T, BadgeLegendSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgeLegendSettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BadgeLegendSetting.
     * @param {BadgeLegendSettingDeleteArgs} args - Arguments to delete one BadgeLegendSetting.
     * @example
     * // Delete one BadgeLegendSetting
     * const BadgeLegendSetting = await prisma.badgeLegendSetting.delete({
     *   where: {
     *     // ... filter to delete one BadgeLegendSetting
     *   }
     * })
     * 
     */
    delete<T extends BadgeLegendSettingDeleteArgs>(args: SelectSubset<T, BadgeLegendSettingDeleteArgs<ExtArgs>>): Prisma__BadgeLegendSettingClient<$Result.GetResult<Prisma.$BadgeLegendSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BadgeLegendSetting.
     * @param {BadgeLegendSettingUpdateArgs} args - Arguments to update one BadgeLegendSetting.
     * @example
     * // Update one BadgeLegendSetting
     * const badgeLegendSetting = await prisma.badgeLegendSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BadgeLegendSettingUpdateArgs>(args: SelectSubset<T, BadgeLegendSettingUpdateArgs<ExtArgs>>): Prisma__BadgeLegendSettingClient<$Result.GetResult<Prisma.$BadgeLegendSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BadgeLegendSettings.
     * @param {BadgeLegendSettingDeleteManyArgs} args - Arguments to filter BadgeLegendSettings to delete.
     * @example
     * // Delete a few BadgeLegendSettings
     * const { count } = await prisma.badgeLegendSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BadgeLegendSettingDeleteManyArgs>(args?: SelectSubset<T, BadgeLegendSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BadgeLegendSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeLegendSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BadgeLegendSettings
     * const badgeLegendSetting = await prisma.badgeLegendSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BadgeLegendSettingUpdateManyArgs>(args: SelectSubset<T, BadgeLegendSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BadgeLegendSettings and returns the data updated in the database.
     * @param {BadgeLegendSettingUpdateManyAndReturnArgs} args - Arguments to update many BadgeLegendSettings.
     * @example
     * // Update many BadgeLegendSettings
     * const badgeLegendSetting = await prisma.badgeLegendSetting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BadgeLegendSettings and only return the `id`
     * const badgeLegendSettingWithIdOnly = await prisma.badgeLegendSetting.updateManyAndReturn({
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
    updateManyAndReturn<T extends BadgeLegendSettingUpdateManyAndReturnArgs>(args: SelectSubset<T, BadgeLegendSettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgeLegendSettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BadgeLegendSetting.
     * @param {BadgeLegendSettingUpsertArgs} args - Arguments to update or create a BadgeLegendSetting.
     * @example
     * // Update or create a BadgeLegendSetting
     * const badgeLegendSetting = await prisma.badgeLegendSetting.upsert({
     *   create: {
     *     // ... data to create a BadgeLegendSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BadgeLegendSetting we want to update
     *   }
     * })
     */
    upsert<T extends BadgeLegendSettingUpsertArgs>(args: SelectSubset<T, BadgeLegendSettingUpsertArgs<ExtArgs>>): Prisma__BadgeLegendSettingClient<$Result.GetResult<Prisma.$BadgeLegendSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BadgeLegendSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeLegendSettingCountArgs} args - Arguments to filter BadgeLegendSettings to count.
     * @example
     * // Count the number of BadgeLegendSettings
     * const count = await prisma.badgeLegendSetting.count({
     *   where: {
     *     // ... the filter for the BadgeLegendSettings we want to count
     *   }
     * })
    **/
    count<T extends BadgeLegendSettingCountArgs>(
      args?: Subset<T, BadgeLegendSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BadgeLegendSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BadgeLegendSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeLegendSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BadgeLegendSettingAggregateArgs>(args: Subset<T, BadgeLegendSettingAggregateArgs>): Prisma.PrismaPromise<GetBadgeLegendSettingAggregateType<T>>

    /**
     * Group by BadgeLegendSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeLegendSettingGroupByArgs} args - Group by arguments.
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
      T extends BadgeLegendSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BadgeLegendSettingGroupByArgs['orderBy'] }
        : { orderBy?: BadgeLegendSettingGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BadgeLegendSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBadgeLegendSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BadgeLegendSetting model
   */
  readonly fields: BadgeLegendSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BadgeLegendSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BadgeLegendSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    updatedBy<T extends BadgeLegendSetting$updatedByArgs<ExtArgs> = {}>(args?: Subset<T, BadgeLegendSetting$updatedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the BadgeLegendSetting model
   */
  interface BadgeLegendSettingFieldRefs {
    readonly id: FieldRef<"BadgeLegendSetting", 'String'>
    readonly bronze: FieldRef<"BadgeLegendSetting", 'String'>
    readonly silver: FieldRef<"BadgeLegendSetting", 'String'>
    readonly gold: FieldRef<"BadgeLegendSetting", 'String'>
    readonly loss_1: FieldRef<"BadgeLegendSetting", 'String'>
    readonly loss_2: FieldRef<"BadgeLegendSetting", 'String'>
    readonly updated_by: FieldRef<"BadgeLegendSetting", 'String'>
    readonly updated_at: FieldRef<"BadgeLegendSetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * BadgeLegendSetting findUnique
   */
  export type BadgeLegendSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeLegendSetting
     */
    select?: BadgeLegendSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeLegendSetting
     */
    omit?: BadgeLegendSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeLegendSettingInclude<ExtArgs> | null
    /**
     * Filter, which BadgeLegendSetting to fetch.
     */
    where: BadgeLegendSettingWhereUniqueInput
  }

  /**
   * BadgeLegendSetting findUniqueOrThrow
   */
  export type BadgeLegendSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeLegendSetting
     */
    select?: BadgeLegendSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeLegendSetting
     */
    omit?: BadgeLegendSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeLegendSettingInclude<ExtArgs> | null
    /**
     * Filter, which BadgeLegendSetting to fetch.
     */
    where: BadgeLegendSettingWhereUniqueInput
  }

  /**
   * BadgeLegendSetting findFirst
   */
  export type BadgeLegendSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeLegendSetting
     */
    select?: BadgeLegendSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeLegendSetting
     */
    omit?: BadgeLegendSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeLegendSettingInclude<ExtArgs> | null
    /**
     * Filter, which BadgeLegendSetting to fetch.
     */
    where?: BadgeLegendSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BadgeLegendSettings to fetch.
     */
    orderBy?: BadgeLegendSettingOrderByWithRelationInput | BadgeLegendSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BadgeLegendSettings.
     */
    cursor?: BadgeLegendSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BadgeLegendSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BadgeLegendSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BadgeLegendSettings.
     */
    distinct?: BadgeLegendSettingScalarFieldEnum | BadgeLegendSettingScalarFieldEnum[]
  }

  /**
   * BadgeLegendSetting findFirstOrThrow
   */
  export type BadgeLegendSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeLegendSetting
     */
    select?: BadgeLegendSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeLegendSetting
     */
    omit?: BadgeLegendSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeLegendSettingInclude<ExtArgs> | null
    /**
     * Filter, which BadgeLegendSetting to fetch.
     */
    where?: BadgeLegendSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BadgeLegendSettings to fetch.
     */
    orderBy?: BadgeLegendSettingOrderByWithRelationInput | BadgeLegendSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BadgeLegendSettings.
     */
    cursor?: BadgeLegendSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BadgeLegendSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BadgeLegendSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BadgeLegendSettings.
     */
    distinct?: BadgeLegendSettingScalarFieldEnum | BadgeLegendSettingScalarFieldEnum[]
  }

  /**
   * BadgeLegendSetting findMany
   */
  export type BadgeLegendSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeLegendSetting
     */
    select?: BadgeLegendSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeLegendSetting
     */
    omit?: BadgeLegendSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeLegendSettingInclude<ExtArgs> | null
    /**
     * Filter, which BadgeLegendSettings to fetch.
     */
    where?: BadgeLegendSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BadgeLegendSettings to fetch.
     */
    orderBy?: BadgeLegendSettingOrderByWithRelationInput | BadgeLegendSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BadgeLegendSettings.
     */
    cursor?: BadgeLegendSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BadgeLegendSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BadgeLegendSettings.
     */
    skip?: number
    distinct?: BadgeLegendSettingScalarFieldEnum | BadgeLegendSettingScalarFieldEnum[]
  }

  /**
   * BadgeLegendSetting create
   */
  export type BadgeLegendSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeLegendSetting
     */
    select?: BadgeLegendSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeLegendSetting
     */
    omit?: BadgeLegendSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeLegendSettingInclude<ExtArgs> | null
    /**
     * The data needed to create a BadgeLegendSetting.
     */
    data: XOR<BadgeLegendSettingCreateInput, BadgeLegendSettingUncheckedCreateInput>
  }

  /**
   * BadgeLegendSetting createMany
   */
  export type BadgeLegendSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BadgeLegendSettings.
     */
    data: BadgeLegendSettingCreateManyInput | BadgeLegendSettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BadgeLegendSetting createManyAndReturn
   */
  export type BadgeLegendSettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeLegendSetting
     */
    select?: BadgeLegendSettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeLegendSetting
     */
    omit?: BadgeLegendSettingOmit<ExtArgs> | null
    /**
     * The data used to create many BadgeLegendSettings.
     */
    data: BadgeLegendSettingCreateManyInput | BadgeLegendSettingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeLegendSettingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BadgeLegendSetting update
   */
  export type BadgeLegendSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeLegendSetting
     */
    select?: BadgeLegendSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeLegendSetting
     */
    omit?: BadgeLegendSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeLegendSettingInclude<ExtArgs> | null
    /**
     * The data needed to update a BadgeLegendSetting.
     */
    data: XOR<BadgeLegendSettingUpdateInput, BadgeLegendSettingUncheckedUpdateInput>
    /**
     * Choose, which BadgeLegendSetting to update.
     */
    where: BadgeLegendSettingWhereUniqueInput
  }

  /**
   * BadgeLegendSetting updateMany
   */
  export type BadgeLegendSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BadgeLegendSettings.
     */
    data: XOR<BadgeLegendSettingUpdateManyMutationInput, BadgeLegendSettingUncheckedUpdateManyInput>
    /**
     * Filter which BadgeLegendSettings to update
     */
    where?: BadgeLegendSettingWhereInput
    /**
     * Limit how many BadgeLegendSettings to update.
     */
    limit?: number
  }

  /**
   * BadgeLegendSetting updateManyAndReturn
   */
  export type BadgeLegendSettingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeLegendSetting
     */
    select?: BadgeLegendSettingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeLegendSetting
     */
    omit?: BadgeLegendSettingOmit<ExtArgs> | null
    /**
     * The data used to update BadgeLegendSettings.
     */
    data: XOR<BadgeLegendSettingUpdateManyMutationInput, BadgeLegendSettingUncheckedUpdateManyInput>
    /**
     * Filter which BadgeLegendSettings to update
     */
    where?: BadgeLegendSettingWhereInput
    /**
     * Limit how many BadgeLegendSettings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeLegendSettingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BadgeLegendSetting upsert
   */
  export type BadgeLegendSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeLegendSetting
     */
    select?: BadgeLegendSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeLegendSetting
     */
    omit?: BadgeLegendSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeLegendSettingInclude<ExtArgs> | null
    /**
     * The filter to search for the BadgeLegendSetting to update in case it exists.
     */
    where: BadgeLegendSettingWhereUniqueInput
    /**
     * In case the BadgeLegendSetting found by the `where` argument doesn't exist, create a new BadgeLegendSetting with this data.
     */
    create: XOR<BadgeLegendSettingCreateInput, BadgeLegendSettingUncheckedCreateInput>
    /**
     * In case the BadgeLegendSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BadgeLegendSettingUpdateInput, BadgeLegendSettingUncheckedUpdateInput>
  }

  /**
   * BadgeLegendSetting delete
   */
  export type BadgeLegendSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeLegendSetting
     */
    select?: BadgeLegendSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeLegendSetting
     */
    omit?: BadgeLegendSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeLegendSettingInclude<ExtArgs> | null
    /**
     * Filter which BadgeLegendSetting to delete.
     */
    where: BadgeLegendSettingWhereUniqueInput
  }

  /**
   * BadgeLegendSetting deleteMany
   */
  export type BadgeLegendSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BadgeLegendSettings to delete
     */
    where?: BadgeLegendSettingWhereInput
    /**
     * Limit how many BadgeLegendSettings to delete.
     */
    limit?: number
  }

  /**
   * BadgeLegendSetting.updatedBy
   */
  export type BadgeLegendSetting$updatedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * BadgeLegendSetting without action
   */
  export type BadgeLegendSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeLegendSetting
     */
    select?: BadgeLegendSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeLegendSetting
     */
    omit?: BadgeLegendSettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeLegendSettingInclude<ExtArgs> | null
  }


  /**
   * Model UserBadge
   */

  export type AggregateUserBadge = {
    _count: UserBadgeCountAggregateOutputType | null
    _min: UserBadgeMinAggregateOutputType | null
    _max: UserBadgeMaxAggregateOutputType | null
  }

  export type UserBadgeMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    badge_id: string | null
    awarded_at: Date | null
    awarded_by: string | null
    tone: $Enums.BadgeTone | null
  }

  export type UserBadgeMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    badge_id: string | null
    awarded_at: Date | null
    awarded_by: string | null
    tone: $Enums.BadgeTone | null
  }

  export type UserBadgeCountAggregateOutputType = {
    id: number
    user_id: number
    badge_id: number
    awarded_at: number
    awarded_by: number
    tone: number
    _all: number
  }


  export type UserBadgeMinAggregateInputType = {
    id?: true
    user_id?: true
    badge_id?: true
    awarded_at?: true
    awarded_by?: true
    tone?: true
  }

  export type UserBadgeMaxAggregateInputType = {
    id?: true
    user_id?: true
    badge_id?: true
    awarded_at?: true
    awarded_by?: true
    tone?: true
  }

  export type UserBadgeCountAggregateInputType = {
    id?: true
    user_id?: true
    badge_id?: true
    awarded_at?: true
    awarded_by?: true
    tone?: true
    _all?: true
  }

  export type UserBadgeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserBadge to aggregate.
     */
    where?: UserBadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBadges to fetch.
     */
    orderBy?: UserBadgeOrderByWithRelationInput | UserBadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserBadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBadges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBadges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserBadges
    **/
    _count?: true | UserBadgeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserBadgeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserBadgeMaxAggregateInputType
  }

  export type GetUserBadgeAggregateType<T extends UserBadgeAggregateArgs> = {
        [P in keyof T & keyof AggregateUserBadge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserBadge[P]>
      : GetScalarType<T[P], AggregateUserBadge[P]>
  }




  export type UserBadgeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserBadgeWhereInput
    orderBy?: UserBadgeOrderByWithAggregationInput | UserBadgeOrderByWithAggregationInput[]
    by: UserBadgeScalarFieldEnum[] | UserBadgeScalarFieldEnum
    having?: UserBadgeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserBadgeCountAggregateInputType | true
    _min?: UserBadgeMinAggregateInputType
    _max?: UserBadgeMaxAggregateInputType
  }

  export type UserBadgeGroupByOutputType = {
    id: string
    user_id: string
    badge_id: string
    awarded_at: Date
    awarded_by: string | null
    tone: $Enums.BadgeTone
    _count: UserBadgeCountAggregateOutputType | null
    _min: UserBadgeMinAggregateOutputType | null
    _max: UserBadgeMaxAggregateOutputType | null
  }

  type GetUserBadgeGroupByPayload<T extends UserBadgeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserBadgeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserBadgeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserBadgeGroupByOutputType[P]>
            : GetScalarType<T[P], UserBadgeGroupByOutputType[P]>
        }
      >
    >


  export type UserBadgeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    badge_id?: boolean
    awarded_at?: boolean
    awarded_by?: boolean
    tone?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
    awardedBy?: boolean | UserBadge$awardedByArgs<ExtArgs>
  }, ExtArgs["result"]["userBadge"]>

  export type UserBadgeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    badge_id?: boolean
    awarded_at?: boolean
    awarded_by?: boolean
    tone?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
    awardedBy?: boolean | UserBadge$awardedByArgs<ExtArgs>
  }, ExtArgs["result"]["userBadge"]>

  export type UserBadgeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    badge_id?: boolean
    awarded_at?: boolean
    awarded_by?: boolean
    tone?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
    awardedBy?: boolean | UserBadge$awardedByArgs<ExtArgs>
  }, ExtArgs["result"]["userBadge"]>

  export type UserBadgeSelectScalar = {
    id?: boolean
    user_id?: boolean
    badge_id?: boolean
    awarded_at?: boolean
    awarded_by?: boolean
    tone?: boolean
  }

  export type UserBadgeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "badge_id" | "awarded_at" | "awarded_by" | "tone", ExtArgs["result"]["userBadge"]>
  export type UserBadgeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
    awardedBy?: boolean | UserBadge$awardedByArgs<ExtArgs>
  }
  export type UserBadgeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
    awardedBy?: boolean | UserBadge$awardedByArgs<ExtArgs>
  }
  export type UserBadgeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
    awardedBy?: boolean | UserBadge$awardedByArgs<ExtArgs>
  }

  export type $UserBadgePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserBadge"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      badge: Prisma.$BadgePayload<ExtArgs>
      awardedBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      badge_id: string
      awarded_at: Date
      awarded_by: string | null
      tone: $Enums.BadgeTone
    }, ExtArgs["result"]["userBadge"]>
    composites: {}
  }

  type UserBadgeGetPayload<S extends boolean | null | undefined | UserBadgeDefaultArgs> = $Result.GetResult<Prisma.$UserBadgePayload, S>

  type UserBadgeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserBadgeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserBadgeCountAggregateInputType | true
    }

  export interface UserBadgeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserBadge'], meta: { name: 'UserBadge' } }
    /**
     * Find zero or one UserBadge that matches the filter.
     * @param {UserBadgeFindUniqueArgs} args - Arguments to find a UserBadge
     * @example
     * // Get one UserBadge
     * const userBadge = await prisma.userBadge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserBadgeFindUniqueArgs>(args: SelectSubset<T, UserBadgeFindUniqueArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserBadge that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserBadgeFindUniqueOrThrowArgs} args - Arguments to find a UserBadge
     * @example
     * // Get one UserBadge
     * const userBadge = await prisma.userBadge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserBadgeFindUniqueOrThrowArgs>(args: SelectSubset<T, UserBadgeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserBadge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeFindFirstArgs} args - Arguments to find a UserBadge
     * @example
     * // Get one UserBadge
     * const userBadge = await prisma.userBadge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserBadgeFindFirstArgs>(args?: SelectSubset<T, UserBadgeFindFirstArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserBadge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeFindFirstOrThrowArgs} args - Arguments to find a UserBadge
     * @example
     * // Get one UserBadge
     * const userBadge = await prisma.userBadge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserBadgeFindFirstOrThrowArgs>(args?: SelectSubset<T, UserBadgeFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserBadges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserBadges
     * const userBadges = await prisma.userBadge.findMany()
     * 
     * // Get first 10 UserBadges
     * const userBadges = await prisma.userBadge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userBadgeWithIdOnly = await prisma.userBadge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserBadgeFindManyArgs>(args?: SelectSubset<T, UserBadgeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserBadge.
     * @param {UserBadgeCreateArgs} args - Arguments to create a UserBadge.
     * @example
     * // Create one UserBadge
     * const UserBadge = await prisma.userBadge.create({
     *   data: {
     *     // ... data to create a UserBadge
     *   }
     * })
     * 
     */
    create<T extends UserBadgeCreateArgs>(args: SelectSubset<T, UserBadgeCreateArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserBadges.
     * @param {UserBadgeCreateManyArgs} args - Arguments to create many UserBadges.
     * @example
     * // Create many UserBadges
     * const userBadge = await prisma.userBadge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserBadgeCreateManyArgs>(args?: SelectSubset<T, UserBadgeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserBadges and returns the data saved in the database.
     * @param {UserBadgeCreateManyAndReturnArgs} args - Arguments to create many UserBadges.
     * @example
     * // Create many UserBadges
     * const userBadge = await prisma.userBadge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserBadges and only return the `id`
     * const userBadgeWithIdOnly = await prisma.userBadge.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserBadgeCreateManyAndReturnArgs>(args?: SelectSubset<T, UserBadgeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserBadge.
     * @param {UserBadgeDeleteArgs} args - Arguments to delete one UserBadge.
     * @example
     * // Delete one UserBadge
     * const UserBadge = await prisma.userBadge.delete({
     *   where: {
     *     // ... filter to delete one UserBadge
     *   }
     * })
     * 
     */
    delete<T extends UserBadgeDeleteArgs>(args: SelectSubset<T, UserBadgeDeleteArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserBadge.
     * @param {UserBadgeUpdateArgs} args - Arguments to update one UserBadge.
     * @example
     * // Update one UserBadge
     * const userBadge = await prisma.userBadge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserBadgeUpdateArgs>(args: SelectSubset<T, UserBadgeUpdateArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserBadges.
     * @param {UserBadgeDeleteManyArgs} args - Arguments to filter UserBadges to delete.
     * @example
     * // Delete a few UserBadges
     * const { count } = await prisma.userBadge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserBadgeDeleteManyArgs>(args?: SelectSubset<T, UserBadgeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserBadges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserBadges
     * const userBadge = await prisma.userBadge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserBadgeUpdateManyArgs>(args: SelectSubset<T, UserBadgeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserBadges and returns the data updated in the database.
     * @param {UserBadgeUpdateManyAndReturnArgs} args - Arguments to update many UserBadges.
     * @example
     * // Update many UserBadges
     * const userBadge = await prisma.userBadge.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserBadges and only return the `id`
     * const userBadgeWithIdOnly = await prisma.userBadge.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserBadgeUpdateManyAndReturnArgs>(args: SelectSubset<T, UserBadgeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserBadge.
     * @param {UserBadgeUpsertArgs} args - Arguments to update or create a UserBadge.
     * @example
     * // Update or create a UserBadge
     * const userBadge = await prisma.userBadge.upsert({
     *   create: {
     *     // ... data to create a UserBadge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserBadge we want to update
     *   }
     * })
     */
    upsert<T extends UserBadgeUpsertArgs>(args: SelectSubset<T, UserBadgeUpsertArgs<ExtArgs>>): Prisma__UserBadgeClient<$Result.GetResult<Prisma.$UserBadgePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserBadges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeCountArgs} args - Arguments to filter UserBadges to count.
     * @example
     * // Count the number of UserBadges
     * const count = await prisma.userBadge.count({
     *   where: {
     *     // ... the filter for the UserBadges we want to count
     *   }
     * })
    **/
    count<T extends UserBadgeCountArgs>(
      args?: Subset<T, UserBadgeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserBadgeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserBadge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserBadgeAggregateArgs>(args: Subset<T, UserBadgeAggregateArgs>): Prisma.PrismaPromise<GetUserBadgeAggregateType<T>>

    /**
     * Group by UserBadge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserBadgeGroupByArgs} args - Group by arguments.
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
      T extends UserBadgeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserBadgeGroupByArgs['orderBy'] }
        : { orderBy?: UserBadgeGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserBadgeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserBadgeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserBadge model
   */
  readonly fields: UserBadgeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserBadge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserBadgeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    badge<T extends BadgeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BadgeDefaultArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    awardedBy<T extends UserBadge$awardedByArgs<ExtArgs> = {}>(args?: Subset<T, UserBadge$awardedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the UserBadge model
   */
  interface UserBadgeFieldRefs {
    readonly id: FieldRef<"UserBadge", 'String'>
    readonly user_id: FieldRef<"UserBadge", 'String'>
    readonly badge_id: FieldRef<"UserBadge", 'String'>
    readonly awarded_at: FieldRef<"UserBadge", 'DateTime'>
    readonly awarded_by: FieldRef<"UserBadge", 'String'>
    readonly tone: FieldRef<"UserBadge", 'BadgeTone'>
  }
    

  // Custom InputTypes
  /**
   * UserBadge findUnique
   */
  export type UserBadgeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * Filter, which UserBadge to fetch.
     */
    where: UserBadgeWhereUniqueInput
  }

  /**
   * UserBadge findUniqueOrThrow
   */
  export type UserBadgeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * Filter, which UserBadge to fetch.
     */
    where: UserBadgeWhereUniqueInput
  }

  /**
   * UserBadge findFirst
   */
  export type UserBadgeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * Filter, which UserBadge to fetch.
     */
    where?: UserBadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBadges to fetch.
     */
    orderBy?: UserBadgeOrderByWithRelationInput | UserBadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserBadges.
     */
    cursor?: UserBadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBadges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBadges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserBadges.
     */
    distinct?: UserBadgeScalarFieldEnum | UserBadgeScalarFieldEnum[]
  }

  /**
   * UserBadge findFirstOrThrow
   */
  export type UserBadgeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * Filter, which UserBadge to fetch.
     */
    where?: UserBadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBadges to fetch.
     */
    orderBy?: UserBadgeOrderByWithRelationInput | UserBadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserBadges.
     */
    cursor?: UserBadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBadges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBadges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserBadges.
     */
    distinct?: UserBadgeScalarFieldEnum | UserBadgeScalarFieldEnum[]
  }

  /**
   * UserBadge findMany
   */
  export type UserBadgeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * Filter, which UserBadges to fetch.
     */
    where?: UserBadgeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserBadges to fetch.
     */
    orderBy?: UserBadgeOrderByWithRelationInput | UserBadgeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserBadges.
     */
    cursor?: UserBadgeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserBadges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserBadges.
     */
    skip?: number
    distinct?: UserBadgeScalarFieldEnum | UserBadgeScalarFieldEnum[]
  }

  /**
   * UserBadge create
   */
  export type UserBadgeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * The data needed to create a UserBadge.
     */
    data: XOR<UserBadgeCreateInput, UserBadgeUncheckedCreateInput>
  }

  /**
   * UserBadge createMany
   */
  export type UserBadgeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserBadges.
     */
    data: UserBadgeCreateManyInput | UserBadgeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserBadge createManyAndReturn
   */
  export type UserBadgeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * The data used to create many UserBadges.
     */
    data: UserBadgeCreateManyInput | UserBadgeCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserBadge update
   */
  export type UserBadgeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * The data needed to update a UserBadge.
     */
    data: XOR<UserBadgeUpdateInput, UserBadgeUncheckedUpdateInput>
    /**
     * Choose, which UserBadge to update.
     */
    where: UserBadgeWhereUniqueInput
  }

  /**
   * UserBadge updateMany
   */
  export type UserBadgeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserBadges.
     */
    data: XOR<UserBadgeUpdateManyMutationInput, UserBadgeUncheckedUpdateManyInput>
    /**
     * Filter which UserBadges to update
     */
    where?: UserBadgeWhereInput
    /**
     * Limit how many UserBadges to update.
     */
    limit?: number
  }

  /**
   * UserBadge updateManyAndReturn
   */
  export type UserBadgeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * The data used to update UserBadges.
     */
    data: XOR<UserBadgeUpdateManyMutationInput, UserBadgeUncheckedUpdateManyInput>
    /**
     * Filter which UserBadges to update
     */
    where?: UserBadgeWhereInput
    /**
     * Limit how many UserBadges to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserBadge upsert
   */
  export type UserBadgeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * The filter to search for the UserBadge to update in case it exists.
     */
    where: UserBadgeWhereUniqueInput
    /**
     * In case the UserBadge found by the `where` argument doesn't exist, create a new UserBadge with this data.
     */
    create: XOR<UserBadgeCreateInput, UserBadgeUncheckedCreateInput>
    /**
     * In case the UserBadge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserBadgeUpdateInput, UserBadgeUncheckedUpdateInput>
  }

  /**
   * UserBadge delete
   */
  export type UserBadgeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
    /**
     * Filter which UserBadge to delete.
     */
    where: UserBadgeWhereUniqueInput
  }

  /**
   * UserBadge deleteMany
   */
  export type UserBadgeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserBadges to delete
     */
    where?: UserBadgeWhereInput
    /**
     * Limit how many UserBadges to delete.
     */
    limit?: number
  }

  /**
   * UserBadge.awardedBy
   */
  export type UserBadge$awardedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * UserBadge without action
   */
  export type UserBadgeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserBadge
     */
    select?: UserBadgeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserBadge
     */
    omit?: UserBadgeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserBadgeInclude<ExtArgs> | null
  }


  /**
   * Model BadgeSubmission
   */

  export type AggregateBadgeSubmission = {
    _count: BadgeSubmissionCountAggregateOutputType | null
    _min: BadgeSubmissionMinAggregateOutputType | null
    _max: BadgeSubmissionMaxAggregateOutputType | null
  }

  export type BadgeSubmissionMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    badge_id: string | null
    proof_url: string | null
    description: string | null
    status: $Enums.SubmissionStatus | null
    submitted_at: Date | null
    reviewed_by: string | null
    reviewed_at: Date | null
    feedback: string | null
  }

  export type BadgeSubmissionMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    badge_id: string | null
    proof_url: string | null
    description: string | null
    status: $Enums.SubmissionStatus | null
    submitted_at: Date | null
    reviewed_by: string | null
    reviewed_at: Date | null
    feedback: string | null
  }

  export type BadgeSubmissionCountAggregateOutputType = {
    id: number
    user_id: number
    badge_id: number
    proof_url: number
    description: number
    status: number
    submitted_at: number
    reviewed_by: number
    reviewed_at: number
    feedback: number
    _all: number
  }


  export type BadgeSubmissionMinAggregateInputType = {
    id?: true
    user_id?: true
    badge_id?: true
    proof_url?: true
    description?: true
    status?: true
    submitted_at?: true
    reviewed_by?: true
    reviewed_at?: true
    feedback?: true
  }

  export type BadgeSubmissionMaxAggregateInputType = {
    id?: true
    user_id?: true
    badge_id?: true
    proof_url?: true
    description?: true
    status?: true
    submitted_at?: true
    reviewed_by?: true
    reviewed_at?: true
    feedback?: true
  }

  export type BadgeSubmissionCountAggregateInputType = {
    id?: true
    user_id?: true
    badge_id?: true
    proof_url?: true
    description?: true
    status?: true
    submitted_at?: true
    reviewed_by?: true
    reviewed_at?: true
    feedback?: true
    _all?: true
  }

  export type BadgeSubmissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BadgeSubmission to aggregate.
     */
    where?: BadgeSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BadgeSubmissions to fetch.
     */
    orderBy?: BadgeSubmissionOrderByWithRelationInput | BadgeSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: BadgeSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BadgeSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BadgeSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned BadgeSubmissions
    **/
    _count?: true | BadgeSubmissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: BadgeSubmissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: BadgeSubmissionMaxAggregateInputType
  }

  export type GetBadgeSubmissionAggregateType<T extends BadgeSubmissionAggregateArgs> = {
        [P in keyof T & keyof AggregateBadgeSubmission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateBadgeSubmission[P]>
      : GetScalarType<T[P], AggregateBadgeSubmission[P]>
  }




  export type BadgeSubmissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: BadgeSubmissionWhereInput
    orderBy?: BadgeSubmissionOrderByWithAggregationInput | BadgeSubmissionOrderByWithAggregationInput[]
    by: BadgeSubmissionScalarFieldEnum[] | BadgeSubmissionScalarFieldEnum
    having?: BadgeSubmissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: BadgeSubmissionCountAggregateInputType | true
    _min?: BadgeSubmissionMinAggregateInputType
    _max?: BadgeSubmissionMaxAggregateInputType
  }

  export type BadgeSubmissionGroupByOutputType = {
    id: string
    user_id: string
    badge_id: string
    proof_url: string | null
    description: string | null
    status: $Enums.SubmissionStatus
    submitted_at: Date
    reviewed_by: string | null
    reviewed_at: Date | null
    feedback: string | null
    _count: BadgeSubmissionCountAggregateOutputType | null
    _min: BadgeSubmissionMinAggregateOutputType | null
    _max: BadgeSubmissionMaxAggregateOutputType | null
  }

  type GetBadgeSubmissionGroupByPayload<T extends BadgeSubmissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<BadgeSubmissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof BadgeSubmissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], BadgeSubmissionGroupByOutputType[P]>
            : GetScalarType<T[P], BadgeSubmissionGroupByOutputType[P]>
        }
      >
    >


  export type BadgeSubmissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    badge_id?: boolean
    proof_url?: boolean
    description?: boolean
    status?: boolean
    submitted_at?: boolean
    reviewed_by?: boolean
    reviewed_at?: boolean
    feedback?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
    reviewedBy?: boolean | BadgeSubmission$reviewedByArgs<ExtArgs>
  }, ExtArgs["result"]["badgeSubmission"]>

  export type BadgeSubmissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    badge_id?: boolean
    proof_url?: boolean
    description?: boolean
    status?: boolean
    submitted_at?: boolean
    reviewed_by?: boolean
    reviewed_at?: boolean
    feedback?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
    reviewedBy?: boolean | BadgeSubmission$reviewedByArgs<ExtArgs>
  }, ExtArgs["result"]["badgeSubmission"]>

  export type BadgeSubmissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    badge_id?: boolean
    proof_url?: boolean
    description?: boolean
    status?: boolean
    submitted_at?: boolean
    reviewed_by?: boolean
    reviewed_at?: boolean
    feedback?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
    reviewedBy?: boolean | BadgeSubmission$reviewedByArgs<ExtArgs>
  }, ExtArgs["result"]["badgeSubmission"]>

  export type BadgeSubmissionSelectScalar = {
    id?: boolean
    user_id?: boolean
    badge_id?: boolean
    proof_url?: boolean
    description?: boolean
    status?: boolean
    submitted_at?: boolean
    reviewed_by?: boolean
    reviewed_at?: boolean
    feedback?: boolean
  }

  export type BadgeSubmissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "badge_id" | "proof_url" | "description" | "status" | "submitted_at" | "reviewed_by" | "reviewed_at" | "feedback", ExtArgs["result"]["badgeSubmission"]>
  export type BadgeSubmissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
    reviewedBy?: boolean | BadgeSubmission$reviewedByArgs<ExtArgs>
  }
  export type BadgeSubmissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
    reviewedBy?: boolean | BadgeSubmission$reviewedByArgs<ExtArgs>
  }
  export type BadgeSubmissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    badge?: boolean | BadgeDefaultArgs<ExtArgs>
    reviewedBy?: boolean | BadgeSubmission$reviewedByArgs<ExtArgs>
  }

  export type $BadgeSubmissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "BadgeSubmission"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      badge: Prisma.$BadgePayload<ExtArgs>
      reviewedBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      badge_id: string
      proof_url: string | null
      description: string | null
      status: $Enums.SubmissionStatus
      submitted_at: Date
      reviewed_by: string | null
      reviewed_at: Date | null
      feedback: string | null
    }, ExtArgs["result"]["badgeSubmission"]>
    composites: {}
  }

  type BadgeSubmissionGetPayload<S extends boolean | null | undefined | BadgeSubmissionDefaultArgs> = $Result.GetResult<Prisma.$BadgeSubmissionPayload, S>

  type BadgeSubmissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<BadgeSubmissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: BadgeSubmissionCountAggregateInputType | true
    }

  export interface BadgeSubmissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['BadgeSubmission'], meta: { name: 'BadgeSubmission' } }
    /**
     * Find zero or one BadgeSubmission that matches the filter.
     * @param {BadgeSubmissionFindUniqueArgs} args - Arguments to find a BadgeSubmission
     * @example
     * // Get one BadgeSubmission
     * const badgeSubmission = await prisma.badgeSubmission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends BadgeSubmissionFindUniqueArgs>(args: SelectSubset<T, BadgeSubmissionFindUniqueArgs<ExtArgs>>): Prisma__BadgeSubmissionClient<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one BadgeSubmission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {BadgeSubmissionFindUniqueOrThrowArgs} args - Arguments to find a BadgeSubmission
     * @example
     * // Get one BadgeSubmission
     * const badgeSubmission = await prisma.badgeSubmission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends BadgeSubmissionFindUniqueOrThrowArgs>(args: SelectSubset<T, BadgeSubmissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__BadgeSubmissionClient<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BadgeSubmission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeSubmissionFindFirstArgs} args - Arguments to find a BadgeSubmission
     * @example
     * // Get one BadgeSubmission
     * const badgeSubmission = await prisma.badgeSubmission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends BadgeSubmissionFindFirstArgs>(args?: SelectSubset<T, BadgeSubmissionFindFirstArgs<ExtArgs>>): Prisma__BadgeSubmissionClient<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first BadgeSubmission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeSubmissionFindFirstOrThrowArgs} args - Arguments to find a BadgeSubmission
     * @example
     * // Get one BadgeSubmission
     * const badgeSubmission = await prisma.badgeSubmission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends BadgeSubmissionFindFirstOrThrowArgs>(args?: SelectSubset<T, BadgeSubmissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__BadgeSubmissionClient<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more BadgeSubmissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeSubmissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all BadgeSubmissions
     * const badgeSubmissions = await prisma.badgeSubmission.findMany()
     * 
     * // Get first 10 BadgeSubmissions
     * const badgeSubmissions = await prisma.badgeSubmission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const badgeSubmissionWithIdOnly = await prisma.badgeSubmission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends BadgeSubmissionFindManyArgs>(args?: SelectSubset<T, BadgeSubmissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a BadgeSubmission.
     * @param {BadgeSubmissionCreateArgs} args - Arguments to create a BadgeSubmission.
     * @example
     * // Create one BadgeSubmission
     * const BadgeSubmission = await prisma.badgeSubmission.create({
     *   data: {
     *     // ... data to create a BadgeSubmission
     *   }
     * })
     * 
     */
    create<T extends BadgeSubmissionCreateArgs>(args: SelectSubset<T, BadgeSubmissionCreateArgs<ExtArgs>>): Prisma__BadgeSubmissionClient<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many BadgeSubmissions.
     * @param {BadgeSubmissionCreateManyArgs} args - Arguments to create many BadgeSubmissions.
     * @example
     * // Create many BadgeSubmissions
     * const badgeSubmission = await prisma.badgeSubmission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends BadgeSubmissionCreateManyArgs>(args?: SelectSubset<T, BadgeSubmissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many BadgeSubmissions and returns the data saved in the database.
     * @param {BadgeSubmissionCreateManyAndReturnArgs} args - Arguments to create many BadgeSubmissions.
     * @example
     * // Create many BadgeSubmissions
     * const badgeSubmission = await prisma.badgeSubmission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many BadgeSubmissions and only return the `id`
     * const badgeSubmissionWithIdOnly = await prisma.badgeSubmission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends BadgeSubmissionCreateManyAndReturnArgs>(args?: SelectSubset<T, BadgeSubmissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a BadgeSubmission.
     * @param {BadgeSubmissionDeleteArgs} args - Arguments to delete one BadgeSubmission.
     * @example
     * // Delete one BadgeSubmission
     * const BadgeSubmission = await prisma.badgeSubmission.delete({
     *   where: {
     *     // ... filter to delete one BadgeSubmission
     *   }
     * })
     * 
     */
    delete<T extends BadgeSubmissionDeleteArgs>(args: SelectSubset<T, BadgeSubmissionDeleteArgs<ExtArgs>>): Prisma__BadgeSubmissionClient<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one BadgeSubmission.
     * @param {BadgeSubmissionUpdateArgs} args - Arguments to update one BadgeSubmission.
     * @example
     * // Update one BadgeSubmission
     * const badgeSubmission = await prisma.badgeSubmission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends BadgeSubmissionUpdateArgs>(args: SelectSubset<T, BadgeSubmissionUpdateArgs<ExtArgs>>): Prisma__BadgeSubmissionClient<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more BadgeSubmissions.
     * @param {BadgeSubmissionDeleteManyArgs} args - Arguments to filter BadgeSubmissions to delete.
     * @example
     * // Delete a few BadgeSubmissions
     * const { count } = await prisma.badgeSubmission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends BadgeSubmissionDeleteManyArgs>(args?: SelectSubset<T, BadgeSubmissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BadgeSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeSubmissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many BadgeSubmissions
     * const badgeSubmission = await prisma.badgeSubmission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends BadgeSubmissionUpdateManyArgs>(args: SelectSubset<T, BadgeSubmissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more BadgeSubmissions and returns the data updated in the database.
     * @param {BadgeSubmissionUpdateManyAndReturnArgs} args - Arguments to update many BadgeSubmissions.
     * @example
     * // Update many BadgeSubmissions
     * const badgeSubmission = await prisma.badgeSubmission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more BadgeSubmissions and only return the `id`
     * const badgeSubmissionWithIdOnly = await prisma.badgeSubmission.updateManyAndReturn({
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
    updateManyAndReturn<T extends BadgeSubmissionUpdateManyAndReturnArgs>(args: SelectSubset<T, BadgeSubmissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one BadgeSubmission.
     * @param {BadgeSubmissionUpsertArgs} args - Arguments to update or create a BadgeSubmission.
     * @example
     * // Update or create a BadgeSubmission
     * const badgeSubmission = await prisma.badgeSubmission.upsert({
     *   create: {
     *     // ... data to create a BadgeSubmission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the BadgeSubmission we want to update
     *   }
     * })
     */
    upsert<T extends BadgeSubmissionUpsertArgs>(args: SelectSubset<T, BadgeSubmissionUpsertArgs<ExtArgs>>): Prisma__BadgeSubmissionClient<$Result.GetResult<Prisma.$BadgeSubmissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of BadgeSubmissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeSubmissionCountArgs} args - Arguments to filter BadgeSubmissions to count.
     * @example
     * // Count the number of BadgeSubmissions
     * const count = await prisma.badgeSubmission.count({
     *   where: {
     *     // ... the filter for the BadgeSubmissions we want to count
     *   }
     * })
    **/
    count<T extends BadgeSubmissionCountArgs>(
      args?: Subset<T, BadgeSubmissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], BadgeSubmissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a BadgeSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeSubmissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends BadgeSubmissionAggregateArgs>(args: Subset<T, BadgeSubmissionAggregateArgs>): Prisma.PrismaPromise<GetBadgeSubmissionAggregateType<T>>

    /**
     * Group by BadgeSubmission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {BadgeSubmissionGroupByArgs} args - Group by arguments.
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
      T extends BadgeSubmissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: BadgeSubmissionGroupByArgs['orderBy'] }
        : { orderBy?: BadgeSubmissionGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, BadgeSubmissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBadgeSubmissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the BadgeSubmission model
   */
  readonly fields: BadgeSubmissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for BadgeSubmission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__BadgeSubmissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    badge<T extends BadgeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, BadgeDefaultArgs<ExtArgs>>): Prisma__BadgeClient<$Result.GetResult<Prisma.$BadgePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    reviewedBy<T extends BadgeSubmission$reviewedByArgs<ExtArgs> = {}>(args?: Subset<T, BadgeSubmission$reviewedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the BadgeSubmission model
   */
  interface BadgeSubmissionFieldRefs {
    readonly id: FieldRef<"BadgeSubmission", 'String'>
    readonly user_id: FieldRef<"BadgeSubmission", 'String'>
    readonly badge_id: FieldRef<"BadgeSubmission", 'String'>
    readonly proof_url: FieldRef<"BadgeSubmission", 'String'>
    readonly description: FieldRef<"BadgeSubmission", 'String'>
    readonly status: FieldRef<"BadgeSubmission", 'SubmissionStatus'>
    readonly submitted_at: FieldRef<"BadgeSubmission", 'DateTime'>
    readonly reviewed_by: FieldRef<"BadgeSubmission", 'String'>
    readonly reviewed_at: FieldRef<"BadgeSubmission", 'DateTime'>
    readonly feedback: FieldRef<"BadgeSubmission", 'String'>
  }
    

  // Custom InputTypes
  /**
   * BadgeSubmission findUnique
   */
  export type BadgeSubmissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which BadgeSubmission to fetch.
     */
    where: BadgeSubmissionWhereUniqueInput
  }

  /**
   * BadgeSubmission findUniqueOrThrow
   */
  export type BadgeSubmissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which BadgeSubmission to fetch.
     */
    where: BadgeSubmissionWhereUniqueInput
  }

  /**
   * BadgeSubmission findFirst
   */
  export type BadgeSubmissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which BadgeSubmission to fetch.
     */
    where?: BadgeSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BadgeSubmissions to fetch.
     */
    orderBy?: BadgeSubmissionOrderByWithRelationInput | BadgeSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BadgeSubmissions.
     */
    cursor?: BadgeSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BadgeSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BadgeSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BadgeSubmissions.
     */
    distinct?: BadgeSubmissionScalarFieldEnum | BadgeSubmissionScalarFieldEnum[]
  }

  /**
   * BadgeSubmission findFirstOrThrow
   */
  export type BadgeSubmissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which BadgeSubmission to fetch.
     */
    where?: BadgeSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BadgeSubmissions to fetch.
     */
    orderBy?: BadgeSubmissionOrderByWithRelationInput | BadgeSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for BadgeSubmissions.
     */
    cursor?: BadgeSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BadgeSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BadgeSubmissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of BadgeSubmissions.
     */
    distinct?: BadgeSubmissionScalarFieldEnum | BadgeSubmissionScalarFieldEnum[]
  }

  /**
   * BadgeSubmission findMany
   */
  export type BadgeSubmissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionInclude<ExtArgs> | null
    /**
     * Filter, which BadgeSubmissions to fetch.
     */
    where?: BadgeSubmissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of BadgeSubmissions to fetch.
     */
    orderBy?: BadgeSubmissionOrderByWithRelationInput | BadgeSubmissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing BadgeSubmissions.
     */
    cursor?: BadgeSubmissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` BadgeSubmissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` BadgeSubmissions.
     */
    skip?: number
    distinct?: BadgeSubmissionScalarFieldEnum | BadgeSubmissionScalarFieldEnum[]
  }

  /**
   * BadgeSubmission create
   */
  export type BadgeSubmissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionInclude<ExtArgs> | null
    /**
     * The data needed to create a BadgeSubmission.
     */
    data: XOR<BadgeSubmissionCreateInput, BadgeSubmissionUncheckedCreateInput>
  }

  /**
   * BadgeSubmission createMany
   */
  export type BadgeSubmissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many BadgeSubmissions.
     */
    data: BadgeSubmissionCreateManyInput | BadgeSubmissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * BadgeSubmission createManyAndReturn
   */
  export type BadgeSubmissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * The data used to create many BadgeSubmissions.
     */
    data: BadgeSubmissionCreateManyInput | BadgeSubmissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * BadgeSubmission update
   */
  export type BadgeSubmissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionInclude<ExtArgs> | null
    /**
     * The data needed to update a BadgeSubmission.
     */
    data: XOR<BadgeSubmissionUpdateInput, BadgeSubmissionUncheckedUpdateInput>
    /**
     * Choose, which BadgeSubmission to update.
     */
    where: BadgeSubmissionWhereUniqueInput
  }

  /**
   * BadgeSubmission updateMany
   */
  export type BadgeSubmissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update BadgeSubmissions.
     */
    data: XOR<BadgeSubmissionUpdateManyMutationInput, BadgeSubmissionUncheckedUpdateManyInput>
    /**
     * Filter which BadgeSubmissions to update
     */
    where?: BadgeSubmissionWhereInput
    /**
     * Limit how many BadgeSubmissions to update.
     */
    limit?: number
  }

  /**
   * BadgeSubmission updateManyAndReturn
   */
  export type BadgeSubmissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * The data used to update BadgeSubmissions.
     */
    data: XOR<BadgeSubmissionUpdateManyMutationInput, BadgeSubmissionUncheckedUpdateManyInput>
    /**
     * Filter which BadgeSubmissions to update
     */
    where?: BadgeSubmissionWhereInput
    /**
     * Limit how many BadgeSubmissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * BadgeSubmission upsert
   */
  export type BadgeSubmissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionInclude<ExtArgs> | null
    /**
     * The filter to search for the BadgeSubmission to update in case it exists.
     */
    where: BadgeSubmissionWhereUniqueInput
    /**
     * In case the BadgeSubmission found by the `where` argument doesn't exist, create a new BadgeSubmission with this data.
     */
    create: XOR<BadgeSubmissionCreateInput, BadgeSubmissionUncheckedCreateInput>
    /**
     * In case the BadgeSubmission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<BadgeSubmissionUpdateInput, BadgeSubmissionUncheckedUpdateInput>
  }

  /**
   * BadgeSubmission delete
   */
  export type BadgeSubmissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionInclude<ExtArgs> | null
    /**
     * Filter which BadgeSubmission to delete.
     */
    where: BadgeSubmissionWhereUniqueInput
  }

  /**
   * BadgeSubmission deleteMany
   */
  export type BadgeSubmissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which BadgeSubmissions to delete
     */
    where?: BadgeSubmissionWhereInput
    /**
     * Limit how many BadgeSubmissions to delete.
     */
    limit?: number
  }

  /**
   * BadgeSubmission.reviewedBy
   */
  export type BadgeSubmission$reviewedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * BadgeSubmission without action
   */
  export type BadgeSubmissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the BadgeSubmission
     */
    select?: BadgeSubmissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the BadgeSubmission
     */
    omit?: BadgeSubmissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: BadgeSubmissionInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationMinAggregateOutputType = {
    id: string | null
    user_id: string | null
    title: string | null
    message: string | null
    sent_at: Date | null
    read: boolean | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: string | null
    user_id: string | null
    title: string | null
    message: string | null
    sent_at: Date | null
    read: boolean | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    user_id: number
    title: number
    message: number
    sent_at: number
    read: number
    _all: number
  }


  export type NotificationMinAggregateInputType = {
    id?: true
    user_id?: true
    title?: true
    message?: true
    sent_at?: true
    read?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    user_id?: true
    title?: true
    message?: true
    sent_at?: true
    read?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    user_id?: true
    title?: true
    message?: true
    sent_at?: true
    read?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: string
    user_id: string
    title: string
    message: string
    sent_at: Date
    read: boolean
    _count: NotificationCountAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    title?: boolean
    message?: boolean
    sent_at?: boolean
    read?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    title?: boolean
    message?: boolean
    sent_at?: boolean
    read?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    user_id?: boolean
    title?: boolean
    message?: boolean
    sent_at?: boolean
    read?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>

  export type NotificationSelectScalar = {
    id?: boolean
    user_id?: boolean
    title?: boolean
    message?: boolean
    sent_at?: boolean
    read?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "user_id" | "title" | "message" | "sent_at" | "read", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type NotificationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      user_id: string
      title: string
      message: string
      sent_at: Date
      read: boolean
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Notifications and returns the data saved in the database.
     * @param {NotificationCreateManyAndReturnArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends NotificationCreateManyAndReturnArgs>(args?: SelectSubset<T, NotificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications and returns the data updated in the database.
     * @param {NotificationUpdateManyAndReturnArgs} args - Arguments to update many Notifications.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Notifications and only return the `id`
     * const notificationWithIdOnly = await prisma.notification.updateManyAndReturn({
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
    updateManyAndReturn<T extends NotificationUpdateManyAndReturnArgs>(args: SelectSubset<T, NotificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
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
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'String'>
    readonly user_id: FieldRef<"Notification", 'String'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly sent_at: FieldRef<"Notification", 'DateTime'>
    readonly read: FieldRef<"Notification", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification createManyAndReturn
   */
  export type NotificationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification updateManyAndReturn
   */
  export type NotificationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model ImportSource
   */

  export type AggregateImportSource = {
    _count: ImportSourceCountAggregateOutputType | null
    _min: ImportSourceMinAggregateOutputType | null
    _max: ImportSourceMaxAggregateOutputType | null
  }

  export type ImportSourceMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    company_column: string | null
    productive_unit_column: string | null
    user_column: string | null
    badge_column: string | null
    tone_column: string | null
    award_column: string | null
    created_at: Date | null
    archived_at: Date | null
  }

  export type ImportSourceMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    company_column: string | null
    productive_unit_column: string | null
    user_column: string | null
    badge_column: string | null
    tone_column: string | null
    award_column: string | null
    created_at: Date | null
    archived_at: Date | null
  }

  export type ImportSourceCountAggregateOutputType = {
    id: number
    name: number
    description: number
    company_column: number
    productive_unit_column: number
    user_column: number
    badge_column: number
    tone_column: number
    award_column: number
    created_at: number
    archived_at: number
    _all: number
  }


  export type ImportSourceMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    company_column?: true
    productive_unit_column?: true
    user_column?: true
    badge_column?: true
    tone_column?: true
    award_column?: true
    created_at?: true
    archived_at?: true
  }

  export type ImportSourceMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    company_column?: true
    productive_unit_column?: true
    user_column?: true
    badge_column?: true
    tone_column?: true
    award_column?: true
    created_at?: true
    archived_at?: true
  }

  export type ImportSourceCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    company_column?: true
    productive_unit_column?: true
    user_column?: true
    badge_column?: true
    tone_column?: true
    award_column?: true
    created_at?: true
    archived_at?: true
    _all?: true
  }

  export type ImportSourceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportSource to aggregate.
     */
    where?: ImportSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportSources to fetch.
     */
    orderBy?: ImportSourceOrderByWithRelationInput | ImportSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImportSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImportSources
    **/
    _count?: true | ImportSourceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImportSourceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImportSourceMaxAggregateInputType
  }

  export type GetImportSourceAggregateType<T extends ImportSourceAggregateArgs> = {
        [P in keyof T & keyof AggregateImportSource]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImportSource[P]>
      : GetScalarType<T[P], AggregateImportSource[P]>
  }




  export type ImportSourceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImportSourceWhereInput
    orderBy?: ImportSourceOrderByWithAggregationInput | ImportSourceOrderByWithAggregationInput[]
    by: ImportSourceScalarFieldEnum[] | ImportSourceScalarFieldEnum
    having?: ImportSourceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImportSourceCountAggregateInputType | true
    _min?: ImportSourceMinAggregateInputType
    _max?: ImportSourceMaxAggregateInputType
  }

  export type ImportSourceGroupByOutputType = {
    id: string
    name: string
    description: string | null
    company_column: string
    productive_unit_column: string
    user_column: string
    badge_column: string
    tone_column: string
    award_column: string
    created_at: Date
    archived_at: Date | null
    _count: ImportSourceCountAggregateOutputType | null
    _min: ImportSourceMinAggregateOutputType | null
    _max: ImportSourceMaxAggregateOutputType | null
  }

  type GetImportSourceGroupByPayload<T extends ImportSourceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImportSourceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImportSourceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImportSourceGroupByOutputType[P]>
            : GetScalarType<T[P], ImportSourceGroupByOutputType[P]>
        }
      >
    >


  export type ImportSourceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    company_column?: boolean
    productive_unit_column?: boolean
    user_column?: boolean
    badge_column?: boolean
    tone_column?: boolean
    award_column?: boolean
    created_at?: boolean
    archived_at?: boolean
    import_runs?: boolean | ImportSource$import_runsArgs<ExtArgs>
    _count?: boolean | ImportSourceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importSource"]>

  export type ImportSourceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    company_column?: boolean
    productive_unit_column?: boolean
    user_column?: boolean
    badge_column?: boolean
    tone_column?: boolean
    award_column?: boolean
    created_at?: boolean
    archived_at?: boolean
  }, ExtArgs["result"]["importSource"]>

  export type ImportSourceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    company_column?: boolean
    productive_unit_column?: boolean
    user_column?: boolean
    badge_column?: boolean
    tone_column?: boolean
    award_column?: boolean
    created_at?: boolean
    archived_at?: boolean
  }, ExtArgs["result"]["importSource"]>

  export type ImportSourceSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    company_column?: boolean
    productive_unit_column?: boolean
    user_column?: boolean
    badge_column?: boolean
    tone_column?: boolean
    award_column?: boolean
    created_at?: boolean
    archived_at?: boolean
  }

  export type ImportSourceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "company_column" | "productive_unit_column" | "user_column" | "badge_column" | "tone_column" | "award_column" | "created_at" | "archived_at", ExtArgs["result"]["importSource"]>
  export type ImportSourceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    import_runs?: boolean | ImportSource$import_runsArgs<ExtArgs>
    _count?: boolean | ImportSourceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ImportSourceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type ImportSourceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $ImportSourcePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImportSource"
    objects: {
      import_runs: Prisma.$ImportRunPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      company_column: string
      productive_unit_column: string
      user_column: string
      badge_column: string
      tone_column: string
      award_column: string
      created_at: Date
      archived_at: Date | null
    }, ExtArgs["result"]["importSource"]>
    composites: {}
  }

  type ImportSourceGetPayload<S extends boolean | null | undefined | ImportSourceDefaultArgs> = $Result.GetResult<Prisma.$ImportSourcePayload, S>

  type ImportSourceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImportSourceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImportSourceCountAggregateInputType | true
    }

  export interface ImportSourceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImportSource'], meta: { name: 'ImportSource' } }
    /**
     * Find zero or one ImportSource that matches the filter.
     * @param {ImportSourceFindUniqueArgs} args - Arguments to find a ImportSource
     * @example
     * // Get one ImportSource
     * const importSource = await prisma.importSource.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImportSourceFindUniqueArgs>(args: SelectSubset<T, ImportSourceFindUniqueArgs<ExtArgs>>): Prisma__ImportSourceClient<$Result.GetResult<Prisma.$ImportSourcePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImportSource that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImportSourceFindUniqueOrThrowArgs} args - Arguments to find a ImportSource
     * @example
     * // Get one ImportSource
     * const importSource = await prisma.importSource.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImportSourceFindUniqueOrThrowArgs>(args: SelectSubset<T, ImportSourceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImportSourceClient<$Result.GetResult<Prisma.$ImportSourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImportSource that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSourceFindFirstArgs} args - Arguments to find a ImportSource
     * @example
     * // Get one ImportSource
     * const importSource = await prisma.importSource.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImportSourceFindFirstArgs>(args?: SelectSubset<T, ImportSourceFindFirstArgs<ExtArgs>>): Prisma__ImportSourceClient<$Result.GetResult<Prisma.$ImportSourcePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImportSource that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSourceFindFirstOrThrowArgs} args - Arguments to find a ImportSource
     * @example
     * // Get one ImportSource
     * const importSource = await prisma.importSource.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImportSourceFindFirstOrThrowArgs>(args?: SelectSubset<T, ImportSourceFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImportSourceClient<$Result.GetResult<Prisma.$ImportSourcePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImportSources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSourceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImportSources
     * const importSources = await prisma.importSource.findMany()
     * 
     * // Get first 10 ImportSources
     * const importSources = await prisma.importSource.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const importSourceWithIdOnly = await prisma.importSource.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImportSourceFindManyArgs>(args?: SelectSubset<T, ImportSourceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportSourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImportSource.
     * @param {ImportSourceCreateArgs} args - Arguments to create a ImportSource.
     * @example
     * // Create one ImportSource
     * const ImportSource = await prisma.importSource.create({
     *   data: {
     *     // ... data to create a ImportSource
     *   }
     * })
     * 
     */
    create<T extends ImportSourceCreateArgs>(args: SelectSubset<T, ImportSourceCreateArgs<ExtArgs>>): Prisma__ImportSourceClient<$Result.GetResult<Prisma.$ImportSourcePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImportSources.
     * @param {ImportSourceCreateManyArgs} args - Arguments to create many ImportSources.
     * @example
     * // Create many ImportSources
     * const importSource = await prisma.importSource.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImportSourceCreateManyArgs>(args?: SelectSubset<T, ImportSourceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImportSources and returns the data saved in the database.
     * @param {ImportSourceCreateManyAndReturnArgs} args - Arguments to create many ImportSources.
     * @example
     * // Create many ImportSources
     * const importSource = await prisma.importSource.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImportSources and only return the `id`
     * const importSourceWithIdOnly = await prisma.importSource.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImportSourceCreateManyAndReturnArgs>(args?: SelectSubset<T, ImportSourceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportSourcePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ImportSource.
     * @param {ImportSourceDeleteArgs} args - Arguments to delete one ImportSource.
     * @example
     * // Delete one ImportSource
     * const ImportSource = await prisma.importSource.delete({
     *   where: {
     *     // ... filter to delete one ImportSource
     *   }
     * })
     * 
     */
    delete<T extends ImportSourceDeleteArgs>(args: SelectSubset<T, ImportSourceDeleteArgs<ExtArgs>>): Prisma__ImportSourceClient<$Result.GetResult<Prisma.$ImportSourcePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImportSource.
     * @param {ImportSourceUpdateArgs} args - Arguments to update one ImportSource.
     * @example
     * // Update one ImportSource
     * const importSource = await prisma.importSource.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImportSourceUpdateArgs>(args: SelectSubset<T, ImportSourceUpdateArgs<ExtArgs>>): Prisma__ImportSourceClient<$Result.GetResult<Prisma.$ImportSourcePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImportSources.
     * @param {ImportSourceDeleteManyArgs} args - Arguments to filter ImportSources to delete.
     * @example
     * // Delete a few ImportSources
     * const { count } = await prisma.importSource.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImportSourceDeleteManyArgs>(args?: SelectSubset<T, ImportSourceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImportSources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSourceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImportSources
     * const importSource = await prisma.importSource.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImportSourceUpdateManyArgs>(args: SelectSubset<T, ImportSourceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImportSources and returns the data updated in the database.
     * @param {ImportSourceUpdateManyAndReturnArgs} args - Arguments to update many ImportSources.
     * @example
     * // Update many ImportSources
     * const importSource = await prisma.importSource.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ImportSources and only return the `id`
     * const importSourceWithIdOnly = await prisma.importSource.updateManyAndReturn({
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
    updateManyAndReturn<T extends ImportSourceUpdateManyAndReturnArgs>(args: SelectSubset<T, ImportSourceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportSourcePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ImportSource.
     * @param {ImportSourceUpsertArgs} args - Arguments to update or create a ImportSource.
     * @example
     * // Update or create a ImportSource
     * const importSource = await prisma.importSource.upsert({
     *   create: {
     *     // ... data to create a ImportSource
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImportSource we want to update
     *   }
     * })
     */
    upsert<T extends ImportSourceUpsertArgs>(args: SelectSubset<T, ImportSourceUpsertArgs<ExtArgs>>): Prisma__ImportSourceClient<$Result.GetResult<Prisma.$ImportSourcePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImportSources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSourceCountArgs} args - Arguments to filter ImportSources to count.
     * @example
     * // Count the number of ImportSources
     * const count = await prisma.importSource.count({
     *   where: {
     *     // ... the filter for the ImportSources we want to count
     *   }
     * })
    **/
    count<T extends ImportSourceCountArgs>(
      args?: Subset<T, ImportSourceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImportSourceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImportSource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSourceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImportSourceAggregateArgs>(args: Subset<T, ImportSourceAggregateArgs>): Prisma.PrismaPromise<GetImportSourceAggregateType<T>>

    /**
     * Group by ImportSource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportSourceGroupByArgs} args - Group by arguments.
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
      T extends ImportSourceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImportSourceGroupByArgs['orderBy'] }
        : { orderBy?: ImportSourceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImportSourceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImportSourceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImportSource model
   */
  readonly fields: ImportSourceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImportSource.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImportSourceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    import_runs<T extends ImportSource$import_runsArgs<ExtArgs> = {}>(args?: Subset<T, ImportSource$import_runsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ImportSource model
   */
  interface ImportSourceFieldRefs {
    readonly id: FieldRef<"ImportSource", 'String'>
    readonly name: FieldRef<"ImportSource", 'String'>
    readonly description: FieldRef<"ImportSource", 'String'>
    readonly company_column: FieldRef<"ImportSource", 'String'>
    readonly productive_unit_column: FieldRef<"ImportSource", 'String'>
    readonly user_column: FieldRef<"ImportSource", 'String'>
    readonly badge_column: FieldRef<"ImportSource", 'String'>
    readonly tone_column: FieldRef<"ImportSource", 'String'>
    readonly award_column: FieldRef<"ImportSource", 'String'>
    readonly created_at: FieldRef<"ImportSource", 'DateTime'>
    readonly archived_at: FieldRef<"ImportSource", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ImportSource findUnique
   */
  export type ImportSourceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSource
     */
    select?: ImportSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSource
     */
    omit?: ImportSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSourceInclude<ExtArgs> | null
    /**
     * Filter, which ImportSource to fetch.
     */
    where: ImportSourceWhereUniqueInput
  }

  /**
   * ImportSource findUniqueOrThrow
   */
  export type ImportSourceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSource
     */
    select?: ImportSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSource
     */
    omit?: ImportSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSourceInclude<ExtArgs> | null
    /**
     * Filter, which ImportSource to fetch.
     */
    where: ImportSourceWhereUniqueInput
  }

  /**
   * ImportSource findFirst
   */
  export type ImportSourceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSource
     */
    select?: ImportSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSource
     */
    omit?: ImportSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSourceInclude<ExtArgs> | null
    /**
     * Filter, which ImportSource to fetch.
     */
    where?: ImportSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportSources to fetch.
     */
    orderBy?: ImportSourceOrderByWithRelationInput | ImportSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportSources.
     */
    cursor?: ImportSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportSources.
     */
    distinct?: ImportSourceScalarFieldEnum | ImportSourceScalarFieldEnum[]
  }

  /**
   * ImportSource findFirstOrThrow
   */
  export type ImportSourceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSource
     */
    select?: ImportSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSource
     */
    omit?: ImportSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSourceInclude<ExtArgs> | null
    /**
     * Filter, which ImportSource to fetch.
     */
    where?: ImportSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportSources to fetch.
     */
    orderBy?: ImportSourceOrderByWithRelationInput | ImportSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportSources.
     */
    cursor?: ImportSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportSources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportSources.
     */
    distinct?: ImportSourceScalarFieldEnum | ImportSourceScalarFieldEnum[]
  }

  /**
   * ImportSource findMany
   */
  export type ImportSourceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSource
     */
    select?: ImportSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSource
     */
    omit?: ImportSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSourceInclude<ExtArgs> | null
    /**
     * Filter, which ImportSources to fetch.
     */
    where?: ImportSourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportSources to fetch.
     */
    orderBy?: ImportSourceOrderByWithRelationInput | ImportSourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImportSources.
     */
    cursor?: ImportSourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportSources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportSources.
     */
    skip?: number
    distinct?: ImportSourceScalarFieldEnum | ImportSourceScalarFieldEnum[]
  }

  /**
   * ImportSource create
   */
  export type ImportSourceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSource
     */
    select?: ImportSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSource
     */
    omit?: ImportSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSourceInclude<ExtArgs> | null
    /**
     * The data needed to create a ImportSource.
     */
    data: XOR<ImportSourceCreateInput, ImportSourceUncheckedCreateInput>
  }

  /**
   * ImportSource createMany
   */
  export type ImportSourceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImportSources.
     */
    data: ImportSourceCreateManyInput | ImportSourceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImportSource createManyAndReturn
   */
  export type ImportSourceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSource
     */
    select?: ImportSourceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSource
     */
    omit?: ImportSourceOmit<ExtArgs> | null
    /**
     * The data used to create many ImportSources.
     */
    data: ImportSourceCreateManyInput | ImportSourceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImportSource update
   */
  export type ImportSourceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSource
     */
    select?: ImportSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSource
     */
    omit?: ImportSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSourceInclude<ExtArgs> | null
    /**
     * The data needed to update a ImportSource.
     */
    data: XOR<ImportSourceUpdateInput, ImportSourceUncheckedUpdateInput>
    /**
     * Choose, which ImportSource to update.
     */
    where: ImportSourceWhereUniqueInput
  }

  /**
   * ImportSource updateMany
   */
  export type ImportSourceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImportSources.
     */
    data: XOR<ImportSourceUpdateManyMutationInput, ImportSourceUncheckedUpdateManyInput>
    /**
     * Filter which ImportSources to update
     */
    where?: ImportSourceWhereInput
    /**
     * Limit how many ImportSources to update.
     */
    limit?: number
  }

  /**
   * ImportSource updateManyAndReturn
   */
  export type ImportSourceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSource
     */
    select?: ImportSourceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSource
     */
    omit?: ImportSourceOmit<ExtArgs> | null
    /**
     * The data used to update ImportSources.
     */
    data: XOR<ImportSourceUpdateManyMutationInput, ImportSourceUncheckedUpdateManyInput>
    /**
     * Filter which ImportSources to update
     */
    where?: ImportSourceWhereInput
    /**
     * Limit how many ImportSources to update.
     */
    limit?: number
  }

  /**
   * ImportSource upsert
   */
  export type ImportSourceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSource
     */
    select?: ImportSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSource
     */
    omit?: ImportSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSourceInclude<ExtArgs> | null
    /**
     * The filter to search for the ImportSource to update in case it exists.
     */
    where: ImportSourceWhereUniqueInput
    /**
     * In case the ImportSource found by the `where` argument doesn't exist, create a new ImportSource with this data.
     */
    create: XOR<ImportSourceCreateInput, ImportSourceUncheckedCreateInput>
    /**
     * In case the ImportSource was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImportSourceUpdateInput, ImportSourceUncheckedUpdateInput>
  }

  /**
   * ImportSource delete
   */
  export type ImportSourceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSource
     */
    select?: ImportSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSource
     */
    omit?: ImportSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSourceInclude<ExtArgs> | null
    /**
     * Filter which ImportSource to delete.
     */
    where: ImportSourceWhereUniqueInput
  }

  /**
   * ImportSource deleteMany
   */
  export type ImportSourceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportSources to delete
     */
    where?: ImportSourceWhereInput
    /**
     * Limit how many ImportSources to delete.
     */
    limit?: number
  }

  /**
   * ImportSource.import_runs
   */
  export type ImportSource$import_runsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunInclude<ExtArgs> | null
    where?: ImportRunWhereInput
    orderBy?: ImportRunOrderByWithRelationInput | ImportRunOrderByWithRelationInput[]
    cursor?: ImportRunWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImportRunScalarFieldEnum | ImportRunScalarFieldEnum[]
  }

  /**
   * ImportSource without action
   */
  export type ImportSourceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSource
     */
    select?: ImportSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSource
     */
    omit?: ImportSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSourceInclude<ExtArgs> | null
  }


  /**
   * Model ImportRun
   */

  export type AggregateImportRun = {
    _count: ImportRunCountAggregateOutputType | null
    _min: ImportRunMinAggregateOutputType | null
    _max: ImportRunMaxAggregateOutputType | null
  }

  export type ImportRunMinAggregateOutputType = {
    id: string | null
    source_id: string | null
    source_name: string | null
    imported_by: string | null
    imported_at: Date | null
    status: $Enums.ImportRunStatus | null
  }

  export type ImportRunMaxAggregateOutputType = {
    id: string | null
    source_id: string | null
    source_name: string | null
    imported_by: string | null
    imported_at: Date | null
    status: $Enums.ImportRunStatus | null
  }

  export type ImportRunCountAggregateOutputType = {
    id: number
    source_id: number
    source_name: number
    imported_by: number
    imported_at: number
    status: number
    matched_columns: number
    summary: number
    _all: number
  }


  export type ImportRunMinAggregateInputType = {
    id?: true
    source_id?: true
    source_name?: true
    imported_by?: true
    imported_at?: true
    status?: true
  }

  export type ImportRunMaxAggregateInputType = {
    id?: true
    source_id?: true
    source_name?: true
    imported_by?: true
    imported_at?: true
    status?: true
  }

  export type ImportRunCountAggregateInputType = {
    id?: true
    source_id?: true
    source_name?: true
    imported_by?: true
    imported_at?: true
    status?: true
    matched_columns?: true
    summary?: true
    _all?: true
  }

  export type ImportRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportRun to aggregate.
     */
    where?: ImportRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportRuns to fetch.
     */
    orderBy?: ImportRunOrderByWithRelationInput | ImportRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImportRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImportRuns
    **/
    _count?: true | ImportRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImportRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImportRunMaxAggregateInputType
  }

  export type GetImportRunAggregateType<T extends ImportRunAggregateArgs> = {
        [P in keyof T & keyof AggregateImportRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImportRun[P]>
      : GetScalarType<T[P], AggregateImportRun[P]>
  }




  export type ImportRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImportRunWhereInput
    orderBy?: ImportRunOrderByWithAggregationInput | ImportRunOrderByWithAggregationInput[]
    by: ImportRunScalarFieldEnum[] | ImportRunScalarFieldEnum
    having?: ImportRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImportRunCountAggregateInputType | true
    _min?: ImportRunMinAggregateInputType
    _max?: ImportRunMaxAggregateInputType
  }

  export type ImportRunGroupByOutputType = {
    id: string
    source_id: string | null
    source_name: string
    imported_by: string | null
    imported_at: Date
    status: $Enums.ImportRunStatus
    matched_columns: JsonValue
    summary: JsonValue
    _count: ImportRunCountAggregateOutputType | null
    _min: ImportRunMinAggregateOutputType | null
    _max: ImportRunMaxAggregateOutputType | null
  }

  type GetImportRunGroupByPayload<T extends ImportRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImportRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImportRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImportRunGroupByOutputType[P]>
            : GetScalarType<T[P], ImportRunGroupByOutputType[P]>
        }
      >
    >


  export type ImportRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source_id?: boolean
    source_name?: boolean
    imported_by?: boolean
    imported_at?: boolean
    status?: boolean
    matched_columns?: boolean
    summary?: boolean
    source?: boolean | ImportRun$sourceArgs<ExtArgs>
    importedBy?: boolean | ImportRun$importedByArgs<ExtArgs>
    rows?: boolean | ImportRun$rowsArgs<ExtArgs>
    _count?: boolean | ImportRunCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importRun"]>

  export type ImportRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source_id?: boolean
    source_name?: boolean
    imported_by?: boolean
    imported_at?: boolean
    status?: boolean
    matched_columns?: boolean
    summary?: boolean
    source?: boolean | ImportRun$sourceArgs<ExtArgs>
    importedBy?: boolean | ImportRun$importedByArgs<ExtArgs>
  }, ExtArgs["result"]["importRun"]>

  export type ImportRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source_id?: boolean
    source_name?: boolean
    imported_by?: boolean
    imported_at?: boolean
    status?: boolean
    matched_columns?: boolean
    summary?: boolean
    source?: boolean | ImportRun$sourceArgs<ExtArgs>
    importedBy?: boolean | ImportRun$importedByArgs<ExtArgs>
  }, ExtArgs["result"]["importRun"]>

  export type ImportRunSelectScalar = {
    id?: boolean
    source_id?: boolean
    source_name?: boolean
    imported_by?: boolean
    imported_at?: boolean
    status?: boolean
    matched_columns?: boolean
    summary?: boolean
  }

  export type ImportRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "source_id" | "source_name" | "imported_by" | "imported_at" | "status" | "matched_columns" | "summary", ExtArgs["result"]["importRun"]>
  export type ImportRunInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | ImportRun$sourceArgs<ExtArgs>
    importedBy?: boolean | ImportRun$importedByArgs<ExtArgs>
    rows?: boolean | ImportRun$rowsArgs<ExtArgs>
    _count?: boolean | ImportRunCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ImportRunIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | ImportRun$sourceArgs<ExtArgs>
    importedBy?: boolean | ImportRun$importedByArgs<ExtArgs>
  }
  export type ImportRunIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    source?: boolean | ImportRun$sourceArgs<ExtArgs>
    importedBy?: boolean | ImportRun$importedByArgs<ExtArgs>
  }

  export type $ImportRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImportRun"
    objects: {
      source: Prisma.$ImportSourcePayload<ExtArgs> | null
      importedBy: Prisma.$UserPayload<ExtArgs> | null
      rows: Prisma.$ImportRunRowPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      source_id: string | null
      source_name: string
      imported_by: string | null
      imported_at: Date
      status: $Enums.ImportRunStatus
      matched_columns: Prisma.JsonValue
      summary: Prisma.JsonValue
    }, ExtArgs["result"]["importRun"]>
    composites: {}
  }

  type ImportRunGetPayload<S extends boolean | null | undefined | ImportRunDefaultArgs> = $Result.GetResult<Prisma.$ImportRunPayload, S>

  type ImportRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImportRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImportRunCountAggregateInputType | true
    }

  export interface ImportRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImportRun'], meta: { name: 'ImportRun' } }
    /**
     * Find zero or one ImportRun that matches the filter.
     * @param {ImportRunFindUniqueArgs} args - Arguments to find a ImportRun
     * @example
     * // Get one ImportRun
     * const importRun = await prisma.importRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImportRunFindUniqueArgs>(args: SelectSubset<T, ImportRunFindUniqueArgs<ExtArgs>>): Prisma__ImportRunClient<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImportRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImportRunFindUniqueOrThrowArgs} args - Arguments to find a ImportRun
     * @example
     * // Get one ImportRun
     * const importRun = await prisma.importRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImportRunFindUniqueOrThrowArgs>(args: SelectSubset<T, ImportRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImportRunClient<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImportRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunFindFirstArgs} args - Arguments to find a ImportRun
     * @example
     * // Get one ImportRun
     * const importRun = await prisma.importRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImportRunFindFirstArgs>(args?: SelectSubset<T, ImportRunFindFirstArgs<ExtArgs>>): Prisma__ImportRunClient<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImportRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunFindFirstOrThrowArgs} args - Arguments to find a ImportRun
     * @example
     * // Get one ImportRun
     * const importRun = await prisma.importRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImportRunFindFirstOrThrowArgs>(args?: SelectSubset<T, ImportRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImportRunClient<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImportRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImportRuns
     * const importRuns = await prisma.importRun.findMany()
     * 
     * // Get first 10 ImportRuns
     * const importRuns = await prisma.importRun.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const importRunWithIdOnly = await prisma.importRun.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImportRunFindManyArgs>(args?: SelectSubset<T, ImportRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImportRun.
     * @param {ImportRunCreateArgs} args - Arguments to create a ImportRun.
     * @example
     * // Create one ImportRun
     * const ImportRun = await prisma.importRun.create({
     *   data: {
     *     // ... data to create a ImportRun
     *   }
     * })
     * 
     */
    create<T extends ImportRunCreateArgs>(args: SelectSubset<T, ImportRunCreateArgs<ExtArgs>>): Prisma__ImportRunClient<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImportRuns.
     * @param {ImportRunCreateManyArgs} args - Arguments to create many ImportRuns.
     * @example
     * // Create many ImportRuns
     * const importRun = await prisma.importRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImportRunCreateManyArgs>(args?: SelectSubset<T, ImportRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImportRuns and returns the data saved in the database.
     * @param {ImportRunCreateManyAndReturnArgs} args - Arguments to create many ImportRuns.
     * @example
     * // Create many ImportRuns
     * const importRun = await prisma.importRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImportRuns and only return the `id`
     * const importRunWithIdOnly = await prisma.importRun.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImportRunCreateManyAndReturnArgs>(args?: SelectSubset<T, ImportRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ImportRun.
     * @param {ImportRunDeleteArgs} args - Arguments to delete one ImportRun.
     * @example
     * // Delete one ImportRun
     * const ImportRun = await prisma.importRun.delete({
     *   where: {
     *     // ... filter to delete one ImportRun
     *   }
     * })
     * 
     */
    delete<T extends ImportRunDeleteArgs>(args: SelectSubset<T, ImportRunDeleteArgs<ExtArgs>>): Prisma__ImportRunClient<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImportRun.
     * @param {ImportRunUpdateArgs} args - Arguments to update one ImportRun.
     * @example
     * // Update one ImportRun
     * const importRun = await prisma.importRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImportRunUpdateArgs>(args: SelectSubset<T, ImportRunUpdateArgs<ExtArgs>>): Prisma__ImportRunClient<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImportRuns.
     * @param {ImportRunDeleteManyArgs} args - Arguments to filter ImportRuns to delete.
     * @example
     * // Delete a few ImportRuns
     * const { count } = await prisma.importRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImportRunDeleteManyArgs>(args?: SelectSubset<T, ImportRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImportRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImportRuns
     * const importRun = await prisma.importRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImportRunUpdateManyArgs>(args: SelectSubset<T, ImportRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImportRuns and returns the data updated in the database.
     * @param {ImportRunUpdateManyAndReturnArgs} args - Arguments to update many ImportRuns.
     * @example
     * // Update many ImportRuns
     * const importRun = await prisma.importRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ImportRuns and only return the `id`
     * const importRunWithIdOnly = await prisma.importRun.updateManyAndReturn({
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
    updateManyAndReturn<T extends ImportRunUpdateManyAndReturnArgs>(args: SelectSubset<T, ImportRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ImportRun.
     * @param {ImportRunUpsertArgs} args - Arguments to update or create a ImportRun.
     * @example
     * // Update or create a ImportRun
     * const importRun = await prisma.importRun.upsert({
     *   create: {
     *     // ... data to create a ImportRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImportRun we want to update
     *   }
     * })
     */
    upsert<T extends ImportRunUpsertArgs>(args: SelectSubset<T, ImportRunUpsertArgs<ExtArgs>>): Prisma__ImportRunClient<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImportRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunCountArgs} args - Arguments to filter ImportRuns to count.
     * @example
     * // Count the number of ImportRuns
     * const count = await prisma.importRun.count({
     *   where: {
     *     // ... the filter for the ImportRuns we want to count
     *   }
     * })
    **/
    count<T extends ImportRunCountArgs>(
      args?: Subset<T, ImportRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImportRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImportRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImportRunAggregateArgs>(args: Subset<T, ImportRunAggregateArgs>): Prisma.PrismaPromise<GetImportRunAggregateType<T>>

    /**
     * Group by ImportRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunGroupByArgs} args - Group by arguments.
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
      T extends ImportRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImportRunGroupByArgs['orderBy'] }
        : { orderBy?: ImportRunGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImportRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImportRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImportRun model
   */
  readonly fields: ImportRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImportRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImportRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    source<T extends ImportRun$sourceArgs<ExtArgs> = {}>(args?: Subset<T, ImportRun$sourceArgs<ExtArgs>>): Prisma__ImportSourceClient<$Result.GetResult<Prisma.$ImportSourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    importedBy<T extends ImportRun$importedByArgs<ExtArgs> = {}>(args?: Subset<T, ImportRun$importedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    rows<T extends ImportRun$rowsArgs<ExtArgs> = {}>(args?: Subset<T, ImportRun$rowsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportRunRowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the ImportRun model
   */
  interface ImportRunFieldRefs {
    readonly id: FieldRef<"ImportRun", 'String'>
    readonly source_id: FieldRef<"ImportRun", 'String'>
    readonly source_name: FieldRef<"ImportRun", 'String'>
    readonly imported_by: FieldRef<"ImportRun", 'String'>
    readonly imported_at: FieldRef<"ImportRun", 'DateTime'>
    readonly status: FieldRef<"ImportRun", 'ImportRunStatus'>
    readonly matched_columns: FieldRef<"ImportRun", 'Json'>
    readonly summary: FieldRef<"ImportRun", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * ImportRun findUnique
   */
  export type ImportRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunInclude<ExtArgs> | null
    /**
     * Filter, which ImportRun to fetch.
     */
    where: ImportRunWhereUniqueInput
  }

  /**
   * ImportRun findUniqueOrThrow
   */
  export type ImportRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunInclude<ExtArgs> | null
    /**
     * Filter, which ImportRun to fetch.
     */
    where: ImportRunWhereUniqueInput
  }

  /**
   * ImportRun findFirst
   */
  export type ImportRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunInclude<ExtArgs> | null
    /**
     * Filter, which ImportRun to fetch.
     */
    where?: ImportRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportRuns to fetch.
     */
    orderBy?: ImportRunOrderByWithRelationInput | ImportRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportRuns.
     */
    cursor?: ImportRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportRuns.
     */
    distinct?: ImportRunScalarFieldEnum | ImportRunScalarFieldEnum[]
  }

  /**
   * ImportRun findFirstOrThrow
   */
  export type ImportRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunInclude<ExtArgs> | null
    /**
     * Filter, which ImportRun to fetch.
     */
    where?: ImportRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportRuns to fetch.
     */
    orderBy?: ImportRunOrderByWithRelationInput | ImportRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportRuns.
     */
    cursor?: ImportRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportRuns.
     */
    distinct?: ImportRunScalarFieldEnum | ImportRunScalarFieldEnum[]
  }

  /**
   * ImportRun findMany
   */
  export type ImportRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunInclude<ExtArgs> | null
    /**
     * Filter, which ImportRuns to fetch.
     */
    where?: ImportRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportRuns to fetch.
     */
    orderBy?: ImportRunOrderByWithRelationInput | ImportRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImportRuns.
     */
    cursor?: ImportRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportRuns.
     */
    skip?: number
    distinct?: ImportRunScalarFieldEnum | ImportRunScalarFieldEnum[]
  }

  /**
   * ImportRun create
   */
  export type ImportRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunInclude<ExtArgs> | null
    /**
     * The data needed to create a ImportRun.
     */
    data: XOR<ImportRunCreateInput, ImportRunUncheckedCreateInput>
  }

  /**
   * ImportRun createMany
   */
  export type ImportRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImportRuns.
     */
    data: ImportRunCreateManyInput | ImportRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImportRun createManyAndReturn
   */
  export type ImportRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * The data used to create many ImportRuns.
     */
    data: ImportRunCreateManyInput | ImportRunCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImportRun update
   */
  export type ImportRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunInclude<ExtArgs> | null
    /**
     * The data needed to update a ImportRun.
     */
    data: XOR<ImportRunUpdateInput, ImportRunUncheckedUpdateInput>
    /**
     * Choose, which ImportRun to update.
     */
    where: ImportRunWhereUniqueInput
  }

  /**
   * ImportRun updateMany
   */
  export type ImportRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImportRuns.
     */
    data: XOR<ImportRunUpdateManyMutationInput, ImportRunUncheckedUpdateManyInput>
    /**
     * Filter which ImportRuns to update
     */
    where?: ImportRunWhereInput
    /**
     * Limit how many ImportRuns to update.
     */
    limit?: number
  }

  /**
   * ImportRun updateManyAndReturn
   */
  export type ImportRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * The data used to update ImportRuns.
     */
    data: XOR<ImportRunUpdateManyMutationInput, ImportRunUncheckedUpdateManyInput>
    /**
     * Filter which ImportRuns to update
     */
    where?: ImportRunWhereInput
    /**
     * Limit how many ImportRuns to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImportRun upsert
   */
  export type ImportRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunInclude<ExtArgs> | null
    /**
     * The filter to search for the ImportRun to update in case it exists.
     */
    where: ImportRunWhereUniqueInput
    /**
     * In case the ImportRun found by the `where` argument doesn't exist, create a new ImportRun with this data.
     */
    create: XOR<ImportRunCreateInput, ImportRunUncheckedCreateInput>
    /**
     * In case the ImportRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImportRunUpdateInput, ImportRunUncheckedUpdateInput>
  }

  /**
   * ImportRun delete
   */
  export type ImportRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunInclude<ExtArgs> | null
    /**
     * Filter which ImportRun to delete.
     */
    where: ImportRunWhereUniqueInput
  }

  /**
   * ImportRun deleteMany
   */
  export type ImportRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportRuns to delete
     */
    where?: ImportRunWhereInput
    /**
     * Limit how many ImportRuns to delete.
     */
    limit?: number
  }

  /**
   * ImportRun.source
   */
  export type ImportRun$sourceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportSource
     */
    select?: ImportSourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportSource
     */
    omit?: ImportSourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportSourceInclude<ExtArgs> | null
    where?: ImportSourceWhereInput
  }

  /**
   * ImportRun.importedBy
   */
  export type ImportRun$importedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ImportRun.rows
   */
  export type ImportRun$rowsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunRow
     */
    select?: ImportRunRowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRunRow
     */
    omit?: ImportRunRowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunRowInclude<ExtArgs> | null
    where?: ImportRunRowWhereInput
    orderBy?: ImportRunRowOrderByWithRelationInput | ImportRunRowOrderByWithRelationInput[]
    cursor?: ImportRunRowWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ImportRunRowScalarFieldEnum | ImportRunRowScalarFieldEnum[]
  }

  /**
   * ImportRun without action
   */
  export type ImportRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRun
     */
    select?: ImportRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRun
     */
    omit?: ImportRunOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunInclude<ExtArgs> | null
  }


  /**
   * Model ImportRunRow
   */

  export type AggregateImportRunRow = {
    _count: ImportRunRowCountAggregateOutputType | null
    _avg: ImportRunRowAvgAggregateOutputType | null
    _sum: ImportRunRowSumAggregateOutputType | null
    _min: ImportRunRowMinAggregateOutputType | null
    _max: ImportRunRowMaxAggregateOutputType | null
  }

  export type ImportRunRowAvgAggregateOutputType = {
    row_number: number | null
  }

  export type ImportRunRowSumAggregateOutputType = {
    row_number: number | null
  }

  export type ImportRunRowMinAggregateOutputType = {
    id: string | null
    import_run_id: string | null
    row_number: number | null
    status: $Enums.ImportRowStatus | null
    reason: string | null
  }

  export type ImportRunRowMaxAggregateOutputType = {
    id: string | null
    import_run_id: string | null
    row_number: number | null
    status: $Enums.ImportRowStatus | null
    reason: string | null
  }

  export type ImportRunRowCountAggregateOutputType = {
    id: number
    import_run_id: number
    row_number: number
    raw_payload: number
    normalized_payload: number
    status: number
    reason: number
    _all: number
  }


  export type ImportRunRowAvgAggregateInputType = {
    row_number?: true
  }

  export type ImportRunRowSumAggregateInputType = {
    row_number?: true
  }

  export type ImportRunRowMinAggregateInputType = {
    id?: true
    import_run_id?: true
    row_number?: true
    status?: true
    reason?: true
  }

  export type ImportRunRowMaxAggregateInputType = {
    id?: true
    import_run_id?: true
    row_number?: true
    status?: true
    reason?: true
  }

  export type ImportRunRowCountAggregateInputType = {
    id?: true
    import_run_id?: true
    row_number?: true
    raw_payload?: true
    normalized_payload?: true
    status?: true
    reason?: true
    _all?: true
  }

  export type ImportRunRowAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportRunRow to aggregate.
     */
    where?: ImportRunRowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportRunRows to fetch.
     */
    orderBy?: ImportRunRowOrderByWithRelationInput | ImportRunRowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ImportRunRowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportRunRows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportRunRows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ImportRunRows
    **/
    _count?: true | ImportRunRowCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ImportRunRowAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ImportRunRowSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ImportRunRowMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ImportRunRowMaxAggregateInputType
  }

  export type GetImportRunRowAggregateType<T extends ImportRunRowAggregateArgs> = {
        [P in keyof T & keyof AggregateImportRunRow]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateImportRunRow[P]>
      : GetScalarType<T[P], AggregateImportRunRow[P]>
  }




  export type ImportRunRowGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ImportRunRowWhereInput
    orderBy?: ImportRunRowOrderByWithAggregationInput | ImportRunRowOrderByWithAggregationInput[]
    by: ImportRunRowScalarFieldEnum[] | ImportRunRowScalarFieldEnum
    having?: ImportRunRowScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ImportRunRowCountAggregateInputType | true
    _avg?: ImportRunRowAvgAggregateInputType
    _sum?: ImportRunRowSumAggregateInputType
    _min?: ImportRunRowMinAggregateInputType
    _max?: ImportRunRowMaxAggregateInputType
  }

  export type ImportRunRowGroupByOutputType = {
    id: string
    import_run_id: string
    row_number: number
    raw_payload: JsonValue
    normalized_payload: JsonValue | null
    status: $Enums.ImportRowStatus
    reason: string | null
    _count: ImportRunRowCountAggregateOutputType | null
    _avg: ImportRunRowAvgAggregateOutputType | null
    _sum: ImportRunRowSumAggregateOutputType | null
    _min: ImportRunRowMinAggregateOutputType | null
    _max: ImportRunRowMaxAggregateOutputType | null
  }

  type GetImportRunRowGroupByPayload<T extends ImportRunRowGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ImportRunRowGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ImportRunRowGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ImportRunRowGroupByOutputType[P]>
            : GetScalarType<T[P], ImportRunRowGroupByOutputType[P]>
        }
      >
    >


  export type ImportRunRowSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    import_run_id?: boolean
    row_number?: boolean
    raw_payload?: boolean
    normalized_payload?: boolean
    status?: boolean
    reason?: boolean
    import_run?: boolean | ImportRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importRunRow"]>

  export type ImportRunRowSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    import_run_id?: boolean
    row_number?: boolean
    raw_payload?: boolean
    normalized_payload?: boolean
    status?: boolean
    reason?: boolean
    import_run?: boolean | ImportRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importRunRow"]>

  export type ImportRunRowSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    import_run_id?: boolean
    row_number?: boolean
    raw_payload?: boolean
    normalized_payload?: boolean
    status?: boolean
    reason?: boolean
    import_run?: boolean | ImportRunDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["importRunRow"]>

  export type ImportRunRowSelectScalar = {
    id?: boolean
    import_run_id?: boolean
    row_number?: boolean
    raw_payload?: boolean
    normalized_payload?: boolean
    status?: boolean
    reason?: boolean
  }

  export type ImportRunRowOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "import_run_id" | "row_number" | "raw_payload" | "normalized_payload" | "status" | "reason", ExtArgs["result"]["importRunRow"]>
  export type ImportRunRowInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    import_run?: boolean | ImportRunDefaultArgs<ExtArgs>
  }
  export type ImportRunRowIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    import_run?: boolean | ImportRunDefaultArgs<ExtArgs>
  }
  export type ImportRunRowIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    import_run?: boolean | ImportRunDefaultArgs<ExtArgs>
  }

  export type $ImportRunRowPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ImportRunRow"
    objects: {
      import_run: Prisma.$ImportRunPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      import_run_id: string
      row_number: number
      raw_payload: Prisma.JsonValue
      normalized_payload: Prisma.JsonValue | null
      status: $Enums.ImportRowStatus
      reason: string | null
    }, ExtArgs["result"]["importRunRow"]>
    composites: {}
  }

  type ImportRunRowGetPayload<S extends boolean | null | undefined | ImportRunRowDefaultArgs> = $Result.GetResult<Prisma.$ImportRunRowPayload, S>

  type ImportRunRowCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ImportRunRowFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ImportRunRowCountAggregateInputType | true
    }

  export interface ImportRunRowDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ImportRunRow'], meta: { name: 'ImportRunRow' } }
    /**
     * Find zero or one ImportRunRow that matches the filter.
     * @param {ImportRunRowFindUniqueArgs} args - Arguments to find a ImportRunRow
     * @example
     * // Get one ImportRunRow
     * const importRunRow = await prisma.importRunRow.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ImportRunRowFindUniqueArgs>(args: SelectSubset<T, ImportRunRowFindUniqueArgs<ExtArgs>>): Prisma__ImportRunRowClient<$Result.GetResult<Prisma.$ImportRunRowPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ImportRunRow that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ImportRunRowFindUniqueOrThrowArgs} args - Arguments to find a ImportRunRow
     * @example
     * // Get one ImportRunRow
     * const importRunRow = await prisma.importRunRow.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ImportRunRowFindUniqueOrThrowArgs>(args: SelectSubset<T, ImportRunRowFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ImportRunRowClient<$Result.GetResult<Prisma.$ImportRunRowPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImportRunRow that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunRowFindFirstArgs} args - Arguments to find a ImportRunRow
     * @example
     * // Get one ImportRunRow
     * const importRunRow = await prisma.importRunRow.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ImportRunRowFindFirstArgs>(args?: SelectSubset<T, ImportRunRowFindFirstArgs<ExtArgs>>): Prisma__ImportRunRowClient<$Result.GetResult<Prisma.$ImportRunRowPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ImportRunRow that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunRowFindFirstOrThrowArgs} args - Arguments to find a ImportRunRow
     * @example
     * // Get one ImportRunRow
     * const importRunRow = await prisma.importRunRow.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ImportRunRowFindFirstOrThrowArgs>(args?: SelectSubset<T, ImportRunRowFindFirstOrThrowArgs<ExtArgs>>): Prisma__ImportRunRowClient<$Result.GetResult<Prisma.$ImportRunRowPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ImportRunRows that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunRowFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ImportRunRows
     * const importRunRows = await prisma.importRunRow.findMany()
     * 
     * // Get first 10 ImportRunRows
     * const importRunRows = await prisma.importRunRow.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const importRunRowWithIdOnly = await prisma.importRunRow.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ImportRunRowFindManyArgs>(args?: SelectSubset<T, ImportRunRowFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportRunRowPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ImportRunRow.
     * @param {ImportRunRowCreateArgs} args - Arguments to create a ImportRunRow.
     * @example
     * // Create one ImportRunRow
     * const ImportRunRow = await prisma.importRunRow.create({
     *   data: {
     *     // ... data to create a ImportRunRow
     *   }
     * })
     * 
     */
    create<T extends ImportRunRowCreateArgs>(args: SelectSubset<T, ImportRunRowCreateArgs<ExtArgs>>): Prisma__ImportRunRowClient<$Result.GetResult<Prisma.$ImportRunRowPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ImportRunRows.
     * @param {ImportRunRowCreateManyArgs} args - Arguments to create many ImportRunRows.
     * @example
     * // Create many ImportRunRows
     * const importRunRow = await prisma.importRunRow.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ImportRunRowCreateManyArgs>(args?: SelectSubset<T, ImportRunRowCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ImportRunRows and returns the data saved in the database.
     * @param {ImportRunRowCreateManyAndReturnArgs} args - Arguments to create many ImportRunRows.
     * @example
     * // Create many ImportRunRows
     * const importRunRow = await prisma.importRunRow.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ImportRunRows and only return the `id`
     * const importRunRowWithIdOnly = await prisma.importRunRow.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ImportRunRowCreateManyAndReturnArgs>(args?: SelectSubset<T, ImportRunRowCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportRunRowPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ImportRunRow.
     * @param {ImportRunRowDeleteArgs} args - Arguments to delete one ImportRunRow.
     * @example
     * // Delete one ImportRunRow
     * const ImportRunRow = await prisma.importRunRow.delete({
     *   where: {
     *     // ... filter to delete one ImportRunRow
     *   }
     * })
     * 
     */
    delete<T extends ImportRunRowDeleteArgs>(args: SelectSubset<T, ImportRunRowDeleteArgs<ExtArgs>>): Prisma__ImportRunRowClient<$Result.GetResult<Prisma.$ImportRunRowPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ImportRunRow.
     * @param {ImportRunRowUpdateArgs} args - Arguments to update one ImportRunRow.
     * @example
     * // Update one ImportRunRow
     * const importRunRow = await prisma.importRunRow.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ImportRunRowUpdateArgs>(args: SelectSubset<T, ImportRunRowUpdateArgs<ExtArgs>>): Prisma__ImportRunRowClient<$Result.GetResult<Prisma.$ImportRunRowPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ImportRunRows.
     * @param {ImportRunRowDeleteManyArgs} args - Arguments to filter ImportRunRows to delete.
     * @example
     * // Delete a few ImportRunRows
     * const { count } = await prisma.importRunRow.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ImportRunRowDeleteManyArgs>(args?: SelectSubset<T, ImportRunRowDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImportRunRows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunRowUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ImportRunRows
     * const importRunRow = await prisma.importRunRow.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ImportRunRowUpdateManyArgs>(args: SelectSubset<T, ImportRunRowUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ImportRunRows and returns the data updated in the database.
     * @param {ImportRunRowUpdateManyAndReturnArgs} args - Arguments to update many ImportRunRows.
     * @example
     * // Update many ImportRunRows
     * const importRunRow = await prisma.importRunRow.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ImportRunRows and only return the `id`
     * const importRunRowWithIdOnly = await prisma.importRunRow.updateManyAndReturn({
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
    updateManyAndReturn<T extends ImportRunRowUpdateManyAndReturnArgs>(args: SelectSubset<T, ImportRunRowUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ImportRunRowPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ImportRunRow.
     * @param {ImportRunRowUpsertArgs} args - Arguments to update or create a ImportRunRow.
     * @example
     * // Update or create a ImportRunRow
     * const importRunRow = await prisma.importRunRow.upsert({
     *   create: {
     *     // ... data to create a ImportRunRow
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ImportRunRow we want to update
     *   }
     * })
     */
    upsert<T extends ImportRunRowUpsertArgs>(args: SelectSubset<T, ImportRunRowUpsertArgs<ExtArgs>>): Prisma__ImportRunRowClient<$Result.GetResult<Prisma.$ImportRunRowPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ImportRunRows.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunRowCountArgs} args - Arguments to filter ImportRunRows to count.
     * @example
     * // Count the number of ImportRunRows
     * const count = await prisma.importRunRow.count({
     *   where: {
     *     // ... the filter for the ImportRunRows we want to count
     *   }
     * })
    **/
    count<T extends ImportRunRowCountArgs>(
      args?: Subset<T, ImportRunRowCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ImportRunRowCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ImportRunRow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunRowAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ImportRunRowAggregateArgs>(args: Subset<T, ImportRunRowAggregateArgs>): Prisma.PrismaPromise<GetImportRunRowAggregateType<T>>

    /**
     * Group by ImportRunRow.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ImportRunRowGroupByArgs} args - Group by arguments.
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
      T extends ImportRunRowGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ImportRunRowGroupByArgs['orderBy'] }
        : { orderBy?: ImportRunRowGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ImportRunRowGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetImportRunRowGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ImportRunRow model
   */
  readonly fields: ImportRunRowFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ImportRunRow.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ImportRunRowClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    import_run<T extends ImportRunDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ImportRunDefaultArgs<ExtArgs>>): Prisma__ImportRunClient<$Result.GetResult<Prisma.$ImportRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the ImportRunRow model
   */
  interface ImportRunRowFieldRefs {
    readonly id: FieldRef<"ImportRunRow", 'String'>
    readonly import_run_id: FieldRef<"ImportRunRow", 'String'>
    readonly row_number: FieldRef<"ImportRunRow", 'Int'>
    readonly raw_payload: FieldRef<"ImportRunRow", 'Json'>
    readonly normalized_payload: FieldRef<"ImportRunRow", 'Json'>
    readonly status: FieldRef<"ImportRunRow", 'ImportRowStatus'>
    readonly reason: FieldRef<"ImportRunRow", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ImportRunRow findUnique
   */
  export type ImportRunRowFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunRow
     */
    select?: ImportRunRowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRunRow
     */
    omit?: ImportRunRowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunRowInclude<ExtArgs> | null
    /**
     * Filter, which ImportRunRow to fetch.
     */
    where: ImportRunRowWhereUniqueInput
  }

  /**
   * ImportRunRow findUniqueOrThrow
   */
  export type ImportRunRowFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunRow
     */
    select?: ImportRunRowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRunRow
     */
    omit?: ImportRunRowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunRowInclude<ExtArgs> | null
    /**
     * Filter, which ImportRunRow to fetch.
     */
    where: ImportRunRowWhereUniqueInput
  }

  /**
   * ImportRunRow findFirst
   */
  export type ImportRunRowFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunRow
     */
    select?: ImportRunRowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRunRow
     */
    omit?: ImportRunRowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunRowInclude<ExtArgs> | null
    /**
     * Filter, which ImportRunRow to fetch.
     */
    where?: ImportRunRowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportRunRows to fetch.
     */
    orderBy?: ImportRunRowOrderByWithRelationInput | ImportRunRowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportRunRows.
     */
    cursor?: ImportRunRowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportRunRows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportRunRows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportRunRows.
     */
    distinct?: ImportRunRowScalarFieldEnum | ImportRunRowScalarFieldEnum[]
  }

  /**
   * ImportRunRow findFirstOrThrow
   */
  export type ImportRunRowFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunRow
     */
    select?: ImportRunRowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRunRow
     */
    omit?: ImportRunRowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunRowInclude<ExtArgs> | null
    /**
     * Filter, which ImportRunRow to fetch.
     */
    where?: ImportRunRowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportRunRows to fetch.
     */
    orderBy?: ImportRunRowOrderByWithRelationInput | ImportRunRowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ImportRunRows.
     */
    cursor?: ImportRunRowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportRunRows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportRunRows.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ImportRunRows.
     */
    distinct?: ImportRunRowScalarFieldEnum | ImportRunRowScalarFieldEnum[]
  }

  /**
   * ImportRunRow findMany
   */
  export type ImportRunRowFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunRow
     */
    select?: ImportRunRowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRunRow
     */
    omit?: ImportRunRowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunRowInclude<ExtArgs> | null
    /**
     * Filter, which ImportRunRows to fetch.
     */
    where?: ImportRunRowWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ImportRunRows to fetch.
     */
    orderBy?: ImportRunRowOrderByWithRelationInput | ImportRunRowOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ImportRunRows.
     */
    cursor?: ImportRunRowWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ImportRunRows from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ImportRunRows.
     */
    skip?: number
    distinct?: ImportRunRowScalarFieldEnum | ImportRunRowScalarFieldEnum[]
  }

  /**
   * ImportRunRow create
   */
  export type ImportRunRowCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunRow
     */
    select?: ImportRunRowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRunRow
     */
    omit?: ImportRunRowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunRowInclude<ExtArgs> | null
    /**
     * The data needed to create a ImportRunRow.
     */
    data: XOR<ImportRunRowCreateInput, ImportRunRowUncheckedCreateInput>
  }

  /**
   * ImportRunRow createMany
   */
  export type ImportRunRowCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ImportRunRows.
     */
    data: ImportRunRowCreateManyInput | ImportRunRowCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ImportRunRow createManyAndReturn
   */
  export type ImportRunRowCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunRow
     */
    select?: ImportRunRowSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRunRow
     */
    omit?: ImportRunRowOmit<ExtArgs> | null
    /**
     * The data used to create many ImportRunRows.
     */
    data: ImportRunRowCreateManyInput | ImportRunRowCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunRowIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImportRunRow update
   */
  export type ImportRunRowUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunRow
     */
    select?: ImportRunRowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRunRow
     */
    omit?: ImportRunRowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunRowInclude<ExtArgs> | null
    /**
     * The data needed to update a ImportRunRow.
     */
    data: XOR<ImportRunRowUpdateInput, ImportRunRowUncheckedUpdateInput>
    /**
     * Choose, which ImportRunRow to update.
     */
    where: ImportRunRowWhereUniqueInput
  }

  /**
   * ImportRunRow updateMany
   */
  export type ImportRunRowUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ImportRunRows.
     */
    data: XOR<ImportRunRowUpdateManyMutationInput, ImportRunRowUncheckedUpdateManyInput>
    /**
     * Filter which ImportRunRows to update
     */
    where?: ImportRunRowWhereInput
    /**
     * Limit how many ImportRunRows to update.
     */
    limit?: number
  }

  /**
   * ImportRunRow updateManyAndReturn
   */
  export type ImportRunRowUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunRow
     */
    select?: ImportRunRowSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRunRow
     */
    omit?: ImportRunRowOmit<ExtArgs> | null
    /**
     * The data used to update ImportRunRows.
     */
    data: XOR<ImportRunRowUpdateManyMutationInput, ImportRunRowUncheckedUpdateManyInput>
    /**
     * Filter which ImportRunRows to update
     */
    where?: ImportRunRowWhereInput
    /**
     * Limit how many ImportRunRows to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunRowIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ImportRunRow upsert
   */
  export type ImportRunRowUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunRow
     */
    select?: ImportRunRowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRunRow
     */
    omit?: ImportRunRowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunRowInclude<ExtArgs> | null
    /**
     * The filter to search for the ImportRunRow to update in case it exists.
     */
    where: ImportRunRowWhereUniqueInput
    /**
     * In case the ImportRunRow found by the `where` argument doesn't exist, create a new ImportRunRow with this data.
     */
    create: XOR<ImportRunRowCreateInput, ImportRunRowUncheckedCreateInput>
    /**
     * In case the ImportRunRow was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ImportRunRowUpdateInput, ImportRunRowUncheckedUpdateInput>
  }

  /**
   * ImportRunRow delete
   */
  export type ImportRunRowDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunRow
     */
    select?: ImportRunRowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRunRow
     */
    omit?: ImportRunRowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunRowInclude<ExtArgs> | null
    /**
     * Filter which ImportRunRow to delete.
     */
    where: ImportRunRowWhereUniqueInput
  }

  /**
   * ImportRunRow deleteMany
   */
  export type ImportRunRowDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ImportRunRows to delete
     */
    where?: ImportRunRowWhereInput
    /**
     * Limit how many ImportRunRows to delete.
     */
    limit?: number
  }

  /**
   * ImportRunRow without action
   */
  export type ImportRunRowDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ImportRunRow
     */
    select?: ImportRunRowSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ImportRunRow
     */
    omit?: ImportRunRowOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ImportRunRowInclude<ExtArgs> | null
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


  export const CompanyScalarFieldEnum: {
    id: 'id',
    name: 'name',
    logo_url: 'logo_url',
    created_at: 'created_at'
  };

  export type CompanyScalarFieldEnum = (typeof CompanyScalarFieldEnum)[keyof typeof CompanyScalarFieldEnum]


  export const ProductiveUnitScalarFieldEnum: {
    id: 'id',
    company_id: 'company_id',
    name: 'name',
    created_at: 'created_at'
  };

  export type ProductiveUnitScalarFieldEnum = (typeof ProductiveUnitScalarFieldEnum)[keyof typeof ProductiveUnitScalarFieldEnum]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    password_hash: 'password_hash',
    full_name: 'full_name',
    avatar_url: 'avatar_url',
    role: 'role',
    company_id: 'company_id',
    productive_unit_id: 'productive_unit_id',
    level: 'level',
    xp: 'xp',
    email_verified: 'email_verified',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const AuthSessionScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    created_at: 'created_at',
    expires_at: 'expires_at',
    revoked_at: 'revoked_at'
  };

  export type AuthSessionScalarFieldEnum = (typeof AuthSessionScalarFieldEnum)[keyof typeof AuthSessionScalarFieldEnum]


  export const BadgeScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    category: 'category',
    icon_name: 'icon_name',
    image_url: 'image_url',
    points: 'points',
    created_at: 'created_at'
  };

  export type BadgeScalarFieldEnum = (typeof BadgeScalarFieldEnum)[keyof typeof BadgeScalarFieldEnum]


  export const BadgeLegendSettingScalarFieldEnum: {
    id: 'id',
    bronze: 'bronze',
    silver: 'silver',
    gold: 'gold',
    loss_1: 'loss_1',
    loss_2: 'loss_2',
    updated_by: 'updated_by',
    updated_at: 'updated_at'
  };

  export type BadgeLegendSettingScalarFieldEnum = (typeof BadgeLegendSettingScalarFieldEnum)[keyof typeof BadgeLegendSettingScalarFieldEnum]


  export const UserBadgeScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    badge_id: 'badge_id',
    awarded_at: 'awarded_at',
    awarded_by: 'awarded_by',
    tone: 'tone'
  };

  export type UserBadgeScalarFieldEnum = (typeof UserBadgeScalarFieldEnum)[keyof typeof UserBadgeScalarFieldEnum]


  export const BadgeSubmissionScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    badge_id: 'badge_id',
    proof_url: 'proof_url',
    description: 'description',
    status: 'status',
    submitted_at: 'submitted_at',
    reviewed_by: 'reviewed_by',
    reviewed_at: 'reviewed_at',
    feedback: 'feedback'
  };

  export type BadgeSubmissionScalarFieldEnum = (typeof BadgeSubmissionScalarFieldEnum)[keyof typeof BadgeSubmissionScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    user_id: 'user_id',
    title: 'title',
    message: 'message',
    sent_at: 'sent_at',
    read: 'read'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const ImportSourceScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    company_column: 'company_column',
    productive_unit_column: 'productive_unit_column',
    user_column: 'user_column',
    badge_column: 'badge_column',
    tone_column: 'tone_column',
    award_column: 'award_column',
    created_at: 'created_at',
    archived_at: 'archived_at'
  };

  export type ImportSourceScalarFieldEnum = (typeof ImportSourceScalarFieldEnum)[keyof typeof ImportSourceScalarFieldEnum]


  export const ImportRunScalarFieldEnum: {
    id: 'id',
    source_id: 'source_id',
    source_name: 'source_name',
    imported_by: 'imported_by',
    imported_at: 'imported_at',
    status: 'status',
    matched_columns: 'matched_columns',
    summary: 'summary'
  };

  export type ImportRunScalarFieldEnum = (typeof ImportRunScalarFieldEnum)[keyof typeof ImportRunScalarFieldEnum]


  export const ImportRunRowScalarFieldEnum: {
    id: 'id',
    import_run_id: 'import_run_id',
    row_number: 'row_number',
    raw_payload: 'raw_payload',
    normalized_payload: 'normalized_payload',
    status: 'status',
    reason: 'reason'
  };

  export type ImportRunRowScalarFieldEnum = (typeof ImportRunRowScalarFieldEnum)[keyof typeof ImportRunRowScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


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
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Role[]'
   */
  export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'BadgeTone'
   */
  export type EnumBadgeToneFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BadgeTone'>
    


  /**
   * Reference to a field of type 'BadgeTone[]'
   */
  export type ListEnumBadgeToneFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BadgeTone[]'>
    


  /**
   * Reference to a field of type 'SubmissionStatus'
   */
  export type EnumSubmissionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubmissionStatus'>
    


  /**
   * Reference to a field of type 'SubmissionStatus[]'
   */
  export type ListEnumSubmissionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubmissionStatus[]'>
    


  /**
   * Reference to a field of type 'ImportRunStatus'
   */
  export type EnumImportRunStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ImportRunStatus'>
    


  /**
   * Reference to a field of type 'ImportRunStatus[]'
   */
  export type ListEnumImportRunStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ImportRunStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'ImportRowStatus'
   */
  export type EnumImportRowStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ImportRowStatus'>
    


  /**
   * Reference to a field of type 'ImportRowStatus[]'
   */
  export type ListEnumImportRowStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ImportRowStatus[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type CompanyWhereInput = {
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    id?: StringFilter<"Company"> | string
    name?: StringFilter<"Company"> | string
    logo_url?: StringNullableFilter<"Company"> | string | null
    created_at?: DateTimeFilter<"Company"> | Date | string
    productive_units?: ProductiveUnitListRelationFilter
    users?: UserListRelationFilter
  }

  export type CompanyOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    logo_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    productive_units?: ProductiveUnitOrderByRelationAggregateInput
    users?: UserOrderByRelationAggregateInput
  }

  export type CompanyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: CompanyWhereInput | CompanyWhereInput[]
    OR?: CompanyWhereInput[]
    NOT?: CompanyWhereInput | CompanyWhereInput[]
    logo_url?: StringNullableFilter<"Company"> | string | null
    created_at?: DateTimeFilter<"Company"> | Date | string
    productive_units?: ProductiveUnitListRelationFilter
    users?: UserListRelationFilter
  }, "id" | "name">

  export type CompanyOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    logo_url?: SortOrderInput | SortOrder
    created_at?: SortOrder
    _count?: CompanyCountOrderByAggregateInput
    _max?: CompanyMaxOrderByAggregateInput
    _min?: CompanyMinOrderByAggregateInput
  }

  export type CompanyScalarWhereWithAggregatesInput = {
    AND?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    OR?: CompanyScalarWhereWithAggregatesInput[]
    NOT?: CompanyScalarWhereWithAggregatesInput | CompanyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Company"> | string
    name?: StringWithAggregatesFilter<"Company"> | string
    logo_url?: StringNullableWithAggregatesFilter<"Company"> | string | null
    created_at?: DateTimeWithAggregatesFilter<"Company"> | Date | string
  }

  export type ProductiveUnitWhereInput = {
    AND?: ProductiveUnitWhereInput | ProductiveUnitWhereInput[]
    OR?: ProductiveUnitWhereInput[]
    NOT?: ProductiveUnitWhereInput | ProductiveUnitWhereInput[]
    id?: StringFilter<"ProductiveUnit"> | string
    company_id?: StringFilter<"ProductiveUnit"> | string
    name?: StringFilter<"ProductiveUnit"> | string
    created_at?: DateTimeFilter<"ProductiveUnit"> | Date | string
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    users?: UserListRelationFilter
  }

  export type ProductiveUnitOrderByWithRelationInput = {
    id?: SortOrder
    company_id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    company?: CompanyOrderByWithRelationInput
    users?: UserOrderByRelationAggregateInput
  }

  export type ProductiveUnitWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    company_id_name?: ProductiveUnitCompany_idNameCompoundUniqueInput
    AND?: ProductiveUnitWhereInput | ProductiveUnitWhereInput[]
    OR?: ProductiveUnitWhereInput[]
    NOT?: ProductiveUnitWhereInput | ProductiveUnitWhereInput[]
    company_id?: StringFilter<"ProductiveUnit"> | string
    name?: StringFilter<"ProductiveUnit"> | string
    created_at?: DateTimeFilter<"ProductiveUnit"> | Date | string
    company?: XOR<CompanyScalarRelationFilter, CompanyWhereInput>
    users?: UserListRelationFilter
  }, "id" | "company_id_name">

  export type ProductiveUnitOrderByWithAggregationInput = {
    id?: SortOrder
    company_id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
    _count?: ProductiveUnitCountOrderByAggregateInput
    _max?: ProductiveUnitMaxOrderByAggregateInput
    _min?: ProductiveUnitMinOrderByAggregateInput
  }

  export type ProductiveUnitScalarWhereWithAggregatesInput = {
    AND?: ProductiveUnitScalarWhereWithAggregatesInput | ProductiveUnitScalarWhereWithAggregatesInput[]
    OR?: ProductiveUnitScalarWhereWithAggregatesInput[]
    NOT?: ProductiveUnitScalarWhereWithAggregatesInput | ProductiveUnitScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ProductiveUnit"> | string
    company_id?: StringWithAggregatesFilter<"ProductiveUnit"> | string
    name?: StringWithAggregatesFilter<"ProductiveUnit"> | string
    created_at?: DateTimeWithAggregatesFilter<"ProductiveUnit"> | Date | string
  }

  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password_hash?: StringFilter<"User"> | string
    full_name?: StringFilter<"User"> | string
    avatar_url?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    company_id?: StringNullableFilter<"User"> | string | null
    productive_unit_id?: StringNullableFilter<"User"> | string | null
    level?: IntFilter<"User"> | number
    xp?: IntFilter<"User"> | number
    email_verified?: BoolFilter<"User"> | boolean
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    company?: XOR<CompanyNullableScalarRelationFilter, CompanyWhereInput> | null
    productive_unit?: XOR<ProductiveUnitNullableScalarRelationFilter, ProductiveUnitWhereInput> | null
    sessions?: AuthSessionListRelationFilter
    user_badges?: UserBadgeListRelationFilter
    awarded_badges?: UserBadgeListRelationFilter
    submissions?: BadgeSubmissionListRelationFilter
    reviewed_submissions?: BadgeSubmissionListRelationFilter
    notifications?: NotificationListRelationFilter
    badge_legend_settings?: BadgeLegendSettingListRelationFilter
    import_runs?: ImportRunListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrderInput | SortOrder
    role?: SortOrder
    company_id?: SortOrderInput | SortOrder
    productive_unit_id?: SortOrderInput | SortOrder
    level?: SortOrder
    xp?: SortOrder
    email_verified?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    company?: CompanyOrderByWithRelationInput
    productive_unit?: ProductiveUnitOrderByWithRelationInput
    sessions?: AuthSessionOrderByRelationAggregateInput
    user_badges?: UserBadgeOrderByRelationAggregateInput
    awarded_badges?: UserBadgeOrderByRelationAggregateInput
    submissions?: BadgeSubmissionOrderByRelationAggregateInput
    reviewed_submissions?: BadgeSubmissionOrderByRelationAggregateInput
    notifications?: NotificationOrderByRelationAggregateInput
    badge_legend_settings?: BadgeLegendSettingOrderByRelationAggregateInput
    import_runs?: ImportRunOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password_hash?: StringFilter<"User"> | string
    full_name?: StringFilter<"User"> | string
    avatar_url?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    company_id?: StringNullableFilter<"User"> | string | null
    productive_unit_id?: StringNullableFilter<"User"> | string | null
    level?: IntFilter<"User"> | number
    xp?: IntFilter<"User"> | number
    email_verified?: BoolFilter<"User"> | boolean
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
    company?: XOR<CompanyNullableScalarRelationFilter, CompanyWhereInput> | null
    productive_unit?: XOR<ProductiveUnitNullableScalarRelationFilter, ProductiveUnitWhereInput> | null
    sessions?: AuthSessionListRelationFilter
    user_badges?: UserBadgeListRelationFilter
    awarded_badges?: UserBadgeListRelationFilter
    submissions?: BadgeSubmissionListRelationFilter
    reviewed_submissions?: BadgeSubmissionListRelationFilter
    notifications?: NotificationListRelationFilter
    badge_legend_settings?: BadgeLegendSettingListRelationFilter
    import_runs?: ImportRunListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrderInput | SortOrder
    role?: SortOrder
    company_id?: SortOrderInput | SortOrder
    productive_unit_id?: SortOrderInput | SortOrder
    level?: SortOrder
    xp?: SortOrder
    email_verified?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    password_hash?: StringWithAggregatesFilter<"User"> | string
    full_name?: StringWithAggregatesFilter<"User"> | string
    avatar_url?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    company_id?: StringNullableWithAggregatesFilter<"User"> | string | null
    productive_unit_id?: StringNullableWithAggregatesFilter<"User"> | string | null
    level?: IntWithAggregatesFilter<"User"> | number
    xp?: IntWithAggregatesFilter<"User"> | number
    email_verified?: BoolWithAggregatesFilter<"User"> | boolean
    created_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type AuthSessionWhereInput = {
    AND?: AuthSessionWhereInput | AuthSessionWhereInput[]
    OR?: AuthSessionWhereInput[]
    NOT?: AuthSessionWhereInput | AuthSessionWhereInput[]
    id?: UuidFilter<"AuthSession"> | string
    user_id?: UuidFilter<"AuthSession"> | string
    created_at?: DateTimeFilter<"AuthSession"> | Date | string
    expires_at?: DateTimeFilter<"AuthSession"> | Date | string
    revoked_at?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type AuthSessionOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    revoked_at?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AuthSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuthSessionWhereInput | AuthSessionWhereInput[]
    OR?: AuthSessionWhereInput[]
    NOT?: AuthSessionWhereInput | AuthSessionWhereInput[]
    user_id?: UuidFilter<"AuthSession"> | string
    created_at?: DateTimeFilter<"AuthSession"> | Date | string
    expires_at?: DateTimeFilter<"AuthSession"> | Date | string
    revoked_at?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type AuthSessionOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    revoked_at?: SortOrderInput | SortOrder
    _count?: AuthSessionCountOrderByAggregateInput
    _max?: AuthSessionMaxOrderByAggregateInput
    _min?: AuthSessionMinOrderByAggregateInput
  }

  export type AuthSessionScalarWhereWithAggregatesInput = {
    AND?: AuthSessionScalarWhereWithAggregatesInput | AuthSessionScalarWhereWithAggregatesInput[]
    OR?: AuthSessionScalarWhereWithAggregatesInput[]
    NOT?: AuthSessionScalarWhereWithAggregatesInput | AuthSessionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"AuthSession"> | string
    user_id?: UuidWithAggregatesFilter<"AuthSession"> | string
    created_at?: DateTimeWithAggregatesFilter<"AuthSession"> | Date | string
    expires_at?: DateTimeWithAggregatesFilter<"AuthSession"> | Date | string
    revoked_at?: DateTimeNullableWithAggregatesFilter<"AuthSession"> | Date | string | null
  }

  export type BadgeWhereInput = {
    AND?: BadgeWhereInput | BadgeWhereInput[]
    OR?: BadgeWhereInput[]
    NOT?: BadgeWhereInput | BadgeWhereInput[]
    id?: StringFilter<"Badge"> | string
    name?: StringFilter<"Badge"> | string
    description?: StringFilter<"Badge"> | string
    category?: StringFilter<"Badge"> | string
    icon_name?: StringFilter<"Badge"> | string
    image_url?: StringNullableFilter<"Badge"> | string | null
    points?: IntFilter<"Badge"> | number
    created_at?: DateTimeFilter<"Badge"> | Date | string
    user_badges?: UserBadgeListRelationFilter
    submissions?: BadgeSubmissionListRelationFilter
  }

  export type BadgeOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    icon_name?: SortOrder
    image_url?: SortOrderInput | SortOrder
    points?: SortOrder
    created_at?: SortOrder
    user_badges?: UserBadgeOrderByRelationAggregateInput
    submissions?: BadgeSubmissionOrderByRelationAggregateInput
  }

  export type BadgeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: BadgeWhereInput | BadgeWhereInput[]
    OR?: BadgeWhereInput[]
    NOT?: BadgeWhereInput | BadgeWhereInput[]
    description?: StringFilter<"Badge"> | string
    category?: StringFilter<"Badge"> | string
    icon_name?: StringFilter<"Badge"> | string
    image_url?: StringNullableFilter<"Badge"> | string | null
    points?: IntFilter<"Badge"> | number
    created_at?: DateTimeFilter<"Badge"> | Date | string
    user_badges?: UserBadgeListRelationFilter
    submissions?: BadgeSubmissionListRelationFilter
  }, "id" | "name">

  export type BadgeOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    icon_name?: SortOrder
    image_url?: SortOrderInput | SortOrder
    points?: SortOrder
    created_at?: SortOrder
    _count?: BadgeCountOrderByAggregateInput
    _avg?: BadgeAvgOrderByAggregateInput
    _max?: BadgeMaxOrderByAggregateInput
    _min?: BadgeMinOrderByAggregateInput
    _sum?: BadgeSumOrderByAggregateInput
  }

  export type BadgeScalarWhereWithAggregatesInput = {
    AND?: BadgeScalarWhereWithAggregatesInput | BadgeScalarWhereWithAggregatesInput[]
    OR?: BadgeScalarWhereWithAggregatesInput[]
    NOT?: BadgeScalarWhereWithAggregatesInput | BadgeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Badge"> | string
    name?: StringWithAggregatesFilter<"Badge"> | string
    description?: StringWithAggregatesFilter<"Badge"> | string
    category?: StringWithAggregatesFilter<"Badge"> | string
    icon_name?: StringWithAggregatesFilter<"Badge"> | string
    image_url?: StringNullableWithAggregatesFilter<"Badge"> | string | null
    points?: IntWithAggregatesFilter<"Badge"> | number
    created_at?: DateTimeWithAggregatesFilter<"Badge"> | Date | string
  }

  export type BadgeLegendSettingWhereInput = {
    AND?: BadgeLegendSettingWhereInput | BadgeLegendSettingWhereInput[]
    OR?: BadgeLegendSettingWhereInput[]
    NOT?: BadgeLegendSettingWhereInput | BadgeLegendSettingWhereInput[]
    id?: UuidFilter<"BadgeLegendSetting"> | string
    bronze?: StringFilter<"BadgeLegendSetting"> | string
    silver?: StringFilter<"BadgeLegendSetting"> | string
    gold?: StringFilter<"BadgeLegendSetting"> | string
    loss_1?: StringFilter<"BadgeLegendSetting"> | string
    loss_2?: StringFilter<"BadgeLegendSetting"> | string
    updated_by?: UuidNullableFilter<"BadgeLegendSetting"> | string | null
    updated_at?: DateTimeFilter<"BadgeLegendSetting"> | Date | string
    updatedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type BadgeLegendSettingOrderByWithRelationInput = {
    id?: SortOrder
    bronze?: SortOrder
    silver?: SortOrder
    gold?: SortOrder
    loss_1?: SortOrder
    loss_2?: SortOrder
    updated_by?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    updatedBy?: UserOrderByWithRelationInput
  }

  export type BadgeLegendSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BadgeLegendSettingWhereInput | BadgeLegendSettingWhereInput[]
    OR?: BadgeLegendSettingWhereInput[]
    NOT?: BadgeLegendSettingWhereInput | BadgeLegendSettingWhereInput[]
    bronze?: StringFilter<"BadgeLegendSetting"> | string
    silver?: StringFilter<"BadgeLegendSetting"> | string
    gold?: StringFilter<"BadgeLegendSetting"> | string
    loss_1?: StringFilter<"BadgeLegendSetting"> | string
    loss_2?: StringFilter<"BadgeLegendSetting"> | string
    updated_by?: UuidNullableFilter<"BadgeLegendSetting"> | string | null
    updated_at?: DateTimeFilter<"BadgeLegendSetting"> | Date | string
    updatedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type BadgeLegendSettingOrderByWithAggregationInput = {
    id?: SortOrder
    bronze?: SortOrder
    silver?: SortOrder
    gold?: SortOrder
    loss_1?: SortOrder
    loss_2?: SortOrder
    updated_by?: SortOrderInput | SortOrder
    updated_at?: SortOrder
    _count?: BadgeLegendSettingCountOrderByAggregateInput
    _max?: BadgeLegendSettingMaxOrderByAggregateInput
    _min?: BadgeLegendSettingMinOrderByAggregateInput
  }

  export type BadgeLegendSettingScalarWhereWithAggregatesInput = {
    AND?: BadgeLegendSettingScalarWhereWithAggregatesInput | BadgeLegendSettingScalarWhereWithAggregatesInput[]
    OR?: BadgeLegendSettingScalarWhereWithAggregatesInput[]
    NOT?: BadgeLegendSettingScalarWhereWithAggregatesInput | BadgeLegendSettingScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"BadgeLegendSetting"> | string
    bronze?: StringWithAggregatesFilter<"BadgeLegendSetting"> | string
    silver?: StringWithAggregatesFilter<"BadgeLegendSetting"> | string
    gold?: StringWithAggregatesFilter<"BadgeLegendSetting"> | string
    loss_1?: StringWithAggregatesFilter<"BadgeLegendSetting"> | string
    loss_2?: StringWithAggregatesFilter<"BadgeLegendSetting"> | string
    updated_by?: UuidNullableWithAggregatesFilter<"BadgeLegendSetting"> | string | null
    updated_at?: DateTimeWithAggregatesFilter<"BadgeLegendSetting"> | Date | string
  }

  export type UserBadgeWhereInput = {
    AND?: UserBadgeWhereInput | UserBadgeWhereInput[]
    OR?: UserBadgeWhereInput[]
    NOT?: UserBadgeWhereInput | UserBadgeWhereInput[]
    id?: UuidFilter<"UserBadge"> | string
    user_id?: UuidFilter<"UserBadge"> | string
    badge_id?: StringFilter<"UserBadge"> | string
    awarded_at?: DateTimeFilter<"UserBadge"> | Date | string
    awarded_by?: UuidNullableFilter<"UserBadge"> | string | null
    tone?: EnumBadgeToneFilter<"UserBadge"> | $Enums.BadgeTone
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    badge?: XOR<BadgeScalarRelationFilter, BadgeWhereInput>
    awardedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type UserBadgeOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    badge_id?: SortOrder
    awarded_at?: SortOrder
    awarded_by?: SortOrderInput | SortOrder
    tone?: SortOrder
    user?: UserOrderByWithRelationInput
    badge?: BadgeOrderByWithRelationInput
    awardedBy?: UserOrderByWithRelationInput
  }

  export type UserBadgeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserBadgeWhereInput | UserBadgeWhereInput[]
    OR?: UserBadgeWhereInput[]
    NOT?: UserBadgeWhereInput | UserBadgeWhereInput[]
    user_id?: UuidFilter<"UserBadge"> | string
    badge_id?: StringFilter<"UserBadge"> | string
    awarded_at?: DateTimeFilter<"UserBadge"> | Date | string
    awarded_by?: UuidNullableFilter<"UserBadge"> | string | null
    tone?: EnumBadgeToneFilter<"UserBadge"> | $Enums.BadgeTone
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    badge?: XOR<BadgeScalarRelationFilter, BadgeWhereInput>
    awardedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type UserBadgeOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    badge_id?: SortOrder
    awarded_at?: SortOrder
    awarded_by?: SortOrderInput | SortOrder
    tone?: SortOrder
    _count?: UserBadgeCountOrderByAggregateInput
    _max?: UserBadgeMaxOrderByAggregateInput
    _min?: UserBadgeMinOrderByAggregateInput
  }

  export type UserBadgeScalarWhereWithAggregatesInput = {
    AND?: UserBadgeScalarWhereWithAggregatesInput | UserBadgeScalarWhereWithAggregatesInput[]
    OR?: UserBadgeScalarWhereWithAggregatesInput[]
    NOT?: UserBadgeScalarWhereWithAggregatesInput | UserBadgeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"UserBadge"> | string
    user_id?: UuidWithAggregatesFilter<"UserBadge"> | string
    badge_id?: StringWithAggregatesFilter<"UserBadge"> | string
    awarded_at?: DateTimeWithAggregatesFilter<"UserBadge"> | Date | string
    awarded_by?: UuidNullableWithAggregatesFilter<"UserBadge"> | string | null
    tone?: EnumBadgeToneWithAggregatesFilter<"UserBadge"> | $Enums.BadgeTone
  }

  export type BadgeSubmissionWhereInput = {
    AND?: BadgeSubmissionWhereInput | BadgeSubmissionWhereInput[]
    OR?: BadgeSubmissionWhereInput[]
    NOT?: BadgeSubmissionWhereInput | BadgeSubmissionWhereInput[]
    id?: UuidFilter<"BadgeSubmission"> | string
    user_id?: UuidFilter<"BadgeSubmission"> | string
    badge_id?: StringFilter<"BadgeSubmission"> | string
    proof_url?: StringNullableFilter<"BadgeSubmission"> | string | null
    description?: StringNullableFilter<"BadgeSubmission"> | string | null
    status?: EnumSubmissionStatusFilter<"BadgeSubmission"> | $Enums.SubmissionStatus
    submitted_at?: DateTimeFilter<"BadgeSubmission"> | Date | string
    reviewed_by?: UuidNullableFilter<"BadgeSubmission"> | string | null
    reviewed_at?: DateTimeNullableFilter<"BadgeSubmission"> | Date | string | null
    feedback?: StringNullableFilter<"BadgeSubmission"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    badge?: XOR<BadgeScalarRelationFilter, BadgeWhereInput>
    reviewedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type BadgeSubmissionOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    badge_id?: SortOrder
    proof_url?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    submitted_at?: SortOrder
    reviewed_by?: SortOrderInput | SortOrder
    reviewed_at?: SortOrderInput | SortOrder
    feedback?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    badge?: BadgeOrderByWithRelationInput
    reviewedBy?: UserOrderByWithRelationInput
  }

  export type BadgeSubmissionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: BadgeSubmissionWhereInput | BadgeSubmissionWhereInput[]
    OR?: BadgeSubmissionWhereInput[]
    NOT?: BadgeSubmissionWhereInput | BadgeSubmissionWhereInput[]
    user_id?: UuidFilter<"BadgeSubmission"> | string
    badge_id?: StringFilter<"BadgeSubmission"> | string
    proof_url?: StringNullableFilter<"BadgeSubmission"> | string | null
    description?: StringNullableFilter<"BadgeSubmission"> | string | null
    status?: EnumSubmissionStatusFilter<"BadgeSubmission"> | $Enums.SubmissionStatus
    submitted_at?: DateTimeFilter<"BadgeSubmission"> | Date | string
    reviewed_by?: UuidNullableFilter<"BadgeSubmission"> | string | null
    reviewed_at?: DateTimeNullableFilter<"BadgeSubmission"> | Date | string | null
    feedback?: StringNullableFilter<"BadgeSubmission"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    badge?: XOR<BadgeScalarRelationFilter, BadgeWhereInput>
    reviewedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type BadgeSubmissionOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    badge_id?: SortOrder
    proof_url?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    status?: SortOrder
    submitted_at?: SortOrder
    reviewed_by?: SortOrderInput | SortOrder
    reviewed_at?: SortOrderInput | SortOrder
    feedback?: SortOrderInput | SortOrder
    _count?: BadgeSubmissionCountOrderByAggregateInput
    _max?: BadgeSubmissionMaxOrderByAggregateInput
    _min?: BadgeSubmissionMinOrderByAggregateInput
  }

  export type BadgeSubmissionScalarWhereWithAggregatesInput = {
    AND?: BadgeSubmissionScalarWhereWithAggregatesInput | BadgeSubmissionScalarWhereWithAggregatesInput[]
    OR?: BadgeSubmissionScalarWhereWithAggregatesInput[]
    NOT?: BadgeSubmissionScalarWhereWithAggregatesInput | BadgeSubmissionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"BadgeSubmission"> | string
    user_id?: UuidWithAggregatesFilter<"BadgeSubmission"> | string
    badge_id?: StringWithAggregatesFilter<"BadgeSubmission"> | string
    proof_url?: StringNullableWithAggregatesFilter<"BadgeSubmission"> | string | null
    description?: StringNullableWithAggregatesFilter<"BadgeSubmission"> | string | null
    status?: EnumSubmissionStatusWithAggregatesFilter<"BadgeSubmission"> | $Enums.SubmissionStatus
    submitted_at?: DateTimeWithAggregatesFilter<"BadgeSubmission"> | Date | string
    reviewed_by?: UuidNullableWithAggregatesFilter<"BadgeSubmission"> | string | null
    reviewed_at?: DateTimeNullableWithAggregatesFilter<"BadgeSubmission"> | Date | string | null
    feedback?: StringNullableWithAggregatesFilter<"BadgeSubmission"> | string | null
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: UuidFilter<"Notification"> | string
    user_id?: UuidFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    sent_at?: DateTimeFilter<"Notification"> | Date | string
    read?: BoolFilter<"Notification"> | boolean
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    sent_at?: SortOrder
    read?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    user_id?: UuidFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    sent_at?: DateTimeFilter<"Notification"> | Date | string
    read?: BoolFilter<"Notification"> | boolean
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    sent_at?: SortOrder
    read?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Notification"> | string
    user_id?: UuidWithAggregatesFilter<"Notification"> | string
    title?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringWithAggregatesFilter<"Notification"> | string
    sent_at?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
    read?: BoolWithAggregatesFilter<"Notification"> | boolean
  }

  export type ImportSourceWhereInput = {
    AND?: ImportSourceWhereInput | ImportSourceWhereInput[]
    OR?: ImportSourceWhereInput[]
    NOT?: ImportSourceWhereInput | ImportSourceWhereInput[]
    id?: StringFilter<"ImportSource"> | string
    name?: StringFilter<"ImportSource"> | string
    description?: StringNullableFilter<"ImportSource"> | string | null
    company_column?: StringFilter<"ImportSource"> | string
    productive_unit_column?: StringFilter<"ImportSource"> | string
    user_column?: StringFilter<"ImportSource"> | string
    badge_column?: StringFilter<"ImportSource"> | string
    tone_column?: StringFilter<"ImportSource"> | string
    award_column?: StringFilter<"ImportSource"> | string
    created_at?: DateTimeFilter<"ImportSource"> | Date | string
    archived_at?: DateTimeNullableFilter<"ImportSource"> | Date | string | null
    import_runs?: ImportRunListRelationFilter
  }

  export type ImportSourceOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    company_column?: SortOrder
    productive_unit_column?: SortOrder
    user_column?: SortOrder
    badge_column?: SortOrder
    tone_column?: SortOrder
    award_column?: SortOrder
    created_at?: SortOrder
    archived_at?: SortOrderInput | SortOrder
    import_runs?: ImportRunOrderByRelationAggregateInput
  }

  export type ImportSourceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: ImportSourceWhereInput | ImportSourceWhereInput[]
    OR?: ImportSourceWhereInput[]
    NOT?: ImportSourceWhereInput | ImportSourceWhereInput[]
    description?: StringNullableFilter<"ImportSource"> | string | null
    company_column?: StringFilter<"ImportSource"> | string
    productive_unit_column?: StringFilter<"ImportSource"> | string
    user_column?: StringFilter<"ImportSource"> | string
    badge_column?: StringFilter<"ImportSource"> | string
    tone_column?: StringFilter<"ImportSource"> | string
    award_column?: StringFilter<"ImportSource"> | string
    created_at?: DateTimeFilter<"ImportSource"> | Date | string
    archived_at?: DateTimeNullableFilter<"ImportSource"> | Date | string | null
    import_runs?: ImportRunListRelationFilter
  }, "id" | "name">

  export type ImportSourceOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    company_column?: SortOrder
    productive_unit_column?: SortOrder
    user_column?: SortOrder
    badge_column?: SortOrder
    tone_column?: SortOrder
    award_column?: SortOrder
    created_at?: SortOrder
    archived_at?: SortOrderInput | SortOrder
    _count?: ImportSourceCountOrderByAggregateInput
    _max?: ImportSourceMaxOrderByAggregateInput
    _min?: ImportSourceMinOrderByAggregateInput
  }

  export type ImportSourceScalarWhereWithAggregatesInput = {
    AND?: ImportSourceScalarWhereWithAggregatesInput | ImportSourceScalarWhereWithAggregatesInput[]
    OR?: ImportSourceScalarWhereWithAggregatesInput[]
    NOT?: ImportSourceScalarWhereWithAggregatesInput | ImportSourceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ImportSource"> | string
    name?: StringWithAggregatesFilter<"ImportSource"> | string
    description?: StringNullableWithAggregatesFilter<"ImportSource"> | string | null
    company_column?: StringWithAggregatesFilter<"ImportSource"> | string
    productive_unit_column?: StringWithAggregatesFilter<"ImportSource"> | string
    user_column?: StringWithAggregatesFilter<"ImportSource"> | string
    badge_column?: StringWithAggregatesFilter<"ImportSource"> | string
    tone_column?: StringWithAggregatesFilter<"ImportSource"> | string
    award_column?: StringWithAggregatesFilter<"ImportSource"> | string
    created_at?: DateTimeWithAggregatesFilter<"ImportSource"> | Date | string
    archived_at?: DateTimeNullableWithAggregatesFilter<"ImportSource"> | Date | string | null
  }

  export type ImportRunWhereInput = {
    AND?: ImportRunWhereInput | ImportRunWhereInput[]
    OR?: ImportRunWhereInput[]
    NOT?: ImportRunWhereInput | ImportRunWhereInput[]
    id?: UuidFilter<"ImportRun"> | string
    source_id?: StringNullableFilter<"ImportRun"> | string | null
    source_name?: StringFilter<"ImportRun"> | string
    imported_by?: UuidNullableFilter<"ImportRun"> | string | null
    imported_at?: DateTimeFilter<"ImportRun"> | Date | string
    status?: EnumImportRunStatusFilter<"ImportRun"> | $Enums.ImportRunStatus
    matched_columns?: JsonFilter<"ImportRun">
    summary?: JsonFilter<"ImportRun">
    source?: XOR<ImportSourceNullableScalarRelationFilter, ImportSourceWhereInput> | null
    importedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    rows?: ImportRunRowListRelationFilter
  }

  export type ImportRunOrderByWithRelationInput = {
    id?: SortOrder
    source_id?: SortOrderInput | SortOrder
    source_name?: SortOrder
    imported_by?: SortOrderInput | SortOrder
    imported_at?: SortOrder
    status?: SortOrder
    matched_columns?: SortOrder
    summary?: SortOrder
    source?: ImportSourceOrderByWithRelationInput
    importedBy?: UserOrderByWithRelationInput
    rows?: ImportRunRowOrderByRelationAggregateInput
  }

  export type ImportRunWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ImportRunWhereInput | ImportRunWhereInput[]
    OR?: ImportRunWhereInput[]
    NOT?: ImportRunWhereInput | ImportRunWhereInput[]
    source_id?: StringNullableFilter<"ImportRun"> | string | null
    source_name?: StringFilter<"ImportRun"> | string
    imported_by?: UuidNullableFilter<"ImportRun"> | string | null
    imported_at?: DateTimeFilter<"ImportRun"> | Date | string
    status?: EnumImportRunStatusFilter<"ImportRun"> | $Enums.ImportRunStatus
    matched_columns?: JsonFilter<"ImportRun">
    summary?: JsonFilter<"ImportRun">
    source?: XOR<ImportSourceNullableScalarRelationFilter, ImportSourceWhereInput> | null
    importedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    rows?: ImportRunRowListRelationFilter
  }, "id">

  export type ImportRunOrderByWithAggregationInput = {
    id?: SortOrder
    source_id?: SortOrderInput | SortOrder
    source_name?: SortOrder
    imported_by?: SortOrderInput | SortOrder
    imported_at?: SortOrder
    status?: SortOrder
    matched_columns?: SortOrder
    summary?: SortOrder
    _count?: ImportRunCountOrderByAggregateInput
    _max?: ImportRunMaxOrderByAggregateInput
    _min?: ImportRunMinOrderByAggregateInput
  }

  export type ImportRunScalarWhereWithAggregatesInput = {
    AND?: ImportRunScalarWhereWithAggregatesInput | ImportRunScalarWhereWithAggregatesInput[]
    OR?: ImportRunScalarWhereWithAggregatesInput[]
    NOT?: ImportRunScalarWhereWithAggregatesInput | ImportRunScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ImportRun"> | string
    source_id?: StringNullableWithAggregatesFilter<"ImportRun"> | string | null
    source_name?: StringWithAggregatesFilter<"ImportRun"> | string
    imported_by?: UuidNullableWithAggregatesFilter<"ImportRun"> | string | null
    imported_at?: DateTimeWithAggregatesFilter<"ImportRun"> | Date | string
    status?: EnumImportRunStatusWithAggregatesFilter<"ImportRun"> | $Enums.ImportRunStatus
    matched_columns?: JsonWithAggregatesFilter<"ImportRun">
    summary?: JsonWithAggregatesFilter<"ImportRun">
  }

  export type ImportRunRowWhereInput = {
    AND?: ImportRunRowWhereInput | ImportRunRowWhereInput[]
    OR?: ImportRunRowWhereInput[]
    NOT?: ImportRunRowWhereInput | ImportRunRowWhereInput[]
    id?: UuidFilter<"ImportRunRow"> | string
    import_run_id?: UuidFilter<"ImportRunRow"> | string
    row_number?: IntFilter<"ImportRunRow"> | number
    raw_payload?: JsonFilter<"ImportRunRow">
    normalized_payload?: JsonNullableFilter<"ImportRunRow">
    status?: EnumImportRowStatusFilter<"ImportRunRow"> | $Enums.ImportRowStatus
    reason?: StringNullableFilter<"ImportRunRow"> | string | null
    import_run?: XOR<ImportRunScalarRelationFilter, ImportRunWhereInput>
  }

  export type ImportRunRowOrderByWithRelationInput = {
    id?: SortOrder
    import_run_id?: SortOrder
    row_number?: SortOrder
    raw_payload?: SortOrder
    normalized_payload?: SortOrderInput | SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    import_run?: ImportRunOrderByWithRelationInput
  }

  export type ImportRunRowWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ImportRunRowWhereInput | ImportRunRowWhereInput[]
    OR?: ImportRunRowWhereInput[]
    NOT?: ImportRunRowWhereInput | ImportRunRowWhereInput[]
    import_run_id?: UuidFilter<"ImportRunRow"> | string
    row_number?: IntFilter<"ImportRunRow"> | number
    raw_payload?: JsonFilter<"ImportRunRow">
    normalized_payload?: JsonNullableFilter<"ImportRunRow">
    status?: EnumImportRowStatusFilter<"ImportRunRow"> | $Enums.ImportRowStatus
    reason?: StringNullableFilter<"ImportRunRow"> | string | null
    import_run?: XOR<ImportRunScalarRelationFilter, ImportRunWhereInput>
  }, "id">

  export type ImportRunRowOrderByWithAggregationInput = {
    id?: SortOrder
    import_run_id?: SortOrder
    row_number?: SortOrder
    raw_payload?: SortOrder
    normalized_payload?: SortOrderInput | SortOrder
    status?: SortOrder
    reason?: SortOrderInput | SortOrder
    _count?: ImportRunRowCountOrderByAggregateInput
    _avg?: ImportRunRowAvgOrderByAggregateInput
    _max?: ImportRunRowMaxOrderByAggregateInput
    _min?: ImportRunRowMinOrderByAggregateInput
    _sum?: ImportRunRowSumOrderByAggregateInput
  }

  export type ImportRunRowScalarWhereWithAggregatesInput = {
    AND?: ImportRunRowScalarWhereWithAggregatesInput | ImportRunRowScalarWhereWithAggregatesInput[]
    OR?: ImportRunRowScalarWhereWithAggregatesInput[]
    NOT?: ImportRunRowScalarWhereWithAggregatesInput | ImportRunRowScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"ImportRunRow"> | string
    import_run_id?: UuidWithAggregatesFilter<"ImportRunRow"> | string
    row_number?: IntWithAggregatesFilter<"ImportRunRow"> | number
    raw_payload?: JsonWithAggregatesFilter<"ImportRunRow">
    normalized_payload?: JsonNullableWithAggregatesFilter<"ImportRunRow">
    status?: EnumImportRowStatusWithAggregatesFilter<"ImportRunRow"> | $Enums.ImportRowStatus
    reason?: StringNullableWithAggregatesFilter<"ImportRunRow"> | string | null
  }

  export type CompanyCreateInput = {
    id: string
    name: string
    logo_url?: string | null
    created_at?: Date | string
    productive_units?: ProductiveUnitCreateNestedManyWithoutCompanyInput
    users?: UserCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateInput = {
    id: string
    name: string
    logo_url?: string | null
    created_at?: Date | string
    productive_units?: ProductiveUnitUncheckedCreateNestedManyWithoutCompanyInput
    users?: UserUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    productive_units?: ProductiveUnitUpdateManyWithoutCompanyNestedInput
    users?: UserUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    productive_units?: ProductiveUnitUncheckedUpdateManyWithoutCompanyNestedInput
    users?: UserUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyCreateManyInput = {
    id: string
    name: string
    logo_url?: string | null
    created_at?: Date | string
  }

  export type CompanyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CompanyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductiveUnitCreateInput = {
    id: string
    name: string
    created_at?: Date | string
    company: CompanyCreateNestedOneWithoutProductive_unitsInput
    users?: UserCreateNestedManyWithoutProductive_unitInput
  }

  export type ProductiveUnitUncheckedCreateInput = {
    id: string
    company_id: string
    name: string
    created_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutProductive_unitInput
  }

  export type ProductiveUnitUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutProductive_unitsNestedInput
    users?: UserUpdateManyWithoutProductive_unitNestedInput
  }

  export type ProductiveUnitUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutProductive_unitNestedInput
  }

  export type ProductiveUnitCreateManyInput = {
    id: string
    company_id: string
    name: string
    created_at?: Date | string
  }

  export type ProductiveUnitUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProductiveUnitUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    company?: CompanyCreateNestedOneWithoutUsersInput
    productive_unit?: ProductiveUnitCreateNestedOneWithoutUsersInput
    sessions?: AuthSessionCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunCreateNestedManyWithoutImportedByInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    company_id?: string | null
    productive_unit_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeUncheckedCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingUncheckedCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunUncheckedCreateNestedManyWithoutImportedByInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutUsersNestedInput
    productive_unit?: ProductiveUnitUpdateOneWithoutUsersNestedInput
    sessions?: AuthSessionUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUpdateManyWithoutImportedByNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    company_id?: NullableStringFieldUpdateOperationsInput | string | null
    productive_unit_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUncheckedUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUncheckedUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUncheckedUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUncheckedUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUncheckedUpdateManyWithoutImportedByNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    company_id?: string | null
    productive_unit_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    company_id?: NullableStringFieldUpdateOperationsInput | string | null
    productive_unit_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionCreateInput = {
    id?: string
    created_at?: Date | string
    expires_at: Date | string
    revoked_at?: Date | string | null
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type AuthSessionUncheckedCreateInput = {
    id?: string
    user_id: string
    created_at?: Date | string
    expires_at: Date | string
    revoked_at?: Date | string | null
  }

  export type AuthSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type AuthSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuthSessionCreateManyInput = {
    id?: string
    user_id: string
    created_at?: Date | string
    expires_at: Date | string
    revoked_at?: Date | string | null
  }

  export type AuthSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuthSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type BadgeCreateInput = {
    id: string
    name: string
    description: string
    category: string
    icon_name: string
    image_url?: string | null
    points?: number
    created_at?: Date | string
    user_badges?: UserBadgeCreateNestedManyWithoutBadgeInput
    submissions?: BadgeSubmissionCreateNestedManyWithoutBadgeInput
  }

  export type BadgeUncheckedCreateInput = {
    id: string
    name: string
    description: string
    category: string
    icon_name: string
    image_url?: string | null
    points?: number
    created_at?: Date | string
    user_badges?: UserBadgeUncheckedCreateNestedManyWithoutBadgeInput
    submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutBadgeInput
  }

  export type BadgeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    icon_name?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_badges?: UserBadgeUpdateManyWithoutBadgeNestedInput
    submissions?: BadgeSubmissionUpdateManyWithoutBadgeNestedInput
  }

  export type BadgeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    icon_name?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_badges?: UserBadgeUncheckedUpdateManyWithoutBadgeNestedInput
    submissions?: BadgeSubmissionUncheckedUpdateManyWithoutBadgeNestedInput
  }

  export type BadgeCreateManyInput = {
    id: string
    name: string
    description: string
    category: string
    icon_name: string
    image_url?: string | null
    points?: number
    created_at?: Date | string
  }

  export type BadgeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    icon_name?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BadgeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    icon_name?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BadgeLegendSettingCreateInput = {
    id?: string
    bronze: string
    silver: string
    gold: string
    loss_1: string
    loss_2: string
    updated_at?: Date | string
    updatedBy?: UserCreateNestedOneWithoutBadge_legend_settingsInput
  }

  export type BadgeLegendSettingUncheckedCreateInput = {
    id?: string
    bronze: string
    silver: string
    gold: string
    loss_1: string
    loss_2: string
    updated_by?: string | null
    updated_at?: Date | string
  }

  export type BadgeLegendSettingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bronze?: StringFieldUpdateOperationsInput | string
    silver?: StringFieldUpdateOperationsInput | string
    gold?: StringFieldUpdateOperationsInput | string
    loss_1?: StringFieldUpdateOperationsInput | string
    loss_2?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedBy?: UserUpdateOneWithoutBadge_legend_settingsNestedInput
  }

  export type BadgeLegendSettingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    bronze?: StringFieldUpdateOperationsInput | string
    silver?: StringFieldUpdateOperationsInput | string
    gold?: StringFieldUpdateOperationsInput | string
    loss_1?: StringFieldUpdateOperationsInput | string
    loss_2?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BadgeLegendSettingCreateManyInput = {
    id?: string
    bronze: string
    silver: string
    gold: string
    loss_1: string
    loss_2: string
    updated_by?: string | null
    updated_at?: Date | string
  }

  export type BadgeLegendSettingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    bronze?: StringFieldUpdateOperationsInput | string
    silver?: StringFieldUpdateOperationsInput | string
    gold?: StringFieldUpdateOperationsInput | string
    loss_1?: StringFieldUpdateOperationsInput | string
    loss_2?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BadgeLegendSettingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    bronze?: StringFieldUpdateOperationsInput | string
    silver?: StringFieldUpdateOperationsInput | string
    gold?: StringFieldUpdateOperationsInput | string
    loss_1?: StringFieldUpdateOperationsInput | string
    loss_2?: StringFieldUpdateOperationsInput | string
    updated_by?: NullableStringFieldUpdateOperationsInput | string | null
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserBadgeCreateInput = {
    id?: string
    awarded_at?: Date | string
    tone: $Enums.BadgeTone
    user: UserCreateNestedOneWithoutUser_badgesInput
    badge: BadgeCreateNestedOneWithoutUser_badgesInput
    awardedBy?: UserCreateNestedOneWithoutAwarded_badgesInput
  }

  export type UserBadgeUncheckedCreateInput = {
    id?: string
    user_id: string
    badge_id: string
    awarded_at?: Date | string
    awarded_by?: string | null
    tone: $Enums.BadgeTone
  }

  export type UserBadgeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    awarded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tone?: EnumBadgeToneFieldUpdateOperationsInput | $Enums.BadgeTone
    user?: UserUpdateOneRequiredWithoutUser_badgesNestedInput
    badge?: BadgeUpdateOneRequiredWithoutUser_badgesNestedInput
    awardedBy?: UserUpdateOneWithoutAwarded_badgesNestedInput
  }

  export type UserBadgeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    badge_id?: StringFieldUpdateOperationsInput | string
    awarded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    awarded_by?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: EnumBadgeToneFieldUpdateOperationsInput | $Enums.BadgeTone
  }

  export type UserBadgeCreateManyInput = {
    id?: string
    user_id: string
    badge_id: string
    awarded_at?: Date | string
    awarded_by?: string | null
    tone: $Enums.BadgeTone
  }

  export type UserBadgeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    awarded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tone?: EnumBadgeToneFieldUpdateOperationsInput | $Enums.BadgeTone
  }

  export type UserBadgeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    badge_id?: StringFieldUpdateOperationsInput | string
    awarded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    awarded_by?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: EnumBadgeToneFieldUpdateOperationsInput | $Enums.BadgeTone
  }

  export type BadgeSubmissionCreateInput = {
    id?: string
    proof_url?: string | null
    description?: string | null
    status?: $Enums.SubmissionStatus
    submitted_at?: Date | string
    reviewed_at?: Date | string | null
    feedback?: string | null
    user: UserCreateNestedOneWithoutSubmissionsInput
    badge: BadgeCreateNestedOneWithoutSubmissionsInput
    reviewedBy?: UserCreateNestedOneWithoutReviewed_submissionsInput
  }

  export type BadgeSubmissionUncheckedCreateInput = {
    id?: string
    user_id: string
    badge_id: string
    proof_url?: string | null
    description?: string | null
    status?: $Enums.SubmissionStatus
    submitted_at?: Date | string
    reviewed_by?: string | null
    reviewed_at?: Date | string | null
    feedback?: string | null
  }

  export type BadgeSubmissionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    proof_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSubmissionsNestedInput
    badge?: BadgeUpdateOneRequiredWithoutSubmissionsNestedInput
    reviewedBy?: UserUpdateOneWithoutReviewed_submissionsNestedInput
  }

  export type BadgeSubmissionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    badge_id?: StringFieldUpdateOperationsInput | string
    proof_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewed_by?: NullableStringFieldUpdateOperationsInput | string | null
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BadgeSubmissionCreateManyInput = {
    id?: string
    user_id: string
    badge_id: string
    proof_url?: string | null
    description?: string | null
    status?: $Enums.SubmissionStatus
    submitted_at?: Date | string
    reviewed_by?: string | null
    reviewed_at?: Date | string | null
    feedback?: string | null
  }

  export type BadgeSubmissionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    proof_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BadgeSubmissionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    badge_id?: StringFieldUpdateOperationsInput | string
    proof_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewed_by?: NullableStringFieldUpdateOperationsInput | string | null
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationCreateInput = {
    id?: string
    title: string
    message: string
    sent_at?: Date | string
    read?: boolean
    user: UserCreateNestedOneWithoutNotificationsInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: string
    user_id: string
    title: string
    message: string
    sent_at?: Date | string
    read?: boolean
  }

  export type NotificationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    user?: UserUpdateOneRequiredWithoutNotificationsNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationCreateManyInput = {
    id?: string
    user_id: string
    title: string
    message: string
    sent_at?: Date | string
    read?: boolean
  }

  export type NotificationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ImportSourceCreateInput = {
    id: string
    name: string
    description?: string | null
    company_column: string
    productive_unit_column: string
    user_column: string
    badge_column: string
    tone_column?: string
    award_column?: string
    created_at?: Date | string
    archived_at?: Date | string | null
    import_runs?: ImportRunCreateNestedManyWithoutSourceInput
  }

  export type ImportSourceUncheckedCreateInput = {
    id: string
    name: string
    description?: string | null
    company_column: string
    productive_unit_column: string
    user_column: string
    badge_column: string
    tone_column?: string
    award_column?: string
    created_at?: Date | string
    archived_at?: Date | string | null
    import_runs?: ImportRunUncheckedCreateNestedManyWithoutSourceInput
  }

  export type ImportSourceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company_column?: StringFieldUpdateOperationsInput | string
    productive_unit_column?: StringFieldUpdateOperationsInput | string
    user_column?: StringFieldUpdateOperationsInput | string
    badge_column?: StringFieldUpdateOperationsInput | string
    tone_column?: StringFieldUpdateOperationsInput | string
    award_column?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    archived_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    import_runs?: ImportRunUpdateManyWithoutSourceNestedInput
  }

  export type ImportSourceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company_column?: StringFieldUpdateOperationsInput | string
    productive_unit_column?: StringFieldUpdateOperationsInput | string
    user_column?: StringFieldUpdateOperationsInput | string
    badge_column?: StringFieldUpdateOperationsInput | string
    tone_column?: StringFieldUpdateOperationsInput | string
    award_column?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    archived_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    import_runs?: ImportRunUncheckedUpdateManyWithoutSourceNestedInput
  }

  export type ImportSourceCreateManyInput = {
    id: string
    name: string
    description?: string | null
    company_column: string
    productive_unit_column: string
    user_column: string
    badge_column: string
    tone_column?: string
    award_column?: string
    created_at?: Date | string
    archived_at?: Date | string | null
  }

  export type ImportSourceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company_column?: StringFieldUpdateOperationsInput | string
    productive_unit_column?: StringFieldUpdateOperationsInput | string
    user_column?: StringFieldUpdateOperationsInput | string
    badge_column?: StringFieldUpdateOperationsInput | string
    tone_column?: StringFieldUpdateOperationsInput | string
    award_column?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    archived_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ImportSourceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company_column?: StringFieldUpdateOperationsInput | string
    productive_unit_column?: StringFieldUpdateOperationsInput | string
    user_column?: StringFieldUpdateOperationsInput | string
    badge_column?: StringFieldUpdateOperationsInput | string
    tone_column?: StringFieldUpdateOperationsInput | string
    award_column?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    archived_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ImportRunCreateInput = {
    id?: string
    source_name: string
    imported_at?: Date | string
    status?: $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    source?: ImportSourceCreateNestedOneWithoutImport_runsInput
    importedBy?: UserCreateNestedOneWithoutImport_runsInput
    rows?: ImportRunRowCreateNestedManyWithoutImport_runInput
  }

  export type ImportRunUncheckedCreateInput = {
    id?: string
    source_id?: string | null
    source_name: string
    imported_by?: string | null
    imported_at?: Date | string
    status?: $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    rows?: ImportRunRowUncheckedCreateNestedManyWithoutImport_runInput
  }

  export type ImportRunUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source_name?: StringFieldUpdateOperationsInput | string
    imported_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumImportRunStatusFieldUpdateOperationsInput | $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    source?: ImportSourceUpdateOneWithoutImport_runsNestedInput
    importedBy?: UserUpdateOneWithoutImport_runsNestedInput
    rows?: ImportRunRowUpdateManyWithoutImport_runNestedInput
  }

  export type ImportRunUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    source_id?: NullableStringFieldUpdateOperationsInput | string | null
    source_name?: StringFieldUpdateOperationsInput | string
    imported_by?: NullableStringFieldUpdateOperationsInput | string | null
    imported_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumImportRunStatusFieldUpdateOperationsInput | $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    rows?: ImportRunRowUncheckedUpdateManyWithoutImport_runNestedInput
  }

  export type ImportRunCreateManyInput = {
    id?: string
    source_id?: string | null
    source_name: string
    imported_by?: string | null
    imported_at?: Date | string
    status?: $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
  }

  export type ImportRunUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    source_name?: StringFieldUpdateOperationsInput | string
    imported_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumImportRunStatusFieldUpdateOperationsInput | $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
  }

  export type ImportRunUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    source_id?: NullableStringFieldUpdateOperationsInput | string | null
    source_name?: StringFieldUpdateOperationsInput | string
    imported_by?: NullableStringFieldUpdateOperationsInput | string | null
    imported_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumImportRunStatusFieldUpdateOperationsInput | $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
  }

  export type ImportRunRowCreateInput = {
    id?: string
    row_number: number
    raw_payload: JsonNullValueInput | InputJsonValue
    normalized_payload?: NullableJsonNullValueInput | InputJsonValue
    status: $Enums.ImportRowStatus
    reason?: string | null
    import_run: ImportRunCreateNestedOneWithoutRowsInput
  }

  export type ImportRunRowUncheckedCreateInput = {
    id?: string
    import_run_id: string
    row_number: number
    raw_payload: JsonNullValueInput | InputJsonValue
    normalized_payload?: NullableJsonNullValueInput | InputJsonValue
    status: $Enums.ImportRowStatus
    reason?: string | null
  }

  export type ImportRunRowUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    row_number?: IntFieldUpdateOperationsInput | number
    raw_payload?: JsonNullValueInput | InputJsonValue
    normalized_payload?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
    import_run?: ImportRunUpdateOneRequiredWithoutRowsNestedInput
  }

  export type ImportRunRowUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    import_run_id?: StringFieldUpdateOperationsInput | string
    row_number?: IntFieldUpdateOperationsInput | number
    raw_payload?: JsonNullValueInput | InputJsonValue
    normalized_payload?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ImportRunRowCreateManyInput = {
    id?: string
    import_run_id: string
    row_number: number
    raw_payload: JsonNullValueInput | InputJsonValue
    normalized_payload?: NullableJsonNullValueInput | InputJsonValue
    status: $Enums.ImportRowStatus
    reason?: string | null
  }

  export type ImportRunRowUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    row_number?: IntFieldUpdateOperationsInput | number
    raw_payload?: JsonNullValueInput | InputJsonValue
    normalized_payload?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ImportRunRowUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    import_run_id?: StringFieldUpdateOperationsInput | string
    row_number?: IntFieldUpdateOperationsInput | number
    raw_payload?: JsonNullValueInput | InputJsonValue
    normalized_payload?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type ProductiveUnitListRelationFilter = {
    every?: ProductiveUnitWhereInput
    some?: ProductiveUnitWhereInput
    none?: ProductiveUnitWhereInput
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ProductiveUnitOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CompanyCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    logo_url?: SortOrder
    created_at?: SortOrder
  }

  export type CompanyMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    logo_url?: SortOrder
    created_at?: SortOrder
  }

  export type CompanyMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    logo_url?: SortOrder
    created_at?: SortOrder
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

  export type CompanyScalarRelationFilter = {
    is?: CompanyWhereInput
    isNot?: CompanyWhereInput
  }

  export type ProductiveUnitCompany_idNameCompoundUniqueInput = {
    company_id: string
    name: string
  }

  export type ProductiveUnitCountOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
  }

  export type ProductiveUnitMaxOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
  }

  export type ProductiveUnitMinOrderByAggregateInput = {
    id?: SortOrder
    company_id?: SortOrder
    name?: SortOrder
    created_at?: SortOrder
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type CompanyNullableScalarRelationFilter = {
    is?: CompanyWhereInput | null
    isNot?: CompanyWhereInput | null
  }

  export type ProductiveUnitNullableScalarRelationFilter = {
    is?: ProductiveUnitWhereInput | null
    isNot?: ProductiveUnitWhereInput | null
  }

  export type AuthSessionListRelationFilter = {
    every?: AuthSessionWhereInput
    some?: AuthSessionWhereInput
    none?: AuthSessionWhereInput
  }

  export type UserBadgeListRelationFilter = {
    every?: UserBadgeWhereInput
    some?: UserBadgeWhereInput
    none?: UserBadgeWhereInput
  }

  export type BadgeSubmissionListRelationFilter = {
    every?: BadgeSubmissionWhereInput
    some?: BadgeSubmissionWhereInput
    none?: BadgeSubmissionWhereInput
  }

  export type NotificationListRelationFilter = {
    every?: NotificationWhereInput
    some?: NotificationWhereInput
    none?: NotificationWhereInput
  }

  export type BadgeLegendSettingListRelationFilter = {
    every?: BadgeLegendSettingWhereInput
    some?: BadgeLegendSettingWhereInput
    none?: BadgeLegendSettingWhereInput
  }

  export type ImportRunListRelationFilter = {
    every?: ImportRunWhereInput
    some?: ImportRunWhereInput
    none?: ImportRunWhereInput
  }

  export type AuthSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserBadgeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BadgeSubmissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type BadgeLegendSettingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImportRunOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    role?: SortOrder
    company_id?: SortOrder
    productive_unit_id?: SortOrder
    level?: SortOrder
    xp?: SortOrder
    email_verified?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    level?: SortOrder
    xp?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    role?: SortOrder
    company_id?: SortOrder
    productive_unit_id?: SortOrder
    level?: SortOrder
    xp?: SortOrder
    email_verified?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    password_hash?: SortOrder
    full_name?: SortOrder
    avatar_url?: SortOrder
    role?: SortOrder
    company_id?: SortOrder
    productive_unit_id?: SortOrder
    level?: SortOrder
    xp?: SortOrder
    email_verified?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    level?: SortOrder
    xp?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
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

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AuthSessionCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    revoked_at?: SortOrder
  }

  export type AuthSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    revoked_at?: SortOrder
  }

  export type AuthSessionMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    created_at?: SortOrder
    expires_at?: SortOrder
    revoked_at?: SortOrder
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

  export type BadgeCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    icon_name?: SortOrder
    image_url?: SortOrder
    points?: SortOrder
    created_at?: SortOrder
  }

  export type BadgeAvgOrderByAggregateInput = {
    points?: SortOrder
  }

  export type BadgeMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    icon_name?: SortOrder
    image_url?: SortOrder
    points?: SortOrder
    created_at?: SortOrder
  }

  export type BadgeMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    category?: SortOrder
    icon_name?: SortOrder
    image_url?: SortOrder
    points?: SortOrder
    created_at?: SortOrder
  }

  export type BadgeSumOrderByAggregateInput = {
    points?: SortOrder
  }

  export type UuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type BadgeLegendSettingCountOrderByAggregateInput = {
    id?: SortOrder
    bronze?: SortOrder
    silver?: SortOrder
    gold?: SortOrder
    loss_1?: SortOrder
    loss_2?: SortOrder
    updated_by?: SortOrder
    updated_at?: SortOrder
  }

  export type BadgeLegendSettingMaxOrderByAggregateInput = {
    id?: SortOrder
    bronze?: SortOrder
    silver?: SortOrder
    gold?: SortOrder
    loss_1?: SortOrder
    loss_2?: SortOrder
    updated_by?: SortOrder
    updated_at?: SortOrder
  }

  export type BadgeLegendSettingMinOrderByAggregateInput = {
    id?: SortOrder
    bronze?: SortOrder
    silver?: SortOrder
    gold?: SortOrder
    loss_1?: SortOrder
    loss_2?: SortOrder
    updated_by?: SortOrder
    updated_at?: SortOrder
  }

  export type UuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumBadgeToneFilter<$PrismaModel = never> = {
    equals?: $Enums.BadgeTone | EnumBadgeToneFieldRefInput<$PrismaModel>
    in?: $Enums.BadgeTone[] | ListEnumBadgeToneFieldRefInput<$PrismaModel>
    notIn?: $Enums.BadgeTone[] | ListEnumBadgeToneFieldRefInput<$PrismaModel>
    not?: NestedEnumBadgeToneFilter<$PrismaModel> | $Enums.BadgeTone
  }

  export type BadgeScalarRelationFilter = {
    is?: BadgeWhereInput
    isNot?: BadgeWhereInput
  }

  export type UserBadgeCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    badge_id?: SortOrder
    awarded_at?: SortOrder
    awarded_by?: SortOrder
    tone?: SortOrder
  }

  export type UserBadgeMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    badge_id?: SortOrder
    awarded_at?: SortOrder
    awarded_by?: SortOrder
    tone?: SortOrder
  }

  export type UserBadgeMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    badge_id?: SortOrder
    awarded_at?: SortOrder
    awarded_by?: SortOrder
    tone?: SortOrder
  }

  export type EnumBadgeToneWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BadgeTone | EnumBadgeToneFieldRefInput<$PrismaModel>
    in?: $Enums.BadgeTone[] | ListEnumBadgeToneFieldRefInput<$PrismaModel>
    notIn?: $Enums.BadgeTone[] | ListEnumBadgeToneFieldRefInput<$PrismaModel>
    not?: NestedEnumBadgeToneWithAggregatesFilter<$PrismaModel> | $Enums.BadgeTone
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBadgeToneFilter<$PrismaModel>
    _max?: NestedEnumBadgeToneFilter<$PrismaModel>
  }

  export type EnumSubmissionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubmissionStatus | EnumSubmissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubmissionStatusFilter<$PrismaModel> | $Enums.SubmissionStatus
  }

  export type BadgeSubmissionCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    badge_id?: SortOrder
    proof_url?: SortOrder
    description?: SortOrder
    status?: SortOrder
    submitted_at?: SortOrder
    reviewed_by?: SortOrder
    reviewed_at?: SortOrder
    feedback?: SortOrder
  }

  export type BadgeSubmissionMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    badge_id?: SortOrder
    proof_url?: SortOrder
    description?: SortOrder
    status?: SortOrder
    submitted_at?: SortOrder
    reviewed_by?: SortOrder
    reviewed_at?: SortOrder
    feedback?: SortOrder
  }

  export type BadgeSubmissionMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    badge_id?: SortOrder
    proof_url?: SortOrder
    description?: SortOrder
    status?: SortOrder
    submitted_at?: SortOrder
    reviewed_by?: SortOrder
    reviewed_at?: SortOrder
    feedback?: SortOrder
  }

  export type EnumSubmissionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubmissionStatus | EnumSubmissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubmissionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubmissionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubmissionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubmissionStatusFilter<$PrismaModel>
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    sent_at?: SortOrder
    read?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    sent_at?: SortOrder
    read?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    user_id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    sent_at?: SortOrder
    read?: SortOrder
  }

  export type ImportSourceCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    company_column?: SortOrder
    productive_unit_column?: SortOrder
    user_column?: SortOrder
    badge_column?: SortOrder
    tone_column?: SortOrder
    award_column?: SortOrder
    created_at?: SortOrder
    archived_at?: SortOrder
  }

  export type ImportSourceMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    company_column?: SortOrder
    productive_unit_column?: SortOrder
    user_column?: SortOrder
    badge_column?: SortOrder
    tone_column?: SortOrder
    award_column?: SortOrder
    created_at?: SortOrder
    archived_at?: SortOrder
  }

  export type ImportSourceMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    company_column?: SortOrder
    productive_unit_column?: SortOrder
    user_column?: SortOrder
    badge_column?: SortOrder
    tone_column?: SortOrder
    award_column?: SortOrder
    created_at?: SortOrder
    archived_at?: SortOrder
  }

  export type EnumImportRunStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportRunStatus | EnumImportRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ImportRunStatus[] | ListEnumImportRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ImportRunStatus[] | ListEnumImportRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumImportRunStatusFilter<$PrismaModel> | $Enums.ImportRunStatus
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type ImportSourceNullableScalarRelationFilter = {
    is?: ImportSourceWhereInput | null
    isNot?: ImportSourceWhereInput | null
  }

  export type ImportRunRowListRelationFilter = {
    every?: ImportRunRowWhereInput
    some?: ImportRunRowWhereInput
    none?: ImportRunRowWhereInput
  }

  export type ImportRunRowOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ImportRunCountOrderByAggregateInput = {
    id?: SortOrder
    source_id?: SortOrder
    source_name?: SortOrder
    imported_by?: SortOrder
    imported_at?: SortOrder
    status?: SortOrder
    matched_columns?: SortOrder
    summary?: SortOrder
  }

  export type ImportRunMaxOrderByAggregateInput = {
    id?: SortOrder
    source_id?: SortOrder
    source_name?: SortOrder
    imported_by?: SortOrder
    imported_at?: SortOrder
    status?: SortOrder
  }

  export type ImportRunMinOrderByAggregateInput = {
    id?: SortOrder
    source_id?: SortOrder
    source_name?: SortOrder
    imported_by?: SortOrder
    imported_at?: SortOrder
    status?: SortOrder
  }

  export type EnumImportRunStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportRunStatus | EnumImportRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ImportRunStatus[] | ListEnumImportRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ImportRunStatus[] | ListEnumImportRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumImportRunStatusWithAggregatesFilter<$PrismaModel> | $Enums.ImportRunStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumImportRunStatusFilter<$PrismaModel>
    _max?: NestedEnumImportRunStatusFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumImportRowStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportRowStatus | EnumImportRowStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ImportRowStatus[] | ListEnumImportRowStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ImportRowStatus[] | ListEnumImportRowStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumImportRowStatusFilter<$PrismaModel> | $Enums.ImportRowStatus
  }

  export type ImportRunScalarRelationFilter = {
    is?: ImportRunWhereInput
    isNot?: ImportRunWhereInput
  }

  export type ImportRunRowCountOrderByAggregateInput = {
    id?: SortOrder
    import_run_id?: SortOrder
    row_number?: SortOrder
    raw_payload?: SortOrder
    normalized_payload?: SortOrder
    status?: SortOrder
    reason?: SortOrder
  }

  export type ImportRunRowAvgOrderByAggregateInput = {
    row_number?: SortOrder
  }

  export type ImportRunRowMaxOrderByAggregateInput = {
    id?: SortOrder
    import_run_id?: SortOrder
    row_number?: SortOrder
    status?: SortOrder
    reason?: SortOrder
  }

  export type ImportRunRowMinOrderByAggregateInput = {
    id?: SortOrder
    import_run_id?: SortOrder
    row_number?: SortOrder
    status?: SortOrder
    reason?: SortOrder
  }

  export type ImportRunRowSumOrderByAggregateInput = {
    row_number?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumImportRowStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportRowStatus | EnumImportRowStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ImportRowStatus[] | ListEnumImportRowStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ImportRowStatus[] | ListEnumImportRowStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumImportRowStatusWithAggregatesFilter<$PrismaModel> | $Enums.ImportRowStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumImportRowStatusFilter<$PrismaModel>
    _max?: NestedEnumImportRowStatusFilter<$PrismaModel>
  }

  export type ProductiveUnitCreateNestedManyWithoutCompanyInput = {
    create?: XOR<ProductiveUnitCreateWithoutCompanyInput, ProductiveUnitUncheckedCreateWithoutCompanyInput> | ProductiveUnitCreateWithoutCompanyInput[] | ProductiveUnitUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: ProductiveUnitCreateOrConnectWithoutCompanyInput | ProductiveUnitCreateOrConnectWithoutCompanyInput[]
    createMany?: ProductiveUnitCreateManyCompanyInputEnvelope
    connect?: ProductiveUnitWhereUniqueInput | ProductiveUnitWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutCompanyInput = {
    create?: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput> | UserCreateWithoutCompanyInput[] | UserUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyInput | UserCreateOrConnectWithoutCompanyInput[]
    createMany?: UserCreateManyCompanyInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type ProductiveUnitUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<ProductiveUnitCreateWithoutCompanyInput, ProductiveUnitUncheckedCreateWithoutCompanyInput> | ProductiveUnitCreateWithoutCompanyInput[] | ProductiveUnitUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: ProductiveUnitCreateOrConnectWithoutCompanyInput | ProductiveUnitCreateOrConnectWithoutCompanyInput[]
    createMany?: ProductiveUnitCreateManyCompanyInputEnvelope
    connect?: ProductiveUnitWhereUniqueInput | ProductiveUnitWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutCompanyInput = {
    create?: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput> | UserCreateWithoutCompanyInput[] | UserUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyInput | UserCreateOrConnectWithoutCompanyInput[]
    createMany?: UserCreateManyCompanyInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProductiveUnitUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<ProductiveUnitCreateWithoutCompanyInput, ProductiveUnitUncheckedCreateWithoutCompanyInput> | ProductiveUnitCreateWithoutCompanyInput[] | ProductiveUnitUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: ProductiveUnitCreateOrConnectWithoutCompanyInput | ProductiveUnitCreateOrConnectWithoutCompanyInput[]
    upsert?: ProductiveUnitUpsertWithWhereUniqueWithoutCompanyInput | ProductiveUnitUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: ProductiveUnitCreateManyCompanyInputEnvelope
    set?: ProductiveUnitWhereUniqueInput | ProductiveUnitWhereUniqueInput[]
    disconnect?: ProductiveUnitWhereUniqueInput | ProductiveUnitWhereUniqueInput[]
    delete?: ProductiveUnitWhereUniqueInput | ProductiveUnitWhereUniqueInput[]
    connect?: ProductiveUnitWhereUniqueInput | ProductiveUnitWhereUniqueInput[]
    update?: ProductiveUnitUpdateWithWhereUniqueWithoutCompanyInput | ProductiveUnitUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: ProductiveUnitUpdateManyWithWhereWithoutCompanyInput | ProductiveUnitUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: ProductiveUnitScalarWhereInput | ProductiveUnitScalarWhereInput[]
  }

  export type UserUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput> | UserCreateWithoutCompanyInput[] | UserUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyInput | UserCreateOrConnectWithoutCompanyInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutCompanyInput | UserUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: UserCreateManyCompanyInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutCompanyInput | UserUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: UserUpdateManyWithWhereWithoutCompanyInput | UserUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type ProductiveUnitUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<ProductiveUnitCreateWithoutCompanyInput, ProductiveUnitUncheckedCreateWithoutCompanyInput> | ProductiveUnitCreateWithoutCompanyInput[] | ProductiveUnitUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: ProductiveUnitCreateOrConnectWithoutCompanyInput | ProductiveUnitCreateOrConnectWithoutCompanyInput[]
    upsert?: ProductiveUnitUpsertWithWhereUniqueWithoutCompanyInput | ProductiveUnitUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: ProductiveUnitCreateManyCompanyInputEnvelope
    set?: ProductiveUnitWhereUniqueInput | ProductiveUnitWhereUniqueInput[]
    disconnect?: ProductiveUnitWhereUniqueInput | ProductiveUnitWhereUniqueInput[]
    delete?: ProductiveUnitWhereUniqueInput | ProductiveUnitWhereUniqueInput[]
    connect?: ProductiveUnitWhereUniqueInput | ProductiveUnitWhereUniqueInput[]
    update?: ProductiveUnitUpdateWithWhereUniqueWithoutCompanyInput | ProductiveUnitUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: ProductiveUnitUpdateManyWithWhereWithoutCompanyInput | ProductiveUnitUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: ProductiveUnitScalarWhereInput | ProductiveUnitScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutCompanyNestedInput = {
    create?: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput> | UserCreateWithoutCompanyInput[] | UserUncheckedCreateWithoutCompanyInput[]
    connectOrCreate?: UserCreateOrConnectWithoutCompanyInput | UserCreateOrConnectWithoutCompanyInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutCompanyInput | UserUpsertWithWhereUniqueWithoutCompanyInput[]
    createMany?: UserCreateManyCompanyInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutCompanyInput | UserUpdateWithWhereUniqueWithoutCompanyInput[]
    updateMany?: UserUpdateManyWithWhereWithoutCompanyInput | UserUpdateManyWithWhereWithoutCompanyInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type CompanyCreateNestedOneWithoutProductive_unitsInput = {
    create?: XOR<CompanyCreateWithoutProductive_unitsInput, CompanyUncheckedCreateWithoutProductive_unitsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutProductive_unitsInput
    connect?: CompanyWhereUniqueInput
  }

  export type UserCreateNestedManyWithoutProductive_unitInput = {
    create?: XOR<UserCreateWithoutProductive_unitInput, UserUncheckedCreateWithoutProductive_unitInput> | UserCreateWithoutProductive_unitInput[] | UserUncheckedCreateWithoutProductive_unitInput[]
    connectOrCreate?: UserCreateOrConnectWithoutProductive_unitInput | UserCreateOrConnectWithoutProductive_unitInput[]
    createMany?: UserCreateManyProductive_unitInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutProductive_unitInput = {
    create?: XOR<UserCreateWithoutProductive_unitInput, UserUncheckedCreateWithoutProductive_unitInput> | UserCreateWithoutProductive_unitInput[] | UserUncheckedCreateWithoutProductive_unitInput[]
    connectOrCreate?: UserCreateOrConnectWithoutProductive_unitInput | UserCreateOrConnectWithoutProductive_unitInput[]
    createMany?: UserCreateManyProductive_unitInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type CompanyUpdateOneRequiredWithoutProductive_unitsNestedInput = {
    create?: XOR<CompanyCreateWithoutProductive_unitsInput, CompanyUncheckedCreateWithoutProductive_unitsInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutProductive_unitsInput
    upsert?: CompanyUpsertWithoutProductive_unitsInput
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutProductive_unitsInput, CompanyUpdateWithoutProductive_unitsInput>, CompanyUncheckedUpdateWithoutProductive_unitsInput>
  }

  export type UserUpdateManyWithoutProductive_unitNestedInput = {
    create?: XOR<UserCreateWithoutProductive_unitInput, UserUncheckedCreateWithoutProductive_unitInput> | UserCreateWithoutProductive_unitInput[] | UserUncheckedCreateWithoutProductive_unitInput[]
    connectOrCreate?: UserCreateOrConnectWithoutProductive_unitInput | UserCreateOrConnectWithoutProductive_unitInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutProductive_unitInput | UserUpsertWithWhereUniqueWithoutProductive_unitInput[]
    createMany?: UserCreateManyProductive_unitInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutProductive_unitInput | UserUpdateWithWhereUniqueWithoutProductive_unitInput[]
    updateMany?: UserUpdateManyWithWhereWithoutProductive_unitInput | UserUpdateManyWithWhereWithoutProductive_unitInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutProductive_unitNestedInput = {
    create?: XOR<UserCreateWithoutProductive_unitInput, UserUncheckedCreateWithoutProductive_unitInput> | UserCreateWithoutProductive_unitInput[] | UserUncheckedCreateWithoutProductive_unitInput[]
    connectOrCreate?: UserCreateOrConnectWithoutProductive_unitInput | UserCreateOrConnectWithoutProductive_unitInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutProductive_unitInput | UserUpsertWithWhereUniqueWithoutProductive_unitInput[]
    createMany?: UserCreateManyProductive_unitInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutProductive_unitInput | UserUpdateWithWhereUniqueWithoutProductive_unitInput[]
    updateMany?: UserUpdateManyWithWhereWithoutProductive_unitInput | UserUpdateManyWithWhereWithoutProductive_unitInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type CompanyCreateNestedOneWithoutUsersInput = {
    create?: XOR<CompanyCreateWithoutUsersInput, CompanyUncheckedCreateWithoutUsersInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutUsersInput
    connect?: CompanyWhereUniqueInput
  }

  export type ProductiveUnitCreateNestedOneWithoutUsersInput = {
    create?: XOR<ProductiveUnitCreateWithoutUsersInput, ProductiveUnitUncheckedCreateWithoutUsersInput>
    connectOrCreate?: ProductiveUnitCreateOrConnectWithoutUsersInput
    connect?: ProductiveUnitWhereUniqueInput
  }

  export type AuthSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<AuthSessionCreateWithoutUserInput, AuthSessionUncheckedCreateWithoutUserInput> | AuthSessionCreateWithoutUserInput[] | AuthSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutUserInput | AuthSessionCreateOrConnectWithoutUserInput[]
    createMany?: AuthSessionCreateManyUserInputEnvelope
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
  }

  export type UserBadgeCreateNestedManyWithoutUserInput = {
    create?: XOR<UserBadgeCreateWithoutUserInput, UserBadgeUncheckedCreateWithoutUserInput> | UserBadgeCreateWithoutUserInput[] | UserBadgeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutUserInput | UserBadgeCreateOrConnectWithoutUserInput[]
    createMany?: UserBadgeCreateManyUserInputEnvelope
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
  }

  export type UserBadgeCreateNestedManyWithoutAwardedByInput = {
    create?: XOR<UserBadgeCreateWithoutAwardedByInput, UserBadgeUncheckedCreateWithoutAwardedByInput> | UserBadgeCreateWithoutAwardedByInput[] | UserBadgeUncheckedCreateWithoutAwardedByInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutAwardedByInput | UserBadgeCreateOrConnectWithoutAwardedByInput[]
    createMany?: UserBadgeCreateManyAwardedByInputEnvelope
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
  }

  export type BadgeSubmissionCreateNestedManyWithoutUserInput = {
    create?: XOR<BadgeSubmissionCreateWithoutUserInput, BadgeSubmissionUncheckedCreateWithoutUserInput> | BadgeSubmissionCreateWithoutUserInput[] | BadgeSubmissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BadgeSubmissionCreateOrConnectWithoutUserInput | BadgeSubmissionCreateOrConnectWithoutUserInput[]
    createMany?: BadgeSubmissionCreateManyUserInputEnvelope
    connect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
  }

  export type BadgeSubmissionCreateNestedManyWithoutReviewedByInput = {
    create?: XOR<BadgeSubmissionCreateWithoutReviewedByInput, BadgeSubmissionUncheckedCreateWithoutReviewedByInput> | BadgeSubmissionCreateWithoutReviewedByInput[] | BadgeSubmissionUncheckedCreateWithoutReviewedByInput[]
    connectOrCreate?: BadgeSubmissionCreateOrConnectWithoutReviewedByInput | BadgeSubmissionCreateOrConnectWithoutReviewedByInput[]
    createMany?: BadgeSubmissionCreateManyReviewedByInputEnvelope
    connect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
  }

  export type NotificationCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type BadgeLegendSettingCreateNestedManyWithoutUpdatedByInput = {
    create?: XOR<BadgeLegendSettingCreateWithoutUpdatedByInput, BadgeLegendSettingUncheckedCreateWithoutUpdatedByInput> | BadgeLegendSettingCreateWithoutUpdatedByInput[] | BadgeLegendSettingUncheckedCreateWithoutUpdatedByInput[]
    connectOrCreate?: BadgeLegendSettingCreateOrConnectWithoutUpdatedByInput | BadgeLegendSettingCreateOrConnectWithoutUpdatedByInput[]
    createMany?: BadgeLegendSettingCreateManyUpdatedByInputEnvelope
    connect?: BadgeLegendSettingWhereUniqueInput | BadgeLegendSettingWhereUniqueInput[]
  }

  export type ImportRunCreateNestedManyWithoutImportedByInput = {
    create?: XOR<ImportRunCreateWithoutImportedByInput, ImportRunUncheckedCreateWithoutImportedByInput> | ImportRunCreateWithoutImportedByInput[] | ImportRunUncheckedCreateWithoutImportedByInput[]
    connectOrCreate?: ImportRunCreateOrConnectWithoutImportedByInput | ImportRunCreateOrConnectWithoutImportedByInput[]
    createMany?: ImportRunCreateManyImportedByInputEnvelope
    connect?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
  }

  export type AuthSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuthSessionCreateWithoutUserInput, AuthSessionUncheckedCreateWithoutUserInput> | AuthSessionCreateWithoutUserInput[] | AuthSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutUserInput | AuthSessionCreateOrConnectWithoutUserInput[]
    createMany?: AuthSessionCreateManyUserInputEnvelope
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
  }

  export type UserBadgeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserBadgeCreateWithoutUserInput, UserBadgeUncheckedCreateWithoutUserInput> | UserBadgeCreateWithoutUserInput[] | UserBadgeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutUserInput | UserBadgeCreateOrConnectWithoutUserInput[]
    createMany?: UserBadgeCreateManyUserInputEnvelope
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
  }

  export type UserBadgeUncheckedCreateNestedManyWithoutAwardedByInput = {
    create?: XOR<UserBadgeCreateWithoutAwardedByInput, UserBadgeUncheckedCreateWithoutAwardedByInput> | UserBadgeCreateWithoutAwardedByInput[] | UserBadgeUncheckedCreateWithoutAwardedByInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutAwardedByInput | UserBadgeCreateOrConnectWithoutAwardedByInput[]
    createMany?: UserBadgeCreateManyAwardedByInputEnvelope
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
  }

  export type BadgeSubmissionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<BadgeSubmissionCreateWithoutUserInput, BadgeSubmissionUncheckedCreateWithoutUserInput> | BadgeSubmissionCreateWithoutUserInput[] | BadgeSubmissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BadgeSubmissionCreateOrConnectWithoutUserInput | BadgeSubmissionCreateOrConnectWithoutUserInput[]
    createMany?: BadgeSubmissionCreateManyUserInputEnvelope
    connect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
  }

  export type BadgeSubmissionUncheckedCreateNestedManyWithoutReviewedByInput = {
    create?: XOR<BadgeSubmissionCreateWithoutReviewedByInput, BadgeSubmissionUncheckedCreateWithoutReviewedByInput> | BadgeSubmissionCreateWithoutReviewedByInput[] | BadgeSubmissionUncheckedCreateWithoutReviewedByInput[]
    connectOrCreate?: BadgeSubmissionCreateOrConnectWithoutReviewedByInput | BadgeSubmissionCreateOrConnectWithoutReviewedByInput[]
    createMany?: BadgeSubmissionCreateManyReviewedByInputEnvelope
    connect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
  }

  export type NotificationUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
  }

  export type BadgeLegendSettingUncheckedCreateNestedManyWithoutUpdatedByInput = {
    create?: XOR<BadgeLegendSettingCreateWithoutUpdatedByInput, BadgeLegendSettingUncheckedCreateWithoutUpdatedByInput> | BadgeLegendSettingCreateWithoutUpdatedByInput[] | BadgeLegendSettingUncheckedCreateWithoutUpdatedByInput[]
    connectOrCreate?: BadgeLegendSettingCreateOrConnectWithoutUpdatedByInput | BadgeLegendSettingCreateOrConnectWithoutUpdatedByInput[]
    createMany?: BadgeLegendSettingCreateManyUpdatedByInputEnvelope
    connect?: BadgeLegendSettingWhereUniqueInput | BadgeLegendSettingWhereUniqueInput[]
  }

  export type ImportRunUncheckedCreateNestedManyWithoutImportedByInput = {
    create?: XOR<ImportRunCreateWithoutImportedByInput, ImportRunUncheckedCreateWithoutImportedByInput> | ImportRunCreateWithoutImportedByInput[] | ImportRunUncheckedCreateWithoutImportedByInput[]
    connectOrCreate?: ImportRunCreateOrConnectWithoutImportedByInput | ImportRunCreateOrConnectWithoutImportedByInput[]
    createMany?: ImportRunCreateManyImportedByInputEnvelope
    connect?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type CompanyUpdateOneWithoutUsersNestedInput = {
    create?: XOR<CompanyCreateWithoutUsersInput, CompanyUncheckedCreateWithoutUsersInput>
    connectOrCreate?: CompanyCreateOrConnectWithoutUsersInput
    upsert?: CompanyUpsertWithoutUsersInput
    disconnect?: CompanyWhereInput | boolean
    delete?: CompanyWhereInput | boolean
    connect?: CompanyWhereUniqueInput
    update?: XOR<XOR<CompanyUpdateToOneWithWhereWithoutUsersInput, CompanyUpdateWithoutUsersInput>, CompanyUncheckedUpdateWithoutUsersInput>
  }

  export type ProductiveUnitUpdateOneWithoutUsersNestedInput = {
    create?: XOR<ProductiveUnitCreateWithoutUsersInput, ProductiveUnitUncheckedCreateWithoutUsersInput>
    connectOrCreate?: ProductiveUnitCreateOrConnectWithoutUsersInput
    upsert?: ProductiveUnitUpsertWithoutUsersInput
    disconnect?: ProductiveUnitWhereInput | boolean
    delete?: ProductiveUnitWhereInput | boolean
    connect?: ProductiveUnitWhereUniqueInput
    update?: XOR<XOR<ProductiveUnitUpdateToOneWithWhereWithoutUsersInput, ProductiveUnitUpdateWithoutUsersInput>, ProductiveUnitUncheckedUpdateWithoutUsersInput>
  }

  export type AuthSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuthSessionCreateWithoutUserInput, AuthSessionUncheckedCreateWithoutUserInput> | AuthSessionCreateWithoutUserInput[] | AuthSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutUserInput | AuthSessionCreateOrConnectWithoutUserInput[]
    upsert?: AuthSessionUpsertWithWhereUniqueWithoutUserInput | AuthSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuthSessionCreateManyUserInputEnvelope
    set?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    disconnect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    delete?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    update?: AuthSessionUpdateWithWhereUniqueWithoutUserInput | AuthSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuthSessionUpdateManyWithWhereWithoutUserInput | AuthSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
  }

  export type UserBadgeUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserBadgeCreateWithoutUserInput, UserBadgeUncheckedCreateWithoutUserInput> | UserBadgeCreateWithoutUserInput[] | UserBadgeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutUserInput | UserBadgeCreateOrConnectWithoutUserInput[]
    upsert?: UserBadgeUpsertWithWhereUniqueWithoutUserInput | UserBadgeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserBadgeCreateManyUserInputEnvelope
    set?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    disconnect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    delete?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    update?: UserBadgeUpdateWithWhereUniqueWithoutUserInput | UserBadgeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserBadgeUpdateManyWithWhereWithoutUserInput | UserBadgeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
  }

  export type UserBadgeUpdateManyWithoutAwardedByNestedInput = {
    create?: XOR<UserBadgeCreateWithoutAwardedByInput, UserBadgeUncheckedCreateWithoutAwardedByInput> | UserBadgeCreateWithoutAwardedByInput[] | UserBadgeUncheckedCreateWithoutAwardedByInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutAwardedByInput | UserBadgeCreateOrConnectWithoutAwardedByInput[]
    upsert?: UserBadgeUpsertWithWhereUniqueWithoutAwardedByInput | UserBadgeUpsertWithWhereUniqueWithoutAwardedByInput[]
    createMany?: UserBadgeCreateManyAwardedByInputEnvelope
    set?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    disconnect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    delete?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    update?: UserBadgeUpdateWithWhereUniqueWithoutAwardedByInput | UserBadgeUpdateWithWhereUniqueWithoutAwardedByInput[]
    updateMany?: UserBadgeUpdateManyWithWhereWithoutAwardedByInput | UserBadgeUpdateManyWithWhereWithoutAwardedByInput[]
    deleteMany?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
  }

  export type BadgeSubmissionUpdateManyWithoutUserNestedInput = {
    create?: XOR<BadgeSubmissionCreateWithoutUserInput, BadgeSubmissionUncheckedCreateWithoutUserInput> | BadgeSubmissionCreateWithoutUserInput[] | BadgeSubmissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BadgeSubmissionCreateOrConnectWithoutUserInput | BadgeSubmissionCreateOrConnectWithoutUserInput[]
    upsert?: BadgeSubmissionUpsertWithWhereUniqueWithoutUserInput | BadgeSubmissionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BadgeSubmissionCreateManyUserInputEnvelope
    set?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    disconnect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    delete?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    connect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    update?: BadgeSubmissionUpdateWithWhereUniqueWithoutUserInput | BadgeSubmissionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BadgeSubmissionUpdateManyWithWhereWithoutUserInput | BadgeSubmissionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BadgeSubmissionScalarWhereInput | BadgeSubmissionScalarWhereInput[]
  }

  export type BadgeSubmissionUpdateManyWithoutReviewedByNestedInput = {
    create?: XOR<BadgeSubmissionCreateWithoutReviewedByInput, BadgeSubmissionUncheckedCreateWithoutReviewedByInput> | BadgeSubmissionCreateWithoutReviewedByInput[] | BadgeSubmissionUncheckedCreateWithoutReviewedByInput[]
    connectOrCreate?: BadgeSubmissionCreateOrConnectWithoutReviewedByInput | BadgeSubmissionCreateOrConnectWithoutReviewedByInput[]
    upsert?: BadgeSubmissionUpsertWithWhereUniqueWithoutReviewedByInput | BadgeSubmissionUpsertWithWhereUniqueWithoutReviewedByInput[]
    createMany?: BadgeSubmissionCreateManyReviewedByInputEnvelope
    set?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    disconnect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    delete?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    connect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    update?: BadgeSubmissionUpdateWithWhereUniqueWithoutReviewedByInput | BadgeSubmissionUpdateWithWhereUniqueWithoutReviewedByInput[]
    updateMany?: BadgeSubmissionUpdateManyWithWhereWithoutReviewedByInput | BadgeSubmissionUpdateManyWithWhereWithoutReviewedByInput[]
    deleteMany?: BadgeSubmissionScalarWhereInput | BadgeSubmissionScalarWhereInput[]
  }

  export type NotificationUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type BadgeLegendSettingUpdateManyWithoutUpdatedByNestedInput = {
    create?: XOR<BadgeLegendSettingCreateWithoutUpdatedByInput, BadgeLegendSettingUncheckedCreateWithoutUpdatedByInput> | BadgeLegendSettingCreateWithoutUpdatedByInput[] | BadgeLegendSettingUncheckedCreateWithoutUpdatedByInput[]
    connectOrCreate?: BadgeLegendSettingCreateOrConnectWithoutUpdatedByInput | BadgeLegendSettingCreateOrConnectWithoutUpdatedByInput[]
    upsert?: BadgeLegendSettingUpsertWithWhereUniqueWithoutUpdatedByInput | BadgeLegendSettingUpsertWithWhereUniqueWithoutUpdatedByInput[]
    createMany?: BadgeLegendSettingCreateManyUpdatedByInputEnvelope
    set?: BadgeLegendSettingWhereUniqueInput | BadgeLegendSettingWhereUniqueInput[]
    disconnect?: BadgeLegendSettingWhereUniqueInput | BadgeLegendSettingWhereUniqueInput[]
    delete?: BadgeLegendSettingWhereUniqueInput | BadgeLegendSettingWhereUniqueInput[]
    connect?: BadgeLegendSettingWhereUniqueInput | BadgeLegendSettingWhereUniqueInput[]
    update?: BadgeLegendSettingUpdateWithWhereUniqueWithoutUpdatedByInput | BadgeLegendSettingUpdateWithWhereUniqueWithoutUpdatedByInput[]
    updateMany?: BadgeLegendSettingUpdateManyWithWhereWithoutUpdatedByInput | BadgeLegendSettingUpdateManyWithWhereWithoutUpdatedByInput[]
    deleteMany?: BadgeLegendSettingScalarWhereInput | BadgeLegendSettingScalarWhereInput[]
  }

  export type ImportRunUpdateManyWithoutImportedByNestedInput = {
    create?: XOR<ImportRunCreateWithoutImportedByInput, ImportRunUncheckedCreateWithoutImportedByInput> | ImportRunCreateWithoutImportedByInput[] | ImportRunUncheckedCreateWithoutImportedByInput[]
    connectOrCreate?: ImportRunCreateOrConnectWithoutImportedByInput | ImportRunCreateOrConnectWithoutImportedByInput[]
    upsert?: ImportRunUpsertWithWhereUniqueWithoutImportedByInput | ImportRunUpsertWithWhereUniqueWithoutImportedByInput[]
    createMany?: ImportRunCreateManyImportedByInputEnvelope
    set?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    disconnect?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    delete?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    connect?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    update?: ImportRunUpdateWithWhereUniqueWithoutImportedByInput | ImportRunUpdateWithWhereUniqueWithoutImportedByInput[]
    updateMany?: ImportRunUpdateManyWithWhereWithoutImportedByInput | ImportRunUpdateManyWithWhereWithoutImportedByInput[]
    deleteMany?: ImportRunScalarWhereInput | ImportRunScalarWhereInput[]
  }

  export type AuthSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuthSessionCreateWithoutUserInput, AuthSessionUncheckedCreateWithoutUserInput> | AuthSessionCreateWithoutUserInput[] | AuthSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuthSessionCreateOrConnectWithoutUserInput | AuthSessionCreateOrConnectWithoutUserInput[]
    upsert?: AuthSessionUpsertWithWhereUniqueWithoutUserInput | AuthSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuthSessionCreateManyUserInputEnvelope
    set?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    disconnect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    delete?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    connect?: AuthSessionWhereUniqueInput | AuthSessionWhereUniqueInput[]
    update?: AuthSessionUpdateWithWhereUniqueWithoutUserInput | AuthSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuthSessionUpdateManyWithWhereWithoutUserInput | AuthSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
  }

  export type UserBadgeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserBadgeCreateWithoutUserInput, UserBadgeUncheckedCreateWithoutUserInput> | UserBadgeCreateWithoutUserInput[] | UserBadgeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutUserInput | UserBadgeCreateOrConnectWithoutUserInput[]
    upsert?: UserBadgeUpsertWithWhereUniqueWithoutUserInput | UserBadgeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserBadgeCreateManyUserInputEnvelope
    set?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    disconnect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    delete?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    update?: UserBadgeUpdateWithWhereUniqueWithoutUserInput | UserBadgeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserBadgeUpdateManyWithWhereWithoutUserInput | UserBadgeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
  }

  export type UserBadgeUncheckedUpdateManyWithoutAwardedByNestedInput = {
    create?: XOR<UserBadgeCreateWithoutAwardedByInput, UserBadgeUncheckedCreateWithoutAwardedByInput> | UserBadgeCreateWithoutAwardedByInput[] | UserBadgeUncheckedCreateWithoutAwardedByInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutAwardedByInput | UserBadgeCreateOrConnectWithoutAwardedByInput[]
    upsert?: UserBadgeUpsertWithWhereUniqueWithoutAwardedByInput | UserBadgeUpsertWithWhereUniqueWithoutAwardedByInput[]
    createMany?: UserBadgeCreateManyAwardedByInputEnvelope
    set?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    disconnect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    delete?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    update?: UserBadgeUpdateWithWhereUniqueWithoutAwardedByInput | UserBadgeUpdateWithWhereUniqueWithoutAwardedByInput[]
    updateMany?: UserBadgeUpdateManyWithWhereWithoutAwardedByInput | UserBadgeUpdateManyWithWhereWithoutAwardedByInput[]
    deleteMany?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
  }

  export type BadgeSubmissionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<BadgeSubmissionCreateWithoutUserInput, BadgeSubmissionUncheckedCreateWithoutUserInput> | BadgeSubmissionCreateWithoutUserInput[] | BadgeSubmissionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: BadgeSubmissionCreateOrConnectWithoutUserInput | BadgeSubmissionCreateOrConnectWithoutUserInput[]
    upsert?: BadgeSubmissionUpsertWithWhereUniqueWithoutUserInput | BadgeSubmissionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: BadgeSubmissionCreateManyUserInputEnvelope
    set?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    disconnect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    delete?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    connect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    update?: BadgeSubmissionUpdateWithWhereUniqueWithoutUserInput | BadgeSubmissionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: BadgeSubmissionUpdateManyWithWhereWithoutUserInput | BadgeSubmissionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: BadgeSubmissionScalarWhereInput | BadgeSubmissionScalarWhereInput[]
  }

  export type BadgeSubmissionUncheckedUpdateManyWithoutReviewedByNestedInput = {
    create?: XOR<BadgeSubmissionCreateWithoutReviewedByInput, BadgeSubmissionUncheckedCreateWithoutReviewedByInput> | BadgeSubmissionCreateWithoutReviewedByInput[] | BadgeSubmissionUncheckedCreateWithoutReviewedByInput[]
    connectOrCreate?: BadgeSubmissionCreateOrConnectWithoutReviewedByInput | BadgeSubmissionCreateOrConnectWithoutReviewedByInput[]
    upsert?: BadgeSubmissionUpsertWithWhereUniqueWithoutReviewedByInput | BadgeSubmissionUpsertWithWhereUniqueWithoutReviewedByInput[]
    createMany?: BadgeSubmissionCreateManyReviewedByInputEnvelope
    set?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    disconnect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    delete?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    connect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    update?: BadgeSubmissionUpdateWithWhereUniqueWithoutReviewedByInput | BadgeSubmissionUpdateWithWhereUniqueWithoutReviewedByInput[]
    updateMany?: BadgeSubmissionUpdateManyWithWhereWithoutReviewedByInput | BadgeSubmissionUpdateManyWithWhereWithoutReviewedByInput[]
    deleteMany?: BadgeSubmissionScalarWhereInput | BadgeSubmissionScalarWhereInput[]
  }

  export type NotificationUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput> | NotificationCreateWithoutUserInput[] | NotificationUncheckedCreateWithoutUserInput[]
    connectOrCreate?: NotificationCreateOrConnectWithoutUserInput | NotificationCreateOrConnectWithoutUserInput[]
    upsert?: NotificationUpsertWithWhereUniqueWithoutUserInput | NotificationUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: NotificationCreateManyUserInputEnvelope
    set?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    disconnect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    delete?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    connect?: NotificationWhereUniqueInput | NotificationWhereUniqueInput[]
    update?: NotificationUpdateWithWhereUniqueWithoutUserInput | NotificationUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: NotificationUpdateManyWithWhereWithoutUserInput | NotificationUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
  }

  export type BadgeLegendSettingUncheckedUpdateManyWithoutUpdatedByNestedInput = {
    create?: XOR<BadgeLegendSettingCreateWithoutUpdatedByInput, BadgeLegendSettingUncheckedCreateWithoutUpdatedByInput> | BadgeLegendSettingCreateWithoutUpdatedByInput[] | BadgeLegendSettingUncheckedCreateWithoutUpdatedByInput[]
    connectOrCreate?: BadgeLegendSettingCreateOrConnectWithoutUpdatedByInput | BadgeLegendSettingCreateOrConnectWithoutUpdatedByInput[]
    upsert?: BadgeLegendSettingUpsertWithWhereUniqueWithoutUpdatedByInput | BadgeLegendSettingUpsertWithWhereUniqueWithoutUpdatedByInput[]
    createMany?: BadgeLegendSettingCreateManyUpdatedByInputEnvelope
    set?: BadgeLegendSettingWhereUniqueInput | BadgeLegendSettingWhereUniqueInput[]
    disconnect?: BadgeLegendSettingWhereUniqueInput | BadgeLegendSettingWhereUniqueInput[]
    delete?: BadgeLegendSettingWhereUniqueInput | BadgeLegendSettingWhereUniqueInput[]
    connect?: BadgeLegendSettingWhereUniqueInput | BadgeLegendSettingWhereUniqueInput[]
    update?: BadgeLegendSettingUpdateWithWhereUniqueWithoutUpdatedByInput | BadgeLegendSettingUpdateWithWhereUniqueWithoutUpdatedByInput[]
    updateMany?: BadgeLegendSettingUpdateManyWithWhereWithoutUpdatedByInput | BadgeLegendSettingUpdateManyWithWhereWithoutUpdatedByInput[]
    deleteMany?: BadgeLegendSettingScalarWhereInput | BadgeLegendSettingScalarWhereInput[]
  }

  export type ImportRunUncheckedUpdateManyWithoutImportedByNestedInput = {
    create?: XOR<ImportRunCreateWithoutImportedByInput, ImportRunUncheckedCreateWithoutImportedByInput> | ImportRunCreateWithoutImportedByInput[] | ImportRunUncheckedCreateWithoutImportedByInput[]
    connectOrCreate?: ImportRunCreateOrConnectWithoutImportedByInput | ImportRunCreateOrConnectWithoutImportedByInput[]
    upsert?: ImportRunUpsertWithWhereUniqueWithoutImportedByInput | ImportRunUpsertWithWhereUniqueWithoutImportedByInput[]
    createMany?: ImportRunCreateManyImportedByInputEnvelope
    set?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    disconnect?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    delete?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    connect?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    update?: ImportRunUpdateWithWhereUniqueWithoutImportedByInput | ImportRunUpdateWithWhereUniqueWithoutImportedByInput[]
    updateMany?: ImportRunUpdateManyWithWhereWithoutImportedByInput | ImportRunUpdateManyWithWhereWithoutImportedByInput[]
    deleteMany?: ImportRunScalarWhereInput | ImportRunScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserBadgeCreateNestedManyWithoutBadgeInput = {
    create?: XOR<UserBadgeCreateWithoutBadgeInput, UserBadgeUncheckedCreateWithoutBadgeInput> | UserBadgeCreateWithoutBadgeInput[] | UserBadgeUncheckedCreateWithoutBadgeInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutBadgeInput | UserBadgeCreateOrConnectWithoutBadgeInput[]
    createMany?: UserBadgeCreateManyBadgeInputEnvelope
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
  }

  export type BadgeSubmissionCreateNestedManyWithoutBadgeInput = {
    create?: XOR<BadgeSubmissionCreateWithoutBadgeInput, BadgeSubmissionUncheckedCreateWithoutBadgeInput> | BadgeSubmissionCreateWithoutBadgeInput[] | BadgeSubmissionUncheckedCreateWithoutBadgeInput[]
    connectOrCreate?: BadgeSubmissionCreateOrConnectWithoutBadgeInput | BadgeSubmissionCreateOrConnectWithoutBadgeInput[]
    createMany?: BadgeSubmissionCreateManyBadgeInputEnvelope
    connect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
  }

  export type UserBadgeUncheckedCreateNestedManyWithoutBadgeInput = {
    create?: XOR<UserBadgeCreateWithoutBadgeInput, UserBadgeUncheckedCreateWithoutBadgeInput> | UserBadgeCreateWithoutBadgeInput[] | UserBadgeUncheckedCreateWithoutBadgeInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutBadgeInput | UserBadgeCreateOrConnectWithoutBadgeInput[]
    createMany?: UserBadgeCreateManyBadgeInputEnvelope
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
  }

  export type BadgeSubmissionUncheckedCreateNestedManyWithoutBadgeInput = {
    create?: XOR<BadgeSubmissionCreateWithoutBadgeInput, BadgeSubmissionUncheckedCreateWithoutBadgeInput> | BadgeSubmissionCreateWithoutBadgeInput[] | BadgeSubmissionUncheckedCreateWithoutBadgeInput[]
    connectOrCreate?: BadgeSubmissionCreateOrConnectWithoutBadgeInput | BadgeSubmissionCreateOrConnectWithoutBadgeInput[]
    createMany?: BadgeSubmissionCreateManyBadgeInputEnvelope
    connect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
  }

  export type UserBadgeUpdateManyWithoutBadgeNestedInput = {
    create?: XOR<UserBadgeCreateWithoutBadgeInput, UserBadgeUncheckedCreateWithoutBadgeInput> | UserBadgeCreateWithoutBadgeInput[] | UserBadgeUncheckedCreateWithoutBadgeInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutBadgeInput | UserBadgeCreateOrConnectWithoutBadgeInput[]
    upsert?: UserBadgeUpsertWithWhereUniqueWithoutBadgeInput | UserBadgeUpsertWithWhereUniqueWithoutBadgeInput[]
    createMany?: UserBadgeCreateManyBadgeInputEnvelope
    set?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    disconnect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    delete?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    update?: UserBadgeUpdateWithWhereUniqueWithoutBadgeInput | UserBadgeUpdateWithWhereUniqueWithoutBadgeInput[]
    updateMany?: UserBadgeUpdateManyWithWhereWithoutBadgeInput | UserBadgeUpdateManyWithWhereWithoutBadgeInput[]
    deleteMany?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
  }

  export type BadgeSubmissionUpdateManyWithoutBadgeNestedInput = {
    create?: XOR<BadgeSubmissionCreateWithoutBadgeInput, BadgeSubmissionUncheckedCreateWithoutBadgeInput> | BadgeSubmissionCreateWithoutBadgeInput[] | BadgeSubmissionUncheckedCreateWithoutBadgeInput[]
    connectOrCreate?: BadgeSubmissionCreateOrConnectWithoutBadgeInput | BadgeSubmissionCreateOrConnectWithoutBadgeInput[]
    upsert?: BadgeSubmissionUpsertWithWhereUniqueWithoutBadgeInput | BadgeSubmissionUpsertWithWhereUniqueWithoutBadgeInput[]
    createMany?: BadgeSubmissionCreateManyBadgeInputEnvelope
    set?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    disconnect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    delete?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    connect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    update?: BadgeSubmissionUpdateWithWhereUniqueWithoutBadgeInput | BadgeSubmissionUpdateWithWhereUniqueWithoutBadgeInput[]
    updateMany?: BadgeSubmissionUpdateManyWithWhereWithoutBadgeInput | BadgeSubmissionUpdateManyWithWhereWithoutBadgeInput[]
    deleteMany?: BadgeSubmissionScalarWhereInput | BadgeSubmissionScalarWhereInput[]
  }

  export type UserBadgeUncheckedUpdateManyWithoutBadgeNestedInput = {
    create?: XOR<UserBadgeCreateWithoutBadgeInput, UserBadgeUncheckedCreateWithoutBadgeInput> | UserBadgeCreateWithoutBadgeInput[] | UserBadgeUncheckedCreateWithoutBadgeInput[]
    connectOrCreate?: UserBadgeCreateOrConnectWithoutBadgeInput | UserBadgeCreateOrConnectWithoutBadgeInput[]
    upsert?: UserBadgeUpsertWithWhereUniqueWithoutBadgeInput | UserBadgeUpsertWithWhereUniqueWithoutBadgeInput[]
    createMany?: UserBadgeCreateManyBadgeInputEnvelope
    set?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    disconnect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    delete?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    connect?: UserBadgeWhereUniqueInput | UserBadgeWhereUniqueInput[]
    update?: UserBadgeUpdateWithWhereUniqueWithoutBadgeInput | UserBadgeUpdateWithWhereUniqueWithoutBadgeInput[]
    updateMany?: UserBadgeUpdateManyWithWhereWithoutBadgeInput | UserBadgeUpdateManyWithWhereWithoutBadgeInput[]
    deleteMany?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
  }

  export type BadgeSubmissionUncheckedUpdateManyWithoutBadgeNestedInput = {
    create?: XOR<BadgeSubmissionCreateWithoutBadgeInput, BadgeSubmissionUncheckedCreateWithoutBadgeInput> | BadgeSubmissionCreateWithoutBadgeInput[] | BadgeSubmissionUncheckedCreateWithoutBadgeInput[]
    connectOrCreate?: BadgeSubmissionCreateOrConnectWithoutBadgeInput | BadgeSubmissionCreateOrConnectWithoutBadgeInput[]
    upsert?: BadgeSubmissionUpsertWithWhereUniqueWithoutBadgeInput | BadgeSubmissionUpsertWithWhereUniqueWithoutBadgeInput[]
    createMany?: BadgeSubmissionCreateManyBadgeInputEnvelope
    set?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    disconnect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    delete?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    connect?: BadgeSubmissionWhereUniqueInput | BadgeSubmissionWhereUniqueInput[]
    update?: BadgeSubmissionUpdateWithWhereUniqueWithoutBadgeInput | BadgeSubmissionUpdateWithWhereUniqueWithoutBadgeInput[]
    updateMany?: BadgeSubmissionUpdateManyWithWhereWithoutBadgeInput | BadgeSubmissionUpdateManyWithWhereWithoutBadgeInput[]
    deleteMany?: BadgeSubmissionScalarWhereInput | BadgeSubmissionScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutBadge_legend_settingsInput = {
    create?: XOR<UserCreateWithoutBadge_legend_settingsInput, UserUncheckedCreateWithoutBadge_legend_settingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBadge_legend_settingsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutBadge_legend_settingsNestedInput = {
    create?: XOR<UserCreateWithoutBadge_legend_settingsInput, UserUncheckedCreateWithoutBadge_legend_settingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutBadge_legend_settingsInput
    upsert?: UserUpsertWithoutBadge_legend_settingsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutBadge_legend_settingsInput, UserUpdateWithoutBadge_legend_settingsInput>, UserUncheckedUpdateWithoutBadge_legend_settingsInput>
  }

  export type UserCreateNestedOneWithoutUser_badgesInput = {
    create?: XOR<UserCreateWithoutUser_badgesInput, UserUncheckedCreateWithoutUser_badgesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUser_badgesInput
    connect?: UserWhereUniqueInput
  }

  export type BadgeCreateNestedOneWithoutUser_badgesInput = {
    create?: XOR<BadgeCreateWithoutUser_badgesInput, BadgeUncheckedCreateWithoutUser_badgesInput>
    connectOrCreate?: BadgeCreateOrConnectWithoutUser_badgesInput
    connect?: BadgeWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutAwarded_badgesInput = {
    create?: XOR<UserCreateWithoutAwarded_badgesInput, UserUncheckedCreateWithoutAwarded_badgesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAwarded_badgesInput
    connect?: UserWhereUniqueInput
  }

  export type EnumBadgeToneFieldUpdateOperationsInput = {
    set?: $Enums.BadgeTone
  }

  export type UserUpdateOneRequiredWithoutUser_badgesNestedInput = {
    create?: XOR<UserCreateWithoutUser_badgesInput, UserUncheckedCreateWithoutUser_badgesInput>
    connectOrCreate?: UserCreateOrConnectWithoutUser_badgesInput
    upsert?: UserUpsertWithoutUser_badgesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUser_badgesInput, UserUpdateWithoutUser_badgesInput>, UserUncheckedUpdateWithoutUser_badgesInput>
  }

  export type BadgeUpdateOneRequiredWithoutUser_badgesNestedInput = {
    create?: XOR<BadgeCreateWithoutUser_badgesInput, BadgeUncheckedCreateWithoutUser_badgesInput>
    connectOrCreate?: BadgeCreateOrConnectWithoutUser_badgesInput
    upsert?: BadgeUpsertWithoutUser_badgesInput
    connect?: BadgeWhereUniqueInput
    update?: XOR<XOR<BadgeUpdateToOneWithWhereWithoutUser_badgesInput, BadgeUpdateWithoutUser_badgesInput>, BadgeUncheckedUpdateWithoutUser_badgesInput>
  }

  export type UserUpdateOneWithoutAwarded_badgesNestedInput = {
    create?: XOR<UserCreateWithoutAwarded_badgesInput, UserUncheckedCreateWithoutAwarded_badgesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAwarded_badgesInput
    upsert?: UserUpsertWithoutAwarded_badgesInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAwarded_badgesInput, UserUpdateWithoutAwarded_badgesInput>, UserUncheckedUpdateWithoutAwarded_badgesInput>
  }

  export type UserCreateNestedOneWithoutSubmissionsInput = {
    create?: XOR<UserCreateWithoutSubmissionsInput, UserUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubmissionsInput
    connect?: UserWhereUniqueInput
  }

  export type BadgeCreateNestedOneWithoutSubmissionsInput = {
    create?: XOR<BadgeCreateWithoutSubmissionsInput, BadgeUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: BadgeCreateOrConnectWithoutSubmissionsInput
    connect?: BadgeWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReviewed_submissionsInput = {
    create?: XOR<UserCreateWithoutReviewed_submissionsInput, UserUncheckedCreateWithoutReviewed_submissionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewed_submissionsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumSubmissionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SubmissionStatus
  }

  export type UserUpdateOneRequiredWithoutSubmissionsNestedInput = {
    create?: XOR<UserCreateWithoutSubmissionsInput, UserUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSubmissionsInput
    upsert?: UserUpsertWithoutSubmissionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSubmissionsInput, UserUpdateWithoutSubmissionsInput>, UserUncheckedUpdateWithoutSubmissionsInput>
  }

  export type BadgeUpdateOneRequiredWithoutSubmissionsNestedInput = {
    create?: XOR<BadgeCreateWithoutSubmissionsInput, BadgeUncheckedCreateWithoutSubmissionsInput>
    connectOrCreate?: BadgeCreateOrConnectWithoutSubmissionsInput
    upsert?: BadgeUpsertWithoutSubmissionsInput
    connect?: BadgeWhereUniqueInput
    update?: XOR<XOR<BadgeUpdateToOneWithWhereWithoutSubmissionsInput, BadgeUpdateWithoutSubmissionsInput>, BadgeUncheckedUpdateWithoutSubmissionsInput>
  }

  export type UserUpdateOneWithoutReviewed_submissionsNestedInput = {
    create?: XOR<UserCreateWithoutReviewed_submissionsInput, UserUncheckedCreateWithoutReviewed_submissionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewed_submissionsInput
    upsert?: UserUpsertWithoutReviewed_submissionsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReviewed_submissionsInput, UserUpdateWithoutReviewed_submissionsInput>, UserUncheckedUpdateWithoutReviewed_submissionsInput>
  }

  export type UserCreateNestedOneWithoutNotificationsInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutNotificationsNestedInput = {
    create?: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutNotificationsInput
    upsert?: UserUpsertWithoutNotificationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutNotificationsInput, UserUpdateWithoutNotificationsInput>, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type ImportRunCreateNestedManyWithoutSourceInput = {
    create?: XOR<ImportRunCreateWithoutSourceInput, ImportRunUncheckedCreateWithoutSourceInput> | ImportRunCreateWithoutSourceInput[] | ImportRunUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: ImportRunCreateOrConnectWithoutSourceInput | ImportRunCreateOrConnectWithoutSourceInput[]
    createMany?: ImportRunCreateManySourceInputEnvelope
    connect?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
  }

  export type ImportRunUncheckedCreateNestedManyWithoutSourceInput = {
    create?: XOR<ImportRunCreateWithoutSourceInput, ImportRunUncheckedCreateWithoutSourceInput> | ImportRunCreateWithoutSourceInput[] | ImportRunUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: ImportRunCreateOrConnectWithoutSourceInput | ImportRunCreateOrConnectWithoutSourceInput[]
    createMany?: ImportRunCreateManySourceInputEnvelope
    connect?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
  }

  export type ImportRunUpdateManyWithoutSourceNestedInput = {
    create?: XOR<ImportRunCreateWithoutSourceInput, ImportRunUncheckedCreateWithoutSourceInput> | ImportRunCreateWithoutSourceInput[] | ImportRunUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: ImportRunCreateOrConnectWithoutSourceInput | ImportRunCreateOrConnectWithoutSourceInput[]
    upsert?: ImportRunUpsertWithWhereUniqueWithoutSourceInput | ImportRunUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: ImportRunCreateManySourceInputEnvelope
    set?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    disconnect?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    delete?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    connect?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    update?: ImportRunUpdateWithWhereUniqueWithoutSourceInput | ImportRunUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: ImportRunUpdateManyWithWhereWithoutSourceInput | ImportRunUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: ImportRunScalarWhereInput | ImportRunScalarWhereInput[]
  }

  export type ImportRunUncheckedUpdateManyWithoutSourceNestedInput = {
    create?: XOR<ImportRunCreateWithoutSourceInput, ImportRunUncheckedCreateWithoutSourceInput> | ImportRunCreateWithoutSourceInput[] | ImportRunUncheckedCreateWithoutSourceInput[]
    connectOrCreate?: ImportRunCreateOrConnectWithoutSourceInput | ImportRunCreateOrConnectWithoutSourceInput[]
    upsert?: ImportRunUpsertWithWhereUniqueWithoutSourceInput | ImportRunUpsertWithWhereUniqueWithoutSourceInput[]
    createMany?: ImportRunCreateManySourceInputEnvelope
    set?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    disconnect?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    delete?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    connect?: ImportRunWhereUniqueInput | ImportRunWhereUniqueInput[]
    update?: ImportRunUpdateWithWhereUniqueWithoutSourceInput | ImportRunUpdateWithWhereUniqueWithoutSourceInput[]
    updateMany?: ImportRunUpdateManyWithWhereWithoutSourceInput | ImportRunUpdateManyWithWhereWithoutSourceInput[]
    deleteMany?: ImportRunScalarWhereInput | ImportRunScalarWhereInput[]
  }

  export type ImportSourceCreateNestedOneWithoutImport_runsInput = {
    create?: XOR<ImportSourceCreateWithoutImport_runsInput, ImportSourceUncheckedCreateWithoutImport_runsInput>
    connectOrCreate?: ImportSourceCreateOrConnectWithoutImport_runsInput
    connect?: ImportSourceWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutImport_runsInput = {
    create?: XOR<UserCreateWithoutImport_runsInput, UserUncheckedCreateWithoutImport_runsInput>
    connectOrCreate?: UserCreateOrConnectWithoutImport_runsInput
    connect?: UserWhereUniqueInput
  }

  export type ImportRunRowCreateNestedManyWithoutImport_runInput = {
    create?: XOR<ImportRunRowCreateWithoutImport_runInput, ImportRunRowUncheckedCreateWithoutImport_runInput> | ImportRunRowCreateWithoutImport_runInput[] | ImportRunRowUncheckedCreateWithoutImport_runInput[]
    connectOrCreate?: ImportRunRowCreateOrConnectWithoutImport_runInput | ImportRunRowCreateOrConnectWithoutImport_runInput[]
    createMany?: ImportRunRowCreateManyImport_runInputEnvelope
    connect?: ImportRunRowWhereUniqueInput | ImportRunRowWhereUniqueInput[]
  }

  export type ImportRunRowUncheckedCreateNestedManyWithoutImport_runInput = {
    create?: XOR<ImportRunRowCreateWithoutImport_runInput, ImportRunRowUncheckedCreateWithoutImport_runInput> | ImportRunRowCreateWithoutImport_runInput[] | ImportRunRowUncheckedCreateWithoutImport_runInput[]
    connectOrCreate?: ImportRunRowCreateOrConnectWithoutImport_runInput | ImportRunRowCreateOrConnectWithoutImport_runInput[]
    createMany?: ImportRunRowCreateManyImport_runInputEnvelope
    connect?: ImportRunRowWhereUniqueInput | ImportRunRowWhereUniqueInput[]
  }

  export type EnumImportRunStatusFieldUpdateOperationsInput = {
    set?: $Enums.ImportRunStatus
  }

  export type ImportSourceUpdateOneWithoutImport_runsNestedInput = {
    create?: XOR<ImportSourceCreateWithoutImport_runsInput, ImportSourceUncheckedCreateWithoutImport_runsInput>
    connectOrCreate?: ImportSourceCreateOrConnectWithoutImport_runsInput
    upsert?: ImportSourceUpsertWithoutImport_runsInput
    disconnect?: ImportSourceWhereInput | boolean
    delete?: ImportSourceWhereInput | boolean
    connect?: ImportSourceWhereUniqueInput
    update?: XOR<XOR<ImportSourceUpdateToOneWithWhereWithoutImport_runsInput, ImportSourceUpdateWithoutImport_runsInput>, ImportSourceUncheckedUpdateWithoutImport_runsInput>
  }

  export type UserUpdateOneWithoutImport_runsNestedInput = {
    create?: XOR<UserCreateWithoutImport_runsInput, UserUncheckedCreateWithoutImport_runsInput>
    connectOrCreate?: UserCreateOrConnectWithoutImport_runsInput
    upsert?: UserUpsertWithoutImport_runsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutImport_runsInput, UserUpdateWithoutImport_runsInput>, UserUncheckedUpdateWithoutImport_runsInput>
  }

  export type ImportRunRowUpdateManyWithoutImport_runNestedInput = {
    create?: XOR<ImportRunRowCreateWithoutImport_runInput, ImportRunRowUncheckedCreateWithoutImport_runInput> | ImportRunRowCreateWithoutImport_runInput[] | ImportRunRowUncheckedCreateWithoutImport_runInput[]
    connectOrCreate?: ImportRunRowCreateOrConnectWithoutImport_runInput | ImportRunRowCreateOrConnectWithoutImport_runInput[]
    upsert?: ImportRunRowUpsertWithWhereUniqueWithoutImport_runInput | ImportRunRowUpsertWithWhereUniqueWithoutImport_runInput[]
    createMany?: ImportRunRowCreateManyImport_runInputEnvelope
    set?: ImportRunRowWhereUniqueInput | ImportRunRowWhereUniqueInput[]
    disconnect?: ImportRunRowWhereUniqueInput | ImportRunRowWhereUniqueInput[]
    delete?: ImportRunRowWhereUniqueInput | ImportRunRowWhereUniqueInput[]
    connect?: ImportRunRowWhereUniqueInput | ImportRunRowWhereUniqueInput[]
    update?: ImportRunRowUpdateWithWhereUniqueWithoutImport_runInput | ImportRunRowUpdateWithWhereUniqueWithoutImport_runInput[]
    updateMany?: ImportRunRowUpdateManyWithWhereWithoutImport_runInput | ImportRunRowUpdateManyWithWhereWithoutImport_runInput[]
    deleteMany?: ImportRunRowScalarWhereInput | ImportRunRowScalarWhereInput[]
  }

  export type ImportRunRowUncheckedUpdateManyWithoutImport_runNestedInput = {
    create?: XOR<ImportRunRowCreateWithoutImport_runInput, ImportRunRowUncheckedCreateWithoutImport_runInput> | ImportRunRowCreateWithoutImport_runInput[] | ImportRunRowUncheckedCreateWithoutImport_runInput[]
    connectOrCreate?: ImportRunRowCreateOrConnectWithoutImport_runInput | ImportRunRowCreateOrConnectWithoutImport_runInput[]
    upsert?: ImportRunRowUpsertWithWhereUniqueWithoutImport_runInput | ImportRunRowUpsertWithWhereUniqueWithoutImport_runInput[]
    createMany?: ImportRunRowCreateManyImport_runInputEnvelope
    set?: ImportRunRowWhereUniqueInput | ImportRunRowWhereUniqueInput[]
    disconnect?: ImportRunRowWhereUniqueInput | ImportRunRowWhereUniqueInput[]
    delete?: ImportRunRowWhereUniqueInput | ImportRunRowWhereUniqueInput[]
    connect?: ImportRunRowWhereUniqueInput | ImportRunRowWhereUniqueInput[]
    update?: ImportRunRowUpdateWithWhereUniqueWithoutImport_runInput | ImportRunRowUpdateWithWhereUniqueWithoutImport_runInput[]
    updateMany?: ImportRunRowUpdateManyWithWhereWithoutImport_runInput | ImportRunRowUpdateManyWithWhereWithoutImport_runInput[]
    deleteMany?: ImportRunRowScalarWhereInput | ImportRunRowScalarWhereInput[]
  }

  export type ImportRunCreateNestedOneWithoutRowsInput = {
    create?: XOR<ImportRunCreateWithoutRowsInput, ImportRunUncheckedCreateWithoutRowsInput>
    connectOrCreate?: ImportRunCreateOrConnectWithoutRowsInput
    connect?: ImportRunWhereUniqueInput
  }

  export type EnumImportRowStatusFieldUpdateOperationsInput = {
    set?: $Enums.ImportRowStatus
  }

  export type ImportRunUpdateOneRequiredWithoutRowsNestedInput = {
    create?: XOR<ImportRunCreateWithoutRowsInput, ImportRunUncheckedCreateWithoutRowsInput>
    connectOrCreate?: ImportRunCreateOrConnectWithoutRowsInput
    upsert?: ImportRunUpsertWithoutRowsInput
    connect?: ImportRunWhereUniqueInput
    update?: XOR<XOR<ImportRunUpdateToOneWithWhereWithoutRowsInput, ImportRunUpdateWithoutRowsInput>, ImportRunUncheckedUpdateWithoutRowsInput>
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

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type NestedUuidNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableFilter<$PrismaModel> | string | null
  }

  export type NestedUuidNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumBadgeToneFilter<$PrismaModel = never> = {
    equals?: $Enums.BadgeTone | EnumBadgeToneFieldRefInput<$PrismaModel>
    in?: $Enums.BadgeTone[] | ListEnumBadgeToneFieldRefInput<$PrismaModel>
    notIn?: $Enums.BadgeTone[] | ListEnumBadgeToneFieldRefInput<$PrismaModel>
    not?: NestedEnumBadgeToneFilter<$PrismaModel> | $Enums.BadgeTone
  }

  export type NestedEnumBadgeToneWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BadgeTone | EnumBadgeToneFieldRefInput<$PrismaModel>
    in?: $Enums.BadgeTone[] | ListEnumBadgeToneFieldRefInput<$PrismaModel>
    notIn?: $Enums.BadgeTone[] | ListEnumBadgeToneFieldRefInput<$PrismaModel>
    not?: NestedEnumBadgeToneWithAggregatesFilter<$PrismaModel> | $Enums.BadgeTone
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumBadgeToneFilter<$PrismaModel>
    _max?: NestedEnumBadgeToneFilter<$PrismaModel>
  }

  export type NestedEnumSubmissionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubmissionStatus | EnumSubmissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubmissionStatusFilter<$PrismaModel> | $Enums.SubmissionStatus
  }

  export type NestedEnumSubmissionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubmissionStatus | EnumSubmissionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubmissionStatus[] | ListEnumSubmissionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubmissionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubmissionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubmissionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubmissionStatusFilter<$PrismaModel>
  }

  export type NestedEnumImportRunStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportRunStatus | EnumImportRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ImportRunStatus[] | ListEnumImportRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ImportRunStatus[] | ListEnumImportRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumImportRunStatusFilter<$PrismaModel> | $Enums.ImportRunStatus
  }

  export type NestedEnumImportRunStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportRunStatus | EnumImportRunStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ImportRunStatus[] | ListEnumImportRunStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ImportRunStatus[] | ListEnumImportRunStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumImportRunStatusWithAggregatesFilter<$PrismaModel> | $Enums.ImportRunStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumImportRunStatusFilter<$PrismaModel>
    _max?: NestedEnumImportRunStatusFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumImportRowStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportRowStatus | EnumImportRowStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ImportRowStatus[] | ListEnumImportRowStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ImportRowStatus[] | ListEnumImportRowStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumImportRowStatusFilter<$PrismaModel> | $Enums.ImportRowStatus
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumImportRowStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ImportRowStatus | EnumImportRowStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ImportRowStatus[] | ListEnumImportRowStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ImportRowStatus[] | ListEnumImportRowStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumImportRowStatusWithAggregatesFilter<$PrismaModel> | $Enums.ImportRowStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumImportRowStatusFilter<$PrismaModel>
    _max?: NestedEnumImportRowStatusFilter<$PrismaModel>
  }

  export type ProductiveUnitCreateWithoutCompanyInput = {
    id: string
    name: string
    created_at?: Date | string
    users?: UserCreateNestedManyWithoutProductive_unitInput
  }

  export type ProductiveUnitUncheckedCreateWithoutCompanyInput = {
    id: string
    name: string
    created_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutProductive_unitInput
  }

  export type ProductiveUnitCreateOrConnectWithoutCompanyInput = {
    where: ProductiveUnitWhereUniqueInput
    create: XOR<ProductiveUnitCreateWithoutCompanyInput, ProductiveUnitUncheckedCreateWithoutCompanyInput>
  }

  export type ProductiveUnitCreateManyCompanyInputEnvelope = {
    data: ProductiveUnitCreateManyCompanyInput | ProductiveUnitCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutCompanyInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    productive_unit?: ProductiveUnitCreateNestedOneWithoutUsersInput
    sessions?: AuthSessionCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunCreateNestedManyWithoutImportedByInput
  }

  export type UserUncheckedCreateWithoutCompanyInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    productive_unit_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeUncheckedCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingUncheckedCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunUncheckedCreateNestedManyWithoutImportedByInput
  }

  export type UserCreateOrConnectWithoutCompanyInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput>
  }

  export type UserCreateManyCompanyInputEnvelope = {
    data: UserCreateManyCompanyInput | UserCreateManyCompanyInput[]
    skipDuplicates?: boolean
  }

  export type ProductiveUnitUpsertWithWhereUniqueWithoutCompanyInput = {
    where: ProductiveUnitWhereUniqueInput
    update: XOR<ProductiveUnitUpdateWithoutCompanyInput, ProductiveUnitUncheckedUpdateWithoutCompanyInput>
    create: XOR<ProductiveUnitCreateWithoutCompanyInput, ProductiveUnitUncheckedCreateWithoutCompanyInput>
  }

  export type ProductiveUnitUpdateWithWhereUniqueWithoutCompanyInput = {
    where: ProductiveUnitWhereUniqueInput
    data: XOR<ProductiveUnitUpdateWithoutCompanyInput, ProductiveUnitUncheckedUpdateWithoutCompanyInput>
  }

  export type ProductiveUnitUpdateManyWithWhereWithoutCompanyInput = {
    where: ProductiveUnitScalarWhereInput
    data: XOR<ProductiveUnitUpdateManyMutationInput, ProductiveUnitUncheckedUpdateManyWithoutCompanyInput>
  }

  export type ProductiveUnitScalarWhereInput = {
    AND?: ProductiveUnitScalarWhereInput | ProductiveUnitScalarWhereInput[]
    OR?: ProductiveUnitScalarWhereInput[]
    NOT?: ProductiveUnitScalarWhereInput | ProductiveUnitScalarWhereInput[]
    id?: StringFilter<"ProductiveUnit"> | string
    company_id?: StringFilter<"ProductiveUnit"> | string
    name?: StringFilter<"ProductiveUnit"> | string
    created_at?: DateTimeFilter<"ProductiveUnit"> | Date | string
  }

  export type UserUpsertWithWhereUniqueWithoutCompanyInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutCompanyInput, UserUncheckedUpdateWithoutCompanyInput>
    create: XOR<UserCreateWithoutCompanyInput, UserUncheckedCreateWithoutCompanyInput>
  }

  export type UserUpdateWithWhereUniqueWithoutCompanyInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutCompanyInput, UserUncheckedUpdateWithoutCompanyInput>
  }

  export type UserUpdateManyWithWhereWithoutCompanyInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutCompanyInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: UuidFilter<"User"> | string
    email?: StringFilter<"User"> | string
    password_hash?: StringFilter<"User"> | string
    full_name?: StringFilter<"User"> | string
    avatar_url?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    company_id?: StringNullableFilter<"User"> | string | null
    productive_unit_id?: StringNullableFilter<"User"> | string | null
    level?: IntFilter<"User"> | number
    xp?: IntFilter<"User"> | number
    email_verified?: BoolFilter<"User"> | boolean
    created_at?: DateTimeFilter<"User"> | Date | string
    updated_at?: DateTimeFilter<"User"> | Date | string
  }

  export type CompanyCreateWithoutProductive_unitsInput = {
    id: string
    name: string
    logo_url?: string | null
    created_at?: Date | string
    users?: UserCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutProductive_unitsInput = {
    id: string
    name: string
    logo_url?: string | null
    created_at?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutProductive_unitsInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutProductive_unitsInput, CompanyUncheckedCreateWithoutProductive_unitsInput>
  }

  export type UserCreateWithoutProductive_unitInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    company?: CompanyCreateNestedOneWithoutUsersInput
    sessions?: AuthSessionCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunCreateNestedManyWithoutImportedByInput
  }

  export type UserUncheckedCreateWithoutProductive_unitInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    company_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeUncheckedCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingUncheckedCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunUncheckedCreateNestedManyWithoutImportedByInput
  }

  export type UserCreateOrConnectWithoutProductive_unitInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProductive_unitInput, UserUncheckedCreateWithoutProductive_unitInput>
  }

  export type UserCreateManyProductive_unitInputEnvelope = {
    data: UserCreateManyProductive_unitInput | UserCreateManyProductive_unitInput[]
    skipDuplicates?: boolean
  }

  export type CompanyUpsertWithoutProductive_unitsInput = {
    update: XOR<CompanyUpdateWithoutProductive_unitsInput, CompanyUncheckedUpdateWithoutProductive_unitsInput>
    create: XOR<CompanyCreateWithoutProductive_unitsInput, CompanyUncheckedCreateWithoutProductive_unitsInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutProductive_unitsInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutProductive_unitsInput, CompanyUncheckedUpdateWithoutProductive_unitsInput>
  }

  export type CompanyUpdateWithoutProductive_unitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutProductive_unitsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type UserUpsertWithWhereUniqueWithoutProductive_unitInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutProductive_unitInput, UserUncheckedUpdateWithoutProductive_unitInput>
    create: XOR<UserCreateWithoutProductive_unitInput, UserUncheckedCreateWithoutProductive_unitInput>
  }

  export type UserUpdateWithWhereUniqueWithoutProductive_unitInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutProductive_unitInput, UserUncheckedUpdateWithoutProductive_unitInput>
  }

  export type UserUpdateManyWithWhereWithoutProductive_unitInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutProductive_unitInput>
  }

  export type CompanyCreateWithoutUsersInput = {
    id: string
    name: string
    logo_url?: string | null
    created_at?: Date | string
    productive_units?: ProductiveUnitCreateNestedManyWithoutCompanyInput
  }

  export type CompanyUncheckedCreateWithoutUsersInput = {
    id: string
    name: string
    logo_url?: string | null
    created_at?: Date | string
    productive_units?: ProductiveUnitUncheckedCreateNestedManyWithoutCompanyInput
  }

  export type CompanyCreateOrConnectWithoutUsersInput = {
    where: CompanyWhereUniqueInput
    create: XOR<CompanyCreateWithoutUsersInput, CompanyUncheckedCreateWithoutUsersInput>
  }

  export type ProductiveUnitCreateWithoutUsersInput = {
    id: string
    name: string
    created_at?: Date | string
    company: CompanyCreateNestedOneWithoutProductive_unitsInput
  }

  export type ProductiveUnitUncheckedCreateWithoutUsersInput = {
    id: string
    company_id: string
    name: string
    created_at?: Date | string
  }

  export type ProductiveUnitCreateOrConnectWithoutUsersInput = {
    where: ProductiveUnitWhereUniqueInput
    create: XOR<ProductiveUnitCreateWithoutUsersInput, ProductiveUnitUncheckedCreateWithoutUsersInput>
  }

  export type AuthSessionCreateWithoutUserInput = {
    id?: string
    created_at?: Date | string
    expires_at: Date | string
    revoked_at?: Date | string | null
  }

  export type AuthSessionUncheckedCreateWithoutUserInput = {
    id?: string
    created_at?: Date | string
    expires_at: Date | string
    revoked_at?: Date | string | null
  }

  export type AuthSessionCreateOrConnectWithoutUserInput = {
    where: AuthSessionWhereUniqueInput
    create: XOR<AuthSessionCreateWithoutUserInput, AuthSessionUncheckedCreateWithoutUserInput>
  }

  export type AuthSessionCreateManyUserInputEnvelope = {
    data: AuthSessionCreateManyUserInput | AuthSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserBadgeCreateWithoutUserInput = {
    id?: string
    awarded_at?: Date | string
    tone: $Enums.BadgeTone
    badge: BadgeCreateNestedOneWithoutUser_badgesInput
    awardedBy?: UserCreateNestedOneWithoutAwarded_badgesInput
  }

  export type UserBadgeUncheckedCreateWithoutUserInput = {
    id?: string
    badge_id: string
    awarded_at?: Date | string
    awarded_by?: string | null
    tone: $Enums.BadgeTone
  }

  export type UserBadgeCreateOrConnectWithoutUserInput = {
    where: UserBadgeWhereUniqueInput
    create: XOR<UserBadgeCreateWithoutUserInput, UserBadgeUncheckedCreateWithoutUserInput>
  }

  export type UserBadgeCreateManyUserInputEnvelope = {
    data: UserBadgeCreateManyUserInput | UserBadgeCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserBadgeCreateWithoutAwardedByInput = {
    id?: string
    awarded_at?: Date | string
    tone: $Enums.BadgeTone
    user: UserCreateNestedOneWithoutUser_badgesInput
    badge: BadgeCreateNestedOneWithoutUser_badgesInput
  }

  export type UserBadgeUncheckedCreateWithoutAwardedByInput = {
    id?: string
    user_id: string
    badge_id: string
    awarded_at?: Date | string
    tone: $Enums.BadgeTone
  }

  export type UserBadgeCreateOrConnectWithoutAwardedByInput = {
    where: UserBadgeWhereUniqueInput
    create: XOR<UserBadgeCreateWithoutAwardedByInput, UserBadgeUncheckedCreateWithoutAwardedByInput>
  }

  export type UserBadgeCreateManyAwardedByInputEnvelope = {
    data: UserBadgeCreateManyAwardedByInput | UserBadgeCreateManyAwardedByInput[]
    skipDuplicates?: boolean
  }

  export type BadgeSubmissionCreateWithoutUserInput = {
    id?: string
    proof_url?: string | null
    description?: string | null
    status?: $Enums.SubmissionStatus
    submitted_at?: Date | string
    reviewed_at?: Date | string | null
    feedback?: string | null
    badge: BadgeCreateNestedOneWithoutSubmissionsInput
    reviewedBy?: UserCreateNestedOneWithoutReviewed_submissionsInput
  }

  export type BadgeSubmissionUncheckedCreateWithoutUserInput = {
    id?: string
    badge_id: string
    proof_url?: string | null
    description?: string | null
    status?: $Enums.SubmissionStatus
    submitted_at?: Date | string
    reviewed_by?: string | null
    reviewed_at?: Date | string | null
    feedback?: string | null
  }

  export type BadgeSubmissionCreateOrConnectWithoutUserInput = {
    where: BadgeSubmissionWhereUniqueInput
    create: XOR<BadgeSubmissionCreateWithoutUserInput, BadgeSubmissionUncheckedCreateWithoutUserInput>
  }

  export type BadgeSubmissionCreateManyUserInputEnvelope = {
    data: BadgeSubmissionCreateManyUserInput | BadgeSubmissionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BadgeSubmissionCreateWithoutReviewedByInput = {
    id?: string
    proof_url?: string | null
    description?: string | null
    status?: $Enums.SubmissionStatus
    submitted_at?: Date | string
    reviewed_at?: Date | string | null
    feedback?: string | null
    user: UserCreateNestedOneWithoutSubmissionsInput
    badge: BadgeCreateNestedOneWithoutSubmissionsInput
  }

  export type BadgeSubmissionUncheckedCreateWithoutReviewedByInput = {
    id?: string
    user_id: string
    badge_id: string
    proof_url?: string | null
    description?: string | null
    status?: $Enums.SubmissionStatus
    submitted_at?: Date | string
    reviewed_at?: Date | string | null
    feedback?: string | null
  }

  export type BadgeSubmissionCreateOrConnectWithoutReviewedByInput = {
    where: BadgeSubmissionWhereUniqueInput
    create: XOR<BadgeSubmissionCreateWithoutReviewedByInput, BadgeSubmissionUncheckedCreateWithoutReviewedByInput>
  }

  export type BadgeSubmissionCreateManyReviewedByInputEnvelope = {
    data: BadgeSubmissionCreateManyReviewedByInput | BadgeSubmissionCreateManyReviewedByInput[]
    skipDuplicates?: boolean
  }

  export type NotificationCreateWithoutUserInput = {
    id?: string
    title: string
    message: string
    sent_at?: Date | string
    read?: boolean
  }

  export type NotificationUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    message: string
    sent_at?: Date | string
    read?: boolean
  }

  export type NotificationCreateOrConnectWithoutUserInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationCreateManyUserInputEnvelope = {
    data: NotificationCreateManyUserInput | NotificationCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type BadgeLegendSettingCreateWithoutUpdatedByInput = {
    id?: string
    bronze: string
    silver: string
    gold: string
    loss_1: string
    loss_2: string
    updated_at?: Date | string
  }

  export type BadgeLegendSettingUncheckedCreateWithoutUpdatedByInput = {
    id?: string
    bronze: string
    silver: string
    gold: string
    loss_1: string
    loss_2: string
    updated_at?: Date | string
  }

  export type BadgeLegendSettingCreateOrConnectWithoutUpdatedByInput = {
    where: BadgeLegendSettingWhereUniqueInput
    create: XOR<BadgeLegendSettingCreateWithoutUpdatedByInput, BadgeLegendSettingUncheckedCreateWithoutUpdatedByInput>
  }

  export type BadgeLegendSettingCreateManyUpdatedByInputEnvelope = {
    data: BadgeLegendSettingCreateManyUpdatedByInput | BadgeLegendSettingCreateManyUpdatedByInput[]
    skipDuplicates?: boolean
  }

  export type ImportRunCreateWithoutImportedByInput = {
    id?: string
    source_name: string
    imported_at?: Date | string
    status?: $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    source?: ImportSourceCreateNestedOneWithoutImport_runsInput
    rows?: ImportRunRowCreateNestedManyWithoutImport_runInput
  }

  export type ImportRunUncheckedCreateWithoutImportedByInput = {
    id?: string
    source_id?: string | null
    source_name: string
    imported_at?: Date | string
    status?: $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    rows?: ImportRunRowUncheckedCreateNestedManyWithoutImport_runInput
  }

  export type ImportRunCreateOrConnectWithoutImportedByInput = {
    where: ImportRunWhereUniqueInput
    create: XOR<ImportRunCreateWithoutImportedByInput, ImportRunUncheckedCreateWithoutImportedByInput>
  }

  export type ImportRunCreateManyImportedByInputEnvelope = {
    data: ImportRunCreateManyImportedByInput | ImportRunCreateManyImportedByInput[]
    skipDuplicates?: boolean
  }

  export type CompanyUpsertWithoutUsersInput = {
    update: XOR<CompanyUpdateWithoutUsersInput, CompanyUncheckedUpdateWithoutUsersInput>
    create: XOR<CompanyCreateWithoutUsersInput, CompanyUncheckedCreateWithoutUsersInput>
    where?: CompanyWhereInput
  }

  export type CompanyUpdateToOneWithWhereWithoutUsersInput = {
    where?: CompanyWhereInput
    data: XOR<CompanyUpdateWithoutUsersInput, CompanyUncheckedUpdateWithoutUsersInput>
  }

  export type CompanyUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    productive_units?: ProductiveUnitUpdateManyWithoutCompanyNestedInput
  }

  export type CompanyUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    logo_url?: NullableStringFieldUpdateOperationsInput | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    productive_units?: ProductiveUnitUncheckedUpdateManyWithoutCompanyNestedInput
  }

  export type ProductiveUnitUpsertWithoutUsersInput = {
    update: XOR<ProductiveUnitUpdateWithoutUsersInput, ProductiveUnitUncheckedUpdateWithoutUsersInput>
    create: XOR<ProductiveUnitCreateWithoutUsersInput, ProductiveUnitUncheckedCreateWithoutUsersInput>
    where?: ProductiveUnitWhereInput
  }

  export type ProductiveUnitUpdateToOneWithWhereWithoutUsersInput = {
    where?: ProductiveUnitWhereInput
    data: XOR<ProductiveUnitUpdateWithoutUsersInput, ProductiveUnitUncheckedUpdateWithoutUsersInput>
  }

  export type ProductiveUnitUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneRequiredWithoutProductive_unitsNestedInput
  }

  export type ProductiveUnitUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    company_id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: AuthSessionWhereUniqueInput
    update: XOR<AuthSessionUpdateWithoutUserInput, AuthSessionUncheckedUpdateWithoutUserInput>
    create: XOR<AuthSessionCreateWithoutUserInput, AuthSessionUncheckedCreateWithoutUserInput>
  }

  export type AuthSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: AuthSessionWhereUniqueInput
    data: XOR<AuthSessionUpdateWithoutUserInput, AuthSessionUncheckedUpdateWithoutUserInput>
  }

  export type AuthSessionUpdateManyWithWhereWithoutUserInput = {
    where: AuthSessionScalarWhereInput
    data: XOR<AuthSessionUpdateManyMutationInput, AuthSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type AuthSessionScalarWhereInput = {
    AND?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
    OR?: AuthSessionScalarWhereInput[]
    NOT?: AuthSessionScalarWhereInput | AuthSessionScalarWhereInput[]
    id?: UuidFilter<"AuthSession"> | string
    user_id?: UuidFilter<"AuthSession"> | string
    created_at?: DateTimeFilter<"AuthSession"> | Date | string
    expires_at?: DateTimeFilter<"AuthSession"> | Date | string
    revoked_at?: DateTimeNullableFilter<"AuthSession"> | Date | string | null
  }

  export type UserBadgeUpsertWithWhereUniqueWithoutUserInput = {
    where: UserBadgeWhereUniqueInput
    update: XOR<UserBadgeUpdateWithoutUserInput, UserBadgeUncheckedUpdateWithoutUserInput>
    create: XOR<UserBadgeCreateWithoutUserInput, UserBadgeUncheckedCreateWithoutUserInput>
  }

  export type UserBadgeUpdateWithWhereUniqueWithoutUserInput = {
    where: UserBadgeWhereUniqueInput
    data: XOR<UserBadgeUpdateWithoutUserInput, UserBadgeUncheckedUpdateWithoutUserInput>
  }

  export type UserBadgeUpdateManyWithWhereWithoutUserInput = {
    where: UserBadgeScalarWhereInput
    data: XOR<UserBadgeUpdateManyMutationInput, UserBadgeUncheckedUpdateManyWithoutUserInput>
  }

  export type UserBadgeScalarWhereInput = {
    AND?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
    OR?: UserBadgeScalarWhereInput[]
    NOT?: UserBadgeScalarWhereInput | UserBadgeScalarWhereInput[]
    id?: UuidFilter<"UserBadge"> | string
    user_id?: UuidFilter<"UserBadge"> | string
    badge_id?: StringFilter<"UserBadge"> | string
    awarded_at?: DateTimeFilter<"UserBadge"> | Date | string
    awarded_by?: UuidNullableFilter<"UserBadge"> | string | null
    tone?: EnumBadgeToneFilter<"UserBadge"> | $Enums.BadgeTone
  }

  export type UserBadgeUpsertWithWhereUniqueWithoutAwardedByInput = {
    where: UserBadgeWhereUniqueInput
    update: XOR<UserBadgeUpdateWithoutAwardedByInput, UserBadgeUncheckedUpdateWithoutAwardedByInput>
    create: XOR<UserBadgeCreateWithoutAwardedByInput, UserBadgeUncheckedCreateWithoutAwardedByInput>
  }

  export type UserBadgeUpdateWithWhereUniqueWithoutAwardedByInput = {
    where: UserBadgeWhereUniqueInput
    data: XOR<UserBadgeUpdateWithoutAwardedByInput, UserBadgeUncheckedUpdateWithoutAwardedByInput>
  }

  export type UserBadgeUpdateManyWithWhereWithoutAwardedByInput = {
    where: UserBadgeScalarWhereInput
    data: XOR<UserBadgeUpdateManyMutationInput, UserBadgeUncheckedUpdateManyWithoutAwardedByInput>
  }

  export type BadgeSubmissionUpsertWithWhereUniqueWithoutUserInput = {
    where: BadgeSubmissionWhereUniqueInput
    update: XOR<BadgeSubmissionUpdateWithoutUserInput, BadgeSubmissionUncheckedUpdateWithoutUserInput>
    create: XOR<BadgeSubmissionCreateWithoutUserInput, BadgeSubmissionUncheckedCreateWithoutUserInput>
  }

  export type BadgeSubmissionUpdateWithWhereUniqueWithoutUserInput = {
    where: BadgeSubmissionWhereUniqueInput
    data: XOR<BadgeSubmissionUpdateWithoutUserInput, BadgeSubmissionUncheckedUpdateWithoutUserInput>
  }

  export type BadgeSubmissionUpdateManyWithWhereWithoutUserInput = {
    where: BadgeSubmissionScalarWhereInput
    data: XOR<BadgeSubmissionUpdateManyMutationInput, BadgeSubmissionUncheckedUpdateManyWithoutUserInput>
  }

  export type BadgeSubmissionScalarWhereInput = {
    AND?: BadgeSubmissionScalarWhereInput | BadgeSubmissionScalarWhereInput[]
    OR?: BadgeSubmissionScalarWhereInput[]
    NOT?: BadgeSubmissionScalarWhereInput | BadgeSubmissionScalarWhereInput[]
    id?: UuidFilter<"BadgeSubmission"> | string
    user_id?: UuidFilter<"BadgeSubmission"> | string
    badge_id?: StringFilter<"BadgeSubmission"> | string
    proof_url?: StringNullableFilter<"BadgeSubmission"> | string | null
    description?: StringNullableFilter<"BadgeSubmission"> | string | null
    status?: EnumSubmissionStatusFilter<"BadgeSubmission"> | $Enums.SubmissionStatus
    submitted_at?: DateTimeFilter<"BadgeSubmission"> | Date | string
    reviewed_by?: UuidNullableFilter<"BadgeSubmission"> | string | null
    reviewed_at?: DateTimeNullableFilter<"BadgeSubmission"> | Date | string | null
    feedback?: StringNullableFilter<"BadgeSubmission"> | string | null
  }

  export type BadgeSubmissionUpsertWithWhereUniqueWithoutReviewedByInput = {
    where: BadgeSubmissionWhereUniqueInput
    update: XOR<BadgeSubmissionUpdateWithoutReviewedByInput, BadgeSubmissionUncheckedUpdateWithoutReviewedByInput>
    create: XOR<BadgeSubmissionCreateWithoutReviewedByInput, BadgeSubmissionUncheckedCreateWithoutReviewedByInput>
  }

  export type BadgeSubmissionUpdateWithWhereUniqueWithoutReviewedByInput = {
    where: BadgeSubmissionWhereUniqueInput
    data: XOR<BadgeSubmissionUpdateWithoutReviewedByInput, BadgeSubmissionUncheckedUpdateWithoutReviewedByInput>
  }

  export type BadgeSubmissionUpdateManyWithWhereWithoutReviewedByInput = {
    where: BadgeSubmissionScalarWhereInput
    data: XOR<BadgeSubmissionUpdateManyMutationInput, BadgeSubmissionUncheckedUpdateManyWithoutReviewedByInput>
  }

  export type NotificationUpsertWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    update: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
    create: XOR<NotificationCreateWithoutUserInput, NotificationUncheckedCreateWithoutUserInput>
  }

  export type NotificationUpdateWithWhereUniqueWithoutUserInput = {
    where: NotificationWhereUniqueInput
    data: XOR<NotificationUpdateWithoutUserInput, NotificationUncheckedUpdateWithoutUserInput>
  }

  export type NotificationUpdateManyWithWhereWithoutUserInput = {
    where: NotificationScalarWhereInput
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyWithoutUserInput>
  }

  export type NotificationScalarWhereInput = {
    AND?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    OR?: NotificationScalarWhereInput[]
    NOT?: NotificationScalarWhereInput | NotificationScalarWhereInput[]
    id?: UuidFilter<"Notification"> | string
    user_id?: UuidFilter<"Notification"> | string
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    sent_at?: DateTimeFilter<"Notification"> | Date | string
    read?: BoolFilter<"Notification"> | boolean
  }

  export type BadgeLegendSettingUpsertWithWhereUniqueWithoutUpdatedByInput = {
    where: BadgeLegendSettingWhereUniqueInput
    update: XOR<BadgeLegendSettingUpdateWithoutUpdatedByInput, BadgeLegendSettingUncheckedUpdateWithoutUpdatedByInput>
    create: XOR<BadgeLegendSettingCreateWithoutUpdatedByInput, BadgeLegendSettingUncheckedCreateWithoutUpdatedByInput>
  }

  export type BadgeLegendSettingUpdateWithWhereUniqueWithoutUpdatedByInput = {
    where: BadgeLegendSettingWhereUniqueInput
    data: XOR<BadgeLegendSettingUpdateWithoutUpdatedByInput, BadgeLegendSettingUncheckedUpdateWithoutUpdatedByInput>
  }

  export type BadgeLegendSettingUpdateManyWithWhereWithoutUpdatedByInput = {
    where: BadgeLegendSettingScalarWhereInput
    data: XOR<BadgeLegendSettingUpdateManyMutationInput, BadgeLegendSettingUncheckedUpdateManyWithoutUpdatedByInput>
  }

  export type BadgeLegendSettingScalarWhereInput = {
    AND?: BadgeLegendSettingScalarWhereInput | BadgeLegendSettingScalarWhereInput[]
    OR?: BadgeLegendSettingScalarWhereInput[]
    NOT?: BadgeLegendSettingScalarWhereInput | BadgeLegendSettingScalarWhereInput[]
    id?: UuidFilter<"BadgeLegendSetting"> | string
    bronze?: StringFilter<"BadgeLegendSetting"> | string
    silver?: StringFilter<"BadgeLegendSetting"> | string
    gold?: StringFilter<"BadgeLegendSetting"> | string
    loss_1?: StringFilter<"BadgeLegendSetting"> | string
    loss_2?: StringFilter<"BadgeLegendSetting"> | string
    updated_by?: UuidNullableFilter<"BadgeLegendSetting"> | string | null
    updated_at?: DateTimeFilter<"BadgeLegendSetting"> | Date | string
  }

  export type ImportRunUpsertWithWhereUniqueWithoutImportedByInput = {
    where: ImportRunWhereUniqueInput
    update: XOR<ImportRunUpdateWithoutImportedByInput, ImportRunUncheckedUpdateWithoutImportedByInput>
    create: XOR<ImportRunCreateWithoutImportedByInput, ImportRunUncheckedCreateWithoutImportedByInput>
  }

  export type ImportRunUpdateWithWhereUniqueWithoutImportedByInput = {
    where: ImportRunWhereUniqueInput
    data: XOR<ImportRunUpdateWithoutImportedByInput, ImportRunUncheckedUpdateWithoutImportedByInput>
  }

  export type ImportRunUpdateManyWithWhereWithoutImportedByInput = {
    where: ImportRunScalarWhereInput
    data: XOR<ImportRunUpdateManyMutationInput, ImportRunUncheckedUpdateManyWithoutImportedByInput>
  }

  export type ImportRunScalarWhereInput = {
    AND?: ImportRunScalarWhereInput | ImportRunScalarWhereInput[]
    OR?: ImportRunScalarWhereInput[]
    NOT?: ImportRunScalarWhereInput | ImportRunScalarWhereInput[]
    id?: UuidFilter<"ImportRun"> | string
    source_id?: StringNullableFilter<"ImportRun"> | string | null
    source_name?: StringFilter<"ImportRun"> | string
    imported_by?: UuidNullableFilter<"ImportRun"> | string | null
    imported_at?: DateTimeFilter<"ImportRun"> | Date | string
    status?: EnumImportRunStatusFilter<"ImportRun"> | $Enums.ImportRunStatus
    matched_columns?: JsonFilter<"ImportRun">
    summary?: JsonFilter<"ImportRun">
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    company?: CompanyCreateNestedOneWithoutUsersInput
    productive_unit?: ProductiveUnitCreateNestedOneWithoutUsersInput
    user_badges?: UserBadgeCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunCreateNestedManyWithoutImportedByInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    company_id?: string | null
    productive_unit_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    user_badges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeUncheckedCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingUncheckedCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunUncheckedCreateNestedManyWithoutImportedByInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutUsersNestedInput
    productive_unit?: ProductiveUnitUpdateOneWithoutUsersNestedInput
    user_badges?: UserBadgeUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUpdateManyWithoutImportedByNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    company_id?: NullableStringFieldUpdateOperationsInput | string | null
    productive_unit_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_badges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUncheckedUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUncheckedUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUncheckedUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUncheckedUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUncheckedUpdateManyWithoutImportedByNestedInput
  }

  export type UserBadgeCreateWithoutBadgeInput = {
    id?: string
    awarded_at?: Date | string
    tone: $Enums.BadgeTone
    user: UserCreateNestedOneWithoutUser_badgesInput
    awardedBy?: UserCreateNestedOneWithoutAwarded_badgesInput
  }

  export type UserBadgeUncheckedCreateWithoutBadgeInput = {
    id?: string
    user_id: string
    awarded_at?: Date | string
    awarded_by?: string | null
    tone: $Enums.BadgeTone
  }

  export type UserBadgeCreateOrConnectWithoutBadgeInput = {
    where: UserBadgeWhereUniqueInput
    create: XOR<UserBadgeCreateWithoutBadgeInput, UserBadgeUncheckedCreateWithoutBadgeInput>
  }

  export type UserBadgeCreateManyBadgeInputEnvelope = {
    data: UserBadgeCreateManyBadgeInput | UserBadgeCreateManyBadgeInput[]
    skipDuplicates?: boolean
  }

  export type BadgeSubmissionCreateWithoutBadgeInput = {
    id?: string
    proof_url?: string | null
    description?: string | null
    status?: $Enums.SubmissionStatus
    submitted_at?: Date | string
    reviewed_at?: Date | string | null
    feedback?: string | null
    user: UserCreateNestedOneWithoutSubmissionsInput
    reviewedBy?: UserCreateNestedOneWithoutReviewed_submissionsInput
  }

  export type BadgeSubmissionUncheckedCreateWithoutBadgeInput = {
    id?: string
    user_id: string
    proof_url?: string | null
    description?: string | null
    status?: $Enums.SubmissionStatus
    submitted_at?: Date | string
    reviewed_by?: string | null
    reviewed_at?: Date | string | null
    feedback?: string | null
  }

  export type BadgeSubmissionCreateOrConnectWithoutBadgeInput = {
    where: BadgeSubmissionWhereUniqueInput
    create: XOR<BadgeSubmissionCreateWithoutBadgeInput, BadgeSubmissionUncheckedCreateWithoutBadgeInput>
  }

  export type BadgeSubmissionCreateManyBadgeInputEnvelope = {
    data: BadgeSubmissionCreateManyBadgeInput | BadgeSubmissionCreateManyBadgeInput[]
    skipDuplicates?: boolean
  }

  export type UserBadgeUpsertWithWhereUniqueWithoutBadgeInput = {
    where: UserBadgeWhereUniqueInput
    update: XOR<UserBadgeUpdateWithoutBadgeInput, UserBadgeUncheckedUpdateWithoutBadgeInput>
    create: XOR<UserBadgeCreateWithoutBadgeInput, UserBadgeUncheckedCreateWithoutBadgeInput>
  }

  export type UserBadgeUpdateWithWhereUniqueWithoutBadgeInput = {
    where: UserBadgeWhereUniqueInput
    data: XOR<UserBadgeUpdateWithoutBadgeInput, UserBadgeUncheckedUpdateWithoutBadgeInput>
  }

  export type UserBadgeUpdateManyWithWhereWithoutBadgeInput = {
    where: UserBadgeScalarWhereInput
    data: XOR<UserBadgeUpdateManyMutationInput, UserBadgeUncheckedUpdateManyWithoutBadgeInput>
  }

  export type BadgeSubmissionUpsertWithWhereUniqueWithoutBadgeInput = {
    where: BadgeSubmissionWhereUniqueInput
    update: XOR<BadgeSubmissionUpdateWithoutBadgeInput, BadgeSubmissionUncheckedUpdateWithoutBadgeInput>
    create: XOR<BadgeSubmissionCreateWithoutBadgeInput, BadgeSubmissionUncheckedCreateWithoutBadgeInput>
  }

  export type BadgeSubmissionUpdateWithWhereUniqueWithoutBadgeInput = {
    where: BadgeSubmissionWhereUniqueInput
    data: XOR<BadgeSubmissionUpdateWithoutBadgeInput, BadgeSubmissionUncheckedUpdateWithoutBadgeInput>
  }

  export type BadgeSubmissionUpdateManyWithWhereWithoutBadgeInput = {
    where: BadgeSubmissionScalarWhereInput
    data: XOR<BadgeSubmissionUpdateManyMutationInput, BadgeSubmissionUncheckedUpdateManyWithoutBadgeInput>
  }

  export type UserCreateWithoutBadge_legend_settingsInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    company?: CompanyCreateNestedOneWithoutUsersInput
    productive_unit?: ProductiveUnitCreateNestedOneWithoutUsersInput
    sessions?: AuthSessionCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    import_runs?: ImportRunCreateNestedManyWithoutImportedByInput
  }

  export type UserUncheckedCreateWithoutBadge_legend_settingsInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    company_id?: string | null
    productive_unit_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeUncheckedCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    import_runs?: ImportRunUncheckedCreateNestedManyWithoutImportedByInput
  }

  export type UserCreateOrConnectWithoutBadge_legend_settingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutBadge_legend_settingsInput, UserUncheckedCreateWithoutBadge_legend_settingsInput>
  }

  export type UserUpsertWithoutBadge_legend_settingsInput = {
    update: XOR<UserUpdateWithoutBadge_legend_settingsInput, UserUncheckedUpdateWithoutBadge_legend_settingsInput>
    create: XOR<UserCreateWithoutBadge_legend_settingsInput, UserUncheckedCreateWithoutBadge_legend_settingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutBadge_legend_settingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutBadge_legend_settingsInput, UserUncheckedUpdateWithoutBadge_legend_settingsInput>
  }

  export type UserUpdateWithoutBadge_legend_settingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutUsersNestedInput
    productive_unit?: ProductiveUnitUpdateOneWithoutUsersNestedInput
    sessions?: AuthSessionUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    import_runs?: ImportRunUpdateManyWithoutImportedByNestedInput
  }

  export type UserUncheckedUpdateWithoutBadge_legend_settingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    company_id?: NullableStringFieldUpdateOperationsInput | string | null
    productive_unit_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUncheckedUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUncheckedUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUncheckedUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    import_runs?: ImportRunUncheckedUpdateManyWithoutImportedByNestedInput
  }

  export type UserCreateWithoutUser_badgesInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    company?: CompanyCreateNestedOneWithoutUsersInput
    productive_unit?: ProductiveUnitCreateNestedOneWithoutUsersInput
    sessions?: AuthSessionCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunCreateNestedManyWithoutImportedByInput
  }

  export type UserUncheckedCreateWithoutUser_badgesInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    company_id?: string | null
    productive_unit_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeUncheckedCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingUncheckedCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunUncheckedCreateNestedManyWithoutImportedByInput
  }

  export type UserCreateOrConnectWithoutUser_badgesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUser_badgesInput, UserUncheckedCreateWithoutUser_badgesInput>
  }

  export type BadgeCreateWithoutUser_badgesInput = {
    id: string
    name: string
    description: string
    category: string
    icon_name: string
    image_url?: string | null
    points?: number
    created_at?: Date | string
    submissions?: BadgeSubmissionCreateNestedManyWithoutBadgeInput
  }

  export type BadgeUncheckedCreateWithoutUser_badgesInput = {
    id: string
    name: string
    description: string
    category: string
    icon_name: string
    image_url?: string | null
    points?: number
    created_at?: Date | string
    submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutBadgeInput
  }

  export type BadgeCreateOrConnectWithoutUser_badgesInput = {
    where: BadgeWhereUniqueInput
    create: XOR<BadgeCreateWithoutUser_badgesInput, BadgeUncheckedCreateWithoutUser_badgesInput>
  }

  export type UserCreateWithoutAwarded_badgesInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    company?: CompanyCreateNestedOneWithoutUsersInput
    productive_unit?: ProductiveUnitCreateNestedOneWithoutUsersInput
    sessions?: AuthSessionCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeCreateNestedManyWithoutUserInput
    submissions?: BadgeSubmissionCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunCreateNestedManyWithoutImportedByInput
  }

  export type UserUncheckedCreateWithoutAwarded_badgesInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    company_id?: string | null
    productive_unit_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
    submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingUncheckedCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunUncheckedCreateNestedManyWithoutImportedByInput
  }

  export type UserCreateOrConnectWithoutAwarded_badgesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAwarded_badgesInput, UserUncheckedCreateWithoutAwarded_badgesInput>
  }

  export type UserUpsertWithoutUser_badgesInput = {
    update: XOR<UserUpdateWithoutUser_badgesInput, UserUncheckedUpdateWithoutUser_badgesInput>
    create: XOR<UserCreateWithoutUser_badgesInput, UserUncheckedCreateWithoutUser_badgesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUser_badgesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUser_badgesInput, UserUncheckedUpdateWithoutUser_badgesInput>
  }

  export type UserUpdateWithoutUser_badgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutUsersNestedInput
    productive_unit?: ProductiveUnitUpdateOneWithoutUsersNestedInput
    sessions?: AuthSessionUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUpdateManyWithoutImportedByNestedInput
  }

  export type UserUncheckedUpdateWithoutUser_badgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    company_id?: NullableStringFieldUpdateOperationsInput | string | null
    productive_unit_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUncheckedUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUncheckedUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUncheckedUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUncheckedUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUncheckedUpdateManyWithoutImportedByNestedInput
  }

  export type BadgeUpsertWithoutUser_badgesInput = {
    update: XOR<BadgeUpdateWithoutUser_badgesInput, BadgeUncheckedUpdateWithoutUser_badgesInput>
    create: XOR<BadgeCreateWithoutUser_badgesInput, BadgeUncheckedCreateWithoutUser_badgesInput>
    where?: BadgeWhereInput
  }

  export type BadgeUpdateToOneWithWhereWithoutUser_badgesInput = {
    where?: BadgeWhereInput
    data: XOR<BadgeUpdateWithoutUser_badgesInput, BadgeUncheckedUpdateWithoutUser_badgesInput>
  }

  export type BadgeUpdateWithoutUser_badgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    icon_name?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: BadgeSubmissionUpdateManyWithoutBadgeNestedInput
  }

  export type BadgeUncheckedUpdateWithoutUser_badgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    icon_name?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    submissions?: BadgeSubmissionUncheckedUpdateManyWithoutBadgeNestedInput
  }

  export type UserUpsertWithoutAwarded_badgesInput = {
    update: XOR<UserUpdateWithoutAwarded_badgesInput, UserUncheckedUpdateWithoutAwarded_badgesInput>
    create: XOR<UserCreateWithoutAwarded_badgesInput, UserUncheckedCreateWithoutAwarded_badgesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAwarded_badgesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAwarded_badgesInput, UserUncheckedUpdateWithoutAwarded_badgesInput>
  }

  export type UserUpdateWithoutAwarded_badgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutUsersNestedInput
    productive_unit?: ProductiveUnitUpdateOneWithoutUsersNestedInput
    sessions?: AuthSessionUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUpdateManyWithoutUserNestedInput
    submissions?: BadgeSubmissionUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUpdateManyWithoutImportedByNestedInput
  }

  export type UserUncheckedUpdateWithoutAwarded_badgesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    company_id?: NullableStringFieldUpdateOperationsInput | string | null
    productive_unit_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
    submissions?: BadgeSubmissionUncheckedUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUncheckedUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUncheckedUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUncheckedUpdateManyWithoutImportedByNestedInput
  }

  export type UserCreateWithoutSubmissionsInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    company?: CompanyCreateNestedOneWithoutUsersInput
    productive_unit?: ProductiveUnitCreateNestedOneWithoutUsersInput
    sessions?: AuthSessionCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeCreateNestedManyWithoutAwardedByInput
    reviewed_submissions?: BadgeSubmissionCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunCreateNestedManyWithoutImportedByInput
  }

  export type UserUncheckedCreateWithoutSubmissionsInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    company_id?: string | null
    productive_unit_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeUncheckedCreateNestedManyWithoutAwardedByInput
    reviewed_submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingUncheckedCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunUncheckedCreateNestedManyWithoutImportedByInput
  }

  export type UserCreateOrConnectWithoutSubmissionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSubmissionsInput, UserUncheckedCreateWithoutSubmissionsInput>
  }

  export type BadgeCreateWithoutSubmissionsInput = {
    id: string
    name: string
    description: string
    category: string
    icon_name: string
    image_url?: string | null
    points?: number
    created_at?: Date | string
    user_badges?: UserBadgeCreateNestedManyWithoutBadgeInput
  }

  export type BadgeUncheckedCreateWithoutSubmissionsInput = {
    id: string
    name: string
    description: string
    category: string
    icon_name: string
    image_url?: string | null
    points?: number
    created_at?: Date | string
    user_badges?: UserBadgeUncheckedCreateNestedManyWithoutBadgeInput
  }

  export type BadgeCreateOrConnectWithoutSubmissionsInput = {
    where: BadgeWhereUniqueInput
    create: XOR<BadgeCreateWithoutSubmissionsInput, BadgeUncheckedCreateWithoutSubmissionsInput>
  }

  export type UserCreateWithoutReviewed_submissionsInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    company?: CompanyCreateNestedOneWithoutUsersInput
    productive_unit?: ProductiveUnitCreateNestedOneWithoutUsersInput
    sessions?: AuthSessionCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionCreateNestedManyWithoutUserInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunCreateNestedManyWithoutImportedByInput
  }

  export type UserUncheckedCreateWithoutReviewed_submissionsInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    company_id?: string | null
    productive_unit_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeUncheckedCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutUserInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingUncheckedCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunUncheckedCreateNestedManyWithoutImportedByInput
  }

  export type UserCreateOrConnectWithoutReviewed_submissionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReviewed_submissionsInput, UserUncheckedCreateWithoutReviewed_submissionsInput>
  }

  export type UserUpsertWithoutSubmissionsInput = {
    update: XOR<UserUpdateWithoutSubmissionsInput, UserUncheckedUpdateWithoutSubmissionsInput>
    create: XOR<UserCreateWithoutSubmissionsInput, UserUncheckedCreateWithoutSubmissionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSubmissionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSubmissionsInput, UserUncheckedUpdateWithoutSubmissionsInput>
  }

  export type UserUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutUsersNestedInput
    productive_unit?: ProductiveUnitUpdateOneWithoutUsersNestedInput
    sessions?: AuthSessionUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUpdateManyWithoutAwardedByNestedInput
    reviewed_submissions?: BadgeSubmissionUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUpdateManyWithoutImportedByNestedInput
  }

  export type UserUncheckedUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    company_id?: NullableStringFieldUpdateOperationsInput | string | null
    productive_unit_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUncheckedUpdateManyWithoutAwardedByNestedInput
    reviewed_submissions?: BadgeSubmissionUncheckedUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUncheckedUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUncheckedUpdateManyWithoutImportedByNestedInput
  }

  export type BadgeUpsertWithoutSubmissionsInput = {
    update: XOR<BadgeUpdateWithoutSubmissionsInput, BadgeUncheckedUpdateWithoutSubmissionsInput>
    create: XOR<BadgeCreateWithoutSubmissionsInput, BadgeUncheckedCreateWithoutSubmissionsInput>
    where?: BadgeWhereInput
  }

  export type BadgeUpdateToOneWithWhereWithoutSubmissionsInput = {
    where?: BadgeWhereInput
    data: XOR<BadgeUpdateWithoutSubmissionsInput, BadgeUncheckedUpdateWithoutSubmissionsInput>
  }

  export type BadgeUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    icon_name?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_badges?: UserBadgeUpdateManyWithoutBadgeNestedInput
  }

  export type BadgeUncheckedUpdateWithoutSubmissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    icon_name?: StringFieldUpdateOperationsInput | string
    image_url?: NullableStringFieldUpdateOperationsInput | string | null
    points?: IntFieldUpdateOperationsInput | number
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    user_badges?: UserBadgeUncheckedUpdateManyWithoutBadgeNestedInput
  }

  export type UserUpsertWithoutReviewed_submissionsInput = {
    update: XOR<UserUpdateWithoutReviewed_submissionsInput, UserUncheckedUpdateWithoutReviewed_submissionsInput>
    create: XOR<UserCreateWithoutReviewed_submissionsInput, UserUncheckedCreateWithoutReviewed_submissionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReviewed_submissionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReviewed_submissionsInput, UserUncheckedUpdateWithoutReviewed_submissionsInput>
  }

  export type UserUpdateWithoutReviewed_submissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutUsersNestedInput
    productive_unit?: ProductiveUnitUpdateOneWithoutUsersNestedInput
    sessions?: AuthSessionUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUpdateManyWithoutUserNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUpdateManyWithoutImportedByNestedInput
  }

  export type UserUncheckedUpdateWithoutReviewed_submissionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    company_id?: NullableStringFieldUpdateOperationsInput | string | null
    productive_unit_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUncheckedUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUncheckedUpdateManyWithoutUserNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUncheckedUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUncheckedUpdateManyWithoutImportedByNestedInput
  }

  export type UserCreateWithoutNotificationsInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    company?: CompanyCreateNestedOneWithoutUsersInput
    productive_unit?: ProductiveUnitCreateNestedOneWithoutUsersInput
    sessions?: AuthSessionCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionCreateNestedManyWithoutReviewedByInput
    badge_legend_settings?: BadgeLegendSettingCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunCreateNestedManyWithoutImportedByInput
  }

  export type UserUncheckedCreateWithoutNotificationsInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    company_id?: string | null
    productive_unit_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeUncheckedCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutReviewedByInput
    badge_legend_settings?: BadgeLegendSettingUncheckedCreateNestedManyWithoutUpdatedByInput
    import_runs?: ImportRunUncheckedCreateNestedManyWithoutImportedByInput
  }

  export type UserCreateOrConnectWithoutNotificationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
  }

  export type UserUpsertWithoutNotificationsInput = {
    update: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
    create: XOR<UserCreateWithoutNotificationsInput, UserUncheckedCreateWithoutNotificationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutNotificationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutNotificationsInput, UserUncheckedUpdateWithoutNotificationsInput>
  }

  export type UserUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutUsersNestedInput
    productive_unit?: ProductiveUnitUpdateOneWithoutUsersNestedInput
    sessions?: AuthSessionUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUpdateManyWithoutReviewedByNestedInput
    badge_legend_settings?: BadgeLegendSettingUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUpdateManyWithoutImportedByNestedInput
  }

  export type UserUncheckedUpdateWithoutNotificationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    company_id?: NullableStringFieldUpdateOperationsInput | string | null
    productive_unit_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUncheckedUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUncheckedUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUncheckedUpdateManyWithoutReviewedByNestedInput
    badge_legend_settings?: BadgeLegendSettingUncheckedUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUncheckedUpdateManyWithoutImportedByNestedInput
  }

  export type ImportRunCreateWithoutSourceInput = {
    id?: string
    source_name: string
    imported_at?: Date | string
    status?: $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    importedBy?: UserCreateNestedOneWithoutImport_runsInput
    rows?: ImportRunRowCreateNestedManyWithoutImport_runInput
  }

  export type ImportRunUncheckedCreateWithoutSourceInput = {
    id?: string
    source_name: string
    imported_by?: string | null
    imported_at?: Date | string
    status?: $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    rows?: ImportRunRowUncheckedCreateNestedManyWithoutImport_runInput
  }

  export type ImportRunCreateOrConnectWithoutSourceInput = {
    where: ImportRunWhereUniqueInput
    create: XOR<ImportRunCreateWithoutSourceInput, ImportRunUncheckedCreateWithoutSourceInput>
  }

  export type ImportRunCreateManySourceInputEnvelope = {
    data: ImportRunCreateManySourceInput | ImportRunCreateManySourceInput[]
    skipDuplicates?: boolean
  }

  export type ImportRunUpsertWithWhereUniqueWithoutSourceInput = {
    where: ImportRunWhereUniqueInput
    update: XOR<ImportRunUpdateWithoutSourceInput, ImportRunUncheckedUpdateWithoutSourceInput>
    create: XOR<ImportRunCreateWithoutSourceInput, ImportRunUncheckedCreateWithoutSourceInput>
  }

  export type ImportRunUpdateWithWhereUniqueWithoutSourceInput = {
    where: ImportRunWhereUniqueInput
    data: XOR<ImportRunUpdateWithoutSourceInput, ImportRunUncheckedUpdateWithoutSourceInput>
  }

  export type ImportRunUpdateManyWithWhereWithoutSourceInput = {
    where: ImportRunScalarWhereInput
    data: XOR<ImportRunUpdateManyMutationInput, ImportRunUncheckedUpdateManyWithoutSourceInput>
  }

  export type ImportSourceCreateWithoutImport_runsInput = {
    id: string
    name: string
    description?: string | null
    company_column: string
    productive_unit_column: string
    user_column: string
    badge_column: string
    tone_column?: string
    award_column?: string
    created_at?: Date | string
    archived_at?: Date | string | null
  }

  export type ImportSourceUncheckedCreateWithoutImport_runsInput = {
    id: string
    name: string
    description?: string | null
    company_column: string
    productive_unit_column: string
    user_column: string
    badge_column: string
    tone_column?: string
    award_column?: string
    created_at?: Date | string
    archived_at?: Date | string | null
  }

  export type ImportSourceCreateOrConnectWithoutImport_runsInput = {
    where: ImportSourceWhereUniqueInput
    create: XOR<ImportSourceCreateWithoutImport_runsInput, ImportSourceUncheckedCreateWithoutImport_runsInput>
  }

  export type UserCreateWithoutImport_runsInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    company?: CompanyCreateNestedOneWithoutUsersInput
    productive_unit?: ProductiveUnitCreateNestedOneWithoutUsersInput
    sessions?: AuthSessionCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingCreateNestedManyWithoutUpdatedByInput
  }

  export type UserUncheckedCreateWithoutImport_runsInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    company_id?: string | null
    productive_unit_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
    sessions?: AuthSessionUncheckedCreateNestedManyWithoutUserInput
    user_badges?: UserBadgeUncheckedCreateNestedManyWithoutUserInput
    awarded_badges?: UserBadgeUncheckedCreateNestedManyWithoutAwardedByInput
    submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutUserInput
    reviewed_submissions?: BadgeSubmissionUncheckedCreateNestedManyWithoutReviewedByInput
    notifications?: NotificationUncheckedCreateNestedManyWithoutUserInput
    badge_legend_settings?: BadgeLegendSettingUncheckedCreateNestedManyWithoutUpdatedByInput
  }

  export type UserCreateOrConnectWithoutImport_runsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutImport_runsInput, UserUncheckedCreateWithoutImport_runsInput>
  }

  export type ImportRunRowCreateWithoutImport_runInput = {
    id?: string
    row_number: number
    raw_payload: JsonNullValueInput | InputJsonValue
    normalized_payload?: NullableJsonNullValueInput | InputJsonValue
    status: $Enums.ImportRowStatus
    reason?: string | null
  }

  export type ImportRunRowUncheckedCreateWithoutImport_runInput = {
    id?: string
    row_number: number
    raw_payload: JsonNullValueInput | InputJsonValue
    normalized_payload?: NullableJsonNullValueInput | InputJsonValue
    status: $Enums.ImportRowStatus
    reason?: string | null
  }

  export type ImportRunRowCreateOrConnectWithoutImport_runInput = {
    where: ImportRunRowWhereUniqueInput
    create: XOR<ImportRunRowCreateWithoutImport_runInput, ImportRunRowUncheckedCreateWithoutImport_runInput>
  }

  export type ImportRunRowCreateManyImport_runInputEnvelope = {
    data: ImportRunRowCreateManyImport_runInput | ImportRunRowCreateManyImport_runInput[]
    skipDuplicates?: boolean
  }

  export type ImportSourceUpsertWithoutImport_runsInput = {
    update: XOR<ImportSourceUpdateWithoutImport_runsInput, ImportSourceUncheckedUpdateWithoutImport_runsInput>
    create: XOR<ImportSourceCreateWithoutImport_runsInput, ImportSourceUncheckedCreateWithoutImport_runsInput>
    where?: ImportSourceWhereInput
  }

  export type ImportSourceUpdateToOneWithWhereWithoutImport_runsInput = {
    where?: ImportSourceWhereInput
    data: XOR<ImportSourceUpdateWithoutImport_runsInput, ImportSourceUncheckedUpdateWithoutImport_runsInput>
  }

  export type ImportSourceUpdateWithoutImport_runsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company_column?: StringFieldUpdateOperationsInput | string
    productive_unit_column?: StringFieldUpdateOperationsInput | string
    user_column?: StringFieldUpdateOperationsInput | string
    badge_column?: StringFieldUpdateOperationsInput | string
    tone_column?: StringFieldUpdateOperationsInput | string
    award_column?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    archived_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ImportSourceUncheckedUpdateWithoutImport_runsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    company_column?: StringFieldUpdateOperationsInput | string
    productive_unit_column?: StringFieldUpdateOperationsInput | string
    user_column?: StringFieldUpdateOperationsInput | string
    badge_column?: StringFieldUpdateOperationsInput | string
    tone_column?: StringFieldUpdateOperationsInput | string
    award_column?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    archived_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUpsertWithoutImport_runsInput = {
    update: XOR<UserUpdateWithoutImport_runsInput, UserUncheckedUpdateWithoutImport_runsInput>
    create: XOR<UserCreateWithoutImport_runsInput, UserUncheckedCreateWithoutImport_runsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutImport_runsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutImport_runsInput, UserUncheckedUpdateWithoutImport_runsInput>
  }

  export type UserUpdateWithoutImport_runsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutUsersNestedInput
    productive_unit?: ProductiveUnitUpdateOneWithoutUsersNestedInput
    sessions?: AuthSessionUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUpdateManyWithoutUpdatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutImport_runsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    company_id?: NullableStringFieldUpdateOperationsInput | string | null
    productive_unit_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUncheckedUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUncheckedUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUncheckedUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUncheckedUpdateManyWithoutUpdatedByNestedInput
  }

  export type ImportRunRowUpsertWithWhereUniqueWithoutImport_runInput = {
    where: ImportRunRowWhereUniqueInput
    update: XOR<ImportRunRowUpdateWithoutImport_runInput, ImportRunRowUncheckedUpdateWithoutImport_runInput>
    create: XOR<ImportRunRowCreateWithoutImport_runInput, ImportRunRowUncheckedCreateWithoutImport_runInput>
  }

  export type ImportRunRowUpdateWithWhereUniqueWithoutImport_runInput = {
    where: ImportRunRowWhereUniqueInput
    data: XOR<ImportRunRowUpdateWithoutImport_runInput, ImportRunRowUncheckedUpdateWithoutImport_runInput>
  }

  export type ImportRunRowUpdateManyWithWhereWithoutImport_runInput = {
    where: ImportRunRowScalarWhereInput
    data: XOR<ImportRunRowUpdateManyMutationInput, ImportRunRowUncheckedUpdateManyWithoutImport_runInput>
  }

  export type ImportRunRowScalarWhereInput = {
    AND?: ImportRunRowScalarWhereInput | ImportRunRowScalarWhereInput[]
    OR?: ImportRunRowScalarWhereInput[]
    NOT?: ImportRunRowScalarWhereInput | ImportRunRowScalarWhereInput[]
    id?: UuidFilter<"ImportRunRow"> | string
    import_run_id?: UuidFilter<"ImportRunRow"> | string
    row_number?: IntFilter<"ImportRunRow"> | number
    raw_payload?: JsonFilter<"ImportRunRow">
    normalized_payload?: JsonNullableFilter<"ImportRunRow">
    status?: EnumImportRowStatusFilter<"ImportRunRow"> | $Enums.ImportRowStatus
    reason?: StringNullableFilter<"ImportRunRow"> | string | null
  }

  export type ImportRunCreateWithoutRowsInput = {
    id?: string
    source_name: string
    imported_at?: Date | string
    status?: $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    source?: ImportSourceCreateNestedOneWithoutImport_runsInput
    importedBy?: UserCreateNestedOneWithoutImport_runsInput
  }

  export type ImportRunUncheckedCreateWithoutRowsInput = {
    id?: string
    source_id?: string | null
    source_name: string
    imported_by?: string | null
    imported_at?: Date | string
    status?: $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
  }

  export type ImportRunCreateOrConnectWithoutRowsInput = {
    where: ImportRunWhereUniqueInput
    create: XOR<ImportRunCreateWithoutRowsInput, ImportRunUncheckedCreateWithoutRowsInput>
  }

  export type ImportRunUpsertWithoutRowsInput = {
    update: XOR<ImportRunUpdateWithoutRowsInput, ImportRunUncheckedUpdateWithoutRowsInput>
    create: XOR<ImportRunCreateWithoutRowsInput, ImportRunUncheckedCreateWithoutRowsInput>
    where?: ImportRunWhereInput
  }

  export type ImportRunUpdateToOneWithWhereWithoutRowsInput = {
    where?: ImportRunWhereInput
    data: XOR<ImportRunUpdateWithoutRowsInput, ImportRunUncheckedUpdateWithoutRowsInput>
  }

  export type ImportRunUpdateWithoutRowsInput = {
    id?: StringFieldUpdateOperationsInput | string
    source_name?: StringFieldUpdateOperationsInput | string
    imported_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumImportRunStatusFieldUpdateOperationsInput | $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    source?: ImportSourceUpdateOneWithoutImport_runsNestedInput
    importedBy?: UserUpdateOneWithoutImport_runsNestedInput
  }

  export type ImportRunUncheckedUpdateWithoutRowsInput = {
    id?: StringFieldUpdateOperationsInput | string
    source_id?: NullableStringFieldUpdateOperationsInput | string | null
    source_name?: StringFieldUpdateOperationsInput | string
    imported_by?: NullableStringFieldUpdateOperationsInput | string | null
    imported_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumImportRunStatusFieldUpdateOperationsInput | $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
  }

  export type ProductiveUnitCreateManyCompanyInput = {
    id: string
    name: string
    created_at?: Date | string
  }

  export type UserCreateManyCompanyInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    productive_unit_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type ProductiveUnitUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutProductive_unitNestedInput
  }

  export type ProductiveUnitUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutProductive_unitNestedInput
  }

  export type ProductiveUnitUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    productive_unit?: ProductiveUnitUpdateOneWithoutUsersNestedInput
    sessions?: AuthSessionUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUpdateManyWithoutImportedByNestedInput
  }

  export type UserUncheckedUpdateWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    productive_unit_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUncheckedUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUncheckedUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUncheckedUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUncheckedUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUncheckedUpdateManyWithoutImportedByNestedInput
  }

  export type UserUncheckedUpdateManyWithoutCompanyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    productive_unit_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyProductive_unitInput = {
    id?: string
    email: string
    password_hash: string
    full_name: string
    avatar_url?: string | null
    role: $Enums.Role
    company_id?: string | null
    level?: number
    xp?: number
    email_verified?: boolean
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type UserUpdateWithoutProductive_unitInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    company?: CompanyUpdateOneWithoutUsersNestedInput
    sessions?: AuthSessionUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUpdateManyWithoutImportedByNestedInput
  }

  export type UserUncheckedUpdateWithoutProductive_unitInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    company_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: AuthSessionUncheckedUpdateManyWithoutUserNestedInput
    user_badges?: UserBadgeUncheckedUpdateManyWithoutUserNestedInput
    awarded_badges?: UserBadgeUncheckedUpdateManyWithoutAwardedByNestedInput
    submissions?: BadgeSubmissionUncheckedUpdateManyWithoutUserNestedInput
    reviewed_submissions?: BadgeSubmissionUncheckedUpdateManyWithoutReviewedByNestedInput
    notifications?: NotificationUncheckedUpdateManyWithoutUserNestedInput
    badge_legend_settings?: BadgeLegendSettingUncheckedUpdateManyWithoutUpdatedByNestedInput
    import_runs?: ImportRunUncheckedUpdateManyWithoutImportedByNestedInput
  }

  export type UserUncheckedUpdateManyWithoutProductive_unitInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password_hash?: StringFieldUpdateOperationsInput | string
    full_name?: StringFieldUpdateOperationsInput | string
    avatar_url?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    company_id?: NullableStringFieldUpdateOperationsInput | string | null
    level?: IntFieldUpdateOperationsInput | number
    xp?: IntFieldUpdateOperationsInput | number
    email_verified?: BoolFieldUpdateOperationsInput | boolean
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuthSessionCreateManyUserInput = {
    id?: string
    created_at?: Date | string
    expires_at: Date | string
    revoked_at?: Date | string | null
  }

  export type UserBadgeCreateManyUserInput = {
    id?: string
    badge_id: string
    awarded_at?: Date | string
    awarded_by?: string | null
    tone: $Enums.BadgeTone
  }

  export type UserBadgeCreateManyAwardedByInput = {
    id?: string
    user_id: string
    badge_id: string
    awarded_at?: Date | string
    tone: $Enums.BadgeTone
  }

  export type BadgeSubmissionCreateManyUserInput = {
    id?: string
    badge_id: string
    proof_url?: string | null
    description?: string | null
    status?: $Enums.SubmissionStatus
    submitted_at?: Date | string
    reviewed_by?: string | null
    reviewed_at?: Date | string | null
    feedback?: string | null
  }

  export type BadgeSubmissionCreateManyReviewedByInput = {
    id?: string
    user_id: string
    badge_id: string
    proof_url?: string | null
    description?: string | null
    status?: $Enums.SubmissionStatus
    submitted_at?: Date | string
    reviewed_at?: Date | string | null
    feedback?: string | null
  }

  export type NotificationCreateManyUserInput = {
    id?: string
    title: string
    message: string
    sent_at?: Date | string
    read?: boolean
  }

  export type BadgeLegendSettingCreateManyUpdatedByInput = {
    id?: string
    bronze: string
    silver: string
    gold: string
    loss_1: string
    loss_2: string
    updated_at?: Date | string
  }

  export type ImportRunCreateManyImportedByInput = {
    id?: string
    source_id?: string | null
    source_name: string
    imported_at?: Date | string
    status?: $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
  }

  export type AuthSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuthSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AuthSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    expires_at?: DateTimeFieldUpdateOperationsInput | Date | string
    revoked_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserBadgeUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    awarded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tone?: EnumBadgeToneFieldUpdateOperationsInput | $Enums.BadgeTone
    badge?: BadgeUpdateOneRequiredWithoutUser_badgesNestedInput
    awardedBy?: UserUpdateOneWithoutAwarded_badgesNestedInput
  }

  export type UserBadgeUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    badge_id?: StringFieldUpdateOperationsInput | string
    awarded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    awarded_by?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: EnumBadgeToneFieldUpdateOperationsInput | $Enums.BadgeTone
  }

  export type UserBadgeUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    badge_id?: StringFieldUpdateOperationsInput | string
    awarded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    awarded_by?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: EnumBadgeToneFieldUpdateOperationsInput | $Enums.BadgeTone
  }

  export type UserBadgeUpdateWithoutAwardedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    awarded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tone?: EnumBadgeToneFieldUpdateOperationsInput | $Enums.BadgeTone
    user?: UserUpdateOneRequiredWithoutUser_badgesNestedInput
    badge?: BadgeUpdateOneRequiredWithoutUser_badgesNestedInput
  }

  export type UserBadgeUncheckedUpdateWithoutAwardedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    badge_id?: StringFieldUpdateOperationsInput | string
    awarded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tone?: EnumBadgeToneFieldUpdateOperationsInput | $Enums.BadgeTone
  }

  export type UserBadgeUncheckedUpdateManyWithoutAwardedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    badge_id?: StringFieldUpdateOperationsInput | string
    awarded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tone?: EnumBadgeToneFieldUpdateOperationsInput | $Enums.BadgeTone
  }

  export type BadgeSubmissionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    proof_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    badge?: BadgeUpdateOneRequiredWithoutSubmissionsNestedInput
    reviewedBy?: UserUpdateOneWithoutReviewed_submissionsNestedInput
  }

  export type BadgeSubmissionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    badge_id?: StringFieldUpdateOperationsInput | string
    proof_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewed_by?: NullableStringFieldUpdateOperationsInput | string | null
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BadgeSubmissionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    badge_id?: StringFieldUpdateOperationsInput | string
    proof_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewed_by?: NullableStringFieldUpdateOperationsInput | string | null
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BadgeSubmissionUpdateWithoutReviewedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    proof_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSubmissionsNestedInput
    badge?: BadgeUpdateOneRequiredWithoutSubmissionsNestedInput
  }

  export type BadgeSubmissionUncheckedUpdateWithoutReviewedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    badge_id?: StringFieldUpdateOperationsInput | string
    proof_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BadgeSubmissionUncheckedUpdateManyWithoutReviewedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    badge_id?: StringFieldUpdateOperationsInput | string
    proof_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type NotificationUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    sent_at?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type BadgeLegendSettingUpdateWithoutUpdatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    bronze?: StringFieldUpdateOperationsInput | string
    silver?: StringFieldUpdateOperationsInput | string
    gold?: StringFieldUpdateOperationsInput | string
    loss_1?: StringFieldUpdateOperationsInput | string
    loss_2?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BadgeLegendSettingUncheckedUpdateWithoutUpdatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    bronze?: StringFieldUpdateOperationsInput | string
    silver?: StringFieldUpdateOperationsInput | string
    gold?: StringFieldUpdateOperationsInput | string
    loss_1?: StringFieldUpdateOperationsInput | string
    loss_2?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type BadgeLegendSettingUncheckedUpdateManyWithoutUpdatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    bronze?: StringFieldUpdateOperationsInput | string
    silver?: StringFieldUpdateOperationsInput | string
    gold?: StringFieldUpdateOperationsInput | string
    loss_1?: StringFieldUpdateOperationsInput | string
    loss_2?: StringFieldUpdateOperationsInput | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ImportRunUpdateWithoutImportedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    source_name?: StringFieldUpdateOperationsInput | string
    imported_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumImportRunStatusFieldUpdateOperationsInput | $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    source?: ImportSourceUpdateOneWithoutImport_runsNestedInput
    rows?: ImportRunRowUpdateManyWithoutImport_runNestedInput
  }

  export type ImportRunUncheckedUpdateWithoutImportedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    source_id?: NullableStringFieldUpdateOperationsInput | string | null
    source_name?: StringFieldUpdateOperationsInput | string
    imported_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumImportRunStatusFieldUpdateOperationsInput | $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    rows?: ImportRunRowUncheckedUpdateManyWithoutImport_runNestedInput
  }

  export type ImportRunUncheckedUpdateManyWithoutImportedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    source_id?: NullableStringFieldUpdateOperationsInput | string | null
    source_name?: StringFieldUpdateOperationsInput | string
    imported_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumImportRunStatusFieldUpdateOperationsInput | $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
  }

  export type UserBadgeCreateManyBadgeInput = {
    id?: string
    user_id: string
    awarded_at?: Date | string
    awarded_by?: string | null
    tone: $Enums.BadgeTone
  }

  export type BadgeSubmissionCreateManyBadgeInput = {
    id?: string
    user_id: string
    proof_url?: string | null
    description?: string | null
    status?: $Enums.SubmissionStatus
    submitted_at?: Date | string
    reviewed_by?: string | null
    reviewed_at?: Date | string | null
    feedback?: string | null
  }

  export type UserBadgeUpdateWithoutBadgeInput = {
    id?: StringFieldUpdateOperationsInput | string
    awarded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    tone?: EnumBadgeToneFieldUpdateOperationsInput | $Enums.BadgeTone
    user?: UserUpdateOneRequiredWithoutUser_badgesNestedInput
    awardedBy?: UserUpdateOneWithoutAwarded_badgesNestedInput
  }

  export type UserBadgeUncheckedUpdateWithoutBadgeInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    awarded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    awarded_by?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: EnumBadgeToneFieldUpdateOperationsInput | $Enums.BadgeTone
  }

  export type UserBadgeUncheckedUpdateManyWithoutBadgeInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    awarded_at?: DateTimeFieldUpdateOperationsInput | Date | string
    awarded_by?: NullableStringFieldUpdateOperationsInput | string | null
    tone?: EnumBadgeToneFieldUpdateOperationsInput | $Enums.BadgeTone
  }

  export type BadgeSubmissionUpdateWithoutBadgeInput = {
    id?: StringFieldUpdateOperationsInput | string
    proof_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
    user?: UserUpdateOneRequiredWithoutSubmissionsNestedInput
    reviewedBy?: UserUpdateOneWithoutReviewed_submissionsNestedInput
  }

  export type BadgeSubmissionUncheckedUpdateWithoutBadgeInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    proof_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewed_by?: NullableStringFieldUpdateOperationsInput | string | null
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type BadgeSubmissionUncheckedUpdateManyWithoutBadgeInput = {
    id?: StringFieldUpdateOperationsInput | string
    user_id?: StringFieldUpdateOperationsInput | string
    proof_url?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSubmissionStatusFieldUpdateOperationsInput | $Enums.SubmissionStatus
    submitted_at?: DateTimeFieldUpdateOperationsInput | Date | string
    reviewed_by?: NullableStringFieldUpdateOperationsInput | string | null
    reviewed_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    feedback?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ImportRunCreateManySourceInput = {
    id?: string
    source_name: string
    imported_by?: string | null
    imported_at?: Date | string
    status?: $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
  }

  export type ImportRunUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    source_name?: StringFieldUpdateOperationsInput | string
    imported_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumImportRunStatusFieldUpdateOperationsInput | $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    importedBy?: UserUpdateOneWithoutImport_runsNestedInput
    rows?: ImportRunRowUpdateManyWithoutImport_runNestedInput
  }

  export type ImportRunUncheckedUpdateWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    source_name?: StringFieldUpdateOperationsInput | string
    imported_by?: NullableStringFieldUpdateOperationsInput | string | null
    imported_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumImportRunStatusFieldUpdateOperationsInput | $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
    rows?: ImportRunRowUncheckedUpdateManyWithoutImport_runNestedInput
  }

  export type ImportRunUncheckedUpdateManyWithoutSourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    source_name?: StringFieldUpdateOperationsInput | string
    imported_by?: NullableStringFieldUpdateOperationsInput | string | null
    imported_at?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumImportRunStatusFieldUpdateOperationsInput | $Enums.ImportRunStatus
    matched_columns?: JsonNullValueInput | InputJsonValue
    summary?: JsonNullValueInput | InputJsonValue
  }

  export type ImportRunRowCreateManyImport_runInput = {
    id?: string
    row_number: number
    raw_payload: JsonNullValueInput | InputJsonValue
    normalized_payload?: NullableJsonNullValueInput | InputJsonValue
    status: $Enums.ImportRowStatus
    reason?: string | null
  }

  export type ImportRunRowUpdateWithoutImport_runInput = {
    id?: StringFieldUpdateOperationsInput | string
    row_number?: IntFieldUpdateOperationsInput | number
    raw_payload?: JsonNullValueInput | InputJsonValue
    normalized_payload?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ImportRunRowUncheckedUpdateWithoutImport_runInput = {
    id?: StringFieldUpdateOperationsInput | string
    row_number?: IntFieldUpdateOperationsInput | number
    raw_payload?: JsonNullValueInput | InputJsonValue
    normalized_payload?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ImportRunRowUncheckedUpdateManyWithoutImport_runInput = {
    id?: StringFieldUpdateOperationsInput | string
    row_number?: IntFieldUpdateOperationsInput | number
    raw_payload?: JsonNullValueInput | InputJsonValue
    normalized_payload?: NullableJsonNullValueInput | InputJsonValue
    status?: EnumImportRowStatusFieldUpdateOperationsInput | $Enums.ImportRowStatus
    reason?: NullableStringFieldUpdateOperationsInput | string | null
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