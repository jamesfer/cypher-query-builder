import { reduce, map, assign, castArray, isArray } from 'lodash';
import { Pattern } from './pattern';
import { Clause } from '../clause';

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
    const defaultOptions = {
      useExpandedConditions: true,
    };
    const { useExpandedConditions } = assign(defaultOptions, options);

    // Ensure patterns is a two dimensional array.
    const arr = castArray<Pattern | Pattern[]>(patterns);
    this.patterns = (isArray(arr[0]) ? arr : [arr]) as Pattern[][];

    // Add child patterns as clauses
    this.patterns.forEach(arr => arr.forEach((pat) => {
      pat.setExpandedConditions(useExpandedConditions);
      pat.useParameterBag(this.parameterBag);
    }));
  }

  build() {
    const patternStrings = map(this.patterns, (pattern) => {
      return reduce(pattern, (str, clause) => str + clause.build(), '');
    });
    return patternStrings.join(', ');
  }
}
