import { Many } from 'lodash';
import { Term, TermListClause } from './term-list-clause';

export class Return extends TermListClause {
  /**
   * Creates a return clause
   * @param  {string|object|array<string|object>|} terms [description]
   */
  constructor(terms: Many<Term>) {
    super(terms);
  }

  build() {
    return `RETURN ${super.build()}`;
  }
}
