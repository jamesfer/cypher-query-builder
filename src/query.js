const clauses = require('./clauses');
const Statement = require('./statement');

class Query extends Statement {
  constructor(connection = null) {
    super();
    this.connection = connection;
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

  detachDelete(terms, settings = {}) {
    return this.addStatement(clauses.delete(terms, Object.assign(settings, {
      detach: true,
    })));
  }


  async run() {
    if (!this.connection) {
      throw Error('Cannot run query; no connection object available.');
    }

    return this.connection.run(this);
  }
}

module.exports = Query;
