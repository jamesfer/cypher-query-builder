import { keys, values } from 'lodash';
import { RelationPattern } from './relation-pattern';
import { expect } from '../../test-setup';

describe('Relation', () => {
  describe('#build', () => {
    it('should build a relation pattern directed inwards', () => {
      const rel = new RelationPattern('in');
      const queryObj = rel.buildQueryObject();

      expect(queryObj.query).to.equal('<--');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a relation pattern directed outwards', () => {
      const rel = new RelationPattern('out');
      const queryObj = rel.buildQueryObject();

      expect(queryObj.query).to.equal('-->');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a relation pattern that is directionless', () => {
      const rel = new RelationPattern('either');
      const queryObj = rel.buildQueryObject();

      expect(queryObj.query).to.equal('--');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a relation pattern with a variable name', () => {
      const rel = new RelationPattern('in', 'link');
      const queryObj = rel.buildQueryObject();

      expect(queryObj.query).to.equal('<-[link]-');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a relation pattern with a label', () => {
      const rel = new RelationPattern('in', 'link', 'FriendsWith');
      const queryObj = rel.buildQueryObject();

      expect(queryObj.query).to.equal('<-[link:FriendsWith]-');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a relation pattern with multiple labels', () => {
      const rel = new RelationPattern('in', ['FriendsWith', 'WorksWith']);
      const queryObj = rel.buildQueryObject();

      expect(queryObj.query).to.equal('<-[:FriendsWith|WorksWith]-');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a relation pattern with conditions', () => {
      const rel = new RelationPattern('out', { recent: true, years: 7 });
      const queryObj = rel.buildQueryObject();

      expect(queryObj.query).to.equal('-[{ recent: $recent, years: $years }]->');
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members([true, 7]);
    });

    it('should build a relation pattern with path length', () => {
      [
        [4, '*4'],
        [[2, 4], '*2..4'],
        ['*', '*'],
        [[2, null], '*2..'],
      ].forEach(([length, expected]) => {
        const rel = new RelationPattern('out', length);
        const queryObj = rel.buildQueryObject();

        expect(queryObj.query).to.equal(`-[${expected}]->`);
        expect(queryObj.params).to.be.empty;
      });
    });

    it('should build a relation pattern with an empty label list', () => {
      const rel = new RelationPattern('in', []);
      const queryObj = rel.buildQueryObject();

      expect(queryObj.query).to.equal('<--');
      expect(queryObj.params).to.be.empty;
    });

    it('should build a relation pattern with a name and conditions', () => {
      const rel = new RelationPattern('out', 'link', { recent: true, years: 7 });
      const queryObj = rel.buildQueryObject();

      expect(queryObj.query).to.equal('-[link { recent: $recent, years: $years }]->');
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members([true, 7]);
    });

    it('should build a relation pattern with labels and conditions', () => {
      const rel = new RelationPattern('out', ['FriendsWith'], { recent: true, years: 7 });
      const queryObj = rel.buildQueryObject();

      expect(queryObj.query).to.equal('-[:FriendsWith { recent: $recent, years: $years }]->');
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members([true, 7]);
    });

    it('should build a relation pattern with flexible length', () => {
      const any = new RelationPattern('out', '', [], {}, '*');
      const exact = new RelationPattern('out', '', [], {}, 3);
      const minBound = new RelationPattern('out', '', [], {}, [2]);
      const bothBounds = new RelationPattern('out', '', [], {}, [2, 7]);

      expect(any.buildQueryObject().query).to.equal('-[*]->');
      expect(exact.buildQueryObject().query).to.equal('-[*3]->');
      expect(minBound.buildQueryObject().query).to.equal('-[*2..]->');
      expect(bothBounds.buildQueryObject().query).to.equal('-[*2..7]->');
    });

    it('should build a complete relation pattern', () => {
      const labels = ['FriendsWith', 'WorksWith'];
      const conditions = { recent: true, years: 7 };
      const rel = new RelationPattern('either', 'f', labels, conditions, [2, 3]);
      const queryObj = rel.buildQueryObject();

      const relation = '-[f:FriendsWith|WorksWith*2..3 { recent: $recent, years: $years }]-';
      expect(queryObj.query).to.equal(relation);
      expect(keys(queryObj.params)).to.have.length(2);
      expect(values(queryObj.params)).to.have.members([true, 7]);
    });
  });
});
