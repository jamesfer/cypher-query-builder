import { Many } from 'lodash';
import { Term, TermListClause } from './term-list-clause';

export class With extends TermListClause {
  /**
   * Creates a with clause
   * @param  {string|object|array<string|object>} terms
   */
  constructor(terms: Many<Term>) {
    super(terms);
  }

  build() {
    return `WITH ${super.build()}`;
  }
}
