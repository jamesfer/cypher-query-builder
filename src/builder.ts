import { Dictionary, Many, } from 'lodash';
import { DeleteOptions } from './clauses/delete';
import { MatchOptions } from './clauses/match';
import { Direction, OrderConstraints } from './clauses/order-by';
import { PatternCollection } from './clauses/pattern-clause';
import { SetOptions, SetProperties } from './clauses/set';
import { Term } from './clauses/term-list-clause';
import { AnyConditions } from './clauses/where-utils';

export interface Builder {
  matchNode(name?: Many<string> | Dictionary<any>, labels?: Many<string> | Dictionary<any>, conditions?: Dictionary<any>): Builder;

  match(patterns: PatternCollection, options?: MatchOptions): Builder;

  optionalMatch(patterns: PatternCollection, options?: MatchOptions): Builder;

  createNode(name?: Many<string> | Dictionary<any>, labels?: Many<string> | Dictionary<any>, conditions?: Dictionary<any>): Builder;

  create(patterns: PatternCollection): Builder;

  return(terms: Many<Term>): Builder;

  with(terms: Many<Term>): Builder;

  unwind(list: any[], name: string): Builder;

  delete(terms: Many<string>, options?: DeleteOptions): Builder;

  detachDelete(terms: Many<string>, options?: DeleteOptions): Builder;

  set(properties: SetProperties, options: SetOptions): Builder;

  setLabels(labels: Dictionary<Many<string>>): Builder;

  setValues(values: Dictionary<any>): Builder;

  setVariables(variables: Dictionary<string | Dictionary<string>>, override: boolean): Builder;

  skip(amount: number | string): Builder;

  limit(amount: number | string): Builder;

  where(conditions: AnyConditions): Builder;

  orderBy(fields: Many<string> | OrderConstraints, dir?: Direction);

  raw(clause: string, params?: Dictionary<any>);
}
