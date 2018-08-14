import { Where } from './where';
import { expect } from 'chai';
import { between } from './where-comparators';

describe('Where', () => {
  describe('#build', () => {
    it('should start with WHERE', () => {
      const query = new Where({ name: 'value' });
      expect(query.build()).to.equal('WHERE name = $name');
    });

    it('should compile with a comparator', () => {
      const query = new Where({ age: between(18, 65) });
      expect(query.build()).to.equal('WHERE age >= $lowerAge AND age <= $upperAge');
      expect(query.getParams()).to.deep.equal({
        lowerAge: 18,
        upperAge: 65,
      });
    });

    it('should not have side effects on the parameters', () => {
      const query = new Where({ age: between(18, 65) });
      const params = query.getParams();
      query.build();
      expect(query.getParams()).to.deep.equal(params);
    });
  });
});
