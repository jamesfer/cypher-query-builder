const _ = require('lodash');
const TermListClause = require('./termListClause');

class Return extends TermListClause {
  /**
   * Creates a return clause
   * @param  {string|object|array<string|object>|} vars [description]
   */
  constructor(terms) {
    super(terms);
  }

  toString() {
    return 'RETURN ' + super.toString();
  }
}

module.exports = Return;
