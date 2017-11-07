import { Pattern } from './pattern';
import { expect } from '../../test-setup';

export function patternStatementTests(makePattern, prefix) {
  class TestStatement extends Pattern {
    constructor(
      public query: string,
      public params = {}
    ) {
      super('');
    }

    build() {
      return this.query;
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
}
