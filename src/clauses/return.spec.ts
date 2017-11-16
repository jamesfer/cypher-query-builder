import { Return } from './return';
import { expect } from 'chai';

describe('Return', function() {
  describe('#build', function() {
    it('should start with RETURN', function() {
      let query = new Return('node');
      expect(query.build()).to.equal('RETURN node');
    });
  });
});
