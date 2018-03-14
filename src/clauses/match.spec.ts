import { Match } from './match';
import { NodePattern } from './node-pattern';
import { expect } from 'chai';

describe('Match', () => {
  describe('#build', () => {
    it('should start with MATCH', () => {
      const create = new Match(new NodePattern('node'));
      expect(create.build()).to.equal('MATCH (node)');
    });

    it('should start with OPTIONAL MATCH if optional is true', () => {
      const create = new Match(new NodePattern('node'), { optional: true });
      expect(create.build()).to.equal('OPTIONAL MATCH (node)');
    });

    it('should use expanded conditions', () => {
      const create = new Match(new NodePattern('node', {
        firstName: 'test',
        lastName: 'test',
      }));
      const clauseString = 'MATCH (node { firstName: $firstName, lastName: $lastName })';
      expect(create.build()).to.equal(clauseString);
    });
  });
});
