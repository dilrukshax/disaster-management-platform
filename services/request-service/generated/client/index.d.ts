
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
 * Model ReliefRequest
 * 
 */
export type ReliefRequest = $Result.DefaultSelection<Prisma.$ReliefRequestPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const RequestCategory: {
  water: 'water',
  food: 'food',
  medicine: 'medicine',
  shelter: 'shelter',
  rescue: 'rescue',
  transport: 'transport',
  other: 'other'
};

export type RequestCategory = (typeof RequestCategory)[keyof typeof RequestCategory]


export const Urgency: {
  low: 'low',
  medium: 'medium',
  high: 'high'
};

export type Urgency = (typeof Urgency)[keyof typeof Urgency]


export const RequestStatus: {
  pending: 'pending',
  matched: 'matched',
  assigned: 'assigned',
  in_progress: 'in_progress',
  completed: 'completed',
  cancelled: 'cancelled'
};

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus]

}

export type RequestCategory = $Enums.RequestCategory

export const RequestCategory: typeof $Enums.RequestCategory

export type Urgency = $Enums.Urgency

export const Urgency: typeof $Enums.Urgency

export type RequestStatus = $Enums.RequestStatus

export const RequestStatus: typeof $Enums.RequestStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ReliefRequests
 * const reliefRequests = await prisma.reliefRequest.findMany()
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
   * // Fetch zero or more ReliefRequests
   * const reliefRequests = await prisma.reliefRequest.findMany()
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
   * `prisma.reliefRequest`: Exposes CRUD operations for the **ReliefRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ReliefRequests
    * const reliefRequests = await prisma.reliefRequest.findMany()
    * ```
    */
  get reliefRequest(): Prisma.ReliefRequestDelegate<ExtArgs, ClientOptions>;
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
    ReliefRequest: 'ReliefRequest'
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
      modelProps: "reliefRequest"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ReliefRequest: {
        payload: Prisma.$ReliefRequestPayload<ExtArgs>
        fields: Prisma.ReliefRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ReliefRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReliefRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ReliefRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReliefRequestPayload>
          }
          findFirst: {
            args: Prisma.ReliefRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReliefRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ReliefRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReliefRequestPayload>
          }
          findMany: {
            args: Prisma.ReliefRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReliefRequestPayload>[]
          }
          create: {
            args: Prisma.ReliefRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReliefRequestPayload>
          }
          createMany: {
            args: Prisma.ReliefRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ReliefRequestCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReliefRequestPayload>[]
          }
          delete: {
            args: Prisma.ReliefRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReliefRequestPayload>
          }
          update: {
            args: Prisma.ReliefRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReliefRequestPayload>
          }
          deleteMany: {
            args: Prisma.ReliefRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ReliefRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ReliefRequestUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReliefRequestPayload>[]
          }
          upsert: {
            args: Prisma.ReliefRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ReliefRequestPayload>
          }
          aggregate: {
            args: Prisma.ReliefRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateReliefRequest>
          }
          groupBy: {
            args: Prisma.ReliefRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<ReliefRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.ReliefRequestCountArgs<ExtArgs>
            result: $Utils.Optional<ReliefRequestCountAggregateOutputType> | number
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
    reliefRequest?: ReliefRequestOmit
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
   * Models
   */

  /**
   * Model ReliefRequest
   */

  export type AggregateReliefRequest = {
    _count: ReliefRequestCountAggregateOutputType | null
    _avg: ReliefRequestAvgAggregateOutputType | null
    _sum: ReliefRequestSumAggregateOutputType | null
    _min: ReliefRequestMinAggregateOutputType | null
    _max: ReliefRequestMaxAggregateOutputType | null
  }

  export type ReliefRequestAvgAggregateOutputType = {
    peopleCount: number | null
  }

  export type ReliefRequestSumAggregateOutputType = {
    peopleCount: number | null
  }

  export type ReliefRequestMinAggregateOutputType = {
    id: string | null
    requesterId: string | null
    category: $Enums.RequestCategory | null
    description: string | null
    urgency: $Enums.Urgency | null
    district: string | null
    city: string | null
    peopleCount: number | null
    status: $Enums.RequestStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReliefRequestMaxAggregateOutputType = {
    id: string | null
    requesterId: string | null
    category: $Enums.RequestCategory | null
    description: string | null
    urgency: $Enums.Urgency | null
    district: string | null
    city: string | null
    peopleCount: number | null
    status: $Enums.RequestStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ReliefRequestCountAggregateOutputType = {
    id: number
    requesterId: number
    category: number
    description: number
    urgency: number
    district: number
    city: number
    peopleCount: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ReliefRequestAvgAggregateInputType = {
    peopleCount?: true
  }

  export type ReliefRequestSumAggregateInputType = {
    peopleCount?: true
  }

  export type ReliefRequestMinAggregateInputType = {
    id?: true
    requesterId?: true
    category?: true
    description?: true
    urgency?: true
    district?: true
    city?: true
    peopleCount?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReliefRequestMaxAggregateInputType = {
    id?: true
    requesterId?: true
    category?: true
    description?: true
    urgency?: true
    district?: true
    city?: true
    peopleCount?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ReliefRequestCountAggregateInputType = {
    id?: true
    requesterId?: true
    category?: true
    description?: true
    urgency?: true
    district?: true
    city?: true
    peopleCount?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ReliefRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReliefRequest to aggregate.
     */
    where?: ReliefRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReliefRequests to fetch.
     */
    orderBy?: ReliefRequestOrderByWithRelationInput | ReliefRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ReliefRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReliefRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReliefRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ReliefRequests
    **/
    _count?: true | ReliefRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ReliefRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ReliefRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ReliefRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ReliefRequestMaxAggregateInputType
  }

  export type GetReliefRequestAggregateType<T extends ReliefRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateReliefRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateReliefRequest[P]>
      : GetScalarType<T[P], AggregateReliefRequest[P]>
  }




  export type ReliefRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ReliefRequestWhereInput
    orderBy?: ReliefRequestOrderByWithAggregationInput | ReliefRequestOrderByWithAggregationInput[]
    by: ReliefRequestScalarFieldEnum[] | ReliefRequestScalarFieldEnum
    having?: ReliefRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ReliefRequestCountAggregateInputType | true
    _avg?: ReliefRequestAvgAggregateInputType
    _sum?: ReliefRequestSumAggregateInputType
    _min?: ReliefRequestMinAggregateInputType
    _max?: ReliefRequestMaxAggregateInputType
  }

  export type ReliefRequestGroupByOutputType = {
    id: string
    requesterId: string
    category: $Enums.RequestCategory
    description: string
    urgency: $Enums.Urgency
    district: string
    city: string
    peopleCount: number
    status: $Enums.RequestStatus
    createdAt: Date
    updatedAt: Date
    _count: ReliefRequestCountAggregateOutputType | null
    _avg: ReliefRequestAvgAggregateOutputType | null
    _sum: ReliefRequestSumAggregateOutputType | null
    _min: ReliefRequestMinAggregateOutputType | null
    _max: ReliefRequestMaxAggregateOutputType | null
  }

  type GetReliefRequestGroupByPayload<T extends ReliefRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ReliefRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ReliefRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ReliefRequestGroupByOutputType[P]>
            : GetScalarType<T[P], ReliefRequestGroupByOutputType[P]>
        }
      >
    >


  export type ReliefRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    category?: boolean
    description?: boolean
    urgency?: boolean
    district?: boolean
    city?: boolean
    peopleCount?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["reliefRequest"]>

  export type ReliefRequestSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    category?: boolean
    description?: boolean
    urgency?: boolean
    district?: boolean
    city?: boolean
    peopleCount?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["reliefRequest"]>

  export type ReliefRequestSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    category?: boolean
    description?: boolean
    urgency?: boolean
    district?: boolean
    city?: boolean
    peopleCount?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["reliefRequest"]>

  export type ReliefRequestSelectScalar = {
    id?: boolean
    requesterId?: boolean
    category?: boolean
    description?: boolean
    urgency?: boolean
    district?: boolean
    city?: boolean
    peopleCount?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ReliefRequestOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requesterId" | "category" | "description" | "urgency" | "district" | "city" | "peopleCount" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["reliefRequest"]>

  export type $ReliefRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ReliefRequest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requesterId: string
      category: $Enums.RequestCategory
      description: string
      urgency: $Enums.Urgency
      district: string
      city: string
      peopleCount: number
      status: $Enums.RequestStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["reliefRequest"]>
    composites: {}
  }

  type ReliefRequestGetPayload<S extends boolean | null | undefined | ReliefRequestDefaultArgs> = $Result.GetResult<Prisma.$ReliefRequestPayload, S>

  type ReliefRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ReliefRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ReliefRequestCountAggregateInputType | true
    }

  export interface ReliefRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ReliefRequest'], meta: { name: 'ReliefRequest' } }
    /**
     * Find zero or one ReliefRequest that matches the filter.
     * @param {ReliefRequestFindUniqueArgs} args - Arguments to find a ReliefRequest
     * @example
     * // Get one ReliefRequest
     * const reliefRequest = await prisma.reliefRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ReliefRequestFindUniqueArgs>(args: SelectSubset<T, ReliefRequestFindUniqueArgs<ExtArgs>>): Prisma__ReliefRequestClient<$Result.GetResult<Prisma.$ReliefRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ReliefRequest that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ReliefRequestFindUniqueOrThrowArgs} args - Arguments to find a ReliefRequest
     * @example
     * // Get one ReliefRequest
     * const reliefRequest = await prisma.reliefRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ReliefRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, ReliefRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ReliefRequestClient<$Result.GetResult<Prisma.$ReliefRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReliefRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReliefRequestFindFirstArgs} args - Arguments to find a ReliefRequest
     * @example
     * // Get one ReliefRequest
     * const reliefRequest = await prisma.reliefRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ReliefRequestFindFirstArgs>(args?: SelectSubset<T, ReliefRequestFindFirstArgs<ExtArgs>>): Prisma__ReliefRequestClient<$Result.GetResult<Prisma.$ReliefRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ReliefRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReliefRequestFindFirstOrThrowArgs} args - Arguments to find a ReliefRequest
     * @example
     * // Get one ReliefRequest
     * const reliefRequest = await prisma.reliefRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ReliefRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, ReliefRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__ReliefRequestClient<$Result.GetResult<Prisma.$ReliefRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ReliefRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReliefRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ReliefRequests
     * const reliefRequests = await prisma.reliefRequest.findMany()
     * 
     * // Get first 10 ReliefRequests
     * const reliefRequests = await prisma.reliefRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const reliefRequestWithIdOnly = await prisma.reliefRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ReliefRequestFindManyArgs>(args?: SelectSubset<T, ReliefRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReliefRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ReliefRequest.
     * @param {ReliefRequestCreateArgs} args - Arguments to create a ReliefRequest.
     * @example
     * // Create one ReliefRequest
     * const ReliefRequest = await prisma.reliefRequest.create({
     *   data: {
     *     // ... data to create a ReliefRequest
     *   }
     * })
     * 
     */
    create<T extends ReliefRequestCreateArgs>(args: SelectSubset<T, ReliefRequestCreateArgs<ExtArgs>>): Prisma__ReliefRequestClient<$Result.GetResult<Prisma.$ReliefRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ReliefRequests.
     * @param {ReliefRequestCreateManyArgs} args - Arguments to create many ReliefRequests.
     * @example
     * // Create many ReliefRequests
     * const reliefRequest = await prisma.reliefRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ReliefRequestCreateManyArgs>(args?: SelectSubset<T, ReliefRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ReliefRequests and returns the data saved in the database.
     * @param {ReliefRequestCreateManyAndReturnArgs} args - Arguments to create many ReliefRequests.
     * @example
     * // Create many ReliefRequests
     * const reliefRequest = await prisma.reliefRequest.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ReliefRequests and only return the `id`
     * const reliefRequestWithIdOnly = await prisma.reliefRequest.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ReliefRequestCreateManyAndReturnArgs>(args?: SelectSubset<T, ReliefRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReliefRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ReliefRequest.
     * @param {ReliefRequestDeleteArgs} args - Arguments to delete one ReliefRequest.
     * @example
     * // Delete one ReliefRequest
     * const ReliefRequest = await prisma.reliefRequest.delete({
     *   where: {
     *     // ... filter to delete one ReliefRequest
     *   }
     * })
     * 
     */
    delete<T extends ReliefRequestDeleteArgs>(args: SelectSubset<T, ReliefRequestDeleteArgs<ExtArgs>>): Prisma__ReliefRequestClient<$Result.GetResult<Prisma.$ReliefRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ReliefRequest.
     * @param {ReliefRequestUpdateArgs} args - Arguments to update one ReliefRequest.
     * @example
     * // Update one ReliefRequest
     * const reliefRequest = await prisma.reliefRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ReliefRequestUpdateArgs>(args: SelectSubset<T, ReliefRequestUpdateArgs<ExtArgs>>): Prisma__ReliefRequestClient<$Result.GetResult<Prisma.$ReliefRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ReliefRequests.
     * @param {ReliefRequestDeleteManyArgs} args - Arguments to filter ReliefRequests to delete.
     * @example
     * // Delete a few ReliefRequests
     * const { count } = await prisma.reliefRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ReliefRequestDeleteManyArgs>(args?: SelectSubset<T, ReliefRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReliefRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReliefRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ReliefRequests
     * const reliefRequest = await prisma.reliefRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ReliefRequestUpdateManyArgs>(args: SelectSubset<T, ReliefRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ReliefRequests and returns the data updated in the database.
     * @param {ReliefRequestUpdateManyAndReturnArgs} args - Arguments to update many ReliefRequests.
     * @example
     * // Update many ReliefRequests
     * const reliefRequest = await prisma.reliefRequest.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ReliefRequests and only return the `id`
     * const reliefRequestWithIdOnly = await prisma.reliefRequest.updateManyAndReturn({
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
    updateManyAndReturn<T extends ReliefRequestUpdateManyAndReturnArgs>(args: SelectSubset<T, ReliefRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ReliefRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ReliefRequest.
     * @param {ReliefRequestUpsertArgs} args - Arguments to update or create a ReliefRequest.
     * @example
     * // Update or create a ReliefRequest
     * const reliefRequest = await prisma.reliefRequest.upsert({
     *   create: {
     *     // ... data to create a ReliefRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ReliefRequest we want to update
     *   }
     * })
     */
    upsert<T extends ReliefRequestUpsertArgs>(args: SelectSubset<T, ReliefRequestUpsertArgs<ExtArgs>>): Prisma__ReliefRequestClient<$Result.GetResult<Prisma.$ReliefRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ReliefRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReliefRequestCountArgs} args - Arguments to filter ReliefRequests to count.
     * @example
     * // Count the number of ReliefRequests
     * const count = await prisma.reliefRequest.count({
     *   where: {
     *     // ... the filter for the ReliefRequests we want to count
     *   }
     * })
    **/
    count<T extends ReliefRequestCountArgs>(
      args?: Subset<T, ReliefRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ReliefRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ReliefRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReliefRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ReliefRequestAggregateArgs>(args: Subset<T, ReliefRequestAggregateArgs>): Prisma.PrismaPromise<GetReliefRequestAggregateType<T>>

    /**
     * Group by ReliefRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ReliefRequestGroupByArgs} args - Group by arguments.
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
      T extends ReliefRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ReliefRequestGroupByArgs['orderBy'] }
        : { orderBy?: ReliefRequestGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, ReliefRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetReliefRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ReliefRequest model
   */
  readonly fields: ReliefRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ReliefRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ReliefRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the ReliefRequest model
   */
  interface ReliefRequestFieldRefs {
    readonly id: FieldRef<"ReliefRequest", 'String'>
    readonly requesterId: FieldRef<"ReliefRequest", 'String'>
    readonly category: FieldRef<"ReliefRequest", 'RequestCategory'>
    readonly description: FieldRef<"ReliefRequest", 'String'>
    readonly urgency: FieldRef<"ReliefRequest", 'Urgency'>
    readonly district: FieldRef<"ReliefRequest", 'String'>
    readonly city: FieldRef<"ReliefRequest", 'String'>
    readonly peopleCount: FieldRef<"ReliefRequest", 'Int'>
    readonly status: FieldRef<"ReliefRequest", 'RequestStatus'>
    readonly createdAt: FieldRef<"ReliefRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"ReliefRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ReliefRequest findUnique
   */
  export type ReliefRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReliefRequest
     */
    select?: ReliefRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReliefRequest
     */
    omit?: ReliefRequestOmit<ExtArgs> | null
    /**
     * Filter, which ReliefRequest to fetch.
     */
    where: ReliefRequestWhereUniqueInput
  }

  /**
   * ReliefRequest findUniqueOrThrow
   */
  export type ReliefRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReliefRequest
     */
    select?: ReliefRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReliefRequest
     */
    omit?: ReliefRequestOmit<ExtArgs> | null
    /**
     * Filter, which ReliefRequest to fetch.
     */
    where: ReliefRequestWhereUniqueInput
  }

  /**
   * ReliefRequest findFirst
   */
  export type ReliefRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReliefRequest
     */
    select?: ReliefRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReliefRequest
     */
    omit?: ReliefRequestOmit<ExtArgs> | null
    /**
     * Filter, which ReliefRequest to fetch.
     */
    where?: ReliefRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReliefRequests to fetch.
     */
    orderBy?: ReliefRequestOrderByWithRelationInput | ReliefRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReliefRequests.
     */
    cursor?: ReliefRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReliefRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReliefRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReliefRequests.
     */
    distinct?: ReliefRequestScalarFieldEnum | ReliefRequestScalarFieldEnum[]
  }

  /**
   * ReliefRequest findFirstOrThrow
   */
  export type ReliefRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReliefRequest
     */
    select?: ReliefRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReliefRequest
     */
    omit?: ReliefRequestOmit<ExtArgs> | null
    /**
     * Filter, which ReliefRequest to fetch.
     */
    where?: ReliefRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReliefRequests to fetch.
     */
    orderBy?: ReliefRequestOrderByWithRelationInput | ReliefRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ReliefRequests.
     */
    cursor?: ReliefRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReliefRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReliefRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ReliefRequests.
     */
    distinct?: ReliefRequestScalarFieldEnum | ReliefRequestScalarFieldEnum[]
  }

  /**
   * ReliefRequest findMany
   */
  export type ReliefRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReliefRequest
     */
    select?: ReliefRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReliefRequest
     */
    omit?: ReliefRequestOmit<ExtArgs> | null
    /**
     * Filter, which ReliefRequests to fetch.
     */
    where?: ReliefRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ReliefRequests to fetch.
     */
    orderBy?: ReliefRequestOrderByWithRelationInput | ReliefRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ReliefRequests.
     */
    cursor?: ReliefRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ReliefRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ReliefRequests.
     */
    skip?: number
    distinct?: ReliefRequestScalarFieldEnum | ReliefRequestScalarFieldEnum[]
  }

  /**
   * ReliefRequest create
   */
  export type ReliefRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReliefRequest
     */
    select?: ReliefRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReliefRequest
     */
    omit?: ReliefRequestOmit<ExtArgs> | null
    /**
     * The data needed to create a ReliefRequest.
     */
    data: XOR<ReliefRequestCreateInput, ReliefRequestUncheckedCreateInput>
  }

  /**
   * ReliefRequest createMany
   */
  export type ReliefRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ReliefRequests.
     */
    data: ReliefRequestCreateManyInput | ReliefRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReliefRequest createManyAndReturn
   */
  export type ReliefRequestCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReliefRequest
     */
    select?: ReliefRequestSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReliefRequest
     */
    omit?: ReliefRequestOmit<ExtArgs> | null
    /**
     * The data used to create many ReliefRequests.
     */
    data: ReliefRequestCreateManyInput | ReliefRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ReliefRequest update
   */
  export type ReliefRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReliefRequest
     */
    select?: ReliefRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReliefRequest
     */
    omit?: ReliefRequestOmit<ExtArgs> | null
    /**
     * The data needed to update a ReliefRequest.
     */
    data: XOR<ReliefRequestUpdateInput, ReliefRequestUncheckedUpdateInput>
    /**
     * Choose, which ReliefRequest to update.
     */
    where: ReliefRequestWhereUniqueInput
  }

  /**
   * ReliefRequest updateMany
   */
  export type ReliefRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ReliefRequests.
     */
    data: XOR<ReliefRequestUpdateManyMutationInput, ReliefRequestUncheckedUpdateManyInput>
    /**
     * Filter which ReliefRequests to update
     */
    where?: ReliefRequestWhereInput
    /**
     * Limit how many ReliefRequests to update.
     */
    limit?: number
  }

  /**
   * ReliefRequest updateManyAndReturn
   */
  export type ReliefRequestUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReliefRequest
     */
    select?: ReliefRequestSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ReliefRequest
     */
    omit?: ReliefRequestOmit<ExtArgs> | null
    /**
     * The data used to update ReliefRequests.
     */
    data: XOR<ReliefRequestUpdateManyMutationInput, ReliefRequestUncheckedUpdateManyInput>
    /**
     * Filter which ReliefRequests to update
     */
    where?: ReliefRequestWhereInput
    /**
     * Limit how many ReliefRequests to update.
     */
    limit?: number
  }

  /**
   * ReliefRequest upsert
   */
  export type ReliefRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReliefRequest
     */
    select?: ReliefRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReliefRequest
     */
    omit?: ReliefRequestOmit<ExtArgs> | null
    /**
     * The filter to search for the ReliefRequest to update in case it exists.
     */
    where: ReliefRequestWhereUniqueInput
    /**
     * In case the ReliefRequest found by the `where` argument doesn't exist, create a new ReliefRequest with this data.
     */
    create: XOR<ReliefRequestCreateInput, ReliefRequestUncheckedCreateInput>
    /**
     * In case the ReliefRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ReliefRequestUpdateInput, ReliefRequestUncheckedUpdateInput>
  }

  /**
   * ReliefRequest delete
   */
  export type ReliefRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReliefRequest
     */
    select?: ReliefRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReliefRequest
     */
    omit?: ReliefRequestOmit<ExtArgs> | null
    /**
     * Filter which ReliefRequest to delete.
     */
    where: ReliefRequestWhereUniqueInput
  }

  /**
   * ReliefRequest deleteMany
   */
  export type ReliefRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ReliefRequests to delete
     */
    where?: ReliefRequestWhereInput
    /**
     * Limit how many ReliefRequests to delete.
     */
    limit?: number
  }

  /**
   * ReliefRequest without action
   */
  export type ReliefRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ReliefRequest
     */
    select?: ReliefRequestSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ReliefRequest
     */
    omit?: ReliefRequestOmit<ExtArgs> | null
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


  export const ReliefRequestScalarFieldEnum: {
    id: 'id',
    requesterId: 'requesterId',
    category: 'category',
    description: 'description',
    urgency: 'urgency',
    district: 'district',
    city: 'city',
    peopleCount: 'peopleCount',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ReliefRequestScalarFieldEnum = (typeof ReliefRequestScalarFieldEnum)[keyof typeof ReliefRequestScalarFieldEnum]


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
   * Reference to a field of type 'RequestCategory'
   */
  export type EnumRequestCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestCategory'>
    


  /**
   * Reference to a field of type 'RequestCategory[]'
   */
  export type ListEnumRequestCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestCategory[]'>
    


  /**
   * Reference to a field of type 'Urgency'
   */
  export type EnumUrgencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Urgency'>
    


  /**
   * Reference to a field of type 'Urgency[]'
   */
  export type ListEnumUrgencyFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Urgency[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'RequestStatus'
   */
  export type EnumRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestStatus'>
    


  /**
   * Reference to a field of type 'RequestStatus[]'
   */
  export type ListEnumRequestStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'RequestStatus[]'>
    


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
   * Deep Input Types
   */


  export type ReliefRequestWhereInput = {
    AND?: ReliefRequestWhereInput | ReliefRequestWhereInput[]
    OR?: ReliefRequestWhereInput[]
    NOT?: ReliefRequestWhereInput | ReliefRequestWhereInput[]
    id?: StringFilter<"ReliefRequest"> | string
    requesterId?: StringFilter<"ReliefRequest"> | string
    category?: EnumRequestCategoryFilter<"ReliefRequest"> | $Enums.RequestCategory
    description?: StringFilter<"ReliefRequest"> | string
    urgency?: EnumUrgencyFilter<"ReliefRequest"> | $Enums.Urgency
    district?: StringFilter<"ReliefRequest"> | string
    city?: StringFilter<"ReliefRequest"> | string
    peopleCount?: IntFilter<"ReliefRequest"> | number
    status?: EnumRequestStatusFilter<"ReliefRequest"> | $Enums.RequestStatus
    createdAt?: DateTimeFilter<"ReliefRequest"> | Date | string
    updatedAt?: DateTimeFilter<"ReliefRequest"> | Date | string
  }

  export type ReliefRequestOrderByWithRelationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    category?: SortOrder
    description?: SortOrder
    urgency?: SortOrder
    district?: SortOrder
    city?: SortOrder
    peopleCount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReliefRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ReliefRequestWhereInput | ReliefRequestWhereInput[]
    OR?: ReliefRequestWhereInput[]
    NOT?: ReliefRequestWhereInput | ReliefRequestWhereInput[]
    requesterId?: StringFilter<"ReliefRequest"> | string
    category?: EnumRequestCategoryFilter<"ReliefRequest"> | $Enums.RequestCategory
    description?: StringFilter<"ReliefRequest"> | string
    urgency?: EnumUrgencyFilter<"ReliefRequest"> | $Enums.Urgency
    district?: StringFilter<"ReliefRequest"> | string
    city?: StringFilter<"ReliefRequest"> | string
    peopleCount?: IntFilter<"ReliefRequest"> | number
    status?: EnumRequestStatusFilter<"ReliefRequest"> | $Enums.RequestStatus
    createdAt?: DateTimeFilter<"ReliefRequest"> | Date | string
    updatedAt?: DateTimeFilter<"ReliefRequest"> | Date | string
  }, "id">

  export type ReliefRequestOrderByWithAggregationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    category?: SortOrder
    description?: SortOrder
    urgency?: SortOrder
    district?: SortOrder
    city?: SortOrder
    peopleCount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ReliefRequestCountOrderByAggregateInput
    _avg?: ReliefRequestAvgOrderByAggregateInput
    _max?: ReliefRequestMaxOrderByAggregateInput
    _min?: ReliefRequestMinOrderByAggregateInput
    _sum?: ReliefRequestSumOrderByAggregateInput
  }

  export type ReliefRequestScalarWhereWithAggregatesInput = {
    AND?: ReliefRequestScalarWhereWithAggregatesInput | ReliefRequestScalarWhereWithAggregatesInput[]
    OR?: ReliefRequestScalarWhereWithAggregatesInput[]
    NOT?: ReliefRequestScalarWhereWithAggregatesInput | ReliefRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ReliefRequest"> | string
    requesterId?: StringWithAggregatesFilter<"ReliefRequest"> | string
    category?: EnumRequestCategoryWithAggregatesFilter<"ReliefRequest"> | $Enums.RequestCategory
    description?: StringWithAggregatesFilter<"ReliefRequest"> | string
    urgency?: EnumUrgencyWithAggregatesFilter<"ReliefRequest"> | $Enums.Urgency
    district?: StringWithAggregatesFilter<"ReliefRequest"> | string
    city?: StringWithAggregatesFilter<"ReliefRequest"> | string
    peopleCount?: IntWithAggregatesFilter<"ReliefRequest"> | number
    status?: EnumRequestStatusWithAggregatesFilter<"ReliefRequest"> | $Enums.RequestStatus
    createdAt?: DateTimeWithAggregatesFilter<"ReliefRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ReliefRequest"> | Date | string
  }

  export type ReliefRequestCreateInput = {
    id?: string
    requesterId: string
    category: $Enums.RequestCategory
    description: string
    urgency: $Enums.Urgency
    district: string
    city: string
    peopleCount: number
    status?: $Enums.RequestStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReliefRequestUncheckedCreateInput = {
    id?: string
    requesterId: string
    category: $Enums.RequestCategory
    description: string
    urgency: $Enums.Urgency
    district: string
    city: string
    peopleCount: number
    status?: $Enums.RequestStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReliefRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    category?: EnumRequestCategoryFieldUpdateOperationsInput | $Enums.RequestCategory
    description?: StringFieldUpdateOperationsInput | string
    urgency?: EnumUrgencyFieldUpdateOperationsInput | $Enums.Urgency
    district?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    peopleCount?: IntFieldUpdateOperationsInput | number
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReliefRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    category?: EnumRequestCategoryFieldUpdateOperationsInput | $Enums.RequestCategory
    description?: StringFieldUpdateOperationsInput | string
    urgency?: EnumUrgencyFieldUpdateOperationsInput | $Enums.Urgency
    district?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    peopleCount?: IntFieldUpdateOperationsInput | number
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReliefRequestCreateManyInput = {
    id?: string
    requesterId: string
    category: $Enums.RequestCategory
    description: string
    urgency: $Enums.Urgency
    district: string
    city: string
    peopleCount: number
    status?: $Enums.RequestStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ReliefRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    category?: EnumRequestCategoryFieldUpdateOperationsInput | $Enums.RequestCategory
    description?: StringFieldUpdateOperationsInput | string
    urgency?: EnumUrgencyFieldUpdateOperationsInput | $Enums.Urgency
    district?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    peopleCount?: IntFieldUpdateOperationsInput | number
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ReliefRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    category?: EnumRequestCategoryFieldUpdateOperationsInput | $Enums.RequestCategory
    description?: StringFieldUpdateOperationsInput | string
    urgency?: EnumUrgencyFieldUpdateOperationsInput | $Enums.Urgency
    district?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    peopleCount?: IntFieldUpdateOperationsInput | number
    status?: EnumRequestStatusFieldUpdateOperationsInput | $Enums.RequestStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type EnumRequestCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestCategory | EnumRequestCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.RequestCategory[] | ListEnumRequestCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestCategory[] | ListEnumRequestCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestCategoryFilter<$PrismaModel> | $Enums.RequestCategory
  }

  export type EnumUrgencyFilter<$PrismaModel = never> = {
    equals?: $Enums.Urgency | EnumUrgencyFieldRefInput<$PrismaModel>
    in?: $Enums.Urgency[] | ListEnumUrgencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Urgency[] | ListEnumUrgencyFieldRefInput<$PrismaModel>
    not?: NestedEnumUrgencyFilter<$PrismaModel> | $Enums.Urgency
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

  export type EnumRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusFilter<$PrismaModel> | $Enums.RequestStatus
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

  export type ReliefRequestCountOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    category?: SortOrder
    description?: SortOrder
    urgency?: SortOrder
    district?: SortOrder
    city?: SortOrder
    peopleCount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReliefRequestAvgOrderByAggregateInput = {
    peopleCount?: SortOrder
  }

  export type ReliefRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    category?: SortOrder
    description?: SortOrder
    urgency?: SortOrder
    district?: SortOrder
    city?: SortOrder
    peopleCount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReliefRequestMinOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    category?: SortOrder
    description?: SortOrder
    urgency?: SortOrder
    district?: SortOrder
    city?: SortOrder
    peopleCount?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ReliefRequestSumOrderByAggregateInput = {
    peopleCount?: SortOrder
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

  export type EnumRequestCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestCategory | EnumRequestCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.RequestCategory[] | ListEnumRequestCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestCategory[] | ListEnumRequestCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestCategoryWithAggregatesFilter<$PrismaModel> | $Enums.RequestCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestCategoryFilter<$PrismaModel>
    _max?: NestedEnumRequestCategoryFilter<$PrismaModel>
  }

  export type EnumUrgencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Urgency | EnumUrgencyFieldRefInput<$PrismaModel>
    in?: $Enums.Urgency[] | ListEnumUrgencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Urgency[] | ListEnumUrgencyFieldRefInput<$PrismaModel>
    not?: NestedEnumUrgencyWithAggregatesFilter<$PrismaModel> | $Enums.Urgency
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUrgencyFilter<$PrismaModel>
    _max?: NestedEnumUrgencyFilter<$PrismaModel>
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

  export type EnumRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.RequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumRequestStatusFilter<$PrismaModel>
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

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRequestCategoryFieldUpdateOperationsInput = {
    set?: $Enums.RequestCategory
  }

  export type EnumUrgencyFieldUpdateOperationsInput = {
    set?: $Enums.Urgency
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumRequestStatusFieldUpdateOperationsInput = {
    set?: $Enums.RequestStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
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

  export type NestedEnumRequestCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestCategory | EnumRequestCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.RequestCategory[] | ListEnumRequestCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestCategory[] | ListEnumRequestCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestCategoryFilter<$PrismaModel> | $Enums.RequestCategory
  }

  export type NestedEnumUrgencyFilter<$PrismaModel = never> = {
    equals?: $Enums.Urgency | EnumUrgencyFieldRefInput<$PrismaModel>
    in?: $Enums.Urgency[] | ListEnumUrgencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Urgency[] | ListEnumUrgencyFieldRefInput<$PrismaModel>
    not?: NestedEnumUrgencyFilter<$PrismaModel> | $Enums.Urgency
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

  export type NestedEnumRequestStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusFilter<$PrismaModel> | $Enums.RequestStatus
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

  export type NestedEnumRequestCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestCategory | EnumRequestCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.RequestCategory[] | ListEnumRequestCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestCategory[] | ListEnumRequestCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestCategoryWithAggregatesFilter<$PrismaModel> | $Enums.RequestCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestCategoryFilter<$PrismaModel>
    _max?: NestedEnumRequestCategoryFilter<$PrismaModel>
  }

  export type NestedEnumUrgencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Urgency | EnumUrgencyFieldRefInput<$PrismaModel>
    in?: $Enums.Urgency[] | ListEnumUrgencyFieldRefInput<$PrismaModel>
    notIn?: $Enums.Urgency[] | ListEnumUrgencyFieldRefInput<$PrismaModel>
    not?: NestedEnumUrgencyWithAggregatesFilter<$PrismaModel> | $Enums.Urgency
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUrgencyFilter<$PrismaModel>
    _max?: NestedEnumUrgencyFilter<$PrismaModel>
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

  export type NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.RequestStatus | EnumRequestStatusFieldRefInput<$PrismaModel>
    in?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.RequestStatus[] | ListEnumRequestStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumRequestStatusWithAggregatesFilter<$PrismaModel> | $Enums.RequestStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRequestStatusFilter<$PrismaModel>
    _max?: NestedEnumRequestStatusFilter<$PrismaModel>
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