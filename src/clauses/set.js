const _ = require('lodash');
const Statement = require('../statement');
const utils = require('../utils');

class Set extends Statement {
  constructor(
    { labels = {}, values = {}, variables = {} },
    { overrideVariables }
  ) {
    super();
    this.labels = _.mapValues(_.castArray);
    this.values = _.mapValues(values, (value, name) => {
      return this.parameterBag.addParam(value, name);
    });
    this.variables = variables;
    this.overrideVariables = overrideVariables;
  }

  build() {
    let labels = _.map(this.labels, (labels, key) => {
      return key + utils.stringifyLabels(labels)
    });
    let values = _.map(this.values, (param, key) => `${key} = ${param}`);
    let op = this.overrideVariables ? ' = ' : ' += ';
    let variables = _.join(_.map(this.variables, (value, key) => key + op + value));

    return 'SET ' + _.join(_.concat(labels, values, variables), ', ');
  }
}

module.exports = Set;
