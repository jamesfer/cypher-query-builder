const _ = require('lodash');
const Statement = require('../statement');

class Delete extends Statement {
  constructor(variables = [], { detach } = { detach: false }) {
    super();
    this.variables = variables;
    this.detach = detach;
  }

  build() {
    let str = this.detach ? 'DETACH ' : '';
    str += 'DELETE ';
    return str + _.join(this.variables, ', ');
  }
}
module.exports = Delete;
