const expect = require('../test-setup');
const Query = require('./query');
const nodeTests = require('./clauses/node.tests');
const matchTests = require('./clauses/match.tests');
const createTests = require('./clauses/create.tests');
const returnTests = require('./clauses/return.tests');

describe('Query', function() {
  function makeQuery(builder, start = 0, end = 0) {
    let queryObj = builder(new Query()).buildQueryObject();
    if (end <= 0) {
      end += queryObj.query.length;
    }
    return {
      query: queryObj.query.substring(start, end),
      params: queryObj.params,
    };
  }

  describe('#matchNode', function() {
    nodeTests((...args) => makeQuery(q => q.matchNode(...args), 6, -1));
  });

  describe('#match', function() {
    matchTests((...args) => makeQuery(q => q.match(...args), 0, -1));
  });

  describe('#createNode', function() {
    nodeTests((...args) => makeQuery(q => q.createNode(...args), 7, -1), false);
  });

  describe('#create', function() {
    createTests((...args) => makeQuery(q => q.create(...args), 0, -1));
  });

  describe('#return', function() {
    returnTests((...args) => makeQuery(q => q.return(...args), 0, -1));
  });

  describe('#run', function() {
    it('should throw if there is no attached connection object', function() {
      let query = new Query();
      expect(query.run()).to.be.rejectedWith(Error, 'no connection object available');
    });
  });
});
