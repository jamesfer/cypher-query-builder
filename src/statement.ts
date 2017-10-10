import { stringifyValue } from './utils';
import { ParameterContainer } from './parameterContainer';

export class Statement extends ParameterContainer {
  constructor() {
    super();
  }

  /**
   * Turns the statement into a query string.
   * @return {string} Partial query string.
   */
  build() {
    return '';
  }

  /**
   * Turns the statement into a query string.
   * @return {string} Partial query string.
   */
  toString() {
    return this.build();
  }

  /**
   * Turns the statement into a query object.
   * @return {object} Query object with two parameters: query and params.
   */
  buildQueryObject() {
    return {
      query: this.build(),
      params: this.getParams(),
    }
  }

  /**
   * The statement into a query string with parameters
   * interpolated into the string. For debugging purposes only.
   * @return {string}
   */
  interpolate() {
    let { params, query } = this.buildQueryObject();
    for (let name in params) {
      query = query.replace('$' + name, stringifyValue(params[name]));
    }
    return query;
  }
}
