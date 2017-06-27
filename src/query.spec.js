const expect = require('../test-setup');
const Query = require('./query');
const nodeTests = require('./clauses/node.tests');
const matchTests = require('./clauses/match.tests');
const createTests = require('./clauses/create.tests');
const returnTests = require('./clauses/return.tests');

describe('Query', function() {
  class TestSegment {
    constructor(str) {
      this.str = str;
    }

    toString() {
      return this.str;
    }
  }

  describe('#matchNode', function() {
    nodeTests(function() {
      let query = new Query();
      query.matchNode.apply(query, arguments);
      let queryObj = query.build();
      queryObj.query = queryObj.query.substring(6);
      return queryObj;
    });
  });

  describe('#match', function() {
    matchTests(function() {
      let query = new Query();
      query.match.apply(query, arguments);
      return query.build();
    });
  });

  describe('#createNode', function() {
    nodeTests(function() {
      let query = new Query();
      query.createNode.apply(query, arguments);
      let queryObj = query.build();
      queryObj.query = queryObj.query.substring(7);
      return queryObj;
    });
  });

  describe('#create', function() {
    createTests(function() {
      let query = new Query();
      query.create.apply(query, arguments);
      return query.build();
    });
  });

  describe('#ret', function() {
    returnTests(function() {
      let query = new Query();
      query.ret.apply(query, arguments);
      return query.build();
    });
  });

  describe('#run', function() {
    it('should throw if there is no attached connection object', function() {
      let query = new Query();
      expect(query.run()).to.be.rejectedWith(Error, 'no connection object available');
    });
  });

  // describe.skip('#toString', function() {
  //   it('should join each of the segments with new lines', function() {
  //     let query = new Query([
  //       new TestSegment('a'),
  //       new TestSegment('b'),
  //       new TestSegment('c')
  //     ]);
  //     expect(query.toString()).to.equal('a\nb\nc');
  //   });
  // });

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



});
