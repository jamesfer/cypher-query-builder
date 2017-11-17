import { Where } from './where';
import { expect } from 'chai';

describe('Where', function() {
  describe('#build', function() {
    it('should start with WHERE', function() {
      let query = new Where({ name: 'value' });
      expect(query.build()).to.equal('WHERE name = $name');
    });
  });
});
