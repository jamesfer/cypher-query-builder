const _ = require('lodash');
const PatternStatement = require('./patternStatement');

class Create extends PatternStatement {
  constructor(patterns) {
    super(patterns, { useExpandedConditions: false });
  }

  build() {
    return 'CREATE ' + super.build();
  }
}
module.exports = Create;
