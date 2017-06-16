const expect = require('chai').expect;

module.exports = function(makePatternString, prefix) {
  class TestClause {
    constructor(str) {
      this.str = str;
    }

    toString() {
      return this.str;
    }
  }

  it('should combine pattern sections with no delimiter', function() {
    let pattern = makePatternString([
      new TestClause('a'),
      new TestClause('b'),
      new TestClause('c'),
    ]);
    expect(pattern).to.equal(prefix + 'abc');
  });

  it('should combine multiple patterns with a comma', function() {
    let pattern = makePatternString([
      [
        new TestClause('a'),
        new TestClause('b'),
        new TestClause('c'),
      ],
      [
        new TestClause('d'),
        new TestClause('e'),
        new TestClause('f'),
      ]
    ]);
    expect(pattern).to.equal(prefix + 'abc, def');
  });
}
