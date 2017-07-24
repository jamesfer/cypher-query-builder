const _ = require('lodash');
const Statement = require('../statement')
const ParameterBag = require('../parameterBag');

// TODO rename to pattern statement
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

    // Add child patterns as statements
    this.patterns.forEach(patternArray => {
      patternArray.forEach(pattern => {
        this.addStatement(pattern);
      });
    });
  }

  build(parameterBag = new ParameterBag()) {
    return _.join(_.map(this.patterns, pattern => {
      return _.join(_.map(pattern, clause => clause.build(parameterBag)), '');
    }), ', ');
  }
}
module.exports = PatternClause;
