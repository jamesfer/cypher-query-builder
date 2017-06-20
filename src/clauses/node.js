const _ = require('lodash');
const Statement = require('../statement')
const utils = require('../utils');

class Node extends Statement {
  constructor(varName, labels = [], conditions = {}) {
    super();
    this.varName = varName;
    this.labels = _.concat([], labels);
    this.conditions = conditions;
    this.conditionParam = this.addParam(conditions);
  }

  build() {
    let labelString = utils.stringifyLabels(this.labels);
    let internalString = _.trim(`${this.varName}${labelString} ${this.conditionParam}`);
    return this.makeQueryObject('(' + internalString + ')');
  }
}
module.exports = Node;
