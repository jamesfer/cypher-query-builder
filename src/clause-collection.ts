import { map } from 'lodash';
import { Clause } from './clause';

export class ClauseCollection extends Clause {
  protected clauses: Clause[] = [];

  /**
   * Returns all clauses in this collection.
   * @returns {Clause[]}
   */
  getClauses(): Clause[] {
    return this.clauses;
  }

  /**
   * Adds a clause to the child list.
   * @param {Clause} clause
   */
  addClause(clause: Clause) {
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
