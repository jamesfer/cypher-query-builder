const expect = require('chai').expect;
const patternClauseTests = require('./patternClause.tests');

module.exports = function(makeMatchString) {
  patternClauseTests(makeMatchString, 'MATCH ');

  class TestClause {
    constructor(str) {
      this.str = str;
    }

    toString() {
      return this.str;
    }
  }

  it('should prefix optional', function() {
    let match = makeMatchString([
      new TestClause('a'),
      new TestClause('b'),
      new TestClause('c'),
    ], {
      optional: true
    });
    expect(match).to.equal('OPTIONAL MATCH abc');
  });
}
