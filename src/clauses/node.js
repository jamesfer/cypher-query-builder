const _ = require('lodash');
const Pattern = require('./pattern');
const ParameterBag = require('../parameterBag');

class Node extends Pattern {
  constructor(name, labels = [], conditions = {}) {
    super(name, labels, conditions);
  }

  build(parameterBag = new ParameterBag()) {
    let query = this.getNameString();
    query += this.getLabelsString();
    query += ' ' + this.getConditionsParamString(parameterBag);
    return '(' + _.trim(query) + ')';
  }
}
module.exports = Node;
