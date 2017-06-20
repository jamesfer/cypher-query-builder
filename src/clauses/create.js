const _ = require('lodash');
const PatternClause = require('./patternClause');

class Create extends PatternClause {
  constructor(patterns) {
    super(patterns);
  }

  build() {
    return this.prefixQuery(super.build(), 'CREATE ');
  }
}
module.exports = Create;
