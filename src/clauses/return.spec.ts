import { Return } from './return';
import { expect } from 'chai';

describe('Return', () => {
  describe('#build', () => {
    it('should start with RETURN', () => {
      const query = new Return('node');
      expect(query.build()).to.equal('RETURN node');
    });
  });
});
