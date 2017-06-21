const _ = require('lodash');
const PatternSegment = require('./patternSegment');

class Node extends PatternSegment {
  constructor(name, labels = [], conditions = {}) {
    super(name, labels, conditions);
  }

  build() {
    let query = this.getNameString();
    query += this.getLabelsString();
    query += ' ' + this.getConditionsParamString();
    return {
      query: '(' + _.trim(query) + ')',
      params: this.getConditionParams(),
    };
  }
}
module.exports = Node;
