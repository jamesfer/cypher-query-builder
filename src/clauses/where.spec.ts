import { Where } from './where';
import { expect } from 'chai';

describe('Where', () => {
  describe('#build', () => {
    it('should start with WHERE', () => {
      const query = new Where({ name: 'value' });
      expect(query.build()).to.equal('WHERE name = $name');
    });
  });
});
