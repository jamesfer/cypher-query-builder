import { TermListClause } from './term-list-clause';
import { expect } from 'chai';

describe('TermListClause', () => {
  describe('#build', () => {
    it('should return a single property', () => {
      const termList = new TermListClause('node');
      expect(termList.build()).to.equal('node');
      expect(termList.getParams()).to.be.empty;
    });

    it('should return a single renamed property', () => {
      const termList = new TermListClause({ node: 'outerNode' });
      expect(termList.build()).to.equal('node AS outerNode');
      expect(termList.getParams()).to.be.empty;
    });

    it('should prefix an array of properties with an object key', () => {
      const termList = new TermListClause({ node: ['count', 'score', 'timestamp'] });
      expect(termList.build()).to.equal('node.count, node.score, node.timestamp');
      expect(termList.getParams()).to.be.empty;
    });

    it('should rename a nested object property', () => {
      const termList = new TermListClause({ node: ['count', { timestamp: 'created_at' }] });
      expect(termList.build()).to.equal('node.count, node.timestamp AS created_at');
      expect(termList.getParams()).to.be.empty;
    });

    it('should rename a single nested object property', () => {
      const termList = new TermListClause({ node: { name: 'otherName', timestamp: 'created_at' } });
      expect(termList.build()).to.equal('node.name AS otherName, node.timestamp AS created_at');
      expect(termList.getParams()).to.be.empty;
    });

    it('should be able to apply functions to properties', () => {
      const termList = new TermListClause('avg(node.count)');
      expect(termList.build()).to.equal('avg(node.count)');
      expect(termList.getParams()).to.be.empty;
    });

    it('should join a list of properties', () => {
      const termList = new TermListClause(['startNode', 'rel', 'endNode']);
      expect(termList.build()).to.equal('startNode, rel, endNode');
      expect(termList.getParams()).to.be.empty;
    });

    it('should produce a complete term list', () => {
      const termList = new TermListClause([
        'startNode',
        'count(rel)',
        {
          endNode: [
            'score',
            { timestamp: 'created_at' },
          ],
        },
      ]);
      expect(termList.build()).to
        .equal('startNode, count(rel), endNode.score, endNode.timestamp AS created_at');
      expect(termList.getParams()).to.be.empty;
    });
  });
});
