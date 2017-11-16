import { expect } from 'chai';
import { Limit } from './limit';

describe('Limit', function() {
  describe('#build', function() {
    it('should add a produce a limit clause', function() {
      let query = new Limit(10);
      expect(query.build()).to.equal('LIMIT 10');
    });

    it('should accept a string param', function() {
      let query = new Limit('toInteger(3 * 4)');
      expect(query.build()).to.equal('LIMIT toInteger(3 * 4)');
    });
  });
});
