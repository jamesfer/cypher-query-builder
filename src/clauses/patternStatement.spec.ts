import { PatternStatement } from './patternStatement';
import { NodePattern } from './node-pattern';
import { expect } from 'chai';

describe('PatternStatement', function() {
  describe('#build', function() {
    it('should accept a single pattern', function() {
      let pattern = new PatternStatement(new NodePattern('a'));
      expect(pattern.build()).to.equal('(a)');
      expect(pattern.getParams()).to.be.empty;
    });

    it('should combine pattern sections with no delimiter', function() {
      let pattern = new PatternStatement([
        new NodePattern('a'),
        new NodePattern('b'),
        new NodePattern('c'),
      ]);
      expect(pattern.build()).to.equal('(a)(b)(c)');
      expect(pattern.getParams()).to.be.empty;
    });

    it('should combine multiple patterns with a comma', function() {
      let pattern = new PatternStatement([
        [
          new NodePattern('a'),
          new NodePattern('b'),
          new NodePattern('c'),
        ],
        [
          new NodePattern('d'),
          new NodePattern('e'),
          new NodePattern('f'),
        ]
      ]);
      expect(pattern.build()).to.equal('(a)(b)(c), (d)(e)(f)');
      expect(pattern.getParams()).to.be.empty;
    });
  });
});
