import { Clause } from '../clause';
import { join, reduce, map, assign, castArray, isArray } from 'lodash';
import { Pattern } from './pattern';

export interface PatternOptions {
  useExpandedConditions?: boolean;
}

export type PatternCollection = Pattern | Pattern[] | Pattern[][];

export class PatternClause extends Clause {
  protected patterns: Pattern[][];

  constructor(
    patterns: PatternCollection,
    options: PatternOptions = { useExpandedConditions: false },
  ) {
    super();

    options = assign({
      useExpandedConditions: true,
    }, options);

    // Ensure patterns is a two dimensional array.
    let arr = castArray<Pattern | Pattern[]>(patterns);
    this.patterns = (arr[0] instanceof Array ? arr : [arr]) as Pattern[][];


    // Add child patterns as clauses
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
