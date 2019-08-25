import { Create } from './create';
import { expect } from 'chai';
import { NodePattern } from './node-pattern';

describe('Create', () => {
  describe('#build', () => {
    it('should start with CREATE', () => {
      const create = new Create(new NodePattern('node'));
      expect(create.build()).to.equal('CREATE (node)');
    });

    it('should start with CREATE UNIQUE when unique option is set to true', () => {
      const create = new Create(new NodePattern('node'), { unique: true });
      expect(create.build()).to.equal('CREATE UNIQUE (node)');
    });

    it('should not use expanded conditions', () => {
      const create = new Create(new NodePattern('node', {
        firstName: 'test',
        lastName: 'test',
      }));
      expect(create.build()).to.equal('CREATE (node $conditions)');
    });
  });
});
