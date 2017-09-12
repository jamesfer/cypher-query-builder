const _ = require('lodash');
const ParameterBag = require('./parameterBag')

class Statement {
  constructor(statements = []) {
    this.statements = statements;
  }

  /**
   * Turns the statement into a query string.
   * @return {string} Partial query string.
   */
  build(parameterBag = new ParameterBag()) {
    return _.join(_.map(this.statements, s => s.build(parameterBag)), '\n');
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
    let parameterBag = new ParameterBag();
    let obj = this.build(parameterBag);
    return {
      query: obj,
      params: parameterBag.getParams(),
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
