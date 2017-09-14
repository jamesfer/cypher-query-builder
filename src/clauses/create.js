const _ = require('lodash');
const PatternStatement = require('./patternStatement');
const ParameterBag = require('../parameterBag');

class Create extends PatternStatement {
  constructor(patterns) {
    super(patterns, { useExpandedConditions: false });
  }

  build(parameterBag = new ParameterBag()) {
    return 'CREATE ' + super.build(parameterBag);
  }
}
module.exports = Create;
