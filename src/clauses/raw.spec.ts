import { Raw } from './raw';
import { expect } from 'chai';

describe('Raw', () => {
  it('should return the same string it is given', () => {
    const query = new Raw('ADD INDEX node.id');
    expect(query.build()).to.equal('ADD INDEX node.id');
  });

  it('should accept parameters', () => {
    const query = new Raw('SET n.id = $id', { id: 3 });
    expect(query.build()).to.equal('SET n.id = $id');
    expect(query.getParams()).to.have.property('id')
      .that.equals(3);
  });
});
