import { PatternStatement } from './patternStatement';

export class Create extends PatternStatement {
  constructor(patterns) {
    super(patterns, { useExpandedConditions: false });
  }

  build() {
    return 'CREATE ' + super.build();
  }
}
