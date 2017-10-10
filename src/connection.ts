import { Transformer } from './transformer';
import nodeCleanup from 'node-cleanup';
import { Query } from './query';
import { v1 as neo4j } from 'neo4j-driver';

let connections: Connection[] = [];

// Closes all open connections
nodeCleanup(function () {
  connections.forEach(con => {
    con.close();
  });
  connections = [];
});

type Credentials = { username: string, password: string };

export class Connection {
  protected auth: any;
  protected driver: any;
  protected open: boolean;
  protected transformer = new Transformer();

  constructor(
    protected url: string,
    credentials: Credentials
  ) {
    this.auth = neo4j.auth.basic(credentials.username, credentials.password);
    this.driver = neo4j.driver(this.url, this.auth);
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

  /**
   * Runs a query in a session using this connection.
   * @param {Query} query
   * @return {Promise<Array>}
   */
  run(query: Query) {
    if (!this.open) {
      throw Error('Cannot run query; connection is not open.');
    }

    if (!query.getStatements().length) {
      throw Error('Cannot run query: no statements attached to the query.');
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


/** Query shortcut methods. */

[
  'matchNode',
  'match',
  'optionalMatch',
  'createNode',
  'create',
  'return',
  'with',
  'unwind',
  'delete',
  'detachDelete',
  'set',
  'setLabels',
  'setValues',
  'setVariables',
].forEach(name => {
  Connection.prototype[name] = function () {
    return Query.prototype[name].apply(this.query(), arguments);
  };
});


module.exports = Connection;
