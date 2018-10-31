import { TermListClause } from './term-list-clause';

export class With extends TermListClause {
  /**
   * Creates a with clause
   * @param  {string|object|array<string|object>} terms
   */
  constructor(terms) {
    super(terms);
  }

  build() {
    return `WITH ${super.build()}`;
  }
}
