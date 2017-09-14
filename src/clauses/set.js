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
    let labelString = _.map(this.labels, (labels, key) => {
      return key + utils.stringifyLabels(labels)
    });
    let valuesString = _.map(this.values, (value, key) => {
      return key + ' = ' + value;
    });
    let variablesString = _.join(_.map(this.variables, (value, key) => {
      return key + (this.overrideVariables ? ' = ' : ' += ') + value;
    }));

    return 'SET ' + _.join(_.concat(
      [],
      labelString,
      valuesString,
      variablesString
    ), ', ');
  }
}

module.exports = Set;
