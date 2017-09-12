const _ = require('lodash');
const utils = require('./utils');

class ParameterBag {
  constructor() {
    this.parameters = {};
  }

  /**
   * Constructs a unique name for this parameter bag.
   * @return {string}
   */
  getName(name = 'p') {
    return utils.uniqueString(name, _.keys(this.parameters));
  }

  /**
   * Adds a new parameter to this bag.
   * @param {*} value
   * @param {string?} name
   * @return {string} Actual name of the parameter.
   */
  addParam(value, name = undefined) {
    name = this.getName(name);
    this.parameters[name] = value;
    return name;
  }

  /**
   * Returns the params in a name: value object suitable for putting into a
   * query object.
   * @return {object}
   */
  getParams(){
    return this.parameters;
  }
}

module.exports = ParameterBag;
