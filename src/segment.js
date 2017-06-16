const _ = require('lodash');

class Segment {
  constructor(clauses = null) {
    /**
     * @type {Array<Clause>}
     */
    this.clauses = clauses || [];
  }

  toString() {
    return _.join(_.map(this.clauses, clause => clause.toString()), '\n');
  }

  addClause(clause) {
    this.clauses.push(clause);
  }
}
module.exports = Segment;
