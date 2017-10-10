import { PatternStatement } from './patternStatement';

export class Match extends PatternStatement {
  constructor(
    patterns,
    protected options = { optional: false }
  ) {
    super(patterns, { useExpandedConditions: true });
  }

  build() {
    let str = 'MATCH ';
    if (this.options.optional) {
      str = 'OPTIONAL ' + str;
    }
    return str + super.build();
  }
}
