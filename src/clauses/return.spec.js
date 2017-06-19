const expect = require('chai').expect;
const Return = require('./return.js');
const termListClauseTests = require('./termListClause.tests');

describe('Return', function() {
  termListClauseTests(function() {
    let args = [Return];
    args.push.apply(args, arguments);
    let ret = new (Return.bind.apply(Return, args))();
    return ret.toString();
  }, 'RETURN ');
});
