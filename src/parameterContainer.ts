import { ParameterBag } from './parameterBag';
export class ParameterContainer {
  protected parameterBag = new ParameterBag();

  useParameterBag(newBag) {
    newBag.importParams(this.parameterBag);
    this.parameterBag = newBag;
  }

  getParams() {
    return this.parameterBag.getParams();
  }

  /**
   * Adds a new parameter to the bag.
   * @param {*} value
   * @param {string|undefined} name
   * @return {Parameter} Newly created parameter object.
   */
  addParam(value: any, name?: string) {
    return this.parameterBag.addParam(value, name);
  }

  getParameterBag() {
    return this.parameterBag;
  }
}
