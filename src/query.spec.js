const expect = require('../test-setup');
const Query = require('./query');
const nodeTests = require('./clauses/node.tests');
const matchTests = require('./clauses/match.tests');
const createTests = require('./clauses/create.tests');
const returnTests = require('./clauses/return.tests');
const { construct } = require('./utils');

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
      let { query: queryString, params } = query.buildQueryObject();
      return {
        query: queryString.substring(6, queryString.length - 1),
        params,
      };
    });
  });

  describe('#match', function() {
    matchTests(function() {
      let query = new Query();
      query.match.apply(query, arguments);
      let { query: queryString, params } = query.buildQueryObject();
      return {
        query: queryString.substring(0, queryString.length - 1),
        params,
      };
    });
  });

  describe('#createNode', function() {
    nodeTests(function() {
      let query = new Query();
      query.createNode.apply(query, arguments);
      let { query: queryString, params } = query.buildQueryObject();
      return {
        query: queryString.substring(7, queryString.length - 1),
        params,
      };
    }, false);
  });

  describe('#create', function() {
    createTests(function() {
      let query = new Query();
      query.create.apply(query, arguments);
      let { query: queryString, params } = query.buildQueryObject();
      return {
        query: queryString.substring(0, queryString.length - 1),
        params,
      };
    });
  });

  describe('#return', function() {
    returnTests(function() {
      let query = new Query();
      query.return.apply(query, arguments);
      let { query: queryString, params } = query.buildQueryObject();
      return {
        query: queryString.substring(0, queryString.length - 1),
        params,
      };
    });
  });

  describe('#run', function() {
    it('should throw if there is no attached connection object', function() {
      let query = new Query();
      expect(query.run()).to.be.rejectedWith(Error, 'no connection object available');
    });
  });
});
