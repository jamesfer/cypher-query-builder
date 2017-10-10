import { construct } from '../utils';
import { TermListStatement } from './termListStatement';
import { termListStatementTests } from './termListStatement.tests';

describe('TermListStatement', function() {
  describe('#build', function() {
    termListStatementTests(construct(TermListStatement, s => s.buildQueryObject()), '');
  });
});
