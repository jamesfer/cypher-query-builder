const PatternClause = require('./patternStatement');
const patternClauseTests = require('./patternStatement.tests');
const { construct } = require('../utils');

describe('PatternStatement', function() {
  describe('#build', function() {
    patternClauseTests(construct(PatternClause, s => s.buildQueryObject()), '');
  });
});
