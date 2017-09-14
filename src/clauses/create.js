const _ = require('lodash');
const PatternClause = require('./patternClause');
const ParameterBag = require('../parameterBag');

class Create extends PatternClause {
  constructor(patterns) {
    super(patterns, { useExpandedConditions: false });
  }

  build(parameterBag = new ParameterBag()) {
    return 'CREATE ' + super.build(parameterBag);
  }
}
module.exports = Create;
