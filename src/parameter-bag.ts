import { uniqueString } from './utils';
import { Dictionary, keys, mapValues } from 'lodash';

export class Parameter {
  constructor(
    public name: string,
    public value: string,
  ) { }

  toString() {
    return `$${this.name}`;
  }
}

export class ParameterBag {
  protected parameterMap: Dictionary<Parameter> = {};

  /**
   * Constructs a unique name for this parameter bag.
   * @return {string}
   */
  getName(name = 'p') {
    return uniqueString(name, keys(this.parameterMap));
  }

  /**
   * Adds a new parameter to this bag.
   * @param {*} value
   * @param {string|undefined} name
   * @return {Parameter} Newly created parameter object.
   */
  addParam(value: any, name?: string) {
    const actualName = this.getName(name);
    const param = new Parameter(actualName, value);
    this.parameterMap[actualName] = param;
    return param;
  }

  /**
   * Adds an existing parameter to this bag. The name may be changed if
   * it is already taken, however, the Parameter object will not be recreated.
   * @param {Parameter} param
   * @return {Parameter}
   */
  addExistingParam(param: Parameter) {
    param.name = this.getName(param.name);
    this.parameterMap[param.name] = param;
    return param;
  }

  /**
   * Returns the params in a name: value object suitable for putting into a
   * query object.
   * @return {object}
   */
  getParams(): Dictionary<any> {
    return mapValues(this.parameterMap, 'value');
  }

  /**
   * Removes a parameter from the internal map.
   * @param {string} name
   */
  deleteParam(name: string) {
    delete this.parameterMap[name];
  }

  /**
   * Copies all parameters from another bag into this bag.
   */
  importParams(other: ParameterBag) {
    for (const key in other.parameterMap) {
      this.addExistingParam(other.parameterMap[key]);
    }
  }

  /**
   * Returns a parameter with the given name.
   */
  getParam(name: string) {
    return this.parameterMap[name];
  }
}
