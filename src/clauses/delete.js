const _ = require('lodash');
const Statement = require('../statement');

class Delete extends Statement {
  constructor(variables = [], { detach = false }) {
    this.variables = variables;
    this.detach = detach;
  }

  build(parameterBag = new ParameterBag()) {
    let str = this.detach ? 'DETACH ' : '';
    str += 'DELETE ';
    return str + _.join(this.variables, ', ');
  }
}
module.exports = Delete;
