import { expect } from 'chai';
import { Limit } from './limit';

describe('Limit', () => {
  describe('#build', () => {
    it('should add a produce a limit clause', () => {
      const query = new Limit(10);
      expect(query.build()).to.equal('LIMIT $limitCount');
      expect(query.getParams()).to.eql({ limitCount: 10 });
    });

    // TODO re-add in 4.0
    it.skip('should accept a string param', () => {
      const query = new Limit('toInteger(3 * 4)');
      expect(query.build()).to.equal('LIMIT toInteger(3 * 4)');
    });
  });
});
