import { Transformer } from './transformer';
import { Query } from './query';
import { v1 as neo4j } from 'neo4j-driver';
import { Builder } from './builder';
import { AuthToken, Config, Driver, Session } from 'neo4j-driver/types/v1';
import { Clause } from './clause';
import { Observable, Observer } from 'rxjs';
import { TeardownLogic } from 'rxjs/Subscription';
import nodeCleanup = require('node-cleanup');
import { Dictionary, isFunction } from 'lodash';
import * as Promise from 'any-promise';

let connections: Connection[] = [];

// Closes all open connections
nodeCleanup(() => {
  connections.forEach(con => con.close());
  connections = [];
});

export interface Credentials { username: string; password: string; }
export type DriverConstructor = typeof neo4j.driver;

export interface FullConnectionOptions {
  driverConstructor: DriverConstructor;
  driverConfig: Config;
}
export type ConnectionOptions = Partial<FullConnectionOptions>;

function isCredentials(credentials: any): credentials is Credentials {
  return 'username' in credentials && 'password' in credentials;
}

/**
 * A connection lets you access the Neo4j server and run queries against it.
 *
 * ```
 * const db = new Connection('bolt://localhost', {
 *   username: 'neo4j',
 *   password: 'password',
 * })
 * ```
 *
 * Once you've finished with the connection you should close the connection.
 * ```
 * db.close()
 * ```
 *
 * The library will attempt to clean up all connections when the process exits,
 * but if you are using many connections for a short period of time you should
 * close them yourself.
 *
 * To use the connection, the chainable query builder methods will probably be
 * most useful such as `match`, `create`, `matchNode` etc etc.
 *
 * ```
 * db.matchNode('people', 'Person')
 *   .where({ 'people.age': greaterThan(18) })
 *   .return('people')
 *   .run()
 * ```
 */
export class Connection extends Builder<Query> {
  protected auth: AuthToken;
  protected driver: Driver;
  protected options: FullConnectionOptions;
  protected open: boolean;
  protected transformer = new Transformer();

  /**
   * Creates a new connection to the database.
   *
   * @param url Url of the database such as `'bolt://localhost'`
   * @param auth Auth can either be an object in the form `{ username: ..., password: ... }`, or a
   * Neo4j AuthToken object which contains the `scheme`, `principal` and `credentials` properties
   * for more advanced authentication scenarios. The AuthToken object is what is passed directly to
   * the neo4j javascript driver so checkout their docs for more information on it.
   * @param options Additional configuration options. If you provide a function instead of an
   * object, it will be used as the driver constructor. While passing a driver constructor function
   * here is not deprecated, it is the legacy way of setting it and you should prefer to pass an
   * options object with the `driverConstructor` parameter.
   * @param options.driverConstructor An optional driver constructor to use for
   * this connection. Defaults to the official Neo4j driver. The constructor is
   * given the url you pass to this constructor and an auth token that is
   * generated from calling [`neo4j.auth.basic`]{@link
   * https://neo4j.com/docs/api/javascript-driver/current#usage-examples}.
   * @param options.driverConfig Neo4j options that are passed directly to the underlying driver.
   */
  constructor(
    protected url: string,
    auth: Credentials | AuthToken,
    options: DriverConstructor | ConnectionOptions = neo4j.driver,
  ) {
    super();

    this.auth = isCredentials(auth)
      ? neo4j.auth.basic(auth.username, auth.password)
      : auth;

    this.options = {
      driverConstructor: isFunction(options) ? options
        : options.driverConstructor ? options.driverConstructor : neo4j.driver,
      driverConfig: isFunction(options) || !options.driverConfig ? {} : options.driverConfig,
    };

    this.driver = this.options.driverConstructor(this.url, this.auth, this.options.driverConfig);
    this.open = true;

    connections.push(this);
  }

  /**
   * Closes this connection if it is open. Closed connections cannot be
   * reopened.
   */
  close() {
    if (this.open) {
      this.driver.close();
      this.open = false;
    }
  }

  /**
   * Opens and returns a session. You should never need to use this directly.
   * Your probably better off with `run` instead.
   */
  session(): Session | null {
    if (this.open) {
      return this.driver.session();
    }
    return null;
  }

  /**
   * Returns a new query that uses this connection. The methods such as `match`
   * or `create` are probably more useful to you as they automatically create a
   * new chainable query for you.
   * @return {Query}
   */
  query() {
    return new Query(this);
  }

  protected continueChainClause(clause: Clause) {
    return this.query().addClause(clause);
  }

  /**
   * Runs the provided query on this connection, regardless of which connection
   * the query was created from. Each query is run on it's own session.
   *
   * Run returns a promise that resolves to an array of records. Each key of the
   * record is the name of a variable that you specified in your `RETURN`
   * clause.
   * Eg:
   * ```typescript
   * connection.match([
   *   node('steve', { name: 'Steve' }),
   *   relation('out', [ 'FriendsWith' ]),
   *   node('friends'),
   * ])
   *   .return([ 'steve', 'friends' ])
   *   .run();
   * ```
   *
   * Would result in the value:
   * ```
   * [
   *   {
   *     steve: { ... } // steve node,
   *     friends: { ... } // first friend,
   *   },
   *   {
   *     steve: { ... } // steve node,
   *     friends: { ... } // second friend,
   *   },
   *   {
   *     steve: { ... } // steve node,
   *     friends: { ... } // third friend,
   *   },
   * ]
   * ```
   *
   * Notice how the steve record is returned for each row, this is how cypher
   * works. If you use lodash you can extract all of Steve's friends from the
   * results like using `_.map(results, 'friends')`. If you don't, you can use
   * ES2015/ES6: `results.map(record => record.friends)`.
   *
   * If you use typescript you can use the type parameter to hint at the type of
   * the return value which is `Dictionary<R>[]`.
   *
   * Throws an exception if this connection is not open or there are no clauses
   * in the query.
   *
   * @param {Query} query
   * @returns {Promise<Dictionary<R>[]>}
   */
  run<R = any>(query: Query): Promise<Dictionary<R>[]> {
    if (!this.open) {
      throw Error('Cannot run query; connection is not open.');
    }

    if (query.getClauses().length === 0) {
      throw Error('Cannot run query: no clauses attached to the query.');
    }

    const queryObj = query.buildQueryObject();
    const session = this.session();

    // Need to wrap promise in an any-promise
    return Promise.resolve(session.run(queryObj.query, queryObj.params))
      .then((result) => {
        session.close();
        return this.transformer.transformRecords<R>(result.records);
      })
      .catch((error) => {
        session.close();
        return Promise.reject(error);
      });
  }

  /**
   * Runs the provided query on this connection, regardless of which connection
   * the query was created from. Each query is run on it's own session.
   *
   * Returns an observable that emits each record as it is received from the
   * database. This is the most efficient way of working with very large
   * datasets. Each record is an object where each key is the name of a variable
   * that you specified in your return clause.
   *
   * Eg:
   * ```typescript
   * const results$ = connection.match([
   *   node('steve', { name: 'Steve' }),
   *   relation('out', [ 'FriendsWith' ]),
   *   node('friends'),
   * ])
   *   .return([ 'steve', 'friends' ])
   *   .stream();
   *
   * // Emits
   * // {
   * //   steve: { ... } // steve node,
   * //   friends: { ... } // first friend,
   * // },
   * // Then emits
   * // {
   * //   steve: { ... } // steve node,
   * //   friends: { ... } // first friend,
   * // },
   * // And so on
   * ```
   *
   * Notice how the steve record is returned for each row, this is how cypher
   * works. You can extract all of steve's friends from the query by using RxJS
   * operators:
   * ```
   * const friends$ = results$.map(row => row.friends);
   * ```
   *
   * If you use typescript you can use the type parameter to hint at the type of
   * the return value which is `Dictionary<R>`.
   *
   * Throws an exception if this connection is not open or there are no clauses
   * in the query.
   */
  stream<R = any>(query: Query): Observable<Dictionary<R>> {
    if (!this.open) {
      throw Error('Cannot run query; connection is not open.');
    }

    if (query.getClauses().length === 0) {
      throw Error('Cannot run query: no clauses attached to the query.');
    }

    const queryObj = query.buildQueryObject();
    const session = this.session();

    // Run the query
    const result = session.run(queryObj.query, queryObj.params);

    // Subscribe to the result and clean up the session
    return Observable.create((subscriber: Observer<Dictionary<R>>): TeardownLogic => {
      // Note: Neo4j observable uses a different syntax to RxJS observables
      result.subscribe({
        onNext: (record) => {
          subscriber.next(this.transformer.transformRecord<R>(record));
        },
        onError: (error) => {
          session.close();
          subscriber.error(error);
        },
        onCompleted: () => {
          session.close();
          subscriber.complete();
        },
      });
    });
  }
}
