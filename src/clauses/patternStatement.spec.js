const PatternStatement = require('./patternStatement');
const patternStatementTests = require('./patternStatement.tests');
const { construct } = require('../utils');

describe('PatternStatement', function() {
  describe('#build', function() {
    patternStatementTests(construct(PatternStatement, s => s.buildQueryObject()), '');
  });
});
