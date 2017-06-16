const _ = require('lodash');
const Clause = require('./clause');
const utils = require('../utils');

class Node extends Clause {
  constructor(varName, labels = [], conditions = {}) {
    super();
    this.varName = varName;
    this.labels = _.concat([], labels);
    this.conditions = conditions;
  }

  toString() {
    let labelString = utils.stringifyLabels(this.labels);
    let clauseString = utils.stringifyConditions(this.conditions);
    let internalString = _.trim(`${this.varName}${labelString} ${clauseString}`);
    return '(' + internalString + ')';
  }
}
module.exports = Node;
