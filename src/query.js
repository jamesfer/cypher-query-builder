const { match, node, create, ret, unwind, withVars } = require('./clauses');
const Statement = require('./statement');

class Query extends Statement {
  constructor(connection = null) {
    super();
    this.connection = connection;
  }

  matchNode(varName, labels = [], clauses = {}) {
    return this.addStatement(match(node(varName, labels, clauses)));
  }

  match(patterns, settings) {
    return this.addStatement(match(patterns, settings));
  }

  createNode(varName, labels = [], clauses = {}) {
    return this.addStatement(create(node(varName, labels, clauses)));
  }

  create(patterns) {
    return this.addStatement(create(patterns));
  }

  ret(terms) {
    return this.addStatement(ret(terms));
  }

  with(terms) {
    return this.addStatement(withVars(terms));
  }

  unwind(list, name) {
    return this.addStatement(unwind(list, name));
  }


  async run() {
    if (!this.connection) {
      throw Error('Cannot run query; no connection object available.');
    }

    return this.connection.run(this);
  }
}

module.exports = Query;
