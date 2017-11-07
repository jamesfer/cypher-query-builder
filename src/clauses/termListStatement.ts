import { Statement } from '../statement';
import {
  join, flattenDeep, map, isPlainObject, isString, isArray, castArray,
  Dictionary,
} from 'lodash';

export type Term = string | string[] | Dictionary<string>;
export type PropertyTerm = Term | Dictionary<Term>;

export class TermListStatement extends Statement {
  protected terms: PropertyTerm[];

  constructor(terms: PropertyTerm | PropertyTerm[]) {
    super();
    this.terms = castArray(terms);
  }

  toString() {
    return join(flattenDeep(map(this.terms, term => this.stringifyTerm(term))), ', ');
  }

  private stringifyTerm(term: PropertyTerm, alias?: string, node?: string) {
    if (isString(term)) {
      let prefix = node ? node + '.' : '';
      if (alias) {
        prefix += alias + ' AS ';
      }
      return prefix + term;
    }

    if (isArray(term)) {
      return map(term, t => this.stringifyTerm(t, null, alias));
    }

    if (isPlainObject(term)) {
      return map(term, (t, k) => this.stringifyTerm(t, k, alias || node));
    }
  }

  build() {
    return this.toString();
  }
}
