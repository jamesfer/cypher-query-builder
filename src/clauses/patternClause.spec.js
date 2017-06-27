const PatternClause = require('./patternClause');
const patternClauseTests = require('./patternClause.tests');

describe('PatternClause', function() {
  describe('#build', function() {
    patternClauseTests(function() {
      let args = [PatternClause];
      args.push.apply(args, arguments);
      let pattern =  new (PatternClause.bind.apply(PatternClause, args))();
      return pattern.build();
    }, '');
  });
});
