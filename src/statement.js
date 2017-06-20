const _ = require('lodash');
const ParameterBag = require('./parameterBag')

class Statement {
  constructor(statements = null) {
    this.parameterBag = new ParameterBag();
    this.statements = statements || [];
  }

  /**
   * Turns the statement into a query object.
   * @return {object} Query object with two properties: query and params.
   */
  build() {
    return this.mergeStatements(this.statements);
  }

  /**
   * Sets the parent bag of this statement's parameter bag.
   * @param {ParemeterBag} parent
   */
  setParameterParent(parent) {
    this.parameterBag.setParent(parent);
  }

  /**
   * Creates a new parameter in our parameter bag and returns it.
   * @param {*} value Value of the parameter.
   * @param {string} [name=null] Optional name of the parameter, defaults to pn.
   */
  addParam(value, name = null) {
    return this.parameterBag.addParam(value, name);
  }

  /**
   * Returns an object of all parameter names and values suitable for using
   * in a query object.
   * @return {object} Parameter object.
   */
  getParams() {
    return this.parameterBag.getParams();
  }

  /**
   * Short cut method to return a query object from a query string and using
   * getParams() to build the parameter object.
   * @param  {string} query
   * @return {object}
   */
  makeQueryObject(query) {
    return {
      query,
      params: this.getParams()
    };
  }

  /**
   * Adds a prefix to the query string of a query object. Leaves the parameters
   * untouched.
   * @param {object} queryObj
   * @param {string} prefix
   */
  prefixQuery(queryObj, prefix) {
    return {
      query: prefix + queryObj.query,
      params: queryObj.params,
    };
  }

  /**
   * Merges all of its child statements together by concatenating the queries in
   * order with a delimiter and merging each param object.
   * @param {String} [delimiter='\n']
   * @return {object}
   */
  mergeStatements(statements, delimiter = '\n') {
    let queryObjs = _.map(this.statements, statement => statement.build());
    return {
      query: _.join(_.map(queryObjs, 'query'), delimiter),
      params: _.assign({}, ..._.map(queryObjs, 'params')),
    };
  }

  /**
   * Adds a statement to the child list
   * @param {Statement} statement
   */
  addStatement(statement) {
    this.statements.push(statement);
    statement.setParameterParent(this.parameterBag);
  }
}

module.exports = Statement;
