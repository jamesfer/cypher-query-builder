const _ = require('lodash');
const PatternStatement = require('./patternStatement');
const ParameterBag = require('../parameterBag');

class Match extends PatternStatement {
  constructor(patterns, settings = {}) {
    super(patterns);
    settings = _.assign({
      optional: false,
    }, settings);
    this.optional = settings.optional;
  }

  build(parameterBag = new ParameterBag()) {
    let str = 'MATCH ';
    if (this.optional) {
      str = 'OPTIONAL ' + str;
    }
    return str + super.build(parameterBag);
  }
}
module.exports = Match;
