import { node, relation } from './index';
import { expect } from 'chai';
import { NodePattern } from './node-pattern';
import { RelationPattern } from './relation-pattern';

describe('node', function() {
  it('should create a node pattern', function() {
    let query = node('node', 'Label', { prop: 'prop' });
    expect(query).to.be.instanceOf(NodePattern);
    expect(query.build()).to.equal('(node:Label { prop: $prop })');
  });
});

describe('relation', function() {
  it('should create a relation pattern', function() {
    let query = relation('out', 'rel', 'Label', { prop: 'prop' });
    expect(query).to.be.instanceOf(RelationPattern);
    expect(query.build()).to.equal('-[rel:Label { prop: $prop }]->');
  });
});
