import { Set } from './set';
import { expect } from 'chai';

describe('Set', () => {
  it('should add a label to a node', () => {
    const query = new Set({ labels: { node: 'Label' } });
    expect(query.build()).to.equal('SET node:Label');
  });

  it('should add multiple labels to a node', () => {
    const query = new Set({ labels: { node: ['Label1', 'Label2'] } });
    expect(query.build()).to.equal('SET node:Label1:Label2');
  });

  it('should be set labels on multiple nodes', () => {
    const query = new Set({ labels: { node1: 'Label', node2: ['Label1', 'Label2'] } });
    expect(query.build()).to.equal('SET node1:Label, node2:Label1:Label2');
  });

  it('should set a property to a variable', () => {
    const query = new Set({ variables: { 'node.prop': 'variable' } });
    expect(query.build()).to.equal('SET node.prop = variable');
  });

  it('should set multiple properties on a single node', () => {
    const query = new Set({ variables: { node: { prop1: 'variable1', prop2: 'variable2' } } });
    expect(query.build()).to.equal('SET node.prop1 = variable1, node.prop2 = variable2');
  });

  it('should set multiple properties on multiple nodes', () => {
    const variables = { node1: { prop1: 'variable1' }, node2: { prop2: 'variable2' } };
    const query = new Set({ variables });
    expect(query.build()).to.equal('SET node1.prop1 = variable1, node2.prop2 = variable2');
  });

  it('should set a property to a value', () => {
    const query = new Set({ values: { node: 'value' } });
    expect(query.build()).to.equal('SET node = $node');
    expect(query.getParams()).to.have.property('node', 'value');
  });

  it('should set multiple properties on a single node', () => {
    const param = { prop1: 'value', prop2: 'value' };
    const query = new Set({ values: { node: param } });
    expect(query.build()).to.equal('SET node = $node');
    expect(query.getParams()).to.have.property('node', param);
  });

  it('should set properties of multiple nodes', () => {
    const param1 = { prop1: 'value', prop2: 'value' };
    const param2 = { prop1: 'value', prop2: 'value' };
    const query = new Set({ values: { node: param1, node2: param2 } });
    const queryParams = query.getParams();

    expect(query.build()).to.equal('SET node = $node, node2 = $node2');
    expect(queryParams).to.have.property('node', param1);
    expect(queryParams).to.have.property('node2', param2);
  });

  it('should merge properties when merge is true', () => {
    const data = {
      values: { node: { name: 'complex value' } },
      variables: { node2: 'variable' },
    };
    const query = new Set(data, { merge: true });
    expect(query.build()).to.equal('SET node += $node, node2 += variable');
  });

  it('should not merge plain values even when merge is true', () => {
    const data = {
      values: { 'node.property': 'value', otherNode: { dictionary: 'value' } },
    };
    const query = new Set(data, { merge: true });
    expect(query.build()).to.equal('SET node.property = $nodeProperty, otherNode += $otherNode');
  });
});
