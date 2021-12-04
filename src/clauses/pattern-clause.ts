import { reduce, map, assign, castArray, isArray, Dictionary } from 'lodash';
import { Parameter } from '../parameter-bag';
import { ConditionParameters } from '../patterns/condition-parameters';
import { Pattern } from '../patterns/pattern';
import { Clause } from '../clause';

export interface PatternOptions {
  useExpandedConditions?: boolean;
}

export type PatternCollection = Pattern | Pattern[] | Pattern[][];

export abstract class PatternClause extends Clause {
  protected patterns: Pattern[][];

  constructor(patterns: PatternCollection) {
    super();

    // Ensure patterns is a two dimensional array.
    const arr = castArray<Pattern | Pattern[]>(patterns);
    this.patterns = (isArray(arr[0]) ? arr : [arr]) as Pattern[][];
  }

  build() {
    return map(this.patterns, pattern => (
      map(pattern, patternItem => patternItem.build()).join('')
    )).join(', ');
  }

  protected abstract makeConditionParameters(conditions: Dictionary<any>): ConditionParameters;

  protected makeExpandedConditions(conditions: Dictionary<any>): Dictionary<Parameter> {

  }

  protected makeCondensedConditions(conditions: Dictionary<any>): Parameter {

  }
}
