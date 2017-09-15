const ParameterBag = require('./parameterBag');

class ParameterContainer {
  constructor() {
    this.parameterBag = new ParameterBag();
  }

  useParameterBag(newBag) {
    for (let key in this.parameterBag.parameterMap) {
      newBag.addExistingParam(this.parameterBag.parameterMap[key]);
    }
    this.parameterBag = newBag;
  }

  getParams() {
    return this.parameterBag.getParams();
  }
}

module.exports = ParameterContainer;
