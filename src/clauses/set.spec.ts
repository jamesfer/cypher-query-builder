import { Set } from './set';
import { expect } from 'chai';

describe('Set', function() {
  it('should add a label to a node', function() {
    let query = new Set({ labels: { node: 'Label' }});
    expect(query.build()).to.equal('SET node:Label');
  });

  it('should add multiple labels to a node', function() {
    let query = new Set({ labels: { node: [ 'Label1', 'Label2' ]}});
    expect(query.build()).to.equal('SET node:Label1:Label2');
  });

  it('should be set labels on multiple nodes', function() {
    let query = new Set({ labels: { node1: 'Label', node2: [ 'Label1', 'Label2' ]}});
    expect(query.build()).to.equal('SET node1:Label, node2:Label1:Label2');
  });

  it('should set a property to a variable', function() {
    let query = new Set({ variables: { 'node.prop': 'variable'}});
    expect(query.build()).to.equal('SET node.prop = variable');
  });

  it('should set multiple properties on a single node', function() {
    let query = new Set({ variables: { node: { prop1: 'variable1', prop2: 'variable2' }}});
    expect(query.build()).to.equal('SET node.prop1 = variable1, node.prop2 = variable2');
  });

  it('should set multiple properties on multiple nodes', function() {
    let query = new Set({ variables: { node1: { prop1: 'variable1' }, node2: { prop2: 'variable2' }}});
    expect(query.build()).to.equal('SET node1.prop1 = variable1, node2.prop2 = variable2');
  });

  it('should set a property to a value', function() {
    let query = new Set({ values: { node: 'value' }});
    expect(query.build()).to.equal('SET node = $node');
    expect(query.getParams()).to.have.property('node', 'value');
  });

  it('should set multiple properties on a single node', function() {
    let param = { prop1: 'value', prop2: 'value' };
    let query = new Set({ values: { node: param }});
    expect(query.build()).to.equal('SET node = $node');
    expect(query.getParams()).to.have.property('node', param);
  });

  it('should set properties of multiple nodes', function() {
    let param1 = { prop1: 'value', prop2: 'value' };
    let param2 = { prop1: 'value', prop2: 'value' };
    let query = new Set({ values: { node: param1, node2: param2 }});
    expect(query.build()).to.equal('SET node = $node, node2 = $node2');
    let params = query.getParams();
    expect(params).to.have.property('node', param1)
    expect(params).to.have.property('node2', param2);
  });

  it('should merge properties when override is false', function() {
    let query = new Set({
      values: { node: 'value' },
      variables: { node2: 'variable' }
    }, { override: false });
    expect(query.build()).to.equal('SET node += $node, node2 += variable');
  });
});
