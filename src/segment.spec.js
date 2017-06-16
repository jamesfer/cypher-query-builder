const expect = require('chai').expect;
const Segment = require('./segment');

describe('Segment', function() {
  describe('#constructor', function() {
    it('should default to an empty clause list', function() {
      let segment = new Segment();
      expect(segment.clauses).to.eql([]);
    });

    it('should set the internal clause array to the given parameter', function() {
      let clauses = ['a', 'b', 'c'];
      let segment = new Segment(clauses);
      expect(segment.clauses).to.equal(clauses);
    });
  });

  describe('#addClause', function() {
    it('should add a clause to the internal list', function() {
      let segment = new Segment();
      expect(segment.clauses).to.eql([]);
      segment.addClause('a');
      expect(segment.clauses).to.eql(['a']);
    });
  });

  describe('#toString', function() {
    it('should join the clauses together with a newline', function() {
      class TestClause {
        constructor(str) {
          this.str = str;
        }

        toString() {
          return this.str;
        }
      }

      let segment = new Segment([
        new TestClause('a'),
        new TestClause('b'),
        new TestClause('c'),
      ]);
      expect(segment.toString()).to.equal('a\nb\nc');
    });
  });
});
