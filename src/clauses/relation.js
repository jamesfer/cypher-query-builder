const _ = require('lodash');
const Pattern = require('./pattern')
const utils = require('../utils');

class Relation extends Pattern {
  constructor(dir, name = '', labels = [], conditions = {}, length = null) {
    super(name, labels, conditions);
    this.dir = dir;
    this.length = length;
  }

  build() {
    let query = this.getNameString();
    query += this.getLabelsString();
    query += utils.stringifyPathLength(this.length);
    query += ' ' + this.getConditionsParamString();

    let arrows = {
      'in': ['<-[', ']-'],
      'out': ['-[', ']->'],
      'either': ['-[', ']-'],
    };
    return arrows[this.dir][0] + _.trim(query) + arrows[this.dir][1];
  }
}
module.exports = Relation;
