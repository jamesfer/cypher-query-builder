const expect = require('chai').expect;
const Match = require('./match');
const matchTests = require('./match.tests');
const { construct } = require('../utils');

describe('Match', function() {
  describe('#build', function() {
    matchTests(construct(Match, s => s.buildQueryObject()));
  });
});
