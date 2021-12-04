import { PatternClause, PatternCollection } from './pattern-clause';

export class Merge extends PatternClause {
  constructor(patterns: PatternCollection) {
    super(patterns);
  }

  build() {
    return `MERGE ${super.build()}`;
  }

  protected makeConditionParameters = this.makeExpandedConditions;
}
