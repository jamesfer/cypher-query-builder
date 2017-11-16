import { TermListStatement } from './termListStatement';
import { expect } from 'chai';

describe('TermListStatement', function() {
  describe('#build', function() {
    it('should return a single property', function() {
      let termList = new TermListStatement('node');
      expect(termList.build()).to.equal('node');
      expect(termList.getParams()).to.be.empty;
    });

    it('should return a single renamed property', function() {
      let termList = new TermListStatement({'node': 'outerNode'});
      expect(termList.build()).to.equal('node AS outerNode');
      expect(termList.getParams()).to.be.empty;
    });

    it('should prefix an array of properties with an object key', function() {
      let termList = new TermListStatement({'node': ['count', 'score', 'timestamp']});
      expect(termList.build()).to.equal('node.count, node.score, node.timestamp');
      expect(termList.getParams()).to.be.empty;
    });

    it('should rename a nested object property', function() {
      let termList = new TermListStatement({'node': ['count', { 'timestamp': 'created_at' }]});
      expect(termList.build()).to.equal('node.count, node.timestamp AS created_at');
      expect(termList.getParams()).to.be.empty;
    });

    it('should be able to apply functions to properties', function() {
      let termList = new TermListStatement('avg(node.count)');
      expect(termList.build()).to.equal('avg(node.count)');
      expect(termList.getParams()).to.be.empty;
    });

    it('should join a list of properties', function() {
      let termList = new TermListStatement(['startNode', 'rel', 'endNode']);
      expect(termList.build()).to.equal('startNode, rel, endNode');
      expect(termList.getParams()).to.be.empty;
    });

    it('should produce a complete term list', function() {
      let termList = new TermListStatement([
        ['startNode', 'anotherNode'],
        'count(rel)',
        {
          'endNode': [
            'score',
            { 'timestamp': 'created_at' }
          ],
        },
      ]);
      expect(termList.build()).to.equal('startNode, anotherNode, count(rel), endNode.score, endNode.timestamp AS created_at');
      expect(termList.getParams()).to.be.empty;
    });
  });
});
