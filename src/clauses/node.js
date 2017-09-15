const _ = require('lodash');
const Pattern = require('./pattern');

class Node extends Pattern {
  constructor(name, labels = [], conditions = {}) {
    super(name, labels, conditions);
  }

  build() {
    let query = this.getNameString();
    query += this.getLabelsString();
    query += ' ' + this.getConditionsParamString();
    return '(' + _.trim(query) + ')';
  }
}
module.exports = Node;
