const _ = require('lodash');
const Match = require('./clauses/match');
const Node = require('./clauses/node');
const Create = require('./clauses/create');
const Return = require('./clauses/return');
const Statement = require('./statement');

class Query extends Statement {
  constructor(statements = null) {
    super(statements)
  }

  matchNode(varName, labels = [], clauses = {}) {
    this.addStatement(new Match(new Node(varName, labels, clauses)))
  }

  match(patterns, settings) {
    this.addStatement(new Match(patterns, settings));
  }

  createNode(varName, labels = [], clauses = {}) {
    this.addStatement(new Create(new Node(varName, labels, clauses)));
  }

  create(patterns) {
    this.addStatement(new Create(patterns));
  }

  ret(terms) {
    this.addStatement(new Return(terms));
  }
}

module.exports = Query;
