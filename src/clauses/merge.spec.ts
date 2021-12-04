import { Merge } from './merge';
import { NodePattern } from '../patterns/node-pattern';
import { expect } from 'chai';

describe('Merge', () => {
  describe('#build', () => {
    it('should start with MERGE', () => {
      const create = new Merge(new NodePattern('node'));
      expect(create.build()).to.equal('MERGE (node)');
    });

    it('should use expanded conditions', () => {
      const params = {
        firstName: 'test',
        lastName: 'test',
      };
      const create = new Merge(new NodePattern('node', params));
      const clauseString = 'MERGE (node { firstName: $firstName, lastName: $lastName })';
      expect(create.build()).to.equal(clauseString);
      expect(create.getParams()).to.deep.equal(params);
    });
  });
});
