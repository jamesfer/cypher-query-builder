const _ = require('lodash');
const Statement = require('../statement')

class PatternClause extends Statement {
  constructor(patterns) {
    super();

    // Ensure patterns is a two dimensional array.
    if (_.isArray(patterns)) {
      if (patterns.length && _.isArray(patterns[0])) {
        this.patterns = patterns;
      }
      else {
        this.patterns = [patterns];
      }
    }
    else {
      this.patterns = [[patterns]];
    }
  }

  build() {
    console.log(this.patterns);
    let queryObjs = _.map(this.patterns, (pattern) => {
      return this.mergeStatements(_.map(pattern, clause => clause.build()), '');
    });
    let queryObj = this.mergeStatements(queryObjs, ', ');
    return queryObj;
  }
}
module.exports = PatternClause;
