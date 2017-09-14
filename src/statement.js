const _ = require('lodash');
const ParameterContainer = require('./parameterContainer');

class Statement extends ParameterContainer {
  constructor(statements = []) {
    super();
    this.statements = statements;
  }

  /**
   * Turns the statement into a query string.
   * @return {string} Partial query string.
   */
  build() {
    return _.join(_.map(this.statements, s => s.build()), '\n');
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
   * Adds a statement to the child list
   * @param {Statement} statement
   */
  addStatement(statement) {
    this.statements.push(statement);
    return this;
  }
}

module.exports = Statement;
