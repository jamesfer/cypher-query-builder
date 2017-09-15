const _ = require('lodash');
const clauses = require('./clauses');
const Statement = require('./statement');

class Query extends Statement {
  constructor(connection = null) {
    super();
    this.connection = connection;
    this.statements = [];
  }

  matchNode(varName, labels = [], conditions = {}) {
    return this.addStatement(clauses.match(clauses.node(varName, labels, conditions)));
  }

  match(patterns, settings = {}) {
    return this.addStatement(clauses.match(patterns, settings));
  }

  optionalMatch(patterns, settings = {}) {
    return this.addStatement(clauses.match(patterns, Object.assign(settings, {
      optional: true,
    })));
  }

  createNode(varName, labels = [], conditions = {}) {
    return this.addStatement(clauses.create(clauses.node(varName, labels, conditions)));
  }

  create(patterns) {
    return this.addStatement(clauses.create(patterns));
  }

  return(terms) {
    return this.addStatement(clauses.return(terms));
  }

  with(terms) {
    return this.addStatement(clauses.withVars(terms));
  }

  unwind(list, name) {
    return this.addStatement(clauses.unwind(list, name));
  }

  delete(terms) {
    return this.addStatement(clauses.delete(terms));
  }

  set(values, settings) {
    return this.addStatement(clauses.set(values, settings));
  }

  setLabels(labels) {
    return this.addStatement(clauses.set({ labels }));
  }

  setValues(values) {
    return this.addStatement(clauses.set({ values }));
  }

  setVariables(variables, overrideVariables) {
    return this.addStatement(clauses.set(
      { variables },
      { overrideVariables }
    ));
  }

  detachDelete(terms, settings = {}) {
    return this.addStatement(clauses.delete(terms, Object.assign(settings, {
      detach: true,
    })));
  }

  build() {
    return _.join(_.map(this.statements, s => s.build()), '\n') + ';';
  }

  getStatements() {
    return this.statements;
  }

  /**
   * Adds a statement to the child list.
   * @param {Statement} statement
   * @return {Query}
   */
  addStatement(statement) {
    statement.useParameterBag(this.parameterBag);
    this.statements.push(statement);
    return this;
  }

  async run() {
    if (!this.connection) {
      throw Error('Cannot run query; no connection object available.');
    }

    return this.connection.run(this);
  }
}

module.exports = Query;
