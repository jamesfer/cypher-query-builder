import { PatternClause } from './pattern-clause';

export class Create extends PatternClause {
  constructor(patterns) {
    super(patterns, { useExpandedConditions: false });
  }

  build() {
    return 'CREATE ' + super.build();
  }
}
