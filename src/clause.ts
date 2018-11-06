import { stringifyValue } from './utils';
import { ParameterContainer } from './parameter-container';
import { Dictionary } from 'lodash';

export type QueryObject = {
  query: string;
  params: Dictionary<any>
};

export abstract class Clause extends ParameterContainer {
  /**
   * Turns the clause into a query string.
   * @return {string} Partial query string.
   */
  abstract build(): string;

  /**
   * Turns the clause into a query string.
   * @return {string} Partial query string.
   */
  toString(): string {
    return this.build();
  }

  /**
   * Turns the clause into a query object.
   * @return {object} Query object with two parameters: query and params.
   */
  buildQueryObject(): QueryObject {
    return {
      query: this.build(),
      params: this.getParams(),
    };
  }

  /**
   * Turns the clause into a query string with parameters
   * interpolated into the string. For debugging purposes only.
   * @return {string}
   */
  interpolate(): string {
    let query = this.build();
    const params = this.getParams();
    for (const name in params) {
      const pattern = new RegExp(`\\$${name}(?![a-zA-Z0-9_])`, 'g');
      query = query.replace(pattern, stringifyValue(params[name]));
    }
    return query;
  }
}
