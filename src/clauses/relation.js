const _ = require('lodash');
const PatternSegment = require('./patternSegment')
const utils = require('../utils');
const ParameterBag = require('../parameterBag');

class Relation extends PatternSegment {
  constructor(dir, name = '', labels = [], conditions = {}, length = null) {
    super(name, labels, conditions);
    this.dir = dir;
    this.length = length;
  }

  build(parameterBag = new ParameterBag()) {
    let query = this.getNameString();
    query += this.getLabelsString();
    query += utils.stringifyPathLength(this.length);
    query += ' ' + this.getConditionsParamString(parameterBag);

    let arrows = {
      'in': ['<-[', ']-'],
      'out': ['-[', ']->'],
      'either': ['-[', ']-'],
    };
    return arrows[this.dir][0] + _.trim(query) + arrows[this.dir][1];
  }
}
module.exports = Relation;
