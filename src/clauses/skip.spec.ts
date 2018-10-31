import { expect } from 'chai';
import { Skip } from './skip';

describe('Skip', () => {
  describe('#build', () => {
    it('should add a produce a skip clause', () => {
      const query = new Skip(10);
      expect(query.build()).to.equal('SKIP $skipCount');
      expect(query.getParams()).to.eql({ skipCount: 10 });
    });
  });
});
