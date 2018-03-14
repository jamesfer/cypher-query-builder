import { PatternClause } from './pattern-clause';
import { NodePattern } from './node-pattern';
import { expect } from 'chai';

describe('PatternClauses', () => {
  describe('#build', () => {
    it('should accept a single pattern', () => {
      const pattern = new PatternClause(new NodePattern('a', []));
      expect(pattern.build()).to.equal('(a)');
      expect(pattern.getParams()).to.be.empty;
    });

    it('should combine pattern sections with no delimiter', () => {
      const pattern = new PatternClause([
        new NodePattern('a', []),
        new NodePattern('b', []),
        new NodePattern('c', []),
      ]);
      expect(pattern.build()).to.equal('(a)(b)(c)');
      expect(pattern.getParams()).to.be.empty;
    });

    it('should combine multiple patterns with a comma', () => {
      const pattern = new PatternClause([
        [
          new NodePattern('a', []),
          new NodePattern('b', []),
          new NodePattern('c', []),
        ],
        [
          new NodePattern('d', []),
          new NodePattern('e', []),
          new NodePattern('f', []),
        ],
      ]);
      expect(pattern.build()).to.equal('(a)(b)(c), (d)(e)(f)');
      expect(pattern.getParams()).to.be.empty;
    });
  });
});
