const expect = require('chai').expect;
const Return = require('./return.js');
const returnTests = require('./return.tests');
const { construct } = require('../utils');

describe('Return', function() {
  describe('#build', function() {
    returnTests(construct(Return, s => s.buildQueryObject()));
  });
});
