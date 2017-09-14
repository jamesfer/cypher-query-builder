const _ = require('lodash');
const Statement = require('../statement');
const utils = require('../utils');

// TODO rename to pattern clause
class PatternSegment extends Statement {
  constructor(name, labels = [], conditions = {}) {
    super();
    this.name = name;
    this.labels = _.concat([], labels);
    this.conditions = conditions;
    this.useExpandedConditions = true;
  }

  setExpandedConditions(expanded) {
    this.useExpandedConditions = expanded;
  }

  getNameString() {
    return this.name ? this.name : '';
  }

  getLabelsString() {
    return utils.stringifyLabels(this.labels);
  }

  getConditionsParamString(parameterBag) {
    if (_.isEmpty(this.conditions)) {
      return '';
    }

    if (this.useExpandedConditions) {
      let str = _.join(_.map(this.conditions, (value, key) => {
        return `${key}: $${parameterBag.addParam(value)}`;
      }), ', ');
      return str.length ? '{ ' + str + ' }' : '';
    }
    else {
      return '$' + parameterBag.addParam(this.conditions);
    }
  }
}

module.exports = PatternSegment;
