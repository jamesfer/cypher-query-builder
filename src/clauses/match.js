const _ = require('lodash');
const PatternStatement = require('./patternStatement');

class Match extends PatternStatement {
  constructor(patterns, settings = {}) {
    super(patterns, { useExpandedConditions: true });
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
    return str + super.build();
  }
}
module.exports = Match;
