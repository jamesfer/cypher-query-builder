const _ = require('lodash');
const Statement = require('../statement');
const ParameterBag = require('../parameterBag');
const utils = require('../utils');

class Set extends Statement {
  constructor({ labels, values, variables }, { overrideVariables }) {
    this.labels = _.mapValues(label => _.concat([], label));
    this.values = values;
    this.variables = variables;
    this.overrideVariables = overrideVariables;
  }

  build(parameterBag = new ParameterBag()) {
    let labelString = utils.stringifyLabels(this.labels);
    let valuesString = _.map(this.values, (value, key) => {
      return key + ' = ' + parameterBag.addParam(value).toString();
    });
    let variablesString = _.join(_.map(this.variables, (value, key) => {
      return key + (this.overrideVariables ? ' = ' : ' += ') + value;
    }));

    return _.join(_.concat(
      [],
      labelString,
      valuesString,
      variablesString
    ));
  }
}

module.exports = Set;
