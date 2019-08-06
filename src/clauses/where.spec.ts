import { Where } from './where';
import { expect } from 'chai';
import { between, lessThan } from './where-comparators';
import { Query } from '../query';
import { node } from './index';

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

    it('should not produce duplicate parameter names', () => {
      const nodePattern = node('person', 'Person', { id: 1 });
      const query = new Query().match([nodePattern])
        .where({ id: lessThan(10) });
      const { params, query: queryString } = query.buildQueryObject();
      expect(queryString).to.equal(`MATCH ${nodePattern.toString()}\nWHERE id < $id2;`);
      expect(params).to.deep.equal({
        id: 1,
        id2: 10,
      });
    });

    it('should compile with a regular expression', () => {
      const query = new Where({ name: /[A-Z].*son/ });
      expect(query.build()).to.equal('WHERE name =~ $name');
      expect(query.getParams()).to.deep.equal({
        name: '[A-Z].*son',
      });
    });

    it('should compile with a regular expression with flags', () => {
      const query = new Where({ name: /.*son/i });
      expect(query.build()).to.equal('WHERE name =~ $name');
      expect(query.getParams()).to.deep.equal({
        name: '.*son',
      });
    });
  });
});
