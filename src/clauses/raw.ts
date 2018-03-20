import { Clause } from '../clause';
import {
  Dictionary,
  isString,
  isArray,
  isObjectLike,
  map,
  join,
  flatten,
  zip,
  isNil,
} from 'lodash';

export class Raw extends Clause {
  clause: string;

  constructor(clause: TemplateStringsArray, ...args: any[]);
  constructor(clause: string, params?: Dictionary<any>);
  constructor(clause: string | TemplateStringsArray, params?: Dictionary<any>, ...args: any[]) {
    super();

    if (isString(clause)) {
      this.clause = clause;
      if (isObjectLike(params)) {
        for (const key in params) {
          if (Object.hasOwnProperty.call(params, key)) {
            this.addParam(params[key], key);
          }
        }
      } else if (!isNil(params)) {
        throw new TypeError('When passing a string clause to Raw, params should be an object');
      }
    } else if (isArray(clause)) {
      const queryParams = map([params, ...args], param => this.addParam(param));
      this.clause = join(flatten(zip(clause, queryParams)), '');
    } else {
      throw new TypeError('Clause should be a string or an array');
    }
  }

  build() {
    return this.clause;
  }
}
