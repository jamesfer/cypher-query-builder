import { Statement } from '../statement';
import {
  join, flattenDeep, map, isPlainObject, isString, isArray, castArray, reduce,
  Dictionary, Many,
} from 'lodash';

export type Properties = (string | Dictionary<string>)[];
export type Term
  = string
  | string[]
  | Dictionary<string>
  | Dictionary<Properties>;

export class TermListStatement extends Statement {
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

  toString() {
    return join(flattenDeep(map(this.terms, term => this.stringifyTerm(term))), ', ');
  }

  private stringifyTerm(term: Term): string | string[]{
    // Just a node
    if (isString(term)) {
      return this.stringifyProperty(term);
    }

    // List of nodes
    if (isArray(term)) {
      return this.stringifyProperties(term);
    }

    // Node properties or aliases
    if (isPlainObject(term)) {
      return this.stringifyDictionary(term);
    }
  }

  private stringifyProperty(prop: string, alias?: string, node?: string): string {
    let prefix = node ? node + '.' : '';
    if (alias) {
      prefix += alias + ' AS ';
    }
    return prefix + prop;
  }

  private stringifyProperties(props: Properties, alias?: string, node?: string): string[] {
    return reduce(props, (list, prop) => {
      // Single node property
      if (isString(prop)) {
        list.push(this.stringifyProperty(prop, alias, node));
      }
      // Node properties with aliases
      else {
        list.push(...map(prop, (name, alias) => {
          return this.stringifyProperty(name, alias, node);
        }));
      }
      return list;
    }, []);
  }

  private stringifyDictionary(node: Dictionary<string | Properties>): string[] {
    return reduce(node, (list, prop, key) => {
      // Alias
      if (isString(prop)) {
        list.push(this.stringifyProperty(prop, key));
      }
      // Node with properties
      else {
        list.push(...this.stringifyProperties(prop, null, key));
      }
      return list;
    }, [])
  }

  build() {
    return this.toString();
  }
}
