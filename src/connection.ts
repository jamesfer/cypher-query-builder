import { SanitizedRecord, SanitizedValue, Transformer } from './transformer';
import nodeCleanup = require('node-cleanup');
import { Query } from './query';
import { v1 as neo4j } from 'neo4j-driver';
import { Dictionary } from 'lodash';
import { Builder } from './builder';
import { AuthToken, Config } from 'neo4j-driver/types/v1';
import { Clause } from './clause';

let connections: Connection[] = [];

// Closes all open connections
nodeCleanup(function () {
  connections.forEach(con => {
    con.close();
  });
  connections = [];
});

export interface Credentials { username: string, password: string }

export interface Session {
  close(): void;
  run(query: string, params: Dictionary<any>)
}

export interface Driver {
  close(): void;
  session(): Session;
}

export type DriverConstructor = (url: string, auth?: AuthToken, config?: Config)
  => Driver;


export class Connection extends Builder {
  protected auth: any;
  protected driver: any;
  protected open: boolean;
  protected transformer = new Transformer();

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
   * Closes the connect if it is open.
   */
  close() {
    if (this.open) {
      this.driver.close();
      this.open = false;
    }
  }

  /**
   * Opens and returns a session.
   */
  session() {
    if (this.open) {
      return this.driver.session();
    }
    return null;
  }

  /**
   * Returns a new query that uses this connection.
   * @return {Query}
   */
  query() {
    return new Query(this);
  }

  protected continueChainClause(clause: Clause) {
    return this.query().addClause(clause);
  }

  /**
   * Runs a query in a session using this connection.
   * @param {Query} query
   * @return {Promise<Array>}
   */
  run<R = SanitizedValue>(query: Query): Promise<SanitizedRecord<R>[]> {
    if (!this.open) {
      throw Error('Cannot run query; connection is not open.');
    }

    if (!query.getClauses().length) {
      throw Error('Cannot run query: no clauses attached to the query.');
    }

    let queryObj = query.buildQueryObject();
    let session = this.session();
    return session.run(queryObj.query, queryObj.params)
      .then(result => {
        session.close();
        return this.transformer.transformResult(result);
      })
      .catch(error => {
        session.close();
        return Promise.reject(error);
      });
  }
}
