import { Clause } from './clause';
import { Where } from './clauses';
import { expect } from 'chai';
import { ParameterBag } from './parameter-bag';

describe('Clause', () => {
  describe('interpolate', () => {
    it('should correctly inline parameters that share a prefix', () => {
      class SpecialClause extends Clause {
        constructor(public query: string) {
          super();
        }

        build() {
          return this.query;
        }
      }

      const bag = new ParameterBag();
      bag.addParam('abc', 'param');
      bag.addParam('def', 'paramLong');

      const clause = new SpecialClause('param = $paramLong');
      clause.useParameterBag(bag);
      expect(clause.interpolate()).to.equal("param = 'def'");
    });
  });
});
