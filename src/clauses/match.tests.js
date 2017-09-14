const expect = require('chai').expect;
const Pattern = require('./pattern');
const patternStatementTests = require('./patternStatement.tests');

module.exports = function(makeMatch) {
  class TestClause extends Pattern {
    constructor(str) {
      super('');
      this.str = str;
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
