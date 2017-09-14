const _ = require('lodash');
const TermListClause = require('./termListStatement');
const ParameterBag = require('../parameterBag');

class Return extends TermListClause {
  /**
   * Creates a return clause
   * @param  {string|object|array<string|object>|} vars [description]
   */
  constructor(terms) {
    super(terms);
  }

  build(parameterBag = new ParameterBag()) {
    return 'RETURN ' + super.build(parameterBag);
  }
}

module.exports = Return;
