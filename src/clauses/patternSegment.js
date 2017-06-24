const _ = require('lodash');
const Statement = require('../statement');
const utils = require('../utils');

// TODO rename to pattern clause
class PatternSegment extends Statement {
  constructor(name, labels = [], conditions = {}) {
    super();
    this.name = name;
    this.labels = _.concat([], labels);

    this.conditions = _.mapValues(conditions, condValue => {
      return this.addParam(condValue);
    });
    // this.conditions = conditions;
    // this.conditionParam = this.addParam(this.conditions);
  }

  getNameString() {
    return this.name ? this.name : '';
  }

  getLabelsString() {
    return utils.stringifyLabels(this.labels);
  }

  getConditionsParamString() {
    let str = _.join(_.map(this.conditions, (condParam, name) => {
      return name + ': ' + condParam.toString();
    }), ', ');
    return str.length ? '{ ' + str + ' }' : '';
    // return this.areConditionsEmpty() ? '' : this.conditionParam.toString();
  }

  getConditionParams() {
    return this.getParams();
    // return this.areConditionsEmpty() ? {} : this.getParams();
  }

  areConditionsEmpty() {
    return _.isEmpty(this.conditions);
  }
}

module.exports = PatternSegment;
