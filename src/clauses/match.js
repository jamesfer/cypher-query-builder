const _ = require('lodash');
const PatternClause = require('./patternClause');

class Match extends PatternClause {
  constructor(patterns, settings = {}) {
    super(patterns);
    settings = _.assign({
      optional: false,
    }, settings);
    this.optional = settings.optional;
  }

  build() {
    let str = 'MATCH ';
    if (this.optional) {
      str = 'OPTIONAL ' + str;
    }
    return this.prefixQuery(super.build(), str);
  }
}
module.exports = Match;
