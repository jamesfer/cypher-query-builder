const _ = require('lodash');
const Statement = require('../statement');
const ParameterBag = require('../parameterBag');

class Unwind extends Statement {
  constructor(list, name) {
    super();
    this.list = list;
    this.name = name;
  }

  build(parameterBag = new ParameterBag()) {
    let listParam = parameterBag.addParam(this.list);
    return `UNWIND ${listParam} AS ${this.name}`;
  }
}
module.exports = Unwind;
