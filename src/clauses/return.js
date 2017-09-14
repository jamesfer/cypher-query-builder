const _ = require('lodash');
const TermListClause = require('./termListStatement');

class Return extends TermListClause {
  /**
   * Creates a return clause
   * @param  {string|object|array<string|object>|} terms [description]
   */
  constructor(terms) {
    super(terms);
  }

  build() {
    return 'RETURN ' + super.build();
  }
}

module.exports = Return;
