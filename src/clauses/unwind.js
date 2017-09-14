const _ = require('lodash');
const Statement = require('../statement');

class Unwind extends Statement {
  constructor(list, name) {
    super();
    this.list = list;
    this.name = name;
    this.listParam = this.parameterBag.addParam(this.list, 'list');
  }

  build() {
    return `UNWIND ${this.listParam} AS ${this.name}`;
  }
}
module.exports = Unwind;
