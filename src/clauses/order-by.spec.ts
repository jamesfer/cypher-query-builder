import { OrderBy } from './order-by';
import { expect } from 'chai';

describe('OrderBy', () => {
  it('should start with ORDER BY', () => {
    const query = new OrderBy('node.prop');
    expect(query.build()).to.equal('ORDER BY node.prop');
  });

  it('should support a direction arg', () => {
    let query = new OrderBy('node.prop', 'DESC');
    expect(query.build()).to.equal('ORDER BY node.prop DESC');
    query = new OrderBy('node.prop', 'DESCENDING');
    expect(query.build()).to.equal('ORDER BY node.prop DESC');
    query = new OrderBy('node.prop', 'ASC');
    expect(query.build()).to.equal('ORDER BY node.prop');
    query = new OrderBy('node.prop', 'ASCENDING');
    expect(query.build()).to.equal('ORDER BY node.prop');
  });

  it('should support a case-insensitive direction arg', () => {
    let query = new OrderBy('node.prop', 'desc');
    expect(query.build()).to.equal('ORDER BY node.prop DESC');
    query = new OrderBy('node.prop', 'descending');
    expect(query.build()).to.equal('ORDER BY node.prop DESC');
    query = new OrderBy('node.prop', 'asc');
    expect(query.build()).to.equal('ORDER BY node.prop');
    query = new OrderBy('node.prop', 'ascending');
    expect(query.build()).to.equal('ORDER BY node.prop');
  });

  it('should support a boolean direction arg', () => {
    let query = new OrderBy('node.prop', false);
    expect(query.build()).to.equal('ORDER BY node.prop');
    query = new OrderBy('node.prop', true);
    expect(query.build()).to.equal('ORDER BY node.prop DESC');
  });

  it('should support null and undefined as directions', () => {
    let query = new OrderBy('node.prop', null);
    expect(query.build()).to.equal('ORDER BY node.prop');
    query = new OrderBy('node.prop', undefined);
    expect(query.build()).to.equal('ORDER BY node.prop');
  });

  it('should support multiple order columns', () => {
    const query = new OrderBy(['node.prop1', 'node.prop2']);
    expect(query.build()).to.equal('ORDER BY node.prop1, node.prop2');
  });

  it('should support multiple order columns with a default direction', () => {
    const query = new OrderBy(['node.prop1', 'node.prop2'], 'DESC');
    expect(query.build()).to.equal('ORDER BY node.prop1 DESC, node.prop2 DESC');
  });

  it('should support multiple order columns with directions', () => {
    const query = new OrderBy({
      'node.prop1': 'DESC',
      'node.prop2': 'ASC',
      'node.prop3': true,
    });
    expect(query.build()).to.equal('ORDER BY node.prop1 DESC, node.prop2, node.prop3 DESC');
  });

  it('should support multiple order columns with directions using the array syntax', () => {
    const query = new OrderBy([
      ['node.prop1', 'DESC'],
      'node.prop2',
      ['node.prop3', true],
    ]);
    expect(query.build()).to.equal('ORDER BY node.prop1 DESC, node.prop2, node.prop3 DESC');
  });
});
