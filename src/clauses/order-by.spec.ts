import { OrderBy } from './order-by';
import { expect } from 'chai';

describe('OrderBy', function() {
  it('should start with ORDER BY', function() {
    let query = new OrderBy('node.prop');
    expect(query.build()).to.equal('ORDER BY node.prop');
  });

  it('should support a direction arg', function() {
    let query = new OrderBy('node.prop', 'DESC');
    expect(query.build()).to.equal('ORDER BY node.prop DESC');
    query = new OrderBy('node.prop', 'ASC');
    expect(query.build()).to.equal('ORDER BY node.prop ASC');
  });

  it('should support multiple order columns', function() {
    let query = new OrderBy(['node.prop1', 'node.prop2']);
    expect(query.build()).to.equal('ORDER BY node.prop1, node.prop2');
  });

  it('should support multiple order columns with a default direction', function() {
    let query = new OrderBy(['node.prop1', 'node.prop2'], 'DESC');
    expect(query.build()).to.equal('ORDER BY node.prop1 DESC, node.prop2 DESC');
  });

  it('should support multiple order columns with directions', function() {
    let query = new OrderBy({
      'node.prop1': 'DESC',
      'node.prop2': 'ASC'
    });
    expect(query.build()).to.equal('ORDER BY node.prop1 DESC, node.prop2 ASC');
  });
});
