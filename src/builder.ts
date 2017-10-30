import { PatternCollection } from './clauses/patternStatement';
import { MatchOptions } from './clauses/match';
import { Dictionary, Many } from 'lodash';
import { PropertyTerm } from './clauses/termListStatement';
import { SetOptions, SetProperties } from './clauses/set';
import { DeleteOptions } from './clauses/delete';

export interface Builder {
  matchNode(varName: string, labels?: Many<string>, conditions?: {}): Builder;
  match(patterns: PatternCollection, options?: MatchOptions): Builder;
  optionalMatch(patterns: PatternCollection, options?: MatchOptions): Builder;
  createNode(varName: any, labels?: Many<string>, conditions?: {}): Builder;
  create(patterns: PatternCollection): Builder;
  return(terms: Many<PropertyTerm>): Builder;
  with(terms: Many<PropertyTerm>): Builder;
  unwind(list: any[], name: string): Builder;
  delete(terms: Many<string>, options?: DeleteOptions): Builder;
  detachDelete(terms: Many<string>, options?: DeleteOptions): Builder;
  set(properties: SetProperties, options: SetOptions): Builder;
  setLabels(labels: Dictionary<Many<string>>): Builder;
  setValues(values: Dictionary<any>): Builder;
  setVariables(variables: Dictionary<string | Dictionary<string>>, override: boolean): Builder;
}
