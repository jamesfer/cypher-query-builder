import { Clause } from './clause';
import { map } from 'lodash';

export class ClauseCollection extends Clause {
  protected clauses: Clause[] = [];

  /**
   * Returns all clauses in this collection.
   * @returns {Clause[]}
   */
  getClauses() {
    return this.clauses;
  }

  /**
   * Adds a clause to the child list.
   * @param {Clause} clause
   */
  addClause(clause) {
    clause.useParameterBag(this.parameterBag);
    this.clauses.push(clause);
  }

  /**
   * @inheritDoc
   */
  build() {
    return `${map(this.clauses, s => s.build()).join('\n')};`;
  }
}
