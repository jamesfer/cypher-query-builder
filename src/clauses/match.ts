import { PatternClause, PatternCollection } from './pattern-clause';

export interface MatchOptions {
  optional?: boolean;
}

export class Match extends PatternClause {
  constructor(
    patterns: PatternCollection,
    protected options: MatchOptions = { optional: false },
  ) {
    super(patterns, { useExpandedConditions: true });
  }

  build() {
    let str = 'MATCH ';
    if (this.options.optional) {
      str = `OPTIONAL ${str}`;
    }
    return str + super.build();
  }
}
