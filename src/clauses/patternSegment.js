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

    if (_.isString(this.conditions)) {
      return this.conditions;
    }

    let str = _.join(_.map(this.conditions, (value, key) => {
      return `${key}: ${parameterBag.addParam(value).toString()}`;
    }), ', ');
    return str.length ? '{ ' + str + ' }' : '';
  }
}

module.exports = PatternSegment;
