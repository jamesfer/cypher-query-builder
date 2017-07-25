const clauses = require('./clauses');
const Statement = require('./statement');

class Query extends Statement {
  constructor(connection = null) {
    super();
    this.connection = connection;
  }

  matchNode(varName, labels = [], clauses = {}) {
    return this.addStatement(clauses.match(clauses.node(varName, labels, clauses)));
  }

  match(patterns, settings) {
    return this.addStatement(clauses.match(patterns, settings));
  }

  createNode(varName, labels = [], clauses = {}) {
    return this.addStatement(clauses.create(clauses.node(varName, labels, clauses)));
  }

  create(patterns) {
    return this.addStatement(clauses.create(patterns));
  }

  ret(terms) {
    return this.addStatement(clauses.ret(terms));
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

  detachDelete(terms) {
    return this.addStatement(clauses.detachDelete(terms));
  }


  async run() {
    if (!this.connection) {
      throw Error('Cannot run query; no connection object available.');
    }

    return this.connection.run(this);
  }
}

module.exports = Query;
