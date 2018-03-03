import { Connection } from './connection';
import { SanitizedRecord, SanitizedValue } from './transformer';
import { Builder } from './builder';
import { ClauseCollection } from './clause-collection';
import { Clause } from './clause';

export class Query extends Builder<Query> {
  protected clauses = new ClauseCollection();

  constructor(protected connection: Connection = null) {
    super();
  }

  protected continueChainClause(clause: Clause) {
    return this.addClause(clause);
  }

  run<R = SanitizedValue>(): Promise<SanitizedRecord<R>[]> {
    if (!this.connection) {
      throw Error('Cannot run query; no connection object available.');
    }

    return this.connection.run<R>(this);
  }

  // Clause proxied methods

  build() {
    return this.clauses.build();
  }

  toString() {
    return this.clauses.toString();
  }

  buildQueryObject() {
    return this.clauses.buildQueryObject();
  }

  interpolate() {
    return this.clauses.interpolate();
  }

  getClauses() {
    return this.clauses.getClauses();
  }

  addClause(clause: Clause) {
    this.clauses.addClause(clause);
    return this;
  }
}
