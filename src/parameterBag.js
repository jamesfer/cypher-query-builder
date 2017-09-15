const _ = require('lodash');
const utils = require('./utils');

class Parameter {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }

  toString() {
    return '$' + this.name;
  }
}

class ParameterBag {
  constructor() {
    this.parameterMap = {};
  }

  /**
   * Constructs a unique name for this parameter bag.
   * @return {string}
   */
  getName(name = 'p') {
    return utils.uniqueString(name, _.keys(this.parameterMap));
  }

  /**
   * Adds a new parameter to this bag.
   * @param {*} value
   * @param {string|undefined} name
   * @return {Parameter} Newly created parameter object.
   */
  addParam(value, name = undefined) {
    let actualName = this.getName(name);
    let param = new Parameter(actualName, value);
    this.parameterMap[actualName] = param;
    return param;
  }

  /**
   * Adds an existing parameter to this bag. The name may be changed if
   * it is already taken, however, the Parameter object will not be recreated.
   * @param {Parameter} param
   * @return {Parameter}
   */
  addExistingParam(param) {
    param.name = this.getName(param.name);
    this.parameterMap[param.name] = param;
    return param;
  }

  /**
   * Returns the params in a name: value object suitable for putting into a
   * query object.
   * @return {object}
   */
  getParams() {
    return _.mapValues(this.parameterMap, 'value');
  }

  /**
   * Removes a parameter from the internal map.
   * @param {string} name
   */
  deleteParam(name) {
    delete this.parameterMap[name];
  }
}

module.exports = ParameterBag;
module.exports.Parameter = Parameter;
