import { expect } from 'chai';
import { Skip } from './skip';

describe('Skip', () => {
  describe('#build', () => {
    it('should add a produce a skip clause', () => {
      const query = new Skip(10);
      expect(query.build()).to.equal('SKIP 10');
    });

    it('should accept a string param', () => {
      const query = new Skip('toInteger(3 * 4)');
      expect(query.build()).to.equal('SKIP toInteger(3 * 4)');
    });
  });
});
