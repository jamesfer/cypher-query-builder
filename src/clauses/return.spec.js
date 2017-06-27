const expect = require('chai').expect;
const Return = require('./return.js');
const returnTests = require('./return.tests');

describe('Return', function() {
  describe('#build', function() {
    returnTests(function() {
      let args = [Return];
      args.push.apply(args, arguments);
      let ret = new (Return.bind.apply(Return, args))();
      return ret.build();
    });
  });
});
