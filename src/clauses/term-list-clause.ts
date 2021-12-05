import {
  flatMapDeep,
  map,
  isPlainObject,
  isString,
  castArray,
  reduce,
  Dictionary,
  Many,
} from 'lodash';
import { Clause } from '../clause';
import { TypedDictionary } from '../types';

export type Properties = Many<string | Dictionary<string>>;
export type Term<T extends string = string>
  = T
  | TypedDictionary<T>;

export class TermListClause extends Clause {
  protected terms: Term[];

  /**
   * Accepts:
   *   node -> string
   *   many nodes -> string[]
   *   nodes with aliases -> Dictionary<string>
   *   node properties -> Dictionary<string[]>
   *   node properties with aliases -> Dictionary<Dictionary<string>[]>
   * or an array of any combination
   */
  constructor(terms: Many<Term>) {
    super();
    this.terms = castArray(terms);
  }

  build() {
    return this.toString();
  }

  toString() {
    return flatMapDeep(this.terms, term => this.stringifyTerm(term)).join(', ');
  }

  private stringifyTerm(term: Term): string[] {
    // Just a node
    if (isString(term)) {
      return [TermListClause.stringifyProperty(term)];
    }

    // Node properties or aliases
    if (isPlainObject(term)) {
      return this.stringifyDictionary(term);
    }

    return [];
  }

  private static stringifyProperty(prop: string, alias?: string, node?: string): string {
    const prefixString = node ? `${node}.` : '';
    const aliasString = alias ? `${alias} AS ` : '';
    return prefixString + aliasString + prop;
  }

  private stringifyProperties(props: Properties, alias?: string, node?: string): string[] {
    const convertToString = (list: string[], prop: string | Dictionary<string>) => {
      if (isString(prop)) {
        // Single node property
        list.push(TermListClause.stringifyProperty(prop, alias, node));
      } else {
        // Node properties with aliases
        list.push(
            ...map(prop, (name, alias) => TermListClause.stringifyProperty(name, alias, node)),
        );
      }
      return list;
    };
    return reduce(castArray(props), convertToString, []);
  }

  private stringifyDictionary(node: Dictionary<Properties>): string[] {
    return reduce(
      node,
      (list, prop, key) => {
        if (isString(prop)) {
          // Alias
          list.push(TermListClause.stringifyProperty(prop, key));
        } else {
          // Node with properties
          list.push(...this.stringifyProperties(prop, undefined, key));
        }
        return list;
      },
      [] as string[],
    );
  }
}
