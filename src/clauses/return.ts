import { Many } from 'lodash';
import { Term, TermListClause } from './term-list-clause';

export interface ReturnOptions {
  distinct?: boolean;
}

export class Return extends TermListClause {
  constructor(terms: Many<Term>, protected options: ReturnOptions = {}) {
    super(terms);
  }

  build() {
    const distinct = this.options.distinct ? ' DISTINCT' : '';
    return `RETURN${distinct} ${super.build()}`;
  }
}
