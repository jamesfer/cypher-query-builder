const PatternClause = require('./patternClause');
const patternClauseTests = require('./patternClause.tests');
const { construct } = require('../utils');

describe('PatternClause', function() {
  describe('#build', function() {
    patternClauseTests(() => (construct(PatternClause)()).buildQueryObject(), '');
  });
});
