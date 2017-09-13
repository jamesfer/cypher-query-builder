const _ = require('lodash');
const PatternClause = require('./patternStatement');
const ParameterBag = require('../parameterBag');

class Create extends PatternClause {
  constructor(patterns) {
    super(patterns);
  }

  build(parameterBag = new ParameterBag()) {
    return 'CREATE ' + super.build(parameterBag);
  }
}
module.exports = Create;
