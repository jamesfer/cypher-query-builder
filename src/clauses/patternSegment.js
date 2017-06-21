const _ = require('lodash');
const Statement = require('../statement');
const utils = require('../utils');

class PatternSegment extends Statement {
  constructor(name, labels = [], conditions = {}) {
    super();
    this.name = name;
    this.labels = _.concat([], labels);
    this.conditions = conditions;
    this.conditionParam = this.addParam(this.conditions);
  }

  getNameString() {
    return this.name ? this.name : '';
  }

  getLabelsString() {
    return utils.stringifyLabels(this.labels);
  }

  getConditionsParamString() {
    return this.areConditionsEmpty() ? '' : this.conditionParam.toString();
  }

  getConditionParams() {
    return this.areConditionsEmpty() ? {} : this.getParams();
  }

  areConditionsEmpty() {
    return _.isEmpty(this.conditions);
  }
}

module.exports = PatternSegment;
