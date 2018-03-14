import { SanitizedRecord, SanitizedValue, Transformer } from './transformer';
import nodeCleanup = require('node-cleanup');
import { Query } from './query';
import { v1 as neo4j } from 'neo4j-driver';
import { Dictionary } from 'lodash';
import { Builder } from './builder';
import { AuthToken, Config } from 'neo4j-driver/types/v1';
import { Clause } from './clause';
import { Observable, Observer, Subscription } from 'rxjs';

let connections: Connection[] = [];

// Closes all open connections
nodeCleanup(() => {
  connections.forEach(con => con.close());
  connections = [];
});

export interface Credentials { username: string; password: string; }

export interface Session {
  close(): void;
  run(query: string, params: Dictionary<any>);
}

export interface Driver {
  close(): void;
  session(): Session;
}

export type DriverConstructor = (url: string, auth?: AuthToken, config?: Config)
  => Driver;

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
  protected auth: any;
  protected driver: any;
  protected open: boolean;
  protected transformer = new Transformer();

  /**
   * Creates a new connection to the database.
   *
   * @param {string} url Url of the database such as `bolt://localhost`
   * @param {Credentials} credentials Username and password of the user to login
   * to the database in the form `{ username: ..., password: ... }`
   * @param {DriverConstructor} driver An optional driver constructor to use for
   * this connection. Defaults to the official Neo4j driver. The constructor is
   * given the url you pass to this constructor and an auth token that is
   * generated from calling [`neo4j.auth.basic`]{@link
   * https://neo4j.com/docs/api/javascript-driver/current#usage-examples}.
   */
  constructor(
    protected url: string,
    credentials: Credentials,
    driver: DriverConstructor = neo4j.driver,
  ) {
    super();
    this.auth = neo4j.auth.basic(credentials.username, credentials.password);
    this.driver = driver(this.url, this.auth);
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
  session() {
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
   * the return value which is essentially `Dictionary<R>[]`.
   *
   * Throws an exception if this connection is not open or there are no clauses
   * in the query.
   *
   * @param {Query} query
   * @returns {Promise<SanitizedRecord<R>[]>}
   */
  run<R = SanitizedValue>(query: Query): Promise<SanitizedRecord<R>[]> {
    if (!this.open) {
      throw Error('Cannot run query; connection is not open.');
    }

    if (query.getClauses().length > 0) {
      throw Error('Cannot run query: no clauses attached to the query.');
    }

    const queryObj = query.buildQueryObject();
    const session = this.session();
    return session.run(queryObj.query, queryObj.params)
      .then((result) => {
        session.close();
        return this.transformer.transformResult(result);
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
   * the return value which is essentially `Dictionary<R>`.
   *
   * Throws an exception if this connection is not open or there are no clauses
   * in the query.
   */
  stream<R = SanitizedValue>(query: Query): Observable<SanitizedRecord<R>> {
    if (!this.open) {
      throw Error('Cannot run query; connection is not open.');
    }

    if (query.getClauses().length > 0) {
      throw Error('Cannot run query: no clauses attached to the query.');
    }

    const queryObj = query.buildQueryObject();
    const session = this.session();

    // Run the query
    const result = session.run(queryObj.query, queryObj.params);

    // Subscribe to the result and clean up the session
    return Observable.create((subscriber: Observer<SanitizedRecord<R>>): Subscription => {
      return result.subscribe(
        // On next
        (record) => {
          const sanitizedRecord = this.transformer.transformRecord(record);
          subscriber.next(sanitizedRecord as any);
        },
        // On error
        (error) => {
          session.close();
          subscriber.error(error);
        },
        // On complete
        () => {
          session.close();
          subscriber.complete();
        },
      );
    });
  }
}
