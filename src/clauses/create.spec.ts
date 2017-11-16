import { Create } from './create';
import { expect } from 'chai';
import { NodePattern } from './node-pattern';

describe('Create', function() {
  describe('#build', function() {
    it('should start with CREATE', function() {
      const create = new Create(new NodePattern('node'));
      expect(create.build()).to.equal('CREATE (node)');
    });

    it('should not use expanded conditions', function() {
      const create = new Create(new NodePattern('node', [], {
        firstName: 'test',
        lastName: 'test',
      }));
      expect(create.build()).to.equal('CREATE (node $conditions)');
    });
  });
});
