const ParameterBag = require('./parameterBag');

class ParameterContainer {
  constructor() {
    this.parameterBag = new ParameterBag();
  }

  useParameterBag(newBag) {
    let existingParams = this.parameterBag.getParams();
    for (let key in existingParams) {
      newBag.addParam(existingParams[key], key);
    }
    this.parameterBag = newBag;
  }

  getParams() {
    return this.parameterBag.getParams();
  }
}

module.exports = ParameterContainer;
