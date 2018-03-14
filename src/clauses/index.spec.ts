import { node, relation } from './index';
import { expect } from 'chai';
import { NodePattern } from './node-pattern';
import { RelationPattern } from './relation-pattern';

describe('node', () => {
  it('should create a node pattern', () => {
    const query = node('node', 'Label', { prop: 'prop' });
    expect(query).to.be.instanceOf(NodePattern);
    expect(query.build()).to.equal('(node:Label { prop: $prop })');
  });
});

describe('relation', () => {
  it('should create a relation pattern', () => {
    const query = relation('out', 'rel', 'Label', { prop: 'prop' });
    expect(query).to.be.instanceOf(RelationPattern);
    expect(query.build()).to.equal('-[rel:Label { prop: $prop }]->');
  });
});
