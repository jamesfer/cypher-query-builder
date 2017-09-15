const _ = require('lodash');
const Statement = require('../statement');
const utils = require('../utils');
const Parameter = require('../parameterBag').Parameter;

class Pattern extends Statement {
  constructor(name, labels = [], conditions = {}, { expanded = true } = {}) {
    super();
    this.name = name;
    this.labels = _.concat([], labels);
    this.conditions = conditions;
    this.conditionParams = {};
    this.setExpandedConditions(expanded);
  }

  setExpandedConditions(expanded) {
    if (this.useExpandedConditions !== expanded) {
      this.useExpandedConditions = expanded;
      this.rebindConditionParams();
    }
  }

  rebindConditionParams() {
    // Delete old bindings
    if (this.conditionParams instanceof Parameter) {
      this.parameterBag.deleteParam(this.conditionParams.name);
    }
    else {
      _.each(this.conditionParams, param => {
        this.parameterBag.deleteParam(param.name);
      });
    }

    // Rebind params
    if (!_.isEmpty(this.conditions)) {
      if (this.useExpandedConditions) {
        this.conditionParams = _.mapValues(this.conditions, (value, name) => {
          return this.parameterBag.addParam(value, name);
        });
      }
      else {
        this.conditionParams = this.parameterBag.addParam(this.conditions, 'conditions');
      }
    }
    else {
      this.conditionParams = {};
    }
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
      let strings = _.map(this.conditionParams, (param, name) => {
        return `${name}: ${param}`;
      });
      return '{ ' + _.join(strings, ', ') + ' }';
    }
    return this.conditionParams.toString();
  }
}

module.exports = Pattern;
