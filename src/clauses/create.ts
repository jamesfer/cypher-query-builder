import { PatternClause, PatternCollection } from './pattern-clause';

export interface CreateOptions {
  unique?: boolean;
}

export class Create extends PatternClause {
  constructor(patterns: PatternCollection, protected options: CreateOptions = {}) {
    super(patterns, { useExpandedConditions: false });
  }

  build() {
    const unique = this.options.unique ? ' UNIQUE' : '';
    return `CREATE${unique} ${super.build()}`;
  }
}
