const _ = require('lodash');
const Match = require('./clauses/match');
const Node = require('./clauses/node');
const Segment = require('./segment');


class Query {
  constructor(segments = null) {
    /**
     * @type {Array<Segment>}
     */
    this.segments = segments || [new Segment()];
  }

  toString() {
    return _.join(_.map(this.segments, segment => segment.toString()), '\n');
  }

  /**
   * Adds a clause to the last segment.
   * @param {Clause} clause
   */
  addClause(clause) {
    _.last(this.segments).addClause(clause);
  }

  matchNode(varName, labels = [], clauses = {}) {
    this.addClause(new Match(new Node(varName, labels, clauses)))
  }

  match(patterns, settings) {
    this.addClause(new Match(patterns, settings));
  }
}
module.exports = Query;
