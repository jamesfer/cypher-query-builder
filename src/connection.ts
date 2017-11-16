import { SanitizedRecord, SanitizedValue, Transformer } from './transformer';
import nodeCleanup = require('node-cleanup');
import { Query } from './query';
import { v1 as neo4j } from 'neo4j-driver';
import { Dictionary, Many } from 'lodash';
import { SetOptions, SetProperties } from './clauses/set';
import { DeleteOptions } from './clauses/delete';
import { PatternCollection } from './clauses/patternStatement';
import { MatchOptions } from './clauses/match';
import { Builder } from './utils';
import { Term } from './clauses/termListStatement';

let connections: Connection[] = [];

// Closes all open connections
nodeCleanup(function () {
  connections.forEach(con => {
    con.close();
  });
  connections = [];
});

export type Credentials = { username: string, password: string };

export class Connection implements Builder {
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
  run<R = SanitizedValue>(query: Query): Promise<SanitizedRecord<R>[]> {
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

  matchNode(varName: string, labels?: Many<string>, conditions?: {}) {
    return this.query().matchNode(varName, labels, conditions);
  }

  match(patterns: PatternCollection, options?: MatchOptions) {
    return this.query().match(patterns, options);
  }

  optionalMatch(patterns: PatternCollection, options?: MatchOptions) {
    return this.query().optionalMatch(patterns, options);
  }

  createNode(varName: any, labels?: Many<string>, conditions?: {}) {
    return this.query().createNode(varName, labels, conditions);
  }

  create(patterns: PatternCollection) {
    return this.query().create(patterns);
  }

  return(terms: Many<Term>) {
    return this.query().return(terms);
  }

  with(terms: Many<Term>) {
    return this.query().with(terms);
  }

  unwind(list: any[], name: string) {
    return this.query().unwind(list, name);
  }

  delete(terms: Many<string>, options?: DeleteOptions) {
    return this.query().delete(terms, options);
  }

  detachDelete(terms: Many<string>, options?: DeleteOptions) {
    return this.query().detachDelete(terms, options);
  }

  set(properties: SetProperties, options: SetOptions) {
    return this.query().set(properties, options);
  }

  setLabels(labels: Dictionary<Many<string>>) {
    return this.query().setLabels(labels);
  }

  setValues(values: Dictionary<any>) {
    return this.query().setValues(values);
  }

  setVariables(variables: Dictionary<string | Dictionary<string>>, override: boolean) {
    return this.query().setVariables(variables, override);
  }

  skip(amount: string | number) {
    return this.query().skip(amount);
  }
}
