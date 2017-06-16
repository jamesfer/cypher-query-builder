const _ = require('lodash');
const Clause = require('./clause');

class PatternClause extends Clause {
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

  toString() {
    let patternStrings = _.map(this.patterns, pattern => _.join(pattern, ''));
    return _.join(patternStrings, ', ');
  }
}
module.exports = PatternClause;
