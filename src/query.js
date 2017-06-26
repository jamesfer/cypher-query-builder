const _ = require('lodash');
const Match = require('./clauses/match');
const Node = require('./clauses/node');
const Create = require('./clauses/create');
const Return = require('./clauses/return');
const Statement = require('./statement');

class Query extends Statement {
  constructor(connection = null) {
    super();
    this.connection = connection;
  }

  matchNode(varName, labels = [], clauses = {}) {
    this.addStatement(new Match(new Node(varName, labels, clauses)));
    return this;
  }

  match(patterns, settings) {
    this.addStatement(new Match(patterns, settings));
    return this;
  }

  createNode(varName, labels = [], clauses = {}) {
    this.addStatement(new Create(new Node(varName, labels, clauses)));
    return this;
  }

  create(patterns) {
    this.addStatement(new Create(patterns));
    return this;
  }

  ret(terms) {
    this.addStatement(new Return(terms));
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
