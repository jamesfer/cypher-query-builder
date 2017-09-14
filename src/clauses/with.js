const TermListClause = require('./termListStatement');
const ParameterBag = require('../parameterBag');

class With extends TermListClause {
  /**
   * Creates a with clause
   * @param  {string|object|array<string|object>} terms
   */
  constructor(terms) {
    super(terms);
  }

  build(parameterBag = new ParameterBag()) {
    return 'WITH ' + super.build(parameterBag);
  }
}

module.exports = With;
