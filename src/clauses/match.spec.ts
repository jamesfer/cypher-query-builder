import { Match } from './match';
import { NodePattern } from './node-pattern';
import { expect } from 'chai';

describe('Match', function() {
  describe('#build', function() {
    it('should start with MATCH', function() {
      const create = new Match(new NodePattern('node', []));
      expect(create.build()).to.equal('MATCH (node)');
    });

    it('should start with OPTIONAL MATCH if optional is true', function() {
      const create = new Match(new NodePattern('node', []), { optional: true });
      expect(create.build()).to.equal('OPTIONAL MATCH (node)');
    });

    it('should use expanded conditions', function() {
      const create = new Match(new NodePattern('node', [], {
        firstName: 'test',
        lastName: 'test',
      }));
      expect(create.build()).to.equal('MATCH (node { firstName: $firstName, lastName: $lastName })');
    });
  });
});
