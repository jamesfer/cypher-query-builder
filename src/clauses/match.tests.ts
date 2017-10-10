import { Pattern } from './pattern';
import { patternStatementTests } from './patternStatement.tests';
import { expect } from '../../test-setup';

export function matchTests(makeMatch) {
  class TestClause extends Pattern {
    constructor(public str) {
      super('');
    }

    build() {
      return this.str;
    }
  }

  patternStatementTests(makeMatch, 'MATCH ');

  it('should prefix optional', function() {
    let match = makeMatch([
      new TestClause('a'),
      new TestClause('b'),
      new TestClause('c'),
    ], {
      optional: true
    });
    expect(match.query).to.equal('OPTIONAL MATCH abc');
    expect(match.params).to.be.empty;
  });
}
