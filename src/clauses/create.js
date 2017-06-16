const _ = require('lodash');
const PatternClause = require('./patternClause');

class Create extends PatternClause {
  constructor(patterns) {
    super(patterns);
  }

  toString() {
    return 'CREATE ' + super.toString();
  }
}
module.exports = Create;
