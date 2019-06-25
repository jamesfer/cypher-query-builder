import { Parameter, ParameterBag } from './parameter-bag';
import { Dictionary } from 'lodash';

export class ParameterContainer {
  protected parameterBag = new ParameterBag();

  useParameterBag(newBag: ParameterBag) {
    newBag.importParams(this.parameterBag);
    this.parameterBag = newBag;
  }

  getParams(): Dictionary<any> {
    return this.parameterBag.getParams();
  }

  /**
   * Adds a new parameter to the bag.
   * @param {*} value
   * @param {string|undefined} name
   * @return {Parameter} Newly created parameter object.
   */
  addParam(value: any, name?: string): Parameter {
    return this.parameterBag.addParam(value, name);
  }

  getParameterBag() {
    return this.parameterBag;
  }
}
