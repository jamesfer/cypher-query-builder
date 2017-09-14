const _ = require('lodash');
const Statement = require('../statement');
const utils = require('../utils');

class Pattern extends Statement {
  constructor(name, labels = [], conditions = {}) {
    super();
    this.name = name;
    this.labels = _.concat([], labels);
    this.conditions = conditions;
    this.useExpandedConditions = true;

    this.expandedConditionParams = _.mapValues(conditions, (value, name) => {
      return this.parameterBag.addParam(value, name);
    });
    this.condensedConditionParam = this.parameterBag.addParam(conditions, 'conditions');
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

  getConditionsParamString() {
    if (_.isEmpty(this.conditions)) {
      return '';
    }

    if (this.useExpandedConditions) {
      let str = _.join(_.map(this.expandedConditionParams, (value, key) => {
        return `${key}: ${value}`;
      }), ', ');
      return '{ ' + str + ' }';
    }
    else {
      return this.condensedConditionParam.toString();
    }
  }
}

module.exports = Pattern;
