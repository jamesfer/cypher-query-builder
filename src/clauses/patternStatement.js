const _ = require('lodash');
const Statement = require('../statement');

class PatternStatement extends Statement {
  constructor(patterns, options) {
    super();

    options = _.assign({
      useExpandedConditions: true,
    }, options);

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
        pattern.setExpandedConditions(options.useExpandedConditions);
        pattern.useParameterBag(this.parameterBag);
      });
    });
  }

  build() {
    return _.join(_.map(this.patterns, pattern => {
      return _.join(_.map(pattern, clause => clause.build()), '');
    }), ', ');
  }
}
module.exports = PatternStatement;
