import { Statement } from '../statement';
import { join, reduce, map, assign, castArray } from 'lodash';
import { Pattern } from './pattern';

export class PatternStatement extends Statement {
  protected patterns: Pattern[][];

  constructor(
    patterns: Pattern | Pattern[] | Pattern[][],
    options = { useExpandedConditions: false },
  ) {
    super();

    options = assign({
      useExpandedConditions: true,
    }, options);

    // Ensure patterns is a two dimensional array.
    this.patterns = map(castArray<Pattern | Pattern[]>(patterns), castArray);

    // Add child patterns as statements
    this.patterns.forEach(arr => arr.forEach(pat => {
      pat.setExpandedConditions(options.useExpandedConditions);
      pat.useParameterBag(this.parameterBag);
    }));
  }

  build() {
    return join(map(this.patterns, pattern => {
      return reduce(pattern, (str, clause) => str + clause.build(), '');
    }), ', ');
  }
}
