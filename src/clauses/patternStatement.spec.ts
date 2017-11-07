import { patternStatementTests } from './patternStatement.tests';
import { construct } from '../utils';
import { PatternStatement } from './patternStatement';

describe('PatternStatement', function() {
  describe('#build', function() {
    patternStatementTests(construct(PatternStatement, s => s.buildQueryObject()), '');
  });
});
