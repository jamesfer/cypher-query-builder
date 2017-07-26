const _ = require('lodash');
const Statement = require('../statement');
const ParameterBag = require('../parameterBag');
const utils = require('../utils');

class Set extends Statement {
  constructor(
    { labels = {}, values = {}, variables = {} },
    { overrideVariables }
  ) {
    super();
    this.labels = _.mapValues(label => _.concat([], label));
    this.values = values;
    this.variables = variables;
    this.overrideVariables = overrideVariables;
  }

  build(parameterBag = new ParameterBag()) {
    let labelString = _.map(this.labels, (labels, key) => {
      return key + utils.stringifyLabels(labels)
    });
    let valuesString = _.map(this.values, (value, key) => {
      return key + ' = ' + parameterBag.addParam(value).toString();
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
