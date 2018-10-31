import { Clause } from '../clause';
import {
  isString,
  isArray,
  isObjectLike,
  map,
  flatten,
  zip,
  isNil,
} from 'lodash';

export class Raw extends Clause {
  clause: string;

  constructor(clause: string | TemplateStringsArray, ...args: any[]) {
    super();

    if (isString(clause)) {
      this.clause = clause;
      const params = args[0];
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
      const queryParams = map(args, param => this.addParam(param));
      this.clause = flatten(zip(clause, queryParams)).join('');
    } else {
      throw new TypeError('Clause should be a string or an array');
    }
  }

  build() {
    return this.clause;
  }
}
