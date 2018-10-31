import { PatternClause, PatternCollection } from './pattern-clause';

export class Create extends PatternClause {
  constructor(patterns: PatternCollection) {
    super(patterns, { useExpandedConditions: false });
  }

  build() {
    return `CREATE ${super.build()}`;
  }
}
