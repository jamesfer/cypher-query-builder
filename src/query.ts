import { Connection } from './connection';
import { SanitizedRecord, SanitizedValue } from './transformer';
import { Builder } from './builder';
import { ClauseCollection } from './clause-collection';
import { Clause } from './clause';
import { Observable } from 'rxjs';

export class Query extends Builder<Query> {
  protected clauses = new ClauseCollection();

  /**
   * Creates a new query with a given connection.
   *
   * @param {Connection} connection
   */
  constructor(protected connection: Connection = null) {
    super();
  }

  protected continueChainClause(clause: Clause) {
    return this.addClause(clause);
  }

  /**
   * Runs this query on its connection. If this query was created by calling a
   * chainable method of a connection, then its connection was automatically
   * set.
   *
   * Returns a promise that resolves to an array of records. Each key of the
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
   * Throws an exception if this query does not have a connection or has no
   * clauses.
   *
   * @returns {Promise<SanitizedRecord<R>[]>}
   */
  async run<R = SanitizedValue>(): Promise<SanitizedRecord<R>[]> {
    if (!this.connection) {
      throw Error('Cannot run query; no connection object available.');
    }

    return this.connection.run<R>(this);
  }

  /**
   * Runs this query on its connection. If this query was created by calling a
   * chainable method of a connection, then its connection was automatically
   * set.
   *
   * Returns an observable that emits each record as it is received from the
   * database. This is the most efficient way of working with very large
   * datasets. Each record is an object where each key is the name of a variable
   * that you specified in your return clause.
   *
   * Eg:
   * ```typescript
   * const result$ = connection.match([
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
   * Throws an exception if this query does not have a connection or has no
   * clauses.
   */
  stream<R = SanitizedValue>(): Observable<SanitizedRecord<R>> {
    if (!this.connection) {
      throw Error('Cannot run query; no connection object available.');
    }

    return this.connection.stream<R>(this);
  }

  /**
   * * Runs the current query on its connection and returns the first result.
   * If the query was created by calling a chainable method of a connection,
   * the query's connection was automatically set.
   *
   * If 0 results were returned from the database, returns `undefined`.
   *
   * Returns a promise that resolves to a single record. Each key of the
   * record is the name of a variable that you specified in your `RETURN`
   * clause.
   */
  async first<R = SanitizedValue>(): Promise<SanitizedRecord<R>> {
    return this.run<R>().then(results => results && results.length > 0 ? results[0] : undefined);
  }

  // Clause proxied methods

  /**
   * Returns the query as a string with parameter variables.
   *
   * Eg:
   * ```typescript
   * connection.match([
   *   node('steve', { name: 'Steve' }),
   *   relation('out', [ 'FriendsWith' ]),
   *   node('friends'),
   * ])
   *   .return([ 'steve', 'friends' ])
   *   .build();
   *
   * // MATCH (steve { name: $name })-[:FriendsWith]->(friends)
   * // RETURN steve, friends
   * ```
   *
   * @returns {string}
   */
  build() {
    return this.clauses.build();
  }

  /**
   * Synonym for `build()`.
   * @returns {string}
   */
  toString() {
    return this.clauses.toString();
  }

  /**
   * Returns an object that includes both the query and the params ready to be
   * passed to the neo4j driver.
   *
   * @returns {{query: string; params: _.Dictionary<any>}}
   */
  buildQueryObject() {
    return this.clauses.buildQueryObject();
  }

  /**
   * Like `build`, but will insert the values of the parameters into the string
   * so queries are easier to debug. __Note: this should only ever be used for
   * debugging__.
   *
   * ```typescript
   * connection.match([
   *   node('steve', { name: 'Steve' }),
   *   relation('out', [ 'FriendsWith' ]),
   *   node('friends'),
   * ])
   *   .return([ 'steve', 'friends' ])
   *   .build();
   *
   * // MATCH (steve { name: 'Steve' })-[:FriendsWith]->(friends)
   * // RETURN steve, friends
   * ```
   *
   * @returns {string}
   */
  interpolate() {
    return this.clauses.interpolate();
  }

  /**
   * Returns an array of all the clauses in this query.
   * @returns {Clause[]}
   */
  getClauses() {
    return this.clauses.getClauses();
  }

  /**
   * Adds a new clause to the query. You probably won't ever need to call this
   * directly, but there is nothing stopping you.
   *
   * @param {Clause} clause
   * @returns {this}
   */
  addClause(clause: Clause) {
    this.clauses.addClause(clause);
    return this;
  }
}
