const expect = require('chai').expect;
const patternClauseTests = require('./patternClause.tests');

module.exports = function(makeMatch) {
  class TestClause {
    constructor(str) {
      this.str = str;
    }

    build() {
      return {
        query: this.str,
        params: {}
      };
    }
  }

  patternClauseTests(makeMatch, 'MATCH ');

  it('should prefix optional', function() {
    let match = makeMatch([
      new TestClause('a'),
      new TestClause('b'),
      new TestClause('c'),
    ], {
      optional: true
    });
    expect(match.query).to.equal('OPTIONAL MATCH abc');
  });
}
