import { expect } from 'chai';
import { Limit } from './limit';

describe('Limit', () => {
  describe('#build', () => {
    it('should add a produce a limit clause', () => {
      const query = new Limit(10);
      expect(query.build()).to.equal('LIMIT 10');
    });

    it('should accept a string param', () => {
      const query = new Limit('toInteger(3 * 4)');
      expect(query.build()).to.equal('LIMIT toInteger(3 * 4)');
    });
  });
});
