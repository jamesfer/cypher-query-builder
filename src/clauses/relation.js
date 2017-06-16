const _ = require('lodash');
const Clause = require('./clause');
const utils = require('../utils');

class Relation extends Clause {
  constructor(dir, varName = '', labels = [], conditions = {}, length = null) {
    super();
    this.dir = dir;
    this.varName = varName;
    this.labels = labels;
    this.conditions = conditions;
    this.length = length;
  }

  toString() {
    let labelString = utils.stringifyLabels(this.labels);
    let clauseString = utils.stringifyConditions(this.conditions);
    let pathLengthString = utils.stringifyPathLength(this.length);
    let internalString = _.trim(`${this.varName}${labelString}${pathLengthString} ${clauseString}`);

    let arrows = {
      'in': ['<-[', ']-'],
      'out': ['-[', ']->'],
      'either': ['-[', ']-'],
    }

    return arrows[this.dir][0] + internalString + arrows[this.dir][1];
  }
}
module.exports = Relation;
