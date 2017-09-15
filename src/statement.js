const _ = require('lodash');
const ParameterContainer = require('./parameterContainer');

class Statement extends ParameterContainer {
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
}

module.exports = Statement;
