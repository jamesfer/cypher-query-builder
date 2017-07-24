const _ = require('lodash');
const expect = require('chai').expect;

module.exports = function(makePattern, prefix) {
  class TestStatement {
    constructor(query, params= {}) {
      this.query = query;
      this.params = params;
    }

    build() {
      return {
        query: this.query,
        params: this.params,
      }
    }
  }

  it('should combine pattern sections with no delimiter', function() {
    let pattern = makePattern([
      new TestStatement('a'),
      new TestStatement('b'),
      new TestStatement('c'),
    ]);
    expect(pattern.query).to.equal(prefix + 'abc');
    expect(pattern.params).to.be.empty;
  });

  it('should combine multiple patterns with a comma', function() {
    let pattern = makePattern([
      [
        new TestStatement('a'),
        new TestStatement('b'),
        new TestStatement('c'),
      ],
      [
        new TestStatement('d'),
        new TestStatement('e'),
        new TestStatement('f'),
      ]
    ]);
    expect(pattern.query).to.equal(prefix + 'abc, def');
    expect(pattern.params).to.be.empty;
  });

  it('should merge param objects of child patterns', function() {
    let pattern = makePattern([
      [
        new TestStatement('a', {a: 'valueA'}),
        new TestStatement('b', {b: 'valueB'}),
        new TestStatement('c', {c: 'valueC'}),
      ],
      [
        new TestStatement('d', {d: 'valueD'}),
        new TestStatement('e', {e: 'valueE'}),
        new TestStatement('f', {f: 'valueF'}),
      ]
    ]);
    expect(_.keys(pattern.params)).to.have.length(6);
    _.each(['valueA', 'valueB', 'valueC', 'valueD', 'valueE', 'valueF'], val => {
      expect(_.values(pattern.params)).to.contain(val);
    });
  });
}
