const expect = require('chai').expect;
const Query = require('./query');
const nodeTests = require('./clauses/node.tests');
const matchTests = require('./clauses/match.tests');

describe('Query', function() {
  class TestSegment {
    constructor(str) {
      this.str = str;
    }

    toString() {
      return this.str;
    }
  }

  describe('#toString', function() {
    it('should join each of the segments with new lines', function() {
      let query = new Query([
        new TestSegment('a'),
        new TestSegment('b'),
        new TestSegment('c')
      ]);
      expect(query.toString()).to.equal('a\nb\nc');
    });
  });

  // describe('#addClause', function() {
  //   it('should append a new clause to the end of the list', function() {
  //     let query = new Query([
  //       new TestSegment('a'),
  //       new TestSegment('b'),
  //       new TestSegment('c')
  //     ]);
  //     expect(query.toString()).to.equal('a\nb\nc');
  //   });
  // });


  describe('#matchNode', function() {
    nodeTests(function() {
      let query = new Query();
      query.matchNode.apply(query, arguments);
      return query.toString().substring(6);
    });
  });

  describe('#match', function() {
    matchTests(function() {
      let query = new Query();
      query.match.apply(query, arguments);
      return query.toString();
    });
  });
});
