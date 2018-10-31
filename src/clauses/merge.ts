import { PatternClause, PatternCollection } from './pattern-clause';

export class Merge extends PatternClause {
  constructor(
    patterns: PatternCollection,
  ) {
    super(patterns, { useExpandedConditions: true });
  }

  build() {
    return `MERGE ${super.build()}`;
  }
}
