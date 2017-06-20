const _ = require('lodash');
const Statement = require('../statement')
const utils = require('../utils');

class Relation extends Statement {
  constructor(dir, varName = '', labels = [], conditions = {}, length = null) {
    super();
    this.dir = dir;
    this.varName = varName;
    this.labels = labels;
    this.length = length;
    this.conditions = conditions;
    this.conditionParam = this.addParam(conditions);
  }

  build() {
    let labelString = utils.stringifyLabels(this.labels);
    let pathLengthString = utils.stringifyPathLength(this.length);
    let internalString = _.trim(`${this.varName}${labelString}${pathLengthString} ${this.conditionParam}`);

    let arrows = {
      'in': ['<-[', ']-'],
      'out': ['-[', ']->'],
      'either': ['-[', ']-'],
    };
    let queryStr = arrows[this.dir][0] + internalString + arrows[this.dir][1];
    return this.makeQueryObject(queryStr);
  }
}
module.exports = Relation;
