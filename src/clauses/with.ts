import { TermListStatement } from './term-list-statement';

export class With extends TermListStatement {
  /**
   * Creates a with clause
   * @param  {string|object|array<string|object>} terms
   */
  constructor(terms) {
    super(terms);
  }

  build() {
    return 'WITH ' + super.build();
  }
}
