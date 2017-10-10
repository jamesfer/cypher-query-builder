import { TermListStatement } from './termListStatement';

export class Return extends TermListStatement {
  /**
   * Creates a return clause
   * @param  {string|object|array<string|object>|} terms [description]
   */
  constructor(terms) {
    super(terms);
  }

  build() {
    return 'RETURN ' + super.build();
  }
}
