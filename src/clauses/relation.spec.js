const expect = require('chai').expect;
const Relation = require('./relation');

describe('Relation', function() {
  describe('#build', function() {
    it('should build a relation pattern directed inwards', function() {
      let rel = new Relation('in');
      let relString = rel.build();

      expect(relString.query).to.equal('<-[]-');
    });

    it('should build a relation pattern directed outwards', function() {
      let rel = new Relation('out');
      let relString = rel.build();

      expect(relString.query).to.equal('-[]->');
    });

    it('should build a relation pattern that is directionless', function() {
      let rel = new Relation('either');
      let relString = rel.build();

      expect(relString.query).to.equal('-[]-');
    });

    it('should build a relation pattern with a variable name', function() {
      let rel = new Relation('in', 'link');
      let relString = rel.build();

      expect(relString.query).to.equal('<-[link]-');
    });

    it('should build a relation pattern with a label', function() {
      let rel = new Relation('in', '', 'FriendsWith');
      let relString = rel.build();

      expect(relString.query).to.equal('<-[:FriendsWith]-');
    });

    it('should build a relation pattern with multiple labels', function() {
      let rel = new Relation('in', '', ['FriendsWith', 'WorksWith']);
      let relString = rel.build();

      expect(relString.query).to.equal('<-[:FriendsWith:WorksWith]-');
    });

    it.skip('should build a relation pattern with conditions', function() {
      let rel = new Relation('out', '', [], {recent: true, years: 7});
      let relString = rel.build();

      expect(relString.query).to.equal('-[{recent: true, years: 7}]->');
    });

    it('should build a relation pattern with flexible length', function() {
      let any = new Relation('out', '', [], {}, '*');
      let exact = new Relation('out', '', [], {}, 3);
      let minBound = new Relation('out', '', [], {}, [2]);
      let bothBounds = new Relation('out', '', [], {}, [2, 7]);

      expect(any.build().query).to.equal('-[*]->');
      expect(exact.build().query).to.equal('-[*3]->');
      expect(minBound.build().query).to.equal('-[*2..]->');
      expect(bothBounds.build().query).to.equal('-[*2..7]->');
    });

    it.skip('should build a complete relation pattern', function() {
      let rel = new Relation('either', 'f', ['FriendsWith', 'WorksWith'], {recent: true, years: 7}, [2, 3]);
      let relObj = rel.build();

      expect(relObj.query).to.equal('-[f:FriendsWith:WorksWith*2..3 {recent: true, years: 7}]-');
    });
  });
});
